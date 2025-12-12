import { create } from 'zustand';
import { GameState, GameStatus, Difficulty } from '@/types';
import { gameService } from '@/lib/services';

interface GameStore {
  // State
  currentGame: GameState | null;
  timerInterval: NodeJS.Timeout | null;

  // Actions
  startNewGame: (difficulty: Difficulty) => void;
  resumeGame: (game: GameState) => void;
  setCell: (row: number, col: number, value: number) => void;
  clearCell: (row: number, col: number) => void;
  abandonGame: () => void;
  getHint: () => void;
  updateTimer: () => void;
  checkGameStatus: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentGame: null,
  timerInterval: null,

  startNewGame: (difficulty: Difficulty) => {
    const newGame = gameService.createNewGame(difficulty);

    set({ currentGame: newGame });

    // Start timer
    const interval = setInterval(() => {
      get().updateTimer();
    }, 1000);

    set({ timerInterval: interval });
  },

  resumeGame: (game: GameState) => {
    const updatedGame = { ...game, status: 'playing' as GameStatus };
    set({ currentGame: updatedGame });

    // Resume timer
    const interval = setInterval(() => {
      get().updateTimer();
    }, 1000);

    set({ timerInterval: interval });
  },

  setCell: (row: number, col: number, value: number) => {
    const { currentGame } = get();
    if (!currentGame) return;

    const result = gameService.setCell(currentGame, row, col, value);
    if (!result) return;

    const updatedGame = {
      ...currentGame,
      board: result.newBoard,
      updatedAt: new Date(),
      incorrectAttempts: result.newIncorrectAttempts,
      penaltyTime: result.newPenaltyTime,
    };

    set({ currentGame: updatedGame });
    get().checkGameStatus();
  },

  clearCell: (row: number, col: number) => {
    const { currentGame } = get();
    if (!currentGame) return;

    const newBoard = gameService.clearCell(currentGame, row, col);
    if (!newBoard) return;

    const updatedGame = {
      ...currentGame,
      board: newBoard,
      updatedAt: new Date(),
    };

    set({ currentGame: updatedGame });
  },

  abandonGame: () => {
    const { timerInterval } = get();
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    set({ currentGame: null, timerInterval: null });
  },

  getHint: () => {
    const { currentGame } = get();
    if (!currentGame) return;

    const result = gameService.getHint(currentGame);
    if (!result) return;

    const updatedGame = {
      ...currentGame,
      board: result.newBoard,
      updatedAt: new Date(),
      hintsUsed: result.newHintsUsed,
      penaltyTime: result.newPenaltyTime,
    };

    set({ currentGame: updatedGame });
    get().checkGameStatus();
  },

  updateTimer: () => {
    const { currentGame } = get();
    if (!currentGame || currentGame.status !== 'playing') return;

    const elapsed = Math.floor((Date.now() - currentGame.startTime) / 1000);
    set({
      currentGame: {
        ...currentGame,
        elapsedTime: elapsed,
      },
    });
  },

  checkGameStatus: () => {
    const { currentGame } = get();
    if (!currentGame) return;

    const isSolved = gameService.checkIsSolved(currentGame);

    if (isSolved) {
      const { timerInterval } = get();
      if (timerInterval) {
        clearInterval(timerInterval);
      }

      set({
        currentGame: {
          ...currentGame,
          status: 'completed',
          solved: true,
          updatedAt: new Date(),
        },
        timerInterval: null,
      });
    }
  },
}));
