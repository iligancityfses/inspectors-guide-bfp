'use client';

import React from 'react';
import Link from 'next/link';
import { FaFire, FaExternalLinkAlt, FaFileAlt, FaHome, FaInfoCircle, FaLock, FaTools } from 'react-icons/fa';
import { useTheme } from './ThemeProvider';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 py-12 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center mb-4">
              <FaFire className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About</h3>
            </div>
            <p className="text-sm leading-relaxed">
              A professional tool designed to help fire safety inspectors determine requirements based on the
              Revised Fire Code of the Philippines (RA 9514 IRR 2019).
            </p>
            <p className="text-sm mt-4 font-medium">
              Created by FO1 Gejon JNG<br />
              Iligan City Fire Station
            </p>
          </div>
          
          {/* Official Resources */}
          <div>
            <div className="flex items-center mb-4">
              <FaFileAlt className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Official Resources</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="https://bfp.gov.ph/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <FaExternalLinkAlt className="h-3 w-3 mr-2 opacity-70" />
                  Bureau of Fire Protection
                </a>
              </li>
              <li>
                <a 
                  href="https://www.officialgazette.gov.ph/2008/12/19/republic-act-no-9514/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <FaExternalLinkAlt className="h-3 w-3 mr-2 opacity-70" />
                  Republic Act 9514
                </a>
              </li>
              <li>
                <a 
                  href="https://bfp.gov.ph/wp-content/uploads/2019/07/IRR-RA-9514.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <FaExternalLinkAlt className="h-3 w-3 mr-2 opacity-70" />
                  RA 9514 IRR 2019
                </a>
              </li>
            </ul>
          </div>
          
          {/* Site Navigation */}
          <div>
            <div className="flex items-center mb-4">
              <FaHome className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="flex items-center hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <FaHome className="h-3 w-3 mr-2 opacity-70" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tools" className="flex items-center hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <FaTools className="h-3 w-3 mr-2 opacity-70" />
                  Inspector Tools
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="flex items-center hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <FaInfoCircle className="h-3 w-3 mr-2 opacity-70" />
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/admin" className="flex items-center hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <FaLock className="h-3 w-3 mr-2 opacity-70" />
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact & Legal */}
          <div>
            <div className="flex items-center mb-4">
              <FaInfoCircle className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Legal</h3>
            </div>
            <p className="text-sm leading-relaxed">
              This application is not an official tool of the Bureau of Fire Protection. It is developed independently to assist fire safety inspectors in their work.
            </p>
            <p className="text-sm mt-4">
              For official guidance, always refer to the Revised Fire Code of the Philippines (RA 9514) and its Implementing Rules and Regulations.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6 text-center text-sm">
          <p className="text-gray-500 dark:text-gray-400">
            © {currentYear} Fire Safety Inspectors Guide | All rights reserved
          </p>
          <p className="mt-2 text-gray-400 dark:text-gray-500 text-xs">
            Current theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </p>
        </div>
      </div>
    </footer>
  );
}
