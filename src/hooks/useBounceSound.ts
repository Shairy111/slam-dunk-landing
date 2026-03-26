import { useCallback, useRef, useEffect } from 'react';

// Initialize a single global AudioContext so it doesn't get destroyed and recreated on re-renders,
// which causes the intermittent sound bug.
let globalAudioCtx: AudioContext | null = null;

export const useBounceSound = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && !globalAudioCtx) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        globalAudioCtx = new AudioContext();
      }
    }
  }, []);

  // Intensity ranges from 0.0 (tiny tap) to 1.0 (huge slam)
  const playBounce = useCallback((intensity: number = 1.0) => {
    if (!globalAudioCtx) return;
    const ctx = globalAudioCtx;
    
    // Resume context if suspended (browsers suspend it if no user interaction has occurred yet)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    
    // Master Gain for the overall impact volume
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    
    // Very fast attack, quick decay (it's an impact sound)
    const maxVol = 0.5 * intensity;
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(maxVol, now + 0.01);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    // Filter to muffle it so it sounds like rubber hitting hardwood, not a digital beep
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.2);
    filter.connect(masterGain);

    // The "Thud" (Low Sine Wave)
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    // Pitch drops very fast to simulate the thud
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
    osc.connect(filter);

    // The "Slap" (Noise burst for the rubber texture hitting the floor)
    const bufferSize = ctx.sampleRate * 0.1; // 0.1 seconds of noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1; // White noise
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Noise needs its own tight filter and volume so it doesn't overpower the thud
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1000;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3 * intensity, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    // Start everything
    osc.start(now);
    noise.start(now);
    
    osc.stop(now + 0.3);

  }, []);

  return playBounce;
};
