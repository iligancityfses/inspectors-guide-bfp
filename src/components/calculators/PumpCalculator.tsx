import React, { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const PumpCalculator: React.FC = () => {
  const [flowRate, setFlowRate] = useState<string>('');
  const [pressure, setPressure] = useState<string>('');
  const [efficiency, setEfficiency] = useState<string>('65');
  const [horsepower, setHorsepower] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  useEffect(() => {
    calculateHorsepower();
  }, [flowRate, pressure, efficiency]);

  const calculateHorsepower = () => {
    if (!flowRate || !pressure || !efficiency) {
      setHorsepower(null);
      return;
    }

    const flowRateValue = parseFloat(flowRate);
    const pressureValue = parseFloat(pressure);
    const efficiencyValue = parseFloat(efficiency) / 100;

    if (isNaN(flowRateValue) || isNaN(pressureValue) || isNaN(efficiencyValue) || efficiencyValue <= 0 || efficiencyValue > 1) {
      setHorsepower(null);
      return;
    }

    // Formula: HP = (Flow Rate (GPM) × Pressure (PSI)) / (1714 × Efficiency)
    const hp = (flowRateValue * pressureValue) / (1714 * efficiencyValue);
    setHorsepower(hp);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">Fire Pump Horsepower Calculator</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This calculator helps determine the required pump horsepower based on flow rate, pressure, and pump efficiency.
          It uses the formula: HP = (Flow Rate × Pressure) / (1714 × Efficiency).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="flowRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Flow Rate (GPM)
          </label>
          <input
            type="number"
            id="flowRate"
            value={flowRate}
            onChange={(e) => setFlowRate(e.target.value)}
            placeholder="Enter flow rate in gallons per minute"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="0"
            step="any"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            The required flow rate in gallons per minute (GPM)
          </p>
        </div>

        <div>
          <label htmlFor="pressure" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pressure (PSI)
          </label>
          <input
            type="number"
            id="pressure"
            value={pressure}
            onChange={(e) => setPressure(e.target.value)}
            placeholder="Enter pressure in PSI"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="0"
            step="any"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            The required pressure in pounds per square inch (PSI)
          </p>
        </div>

        <div>
          <label htmlFor="efficiency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pump Efficiency (%)
          </label>
          <input
            type="number"
            id="efficiency"
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value)}
            placeholder="Enter pump efficiency percentage"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="1"
            max="100"
            step="1"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Typical pump efficiency ranges from 60% to 85% (default: 65%)
          </p>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center text-sm font-medium"
          >
            <FaInfoCircle className="mr-1" />
            {showInfo ? 'Hide information' : 'Show information'}
          </button>
        </div>
      </div>

      {horsepower !== null && (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
          <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Calculated Results</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Required Pump Horsepower:</span>
            <span className="text-xl font-bold text-green-700 dark:text-green-400">{horsepower.toFixed(2)} HP</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-700 dark:text-gray-300">Recommended Size (with 20% safety factor):</span>
            <span className="text-xl font-bold text-green-700 dark:text-green-400">{(horsepower * 1.2).toFixed(2)} HP</span>
          </div>
        </div>
      )}

      {showInfo && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">About Fire Pump Calculations</h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <p>
              Fire pumps are critical components of fire protection systems, providing the necessary water pressure and flow rate for fire suppression.
            </p>
            <h4 className="font-medium text-gray-800 dark:text-white">Key Factors:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Flow Rate (GPM):</strong> The volume of water delivered per minute, determined by fire code requirements based on building size and occupancy.</li>
              <li><strong>Pressure (PSI):</strong> The force needed to deliver water to all parts of the system, accounting for friction loss and elevation.</li>
              <li><strong>Efficiency:</strong> The percentage of input power converted to hydraulic power, typically 60-85% for fire pumps.</li>
            </ul>
            <h4 className="font-medium text-gray-800 dark:text-white">NFPA Standards:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>NFPA 20: Standard for the Installation of Stationary Pumps for Fire Protection</li>
              <li>NFPA 25: Standard for the Inspection, Testing, and Maintenance of Water-Based Fire Protection Systems</li>
            </ul>
            <p>
              Always add a safety factor (typically 20%) to the calculated horsepower to account for variations in system demand and pump performance degradation over time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PumpCalculator;
