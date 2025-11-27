const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (student) => {
  return jwt.sign(
    { id: student._id, role: 'student' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register student
// @route   POST /api/students/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      university,
      studentId,
      phoneNumber
    } = req.body;

    // Check if student exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create student
    const student = await Student.create({
      firstName,
      lastName,
      email,
      password,
      university,
      studentId,
      phoneNumber
    });

    // Generate token
    const token = generateToken(student);

    res.status(201).json({
      success: true,
      token,
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        university: student.university
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login student
// @route   POST /api/students/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for student
    const student = await Student.findOne({ email }).select('+password');
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(student);

    res.json({
      success: true,
      token,
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        university: student.university
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current student
// @route   GET /api/students/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate('savedListings');
    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      university: req.body.university
    };

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save listing
// @route   POST /api/students/saved-listings/:listingId
// @access  Private
exports.saveListing = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    
    if (student.savedListings.includes(req.params.listingId)) {
      return res.status(400).json({ message: 'Listing already saved' });
    }

    student.savedListings.push(req.params.listingId);
    await student.save();

    res.json({ success: true, message: 'Listing saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove saved listing
// @route   DELETE /api/students/saved-listings/:listingId
// @access  Private
exports.removeSavedListing = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    student.savedListings = student.savedListings.filter(
      id => id.toString() !== req.params.listingId
    );
    await student.save();

    res.json({ success: true, message: 'Listing removed from saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};