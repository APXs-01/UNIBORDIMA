import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false }) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClass}>
      <motion.div
        className="relative"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-600 rounded-full"></div>
      </motion.div>
    </div>
  );
};

export default Loader;