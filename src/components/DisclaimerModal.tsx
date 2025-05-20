'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const DisclaimerModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the user has already seen the disclaimer
    const hasSeenDisclaimer = localStorage.getItem('hasSeenDisclaimer');
    
    if (!hasSeenDisclaimer) {
      setShowModal(true);
    }
  }, []);

  const handleAccept = () => {
    // Set the localStorage flag to remember the user has seen the disclaimer
    localStorage.setItem('hasSeenDisclaimer', 'true');
    setShowModal(false);
  };

  const handleReject = () => {
    // Redirect to the disclaimer page for more information
    router.push('/disclaimer');
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center mb-4 text-red-600">
            <FaExclamationTriangle className="text-2xl mr-2" />
            <h2 className="text-xl font-bold">Important Disclaimer</h2>
          </div>
          
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 mb-4">
              This application is designed as a reference tool for fire safety inspectors of the Bureau of Fire Protection (BFP) in the Philippines. Before using this application, please read and understand the following:
            </p>
            
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>
                <strong>Not an Official BFP Tool:</strong> This application is not an official tool of the Bureau of Fire Protection. It is developed independently to assist fire safety inspectors in their work.
              </li>
              <li>
                <strong>Reference Only:</strong> The information provided in this application is for reference purposes only. Always refer to the official Revised Fire Code of the Philippines (RA 9514) and its Implementing Rules and Regulations for authoritative guidance.
              </li>
              <li>
                <strong>No Guarantee of Accuracy:</strong> While every effort has been made to ensure the accuracy of the information, the developers do not guarantee that all information is complete, accurate, or up-to-date.
              </li>
              <li>
                <strong>Professional Judgment Required:</strong> This tool does not replace professional judgment. Fire safety inspectors should use their training, experience, and professional judgment when making decisions.
              </li>
              <li>
                <strong>No Liability:</strong> The developers of this application shall not be liable for any damages or losses resulting from the use of this application or reliance on the information provided.
              </li>
            </ol>
            
            <p className="text-gray-700 mt-4">
              By clicking "I Accept" below, you acknowledge that you have read, understood, and agree to the terms of this disclaimer.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              View Full Disclaimer
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <FaCheckCircle className="mr-2" />
              I Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;
