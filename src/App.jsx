import { useState, useEffect } from 'react'
import './App.css'
import { Trophy } from 'lucide-react'

// Import components
import CodeInput from './components/CodeInput'
import TransformControls from './components/TransformControls'
import CodeTransformer from './components/CodeTransformer'
import ScoreBoard from './components/ScoreBoard'
import Leaderboard from './components/Leaderboard'
import ModeSelection from './components/ModeSelection'
import ManualMode from './components/ManualMode'
import GameLayout from './components/GameLayout'
import { GameProvider, useGame } from './context/GameContext'
import { TooltipProvider } from './components/ui/tooltip'

// Import utilities
import {
  TRANSFORMERS,
  applyTransformation,
  renameVariables,
  flattenControlFlow,
  removeDeadCode
} from './utils/transformers'
import {
  calculateScore,
  calculateReadabilityScore,
  getChallengeScore
} from './utils/scoring'

// Main App component wrapper
function AppContent() {
  // Sample code examples
  const initialCode = `function greeting(name) {
  return \`Hello, \${name}!\`;
}

const result = greeting('World');
console.log(result);`;

  const obfuscatedCode = `var a=function(b){var c="Hello, "+b+"!";return c};
var d=a("World");console.log(d);`.trim();

  // Debug log for obfuscatedCode
  console.log('App obfuscatedCode:', obfuscatedCode);

  // Sample leaderboard data
  const leaderboardEntries = [
    { id: 1, name: 'Player 1', score: 120, transformations: 5, date: new Date('2023-10-15'), readabilityScore: 92 },
    { id: 2, name: 'Player 2', score: 85, transformations: 3, date: new Date('2023-10-16'), readabilityScore: 78 },
    { id: 3, name: 'Player 3', score: 150, transformations: 7, date: new Date('2023-10-14'), readabilityScore: 85 },
  ];

  // Get game context
  const {
    mode,
    originalCode, setOriginalCode,
    transformedCode, setTransformedCode,
    score, setScore,
    transformHistory, setTransformHistory
  } = useGame();

  // Initialize originalCode with obfuscatedCode if it's empty
  useEffect(() => {
    if (mode === 'auto' && !originalCode) {
      console.log('Initializing originalCode with obfuscatedCode');
      setOriginalCode(obfuscatedCode);
    }
  }, [mode, originalCode, obfuscatedCode, setOriginalCode]);

  // State for readability score
  const [readabilityScore, setReadabilityScore] = useState(0);

  // Handle code input change
  const handleCodeInputChange = (code) => {
    setOriginalCode(code);
    // Reset transformed code when original code changes
    setTransformedCode('');
    // Reset readability score
    setReadabilityScore(0);
  };

  // Handle applying a transformation
  const handleApplyTransform = (transformerId, options = {}) => {
    if (!originalCode) return;

    try {
      // Apply the transformation
      const result = applyTransformation(originalCode, transformerId, options);
      setTransformedCode(result.code);

      // Calculate readability score
      const newReadabilityScore = calculateReadabilityScore(result.code);
      setReadabilityScore(newReadabilityScore);

      // Calculate score using the new challenge scoring system
      const challengeScore = getChallengeScore(
        originalCode,
        result.code,
        transformHistory,
        true // isManualMode = true for manual mode
      );

      // Use the legacy scoring system as a fallback
      const legacyScore = calculateScore(originalCode, result.code, transformerId);

      // Use the challenge score if available, otherwise use the legacy score
      const transformScore = challengeScore.score || legacyScore;

      // Update total score
      const newScore = score + transformScore;
      setScore(newScore);

      // Add to history with the detailed breakdown
      const historyEntry = {
        transformerId,
        options,
        originalCode,
        transformedCode: result.code,
        score: transformScore,
        breakdown: challengeScore.breakdown, // Include the detailed score breakdown
        timestamp: new Date()
      };

      setTransformHistory(prev => [...prev, historyEntry]);
    } catch (error) {
      console.error('Transformation error:', error);
      // In a real app, you would show an error message to the user
    }
  };

  // Handler functions for transform actions
  const handleRenameVariables = () => {
    console.log('Renaming variables...', { originalCode });
    if (!originalCode) {
      console.error('No original code to transform');
      return;
    }
    try {
      // Apply the rename variables transformation
      const result = renameVariables(originalCode);
      setTransformedCode(result.code);

      // Calculate readability score
      const newReadabilityScore = calculateReadabilityScore(result.code);
      setReadabilityScore(newReadabilityScore);

      // Calculate score using the new challenge scoring system
      const challengeScore = getChallengeScore(
        originalCode,
        result.code,
        transformHistory,
        true // isManualMode = true for manual mode
      );

      // Use the legacy scoring system as a fallback
      const legacyScore = calculateScore(originalCode, result.code, 'rename-variables');

      // Use the challenge score if available, otherwise use the legacy score
      const transformScore = challengeScore.score || legacyScore;

      // Update total score
      const newScore = score + transformScore;
      setScore(newScore);

      // Add to history with the detailed breakdown
      const historyEntry = {
        transformerId: 'rename-variables',
        options: {},
        originalCode,
        transformedCode: result.code,
        score: transformScore,
        breakdown: challengeScore.breakdown, // Include the detailed score breakdown
        timestamp: new Date()
      };

      setTransformHistory(prev => [...prev, historyEntry]);
    } catch (error) {
      console.error('Rename variables error:', error);
    }
  };

  const handleFlattenControlFlow = () => {
    console.log('Flattening control flow...', { originalCode });
    if (!originalCode) {
      console.error('No original code to transform');
      return;
    }
    try {
      // Apply the flatten control flow transformation
      const result = flattenControlFlow(originalCode);
      setTransformedCode(result.code);

      // Calculate readability score
      const newReadabilityScore = calculateReadabilityScore(result.code);
      setReadabilityScore(newReadabilityScore);

      // Calculate score using the new challenge scoring system
      const challengeScore = getChallengeScore(
        originalCode,
        result.code,
        transformHistory,
        true // isManualMode = true for manual mode
      );

      // Use the legacy scoring system as a fallback
      const legacyScore = calculateScore(originalCode, result.code, 'flatten-control-flow');

      // Use the challenge score if available, otherwise use the legacy score
      const transformScore = challengeScore.score || legacyScore;

      // Update total score
      const newScore = score + transformScore;
      setScore(newScore);

      // Add to history with the detailed breakdown
      const historyEntry = {
        transformerId: 'flatten-control-flow',
        options: {},
        originalCode,
        transformedCode: result.code,
        score: transformScore,
        breakdown: challengeScore.breakdown, // Include the detailed score breakdown
        timestamp: new Date()
      };

      setTransformHistory(prev => [...prev, historyEntry]);
    } catch (error) {
      console.error('Flatten control flow error:', error);
    }
  };

  const handleRemoveDeadCode = () => {
    console.log('Removing dead code...', { originalCode });
    if (!originalCode) {
      console.error('No original code to transform');
      return;
    }
    try {
      // Apply the remove dead code transformation
      const result = removeDeadCode(originalCode);
      setTransformedCode(result.code);

      // Calculate readability score
      const newReadabilityScore = calculateReadabilityScore(result.code);
      setReadabilityScore(newReadabilityScore);

      // Calculate score using the new challenge scoring system
      const challengeScore = getChallengeScore(
        originalCode,
        result.code,
        transformHistory,
        true // isManualMode = true for manual mode
      );

      // Use the legacy scoring system as a fallback
      const legacyScore = calculateScore(originalCode, result.code, 'remove-dead-code');

      // Use the challenge score if available, otherwise use the legacy score
      const transformScore = challengeScore.score || legacyScore;

      // Update total score
      const newScore = score + transformScore;
      setScore(newScore);

      // Add to history with the detailed breakdown
      const historyEntry = {
        transformerId: 'remove-dead-code',
        options: {},
        originalCode,
        transformedCode: result.code,
        score: transformScore,
        breakdown: challengeScore.breakdown, // Include the detailed score breakdown
        timestamp: new Date()
      };

      setTransformHistory(prev => [...prev, historyEntry]);
    } catch (error) {
      console.error('Remove dead code error:', error);
    }
  };

  const handleAutoDeobfuscate = () => {
    console.log('Auto deobfuscating...', { originalCode });
    if (!originalCode) {
      console.error('No original code to transform');
      return;
    }
    try {
      // Apply multiple transformations in sequence
      let code = originalCode;

      // Step 1: Rename variables
      const renameResult = renameVariables(code);
      code = renameResult.code;

      // Step 2: Flatten control flow
      const flattenResult = flattenControlFlow(code);
      code = flattenResult.code;

      // Step 3: Remove dead code
      const removeResult = removeDeadCode(code);
      code = removeResult.code;

      // Set the final transformed code
      setTransformedCode(code);

      // Calculate readability score
      const newReadabilityScore = calculateReadabilityScore(code);
      setReadabilityScore(newReadabilityScore);

      // Calculate score using the new challenge scoring system
      const challengeScore = getChallengeScore(
        originalCode,
        code,
        transformHistory,
        false // isManualMode = false for auto mode
      );

      // Use the challenge score if available, otherwise use a fixed score
      const transformScore = challengeScore.score || 50;

      // Update total score
      const newScore = score + transformScore;
      setScore(newScore);

      // Add to history with the detailed breakdown
      const historyEntry = {
        transformerId: 'auto-deobfuscate',
        options: {},
        originalCode,
        transformedCode: code,
        score: transformScore,
        breakdown: challengeScore.breakdown, // Include the detailed score breakdown
        timestamp: new Date()
      };

      setTransformHistory(prev => [...prev, historyEntry]);
    } catch (error) {
      console.error('Auto deobfuscate error:', error);
    }
  };

  // If no mode is selected, show the mode selection screen
  if (!mode) {
    return <ModeSelection />;
  }

  // Render the appropriate mode component
  return (
    <GameLayout>
      <div className="space-y-8">
        {/* Render based on selected mode */}
        {mode === 'manual' ? (
          // Manual Mode
          <ManualMode />
        ) : (
          // Auto Mode
          <CodeTransformer
            availableTransformers={TRANSFORMERS}
            initialCode={obfuscatedCode}
            transformedCode={transformedCode} // Pass the transformed code
            readabilityScore={readabilityScore} // Pass the readability score
            score={score} // Pass the current score
            transformHistory={transformHistory} // Pass the transformation history
            onScoreUpdate={(newScore, historyEntry) => {
              setScore(newScore);
              if (historyEntry) {
                setTransformHistory(prev => [...prev, historyEntry]);
              }
            }}
            onRenameVariables={handleRenameVariables}
            onFlattenControlFlow={handleFlattenControlFlow}
            onRemoveDeadCode={handleRemoveDeadCode}
            onAutoDeobfuscate={handleAutoDeobfuscate}
          />
        )}

        {/* Leaderboard - only shown in manual mode */}
        <div className="bg-white/10 backdrop-blur-sm border-white/20 shadow-xl rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Leaderboard</h2>
          {mode === 'manual' ? (
            <Leaderboard entries={leaderboardEntries} />
          ) : (
            <div className="py-8 text-center">
              <div className="inline-block p-3 rounded-full bg-white/5 mb-4">
                <Trophy className="h-8 w-8 text-gray-500" />
              </div>
              <p className="text-gray-400 text-sm">Leaderboard is disabled in Auto Mode</p>
              <p className="text-gray-500 text-xs mt-1">Switch to Manual Mode to compete for points and appear on the leaderboard</p>
            </div>
          )}
        </div>
      </div>
    </GameLayout>
  );
}

// Main App component with providers
function App() {
  return (
    <TooltipProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </TooltipProvider>
  )
}

export default App
