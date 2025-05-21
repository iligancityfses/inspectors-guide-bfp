'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import OccupancyTypeSelector from '@/components/OccupancyTypeSelector';
import FloorManager from '@/components/FloorManager';
import BuildingFeatures, { BuildingFeature } from '@/components/BuildingFeatures';
import RequirementsList from '@/components/RequirementsList';
import DocumentRequirements from '@/components/DocumentRequirements';
import HazardousMaterialsFeeCalculator from '@/components/HazardousMaterialsFeeCalculator';
import SpecializedRequirements from '@/components/SpecializedRequirements';
import { OccupancyType } from '@/data/occupancyTypes';
import { Floor, calculateBuildingData, determineRequiredFireSafetyMeasures } from '@/lib/calculations';
import { FireSafetyRequirement } from '@/data/fireCodeRequirements';
import { defaultBuildingFeatures } from '@/data/buildingFeatures';
import { OccupancyIcon, FloorIcon, BuildingIcon, RequirementsIcon, DocumentsIcon, HazardousIcon } from '@/components/IconComponents';
import { FaInfoCircle, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa';
import { hasSpecializedRequirements } from '@/data/specializedRequirements';

export default function Home() {
  const [selectedOccupancyType, setSelectedOccupancyType] = useState<OccupancyType | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [buildingFeatures, setBuildingFeatures] = useState<BuildingFeature[]>(defaultBuildingFeatures);
  const [requirements, setRequirements] = useState<FireSafetyRequirement[]>([]);
  const [buildingData, setBuildingData] = useState<any>(null);
  const [showRequirements, setShowRequirements] = useState<boolean>(false);
  const [totalFloorArea, setTotalFloorArea] = useState<number>(0);
  const [numberOfFloors, setNumberOfFloors] = useState<number>(1);

  const handleOccupancyTypeSelect = (occupancyType: OccupancyType) => {
    console.log('handleOccupancyTypeSelect called with:', occupancyType);
    
    // Update the state with the new occupancy type
    setSelectedOccupancyType(occupancyType);
    setShowRequirements(false); // Hide requirements when occupancy type changes
  };

  const handleFloorAreaChange = (area: number) => {
    setTotalFloorArea(area);
    setShowRequirements(false); // Hide requirements when floor area changes
  };
  
  const handleNumberOfFloorsChange = (num: number) => {
    setNumberOfFloors(num);
    setShowRequirements(false); // Hide requirements when number of floors changes
  };
  
  const handleFeaturesChange = (newFeatures: BuildingFeature[]) => {
    setBuildingFeatures(newFeatures);
    setShowRequirements(false); // Hide requirements when features change
  };
  
  const generateRequirements = () => {
    if (!selectedOccupancyType || totalFloorArea <= 0 || numberOfFloors <= 0) {
      alert('Please select an occupancy type and enter valid floor area and number of floors.');
      return;
    }
    
    // Create floors based on total area and number of floors
    const floorArea = totalFloorArea / numberOfFloors;
    const floorLength = Math.sqrt(floorArea); // Assuming square floors for simplicity
    const floorWidth = floorLength;
    
    const newFloors: Floor[] = [];
    for (let i = 0; i < numberOfFloors; i++) {
      newFloors.push({
        id: `floor-${i + 1}`,
        length: floorLength,
        width: floorWidth,
        area: floorArea,
        occupantLoad: Math.ceil(floorArea / selectedOccupancyType.occupantLoadFactor),
      });
    }
    
    setFloors(newFloors);
    
    // Calculate building data and requirements
    const newBuildingData = calculateBuildingData(selectedOccupancyType, newFloors);
    newBuildingData.features = buildingFeatures.filter(feature => feature.selected);
    const newRequirements = determineRequiredFireSafetyMeasures(newBuildingData);
    
    // Update state
    setBuildingData(newBuildingData);
    setRequirements(newRequirements);
    setShowRequirements(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border-l-4 border-blue-600 dark:border-blue-500">
            <div className="flex items-start">
              <div className="mr-4 hidden sm:block">
                <div className="h-12 w-12 text-blue-600 dark:text-blue-400 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <BuildingIcon />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Fire Safety Inspectors Guide</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  This tool helps fire safety inspectors determine the requirements for buildings
                  based on the Revised Fire Code of the Philippines (RA 9514 IRR 2019).
                </p>
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800 flex items-start">
                  <FaInfoCircle className="text-blue-500 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Follow the steps below to determine the fire safety requirements for a building. Start by selecting the occupancy type, then add floors and building features.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="transition-all duration-300 transform hover:scale-[1.01]">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-2 text-blue-600 dark:text-blue-400">
                  <OccupancyIcon />
                </div>
                <div className="text-lg font-semibold text-blue-800 dark:text-blue-400">Step 1</div>
                <FaArrowRight className="mx-2 text-gray-400 dark:text-gray-500" />
                <div className="text-gray-600 dark:text-gray-300">Select Occupancy Type</div>
              </div>
              <OccupancyTypeSelector
                selectedOccupancyType={selectedOccupancyType}
                onSelect={handleOccupancyTypeSelect}
              />
            </div>
            
            {selectedOccupancyType && (
              <div className="transition-all duration-300 transform hover:scale-[1.01]">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-2 text-blue-600 dark:text-blue-400">
                    <FloorIcon />
                  </div>
                  <div className="text-lg font-semibold text-blue-800 dark:text-blue-400">Step 2</div>
                  <FaArrowRight className="mx-2 text-gray-400 dark:text-gray-500" />
                  <div className="text-gray-600 dark:text-gray-300">Enter Building Information</div>
                </div>
                <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="total-floor-area" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Total Floor Area (square meters)
                      </label>
                      <input
                        id="total-floor-area"
                        type="number"
                        min="1"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={totalFloorArea || ''}
                        onChange={(e) => handleFloorAreaChange(parseFloat(e.target.value) || 0)}
                        placeholder="Enter total floor area"
                      />
                    </div>
                    <div>
                      <label htmlFor="number-of-floors" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Number of Floors
                      </label>
                      <input
                        id="number-of-floors"
                        type="number"
                        min="1"
                        step="1"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={numberOfFloors || ''}
                        onChange={(e) => handleNumberOfFloorsChange(parseInt(e.target.value) || 0)}
                        placeholder="Enter number of floors"
                      />
                    </div>
                  </div>
                  {selectedOccupancyType && totalFloorArea > 0 && numberOfFloors > 0 && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Estimated Occupant Load:</strong> {Math.ceil((totalFloorArea / selectedOccupancyType.occupantLoadFactor))} persons
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        <strong>Floor Area per Floor:</strong> {(totalFloorArea / numberOfFloors).toFixed(2)} square meters
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {selectedOccupancyType && totalFloorArea > 0 && numberOfFloors > 0 && (
              <div className="transition-all duration-300 transform hover:scale-[1.01]">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-2 text-blue-600 dark:text-blue-400">
                    <BuildingIcon />
                  </div>
                  <div className="text-lg font-semibold text-blue-800 dark:text-blue-400">Step 3</div>
                  <FaArrowRight className="mx-2 text-gray-400 dark:text-gray-500" />
                  <div className="text-gray-600 dark:text-gray-300">Add Building Features</div>
                </div>
                <BuildingFeatures
                  features={buildingFeatures}
                  onFeaturesChange={handleFeaturesChange}
                />
                
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={generateRequirements}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600 flex items-center"
                  >
                    <RequirementsIcon className="mr-2" />
                    Generate Requirements
                  </button>
                </div>
              </div>
            )}
            
            {showRequirements && buildingData && (
              <div className="transition-all duration-300">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-2 text-blue-600 dark:text-blue-400">
                    <RequirementsIcon />
                  </div>
                  <div className="text-lg font-semibold text-blue-800 dark:text-blue-400">Step 4</div>
                  <FaArrowRight className="mx-2 text-gray-400 dark:text-gray-500" />
                  <div className="text-gray-600 dark:text-gray-300">View Fire Safety Requirements</div>
                </div>
                <RequirementsList requirements={requirements} buildingData={buildingData} />
              </div>
            )}
            
            {selectedOccupancyType && (
              <div className="transition-all duration-300 transform hover:scale-[1.01] mt-8">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-2">
                    <DocumentsIcon className="dark:text-blue-300" />
                  </div>
                  <div className="text-lg font-semibold text-blue-800 dark:text-blue-400">Additional Information</div>
                  <FaArrowRight className="mx-2 text-gray-400 dark:text-gray-500" />
                  <div className="text-gray-600 dark:text-gray-300">Required Documents for Inspection</div>
                </div>
                <DocumentRequirements occupancyType={selectedOccupancyType} />
              </div>
            )}
            
            {selectedOccupancyType && hasSpecializedRequirements(selectedOccupancyType.id) && (
              <div className="transition-all duration-300 transform hover:scale-[1.01] mt-8">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mr-2">
                    <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="text-lg font-semibold text-blue-800 dark:text-blue-400">Specialized Requirements</div>
                  <FaArrowRight className="mx-2 text-gray-400 dark:text-gray-500" />
                  <div className="text-gray-600 dark:text-gray-300">Special Provisions for {selectedOccupancyType.name}</div>
                </div>
                <SpecializedRequirements occupancyTypeId={selectedOccupancyType.id} />
              </div>
            )}
            
            {selectedOccupancyType && (
              <div className="transition-all duration-300 transform hover:scale-[1.01] mt-8">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                    <HazardousIcon />
                  </div>
                  <div className="text-lg font-semibold text-blue-800">Additional Tool</div>
                  <FaArrowRight className="mx-2 text-gray-400" />
                  <div className="text-gray-600">Hazardous Materials Fee Calculator</div>
                </div>
                <HazardousMaterialsFeeCalculator />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
