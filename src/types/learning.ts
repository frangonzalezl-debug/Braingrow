import { ParentGoal, DetoxLevel, AgeGroup, WorldId } from "../types";

/**
 * Brain Grow Learning System Types
 * Defines the contracts for courses, modules, lessons, and interactive activities.
 */

export type CognitiveGoal = ParentGoal;

export type CourseStatus = "draft" | "published" | "archived";

export type ContentType = 
  | "video_question" 
  | "guided_activity" 
  | "mini_game" 
  | "story_sequence" 
  | "breathing_pause" 
  | "pattern_challenge" 
  | "observation_challenge";

export type QuestionType = 
  | "multiple_choice" 
  | "sequence_order" 
  | "spot_difference" 
  | "wait_before_answer" 
  | "prediction" 
  | "open_reflection";

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  minWaitSeconds?: number;
}

export interface LessonActivity {
  id: string;
  title: string;
  contentType: ContentType;
  durationSeconds?: number;
  prompt: string;
  instructions?: string;
  questions?: Question[];
  cognitiveSkill?: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle?: string;
  activities: LessonActivity[];
}

export interface CourseModule {
  id: string;
  title: string;
  subtitle?: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  world: WorldId;
  strand: string;
  goals: CognitiveGoal[];
  ageRange: [number, number];
  detoxCompatibility: DetoxLevel[];
  difficulty: number;
  estimatedMinutes: number;
  coverEmoji: string;
  status: CourseStatus;
  modules: CourseModule[];
  tags?: string[];
}
