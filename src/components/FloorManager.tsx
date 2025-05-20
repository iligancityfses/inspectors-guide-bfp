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

  const addFloor = () => {
    if (!length || !width) return;

    const lengthValue = parseFloat(length);
    const widthValue = parseFloat(width);

    if (isNaN(lengthValue) || isNaN(widthValue) || lengthValue <= 0 || widthValue <= 0) {
      alert('Please enter valid dimensions');
      return;
    }

    const area = calculateFloorArea(lengthValue, widthValue);
    const occupantLoad = calculateOccupantLoad(area, occupancyType);

    const newFloor: Floor = {
      id: `floor-${floors.length + 1}`,
      length: lengthValue,
      width: widthValue,
      area,
      occupantLoad,
    };

    onFloorsChange([...floors, newFloor]);
    setLength('');
    setWidth('');
    setCurrentFloor(currentFloor + 1);
  };

  const removeFloor = (id: string) => {
    const updatedFloors = floors.filter((floor) => floor.id !== id);
    onFloorsChange(updatedFloors);
    setCurrentFloor(updatedFloors.length + 1);
  };

  return (
    <div className="card mt-6">
      <h2 className="text-xl font-semibold mb-4">Step 2: Add Building Floors</h2>
      
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
            className="input"
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
            className="input"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="Enter width"
          />
        </div>
      </div>
      
      <button
        className="btn btn-primary mb-6"
        onClick={addFloor}
      >
        Add Floor
      </button>
      
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
