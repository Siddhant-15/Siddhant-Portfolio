import type {
  CSSProperties,
  ReactNode,
} from "react";
import { cx } from "../lib/dom";
import styles from "./Runway.module.css";

type Props = {
  id: string;

  /** Scroll length (in viewport heights ×100) of the pinned stage. */
  length: number;

  index: number;

  label: string;

  className?: string;

  /**
   * Enables pointer interaction for the whole runway stage.
   *
   * Most runways remain non-interactive so they don't interfere
   * with the custom scroll system. Interactive sections such as
   * Tech Orbit can opt in.
   */
  interactive?: boolean;

  children: ReactNode;
};

/**
 * A pinned scroll "runway".
 *
 * Consecutive runways overlap by one viewport so the outgoing and
 * incoming stages can be on screen together.
 */
export default function Runway({
  id,
  length,
  index,
  label,
  className,
  interactive = false,
  children,
}: Props) {
  return (
    <section
      id={id}
      data-runway
      data-length={length}
      data-interactive={interactive || undefined}
      aria-label={label}
      className={cx(
        styles.runway,
        className
      )}
      style={
        {
          "--len": length + 100,
          zIndex: index + 1,
        } as CSSProperties
      }
    >
      <div
        data-stage
        className={cx(
          styles.stage,
          interactive && styles.interactive
        )}
      >
        {children}
      </div>
    </section>
  );
}