export type ParentGoal = "attention" | "patience" | "reasoning";
export type DetoxLevel = "soft" | "medium" | "intense";
export type WorldId = "nature" | "space" | "art" | "science" | "history" | "logic" | "cinema" | "lab";
export type AgeGroup = "6-7" | "8-10" | "11-12";
export type SessionStyle = "dynamic_transition" | "balanced_training" | "deep_focus";

export interface CognitiveProfile {
  primaryGoal: ParentGoal;
  secondaryGoals: ParentGoal[];
  ageGroup: AgeGroup;
  sessionStyle: SessionStyle;
}

export interface UserProfile {
  name: string;
  age: number;
  avatar: string;
  parentGoals: ParentGoal[];
  detoxLevel: DetoxLevel;
  favoriteWorlds: WorldId[];
  cognitiveProfile?: CognitiveProfile;
}

export interface ContentItem {
  id: string;
  section: "explore" | "focus" | "learn" | "achievements";
  title: string;
  subtitle: string;
  world: WorldId | "general";
  goals: ParentGoal[];
  ageRange: [number, number];
  detoxCompatibility: DetoxLevel[];
  contentType: string;
  questionTypes: string[];
  difficulty: number;
}
