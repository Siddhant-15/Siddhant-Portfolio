import { cx } from "../lib/dom";

/** Splits text into per-character spans for GSAP reveals. Pair with an sr-only copy for screen readers. */
export default function SplitChars({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cx(className)} aria-hidden="true">
      {Array.from(text).map((c, i) => (
        <span key={i} data-char style={{ display: "inline-block", willChange: "transform" }}>
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </span>
  );
}
