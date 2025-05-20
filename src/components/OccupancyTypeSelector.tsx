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
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Step 1: Select Occupancy Type</h2>
      <div className="mb-4">
        <label htmlFor="occupancy-type" className="block text-sm font-medium text-gray-700 mb-1">
          Building Occupancy Type
        </label>
        <select
          id="occupancy-type"
          className="select"
          value={selectedOccupancyType?.id || ''}
          onChange={(e) => {
            const selected = occupancyTypes.find(type => type.id === e.target.value);
            if (selected) {
              onSelect(selected);
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
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">{selectedOccupancyType.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{selectedOccupancyType.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-sm mb-1">
                <span className="font-medium">Occupant Load Factor:</span>{' '}
                {selectedOccupancyType.occupantLoadFactor} m² per person
              </p>
              {selectedOccupancyType.hazardClassification && (
                <p className="text-sm mb-1">
                  <span className="font-medium">Hazard Classification:</span>{' '}
                  <span className={`capitalize ${selectedOccupancyType.hazardClassification === 'high' ? 'text-red-600 font-semibold' : selectedOccupancyType.hazardClassification === 'ordinary' ? 'text-orange-500' : 'text-green-600'}`}>
                    {selectedOccupancyType.hazardClassification}
                  </span>
                </p>
              )}
            </div>
            
            {selectedOccupancyType.examples && (
              <div>
                <p className="text-sm mb-1">
                  <span className="font-medium">Examples:</span>
                </p>
                <div className="bg-blue-50 p-2 rounded-md text-sm text-gray-700 border-l-4 border-blue-400">
                  {selectedOccupancyType.examples}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-1">
              <strong>Note:</strong> The hazard classification affects fire protection requirements such as
              sprinkler density, fire extinguisher types, and other safety measures.
            </p>
            <p className="text-xs text-gray-500">
              <strong>Reference:</strong> These occupancy types and classifications are based on the Revised Fire Code of the Philippines (RA 9514 IRR 2019) Rule 10.2.3 and 10.2.4.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
