// Game Types
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type GameStatus = 'playing' | 'paused' | 'completed' | 'abandoned';

export interface SudokuBoard {
  puzzle: number[][];
  solution: number[][];
  board: number[][];
}

export interface GameState {
  id: string;
  board: number[][];
  solution: number[][];
  puzzle: number[][];
  difficulty: Difficulty;
  status: GameStatus;
  startTime: number;
  elapsedTime: number;
  solved: boolean;
  createdAt: Date;
  updatedAt: Date;
  incorrectAttempts: number;
  penaltyTime: number;
  hintsUsed: number;
}

export interface GameHistory {
  id: string;
  difficulty: Difficulty;
  solveTime: number;
  solved: boolean;
  createdAt: Date;
  puzzleHash?: string;
  incorrectAttempts?: number;
  hintsUsed?: number;
  penaltyTime?: number;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  createdBy: string;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  maxParticipants: number;
  status: 'upcoming' | 'active' | 'completed';
  participants: TournamentParticipant[];
}

export interface TournamentParticipant {
  id: string;
  tournamentId: string;
  userId: string;
  solveTime?: number;
  solved: boolean;
  rank?: number;
  joinedAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalGames: number;
  fastestTime: number;
  averageTime: number;
  winRate: number;
  difficulty: Difficulty;
  rank: number;
}

// Cell position type
export interface CellPosition {
  row: number;
  col: number;
}

// Hint type
export interface Hint {
  position: CellPosition;
  value: number;
}
