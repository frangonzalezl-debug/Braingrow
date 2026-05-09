import { courseLibrary } from "../data/courseLibrary";
import { Course, CognitiveGoal } from "../types/learning";
import { UserProfile, DetoxLevel } from "../types";

/**
 * Brain Grow Course Engine
 * Responsible for filtering, scoring, and recommending courses based on the user's profile.
 */

/**
 * Returns all courses in the library.
 */
export const getAllCourses = (): Course[] => {
  return courseLibrary;
};

/**
 * Returns only published courses.
 */
export const getPublishedCourses = (): Course[] => {
  return courseLibrary.filter(course => course.status === "published");
};

/**
 * Returns a single course by its ID.
 */
export const getCourseById = (courseId: string): Course | undefined => {
  return courseLibrary.find(course => course.id === courseId);
};

/**
 * Returns all courses belonging to a specific world.
 */
export const getCoursesByWorld = (worldKey: string): Course[] => {
  return courseLibrary.filter(course => course.world === worldKey);
};

/**
 * Returns all courses targeting a specific cognitive goal.
 */
export const getCoursesByGoal = (goalKey: CognitiveGoal): Course[] => {
  return courseLibrary.filter(course => course.goals.includes(goalKey));
};

/**
 * Determines if a course is eligible for a specific user based on:
 * - Favorite worlds selection
 * - Parental goals
 * - Age range
 * - Detox level compatibility
 * - Publication status
 */
export const isCourseEligible = (course: Course, userProfile: UserProfile): boolean => {
  // Must be published
  if (course.status !== "published") return false;

  // Must be in child's favorite worlds
  if (!userProfile.favoriteWorlds.includes(course.world)) return false;

  // At least one goal must match parent goals
  const hasMatchingGoal = course.goals.some(goal => userProfile.parentGoals.includes(goal));
  if (!hasMatchingGoal) return false;

  // Age must be within range
  if (userProfile.age < course.ageRange[0] || userProfile.age > course.ageRange[1]) return false;

  // Must be compatible with detox level
  if (!course.detoxCompatibility.includes(userProfile.detoxLevel)) return false;

  return true;
};

/**
 * Scores a course for a user profile to determine recommendation priority.
 */
export const scoreCourse = (course: Course, userProfile: UserProfile): number => {
  let score = 0;

  // World affinity (highest priority)
  if (userProfile.favoriteWorlds.includes(course.world)) {
    score += 5;
  } else {
    // If not in favorite worlds, heavily penalize or filter
    score -= 10;
  }

  // Primary goal alignment
  const primaryGoal = userProfile.cognitiveProfile?.primaryGoal || userProfile.parentGoals[0];
  if (course.goals.includes(primaryGoal)) {
    score += 4;
  }

  // Secondary goals alignment
  const secondaryGoals = userProfile.cognitiveProfile?.secondaryGoals || userProfile.parentGoals.slice(1);
  const matchingSecondaryCount = course.goals.filter(goal => secondaryGoals.includes(goal)).length;
  score += (matchingSecondaryCount * 2);

  // Detox compatibility
  if (course.detoxCompatibility.includes(userProfile.detoxLevel)) {
    score += 2;
  }

  // Age/Difficulty match (Simplified: assuming correct age range = +1)
  if (userProfile.age >= course.ageRange[0] && userProfile.age <= course.ageRange[1]) {
    score += 1;
  }

  return score;
};

/**
 * Recommends a list of courses tailored to the user profile.
 */
export const recommendCourses = (userProfile: UserProfile, limit: number = 6): Course[] => {
  return getPublishedCourses()
    .filter(course => isCourseEligible(course, userProfile))
    .map(course => ({ course, score: scoreCourse(course, userProfile) }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.course)
    .slice(0, limit);
};

/**
 * Returns eligible and scored courses for a specific world.
 */
export const getCoursesForWorld = (userProfile: UserProfile, worldKey: string): Course[] => {
  return getPublishedCourses()
    .filter(course => course.world === worldKey && isCourseEligible(course, userProfile))
    .map(course => ({ course, score: scoreCourse(course, userProfile) }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.course);
};

/**
 * Navigation helpers for browsing course content hierarchy.
 */

export const getCourseModules = (courseId: string) => {
  const course = getCourseById(courseId);
  return course?.modules || [];
};

export const getModuleById = (courseId: string, moduleId: string) => {
  const modules = getCourseModules(courseId);
  return modules.find(m => m.id === moduleId);
};

export const getLessonById = (courseId: string, moduleId: string, lessonId: string) => {
  const module = getModuleById(courseId, moduleId);
  return module?.lessons.find(l => l.id === lessonId);
};

export const getActivityById = (courseId: string, moduleId: string, lessonId: string, activityId: string) => {
  const lesson = getLessonById(courseId, moduleId, lessonId);
  return lesson?.activities.find(a => a.id === activityId);
};

export const getNextLesson = (courseId: string, moduleId: string, lessonId: string) => {
  const module = getModuleById(courseId, moduleId);
  if (!module) return undefined;
  const currentIndex = module.lessons.findIndex(l => l.id === lessonId);
  if (currentIndex >= 0 && currentIndex < module.lessons.length - 1) {
    return module.lessons[currentIndex + 1];
  }
  return undefined;
};

export const getNextActivity = (courseId: string, moduleId: string, lessonId: string, activityId: string) => {
  const lesson = getLessonById(courseId, moduleId, lessonId);
  if (!lesson) return undefined;
  const currentIndex = lesson.activities.findIndex(a => a.id === activityId);
  if (currentIndex >= 0 && currentIndex < lesson.activities.length - 1) {
    return lesson.activities[currentIndex + 1];
  }
  // If no more activities in this lesson, maybe next lesson?
  // (Left simple for now as requested)
  return undefined;
};

/**
 * Returns a localized title for the user's learning path based on their primary goal.
 */
export const getCoursePathTitle = (userProfile: UserProfile): string => {
  const primaryGoal = userProfile.cognitiveProfile?.primaryGoal || userProfile.parentGoals[0];
  
  let baseTitle = "";
  switch (primaryGoal) {
    case "attention":
      baseTitle = "Cerebro Explorador";
      break;
    case "patience":
      baseTitle = "Templo de la Calma";
      break;
    case "reasoning":
      baseTitle = "Laboratorio de Ideas";
      break;
    default:
      baseTitle = "Mi Aventura Brain Grow";
  }

  // Add flavor if worlds are selected (optional, but requested)
  // We can include names of first two favorite worlds
  if (userProfile.favoriteWorlds.length > 0) {
    // Since names aren't in keys, this is just a placeholder logic 
    // Usually you'd import worldTaxonomy but let's keep it simple or just use the keys capitalized
    const worldNames = userProfile.favoriteWorlds
      .slice(0, 2)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" y ");
    
    if (worldNames) {
      return `${baseTitle}: ${worldNames}`;
    }
  }

  return baseTitle;
};
