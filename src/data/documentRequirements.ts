import { OccupancyType } from './occupancyTypes';

export interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  applicableOccupancies: string[];
  reference: string;
  details?: string;
}

// Document requirements based on the Revised Fire Code of the Philippines (RA 9514 IRR 2019)
export const documentRequirements: DocumentRequirement[] = [
  {
    id: 'fsic',
    name: 'Fire Safety Inspection Certificate (FSIC)',
    description: 'Required for all occupancies before operation and must be renewed annually.',
    applicableOccupancies: ['all'],
    reference: 'RA 9514 IRR Rule 10.1.1',
    details: 'The FSIC certifies that a building or structure has complied with the fire safety and protective requirements of the Fire Code. It must be displayed in a conspicuous place within the premises.'
  },
  {
    id: 'fire-safety-plan',
    name: 'Fire Safety Plan',
    description: 'A comprehensive plan detailing fire prevention measures, emergency procedures, and evacuation routes.',
    applicableOccupancies: ['all'],
    reference: 'RA 9514 IRR Rule 10.2.1',
    details: 'Must include floor plans showing exits, fire protection equipment locations, and evacuation routes. The plan should be updated annually or whenever there are significant changes to the building layout or operations.'
  },
  {
    id: 'fire-drill-records',
    name: 'Fire Drill Records',
    description: 'Documentation of regular fire drills conducted on the premises.',
    applicableOccupancies: ['assembly', 'educational', 'healthcare', 'residential-hotel', 'business', 'mercantile', 'industrial', 'storage-high-hazard'],
    reference: 'RA 9514 IRR Rule 10.2.2.3',
    details: 'Fire drills must be conducted at least twice a year for most occupancies, and quarterly for high-rise buildings, hospitals, schools, and assembly occupancies. Records must include date, time, participants, and evaluation results.'
  },
  {
    id: 'maintenance-records',
    name: 'Fire Protection Equipment Maintenance Records',
    description: 'Documentation of regular inspection, testing, and maintenance of all fire protection equipment.',
    applicableOccupancies: ['all'],
    reference: 'RA 9514 IRR Rule 10.2.6.8',
    details: 'Records must include dates of inspection, tests performed, results, and any repairs or replacements made. Must be maintained for at least 3 years and be available for inspection by fire officials.'
  },
  {
    id: 'electrical-inspection',
    name: 'Electrical Inspection Certificate',
    description: 'Certification that the electrical system has been inspected and complies with the Philippine Electrical Code.',
    applicableOccupancies: ['all'],
    reference: 'RA 9514 IRR Rule 10.3.1',
    details: 'Must be renewed every 2 years or whenever significant modifications are made to the electrical system. The inspection must be conducted by a licensed electrical engineer.'
  },
  {
    id: 'building-permit',
    name: 'Building Permit and Certificate of Occupancy',
    description: 'Official permits certifying that the building was constructed according to approved plans and is safe for occupancy.',
    applicableOccupancies: ['all'],
    reference: 'RA 9514 IRR Rule 10.1.2',
    details: 'The Certificate of Occupancy must specify the building\'s approved use and occupant load. Any change in use requires a new Certificate of Occupancy.'
  },
  {
    id: 'hazmat-inventory',
    name: 'Hazardous Materials Inventory',
    description: 'Detailed inventory of all hazardous materials stored or used on the premises.',
    applicableOccupancies: ['industrial', 'storage-high-hazard', 'business-laboratory', 'educational-laboratory'],
    reference: 'RA 9514 IRR Rule 10.4.1',
    details: 'Must include material safety data sheets (MSDS), quantities, locations, and handling procedures. The inventory must be updated whenever there are changes in the types or quantities of hazardous materials.'
  },
  {
    id: 'fire-safety-officer',
    name: 'Fire Safety Officer Certification',
    description: 'Certification for the designated Fire Safety Officer(s) on the premises.',
    applicableOccupancies: ['assembly', 'healthcare', 'residential-hotel', 'business-high-rise', 'mercantile-mall', 'industrial'],
    reference: 'RA 9514 IRR Rule 10.2.1.3',
    details: 'Buildings with an occupant load of 500 or more, or high-rise buildings, must have at least one certified Fire Safety Officer on duty during operating hours. The certification must be renewed every 2 years.'
  },
  {
    id: 'fire-insurance',
    name: 'Fire Insurance Policy',
    description: 'Insurance policy covering fire damage to the building and its contents.',
    applicableOccupancies: ['all'],
    reference: 'RA 9514 IRR Rule 10.1.4',
    details: 'The policy must provide adequate coverage based on the building\'s value and contents. Proof of current coverage must be available for inspection.'
  },
  {
    id: 'emergency-evacuation-plan',
    name: 'Emergency Evacuation Plan',
    description: 'Detailed plan for evacuating occupants in case of fire or other emergencies.',
    applicableOccupancies: ['all'],
    reference: 'RA 9514 IRR Rule 10.2.2.1',
    details: 'Must include evacuation routes, assembly areas, procedures for assisting persons with disabilities, and responsibilities of designated staff. The plan must be posted in conspicuous locations throughout the building.'
  },
  {
    id: 'fire-safety-clearance',
    name: 'Fire Safety Clearance for Special Events',
    description: 'Special clearance required for temporary events or gatherings.',
    applicableOccupancies: ['assembly-temporary'],
    reference: 'RA 9514 IRR Rule 10.2.3.5',
    details: 'Required for events with an expected attendance of 50 or more persons. Must be obtained at least 3 days before the event. The clearance specifies maximum occupancy and required safety measures.'
  },
  {
    id: 'sprinkler-certification',
    name: 'Sprinkler System Certification',
    description: 'Certification that the automatic sprinkler system has been properly installed and tested.',
    applicableOccupancies: ['all-with-sprinklers'],
    reference: 'RA 9514 IRR Rule 10.2.6.4',
    details: 'Must be issued by a licensed professional mechanical engineer. The certification must be renewed after any modifications to the system or every 5 years, whichever comes first.'
  },
  {
    id: 'fire-detection-certification',
    name: 'Fire Detection System Certification',
    description: 'Certification that the fire detection and alarm system has been properly installed and tested.',
    applicableOccupancies: ['all-with-detection'],
    reference: 'RA 9514 IRR Rule 10.2.6.5',
    details: 'Must be issued by a licensed professional electronics engineer. The certification must be renewed after any modifications to the system or every 3 years, whichever comes first.'
  }
];

