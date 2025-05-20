import { OccupancyType } from './occupancyTypes';

export interface SpecializedRequirement {
  id: string;
  occupancyTypeId: string;
  name: string;
  description: string;
  reference: string;
  details: string;
}

// Specialized requirements for specific occupancy types based on BFP memos, circulars, and guidelines
export const specializedRequirements: SpecializedRequirement[] = [
  // Solar Photovoltaic Facility Requirements
  {
    id: 'solar-pv-access',
    occupancyTypeId: 'solar-photovoltaic-facility',
    name: 'Roof Access and Pathways',
    description: 'Requirements for firefighter access on rooftop solar installations',
    reference: 'BFP Memorandum Circular 2019-05 / NFPA 1 Section 11.12',
    details: 'Rooftop solar installations must provide designated access pathways for firefighters. A clear perimeter of at least 0.9 meters (3 feet) must be maintained around the edges of the roof. For buildings with hip roofs, a 0.9-meter (3-foot) clear access pathway must be provided from the eave to the ridge. For buildings with valleys, a 0.9-meter (3-foot) clear access pathway must be provided from the valley to the ridge.'
  },
  {
    id: 'solar-pv-marking',
    occupancyTypeId: 'solar-photovoltaic-facility',
    name: 'Marking and Labeling',
    description: 'Requirements for marking and labeling of solar PV systems',
    reference: 'BFP Memorandum Circular 2019-05 / NFPA 70 Article 690',
    details: 'All solar PV systems must have permanent labels with the following information: maximum system voltage, operating current, and operating voltage. Reflective labels with minimum 9.5mm (3/8-inch) letters must be placed on DC conduits, raceways, enclosures, and junction boxes with the words "WARNING: PHOTOVOLTAIC POWER SOURCE". Main service disconnects must be labeled "WARNING: SOLAR ELECTRIC SYSTEM CONNECTED".'
  },
  {
    id: 'solar-pv-rapid-shutdown',
    occupancyTypeId: 'solar-photovoltaic-facility',
    name: 'Rapid Shutdown System',
    description: 'Requirements for rapid shutdown of solar PV systems in emergency situations',
    reference: 'BFP Memorandum Circular 2019-05 / NFPA 70 Article 690.12',
    details: 'Solar PV systems installed on buildings must have provisions to reduce DC voltage within the array boundary to not more than 80 volts within 30 seconds of rapid shutdown initiation. A rapid shutdown switch must be located at the building\'s main service entrance or at a location approved by the AHJ (Authority Having Jurisdiction). The switch must be clearly labeled "SOLAR PV SYSTEM RAPID SHUTDOWN".'
  },

  // Wind Turbine Facility Requirements
  {
    id: 'wind-turbine-fire-protection',
    occupancyTypeId: 'wind-turbine-facility',
    name: 'Fire Protection Systems',
    description: 'Requirements for fire protection systems in wind turbines',
    reference: 'NFPA 850 / BFP Technical Guidelines 2020-03',
    details: 'Wind turbines must be equipped with automatic fire detection systems in the nacelle, with connection to a monitoring system. For turbines with a nacelle volume exceeding 200 cubic meters, an automatic fire suppression system must be installed. Fire detection and suppression systems must be designed to function in the environmental conditions specific to wind turbines, including vibration, temperature variations, and electromagnetic interference.'
  },
  {
    id: 'wind-turbine-access',
    occupancyTypeId: 'wind-turbine-facility',
    name: 'Access and Egress',
    description: 'Requirements for access and egress in wind turbines',
    reference: 'BFP Technical Guidelines 2020-03 / NFPA 101',
    details: 'Wind turbines must have at least two means of egress from the nacelle. Service lifts or internal ladders can serve as one of the required means of egress. Emergency lighting must be provided along the egress path. For offshore wind turbines, additional provisions for marine evacuation must be implemented, including life rafts and personal flotation devices.'
  },

  // Energy Storage System Requirements
  {
    id: 'ess-ventilation',
    occupancyTypeId: 'energy-storage-system',
    name: 'Ventilation Requirements',
    description: 'Requirements for ventilation in energy storage systems',
    reference: 'BFP Memorandum Circular 2021-02 / NFPA 855',
    details: 'Energy storage systems using batteries must have adequate ventilation to prevent the accumulation of explosive gases. The ventilation system must be designed to maintain hydrogen concentrations below 1% of the room volume. Mechanical ventilation must provide at least 1 cubic foot per minute per square foot of floor area, but not less than 150 cubic feet per minute.'
  },
  {
    id: 'ess-separation',
    occupancyTypeId: 'energy-storage-system',
    name: 'Separation and Fire-Resistance',
    description: 'Requirements for separation and fire-resistance in energy storage systems',
    reference: 'BFP Memorandum Circular 2021-02 / NFPA 855',
    details: 'Energy storage systems must be separated from other occupancies by fire barriers with a minimum 2-hour fire-resistance rating. Individual battery storage arrays exceeding 50 kWh must be separated from each other by at least 3 feet or by a 1-hour fire-rated barrier. ESS installations exceeding 600 kWh must be located in a dedicated room separated from other areas by 2-hour fire-rated construction.'
  },
  {
    id: 'ess-suppression',
    occupancyTypeId: 'energy-storage-system',
    name: 'Fire Suppression Systems for ESS',
    description: 'Specialized suppression requirements specifically for energy storage systems',
    reference: 'BFP Memorandum Circular 2021-02 / NFPA 855',
    details: 'Energy storage systems exceeding 600 kWh must be protected by an automatic sprinkler system designed for Extra Hazard Group 2 occupancies. For lithium-ion battery systems, a water mist system or clean agent system specifically listed for lithium-ion battery protection may be used. The suppression system must be designed to provide cooling to prevent thermal runaway propagation between battery modules.'
  },

  // Telecommunication Facility Requirements
  {
    id: 'telecom-backup-power',
    occupancyTypeId: 'telecommunication-facility',
    name: 'Backup Power Systems',
    description: 'Requirements for backup power systems in telecommunication facilities',
    reference: 'BFP Technical Guidelines 2018-07 / NFPA 76',
    details: 'Telecommunication facilities must have backup power systems capable of maintaining critical operations for at least 24 hours. Fuel storage for generators must comply with NFPA 30 requirements. Battery rooms must have spill containment, ventilation, and hydrogen detection systems. Automatic transfer switches must be tested monthly and maintained according to NFPA 110.'
  },
  {
    id: 'telecom-fire-detection',
    occupancyTypeId: 'telecommunication-facility',
    name: 'Early Warning Fire Detection',
    description: 'Requirements for early warning fire detection in telecommunication facilities',
    reference: 'BFP Technical Guidelines 2018-07 / NFPA 76',
    details: 'Telecommunication facilities must be equipped with very early warning fire detection systems (VEWFD) such as air sampling smoke detection or sensitive spot-type smoke detectors. The system must be capable of detecting incipient stage fires before visible smoke is produced. The VEWFD system must be connected to a constantly attended location and must initiate an alarm at the incipient stage of fire development.'
  },

  // Waste Management Facility Requirements
  {
    id: 'waste-management-fire-detection',
    occupancyTypeId: 'waste-management-facility',
    name: 'Specialized Fire Detection for Waste Facilities',
    description: 'Advanced detection systems specific to waste management hazards',
    reference: 'BFP Memorandum Circular 2020-04 / NFPA 820',
    details: 'In addition to standard fire alarm systems, waste management facilities must have infrared thermal imaging cameras or other approved means to detect hot spots in waste storage areas. Continuous gas monitoring must be provided for methane, hydrogen sulfide, and carbon monoxide. Alarm thresholds must be set at 10% of the lower explosive limit (LEL) for methane. Manual fire alarm pull stations must be located at all exits and at 60-meter intervals throughout the facility.'
  },
  {
    id: 'waste-management-water-supply',
    occupancyTypeId: 'waste-management-facility',
    name: 'Enhanced Water Supply for Waste Facilities',
    description: 'Increased water supply requirements specific to waste management hazards',
    reference: 'BFP Memorandum Circular 2020-04 / NFPA 1142',
    details: 'Due to higher fire loads, waste management facilities require enhanced water supplies beyond standard requirements. They must have a minimum water supply of 3,800 liters per minute (1,000 gpm) for a duration of 4 hours. Water supply may be from municipal sources, on-site storage tanks, or natural water sources with approved drafting points. Fire hydrants must be installed at 150-meter intervals around the perimeter of the facility. Access roads must be maintained to all water supply sources and must be capable of supporting fire apparatus.'
  },

  // Mining Facility Requirements
  {
    id: 'mining-emergency-response',
    occupancyTypeId: 'mining-facility',
    name: 'Mining-Specific Emergency Response Plan',
    description: 'Specialized emergency planning for mining hazards beyond standard emergency plans',
    reference: 'DOLE Department Order 198-18 / BFP Technical Guidelines 2019-08',
    details: 'In addition to standard emergency plans, mining facilities must develop specialized protocols for mining-specific hazards. The plan must address fire emergencies, explosions, toxic gas releases, and mine collapse scenarios. The plan must be reviewed and updated annually. Emergency response teams must be established and trained in firefighting, rescue operations, and first aid specific to mining environments. Monthly emergency drills simulating mining-specific scenarios must be conducted and documented.'
  },
  {
    id: 'mining-ventilation',
    occupancyTypeId: 'mining-facility',
    name: 'Ventilation and Gas Monitoring',
    description: 'Requirements for ventilation and gas monitoring in underground mining facilities',
    reference: 'DOLE Department Order 198-18 / BFP Technical Guidelines 2019-08',
    details: 'Underground mining facilities must have mechanical ventilation systems capable of providing at least 1.5 cubic meters of air per minute per person. Continuous monitoring for methane, carbon monoxide, and oxygen levels must be implemented. Alarm thresholds must be set at 1.0% for methane, 25 ppm for carbon monoxide, and below 19.5% for oxygen. Ventilation systems must have backup power sources to ensure continuous operation during power outages.'
  },

  // Historical Building Requirements
  {
    id: 'historical-building-preservation',
    occupancyTypeId: 'historical-building',
    name: 'Preservation of Historical Features',
    description: 'Requirements for preserving historical features while implementing fire safety measures',
    reference: 'National Historical Commission Guidelines / BFP Memorandum Circular 2017-03',
    details: 'Fire safety improvements in historical buildings must be implemented with minimal impact on historical features. Where standard fire protection systems would damage historical elements, alternative methods may be approved by the AHJ in consultation with the National Historical Commission. Documentation of historical features must be maintained, and any modifications must be reversible when possible. Fire safety improvements must be distinguishable from original historical elements but compatible in appearance.'
  },
  {
    id: 'historical-building-detection',
    occupancyTypeId: 'historical-building',
    name: 'Fire Detection Systems',
    description: 'Requirements for fire detection systems in historical buildings',
    reference: 'BFP Memorandum Circular 2017-03 / NFPA 909',
    details: 'Historical buildings must be equipped with addressable fire detection systems that provide coverage of all areas, including concealed spaces. Smoke detectors must be the primary detection method, with heat detectors used only where environmental conditions preclude the use of smoke detectors. Detection system components must be installed with minimal impact on historical features. Wireless detection systems may be used where approved by the AHJ to minimize physical impact on the structure.'
  },

  // Place of Worship Requirements
  {
    id: 'worship-egress',
    occupancyTypeId: 'place-of-worship',
    name: 'Means of Egress',
    description: 'Requirements for means of egress in places of worship',
    reference: 'BFP Memorandum Circular 2016-04 / NFPA 101',
    details: 'Places of worship must have a minimum of two separate means of egress when the occupant load exceeds 50 persons. Main entrance doors used by the congregation must provide at least one-half of the required egress width. Aisles leading to exits must be at least 1.1 meters (44 inches) wide. Exit doors must swing in the direction of egress when serving an occupant load of 50 or more. Seating arrangements must provide a clear width of at least 300mm (12 inches) between rows.'
  },
  {
    id: 'worship-emergency-lighting',
    occupancyTypeId: 'place-of-worship',
    name: 'Emergency Lighting',
    description: 'Requirements for emergency lighting in places of worship',
    reference: 'BFP Memorandum Circular 2016-04 / NFPA 101',
    details: 'Places of worship with an occupant load exceeding 300 persons or with worship services conducted after sunset must be provided with emergency lighting. Emergency lighting must illuminate means of egress for a period of at least 90 minutes in the event of power failure. The system must provide initial illumination of at least 10.8 lux (1 foot-candle) at floor level, decreasing to not less than 6.5 lux (0.6 foot-candle) at the end of the emergency lighting time.'
  }
];

// Function to get specialized requirements for a specific occupancy type
export function getSpecializedRequirements(occupancyTypeId: string): SpecializedRequirement[] {
  return specializedRequirements.filter(req => req.occupancyTypeId === occupancyTypeId);
}

// Function to check if an occupancy type has specialized requirements
export function hasSpecializedRequirements(occupancyTypeId: string): boolean {
  return specializedRequirements.some(req => req.occupancyTypeId === occupancyTypeId);
}
