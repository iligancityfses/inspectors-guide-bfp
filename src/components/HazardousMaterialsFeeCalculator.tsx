import React, { useState, useEffect } from 'react';
import { 
  hazardousCategories, 
  hazardousMaterials, 
  calculateHazardousMaterialFee,
  getMaterialsByCategory,
  getHazardousCategoryDetails,
  HazardousMaterial
} from '@/data/hazardousMaterialsFees';

interface HazardousMaterialEntry {
  id: string;
  materialId: string;
  quantity: number;
  unit: 'liter' | 'kg';
  fee: number;
}

export default function HazardousMaterialsFeeCalculator() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [materialsInCategory, setMaterialsInCategory] = useState<HazardousMaterial[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState<'liter' | 'kg'>('liter');
  const [materialEntries, setMaterialEntries] = useState<HazardousMaterialEntry[]>([]);
  const [totalFee, setTotalFee] = useState<number>(0);
  const [categoryDetails, setCategoryDetails] = useState<any>(null);

  // Update materials list when category changes
  useEffect(() => {
    if (selectedCategory) {
      const materials = getMaterialsByCategory(selectedCategory);
      setMaterialsInCategory(materials);
      setSelectedMaterial(materials.length > 0 ? materials[0].id : '');
      
      const details = getHazardousCategoryDetails(selectedCategory);
      setCategoryDetails(details);
      
      // Set default unit based on first material in category
      if (materials.length > 0) {
        setUnit(materials[0].defaultUnit);
      }
    } else {
      setMaterialsInCategory([]);
      setSelectedMaterial('');
      setCategoryDetails(null);
    }
  }, [selectedCategory]);

  // Update unit when material changes
  useEffect(() => {
    if (selectedMaterial) {
      const material = hazardousMaterials.find(m => m.id === selectedMaterial);
      if (material) {
        setUnit(material.defaultUnit);
      }
    }
  }, [selectedMaterial]);

  // Calculate total fee when entries change
  useEffect(() => {
    const total = materialEntries.reduce((sum, entry) => sum + entry.fee, 0);
    setTotalFee(total);
  }, [materialEntries]);

  const handleAddMaterial = () => {
    if (!selectedMaterial || !quantity || parseFloat(quantity) <= 0) {
      alert('Please select a material and enter a valid quantity');
      return;
    }

    try {
      const quantityValue = parseFloat(quantity);
      const fee = calculateHazardousMaterialFee(selectedMaterial, quantityValue, unit);
      
      const material = hazardousMaterials.find(m => m.id === selectedMaterial);
      if (!material) {
        throw new Error('Material not found');
      }

      const newEntry: HazardousMaterialEntry = {
        id: `${Date.now()}`,
        materialId: selectedMaterial,
        quantity: quantityValue,
        unit,
        fee
      };

      setMaterialEntries([...materialEntries, newEntry]);
      setQuantity('');
    } catch (error) {
      console.error('Error calculating fee:', error);
      alert('Error calculating fee. Please try again.');
    }
  };

  const handleRemoveMaterial = (id: string) => {
    setMaterialEntries(materialEntries.filter(entry => entry.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const getMaterialName = (materialId: string) => {
    const material = hazardousMaterials.find(m => m.id === materialId);
    return material ? material.name : materialId;
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Hazardous Materials Fee Calculator</h2>
      <p className="text-gray-600 mb-4">
        Calculate fees for hazardous materials based on the Revised Fire Code of the Philippines (RA 9514 IRR 2019).
        Inspectors can use this to determine how much building owners should pay for hazardous materials storage.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Hazardous Material Category
          </label>
          <select
            id="category"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {hazardousCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {categoryDetails && (
          <div className="md:col-span-2 bg-gray-50 p-4 rounded-md mb-4">
            <h3 className="font-medium">{categoryDetails.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{categoryDetails.description}</p>
            <div className="text-sm">
              <p><span className="font-medium">Fee per liter:</span> {formatCurrency(categoryDetails.feePerLiter)}</p>
              <p><span className="font-medium">Fee per kg:</span> {formatCurrency(categoryDetails.feePerKg)}</p>
              <p><span className="font-medium">Minimum fee:</span> {formatCurrency(categoryDetails.minimumFee)}</p>
              <p className="mt-1"><span className="font-medium">Examples:</span> {categoryDetails.examples.join(', ')}</p>
            </div>
          </div>
        )}

        {selectedCategory && (
          <>
            <div>
              <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">
                Material
              </label>
              <select
                id="material"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                disabled={materialsInCategory.length === 0}
              >
                {materialsInCategory.length === 0 ? (
                  <option value="">No materials in this category</option>
                ) : (
                  materialsInCategory.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity ({unit})
              </label>
              <div className="flex">
                <input
                  id="quantity"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={`Enter quantity in ${unit}`}
                />
                <select
                  className="px-3 py-2 border border-gray-300 border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as 'liter' | 'kg')}
                >
                  <option value="liter">Liters</option>
                  <option value="kg">Kilograms</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={handleAddMaterial}
                disabled={!selectedMaterial || !quantity || parseFloat(quantity) <= 0}
              >
                Add Material
              </button>
            </div>
          </>
        )}
      </div>

      {materialEntries.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Added Materials</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {materialEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {getMaterialName(entry.materialId)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {entry.quantity} {entry.unit}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(entry.fee)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveMaterial(entry.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={2} className="px-4 py-3 text-right font-medium">
                    Total Fee:
                  </td>
                  <td className="px-4 py-3 font-medium text-blue-700">
                    {formatCurrency(totalFee)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-800 mb-2">Fee Calculation Reference</h4>
            <p className="text-sm text-gray-700">
              Fees are calculated based on Rule 11.3 of the Revised Fire Code of the Philippines (RA 9514 IRR 2019).
              The fee structure includes a per-unit fee (per liter or per kilogram) with a minimum fee requirement for each category.
              For materials that can be measured in both volume and weight, the appropriate conversion is applied based on the material's density.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