// Function to filter document requirements based on occupancy type
export function getDocumentRequirements(occupancyType: OccupancyType): DocumentRequirement[] {
  return documentRequirements.filter(doc => {
    // Check if document applies to all occupancies
    if (doc.applicableOccupancies.includes('all')) {
      return true;
    }
    
    // Check if document applies directly to this occupancy type
    if (doc.applicableOccupancies.includes(occupancyType.id)) {
      return true;
    }
    
    // Check for category matches (e.g., if occupancy is 'assembly-fixed-seats', check for 'assembly')
    const occupancyCategories = [
      'assembly',
      'residential',
      'business',
      'mercantile',
      'industrial',
      'storage',
      'educational',
      'healthcare'
    ];
    
    for (const category of occupancyCategories) {
      if (occupancyType.id.startsWith(category) && doc.applicableOccupancies.includes(category)) {
        return true;
      }
    }
    
    // Check for special cases like 'all-with-sprinklers'
    if (doc.applicableOccupancies.includes('all-with-sprinklers')) {
      // This would need to be determined based on whether the building has sprinklers
      // For now, include these documents for all occupancies
      return true;
    }
    
    if (doc.applicableOccupancies.includes('all-with-detection')) {
      // This would need to be determined based on whether the building has detection systems
      // For now, include these documents for all occupancies
      return true;
    }
    
    return false;
  });
}
