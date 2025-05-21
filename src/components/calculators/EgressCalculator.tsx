import React, { useState, useEffect } from 'react';
import { FaCalculator, FaInfoCircle, FaPlus, FaTrash } from 'react-icons/fa';

interface EgressComponent {
  id: string;
  type: 'door' | 'stairway' | 'ramp' | 'corridor';
  width: number;
  location: string;
  capacityFactor: number;
}

const EgressCalculator: React.FC = () => {
  const [occupantLoad, setOccupantLoad] = useState<number>(0);
  const [occupancyType, setOccupancyType] = useState<string>('business');
  const [egressComponents, setEgressComponents] = useState<EgressComponent[]>([
    { id: '1', type: 'door', width: 0, location: 'Main Exit', capacityFactor: 0 }
  ]);
  const [totalEgressCapacity, setTotalEgressCapacity] = useState<number>(0);
  const [egressDeficiency, setEgressDeficiency] = useState<number>(0);
  const [isDeficient, setIsDeficient] = useState<boolean>(false);
  
  // Capacity factors per occupancy type (persons per unit of exit width in mm)
  const capacityFactors = {
    door: {
      'assembly': 0.2, // 5mm per person
      'educational': 0.2,
      'healthcare-hospitals': 0.3, // 3.3mm per person
      'healthcare-outpatient': 0.2,
      'healthcare-nursing-homes': 0.3,
      'institutional-restrained': 0.3,
      'institutional-general': 0.3,
      'mercantile': 0.2,
      'business': 0.2,
      'industrial-general': 0.2,
      'industrial-special': 0.2,
      'industrial-high-hazard': 0.3,
      'storage-low-hazard': 0.2,
      'storage-moderate-hazard': 0.2,
      'storage-high-hazard': 0.3,
      'residential-hotel': 0.2,
      'residential-apartment': 0.2,
      'residential-dormitories': 0.2,
      'residential-single-family': 0.2,
      'residential-two-family': 0.2,
      'default': 0.2
    },
    stairway: {
      'assembly': 0.375, // 2.7mm per person
      'educational': 0.375,
      'healthcare-hospitals': 0.5, // 2mm per person
      'healthcare-outpatient': 0.375,
      'healthcare-nursing-homes': 0.5,
      'institutional-restrained': 0.5,
      'institutional-general': 0.5,
      'mercantile': 0.375,
      'business': 0.375,
      'industrial-general': 0.375,
      'industrial-special': 0.375,
      'industrial-high-hazard': 0.5,
      'storage-low-hazard': 0.375,
      'storage-moderate-hazard': 0.375,
      'storage-high-hazard': 0.5,
      'residential-hotel': 0.375,
      'residential-apartment': 0.375,
      'residential-dormitories': 0.375,
      'residential-single-family': 0.375,
      'residential-two-family': 0.375,
      'default': 0.375
    },
    ramp: {
      'assembly': 0.22, // 4.5mm per person
      'educational': 0.22,
      'healthcare-hospitals': 0.3,
      'healthcare-outpatient': 0.22,
      'healthcare-nursing-homes': 0.3,
      'institutional-restrained': 0.3,
      'institutional-general': 0.3,
      'mercantile': 0.22,
      'business': 0.22,
      'industrial-general': 0.22,
      'industrial-special': 0.22,
      'industrial-high-hazard': 0.3,
      'storage-low-hazard': 0.22,
      'storage-moderate-hazard': 0.22,
      'storage-high-hazard': 0.3,
      'residential-hotel': 0.22,
      'residential-apartment': 0.22,
      'residential-dormitories': 0.22,
      'residential-single-family': 0.22,
      'residential-two-family': 0.22,
      'default': 0.22
    },
    corridor: {
      'assembly': 0.2,
      'educational': 0.2,
      'healthcare-hospitals': 0.3,
      'healthcare-outpatient': 0.2,
      'healthcare-nursing-homes': 0.3,
      'institutional-restrained': 0.3,
      'institutional-general': 0.3,
      'mercantile': 0.2,
      'business': 0.2,
      'industrial-general': 0.2,
      'industrial-special': 0.2,
      'industrial-high-hazard': 0.3,
      'storage-low-hazard': 0.2,
      'storage-moderate-hazard': 0.2,
      'storage-high-hazard': 0.3,
      'residential-hotel': 0.2,
      'residential-apartment': 0.2,
      'residential-dormitories': 0.2,
      'residential-single-family': 0.2,
      'residential-two-family': 0.2,
      'default': 0.2
    }
  };
  
  // Minimum widths (in mm)
  const minimumWidths = {
    door: 810, // 32 inches
    stairway: 1120, // 44 inches
    ramp: 1120, // 44 inches
    corridor: 1120 // 44 inches
  };
  
  // Calculate capacity for a component
  const calculateComponentCapacity = (component: EgressComponent): number => {
    if (component.width <= 0) return 0;
    
    // Get capacity factor based on type and occupancy
    // Use type assertion to help TypeScript understand the structure
    const factorsForType = capacityFactors[component.type] as Record<string, number>;
    const factor = factorsForType[occupancyType] || factorsForType.default;
    
    // Apply minimum width requirements
    const effectiveWidth = Math.max(0, component.width - minimumWidths[component.type]);
    
    // Calculate capacity
    return Math.floor(effectiveWidth * factor);
  };
  
  // Calculate capacity for each egress component and total
  useEffect(() => {
    const updatedComponents = egressComponents.map(component => {
      const capacity = calculateComponentCapacity(component);
      
      return {
        ...component,
        capacityFactor: capacity
      };
    });
    
    setEgressComponents(updatedComponents);
    
    // Calculate total egress capacity
    const total = updatedComponents.reduce((sum, component) => sum + component.capacityFactor, 0);
    setTotalEgressCapacity(total);
    
    // Check if egress is deficient
    const deficiency = occupantLoad - total;
    setEgressDeficiency(deficiency > 0 ? deficiency : 0);
    setIsDeficient(deficiency > 0);
    
  }, [egressComponents, occupancyType, occupantLoad]);
  
  // Add new egress component
  const addEgressComponent = () => {
    const newId = (egressComponents.length + 1).toString();
    setEgressComponents([
      ...egressComponents,
      { id: newId, type: 'door', width: 0, location: `Exit ${newId}`, capacityFactor: 0 }
    ]);
  };
  
  // Remove egress component
  const removeEgressComponent = (id: string) => {
    if (egressComponents.length > 1) {
      setEgressComponents(egressComponents.filter(component => component.id !== id));
    }
  };
  
  // Update egress component
  const updateEgressComponent = (id: string, field: keyof EgressComponent, value: any) => {
    setEgressComponents(egressComponents.map(component => 
      component.id === id ? { ...component, [field]: value } : component
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FaCalculator className="text-green-600 text-2xl mr-2" />
        <h2 className="text-xl font-bold">Egress Capacity Calculator</h2>
      </div>
      
      <div className="text-sm text-blue-600 dark:text-blue-300 mt-1">
        <p>This calculator determines if your means of egress (exits) provide sufficient capacity for the building's occupant load, based on the Revised Fire Code of the Philippines and NFPA 101 Life Safety Code.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Occupant Load
            </label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={occupantLoad || ''}
              onChange={(e) => setOccupantLoad(Number(e.target.value))}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Total number of people expected to occupy the space
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Occupancy Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={occupancyType}
              onChange={(e) => setOccupancyType(e.target.value)}
            >
              <option value="assembly">Assembly</option>
              <option value="educational">Educational</option>
              <option value="healthcare-hospitals">Healthcare - Hospitals</option>
              <option value="healthcare-outpatient">Healthcare - Outpatient</option>
              <option value="healthcare-nursing-homes">Healthcare - Nursing Homes</option>
              <option value="institutional-restrained">Institutional - Restrained</option>
              <option value="institutional-general">Institutional - General</option>
              <option value="mercantile">Mercantile</option>
              <option value="business">Business</option>
              <option value="industrial-general">Industrial - General</option>
              <option value="industrial-special">Industrial - Special</option>
              <option value="industrial-high-hazard">Industrial - High Hazard</option>
              <option value="storage-low-hazard">Storage - Low Hazard</option>
              <option value="storage-moderate-hazard">Storage - Moderate Hazard</option>
              <option value="storage-high-hazard">Storage - High Hazard</option>
              <option value="residential-hotel">Residential - Hotel</option>
              <option value="residential-apartment">Residential - Apartment</option>
              <option value="residential-dormitories">Residential - Dormitories</option>
              <option value="residential-single-family">Residential - Single Family</option>
              <option value="residential-two-family">Residential - Two Family</option>
            </select>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Egress Capacity Summary</h3>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-blue-700 dark:text-blue-400">{totalEgressCapacity}</span>
              <span className="ml-2 text-blue-600 dark:text-blue-300">persons</span>
            </div>
            
            <div className={`mt-4 ${isDeficient ? 'text-red-600' : 'text-green-600'}`}>
              <p className="font-medium">
                {isDeficient 
                  ? `⚠️ Deficient by ${egressDeficiency} persons` 
                  : '✓ Sufficient egress capacity'}
              </p>
              <p className="text-sm mt-1">
                {isDeficient 
                  ? 'Additional exits or wider exits are required to accommodate the occupant load.' 
                  : 'The provided exits can safely accommodate the occupant load.'}
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Egress Components</h3>
            <button
              type="button"
              onClick={addEgressComponent}
              className="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center text-sm"
            >
              <FaPlus className="mr-1" /> Add Exit
            </button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {egressComponents.map((component) => (
              <div key={component.id} className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="font-medium">{component.location}</span>
                  </div>
                  {egressComponents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEgressComponent(component.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <select
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                      value={component.type}
                      onChange={(e) => updateEgressComponent(component.id, 'type', e.target.value)}
                    >
                      <option value="door">Door</option>
                      <option value="stairway">Stairway</option>
                      <option value="ramp">Ramp</option>
                      <option value="corridor">Corridor</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                      value={component.location}
                      onChange={(e) => updateEgressComponent(component.id, 'location', e.target.value)}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Width (mm)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                      value={component.width || ''}
                      onChange={(e) => updateEgressComponent(component.id, 'width', Number(e.target.value))}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Minimum required: {minimumWidths[component.type]} mm
                    </p>
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Capacity:</span>
                    <span className="font-medium">{component.capacityFactor} persons</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm text-yellow-800 dark:text-yellow-300">
        <div className="flex items-start">
          <FaInfoCircle className="text-yellow-600 dark:text-yellow-400 mt-1 mr-2" />
          <div>
            <p><strong>Note:</strong> This calculator provides an estimate based on standard formulas from NFPA 101 Life Safety Code and the Revised Fire Code of the Philippines. Actual requirements may vary based on local conditions and BFP regulations.</p>
            <p className="mt-2">Remember that at least two exits are required for most occupancies with an occupant load of 50 or more, and the travel distance to exits must not exceed the maximum allowed for your occupancy type.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EgressCalculator;
