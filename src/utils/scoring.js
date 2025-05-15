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
 * Based on the DecipherHub scoring rubric
 *
 * @param {string} originalCode - The original obfuscated code
 * @param {string} transformedCode - The transformed/deobfuscated code
 * @param {Array} transformHistory - History of transformations applied
 * @param {boolean} isManualMode - Whether the transformation was done in manual mode
 * @returns {Object} Object containing score and breakdown
 */
export function getChallengeScore(originalCode, transformedCode, transformHistory = [], isManualMode = true) {
  // Initialize breakdown object based on the scoring rubric
  const breakdown = {
    clarityGain: 0,          // 40 points
    transformAccuracy: 0,    // 25 points
    obfuscationReduction: 0, // 15 points
    efficiency: 0,           // 10 points
    stepWiseOptimization: 0, // 10 points
    bonus: 0,                // Bonus points
    penalty: 0,              // Penalty points
    total: 0
  };

  // 1. Clarity Gain (40 points)
  breakdown.clarityGain = calculateClarityGain(originalCode, transformedCode);

  // 2. Transformation Accuracy (25 points)
  breakdown.transformAccuracy = calculateTransformAccuracy(originalCode, transformedCode);

  // 3. Obfuscation Marker Reduction (15 points)
  breakdown.obfuscationReduction = calculateObfuscationReduction(originalCode, transformedCode, transformHistory);

  // 4. Manual vs Auto Efficiency (10 points)
  breakdown.efficiency = calculateEfficiency(originalCode, transformedCode, transformHistory, isManualMode);

  // 5. Step-wise Optimization (10 points)
  breakdown.stepWiseOptimization = calculateStepWiseOptimization(transformHistory);

  // Calculate bonus and penalty points
  const bonusPenalty = calculateBonusPenalty(originalCode, transformedCode, transformHistory);
  breakdown.bonus = bonusPenalty.bonus;
  breakdown.penalty = bonusPenalty.penalty;

  // Calculate total score
  const rawScore = breakdown.clarityGain +
                  breakdown.transformAccuracy +
                  breakdown.obfuscationReduction +
                  breakdown.efficiency +
                  breakdown.stepWiseOptimization +
                  breakdown.bonus -
                  breakdown.penalty;

  // Clamp score between 0 and 100
  breakdown.total = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    score: breakdown.total,
    breakdown
  };
}

/**
 * Calculate clarity gain score (40 points max)
 * Measures readability improvements using token entropy reduction,
 * variable/function name improvements, and structure simplification
 *
 * @param {string} originalCode - Original obfuscated code
 * @param {string} transformedCode - Transformed code
 * @returns {number} Clarity gain score (0-40)
 */
function calculateClarityGain(originalCode, transformedCode) {
  let score = 0;

  // 1. Token entropy reduction (15 points)
  const originalEntropy = calculateTokenEntropy(originalCode);
  const transformedEntropy = calculateTokenEntropy(transformedCode);

  if (originalEntropy > transformedEntropy) {
    // Lower entropy is better - more predictable code
    const entropyReduction = originalEntropy - transformedEntropy;
    score += Math.min(15, Math.round(entropyReduction * 10));
  }

  // 2. Variable/function name improvements (15 points)
  const originalVarInfo = analyzeVariableNames(originalCode);
  const transformedVarInfo = analyzeVariableNames(transformedCode);

  // Calculate average length improvement
  const originalAvgLength = originalVarInfo.avgLength;
  const transformedAvgLength = transformedVarInfo.avgLength;

  if (transformedAvgLength > originalAvgLength) {
    const improvement = transformedAvgLength - originalAvgLength;
    score += Math.min(10, Math.round(improvement * 5));
  }

  // Reward for increasing descriptive names
  if (transformedVarInfo.descriptiveNames > originalVarInfo.descriptiveNames) {
    const descriptiveImprovement = transformedVarInfo.descriptiveNames - originalVarInfo.descriptiveNames;
    score += Math.min(5, descriptiveImprovement);
  }

  // 3. Structure simplification (10 points)
  // Check for flattened control flow
  const originalNestingLevel = calculateMaxNestingLevel(originalCode);
  const transformedNestingLevel = calculateMaxNestingLevel(transformedCode);

  if (transformedNestingLevel < originalNestingLevel) {
    const nestingReduction = originalNestingLevel - transformedNestingLevel;
    score += Math.min(10, nestingReduction * 3);
  }

  return Math.min(40, score);
}

