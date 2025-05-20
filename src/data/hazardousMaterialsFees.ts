// Hazardous materials fee structure based on the Revised Fire Code of the Philippines (RA 9514 IRR 2019)

export interface HazardousCategory {
  id: string;
  name: string;
  description: string;
  examples: string[];
  feePerLiter: number; // Fee in Philippine Pesos per liter
  feePerKg: number;    // Fee in Philippine Pesos per kilogram
  minimumFee: number;  // Minimum fee regardless of quantity
}

export interface HazardousMaterial {
  id: string;
  name: string;
  category: string;
  defaultUnit: 'liter' | 'kg';
  density?: number; // kg/liter, for conversion between volume and weight if needed
}

// Hazardous materials categories based on RA 9514 IRR Rule 11.3.1
export const hazardousCategories: HazardousCategory[] = [
  {
    id: 'flammable-liquids',
    name: 'Flammable Liquids',
    description: 'Liquids with flash points below 37.8°C (100°F)',
    examples: ['Gasoline', 'Acetone', 'Ethanol', 'Methanol', 'Toluene'],
    feePerLiter: 5.75,
    feePerKg: 7.50,
    minimumFee: 500
  },
  {
    id: 'combustible-liquids',
    name: 'Combustible Liquids',
    description: 'Liquids with flash points at or above 37.8°C (100°F)',
    examples: ['Diesel fuel', 'Kerosene', 'Lubricating oils', 'Cooking oils'],
    feePerLiter: 4.50,
    feePerKg: 5.85,
    minimumFee: 400
  },
  {
    id: 'flammable-solids',
    name: 'Flammable Solids',
    description: 'Solids that can readily catch fire and burn vigorously',
    examples: ['Matches', 'Activated carbon', 'Sulfur', 'Naphthalene'],
    feePerLiter: 0,
    feePerKg: 6.25,
    minimumFee: 450
  },
  {
    id: 'oxidizers',
    name: 'Oxidizers and Organic Peroxides',
    description: 'Materials that readily yield oxygen to stimulate combustion',
    examples: ['Hydrogen peroxide', 'Potassium permanganate', 'Nitrates', 'Chlorates'],
    feePerLiter: 6.50,
    feePerKg: 8.25,
    minimumFee: 550
  },
  {
    id: 'toxic-materials',
    name: 'Toxic Materials',
    description: 'Materials that can cause injury or death when inhaled, ingested, or absorbed',
    examples: ['Pesticides', 'Cyanides', 'Heavy metals', 'Arsenic compounds'],
    feePerLiter: 7.25,
    feePerKg: 9.50,
    minimumFee: 600
  },
  {
    id: 'corrosive-materials',
    name: 'Corrosive Materials',
    description: 'Materials that can destroy living tissue or damage materials on contact',
    examples: ['Sulfuric acid', 'Hydrochloric acid', 'Sodium hydroxide', 'Potassium hydroxide'],
    feePerLiter: 6.75,
    feePerKg: 8.75,
    minimumFee: 525
  },
  {
    id: 'compressed-gases',
    name: 'Compressed Gases',
    description: 'Gases stored under pressure in cylinders or tanks',
    examples: ['LPG', 'Acetylene', 'Oxygen', 'Nitrogen', 'Carbon dioxide'],
    feePerLiter: 3.25,
    feePerKg: 4.50,
    minimumFee: 350
  },
  {
    id: 'explosives',
    name: 'Explosives',
    description: 'Materials that can rapidly release gas and heat when subjected to shock or heat',
    examples: ['Dynamite', 'TNT', 'Blasting agents', 'Fireworks', 'Ammunition'],
    feePerLiter: 0,
    feePerKg: 15.00,
    minimumFee: 1000
  }
];

