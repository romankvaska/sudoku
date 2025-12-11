'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import GameBoard from '@/components/GameBoard';
import { useGameStore } from '@/lib/gameStore';
import { formatTime, getEstimatedTime } from '@/lib/sudoku';
import { saveGame } from '@/lib/db';
import { Difficulty } from '@/types';

export default function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const difficulty = (searchParams.get('difficulty') as Difficulty) || 'easy';

  const { currentGame, startNewGame, setCell, clearCell, abandonGame, getHint } = useGameStore();
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    // Start new game when difficulty is set
    if (!currentGame && difficulty) {
      startNewGame(difficulty);
    }
  }, [difficulty, startNewGame, currentGame]);

  // Save game when it's completed
  useEffect(() => {
    if (currentGame?.status === 'completed' && currentGame.solved) {
      setShowCompletionModal(true);

      // Auto-save to database with total time including penalties
      const totalSolveTime = currentGame.elapsedTime + currentGame.penaltyTime;
      saveGame({
        id: currentGame.id,
        difficulty: currentGame.difficulty,
        solveTime: totalSolveTime,
        solved: true,
        createdAt: currentGame.createdAt,
        incorrectAttempts: currentGame.incorrectAttempts,
        hintsUsed: currentGame.hintsUsed,
        penaltyTime: currentGame.penaltyTime,
      }).catch(console.error);
    }
  }, [currentGame?.status, currentGame?.solved]);

  if (!currentGame) {
    return <div className="flex items-center justify-center h-screen">Loading game...</div>;
  }

  const handleCellSelect = (row: number, col: number) => {
    if (currentGame.puzzle[row][col] === 0) {
      setSelectedCell({ row, col });
    }
  };

  const handleCellChange = (row: number, col: number, value: number) => {
    if (currentGame.status !== 'playing') return;

    if (value === 0) {
      clearCell(row, col);
    } else {
      setCell(row, col, value);
    }
  };



  const handleAbandon = () => {
    if (confirm('Are you sure you want to abandon this game?')) {
      abandonGame();
      router.push('/');
    }
  };

  const handleNewGame = () => {
    abandonGame();
    startNewGame(difficulty);
    setSelectedCell(null);
  };

  const handleGoHome = () => {
    abandonGame();
    router.push('/');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
              {difficulty} Sudoku
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Estimated time: {getEstimatedTime(difficulty)}
            </p>
          </div>

          {/* Timer */}
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 font-mono">
              {formatTime(currentGame.elapsedTime)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Elapsed Time</p>
          </div>
        </div>
      </div>

      {/* Main Game Area with Board and Stats */}
      <div className="flex gap-16 justify-between items-stretch px-4">
        {/* Center: Game Board with Controls */}
        <div className="flex-1 flex flex-col items-center justify-start h-full">
          <GameBoard
            board={currentGame.board}
            puzzle={currentGame.puzzle}
            solution={currentGame.solution}
            selectedCell={selectedCell}
            onCellSelect={handleCellSelect}
            onCellChange={handleCellChange}
          />

          {/* Controls Below Board */}
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <button
              onClick={getHint}
              disabled={currentGame.status !== 'playing'}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              Get Hint
            </button>

            <button
              onClick={handleNewGame}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              New Game
            </button>

            <button
              onClick={handleAbandon}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Abandon
            </button>
          </div>
        </div>

        {/* Right: Stats Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 w-80 flex-shrink-0 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Game Stats</h3>
          
          <div className="space-y-4">
            {/* Incorrect Attempts */}
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Incorrect Attempts</p>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400">
                {currentGame.incorrectAttempts}
              </p>
            </div>

            {/* Hints Used */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Hints Used</p>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {currentGame.hintsUsed}
              </p>
            </div>

            {/* Penalty Time */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Penalty Time</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 font-mono">
                +{formatTime(currentGame.penaltyTime)}
              </p>
            </div>

            {/* Total Time with Penalty */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Time</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">
                {formatTime(currentGame.elapsedTime + currentGame.penaltyTime)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md text-center space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🎉 Puzzle Solved!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Congratulations on completing the {difficulty} puzzle!
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Solving Time (with penalties)</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono">
                {formatTime(currentGame.elapsedTime + currentGame.penaltyTime)}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleNewGame}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={handleGoHome}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