/**
 * Calculate transformation accuracy score (25 points max)
 * Ensures logical equivalence is preserved post-transformation
 *
 * @param {string} originalCode - Original obfuscated code
 * @param {string} transformedCode - Transformed code
 * @returns {number} Transformation accuracy score (0-25)
 */
function calculateTransformAccuracy(originalCode, transformedCode) {
  // This is a simplified approach since we can't actually execute the code
  // In a real implementation, you might run tests or compare ASTs

  let score = 25; // Start with full points and deduct as needed

  // 1. Check if key structures are preserved (15 points)
  // Look for function signatures, return statements, etc.
  const originalFunctions = extractFunctionSignatures(originalCode);
  const transformedFunctions = extractFunctionSignatures(transformedCode);

  // If original had functions but transformed has none, deduct points
  if (originalFunctions.length > 0 && transformedFunctions.length === 0) {
    score -= 15;
  }
  // If function count differs significantly, deduct some points
  else if (Math.abs(originalFunctions.length - transformedFunctions.length) > 1) {
    score -= 10;
  }

  // 2. Check for preserved key operations (10 points)
  // Look for important operators and keywords
  const keyOperators = ['return', 'new', 'typeof', 'instanceof', 'await', 'yield'];

  for (const operator of keyOperators) {
    const originalCount = countOccurrences(originalCode, operator);
    const transformedCount = countOccurrences(transformedCode, operator);

    // If an important operator is missing in the transformed code, deduct points
    if (originalCount > 0 && transformedCount === 0) {
      score -= 2;
    }
  }

  return Math.max(0, score);
}

/**
 * Calculate obfuscation marker reduction score (15 points max)
 * Awards points for removing obfuscation techniques
 *
 * @param {string} originalCode - Original obfuscated code
 * @param {string} transformedCode - Transformed code
 * @param {Array} transformHistory - History of transformations
 * @returns {number} Obfuscation reduction score (0-15)
 */
