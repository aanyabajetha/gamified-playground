import { useState, useEffect, useRef } from 'react';
import CodeInput from './CodeInput';
import TransformControls from './TransformControls';
import ScoreBoard from './ScoreBoard';
import { applyTransformation } from '../utils/transformers';
import { calculateScore } from '../utils/scoring';

/**
 * CodeDisplay component for displaying code with syntax highlighting, line numbers, and copy button
 *
 * @param {Object} props - Component props
 * @param {string} props.code - Code to display
 * @param {string} props.label - Label for the code display
 * @param {string} props.placeholder - Placeholder text when no code is provided
 * @param {boolean} props.showLineNumbers - Whether to show line numbers (default: true)
 * @returns {JSX.Element} CodeDisplay component
 */
function CodeDisplay({ code = '', label = 'Code', placeholder = 'No code to display', showLineNumbers: initialShowLineNumbers = true }) {
  const [copied, setCopied] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(initialShowLineNumbers);
  const [formattedCode, setFormattedCode] = useState(code);
  const codeRef = useRef(null);

  // Update formatted code when code prop changes
  useEffect(() => {
    setFormattedCode(code);
  }, [code]);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (!formattedCode) return;

    navigator.clipboard.writeText(formattedCode)
      .then(() => {
        setCopied(true);
      })
      .catch(err => {
        console.error('Failed to copy code:', err);
      });
  };

  // Simple code formatter
  const formatCode = () => {
    if (!formattedCode) return;

    try {
      // For JavaScript code, attempt to format it
      // This is a very basic formatter - in a real app you'd use a library like prettier
      let formatted = '';
      let indentLevel = 0;
      const lines = formattedCode.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();

        // Skip empty lines
        if (!trimmed) {
          formatted += '\n';
          continue;
        }

        // Adjust indent level based on braces
        if (trimmed.includes('}') && !trimmed.includes('{')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        // Add indentation
        formatted += '  '.repeat(indentLevel) + trimmed + '\n';

        // Increase indent level for next line if this line has an opening brace
        if (trimmed.includes('{') && !trimmed.includes('}')) {
          indentLevel++;
        }
      }

      setFormattedCode(formatted.trim());
    } catch (error) {
      console.error('Error formatting code:', error);
    }
  };

  // Very basic syntax highlighting for JavaScript
  const highlightCode = (code) => {
    if (!code) return null;

    // Split code into lines for line numbers
    const lines = code.split('\n');

    // Process each line with syntax highlighting
    const processedLines = lines.map((line) => {
      // Replace keywords with styled spans
      return line
        // Keywords
        .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|throw)\b/g,
          '<span class="text-blue-400">$1</span>')
        // Strings
        .replace(/(['"`])(.*?)\1/g,
          '<span class="text-cyan-400">$1$2$1</span>')
        // Numbers
        .replace(/\b(\d+)\b/g,
          '<span class="text-blue-300">$1</span>')
        // Comments
        .replace(/(\/\/.*)/g,
          '<span class="text-gray-400">$1</span>')
        // Function calls
        .replace(/(\w+)(\s*\()/g,
          '<span class="text-cyan-300">$1</span>$2');
    });

    if (showLineNumbers) {
      // Create a table with line numbers
      const lineNumbersHtml = processedLines.map((line, index) => `
        <tr>
          <td class="text-right pr-2 select-none text-blue-400 border-r border-blue-500/30 w-10">${index + 1}</td>
          <td class="pl-2">${line || ' '}</td>
        </tr>
      `).join('');

      return (
        <div className="table-container">
          <table className="w-full border-collapse">
            <tbody dangerouslySetInnerHTML={{ __html: lineNumbersHtml }} />
          </table>
        </div>
      );
    } else {
      // Just return the highlighted code without line numbers
      return <div dangerouslySetInnerHTML={{ __html: processedLines.join('\n') }} />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-white">{label}</label>
        <div className="flex space-x-2">
          {code && (
            <>
              <button
                onClick={() => setShowLineNumbers(!showLineNumbers)}
                className="text-xs px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded transition-colors flex items-center"
                title={showLineNumbers ? "Hide line numbers" : "Show line numbers"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                {showLineNumbers ? 'Hide Lines' : 'Show Lines'}
              </button>

              <button
                onClick={formatCode}
                className="text-xs px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded transition-colors flex items-center"
                title="Format code with proper indentation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                </svg>
                Format
              </button>

              <button
                onClick={handleCopy}
                className="text-xs px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded transition-colors flex items-center"
                title="Copy to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className="w-full h-[200px] px-3 py-2 bg-[#001428]/80 border border-blue-500/30 rounded-md
                  font-mono text-sm text-white overflow-auto relative"
      >
        {code ? (
          <pre ref={codeRef} className="whitespace-pre-wrap break-words">
            {highlightCode(formattedCode)}
          </pre>
        ) : (
          <div className="text-blue-400 italic">{placeholder}</div>
        )}
      </div>
    </div>
  );
}

/**
 * CodeTransformer component that combines code input, transformation controls, and scoring
 *
 * @param {Object} props - Component props
 * @param {Array} props.availableTransformers - List of available transformers
 * @param {string} props.initialCode - Initial code to display
 * @param {Function} props.onScoreUpdate - Callback when score is updated
 * @param {Function} props.onRenameVariables - Callback for renaming variables
 * @param {Function} props.onFlattenControlFlow - Callback for flattening control flow
 * @param {Function} props.onRemoveDeadCode - Callback for removing dead code
 * @param {Function} props.onAutoDeobfuscate - Callback for auto deobfuscation
 * @returns {JSX.Element} CodeTransformer component
 */
function CodeTransformer({
  availableTransformers = [],
  initialCode = '',
  transformedCode: propTransformedCode = '', // Receive transformed code from props
  readabilityScore: propReadabilityScore = 0, // Receive readability score from props
  score: propScore = 0, // Receive score from props
  transformHistory: propTransformHistory = [], // Receive transformation history from props
  onScoreUpdate,
  onRenameVariables,
  onFlattenControlFlow,
  onRemoveDeadCode,
  onAutoDeobfuscate
}) {
  const [originalCode, setOriginalCode] = useState(initialCode || '');
  const [transformedCode, setTransformedCode] = useState(propTransformedCode || '');
  const [selectedTransformer, setSelectedTransformer] = useState(null);
  const [score, setScore] = useState(propScore || 0);
  const [readabilityScore, setReadabilityScore] = useState(propReadabilityScore || 0);
  const [transformHistory, setTransformHistory] = useState(propTransformHistory || []);

  // Update original code when initialCode prop changes
  useEffect(() => {
    console.log('CodeTransformer initialCode changed:', initialCode);
    if (initialCode) {
      setOriginalCode(initialCode);
    }
  }, [initialCode]);

  // Debug log for originalCode state
  useEffect(() => {
    console.log('CodeTransformer originalCode state:', originalCode);
  }, [originalCode]);

  // Update transformedCode when propTransformedCode changes
  useEffect(() => {
    console.log('CodeTransformer propTransformedCode changed:', propTransformedCode);
    if (propTransformedCode) {
      setTransformedCode(propTransformedCode);
    }
  }, [propTransformedCode]);

  // Update readabilityScore when propReadabilityScore changes
  useEffect(() => {
    if (propReadabilityScore) {
      setReadabilityScore(propReadabilityScore);
    }
  }, [propReadabilityScore]);

  // Update score when propScore changes
  useEffect(() => {
    if (propScore) {
      setScore(propScore);
    }
  }, [propScore]);

  // Update transformHistory when propTransformHistory changes
  useEffect(() => {
    console.log('CodeTransformer propTransformHistory changed:', propTransformHistory);
    if (propTransformHistory && propTransformHistory.length > 0) {
      setTransformHistory(propTransformHistory);
    }
  }, [propTransformHistory]);

  // Create wrapper functions for the quick action handlers
  // These will update the local state when the parent handlers are called
  const handleRenameVariables = () => {
    if (onRenameVariables) {
      // First call the parent handler
      onRenameVariables();

      // We'll rely on the parent component to pass the transformed code, score, and history back
      // through props in a future update via the useEffect hooks

      // Note: We don't need to manually update the local state here because
      // the useEffect hooks will update the state when the props change
    }
  };

  const handleFlattenControlFlow = () => {
    if (onFlattenControlFlow) {
      onFlattenControlFlow();
      // State will be updated via props and useEffect hooks
    }
  };

  const handleRemoveDeadCode = () => {
    if (onRemoveDeadCode) {
      onRemoveDeadCode();
      // State will be updated via props and useEffect hooks
    }
  };

  const handleAutoDeobfuscate = () => {
    if (onAutoDeobfuscate) {
      onAutoDeobfuscate();
      // State will be updated via props and useEffect hooks
    }
  };

  const handleInputChange = (newCode) => {
    setOriginalCode(newCode);
    // Reset transformed code when original code changes
    setTransformedCode('');
    // Reset readability score
    setReadabilityScore(0);
  };

  /**
   * Calculate readability score for code
   * Higher score means more readable code
   *
   * @param {string} code - Code to analyze
   * @returns {number} Readability score (0-100)
   */
  const calculateReadabilityScore = (code) => {
    if (!code) return 0;

    let score = 0;
    const lines = code.split('\n');

    // Factor 1: Line length (shorter lines are more readable)
    const avgLineLength = lines.reduce((sum, line) => sum + line.trim().length, 0) / lines.length;
    if (avgLineLength < 40) score += 20;
    else if (avgLineLength < 60) score += 15;
    else if (avgLineLength < 80) score += 10;
    else if (avgLineLength < 100) score += 5;

    // Factor 2: Indentation consistency
    const indentations = lines
      .filter(line => line.trim().length > 0)
      .map(line => line.length - line.trimStart().length);

    const uniqueIndentLevels = new Set(indentations).size;
    const indentConsistency = uniqueIndentLevels > 0 ? Math.min(5, uniqueIndentLevels) : 0;
    score += (5 - indentConsistency) * 5; // More consistent indentation = higher score

    // Factor 3: Variable naming (longer names are usually more descriptive)
    const variableMatches = code.match(/\b(const|let|var)\s+(\w+)/g) || [];
    const variableNames = variableMatches.map(match => match.split(/\s+/)[1]);
    const avgVarNameLength = variableNames.length > 0
      ? variableNames.reduce((sum, name) => sum + name.length, 0) / variableNames.length
      : 0;

    if (avgVarNameLength > 8) score += 20;
    else if (avgVarNameLength > 5) score += 15;
    else if (avgVarNameLength > 3) score += 10;
    else if (avgVarNameLength > 1) score += 5;

    // Factor 4: Comments presence
    const commentLines = (code.match(/\/\/.*/g) || []).length;
    const commentRatio = commentLines / lines.length;
    if (commentRatio > 0.2) score += 20;
    else if (commentRatio > 0.1) score += 15;
    else if (commentRatio > 0.05) score += 10;
    else if (commentRatio > 0) score += 5;

    // Factor 5: Code structure (presence of functions, classes, etc.)
    if (code.includes('function')) score += 10;
    if (code.includes('class')) score += 10;
    if (code.includes('return')) score += 5;
    if (code.includes('if') || code.includes('else')) score += 5;

    // Ensure score is between 0 and 100
    return Math.min(100, Math.max(0, score));
  };

  const handleTransformSelect = (transformerId) => {
    const transformer = availableTransformers.find(t => t.id === transformerId);
    setSelectedTransformer(transformer || null);
  };

  const handleApplyTransform = (transformerId, options) => {
    if (!originalCode) return;

    try {
      // Apply the transformation
      const result = applyTransformation(originalCode, transformerId, options);
      setTransformedCode(result.code);

      // Calculate readability score for the transformed code
      const newReadabilityScore = calculateReadabilityScore(result.code);
      setReadabilityScore(newReadabilityScore);

      // Calculate score for this transformation
      const transformScore = calculateScore(originalCode, result.code, transformerId);

      // Update total score
      const newScore = score + transformScore;
      setScore(newScore);

      // Add to history
      const historyEntry = {
        transformerId,
        options,
        originalCode,
        transformedCode: result.code,
        score: transformScore,
        timestamp: new Date()
      };

      setTransformHistory([...transformHistory, historyEntry]);

      // Notify parent component
      if (onScoreUpdate) {
        onScoreUpdate(newScore, historyEntry);
      }
    } catch (error) {
      console.error('Transformation error:', error);
      // Handle error (could show an error message to the user)
    }
  };

  return (
    <div className="w-full container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Original Code Card */}
        <div className="w-full">
          <div className="card-hover-effect bg-white/10 backdrop-blur-md border-white/20 rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-black/20">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <h3 className="text-lg font-semibold text-white ml-2">Original Code</h3>
              </div>
            </div>
            <div className="p-4">
              <CodeInput
                initialCode={originalCode}
                onInputChange={handleInputChange}
                label=""
                placeholder="Paste your obfuscated code here..."
              />
            </div>
          </div>
        </div>

        {/* Transformed Code Card */}
        <div className="w-full">
          <div className="card-hover-effect bg-white/10 backdrop-blur-md border-white/20 rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-black/20">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                <div className="h-3 w-3 rounded-full bg-cyan-500 mr-2"></div>
                <h3 className="text-lg font-semibold text-white ml-2">Transformed Code</h3>
              </div>
            </div>
            <div className="p-4">
              <CodeInput
                initialCode={transformedCode}
                readOnly={true}
                label=""
                placeholder="Transformed code will appear here..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transformation Controls Card */}
        <div className="w-full">
          <div className="card-hover-effect bg-white/10 backdrop-blur-md border-white/20 rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-black/20">
              <h3 className="text-lg font-semibold text-white">Transformation Tools</h3>
            </div>
            <div className="p-4">
              <TransformControls
                availableTransformers={availableTransformers}
                onTransformSelect={handleTransformSelect}
                onApplyTransform={handleApplyTransform}
                onRenameVariables={originalCode ? handleRenameVariables : null}
                onFlattenControlFlow={originalCode ? handleFlattenControlFlow : null}
                onRemoveDeadCode={originalCode ? handleRemoveDeadCode : null}
                onAutoDeobfuscate={originalCode ? handleAutoDeobfuscate : null}
              />
            </div>
          </div>
        </div>

        {/* Scoreboard Card */}
        <div className="w-full">
          <div className="card-hover-effect bg-white/10 backdrop-blur-md border-white/20 rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-black/20">
              <h3 className="text-lg font-semibold text-white">Performance Dashboard</h3>
            </div>
            <div className="p-4">
              <ScoreBoard
                score={score}
                transformHistory={transformHistory}
                readabilityScore={readabilityScore}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeTransformer;
