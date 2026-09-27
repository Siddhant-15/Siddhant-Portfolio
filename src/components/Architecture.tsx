import { useEffect, useState } from "react";
import { useApp } from "../context";
import { useMedia } from "../hooks/useMedia";
import { cx } from "../lib/dom";
import { sound } from "../lib/sound";
import styles from "./Architecture.module.css";

/**
 * Interactive architecture diagram. Hover / focus / click a stage to trace
 * the flow through it; when idle it walks the pipeline on its own.
 */
export default function Architecture({ nodes }: { nodes: string[] }) {
  const { env } = useApp();
  const vertical = useMedia("(max-width: 720px)");
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const n = nodes.length;

  useEffect(() => { setActive(0); setTouched(false); }, [nodes]);
  useEffect(() => {
    if (touched || env.reduced) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % n), 1700);
    return () => window.clearInterval(id);
  }, [touched, env.reduced, n]);

  const W = vertical ? 320 : 1000;
  const nodeW = vertical ? 210 : 136;
  const nodeH = 44;
  const H = vertical ? 44 + n * 78 : 210;
  const pos = nodes.map((_, i) =>
    vertical
      ? { x: W / 2, y: 44 + i * 78 }
      : { x: 92 + (i * (W - 184)) / Math.max(1, n - 1), y: i % 2 === 0 ? 72 : 138 }
  );

  const edge = (i: number) => {
    const a = pos[i], b = pos[i + 1];
    if (vertical) return `M ${a.x} ${a.y + nodeH / 2} L ${b.x} ${b.y - nodeH / 2}`;
    const x1 = a.x + nodeW / 2, x2 = b.x - nodeW / 2;
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${x2} ${b.y}`;
  };

  const pick = (i: number) => { setActive(i); setTouched(true); sound.play("hover"); };
  const prev = active > 0 ? nodes[active - 1] : null;
  const next = active < n - 1 ? nodes[active + 1] : null;

  return (
    <figure className={styles.wrap}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="group" aria-label="Architecture diagram">
        {nodes.slice(0, -1).map((_, i) => {
          const on = i === active - 1 || i === active;
          return (
            <g key={i}>
              <path d={edge(i)} className={styles.edge} />
              <path d={edge(i)} className={cx(styles.flow, on && styles.flowOn, env.reduced && styles.still)} />
            </g>
          );
        })}
        {nodes.map((label, i) => (
          <g
            key={label}
            className={cx(styles.node, i === active && styles.nodeOn)}
            transform={`translate(${pos[i].x - nodeW / 2} ${pos[i].y - nodeH / 2})`}
            role="button"
            tabIndex={0}
            aria-pressed={i === active}
            aria-label={`Stage ${i + 1}: ${label}`}
            data-cursor=""
            onMouseEnter={() => pick(i)}
            onFocus={() => pick(i)}
            onClick={() => pick(i)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(i); } }}
          >
            <rect width={nodeW} height={nodeH} rx={nodeH / 2} />
            <text x={nodeW / 2} y={nodeH / 2 + 4} textAnchor="middle">{label}</text>
          </g>
        ))}
      </svg>
      <figcaption className={styles.caption} aria-live="polite">
        <strong>Stage {active + 1} of {n}: {nodes[active]}</strong>
        <span>
          {prev ? `Receives from ${prev}.` : "Entry point of the flow."}{" "}
          {next ? `Passes to ${next}.` : "Final output."}
        </span>
      </figcaption>
    </figure>
  );
}
