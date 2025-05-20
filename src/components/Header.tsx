import React, { useState } from 'react';
import Link from 'next/link';
import Suggestion from './Suggestion';

export default function Header() {
  const [showSuggestion, setShowSuggestion] = useState(false);
  
  // Function to create a test suggestion log
  const createTestLog = () => {
    try {
      const testLog = {
        type: 'feature',
        details: 'Test suggestion created at ' + new Date().toLocaleString(),
        timestamp: new Date().toISOString()
      };
      
      const existingLogs = JSON.parse(localStorage.getItem('suggestionLogs') || '[]');
      const updatedLogs = [...existingLogs, testLog];
      localStorage.setItem('suggestionLogs', JSON.stringify(updatedLogs));
      
      alert('Test suggestion created! Check the admin page to view it.');
    } catch (err) {
      console.error('Failed to create test log:', err);
      alert('Error creating test log: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
        <div className="container mx-auto py-4 px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
              <Link href="/" className="text-2xl font-bold hover:text-yellow-200 transition duration-300">Fire Safety Inspectors Guide</Link>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap justify-center md:justify-end gap-2">
              <div className="text-sm bg-blue-800 px-3 py-1 rounded-full">
                Based on RA 9514 IRR 2019
              </div>
              <button 
                onClick={() => setShowSuggestion(true)}
                className="text-sm bg-green-600 hover:bg-green-700 px-3 py-1 rounded-full transition duration-300"
              >
                Suggest Improvement
              </button>
              <Link href="/disclaimer" className="text-sm bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-full transition duration-300">
                Disclaimer
              </Link>
              <Link href="/admin" className="text-sm bg-purple-500 hover:bg-purple-600 px-3 py-1 rounded-full transition duration-300">
                Admin
              </Link>
              <button 
                onClick={createTestLog}
                className="text-sm bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full transition duration-300"
              >
                Test Log
              </button>
            </div>
          </div>
        </div>
      </header>

      {showSuggestion && <Suggestion onClose={() => setShowSuggestion(false)} />}
    </>
  );
}
