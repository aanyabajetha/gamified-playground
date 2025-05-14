/**
 * Utilities for calculating scores based on code transformations
 */

/**
 * Base points awarded for different transformation types
 */
export const TRANSFORMATION_POINTS = {
  'format': 10,
  'minify': 20,
  'es6-to-es5': 30,
  'jsx-to-js': 40,
  'rename-variables': 25,
  'flatten-control-flow': 35,
  'remove-dead-code': 30,
  // Add more transformers and their base points here
};

/**
 * Calculate score for a code transformation
 *
 * @param {string} originalCode - The original code before transformation
 * @param {string} transformedCode - The code after transformation
 * @param {string} transformerId - ID of the transformer that was applied
 * @returns {number} The calculated score for this transformation
 */
export function calculateScore(originalCode, transformedCode, transformerId) {
  // Get base points for this transformer type
  const basePoints = TRANSFORMATION_POINTS[transformerId] || 5;

  // Calculate complexity factor based on code length and changes
  const complexityFactor = calculateComplexityFactor(originalCode, transformedCode);

  // Calculate bonus points based on specific transformation metrics
  const bonusPoints = calculateBonusPoints(originalCode, transformedCode, transformerId);

  // Calculate total score
  const totalScore = Math.round(basePoints * complexityFactor + bonusPoints);

  return totalScore;
}

/**
 * Calculate complexity factor based on code characteristics
 *
 * @param {string} originalCode - Original code
 * @param {string} transformedCode - Transformed code
 * @returns {number} Complexity factor (multiplier for base points)
 */
function calculateComplexityFactor(originalCode, transformedCode) {
  // Calculate based on code length
  const originalLength = originalCode.length;
  const transformedLength = transformedCode.length;

  // Larger code gets higher complexity factor
  let lengthFactor = 1.0;
  if (originalLength > 1000) {
    lengthFactor = 1.5;
  } else if (originalLength > 500) {
    lengthFactor = 1.25;
  } else if (originalLength > 200) {
    lengthFactor = 1.1;
  }

  // Calculate change percentage
  const changePercentage = Math.abs(transformedLength - originalLength) / originalLength;
  let changeFactor = 1.0;

  if (changePercentage > 0.5) {
    changeFactor = 1.5;
  } else if (changePercentage > 0.3) {
    changeFactor = 1.3;
  } else if (changePercentage > 0.1) {
    changeFactor = 1.1;
  }

  return lengthFactor * changeFactor;
}

/**
 * Calculate bonus points based on specific transformation metrics
 *
 * @param {string} originalCode - Original code
 * @param {string} transformedCode - Transformed code
 * @param {string} transformerId - ID of the transformer that was applied
 * @returns {number} Bonus points to add to the score
 */
