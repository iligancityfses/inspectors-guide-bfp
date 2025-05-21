import { OccupancyType } from '@/data/occupancyTypes';
import { FireSafetyRequirement, fireSafetyRequirements } from '@/data/fireCodeRequirements';
import { BuildingFeature } from '@/components/BuildingFeatures';

/**
 * Fire pump calculation constants
 */
export const PUMP_CONSTANTS = {
  PSI_PER_METER: 1.42, // 0.433 PSI per foot = ~1.42 PSI per meter
  BASE_HEAD_PRESSURE: 65, // PSI
  EFFICIENCY: 0.65, // 65% efficiency
  HP_CONVERSION_FACTOR: 1714 // Conversion factor for HP calculation
};

export interface Floor {
  id: string;
  length: number;
  width: number;
  area: number;
  occupantLoad: number;
}

export interface BuildingData {
  occupancyType: OccupancyType;
  floors: Floor[];
  totalArea: number;
  totalOccupantLoad: number;
  features?: BuildingFeature[];
}

/**
 * Calculate the area of a floor based on its length and width
 */
export function calculateFloorArea(length: number, width: number): number {
  return length * width;
}

/**
 * Calculate the occupant load of a floor based on its area and occupancy type
 */
export function calculateOccupantLoad(area: number, occupancyType: OccupancyType): number {
  return Math.ceil(area / occupancyType.occupantLoadFactor);
}

/**
 * Calculate the total area and occupant load of a building
 */
export function calculateBuildingData(occupancyType: OccupancyType, floors: Floor[]): BuildingData {
  const totalArea = floors.reduce((sum, floor) => sum + floor.area, 0);
  const totalOccupantLoad = floors.reduce((sum, floor) => sum + floor.occupantLoad, 0);

  return {
    occupancyType,
    floors,
    totalArea,
    totalOccupantLoad,
  };
}

/**
 * Calculate the required pump pressure based on building height
 */
export function calculatePumpPressure(buildingHeight: number): number {
  // Basic formula: Base pressure + (height * PSI per meter)
  return Math.ceil(PUMP_CONSTANTS.BASE_HEAD_PRESSURE + (buildingHeight * PUMP_CONSTANTS.PSI_PER_METER));
}

/**
 * Calculate the required pump flow rate based on building height and occupancy
 */
export function calculatePumpFlowRate(buildingHeight: number, occupantLoad: number): number {
  let pumpCapacity = 500; // Base capacity in GPM
  
  // Adjust capacity based on building height
  if (buildingHeight > 30) {
    pumpCapacity = 750;
  }
  if (buildingHeight > 60) {
    pumpCapacity = 1000;
  }
  
  // Adjust capacity based on occupant load
  if (occupantLoad > 1000) {
    pumpCapacity += 250;
  }
  
  return pumpCapacity;
}

/**
 * Calculate the required pump horsepower based on flow rate and pressure
 */
export function calculatePumpHorsepower(flowRate: number, pressure: number, efficiency: number = PUMP_CONSTANTS.EFFICIENCY): number {
  // Formula: HP = (Flow Rate (GPM) × Pressure (PSI)) / (1714 × Efficiency)
  return (flowRate * pressure) / (PUMP_CONSTANTS.HP_CONVERSION_FACTOR * efficiency);
}

/**
 * Determine the required fire safety measures based on building data
 * Refined to be more precise based on RA 9514 IRR 2019 requirements
 */
