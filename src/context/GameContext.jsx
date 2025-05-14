import { createContext, useContext, useState } from 'react';

// Create the context
const GameContext = createContext(undefined);

/**
 * GameProvider component to manage game state
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} GameProvider component
 */
export function GameProvider({ children }) {
  // Game mode state
  const [mode, setMode] = useState(null); // 'manual' or 'auto' or null (not selected)
  
  // Score state
  const [score, setScore] = useState(0);
  
  // Transform history
  const [transformHistory, setTransformHistory] = useState([]);
  
  // Code state
  const [originalCode, setOriginalCode] = useState('');
  const [transformedCode, setTransformedCode] = useState('');
  
  // Function to update score
  const updateScore = (newScore, historyEntry) => {
    setScore(newScore);
    if (historyEntry) {
      setTransformHistory([...transformHistory, historyEntry]);
    }
  };
  
  // Function to reset game
  const resetGame = () => {
    setMode(null);
    setScore(0);
    setTransformHistory([]);
    setOriginalCode('');
    setTransformedCode('');
  };
  
  // Value object to be provided by the context
  const value = {
    mode,
    setMode,
    score,
    setScore,
    transformHistory,
    setTransformHistory,
    originalCode,
    setOriginalCode,
    transformedCode,
    setTransformedCode,
    updateScore,
    resetGame,
  };
  
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

/**
 * Custom hook to use the game context
 * 
 * @returns {Object} Game context value
 */
export function useGame() {
  const context = useContext(GameContext);
  
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
}
