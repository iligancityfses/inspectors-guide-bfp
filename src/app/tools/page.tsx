'use client';

import React from 'react';
import FireSafetyCalculators from '@/components/FireSafetyCalculators';
import ReferenceLibrary from '@/components/ReferenceLibrary';

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-red-700">Fire Safety Inspector Tools</h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Fire Safety Calculators</h2>
        <p className="text-gray-600 mb-6">
          Use these calculators to determine fire safety requirements based on building characteristics.
          These tools help with complex calculations required for proper fire safety compliance.
        </p>
        <FireSafetyCalculators />
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Fire Safety Reference Library</h2>
        <p className="text-gray-600 mb-6">
          Access a comprehensive library of fire safety references, including the Revised Fire Code of the Philippines,
          NFPA standards, BFP memorandums, and guidelines. Search by keyword, category, or reference type.
        </p>
        <ReferenceLibrary />
      </div>
    </div>
  );
}
