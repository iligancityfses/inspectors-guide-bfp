import React from 'react';
import { occupancyTypes, OccupancyType } from '@/data/occupancyTypes';

interface OccupancyTypeSelectorProps {
  selectedOccupancyType: OccupancyType | null;
  onSelect: (occupancyType: OccupancyType) => void;
}

export default function OccupancyTypeSelector({
  selectedOccupancyType,
  onSelect,
}: OccupancyTypeSelectorProps) {
  // Force a re-render when selectedOccupancyType changes
  React.useEffect(() => {
    console.log('OccupancyTypeSelector received selectedOccupancyType:', selectedOccupancyType);
  }, [selectedOccupancyType]);
  return (
    <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Step 1: Select Occupancy Type</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Select the occupancy type that best matches your building. This will determine the occupant load factor and applicable requirements.
      </p>
      <div className="mb-4">
        <label htmlFor="occupancy-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Building Occupancy Type
        </label>
        <select
          id="occupancy-type"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          value={selectedOccupancyType?.id || ''}
          onChange={(e) => {
            console.log('Selected value:', e.target.value);
            const selected = occupancyTypes.find(type => type.id === e.target.value);
            console.log('Found occupancy type:', selected);
            if (selected) {
              console.log('Calling onSelect with:', selected);
              // Force the event to be handled synchronously
              setTimeout(() => onSelect(selected), 0);
            }
          }}
        >
          <option value="" disabled>
            Select an occupancy type
          </option>
          {occupancyTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      
      {selectedOccupancyType && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h3 className="font-medium mb-2 dark:text-white">{selectedOccupancyType.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{selectedOccupancyType.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-sm mb-1 dark:text-gray-300">
                <span className="font-medium">Occupant Load Factor:</span>{' '}
                {selectedOccupancyType.occupantLoadFactor} m² per person
              </p>
              {selectedOccupancyType.hazardClassification && (
                <p className="text-sm mb-1 dark:text-gray-300">
                  <span className="font-medium">Hazard Classification:</span>{' '}
                  <span className={`capitalize ${selectedOccupancyType.hazardClassification === 'high' ? 'text-red-600 dark:text-red-400 font-semibold' : selectedOccupancyType.hazardClassification === 'ordinary' ? 'text-orange-500 dark:text-orange-300' : 'text-green-600 dark:text-green-400'}`}>
                    {selectedOccupancyType.hazardClassification}
                  </span>
                </p>
              )}
            </div>
            
            {selectedOccupancyType.examples && (
              <div>
                <p className="text-sm mb-1 dark:text-gray-300">
                  <span className="font-medium">Examples:</span>
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-md text-sm text-gray-700 dark:text-gray-200 border-l-4 border-blue-400 dark:border-blue-500">
                  {selectedOccupancyType.examples}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              <strong>Note:</strong> The hazard classification affects fire protection requirements such as
              sprinkler density, fire extinguisher types, and other safety measures.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <strong>Reference:</strong> These occupancy types and classifications are based on the Revised Fire Code of the Philippines (RA 9514 IRR 2019) Rule 10.2.3 and 10.2.4.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
