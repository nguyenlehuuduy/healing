/**
 * Procedural Audio Engine using the HTML5 Web Audio API.
 * Synthesizes vinyl crackles, rainfall, lofi jazz-hop piano chords, and cat purring entirely in code.
 * Restricts external loading risks and plays instantly with zero static file assets.
 */

class AudioEngineClass {
  private ctx: AudioContext | null = null;

  // Sound nodes
  private rainGain: GainNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;

  private crackleGain: GainNode | null = null;
  private crackleSource: AudioBufferSourceNode | null = null;
  private crackleInterval: any = null;

  private purrGain: GainNode | null = null;
  private purrCarrier: OscillatorNode | null = null;
  private purrModulator: OscillatorNode | null = null;

  // Chords synth states
  private synthGain: GainNode | null = null;
  private activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private currentChordIndex = 0;
  private synthTimeout: any = null;
  private isMusicPlaying = false;

  // Chord Progression Definitions
  // We represent notes with frequencies
  private progressions = [
    // Am9 -> Dm9 -> G13 -> Cmaj9 (Lofi Jazz Standard)
    [
      [110.00, 261.63, 329.63, 392.00, 493.88], // A2, C4, E4, G4, B4
      [146.83, 349.23, 440.00, 523.25, 659.25], // D3, F4, A4, C5, E5
      [98.00, 349.23, 493.88, 659.25, 587.33],  // G2, F4, B4, E5, D5
      [130.81, 329.63, 392.00, 493.88, 587.33]   // C3, E4, G4, B4, D5
    ],
    // Fmaj9 -> Bb9 -> Ebmaj9 -> Abmaj7 (Sunset Vibe)
    [
      [87.31, 349.23, 440.00, 523.25, 698.46],  // F2, F4, A4, C5, F5
      [116.54, 311.13, 466.16, 587.33, 698.46], // Bb2, Eb4, Bb4, D5, F5
      [155.56, 311.13, 392.00, 466.16, 587.33], // Eb3, Eb4, G4, Bb4, D5
      [103.83, 311.13, 415.30, 523.25, 622.25]  // Ab2, Eb4, Ab4, C5, Eb5
    ],
    // C#maj9 -> F#7 -> G#maj9 -> Fm7 (Nostalgic Room)
    [
      [138.59, 277.18, 349.23, 415.30, 523.25], // C#3, C#4, F4, G#4, C5
      [92.50, 277.18, 349.23, 440.00, 554.37],  // F#2, C#4, F4, A4, C#5
      [103.83, 311.13, 415.30, 466.16, 622.25], // G#2, Eb4, G#4, Bb4, Eb5
      [87.31, 349.23, 392.00, 523.25, 698.46]   // F2, F4, G4, C5, F5
    ]
  ];

  private currentProgressionIndex = 0;

  constructor() {
    // Lazy initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  /**
   * Generates a 2-second pink-like noise buffer for rain sounds
   */
  private createRainBuffer(): AudioBuffer {
    const sampleRate = this.ctx!.sampleRate;
    const bufferSize = sampleRate * 2;
    const buffer = this.ctx!.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // Dynamic fractal filter noise generator to simulate raindrops hit pattern
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11; // rescale to safe level
      b6 = white * 0.115926;
    }
    return buffer;
  }

