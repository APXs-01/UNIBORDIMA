import AnimatedPage from '../components/common/AnimatedPage';
import { motion } from 'framer-motion';
import { FiCheck, FiMail, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const ListWithUs = () => {
  const steps = [
    {
      number: '01',
      title: 'Prepare Your Information',
      description:
        'Gather details about your boarding place including photos, price, location coordinates, amenities, and house rules.',
    },
    {
      number: '02',
      title: 'Contact Our Team',
      description:
        'Reach out to us via WhatsApp, phone, or email with your boarding details and photos.',
    },
    {
      number: '03',
      title: 'We List Your Property',
      description:
        'Our admin team will create a professional listing for your property on our platform.',
    },
    {
      number: '04',
      title: 'Connect with Students',
      description:
        'Students will contact you directly via WhatsApp or phone when interested in your boarding.',
    },
  ];

  const benefits = [
    'Reach thousands of university students',
    'Free listing service',
    'Verified and professional listings',
    'Direct student contact',
    'Detailed property showcase with photos',
    'Location visibility on maps',
  ];

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              List Your Boarding with Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Reach thousands of university students looking for quality boarding
              accommodations
            </motion.p>
          </div>

          {/* Benefits Grid */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why List With UniBordima?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="text-5xl font-bold text-primary-100 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl shadow-xl p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-primary-100">
                Contact us today to list your boarding property
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              
              {/* FIXED: Added missing <a> tag */}
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-gray-900 rounded-xl p-6 hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaWhatsapp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">WhatsApp</h3>
                <p className="text-sm text-gray-600">+94 77 123 4567</p>
              </a>

              {/* FIXED: Added missing <a> tag */}
              <a
                href="tel:+94771234567"
                className="bg-white text-gray-900 rounded-xl p-6 hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPhone className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-sm text-gray-600">+94 77 123 4567</p>
              </a>

              {/* FIXED: Added missing <a> tag */}
              <a
                href="mailto:info@unibordima.lk"
                className="bg-white text-gray-900 rounded-xl p-6 hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-12 h-12 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMail className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-gray-600">info@unibordima.lk</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ListWithUs;