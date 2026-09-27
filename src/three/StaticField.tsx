import { useMemo } from "react";
import { mulberry32 } from "./MorphField";

/** Calm static constellation used when WebGL is unavailable or motion is reduced. */
export default function StaticField() {
  const { dots, lines } = useMemo(() => {
    const r = mulberry32(99);
    const dots = Array.from({ length: 110 }, () => ({ x: r() * 1600, y: r() * 900, r: 0.6 + r() * 1.6, o: 0.15 + r() * 0.5 }));
    const lines: { a: number; b: number }[] = [];
    dots.forEach((d, i) => {
      let best = -1;
      let bd = 1e9;
      dots.forEach((e, j) => {
        if (i === j) return;
        const dd = (d.x - e.x) ** 2 + (d.y - e.y) ** 2;
        if (dd < bd) { bd = dd; best = j; }
      });
      if (best > i && bd < 200 * 200) lines.push({ a: i, b: best });
    });
    return { dots, lines };
  }, []);

  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="sf-glow" cx="62%" cy="40%" r="60%">
          <stop offset="0" stopColor="#ff9f1c" stopOpacity="0.10" />
          <stop offset="1" stopColor="#ff9f1c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#sf-glow)" />
      {lines.map((l, i) => (
        <line key={i} x1={dots[l.a].x} y1={dots[l.a].y} x2={dots[l.b].x} y2={dots[l.b].y} stroke="#eeeae2" strokeOpacity="0.07" />
      ))}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#eeeae2" fillOpacity={d.o} />
      ))}
    </svg>
  );
}
