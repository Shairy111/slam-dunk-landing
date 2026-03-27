import { useCallback } from 'react';

// Global audio context singleton
let audioCtx: AudioContext | null = null;

export const useSwishSound = () => {
  const playSwish = useCallback(() => {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // White noise buffer for the "swish" net sound
      const bufferSize = audioCtx.sampleRate * 0.5; // 0.5 seconds
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = buffer;

      // Bandpass filter to make the noise sound like a net
      const bandpass = audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 1000;
      bandpass.Q.value = 1.5;

      // Highpass to remove low rumble
      const highpass = audioCtx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 2000;

      // Gain envelope for the swish
      const gainNode = audioCtx.createGain();
      const now = audioCtx.currentTime;
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.8, now + 0.05); // sharp attack
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3); // quick decay

      // Connect graph
      noiseSource.connect(bandpass);
      bandpass.connect(highpass);
      highpass.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Play
      noiseSource.start(now);
      noiseSource.stop(now + 0.3);

    } catch (e) {
      console.warn("Audio context failed:", e);
    }
  }, []);

  return playSwish;
};