export interface OccupancyType {
  id: string;
  name: string;
  description: string;
  occupantLoadFactor: number; // Square meters per person
  hazardClassification?: 'light' | 'ordinary' | 'high';
  examples?: string;
}

// Occupancy types based on the Revised Fire Code of the Philippines (RA 9514 IRR 2019) Rule 10.2.3
export const occupancyTypes: OccupancyType[] = [
  {
    id: 'assembly-fixed-seats',
    name: 'Assembly (Fixed Seats)',
    description: 'Places of assembly with fixed seats',
    occupantLoadFactor: 0.65, // area per person in square meters
    hazardClassification: 'light',
    examples: 'Theaters, auditoriums, churches, convention halls with fixed seats'
  },
  {
    id: 'assembly-concentrated',
    name: 'Assembly (Concentrated)',
    description: 'Places of assembly without fixed seats, concentrated use (chairs only, not fixed)',
    occupantLoadFactor: 0.65,
    hazardClassification: 'light',
    examples: 'Conference rooms, lecture halls, dining areas with non-fixed chairs'
  },
  {
    id: 'assembly-less-concentrated',
    name: 'Assembly (Less Concentrated)',
    description: 'Places of assembly without fixed seats, less concentrated use (tables and chairs)',
    occupantLoadFactor: 1.4,
    hazardClassification: 'light',
    examples: 'Art galleries, exhibition halls, museums, restaurants with tables and chairs'
  },
  {
    id: 'assembly-standing',
    name: 'Assembly (Standing Space)',
    description: 'Places of assembly, standing space',
    occupantLoadFactor: 0.28,
    hazardClassification: 'light',
    examples: 'Waiting areas, standing-only venues, bars without seating'
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Office, professional or service-type transactions',
    occupantLoadFactor: 9.3,
    hazardClassification: 'light',
    examples: 'Banks, offices, government buildings, call centers, BPO facilities'
  },
  {
    id: 'educational',
    name: 'Educational',
    description: 'Schools and educational facilities',
    occupantLoadFactor: 1.9,
    hazardClassification: 'light',
    examples: 'Schools, universities, training centers, daycare facilities, classrooms'
  },
  {
    id: 'factory-industrial-low',
    name: 'Factory/Industrial (Low Hazard)',
    description: 'Manufacturing, processing facilities with low fire hazard',
    occupantLoadFactor: 9.3,
    hazardClassification: 'ordinary',
    examples: 'Appliance assembly, electronics manufacturing, food processing'
  },
  {
    id: 'factory-industrial-moderate',
    name: 'Factory/Industrial (Moderate Hazard)',
    description: 'Manufacturing, processing facilities with moderate fire hazard',
    occupantLoadFactor: 9.3,
    hazardClassification: 'ordinary',
    examples: 'Automobile assembly, woodworking, textile manufacturing'
  },
  {
    id: 'high-hazard',
    name: 'High Hazard',
    description: 'Facilities with highly combustible materials or flammable substances',
    occupantLoadFactor: 9.3,
    hazardClassification: 'high',
    examples: 'Chemical plants, refineries, fireworks manufacturing, paint factories, facilities storing or handling flammable liquids or gases'
  },
  {
    id: 'institutional-restrained',
    name: 'Institutional (Restrained)',
    description: 'Facilities where occupants are under restraint or security',
    occupantLoadFactor: 11.1,
    hazardClassification: 'light',
    examples: 'Prisons, jails, detention centers, mental health facilities with restrained patients'
  },
  {
    id: 'institutional-general',
    name: 'Institutional (General)',
    description: 'Hospitals, nursing homes with general care',
    occupantLoadFactor: 22.3,
    hazardClassification: 'light',
    examples: 'Hospitals, nursing homes, assisted living facilities, outpatient clinics'
  },
  {
    id: 'mercantile',
    name: 'Mercantile',
    description: 'Retail stores, markets, shopping centers',
    occupantLoadFactor: 2.8,
    hazardClassification: 'ordinary',
    examples: 'Department stores, supermarkets, shopping malls, retail shops'
  },
  {
    id: 'residential-hotels',
    name: 'Residential (Hotels)',
    description: 'Hotels, motels, dormitories, transient accommodations',
    occupantLoadFactor: 18.6,
    hazardClassification: 'light',
    examples: 'Hotels, motels, dormitories, hostels, boarding houses, transient lodging'
  },
  {
    id: 'residential-apartments',
    name: 'Residential (Apartments)',
    description: 'Apartment buildings, condominiums, permanent dwellings',
    occupantLoadFactor: 18.6,
    hazardClassification: 'light',
    examples: 'Apartment buildings, condominiums, townhouses, multi-family dwellings'
  },
  {
    id: 'storage-low',
    name: 'Storage (Low Hazard)',
    description: 'Warehouses, storage facilities with low hazard contents',
    occupantLoadFactor: 46.5,
    hazardClassification: 'ordinary',
    examples: 'Storage of non-combustible materials, furniture warehouses, general merchandise'
  },
  {
    id: 'storage-high',
    name: 'Storage (High Hazard)',
    description: 'Warehouses, storage facilities with high hazard contents',
    occupantLoadFactor: 46.5,
    hazardClassification: 'high',
    examples: 'Storage of flammable/combustible liquids, aerosols, plastics, rubber tires'
  },
  {
    id: 'mall-complex',
    name: 'Mall Complex',
    description: 'Shopping mall complexes with multiple stores and common areas',
    occupantLoadFactor: 2.8,
    hazardClassification: 'ordinary',
    examples: 'Shopping malls, commercial complexes with multiple retail establishments'
  },
  {
    id: 'mixed-use',
    name: 'Mixed-Use',
    description: 'Buildings with multiple occupancy types',
    occupantLoadFactor: 9.3, // Default value, actual calculation should be based on specific areas
    hazardClassification: 'ordinary',
    examples: 'Buildings combining residential, commercial, and office spaces'
  },
  {
    id: 'day-care',
    name: 'Day Care',
    description: 'Facilities that provide care for more than 3 children who stay less than 24 hours',
    occupantLoadFactor: 3.3,
    hazardClassification: 'light',
    examples: 'Child day care centers, nurseries, preschools for children under 6 years old'
  },
  {
    id: 'residential-board-care',
    name: 'Residential Board and Care',
    description: 'Facilities that provide personal care services, lodging, and meals to 4 or more residents',
    occupantLoadFactor: 18.6,
    hazardClassification: 'light',
    examples: 'Assisted living facilities, group homes, halfway houses, social rehabilitation facilities'
  },
  {
    id: 'special-structures',
    name: 'Special Structures',
    description: 'Buildings or structures with unique characteristics that require special fire safety considerations',
    occupantLoadFactor: 9.3, // Default value, varies based on specific use
    hazardClassification: 'ordinary',
    examples: 'Aerodromes, fixed guideway transit systems, historical buildings, wind turbine facilities, offshore energy facilities, piers, solar photovoltaic systems'
  }
];
