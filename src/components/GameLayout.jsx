import { useGame } from '../context/GameContext';
import Header from './Header';
import { useEffect, useState } from 'react';

/**
 * GameLayout component for the main game layout
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} GameLayout component
 */
function GameLayout({ children }) {
  const { mode } = useGame();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position for subtle background effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate dynamic gradient based on mouse position
  const gradientStyle = {
    backgroundImage: `
      radial-gradient(
        circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
        rgba(0, 149, 255, 0.15) 0%,
        rgba(0, 0, 0, 0) 50%
      ),
      linear-gradient(
        135deg,
        #001428 0%,
        #001e3c 50%,
        #00162d 100%
      )
    `,
    backgroundSize: '200% 200%',
    animation: 'gradientAnimation 15s ease infinite'
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Animated background */}
      <div
        className="absolute inset-0 z-0 bg-black"
        style={gradientStyle}
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}

export default GameLayout;
