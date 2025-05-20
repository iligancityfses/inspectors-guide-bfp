import { OccupancyType } from '@/data/occupancyTypes';
import { FireSafetyRequirement, fireSafetyRequirements } from '@/data/fireCodeRequirements';
import { BuildingFeature } from '@/components/BuildingFeatures';

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
 * Determine the required fire safety measures based on building data
 */
export function determineRequiredFireSafetyMeasures(buildingData: BuildingData): FireSafetyRequirement[] {
  const { occupancyType, floors, totalArea, totalOccupantLoad } = buildingData;
  const numberOfStories = floors.length;
  // Estimate building height based on number of stories (3m per floor is standard)
  const estimatedBuildingHeight = numberOfStories * 3;

  // Log for debugging
  console.log('Building data:', {
    occupancyType: occupancyType.name,
    numberOfStories,
    estimatedBuildingHeight,
    totalArea,
    totalOccupantLoad,
    hazardClassification: occupancyType.hazardClassification || 'light'
  });

  return fireSafetyRequirements.filter(requirement => {
    // Check if the requirement applies to all occupancies or the specific occupancy type
    const isApplicableOccupancy = 
      requirement.applicableOccupancies.includes('all') || 
      requirement.applicableOccupancies.includes(occupancyType.id);

    // Special cases for sprinkler system exemptions based on the Revised Fire Code of the Philippines
    if (requirement.id === 'automatic-sprinkler-system') {
      // Single-story business establishments under 2,000 sq.m with occupant load < 500 are exempt
      if (occupancyType.id === 'business' && 
          numberOfStories === 1 && 
          totalArea < 2000 && 
          totalOccupantLoad < 500) {
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
          buildingData.features?.some(feature => feature.id === 'natural-ventilation' && feature.selected)) {
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
          buildingData.features?.some(feature => feature.id === 'crop-growing-only' && feature.selected)) {
        return false;
      }
    }

    // Check if the requirement has thresholds and if they are met
    const meetsOccupantLoadThreshold = 
      requirement.thresholds.occupantLoad === undefined || 
      totalOccupantLoad >= requirement.thresholds.occupantLoad;
    
    const meetsStoriesThreshold = 
      requirement.thresholds.stories === undefined || 
      numberOfStories >= requirement.thresholds.stories;
    
    const meetsFloorAreaThreshold = 
      requirement.thresholds.floorArea === undefined || 
      totalArea >= requirement.thresholds.floorArea;
    
    const meetsBuildingHeightThreshold = 
      requirement.thresholds.buildingHeight === undefined || 
      estimatedBuildingHeight >= requirement.thresholds.buildingHeight;

    // Log for debugging
    if (!isApplicableOccupancy || !meetsOccupantLoadThreshold || !meetsStoriesThreshold || !meetsFloorAreaThreshold || !meetsBuildingHeightThreshold) {
      console.log(`Requirement '${requirement.name}' not applicable because:`, {
        isApplicableOccupancy,
        meetsOccupantLoadThreshold,
        meetsStoriesThreshold,
        meetsFloorAreaThreshold,
        meetsBuildingHeightThreshold,
        requirementThresholds: requirement.thresholds
      });
    }

    return isApplicableOccupancy && 
           meetsOccupantLoadThreshold && 
           meetsStoriesThreshold && 
           meetsFloorAreaThreshold && 
           meetsBuildingHeightThreshold;
  });
}
