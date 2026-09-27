/**
 * Tiny synthesised sound system (Web Audio, no assets).
 * - disabled by default, never autoplays
 * - AudioContext is only created after a user gesture
 * - `allowed` is switched off on touch devices
 */
export type SoundKind = "hover" | "click" | "enter" | "expand" | "copy" | "open" | "close";

const KEY = "sj-portfolio-sound";
type Listener = () => void;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private whoosh: { gain: GainNode; filter: BiquadFilterNode } | null = null;
  private listeners = new Set<Listener>();
  private _enabled = false;
  allowed = true;
  motionAllowed = true;
  private lastHover = 0;

  constructor() {
    try {
      this._enabled = localStorage.getItem(KEY) === "on";
    } catch {
      this._enabled = false;
    }
  }

  get enabled() {
    return this.allowed && this._enabled;
  }

  subscribe = (l: Listener) => {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  };
  getSnapshot = () => this.enabled;

  setEnabled(v: boolean) {
    this._enabled = v;
    try {
      localStorage.setItem(KEY, v ? "on" : "off");
    } catch {
      /* storage unavailable */
    }
    if (v) {
      this.unlock();
      this.play("click");
    } else {
      this.setScrollEnergy(0);
    }
    this.listeners.forEach((l) => l());
  }

  /** Call from a real user gesture. */
  unlock() {
    if (!this.enabled) return;
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      const comp = this.ctx.createDynamicsCompressor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(comp).connect(this.ctx.destination);
      this.buildWhoosh();
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  private buildWhoosh() {
    if (!this.ctx || !this.master) return;
    const len = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 500;
    filter.Q.value = 0.7;
    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    src.connect(filter).connect(gain).connect(this.master);
    src.start();
    this.whoosh = { gain, filter };
  }

  /** 0..1 scroll-velocity energy → soft air. */
  setScrollEnergy(e: number) {
    if (!this.whoosh || !this.ctx) return;
    const on = this.enabled && this.motionAllowed;
    const v = on ? Math.min(1, e) : 0;
    const t = this.ctx.currentTime;
    this.whoosh.gain.gain.setTargetAtTime(v * 0.028, t, 0.08);
    this.whoosh.filter.frequency.setTargetAtTime(350 + v * 1400, t, 0.1);
  }

  private tone(freq: number, to: number, dur: number, gain: number, type: OscillatorType = "sine", delay = 0) {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 2400;
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.012, dur / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f).connect(g).connect(this.master);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  play(kind: SoundKind) {
    if (!this.enabled || !this.ctx) return;
    switch (kind) {
      case "hover": {
        const now = performance.now();
        if (now - this.lastHover < 90) return;
        this.lastHover = now;
        this.tone(640, 720, 0.05, 0.012);
        break;
      }
      case "click":
        this.tone(190, 120, 0.09, 0.05, "triangle");
        break;
      case "enter":
        this.tone(110, 165, 0.45, 0.035);
        break;
      case "expand":
        this.tone(220, 560, 0.5, 0.03);
        this.tone(330, 840, 0.5, 0.012, "sine", 0.03);
        break;
      case "copy":
        this.tone(880, 900, 0.06, 0.03);
        this.tone(1320, 1340, 0.09, 0.03, "sine", 0.07);
        break;
      case "open":
        this.tone(260, 520, 0.28, 0.03);
        break;
      case "close":
        this.tone(520, 240, 0.28, 0.03);
        break;
    }
  }
}

export const sound = new SoundEngine();
