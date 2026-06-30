"use client";

import type { NoteName } from "@/app/_lib/types";
import styles from "./PianoKey.module.css";

interface Props {
  note: NoteName;
  isBlack: boolean;
  isActive: boolean;
  leftPx: number;
  onPress: (note: NoteName) => void;
  onRelease: () => void;
}

export default function PianoKey({ note, isBlack, isActive, leftPx, onPress, onRelease }: Props) {
  return (
    <button
      type="button"
      aria-label={note}
      className={[
        styles.key,
        isBlack ? styles.black : styles.white,
        isActive ? styles.active : "",
      ].join(" ")}
      style={{ left: leftPx }}
      onMouseDown={() => onPress(note)}
      onMouseUp={onRelease}
      onMouseLeave={onRelease}
      onTouchStart={(e) => { e.preventDefault(); onPress(note); }}
      onTouchEnd={onRelease}
    >
      <span className={styles.label}>{note}</span>
    </button>
  );
}