// Common hazardous materials based on RA 9514 IRR Rule 11.3.2
export const hazardousMaterials: HazardousMaterial[] = [
  { id: 'gasoline', name: 'Gasoline', category: 'flammable-liquids', defaultUnit: 'liter', density: 0.75 },
  { id: 'diesel', name: 'Diesel Fuel', category: 'combustible-liquids', defaultUnit: 'liter', density: 0.85 },
  { id: 'kerosene', name: 'Kerosene', category: 'combustible-liquids', defaultUnit: 'liter', density: 0.82 },
  { id: 'lpg', name: 'Liquefied Petroleum Gas (LPG)', category: 'compressed-gases', defaultUnit: 'kg' },
  { id: 'acetone', name: 'Acetone', category: 'flammable-liquids', defaultUnit: 'liter', density: 0.79 },
  { id: 'ethanol', name: 'Ethanol', category: 'flammable-liquids', defaultUnit: 'liter', density: 0.79 },
  { id: 'methanol', name: 'Methanol', category: 'flammable-liquids', defaultUnit: 'liter', density: 0.79 },
  { id: 'toluene', name: 'Toluene', category: 'flammable-liquids', defaultUnit: 'liter', density: 0.87 },
  { id: 'acetylene', name: 'Acetylene', category: 'compressed-gases', defaultUnit: 'kg' },
  { id: 'oxygen', name: 'Oxygen', category: 'compressed-gases', defaultUnit: 'kg' },
  { id: 'hydrogen-peroxide', name: 'Hydrogen Peroxide', category: 'oxidizers', defaultUnit: 'liter', density: 1.45 },
  { id: 'sulfuric-acid', name: 'Sulfuric Acid', category: 'corrosive-materials', defaultUnit: 'liter', density: 1.84 },
  { id: 'hydrochloric-acid', name: 'Hydrochloric Acid', category: 'corrosive-materials', defaultUnit: 'liter', density: 1.2 },
  { id: 'sodium-hydroxide', name: 'Sodium Hydroxide', category: 'corrosive-materials', defaultUnit: 'kg' },
  { id: 'potassium-hydroxide', name: 'Potassium Hydroxide', category: 'corrosive-materials', defaultUnit: 'kg' },
  { id: 'pesticides', name: 'Pesticides', category: 'toxic-materials', defaultUnit: 'liter', density: 1.1 },
  { id: 'matches', name: 'Matches', category: 'flammable-solids', defaultUnit: 'kg' },
  { id: 'sulfur', name: 'Sulfur', category: 'flammable-solids', defaultUnit: 'kg' },
  { id: 'naphthalene', name: 'Naphthalene', category: 'flammable-solids', defaultUnit: 'kg' },
  { id: 'dynamite', name: 'Dynamite', category: 'explosives', defaultUnit: 'kg' },
  { id: 'fireworks', name: 'Fireworks', category: 'explosives', defaultUnit: 'kg' },
  { id: 'ammunition', name: 'Ammunition', category: 'explosives', defaultUnit: 'kg' }
];

// Function to calculate fee based on material, quantity, and unit
export function calculateHazardousMaterialFee(
  materialId: string, 
  quantity: number, 
  unit: 'liter' | 'kg'
): number {
  const material = hazardousMaterials.find(m => m.id === materialId);
  if (!material) {
    throw new Error(`Material with ID ${materialId} not found`);
  }

  const category = hazardousCategories.find(c => c.id === material.category);
  if (!category) {
    throw new Error(`Category ${material.category} not found`);
  }

  let fee = 0;
  
  // Convert units if necessary
  if (unit === 'liter' && material.density && category.feePerKg > 0) {
    // Convert liters to kg using density
    const weightInKg = quantity * material.density;
    fee = weightInKg * category.feePerKg;
  } else if (unit === 'kg' && material.density && category.feePerLiter > 0) {
    // Convert kg to liters using density
    const volumeInLiters = quantity / material.density;
    fee = volumeInLiters * category.feePerLiter;
  } else if (unit === 'liter') {
    fee = quantity * category.feePerLiter;
  } else if (unit === 'kg') {
    fee = quantity * category.feePerKg;
  }

  // Apply minimum fee if calculated fee is less than minimum
  return Math.max(fee, category.minimumFee);
}

// Function to get category details
export function getHazardousCategoryDetails(categoryId: string): HazardousCategory | undefined {
  return hazardousCategories.find(c => c.id === categoryId);
}

// Function to get all materials in a category
export function getMaterialsByCategory(categoryId: string): HazardousMaterial[] {
  return hazardousMaterials.filter(m => m.category === categoryId);
}
