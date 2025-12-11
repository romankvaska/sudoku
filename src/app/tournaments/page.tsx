'use client';

import { useEffect, useState } from 'react';
import { Tournament, TournamentParticipant } from '@/types';
import { getAllTournaments, getTournamentsByStatus, getTournamentParticipants, addTournamentParticipant } from '@/lib/db';

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'upcoming' | 'active' | 'completed' | 'all'>('all');
  const [expandedTournament, setExpandedTournament] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Record<string, TournamentParticipant[]>>({});

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      let data: Tournament[];
      if (selectedStatus === 'all') {
        data = await getAllTournaments();
      } else {
        data = await getTournamentsByStatus(selectedStatus);
      }
      setTournaments(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Failed to load tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadParticipants = async (tournamentId: string) => {
    try {
      if (!participants[tournamentId]) {
        const data = await getTournamentParticipants(tournamentId);
        setParticipants(prev => ({ ...prev, [tournamentId]: data }));
      }
    } catch (error) {
      console.error('Failed to load participants:', error);
    }
  };

  const handleExpandTournament = async (tournamentId: string) => {
    if (expandedTournament === tournamentId) {
      setExpandedTournament(null);
    } else {
      setExpandedTournament(tournamentId);
      await loadParticipants(tournamentId);
    }
  };

  const handleJoinTournament = async (tournament: Tournament) => {
    try {
      // Check if already joined
      const existingParticipants = participants[tournament.id] || [];
      const alreadyJoined = existingParticipants.some(p => p.userId === 'current-user-id'); // TODO: Replace with actual user ID

      if (alreadyJoined) {
        alert('You have already joined this tournament');
        return;
      }

      if (existingParticipants.length >= tournament.maxParticipants) {
        alert('Tournament is full');
        return;
      }

      // Add participant
      await addTournamentParticipant({
        id: Date.now().toString(),
        tournamentId: tournament.id,
        userId: 'current-user-id', // TODO: Replace with actual user ID
        solved: false,
        joinedAt: new Date(),
      });

      // Reload participants
      await loadParticipants(tournament.id);
      alert('Successfully joined the tournament!');
    } catch (error) {
      console.error('Failed to join tournament:', error);
      alert('Failed to join tournament');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'active':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'completed':
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tournaments</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Compete with other players in exciting Sudoku tournaments
        </p>
      </div>

      {/* Filter by Status */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Status</p>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'upcoming', 'active', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => {
                setSelectedStatus(status);
                setLoading(true);
                if (status === 'all') {
                  loadTournaments();
                } else {
                  getTournamentsByStatus(status)
                    .then(data => {
                      setTournaments(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                    })
                    .finally(() => setLoading(false));
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tournaments List */}
      <div>
        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Loading tournaments...</p>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">No tournaments found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tournaments.map(tournament => (
              <div
                key={tournament.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div
                  onClick={() => handleExpandTournament(tournament.id)}
                  className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {tournament.name}
                      </h3>
                      <span className={`px-3 py-1 rounded text-xs font-semibold capitalize ${getStatusBadgeColor(tournament.status)}`}>
                        {tournament.status}
                      </span>
                      <span className="px-3 py-1 rounded text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 capitalize">
                        {tournament.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {tournament.description}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <span>📅 {new Date(tournament.startDate).toLocaleDateString()}</span>
                      <span>👥 {participants[tournament.id]?.length || 0}/{tournament.maxParticipants} participants</span>
                    </div>
                  </div>

                  <div className="ml-4 text-gray-400">
                    {expandedTournament === tournament.id ? '▲' : '▼'}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedTournament === tournament.id && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/50 space-y-4">
                    {/* Participants List */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Participants ({participants[tournament.id]?.length || 0}/{tournament.maxParticipants})
                      </h4>
                      {participants[tournament.id] && participants[tournament.id].length > 0 ? (
                        <div className="space-y-2">
                          {participants[tournament.id]
                            .sort((a, b) => (a.rank || 999) - (b.rank || 999))
                            .map((participant, index) => (
                              <div
                                key={participant.id}
                                className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="font-semibold text-gray-700 dark:text-gray-300 w-8">
                                    #{index + 1}
                                  </span>
                                  <span className="text-gray-900 dark:text-white">User {participant.userId.slice(0, 8)}</span>
                                </div>
                                {participant.solved && (
                                  <span className="text-green-600 dark:text-green-400 font-medium">Solved</span>
                                )}
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400">No participants yet</p>
                      )}
                    </div>

                    {/* Join Button */}
                    {tournament.status !== 'completed' && (
                      <button
                        onClick={() => handleJoinTournament(tournament)}
                        disabled={
                          (participants[tournament.id]?.length || 0) >= tournament.maxParticipants
                        }
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                      >
                        Join Tournament
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Tournament Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Your Own Tournament</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Tournament creation feature coming soon! You will be able to organize and host your own tournaments.
        </p>
        <button
          disabled
          className="px-4 py-2 bg-gray-400 cursor-not-allowed text-white rounded-lg font-medium"
        >
          Create Tournament (Coming Soon)
        </button>
      </div>
    </div>
  );
}
