const MUTE_KEY = "debate_arena_muted";

let cachedContext: AudioContext | null = null;
const listeners = new Set<(muted: boolean) => void>();

interface ExtWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

function getContext(): AudioContext | null {
  if (cachedContext) {
    if (cachedContext.state === "suspended") {
      void cachedContext.resume().catch(() => {});
    }
    return cachedContext;
  }
  if (typeof window === "undefined") {
    return null;
  }
  const Ctor = window.AudioContext || (window as ExtWindow).webkitAudioContext;
  if (!Ctor) {
    return null;
  }
  try {
    cachedContext = new Ctor();
    return cachedContext;
  } catch {
    return null;
  }
}

export function isMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setMuted(value: boolean): void {
  try {
    if (value) {
      localStorage.setItem(MUTE_KEY, "true");
    } else {
      localStorage.removeItem(MUTE_KEY);
    }
  } catch {
    // localStorage unavailable; volatile mute state is fine
  }
  listeners.forEach((listener) => listener(value));
}

export function subscribeMuted(listener: (muted: boolean) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function playGavelKnock(ctx: AudioContext): void {
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = 0.45;
  master.connect(ctx.destination);

  const bodyOsc = ctx.createOscillator();
  bodyOsc.type = "sine";
  bodyOsc.frequency.setValueAtTime(140, now);
  bodyOsc.frequency.exponentialRampToValueAtTime(60, now + 0.18);

  const bodyGain = ctx.createGain();
  bodyGain.gain.setValueAtTime(0.0001, now);
  bodyGain.gain.exponentialRampToValueAtTime(1, now + 0.005);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

  bodyOsc.connect(bodyGain);
  bodyGain.connect(master);
  bodyOsc.start(now);
  bodyOsc.stop(now + 0.4);

  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 1800;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.6, now + 0.003);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(master);
  noise.start(now);
  noise.stop(now + 0.15);
}

export function playSound(name: "gavel"): void {
  if (isMuted()) {
    return;
  }
  const ctx = getContext();
  if (!ctx) {
    return;
  }
  try {
    if (name === "gavel") {
      playGavelKnock(ctx);
    }
  } catch {
    // never let audio break the UI
  }
}

// ---------------------------------------------------------------------------
// Background music — a looping chiptune bed generated entirely with Web Audio,
// matching the procedural approach used for sound effects (no audio assets).
// ---------------------------------------------------------------------------

const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD = 0.12;

export type MusicTheme = "chill" | "tense";

interface ThemeConfig {
  volume: number; // master gain for this theme
  stepSeconds: number; // eighth-note duration (lower = faster)
  filterFreq: number; // lowpass cutoff (higher = more edge)
  arpType: OscillatorType;
  arpDuration: number;
  arpPeak: number;
  bassType: OscillatorType;
  bassDuration: number;
  bassPeak: number;
  bassSteps: number[]; // positions within a bar (0-7) that trigger the bass
  bassByBar: number[];
  arpByBar: number[][];
}

const THEMES: Record<MusicTheme, ThemeConfig> = {
  // Lobby / main screen — calm minor progression Am - F - C - G.
  chill: {
    volume: 0.13,
    stepSeconds: 0.3, // ~100 BPM
    filterFreq: 2000,
    arpType: "triangle",
    arpDuration: 0.26,
    arpPeak: 0.6,
    bassType: "triangle",
    bassDuration: 0.55,
    bassPeak: 0.9,
    bassSteps: [0, 4],
    bassByBar: [110.0, 87.31, 130.81, 98.0], // A2, F2, C3, G2
    arpByBar: [
      [220.0, 261.63, 329.63, 261.63], // Am: A3 C4 E4 C4
      [174.61, 220.0, 261.63, 220.0], // F:  F3 A3 C4 A3
      [261.63, 329.63, 392.0, 329.63], // C:  C4 E4 G4 E4
      [196.0, 246.94, 293.66, 246.94], // G:  G3 B3 D4 B3
    ],
  },
  // Debate / battle — faster, driving, dramatic descent Am - G - F - E.
  tense: {
    volume: 0.15,
    stepSeconds: 0.2, // ~150 BPM
    filterFreq: 2600,
    arpType: "square",
    arpDuration: 0.16,
    arpPeak: 0.42,
    bassType: "sawtooth",
    bassDuration: 0.22,
    bassPeak: 0.7,
    bassSteps: [0, 2, 4, 6], // quarter-note pulse for urgency
    bassByBar: [110.0, 98.0, 87.31, 82.41], // A2, G2, F2, E2
    arpByBar: [
      [220.0, 261.63, 329.63, 261.63], // Am: A3 C4 E4 C4
      [196.0, 246.94, 293.66, 246.94], // G:  G3 B3 D4 B3
      [174.61, 220.0, 261.63, 220.0], // F:  F3 A3 C4 A3
      [164.81, 207.65, 246.94, 207.65], // E:  E3 G#3 B3 G#3
    ],
  },
};

