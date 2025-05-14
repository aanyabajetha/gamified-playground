import { useState, useEffect } from 'react';
import { Textarea } from './ui/textarea';
import { Label } from '@radix-ui/react-label';
import { Copy, Check, Code2, FileCode } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

/**
 * CodeInput component for entering and editing code
 *
 * @param {Object} props - Component props
 * @param {string} props.initialCode - Initial code to display
 * @param {Function} props.onInputChange - Callback when code changes
 * @param {boolean} props.readOnly - Whether the code input is read-only
 * @param {string} props.placeholder - Placeholder text for the textarea
 * @param {string} props.label - Optional label for the textarea
 * @returns {JSX.Element} CodeInput component
 */
function CodeInput({
  initialCode = '',
  onInputChange,
  readOnly = false,
  placeholder = "Paste your code here...",
  label = "Code Input"
}) {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Update internal state when initialCode prop changes
  useEffect(() => {
    setCode(initialCode);
    updateCodeStats(initialCode);
  }, [initialCode]);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const updateCodeStats = (codeText) => {
    if (codeText) {
      setLineCount(codeText.split('\n').length);
      setCharCount(codeText.length);
    } else {
      setLineCount(0);
      setCharCount(0);
    }
  };

  const handleChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    updateCodeStats(newCode);
    if (onInputChange) {
      onInputChange(newCode);
    }
  };

  const handleCopy = () => {
    if (!code) return;

    navigator.clipboard.writeText(code)
      .then(() => {
        setCopied(true);
      })
      .catch(err => {
        console.error('Failed to copy code:', err);
      });
  };

  return (
    <div className="w-full">
      {label && (
        <Label
          htmlFor="code-input"
          className="block text-sm font-medium text-white mb-2"
        >
          {label}
        </Label>
      )}

      <div className="relative">
        <Textarea
          id="code-input"
          className="w-full h-[300px] font-mono text-sm resize-y bg-[#001428]/80 text-white border-blue-500/30
                    focus-visible:ring-blue-500 focus-visible:ring-opacity-50 placeholder:text-blue-500/50
                    rounded-lg shadow-inner"
          value={code}
          onChange={handleChange}
          readOnly={readOnly}
          placeholder={placeholder}
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />

        {/* Floating action buttons */}
        <div className="absolute top-2 right-2 flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-300"
                  onClick={handleCopy}
                  disabled={!code}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{copied ? 'Copied!' : 'Copy code'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Code stats footer */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center">
          {code ? (
            <>
              <FileCode className="h-3.5 w-3.5 mr-1.5" />
              <span>{lineCount} lines</span>
              <span className="mx-2">•</span>
              <span>{charCount} characters</span>
            </>
          ) : (
            <span className="italic">{!readOnly ? 'Paste your code here to transform it.' : 'No code to display yet.'}</span>
          )}
        </div>

        {readOnly && code && (
          <div className="flex items-center text-blue-400">
            <Code2 className="h-3.5 w-3.5 mr-1.5" />
            <span>Transformed</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeInput;
