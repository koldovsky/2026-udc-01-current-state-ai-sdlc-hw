"use client";

import type { Timbre } from "@/app/_lib/types";

const TIMBRES: { value: Timbre; label: string }[] = [
  { value: "sine",     label: "Sine" },
  { value: "triangle", label: "Triangle" },
  { value: "square",   label: "Square" },
  { value: "sawtooth", label: "Sawtooth" },
];

interface Props {
  value: Timbre;
  onChange: (timbre: Timbre) => void;
}

export default function TimbreControl({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-gray-500 mr-1">Timbre</span>
      {TIMBRES.map(({ value: t, label }) => {
        const selected = t === value;
        return (
          <label
            key={t}
            className={[
              "flex items-center justify-center px-4 py-1.5 rounded-lg border-2 cursor-pointer text-sm font-semibold transition-colors select-none",
              selected
                ? "border-red-600 text-red-600 bg-red-50"
                : "border-gray-300 text-gray-500 hover:border-gray-400",
            ].join(" ")}
          >
            <input
              type="radio"
              name="timbre"
              value={t}
              checked={selected}
              onChange={() => onChange(t)}
              className="sr-only"
            />
            {label}
          </label>
        );
      })}
    </div>
  );
}
