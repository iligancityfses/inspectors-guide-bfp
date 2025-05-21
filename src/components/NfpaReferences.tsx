import React, { useState } from 'react';
import { nfpaReferences, additionalNfpaStandards } from '@/data/nfpaReferences';

interface NfpaReferencesProps {
  buildingData?: {
    occupantLoad: number;
    stories: number;
    floorArea: number;
    buildingHeight?: number;
  };
}

export default function NfpaReferences({ buildingData }: NfpaReferencesProps = {}) {
  const [activeTab, setActiveTab] = useState<string>('alternatePower');
  
  // Determine if sprinkler system is required based on building data
  const isSprinklerRequired = buildingData ? (
    buildingData.occupantLoad > 500 || 
    buildingData.stories >= 5 || 
    (buildingData.buildingHeight && buildingData.buildingHeight > 15) ||
    buildingData.floorArea > 2000
  ) : false;
  
  const renderAlternatePowerSupply = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Fire Detection and Alarm Systems (NFPA 72)</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {nfpaReferences.alternatePowerSupply.fdas.requirements.map((req, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">{req}</li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Sprinkler Systems (NFPA 20)</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {nfpaReferences.alternatePowerSupply.sprinkler.requirements.map((req, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">{req}</li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Elevators (NFPA 70/72/101)</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {nfpaReferences.alternatePowerSupply.elevators.requirements.map((req, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">{req}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  const renderFiremanSwitch = () => {
    return (
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Fireman Switch for Elevators (NFPA 72)</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {nfpaReferences.firemanSwitch.requirements.map((req, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300">{req}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  const renderSprinklerByFloors = () => {
    if (!buildingData) {
      return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">Please enter building information to see specific sprinkler system requirements based on number of floors.</p>
        </div>
      );
    }
    
    if (!isSprinklerRequired) {
      return (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">Sprinkler System Not Required</h3>
          <p className="text-sm text-green-700 dark:text-green-300">Based on the building characteristics provided, an automatic sprinkler system is not required according to RA 9514 IRR Rule 10.2.6.4.</p>
          <p className="text-sm text-green-700 dark:text-green-300 mt-2">Sprinkler systems are required for buildings that meet any of these criteria:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-green-700 dark:text-green-300 mt-2">
            <li>Building height exceeds 15 meters (50 feet)</li>
            <li>Building has 5 or more stories</li>
            <li>Occupant load exceeds 500 persons</li>
            <li>Total floor area exceeds 2,000 square meters</li>
          </ul>
        </div>
      );
    }
    
    // Determine which floor requirement to show based on the number of stories
    const stories = buildingData.stories;
    const applicableRequirements = nfpaReferences.sprinklerSystemByFloors.requirements.filter(req => {
      const floorRange = req.floors.split('-');
      if (floorRange.length === 1) {
        // Single floor number (e.g., "1")
        return parseInt(floorRange[0]) === stories;
      } else if (floorRange.length === 2) {
        // Floor range (e.g., "1-2" or "3-6")
        const min = parseInt(floorRange[0]);
        const max = floorRange[1] === '+' ? Infinity : parseInt(floorRange[1]);
        return stories >= min && stories <= max;
      }
      return false;
    });
    
    return (
      <div className="space-y-4">
        {applicableRequirements.length > 0 ? (
          applicableRequirements.map((req, index) => (
            <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">{req.floors} Floor(s)</h3>
              <div className="space-y-2 text-sm dark:text-gray-300">
                <p><span className="font-medium">System Type:</span> {req.system}</p>
                <p><span className="font-medium">Pressure Requirements:</span> {req.pressure}</p>
                <p><span className="font-medium">Water Supply:</span> {req.waterSupply}</p>
                {req.additional && <p><span className="font-medium">Additional Requirements:</span> {req.additional}</p>}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-700 dark:text-gray-300">Showing all sprinkler system requirements by floor count:</p>
            {nfpaReferences.sprinklerSystemByFloors.requirements.map((req, index) => (
              <div key={index} className="mt-4 p-3 border border-gray-200 dark:border-gray-600 rounded">
                <h3 className="text-md font-semibold text-blue-800 dark:text-blue-300 mb-2">{req.floors} Floor(s)</h3>
                <div className="space-y-2 text-sm dark:text-gray-300">
                  <p><span className="font-medium">System Type:</span> {req.system}</p>
                  <p><span className="font-medium">Pressure Requirements:</span> {req.pressure}</p>
                  <p><span className="font-medium">Water Supply:</span> {req.waterSupply}</p>
                  {req.additional && <p><span className="font-medium">Additional Requirements:</span> {req.additional}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  const renderStandards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {additionalNfpaStandards.map((standard, index) => (
          <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">{standard.code}: {standard.title}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{standard.relevance}</p>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">NFPA References</h2>
      
      {buildingData && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Building Information</h3>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div className="dark:text-gray-300"><span className="font-medium">Occupant Load:</span> {buildingData.occupantLoad}</div>
            <div className="dark:text-gray-300"><span className="font-medium">Number of Stories:</span> {buildingData.stories}</div>
            <div className="dark:text-gray-300"><span className="font-medium">Total Floor Area:</span> {buildingData.floorArea.toFixed(2)} m²</div>
            {buildingData.buildingHeight && (
              <div className="dark:text-gray-300"><span className="font-medium">Building Height:</span> {buildingData.buildingHeight} m</div>
            )}
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'alternatePower' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('alternatePower')}
          >
            Alternate Power Supply
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'firemanSwitch' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('firemanSwitch')}
          >
            Fireman Switch
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'sprinklerByFloors' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('sprinklerByFloors')}
          >
            Sprinkler by Floors
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'standards' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('standards')}
          >
            NFPA Standards
          </button>
        </div>
      </div>
      
      <div className="mt-6">
        {activeTab === 'alternatePower' && renderAlternatePowerSupply()}
        {activeTab === 'firemanSwitch' && renderFiremanSwitch()}
        {activeTab === 'sprinklerByFloors' && renderSprinklerByFloors()}
        {activeTab === 'standards' && renderStandards()}
      </div>
    </div>
  );
}