export function determineRequiredFireSafetyMeasures(buildingData: BuildingData): FireSafetyRequirement[] {
  const { occupancyType, floors, totalArea, totalOccupantLoad } = buildingData;
  const numberOfStories = floors.length;
  // Estimate building height based on number of stories (3m per floor is standard)
  const estimatedBuildingHeight = numberOfStories * 3;
  // Determine risk level based on occupancy type, area, and height
  const riskLevel = determineRiskLevel(occupancyType, totalArea, numberOfStories, totalOccupantLoad);

  // Log for debugging
  console.log('Building data:', {
    occupancyType: occupancyType.name,
    numberOfStories,
    estimatedBuildingHeight,
    totalArea,
    totalOccupantLoad,
    hazardClassification: occupancyType.hazardClassification || 'light',
    riskLevel
  });

  return fireSafetyRequirements.filter(requirement => {
    // Check if the requirement applies to all occupancies or the specific occupancy type
    const isApplicableOccupancy = 
      requirement.applicableOccupancies.includes('all') || 
      requirement.applicableOccupancies.includes(occupancyType.id);

    if (!isApplicableOccupancy) {
      return false;
    }

    // Detailed occupancy-specific requirements based on RA 9514 IRR 2019
    switch (requirement.id) {
      case 'automatic-sprinkler-system':
        return shouldRequireAutomaticSprinklerSystem(occupancyType, numberOfStories, totalArea, totalOccupantLoad, buildingData.features);
      
      case 'fire-pump':
        return shouldRequireFirePump(occupancyType, numberOfStories, totalArea, totalOccupantLoad, riskLevel);
      
      case 'fire-extinguishers':
        // All buildings require fire extinguishers regardless of size or occupancy
        return true;
      
      case 'standpipe-system':
        return shouldRequireStandpipeSystem(occupancyType, numberOfStories, estimatedBuildingHeight, totalArea, riskLevel);
      
      case 'fire-detection-alarm':
        return shouldRequireFireAlarm(occupancyType, numberOfStories, totalArea, totalOccupantLoad, riskLevel);
      
      case 'emergency-exits':
        // All buildings require emergency exits, but the number varies based on occupant load
        return true;
      
      case 'exit-signs-emergency-lights':
        // All buildings except single-family dwellings require exit signs and emergency lights
        return occupancyType.id !== 'residential-single-family';
      
      case 'fire-compartmentation':
        return shouldRequireFireCompartmentation(occupancyType, numberOfStories, totalArea, riskLevel);
      
      case 'smoke-control-systems':
        return shouldRequireSmokeSystems(occupancyType, numberOfStories, totalArea, estimatedBuildingHeight, buildingData.features);
      
      case 'emergency-power':
        return shouldRequireEmergencyPower(occupancyType, numberOfStories, totalArea, totalOccupantLoad, riskLevel);
      
      case 'elevator-fire-safety':
        // Only required if building has elevators
        return buildingData.features?.some(feature => feature.id === 'elevator' && feature.selected) || false;
      
      case 'kitchen-fire-suppression':
        // Only required if building has commercial kitchen
        return buildingData.features?.some(feature => feature.id === 'kitchen' && feature.selected) || false;
      
      case 'fire-command-center':
        return shouldRequireFireCommandCenter(occupancyType, numberOfStories, totalArea, estimatedBuildingHeight, riskLevel);
      
      case 'hazardous-materials-storage':
        // Only required if building stores hazardous materials
        return buildingData.features?.some(feature => feature.id === 'hazardous-materials' && feature.selected) || false;
      
      case 'construction-fire-safety':
        // This is a temporary requirement during construction, not applicable to existing buildings
        return false;
      
      case 'alternative-automatic-fire-extinguishing-system':
        // Required for special hazards or areas where water cannot be used
        return buildingData.features?.some(feature => 
          (feature.id === 'data-center' || 
           feature.id === 'hazardous-materials') && 
          feature.selected
        ) || false;
      
      default:
        // For any other requirements, check thresholds
        return checkRequirementThresholds(requirement, totalOccupantLoad, numberOfStories, totalArea, estimatedBuildingHeight, riskLevel);
    }
  });
}

/**
 * Determine the risk level of a building based on occupancy, area, and height
 */
function determineRiskLevel(occupancyType: OccupancyType, totalArea: number, numberOfStories: number, occupantLoad: number): 'low' | 'moderate' | 'high' {
  // High hazard occupancies are always high risk
  if (occupancyType.hazardClassification === 'high' || 
      occupancyType.id.includes('high-hazard') || 
      occupancyType.id.includes('storage-high')) {
    return 'high';
  }
  
  // Healthcare, detention, and assembly with high occupant loads are high risk
  if (occupancyType.id.includes('healthcare') || 
      occupancyType.id.includes('hospital') || 
      occupancyType.id.includes('restrained') || 
      (occupancyType.id.includes('assembly') && occupantLoad > 1000)) {
    return 'high';
  }
  
  // High-rise buildings (over 7 stories or 21m) are high risk
  if (numberOfStories > 7) {
    return 'high';
  }
  
  // Large area buildings are moderate to high risk
  if (totalArea > 10000) {
    return 'high';
  }
  
  if (totalArea > 5000 || numberOfStories > 4 || occupantLoad > 500) {
    return 'moderate';
  }
  
  // Default to low risk for small buildings with low occupant loads
  return 'low';
}

/**
 * Check if a building should require an automatic sprinkler system
 */
