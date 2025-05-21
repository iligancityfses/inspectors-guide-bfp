import React from 'react';

export interface BuildingFeature {
  id: string;
  name: string;
  description: string;
  selected: boolean;
}

interface BuildingFeaturesProps {
  features: BuildingFeature[];
  onFeaturesChange: (features: BuildingFeature[]) => void;
}

export default function BuildingFeatures({ features, onFeaturesChange }: BuildingFeaturesProps) {
  const toggleFeature = (id: string) => {
    const updatedFeatures = features.map(feature => 
      feature.id === id ? { ...feature, selected: !feature.selected } : feature
    );
    onFeaturesChange(updatedFeatures);
  };

  return (
    <div className="card mt-6 dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Step 3: Select Building Features</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Select the features present in your building. These will affect the fire safety requirements.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map(feature => (
          <div 
            key={feature.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              feature.selected 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400' 
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
            }`}
            onClick={() => toggleFeature(feature.id)}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <input 
                  type="checkbox" 
                  checked={feature.selected}
                  onChange={() => toggleFeature(feature.id)}
                  className="h-4 w-4 text-blue-600 dark:text-blue-500 rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{feature.name}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
