import { Floor } from '@/lib/calculations';

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
    specifications?: string | ((params: { occupantLoad: number, floorArea: number, stories: number, buildingHeight: number, floors?: Floor[] }) => string);
    distribution?: string;
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
    description: 'An automatic sprinkler system shall be installed in buildings with a height of more than 15 meters (50 feet) or with an occupant load of more than 500 persons, or buildings with a total floor area exceeding 2,000 square meters.',
    applicableOccupancies: ['all'],
    thresholds: {
      occupantLoad: 500,
      stories: 5, // Assuming average floor height of 3m, so 15m ÷ 3m = 5 floors
      buildingHeight: 15,
      floorArea: 2000
    },
    reference: 'RA 9514 IRR Rule 10.2.6.4',
    specificRequirements: {
      specifications: ({ buildingHeight, stories, occupantLoad }) => {
        let pumpPSI = 0;
        // Calculate required pump pressure based on building height
        // Basic formula: 0.433 PSI per foot of height + base pressure
        const baseHeadPressure = 65; // PSI
        const psiPerMeter = 1.42; // 0.433 PSI per foot = ~1.42 PSI per meter
        const actualHeight = buildingHeight || stories * 3;
        
        pumpPSI = Math.ceil(baseHeadPressure + actualHeight * psiPerMeter);
        
        let sprinklerType = "Quick response";
        if (occupantLoad > 1000) {
          sprinklerType = "Standard response";
        }
        
        return `Fire pump minimum pressure: ${pumpPSI} PSI. Water supply duration: minimum 30-60 minutes depending on hazard classification. Sprinkler heads: ${sprinklerType} type for light hazard; Standard response for ordinary and high hazard occupancies.`;
      },
      type: 'Wet pipe system with water under pressure at all times. Dry pipe systems allowed only in areas subject to freezing',
      distribution: 'Light hazard: One sprinkler per 20.9 sq m (225 sq ft); Ordinary hazard: One sprinkler per 12.1 sq m (130 sq ft); High hazard: One sprinkler per 9.3 sq m (100 sq ft)',
      installation: 'Sprinkler heads must be installed in accordance with NFPA 13 or equivalent standards. Maximum distance between sprinklers: 4.6 meters (15 feet) for light hazard; 4.0 meters (13 feet) for ordinary hazard; 3.7 meters (12 feet) for high hazard',
      maintenance: 'Weekly visual inspection of control valves; Monthly inspection of water flow alarm devices; Quarterly inspection of alarm devices; Annual inspection and testing of all components; Five-year internal inspection of piping'
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
        
        if (!floors || floors.length === 0) {
          // If no floor data, use the total floor area
          const extinguishersRequired = Math.max(1, Math.ceil(floorArea / 278));
          
          // Additional extinguishers for high occupant load
          let additionalExtinguishers = 0;
          if (occupantLoad > 200) {
            additionalExtinguishers = Math.floor(occupantLoad / 200);
          }
          
          const total = extinguishersRequired + additionalExtinguishers;
          return `Minimum ${total} fire extinguisher(s) required for the building.`;
        }
        
        // Calculate extinguishers needed for each individual floor
        let totalExtinguishers = 0;
        
        // Calculate the requirements for each floor individually
        const floorRequirements = floors.map(floor => {
          // Basic calculation: 1 extinguisher per 278 sq meters (3,000 sq ft) or fraction thereof
          const baseExtinguishers = Math.max(1, Math.ceil(floor.area / 278));
          
          // Additional extinguishers for high occupant load
          let additionalExtinguishers = 0;
          if (floor.occupantLoad > 200) {
            additionalExtinguishers = Math.floor(floor.occupantLoad / 200);
          }
          
          const floorTotal = baseExtinguishers + additionalExtinguishers;
          totalExtinguishers += floorTotal;
          
          return floorTotal;
        });
        
        // Find the most common requirement for display purposes
        const counts = {};
        floorRequirements.forEach(count => {
          counts[count] = (counts[count] || 0) + 1;
        });
        
        // Find the most frequent requirement
        let mostCommonRequirement = floorRequirements[0];
        let highestCount = 1;
        
        Object.keys(counts).forEach(count => {
          if (counts[count] > highestCount) {
            mostCommonRequirement = parseInt(count);
            highestCount = counts[count];
          }
        });
        
        // If all floors have different requirements, show a range
        const minReq = Math.min(...floorRequirements);
        const maxReq = Math.max(...floorRequirements);
        
        let perFloorText = '';
        if (minReq === maxReq) {
          // All floors have the same requirement
          perFloorText = `${minReq} fire extinguisher(s) required per floor`;
        } else if (highestCount >= floorCount / 2) {
          // Most floors have the same requirement
          perFloorText = `${mostCommonRequirement} fire extinguisher(s) required for most floors (varies by floor area and occupant load)`;
        } else {
          // Requirements vary significantly
          perFloorText = `${minReq}-${maxReq} fire extinguisher(s) required per floor (varies by floor area and occupant load)`;
        }
        
        return `${perFloorText}. Total of ${totalExtinguishers} fire extinguisher(s) required for the entire building.`;
      },
      type: 'Type ABC (multi-purpose dry chemical) for general areas; Type K for kitchens; Type BC for electrical equipment areas. For computer rooms and sensitive electronic equipment areas, clean agent extinguishers are recommended.',
      specifications: 'Minimum rating of 2-A:10-B:C for light hazard occupancies; 4-A:40-B:C for ordinary hazard; 6-A:80-B:C for high hazard. Each extinguisher must have a valid inspection tag and be fully charged.',
      distribution: 'Maximum travel distance of 23 meters (75 feet) to a fire extinguisher. Extinguishers must be placed along normal paths of travel and near exits. Additional extinguishers are required for specific hazards such as kitchens, mechanical rooms, and storage areas.',
      installation: 'Top of extinguisher not more than 1.5 meters (5 feet) above the floor; bottom not less than 10 cm (4 inches) above the floor. Extinguishers weighing more than 18 kg (40 lbs) must be installed so that the top is not more than 1.07 meters (3.5 feet) above the floor.',
      maintenance: 'Monthly visual inspection; annual maintenance by certified technician; hydrostatic testing every 5-12 years depending on type; immediate replacement of damaged or discharged extinguishers.'
    }
  },
  {
    id: 'fire-alarm-system',
    name: 'Fire Detection and Alarm System',
    description: 'An approved fire detection and alarm system shall be installed in buildings with an occupant load of 50 or more persons.',
    applicableOccupancies: ['all'],
    thresholds: {
      occupantLoad: 50
    },
    reference: 'RA 9514 IRR Rule 10.2.6.5',
    specificRequirements: {
      quantity: ({ occupantLoad, stories, floors }) => {
        const floorCount = floors ? floors.length : stories || 1;
        let alarmsPerFloor = 2; // Minimum 2 alarm devices per floor
        let manualStationsPerFloor = 1; // Minimum 1 manual pull station per floor
        
        // Calculate based on occupant load per floor
        const avgOccupantLoadPerFloor = Math.ceil(occupantLoad / floorCount);
        
        if (avgOccupantLoadPerFloor > 100) {
          // For larger floors, add more alarm devices
          alarmsPerFloor = Math.ceil(avgOccupantLoadPerFloor / 100) + 1;
          // For larger floors, add more manual stations
          manualStationsPerFloor = Math.max(2, Math.ceil(avgOccupantLoadPerFloor / 200));
        }
        
        return `Minimum ${alarmsPerFloor} alarm notification devices required per floor. Minimum ${manualStationsPerFloor} manual pull station(s) required per floor. Total of ${alarmsPerFloor * floorCount} alarm devices and ${manualStationsPerFloor * floorCount} manual pull stations required for the building.`;
      },
      specifications: ({ occupantLoad, stories, floors }) => {
        const floorCount = floors ? floors.length : stories || 1;
        let systemType = "Conventional fire alarm system";
        if (occupantLoad > 300 || floorCount > 3) {
          systemType = "Addressable fire alarm system";
        }
        
        let additionalRequirements = "";
        if (floorCount > 5 || occupantLoad > 1000) {
          additionalRequirements = " System must include voice evacuation capabilities and emergency communication system.";
        }
        
        return `${systemType} with manual pull stations, smoke detectors, heat detectors, and audio-visual alarm devices.${additionalRequirements} Each floor requires separate zone identification on the main control panel.`;
      },
      distribution: 'Manual pull stations at each exit and at each exit stairway on each floor. Maximum travel distance to a manual pull station shall not exceed 60 meters (200 feet). Alarm notification devices must be installed so that they are clearly audible and visible throughout all occupied areas with a sound level at least 15 dB above the average ambient sound level.',
      installation: 'Control panel shall be located at the main entrance or in a constantly attended location. Smoke detectors in corridors spaced not more than 9 meters (30 feet) apart. Manual pull stations must be installed at a height of 1.1 to 1.37 meters (42 to 54 inches) above the floor.',
      maintenance: 'Monthly testing of manual pull stations; Quarterly testing of alarm notification devices; Annual testing of all components; Complete system test and certification annually by a qualified technician.'
    }
  },

  {
    id: 'fire-exit-doors',
    name: 'Means of Egress - Exit Doors',
    description: 'Fire exit doors shall be provided for all occupancies with an occupant load of more than 10 persons. The number and width of exits shall be in accordance with the occupant load.',
    applicableOccupancies: ['all'],
    thresholds: {
      occupantLoad: 10
    },
    reference: 'RA 9514 IRR Rule 10.2.5.2',
    specificRequirements: {
      quantity: ({ occupantLoad, floors }) => {
        // Calculate required exits per floor based on occupant load per floor
        const floorCount = floors ? floors.length : 1;
        const avgOccupantLoadPerFloor = Math.ceil(occupantLoad / floorCount);
        let requiredExitsPerFloor = 1;
        
        if (avgOccupantLoadPerFloor > 50 && avgOccupantLoadPerFloor <= 500) {
          requiredExitsPerFloor = 2;
        } else if (avgOccupantLoadPerFloor > 500 && avgOccupantLoadPerFloor <= 1000) {
          requiredExitsPerFloor = 3;
        } else if (avgOccupantLoadPerFloor > 1000) {
          requiredExitsPerFloor = 4;
        }
        
        // Calculate total exits for the building
        let totalRequiredExits = 1;
        if (occupantLoad > 50 && occupantLoad <= 500) {
          totalRequiredExits = 2;
        } else if (occupantLoad > 500 && occupantLoad <= 1000) {
          totalRequiredExits = 3;
        } else if (occupantLoad > 1000) {
          totalRequiredExits = 4;
        }
        
        return `Minimum ${requiredExitsPerFloor} exit(s) required per floor. Total of ${totalRequiredExits} exit(s) required for the building.`;
      },
      specifications: ({ occupantLoad, floors }) => {
        // Calculate required exit width: 5 mm per person for stairs, 3.3 mm per person for level components
        const floorCount = floors ? floors.length : 1;
        const avgOccupantLoadPerFloor = Math.ceil(occupantLoad / floorCount);
        const stairWidth = Math.ceil(avgOccupantLoadPerFloor * 5) / 1000;
        const doorWidth = Math.ceil(avgOccupantLoadPerFloor * 3.3) / 1000;
        
        return `Minimum exit door width: ${Math.max(0.81, doorWidth).toFixed(2)} meters. Minimum stair width: ${Math.max(1.12, stairWidth).toFixed(2)} meters. Each floor requires separate exits with proper signage.`;
      },
      installation: 'Exit doors shall swing in the direction of exit travel when serving an occupant load of 50 or more. Exit doors shall be equipped with panic hardware when serving an occupant load of 100 or more. Maximum travel distance to an exit shall not exceed 60 meters (200 feet) for unsprinklered buildings or 90 meters (300 feet) for sprinklered buildings.',
      maintenance: 'Monthly inspection of exit doors, hardware, and signs; Annual testing of panic hardware; Quarterly inspection of exit pathways to ensure they remain unobstructed.'
    }
  },
  {
    id: 'emergency-lighting',
    name: 'Emergency Lighting',
    description: 'Emergency lighting shall be provided in all means of egress for buildings with an occupant load of more than 50 persons.',
    applicableOccupancies: ['all'],
    thresholds: {
      occupantLoad: 50
    },
    reference: 'RA 9514 IRR Rule 10.2.5.7',
    specificRequirements: {
      specifications: 'Emergency lighting shall provide initial illumination of not less than 10 lux (1 foot-candle) and not less than 1 lux (0.1 foot-candle) at any point measured along the path of egress at floor level',
      type: 'Battery-powered emergency lights or generator-powered lighting system',
      installation: 'Emergency lighting shall be arranged to provide initial illumination along the path of egress and shall be so arranged that the failure of any single lighting unit will not leave any area in darkness',
      maintenance: 'Monthly functional testing for a minimum of 30 seconds; Annual testing for 90 minutes'
    }
  },
  {
    id: 'exit-signs',
    name: 'Exit Signs and Directional Signs',
    description: 'Illuminated exit signs and directional signs shall be provided in all means of egress for buildings with an occupant load of more than 50 persons.',
    applicableOccupancies: ['all'],
    thresholds: {
      occupantLoad: 50
    },
    reference: 'RA 9514 IRR Rule 10.2.5.6',
    specificRequirements: {
      specifications: 'Exit signs shall be illuminated at all times. Signs shall use letters not less than 15 cm (6 inches) high with principal strokes not less than 1.9 cm (3/4 inch) wide',
      type: 'Internally illuminated signs with letters in high contrast colors (typically green or red letters on black background)',
      installation: 'Exit signs shall be placed so that no point in an exit access corridor is more than 30 meters (100 feet) from the nearest visible sign. Directional signs shall be provided where the direction of travel to reach the nearest exit is not apparent',
      maintenance: 'Monthly inspection and testing of all exit signs; Annual testing of backup power supply'
    }
  },
  {
    id: 'standpipe-system',
    name: 'Standpipe System',
    description: 'A standpipe system shall be installed in buildings with a height of more than 15 meters.',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 5, // Assuming average floor height of 3m, so 15m ÷ 3m = 5 floors
      buildingHeight: 15
    },
    reference: 'RA 9514 IRR Rule 10.2.6.3',
    specificRequirements: {
      specifications: ({ buildingHeight, stories }) => {
        let standpipeClass = "Class I";
        let standpipeSize = "100 mm (4 inches)";
        
        if ((buildingHeight || stories * 3) > 30) {
          standpipeClass = "Class I and Class III";
          standpipeSize = "150 mm (6 inches)";
        }
        
        return `${standpipeClass} standpipe system with ${standpipeSize} risers. Minimum flow rate of 500 GPM (1,893 LPM) for the first standpipe and 250 GPM (946 LPM) for each additional standpipe, up to a maximum of 1,250 GPM (4,731 LPM).`;
      },
      distribution: 'Hose connections at each floor level located in the exit stairway. Maximum distance between standpipes shall not exceed 61 meters (200 feet)',
      installation: 'Fire department connections shall be located on the street side of the building and shall be not less than 0.45 meters (18 inches) or more than 1.2 meters (4 feet) above grade',
      maintenance: 'Monthly visual inspection; Annual flow test; Five-year hydrostatic test at 200 PSI (13.8 bar) for 2 hours'
    }
  },
  {
    id: 'wet-standpipe-system',
    name: 'Wet Standpipe System',
    description: 'A wet standpipe system shall be installed in buildings with a height of more than 23 meters (75 feet).',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 8, // Assuming average floor height of 3m, so 23m ÷ 3m ≈ 8 floors
      buildingHeight: 23
    },
    reference: 'RA 9514 IRR Rule 10.2.6.3.2',
    specificRequirements: {
      specifications: ({ buildingHeight, stories }) => {
        const actualHeight = buildingHeight || stories * 3;
        let pumpPressure = Math.ceil(65 + (actualHeight * 1.42)); // Base pressure + height pressure
        
        return `Wet standpipe system with automatic fire pump rated at minimum ${pumpPressure} PSI. System must maintain a minimum residual pressure of 65 PSI (4.5 bar) at the topmost hose connection when flowing 500 GPM (1,893 LPM).`;
      },
      type: 'Wet system with water under pressure at all times',
      distribution: 'Hose connections at each floor level with 38 mm (1.5 inch) and 65 mm (2.5 inch) outlets. Maximum distance between standpipes shall not exceed 61 meters (200 feet)',
      installation: 'Main riser diameter must be minimum 150 mm (6 inches). Fire department connections must be provided at street level. System must be interconnected with the building\'s fire pump and water supply',
      maintenance: 'Weekly visual inspection of control valves; Monthly flow tests; Annual full flow test; Five-year hydrostatic test at 200 PSI (13.8 bar) for 2 hours'
    }
  },
  {
    id: 'fire-pump',
    name: 'Fire Pump',
    description: 'A fire pump shall be installed for buildings requiring wet standpipe systems or automatic sprinkler systems with a height of more than 23 meters.',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 8, // Assuming average floor height of 3m, so 23m ÷ 3m ≈ 8 floors
      buildingHeight: 23
    },
    reference: 'RA 9514 IRR Rule 10, Division 3',
    specificRequirements: {
      specifications: ({ buildingHeight, stories }) => {
        const actualHeight = buildingHeight || stories * 3;
        let pumpCapacity = 500; // Base capacity in GPM
        let pumpPressure = Math.ceil(65 + (actualHeight * 1.42)); // Base pressure + height pressure
        
        if (actualHeight > 30) {
          pumpCapacity = 750;
        }
        if (actualHeight > 60) {
          pumpCapacity = 1000;
        }
        
        return `Fire pump with minimum capacity of ${pumpCapacity} GPM (${pumpCapacity * 3.785} LPM) at ${pumpPressure} PSI. Electric fire pump with backup diesel generator or separate diesel fire pump required.`;
      },
      installation: 'Fire pump must be installed in a dedicated fire pump room with 2-hour fire resistance rating. Room must have direct access to the outside or to a fire-rated exit corridor',
      maintenance: 'Weekly visual inspection and churn test; Monthly no-flow test; Annual flow test; Comprehensive maintenance every 3 years'
    }
  },
  {
    id: 'fire-detection-system',
    name: 'Fire Detection System',
    description: 'A fire detection system shall be installed in buildings with an occupant load of more than 100 persons to provide early warning of fire conditions.',
    applicableOccupancies: ['all'],
    thresholds: {
      occupantLoad: 100
    },
    reference: 'RA 9514 IRR Rule 10, Division 5',
    specificRequirements: {
      specifications: 'System must include smoke detectors, heat detectors, and manual pull stations as appropriate for the occupancy. Detection devices must be connected to a control panel that initiates an alarm signal upon activation.',
      type: 'Smoke detectors for early warning; Heat detectors for areas where smoke detectors may cause false alarms (kitchens, mechanical rooms); Manual pull stations at exits',
      distribution: 'Smoke detectors must be installed in all corridors, common areas, and paths of egress. Maximum spacing between smoke detectors: 9 meters (30 feet). Heat detectors must be installed in kitchens, mechanical rooms, and other areas where smoke detectors are not suitable.',
      installation: 'Detectors must be installed in accordance with NFPA 72 or equivalent standards. Control panel must be located in a constantly attended location or monitored remotely.',
      maintenance: 'Monthly visual inspection; Quarterly testing of a sample of devices; Annual testing of all devices; Replacement of devices at end of service life (typically 10 years for smoke detectors)'
    }
  },
  {
    id: 'fire-safety-officer',
    name: 'Fire Safety Officer',
    description: 'A certified fire safety officer shall be designated for buildings with an occupant load of more than 500 persons.',
    applicableOccupancies: ['all'],
    thresholds: {
      occupantLoad: 500
    },
    reference: 'RA 9514 IRR Rule 9',
    specificRequirements: {
      specifications: 'Must be certified by the Bureau of Fire Protection (BFP) and must have completed the prescribed Fire Safety Officer Training Course',
      maintenance: 'Must maintain certification through continuing education and periodic recertification as required by BFP'
    }
  },
  {
    id: 'fire-safety-plan',
    name: 'Fire Safety Plan',
    description: 'A fire safety plan shall be prepared and maintained for buildings with an occupant load of more than 100 persons.',
    applicableOccupancies: ['all'],
    thresholds: {
      occupantLoad: 100
    },
    reference: 'RA 9514 IRR Rule 9.0.4',
    specificRequirements: {
      specifications: 'Must include emergency procedures, evacuation plans, location of fire protection equipment, and contact information for emergency personnel',
      installation: 'Must be posted in conspicuous locations throughout the building',
      maintenance: 'Must be reviewed and updated annually or whenever there are changes to the building layout or occupancy'
    }
  },
  {
    id: 'fire-drill',
    name: 'Fire Drill',
    description: 'Fire drills shall be conducted at least twice a year for buildings with an occupant load of more than 50 persons.',
    applicableOccupancies: ['all'],
    thresholds: {
      occupantLoad: 50
    },
    reference: 'RA 9514 IRR Rule 9.0.5',
    specificRequirements: {
      specifications: 'Must include complete evacuation of all occupants to a designated assembly area. Must test alarm systems and evacuation procedures',
      maintenance: 'Records of all fire drills must be maintained, including date, time, participants, evacuation time, and any issues identified'
    }
  },
  {
    id: 'fire-hydrant',
    name: 'Fire Hydrant',
    description: 'A fire hydrant shall be installed within 100 meters of the building with a floor area of more than 2,000 square meters.',
    applicableOccupancies: ['all'],
    thresholds: {
      floorArea: 2000
    },
    reference: 'RA 9514 IRR Rule 10, Division 3',
    specificRequirements: {
      quantity: ({ floorArea }) => {
        let hydrantCount = 1;
        if (floorArea > 5000) {
          hydrantCount = 2;
        } else if (floorArea > 10000) {
          hydrantCount = 3;
        }
        return `Minimum ${hydrantCount} fire hydrant(s) required`;
      },
      specifications: 'Minimum flow rate of 1,000 GPM (3,785 LPM) for high-value districts; 500 GPM (1,893 LPM) for residential areas',
      distribution: 'Maximum distance between hydrants shall not exceed 150 meters (500 feet) in high-value districts; 300 meters (1,000 feet) in residential areas',
      installation: 'Hydrants shall be located not less than 12 meters (40 feet) from the building. Hydrants shall be installed so that the center of the 115 mm (4.5 inch) outlet is not less than 0.45 meters (18 inches) above grade',
      maintenance: 'Semi-annual inspection and testing; Annual flow test; Five-year flow test and maintenance'
    }
  },
  {
    id: 'fire-department-connection',
    name: 'Fire Department Connection',
    description: 'A fire department connection shall be installed for buildings with a height of more than 15 meters.',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 5, // Assuming average floor height of 3m, so 15m ÷ 3m = 5 floors
      buildingHeight: 15
    },
    reference: 'RA 9514 IRR Rule 10.2.6.3.3',
    specificRequirements: {
      specifications: 'Minimum 100 mm (4-inch) connection with two 65 mm (2.5-inch) inlets with National Standard threads',
      installation: 'Located on the street side of the building, not less than 0.45 meters (18 inches) and not more than 1.2 meters (4 feet) above grade. Must be identified with a sign reading "FIRE DEPARTMENT CONNECTION" in red letters at least 25 mm (1 inch) high',
      maintenance: 'Quarterly inspection; Annual testing; Must be kept clear and accessible at all times'
    }
  },
  {
    id: 'smoke-control-system',
    name: 'Smoke Control System',
    description: 'A smoke control system shall be installed in buildings with a height of more than 30 meters.',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 10, // Assuming average floor height of 3m, so 30m ÷ 3m = 10 floors
      buildingHeight: 30
    },
    reference: 'RA 9514 IRR Rule 10.2.6.6',
    specificRequirements: {
      specifications: 'Smoke control system must be capable of maintaining tenable conditions during a fire event. System must be designed to prevent smoke migration from the fire floor to exit stairways and other floors',
      type: 'Mechanical smoke exhaust system with dedicated fans and ductwork, or pressurization system for stairwells and exit corridors',
      installation: 'System must be connected to emergency power supply. Control panel must be located at the fire command center or at the main entrance',
      maintenance: 'Quarterly testing of smoke control equipment; Annual full functional testing; Dedicated maintenance program required'
    }
  },
  {
    id: 'fire-pump',
    name: 'Fire Pump',
    description: 'A fire pump shall be installed for buildings with a height of more than 30 meters (100 feet) or with an occupant load of more than 1,000 persons.',
    applicableOccupancies: ['all'],
    thresholds: {
      occupantLoad: 1000,
      stories: 10, // Assuming average floor height of 3m, so 30m ÷ 3m = 10 floors
      buildingHeight: 30
    },
    reference: 'RA 9514 IRR Rule 10.2.6.3.4',
    specificRequirements: {
      specifications: ({ buildingHeight, stories }) => {
        const actualHeight = buildingHeight || stories * 3;
        let pumpCapacity = 500; // Base capacity in GPM
        let pumpPressure = Math.ceil(65 + (actualHeight * 1.42)); // Base pressure + height pressure
        
        if (actualHeight > 30) {
          pumpCapacity = 750;
        }
        if (actualHeight > 60) {
          pumpCapacity = 1000;
        }
        
        return `Fire pump with minimum capacity of ${pumpCapacity} GPM (${pumpCapacity * 3.785} LPM) at ${pumpPressure} PSI. Electric fire pump with backup diesel generator or separate diesel fire pump required.`;
      },
      type: 'Electric motor-driven fire pump with backup power source or diesel engine-driven fire pump',
      installation: 'Pump must be installed in a dedicated fire pump room with 2-hour fire resistance rating. Room must be provided with adequate ventilation and drainage',
      maintenance: 'Weekly visual inspection; Monthly no-flow test; Annual flow test; Comprehensive maintenance program required'
    }
  },
  {
    id: 'fire-command-center',
    name: 'Fire Command Center',
    description: 'A fire command center shall be provided for buildings with a height of more than 23 meters (75 feet).',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 8, // Assuming average floor height of 3m, so 23m ÷ 3m ≈ 8 floors
      buildingHeight: 23
    },
    reference: 'RA 9514 IRR Rule 10.2.5.8',
    specificRequirements: {
      specifications: 'Minimum area of 9.3 square meters (100 square feet) with minimum dimension of 2.4 meters (8 feet)',
      installation: 'Located on the ground floor with direct access to the exterior. Room must have 2-hour fire resistance rating',
      type: 'Must contain fire alarm control panel, emergency voice/alarm communication system, fire department communication system, fire pump status indicators, elevator status and controls, smoke control panel, and emergency and standby power status indicators'
    }
  },
  {
    id: 'fire-resistance-rating',
    name: 'Fire Resistance Rating',
    description: 'Building elements shall have a fire resistance rating in accordance with the occupancy type and building height.',
    applicableOccupancies: ['all'],
    thresholds: {},
    reference: 'RA 9514 IRR Rule 7',
    specificRequirements: {
      specifications: ({ stories }) => {
        let structuralFrameRating = '1 hour';
        let bearingWallsRating = '1 hour';
        let floorConstructionRating = '1 hour';
        let roofConstructionRating = '1 hour';
        let exteriorWallsRating = '1 hour';
        
        if (stories >= 5) {
          structuralFrameRating = '2 hours';
          bearingWallsRating = '2 hours';
          floorConstructionRating = '2 hours';
        }
        
        if (stories >= 10) {
          structuralFrameRating = '3 hours';
          bearingWallsRating = '3 hours';
          floorConstructionRating = '2 hours';
          exteriorWallsRating = '2 hours';
        }
        
        return `Structural frame: ${structuralFrameRating}. Bearing walls: ${bearingWallsRating}. Floor construction: ${floorConstructionRating}. Roof construction: ${roofConstructionRating}. Exterior walls: ${exteriorWallsRating}.`;
      },
      type: 'Fire resistance ratings must be achieved through approved materials and assemblies tested according to recognized standards',
      installation: 'All penetrations through fire-rated assemblies must be properly sealed with approved firestopping materials'
    }
  },
  {
    id: 'emergency-power-supply',
    name: 'Emergency Power Supply',
    description: 'An emergency power supply shall be provided for buildings with a height of more than 23 meters (75 feet) or with an occupant load of more than 500 persons.',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 8, // Assuming average floor height of 3m, so 23m ÷ 3m ≈ 8 floors
      buildingHeight: 23,
      occupantLoad: 500
    },
    reference: 'RA 9514 IRR Rule 10',
    specificRequirements: {
      specifications: 'Emergency power must be capable of providing power for a minimum duration of 2 hours',
      type: 'Diesel generator set or other approved emergency power supply system',
      installation: 'Emergency power supply must be installed in a dedicated room with 2-hour fire resistance rating',
      maintenance: 'Weekly testing under no-load conditions; Monthly testing under load conditions; Annual full load test for minimum 2 hours'
    }
  },
  {
    id: 'means-of-egress',
    name: 'Means of Egress',
    description: 'Means of egress shall be provided in accordance with the occupant load and travel distance requirements.',
    applicableOccupancies: ['all'],
    thresholds: {},
    reference: 'RA 9514 IRR Rule 10, Division 2',
    specificRequirements: {
      specifications: ({ occupantLoad, stories }) => {
        let maxTravelDistance = '60 meters (200 feet) for unsprinklered buildings; 90 meters (300 feet) for sprinklered buildings';
        let exitWidth = Math.max(0.81, Math.ceil(occupantLoad * 3.3) / 1000).toFixed(2);
        let stairWidth = Math.max(1.12, Math.ceil(occupantLoad * 5) / 1000).toFixed(2);
        
        return `Maximum travel distance: ${maxTravelDistance}. Minimum exit door width: ${exitWidth} meters. Minimum stair width: ${stairWidth} meters.`;
      },
      type: 'Exits must be clearly marked with illuminated exit signs. Exit access, exit, and exit discharge must be continuously maintained free of obstructions',
      installation: 'Exit doors must swing in the direction of exit travel when serving an occupant load of 50 or more. Dead-end corridors must not exceed 6 meters (20 feet) in length',
      maintenance: 'Monthly inspection of exit pathways, doors, and signs; Annual testing of emergency lighting and exit signs'
    }
  },
  {
    id: 'fire-barrier',
    name: 'Fire Barriers and Partitions',
    description: 'Fire barriers and partitions shall be provided to separate different occupancies and hazardous areas.',
    applicableOccupancies: ['all'],
    thresholds: {},
    reference: 'RA 9514 IRR Rule 7',
    specificRequirements: {
      specifications: 'Fire barriers separating different occupancies must have a minimum 2-hour fire resistance rating. Fire barriers enclosing exit stairways must have a minimum 2-hour fire resistance rating',
      type: 'Fire barriers must extend from the floor to the underside of the floor or roof above, or to the underside of the fire-rated floor/ceiling or roof/ceiling assembly',
      installation: 'All penetrations through fire barriers must be protected with approved firestopping materials. Doors in fire barriers must be fire-rated and self-closing',
      maintenance: 'Annual inspection of fire barriers, doors, and penetration seals'
    }
  },
  {
    id: 'fire-safety-maintenance-report',
    name: 'Fire Safety Maintenance Report (FSMR)',
    description: 'A Fire Safety Maintenance Report (FSMR) shall be prepared and maintained by the building owner or administrator, documenting all fire safety features, equipment, and procedures.',
    applicableOccupancies: ['all'],
    thresholds: {},
    reference: 'RA 9514 IRR Rule 10.1.4',
    specificRequirements: {
      specifications: 'The FSMR shall include an inventory of all fire protection equipment and systems, maintenance schedules, testing records, and inspection reports.',
      type: 'Written document with electronic backup recommended',
      distribution: 'Copies shall be maintained on-site and be readily available for inspection by fire safety officials',
      installation: 'Not applicable',
      maintenance: 'Monthly updates for routine maintenance; Immediate updates for any changes to fire protection systems or equipment; Annual comprehensive review and update'
    }
  },
  {
    id: 'fire-safety-inspection-certificate',
    name: 'Fire Safety Inspection Certificate (FSIC)',
    description: 'A Fire Safety Inspection Certificate (FSIC) shall be obtained from the Bureau of Fire Protection prior to occupancy and shall be renewed annually.',
    applicableOccupancies: ['all'],
    thresholds: {},
    reference: 'RA 9514 IRR Rule 9',
    specificRequirements: {
      specifications: 'The FSIC certifies that the building complies with all applicable fire safety requirements and standards.',
      type: 'Official document issued by the Bureau of Fire Protection',
      distribution: 'Original copy shall be displayed prominently at the main entrance or lobby of the building',
      installation: 'Not applicable',
      maintenance: 'Annual renewal required after inspection by the Bureau of Fire Protection'
    }
  },
  {
    id: 'smoke-control-system',
    name: 'Smoke Control System',
    description: 'A smoke control system shall be installed in buildings with an atrium or in high-rise buildings with a height of more than 23 meters (75 feet).',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 8, // Assuming average floor height of 3m, so 23m ÷ 3m ≈ 8 floors
      buildingHeight: 23
    },
    reference: 'RA 9514 IRR Rule 10.2.6.8',
    specificRequirements: {
      specifications: ({ buildingHeight, stories }) => {
        const actualHeight = buildingHeight || stories * 3;
        let systemType = "Mechanical smoke control system";
        
        if (actualHeight > 30) {
          systemType = "Pressurized stairwells and mechanical smoke control system";
        }
        
        return `${systemType} with smoke detectors, dampers, and fans. System must maintain a pressure differential of at least 0.05 inches of water (12.5 Pa) across smoke barriers.`;
      },
      type: 'Mechanical exhaust system, pressurization system, or combination system',
      installation: 'System must be designed in accordance with NFPA 92 or equivalent standards. Control panel shall be located at the fire command center',
      maintenance: 'Quarterly testing of all components; Annual full system test; Comprehensive maintenance every 3 years'
    }
  },
  {
    id: 'fire-command-center',
    name: 'Fire Command Center',
    description: 'A fire command center shall be provided in buildings with a height of more than 23 meters (75 feet) or with an occupant load of more than 1,000 persons.',
    applicableOccupancies: ['all'],
    thresholds: {
      occupantLoad: 1000,
      stories: 8, // Assuming average floor height of 3m, so 23m ÷ 3m ≈ 8 floors
      buildingHeight: 23
    },
    reference: 'RA 9514 IRR Rule 10.2.6.9',
    specificRequirements: {
      specifications: 'The fire command center shall be separated from the remainder of the building by a fire barrier with a minimum 2-hour fire resistance rating. The room shall be a minimum of 10 square meters (96 square feet) with a minimum dimension of 2.4 meters (8 feet).',
      type: 'Dedicated room with fire alarm control panel, emergency voice/alarm communication system, fire department communication system, and controls for smoke control systems',
      installation: 'The fire command center shall be located at the main entrance or at a location approved by the fire department. The room shall be provided with emergency lighting and ventilation',
      maintenance: 'Monthly inspection of all components; Annual testing of all systems; Comprehensive maintenance every 3 years'
    }
  },
  {
    id: 'emergency-evacuation-plan',
    name: 'Emergency Evacuation Plan',
    description: 'An emergency evacuation plan shall be prepared and maintained for all buildings with an occupant load of more than 50 persons.',
    applicableOccupancies: ['all'],
    thresholds: {
      occupantLoad: 50
    },
    reference: 'RA 9514 IRR Rule 10.2.5.11',
    specificRequirements: {
      specifications: 'The emergency evacuation plan shall include procedures for reporting emergencies, occupant and staff response to emergencies, evacuation, relocation, and accounting for occupants.',
      type: 'Written document with floor plans showing exit routes, assembly points, and locations of fire protection equipment',
      distribution: 'Copies shall be provided to all building staff and posted at conspicuous locations on each floor',
      installation: 'Floor plans shall be oriented correctly with "YOU ARE HERE" markers',
      maintenance: 'Annual review and update; Immediate update following any changes to the building layout or fire protection systems'
    }
  },
  {
    id: 'alternate-exits-stairs-ladders',
    name: 'Alternate Exits, Stairs, and Ladders',
    description: 'Alternate means of egress including stairs, ladders, and emergency exits shall be provided in accordance with the occupant load and building height requirements.',
    applicableOccupancies: ['all'],
    thresholds: {
      occupantLoad: 10,
      stories: 2
    },
    reference: 'RA 9514 IRR Rule 10.2.5.3',
    specificRequirements: {
      quantity: ({ occupantLoad, stories }) => {
        let requiredStairways = 1;
        if (stories > 1) {
          if (occupantLoad > 500 && occupantLoad <= 1000) {
            requiredStairways = 2;
          } else if (occupantLoad > 1000) {
            requiredStairways = 3;
          }
        }
        return `Minimum ${requiredStairways} stairway(s) required for multi-story buildings`;
      },
      specifications: ({ occupantLoad, stories }) => {
        const stairWidth = Math.max(1.12, Math.ceil(occupantLoad * 5) / 1000).toFixed(2);
        let requirements = `Minimum stair width: ${stairWidth} meters. `;
        
        if (stories > 4) {
          requirements += 'For buildings over 4 stories: Stairways must be constructed of non-combustible materials with a minimum 2-hour fire resistance rating. ';
        }
        
        if (occupantLoad > 100) {
          requirements += 'Emergency stairways must be pressurized or enclosed to prevent smoke infiltration. ';
        }
        
        requirements += 'Maximum riser height: 18 cm (7 inches). Minimum tread depth: 28 cm (11 inches). Minimum headroom: 2.1 meters (7 feet).';
        
        return requirements;
      },
      type: 'Interior exit stairways, exterior exit stairways, fire escape stairs, or ladders depending on building type and occupancy. Scissor stairs (two separate stairways within the same enclosure) are permitted if properly separated by fire-rated construction.',
      installation: 'Stairways must discharge directly to the exterior or to a fire-rated exit passageway leading to the exterior. Stairways must be enclosed with fire-rated construction (minimum 1-hour for buildings up to 3 stories, 2-hour for buildings 4 stories or more). Stairways must have emergency lighting and exit signs.',
      maintenance: 'Monthly inspection of stairways, handrails, and treads; Annual testing of emergency lighting and exit signs; Immediate repair of any damaged components'
    }
  },
  {
    id: 'alternate-power-supply-fdas',
    name: 'Alternate Power Supply for Fire Detection and Alarm Systems',
    description: 'An alternate power supply shall be provided for fire detection and alarm systems in buildings with an occupant load of more than 100 persons or buildings with more than 3 stories.',
    applicableOccupancies: ['all'],
    thresholds: {
      occupantLoad: 100,
      stories: 3
    },
    reference: 'RA 9514 IRR Rule 10.2.6.5 / NFPA 72',
    specificRequirements: {
      specifications: ({ stories, occupantLoad }) => {
        let duration = 24;
        let alarmDuration = 5;
        
        // For high-rise buildings or large occupant loads, increase requirements
        if (stories > 7 || occupantLoad > 1000) {
          duration = 24;
          alarmDuration = 15; // For voice evacuation systems
        }
        
        return `Secondary power supply must provide ${duration} hours of standby power followed by ${alarmDuration} minutes of alarm operation. For voice evacuation systems, ${duration} hours of standby followed by 15 minutes of alarm operation is required.`;
      },
      type: 'Storage batteries or automatic-starting engine-driven generator. Primary power supply must be a dedicated branch circuit.',
      installation: 'Transfer to secondary power must be automatic and occur within 10 seconds of primary power failure. Battery systems must be installed in accordance with NFPA 72 Section 10.6.',
      maintenance: 'Weekly visual inspection; Monthly testing under load; Annual full load test for minimum duration; Battery replacement every 3-5 years or as recommended by manufacturer.'
    }
  },
  {
    id: 'alternate-power-supply-sprinkler',
    name: 'Alternate Power Supply for Sprinkler Systems',
    description: 'An alternate power supply shall be provided for electric fire pumps serving sprinkler systems in buildings with more than 7 stories or with an occupant load of more than 500 persons.',
    applicableOccupancies: ['all'],
    thresholds: {
      occupantLoad: 500,
      stories: 7
    },
    reference: 'RA 9514 IRR Rule 10.2.6.4 / NFPA 20',
    specificRequirements: {
      specifications: ({ stories, occupantLoad }) => {
        let powerRequirements = 'Electric fire pumps must have a reliable source of power with automatic transfer capability.';
        
        if (stories > 20 || occupantLoad > 2000) {
          powerRequirements += ' Multiple power sources or on-site generator with minimum 8-hour fuel supply required.';
        } else if (stories > 7 || occupantLoad > 500) {
          powerRequirements += ' On-site generator with minimum 4-hour fuel supply or connection to multiple utility services required.';
        }
        
        return powerRequirements;
      },
      type: 'Standby power system must be capable of carrying the locked-rotor current of the fire pump motor(s). Transfer of power must be automatic for high-rise buildings.',
      installation: 'Power transfer switches must be listed for fire pump service. Generator installations must comply with NFPA 110 and be installed in a dedicated fire-rated room.',
      maintenance: 'Weekly testing of transfer switches; Monthly testing of generator under load; Annual full load test for minimum 2 hours; Fuel supply maintenance according to NFPA 110.'
    }
  },
  {
    id: 'alternate-power-supply-elevators',
    name: 'Alternate Power Supply for Elevators',
    description: 'An alternate power supply shall be provided for elevators in buildings with more than 7 stories to ensure operation during emergency conditions.',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 7
    },
    reference: 'RA 9514 IRR Rule 10 / NFPA 70/72/101',
    specificRequirements: {
      specifications: ({ stories }) => {
        let capacity = 'Standby power must be capable of operating at least one elevator at a time.';
        
        if (stories > 20) {
          capacity = 'Standby power must be capable of operating all designated elevators simultaneously.';
        } else if (stories > 10) {
          capacity = 'Standby power must be capable of operating at least two elevators simultaneously.';
        }
        
        return `${capacity} Minimum 2-hour operation time for emergency power supply.`;
      },
      type: 'Standby power system must be an automatic-starting engine-driven generator or separate utility service.',
      installation: 'Transfer to emergency power must be automatic and within 60 seconds. Dedicated feeders required for elevator circuits.',
      maintenance: 'Monthly testing under load; Annual full load test for minimum 2 hours; Generator maintenance according to NFPA 110.'
    }
  },
  {
    id: 'fireman-switch-elevators',
    name: 'Fireman Switch for Elevators',
    description: 'A fireman switch shall be provided for all elevators in buildings with more than 3 stories to allow firefighter control during emergency operations.',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 3
    },
    reference: 'RA 9514 IRR Rule 10 / NFPA 72',
    specificRequirements: {
      specifications: 'Phase I Emergency Recall Operation must be provided through a three-position key switch at designated level. Phase II Emergency In-Car Operation must allow firefighters to control elevator from within the car.',
      type: 'Three-position key switch ("OFF", "ON", "BYPASS") for Phase I operation. In-car firefighter service key switch for Phase II operation.',
      installation: 'Automatic recall must be initiated by smoke detectors installed in elevator lobbies, machine rooms, and hoistways. Visual signal must indicate when Phase I operation is in effect.',
      maintenance: 'Monthly testing of Phase I recall; Quarterly testing of Phase II operation; Annual full system test including smoke detector activation.'
    }
  },
  {
    id: 'sprinkler-system-by-floors',
    name: 'Sprinkler System Requirements by Number of Floors',
    description: 'Sprinkler system requirements vary based on the number of floors in the building, with more stringent requirements for taller buildings.',
    applicableOccupancies: ['all'],
    thresholds: {
      stories: 1
    },
    reference: 'RA 9514 IRR Rule 10.2.6.4 / NFPA 13/14',
    specificRequirements: {
      specifications: ({ stories }) => {
        let requirements = '';
        
        if (stories >= 21) {
          requirements = 'Wet pipe system with standpipes and fire pump, minimum 90-120 minutes water supply duration. Minimum residual pressure of 100 psi (6.9 bar) at topmost outlet. Multiple fire pumps or zones may be required, emergency power supply mandatory. Water storage tanks typically required.';
        } else if (stories >= 7) {
          requirements = 'Wet pipe system with standpipes, minimum 60-90 minutes water supply duration. Minimum residual pressure of 100 psi (6.9 bar) at topmost outlet. Fire pump required with backup power supply.';
        } else if (stories >= 3) {
          requirements = 'Wet pipe system with minimum 60 minutes water supply duration. Minimum residual pressure of 7 psi (0.5 bar) at most remote sprinkler. Dedicated water supply or fire pump may be required.';
        } else {
          requirements = 'Wet pipe system with minimum 30 minutes water supply duration for light hazard. Minimum residual pressure of 7 psi (0.5 bar) at most remote sprinkler. Can be supplied by domestic water supply if adequate.';
        }
        
        return requirements;
      },
      type: 'Wet pipe system is standard. Dry pipe systems allowed only in areas subject to freezing. Pre-action systems may be required for sensitive areas like data centers or museums.',
      installation: 'System must be installed in accordance with NFPA 13. High-rise buildings require standpipes in accordance with NFPA 14. Fire department connections must be provided at street level.',
      maintenance: 'Weekly visual inspection of control valves; Monthly inspection of water flow alarm devices; Quarterly inspection of alarm devices; Annual inspection and testing of all components; Five-year internal inspection of piping.'
    }
  }
];
