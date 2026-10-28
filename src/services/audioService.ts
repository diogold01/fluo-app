// Web Audio API synthesis for soothing focus notifications and ambient sound
class AudioService {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientSource: AudioNode | null = null;
  private isAmbientPlaying = false;

  private getContext(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  // Play peaceful meditation bowl chime on Pomodoro completion
  playChime(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      
      // Chime harmonic frequencies (E major / pentatonic peaceful bell)
      const freqs = [528, 792, 1056]; // 528 Hz is the famous serene tone
      
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const decay = 2.4 - idx * 0.4;
        const volume = 0.15 / (idx + 1);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(volume, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch (e) {
      console.warn('Audio chime could not play:', e);
    }
  }

  // Gentle soft click on timer start/pause
  playTick(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignored
    }
  }

  // Optional ambient brown noise / soft rain generator for deep focus
  toggleAmbient(enable: boolean): boolean {
    const ctx = this.getContext();
    if (!ctx) return false;

    if (!enable) {
      if (this.ambientSource) {
        try {
          (this.ambientSource as AudioBufferSourceNode).stop();
          this.ambientSource.disconnect();
        } catch {
          // ignore
        }
        this.ambientSource = null;
      }
      this.isAmbientPlaying = false;
      return false;
    }

    try {
      if (this.isAmbientPlaying) return true;

      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink/brown noise algorithm for relaxing focus
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 1.8; // boost slight volume
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Lowpass filter for smooth ambient rain sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 450;

      const gain = ctx.createGain();
      gain.gain.value = 0.035; // gentle whisper volume

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      this.ambientSource = noise;
      this.ambientGain = gain;
      this.isAmbientPlaying = true;
      return true;
    } catch (e) {
      console.warn('Ambient focus noise error:', e);
      return false;
    }
  }

  isAmbientActive(): boolean {
    return this.isAmbientPlaying;
  }
}

export const audioService = new AudioService();
