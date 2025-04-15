import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface HeaderProps {
  seasonYear: string;
}

export const Header = ({ seasonYear }: HeaderProps) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <Link 
        href="/" 
        className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
      >
        <FaArrowLeft className="mr-1 text-xs" /> Back to seasons
      </Link>
      
      <motion.h4 
        className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        IPL {seasonYear} Points Table
      </motion.h4>
      
      <div className="w-[100px] md:w-[150px]"></div> {/* Spacer for balanced layout */}
    </div>
  );
}; 