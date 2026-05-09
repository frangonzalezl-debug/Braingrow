const bgMusic = new Audio("/sounds/musicarelajante.mp3");

bgMusic.loop = true;
bgMusic.volume = 0.15;

let musicEnabled = true;

export function toggleMusic() {
  musicEnabled = !musicEnabled;

  if (!musicEnabled) {
    bgMusic.pause();
  }

  return musicEnabled;
}

export function isMusicEnabled() {
  return musicEnabled;
}

export default bgMusic;