function calculateBonusPoints(originalCode, transformedCode, transformerId) {
  let bonus = 0;

  switch (transformerId) {
    case 'format':
      // Bonus for fixing indentation issues
      const originalIndentation = countIndentationIssues(originalCode);
      const transformedIndentation = countIndentationIssues(transformedCode);
      if (transformedIndentation < originalIndentation) {
        bonus += (originalIndentation - transformedIndentation) * 2;
      }
      break;

    case 'minify':
      // Bonus for significant size reduction
      const sizeReduction = (originalCode.length - transformedCode.length) / originalCode.length;
      if (sizeReduction > 0.5) {
        bonus += 30;
      } else if (sizeReduction > 0.3) {
        bonus += 20;
      } else if (sizeReduction > 0.1) {
        bonus += 10;
      }
      break;

    case 'es6-to-es5':
      // Bonus for each ES6 feature converted
      const arrowFunctionsConverted = countOccurrences(originalCode, '=>') - countOccurrences(transformedCode, '=>');
      const letConstConverted = (countOccurrences(originalCode, 'let ') + countOccurrences(originalCode, 'const ')) -
                               (countOccurrences(transformedCode, 'let ') + countOccurrences(transformedCode, 'const '));

      bonus += arrowFunctionsConverted * 5;
      bonus += letConstConverted * 3;
      break;

    case 'jsx-to-js':
      // Bonus for each JSX element converted
      const jsxElementsConverted = countOccurrences(originalCode, '<') - countOccurrences(transformedCode, '<');
      bonus += jsxElementsConverted * 5;
      break;

    case 'rename-variables':
      // Bonus for improving variable name length
      // Extract variable names from both versions
      const originalVarDeclarations = originalCode.match(/\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g) || [];
      const transformedVarDeclarations = transformedCode.match(/\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g) || [];

      const originalVarNames = originalVarDeclarations.map(decl => decl.split(/\s+/)[1]);
      const transformedVarNames = transformedVarDeclarations.map(decl => decl.split(/\s+/)[1]);

      // Calculate average variable name length in both versions
      const originalAvgLength = originalVarNames.length > 0
        ? originalVarNames.reduce((sum, name) => sum + name.length, 0) / originalVarNames.length
        : 0;

      const transformedAvgLength = transformedVarNames.length > 0
        ? transformedVarNames.reduce((sum, name) => sum + name.length, 0) / transformedVarNames.length
        : 0;

      // Bonus for increasing average variable name length
      if (transformedAvgLength > originalAvgLength) {
        const improvement = transformedAvgLength - originalAvgLength;
        bonus += Math.round(improvement * 10);
      }

      // Bonus for reducing number of single-letter variables
      const originalShortVars = originalVarNames.filter(name => name.length === 1).length;
      const transformedShortVars = transformedVarNames.filter(name => name.length === 1).length;

      if (transformedShortVars < originalShortVars) {
        bonus += (originalShortVars - transformedShortVars) * 5;
      }
      break;

    case 'flatten-control-flow':
      // Bonus for reducing nesting levels
      const originalNestingLevel = calculateMaxNestingLevel(originalCode);
      const transformedNestingLevel = calculateMaxNestingLevel(transformedCode);

      if (transformedNestingLevel < originalNestingLevel) {
        bonus += (originalNestingLevel - transformedNestingLevel) * 10;
      }
      break;

    case 'remove-dead-code':
      // Bonus for removing unreachable code blocks
      const unreachableBlocksRemoved = (originalCode.match(/if\s*\(\s*(false|0)\s*\)/g) || []).length -
                                      (transformedCode.match(/if\s*\(\s*(false|0)\s*\)/g) || []).length;

      bonus += unreachableBlocksRemoved * 15;

      // Bonus for removing empty blocks
      const emptyBlocksRemoved = (originalCode.match(/{\s*}/g) || []).length -
                                (transformedCode.match(/{\s*}/g) || []).length;

      bonus += emptyBlocksRemoved * 5;

      // Bonus for code size reduction
      const codeReduction = (originalCode.length - transformedCode.length) / originalCode.length;
      if (codeReduction > 0.2) {
        bonus += 20;
      } else if (codeReduction > 0.1) {
        bonus += 10;
      } else if (codeReduction > 0.05) {
        bonus += 5;
      }
      break;
  }

  return bonus;
}

/**
 * Calculate the maximum nesting level in code
 *
 * @param {string} code - Code to analyze
 * @returns {number} Maximum nesting level
 */
function calculateMaxNestingLevel(code) {
  const lines = code.split('\n');
  let currentLevel = 0;
  let maxLevel = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Count opening braces
    const openBraces = (trimmed.match(/{/g) || []).length;

    // Count closing braces
    const closeBraces = (trimmed.match(/}/g) || []).length;

    // Update current nesting level
    currentLevel += openBraces - closeBraces;

    // Update max level if current level is higher
    maxLevel = Math.max(maxLevel, currentLevel);
  }

  return maxLevel;
}

/**
 * Count occurrences of a substring in a string
 *
 * @param {string} str - String to search in
 * @param {string} searchStr - Substring to search for
 * @returns {number} Number of occurrences
 */
function countOccurrences(str, searchStr) {
  let count = 0;
  let position = str.indexOf(searchStr);

  while (position !== -1) {
    count++;
    position = str.indexOf(searchStr, position + 1);
  }

  return count;
}

/**
 * Count indentation issues in code
 *
 * @param {string} code - Code to analyze
 * @returns {number} Number of indentation issues found
 */
function countIndentationIssues(code) {
  const lines = code.split('\n');
  let issues = 0;
  let expectedIndent = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue; // Skip empty lines

    // Check if line has correct indentation
    const actualIndent = line.length - line.trimStart().length;
    const expectedSpaces = expectedIndent * 2; // Assuming 2 spaces per indent level

    if (actualIndent !== expectedSpaces) {
      issues++;
    }

    // Update expected indent for next line
    if (trimmed.endsWith('{')) {
      expectedIndent++;
    } else if (trimmed.startsWith('}')) {
      expectedIndent = Math.max(0, expectedIndent - 1);
    }
  }

  return issues;
}

