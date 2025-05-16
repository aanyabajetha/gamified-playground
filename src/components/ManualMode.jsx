import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { validateDeobfuscation } from '../utils/api';
import { Check, X, Loader2, Code, Pencil, Trophy } from 'lucide-react';
import CodeInput from './CodeInput';
import ScoreBoard from './ScoreBoard';
import { calculateReadabilityScore } from '../utils/scoring';

/**
 * ManualMode component for the manual deobfuscation mode
 *
 * @returns {JSX.Element} ManualMode component
 */
function ManualMode() {
  const { score, setScore, updateScore, transformHistory } = useGame();

  // Sample obfuscated code - in a real app, this would be fetched or generated
  const [obfuscatedCode, setObfuscatedCode] = useState(`
var a=function(b){var c="Hello, "+b+"!";return c};
var d=a("World");console.log(d);
  `.trim());

  // User's deobfuscated code
  const [userCode, setUserCode] = useState('');

  // Readability score for the user's code
  const [readabilityScore, setReadabilityScore] = useState(0);

  // Validation state
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  // Update readability score when user code changes
  useEffect(() => {
    if (userCode.trim()) {
      const newReadabilityScore = calculateReadabilityScore(userCode);
      setReadabilityScore(newReadabilityScore);
    } else {
      setReadabilityScore(0);
    }
  }, [userCode]);

  // Handle user code input change
  const handleUserCodeChange = (code) => {
    setUserCode(code);

    // Reset validation when code changes
    if (validationResult) {
      setValidationResult(null);
    }
  };

  // Handle validation submission
  const handleSubmitForValidation = async () => {
    if (!userCode.trim()) {
      setValidationResult({
        isCorrect: false,
        explanation: "Please enter your deobfuscated code",
        score: 0
      });
      return;
    }

    setIsValidating(true);

    try {
      const result = await validateDeobfuscation(obfuscatedCode, userCode);
      setValidationResult(result);

      // If correct, update the score
      if (result.isCorrect) {
        const newScore = score + result.score;

        // Create history entry with breakdown
        const historyEntry = {
          transformerId: 'manual-deobfuscation',
          options: {},
          originalCode: obfuscatedCode,
          transformedCode: userCode,
          score: result.score,
          // Include the detailed score breakdown
          breakdown: {
            clarityGain: Math.round(result.score * 0.4), // 40% of score
            transformAccuracy: Math.round(result.score * 0.25), // 25% of score
            obfuscationReduction: Math.round(result.score * 0.15), // 15% of score
            efficiency: Math.round(result.score * 0.1), // 10% of score
            stepWiseOptimization: Math.round(result.score * 0.1), // 10% of score
            bonus: result.bonus || 0,
            penalty: result.penalty || 0,
            total: result.score
          },
          timestamp: new Date()
        };

        // Update score with history
        updateScore(newScore, historyEntry);
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResult({
        isCorrect: false,
        explanation: `Error: ${error.message}`,
        score: 0
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Get a new challenge
  const handleNewChallenge = () => {
    // In a real app, this would fetch a new challenge from an API or database
    // For now, we'll just use a few sample challenges
    const challenges = [
      `var a=function(b){var c="Hello, "+b+"!";return c};var d=a("World");console.log(d);`,
      `function x(y){return y.split("").reverse().join("")}console.log(x("JavaScript"));`,
      `var z=5;var w=10;var q=z+w;console.log("Sum: "+q);`,
      `var f=function(g){return g*g};var h=f(4);console.log("Square: "+h);`
    ];

    // Select a random challenge that's different from the current one
    let newChallenge;
    do {
      newChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    } while (newChallenge === obfuscatedCode && challenges.length > 1);

    setObfuscatedCode(newChallenge);
    setUserCode('');
    setValidationResult(null);
  };

  return (
    <div className="w-full container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Obfuscated Code Card */}
        <div className="w-full">
          <Card className="card-hover-effect bg-white/10 backdrop-blur-md border-white/20 rounded-xl shadow-xl overflow-hidden h-full">
            <CardHeader className="p-4 border-b border-white/10 bg-black/20">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <CardTitle className="text-lg font-semibold text-white ml-2 flex items-center">
                  <Code className="h-5 w-5 mr-2 text-blue-400" />
                  Obfuscated Code
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CodeInput
                initialCode={obfuscatedCode}
                readOnly={true}
                label=""
                placeholder="Loading obfuscated code..."
              />
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-end">
              <Button
                variant="outline"
                className="bg-blue-600/20 hover:bg-blue-600/40 border-blue-500/50 text-white"
                onClick={handleNewChallenge}
              >
                Get New Challenge
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* User Code Input Card */}
        <div className="w-full">
          <Card className="card-hover-effect bg-white/10 backdrop-blur-md border-white/20 rounded-xl shadow-xl overflow-hidden h-full">
            <CardHeader className="p-4 border-b border-white/10 bg-black/20">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                <div className="h-3 w-3 rounded-full bg-cyan-500 mr-2"></div>
                <CardTitle className="text-lg font-semibold text-white ml-2 flex items-center">
                  <Pencil className="h-5 w-5 mr-2 text-purple-400" />
                  Your Deobfuscated Code
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CodeInput
                initialCode={userCode}
                onInputChange={handleUserCodeChange}
                label=""
                placeholder="Write your deobfuscated version here..."
              />
            </CardContent>
            <CardFooter className="p-4 pt-0 flex flex-col items-stretch">
              <Button
                variant="glow"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 mb-4"
                onClick={handleSubmitForValidation}
                disabled={isValidating || !userCode.trim()}
              >
                {isValidating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>Submit for Evaluation</>
                )}
              </Button>

              {validationResult && (
                <div className={`p-4 rounded-lg ${
                  validationResult.isCorrect
                    ? 'bg-green-900/30 border border-green-500/50'
                    : 'bg-red-900/30 border border-red-500/50'
                }`}>
                  <div className="flex items-center mb-2">
                    {validationResult.isCorrect ? (
                      <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1 px-2 py-1">
                        <Check className="h-3.5 w-3.5" />
                        <span>Correct</span>
                      </Badge>
                    ) : (
                      <Badge className="bg-red-600 hover:bg-red-700 flex items-center gap-1 px-2 py-1">
                        <X className="h-3.5 w-3.5" />
                        <span>Incorrect</span>
                      </Badge>
                    )}

                    {validationResult.isCorrect && (
                      <Badge className="ml-2 bg-purple-600 hover:bg-purple-700 flex items-center gap-1 px-2 py-1">
                        <Trophy className="h-3.5 w-3.5" />
                        <span>+{validationResult.score} points</span>
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-white/80">{validationResult.explanation}</p>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Performance Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="w-full">
          <Card className="card-hover-effect bg-white/10 backdrop-blur-md border-white/20 rounded-xl shadow-xl overflow-hidden">
            <CardHeader className="p-4 border-b border-white/10 bg-black/20">
              <CardTitle className="text-lg font-semibold text-white">Performance Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScoreBoard
                score={score}
                transformHistory={transformHistory}
                readabilityScore={readabilityScore}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ManualMode;
