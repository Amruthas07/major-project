/**
 * Water Sound Service for PregNutri AI
 * Provides a gentle, calming maternal-friendly notification sound for water intake reminders.
 * Supports Web Audio API synthesis with zero latency and fallback to local audio asset.
 * Robustly handles browser autoplay restrictions and audio context unlocking.
 */

class WaterSoundService {
  private audioCtx: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private isUnlocked = false;

  constructor() {
    // Lazy initialization on first client interaction
  }

  /**
   * Unlocks the AudioContext upon user interaction (button click, toggle, etc.)
   * This complies with strict browser autoplay policies.
   */
  public initOrUnlockAudio(): void {
    if (typeof window === 'undefined') return;

    try {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (AudioContextClass) {
        if (!this.audioCtx) {
          this.audioCtx = new AudioContextClass();
        }
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().then(() => {
            this.isUnlocked = true;
          }).catch(() => {
            // Ignored until next user gesture
          });
        } else if (this.audioCtx.state === 'running') {
          this.isUnlocked = true;
        }
      }

      // Prepare fallback audio element with local wav asset
      if (!this.audioElement) {
        this.audioElement = new Audio('/sounds/water_reminder.wav');
        this.audioElement.volume = 0.45; // Gentle volume
        this.audioElement.preload = 'auto';
      }
    } catch (e) {
      console.debug('[WaterSoundService] Unlock audio notice:', e);
    }
  }

  /**
   * Plays a single, gentle, soothing maternal water reminder chime.
   * Never loops or repeats continuously.
   * Returns true if playback started successfully, false if blocked by browser autoplay policy.
   */
  public async playWaterReminderSound(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // First ensure context is initialized
    this.initOrUnlockAudio();

    // 1. Prefer Web Audio API if running (produces an acoustic, soothing warm water bell)
    if (this.audioCtx) {
      try {
        if (this.audioCtx.state === 'suspended') {
          await this.audioCtx.resume();
        }

        if (this.audioCtx.state === 'running') {
          this.playSynthesizedGentleChime(this.audioCtx);
          return true;
        }
      } catch (err) {
        console.debug('[WaterSoundService] AudioContext resume failed, falling back to audio element:', err);
      }
    }

    // 2. Fallback to HTMLAudioElement
    if (this.audioElement) {
      try {
        this.audioElement.currentTime = 0;
        await this.audioElement.play();
        return true;
      } catch (err: unknown) {
        // Autoplay policy prevented playback without prior user interaction.
        // Gracefully handled: does NOT crash or break the visual reminder.
        const error = err as Error;
        if (error.name === 'NotAllowedError') {
          console.info('[WaterSoundService] Audio playback waiting for user interaction per browser policy.');
        } else {
          console.debug('[WaterSoundService] Audio element playback notice:', err);
        }
        return false;
      }
    }

    return false;
  }

  /**
   * Synthesizes a calming, gentle maternal dual-chime:
   * Tone 1: 587.33 Hz (D5) - soft bell
   * Tone 2: 880.00 Hz (A5) - soothing harmonic chime
   * Envelope: Smooth non-popping attack, gentle low-pass filter, exponential decay
   * Duration: ~0.55 seconds total, played once.
   */
  private playSynthesizedGentleChime(ctx: AudioContext): void {
    const now = ctx.currentTime;

    // Master gain: capped at 0.14 for gentle, non-startling bedside sound
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(0.14, now + 0.02);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    // Warm low-pass filter to remove harshness
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.Q.setValueAtTime(1.0, now);

    masterGain.connect(filter);
    filter.connect(ctx.destination);

    // Note 1: D5 (587.33 Hz)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0.75, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(masterGain);

    // Note 2: A5 (880.00 Hz) - staggered at +110ms for sweet melodic chime
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, now + 0.11);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.setValueAtTime(0.85, now + 0.11);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.54);

    osc2.connect(gain2);
    gain2.connect(masterGain);

    // Start & stop nodes cleanly
    osc1.start(now);
    osc1.stop(now + 0.38);

    osc2.start(now + 0.11);
    osc2.stop(now + 0.55);
  }

  /**
   * Helper to test sound directly on user request and unlock audio simultaneously.
   */
  public async testSound(): Promise<boolean> {
    this.initOrUnlockAudio();
    return this.playWaterReminderSound();
  }
}

export const waterSoundService = new WaterSoundService();
