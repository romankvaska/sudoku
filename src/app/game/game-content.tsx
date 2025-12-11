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

  const { currentGame, startNewGame, setCell, clearCell, pauseGame, resumeFromPause, abandonGame, getHint } = useGameStore();
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

      // Auto-save to database
      saveGame({
        id: currentGame.id,
        difficulty: currentGame.difficulty,
        solveTime: currentGame.elapsedTime,
        solved: true,
        createdAt: currentGame.createdAt,
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

  const handlePauseResume = () => {
    if (currentGame.status === 'playing') {
      pauseGame();
    } else if (currentGame.status === 'paused') {
      resumeFromPause();
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

        {/* Status */}
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
              currentGame.status === 'playing'
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : currentGame.status === 'paused'
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
            }`}
          >
            {currentGame.status}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <GameBoard
        board={currentGame.board}
        puzzle={currentGame.puzzle}
        selectedCell={selectedCell}
        onCellSelect={handleCellSelect}
        onCellChange={handleCellChange}
      />

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={handlePauseResume}
          disabled={currentGame.status === 'completed'}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
        >
          {currentGame.status === 'playing' ? 'Pause' : 'Resume'}
        </button>

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
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Solving Time</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono">
                {formatTime(currentGame.elapsedTime)}
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
