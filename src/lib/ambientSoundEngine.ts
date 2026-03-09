// Procedural ambient sound generator using Web Audio API
// No external files needed — all sounds synthesized in-browser

export interface AmbientSound {
  id: string;
  label: { en: string; hi: string };
  icon: string;
}

export const ambientSounds: AmbientSound[] = [
  { id: 'rain', label: { en: 'Rain', hi: 'बारिश' }, icon: '🌧️' },
  { id: 'ocean', label: { en: 'Ocean Waves', hi: 'समुद्री लहरें' }, icon: '🌊' },
  { id: 'wind', label: { en: 'Forest Wind', hi: 'वन की हवा' }, icon: '🌿' },
  { id: 'bells', label: { en: 'Temple Bells', hi: 'मंदिर की घंटी' }, icon: '🔔' },
  { id: 'singing-bowl', label: { en: 'Singing Bowl', hi: 'सिंगिंग बाउल' }, icon: '🥣' },
  { id: 'crickets', label: { en: 'Night Crickets', hi: 'रात के झींगुर' }, icon: '🦗' },
  { id: 'fire', label: { en: 'Crackling Fire', hi: 'जलती आग' }, icon: '🔥' },
  { id: 'om', label: { en: 'Om Drone', hi: 'ॐ ध्वनि' }, icon: '🕉️' },
  { id: 'thunder', label: { en: 'Thunderstorm', hi: 'तूफान' }, icon: '⛈️' },
  { id: 'river', label: { en: 'River Stream', hi: 'नदी की धारा' }, icon: '🏞️' },
  { id: 'birds', label: { en: 'Birds at Dawn', hi: 'सुबह की चिड़ियाँ' }, icon: '🐦' },
  { id: 'flute', label: { en: 'Bamboo Flute', hi: 'बांसुरी' }, icon: '🎵' },
];

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: AudioNode[] = [];
  private activeSources: (AudioBufferSourceNode | OscillatorNode)[] = [];
  private isPlaying = false;
  private currentSound: string | null = null;
  private volume = 0.5;

  private getCtx(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private getMasterGain(): GainNode {
    this.getCtx();
    return this.masterGain!;
  }

  play(soundId: string) {
    this.stop();
    this.currentSound = soundId;
    this.isPlaying = true;

    switch (soundId) {
      case 'rain': this.createRain(); break;
      case 'ocean': this.createOcean(); break;
      case 'wind': this.createWind(); break;
      case 'bells': this.createBells(); break;
      case 'singing-bowl': this.createSingingBowl(); break;
      case 'crickets': this.createCrickets(); break;
      case 'fire': this.createFire(); break;
      case 'om': this.createOm(); break;
      case 'thunder': this.createThunder(); break;
      case 'river': this.createRiver(); break;
      case 'birds': this.createBirds(); break;
      case 'flute': this.createFlute(); break;
    }
  }

  stop() {
    this.isPlaying = false;
    this.currentSound = null;
    this.activeSources.forEach(s => { try { s.stop(); } catch {} });
    this.activeNodes.forEach(n => { try { n.disconnect(); } catch {} });
    this.activeSources = [];
    this.activeNodes = [];
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.getCtx().currentTime, 0.05);
    }
  }

  getVolume() { return this.volume; }
  getIsPlaying() { return this.isPlaying; }
  getCurrentSound() { return this.currentSound; }

  destroy() {
    this.stop();
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
    }
    this.ctx = null;
    this.masterGain = null;
  }

  // --- Sound generators ---

  private createNoiseBuffer(seconds: number): AudioBuffer {
    const ctx = this.getCtx();
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private loopNoise(filter: BiquadFilterType, freq: number, q: number, gain: number) {
    const ctx = this.getCtx();
    const buffer = this.createNoiseBuffer(2);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const bqFilter = ctx.createBiquadFilter();
    bqFilter.type = filter;
    bqFilter.frequency.value = freq;
    bqFilter.Q.value = q;

    const gainNode = ctx.createGain();
    gainNode.gain.value = gain;

    source.connect(bqFilter);
    bqFilter.connect(gainNode);
    gainNode.connect(this.getMasterGain());
    source.start();

    this.activeSources.push(source);
    this.activeNodes.push(bqFilter, gainNode);
    return { source, filter: bqFilter, gain: gainNode };
  }

  private createRain() {
    // Layered filtered noise for realistic rain
    this.loopNoise('bandpass', 8000, 0.5, 0.3);
    this.loopNoise('highpass', 4000, 0.8, 0.15);
    this.loopNoise('bandpass', 2000, 1.5, 0.1);
  }

  private createOcean() {
    const ctx = this.getCtx();
    // Base noise
    const { gain: baseGain } = this.loopNoise('lowpass', 400, 0.7, 0.25);
    // Modulate volume for wave effect
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.08; // slow waves
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.15;
    lfo.connect(lfoGain);
    lfoGain.connect(baseGain.gain);
    lfo.start();
    this.activeSources.push(lfo);
    this.activeNodes.push(lfoGain);

    // High frequency splash
    this.loopNoise('bandpass', 3000, 2, 0.08);
  }

  private createWind() {
    const ctx = this.getCtx();
    const { filter } = this.loopNoise('bandpass', 500, 2, 0.2);
    // Slowly modulate filter frequency for wind variation
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.activeSources.push(lfo);
    this.activeNodes.push(lfoGain);

    this.loopNoise('highpass', 2000, 1, 0.05);
  }

  private createBells() {
    const ctx = this.getCtx();
    const ringBell = () => {
      if (!this.isPlaying || this.currentSound !== 'bells') return;
      const baseFreq = 600 + Math.random() * 400;
      // Bell is sum of decaying sine tones
      [1, 2.0, 3.0, 4.2].forEach(ratio => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = baseFreq * ratio;
        const env = ctx.createGain();
        env.gain.setValueAtTime(0.12 / ratio, ctx.currentTime);
        env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);
        osc.connect(env);
        env.connect(this.getMasterGain());
        osc.start();
        osc.stop(ctx.currentTime + 3);
        this.activeNodes.push(env);
      });
      setTimeout(ringBell, 2500 + Math.random() * 3000);
    };
    ringBell();
  }

  private createSingingBowl() {
    const ctx = this.getCtx();
    const strike = () => {
      if (!this.isPlaying || this.currentSound !== 'singing-bowl') return;
      const base = 220 + Math.random() * 60;
      [1, 2.71, 5.04].forEach(ratio => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = base * ratio;
        // Slight vibrato
        const vibrato = ctx.createOscillator();
        vibrato.frequency.value = 4 + Math.random() * 2;
        const vibGain = ctx.createGain();
        vibGain.gain.value = ratio * 1.5;
        vibrato.connect(vibGain);
        vibGain.connect(osc.frequency);
        vibrato.start();

        const env = ctx.createGain();
        env.gain.setValueAtTime(0.15 / ratio, ctx.currentTime);
        env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 6);
        osc.connect(env);
        env.connect(this.getMasterGain());
        osc.start();
        osc.stop(ctx.currentTime + 6);
        vibrato.stop(ctx.currentTime + 6);
        this.activeNodes.push(env, vibGain);
      });
      setTimeout(strike, 5000 + Math.random() * 3000);
    };
    strike();
  }

  private createCrickets() {
    const ctx = this.getCtx();
    // Base ambient noise (very soft)
    this.loopNoise('bandpass', 6000, 3, 0.03);

    const chirp = () => {
      if (!this.isPlaying || this.currentSound !== 'crickets') return;
      const freq = 4000 + Math.random() * 2000;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      // Rapid amplitude modulation for chirp sound
      const am = ctx.createOscillator();
      am.frequency.value = 40 + Math.random() * 20;
      const amGain = ctx.createGain();
      amGain.gain.value = 0.5;
      am.connect(amGain);

      const env = ctx.createGain();
      env.gain.value = 0;
      env.gain.setValueAtTime(0, ctx.currentTime);
      env.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      env.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      amGain.connect(env.gain);

      osc.connect(env);
      env.connect(this.getMasterGain());
      osc.start();
      am.start();
      osc.stop(ctx.currentTime + 0.35);
      am.stop(ctx.currentTime + 0.35);
      this.activeNodes.push(env, amGain);

      // Random timing between chirps
      setTimeout(chirp, 200 + Math.random() * 1500);
    };
    chirp();
    // Second cricket at different timing
    setTimeout(() => chirp(), 500);
  }

  private createFire() {
    // Crackling fire: filtered noise + random pops
    this.loopNoise('bandpass', 1000, 0.5, 0.12);
    this.loopNoise('lowpass', 200, 1, 0.1);

    const ctx = this.getCtx();
    const crackle = () => {
      if (!this.isPlaying || this.currentSound !== 'fire') return;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = 0.15 + Math.random() * 0.1;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 2000;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.getMasterGain());
      source.start();
      this.activeNodes.push(gain, filter);
      setTimeout(crackle, 50 + Math.random() * 300);
    };
    crackle();
  }

  private createOm() {
    const ctx = this.getCtx();
    // Deep droning Om with harmonics
    const baseFreq = 136.1; // Om frequency
    [1, 2, 3, 4].forEach(harmonic => {
      const osc = ctx.createOscillator();
      osc.type = harmonic === 1 ? 'sawtooth' : 'sine';
      osc.frequency.value = baseFreq * harmonic;
      // Slow vibrato
      const vibrato = ctx.createOscillator();
      vibrato.frequency.value = 0.3 + Math.random() * 0.3;
      const vibGain = ctx.createGain();
      vibGain.gain.value = harmonic * 0.5;
      vibrato.connect(vibGain);
      vibGain.connect(osc.frequency);
      vibrato.start();

      const gain = ctx.createGain();
      gain.gain.value = 0.12 / harmonic;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.getMasterGain());
      osc.start();
      this.activeSources.push(osc, vibrato);
      this.activeNodes.push(gain, vibGain, filter);
    });
  }

  private createThunder() {
    // Thunder: low rumbles + rain
    this.createRain();
    const ctx = this.getCtx();
    const rumble = () => {
      if (!this.isPlaying || this.currentSound !== 'thunder') return;
      const buffer = this.createNoiseBuffer(2);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 150;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, ctx.currentTime);
      env.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.3);
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      source.connect(filter);
      filter.connect(env);
      env.connect(this.getMasterGain());
      source.start();
      source.stop(ctx.currentTime + 2.5);
      this.activeNodes.push(filter, env);
      setTimeout(rumble, 5000 + Math.random() * 15000);
    };
    setTimeout(rumble, 2000);
  }

  private createRiver() {
    // Flowing water sound
    this.loopNoise('bandpass', 400, 1.5, 0.15);
    this.loopNoise('bandpass', 1500, 2, 0.08);
    const ctx = this.getCtx();
    const { filter } = this.loopNoise('bandpass', 800, 1, 0.12);
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.2;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.activeSources.push(lfo);
    this.activeNodes.push(lfoGain);
  }

  private createBirds() {
    const ctx = this.getCtx();
    // Soft ambient background
    this.loopNoise('bandpass', 3000, 4, 0.02);

    const chirp = () => {
      if (!this.isPlaying || this.currentSound !== 'birds') return;
      const baseFreq = 2000 + Math.random() * 2000;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      // Frequency modulation for birdsong
      const freqLfo = ctx.createOscillator();
      freqLfo.frequency.value = 10 + Math.random() * 20;
      const freqGain = ctx.createGain();
      freqGain.gain.value = 200;
      freqLfo.connect(freqGain);
      freqGain.connect(osc.frequency);
      osc.frequency.value = baseFreq;

      const env = ctx.createGain();
      env.gain.setValueAtTime(0, ctx.currentTime);
      env.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.05);
      env.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);

      osc.connect(env);
      env.connect(this.getMasterGain());
      osc.start();
      freqLfo.start();
      osc.stop(ctx.currentTime + 0.25);
      freqLfo.stop(ctx.currentTime + 0.25);
      this.activeNodes.push(env, freqGain);

      setTimeout(chirp, 300 + Math.random() * 2000);
    };
    chirp();
    setTimeout(() => chirp(), 800);
    setTimeout(() => chirp(), 1500);
  }

  private createFlute() {
    const ctx = this.getCtx();
    // Pentatonic scale notes for Indian flute feel
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C4 pentatonic
    let noteIndex = 0;

    const playNote = () => {
      if (!this.isPlaying || this.currentSound !== 'flute') return;
      const freq = notes[noteIndex % notes.length];
      noteIndex++;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      // Vibrato
      const vibrato = ctx.createOscillator();
      vibrato.frequency.value = 5;
      const vibGain = ctx.createGain();
      vibGain.gain.value = 3;
      vibrato.connect(vibGain);
      vibGain.connect(osc.frequency);
      vibrato.start();

      // Breath noise
      const noise = ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(2);
      noise.loop = true;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = freq * 2;
      noiseFilter.Q.value = 5;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.015;
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0, ctx.currentTime);
      env.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.2);
      env.gain.setValueAtTime(0.1, ctx.currentTime + 1.5);
      env.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);

      osc.connect(env);
      noiseGain.connect(env);
      env.connect(this.getMasterGain());
      osc.start();
      noise.start();
      osc.stop(ctx.currentTime + 2.1);
      noise.stop(ctx.currentTime + 2.1);
      vibrato.stop(ctx.currentTime + 2.1);
      this.activeNodes.push(env, vibGain, noiseFilter, noiseGain);

      setTimeout(playNote, 2000 + Math.random() * 2000);
    };
    playNote();
  }
}

// Singleton
let engineInstance: AmbientSoundEngine | null = null;

export const getAmbientEngine = (): AmbientSoundEngine => {
  if (!engineInstance) {
    engineInstance = new AmbientSoundEngine();
  }
  return engineInstance;
};
