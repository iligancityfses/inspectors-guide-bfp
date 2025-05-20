import React, { useState } from 'react';
import { FaCalculator, FaFire, FaDoorOpen, FaWeight } from 'react-icons/fa';
import FireFlowCalculator from './calculators/FireFlowCalculator';
import EgressCalculator from './calculators/EgressCalculator';
import FireLoadCalculator from './calculators/FireLoadCalculator';

const FireSafetyCalculators: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<string>('fire-flow');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <div className="flex items-center mb-6">
        <FaCalculator className="text-red-600 text-2xl mr-2" />
        <h2 className="text-xl font-bold">Fire Safety Calculation Tools</h2>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveCalculator('fire-flow')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeCalculator === 'fire-flow'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaFire className="mr-2" />
              Fire Flow Calculator
            </button>
            <button
              onClick={() => setActiveCalculator('egress')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeCalculator === 'egress'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaDoorOpen className="mr-2" />
              Egress Capacity Calculator
            </button>
            <button
              onClick={() => setActiveCalculator('fire-load')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeCalculator === 'fire-load'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaWeight className="mr-2" />
              Fire Load Density Calculator
            </button>
          </nav>
        </div>
      </div>
      
      <div>
        {activeCalculator === 'fire-flow' && <FireFlowCalculator />}
        {activeCalculator === 'egress' && <EgressCalculator />}
        {activeCalculator === 'fire-load' && <FireLoadCalculator />}
      </div>
    </div>
  );
};

export default FireSafetyCalculators;
