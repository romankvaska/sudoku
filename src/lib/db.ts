import Dexie, { Table } from 'dexie';
import { GameHistory, GameState, Tournament, TournamentParticipant } from '@/types';

export interface StoredGame extends GameHistory {
  boardState?: number[][];
  solutionState?: number[][];
}

export interface InProgressGame {
  id: string;
  gameState: GameState;
  savedAt: Date;
}

export class SudokuDatabase extends Dexie {
  games!: Table<StoredGame>;
  tournaments!: Table<Tournament>;
  participants!: Table<TournamentParticipant>;
  inProgressGames!: Table<InProgressGame>;

  constructor() {
    super('SudokuGameDB');
    this.version(1).stores({
      games: '++id, difficulty, createdAt',
      tournaments: '++id, createdAt, status',
      participants: '++id, tournamentId, userId',
    });
    this.version(2).stores({
      games: '++id, difficulty, createdAt',
      tournaments: '++id, createdAt, status',
      participants: '++id, tournamentId, userId',
      inProgressGames: 'id, savedAt',
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
    await db.inProgressGames.clear();
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
}

/**
 * Save in-progress game (upsert - always uses same ID for single active game)
 */
export async function saveInProgressGame(gameState: GameState): Promise<void> {
  try {
    const inProgressGame: InProgressGame = {
      id: 'current', // Single in-progress game at a time
      gameState,
      savedAt: new Date(),
    };
    await db.inProgressGames.put(inProgressGame);
  } catch (error) {
    console.error('Error saving in-progress game:', error);
    throw error;
  }
}

/**
 * Load in-progress game
 */
export async function loadInProgressGame(): Promise<InProgressGame | null> {
  try {
    const game = await db.inProgressGames.get('current');
    return game || null;
  } catch (error) {
    console.error('Error loading in-progress game:', error);
    return null;
  }
}

/**
 * Clear in-progress game
 */
export async function clearInProgressGame(): Promise<void> {
  try {
    await db.inProgressGames.delete('current');
  } catch (error) {
    console.error('Error clearing in-progress game:', error);
    throw error;
  }
}
