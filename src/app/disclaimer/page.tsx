import React from 'react';
import Link from 'next/link';

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Disclaimer and Legal Notice</h1>
        </div>
        
        <div className="p-6 space-y-6">
          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Purpose of this Application</h2>
            <p className="text-gray-600">
              The Fire Safety Inspectors Guide is designed to assist fire safety inspectors in identifying potential 
              requirements based on the Revised Fire Code of the Philippines (RA 9514 IRR 2019). This application 
              is intended to be used as a reference tool only and does not replace official documentation or professional judgment.
            </p>
          </section>
          
          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Inspector Discretion Required</h2>
            <p className="text-gray-600 mb-3">
              This application provides general guidance based on common interpretations of the Fire Code. However, 
              the final determination of applicable requirements must be made by qualified fire safety inspectors 
              using their professional judgment and discretion.
            </p>
            <p className="text-gray-600">
              Fire safety requirements may vary based on specific building conditions, local amendments to the code, 
              and interpretations by local fire safety officials. Inspectors should always refer to the official 
              Revised Fire Code of the Philippines and consult with their supervisors when in doubt.
            </p>
          </section>
          
          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Limitation of Liability</h2>
            <p className="text-gray-600 mb-3">
              As the developer of this application, FO1 Gejon JNG of Iligan City Fire Station is not liable for any 
              decisions made by inspectors based on the information provided by this tool. The developer makes no 
              warranties, expressed or implied, regarding the accuracy, completeness, or reliability of the information 
              contained in this application.
            </p>
            <p className="text-gray-600">
              Users of this application acknowledge that they are solely responsible for verifying the information 
              provided and for any decisions or actions taken based on this information. The developer shall not be 
              held responsible for any damages, losses, or legal consequences resulting from the use of this application.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Official References</h2>
            <p className="text-gray-600 mb-3">
              For the most accurate and up-to-date information, always refer to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>The official copy of the Revised Fire Code of the Philippines (RA 9514)</li>
              <li>The Implementing Rules and Regulations (IRR) of 2019</li>
              <li>Bureau of Fire Protection memoranda and circulars</li>
              <li>Local fire codes and ordinances</li>
            </ul>
          </section>
          
          <div className="mt-8 text-center">
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300">
              Return to Application
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-100 px-6 py-4 text-center text-sm text-gray-600">
          <p>Created by FO1 Gejon JNG, Iligan City Fire Station</p>
          <p className="mt-1">Based on the Revised Fire Code of the Philippines (RA 9514 IRR 2019)</p>
        </div>
      </div>
    </div>
  );
}