function calculateObfuscationReduction(originalCode, transformedCode, transformHistory) {
  let score = 0;

  // 1. Check for eval, Function, setTimeout with code strings (8 points)
  const obfuscationMarkers = [
    { pattern: /eval\s*\(/g, weight: 3 },
    { pattern: /new\s+Function\s*\(/g, weight: 3 },
    { pattern: /setTimeout\s*\(\s*['"`].*?['"`]/g, weight: 2 }
  ];

  for (const marker of obfuscationMarkers) {
    const originalCount = (originalCode.match(marker.pattern) || []).length;
    const transformedCount = (transformedCode.match(marker.pattern) || []).length;

    if (originalCount > 0 && transformedCount === 0) {
      // All instances removed
      score += marker.weight;
    } else if (originalCount > transformedCount) {
      // Some instances removed
      score += Math.floor((originalCount - transformedCount) / originalCount * marker.weight);
    }
  }

  // 2. Check for encoded strings (hex/unicode) (4 points)
  const encodedStringPatterns = [
    { pattern: /\\x[0-9a-f]{2}/gi, weight: 2 }, // hex escape sequences
    { pattern: /\\u[0-9a-f]{4}/gi, weight: 2 }  // unicode escape sequences
  ];

  for (const pattern of encodedStringPatterns) {
    const originalCount = (originalCode.match(pattern.pattern) || []).length;
    const transformedCount = (transformedCode.match(pattern.pattern) || []).length;

    if (originalCount > 0) {
      const reductionRatio = (originalCount - transformedCount) / originalCount;
      score += Math.floor(reductionRatio * pattern.weight);
    }
  }

  // 3. Check for unused junk code or dead code paths (3 points)
  // This is a simplified check - in reality, you'd need more sophisticated analysis
  const deadCodePatterns = [
    { pattern: /if\s*\(\s*false\s*\)/g, weight: 1 },
    { pattern: /if\s*\(\s*0\s*\)/g, weight: 1 },
    { pattern: /{\s*}/g, weight: 1 } // empty blocks
  ];

  for (const pattern of deadCodePatterns) {
    const originalCount = (originalCode.match(pattern.pattern) || []).length;
    const transformedCount = (transformedCode.match(pattern.pattern) || []).length;

    if (originalCount > transformedCount) {
      score += Math.min(pattern.weight, originalCount - transformedCount);
    }
  }

  // Apply penalty if obfuscation markers persist after multiple steps
  if (transformHistory.length > 3) {
    const evalRemains = (transformedCode.match(/eval\s*\(/g) || []).length > 0;
    const functionRemains = (transformedCode.match(/new\s+Function\s*\(/g) || []).length > 0;

    if (evalRemains || functionRemains) {
      score = Math.max(0, score - 3); // Penalty for persistent obfuscation
    }
  }

  return Math.min(15, score);
}

/**
 * Calculate efficiency score (10 points max)
 * Rewards intelligent edits or effective auto-suggestions
 *
 * @param {string} originalCode - Original obfuscated code
 * @param {string} transformedCode - Transformed code
 * @param {Array} transformHistory - History of transformations
 * @param {boolean} isManualMode - Whether in manual mode
 * @returns {number} Efficiency score (0-10)
 */
function calculateEfficiency(originalCode, transformedCode, transformHistory, isManualMode) {
  let score = 5; // Start with middle score

  // Different scoring based on mode
  if (isManualMode) {
    // In manual mode, reward meaningful changes with fewer edits
    const changeRatio = calculateChangeRatio(originalCode, transformedCode);
    const stepCount = transformHistory.length;

    if (changeRatio > 0.3 && stepCount <= 3) {
      // Significant changes in few steps - very efficient
      score += 5;
    } else if (changeRatio > 0.2 && stepCount <= 5) {
      // Good changes in reasonable steps
      score += 3;
    } else if (changeRatio > 0.1) {
      // Some meaningful changes
      score += 1;
    } else if (stepCount > 10 && changeRatio < 0.05) {
      // Many steps with little change - inefficient
      score -= 3;
    }
  } else {
    // In auto mode, evaluate the quality of auto-transformations
    // Check if transformations made meaningful improvements
    const readabilityImprovement = calculateReadabilityScore(transformedCode) -
                                  calculateReadabilityScore(originalCode);

    if (readabilityImprovement > 30) {
      score += 5;
    } else if (readabilityImprovement > 15) {
      score += 3;
    } else if (readabilityImprovement < 0) {
      score -= 3;
    }
  }

  return Math.max(0, Math.min(10, score));
}

/**
 * Calculate step-wise optimization score (10 points max)
 * Encourages fewer, efficient steps with meaningful progress
 *
 * @param {Array} transformHistory - History of transformations
 * @returns {number} Step-wise optimization score (0-10)
 */
function calculateStepWiseOptimization(transformHistory) {
  if (!transformHistory || transformHistory.length === 0) {
    return 5; // Neutral score if no history
  }

  let score = 10; // Start with full points

  // 1. Check for undo/redo loops or redundant edits
  let redundantEdits = 0;
  const transformerCounts = {};

  // Count how many times each transformer was used
  transformHistory.forEach(entry => {
    const transformerId = entry.transformerId;
    transformerCounts[transformerId] = (transformerCounts[transformerId] || 0) + 1;
  });

  // Penalize excessive use of the same transformer
  Object.values(transformerCounts).forEach(count => {
    if (count > 3) {
      redundantEdits += count - 3;
    }
  });

  // Deduct points for redundant edits
  score -= Math.min(5, redundantEdits);

  // 2. Reward for consistent progress
  // This would ideally analyze the actual code changes between steps
  // For simplicity, we'll use the number of steps as a proxy
  if (transformHistory.length <= 5) {
    // Few steps is generally good
    score += 0; // Already at max
  } else if (transformHistory.length <= 10) {
    // Moderate number of steps
    score -= 2;
  } else {
    // Too many steps
    score -= 5;
  }

  return Math.max(0, score);
}

/**
 * Calculate bonus and penalty points
 *
 * @param {string} originalCode - Original obfuscated code
 * @param {string} transformedCode - Transformed code
 * @param {Array} transformHistory - History of transformations
 * @returns {Object} Object with bonus and penalty points
 */
function calculateBonusPenalty(originalCode, transformedCode, transformHistory) {
  let bonus = 0;
  let penalty = 0;

  // Bonus: +10 points → First successful clean deobfuscation in minimal steps
  if (transformHistory.length <= 5 &&
      calculateReadabilityScore(transformedCode) > 80 &&
      !transformedCode.includes('eval')) {
    bonus += 10;
  }

  // Bonus: +5 points → AI suggestion accepted and verified as useful
  // This would need to be tracked elsewhere and passed in
  // For now, we'll assume any transformation with "auto" in the ID is an AI suggestion
  const aiSuggestionUsed = transformHistory.some(entry =>
    entry.transformerId.includes('auto') || entry.transformerId.includes('ai'));

  if (aiSuggestionUsed) {
    bonus += 5;
  }

  // Penalty: −5 points → More than 50% of steps undone or reset
  // This would need more detailed history tracking
  // For simplicity, we'll skip this for now

  // Penalty: −10 points → Retained obfuscation markers after 5 steps
  if (transformHistory.length > 5) {
    const hasEval = transformedCode.includes('eval');
    const hasFunction = transformedCode.includes('new Function');

    if (hasEval || hasFunction) {
      penalty += 10;
    }
  }

  return { bonus, penalty };
}

/**
 * Calculate token entropy to measure code complexity/obfuscation
 *
 * @param {string} code - Code to analyze
 * @returns {number} Token entropy value
 */
function calculateTokenEntropy(code) {
  // Extract tokens
  const tokens = code.split(/[\s\(\)\{\}\[\]\;\,\.\+\-\*\/\=\!\<\>\&\|\^\%\?\:\~]+/)
    .filter(token => token.length > 0);

  if (tokens.length === 0) return 0;

  // Count frequency of each token
  const tokenFreq = {};
  tokens.forEach(token => {
    tokenFreq[token] = (tokenFreq[token] || 0) + 1;
  });

  // Calculate entropy
  let entropy = 0;
  const totalTokens = tokens.length;

  Object.values(tokenFreq).forEach(freq => {
    const probability = freq / totalTokens;
    entropy -= probability * Math.log2(probability);
  });

  return entropy;
}

/**
 * Extract function signatures from code
 *
 * @param {string} code - Code to analyze
 * @returns {Array} Array of function signatures
 */
function extractFunctionSignatures(code) {
  const functionPatterns = [
    /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)/g,
    /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*function\s*\([^)]*\)/g,
    /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*function\s*\([^)]*\)/g,
    /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\([^)]*\)\s*=>/g
  ];

  let signatures = [];

  functionPatterns.forEach(pattern => {
    const matches = [...code.matchAll(pattern)];
    signatures = signatures.concat(matches.map(match => match[0]));
  });

  return signatures;
}

/**
 * Calculate the ratio of changes between original and transformed code
 *
 * @param {string} originalCode - Original code
 * @param {string} transformedCode - Transformed code
 * @returns {number} Change ratio between 0 and 1
 */
function calculateChangeRatio(originalCode, transformedCode) {
  if (!originalCode) return 0;

  // Simple diff approach - count character differences
  let differences = 0;
  const maxLength = Math.max(originalCode.length, transformedCode.length);

  for (let i = 0; i < maxLength; i++) {
    if (originalCode[i] !== transformedCode[i]) {
      differences++;
    }
  }

  return differences / maxLength;
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
