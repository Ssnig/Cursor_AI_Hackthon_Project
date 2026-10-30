/**
 * Zero-dependency Web Audio API synthesizer for sci-fi cybernetic sound effects.
 * Safe in all browsers; fails silently if audio context is blocked.
 */

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isAudioMuted(): boolean {
  return isMuted;
}

export function toggleAudioMute(): boolean {
  isMuted = !isMuted;
  if (!isMuted) {
    playCyberBlip(1200, 0.05);
  }
  return isMuted;
}

export function playCyberBlip(freq = 980, duration = 0.06, type: OscillatorType = "sine") {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio playback blocks
  }
}

export function playTargetLock() {
  if (isMuted) return;
  playCyberBlip(1400, 0.04, "sawtooth");
  setTimeout(() => playCyberBlip(1850, 0.08, "triangle"), 45);
}

export function playProtocolEngaged() {
  if (isMuted) return;
  playCyberBlip(440, 0.05, "sine");
  setTimeout(() => playCyberBlip(880, 0.06, "sine"), 60);
  setTimeout(() => playCyberBlip(1760, 0.14, "sawtooth"), 120);
}

export function playHazardAlarm() {
  if (isMuted) return;
  playCyberBlip(420, 0.08, "square");
  setTimeout(() => playCyberBlip(320, 0.1, "square"), 90);
}

