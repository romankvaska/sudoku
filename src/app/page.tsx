'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Difficulty } from '@/types';

export default function Home() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const difficulties: { level: Difficulty; description: string; time: string }[] = [
    { level: 'easy', description: 'Perfect for beginners', time: '5-10 mins' },
    { level: 'medium', description: 'A bit challenging', time: '15-30 mins' },
    { level: 'hard', description: 'For experienced players', time: '30-60 mins' },
    { level: 'expert', description: 'Maximum difficulty', time: '60+ mins' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Welcome to Sudoku
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Challenge yourself with our Sudoku puzzles. Play online or offline, track your progress, and compete in tournaments.
        </p>
      </section>

      {/* Difficulty Selection Bar */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Start Playing</h2>
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex gap-2 flex-1">
            {difficulties.map(({ level, time }) => (
              <button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  selectedDifficulty === level
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                } capitalize text-sm`}
              >
                <div className="font-semibold">{level}</div>
                <div className="text-xs opacity-75">{time}</div>
              </button>
            ))}
          </div>
          
          <Link
            href={selectedDifficulty ? `/game?difficulty=${selectedDifficulty}` : '#'}
            onClick={(e) => {
              if (!selectedDifficulty) {
                e.preventDefault();
              }
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              selectedDifficulty
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-md cursor-pointer'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Play
          </Link>
        </div>
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Game History</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            View your completed games and track your solving times.
          </p>
          <Link href="/history" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
            View History →
          </Link>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tournaments</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Compete with other players in exciting Sudoku tournaments.
          </p>
          <Link href="/tournaments" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
            View Tournaments →
          </Link>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Leaderboards</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Check global leaderboards and compare your stats.
          </p>
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
            View Leaderboards →
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Features</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
            <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
            <span>Play offline without internet connection</span>
          </li>
          <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
            <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
            <span>Automatic game progress saving</span>
          </li>
          <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
            <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
            <span>Track solving times and statistics</span>
          </li>
          <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
            <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
            <span>Participate in tournaments</span>
          </li>
          <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
            <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
            <span>Multiple difficulty levels</span>
          </li>
          <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
            <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
            <span>Install as PWA on your device</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
