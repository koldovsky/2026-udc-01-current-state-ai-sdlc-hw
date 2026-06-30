"use client";

import type { NoteDefinition } from "@/app/_lib/types";
import { usePiano } from "@/app/_lib/hooks/usePiano";
import PianoKey from "@/app/_components/PianoKey";
import OctaveControl from "@/app/_components/OctaveControl";
import TimbreControl from "@/app/_components/TimbreControl";

const WHITE_KEY_W = 52;
const BLACK_KEY_W = 34;

// White key left offsets (px): C=0, D=52, E=104, F=156, G=208, A=260, B=312
const WHITE_NOTES: (NoteDefinition & { leftPx: number })[] = [
  { name: "C", isBlack: false, index: 0,  leftPx: 0 * WHITE_KEY_W },
  { name: "D", isBlack: false, index: 2,  leftPx: 1 * WHITE_KEY_W },
  { name: "E", isBlack: false, index: 4,  leftPx: 2 * WHITE_KEY_W },
  { name: "F", isBlack: false, index: 5,  leftPx: 3 * WHITE_KEY_W },
  { name: "G", isBlack: false, index: 7,  leftPx: 4 * WHITE_KEY_W },
  { name: "A", isBlack: false, index: 9,  leftPx: 5 * WHITE_KEY_W },
  { name: "B", isBlack: false, index: 11, leftPx: 6 * WHITE_KEY_W },
];

// Black key left offsets: centered on the boundary between two adjacent white keys
// boundary = whiteKeyIndex * WHITE_KEY_W; left = boundary - BLACK_KEY_W/2
const BLACK_NOTES: (NoteDefinition & { leftPx: number })[] = [
  { name: "C#", isBlack: true, index: 1,  leftPx: 1 * WHITE_KEY_W - BLACK_KEY_W / 2 },
  { name: "D#", isBlack: true, index: 3,  leftPx: 2 * WHITE_KEY_W - BLACK_KEY_W / 2 },
  { name: "F#", isBlack: true, index: 6,  leftPx: 4 * WHITE_KEY_W - BLACK_KEY_W / 2 },
  { name: "G#", isBlack: true, index: 8,  leftPx: 5 * WHITE_KEY_W - BLACK_KEY_W / 2 },
  { name: "A#", isBlack: true, index: 10, leftPx: 6 * WHITE_KEY_W - BLACK_KEY_W / 2 },
];

const KEYBOARD_WIDTH = 7 * WHITE_KEY_W; // 364px
const KEYBOARD_HEIGHT = 180;

export default function Piano() {
  const { octave, timbre, activeKey, pressKey, releaseKey, changeOctave, changeTimbre } = usePiano();

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-2xl font-bold tracking-wide text-gray-700">Online Piano</h1>

      <div style={{ position: "relative", width: KEYBOARD_WIDTH, height: KEYBOARD_HEIGHT }}>
        {WHITE_NOTES.map((note) => (
          <PianoKey
            key={note.name}
            note={note.name}
            isBlack={false}
            isActive={activeKey === note.name}
            leftPx={note.leftPx}
            onPress={pressKey}
            onRelease={releaseKey}
          />
        ))}
        {BLACK_NOTES.map((note) => (
          <PianoKey
            key={note.name}
            note={note.name}
            isBlack={true}
            isActive={activeKey === note.name}
            leftPx={note.leftPx}
            onPress={pressKey}
            onRelease={releaseKey}
          />
        ))}
      </div>

      <OctaveControl value={octave} onChange={changeOctave} />
      <TimbreControl value={timbre} onChange={changeTimbre} />
    </div>
  );
}