function shouldRequireAutomaticSprinklerSystem(
  occupancyType: OccupancyType, 
  numberOfStories: number, 
  totalArea: number, 
  occupantLoad: number,
  features?: BuildingFeature[]
): boolean {
  // Always required for certain occupancies regardless of size
  if (occupancyType.id.includes('healthcare') || 
      occupancyType.id.includes('hospital') || 
      occupancyType.id.includes('high-hazard') || 
      occupancyType.id.includes('storage-high') || 
      occupancyType.id.includes('mall') || 
      occupancyType.id.includes('detention') || 
      occupancyType.id.includes('correctional') || 
      occupancyType.id.includes('restrained') || 
      occupancyType.id.includes('day-care')) {
    return true;
  }
  
  // Exemptions based on RA 9514 IRR 2019
  // Single-story business establishments under 2,000 sq.m with occupant load < 500 are exempt
  if (occupancyType.id === 'business' && 
      numberOfStories === 1 && 
      totalArea < 2000 && 
      occupantLoad < 500) {
    return false;
  }
  
  // Single-family dwellings and residential occupancies with 2 or fewer stories are exempt
  if ((occupancyType.id === 'residential-single-family' || 
       occupancyType.id === 'residential-two-family') && 
      numberOfStories <= 2) {
    return false;
  }
  
  // Open parking garages with natural ventilation are exempt
  if (occupancyType.id === 'storage-parking-garage' && 
      features?.some(feature => feature.id === 'natural-ventilation' && feature.selected)) {
    return false;
  }
  
  // Telecommunication facilities under 2,000 sq.m with fewer than 3 stories are exempt
  if (occupancyType.id === 'telecommunication-facility' && 
      numberOfStories < 3 && 
      totalArea < 2000) {
    return false;
  }
  
  // Agricultural buildings used exclusively for growing crops are exempt
  if (occupancyType.id === 'agricultural-facility' && 
      features?.some(feature => feature.id === 'crop-growing-only' && feature.selected)) {
    return false;
  }
  
  // General requirements based on height, area, and occupant load
  return (numberOfStories >= 5) || // More than 15m height (5 floors × 3m)
         (totalArea >= 2000) || // Area exceeding 2,000 sq.m
         (occupantLoad >= 500); // Occupant load exceeding 500 persons
}

/**
 * Check if a building should require a fire pump
 */
function shouldRequireFirePump(
  occupancyType: OccupancyType, 
  numberOfStories: number, 
  totalArea: number, 
  occupantLoad: number,
  riskLevel: 'low' | 'moderate' | 'high'
): boolean {
  // Always required for high-rise buildings (over 7 stories or 21m)
  if (numberOfStories > 7) {
    return true;
  }
  
  // Always required for high risk occupancies with sprinkler systems
  if (riskLevel === 'high' && shouldRequireAutomaticSprinklerSystem(occupancyType, numberOfStories, totalArea, occupantLoad)) {
    return true;
  }
  
  // Required for buildings with sprinkler systems where municipal water supply is insufficient
  if (shouldRequireAutomaticSprinklerSystem(occupancyType, numberOfStories, totalArea, occupantLoad)) {
    // For buildings over 4 stories, assume municipal water pressure is insufficient
    if (numberOfStories > 4) {
      return true;
    }
    
    // For large area buildings, assume municipal water pressure is insufficient
    if (totalArea > 3000) {
      return true;
    }
  }
  
  // Not required for small buildings without sprinkler systems
  return false;
}

/**
 * Check if a building should require a standpipe system
 */
function shouldRequireStandpipeSystem(
  occupancyType: OccupancyType, 
  numberOfStories: number, 
  buildingHeight: number,
  totalArea: number,
  riskLevel: 'low' | 'moderate' | 'high'
): boolean {
  // Required for buildings over 15m in height (5 stories)
  if (buildingHeight > 15 || numberOfStories > 4) {
    return true;
  }
  
  // Required for high risk buildings regardless of height
  if (riskLevel === 'high') {
    return true;
  }
  
  // Required for moderate risk buildings with large floor areas
  if (riskLevel === 'moderate' && totalArea > 3000) {
    return true;
  }
  
  // Required for assembly occupancies with occupant loads over 1000
  if (occupancyType.id.includes('assembly') && 
      occupancyType.occupantLoadFactor * totalArea > 1000) {
    return true;
  }
  
  // Not required for small, low-risk buildings
  return false;
}

