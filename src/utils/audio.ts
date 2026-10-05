/**
 * Sound synthesis engine using Web Audio API for TIMI
 * Provides delightful pastel notification chimes, alarm melodies, and lofi ambient sounds.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Sweet pastel bell chime (Task notification, flashcard alert)
export function playChime(preset: 'sweet' | 'bell' | 'marimba' | 'birds' = 'sweet') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (preset === 'sweet') {
      // Gentle celesta chime C6 - E6 - G6 - C7
      const notes = [1046.5, 1318.5, 1567.98, 2093.0];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0.001, now + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.18, now + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.55);
      });
    } else if (preset === 'bell') {
      // Glass bell ping
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now); // A5

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    } else if (preset === 'marimba') {
      // Warm marimba pop
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.06);

        gain.gain.setValueAtTime(0.2, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.3);
      });
    } else {
      // Birds chirp
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    }
  } catch {
    // AudioContext autoplay restriction safeguard
  }
}

// 2. Success sparkle fanfare (Task completed, level up)
export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const melody = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    melody.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.01, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.45);
    });
  } catch {
    // ignore
  }
}

// 3. Cute student alarm sound
let activeAlarmOscillators: { stop: () => void } | null = null;

export function playAlarmMelody(repeatCount = 3) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopAlarmMelody();

    const now = ctx.currentTime;
    const pattern = [587.33, 659.25, 783.99, 880, 783.99, 659.25]; // D5, E5, G5, A5, G5, E5
    const step = 0.18;
    const durationPerCycle = pattern.length * step + 0.4;

    for (let cycle = 0; cycle < repeatCount; cycle++) {
      const cycleStart = now + cycle * durationPerCycle;
      pattern.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, cycleStart + i * step);

        gain.gain.setValueAtTime(0.001, cycleStart + i * step);
        gain.gain.exponentialRampToValueAtTime(0.22, cycleStart + i * step + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, cycleStart + i * step + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(cycleStart + i * step);
        osc.stop(cycleStart + i * step + 0.18);
      });
    }

    activeAlarmOscillators = {
      stop: () => {
        // silence handled automatically by node lifecycles
      }
    };
  } catch {
    // ignore
  }
}

export function stopAlarmMelody() {
  if (activeAlarmOscillators) {
    activeAlarmOscillators.stop();
    activeAlarmOscillators = null;
  }
}

// 4. Pomodoro focus ambient generator (Gentle rain simulation)
let rainSource: AudioBufferSourceNode | null = null;
let rainGain: GainNode | null = null;

export function toggleAmbientRain(play: boolean, volume = 0.15) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (!play) {
      if (rainSource) {
        try { rainSource.stop(); } catch {}
        rainSource.disconnect();
        rainSource = null;
      }
      return;
    }

    if (rainSource) return; // already playing

    // Generate 3 seconds of white noise and loop with soft lowpass filter to mimic soothing rain
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    // Filter to warm rain frequency
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(volume, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(ctx.destination);

    whiteNoise.start();
    rainSource = whiteNoise;
  } catch {
    // ignore
  }
}

// 5. Cute pet interaction sound (Mimi purr/meow squeak)
export function playPetCuteSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // quick pitch bend like a cute meow/squeak
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(1150, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.22);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  } catch {
    // ignore
  }
}
