import React, { useState } from 'react';
import { OccupancyType } from '@/data/occupancyTypes';
import { DocumentRequirement, getDocumentRequirements } from '@/data/documentRequirements';

interface DocumentRequirementsProps {
  occupancyType: OccupancyType;
}

export default function DocumentRequirements({ occupancyType }: DocumentRequirementsProps) {
  const [expandedDocument, setExpandedDocument] = useState<string | null>(null);
  const documentRequirements = getDocumentRequirements(occupancyType);

  const toggleDocument = (id: string) => {
    if (expandedDocument === id) {
      setExpandedDocument(null);
    } else {
      setExpandedDocument(id);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Required Documents for Inspection</h2>
      <p className="text-gray-600 mb-4">
        The following documents are required for {occupancyType.name} occupancies according to the Revised Fire Code of the Philippines (RA 9514 IRR 2019).
        Inspectors should remind building owners to secure and maintain these documents.
      </p>

      {documentRequirements.length === 0 ? (
        <p className="text-gray-500 italic">No specific document requirements found for this occupancy type.</p>
      ) : (
        <div className="space-y-4">
          {documentRequirements.map((doc) => (
            <div 
              key={doc.id} 
              className="border border-gray-200 rounded-md overflow-hidden"
            >
              <div 
                className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
                onClick={() => toggleDocument(doc.id)}
              >
                <div>
                  <h3 className="font-medium">{doc.name}</h3>
                  <p className="text-sm text-gray-600">{doc.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <svg 
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedDocument === doc.id ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {expandedDocument === doc.id && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-500">Reference: </span>
                    <span className="text-sm">{doc.reference}</span>
                  </div>
                  {doc.details && (
                    <div className="text-sm text-gray-700">
                      <p>{doc.details}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
