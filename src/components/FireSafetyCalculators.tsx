import React, { useState } from 'react';
import { FaCalculator, FaFire, FaDoorOpen, FaWeight, FaTachometerAlt } from 'react-icons/fa';
import FireFlowCalculator from './calculators/FireFlowCalculator';
import EgressCalculator from './calculators/EgressCalculator';
import FireLoadCalculator from './calculators/FireLoadCalculator';
import PumpCalculator from './calculators/PumpCalculator';

const FireSafetyCalculators: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<string>('fire-flow');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
      <div className="flex items-center mb-6">
        <FaCalculator className="text-red-600 dark:text-red-400 text-2xl mr-2" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fire Safety Calculation Tools</h2>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveCalculator('fire-flow')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeCalculator === 'fire-flow'
                  ? 'border-red-500 text-red-600 dark:text-red-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <FaFire className="mr-2" />
              Fire Flow Calculator
            </button>
            <button
              onClick={() => setActiveCalculator('egress')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeCalculator === 'egress'
                  ? 'border-red-500 text-red-600 dark:text-red-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <FaDoorOpen className="mr-2" />
              Egress Capacity Calculator
            </button>
            <button
              onClick={() => setActiveCalculator('fire-load')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeCalculator === 'fire-load'
                  ? 'border-red-500 text-red-600 dark:text-red-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <FaWeight className="mr-2" />
              Fire Load Density Calculator
            </button>
            <button
              onClick={() => setActiveCalculator('pump')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeCalculator === 'pump'
                  ? 'border-red-500 text-red-600 dark:text-red-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <FaTachometerAlt className="mr-2" />
              Pump Horsepower Calculator
            </button>
          </nav>
        </div>
      </div>
      
      <div>
        {activeCalculator === 'fire-flow' && <FireFlowCalculator />}
        {activeCalculator === 'egress' && <EgressCalculator />}
        {activeCalculator === 'fire-load' && <FireLoadCalculator />}
        {activeCalculator === 'pump' && <PumpCalculator />}
      </div>
    </div>
  );
};

export default FireSafetyCalculators;
