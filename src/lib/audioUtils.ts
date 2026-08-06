/**
 * Audio synthesis & Haptic feedback utility using Web Audio API and Navigator Vibrate.
 * Provides rich sound cues for rest timers, set logs, and workout completion without external assets.
 */

let sharedAudioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  try {
    if (!sharedAudioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        sharedAudioCtx = new AudioCtx();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
};

export type HapticType =
  | 'tap'
  | 'bump'
  | 'setComplete'
  | 'timerComplete'
  | 'workoutComplete'
  | 'tick';

export const triggerHaptic = (type: HapticType = 'tap', enabled: boolean = true) => {
  if (!enabled) return;
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;

  try {
    switch (type) {
      case 'tap':
        navigator.vibrate(25);
        break;
      case 'bump':
        navigator.vibrate(50);
        break;
      case 'tick':
        navigator.vibrate(15);
        break;
      case 'setComplete':
        navigator.vibrate([40, 50, 60]);
        break;
      case 'timerComplete':
        navigator.vibrate([150, 75, 150, 75, 250]);
        break;
      case 'workoutComplete':
        navigator.vibrate([150, 80, 150, 80, 300, 100, 400]);
        break;
      default:
        navigator.vibrate(30);
    }
  } catch {
    // Ignore unsupported device vibration errors
  }
};

/**
 * Play a short countdown tick sound (at 3s, 2s, 1s remaining on rest timer)
 */
export const playCountdownTick = (secondsRemaining: number, soundEnabled = true, hapticEnabled = true) => {
  if (hapticEnabled) {
    triggerHaptic('tick', true);
  }
  if (!soundEnabled) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Pitch increases on countdown: 3s = 580Hz, 2s = 680Hz, 1s = 880Hz
    const pitch = secondsRemaining === 1 ? 880 : secondsRemaining === 2 ? 680 : 580;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  } catch {}
};

/**
 * Rest Timer Completion Chime: Bright 4-tone ascending flourish
 */
export const playTimerCompletionBeep = (soundEnabled = true, hapticEnabled = true) => {
  if (hapticEnabled) {
    triggerHaptic('timerComplete', true);
  }
  if (!soundEnabled) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const playTone = (freq: number, startTime: number, duration: number, type: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // 4 ascending chime tones: A5 (880Hz), D6 (1174Hz), E6 (1318Hz), A6 (1760Hz)
    playTone(880, now, 0.16, 'sine');
    playTone(1174.66, now + 0.18, 0.18, 'sine');
    playTone(1318.51, now + 0.38, 0.22, 'triangle');
    playTone(1760.00, now + 0.60, 0.45, 'sine');
  } catch (err) {
    console.warn('Could not play timer sound:', err);
  }
};

/**
 * Set Completion Chime: Quick dual crisp chime
 */
export const playSetCompletionSound = (soundEnabled = true, hapticEnabled = true) => {
  if (hapticEnabled) {
    triggerHaptic('setComplete', true);
  }
  if (!soundEnabled) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(783.99, now); // G5
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1046.50, now + 0.12); // C6
    gain2.gain.setValueAtTime(0.3, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.32);
  } catch {}
};

/**
 * Workout Finished Fanfare: Celebratory multi-note melody
 */
export const playWorkoutFinishedSound = (soundEnabled = true, hapticEnabled = true) => {
  if (hapticEnabled) {
    triggerHaptic('workoutComplete', true);
  }
  if (!soundEnabled) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [
      { freq: 523.25, time: 0, duration: 0.15 },    // C5
      { freq: 659.25, time: 0.15, duration: 0.15 }, // E5
      { freq: 783.99, time: 0.30, duration: 0.15 }, // G5
      { freq: 1046.50, time: 0.45, duration: 0.5 }  // C6
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, now + n.time);
      gain.gain.setValueAtTime(0.35, now + n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.time);
      osc.stop(now + n.time + n.duration);
    });
  } catch {}
};
