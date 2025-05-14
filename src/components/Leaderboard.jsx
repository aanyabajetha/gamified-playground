import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';

// Mock data for the leaderboard
const MOCK_LEADERBOARD_DATA = [
  {
    id: 1,
    name: 'CodeMaster42',
    score: 1250,
    transformations: 15,
    date: new Date('2023-11-15'),
    readabilityScore: 92
  },
  {
    id: 2,
    name: 'DeobfuscatorPro',
    score: 980,
    transformations: 12,
    date: new Date('2023-11-14'),
    readabilityScore: 85
  },
  {
    id: 3,
    name: 'CleanCodeGuru',
    score: 875,
    transformations: 10,
    date: new Date('2023-11-13'),
    readabilityScore: 90
  },
  {
    id: 4,
    name: 'SyntaxSlayer',
    score: 750,
    transformations: 8,
    date: new Date('2023-11-12'),
    readabilityScore: 78
  },
  {
    id: 5,
    name: 'BugHunter99',
    score: 720,
    transformations: 9,
    date: new Date('2023-11-11'),
    readabilityScore: 82
  },
  {
    id: 6,
    name: 'AlgorithmAce',
    score: 680,
    transformations: 7,
    date: new Date('2023-11-10'),
    readabilityScore: 75
  },
  {
    id: 7,
    name: 'RefactorNinja',
    score: 650,
    transformations: 6,
    date: new Date('2023-11-09'),
    readabilityScore: 88
  },
  {
    id: 8,
    name: 'DevDragon',
    score: 620,
    transformations: 7,
    date: new Date('2023-11-08'),
    readabilityScore: 70
  },
  {
    id: 9,
    name: 'ByteWizard',
    score: 590,
    transformations: 5,
    date: new Date('2023-11-07'),
    readabilityScore: 65
  },
  {
    id: 10,
    name: 'CodeCraftsman',
    score: 560,
    transformations: 6,
    date: new Date('2023-11-06'),
    readabilityScore: 80
  }
];

/**
 * Leaderboard component to display top scores
 *
 * @param {Object} props - Component props
 * @param {Array} props.entries - Leaderboard entries (will use mock data if empty)
 * @param {boolean} props.loading - Whether leaderboard is loading
 * @param {Function} props.onRefresh - Callback when refresh is requested
 * @returns {JSX.Element} Leaderboard component
 */
function Leaderboard({ entries = [], loading = false, onRefresh }) {
  // Use mock data if no entries are provided
  const leaderboardData = entries.length > 0 ? entries : MOCK_LEADERBOARD_DATA;
  const [sortedEntries, setSortedEntries] = useState([]);
  const [sortField, setSortField] = useState('score');
  const [sortDirection, setSortDirection] = useState('desc');

  // Sort entries when props or sort settings change
  useEffect(() => {
    const sorted = [...leaderboardData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setSortedEntries(sorted);
  }, [leaderboardData, sortField, sortDirection]);

  const handleSort = (field) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new field
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  // Get sort direction indicator
  const getSortIndicator = (field) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Get CSS class for rank (top 3 get special styling)
  const getRankClass = (index) => {
    if (index === 0) return 'bg-yellow-50 text-yellow-800 border-yellow-300';
    if (index === 1) return 'bg-gray-50 text-gray-800 border-gray-300';
    if (index === 2) return 'bg-amber-50 text-amber-800 border-amber-300';
    return '';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
          Top Performers
        </h3>
        <button
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors flex items-center border border-white/10"
          onClick={handleRefresh}
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center bg-black/20 rounded-xl border border-white/10">
          <div className="inline-block p-3 rounded-full bg-white/5 mb-4">
            <svg className="animate-spin h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-white/70">Loading leaderboard data...</p>
          <p className="text-white/40 text-sm mt-1">Please wait while we fetch the latest scores</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-black/20 border border-white/10 shadow-xl">
          {/* Table header with sorting controls */}
          <div className="bg-black/30 px-4 py-3 grid grid-cols-12 gap-2 text-xs font-medium text-gray-300 uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div
              className="col-span-3 flex items-center cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('name')}
            >
              <span>Player</span>
              <span className="ml-1">{getSortIndicator('name')}</span>
            </div>
            <div
              className="col-span-2 flex items-center cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('score')}
            >
              <span>Score</span>
              <span className="ml-1">{getSortIndicator('score')}</span>
            </div>
            <div
              className="col-span-3 flex items-center cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('readabilityScore')}
            >
              <span>Readability</span>
              <span className="ml-1">{getSortIndicator('readabilityScore')}</span>
            </div>
            <div
              className="col-span-1 flex items-center cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('transformations')}
            >
              <span>Txs</span>
              <span className="ml-1">{getSortIndicator('transformations')}</span>
            </div>
            <div
              className="col-span-2 flex items-center cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('date')}
            >
              <span>Date</span>
              <span className="ml-1">{getSortIndicator('date')}</span>
            </div>
          </div>

          {/* Table body */}
          <div className="divide-y divide-white/5">
            {sortedEntries.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <div className="inline-block p-3 rounded-full bg-white/5 mb-4">
                  <Trophy className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-gray-400 text-sm">No entries yet</p>
                <p className="text-gray-500 text-xs mt-1">Be the first to make it to the leaderboard!</p>
              </div>
            ) : (
              sortedEntries.map((entry, index) => (
                <div
                  key={entry.id || index}
                  className={`px-4 py-3 grid grid-cols-12 gap-2 items-center text-sm ${
                    index < 3 ? 'bg-gradient-to-r from-black/40 to-transparent' : 'hover:bg-white/5'
                  } transition-colors relative overflow-hidden`}
                >
                  {/* Position indicator */}
                  <div className="col-span-1 font-bold">
                    {index === 0 ? (
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 text-white">1</div>
                    ) : index === 1 ? (
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 text-white">2</div>
                    ) : index === 2 ? (
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white">3</div>
                    ) : (
                      <span className="text-gray-400 pl-2">{index + 1}</span>
                    )}
                  </div>

                  {/* Player name */}
                  <div className="col-span-3 font-medium text-white flex items-center">
                    {index < 3 && (
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : 'bg-amber-600'
                      }`}></div>
                    )}
                    {entry.name}
                  </div>

                  {/* Score */}
                  <div className="col-span-2 font-semibold">
                    <span className={`${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                      index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                      index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-800' :
                      'bg-gradient-to-r from-purple-400 to-indigo-500'
                    } bg-clip-text text-transparent`}>
                      {entry.score.toLocaleString()}
                    </span>
                  </div>

                  {/* Readability score */}
                  <div className="col-span-3 text-white">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-700/50 rounded-full h-2 mr-2 max-w-[100px]">
                        <div
                          className={`h-2 rounded-full ${
                            entry.readabilityScore >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                            entry.readabilityScore >= 60 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                            entry.readabilityScore >= 40 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                            entry.readabilityScore >= 20 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                            'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          style={{ width: `${entry.readabilityScore}%` }}
                        ></div>
                      </div>
                      <span>{entry.readabilityScore}</span>
                    </div>
                  </div>

                  {/* Transformations count */}
                  <div className="col-span-1 text-white">
                    {entry.transformations}
                  </div>

                  {/* Date */}
                  <div className="col-span-2 text-gray-400">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>

                  {/* Background decoration for top 3 */}
                  {index < 3 && (
                    <div className={`absolute right-0 top-0 bottom-0 w-24 opacity-10 ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-500' :
                      'bg-amber-600'
                    }`}></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
