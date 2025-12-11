import { create } from 'zustand';
import { GameState, GameStatus, Difficulty } from '@/types';
import { SudokuSolver } from '@/lib/sudoku';

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
    const puzzle = SudokuSolver.generatePuzzle(difficulty);

    const newGame: GameState = {
      id: Date.now().toString(),
      board: puzzle.board,
      solution: puzzle.solution,
      puzzle: puzzle.puzzle,
      difficulty,
      status: 'playing',
      startTime: Date.now(),
      elapsedTime: 0,
      solved: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      incorrectAttempts: 0,
      penaltyTime: 0,
      hintsUsed: 0,
    };

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
    const startTime = Date.now() - (game.elapsedTime * 1000);
    const interval = setInterval(() => {
      get().updateTimer();
    }, 1000);

    set({ timerInterval: interval });
  },

  setCell: (row: number, col: number, value: number) => {
    const { currentGame } = get();
    if (!currentGame) return;

    // Don't allow changing original clues
    if (currentGame.puzzle[row][col] !== 0) {
      console.warn('Cannot modify original clue');
      return;
    }

    // Validate value
    if (value < 1 || value > 9) return;

    // Check if the value is correct
    const isCorrect = currentGame.solution[row][col] === value;

    const newBoard = currentGame.board.map(r => [...r]);
    newBoard[row][col] = value;

    const updatedGame = {
      ...currentGame,
      board: newBoard,
      updatedAt: new Date(),
      incorrectAttempts: isCorrect ? currentGame.incorrectAttempts : currentGame.incorrectAttempts + 1,
      penaltyTime: isCorrect ? currentGame.penaltyTime : currentGame.penaltyTime + 30,
    };

    set({ currentGame: updatedGame });
    get().checkGameStatus();
  },

  clearCell: (row: number, col: number) => {
    const { currentGame } = get();
    if (!currentGame) return;

    // Don't allow clearing original clues
    if (currentGame.puzzle[row][col] !== 0) {
      console.warn('Cannot clear original clue');
      return;
    }

    const newBoard = currentGame.board.map(r => [...r]);
    newBoard[row][col] = 0;

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

    const hint = SudokuSolver.getHint(currentGame.puzzle, currentGame.board, currentGame.solution);
    if (!hint) return;

    const newBoard = currentGame.board.map(r => [...r]);
    newBoard[hint.position.row][hint.position.col] = hint.value;

    const updatedGame = {
      ...currentGame,
      board: newBoard,
      updatedAt: new Date(),
      hintsUsed: currentGame.hintsUsed + 1,
      penaltyTime: currentGame.penaltyTime + 10,
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

    const isSolved = SudokuSolver.isSolved(currentGame.board, currentGame.solution);

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
