import { Floor, calculatePumpPressure, calculatePumpFlowRate, calculatePumpHorsepower, PUMP_CONSTANTS } from '@/lib/calculations';

export interface FireSafetyRequirement {
  id: string;
  name: string;
  description: string;
  applicableOccupancies: string[];
  thresholds: {
    occupantLoad?: number;
    stories?: number;
    floorArea?: number;
    buildingHeight?: number; // in meters
  };
  reference: string;
  specificRequirements?: {
    quantity?: string | ((params: { occupantLoad: number, floorArea: number, stories: number, floors?: Floor[] }) => string);
    type?: string;
    specifications?: string | ((params: { occupantLoad: number, floorArea: number, stories: number, buildingHeight: number, floors?: Floor[], occupancyType?: any }) => string);
    distribution?: string | ((params: { occupantLoad: number, floorArea: number, stories: number, buildingHeight: number, floors?: Floor[], occupancyType?: any }) => string);
    installation?: string;
    maintenance?: string;
  };
}

// This data is based on the Revised Fire Code of the Philippines (RA 9514 IRR 2019)
// Rule 10 of the IRR covers Fire Protection Features and Fire Safety Requirements
export const fireSafetyRequirements: FireSafetyRequirement[] = [
  {
    id: 'automatic-sprinkler-system',
    name: 'Automatic Sprinkler System',
    description: 'An automatic sprinkler system shall be installed in buildings with a height of more than 15 meters (50 feet) or with an occupant load of more than 500 persons, or buildings with a total floor area exceeding 2,000 square meters. Certain occupancies require sprinkler systems regardless of height or size, including healthcare facilities, high hazard occupancies, detention facilities, and mall complexes. Single-story business establishments under 2,000 square meters with occupant load less than 500 are exempt unless they fall into a special category.',
    applicableOccupancies: [
      'assembly', 'educational', 'healthcare-hospitals', 'healthcare-outpatient', 'healthcare-nursing-homes', 
      'institutional-restrained', 'institutional-general', 'mercantile', 'industrial-general', 'industrial-special',
      'industrial-high-hazard', 'storage-low-hazard', 'storage-moderate-hazard', 'storage-high-hazard',
      'mixed-use', 'residential-hotel', 'residential-apartment', 'residential-dormitories',
      'business-data-centers', 'laboratory', 'waste-management-facility', 'power-generation-plant'
    ],
    thresholds: {
      occupantLoad: 500,
      stories: 5, // Assuming average floor height of 3m, so 15m ÷ 3m = 5 floors
      buildingHeight: 15,
      floorArea: 2000
    },
    reference: 'RA 9514 IRR Rule 10.2.6.4',
    specificRequirements: {
      specifications: ({ buildingHeight, stories, occupantLoad, occupancyType }) => {
        const actualHeight = buildingHeight || stories * 3;
        const pumpPSI = calculatePumpPressure(actualHeight);
        
        let sprinklerType = "Quick response";
        if (occupantLoad > 1000) {
          sprinklerType = "Standard response";
        }
        
        // Special requirements based on occupancy type
        let specialRequirements = '';
        const occupancyId = occupancyType?.id || '';
        
        if (occupancyId.includes('healthcare') || occupancyId.includes('hospital')) {
          specialRequirements = ' Healthcare facilities require quick response sprinklers throughout. Water supply duration must be minimum 60 minutes.';
        } else if (occupancyId.includes('high-hazard') || occupancyId.includes('storage-high')) {
          specialRequirements = ' High hazard occupancies require higher density sprinkler systems with minimum water supply duration of 90 minutes.';
        } else if (occupancyId.includes('mall')) {
          specialRequirements = ' Mall complexes require sprinkler systems throughout, including in concealed spaces and service corridors.';
        } else if (occupancyId.includes('detention') || occupancyId.includes('correctional') || occupancyId.includes('restrained')) {
          specialRequirements = ' Detention facilities require institutional sprinklers with tamper-resistant features.';
        }
        
        return `Fire pump minimum pressure: ${pumpPSI} PSI. Water supply duration: minimum 30-60 minutes depending on hazard classification. Sprinkler heads: ${sprinklerType} type for light hazard; Standard response for ordinary and high hazard occupancies.${specialRequirements}`;
      },
      type: 'Wet pipe system with water under pressure at all times. Dry pipe systems allowed only in areas subject to freezing. Pre-action systems for data centers and electronic equipment areas. ESFR (Early Suppression Fast Response) sprinklers for high-piled storage areas.',
      distribution: ({ floorArea, occupancyType }) => {
        // Calculate approximate number of sprinklers based on floor area and hazard classification
        const hazardClass = occupancyType?.hazardClassification || 'light';
        let coverageArea = 20.9; // sq m per sprinkler for light hazard
        
        if (hazardClass === 'ordinary') {
          coverageArea = 12.1; // sq m per sprinkler
        } else if (hazardClass === 'high') {
          coverageArea = 9.3; // sq m per sprinkler
        }
        
        // Estimate number of sprinklers
        const estimatedSprinklers = Math.ceil(floorArea / coverageArea);
        
        return `Light hazard: One sprinkler per 20.9 sq m (225 sq ft); Ordinary hazard: One sprinkler per 12.1 sq m (130 sq ft); High hazard: One sprinkler per 9.3 sq m (100 sq ft). Estimated number of sprinklers needed for this building: approximately ${estimatedSprinklers} heads based on total floor area.`;
      },
      installation: 'Sprinkler heads must be installed in accordance with NFPA 13. Maximum distance between sprinklers: 4.6 meters (15 feet) for light hazard; 4.0 meters (13 feet) for ordinary hazard; 3.7 meters (12 feet) for high hazard. Minimum pipe sizes: 25mm (1-inch) for branch lines serving up to 8 sprinklers; 32mm (1.25-inch) for up to 15 sprinklers; 40mm (1.5-inch) for up to 30 sprinklers; 50mm (2-inch) for up to 60 sprinklers.',
      maintenance: 'Weekly visual inspection of control valves; Monthly inspection of water flow alarm devices; Quarterly inspection of alarm devices; Annual inspection and testing of all components; Five-year internal inspection of piping. Spare sprinkler cabinet must contain at least 6 spare sprinklers of each type used in the building, a sprinkler wrench, and NFPA 25 inspection requirements.'
    }
  },
  {
    id: 'alternative-automatic-fire-extinguishing-system',
    name: 'Alternative Automatic Fire Extinguishing System',
    description: 'Alternative automatic fire extinguishing systems shall be installed in areas where water-based systems are not suitable, such as commercial kitchens, computer rooms, and areas with flammable liquids.',
    applicableOccupancies: ['all'],
    thresholds: {},
    reference: 'RA 9514 IRR Rule 10.2.6.6',
    specificRequirements: {
      specifications: ({ occupantLoad }) => {
        let systemType = "Dry chemical, wet chemical, or clean agent system";
        if (occupantLoad > 300) {
          systemType = "Clean agent system with automatic detection and manual activation capability";
        }
        return `${systemType} appropriate for the specific hazard being protected.`;
      },
      type: 'Commercial kitchen: Wet chemical system; Computer rooms: Clean agent system; Flammable liquid areas: Dry chemical or foam system',
      distribution: 'System coverage must be designed for the specific hazard and area being protected',
      installation: 'Systems must be installed in accordance with applicable NFPA standards or equivalent. Automatic detection devices must be provided',
      maintenance: 'Semi-annual inspection of all components; Annual testing of system operation; Recharge or replacement as required by manufacturer specifications'
    }
  },
  {
    id: 'fire-extinguishers',
    name: 'Portable Fire Extinguishers',
    description: 'Portable fire extinguishers shall be installed in all occupancies. The type, size, and distribution shall be in accordance with the requirements of the Fire Code.',
    applicableOccupancies: ['all'],
    thresholds: {},
    reference: 'RA 9514 IRR Rule 10.2.6.7',
    specificRequirements: {
      quantity: ({ floorArea, floors, occupantLoad }) => {
        // Get the number of floors
        const floorCount = floors ? floors.length : 1;
        
        // Calculate the number of extinguishers based on floor area
        // For light hazard: 1 extinguisher per 280 sq m
        // For ordinary hazard: 1 extinguisher per 140 sq m
        // For high hazard: 1 extinguisher per 90 sq m
        
        let baseArea = 280; // sq m per extinguisher for light hazard
        
        // Adjust based on occupant load (as a proxy for hazard level)
        if (occupantLoad > 500) {
          baseArea = 140; // ordinary hazard
        }
        if (occupantLoad > 1000) {
          baseArea = 90; // high hazard
        }
        
        // Calculate total number of extinguishers needed
        const totalExtinguishers = Math.ceil(floorArea / baseArea);
        
        // Distribute across floors
        const extinguishersPerFloor = Math.ceil(totalExtinguishers / floorCount);
        
        return `Minimum ${totalExtinguishers} fire extinguishers required for the building (approximately ${extinguishersPerFloor} per floor). Maximum travel distance to a fire extinguisher should not exceed 23 meters (75 feet).`;
      },
      type: 'Type ABC (multi-purpose dry chemical) for general areas; Type K for kitchens; Type BC for electrical equipment areas. For computer rooms and sensitive electronic equipment areas, clean agent extinguishers are recommended.',
      specifications: 'Minimum rating of 2-A:10-B:C for light hazard occupancies; 4-A:40-B:C for ordinary hazard; 6-A:80-B:C for high hazard. Each extinguisher must have a valid inspection tag and be fully charged.',
      distribution: 'Maximum travel distance of 23 meters (75 feet) to a fire extinguisher. Extinguishers must be placed along normal paths of travel and near exits. Additional extinguishers are required for specific hazards such as kitchens, mechanical rooms, and storage areas.',
      installation: 'Top of extinguisher not more than 1.5 meters (5 feet) above the floor; bottom not less than 10 cm (4 inches) above the floor. Extinguishers weighing more than 18 kg (40 lbs) must be installed so that the top is not more than 1.07 meters (3.5 feet) above the floor.',
      maintenance: 'Monthly visual inspection; annual maintenance by certified technician; hydrostatic testing every 5-12 years depending on type; immediate replacement of damaged or discharged extinguishers.'
    }
  },
  {
    id: 'fire-detection-alarm-system',
    name: 'Fire Detection and Alarm System',
    description: 'A fire detection and alarm system shall be installed in buildings with an occupant load of more than 50 persons, or buildings with a total floor area exceeding 1,000 square meters.',
    applicableOccupancies: ['all'],
    thresholds: {
      occupantLoad: 50,
      floorArea: 1000
    },
    reference: 'RA 9514 IRR Rule 10.2.6.8',
    specificRequirements: {
      type: 'Addressable fire alarm system for buildings over 2,000 square meters or with more than 100 occupants; Conventional fire alarm system for smaller buildings.',
      specifications: 'Control panel must be located at the main entrance or in a constantly attended location. Battery backup power for at least 24 hours of standby plus 5 minutes of alarm operation.',
      distribution: 'Manual pull stations at each exit and at each floor landing of exit stairways. Maximum travel distance to a manual pull station should not exceed 60 meters (200 feet).',
      installation: 'Smoke detectors in corridors, storage areas, and equipment rooms. Heat detectors in kitchens, mechanical rooms, and areas where smoke detectors would be subject to false alarms. Audible notification devices must provide a sound level of at least 15 dBA above ambient noise levels.',
      maintenance: 'Monthly testing of manual pull stations; Quarterly testing of detectors; Annual testing of all components; Replacement of batteries every 2 years or as recommended by manufacturer.'
    }
  },
  {
    id: 'fire-department-connection',
    name: 'Fire Department Connection',
    description: 'A fire department connection (FDC) shall be provided for buildings with standpipe systems, sprinkler systems, or other fire protection systems that require supplemental water supply.',
    applicableOccupancies: ['all'],
    thresholds: {},
    reference: 'RA 9514 IRR Rule 10.2.6.9',
    specificRequirements: {
      type: 'Two-way Siamese connection for buildings up to 6 stories; Multiple connections for taller buildings.',
      specifications: 'FDC must be compatible with local fire department equipment (65mm or 2.5-inch hose connections). Must be labeled to indicate the system it serves (e.g., "STANDPIPE", "SPRINKLER").',
      distribution: 'Located on the street side of the building, within 30 meters (100 feet) of a fire hydrant, and between 0.5 and 1 meter (18-42 inches) above the ground level.',
      installation: 'Must be visible and accessible from the street or nearest point of fire department vehicle access. Must be protected from damage by installing protective bollards if necessary.',
      maintenance: 'Quarterly visual inspection; Annual testing for proper operation; Caps or plugs must be in place to protect threads; Area around FDC must be kept clear for at least 1 meter (3 feet) in all directions.'
    }
  },
  {
    id: 'standpipe-system',
    name: 'Standpipe System',
    description: 'A standpipe system shall be installed in buildings with a height of more than 15 meters (50 feet) or buildings with more than 4 stories.',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 4,
      buildingHeight: 15
    },
    reference: 'RA 9514 IRR Rule 10.2.6.10',
    specificRequirements: {
      type: 'Class I standpipe system for buildings over 15 meters; Class III standpipe system for high-rise buildings over 25 meters.',
      specifications: 'Minimum flow rate of 500 GPM (1,900 LPM) for the first standpipe and 250 GPM (950 LPM) for each additional standpipe, up to a maximum of 1,250 GPM (4,750 LPM). Minimum pressure of 100 PSI (7 bar) at the topmost outlet.',
      distribution: 'Standpipe outlets (hose connections) must be located in enclosed exit stairways, at each floor level. Maximum distance between standpipes should not exceed 60 meters (200 feet).',
      installation: 'Standpipe risers must be at least 100mm (4 inches) in diameter. Hose connections must be 65mm (2.5 inches) in diameter with reducers to 38mm (1.5 inches) where required for occupant use.',
      maintenance: 'Monthly visual inspection; Annual flow test; Five-year hydrostatic test at 200 PSI (13.8 bar) for 2 hours.'
    }
  },
  {
    id: 'fire-pump',
    name: 'Fire Pump',
    description: 'A fire pump shall be installed where the water supply pressure is insufficient to meet the pressure and flow requirements of the fire protection systems.',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 7,
      buildingHeight: 20
    },
    reference: 'RA 9514 IRR Rule 10.2.6.11',
    specificRequirements: {
      specifications: ({ buildingHeight, stories, floorArea, occupantLoad, occupancyType }) => {
        const actualHeight = buildingHeight || stories * 3;
        const pumpPSI = calculatePumpPressure(actualHeight);
        const flowRate = calculatePumpFlowRate(floorArea);
        const horsepower = calculatePumpHorsepower(flowRate, pumpPSI);
        
        // Determine number of main fire pumps based on building size and occupancy
        let mainPumps = 1;
        if (floorArea > 10000 || actualHeight > 30 || occupantLoad > 1000) {
          mainPumps = 2; // Redundancy for larger buildings
        }
        
        // Determine if a backup diesel pump is needed
        const needsBackupDiesel = floorArea > 5000 || actualHeight > 23 || occupantLoad > 500 || 
          (occupancyType?.id && (occupancyType.id.includes('healthcare') || 
                               occupancyType.id.includes('high-hazard') || 
                               occupancyType.id.includes('assembly')));
        
        // Calculate jockey pump specifications
        const jockeyPumpPSI = pumpPSI + 10; // Jockey pump maintains higher pressure
        const jockeyPumpGPM = Math.max(10, Math.ceil(flowRate * 0.01)); // Typically 1% of main pump capacity
        const jockeyHP = Math.ceil(jockeyPumpGPM * jockeyPumpPSI * 0.0017); // Approximate HP calculation
        
        // Calculate number of sprinkler heads that can be supported
        const hazardClass = occupancyType?.hazardClassification || 'light';
        let sprinklerDensity = 0.1; // gpm/sq ft for light hazard
        if (hazardClass === 'ordinary') {
          sprinklerDensity = 0.15;
        } else if (hazardClass === 'high') {
          sprinklerDensity = 0.25;
        }
        
        // Assuming 15 gpm per sprinkler for light hazard, more for higher hazards
        let sprinklerFlowRate = 15; // gpm per sprinkler for light hazard
        if (hazardClass === 'ordinary') {
          sprinklerFlowRate = 22;
        } else if (hazardClass === 'high') {
          sprinklerFlowRate = 30;
        }
        
        // Calculate maximum number of sprinklers that can operate simultaneously
        const maxSimultaneousSprinklers = Math.floor(flowRate / sprinklerFlowRate);
        
        // Pump configuration description
        let pumpConfig = `${mainPumps} main fire pump(s) with a combined capacity of ${flowRate} GPM at ${pumpPSI} PSI`;
        if (needsBackupDiesel) {
          pumpConfig += ` and 1 backup diesel-driven fire pump with equal capacity`;
        }
        pumpConfig += `. 1 jockey pump rated at ${jockeyPumpGPM} GPM at ${jockeyPumpPSI} PSI (approximately ${jockeyHP} HP).`;
        
        return `Pump System Requirements: ${pumpConfig} Main pump(s) estimated horsepower: ${horsepower} HP per pump. System can support approximately ${maxSimultaneousSprinklers} sprinklers operating simultaneously at a density of ${sprinklerDensity} gpm/sq ft. All pumps must be listed for fire service and installed in accordance with NFPA 20.`;
      },
      type: ({ floorArea, occupantLoad, occupancyType }) => {
        const isHighRisk = occupancyType?.hazardClassification === 'high' || 
                         (occupancyType?.id && (occupancyType.id.includes('healthcare') || 
                                                occupancyType.id.includes('high-hazard')));
        const isLargeBuilding = floorArea > 10000 || occupantLoad > 1000;
        
        if (isHighRisk || isLargeBuilding) {
          return 'Primary: Electric-driven horizontal split-case fire pump. Backup: Diesel-driven horizontal split-case fire pump with minimum 8-hour fuel supply. Jockey Pump: Electric-driven multistage pump for pressure maintenance.';
        } else {
          return 'Primary: Electric-driven fire pump (horizontal split-case or vertical inline based on available space). Optional Backup: Diesel-driven fire pump where reliable electrical power is not available. Jockey Pump: Electric-driven multistage or regenerative turbine pump.';
        }
      },
      distribution: ({ floorArea, stories, buildingHeight }) => {
        const actualHeight = buildingHeight || stories * 3;
        let pumpRoomRequirements = 'Located in a dedicated fire pump room with a minimum 2-hour fire-resistance rating. Room must have direct access to the outside or to a protected means of egress.';
        
        if (actualHeight > 30 || floorArea > 10000) {
          pumpRoomRequirements += ' For high-rise buildings, consider a secondary fire pump at intermediate levels if building height exceeds 120 meters.';
        }
        
        if (floorArea > 5000) {
          pumpRoomRequirements += ' Fire pump room should be at least 20 square meters to accommodate all equipment with adequate clearance for maintenance.';
        } else {
          pumpRoomRequirements += ' Fire pump room should be at least 15 square meters with adequate clearance for maintenance.';
        }
        
        return pumpRoomRequirements;
      },
      installation: 'Must be installed in accordance with NFPA 20. Suction pipe must be at least one size larger than the pump intake. Controller must be listed for fire pump service. Jockey pump must be installed with a separate controller and set to maintain system pressure approximately 10 PSI above the main fire pump start pressure. All pumps must have individual pressure gauges on suction and discharge sides. Provide a flow meter test header for testing pump performance without discharging water.',
      maintenance: 'Weekly visual inspection and churn test; Monthly testing of jockey pump operation; Monthly testing of fire pump under no-flow conditions; Annual testing of fire pump under flow conditions; Diesel engine (if applicable): Weekly testing for 30 minutes; Monthly inspection of fuel, oil, and cooling systems; Annual full-flow testing; Maintain detailed records of all tests and maintenance.'
    }
  },
  {
    id: 'fire-hydrant',
    name: 'Fire Hydrant',
    description: 'Fire hydrants shall be installed on the premises for buildings with a total floor area exceeding 2,000 square meters or where the nearest public hydrant is more than 100 meters from the main entrance.',
    applicableOccupancies: ['all'],
    thresholds: {
      floorArea: 2000
    },
    reference: 'RA 9514 IRR Rule 10.2.6.12',
    specificRequirements: {
      type: 'Wet barrel hydrants in areas not subject to freezing; Dry barrel hydrants in areas subject to freezing.',
      specifications: 'Minimum flow rate of 1,000 GPM (3,800 LPM) for high-hazard occupancies; 750 GPM (2,850 LPM) for ordinary hazard; 500 GPM (1,900 LPM) for light hazard. Minimum pressure of 20 PSI (1.4 bar) at the hydrant outlet.',
      distribution: 'Maximum distance between hydrants should not exceed 150 meters (500 feet) for high-hazard occupancies; 180 meters (600 feet) for ordinary hazard; 210 meters (700 feet) for light hazard.',
      installation: 'Hydrants must be located at least 12 meters (40 feet) from the building being protected. Must be accessible to fire department apparatus and protected from damage by installing protective bollards if necessary.',
      maintenance: 'Semi-annual visual inspection; Annual flow test; Lubrication of operating nuts and caps as needed; Hydrants must be painted in accordance with local requirements (typically red or yellow).'
    }
  },
  {
    id: 'fire-exit-doors',
    name: 'Fire Exit Doors',
    description: 'Fire exit doors shall be provided for all buildings to allow for safe evacuation in case of fire or other emergency.',
    applicableOccupancies: ['all'],
    thresholds: {},
    reference: 'RA 9514 IRR Rule 10.2.5.1',
    specificRequirements: {
      quantity: ({ occupantLoad }) => {
        let numExits = 2;
        if (occupantLoad > 500 && occupantLoad <= 1000) {
          numExits = 3;
        } else if (occupantLoad > 1000) {
          numExits = 4;
        }
        return `Minimum ${numExits} exits required for this occupant load.`;
      },
      type: 'Swinging doors with panic hardware for assembly, educational, and high-hazard occupancies with an occupant load of 50 or more. Standard swinging doors with lever handles for other occupancies.',
      specifications: 'Minimum width of 0.9 meters (36 inches) for new buildings; 0.8 meters (32 inches) for existing buildings. Minimum height of 2.0 meters (80 inches). Must be able to be opened with a single motion without special knowledge or keys.',
      distribution: 'Exit doors must be arranged so that the travel distance to an exit does not exceed 60 meters (200 feet) in unsprinklered buildings; 90 meters (300 feet) in sprinklered buildings.',
      installation: 'Must swing in the direction of egress travel when serving an occupant load of 50 or more. Must be equipped with self-closing devices and positive latching hardware. Must be fire-rated in accordance with the required fire-resistance rating of the exit enclosure.',
      maintenance: 'Monthly inspection of hardware and operation; Quarterly testing of panic hardware; Annual testing of self-closing devices; Immediate repair or replacement of damaged components.'
    }
  },
  {
    id: 'means-of-egress',
    name: 'Means of Egress',
    description: 'Means of egress shall be provided for all buildings to allow for safe evacuation in case of fire or other emergency.',
    applicableOccupancies: ['all'],
    thresholds: {},
    reference: 'RA 9514 IRR Rule 10.2.5.2',
    specificRequirements: {
      quantity: ({ occupantLoad, floors }) => {
        let numExits = 2;
        if (occupantLoad > 500 && occupantLoad <= 1000) {
          numExits = 3;
        } else if (occupantLoad > 1000) {
          numExits = 4;
        }
        
        const floorCount = floors ? floors.length : 1;
        let stairwayRequirement = '';
        
        if (floorCount > 1) {
          stairwayRequirement = ` Each floor above the first floor requires at least ${numExits} exit stairways.`;
        }
        
        return `Minimum ${numExits} exits required for this occupant load.${stairwayRequirement}`;
      },
      type: 'Protected exit stairways for buildings over 2 stories; Horizontal exits where applicable; Exterior exit stairs or ramps where applicable.',
      specifications: 'Minimum width of exit corridors: 1.1 meters (44 inches) for occupant loads of 50 or more; 0.9 meters (36 inches) for occupant loads less than 50. Minimum width of exit stairways: 1.1 meters (44 inches) for occupant loads of 50 or more; 0.9 meters (36 inches) for occupant loads less than 50.',
      distribution: 'Exits must be arranged so that the travel distance to an exit does not exceed 60 meters (200 feet) in unsprinklered buildings; 90 meters (300 feet) in sprinklered buildings. When more than one exit is required, they must be arranged so that if one exit is blocked, the others will be available.',
      installation: 'Exit corridors and stairways must be enclosed with fire-resistance-rated construction (minimum 1-hour for buildings up to 3 stories; 2-hour for buildings 4 stories or more). Exit signs must be provided at every exit and along the path of egress travel where the exit or path is not immediately visible.',
      maintenance: 'Monthly inspection of exit signs and emergency lighting; Quarterly testing of emergency lighting; Annual inspection of fire-resistance-rated construction; Immediate repair of damaged components.'
    }
  },
  {
    id: 'emergency-lighting',
    name: 'Emergency Lighting',
    description: 'Emergency lighting shall be provided for all buildings to illuminate the means of egress in case of power failure.',
    applicableOccupancies: ['all'],
    thresholds: {
      occupantLoad: 50
    },
    reference: 'RA 9514 IRR Rule 10.2.5.3',
    specificRequirements: {
      type: 'Battery-powered emergency lights; Generator-powered lighting systems for high-rise buildings or critical facilities.',
      specifications: 'Minimum illumination of 10 lux (1 foot-candle) at the floor level along the path of egress. Battery backup must provide at least 90 minutes of emergency operation.',
      distribution: 'Required in exit corridors, stairways, ramps, escalators, and other portions of the means of egress. Also required in rooms or spaces that can be occupied by more than 50 persons.',
      installation: 'Must be installed at a height of at least 2.1 meters (7 feet) above the floor. Must be spaced so that the failure of any single unit will not leave any area in darkness.',
      maintenance: 'Monthly testing for 30 seconds; Annual testing for 90 minutes; Immediate replacement of defective units; Replacement of batteries every 3-5 years or as recommended by manufacturer.'
    }
  },
  {
    id: 'fire-compartmentation',
    name: 'Fire Compartmentation and Fire Barriers',
    description: 'Fire compartmentation shall be provided to subdivide buildings into smaller fire areas to limit the spread of fire, smoke, and heat. Fire barriers, fire walls, fire partitions, and fire-rated floor/ceiling assemblies shall be used to create fire compartments.',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 2,
      floorArea: 1000
    },
    reference: 'RA 9514 IRR Rule 10.2.3',
    specificRequirements: {
      specifications: ({ stories, floorArea, occupancyType }) => {
        let fireRating = '1-hour';
        let specialRequirements = '';
        
        // Determine fire rating based on building height and occupancy
        if (stories >= 4) {
          fireRating = '2-hour';
        }
        if (stories >= 7) {
          fireRating = '3-hour';
        }
        
        // Special requirements based on occupancy type
        const occupancyId = occupancyType?.id || '';
        
        if (occupancyId.includes('healthcare') || occupancyId.includes('hospital')) {
          fireRating = '2-hour';
          specialRequirements = ' Healthcare facilities require smoke compartments with maximum area of 2,000 square meters. Each smoke compartment must have at least two means of egress.';
        } else if (occupancyId.includes('high-hazard') || occupancyId.includes('storage-high')) {
          fireRating = '3-hour';
          specialRequirements = ' High hazard occupancies require 3-hour fire barriers between adjacent occupancies. Maximum area of a high hazard compartment is 1,000 square meters.';
        } else if (occupancyId.includes('assembly')) {
          specialRequirements = ' Assembly occupancies require 2-hour fire barriers when occupant load exceeds 300 persons.';
        } else if (occupancyId.includes('residential')) {
          specialRequirements = ' Residential occupancies require 1-hour fire partitions between dwelling units and 2-hour fire barriers between floors.';
        }
        
        return `Fire barriers with minimum ${fireRating} fire-resistance rating required between different occupancies and at vertical openings. Floor/ceiling assemblies must have the same fire-resistance rating as the walls of the fire compartment.${specialRequirements}`;
      },
      type: 'Fire walls, fire barriers, fire partitions, and fire-rated floor/ceiling assemblies. Fire walls must extend from foundation to roof and must be structurally independent or designed to allow collapse on either side without collapse of the wall.',
      distribution: ({ floorArea, stories }) => {
        let maxCompartmentSize = 2000; // sq m for most occupancies
        let floorRequirement = '';
        
        if (stories > 3) {
          floorRequirement = ' Each floor must be a separate fire compartment with protected vertical openings.';
        }
        
        return `Maximum fire compartment size: ${maxCompartmentSize} square meters for most occupancies (1,000 square meters for high hazard occupancies). Fire barriers must be continuous from exterior wall to exterior wall and from the top of the floor/ceiling assembly below to the underside of the floor or roof above.${floorRequirement}`;
      },
      installation: 'Fire barriers must be continuous and properly sealed at all penetrations. Penetrations must be protected with approved firestop systems tested in accordance with ASTM E814 or UL 1479. Joints must be protected with approved joint systems. Fire doors in fire barriers must have the same fire-resistance rating as the barrier (3-hour walls require 3-hour doors, 2-hour walls require 1.5-hour doors, 1-hour walls require 0.75-hour doors).',
      maintenance: 'Annual visual inspection of all fire barriers, fire doors, and penetration firestop systems. Immediate repair of any damaged fire barriers or penetrations. Fire doors must be inspected and tested annually in accordance with NFPA 80.'
    }
  },
  {
    id: 'smoke-control-systems',
    name: 'Smoke Control Systems',
    description: 'Smoke control systems shall be installed to manage and control the movement of smoke during a fire. These systems are designed to maintain tenable conditions for building evacuation and to assist firefighting operations.',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 6,
      buildingHeight: 18,
      floorArea: 2500
    },
    reference: 'RA 9514 IRR Rule 10.2.6.13',
    specificRequirements: {
      specifications: ({ stories, buildingHeight, floorArea, occupancyType }) => {
        const actualHeight = buildingHeight || stories * 3;
        let systemType = 'Passive smoke control';
        let specialRequirements = '';
        
        // Determine system type based on building height and occupancy
        if (actualHeight > 30 || floorArea > 5000) {
          systemType = 'Active mechanical smoke control';
        }
        
        // Special requirements based on occupancy type
        const occupancyId = occupancyType?.id || '';
        
        if (occupancyId.includes('healthcare') || occupancyId.includes('hospital')) {
          systemType = 'Active mechanical smoke control';
          specialRequirements = ' Healthcare facilities require smoke compartments with mechanical smoke control. Each smoke zone must have independent controls.';
        } else if (occupancyId.includes('assembly')) {
          specialRequirements = ' Assembly occupancies with occupant loads exceeding 1,000 persons require mechanical smoke exhaust systems.';
        } else if (occupancyId.includes('mall') || occupancyId.includes('mercantile')) {
          specialRequirements = ' Mall and large mercantile occupancies require mechanical smoke exhaust systems in sales areas exceeding 2,000 square meters.';
        } else if (occupancyId.includes('atrium') || floorArea > 10000) {
          systemType = 'Engineered smoke control';
          specialRequirements = ' Buildings with atriums or large open spaces require engineered smoke control systems designed specifically for the space configuration.';
        }
        
        return `${systemType} system required. System must be designed to maintain the smoke layer interface at least 1.8 meters (6 feet) above the highest walking surface for a minimum of 20 minutes.${specialRequirements}`;
      },
      type: 'Stairwell pressurization systems for exit stairs; Zoned smoke control for floors; Dedicated smoke exhaust systems for atriums and large open spaces. For smaller buildings: Passive smoke barriers with smoke dampers; Automatic smoke vents for stairwells; Natural or mechanical smoke exhaust systems as required by occupancy.',
      distribution: ({ stories, floorArea }) => {
        let zoneRequirement = 'Each floor should be a separate smoke zone.';
        let exhaustRequirement = '';
        
        if (floorArea > 5000) {
          zoneRequirement = 'Each floor should be divided into multiple smoke zones not exceeding 2,000 square meters each.';
        }
        
        if (stories > 10) {
          exhaustRequirement = ' Mechanical smoke exhaust capacity should be at least 6 air changes per hour or 0.1 square meters per second per 100 square meters of floor area, whichever is greater.';
        } else {
          exhaustRequirement = ' Mechanical smoke exhaust capacity should be at least 4 air changes per hour or 0.06 square meters per second per 100 square meters of floor area, whichever is greater.';
        }
        
        return `${zoneRequirement}${exhaustRequirement} Smoke dampers must be provided at all duct penetrations of smoke barriers.`;
      },
      installation: 'Smoke control systems must be installed in accordance with NFPA 92. All equipment must be listed for its intended use. Smoke detectors for system activation must be installed in accordance with NFPA 72. Control systems must be designed to provide proper sequencing of operations. Emergency power must be provided for all active smoke control components.',
      maintenance: 'Weekly visual inspection of control panels; Monthly testing of dedicated smoke control panel functions; Quarterly testing of damper operation; Annual full functional testing of the entire smoke control system; Dedicated records of all tests and maintenance activities.'
    }
  },
  {
    id: 'emergency-power-systems',
    name: 'Emergency Power Systems',
    description: 'Emergency power systems shall be installed to provide backup power to critical life safety systems during power outages or emergencies.',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 4,
      buildingHeight: 12,
      occupantLoad: 300
    },
    reference: 'RA 9514 IRR Rule 10.2.6.14',
    specificRequirements: {
      specifications: ({ stories, buildingHeight, occupantLoad, occupancyType }) => {
        const actualHeight = buildingHeight || stories * 3;
        let duration = '2 hours';
        let specialRequirements = '';
        
        // Determine duration based on building height and occupancy
        if (actualHeight > 23 || occupantLoad > 1000) {
          duration = '4 hours';
        }
        
        // Special requirements based on occupancy type
        const occupancyId = occupancyType?.id || '';
        
        if (occupancyId.includes('healthcare') || occupancyId.includes('hospital')) {
          duration = '8 hours';
          specialRequirements = ' Healthcare facilities require emergency power for all life safety systems, critical care areas, and essential medical equipment.';
        } else if (occupancyId.includes('high-hazard')) {
          specialRequirements = ' High hazard occupancies require emergency power for ventilation systems, alarm systems, and critical process equipment.';
        } else if (occupancyId.includes('assembly')) {
          specialRequirements = ' Assembly occupancies with occupant loads exceeding 1,000 persons require emergency power for all egress lighting and emergency voice/alarm communication systems.';
        }
        
        return `Emergency power system with minimum ${duration} operation capacity required. System must automatically activate within 10 seconds of normal power loss.${specialRequirements}`;
      },
      type: 'Permanently installed emergency generator with automatic transfer switches for high-risk occupancies and large buildings. Diesel-powered generator with minimum 8-hour fuel supply for healthcare facilities and high-hazard occupancies. For smaller buildings: permanently installed emergency generator or battery systems with automatic transfer switches and minimum 2-hour capacity.',
      distribution: 'Emergency power must be provided for: fire alarm systems, emergency voice/alarm communication systems, automatic fire detection systems, elevator car lighting, means of egress illumination, exit signs, fire pumps, smoke control systems, and electrically powered fire doors.',
      installation: 'Emergency power systems must be installed in accordance with NFPA 110 and NFPA 111. Generator sets must be installed in a dedicated room with minimum 2-hour fire-resistance rating. Transfer switches must be listed for emergency service. Emergency circuits must be clearly marked and separated from normal power circuits.',
      maintenance: 'Weekly testing under no-load conditions for at least 30 minutes; Monthly testing under load conditions for at least 30 minutes; Annual testing under full load conditions for at least 2 hours; Monthly inspection of batteries, fuel levels, and starting systems; Detailed records of all tests and maintenance activities.'
    }
  },
  {
    id: 'elevator-fire-safety',
    name: 'Elevator Fire Safety',
    description: 'Elevators shall be equipped with fire safety features to prevent their use during fire emergencies, except for firefighter service operations, and to protect elevator shafts from the spread of fire and smoke.',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 4,
      buildingHeight: 12
    },
    reference: 'RA 9514 IRR Rule 10.2.6.15',
    specificRequirements: {
      specifications: ({ stories, buildingHeight }) => {
        const actualHeight = buildingHeight || stories * 3;
        let phaseRequirement = 'Phase I emergency recall operation';
        
        if (actualHeight > 23 || stories >= 7) {
          phaseRequirement = 'Phase I emergency recall operation and Phase II emergency in-car operation';
        }
        
        return `All elevators must be equipped with ${phaseRequirement}. Elevator recall must be initiated by smoke detectors installed in each elevator lobby, elevator machine room, and elevator hoistway. Elevators must return to the designated level (typically the main exit floor) upon activation of Phase I emergency recall.`;
      },
      type: 'Firefighter service elevators required in buildings over 30 meters in height. At least one elevator must be designated as a firefighter service elevator and must be capable of reaching all floors in the building. For buildings under 30 meters: Standard elevators with Phase I emergency recall operation. Phase II emergency in-car operation required for buildings over 23 meters in height.',
      distribution: 'Smoke detectors must be installed in each elevator lobby, in the elevator machine room, and at the top of the elevator hoistway. Heat detectors (instead of smoke detectors) may be used in elevator pits where environmental conditions would cause smoke detector false alarms.',
      installation: 'Elevator fire safety features must be installed in accordance with ASME A17.1/CSA B44 Safety Code for Elevators and Escalators. Elevator machine rooms must be protected with automatic sprinklers or clean agent fire suppression systems. Shunt trip circuit breakers must be provided to disconnect elevator power prior to the application of water from sprinklers in the machine room or hoistway.',
      maintenance: 'Monthly testing of Phase I emergency recall operation; Quarterly testing of Phase II emergency in-car operation; Annual full functional testing of all elevator fire safety features; Immediate repair of any defective components; Detailed records of all tests and maintenance activities.'
    }
  },
  {
    id: 'kitchen-fire-suppression',
    name: 'Commercial Kitchen Fire Suppression',
    description: 'Commercial cooking operations shall be protected by automatic fire suppression systems designed specifically for cooking equipment. These systems shall be designed to protect cooking surfaces, exhaust hoods, and ductwork.',
    applicableOccupancies: ['assembly', 'mercantile', 'business', 'educational', 'institutional', 'healthcare-hospitals', 'healthcare-outpatient', 'residential-hotel'],
    thresholds: {},
    reference: 'RA 9514 IRR Rule 10.2.6.16',
    specificRequirements: {
      specifications: ({ occupancyType }) => {
        let specialRequirements = '';
        const occupancyId = occupancyType?.id || '';
        
        if (occupancyId.includes('healthcare') || occupancyId.includes('hospital')) {
          specialRequirements = ' Healthcare facilities require UL 300 compliant wet chemical systems with manual activation capabilities accessible along the path of egress.';
        } else if (occupancyId.includes('assembly')) {
          specialRequirements = ' Assembly occupancies with commercial cooking equipment require automatic shutdown of fuel or power to cooking equipment upon system activation.';
        }
        
        return `UL 300 compliant automatic fire suppression system required for all commercial cooking equipment producing grease-laden vapors. System must provide protection for cooking surfaces, hoods, and associated ductwork.${specialRequirements}`;
      },
      type: 'Wet chemical fire suppression system (preferred); Clean agent systems may be used for specialized applications. System must be specifically listed for protection of commercial cooking equipment.',
      distribution: 'Nozzles must be provided for protection of cooking surfaces, hood plenums, and ductwork. Nozzles must be positioned to provide complete coverage of protected areas. Fusible links or heat detectors must be installed to provide automatic system activation.',
      installation: 'System must be installed in accordance with NFPA 17A and the manufacturer\'s installation instructions. Manual activation device must be located along the path of egress, between 1.0 and 1.2 meters (40-48 inches) above the floor. System must be interconnected with the building fire alarm system (if provided). Automatic shutdown of fuel or power to cooking equipment must be provided upon system activation.',
      maintenance: 'Monthly visual inspection of system components; Semi-annual inspection and maintenance by qualified personnel; Immediate replacement of discharged systems; Cooking equipment must not be operated while suppression system is impaired; Detailed records of all inspections and maintenance activities.'
    }
  },
  {
    id: 'fire-command-center',
    name: 'Fire Command Center',
    description: 'A fire command center shall be provided for buildings with a height of more than 23 meters (75 feet) or buildings with a total occupant load of more than 1,000 persons. The fire command center shall contain all panels and controls for fire safety systems in the building.',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 8,
      buildingHeight: 23,
      occupantLoad: 1000
    },
    reference: 'RA 9514 IRR Rule 10.2.6.17',
    specificRequirements: {
      specifications: ({ stories, buildingHeight, occupantLoad }) => {
        const actualHeight = buildingHeight || stories * 3;
        let roomSize = '10 square meters';
        
        if (actualHeight > 30 || occupantLoad > 3000) {
          roomSize = '15 square meters';
        }
        if (actualHeight > 60 || occupantLoad > 5000) {
          roomSize = '20 square meters';
        }
        
        return `Fire command center must be a minimum of ${roomSize} with a minimum dimension of 3 meters. Room must have a minimum 1-hour fire-resistance rating and direct access to the exterior or exit enclosure.`;
      },
      type: 'Dedicated room containing all necessary controls, indicators, and communications systems for emergency operations.',
      distribution: 'Fire command center must be located on the ground floor with direct access to the exterior or to an exit enclosure. Location must be approved by the local fire department.',
      installation: 'Fire command center must contain: fire alarm control panel, emergency voice/alarm communication system controls, fire department communication system, fire pump status indicators, elevator status and control panels, smoke control system controls, emergency and standby power status indicators, schematic building plans, and emergency telephone. Room must be identified by a permanent sign reading "FIRE COMMAND CENTER" in letters at least 25mm (1 inch) in height.',
      maintenance: 'Weekly visual inspection; Monthly testing of communication systems; Annual full functional testing of all systems and controls; Immediate repair of any defective components; Room must be kept clean and free of storage.'
    }
  },
  {
    id: 'hazardous-materials-storage',
    name: 'Hazardous Materials Storage',
    description: 'Areas used for the storage of hazardous materials shall be designed and constructed to protect occupants, the building, and the environment from the hazards associated with these materials.',
    applicableOccupancies: ['industrial-general', 'industrial-special', 'industrial-high-hazard', 'storage-moderate-hazard', 'storage-high-hazard', 'laboratory', 'educational', 'business'],
    thresholds: {},
    reference: 'RA 9514 IRR Rule 10.2.6.18',
    specificRequirements: {
      specifications: ({ occupancyType }) => {
        let specialRequirements = '';
        const occupancyId = occupancyType?.id || '';
        
        if (occupancyId.includes('high-hazard')) {
          specialRequirements = ' High hazard occupancies require 2-hour fire-rated separation from other occupancies, explosion control measures, and emergency power for ventilation systems.';
        } else if (occupancyId.includes('laboratory')) {
          specialRequirements = ' Laboratories require separate storage rooms for incompatible chemicals, ventilated storage cabinets, and spill control measures.';
        } else if (occupancyId.includes('educational')) {
          specialRequirements = ' Educational occupancies require locked storage cabinets, limited quantities, and separation from classrooms and assembly areas.';
        }
        
        return `Hazardous materials storage areas must be separated from other areas by fire barriers with minimum 1-hour fire-resistance rating. Spill control, secondary containment, and ventilation must be provided based on the types and quantities of materials stored.${specialRequirements}`;
      },
      type: 'Dedicated storage rooms, approved storage cabinets, or safety cans depending on the type and quantity of materials. Flammable liquid storage cabinets must be listed in accordance with UL 1275.',
      distribution: 'Maximum allowable quantities per control area: Class I flammable liquids - 115 liters (30 gallons); Class II combustible liquids - 454 liters (120 gallons); Flammable gases - 57 cubic meters (2,000 cubic feet); Oxidizers and organic peroxides - quantities vary by class. Number of control areas decreases with building height.',
      installation: 'Storage areas must be provided with spill control and secondary containment for liquid materials. Mechanical ventilation system must provide at least 1 cubic foot per minute per square foot of floor area (0.00508 m³/s per m²). Explosion control must be provided for materials that present an explosion hazard. Electrical equipment must be suitable for the hazardous location classification.',
      maintenance: 'Weekly visual inspection; Monthly testing of ventilation systems; Annual testing of spill control and containment systems; Immediate cleanup of spills; Regular inventory control and proper disposal of expired materials; Detailed hazardous materials inventory must be maintained and available to the fire department.'
    }
  },
  {
    id: 'fire-safety-during-construction',
    name: 'Fire Safety During Construction',
    description: 'Temporary fire protection measures shall be implemented during construction, alteration, or demolition operations to protect workers, the public, and adjacent properties from fire hazards.',
    applicableOccupancies: ['all'],
    thresholds: {},
    reference: 'RA 9514 IRR Rule 10.2.6.19',
    specificRequirements: {
      specifications: ({ stories, floorArea }) => {
        let specialRequirements = '';
        
        if (stories > 3) {
          specialRequirements = ' Buildings over 3 stories require a temporary standpipe system extended with construction progress. At least one stairway must be provided with access to all floors.';
        }
        if (floorArea > 5000) {
          specialRequirements += ' Large construction sites require a fire prevention program manager and regular fire safety inspections.';
        }
        
        return `Temporary fire protection equipment must be provided throughout construction. Fire department access must be maintained at all times. Temporary water supply for firefighting must be provided when construction exceeds 12 meters (40 feet) in height.${specialRequirements}`;
      },
      type: 'Temporary fire extinguishers, temporary standpipes, temporary fire alarm systems, and temporary water supplies as required by the stage of construction.',
      distribution: 'Fire extinguishers must be provided at each stairway on all floor levels where combustible materials are present, in all storage and construction sheds, and in locations where flammable or combustible liquids are stored or used. Maximum travel distance to a fire extinguisher must not exceed 23 meters (75 feet).',
      installation: 'Temporary standpipes must be installed when construction reaches a height of 12 meters (40 feet) above the lowest level of fire department access. Standpipes must be extended as construction progresses to within one floor of the highest point of construction. Fire department connections must be marked and accessible. Temporary addressing and signage must be provided to facilitate emergency response.',
      maintenance: 'Daily visual inspection of fire extinguishers and access routes; Weekly inspection of standpipes and water supplies; Immediate replacement of discharged fire extinguishers; Regular removal of combustible debris; Hot work permits required for all cutting, welding, or other hot work operations.'
    }
  }
];
