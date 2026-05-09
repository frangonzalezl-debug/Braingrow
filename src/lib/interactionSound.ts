import { 
  playTap, 
  playSelect, 
  playOpen, 
  playComplete, 
  playCorrect, 
  playWrong, 
  playLevelUp 
} from "./soundEngine";

/**
 * Brain Grow Interaction Sound Helpers
 * Higher-order functions to wrap callbacks with sounds.
 */

type AnyAction = (...args: any[]) => any;

function withSound(soundFn: () => void, callback?: AnyAction) {
  return (...args: any[]) => {
    soundFn();
    if (callback) {
      return callback(...args);
    }
  };
}

export const withTapSound = (callback?: AnyAction) => withSound(playTap, callback);
export const withSelectSound = (callback?: AnyAction) => withSound(playSelect, callback);
export const withOpenSound = (callback?: AnyAction) => withSound(playOpen, callback);
export const withCompleteSound = (callback?: AnyAction) => withSound(playComplete, callback);
export const withCorrectSound = (callback?: AnyAction) => withSound(playCorrect, callback);
export const withWrongSound = (callback?: AnyAction) => withSound(playWrong, callback);
export const withLevelUpSound = (callback?: AnyAction) => withSound(playLevelUp, callback);
