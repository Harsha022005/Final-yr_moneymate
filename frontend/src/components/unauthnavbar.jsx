import React from 'react';
import { Link } from 'react-router-dom';

const UnauthenticatedNavbar = () => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          Money<span className="text-gray-800 dark:text-white">Mate</span>
        </h1>
        <div className="space-x-8 text-lg font-medium hidden md:flex">
          <Link
            to="/"
            className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition duration-300"
          >
            Home
          </Link>
          {/* <Link
            to="/userdash"
            className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition duration-300"
          >
            User Flow
          </Link> */}
          <Link
            to="/login"
            className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
            Dashboard</Link>
        </div>
      </nav>
    </header>
  );
};

export default UnauthenticatedNavbar;
