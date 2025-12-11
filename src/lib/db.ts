import Dexie, { Table } from 'dexie';
import { GameHistory, Tournament, TournamentParticipant } from '@/types';

export interface StoredGame extends GameHistory {
  boardState?: number[][];
  solutionState?: number[][];
}

export class SudokuDatabase extends Dexie {
  games!: Table<StoredGame>;
  tournaments!: Table<Tournament>;
  participants!: Table<TournamentParticipant>;

  constructor() {
    super('SudokuGameDB');
    this.version(1).stores({
      games: '++id, difficulty, createdAt',
      tournaments: '++id, createdAt, status',
      participants: '++id, tournamentId, userId',
    });
  }
}

export const db = new SudokuDatabase();

/**
 * Save completed game to database
 */
export async function saveGame(game: StoredGame): Promise<string> {
  try {
    const id = await db.games.add(game);
    return id as string;
  } catch (error) {
    console.error('Error saving game:', error);
    throw error;
  }
}

/**
 * Get all games from database
 */
export async function getAllGames(): Promise<StoredGame[]> {
  try {
    const games = await db.games.toArray();
    return games;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
}

/**
 * Get games by difficulty
 */
export async function getGamesByDifficulty(difficulty: string): Promise<StoredGame[]> {
  try {
    const games = await db.games.where('difficulty').equals(difficulty).toArray();
    return games;
  } catch (error) {
    console.error('Error fetching games by difficulty:', error);
    throw error;
  }
}

/**
 * Get games from last N days
 */
export async function getRecentGames(days: number): Promise<StoredGame[]> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const games = await db.games
      .where('createdAt')
      .aboveOrEqual(cutoffDate)
      .toArray();
    return games;
  } catch (error) {
    console.error('Error fetching recent games:', error);
    throw error;
  }
}

/**
 * Delete a game
 */
export async function deleteGame(id: string): Promise<void> {
  try {
    await db.games.delete(id as any);
  } catch (error) {
    console.error('Error deleting game:', error);
    throw error;
  }
}

/**
 * Get game statistics
 */
export async function getGameStatistics(): Promise<{
  totalGames: number;
  solvedGames: number;
  avgTime: number;
  fastestTime: number;
  slowestTime: number;
}> {
  try {
    const games = await db.games.toArray();

    const solvedGames = games.filter(g => g.solved);
    const solveTimesMs = solvedGames.map(g => g.solveTime);

    return {
      totalGames: games.length,
      solvedGames: solvedGames.length,
      avgTime: solveTimesMs.length > 0 ? solveTimesMs.reduce((a, b) => a + b, 0) / solveTimesMs.length : 0,
      fastestTime: solveTimesMs.length > 0 ? Math.min(...solveTimesMs) : 0,
      slowestTime: solveTimesMs.length > 0 ? Math.max(...solveTimesMs) : 0,
    };
  } catch (error) {
    console.error('Error getting game statistics:', error);
    throw error;
  }
}

/**
 * Save tournament
 */
export async function saveTournament(tournament: Tournament): Promise<string> {
  try {
    const id = await db.tournaments.add(tournament);
    return id as string;
  } catch (error) {
    console.error('Error saving tournament:', error);
    throw error;
  }
}

/**
 * Get all tournaments
 */
export async function getAllTournaments(): Promise<Tournament[]> {
  try {
    const tournaments = await db.tournaments.toArray();
    return tournaments;
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    throw error;
  }
}

/**
 * Get tournament by status
 */
export async function getTournamentsByStatus(status: string): Promise<Tournament[]> {
  try {
    const tournaments = await db.tournaments.where('status').equals(status).toArray();
    return tournaments;
  } catch (error) {
    console.error('Error fetching tournaments by status:', error);
    throw error;
  }
}

/**
 * Add participant to tournament
 */
export async function addTournamentParticipant(participant: TournamentParticipant): Promise<string> {
  try {
    const id = await db.participants.add(participant);
    return id as string;
  } catch (error) {
    console.error('Error adding tournament participant:', error);
    throw error;
  }
}

/**
 * Get tournament participants
 */
export async function getTournamentParticipants(tournamentId: string): Promise<TournamentParticipant[]> {
  try {
    const participants = await db.participants.where('tournamentId').equals(tournamentId).toArray();
    return participants;
  } catch (error) {
    console.error('Error fetching tournament participants:', error);
    throw error;
  }
}

/**
 * Clear all offline data
 */
export async function clearAllData(): Promise<void> {
  try {
    await db.games.clear();
    await db.tournaments.clear();
    await db.participants.clear();
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
}
