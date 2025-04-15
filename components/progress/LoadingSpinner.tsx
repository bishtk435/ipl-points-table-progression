import { motion } from 'framer-motion';

export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <motion.div
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
        className="w-16 h-16 border-t-4 border-l-4 border-indigo-500 rounded-full"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-gray-300 text-lg font-medium"
      >
        Loading match data...
      </motion.p>
    </div>
  );
}; 