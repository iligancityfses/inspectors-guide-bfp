import React, { useState, useEffect } from 'react';
import { FaCalculator, FaInfoCircle } from 'react-icons/fa';

interface ConstructionType {
  id: string;
  name: string;
  description: string;
  fireResistanceRating: string;
  coefficient: number;
}

const constructionTypes: ConstructionType[] = [
  {
    id: 'type-i',
    name: 'Type I (Fire Resistive)',
    description: 'Structural elements made of non-combustible materials with the highest fire resistance rating.',
    fireResistanceRating: '3-4 hours',
    coefficient: 0.6
  },
  {
    id: 'type-ii',
    name: 'Type II (Non-Combustible)',
    description: 'Structural elements made of non-combustible materials with moderate fire resistance rating.',
    fireResistanceRating: '1-2 hours',
    coefficient: 0.8
  },
  {
    id: 'type-iii',
    name: 'Type III (Ordinary)',
    description: 'Exterior walls made of non-combustible materials, interior structure may be combustible.',
    fireResistanceRating: '1 hour',
    coefficient: 1.0
  },
  {
    id: 'type-iv',
    name: 'Type IV (Heavy Timber)',
    description: 'Exterior walls made of non-combustible materials, interior structure of heavy timber.',
    fireResistanceRating: '1 hour',
    coefficient: 0.9
  },
  {
    id: 'type-v',
    name: 'Type V (Wood Frame)',
    description: 'Structural elements made of combustible materials with minimal fire resistance rating.',
    fireResistanceRating: '0-1 hour',
    coefficient: 1.5
  }
];

const FireFlowCalculator: React.FC = () => {
  const [buildingArea, setBuildingArea] = useState<number>(0);
  const [constructionType, setConstructionType] = useState<string>('type-iii');
  const [exposures, setExposures] = useState<number>(0);
  const [occupancyHazard, setOccupancyHazard] = useState<string>('moderate');
  const [sprinklered, setSprinklered] = useState<boolean>(false);
  const [requiredFireFlow, setRequiredFireFlow] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  
  // Calculate fire flow based on inputs
  useEffect(() => {
    if (buildingArea <= 0) {
      setRequiredFireFlow(0);
      setDuration(0);
      return;
    }
    
    // Get construction coefficient
    const selectedType = constructionTypes.find(type => type.id === constructionType);
    const constructionCoefficient = selectedType ? selectedType.coefficient : 1.0;
    
    // Calculate base fire flow (NFF formula - based on NFPA 1142)
    // NFF = (A × C) ÷ 3
    // Where: A = total floor area in square feet, C = construction coefficient
    const areaInSquareFeet = buildingArea * 10.764; // Convert m² to ft²
    let baseFlow = (areaInSquareFeet * constructionCoefficient) / 3;
    
    // Apply occupancy hazard adjustment
    let occupancyFactor = 1.0;
    switch (occupancyHazard) {
      case 'light':
        occupancyFactor = 0.75;
        break;
      case 'moderate':
        occupancyFactor = 1.0;
        break;
      case 'high':
        occupancyFactor = 1.25;
        break;
      default:
        occupancyFactor = 1.0;
    }
    
    baseFlow = baseFlow * occupancyFactor;
    
    // Apply exposure factor (5-10% per exposure side)
    const exposureFactor = 1 + (exposures * 0.075);
    baseFlow = baseFlow * exposureFactor;
    
    // Apply sprinkler reduction (up to 50% reduction if sprinklered)
    if (sprinklered) {
      baseFlow = baseFlow * 0.5;
    }
    
    // Round to nearest 250 GPM (minimum 500 GPM)
    const roundedFlow = Math.max(500, Math.ceil(baseFlow / 250) * 250);
    setRequiredFireFlow(roundedFlow);
    
    // Calculate duration based on flow rate (per NFPA 1)
    let flowDuration = 2; // Default minimum 2 hours
    if (roundedFlow > 2500 && roundedFlow <= 3500) {
      flowDuration = 3;
    } else if (roundedFlow > 3500) {
      flowDuration = 4;
    }
    
    setDuration(flowDuration);
    
  }, [buildingArea, constructionType, exposures, occupancyHazard, sprinklered]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FaCalculator className="text-blue-600 text-2xl mr-2" />
        <h2 className="text-xl font-bold">Fire Flow Calculator</h2>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        <p>This calculator determines the required fire flow (water supply) for firefighting operations based on building characteristics. The calculation is based on NFPA 1142 and adjusted for Philippine conditions.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Building Area (m²)
            </label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={buildingArea || ''}
              onChange={(e) => setBuildingArea(Number(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Construction Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={constructionType}
              onChange={(e) => setConstructionType(e.target.value)}
            >
              {constructionTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {constructionTypes.find(type => type.id === constructionType)?.description}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Exposures (0-4)
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={exposures}
              onChange={(e) => setExposures(Number(e.target.value))}
            >
              <option value={0}>0 - No exposures (standalone building)</option>
              <option value={1}>1 - One side exposed</option>
              <option value={2}>2 - Two sides exposed</option>
              <option value={3}>3 - Three sides exposed</option>
              <option value={4}>4 - Four sides exposed</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Exposures are nearby buildings that could be threatened by fire spread
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Occupancy Hazard Classification
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={occupancyHazard}
              onChange={(e) => setOccupancyHazard(e.target.value)}
            >
              <option value="light">Light Hazard (Residential, Office, Church)</option>
              <option value="moderate">Moderate Hazard (Retail, Educational, Manufacturing)</option>
              <option value="high">High Hazard (Warehouse, Industrial, Chemical Storage)</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sprinklered"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={sprinklered}
              onChange={(e) => setSprinklered(e.target.checked)}
            />
            <label htmlFor="sprinklered" className="ml-2 block text-sm text-gray-700">
              Building is fully sprinklered
            </label>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">Required Fire Flow</h3>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-blue-700">{requiredFireFlow.toLocaleString()}</span>
              <span className="ml-2 text-blue-600">GPM (Gallons Per Minute)</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              {requiredFireFlow > 0 ? `${Math.round(requiredFireFlow * 3.785 / 60)} liters per second` : ''}
            </p>
            
            <h3 className="font-semibold text-blue-800 mt-4 mb-2">Duration Required</h3>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-700">{duration}</span>
              <span className="ml-2 text-blue-600">hours</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              {requiredFireFlow > 0 ? `Total water required: ${(requiredFireFlow * duration * 60).toLocaleString()} gallons (${Math.round(requiredFireFlow * duration * 60 * 3.785).toLocaleString()} liters)` : ''}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
        <div className="flex items-start">
          <FaInfoCircle className="text-yellow-600 mt-1 mr-2" />
          <div>
            <p><strong>Note:</strong> This calculator provides an estimate based on standard formulas. Actual requirements may vary based on local conditions and BFP regulations. Always consult with your local fire officials for official determinations.</p>
            <p className="mt-2">Reference: NFPA 1142 Standard on Water Supplies for Suburban and Rural Fire Fighting, adapted for Philippine conditions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FireFlowCalculator;
