import React, { useState, useEffect } from 'react';
import { calculatePumpHorsepower, PUMP_CONSTANTS } from '@/lib/calculations';

interface PumpHorsepowerCalculatorProps {
  initialFlowRate?: number;
  initialPressure?: number;
}

const PumpHorsepowerCalculator: React.FC<PumpHorsepowerCalculatorProps> = ({ 
  initialFlowRate = 500, 
  initialPressure = 100 
}) => {
  const [flowRate, setFlowRate] = useState<number>(initialFlowRate);
  const [pressure, setPressure] = useState<number>(initialPressure);
  const [efficiency, setEfficiency] = useState<number>(PUMP_CONSTANTS.EFFICIENCY * 100);
  const [horsepower, setHorsepower] = useState<number>(0);
  const [recommendedHP, setRecommendedHP] = useState<number>(0);

  useEffect(() => {
    const hp = calculatePumpHorsepower(flowRate, pressure, efficiency / 100);
    setHorsepower(hp);
    setRecommendedHP(Math.ceil(hp * 1.2)); // Add 20% safety factor
  }, [flowRate, pressure, efficiency]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 my-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
        Fire Pump Horsepower Calculator
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="flowRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Flow Rate (GPM)
          </label>
          <input
            type="number"
            id="flowRate"
            value={flowRate}
            onChange={(e) => setFlowRate(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="0"
          />
        </div>
        
        <div>
          <label htmlFor="pressure" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pressure (PSI)
          </label>
          <input
            type="number"
            id="pressure"
            value={pressure}
            onChange={(e) => setPressure(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="0"
          />
        </div>
        
        <div>
          <label htmlFor="efficiency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pump Efficiency (%)
          </label>
          <input
            type="number"
            id="efficiency"
            value={efficiency}
            onChange={(e) => setEfficiency(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="1"
            max="100"
          />
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 dark:text-gray-300">Required Pump Horsepower:</span>
          <span className="text-lg font-bold text-blue-700 dark:text-blue-400">{horsepower.toFixed(2)} HP</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">Recommended Size (with 20% safety factor):</span>
          <span className="text-lg font-bold text-blue-700 dark:text-blue-400">{recommendedHP} HP</span>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        <p>Formula: HP = (Flow Rate × Pressure) / (1714 × Efficiency)</p>
      </div>
    </div>
  );
};

export default PumpHorsepowerCalculator;
