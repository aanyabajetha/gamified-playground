import { Pencil, Rocket, Trophy, Zap, Code, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useState, useEffect } from 'react';

/**
 * ModeSelection component for selecting game mode
 *
 * @returns {JSX.Element} ModeSelection component
 */
function ModeSelection() {
  const { setMode } = useGame();
  const [showIntro, setShowIntro] = useState(true);

  // Auto-hide intro after 3 seconds
  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => setShowIntro(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden">
      {/* Background with animated gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#001428] via-[#001e3c] to-[#00162d] bg-[length:400%_400%] animate-gradient z-0"
        style={{ animation: 'gradientAnimation 15s ease infinite' }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 z-0">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl">
        {showIntro ? (
          <div className="text-center animate-fadeIn">
            <div className="inline-block p-6 mb-6 rounded-full bg-white/10 backdrop-blur-md animate-pulse">
              <Code className="h-20 w-20 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg animate-fadeInUp">
              Code Transformation Challenge
            </h1>
            <p className="text-2xl text-white/90 animate-fadeInUp animation-delay-200">
              Master the art of code deobfuscation
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-10 animate-fadeInUp">
              <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300">
                  Code Transformation Challenge
                </span>
              </h1>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                <p className="text-xl text-white/90">
                  Choose a mode to continue your coding adventure
                </p>
                <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card
                      className="card-hover-effect bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group overflow-hidden"
                      onClick={() => handleModeSelect('manual')}
                    >
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <CardHeader className="text-center relative z-10">
                        <div className="mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 p-5 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20">
                          <Pencil className="h-14 w-14 text-white" />
                        </div>
                        <CardTitle className="text-white text-3xl font-bold">Manual Mode</CardTitle>
                        <CardDescription className="text-white/80 text-lg mt-2">
                          Earn points by writing transformations from scratch
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-white/70 text-center relative z-10">
                        <div className="space-y-4">
                          <p className="text-lg">Challenge yourself by manually improving code readability and structure.</p>
                          <div className="flex items-center justify-center gap-4 mt-4">
                            <div className="flex items-center text-yellow-300">
                              <Trophy className="h-5 w-5 mr-1" />
                              <span>Earn Points</span>
                            </div>
                            <div className="flex items-center text-green-300">
                              <Zap className="h-5 w-5 mr-1" />
                              <span>Build Skills</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="justify-center relative z-10 pb-6">
                        <Button variant="glow" size="lg" className="w-full text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-500">
                          Select Manual Mode
                        </Button>
                      </CardFooter>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-blue-800 text-white p-3 text-sm">
                    <p>Earn points by writing transformations from scratch.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card
                      className="card-hover-effect bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group overflow-hidden"
                      onClick={() => handleModeSelect('auto')}
                    >
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <CardHeader className="text-center relative z-10">
                        <div className="mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 p-5 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20">
                          <Rocket className="h-14 w-14 text-white" />
                        </div>
                        <CardTitle className="text-white text-3xl font-bold">Auto Mode</CardTitle>
                        <CardDescription className="text-white/80 text-lg mt-2">
                          Practice without scoring pressure
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-white/70 text-center relative z-10">
                        <div className="space-y-4">
                          <p className="text-lg">Learn and experiment with automated transformations without scoring.</p>
                          <div className="flex items-center justify-center gap-4 mt-4">
                            <div className="flex items-center text-blue-300">
                              <Sparkles className="h-5 w-5 mr-1" />
                              <span>Auto Transform</span>
                            </div>
                            <div className="flex items-center text-cyan-300">
                              <Code className="h-5 w-5 mr-1" />
                              <span>Learn Patterns</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="justify-center relative z-10 pb-6">
                        <Button
                          variant="glow"
                          size="lg"
                          className="w-full text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-500"
                        >
                          Select Auto Mode
                        </Button>
                      </CardFooter>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-blue-800 text-white p-3 text-sm">
                    <p>Practice without scoring pressure.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ModeSelection;
