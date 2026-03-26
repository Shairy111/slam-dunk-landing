import { useCallback, useEffect } from 'react';

let globalAudioCtx: AudioContext | null = null;

export const useTransitionSound = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && !globalAudioCtx) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        globalAudioCtx = new AudioContext();
      }
    }
  }, []);

  const playSound = useCallback(() => {
    if (!globalAudioCtx) return;
    const ctx = globalAudioCtx;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // 1. Master Gain (Volume Control & Fade Out)
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    
    // Smooth volume envelope: start at 0, quick attack to 0.3, slow decay to 0
    const now = ctx.currentTime;
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.2, now + 0.05); // Attack
    masterGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8); // Decay
    
    // 2. Low-pass Filter to make it sound "damped", "elegant", and not harsh
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now); // Start somewhat muffled
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.6); // Muffle it further as it decays
    filter.connect(masterGain);

    // 3. Oscillator 1: The deep "whoosh" base (Sine wave sliding down)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(150, now);
    osc1.frequency.exponentialRampToValueAtTime(40, now + 0.5);
    osc1.connect(filter);

    // 4. Oscillator 2: A subtle airy "breath" on top (Triangle wave, higher pitch)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(300, now);
    osc2.frequency.exponentialRampToValueAtTime(100, now + 0.4);
    
    // Give osc2 its own gain to keep it quieter than the base
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.05, now);
    osc2Gain.connect(filter);
    osc2.connect(osc2Gain);

    // Start and stop
    osc1.start(now);
    osc2.start(now);
    
    osc1.stop(now + 0.8);
    osc2.stop(now + 0.8);

  }, []);

  return playSound;
};
