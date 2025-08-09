export interface WishItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface SouvenirItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface WishlistItemDB {
  id: number;
  text: string;
  is_checked: boolean;
  owner: 'なおき' | 'まひろ' | '共通';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SouvenirItemDB {
  id: number;
  text: string;
  is_checked: boolean;
  owner: 'なおき' | 'まひろ';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TravelActivity {
  time: string;
  activity: string;
  type: 'person-x' | 'person-y' | 'shared' | 'empty';
  details?: string;
  duration?: string;
  flightInfo?: string;
  flightLink?: string;
  imageUrl?: string;
  activityType?: 'flight' | 'immigration' | 'transfer';
}

export interface FlightInfo {
  departure: string;
  arrival: string;
  airline: string;
  flightNumber: string;
  date: string;
}

export interface DaySchedule {
  date: string;
  day: string;
  activities: TravelActivity[];
}

export interface TravelItinerary {
  title: string;
  period: string;
  flightInfo: {
    outbound: FlightInfo;
    return: FlightInfo;
  };
  schedule: DaySchedule[];
}