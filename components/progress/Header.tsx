import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface HeaderProps {
  seasonYear: string;
}

export const Header = ({ seasonYear }: HeaderProps) => {
  return (
    <div className="mb-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back to seasons
      </Link>
      
      <motion.h1 
        className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        IPL {seasonYear} Points Table Progression
      </motion.h1>
      
      <motion.p
        className="text-gray-400 text-center mt-4 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Watch how the points table evolves match by match throughout the IPL {seasonYear} season
      </motion.p>
    </div>
  );
}; 