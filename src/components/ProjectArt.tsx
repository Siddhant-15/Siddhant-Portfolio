import { useMemo } from "react";
import { mulberry32 } from "../three/MorphField";
import type { ArtKind } from "../types";
import styles from "./ProjectArt.module.css";

/** Deterministic generative art — one signature per project, no images. */
export default function ProjectArt({ kind, seed = 1 }: { kind: ArtKind; seed?: number }) {
  const shapes = useMemo(() => {
    const r = mulberry32(seed * 977);
    if (kind === "graph") {
      const pts = Array.from({ length: 34 }, () => ({ x: 40 + r() * 520, y: 40 + r() * 520, r: 2 + r() * 5, hot: r() > 0.86 }));
      const links: [number, number][] = [];
      pts.forEach((p, i) => {
        pts.forEach((q, j) => {
          if (j > i && (p.x - q.x) ** 2 + (p.y - q.y) ** 2 < 150 * 150 && r() > 0.35) links.push([i, j]);
        });
      });
      return { kind: "graph" as const, pts, links };
    }
    if (kind === "market") {
      const tiles = Array.from({ length: 6 * 6 }, (_, i) => ({ x: 60 + (i % 6) * 84, y: 60 + Math.floor(i / 6) * 84, s: 0.35 + r() * 0.65, hot: r() > 0.88 }));
      return { kind: "market" as const, tiles };
    }
    const lanes = Array.from({ length: 9 }, (_, i) => {
      const y0 = 70 + i * 58;
      const jitter = Array.from({ length: 3 }, () => (r() - 0.5) * 120);
      return { y0, d: `M 20 ${y0 + jitter[0]} C 170 ${y0 + jitter[1]}, 260 ${y0 + jitter[2]}, 340 ${300 + (i - 4) * 14} S 480 ${300 + (i - 4) * 14}, 580 ${300 + (i - 4) * 14}`, hot: i === 3 };
    });
    return { kind: "flow" as const, lanes };
  }, [kind, seed]);

  return (
    <svg viewBox="0 0 600 600" className={styles.art} aria-hidden="true" focusable="false">
      {shapes.kind === "graph" && (
        <>
          {shapes.links.map(([a, b], i) => (
            <line key={i} x1={shapes.pts[a].x} y1={shapes.pts[a].y} x2={shapes.pts[b].x} y2={shapes.pts[b].y} className={styles.line} />
          ))}
          {shapes.pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r} className={p.hot ? styles.hot : styles.dot} style={{ animationDelay: `${(i % 9) * 0.35}s` }} />
          ))}
        </>
      )}
      {shapes.kind === "market" && shapes.tiles.map((t, i) => (
        <rect key={i} x={t.x} y={t.y} width={64 * t.s} height={64 * t.s} rx={10 * t.s} className={t.hot ? styles.hotFill : styles.tile} style={{ animationDelay: `${(i % 12) * 0.25}s` }} />
      ))}
      {shapes.kind === "flow" && shapes.lanes.map((l, i) => (
        <path key={i} d={l.d} className={l.hot ? styles.laneHot : styles.lane} style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
    </svg>
  );
}
