import { GameState, Difficulty } from '@/types';
import { SudokuSolver } from '@/lib/sudoku';
import { penaltyService, PenaltyService } from './PenaltyService';

export interface CellUpdateResult {
  newBoard: number[][];
  isCorrect: boolean;
  newIncorrectAttempts: number;
  newPenaltyTime: number;
}

export interface HintResult {
  newBoard: number[][];
  position: { row: number; col: number };
  value: number;
  newHintsUsed: number;
  newPenaltyTime: number;
}

export class GameService {
  private penaltyService: PenaltyService;

  constructor(penaltyServiceInstance: PenaltyService = penaltyService) {
    this.penaltyService = penaltyServiceInstance;
  }

  createNewGame(difficulty: Difficulty): GameState {
    const puzzle = SudokuSolver.generatePuzzle(difficulty);

    return {
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
  }

  canModifyCell(game: GameState, row: number, col: number): boolean {
    return game.puzzle[row][col] === 0;
  }

  setCell(game: GameState, row: number, col: number, value: number): CellUpdateResult | null {
    if (!this.canModifyCell(game, row, col)) {
      return null;
    }

    if (value < 1 || value > 9) {
      return null;
    }

    const isCorrect = game.solution[row][col] === value;
    const newBoard = game.board.map(r => [...r]);
    newBoard[row][col] = value;

    const penalty = isCorrect ? 0 : this.penaltyService.getIncorrectAttemptPenalty(game.difficulty);

    return {
      newBoard,
      isCorrect,
      newIncorrectAttempts: isCorrect ? game.incorrectAttempts : game.incorrectAttempts + 1,
      newPenaltyTime: game.penaltyTime + penalty,
    };
  }

  clearCell(game: GameState, row: number, col: number): number[][] | null {
    if (!this.canModifyCell(game, row, col)) {
      return null;
    }

    const newBoard = game.board.map(r => [...r]);
    newBoard[row][col] = 0;
    return newBoard;
  }

  getHint(game: GameState): HintResult | null {
    const hint = SudokuSolver.getHint(game.puzzle, game.board, game.solution);
    if (!hint) {
      return null;
    }

    const newBoard = game.board.map(r => [...r]);
    newBoard[hint.position.row][hint.position.col] = hint.value;

    const penalty = this.penaltyService.getHintPenalty(game.difficulty);

    return {
      newBoard,
      position: hint.position,
      value: hint.value,
      newHintsUsed: game.hintsUsed + 1,
      newPenaltyTime: game.penaltyTime + penalty,
    };
  }

  checkIsSolved(game: GameState): boolean {
    return SudokuSolver.isSolved(game.board, game.solution);
  }

  calculateElapsedTime(startTime: number): number {
    return Math.floor((Date.now() - startTime) / 1000);
  }

  getTotalTime(game: GameState): number {
    return game.elapsedTime + game.penaltyTime;
  }

  isValueCorrect(game: GameState, row: number, col: number, value: number): boolean {
    return game.solution[row][col] === value;
  }

  getEmptyCellCount(game: GameState): number {
    let count = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (game.board[row][col] === 0) {
          count++;
        }
      }
    }
    return count;
  }

  getProgress(game: GameState): number {
    const totalUserCells = 81 - this.getClueCount(game);
    const filledUserCells = this.getFilledUserCellCount(game);
    return totalUserCells > 0 ? (filledUserCells / totalUserCells) * 100 : 100;
  }

  private getClueCount(game: GameState): number {
    let count = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (game.puzzle[row][col] !== 0) {
          count++;
        }
      }
    }
    return count;
  }

  private getFilledUserCellCount(game: GameState): number {
    let count = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (game.puzzle[row][col] === 0 && game.board[row][col] !== 0) {
          count++;
        }
      }
    }
    return count;
  }
}

export const gameService = new GameService();
