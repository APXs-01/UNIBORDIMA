const Listing = require('../models/Listing');
const cloudinary = require('../config/cloudinary');
const fs = require('fs').promises;

// @desc    Get all listings with filters
// @route   GET /api/listings
// @access  Public
exports.getAllListings = async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      maxDistance,
      roomType,
      gender,
      status = 'available',
      sort = '-createdAt',
      page = 1,
      limit = 12
    } = req.query;

    let query = { status };

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

   // Distance filter
    if (maxDistance) {
        query.distance = { $lte: Number(maxDistance) };
    }

    // Room type filter
    if (roomType) {
      query.roomType = roomType;
    }

    // Gender filter
    if (gender) {
      query.gender = gender;
    }

    const skip = (page - 1) * limit;

    const listings = await Listing.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'username');

    const total = await Listing.countDocuments(query);

    res.json({
      success: true,
      count: listings.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      listings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search listings
// @route   GET /api/listings/search
// @access  Public
exports.searchListings = async (req, res) => {
  try {
    const { q } = req.query;

    const listings = await Listing.find({
      $text: { $search: q },
      status: 'available'
    }).sort({ score: { $meta: 'textScore' } });

    res.json({ success: true, count: listings.length, listings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate({
        path: 'reviews',
        populate: {
          path: 'student',
          select: 'firstName lastName profilePicture'
        }
      });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private/Admin
exports.createListing = async (req, res) => {
  try {
    // Upload images to Cloudinary
    const imageUploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, {
        folder: 'unibordima/listings',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' }
        ]
      })
    );

    const imageResults = await Promise.all(imageUploadPromises);
    const images = imageResults.map(result => ({
      url: result.secure_url,
      publicId: result.public_id
    }));

    // Delete local files
    await Promise.all(req.files.map(file => fs.unlink(file.path)));

    const listing = await Listing.create({
      ...req.body,
      images,
      createdBy: req.user.id,
      location: {
        ...req.body.location,
        coordinates: {
          lat: parseFloat(req.body.location.coordinates.lat),
          lng: parseFloat(req.body.location.coordinates.lng)
        }
      }
    });

    res.status(201).json({ success: true, listing });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private/Admin
exports.updateListing = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      const deletePromises = listing.images.map(image =>
        cloudinary.uploader.destroy(image.publicId)
      );
      await Promise.all(deletePromises);

      // Upload new images
      const imageUploadPromises = req.files.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: 'unibordima/listings',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' }
          ]
        })
      );

      const imageResults = await Promise.all(imageUploadPromises);
      req.body.images = imageResults.map(result => ({
        url: result.secure_url,
        publicId: result.public_id
      }));

      // Delete local files
      await Promise.all(req.files.map(file => fs.unlink(file.path)));
    }

    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, listing });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private/Admin
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Delete images from Cloudinary
    const deletePromises = listing.images.map(image =>
      cloudinary.uploader.destroy(image.publicId)
    );
    await Promise.all(deletePromises);

    await listing.remove();

    res.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};