/**
 * Check if a building should require a fire alarm system
 */
function shouldRequireFireAlarm(
  occupancyType: OccupancyType, 
  numberOfStories: number, 
  totalArea: number, 
  occupantLoad: number,
  riskLevel: 'low' | 'moderate' | 'high'
): boolean {
  // Single-family dwellings only require smoke alarms, not full fire alarm systems
  if (occupancyType.id === 'residential-single-family') {
    return false;
  }
  
  // Always required for high-risk occupancies
  if (riskLevel === 'high') {
    return true;
  }
  
  // Required for all assembly, educational, healthcare, institutional occupancies
  if (occupancyType.id.includes('assembly') || 
      occupancyType.id.includes('educational') || 
      occupancyType.id.includes('healthcare') || 
      occupancyType.id.includes('hospital') || 
      occupancyType.id.includes('institutional')) {
    return true;
  }
  
  // Required for residential occupancies with more than 16 sleeping units
  if ((occupancyType.id.includes('residential-apartment') || 
       occupancyType.id.includes('residential-hotels') || 
       occupancyType.id.includes('residential-dormitories')) && 
      occupantLoad > 16) {
    return true;
  }
  
  // Required for business occupancies over 1000 sq.m or with more than 100 occupants
  if (occupancyType.id === 'business' && (totalArea > 1000 || occupantLoad > 100)) {
    return true;
  }
  
  // Required for mercantile occupancies over 500 sq.m
  if (occupancyType.id.includes('mercantile') && totalArea > 500) {
    return true;
  }
  
  // Required for industrial and storage occupancies over 1000 sq.m
  if ((occupancyType.id.includes('factory') || occupancyType.id.includes('storage')) && 
      totalArea > 1000) {
    return true;
  }
  
  // Not required for other small buildings
  return false;
}

/**
 * Check if a building should require fire compartmentation
 */
function shouldRequireFireCompartmentation(
  occupancyType: OccupancyType, 
  numberOfStories: number, 
  totalArea: number,
  riskLevel: 'low' | 'moderate' | 'high'
): boolean {
  // Required for all buildings over 3 stories
  if (numberOfStories > 3) {
    return true;
  }
  
  // Required for high-risk occupancies regardless of size
  if (riskLevel === 'high') {
    return true;
  }
  
  // Required for healthcare facilities regardless of size
  if (occupancyType.id.includes('healthcare') || occupancyType.id.includes('hospital')) {
    return true;
  }
  
  // Required for residential occupancies with more than 3 dwelling units
  if (occupancyType.id.includes('residential') && 
      !occupancyType.id.includes('single-family') && 
      !occupancyType.id.includes('two-family')) {
    return true;
  }
  
  // Required for mixed occupancies
  if (occupancyType.id.includes('mixed')) {
    return true;
  }
  
  // Required for moderate risk buildings over 2000 sq.m
  if (riskLevel === 'moderate' && totalArea > 2000) {
    return true;
  }
  
  // Not required for small, low-risk buildings
  return false;
}

/**
 * Check if a building should require smoke control systems
 */
function shouldRequireSmokeSystems(
  occupancyType: OccupancyType, 
  numberOfStories: number, 
  totalArea: number,
  buildingHeight: number,
  features?: BuildingFeature[]
): boolean {
  // Required for high-rise buildings (over 23m or approximately 7 stories)
  if (buildingHeight > 23 || numberOfStories > 7) {
    return true;
  }
  
  // Required for buildings with atriums
  if (features?.some(feature => feature.id === 'atrium' && feature.selected)) {
    return true;
  }
  
  // Required for underground buildings or buildings with basements over 1000 sq.m
  if (features?.some(feature => feature.id === 'basement' && feature.selected)) {
    // Assume basement is 1/4 of total area as a conservative estimate
    if (totalArea / 4 > 1000) {
      return true;
    }
  }
  
  // Required for large assembly occupancies (over 1000 occupants)
  if (occupancyType.id.includes('assembly') && 
      totalArea / occupancyType.occupantLoadFactor > 1000) {
    return true;
  }
  
  // Required for healthcare facilities over 3 stories or 1000 sq.m
  if ((occupancyType.id.includes('healthcare') || occupancyType.id.includes('hospital')) && 
      (numberOfStories > 3 || totalArea > 1000)) {
    return true;
  }
  
  // Required for detention facilities regardless of size
  if (occupancyType.id.includes('restrained') || 
      occupancyType.id.includes('detention') || 
      occupancyType.id.includes('correctional')) {
    return true;
  }
  
  // Not required for other buildings
  return false;
}

