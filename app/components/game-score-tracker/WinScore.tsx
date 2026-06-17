import { GameRecord } from './types';

interface WinScoreProps {
  records: GameRecord[];
}

export function WinScore({ records }: WinScoreProps) {
  if (records.length === 0) {
    return (
      <div className="mt-6 p-4 bg-zinc-50 rounded-xl text-center text-zinc-400 text-sm">
        Add records to see your win score.
      </div>
    );
  }

  const winCount = records.filter(r => r.result === 'win').length;
  const score = Math.round((winCount / records.length) * 100);

  return (
    <div className="mt-6 p-4 bg-zinc-50 rounded-xl text-center">
      <span className="text-zinc-500 text-sm">Win Score</span>
      <p className="text-4xl font-bold text-zinc-900 mt-1">{score}%</p>
      <p className="text-zinc-400 text-xs mt-1">{winCount} win{winCount !== 1 ? 's' : ''} out of {records.length} record{records.length !== 1 ? 's' : ''}</p>
    </div>
  );
}
