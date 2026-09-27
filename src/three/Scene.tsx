import { Component, useEffect, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { PARTICLES, type Tier } from "../lib/device";
import { ready } from "../lib/ready";
import { intelligenceWords } from "../data/principles";
import MorphField from "./MorphField";
import IntelligenceField from "./IntelligenceField";
import { sampleWords } from "./sampleText";
import styles from "./Scene.module.css";

class Boundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

type Props = { tier: Tier; onFailed: () => void };

export default function Scene({ tier, onFailed }: Props) {
  const [visible, setVisible] = useState(true);
  const [quality, setQuality] = useState(1);
  const [words, setWords] = useState<Float32Array[] | null>(null);
  const count = PARTICLES[tier];
  const intelCount = Math.round(count * 0.8);

  useEffect(() => {
    const h = () => setVisible(!document.hidden); // pause all GPU work in background tabs
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, []);

  useEffect(() => {
    let alive = true;
    sampleWords(intelligenceWords.map((w) => w.word), intelCount)
      .then((d) => { if (alive) setWords(d); })
      .catch(() => undefined)
      .finally(() => ready.done("words"));
    return () => { alive = false; };
  }, [intelCount]);

  return (
    <div className={styles.scene} aria-hidden="true">
      <Boundary onError={onFailed}>
        <Canvas
          dpr={[1, tier === "desktop" ? 2 : 1.5]}
          frameloop={visible ? "always" : "never"}
          camera={{ position: [0, 0, 12], fov: 50, near: 0.1, far: 80 }}
          gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); onFailed(); });
          }}
        >
          <PerformanceMonitor onDecline={() => setQuality((q) => Math.max(0.4, q - 0.2))} />
          <MorphField count={count} quality={quality} onFirstFrame={() => ready.done("scene")} />
          <IntelligenceField data={words} count={intelCount} quality={quality} />
        </Canvas>
      </Boundary>
    </div>
  );
}
