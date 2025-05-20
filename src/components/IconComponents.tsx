import React from 'react';
import { 
  FaBuilding, 
  FaUsers, 
  FaLayerGroup, 
  FaClipboardList, 
  FaFileAlt, 
  FaFlask,
  FaExclamationTriangle,
  FaShieldAlt,
  FaFireExtinguisher,
  FaDoorOpen,
  FaWater,
  FaBell,
  FaLightbulb,
  FaArrowAltCircleUp
} from 'react-icons/fa';

// Component icons for various sections
export const BuildingIcon = () => <FaBuilding className="text-blue-600" />;
export const OccupancyIcon = () => <FaUsers className="text-blue-600" />;
export const FloorIcon = () => <FaLayerGroup className="text-blue-600" />;
export const RequirementsIcon = () => <FaClipboardList className="text-blue-600" />;
export const DocumentsIcon = () => <FaFileAlt className="text-blue-600" />;
export const HazardousIcon = () => <FaFlask className="text-red-600" />;

// Icons for specific fire safety requirements
export const FireAlarmIcon = () => <FaBell className="text-red-600" />;
export const SprinklerIcon = () => <FaWater className="text-blue-600" />;
export const ExtinguisherIcon = () => <FaFireExtinguisher className="text-red-600" />;
export const ExitIcon = () => <FaDoorOpen className="text-green-600" />;
export const EmergencyLightIcon = () => <FaLightbulb className="text-yellow-600" />;
export const WarningIcon = () => <FaExclamationTriangle className="text-yellow-600" />;
export const SafetyIcon = () => <FaShieldAlt className="text-blue-600" />;
export const EvacuationIcon = () => <FaArrowAltCircleUp className="text-green-600" />;

// Function to get the appropriate icon for a requirement
export const getRequirementIcon = (requirementId: string) => {
  switch (requirementId) {
    case 'fire-alarm-system':
      return <FireAlarmIcon />;
    case 'automatic-sprinkler-system':
      return <SprinklerIcon />;
    case 'portable-fire-extinguisher':
      return <ExtinguisherIcon />;
    case 'fire-exit':
    case 'means-of-egress':
      return <ExitIcon />;
    case 'emergency-lighting':
      return <EmergencyLightIcon />;
    case 'fire-safety-evacuation-plan':
      return <EvacuationIcon />;
    default:
      return <SafetyIcon />;
  }
};
