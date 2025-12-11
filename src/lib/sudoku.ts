import { Difficulty, SudokuBoard, CellPosition, Hint } from '@/types';

// Sudoku solver and generator utilities
export class SudokuSolver {
  /**
   * Check if a value is valid at a given position
   */
  static isValid(board: number[][], row: number, col: number, num: number): boolean {
    // Check row
    if (board[row].includes(num)) return false;

    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (board[i][j] === num) return false;
      }
    }

    return true;
  }

  /**
   * Solve a Sudoku puzzle using backtracking
   */
  static solve(board: number[][]): boolean {
    const boardCopy = board.map(row => [...row]);

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (boardCopy[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValid(boardCopy, row, col, num)) {
              boardCopy[row][col] = num;

              if (this.solve(boardCopy)) {
                return true;
              }

              boardCopy[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Get the solution for a puzzle
   */
  static getSolution(puzzle: number[][]): number[][] {
    const solution = puzzle.map(row => [...row]);
    this.solve(solution);
    return solution;
  }

  /**
   * Generate a random Sudoku puzzle with given difficulty
   */
  static generatePuzzle(difficulty: Difficulty): SudokuBoard {
    // Start with a solved puzzle
    const solution = this.generateSolvedPuzzle();

    // Create puzzle by removing numbers based on difficulty
    const cluesCount = this.getCluesCount(difficulty);
    const puzzle = solution.map(row => [...row]);

    let removed = 0;
    const maxAttempts = 1000;
    let attempts = 0;

    while (removed < 81 - cluesCount && attempts < maxAttempts) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      if (puzzle[row][col] !== 0) {
        const backup = puzzle[row][col];
        puzzle[row][col] = 0;

        // Check if puzzle still has unique solution
        if (this.hasUniqueSolution(puzzle)) {
          removed++;
        } else {
          puzzle[row][col] = backup;
        }
      }

      attempts++;
    }

    return {
      puzzle,
      solution,
      board: puzzle.map(row => [...row]),
    };
  }

  /**
   * Generate a completely solved Sudoku puzzle
   */
  private static generateSolvedPuzzle(): number[][] {
    const board: number[][] = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0));

    const fillBoard = (): boolean => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            const numbers = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

            for (const num of numbers) {
              if (this.isValid(board, row, col, num)) {
                board[row][col] = num;

                if (fillBoard()) {
                  return true;
                }

                board[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    fillBoard();
    return board;
  }

  /**
   * Check if puzzle has unique solution
   */
  private static hasUniqueSolution(puzzle: number[][]): boolean {
    let count = 0;
    const boardCopy = puzzle.map(row => [...row]);

    const countSolutions = (): void => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (boardCopy[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (this.isValid(boardCopy, row, col, num)) {
                boardCopy[row][col] = num;
                countSolutions();
                boardCopy[row][col] = 0;

                if (count > 1) return;
              }
            }
            return;
          }
        }
      }
      count++;
    };

    countSolutions();
    return count === 1;
  }

  /**
   * Get number of clues based on difficulty
   */
  private static getCluesCount(difficulty: Difficulty): number {
    switch (difficulty) {
      case 'easy':
        return 40 + Math.floor(Math.random() * 10); // 40-50 clues
      case 'medium':
        return 30 + Math.floor(Math.random() * 10); // 30-40 clues
      case 'hard':
        return 20 + Math.floor(Math.random() * 10); // 20-30 clues
      case 'expert':
        return 15 + Math.floor(Math.random() * 5); // 15-20 clues
      default:
        return 35;
    }
  }

  /**
   * Shuffle array
   */
  private static shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Check if board is completely solved
   */
  static isSolved(board: number[][], solution: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== solution[row][col]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Get hint for current board state
   */
  static getHint(puzzle: number[][], board: number[][], solution: number[][]): Hint | null {
    const empty = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0 && puzzle[row][col] === 0) {
          empty.push({ row, col });
        }
      }
    }

    if (empty.length === 0) return null;

    const { row, col } = empty[Math.floor(Math.random() * empty.length)];
    return {
      position: { row, col },
      value: solution[row][col],
    };
  }
}

/**
 * Get estimated solving time based on difficulty
 */
export function getEstimatedTime(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'easy':
      return '5-10 mins';
    case 'medium':
      return '15-30 mins';
    case 'hard':
      return '30-60 mins';
    case 'expert':
      return '60+ mins';
    default:
      return 'Unknown';
  }
}

/**
 * Format time in seconds to MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
