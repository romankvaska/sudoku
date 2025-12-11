'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StoredGame, getAllGames, deleteGame, getGameStatistics } from '@/lib/db';
import { formatTime } from '@/lib/sudoku';
import { Difficulty } from '@/types';

export default function HistoryPage() {
  const [games, setGames] = useState<StoredGame[]>([]);
  const [statistics, setStatistics] = useState<{
    totalGames: number;
    solvedGames: number;
    avgTime: number;
    fastestTime: number;
    slowestTime: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');

  useEffect(() => {
    loadGames();
    loadStatistics();
  }, []);

  const loadGames = async () => {
    try {
      const gamesData = await getAllGames();
      setGames(gamesData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await getGameStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleDeleteGame = async (id: string) => {
    if (confirm('Are you sure you want to delete this game record?')) {
      try {
        await deleteGame(id);
        setGames(games.filter(g => g.id !== id));
        loadStatistics(); // Refresh statistics
      } catch (error) {
        console.error('Failed to delete game:', error);
      }
    }
  };

  const filteredGames = selectedDifficulty === 'all' 
    ? games 
    : games.filter(g => g.difficulty === selectedDifficulty);

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Game History</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track all your completed Sudoku games and view your progress
        </p>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Games</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {statistics.totalGames}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Solved</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
              {statistics.solvedGames}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Average Time</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1 font-mono text-xl">
              {formatTime(Math.round(statistics.avgTime))}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Fastest</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1 font-mono text-xl">
              {formatTime(Math.round(statistics.fastestTime))}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Slowest</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1 font-mono text-xl">
              {formatTime(Math.round(statistics.slowestTime))}
            </p>
          </div>
        </div>
      )}

      {/* Filter by Difficulty */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Difficulty</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedDifficulty('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedDifficulty === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-600'
            }`}
          >
            All Difficulties
          </button>
          {difficulties.map(difficulty => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                selectedDifficulty === difficulty
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-600'
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* Games List */}
      <div>
        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Loading games...</p>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No games found</p>
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
              Play a game →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Time</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Difficulty</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Total</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Errors</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Hints</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Penalties</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.map((game, index) => (
                  <tr
                    key={game.id}
                    className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      index % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-gray-800/50'
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      <div className="whitespace-nowrap">
                        {new Date(game.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(game.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold capitalize ${
                        game.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                        game.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                        game.difficulty === 'hard' ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                        'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      }`}>
                        {game.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {formatTime(game.solveTime)}
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-semibold text-red-600 dark:text-red-400">
                      {game.incorrectAttempts ?? 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-semibold text-purple-600 dark:text-purple-400">
                      {game.hintsUsed ?? 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-mono font-semibold text-yellow-600 dark:text-yellow-400">
                      +{formatTime(game.penaltyTime ?? 0)}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <button
                        onClick={() => handleDeleteGame(game.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
