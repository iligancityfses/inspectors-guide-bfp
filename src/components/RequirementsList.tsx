import React, { useState } from 'react';
import Link from 'next/link';
import { FireSafetyRequirement } from '@/data/fireCodeRequirements';
import { BuildingData, calculatePumpPressure, calculatePumpFlowRate } from '@/lib/calculations';
import NfpaReferences from './NfpaReferences';
import PumpHorsepowerCalculator from './PumpHorsepowerCalculator';

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
    'Alternate Exits & Stairs': [],
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
      // Check if this is specifically about stairs or alternate exits
      if (req.id === 'fire-exit-doors' || req.id === 'means-of-egress') {
        categories['Alternate Exits & Stairs'].push(req);
      } else {
        categories['Egress & Emergency Lighting'].push(req);
      }
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
  const [expandedRequirements, setExpandedRequirements] = useState<string[]>([]);
  const [showNfpaReferences, setShowNfpaReferences] = useState<boolean>(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedText, setExpandedText] = useState<{[key: string]: boolean}>({});
  const [showFeatureRequirements, setShowFeatureRequirements] = useState<boolean>(false);

  const toggleRequirement = (id: string) => {
    if (expandedRequirements.includes(id)) {
      setExpandedRequirements(expandedRequirements.filter(reqId => reqId !== id));
    } else {
      setExpandedRequirements([...expandedRequirements, id]);
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
      <div className="card mt-6 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Fire Safety Requirements</h2>
        <p className="text-gray-500 dark:text-gray-400">No requirements to display. Please complete the previous steps.</p>
      </div>
    );
  }

  return (
    <div className="card mt-6 dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Step 3: Fire Safety Requirements</h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        Based on the building information provided, the following fire safety requirements apply according to RA 9514 IRR 2019:
      </p>
      
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Building Summary</h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <ul className="list-disc pl-5 space-y-1">
                <li>Occupancy Type: {buildingData.occupancyType.name}</li>
                <li>Hazard Classification: {buildingData.occupancyType.hazardClassification || 'Not specified'}</li>
                <li>Number of Floors: {buildingData.floors.length}</li>
                <li>Total Floor Area: {buildingData.totalArea.toFixed(2)} m²</li>
                <li>Total Occupant Load: {buildingData.totalOccupantLoad} persons</li>
                <li>Estimated Building Height: {buildingData.floors.length * 3} meters</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border-l-4 border-yellow-500 dark:border-yellow-600">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Important Notice</h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>This guide provides requirements based on the Revised Fire Code of the Philippines (RA 9514 IRR 2019). Final determination of applicable requirements must be made by qualified fire safety inspectors using their professional judgment.</p>
            </div>
            <div className="mt-2">
              <Link href="/disclaimer" className="text-sm font-medium text-yellow-600 hover:text-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-300">View full disclaimer →</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border-l-4 border-blue-500 dark:border-blue-600 mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">NFPA References</h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>The following requirements include references to National Fire Protection Association (NFPA) standards. Click below to view detailed NFPA references for specific requirements.</p>
              </div>
              <div className="mt-2">
                <button 
                  onClick={() => setShowNfpaReferences(!showNfpaReferences)} 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {showNfpaReferences ? 'Hide NFPA References' : 'Show NFPA References'} →
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {showNfpaReferences && (
          <div className="mb-6">
            <NfpaReferences buildingData={{
              occupantLoad: buildingData.totalOccupantLoad,
              stories: buildingData.floors.length,
              floorArea: buildingData.totalArea,
              buildingHeight: buildingData.floors.length * 3 // Estimating 3m per floor
            }} />
          </div>
        )}
        
        {buildingData && buildingData.features && buildingData.features.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border-l-4 border-blue-500 dark:border-blue-600 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Building Feature Requirements</h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>The following requirements are specific to the building features you selected.</p>
                </div>
                <div className="mt-2">
                  <button 
                    onClick={() => setShowFeatureRequirements(!showFeatureRequirements)} 
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {showFeatureRequirements ? 'Hide Feature Requirements' : 'Show Feature Requirements'} →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {showFeatureRequirements && buildingData && buildingData.features && buildingData.features.length > 0 && (
          <div className="mb-6 space-y-4">
            {buildingData.features.map(feature => {
              // Define interface for feature requirements
              interface FeatureRequirement {
                title: string;
                description: string;
                reference: string;
                specifications?: string;
                installation?: string;
                maintenance?: string;
                testing?: string;
              }
              
              // Find feature-specific requirements
              let featureRequirements: FeatureRequirement[] = [];
              
              switch(feature.id) {
                case 'elevator':
                  featureRequirements.push({
                    title: 'Elevator Emergency Operations',
                    description: 'Elevators must be equipped with Phase I Emergency Recall Operation and Phase II Emergency In-Car Operation.',
                    reference: 'NFPA 72 Section 21.6',
                    specifications: 'Three-position key switch required at designated level. Visual signal must indicate when Phase I operation is in effect.',
                    installation: 'Smoke detectors must be installed in elevator lobbies, machine rooms, and hoistways to initiate automatic recall.',
                    maintenance: 'Monthly testing of Phase I recall operation. Annual testing of all components and functions.',
                    testing: 'Weekly visual inspection. Annual full operational test with documentation.'
                  }, {
                    title: 'Elevator Alternate Power Supply',
                    description: 'Elevators required for emergency operation must be connected to an alternate power supply.',
                    reference: 'NFPA 70/72/101',
                    specifications: 'Standby power must be capable of operating all designated elevators simultaneously for buildings over 20 stories, or at least one elevator for buildings under 10 stories.',
                    installation: 'Transfer to emergency power must be automatic and occur within 60 seconds. Dedicated feeders required for elevator circuits.',
                    maintenance: 'Monthly testing under load. Annual full load test for minimum 2 hours.',
                    testing: 'Weekly visual inspection. Monthly testing of transfer switches. Annual full load test.'
                  });
                  break;
                case 'escalator':
                  featureRequirements.push({
                    title: 'Escalator Emergency Stop',
                    description: 'Escalators must have emergency stop buttons at the top and bottom landings.',
                    reference: 'NFPA 101 Section 7.4.5',
                    specifications: 'Emergency stop buttons must be red in color and clearly marked. Buttons must be located within 48 inches of the escalator newel.',
                    installation: 'Buttons must be installed at both the top and bottom landings of each escalator. Additional stop buttons may be required for long escalators.',
                    maintenance: 'Monthly testing of emergency stop function. Annual inspection of all components.',
                    testing: 'Weekly visual inspection. Monthly operational test.'
                  });
                  break;
                case 'basement':
                  featureRequirements.push({
                    title: 'Basement Smoke Control',
                    description: 'Basements must have smoke control systems or smoke vents.',
                    reference: 'NFPA 92',
                    specifications: 'Mechanical exhaust system with a minimum of 6 air changes per hour or 1 cfm/sq ft, whichever is greater. Natural vents must have a minimum area of 1/20 of the floor area.',
                    installation: 'Smoke control system must be designed by a qualified engineer. System must be integrated with the fire alarm system.',
                    maintenance: 'Quarterly testing of all components. Annual full system test.',
                    testing: 'Monthly operational test. Annual performance test.'
                  }, {
                    title: 'Basement Exit Requirements',
                    description: 'Basements must have at least two means of egress.',
                    reference: 'NFPA 101 Section 7.4.1',
                    specifications: 'Exits must be arranged so that the maximum travel distance to an exit does not exceed 60 meters (200 feet) for unsprinklered buildings or 90 meters (300 feet) for sprinklered buildings.',
                    installation: 'Exits must be clearly marked with illuminated exit signs. Exit stairways must be enclosed with fire-rated construction.',
                    maintenance: 'Monthly inspection of exit pathways, doors, and signs. Annual testing of emergency lighting and exit signs.',
                    testing: 'Monthly testing of exit signs and emergency lighting.'
                  });
                  break;
                case 'atrium':
                  featureRequirements.push({
                    title: 'Atrium Smoke Control',
                    description: 'Atriums must be equipped with a smoke control system.',
                    reference: 'NFPA 92',
                    specifications: 'Mechanical exhaust system designed to maintain the smoke layer at least 6 feet above the highest walking surface. System must be capable of 4-6 air changes per hour.',
                    installation: 'System must be designed by a qualified engineer. System must be integrated with the fire alarm system and have emergency power backup.',
                    maintenance: 'Quarterly testing of all components. Annual full system test.',
                    testing: 'Monthly operational test. Annual performance test with smoke or tracer gas.'
                  }, {
                    title: 'Atrium Fire Separation',
                    description: 'Atriums must be separated from adjacent spaces by fire barriers with at least 1-hour fire resistance rating.',
                    reference: 'NFPA 101 Section 8.6.7',
                    specifications: 'Fire barriers must extend from the floor to the underside of the floor or roof above. All openings in fire barriers must be protected.',
                    installation: 'Fire barriers must be constructed of approved materials and assemblies. All penetrations must be properly sealed with approved firestopping materials.',
                    maintenance: 'Annual inspection of fire barriers and penetrations. Immediate repair of any damaged components.',
                    testing: 'Visual inspection after installation and annually thereafter.'
                  });
                  break;
                case 'kitchen':
                  featureRequirements.push({
                    title: 'Commercial Kitchen Fire Suppression',
                    description: 'Commercial kitchens must have a Type I hood with a fire suppression system.',
                    reference: 'NFPA 96',
                    specifications: 'Wet chemical system designed specifically for kitchen hood applications. System must provide protection for cooking surfaces, hood, and duct.',
                    installation: 'System must be installed by a qualified contractor. Manual pull station must be located along the path of egress from the kitchen.',
                    maintenance: 'Semi-annual inspection by a qualified contractor. Cleaning of hood and duct system at intervals determined by the type of cooking operations.',
                    testing: 'Monthly visual inspection. Semi-annual operational test without agent discharge.'
                  }, {
                    title: 'Kitchen Class K Extinguishers',
                    description: 'Commercial kitchens must have Class K fire extinguishers.',
                    reference: 'NFPA 10 Section 5.5',
                    specifications: 'Class K extinguishers must be provided for hazards where there is a potential for fires involving combustible cooking media (vegetable or animal oils and fats).',
                    installation: 'Maximum travel distance of 9 meters (30 feet) from the hazard. Extinguishers must be installed so that the top is not more than 1.5 meters (5 feet) above the floor.',
                    maintenance: 'Monthly visual inspection. Annual maintenance by certified technician.',
                    testing: 'Hydrostatic testing every 12 years.'
                  });
                  break;
                case 'generator':
                  featureRequirements.push({
                    title: 'Emergency Generator Room',
                    description: 'Emergency generators must be installed in a dedicated room with a fire resistance rating of at least 2 hours.',
                    reference: 'NFPA 110 Section 7.2',
                    specifications: 'Room must have adequate ventilation and cooling. Room must have a minimum 2-hour fire resistance rating. Room must have adequate space for maintenance and service.',
                    installation: 'Generator must be installed on a concrete pad or floor capable of supporting the weight. Fuel supply system must comply with applicable codes.',
                    maintenance: 'Weekly visual inspection. Monthly testing under load. Annual full preventive maintenance.',
                    testing: 'Weekly no-load test. Monthly load test for 30 minutes. Annual load test for 2 hours.'
                  }, {
                    title: 'Generator Testing and Maintenance',
                    description: 'Emergency generators must be tested monthly and maintained according to NFPA 110.',
                    reference: 'NFPA 110 Section 8.4',
                    specifications: 'Testing must include automatic and manual transfer switches. Generator must be tested under load for at least 30 minutes monthly.',
                    installation: 'Testing and maintenance procedures must be documented. Documentation must be maintained on site.',
                    maintenance: 'Weekly inspection of fuel, oil, and coolant levels. Annual inspection of all components. Replacement of components according to manufacturer recommendations.',
                    testing: 'Monthly testing under load for 30 minutes. Annual testing under full load for 2 hours or 30% of nameplate kW rating, whichever is less.'
                  });
                  break;
                case 'data-center':
                  featureRequirements.push({
                    title: 'Data Center Fire Suppression',
                    description: 'Data centers must have a clean agent fire suppression system.',
                    reference: 'NFPA 75 Section 8.4',
                    specifications: 'Clean agent system must be suitable for use in occupied spaces and must not damage electronic equipment. System must provide total flooding of the protected space.',
                    installation: 'System must be designed and installed by a qualified contractor. System must be integrated with the fire alarm system.',
                    maintenance: 'Semi-annual inspection by a qualified contractor. Agent container weight and pressure must be checked semi-annually.',
                    testing: 'Monthly visual inspection. Annual testing of system functions without agent discharge.'
                  }, {
                    title: 'Data Center Smoke Detection',
                    description: 'Data centers must have early warning smoke detection systems.',
                    reference: 'NFPA 75 Section 8.3',
                    specifications: 'Very Early Warning Fire Detection (VEWFD) or Early Warning Fire Detection (EWFD) systems required. Air sampling detection systems recommended for critical facilities.',
                    installation: 'Detectors must be installed in accordance with NFPA 72. Detectors must be installed in equipment cabinets, above suspended ceilings, and below raised floors.',
                    maintenance: 'Monthly testing of alarm notification devices. Quarterly testing of detection devices.',
                    testing: 'Monthly visual inspection. Annual sensitivity testing.'
                  });
                  break;
                case 'hazardous-materials':
                  featureRequirements.push({
                    title: 'Hazardous Materials Storage',
                    description: 'Hazardous materials storage areas must have spill control, secondary containment, and ventilation.',
                    reference: 'NFPA 400',
                    specifications: 'Secondary containment must be capable of containing 110% of the volume of the largest container. Ventilation system must provide at least 1 cfm/sq ft of floor area, but not less than 150 cfm.',
                    installation: 'Storage areas must be separated from other areas by fire barriers with a minimum 1-hour fire resistance rating. Incompatible materials must be separated.',
                    maintenance: 'Weekly inspection of containment systems. Monthly testing of ventilation systems.',
                    testing: 'Annual testing of all safety systems. Spill control equipment must be tested annually.'
                  }, {
                    title: 'Hazardous Materials Signage',
                    description: 'Hazardous materials storage areas must have NFPA 704 diamond signage.',
                    reference: 'NFPA 704',
                    specifications: 'NFPA 704 diamond must indicate the health hazard, flammability, instability, and special hazards of the materials stored. Minimum size of 15 cm (6 inches) per side.',
                    installation: 'Signs must be posted at each entrance to the storage area. Additional signs may be required at specific storage locations within the area.',
                    maintenance: 'Annual inspection of signs for legibility and accuracy. Signs must be updated when materials change.',
                    testing: 'Visual inspection after installation and annually thereafter.'
                  });
                  break;
                case 'parking-garage':
                  featureRequirements.push({
                    title: 'Parking Garage Ventilation',
                    description: 'Enclosed parking garages must have mechanical ventilation.',
                    reference: 'NFPA 88A Section 5.3',
                    specifications: 'Ventilation system must provide a minimum of 0.75 cfm/sq ft of floor area. System may be continuous or automatically activated by carbon monoxide detection system.',
                    installation: 'System must be designed by a qualified engineer. Exhaust inlets must be located to provide uniform air movement throughout the garage.',
                    maintenance: 'Quarterly testing of ventilation system. Annual cleaning of ductwork and fans.',
                    testing: 'Monthly testing of carbon monoxide detection system if present. Annual testing of ventilation system capacity.'
                  }, {
                    title: 'Parking Garage Sprinklers',
                    description: 'Enclosed parking garages must have automatic sprinkler systems.',
                    reference: 'NFPA 88A Section 6.1',
                    specifications: 'Sprinkler system must be designed for Ordinary Hazard Group 1 occupancy. System must provide coverage for all areas of the garage.',
                    installation: 'System must be installed in accordance with NFPA 13. Sprinkler heads must be protected from mechanical damage in areas where vehicles are moved.',
                    maintenance: 'Weekly visual inspection of control valves. Monthly inspection of water flow alarm devices.',
                    testing: 'Quarterly testing of alarm devices. Annual testing of all components.'
                  });
                  break;
                case 'high-piled-storage':
                  featureRequirements.push({
                    title: 'High-Piled Storage Sprinklers',
                    description: 'High-piled storage areas must have automatic sprinkler systems designed for the specific storage configuration.',
                    reference: 'NFPA 13 Chapter 12',
                    specifications: 'Sprinkler system design must consider storage height, commodity classification, storage arrangement, and aisle width. In-rack sprinklers may be required for storage over 25 feet in height.',
                    installation: 'System must be installed by a qualified contractor. Hydraulic calculations must be performed to ensure adequate water supply.',
                    maintenance: 'Weekly visual inspection of control valves. Monthly inspection of water flow alarm devices.',
                    testing: 'Quarterly testing of alarm devices. Annual testing of all components.'
                  }, {
                    title: 'High-Piled Storage Access',
                    description: 'High-piled storage areas must have access aisles and fire department access doors.',
                    reference: 'NFPA 1 Section 34.7',
                    specifications: 'Access aisles must be a minimum of 44 inches wide. Fire department access doors must be provided in exterior walls within 45 meters (150 feet) of all portions of the storage area.',
                    installation: 'Access doors must be marked with signs reading "FIRE DEPARTMENT ACCESS" with letters at least 5 cm (2 inches) high. Access aisles must be maintained clear at all times.',
                    maintenance: 'Monthly inspection of access aisles and doors. Immediate removal of any obstructions.',
                    testing: 'Annual verification of access door operation.'
                  });
                  break;
              }
              
              return featureRequirements.length > 0 ? (
                <div key={feature.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 border-blue-500 dark:border-blue-400">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{feature.name} Requirements</h3>
                  <div className="space-y-3">
                    {featureRequirements.map((req, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <h4 className="font-medium text-gray-800 dark:text-white">{req.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{req.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reference: {req.reference}</p>
                        
                        {/* Expandable section for detailed specifications */}
                        <div className="mt-2">
                          <button
                            onClick={() => {
                              const newExpandedText = {...expandedText};
                              newExpandedText[`${feature.id}-${index}`] = !expandedText[`${feature.id}-${index}`];
                              setExpandedText(newExpandedText);
                            }}
                            className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                          >
                            {expandedText[`${feature.id}-${index}`] ? 'Hide details' : 'Show details'}
                            <svg className={`ml-1 h-4 w-4 transition-transform ${expandedText[`${feature.id}-${index}`] ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        
                        {expandedText[`${feature.id}-${index}`] && (
                          <div className="mt-2 text-xs border-t border-gray-200 dark:border-gray-600 pt-2">
                            {req.specifications && (
                              <div className="mb-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Specifications: </span>
                                <span className="text-gray-600 dark:text-gray-400">{req.specifications}</span>
                              </div>
                            )}
                            {req.installation && (
                              <div className="mb-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Installation: </span>
                                <span className="text-gray-600 dark:text-gray-400">{req.installation}</span>
                              </div>
                            )}
                            {req.maintenance && (
                              <div className="mb-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Maintenance: </span>
                                <span className="text-gray-600 dark:text-gray-400">{req.maintenance}</span>
                              </div>
                            )}
                            {req.testing && (
                              <div className="mb-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Testing: </span>
                                <span className="text-gray-600 dark:text-gray-400">{req.testing}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            }).filter(Boolean)}
          </div>
        )}
        
        <div className="space-y-6">
          {groupedRequirements.map(([category, categoryRequirements]) => (
          <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <div 
              className={`flex justify-between items-center cursor-pointer p-4 ${expandedCategory === category ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
              onClick={() => toggleCategory(category)}
            >
              <h3 className="font-medium text-lg dark:text-white">{category}</h3>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">{categoryRequirements.length} item(s)</span>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  {expandedCategory === category ? (
                    <span>▲ Collapse</span>
                  ) : (
                    <span>▼ Expand</span>
                  )}
                </button>
              </div>
            </div>
            
            {expandedCategory === category && (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {categoryRequirements.map((requirement) => {
                  const isExpanded = expandedRequirements.includes(requirement.id);
                  
                  // Calculate specific requirements if they exist and are functions
                  const specificReqs = requirement.specificRequirements;
                  const params = {
                    occupantLoad: buildingData.totalOccupantLoad,
                    floorArea: buildingData.totalArea,
                    stories: buildingData.floors.length,
                    buildingHeight: buildingData.floors.length * 3, // Estimate height based on 3m per floor
                    occupancyType: buildingData.occupancyType // Pass the occupancy type to the specifications function
                  };
                  
                  const quantity = specificReqs?.quantity ? 
                    (typeof specificReqs.quantity === 'function' ? specificReqs.quantity(params) : specificReqs.quantity) : 
                    null;
                    
                  const specifications = specificReqs?.specifications ? 
                    (typeof specificReqs.specifications === 'function' ? specificReqs.specifications(params) : specificReqs.specifications) : 
                    null;
                    
                  const type = specificReqs?.type ? 
                    (typeof specificReqs.type === 'function' ? specificReqs.type(params) : specificReqs.type) : 
                    null;
                    
                  const distribution = specificReqs?.distribution ? 
                    (typeof specificReqs.distribution === 'function' ? specificReqs.distribution(params) : specificReqs.distribution) : 
                    null;
                    
                  const installation = specificReqs?.installation ? 
                    (typeof specificReqs.installation === 'function' ? specificReqs.installation(params) : specificReqs.installation) : 
                    null;
                    
                  const maintenance = specificReqs?.maintenance ? 
                    (typeof specificReqs.maintenance === 'function' ? specificReqs.maintenance(params) : specificReqs.maintenance) : 
                    null;
                  
                  return (
                    <div key={requirement.id} className="p-4 dark:bg-gray-800">
                      <div 
                        className="flex justify-between items-center cursor-pointer" 
                        onClick={() => toggleRequirement(requirement.id)}
                      >
                        <h3 className="font-medium text-md dark:text-white">{requirement.name}</h3>
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white text-sm rounded-md transition-colors">
                          {isExpanded ? (
                            <span>▲ Less details</span>
                          ) : (
                            <span>▼ More details</span>
                          )}
                        </button>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">{requirement.description}</p>
                      <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                        <span className="font-medium">Reference:</span> {requirement.reference}
                      </div>
                      
                      {quantity && (
                        <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                          <p className="font-medium text-blue-800 dark:text-blue-300 text-sm">{quantity}</p>
                        </div>
                      )}
                      
                      {isExpanded && (
                        <div className="mt-4 space-y-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-md border-l-2 border-blue-500 dark:border-blue-400">
                          {/* Add Pump Horsepower Calculator for fire pump and sprinkler system requirements */}
                          {(requirement.id === 'fire-pump' || requirement.id === 'automatic-sprinkler-system') && (
                            <div className="mb-4">
                              <h4 className="font-medium text-sm dark:text-gray-200 mb-2">Pump Horsepower Calculator:</h4>
                              <PumpHorsepowerCalculator 
                                initialFlowRate={calculatePumpFlowRate(
                                  buildingData.floors.length * 3, 
                                  buildingData.totalOccupantLoad
                                )}
                                initialPressure={calculatePumpPressure(buildingData.floors.length * 3)}
                              />
                            </div>
                          )}
                          {specifications && (
                            <div>
                              <h4 className="font-medium text-sm dark:text-gray-200">Specifications:</h4>
                              <div className="relative">
                                <p className={`text-sm text-gray-700 dark:text-gray-300 ${!expandedText[`${requirement.id}-specs`] && specifications.length > 150 ? 'line-clamp-3' : ''}`}>
                                  {specifications}
                                </p>
                                {specifications.length > 150 && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedText(prev => ({
                                        ...prev,
                                        [`${requirement.id}-specs`]: !prev[`${requirement.id}-specs`]
                                      }));
                                    }}
                                    className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    {expandedText[`${requirement.id}-specs`] ? 'Show less' : 'Expand text'}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {specificReqs?.type && (
                            <div>
                              <h4 className="font-medium text-sm dark:text-gray-200">Type:</h4>
                              <div className="relative">
                                <p className={`text-sm text-gray-700 dark:text-gray-300 ${!expandedText[`${requirement.id}-type`] && specificReqs.type.length > 150 ? 'line-clamp-3' : ''}`}>
                                  {specificReqs.type}
                                </p>
                                {specificReqs.type.length > 150 && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedText(prev => ({
                                        ...prev,
                                        [`${requirement.id}-type`]: !prev[`${requirement.id}-type`]
                                      }));
                                    }}
                                    className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    {expandedText[`${requirement.id}-type`] ? 'Show less' : 'Expand text'}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {specificReqs?.distribution && (
                            <div>
                              <h4 className="font-medium text-sm dark:text-gray-200">Distribution:</h4>
                              <div className="relative">
                                <p className={`text-sm text-gray-700 dark:text-gray-300 ${!expandedText[`${requirement.id}-distribution`] && specificReqs.distribution.length > 150 ? 'line-clamp-3' : ''}`}>
                                  {specificReqs.distribution}
                                </p>
                                {specificReqs.distribution.length > 150 && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedText(prev => ({
                                        ...prev,
                                        [`${requirement.id}-distribution`]: !prev[`${requirement.id}-distribution`]
                                      }));
                                    }}
                                    className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    {expandedText[`${requirement.id}-distribution`] ? 'Show less' : 'Expand text'}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {specificReqs?.installation && (
                            <div>
                              <h4 className="font-medium text-sm">Installation:</h4>
                              <div className="relative">
                                <p className={`text-sm text-gray-700 ${!expandedText[`${requirement.id}-installation`] && specificReqs.installation.length > 150 ? 'line-clamp-3' : ''}`}>
                                  {specificReqs.installation}
                                </p>
                                {specificReqs.installation.length > 150 && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedText(prev => ({
                                        ...prev,
                                        [`${requirement.id}-installation`]: !prev[`${requirement.id}-installation`]
                                      }));
                                    }}
                                    className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    {expandedText[`${requirement.id}-installation`] ? 'Show less' : 'Expand text'}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {specificReqs?.maintenance && (
                            <div>
                              <h4 className="font-medium text-sm">Maintenance:</h4>
                              <div className="relative">
                                <p className={`text-sm text-gray-700 ${!expandedText[`${requirement.id}-maintenance`] && specificReqs.maintenance.length > 150 ? 'line-clamp-3' : ''}`}>
                                  {specificReqs.maintenance}
                                </p>
                                {specificReqs.maintenance.length > 150 && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedText(prev => ({
                                        ...prev,
                                        [`${requirement.id}-maintenance`]: !prev[`${requirement.id}-maintenance`]
                                      }));
                                    }}
                                    className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    {expandedText[`${requirement.id}-maintenance`] ? 'Show less' : 'Expand text'}
                                  </button>
                                )}
                              </div>
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
