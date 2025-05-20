'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Suggestion from './Suggestion';
import ThemeToggle from './ThemeToggle';
import { FaFire, FaInfoCircle, FaLock, FaClipboardCheck } from 'react-icons/fa';

export default function Header() {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and title */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <FaFire className="h-8 w-8 text-red-500 dark:text-red-400" />
                <div className="ml-2">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">Fire Safety Inspectors Guide</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">by FO1 Gejon JNG | RA 9514 IRR 2019</div>
                </div>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link 
                href="/tools" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <span className="flex items-center">
                  <FaFire className="mr-1" />
                  Inspector Tools
                </span>
              </Link>
              
              <button 
                onClick={() => setShowSuggestion(true)}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                <span className="flex items-center">
                  <FaClipboardCheck className="mr-1" />
                  Suggest Improvement
                </span>
              </button>
              
              <Link 
                href="/disclaimer" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-yellow-50 dark:hover:bg-yellow-900 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
              >
                <span className="flex items-center">
                  <FaInfoCircle className="mr-1" />
                  Disclaimer
                </span>
              </Link>
              
              <Link 
                href="/admin" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <span className="flex items-center">
                  <FaLock className="mr-1" />
                  Admin
                </span>
              </Link>
              
              <div className="ml-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <Link 
              href="/tools" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center">
                <FaFire className="mr-2" />
                Inspector Tools
              </span>
            </Link>
            
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                setShowSuggestion(true);
              }}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900 hover:text-green-600 dark:hover:text-green-400"
            >
              <span className="flex items-center">
                <FaClipboardCheck className="mr-2" />
                Suggest Improvement
              </span>
            </button>
            
            <Link 
              href="/disclaimer" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-yellow-50 dark:hover:bg-yellow-900 hover:text-yellow-600 dark:hover:text-yellow-400"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center">
                <FaInfoCircle className="mr-2" />
                Disclaimer
              </span>
            </Link>
            
            <Link 
              href="/admin" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center">
                <FaLock className="mr-2" />
                Admin
              </span>
            </Link>
            
            <div className="px-3 py-2">
              <div className="flex items-center">
                <span className="text-gray-700 dark:text-gray-300 mr-2">Theme:</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {showSuggestion && <Suggestion onClose={() => setShowSuggestion(false)} />}
    </>
  );
}
