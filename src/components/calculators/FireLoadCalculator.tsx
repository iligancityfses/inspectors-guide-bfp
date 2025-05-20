import React, { useState, useEffect } from 'react';
import { FaCalculator, FaInfoCircle, FaPlus, FaTrash } from 'react-icons/fa';

interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: 'kg' | 'pcs' | 'm2' | 'm3';
  calorificValue: number;
  weight: number;
  totalEnergy: number;
}

// Common materials with their calorific values in MJ/kg
const commonMaterials = [
  { name: 'Wood (general)', calorificValue: 16.7, weight: 700 }, // weight in kg/m3
  { name: 'Paper', calorificValue: 17.5, weight: 1.0 }, // weight per piece in kg
  { name: 'Cardboard', calorificValue: 16.9, weight: 0.5 }, // weight per piece in kg
  { name: 'Textiles (Cotton)', calorificValue: 19.0, weight: 1.0 }, // weight per m2 in kg
  { name: 'Textiles (Synthetic)', calorificValue: 28.0, weight: 1.0 }, // weight per m2 in kg
  { name: 'Plastics (PVC)', calorificValue: 17.8, weight: 1380 }, // weight in kg/m3
  { name: 'Plastics (Polyethylene)', calorificValue: 46.5, weight: 950 }, // weight in kg/m3
  { name: 'Plastics (Polystyrene)', calorificValue: 40.0, weight: 1050 }, // weight in kg/m3
  { name: 'Rubber', calorificValue: 32.0, weight: 1200 }, // weight in kg/m3
  { name: 'Leather', calorificValue: 19.0, weight: 860 }, // weight in kg/m3
  { name: 'Alcohol (Ethanol)', calorificValue: 29.7, weight: 789 }, // weight in kg/m3
  { name: 'Gasoline', calorificValue: 46.0, weight: 750 }, // weight in kg/m3
  { name: 'Diesel', calorificValue: 45.0, weight: 850 }, // weight in kg/m3
  { name: 'Kerosene', calorificValue: 43.0, weight: 820 }, // weight in kg/m3
  { name: 'Furniture (Wood, average)', calorificValue: 18.0, weight: 25 }, // weight per piece in kg
  { name: 'Furniture (Upholstered)', calorificValue: 22.0, weight: 45 }, // weight per piece in kg
  { name: 'Electronics (Small)', calorificValue: 15.0, weight: 5 }, // weight per piece in kg
  { name: 'Electronics (Large)', calorificValue: 15.0, weight: 20 }, // weight per piece in kg
  { name: 'Food (Dry goods)', calorificValue: 17.0, weight: 1.0 }, // weight per kg
  { name: 'Clothing', calorificValue: 20.0, weight: 0.5 }, // weight per piece in kg
  { name: 'Custom Material', calorificValue: 0, weight: 1.0 } // Custom entry
];

