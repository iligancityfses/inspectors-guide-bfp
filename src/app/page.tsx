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

  const handleOccupancyTypeSelect = (occupancyType: OccupancyType) => {
    console.log('handleOccupancyTypeSelect called with:', occupancyType);
    
    // Update the state with the new occupancy type
    setSelectedOccupancyType(occupancyType);
    
    // Recalculate occupant load for existing floors if occupancy type changes
    if (floors.length > 0) {
      console.log('Recalculating for existing floors:', floors);
      const updatedFloors = floors.map(floor => ({
        ...floor,
        occupantLoad: Math.ceil(floor.area / occupancyType.occupantLoadFactor),
      }));
      
      // Update floors with new occupant loads
      setFloors(updatedFloors);
      
      // Update requirements based on new occupant load
      const newBuildingData = calculateBuildingData(occupancyType, updatedFloors);
      newBuildingData.features = buildingFeatures.filter(feature => feature.selected);
      const newRequirements = determineRequiredFireSafetyMeasures(newBuildingData);
      
      // Update building data and requirements
      setBuildingData(newBuildingData);
      setRequirements(newRequirements);
    } else {
      console.log('No floors yet, just updating occupancy type');
    }
  };

  const handleFloorsChange = (newFloors: Floor[]) => {
    setFloors(newFloors);
    
    if (selectedOccupancyType) {
      const newBuildingData = calculateBuildingData(selectedOccupancyType, newFloors);
      newBuildingData.features = buildingFeatures.filter(feature => feature.selected);
      const newRequirements = determineRequiredFireSafetyMeasures(newBuildingData);
      setBuildingData(newBuildingData);
      setRequirements(newRequirements);
    }
  };
  
  const handleFeaturesChange = (newFeatures: BuildingFeature[]) => {
    setBuildingFeatures(newFeatures);
    
    if (selectedOccupancyType && floors.length > 0) {
      const newBuildingData = calculateBuildingData(selectedOccupancyType, floors);
      newBuildingData.features = newFeatures.filter(feature => feature.selected);
      const newRequirements = determineRequiredFireSafetyMeasures(newBuildingData);
      setBuildingData(newBuildingData);
      setRequirements(newRequirements);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border-l-4 border-blue-600">
            <div className="flex items-start">
              <div className="mr-4 hidden sm:block">
                <div className="h-12 w-12 text-blue-600 flex items-center justify-center bg-blue-100 rounded-full">
                  <BuildingIcon />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2 text-gray-800">Fire Safety Inspectors Guide</h1>
                <p className="text-gray-600">
                  This tool helps fire safety inspectors determine the requirements for buildings
                  based on the Revised Fire Code of the Philippines (RA 9514 IRR 2019).
                </p>
                <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100 flex items-start">
                  <FaInfoCircle className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Follow the steps below to determine the fire safety requirements for a building. Start by selecting the occupancy type, then add floors and building features.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="transition-all duration-300 transform hover:scale-[1.01]">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <OccupancyIcon />
                </div>
                <div className="text-lg font-semibold text-blue-800">Step 1</div>
                <FaArrowRight className="mx-2 text-gray-400" />
                <div className="text-gray-600">Select Occupancy Type</div>
              </div>
              <OccupancyTypeSelector
                selectedOccupancyType={selectedOccupancyType}
                onSelect={handleOccupancyTypeSelect}
              />
            </div>
            
            {selectedOccupancyType && (
              <div className="transition-all duration-300 transform hover:scale-[1.01]">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <FloorIcon />
                  </div>
                  <div className="text-lg font-semibold text-blue-800">Step 2</div>
                  <FaArrowRight className="mx-2 text-gray-400" />
                  <div className="text-gray-600">Add Building Floors</div>
                </div>
                <FloorManager
                  occupancyType={selectedOccupancyType}
                  floors={floors}
                  onFloorsChange={handleFloorsChange}
                />
              </div>
            )}
            
            {floors.length > 0 && (
              <div className="transition-all duration-300 transform hover:scale-[1.01]">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <BuildingIcon />
                  </div>
                  <div className="text-lg font-semibold text-blue-800">Step 3</div>
                  <FaArrowRight className="mx-2 text-gray-400" />
                  <div className="text-gray-600">Select Building Features</div>
                </div>
                <BuildingFeatures
                  features={buildingFeatures}
                  onFeaturesChange={handleFeaturesChange}
                />
              </div>
            )}
            
            {floors.length > 0 && buildingData && (
              <div className="transition-all duration-300">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <RequirementsIcon />
                  </div>
                  <div className="text-lg font-semibold text-blue-800">Step 4</div>
                  <FaArrowRight className="mx-2 text-gray-400" />
                  <div className="text-gray-600">View Fire Safety Requirements</div>
                </div>
                <RequirementsList requirements={requirements} buildingData={buildingData} />
              </div>
            )}
            
            {selectedOccupancyType && (
              <div className="transition-all duration-300 transform hover:scale-[1.01] mt-8">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <DocumentsIcon />
                  </div>
                  <div className="text-lg font-semibold text-blue-800">Additional Information</div>
                  <FaArrowRight className="mx-2 text-gray-400" />
                  <div className="text-gray-600">Required Documents for Inspection</div>
                </div>
                <DocumentRequirements occupancyType={selectedOccupancyType} />
              </div>
            )}
            
            {selectedOccupancyType && hasSpecializedRequirements(selectedOccupancyType.id) && (
              <div className="transition-all duration-300 transform hover:scale-[1.01] mt-8">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                    <FaExclamationTriangle className="text-yellow-600" />
                  </div>
                  <div className="text-lg font-semibold text-blue-800">Specialized Requirements</div>
                  <FaArrowRight className="mx-2 text-gray-400" />
                  <div className="text-gray-600">Special Provisions for {selectedOccupancyType.name}</div>
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
