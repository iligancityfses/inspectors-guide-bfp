import React, { useState } from 'react';
import Link from 'next/link';
import { FireSafetyRequirement } from '@/data/fireCodeRequirements';
import { BuildingData } from '@/lib/calculations';

interface RequirementsListProps {
  requirements: FireSafetyRequirement[];
  buildingData: BuildingData;
}

// Group requirements by category
const groupRequirementsByCategory = (requirements: FireSafetyRequirement[]) => {
  const categories: { [key: string]: FireSafetyRequirement[] } = {
    'Fire Detection & Alarm': [],
    'Fire Suppression': [],
    'Egress & Emergency Lighting': [],
    'Structural Fire Protection': [],
    'Emergency Planning': [],
    'Other Requirements': []
  };

  requirements.forEach(req => {
    if (req.id.includes('alarm') || req.id.includes('detection')) {
      categories['Fire Detection & Alarm'].push(req);
    } else if (req.id.includes('sprinkler') || req.id.includes('extinguisher') || req.id.includes('standpipe') || req.id.includes('pump') || req.id.includes('hydrant')) {
      categories['Fire Suppression'].push(req);
    } else if (req.id.includes('exit') || req.id.includes('egress') || req.id.includes('lighting')) {
      categories['Egress & Emergency Lighting'].push(req);
    } else if (req.id.includes('resistance') || req.id.includes('barrier') || req.id.includes('construction')) {
      categories['Structural Fire Protection'].push(req);
    } else if (req.id.includes('plan') || req.id.includes('drill') || req.id.includes('officer')) {
      categories['Emergency Planning'].push(req);
    } else {
      categories['Other Requirements'].push(req);
    }
  });

  // Filter out empty categories
  return Object.entries(categories).filter(([_, reqs]) => reqs.length > 0);
};

export default function RequirementsList({ requirements, buildingData }: RequirementsListProps) {
  const [expandedRequirement, setExpandedRequirement] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  const toggleRequirement = (id: string) => {
    if (expandedRequirement === id) {
      setExpandedRequirement(null);
    } else {
      setExpandedRequirement(id);
    }
  };

  const toggleCategory = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };
  
  const groupedRequirements = groupRequirementsByCategory(requirements);
  if (requirements.length === 0) {
    return (
      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-4">Fire Safety Requirements</h2>
        <p className="text-gray-500">No requirements to display. Please complete the previous steps.</p>
      </div>
    );
  }

  return (
    <div className="card mt-6">
      <h2 className="text-xl font-semibold mb-4">Step 3: Fire Safety Requirements</h2>
      <p className="mb-4 text-sm text-gray-600">
        Based on the building information provided, the following fire safety requirements apply according to RA 9514 IRR 2019:
      </p>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Building Summary</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Occupancy Type: {buildingData.occupancyType.name}</li>
                <li>Number of Floors: {buildingData.floors.length}</li>
                <li>Total Floor Area: {buildingData.totalArea.toFixed(2)} m²</li>
                <li>Total Occupant Load: {buildingData.totalOccupantLoad} persons</li>
                <li>Estimated Building Height: {buildingData.floors.length * 3} meters</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {groupedRequirements.map(([category, categoryRequirements]) => (
          <div key={category} className="border border-gray-200 rounded-md overflow-hidden">
            <div 
              className={`flex justify-between items-center cursor-pointer p-4 ${expandedCategory === category ? 'bg-gray-100' : 'bg-white'}`}
              onClick={() => toggleCategory(category)}
            >
              <h3 className="font-medium text-lg">{category}</h3>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-500">{categoryRequirements.length} item(s)</span>
                <button className="text-primary-600">
                  {expandedCategory === category ? (
                    <span>▲ Collapse</span>
                  ) : (
                    <span>▼ Expand</span>
                  )}
                </button>
              </div>
            </div>
            
            {expandedCategory === category && (
              <div className="divide-y divide-gray-200">
                {categoryRequirements.map((requirement) => {
                  const isExpanded = expandedRequirement === requirement.id;
                  
                  // Calculate specific requirements if they exist and are functions
                  const specificReqs = requirement.specificRequirements;
                  const params = {
                    occupantLoad: buildingData.totalOccupantLoad,
                    floorArea: buildingData.totalArea,
                    stories: buildingData.floors.length,
                    buildingHeight: buildingData.floors.length * 3 // Estimate height based on 3m per floor
                  };
                  
                  const quantity = specificReqs?.quantity ? 
                    (typeof specificReqs.quantity === 'function' ? specificReqs.quantity(params) : specificReqs.quantity) : 
                    null;
                    
                  const specifications = specificReqs?.specifications ? 
                    (typeof specificReqs.specifications === 'function' ? specificReqs.specifications(params) : specificReqs.specifications) : 
                    null;
                  
                  return (
                    <div key={requirement.id} className="p-4">
                      <div 
                        className="flex justify-between items-center cursor-pointer" 
                        onClick={() => toggleRequirement(requirement.id)}
                      >
                        <h3 className="font-medium text-md">{requirement.name}</h3>
                        <button className="text-primary-600 text-sm">
                          {isExpanded ? (
                            <span>▲ Less details</span>
                          ) : (
                            <span>▼ More details</span>
                          )}
                        </button>
                      </div>
                      
                      <p className="text-gray-600 mt-1 text-sm">{requirement.description}</p>
                      
                      {quantity && (
                        <div className="mt-2 bg-blue-50 p-2 rounded">
                          <p className="font-medium text-blue-800 text-sm">{quantity}</p>
                        </div>
                      )}
                      
                      {isExpanded && (
                        <div className="mt-4 space-y-3 bg-gray-50 p-3 rounded-md">
                          {specifications && (
                            <div>
                              <h4 className="font-medium text-sm">Specifications:</h4>
                              <p className="text-sm text-gray-700">{specifications}</p>
                            </div>
                          )}
                          
                          {specificReqs?.type && (
                            <div>
                              <h4 className="font-medium text-sm">Type:</h4>
                              <p className="text-sm text-gray-700">{specificReqs.type}</p>
                            </div>
                          )}
                          
                          {specificReqs?.distribution && (
                            <div>
                              <h4 className="font-medium text-sm">Distribution:</h4>
                              <p className="text-sm text-gray-700">{specificReqs.distribution}</p>
                            </div>
                          )}
                          
                          {specificReqs?.installation && (
                            <div>
                              <h4 className="font-medium text-sm">Installation:</h4>
                              <p className="text-sm text-gray-700">{specificReqs.installation}</p>
                            </div>
                          )}
                          
                          {specificReqs?.maintenance && (
                            <div>
                              <h4 className="font-medium text-sm">Maintenance:</h4>
                              <p className="text-sm text-gray-700">{specificReqs.maintenance}</p>
                            </div>
                          )}
                          
                          <div>
                            <h4 className="font-medium text-sm">Reference:</h4>
                            <p className="text-sm text-blue-700 font-medium">{requirement.reference}</p>
                          </div>
                        </div>
                      )}
                      
                      {!isExpanded && (
                        <p className="text-xs text-blue-600 mt-2 font-medium">Reference: {requirement.reference}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-center">
        <Link href="/disclaimer" className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition duration-300 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          View Important Disclaimer
        </Link>
      </div>
    </div>
  );
}
