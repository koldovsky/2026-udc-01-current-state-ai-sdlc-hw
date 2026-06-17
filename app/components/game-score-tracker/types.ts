export type GameResult = "win" | "lose";

export interface GameRecord {
  id: string;
  gameName: string;
  durationMinutes: number;
  result: GameResult;
  winnerName: string;
  loserName: string;
}
