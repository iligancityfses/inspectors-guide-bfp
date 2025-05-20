'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import OccupancyTypeSelector from '@/components/OccupancyTypeSelector';
import FloorManager from '@/components/FloorManager';
import RequirementsList from '@/components/RequirementsList';
import { OccupancyType } from '@/data/occupancyTypes';
import { Floor, calculateBuildingData, determineRequiredFireSafetyMeasures } from '@/lib/calculations';
import { FireSafetyRequirement } from '@/data/fireCodeRequirements';

export default function Home() {
  const [selectedOccupancyType, setSelectedOccupancyType] = useState<OccupancyType | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [requirements, setRequirements] = useState<FireSafetyRequirement[]>([]);
  const [buildingData, setBuildingData] = useState<any>(null);

  const handleOccupancyTypeSelect = (occupancyType: OccupancyType) => {
    setSelectedOccupancyType(occupancyType);
    
    // Recalculate occupant load for existing floors if occupancy type changes
    if (floors.length > 0) {
      const updatedFloors = floors.map(floor => ({
        ...floor,
        occupantLoad: Math.ceil(floor.area / occupancyType.occupantLoadFactor),
      }));
      setFloors(updatedFloors);
      
      // Update requirements based on new occupant load
      const newBuildingData = calculateBuildingData(occupancyType, updatedFloors);
      const newRequirements = determineRequiredFireSafetyMeasures(newBuildingData);
      setBuildingData(newBuildingData);
      setRequirements(newRequirements);
    }
  };

  const handleFloorsChange = (newFloors: Floor[]) => {
    setFloors(newFloors);
    
    if (selectedOccupancyType) {
      const newBuildingData = calculateBuildingData(selectedOccupancyType, newFloors);
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2 text-gray-800">Fire Safety Inspectors Guide</h1>
                <p className="text-gray-600">
                  This tool helps fire safety inspectors determine the requirements for buildings
                  based on the Revised Fire Code of the Philippines (RA 9514 IRR 2019).
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="transition-all duration-300 transform hover:scale-[1.01]">
              <OccupancyTypeSelector
                selectedOccupancyType={selectedOccupancyType}
                onSelect={handleOccupancyTypeSelect}
              />
            </div>
            
            {selectedOccupancyType && (
              <div className="transition-all duration-300 transform hover:scale-[1.01]">
                <FloorManager
                  occupancyType={selectedOccupancyType}
                  floors={floors}
                  onFloorsChange={handleFloorsChange}
                />
              </div>
            )}
            
            {floors.length > 0 && buildingData && (
              <div className="transition-all duration-300">
                <RequirementsList requirements={requirements} buildingData={buildingData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
