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
