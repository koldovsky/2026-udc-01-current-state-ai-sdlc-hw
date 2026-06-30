"use client";

import type { OctaveRange } from "@/app/_lib/types";

const OCTAVES: OctaveRange[] = [1, 2, 3, 4, 5, 6, 7];

interface Props {
  value: OctaveRange;
  onChange: (octave: OctaveRange) => void;
}

export default function OctaveControl({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-gray-500 mr-1">Octave</span>
      {OCTAVES.map((oct) => {
        const selected = oct === value;
        return (
          <label
            key={oct}
            className={[
              "flex items-center justify-center w-9 h-9 rounded-full border-2 cursor-pointer text-sm font-bold transition-colors",
              selected
                ? "border-red-600 text-red-600 bg-red-50"
                : "border-gray-300 text-gray-500 hover:border-gray-400",
            ].join(" ")}
          >
            <input
              type="radio"
              name="octave"
              value={oct}
              checked={selected}
              onChange={() => onChange(oct)}
              className="sr-only"
            />
            {oct}
          </label>
        );
      })}
    </div>
  );
}
