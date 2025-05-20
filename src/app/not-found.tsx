'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NotFound() {
  const [path, setPath] = useState('');
  
  useEffect(() => {
    // Get the current path to provide more helpful suggestions
    if (typeof window !== 'undefined') {
      setPath(window.location.pathname);
    }
  }, []);

  // Determine if the user might be looking for a specific page
  const isLookingForAdmin = path.includes('admin');
  const isLookingForDisclaimer = path.includes('disclaimer');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
          
          {/* Show specific message based on the path */}
          {isLookingForAdmin && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                It looks like you're trying to access the admin page. Please make sure you're using the correct URL: <br />
                <Link href="/admin" className="font-medium underline">/admin</Link>
              </p>
            </div>
          )}
          
          {isLookingForDisclaimer && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                It looks like you're trying to access the disclaimer page. Please make sure you're using the correct URL: <br />
                <Link href="/disclaimer" className="font-medium underline">/disclaimer</Link>
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Return to Home
          </Link>
          
          <Link href="/admin" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Admin Dashboard
          </Link>
          
          <Link href="/disclaimer" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
            Disclaimer
          </Link>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Fire Safety Inspectors Guide</p>
          <p className="mt-1">Created by FO1 Gejon JNG, Iligan City Fire Station</p>
        </div>
      </div>
    </div>
  );
}
