// NFPA references for specific fire safety requirements
export const nfpaReferences = {
  // Alternate Power Supply Requirements
  alternatePowerSupply: {
    fdas: {
      standard: 'NFPA 72',
      section: '10.6',
      requirements: [
        'Primary power supply must be dedicated branch circuit',
        'Secondary power supply must be storage battery or automatic-starting engine-driven generator',
        'Storage batteries must provide 24 hours of standby power followed by 5 minutes of alarm operation',
        'For voice evacuation systems, 24 hours of standby followed by 15 minutes of alarm operation',
        'Generator installations must comply with NFPA 110'
      ]
    },
    sprinkler: {
      standard: 'NFPA 20',
      section: '9.3',
      requirements: [
        'Electric fire pumps must have a reliable source of power',
        'Power continuity must be ensured through one of the following: connection to generator set, connection to multiple utility services, or a dedicated feeder',
        'Transfer of power must be automatic for high-rise buildings',
        'Standby power system must be capable of carrying the locked-rotor current of the fire pump motor(s)'
      ]
    },
    elevators: {
      standard: 'NFPA 70/72/101',
      section: 'Multiple',
      requirements: [
        'Elevators required for emergency operation must be connected to standby power system',
        'Standby power must be capable of operating all designated elevators simultaneously',
        'Minimum 2-hour operation time for emergency power supply',
        'Transfer to emergency power must be automatic and within 60 seconds'
      ]
    }
  },
  
  // Fireman Switch for Elevators
  firemanSwitch: {
    standard: 'NFPA 72',
    section: '21.6',
    requirements: [
      'Phase I Emergency Recall Operation must be provided through a three-position key switch at designated level',
      'Automatic recall must be initiated by smoke detectors installed in elevator lobbies, machine rooms, and hoistways',
      'Phase II Emergency In-Car Operation must allow firefighters to control elevator from within the car',
      'Visual signal must indicate when Phase I operation is in effect',
      'Separate keys required for Phase I and Phase II operations'
    ]
  },
  
  // Sprinkler System Requirements by Number of Floors
  sprinklerSystemByFloors: {
    standard: 'NFPA 13/14',
    requirements: [
      {
        floors: '1-2',
        system: 'Wet pipe system with minimum 30 minutes water supply duration for light hazard',
        pressure: 'Minimum residual pressure of 7 psi (0.5 bar) at most remote sprinkler',
        waterSupply: 'Can be supplied by domestic water supply if adequate'
      },
      {
        floors: '3-6',
        system: 'Wet pipe system with minimum 60 minutes water supply duration',
        pressure: 'Minimum residual pressure of 7 psi (0.5 bar) at most remote sprinkler',
        waterSupply: 'Dedicated water supply or fire pump may be required'
      },
      {
        floors: '7-20',
        system: 'Wet pipe system with standpipes, minimum 60-90 minutes water supply duration',
        pressure: 'Minimum residual pressure of 100 psi (6.9 bar) at topmost outlet',
        waterSupply: 'Fire pump required with backup power supply'
      },
      {
        floors: '21+',
        system: 'Wet pipe system with standpipes and fire pump, minimum 90-120 minutes water supply duration',
        pressure: 'Minimum residual pressure of 100 psi (6.9 bar) at topmost outlet',
        waterSupply: 'Multiple fire pumps or zones may be required, emergency power supply mandatory',
        additional: 'Water storage tanks typically required'
      }
    ]
  }
};

// Additional NFPA standards relevant to fire safety
export const additionalNfpaStandards = [
  {
    code: 'NFPA 1',
    title: 'Fire Code',
    relevance: 'Comprehensive fire code that provides requirements to establish a reasonable level of fire safety and property protection from hazards created by fire and explosion.'
  },
  {
    code: 'NFPA 13',
    title: 'Standard for the Installation of Sprinkler Systems',
    relevance: 'Provides requirements for the design and installation of automatic fire sprinkler systems.'
  },
  {
    code: 'NFPA 14',
    title: 'Standard for the Installation of Standpipe and Hose Systems',
    relevance: 'Provides requirements for the installation of standpipe and hose systems for buildings and structures.'
  },
  {
    code: 'NFPA 20',
    title: 'Standard for the Installation of Stationary Pumps for Fire Protection',
    relevance: 'Provides requirements for the selection and installation of pumps to ensure reliable operation of water-based fire protection systems.'
  },
  {
    code: 'NFPA 70',
    title: 'National Electrical Code',
    relevance: 'Covers electrical wiring and equipment installation requirements for fire alarm systems and emergency power systems.'
  },
  {
    code: 'NFPA 72',
    title: 'National Fire Alarm and Signaling Code',
    relevance: 'Covers the application, installation, location, performance, inspection, testing, and maintenance of fire alarm systems.'
  },
  {
    code: 'NFPA 101',
    title: 'Life Safety Code',
    relevance: 'Establishes minimum requirements for new and existing buildings to protect building occupants from fire, smoke, and toxic fumes.'
  },
  {
    code: 'NFPA 110',
    title: 'Standard for Emergency and Standby Power Systems',
    relevance: 'Covers performance requirements for emergency and standby power systems providing an alternate source of electrical power.'
  }
];
