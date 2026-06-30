import type { OctaveRange, NoteName, Timbre } from "@/app/_lib/types";

const NOTE_INDICES: Record<NoteName, number> = {
  C: 0, "C#": 1, D: 2, "D#": 3, E: 4,
  F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11,
};

let ctx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function noteFrequency(note: NoteName, octave: OctaveRange): number {
  const midiNote = 12 * (octave + 1) + NOTE_INDICES[note];
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

export function playNote(note: NoteName, octave: OctaveRange, timbre: Timbre = "triangle"): () => void {
  const context = getContext();
  if (context.state === "suspended") void context.resume();

  const osc = context.createOscillator();
  const gain = context.createGain();

  osc.type = timbre;
  osc.frequency.value = noteFrequency(note, octave);

  gain.gain.setValueAtTime(0, context.currentTime);
  gain.gain.linearRampToValueAtTime(0.4, context.currentTime + 0.005);

  osc.connect(gain);
  gain.connect(context.destination);
  osc.start();

  return () => {
    const now = context.currentTime;
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.15);
    osc.stop(now + 0.15);
  };
}
