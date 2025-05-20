import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Fire Safety Inspectors Guide</h3>
            <p className="text-gray-400 text-sm">
              A tool to help fire safety inspectors determine requirements based on the
              Revised Fire Code of the Philippines (RA 9514 IRR 2019).
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a 
                  href="https://bfp.gov.ph/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition-colors"
                >
                  Bureau of Fire Protection
                </a>
              </li>
              <li>
                <a 
                  href="/admin" 
                  className="hover:text-blue-300 transition-colors"
                >
                  Admin Portal
                </a>
              </li>
              <li>
                <a 
                  href="https://www.officialgazette.gov.ph/2008/12/19/republic-act-no-9514/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition-colors"
                >
                  Republic Act 9514
                </a>
              </li>
              <li>
                <a 
                  href="https://bfp.gov.ph/wp-content/uploads/2019/07/IRR-RA-9514.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition-colors"
                >
                  RA 9514 IRR 2019
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-blue-300 transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>
            Created by FO1 Gejon JNG, Iligan City Fire Station
          </p>
          <p className="mt-1">
            © {currentYear} Fire Safety Inspectors Guide. Based on the Revised Fire Code of the Philippines.
          </p>
        </div>
      </div>
    </footer>
  );
}
