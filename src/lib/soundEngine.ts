/**
 * Brain Grow Sound Engine
 * Manages audio playback, preloading, and user preferences.
 */

export const soundKeys = {
  tap: "tap",
  select: "select",
  correct: "correct",
  wrong: "wrong",
  complete: "complete",
  open: "open",
  levelUp: "levelUp"
} as const;

export type SoundKey = keyof typeof soundKeys;

const soundFiles: Record<SoundKey, string> = {
  tap: "/sounds/tap.mp3",
  select: "/sounds/select.mp3",
  correct: "/sounds/correct.mp3",
  wrong: "/sounds/wrong.mp3",
  complete: "/sounds/complete.mp3",
  open: "/sounds/open.mp3",
  levelUp: "/sounds/level-up.mp3"
};

const LS_KEY = "brainGrowSoundEnabled";
let soundEnabled = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) !== "false" : true;

const audioCache: Map<SoundKey, HTMLAudioElement> = new Map();

/**
 * Preloads all sounds into memory.
 */
export const preloadSounds = () => {
  if (typeof window === "undefined") return;
  
  Object.entries(soundFiles).forEach(([key, path]) => {
    const audio = new Audio(path);
    audio.load();
    audioCache.set(key as SoundKey, audio);
  });
};

/**
 * Plays a sound by its key.
 */
export const playSound = (key: SoundKey) => {
  if (!soundEnabled || typeof window === "undefined") return;

  try {
    let audio = audioCache.get(key);
    
    // Lazy load if not in cache
    if (!audio) {
      audio = new Audio(soundFiles[key]);
      audioCache.set(key, audio);
    }

    // Reset and play
    audio.currentTime = 0;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Fallback for missing files or browser restrictions
        if (process.env.NODE_ENV === "development") {
          console.warn(`SoundEngine: Failed to play sound "${key}". File might be missing or interaction was required.`, error);
        }
      });
    }
  } catch (error) {
    console.error(`SoundEngine: Critical error playing "${key}"`, error);
  }
};

// Convenience helpers
export const playTap = () => playSound("tap");
export const playSelect = () => playSound("select");
export const playCorrect = () => playSound("correct");
export const playWrong = () => playSound("wrong");
export const playComplete = () => playSound("complete");
export const playOpen = () => playSound("open");
export const playLevelUp = () => playSound("levelUp");

/**
 * Toggles sound enabled state.
 */
export const toggleSound = () => {
  setSoundEnabled(!soundEnabled);
  return soundEnabled;
};

/**
 * Sets sound enabled state and persists it.
 */
export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_KEY, String(enabled));
  }
};

/**
 * Returns current sound state.
 */
export const getSoundEnabled = () => soundEnabled;