let musicTimer: ReturnType<typeof setInterval> | null = null;
let musicGain: GainNode | null = null;
let musicFilter: BiquadFilterNode | null = null;
let nextNoteTime = 0;
let stepIndex = 0;
let musicInitialized = false;
let audioUnlocked = false;
let currentTheme: MusicTheme = "chill";

function ensureMusicNodes(ctx: AudioContext): GainNode {
  if (musicGain && musicFilter) {
    return musicGain;
  }
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = THEMES[currentTheme].filterFreq;

  const gain = ctx.createGain();
  gain.gain.value = THEMES[currentTheme].volume;
  gain.connect(filter);
  filter.connect(ctx.destination);
  musicGain = gain;
  musicFilter = filter;
  return gain;
}

function playMusicNote(
  ctx: AudioContext,
  time: number,
  freq: number,
  duration: number,
  peak: number,
  type: OscillatorType
): void {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, time);

  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, time);
  env.gain.exponentialRampToValueAtTime(peak, time + 0.012);
  env.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  osc.connect(env);
  env.connect(ensureMusicNodes(ctx));
  osc.start(time);
  osc.stop(time + duration + 0.02);
}

function scheduleStep(ctx: AudioContext, step: number, time: number): void {
  const theme = THEMES[currentTheme];
  const bar = Math.floor(step / 8) % theme.bassByBar.length;
  const pos = step % 8;

  // Arpeggio pluck on every eighth note.
  playMusicNote(ctx, time, theme.arpByBar[bar][pos % 4], theme.arpDuration, theme.arpPeak, theme.arpType);

  // Bass on the theme's beat pattern.
  if (theme.bassSteps.includes(pos)) {
    playMusicNote(ctx, time, theme.bassByBar[bar], theme.bassDuration, theme.bassPeak, theme.bassType);
  }
}

function musicScheduler(): void {
  const ctx = getContext();
  if (!ctx) {
    return;
  }
  const stepSeconds = THEMES[currentTheme].stepSeconds;
  const totalSteps = THEMES[currentTheme].bassByBar.length * 8;
  while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
    scheduleStep(ctx, stepIndex, nextNoteTime);
    nextNoteTime += stepSeconds;
    stepIndex = (stepIndex + 1) % totalSteps;
  }
}

/** Switch the active music theme; restarts the loop seamlessly if playing. */
export function setMusicTheme(theme: MusicTheme): void {
  if (theme === currentTheme) {
    return;
  }
  currentTheme = theme;

  const ctx = cachedContext;
  if (ctx && musicGain && musicFilter) {
    musicGain.gain.setTargetAtTime(THEMES[theme].volume, ctx.currentTime, 0.08);
    musicFilter.frequency.setTargetAtTime(THEMES[theme].filterFreq, ctx.currentTime, 0.08);
  }

  // Reset the sequence so the new progression starts from its first bar.
  if (musicTimer !== null && ctx) {
    stepIndex = 0;
    nextNoteTime = ctx.currentTime + 0.05;
  }
}

export function startMusic(): void {
  if (musicTimer !== null || isMuted()) {
    return;
  }
  const ctx = getContext();
  if (!ctx) {
    return;
  }
  const gain = ensureMusicNodes(ctx);
  gain.gain.cancelScheduledValues(ctx.currentTime);
  gain.gain.setValueAtTime(THEMES[currentTheme].volume, ctx.currentTime);
  nextNoteTime = ctx.currentTime + 0.1;
  stepIndex = 0;
  musicScheduler();
  musicTimer = setInterval(musicScheduler, LOOKAHEAD_MS);
}

export function stopMusic(): void {
  if (musicTimer !== null) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
  const ctx = cachedContext;
  if (ctx && musicGain) {
    // Fade out so already-scheduled notes don't click off.
    musicGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05);
  }
}

/**
 * Wire up background music once. Browsers block autoplay until a user gesture,
 * so we unlock on the first interaction. Honors the existing mute preference
 * and reacts to the mute toggle.
 */
export function initBackgroundMusic(): void {
  if (musicInitialized || typeof window === "undefined") {
    return;
  }
  musicInitialized = true;

  subscribeMuted((muted) => {
    if (muted) {
      stopMusic();
    } else if (audioUnlocked) {
      startMusic();
    }
  });

  const unlock = () => {
    audioUnlocked = true;
    getContext(); // create + resume within the gesture
    startMusic();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("touchstart", unlock);
  };

  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);
  window.addEventListener("touchstart", unlock);
}
