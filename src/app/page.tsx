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

      {/* Difficulty Selection */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose Difficulty Level</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {difficulties.map(({ level, description, time }) => (
            <Link
              key={level}
              href={`/game?difficulty=${level}`}
              className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {level}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {description}
                </p>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {time}
                </p>
              </div>
            </Link>
          ))}
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