const FireLoadCalculator: React.FC = () => {
  const [roomArea, setRoomArea] = useState<number>(0);
  const [materials, setMaterials] = useState<Material[]>([
    { 
      id: '1', 
      name: 'Wood (general)', 
      quantity: 0, 
      unit: 'm3', 
      calorificValue: 16.7,
      weight: 700,
      totalEnergy: 0
    }
  ]);
  const [totalFireLoad, setTotalFireLoad] = useState<number>(0);
  const [fireLoadDensity, setFireLoadDensity] = useState<number>(0);
  const [hazardClassification, setHazardClassification] = useState<string>('');
  const [customMaterialName, setCustomMaterialName] = useState<string>('');
  const [customCalorificValue, setCustomCalorificValue] = useState<number>(0);
  const [customWeight, setCustomWeight] = useState<number>(1);
  
  // Calculate fire load based on materials
  useEffect(() => {
    if (roomArea <= 0) {
      setTotalFireLoad(0);
      setFireLoadDensity(0);
      setHazardClassification('');
      return;
    }
    
    // Calculate total energy content
    const updatedMaterials = materials.map(material => {
      let totalWeight = 0;
      
      // Calculate weight based on unit
      switch (material.unit) {
        case 'kg':
          totalWeight = material.quantity;
          break;
        case 'pcs':
          totalWeight = material.quantity * material.weight;
          break;
        case 'm2':
          totalWeight = material.quantity * material.weight;
          break;
        case 'm3':
          totalWeight = material.quantity * material.weight;
          break;
        default:
          totalWeight = material.quantity;
      }
      
      // Calculate total energy (MJ)
      const totalEnergy = totalWeight * material.calorificValue;
      
      return {
        ...material,
        totalEnergy
      };
    });
    
    setMaterials(updatedMaterials);
    
    // Calculate total fire load (MJ)
    const total = updatedMaterials.reduce((sum, material) => sum + material.totalEnergy, 0);
    setTotalFireLoad(total);
    
    // Calculate fire load density (MJ/m²)
    const density = total / roomArea;
    setFireLoadDensity(density);
    
    // Determine hazard classification
    if (density < 600) {
      setHazardClassification('Light Hazard');
    } else if (density >= 600 && density < 1200) {
      setHazardClassification('Ordinary Hazard Group 1');
    } else if (density >= 1200 && density < 2400) {
      setHazardClassification('Ordinary Hazard Group 2');
    } else {
      setHazardClassification('High Hazard');
    }
    
  }, [materials, roomArea]);
  
  // Add new material
  const addMaterial = () => {
    const newId = (materials.length + 1).toString();
    setMaterials([
      ...materials,
      { 
        id: newId, 
        name: 'Wood (general)', 
        quantity: 0, 
        unit: 'm3', 
        calorificValue: 16.7,
        weight: 700,
        totalEnergy: 0
      }
    ]);
  };
  
  // Remove material
  const removeMaterial = (id: string) => {
    if (materials.length > 1) {
      setMaterials(materials.filter(material => material.id !== id));
    }
  };
  
  // Update material
  const updateMaterial = (id: string, field: keyof Material, value: any) => {
    setMaterials(materials.map(material => {
      if (material.id === id) {
        if (field === 'name') {
          // Update calorific value and weight based on selected material
          const selectedMaterial = commonMaterials.find(m => m.name === value);
          if (selectedMaterial) {
            return { 
              ...material, 
              [field]: value,
              calorificValue: selectedMaterial.calorificValue,
              weight: selectedMaterial.weight
            };
          }
        }
        return { ...material, [field]: value };
      }
      return material;
    }));
  };
  
  // Add custom material to the list
  const addCustomMaterial = () => {
    if (customMaterialName && customCalorificValue > 0) {
      // Add to common materials
      commonMaterials.splice(commonMaterials.length - 1, 0, {
        name: customMaterialName,
        calorificValue: customCalorificValue,
        weight: customWeight
      });
      
      // Reset form
      setCustomMaterialName('');
      setCustomCalorificValue(0);
      setCustomWeight(1);
      
      // Show confirmation
      alert(`Added "${customMaterialName}" to the materials list.`);
    } else {
      alert('Please provide a name and valid calorific value for the custom material.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FaCalculator className="text-orange-600 text-2xl mr-2" />
        <h2 className="text-xl font-bold">Fire Load Density Calculator</h2>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        <p>This calculator determines the fire load density of a space based on the combustible materials present. Fire load density is used to classify the hazard level and determine appropriate fire protection requirements.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room/Space Area (m²)
            </label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={roomArea || ''}
              onChange={(e) => setRoomArea(Number(e.target.value))}
            />
          </div>
          
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="font-medium text-gray-700 mb-3">Add Custom Material</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Material Name
                </label>
                <input
                  type="text"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                  value={customMaterialName}
                  onChange={(e) => setCustomMaterialName(e.target.value)}
                  placeholder="e.g., Office Paper (80gsm)"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Calorific Value (MJ/kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                  value={customCalorificValue || ''}
                  onChange={(e) => setCustomCalorificValue(Number(e.target.value))}
                  placeholder="e.g., 17.5"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Weight (kg per unit)
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                  value={customWeight || ''}
                  onChange={(e) => setCustomWeight(Number(e.target.value))}
                  placeholder="e.g., 0.005"
                />
                <p className="mt-1 text-xs text-gray-500">
                  For solids: kg/m³, for items: kg/piece, for sheets: kg/m²
                </p>
              </div>
              <button
                type="button"
                onClick={addCustomMaterial}
                className="w-full px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
              >
                Add to Materials List
              </button>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-md">
            <h3 className="font-semibold text-orange-800 mb-2">Fire Load Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-orange-700">Total Fire Load:</span>
                <span className="font-medium">{totalFireLoad.toLocaleString(undefined, {maximumFractionDigits: 2})} MJ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-orange-700">Fire Load Density:</span>
                <span className="font-medium">{fireLoadDensity.toLocaleString(undefined, {maximumFractionDigits: 2})} MJ/m²</span>
              </div>
              <div className="pt-2 border-t border-orange-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-orange-700">Hazard Classification:</span>
                  <span className="font-bold text-orange-800">{hazardClassification}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Combustible Materials</h3>
            <button
              type="button"
              onClick={addMaterial}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center text-sm"
            >
              <FaPlus className="mr-1" /> Add Material
            </button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {materials.map((material) => (
              <div key={material.id} className="p-3 border border-gray-200 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="font-medium text-sm">{material.name}</span>
                  </div>
                  {materials.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMaterial(material.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Material Type
                    </label>
                    <select
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                      value={material.name}
                      onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                    >
                      {commonMaterials.map((m, index) => (
                        <option key={index} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                      value={material.unit}
                      onChange={(e) => updateMaterial(material.id, 'unit', e.target.value)}
                    >
                      <option value="kg">kg (direct weight)</option>
                      <option value="pcs">pieces</option>
                      <option value="m2">m² (area)</option>
                      <option value="m3">m³ (volume)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                      value={material.quantity || ''}
                      onChange={(e) => updateMaterial(material.id, 'quantity', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Calorific Value (MJ/kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                      value={material.calorificValue || ''}
                      onChange={(e) => updateMaterial(material.id, 'calorificValue', Number(e.target.value))}
                      disabled={material.name !== 'Custom Material'}
                    />
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Energy Content:</span>
                    <span className="font-medium">{material.totalEnergy.toLocaleString(undefined, {maximumFractionDigits: 2})} MJ</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
        <div className="flex items-start">
          <FaInfoCircle className="text-yellow-600 mt-1 mr-2" />
          <div>
            <p><strong>Hazard Classifications Based on Fire Load Density:</strong></p>
            <ul className="mt-1 ml-4 list-disc space-y-1">
              <li><strong>Light Hazard:</strong> &lt; 600 MJ/m² (e.g., offices, churches, schools)</li>
              <li><strong>Ordinary Hazard Group 1:</strong> 600-1200 MJ/m² (e.g., parking garages, bakeries, laundries)</li>
              <li><strong>Ordinary Hazard Group 2:</strong> 1200-2400 MJ/m² (e.g., manufacturing, processing)</li>
              <li><strong>High Hazard:</strong> &gt; 2400 MJ/m² (e.g., flammable liquid storage, chemical plants)</li>
            </ul>
            <p className="mt-2">These classifications help determine sprinkler density, fire resistance requirements, and other fire protection measures.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FireLoadCalculator;
