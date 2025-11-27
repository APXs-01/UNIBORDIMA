import AnimatedPage from '../components/common/AnimatedPage';
import { motion } from 'framer-motion';
import { FiTarget, FiHeart, FiUsers } from 'react-icons/fi';

const About = () => {
  const values = [
    {
      icon: FiTarget,
      title: 'Our Mission',
      description:
        'To simplify the boarding search process for university students across Sri Lanka by providing a transparent, verified, and easy-to-use platform.',
    },
    {
      icon: FiHeart,
      title: 'Student-First',
      description:
        'Every feature we build is designed with students in mind, ensuring the best possible experience in finding safe and affordable accommodation.',
    },
    {
      icon: FiUsers,
      title: 'Community Driven',
      description:
        'We believe in the power of student reviews and community feedback to help everyone make informed decisions.',
    },
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
              About UniBordima.lk
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Your trusted platform for finding verified university boarding
              accommodations across Sri Lanka
            </motion.p>
          </div>

          {/* Story Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                UniBordima.lk was founded by a group of university students who
                experienced firsthand the challenges of finding suitable boarding
                accommodations. We noticed that the process was often frustrating,
                time-consuming, and lacked transparency.
              </p>
              <p>
                Determined to make a difference, we created this platform to help
                fellow students find safe, affordable, and convenient boarding
                places near their universities. Our platform brings together
                verified listings, real student reviews, and powerful search tools
                to make the boarding search process simple and stress-free.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl shadow-xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-primary-100 mb-6">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* FIXED: Added missing <a> tag */}
              <a 
                href="mailto:info@unibordima.lk"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Email Us
              </a>
              {/* FIXED: Added missing <a> tag */}
              <a 
                href="tel:+94771234567"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default About;