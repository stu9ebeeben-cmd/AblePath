export interface Place {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  image: string;
  distance: string;
  walkMinutes: number;
  highlightBadge: {
    text: string;
    icon: string;
    color: 'emerald' | 'amber' | 'sky';
  };
  tags: {
    text: string;
    icon: string;
    variant: 'emerald' | 'slate' | 'amber';
  }[];
  isFlat: boolean;
  hasRamp: boolean;
  isQuiet: boolean;
  hasElevator: boolean;
  hasAccessibleRestroom: boolean;
  description: string;
  address: string;
  rating: number;
  noiseLevel: 'Very Quiet' | 'Moderate' | 'Bustling';
  doorType: 'Automatic Sliding' | 'Push Button' | 'Level Wide Door';
}

export interface Helper {
  id: string;
  name: string;
  shortName: string;
  relation: string;
  phone: string;
  avatarLetter: string;
  colorScheme: 'emerald' | 'sky' | 'amber' | 'purple';
  status: string;
  lastActive: string;
  batteryLevel?: number;
  isEmergencyContact?: boolean;
}

export interface ObstacleReport {
  id: string;
  title: string;
  category: 'Broken Elevator' | 'Blocked Ramp' | 'Steep Curb' | 'Construction' | 'Slippery';
  location: string;
  timeAgo: string;
  reportedBy: string;
  status: 'Active Warning' | 'Fixed / Clear' | 'Under Repair';
  severity: 'High' | 'Medium' | 'Low';
  upvotes: number;
  image?: string;
}

export interface RouteStep {
  id: number;
  instruction: string;
  detail: string;
  distance: string;
  icon: string;
  safeFeature: string;
}

export type TextSizeMode = 'normal' | 'big' | 'extra-big';

export type TabType = 'explore' | 'routes' | 'friends' | 'sos';
