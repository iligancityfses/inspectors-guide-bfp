import { BuildingFeature } from '@/components/BuildingFeatures';

export const defaultBuildingFeatures: BuildingFeature[] = [
  {
    id: 'elevator',
    name: 'Elevator',
    description: 'Building has one or more elevators for vertical transportation',
    selected: false
  },
  {
    id: 'escalator',
    name: 'Escalator',
    description: 'Building has one or more escalators for vertical transportation',
    selected: false
  },
  {
    id: 'basement',
    name: 'Basement',
    description: 'Building has one or more below-grade levels',
    selected: false
  },
  {
    id: 'atrium',
    name: 'Atrium',
    description: 'Building has an atrium or multi-story open space',
    selected: false
  },
  {
    id: 'kitchen',
    name: 'Commercial Kitchen',
    description: 'Building contains a commercial kitchen or food preparation area',
    selected: false
  },
  {
    id: 'generator',
    name: 'Emergency Generator',
    description: 'Building has an emergency generator or backup power system',
    selected: false
  },
  {
    id: 'data-center',
    name: 'Data Center / Server Room',
    description: 'Building contains a data center or server room',
    selected: false
  },
  {
    id: 'hazardous-materials',
    name: 'Hazardous Materials Storage',
    description: 'Building stores hazardous materials or chemicals',
    selected: false
  },
  {
    id: 'parking-garage',
    name: 'Parking Garage',
    description: 'Building includes an enclosed parking garage',
    selected: false
  },
  {
    id: 'high-piled-storage',
    name: 'High-Piled Storage',
    description: 'Building contains high-piled storage (storage over 12 feet in height)',
    selected: false
  }
];
