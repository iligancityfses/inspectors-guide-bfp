import React, { useState } from 'react';
import { getSpecializedRequirements, hasSpecializedRequirements, SpecializedRequirement } from '../data/specializedRequirements';
import { FaFileAlt, FaChevronDown, FaChevronUp, FaExclamationTriangle, FaClipboard, FaLightbulb, FaCheck } from 'react-icons/fa';

interface SpecializedRequirementsProps {
  occupancyTypeId: string;
}

const SpecializedRequirements: React.FC<SpecializedRequirementsProps> = ({ occupancyTypeId }) => {
  const [expandedRequirements, setExpandedRequirements] = useState<string[]>([]);
  
  const requirements = getSpecializedRequirements(occupancyTypeId);
  
  if (!hasSpecializedRequirements(occupancyTypeId) || requirements.length === 0) {
    return null;
  }
  
  const toggleRequirement = (requirementId: string) => {
    setExpandedRequirements(prev => 
      prev.includes(requirementId) 
        ? prev.filter(id => id !== requirementId) 
        : [...prev, requirementId]
    );
  };

  // Function to extract key points from detailed requirements
  const extractKeyPoints = (details: string): string[] => {
    // Split by periods and filter out empty strings
    const sentences = details.split('.')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    // Select sentences that contain important keywords or are short enough to be key points
    return sentences
      .filter(s => 
        s.includes('must') || 
        s.includes('required') || 
        s.includes('minimum') || 
        s.includes('at least') || 
        s.length < 60
      )
      .map(s => s + '.');
  };

  // Function to generate a simplified explanation
  const generateSimplifiedExplanation = (requirement: SpecializedRequirement): string => {
    const typeMap: Record<string, string> = {
      'solar-photovoltaic-facility': 'solar panel installations',
      'wind-turbine-facility': 'wind turbines',
      'energy-storage-system': 'battery storage systems',
      'telecommunication-facility': 'telecom facilities',
      'waste-management-facility': 'waste management sites',
      'mining-facility': 'mining operations',
      'historical-building': 'historical buildings',
      'place-of-worship': 'churches, mosques, and other places of worship',
      'offshore-facility': 'offshore structures',
      'power-generation-plant': 'power plants',
      'laboratory': 'laboratories',
      'water-treatment-facility': 'water treatment plants',
      'transportation-terminal': 'transportation terminals',
      'marina': 'marinas and boat facilities',
      'agricultural-facility': 'agricultural buildings'
    };

    const facilityType = typeMap[occupancyTypeId] || 'this type of facility';
    
    const purposeMap: Record<string, string> = {
      'access': 'ensure emergency responders can safely access all areas',
      'egress': 'provide safe exit routes for occupants during emergencies',
      'ventilation': 'prevent buildup of dangerous gases or fumes',
      'detection': 'detect fires at the earliest possible stage',
      'suppression': 'quickly control and extinguish fires',
      'separation': 'prevent fire spread between different areas',
      'marking': 'clearly identify hazards and safety equipment',
      'emergency': 'ensure effective emergency response',
      'preservation': 'protect historical value while ensuring safety',
      'water-supply': 'provide adequate water for firefighting',
      'backup-power': 'maintain critical systems during power outages',
      'monitoring': 'continuously check for dangerous conditions',
      'rapid-shutdown': 'quickly de-energize systems in emergencies'
    };

    // Try to find a purpose that matches part of the requirement ID
    let purpose = '';
    for (const [key, value] of Object.entries(purposeMap)) {
      if (requirement.id.includes(key)) {
        purpose = value;
        break;
      }
    }

    if (!purpose) {
      purpose = 'protect life and property';
    }

    return `This requirement helps ${purpose} in ${facilityType}. It's based on BFP guidelines that recognize the unique fire risks in these facilities.`;
  };
  
  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center mb-4">
        <FaExclamationTriangle className="text-yellow-500 mr-2 text-xl" />
        <h2 className="text-lg font-semibold dark:text-white">Specialized Requirements</h2>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        The following specialized requirements apply to this occupancy type based on BFP memorandums, circulars, and guidelines. 
        Use this information to explain key safety requirements to building owners.
      </div>
      
      <div className="space-y-3">
        {requirements.map((requirement) => (
          <div key={requirement.id} className="border border-gray-200 dark:border-gray-700 rounded-md">
            <div 
              className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => toggleRequirement(requirement.id)}
            >
              <div className="flex items-center">
                <FaFileAlt className="text-blue-500 mr-2" />
                <span className="font-medium dark:text-white">{requirement.name}</span>
              </div>
              {expandedRequirements.includes(requirement.id) ? 
                <FaChevronUp className="text-gray-500 dark:text-gray-400" /> : 
                <FaChevronDown className="text-gray-500 dark:text-gray-400" />
              }
            </div>
            
            {expandedRequirements.includes(requirement.id) && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{requirement.description}</p>
                
                {/* Simplified explanation for inspectors to explain to clients */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mb-3">
                  <div className="flex items-start">
                    <FaLightbulb className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">HOW TO EXPLAIN TO CLIENTS:</p>
                      <p className="text-sm dark:text-gray-300">{generateSimplifiedExplanation(requirement)}</p>
                    </div>
                  </div>
                </div>

                {/* Key points for quick reference */}
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md mb-3">
                  <div className="flex items-start">
                    <FaClipboard className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">KEY POINTS:</p>
                      <ul className="text-sm space-y-1">
                        {extractKeyPoints(requirement.details).map((point, index) => (
                          <li key={index} className="flex items-start">
                            <FaCheck className="text-green-500 mt-1 mr-1 flex-shrink-0" />
                            <span className="dark:text-gray-300">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Reference information */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded mb-3 text-xs dark:text-gray-300">
                  <span className="font-semibold">Reference:</span> {requirement.reference}
                </div>
                
                {/* Full details */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">FULL DETAILS:</p>
                  <p className="text-sm dark:text-gray-300">{requirement.details}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecializedRequirements;
