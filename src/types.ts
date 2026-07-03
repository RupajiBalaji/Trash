export interface Profile {
  name: string;
  avatar: string; // Emoji avatar
}

export type WasteCategory = "Wet/Biodegradable" | "Dry/Recyclable" | "Hazardous";

export interface ScanResult {
  category: WasteCategory;
  item_name: string;
  kid_reason: string;
  disposal_tip: string;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: string;
  itemName: string;
  category: WasteCategory;
  kidReason: string;
  disposalTip: string;
  pointsAwarded: number;
  image?: string; // base64 string
  feedbackCorrect: boolean | null; // null = no feedback yet, true = correct, false = incorrect
  correctedCategory?: WasteCategory; // if corrected by parent
  correctedItemName?: string; // if corrected by parent
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  type: "first_scan" | "wet_count" | "dry_count" | "hazard_count";
}