  /**
   * Generates white noise with highpass for vinyl texture cracklings
   */
  private createCrackleBuffer(): AudioBuffer {
    const sampleRate = this.ctx!.sampleRate;
    const bufferSize = sampleRate * 3;
    const buffer = this.ctx!.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.04;
    }
    return buffer;
  }

  /**
   * Starts synthesized rain sound in the background
   */
  public startRain() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (this.rainSource) return;

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0, this.ctx.currentTime);
      // Soft ambient lowPass so the rain feels deep and outside the window
      const lowPass = this.ctx.createBiquadFilter();
      lowPass.type = "lowpass";
      lowPass.frequency.setValueAtTime(450, this.ctx.currentTime);

      const buffer = this.createRainBuffer();
      this.rainSource = this.ctx.createBufferSource();
      this.rainSource.buffer = buffer;
      this.rainSource.loop = true;

      this.rainSource.connect(lowPass);
      lowPass.connect(this.rainGain);
      this.rainGain.connect(this.ctx.destination);

      this.rainSource.start();
      // Smooth fade in
      this.rainGain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 1.5);
    } catch (e) {
      console.error("Rain synth failed to start", e);
    }
  }

  /**
   * Fades out and kills rain sound
   */
  public stopRain() {
    if (!this.rainGain || !this.rainSource) return;
    const currentGain = this.rainGain;
    const currentSource = this.rainSource;

    this.rainGain = null;
    this.rainSource = null;

    try {
      currentGain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 1.0);
      setTimeout(() => {
        try {
          currentSource.stop();
          currentSource.disconnect();
        } catch (_) {}
      }, 1100);
    } catch (_) {}
  }

  /**
   * Starts Vinyl Player background pops & constant turntable cracklings
   */
  private startVinylCrackle() {
    try {
      if (!this.ctx) return;
      if (this.crackleSource) return;

      this.crackleGain = this.ctx.createGain();
      this.crackleGain.gain.setValueAtTime(0, this.ctx.currentTime);

      const highPass = this.ctx.createBiquadFilter();
      highPass.type = "highpass";
      highPass.frequency.setValueAtTime(1800, this.ctx.currentTime);

      const buffer = this.createCrackleBuffer();
      this.crackleSource = this.ctx.createBufferSource();
      this.crackleSource.buffer = buffer;
      this.crackleSource.loop = true;

      this.crackleSource.connect(highPass);
      highPass.connect(this.crackleGain);
      this.crackleGain.connect(this.ctx.destination);

      this.crackleSource.start();
      this.crackleGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 1.0);

      // Periodic crackle pops/scratches randomly
      this.crackleInterval = setInterval(() => {
        try {
          if (!this.ctx || this.ctx.state === "suspended") return;
          const popGain = this.ctx.createGain();
          const popFilter = this.ctx.createBiquadFilter();
          
          popFilter.type = "bandpass";
          popFilter.frequency.setValueAtTime(300 + Math.random() * 800, this.ctx.currentTime);
          popFilter.Q.setValueAtTime(8, this.ctx.currentTime);

          const snapOsc = this.ctx.createOscillator();
          snapOsc.type = "triangle";
          snapOsc.frequency.setValueAtTime(40 + Math.random() * 60, this.ctx.currentTime);

          popGain.gain.setValueAtTime(0, this.ctx.currentTime);
          popGain.gain.setValueAtTime(0.04 * (Math.random() * 0.8 + 0.2), this.ctx.currentTime);
          popGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

          snapOsc.connect(popFilter);
          popFilter.connect(popGain);
          popGain.connect(this.ctx.destination);

          snapOsc.start();
          snapOsc.stop(this.ctx.currentTime + 0.1);
        } catch (_) {}
      }, 420);
    } catch (e) {
      console.error("Crackle failed to start", e);
    }
  }

  private stopVinylCrackle() {
    if (this.crackleInterval) {
      clearInterval(this.crackleInterval);
      this.crackleInterval = null;
    }
    if (!this.crackleGain || !this.crackleSource) return;
    const currentGain = this.crackleGain;
    const currentSrc = this.crackleSource;

    this.crackleGain = null;
    this.crackleSource = null;

    try {
      currentGain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 0.8);
      setTimeout(() => {
        try {
          currentSrc.stop();
          currentSrc.disconnect();
        } catch (_) {}
      }, 900);
    } catch (_) {}
  }

  /**
   * Web Audio dynamic piano chord synthesizer playing lofi progression
   */
  private playNextLofiChord() {
    if (!this.isMusicPlaying || !this.ctx) return;

    const progression = this.progressions[this.currentProgressionIndex];
    const frequencies = progression[this.currentChordIndex];

    const now = this.ctx.currentTime;
    const duration = 5.0; // Play each chord for 5 seconds

    // Initialize individual synth gain
    if (!this.synthGain) {
      this.synthGain = this.ctx.createGain();
      this.synthGain.gain.setValueAtTime(0.08, now);
      this.synthGain.connect(this.ctx.destination);
    }

    // For each note, synthesize a rich electric piano key with detuning drift
    frequencies.forEach((freq) => {
      try {
        const osc1 = this.ctx!.createOscillator();
        const osc2 = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();

        // High quality warm triangle, paired with gentle detuned saw wave filtered out
        osc1.type = "triangle";
        osc1.frequency.setValueAtTime(freq, now);

        osc2.type = "triangle";
        // Analog drift: slight detuning
        osc2.frequency.setValueAtTime(freq * 1.002 + (Math.random() - 0.5) * 0.1, now);

        // Subtly highpass the keys to keep it crackly and retro
        const hp = this.ctx!.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.setValueAtTime(100, now);

        // Lowpass to make it super cozy and retro
        const lp = this.ctx!.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.setValueAtTime(1200, now);

        // Envelope: smooth lofi attack swell and long ring release
        noteGain.gain.setValueAtTime(0, now);
        // Slightly offset note start positions for organic human-like rolling chord strike (arpeggiated vibe)
        const offset = Math.random() * 0.12;
        noteGain.gain.linearRampToValueAtTime(0.05, now + 0.4 + offset);
        // Slowly decay
        noteGain.gain.setValueAtTime(0.05, now + duration - 1.5);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc1.connect(hp);
        osc2.connect(hp);
        hp.connect(lp);
        lp.connect(noteGain);
        noteGain.connect(this.synthGain!);

        osc1.start(now);
        osc2.start(now);

        osc1.stop(now + duration + 0.2);
        osc2.stop(now + duration + 0.2);

        this.activeOscillators.push({ osc: osc1, gain: noteGain });
        this.activeOscillators.push({ osc: osc2, gain: noteGain });
      } catch (e) {
        console.error("Failed to synth note", e);
      }
    });

    // Advance index
    this.currentChordIndex = (this.currentChordIndex + 1) % progression.length;

    // Schedule next chord slightly before this ends to crossfade seamlessly
    this.synthTimeout = setTimeout(() => {
      this.playNextLofiChord();
    }, 4500);
  }

  /**
   * Starts the record player sound loop
   */
  public startLofiMusic(progressionIndex: number = 0) {
    this.initCtx();
    if (!this.ctx) return;

    this.stopLofiMusic();

    this.isMusicPlaying = true;
    this.currentProgressionIndex = progressionIndex % this.progressions.length;
    this.currentChordIndex = 0;

    // Start background needle turntable noise
    this.startVinylCrackle();

    // Begin looping lofi keys
    this.playNextLofiChord();
  }

  /**
   * Stops the lofi music synthesizer and disc turntable noise
   */
  public stopLofiMusic() {
    this.isMusicPlaying = false;
    this.stopVinylCrackle();

    if (this.synthTimeout) {
      clearTimeout(this.synthTimeout);
      this.synthTimeout = null;
    }

    // Stop and clear all vibrating strings
    const now = this.ctx ? this.ctx.currentTime : 0;
    this.activeOscillators.forEach(({ osc, gain }) => {
      try {
        if (this.ctx) {
          gain.gain.cancelScheduledValues(now);
          gain.gain.linearRampToValueAtTime(0, now + 0.4);
        }
        setTimeout(() => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (_) {}
        }, 500);
      } catch (_) {}
    });
    this.activeOscillators = [];
  }

  /**
   * Kitty Cat Sleep Purring soundscape helper
   * Low frequency hum modulating 30Hz with breathing gain wave
   */
  public startPurr() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.purrCarrier) return;

      this.purrGain = this.ctx.createGain();
      this.purrGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.purrCarrier = this.ctx.createOscillator();
      this.purrCarrier.type = "sine";
      this.purrCarrier.frequency.setValueAtTime(85, this.ctx.currentTime); // low cat hum

      this.purrModulator = this.ctx.createOscillator();
      this.purrModulator.type = "sine";
      this.purrModulator.frequency.setValueAtTime(30, this.ctx.currentTime); // low vibrations

      const modulatorGain = this.ctx.createGain();
      modulatorGain.gain.setValueAtTime(25, this.ctx.currentTime);

      // Lowpass so it is purely a thick cozy base purr
      const lp = this.ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(140, this.ctx.currentTime);

      // Periodic purring lung breathing modulation (LFO for volume)
      const breathLFO = this.ctx.createOscillator();
      breathLFO.type = "sine";
      breathLFO.frequency.setValueAtTime(1.5, this.ctx.currentTime); // breaths 1.5 times per sec

      const breathGain = this.ctx.createGain();
      breathGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

      // Connect trees
      this.purrModulator.connect(modulatorGain);
      modulatorGain.connect(this.purrCarrier.frequency); // frequency modulation

      breathLFO.connect(breathGain);
      
      this.purrCarrier.connect(lp);
      lp.connect(this.purrGain);
      this.purrGain.connect(this.ctx.destination);

      // Start
      this.purrCarrier.start();
      this.purrModulator.start();
      breathLFO.start();

      // Fade in purr
      this.purrGain.gain.linearRampToValueAtTime(0.45, this.ctx.currentTime + 0.5);
    } catch (e) {
      console.error("Purr failed", e);
    }
  }

  public stopPurr() {
    if (!this.purrGain || !this.purrCarrier) return;
    const currentGain = this.purrGain;
    const currentOsc1 = this.purrCarrier;
    const currentOsc2 = this.purrModulator;

    this.purrGain = null;
    this.purrCarrier = null;
    this.purrModulator = null;

    try {
      currentGain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 0.4);
      setTimeout(() => {
        try {
          currentOsc1.stop();
          currentOsc1.disconnect();
          if (currentOsc2) {
            currentOsc2.stop();
            currentOsc2.disconnect();
          }
        } catch (_) {}
      }, 500);
    } catch (_) {}
  }
}

export const AudioEngine = new AudioEngineClass();
export default AudioEngine;
