"use client";

import { useState, useCallback, useRef } from "react";
import type { NoteName, OctaveRange, Timbre } from "@/app/_lib/types";
import { playNote } from "@/app/_lib/audio";

export function usePiano() {
  const [octave, setOctave] = useState<OctaveRange>(4);
  const [timbre, setTimbre] = useState<Timbre>("triangle");
  const [activeKey, setActiveKey] = useState<NoteName | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  const pressKey = useCallback(
    (note: NoteName) => {
      stopRef.current?.();
      const stop = playNote(note, octave, timbre);
      stopRef.current = stop;
      setActiveKey(note);
    },
    [octave, timbre],
  );

  const releaseKey = useCallback(() => {
    stopRef.current?.();
    stopRef.current = null;
    setActiveKey(null);
  }, []);

  const changeOctave = useCallback((next: OctaveRange) => {
    setOctave(next);
  }, []);

  const changeTimbre = useCallback((next: Timbre) => {
    setTimbre(next);
  }, []);

  return { octave, timbre, activeKey, pressKey, releaseKey, changeOctave, changeTimbre };
}
