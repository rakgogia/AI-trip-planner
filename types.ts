export enum Budget {
  Budget = "Budget",
  MidRange = "Mid-range",
  Luxury = "Luxury",
}

export interface Restaurant {
  name: string;
  cuisine: string;
}

export interface Activity {
  time: string; // e.g., "Morning", "Afternoon", "Evening"
  description: string;
  details?: string; // Optional more detailed description
  restaurant?: Restaurant;
}

export interface DailyPlan {
  day: number;
  title: string;
  activities: Activity[];
}

export type Itinerary = DailyPlan[];