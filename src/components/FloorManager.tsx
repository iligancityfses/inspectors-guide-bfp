import React, { useState } from 'react';
import { OccupancyType } from '@/data/occupancyTypes';
import { Floor, calculateFloorArea, calculateOccupantLoad } from '@/lib/calculations';

interface FloorManagerProps {
  occupancyType: OccupancyType;
  floors: Floor[];
  onFloorsChange: (floors: Floor[]) => void;
}

export default function FloorManager({
  occupancyType,
  floors,
  onFloorsChange,
}: FloorManagerProps) {
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [currentFloor, setCurrentFloor] = useState<number>(1);
  const [numberOfFloors, setNumberOfFloors] = useState<string>('1');
  const [showBulkAdd, setShowBulkAdd] = useState<boolean>(false);

  const addFloor = (count: number = 1) => {
    if (!length || !width) return;

    const lengthValue = parseFloat(length);
    const widthValue = parseFloat(width);

    if (isNaN(lengthValue) || isNaN(widthValue) || lengthValue <= 0 || widthValue <= 0) {
      alert('Please enter valid dimensions');
      return;
    }

    const area = calculateFloorArea(lengthValue, widthValue);
    const occupantLoad = calculateOccupantLoad(area, occupancyType);
    
    const newFloors: Floor[] = [];
    
    for (let i = 0; i < count; i++) {
      newFloors.push({
        id: `floor-${floors.length + i + 1}`,
        length: lengthValue,
        width: widthValue,
        area,
        occupantLoad,
      });
    }

    onFloorsChange([...floors, ...newFloors]);
    setLength('');
    setWidth('');
    setCurrentFloor(currentFloor + count);
    setNumberOfFloors('1');
    if (count > 1) setShowBulkAdd(false);
  };

  const removeFloor = (id: string) => {
    const updatedFloors = floors.filter((floor) => floor.id !== id);
    
    // Renumber the floor IDs to maintain consistency
    const renumberedFloors = updatedFloors.map((floor, index) => ({
      ...floor,
      id: `floor-${index + 1}`
    }));
    
    onFloorsChange(renumberedFloors);
    setCurrentFloor(renumberedFloors.length + 1);
  };

  return (
    <div className="card mt-6">
      <h2 className="text-xl font-semibold mb-4">Step 2: Add Building Floors</h2>
      <p className="text-gray-600 mb-4">
        Add floors to your building. For each floor, specify the floor number, area in square meters, and height in meters.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="floor-length" className="block text-sm font-medium text-gray-700 mb-1">
            Floor {currentFloor} Length (meters)
          </label>
          <input
            id="floor-length"
            type="number"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="Enter length"
          />
        </div>
        <div>
          <label htmlFor="floor-width" className="block text-sm font-medium text-gray-700 mb-1">
            Floor {currentFloor} Width (meters)
          </label>
          <input
            id="floor-width"
            type="number"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="Enter width"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button
              className="px-4 py-2 rounded-md font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => addFloor(1)}
        >
          Add Floor
        </button>
        
        <button 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          onClick={() => setShowBulkAdd(!showBulkAdd)}
        >
          {showBulkAdd ? 'Hide bulk add' : 'Add multiple floors with same area'}
        </button>
      </div>
      
      {showBulkAdd && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">Add Multiple Floors</h3>
          <p className="text-sm text-blue-700 mb-3">Use this to quickly add multiple floors with the same dimensions.</p>
          
          <div className="flex items-end gap-4">
            <div>
              <label htmlFor="number-of-floors" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Floors to Add
              </label>
              <input
                id="number-of-floors"
                type="number"
                min="1"
                max="100"
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={numberOfFloors}
                onChange={(e) => setNumberOfFloors(e.target.value)}
              />
            </div>
            
            <button
              className="btn bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                const count = parseInt(numberOfFloors);
                if (!isNaN(count) && count > 0 && count <= 100) {
                  addFloor(count);
                } else {
                  alert('Please enter a valid number of floors (1-100)');
                }
              }}
            >
              Add {numberOfFloors} Floor{parseInt(numberOfFloors) !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}
      
      {floors.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Added Floors</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Floor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dimensions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Area (m²)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Occupant Load
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {floors.map((floor, index) => (
                  <tr key={floor.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {floor.length} m × {floor.width} m
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {floor.area.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {floor.occupantLoad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => removeFloor(floor.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </td>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    -
                  </td>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {floors.reduce((sum, floor) => sum + floor.area, 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {floors.reduce((sum, floor) => sum + floor.occupantLoad, 0)}
                  </td>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    -
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