/**
 * Check if a building should require emergency power systems
 */
function shouldRequireEmergencyPower(
  occupancyType: OccupancyType, 
  numberOfStories: number, 
  totalArea: number, 
  occupantLoad: number,
  riskLevel: 'low' | 'moderate' | 'high'
): boolean {
  // Required for high-rise buildings (over 23m or approximately 7 stories)
  if (numberOfStories > 7) {
    return true;
  }
  
  // Required for healthcare facilities regardless of size
  if (occupancyType.id.includes('healthcare') || occupancyType.id.includes('hospital')) {
    return true;
  }
  
  // Required for high-risk occupancies
  if (riskLevel === 'high') {
    return true;
  }
  
  // Required for assembly occupancies with occupant loads over 300
  if (occupancyType.id.includes('assembly') && occupantLoad > 300) {
    return true;
  }
  
  // Required for buildings with fire pumps
  if (shouldRequireFirePump(occupancyType, numberOfStories, totalArea, occupantLoad, riskLevel)) {
    return true;
  }
  
  // Required for buildings with elevators
  // (This is a simplification - in reality would depend on specific elevator requirements)
  if (numberOfStories > 4) {
    return true;
  }
  
  // Not required for small, low-risk buildings
  return false;
}

/**
 * Check if a building should require a fire command center
 */
function shouldRequireFireCommandCenter(
  occupancyType: OccupancyType, 
  numberOfStories: number, 
  totalArea: number,
  buildingHeight: number,
  riskLevel: 'low' | 'moderate' | 'high'
): boolean {
  // Required for high-rise buildings (over 23m or approximately 7 stories)
  if (buildingHeight > 23 || numberOfStories > 7) {
    return true;
  }
  
  // Required for very large buildings (over 50,000 sq.m)
  if (totalArea > 50000) {
    return true;
  }
  
  // Required for large assembly occupancies (over 1000 occupants)
  if (occupancyType.id.includes('assembly') && 
      totalArea / occupancyType.occupantLoadFactor > 1000) {
    return true;
  }
  
  // Required for large healthcare facilities
  if ((occupancyType.id.includes('healthcare') || occupancyType.id.includes('hospital')) && 
      totalArea > 10000) {
    return true;
  }
  
  // Not required for other buildings
  return false;
}

/**
 * Check if a requirement meets the general thresholds
 */
function checkRequirementThresholds(
  requirement: FireSafetyRequirement,
  occupantLoad: number,
  numberOfStories: number,
  totalArea: number,
  buildingHeight: number,
  riskLevel: 'low' | 'moderate' | 'high'
): boolean {
  // Apply stricter thresholds for high-risk buildings
  const occupantLoadThreshold = riskLevel === 'high' ? 
    (requirement.thresholds.occupantLoad ? requirement.thresholds.occupantLoad / 2 : undefined) : 
    requirement.thresholds.occupantLoad;
  
  const storiesThreshold = riskLevel === 'high' ? 
    (requirement.thresholds.stories ? Math.max(1, requirement.thresholds.stories - 1) : undefined) : 
    requirement.thresholds.stories;
  
  const floorAreaThreshold = riskLevel === 'high' ? 
    (requirement.thresholds.floorArea ? requirement.thresholds.floorArea / 2 : undefined) : 
    requirement.thresholds.floorArea;
  
  const buildingHeightThreshold = riskLevel === 'high' ? 
    (requirement.thresholds.buildingHeight ? requirement.thresholds.buildingHeight / 2 : undefined) : 
    requirement.thresholds.buildingHeight;
  
  // Check if the requirement thresholds are met
  const meetsOccupantLoadThreshold = 
    occupantLoadThreshold === undefined || 
    occupantLoad >= occupantLoadThreshold;
  
  const meetsStoriesThreshold = 
    storiesThreshold === undefined || 
    numberOfStories >= storiesThreshold;
  
  const meetsFloorAreaThreshold = 
    floorAreaThreshold === undefined || 
    totalArea >= floorAreaThreshold;
  
  const meetsBuildingHeightThreshold = 
    buildingHeightThreshold === undefined || 
    buildingHeight >= buildingHeightThreshold;
  
  return meetsOccupantLoadThreshold && 
         meetsStoriesThreshold && 
         meetsFloorAreaThreshold && 
         meetsBuildingHeightThreshold;
}
