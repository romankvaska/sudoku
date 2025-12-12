import { Difficulty } from '@/types';

export interface PenaltyConfig {
  incorrectAttempt: number;
  hint: number;
}

export interface DifficultyPenaltyConfig {
  easy: PenaltyConfig;
  medium: PenaltyConfig;
  hard: PenaltyConfig;
  expert: PenaltyConfig;
}

const DEFAULT_PENALTY_CONFIG: DifficultyPenaltyConfig = {
  easy: {
    incorrectAttempt: 15,
    hint: 5,
  },
  medium: {
    incorrectAttempt: 30,
    hint: 10,
  },
  hard: {
    incorrectAttempt: 45,
    hint: 15,
  },
  expert: {
    incorrectAttempt: 60,
    hint: 20,
  },
};

export class PenaltyService {
  private config: DifficultyPenaltyConfig;

  constructor(config?: Partial<DifficultyPenaltyConfig>) {
    this.config = {
      ...DEFAULT_PENALTY_CONFIG,
      ...config,
    };
  }

  getIncorrectAttemptPenalty(difficulty: Difficulty): number {
    return this.config[difficulty].incorrectAttempt;
  }

  getHintPenalty(difficulty: Difficulty): number {
    return this.config[difficulty].hint;
  }

  getPenaltyConfig(difficulty: Difficulty): PenaltyConfig {
    return { ...this.config[difficulty] };
  }

  calculateTotalPenalty(
    difficulty: Difficulty,
    incorrectAttempts: number,
    hintsUsed: number
  ): number {
    const config = this.config[difficulty];
    return (
      incorrectAttempts * config.incorrectAttempt +
      hintsUsed * config.hint
    );
  }

  formatPenaltyBreakdown(
    difficulty: Difficulty,
    incorrectAttempts: number,
    hintsUsed: number
  ): string {
    const config = this.config[difficulty];
    const incorrectPenalty = incorrectAttempts * config.incorrectAttempt;
    const hintPenalty = hintsUsed * config.hint;

    const parts: string[] = [];
    if (incorrectAttempts > 0) {
      parts.push(`${incorrectAttempts} incorrect (+${incorrectPenalty}s)`);
    }
    if (hintsUsed > 0) {
      parts.push(`${hintsUsed} hints (+${hintPenalty}s)`);
    }

    return parts.length > 0 ? parts.join(', ') : 'No penalties';
  }
}

export const penaltyService = new PenaltyService();
