'use client';

import { ComboBox } from '@/libraries/combo-box/ComboBox';
import { GameRecord, GameResult } from './types';

const DEFAULT_GAMES = ['Chess', 'Checkers', 'Scrabble', 'Catan', 'Poker', 'Go'];

interface GameScoreGridProps {
  records: GameRecord[];
  onAdd: () => void;
  onChange: (id: string, field: keyof GameRecord, value: string | number | GameResult) => void;
  onDelete: (id: string) => void;
}

export function GameScoreGrid({ records, onAdd, onChange, onDelete }: GameScoreGridProps) {
  return (
    <div className="w-full">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-zinc-100 text-zinc-600 text-left">
            <th className="border border-zinc-300 px-3 py-2 font-medium">Game Name</th>
            <th className="border border-zinc-300 px-3 py-2 font-medium w-32">Duration (min)</th>
            <th className="border border-zinc-300 px-3 py-2 font-medium w-44">Result</th>
            <th className="border border-zinc-300 px-3 py-2 font-medium">Winner Name</th>
            <th className="border border-zinc-300 px-3 py-2 font-medium">Loser Name</th>
            <th className="border border-zinc-300 px-3 py-2 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => {
            const nameInvalid = record.gameName.trim() === '';
            const durationInvalid = record.durationMinutes <= 0;
            return (
              <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}>
                <td className="border border-zinc-300 px-2 py-1">
                  <ComboBox
                    id={`game-name-${record.id}`}
                    options={DEFAULT_GAMES}
                    value={record.gameName}
                    onChange={val => onChange(record.id, 'gameName', val)}
                    placeholder="Select or type..."
                  />
                  {nameInvalid && record.gameName !== '' && (
                    <p className="text-red-500 text-xs mt-0.5">Name is required</p>
                  )}
                </td>
                <td className="border border-zinc-300 px-2 py-1">
                  <input
                    type="number"
                    min={1}
                    value={record.durationMinutes || ''}
                    onChange={e => onChange(record.id, 'durationMinutes', Number(e.target.value))}
                    placeholder="0"
                    className={`w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 ${durationInvalid ? 'border-red-400' : 'border-zinc-300'}`}
                  />
                </td>
                <td className="border border-zinc-300 px-3 py-1">
                  <label className="flex items-center gap-1 cursor-pointer inline-flex mr-4">
                    <input
                      type="radio"
                      name={`result-${record.id}`}
                      checked={record.result === 'win'}
                      onChange={() => onChange(record.id, 'result', 'win')}
                    />
                    <span>Win</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer inline-flex">
                    <input
                      type="radio"
                      name={`result-${record.id}`}
                      checked={record.result === 'lose'}
                      onChange={() => onChange(record.id, 'result', 'lose')}
                    />
                    <span>Lose</span>
                  </label>
                </td>
                <td className="border border-zinc-300 px-2 py-1">
                  <input
                    type="text"
                    value={record.winnerName}
                    onChange={e => onChange(record.id, 'winnerName', e.target.value)}
                    placeholder="Enter winner..."
                    className="w-full border border-zinc-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  />
                </td>
                <td className="border border-zinc-300 px-2 py-1">
                  <input
                    type="text"
                    value={record.loserName}
                    onChange={e => onChange(record.id, 'loserName', e.target.value)}
                    placeholder="Enter loser..."
                    className="w-full border border-zinc-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  />
                </td>
                <td className="border border-zinc-300 px-2 py-1 text-center">
                  <button
                    onClick={() => onDelete(record.id)}
                    className="text-zinc-400 hover:text-red-500 font-bold text-base leading-none"
                    aria-label="Delete row"
                  >
                    ×
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        onClick={onAdd}
        className="mt-3 px-4 py-1.5 text-sm border border-zinc-300 rounded hover:bg-zinc-100 transition-colors text-zinc-700"
      >
        + Add Row
      </button>
    </div>
  );
}
