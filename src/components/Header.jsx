import { Pencil, Rocket, Code, Trophy, Home } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

/**
 * Header component for the game
 *
 * @returns {JSX.Element} Header component
 */
function Header() {
  const { mode, score, resetGame, setMode } = useGame();

  const getModeIcon = () => {
    if (mode === 'manual') {
      return <Pencil className="h-5 w-5 mr-2" />;
    } else if (mode === 'auto') {
      return <Rocket className="h-5 w-5 mr-2" />;
    }
    return null;
  };

  const getModeText = () => {
    if (mode === 'manual') {
      return 'Manual Mode';
    } else if (mode === 'auto') {
      return 'Auto Mode';
    }
    return 'Select Mode';
  };

  // Get badge color based on score
  const getScoreBadgeColor = () => {
    if (score >= 1000) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (score >= 500) return 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white';
    if (score >= 200) return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
    return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
  };

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-black/30 border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center mr-6">
              <Code className="h-6 w-6 mr-2 text-purple-400" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
                Code Transformer
              </h1>
            </div>

            {mode && (
              <Badge
                variant="secondary"
                className="flex items-center py-1.5 px-3 bg-white/10 hover:bg-white/20 transition-colors"
              >
                {getModeIcon()}
                <span className="text-sm font-medium">{getModeText()}</span>
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {mode === 'manual' && (
              <div className="flex items-center mr-2 bg-black/20 rounded-full px-4 py-1.5 border border-white/10">
                <Trophy className="h-4 w-4 mr-2 text-yellow-400" />
                <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500">
                  {score.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex space-x-1 bg-black/20 rounded-full p-1 border border-white/10">
              {/* Home button - goes to first page */}
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-8 w-8 hover:bg-white/10"
                      onClick={() => window.location.reload()}
                    >
                      <Home className="h-4 w-4 text-white/80" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    sideOffset={10}
                    avoidCollisions={true}
                    className="p-3 bg-gray-900/95 backdrop-blur-md border border-gray-800 text-white text-xs"
                  >
                    <div className="w-40 text-center whitespace-normal">
                      Go to Home Page
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Floating action button for mobile */}
      {mode && (
        <div className="fixed bottom-6 right-6 md:hidden z-30">
          <Button
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="icon"
          >
            <Trophy className="h-6 w-6" />
          </Button>
        </div>
      )}
    </header>
  );
}

export default Header;
