'use client';

import { useState, useEffect } from 'react';
import { GameScoreGrid } from '@/components/game-score-tracker/GameScoreGrid';
import { WinScore } from '@/components/game-score-tracker/WinScore';
import { GameRecord, GameResult } from '@/components/game-score-tracker/types';

function createEmptyRecord(): GameRecord {
  return {
    id: crypto.randomUUID(),
    gameName: '',
    durationMinutes: 0,
    result: 'win',
    winnerName: '',
    loserName: '',
  };
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [records, setRecords] = useState<GameRecord[]>([]);

  useEffect(() => {
    setRecords([createEmptyRecord()]);
    setMounted(true);
  }, []);

  function handleAdd() {
    setRecords(prev => [...prev, createEmptyRecord()]);
  }

  function handleChange(id: string, field: keyof GameRecord, value: string | number | GameResult) {
    setRecords(prev =>
      prev.map(r => r.id === id ? { ...r, [field]: value } : r)
    );
  }

  function handleDelete(id: string) {
    setRecords(prev => prev.filter(r => r.id !== id));
  }

  const filledRecords = records.filter(r => r.gameName.trim() !== '' && r.durationMinutes > 0);

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-6">Game Score Tracker</h1>
        {mounted && (
          <>
            <GameScoreGrid
              records={records}
              onAdd={handleAdd}
              onChange={handleChange}
              onDelete={handleDelete}
            />
            <WinScore records={filledRecords} />
          </>
        )}
      </div>
    </div>
  );
}
