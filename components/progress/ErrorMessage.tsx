import { motion } from 'framer-motion';
import Link from 'next/link';

interface ErrorMessageProps {
  message: string;
  seasonYear?: string;
}

export const ErrorMessage = ({ message, seasonYear }: ErrorMessageProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl"
      >
        <div className="mb-6 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-red-500 mb-4">Oops! Something went wrong</h1>
        <p className="text-xl mb-6 text-gray-300">{message}</p>
        
        {seasonYear && (
          <p className="text-lg mb-8 text-gray-400">
            Points table progression data for {seasonYear} could not be loaded.
          </p>
        )}
        
        <Link href="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          Go back to Home
        </Link>
      </motion.div>
    </div>
  );
}; 