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
    id: 'healthcare-hospitals',
    name: 'Healthcare (Hospitals)',
    description: 'Facilities that provide medical, psychiatric, or surgical care on a 24-hour basis',
    occupantLoadFactor: 22.3,
    hazardClassification: 'light',
    examples: 'General hospitals, specialty hospitals, emergency care facilities, trauma centers'
  },
  {
    id: 'healthcare-outpatient',
    name: 'Healthcare (Outpatient)',
    description: 'Facilities that provide services to patients who do not stay overnight',
    occupantLoadFactor: 9.3,
    hazardClassification: 'light',
    examples: 'Outpatient clinics, medical offices, ambulatory care centers, dialysis centers'
  },
  {
    id: 'healthcare-nursing-homes',
    name: 'Healthcare (Nursing Homes)',
    description: 'Facilities that provide nursing care and related services on a 24-hour basis',
    occupantLoadFactor: 22.3,
    hazardClassification: 'light',
    examples: 'Nursing homes, skilled nursing facilities, convalescent homes, long-term care facilities'
  },
  {
    id: 'institutional-general',
    name: 'Institutional (General)',
    description: 'Facilities that provide care for people with physical limitations or medical conditions',
    occupantLoadFactor: 22.3,
    hazardClassification: 'light',
    examples: 'Assisted living facilities, rehabilitation centers, hospice facilities'
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
    id: 'solar-photovoltaic-facility',
    name: 'Solar Photovoltaic Facility',
    description: 'Facilities that generate electricity using solar panels and associated equipment',
    occupantLoadFactor: 46.5,
    hazardClassification: 'ordinary',
    examples: 'Solar farms, rooftop solar installations, solar power plants, photovoltaic arrays'
  },
  {
    id: 'wind-turbine-facility',
    name: 'Wind Turbine Facility',
    description: 'Facilities that generate electricity using wind turbines and associated equipment',
    occupantLoadFactor: 46.5,
    hazardClassification: 'ordinary',
    examples: 'Wind farms, individual wind turbines, wind power plants'
  },
  {
    id: 'energy-storage-system',
    name: 'Energy Storage System',
    description: 'Facilities that store energy for later use, including battery storage systems',
    occupantLoadFactor: 46.5,
    hazardClassification: 'high',
    examples: 'Battery energy storage systems, pumped hydro storage, thermal energy storage'
  },
  {
    id: 'special-structures',
    name: 'Special Structures',
    description: 'Buildings or structures with unique characteristics that require special fire safety considerations',
    occupantLoadFactor: 9.3, // Default value, varies based on specific use
    hazardClassification: 'ordinary',
    examples: 'Aerodromes, fixed guideway transit systems, historical buildings, offshore energy facilities, piers'
  },
  {
    id: 'ambulatory-healthcare',
    name: 'Ambulatory Healthcare',
    description: 'Facilities that provide services to four or more patients simultaneously who are rendered incapable of self-preservation',
    occupantLoadFactor: 9.3,
    hazardClassification: 'light',
    examples: 'Ambulatory surgical centers, urgent care facilities, hemodialysis units, procedural facilities'
  },
  {
    id: 'detention-correctional',
    name: 'Detention and Correctional',
    description: 'Facilities where occupants are under restraint or security and are generally incapable of self-preservation',
    occupantLoadFactor: 11.1,
    hazardClassification: 'light',
    examples: 'Prisons, jails, reformatories, detention centers, correctional centers, holding facilities'
  },
  {
    id: 'residential-dormitories',
    name: 'Residential (Dormitories)',
    description: 'Group housing facilities for people not related by blood or marriage',
    occupantLoadFactor: 18.6,
    hazardClassification: 'light',
    examples: 'College dormitories, fraternity/sorority houses, workers dormitories, military barracks'
  },
  {
    id: 'business-data-centers',
    name: 'Business (Data Centers)',
    description: 'Facilities used for housing computer and network equipment',
    occupantLoadFactor: 9.3,
    hazardClassification: 'ordinary',
    examples: 'Server farms, telecommunications facilities, network operation centers, data processing centers'
  },
  {
    id: 'laboratory',
    name: 'Laboratory',
    description: 'Facilities for scientific research, experiments, or testing',
    occupantLoadFactor: 9.3,
    hazardClassification: 'high',
    examples: 'Research laboratories, testing facilities, educational laboratories, medical laboratories'
  },
  {
    id: 'telecommunication-facility',
    name: 'Telecommunication Facility',
    description: 'Facilities used for communication networks and broadcasting',
    occupantLoadFactor: 9.3,
    hazardClassification: 'ordinary',
    examples: 'Cell towers, broadcast stations, satellite communication facilities, telecommunications centers'
  },
  {
    id: 'waste-management-facility',
    name: 'Waste Management Facility',
    description: 'Facilities for processing, treating, or disposing of waste materials',
    occupantLoadFactor: 46.5,
    hazardClassification: 'high',
    examples: 'Recycling centers, waste-to-energy plants, landfills, composting facilities'
  },
  {
    id: 'water-treatment-facility',
    name: 'Water Treatment Facility',
    description: 'Facilities for treating water for potable use or wastewater treatment',
    occupantLoadFactor: 46.5,
    hazardClassification: 'ordinary',
    examples: 'Water purification plants, wastewater treatment plants, desalination facilities'
  },
  {
    id: 'transportation-terminal',
    name: 'Transportation Terminal',
    description: 'Facilities for passenger transportation services',
    occupantLoadFactor: 1.4,
    hazardClassification: 'ordinary',
    examples: 'Bus terminals, train stations, ferry terminals, airport terminals'
  },
  {
    id: 'marina',
    name: 'Marina',
    description: 'Facilities for docking and storing watercraft',
    occupantLoadFactor: 46.5,
    hazardClassification: 'ordinary',
    examples: 'Boat docks, yacht clubs, harbor facilities, boat storage areas'
  },
  {
    id: 'agricultural-facility',
    name: 'Agricultural Facility',
    description: 'Facilities for agricultural production and processing',
    occupantLoadFactor: 46.5,
    hazardClassification: 'ordinary',
    examples: 'Barns, greenhouses, grain silos, livestock facilities, food processing plants'
  },
  {
    id: 'mining-facility',
    name: 'Mining Facility',
    description: 'Facilities for extraction and processing of minerals',
    occupantLoadFactor: 46.5,
    hazardClassification: 'high',
    examples: 'Underground mines, open-pit mines, mineral processing plants, quarries'
  },
  {
    id: 'offshore-facility',
    name: 'Offshore Facility',
    description: 'Structures located on water for various purposes',
    occupantLoadFactor: 9.3,
    hazardClassification: 'high',
    examples: 'Oil platforms, floating production storage facilities, offshore wind farms, artificial islands'
  },
  {
    id: 'power-generation-plant',
    name: 'Power Generation Plant',
    description: 'Facilities that generate electricity through various means',
    occupantLoadFactor: 46.5,
    hazardClassification: 'high',
    examples: 'Coal power plants, natural gas plants, hydroelectric plants, geothermal plants'
  },
  {
    id: 'historical-building',
    name: 'Historical Building',
    description: 'Buildings with historical or cultural significance requiring special preservation considerations',
    occupantLoadFactor: 9.3, // Varies based on use
    hazardClassification: 'ordinary',
    examples: 'Heritage sites, museums in historical buildings, ancestral houses, colonial structures'
  },
  {
    id: 'place-of-worship',
    name: 'Place of Worship',
    description: 'Buildings used for religious services and activities',
    occupantLoadFactor: 0.65,
    hazardClassification: 'light',
    examples: 'Churches, mosques, temples, chapels, cathedrals, prayer halls'
  }
];
