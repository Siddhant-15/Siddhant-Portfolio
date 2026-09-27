import { useSyncExternalStore } from "react";
import { sound } from "../lib/sound";
import styles from "./Navigation.module.css";

export default function SoundToggle() {
  const on = useSyncExternalStore(sound.subscribe, sound.getSnapshot);
  return (
    <button
      type="button"
      className={styles.sound}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      data-magnetic
      onClick={() => sound.setEnabled(!on)}
    >
      {on ? "SOUND ON" : "SOUND ●"}
    </button>
  );
}
