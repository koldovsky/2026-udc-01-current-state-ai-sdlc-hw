export type NoteName =
  | "C" | "C#" | "D" | "D#" | "E"
  | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B";

export type OctaveRange = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Timbre = "sine" | "square" | "sawtooth" | "triangle";

export interface NoteDefinition {
  name: NoteName;
  isBlack: boolean;
  /** index within the chromatic scale (0 = C, 11 = B) */
  index: number;
}
