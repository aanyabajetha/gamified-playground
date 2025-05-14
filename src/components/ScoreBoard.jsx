import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useGame } from '../context/GameContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Trophy, Zap, History, BarChart, Award, Star, TrendingUp } from 'lucide-react';

/**
 * ScoreBoard component to display current score and transformation history
 *
 * @param {Object} props - Component props
 * @param {number} props.score - Current total score
 * @param {Array} props.transformHistory - History of transformations
 * @param {number} props.readabilityScore - Readability score (0-100)
 * @returns {JSX.Element} ScoreBoard component
 */
function ScoreBoard({ score = 0, transformHistory = [], readabilityScore = 0 }) {
  const [activeTab, setActiveTab] = useState('overview');
  const { mode } = useGame();

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!(timestamp instanceof Date)) {
      return 'Unknown';
    }
    return timestamp.toLocaleTimeString();
  };

  // Ensure readability score is between 0 and 100
  const normalizedReadabilityScore = Math.max(0, Math.min(100, readabilityScore));

  // Calculate circle properties for the progress indicator
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedReadabilityScore / 100) * circumference;

  // Determine color based on score
  const getReadabilityColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    if (score >= 20) return 'text-orange-400';
    return 'text-red-400';
  };

  // Get readability label based on score
  const getReadabilityLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    if (score >= 20) return 'Poor';
    return 'Very Poor';
  };

  // Get badge for current level
  const getLevelBadge = () => {
    if (score >= 1000) return { name: 'Grand Master', color: 'bg-gradient-to-r from-blue-400 to-cyan-500' };
    if (score >= 500) return { name: 'Master Transformer', color: 'bg-gradient-to-r from-blue-500 to-cyan-600' };
    if (score >= 200) return { name: 'Code Wizard', color: 'bg-gradient-to-r from-blue-600 to-cyan-700' };
    if (score >= 100) return { name: 'Code Adept', color: 'bg-gradient-to-r from-blue-700 to-cyan-800' };
    return { name: 'Apprentice', color: 'bg-gradient-to-r from-blue-800 to-cyan-900' };
  };

  const readabilityColor = getReadabilityColor(normalizedReadabilityScore);
  const readabilityLabel = getReadabilityLabel(normalizedReadabilityScore);
  const levelBadge = getLevelBadge();

  return (
    <div className="w-full">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 bg-black/20 rounded-lg p-1 mb-4">
          <TabsTrigger
            value="overview"
            className="flex items-center justify-center gap-1.5 data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <BarChart className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex items-center justify-center gap-1.5 data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <History className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mode === 'manual' && (
              <div className="bg-black/20 rounded-xl p-4 border border-white/10 flex flex-col items-center justify-center">
                <div className="flex items-center mb-2">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                  <h3 className="text-lg font-medium text-white">Current Score</h3>
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent my-2">
                  {score.toLocaleString()}
                </div>
                <div className={`${levelBadge.color} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center mt-1`}>
                  <Star className="h-3.5 w-3.5 mr-1.5" />
                  {levelBadge.name}
                </div>

                {/* Progress to next level */}
                {score < 1000 && (
                  <div className="w-full mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Current: {score}</span>
                      <span>
                        Next: {score < 100 ? 100 : score < 200 ? 200 : score < 500 ? 500 : 1000}
                      </span>
                    </div>
                    <div className="w-full bg-[#001428] rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{
                          width: `${score < 100 ? (score/100)*100 :
                                  score < 200 ? ((score-100)/100)*100 :
                                  score < 500 ? ((score-200)/300)*100 :
                                  ((score-500)/500)*100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className={`bg-black/20 rounded-xl p-4 border border-white/10 flex flex-col items-center justify-center ${mode === 'auto' ? 'col-span-2' : ''}`}>
              <div className="flex items-center mb-2">
                <Zap className="h-5 w-5 mr-2 text-blue-400" />
                <h3 className="text-lg font-medium text-white">Code Readability</h3>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative inline-flex items-center justify-center">
                  {/* Background circle */}
                  <svg className="w-28 h-28">
                    <circle
                      className="text-gray-700"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r={radius}
                      cx="56"
                      cy="56"
                    />
                    {/* Progress circle with gradient */}
                    <linearGradient id="readabilityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={
                        normalizedReadabilityScore >= 80 ? "#4ade80" :
                        normalizedReadabilityScore >= 60 ? "#60a5fa" :
                        normalizedReadabilityScore >= 40 ? "#facc15" :
                        normalizedReadabilityScore >= 20 ? "#fb923c" : "#f87171"
                      } />
                      <stop offset="100%" stopColor={
                        normalizedReadabilityScore >= 80 ? "#22c55e" :
                        normalizedReadabilityScore >= 60 ? "#3b82f6" :
                        normalizedReadabilityScore >= 40 ? "#eab308" :
                        normalizedReadabilityScore >= 20 ? "#ea580c" : "#ef4444"
                      } />
                    </linearGradient>
                    <circle
                      stroke="url(#readabilityGradient)"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      r={radius}
                      cx="56"
                      cy="56"
                      transform="rotate(-90 56 56)"
                    />
                  </svg>
                  {/* Score text in the middle of the circle */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${readabilityColor}`}>{normalizedReadabilityScore}</span>
                    <span className="text-xs text-gray-400">/ 100</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <span className={`text-sm font-medium ${readabilityColor} mr-1`}>{readabilityLabel}</span>
                  <Award className={`h-4 w-4 ${readabilityColor}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-black/20 rounded-xl p-3 border border-white/10 flex items-center">
              <div className="bg-blue-500/20 rounded-full p-2 mr-3">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Transformations</div>
                <div className="text-xl font-semibold">{transformHistory.length}</div>
              </div>
            </div>
            <div className="bg-black/20 rounded-xl p-3 border border-white/10 flex items-center">
              <div className="bg-blue-500/20 rounded-full p-2 mr-3">
                <Zap className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Avg. Points</div>
                <div className="text-xl font-semibold">
                  {transformHistory.length > 0
                    ? Math.round(score / transformHistory.length)
                    : 0}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0 space-y-4">
          <div className="bg-black/20 rounded-xl p-4 border border-white/10">
            <h3 className="text-md font-medium text-white/90 mb-3 flex items-center">
              <History className="h-4 w-4 mr-2" />
              Transformation History
            </h3>

            {transformHistory.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800/50 mb-3">
                  <History className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm">No transformations applied yet.</p>
                <p className="text-gray-500 text-xs mt-1">Apply transformations to see your history.</p>
              </div>
            ) : (
              <ul className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {transformHistory.map((entry, index) => (
                  <li
                    key={index}
                    className="p-3 bg-black/30 rounded-lg border border-white/5 text-sm hover:bg-black/40 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mr-3">
                          <span className="text-xs font-bold">{transformHistory.length - index}</span>
                        </div>
                        <span className="font-medium text-white capitalize">
                          {entry.transformerId.replace(/-/g, ' ')}
                        </span>
                      </div>
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
                        +{entry.score} pts
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                      <span>Applied at: {formatTimestamp(entry.timestamp)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ScoreBoard;