/**
 * Get leaderboard entries sorted by score
 *
 * @param {Array} entries - Array of score entries
 * @returns {Array} Sorted leaderboard entries
 */
export function getLeaderboard(entries) {
  return [...entries].sort((a, b) => b.score - a.score);
}

/**
 * Calculate a readability score for code
 * Higher score means more readable code
 *
 * @param {string} code - Code to analyze
 * @returns {number} Readability score between 0 and 100
 */
export function calculateReadabilityScore(code) {
  if (!code || typeof code !== 'string') {
    return 0;
  }

  // Initialize score at 100 (perfect readability)
  let score = 100;

  // Split code into lines for analysis
  const lines = code.split('\n');

  // Subtract: 10 points for each use of `eval` or `Function`
  const evalUsage = (code.match(/eval\s*\(/g) || []).length;
  const functionConstructorUsage = (code.match(/new\s+Function\s*\(/g) || []).length;
  score -= (evalUsage + functionConstructorUsage) * 10;

  // Subtract: 5 points for each variable named with 1 character
  const singleCharVarPattern = /\b(var|let|const)\s+([a-zA-Z])\b/g;
  const singleCharVars = [...code.matchAll(singleCharVarPattern)];
  score -= singleCharVars.length * 5;

  // Subtract: 5 points for deeply nested structures (more than 3 levels)
  // Count the number of consecutive opening braces as a simple heuristic
  const deepNestingPattern = /\{[^\{\}]*\{[^\{\}]*\{[^\{\}]*\{/g;
  const deepNestings = (code.match(deepNestingPattern) || []).length;
  score -= deepNestings * 5;

  // Subtract: 5 points if code length > 500 characters
  if (code.length > 500) {
    score -= 5;
  }

  // Add: 10 points for descriptive variable names (2+ words or camelCase)
  const descriptiveVarPattern = /\b(var|let|const)\s+([a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*|[a-zA-Z]+_[a-zA-Z]+)\b/g;
  const descriptiveVars = [...code.matchAll(descriptiveVarPattern)];
  score += descriptiveVars.length * 10;

  // Add: 5 points if functions are less than 15 lines
  const functionPattern = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*\{([^}]*)\}/g;
  const functions = [...code.matchAll(functionPattern)];

  for (const match of functions) {
    const functionBody = match[2];
    const lineCount = (functionBody.match(/\n/g) || []).length + 1;

    if (lineCount < 15) {
      score += 5;
    }
  }

  // Also check for arrow functions and anonymous functions
  const arrowFunctionPattern = /\([^)]*\)\s*=>\s*\{([^}]*)\}/g;
  const arrowFunctions = [...code.matchAll(arrowFunctionPattern)];

  for (const match of arrowFunctions) {
    const functionBody = match[1];
    const lineCount = (functionBody.match(/\n/g) || []).length + 1;

    if (lineCount < 15) {
      score += 5;
    }
  }

  // Clamp final score between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculate a challenge mode score comparing original and transformed code
 *
 * @param {string} originalCode - The original obfuscated code
 * @param {string} transformedCode - The transformed/deobfuscated code
 * @returns {Object} Object containing score and breakdown
 */
export function getChallengeScore(originalCode, transformedCode) {
  // Initialize base score and breakdown object
  let score = 50; // Start at middle point
  const breakdown = {
    tokenCount: 0,
    variableNameImprovement: 0,
    evalRemoval: 0,
    formatting: 0,
    total: 0
  };

  // 1. Compare token count between input and output
  const originalTokens = countTokens(originalCode);
  const transformedTokens = countTokens(transformedCode);

  // If token count is reduced (removing unnecessary code) or slightly increased (better naming)
  const tokenRatio = transformedTokens / originalTokens;
  if (tokenRatio < 0.8) {
    // Significant reduction in tokens (good for minified code)
    breakdown.tokenCount = 15;
  } else if (tokenRatio <= 1.2) {
    // Reasonable token count change
    breakdown.tokenCount = 10;
  } else if (tokenRatio > 1.5) {
    // Too many tokens added
    breakdown.tokenCount = -5;
  }

  // 2. Count improvement in variable name length
  const originalVarInfo = analyzeVariableNames(originalCode);
  const transformedVarInfo = analyzeVariableNames(transformedCode);

  // Calculate average length improvement
  const originalAvgLength = originalVarInfo.avgLength;
  const transformedAvgLength = transformedVarInfo.avgLength;

  if (transformedAvgLength > originalAvgLength) {
    const improvement = transformedAvgLength - originalAvgLength;
    breakdown.variableNameImprovement = Math.min(25, Math.round(improvement * 8));
  }

  // 3. Penalize if any eval remains
  const originalEvalCount = (originalCode.match(/eval\s*\(/g) || []).length;
  const transformedEvalCount = (transformedCode.match(/eval\s*\(/g) || []).length;

  if (originalEvalCount > 0 && transformedEvalCount === 0) {
    // All eval calls removed
    breakdown.evalRemoval = 20;
  } else if (originalEvalCount > transformedEvalCount) {
    // Some eval calls removed
    breakdown.evalRemoval = 10;
  } else if (transformedEvalCount > 0) {
    // Eval calls still present
    breakdown.evalRemoval = -10;
  }

  // 4. Add bonus if code formatting is applied
  const formattingScore = assessFormatting(originalCode, transformedCode);
  breakdown.formatting = formattingScore;

  // Calculate total score
  score += breakdown.tokenCount +
           breakdown.variableNameImprovement +
           breakdown.evalRemoval +
           breakdown.formatting;

  // Clamp score between 0 and 100
  breakdown.total = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score: breakdown.total,
    breakdown
  };
}

/**
 * Count the number of tokens in code
 *
 * @param {string} code - Code to analyze
 * @returns {number} Number of tokens
 */
function countTokens(code) {
  // Simple tokenization by splitting on whitespace and punctuation
  const tokens = code.split(/[\s\(\)\{\}\[\]\;\,\.\+\-\*\/\=\!\<\>\&\|\^\%\?\:\~]+/)
    .filter(token => token.length > 0);

  return tokens.length;
}

/**
 * Analyze variable names in code
 *
 * @param {string} code - Code to analyze
 * @returns {Object} Object with variable name statistics
 */
function analyzeVariableNames(code) {
  // Extract variable declarations
  const varDeclarationPattern = /\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
  const declarations = [...code.matchAll(varDeclarationPattern)];

  // Extract variable names
  const varNames = declarations.map(match => match[2]);

  // Calculate statistics
  const totalLength = varNames.reduce((sum, name) => sum + name.length, 0);
  const avgLength = varNames.length > 0 ? totalLength / varNames.length : 0;
  const shortNames = varNames.filter(name => name.length <= 2).length;
  const descriptiveNames = varNames.filter(name =>
    name.length > 3 && (/[A-Z]/.test(name) || name.includes('_'))
  ).length;

  return {
    count: varNames.length,
    avgLength,
    shortNames,
    descriptiveNames
  };
}

/**
 * Assess code formatting improvements
 *
 * @param {string} originalCode - Original code
 * @param {string} transformedCode - Transformed code
 * @returns {number} Formatting score
 */
function assessFormatting(originalCode, transformedCode) {
  let score = 0;

  // Check line count - properly formatted code often has more lines
  const originalLines = originalCode.split('\n').length;
  const transformedLines = transformedCode.split('\n').length;

  if (transformedLines > originalLines * 1.2) {
    // Significant increase in line count suggests better formatting
    score += 10;
  }

  // Check indentation consistency
  const originalIndentIssues = countIndentationIssues(originalCode);
  const transformedIndentIssues = countIndentationIssues(transformedCode);

  if (transformedIndentIssues < originalIndentIssues) {
    score += Math.min(15, (originalIndentIssues - transformedIndentIssues));
  }

  // Check for line length improvement (avoiding very long lines)
  const originalLongLines = originalCode.split('\n')
    .filter(line => line.trim().length > 100).length;
  const transformedLongLines = transformedCode.split('\n')
    .filter(line => line.trim().length > 100).length;

  if (transformedLongLines < originalLongLines) {
    score += Math.min(10, (originalLongLines - transformedLongLines) * 2);
  }

  return score;
}
