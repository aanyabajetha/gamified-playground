/**
 * Collection of code transformation functions and utilities
 */

/**
 * Available transformers with their configurations
 */
export const TRANSFORMERS = [
  {
    id: 'format',
    name: 'Format Code',
    description: 'Formats code with proper indentation and spacing',
    options: {}
  },
  {
    id: 'minify',
    name: 'Minify Code',
    description: 'Removes whitespace and shortens code',
    options: {
      removeComments: {
        type: 'boolean',
        default: true,
        label: 'Remove comments'
      }
    }
  },
  {
    id: 'es6-to-es5',
    name: 'ES6 to ES5',
    description: 'Converts modern JavaScript to ES5 compatible code',
    options: {}
  },
  {
    id: 'jsx-to-js',
    name: 'JSX to JavaScript',
    description: 'Converts JSX syntax to plain JavaScript',
    options: {}
  },
  {
    id: 'rename-variables',
    name: 'Rename Variables',
    description: 'Replaces short variable names with more descriptive ones',
    options: {
      preserveBuiltins: {
        type: 'boolean',
        default: true,
        label: 'Preserve built-in names'
      }
    }
  },
  {
    id: 'flatten-control-flow',
    name: 'Flatten Control Flow',
    description: 'Simplifies nested control flow structures',
    options: {
      maxDepth: {
        type: 'number',
        default: 2,
        label: 'Maximum nesting depth'
      }
    }
  },
  {
    id: 'remove-dead-code',
    name: 'Remove Dead Code',
    description: 'Removes unreachable code blocks',
    options: {
      removeEmptyBlocks: {
        type: 'boolean',
        default: true,
        label: 'Remove empty blocks'
      }
    }
  },
  {
    id: 'auto-deobfuscate',
    name: 'Auto Deobfuscate',
    description: 'Automatically applies multiple transformations to improve code readability',
    options: {
      preserveBuiltins: {
        type: 'boolean',
        default: true,
        label: 'Preserve built-in names'
      },
      removeEmptyBlocks: {
        type: 'boolean',
        default: true,
        label: 'Remove empty blocks'
      }
    }
  }
];

/**
 * Apply a transformation to the provided code
 *
 * @param {string} code - The original code to transform
 * @param {string} transformerId - ID of the transformer to apply
 * @param {Object} options - Options for the transformation
 * @returns {Object} Object containing transformed code and metadata
 */
export function applyTransformation(code, transformerId, options = {}) {
  // Find the requested transformer
  const transformer = TRANSFORMERS.find(t => t.id === transformerId);

  if (!transformer) {
    throw new Error(`Transformer '${transformerId}' not found`);
  }

  // Apply the appropriate transformation based on ID
  switch (transformerId) {
    case 'format':
      return formatCode(code);

    case 'minify':
      return minifyCode(code, options);

    case 'es6-to-es5':
      return convertES6ToES5(code);

    case 'jsx-to-js':
      return convertJSXToJS(code);

    case 'rename-variables':
      return renameVariables(code, options);

    case 'flatten-control-flow':
      return flattenControlFlow(code, options);

    case 'remove-dead-code':
      return removeDeadCode(code, options);

    case 'auto-deobfuscate':
      return autoDeobfuscate(code, options);

    default:
      throw new Error(`Transformer '${transformerId}' has no implementation`);
  }
}

/**
 * Format code with proper indentation and spacing
 *
 * @param {string} code - Code to format
 * @returns {Object} Formatted code and metadata
 */
function formatCode(code) {
  // Simple formatting implementation
  // In a real app, you might use a library like prettier

  // This is a very basic implementation
  let formatted = '';
  let indentLevel = 0;
  const lines = code.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Adjust indent level based on braces
    if (trimmed.endsWith('{')) {
      formatted += '  '.repeat(indentLevel) + trimmed + '\n';
      indentLevel++;
    } else if (trimmed.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
      formatted += '  '.repeat(indentLevel) + trimmed + '\n';
    } else if (trimmed.length > 0) {
      formatted += '  '.repeat(indentLevel) + trimmed + '\n';
    } else {
      formatted += '\n'; // Preserve empty lines
    }
  }

  return {
    code: formatted,
    stats: {
      linesChanged: lines.length
    }
  };
}

/**
 * Minify code by removing whitespace
 *
 * @param {string} code - Code to minify
 * @param {Object} options - Minification options
 * @returns {Object} Minified code and metadata
 */
function minifyCode(code, options = {}) {
  const { removeComments = true } = options;

  // Remove comments if option is enabled
  let processed = code;
  if (removeComments) {
    // Remove single-line comments
    processed = processed.replace(/\/\/.*$/gm, '');
    // Remove multi-line comments
    processed = processed.replace(/\/\*[\s\S]*?\*\//g, '');
  }

  // Remove extra whitespace
  processed = processed
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')')
    .trim();

  return {
    code: processed,
    stats: {
      originalSize: code.length,
      minifiedSize: processed.length,
      reduction: Math.round((1 - processed.length / code.length) * 100)
    }
  };
}

/**
 * Convert ES6 code to ES5 compatible code
 *
 * @param {string} code - ES6 code to convert
 * @returns {Object} Converted code and metadata
 */
function convertES6ToES5(code) {
  // This is a simplified implementation
  // In a real app, you would use Babel or a similar transpiler

  let converted = code;

  // Convert arrow functions to regular functions
  converted = converted.replace(/const\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*{/g, 'function $1($2) {');
  converted = converted.replace(/\(([^)]*)\)\s*=>\s*{/g, 'function($1) {');

  // Convert let/const to var
  converted = converted.replace(/let\s+/g, 'var ');
  converted = converted.replace(/const\s+/g, 'var ');

  // Convert template literals to string concatenation
  // This is a very basic implementation that won't handle all cases
  converted = converted.replace(/`([^`]*)\${([^}]*)}\s*([^`]*)`/g, '"$1" + $2 + "$3"');

  return {
    code: converted,
    stats: {
      transformations: {
        arrowFunctions: (code.match(/=>/g) || []).length,
        letConst: (code.match(/let |const /g) || []).length,
        templateLiterals: (code.match(/\${/g) || []).length
      }
    }
  };
}

/**
 * Convert JSX code to plain JavaScript
 *
 * @param {string} code - JSX code to convert
 * @returns {Object} Converted code and metadata
 */
function convertJSXToJS(code) {
  // This is a simplified implementation
  // In a real app, you would use Babel or a similar transpiler

  let converted = code;

  // Convert simple JSX elements to React.createElement calls
  // This is a very basic implementation that won't handle all cases
  converted = converted.replace(/<(\w+)([^>]*)>([^<]*)<\/\1>/g, 'React.createElement("$1", $2, "$3")');

  return {
    code: converted,
    stats: {
      elementsConverted: (code.match(/<\w+/g) || []).length
    }
  };
}

/**
 * Rename short variable names to more descriptive ones
 *
 * @param {string} code - Code with short variable names
 * @param {Object} options - Renaming options
 * @returns {Object} Code with renamed variables and metadata
 */
export function renameVariables(code, options = {}) {
  const { preserveBuiltins = true } = options;

  // Common short variable names and their more descriptive replacements based on common usage
  const commonVariableMap = {
    a: 'value',
    b: 'input',
    c: 'result',
    d: 'data',
    e: 'error',
    f: 'func',
    g: 'group',
    h: 'handler',
    i: 'index',
    j: 'counter',
    k: 'key',
    l: 'length',
    m: 'map',
    n: 'number',
    o: 'object',
    p: 'param',
    q: 'queue',
    r: 'response',
    s: 'string',
    t: 'temp',
    u: 'user',
    v: 'value',
    w: 'width',
    x: 'xCoord',
    y: 'yCoord',
    z: 'zone'
  };

  // Built-in names and common loop variables to preserve
  const builtins = [
    'window', 'document', 'console', 'Math', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Date',
    'RegExp', 'Map', 'Set', 'Promise', 'JSON', 'Error', 'Function', 'parseInt', 'parseFloat', 'isNaN',
    'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'fetch', 'XMLHttpRequest'
  ];

  // Common loop variables that might be intentionally short
  const commonLoopVars = ['i', 'j', 'k', 'x', 'y', 'n'];

  let renamed = code;
  let replacements = 0;

  // Try to detect context for variables
  const contextualRenaming = {};

  // Check for loop variables
  const forLoopPattern = /for\s*\(\s*(var|let|const)?\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=.*?;.*?;.*?\)/g;
  const forLoopMatches = [...code.matchAll(forLoopPattern)];
  forLoopMatches.forEach(match => {
    const loopVar = match[2];
    if (loopVar && loopVar.length <= 2) {
      contextualRenaming[loopVar] = 'index';
      if (loopVar !== 'i') {
        // If we already have an 'i', name others more specifically
        contextualRenaming[loopVar] = `${loopVar}Index`;
      }
    }
  });

  // Check for while loop variables
  const whileLoopPattern = /while\s*\([^)]*([a-zA-Z_$][a-zA-Z0-9_$]*)[^)]*\)/g;
  const whileLoopMatches = [...code.matchAll(whileLoopPattern)];
  whileLoopMatches.forEach(match => {
    const loopVar = match[1];
    if (loopVar && loopVar.length <= 2 && !contextualRenaming[loopVar]) {
      contextualRenaming[loopVar] = 'counter';
    }
  });

  // Check for function parameters that might indicate purpose
  const functionParamPattern = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(\s*([^)]*)\s*\)/g;
  const functionMatches = [...code.matchAll(functionParamPattern)];
  functionMatches.forEach(match => {
    const funcName = match[1];
    const params = match[2].split(',').map(p => p.trim());

    // If function name gives context to parameters
    if (funcName) {
      if (funcName.includes('get') || funcName.includes('fetch')) {
        // Likely a getter function
        params.forEach((param, idx) => {
          if (param.length <= 2 && idx === 0) {
            contextualRenaming[param] = 'id';
          }
        });
      } else if (funcName.includes('calc') || funcName.includes('compute')) {
        // Likely a calculation function
        params.forEach((param, idx) => {
          if (param.length <= 2) {
            contextualRenaming[param] = idx === 0 ? 'value' : 'factor';
          }
        });
      } else if (funcName.includes('set') || funcName.includes('update')) {
        // Likely a setter function
        params.forEach((param, idx) => {
          if (param.length <= 2 && idx === 0) {
            contextualRenaming[param] = 'newValue';
          }
        });
      }
    }
  });

  // Also check for anonymous functions and arrow functions
  const anonymousFuncPattern = /(?:var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*function\s*\(\s*([^)]*)\s*\)/g;
  const anonymousFuncMatches = [...code.matchAll(anonymousFuncPattern)];
  anonymousFuncMatches.forEach(match => {
    const funcName = match[1];
    const params = match[2].split(',').map(p => p.trim());

    params.forEach((param, idx) => {
      if (param.length <= 2) {
        contextualRenaming[param] = idx === 0 ? 'param' : `param${idx + 1}`;
      }
    });
  });

  // Check for array operations that might indicate purpose
  const arrayOpPattern = /([a-zA-Z_$][a-zA-Z0-9_$]*)\.(map|filter|reduce|forEach|find|some|every)\s*\(\s*(?:function|\(([^)]*)\)\s*=>)/g;
  const arrayOpMatches = [...code.matchAll(arrayOpPattern)];
  arrayOpMatches.forEach(match => {
    const arrayMethod = match[2];
    const arrowParam = match[3];

    if (arrowParam && arrowParam.length <= 2) {
      if (arrayMethod === 'map') {
        contextualRenaming[arrowParam] = 'item';
      } else if (arrayMethod === 'filter') {
        contextualRenaming[arrowParam] = 'item';
      } else if (arrayMethod === 'reduce') {
        contextualRenaming[arrowParam] = 'acc';
      } else if (arrayMethod === 'forEach') {
        contextualRenaming[arrowParam] = 'item';
      } else if (arrayMethod === 'find' || arrayMethod === 'some' || arrayMethod === 'every') {
        contextualRenaming[arrowParam] = 'item';
      }
    }
  });

  // Find all variable declarations
  const varDeclarationPattern = /\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*=\s*([^;]+))?/g;
  const varDeclarations = [...code.matchAll(varDeclarationPattern)];

  // Extract variable names and try to determine context from initialization
  const varNames = new Set();
  const varContexts = {};

  varDeclarations.forEach(match => {
    const varName = match[2];
    const initExpression = match[3];

    varNames.add(varName);

    // Try to determine context from initialization
    if (initExpression) {
      if (initExpression.includes('new Date')) {
        varContexts[varName] = 'date';
      } else if (initExpression.includes('document.getElementById') || initExpression.includes('querySelector')) {
        varContexts[varName] = 'element';
      } else if (initExpression.includes('[]')) {
        varContexts[varName] = 'array';
      } else if (initExpression.includes('{}')) {
        varContexts[varName] = 'object';
      } else if (initExpression.includes('function') || initExpression.includes('=>')) {
        varContexts[varName] = 'callback';
      } else if (/\d+(\.\d+)?/.test(initExpression) && !/['"`]/.test(initExpression)) {
        varContexts[varName] = 'number';
      } else if (/['"`]/.test(initExpression)) {
        varContexts[varName] = 'text';
      } else if (/true|false/.test(initExpression)) {
        varContexts[varName] = 'flag';
      }
    }
  });

  // Check for switch statements to identify mapping objects
  const switchPattern = /switch\s*\(([^)]+)\)/g;
  const switchMatches = [...code.matchAll(switchPattern)];
  switchMatches.forEach(match => {
    const switchExpr = match[1];
    if (switchExpr.includes('[')) {
      // This might be a mapping object
      const mappingMatch = switchExpr.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\[/);
      if (mappingMatch && mappingMatch[1] && mappingMatch[1].length <= 2) {
        contextualRenaming[mappingMatch[1]] = 'mappings';
      }
    }
  });

  // Filter out variables we don't want to rename
  const varsToRename = [...varNames].filter(name => {
    // Skip common loop variables if they appear in typical loop contexts
    if (commonLoopVars.includes(name) && contextualRenaming[name] === 'index') {
      return false;
    }

    // Skip if it's a built-in and we want to preserve those
    if (preserveBuiltins && builtins.includes(name)) {
      return false;
    }

    // Skip if it's already descriptive (longer than 2 chars)
    if (name.length > 2) {
      return false;
    }

    return true;
  });

  // Create a map of variables to rename for this specific code
  const renameMap = {};

  varsToRename.forEach(name => {
    // First check if we have contextual information
    if (contextualRenaming[name]) {
      renameMap[name] = contextualRenaming[name];
    }
    // Then check if we have context from initialization
    else if (varContexts[name]) {
      const context = varContexts[name];
      if (context === 'date') {
        renameMap[name] = 'date';
      } else if (context === 'element') {
        renameMap[name] = 'element';
      } else if (context === 'array') {
        renameMap[name] = 'items';
      } else if (context === 'object') {
        renameMap[name] = 'data';
      } else if (context === 'callback') {
        renameMap[name] = 'callback';
      } else if (context === 'number') {
        renameMap[name] = 'value';
      } else if (context === 'text') {
        renameMap[name] = 'text';
      } else if (context === 'flag') {
        renameMap[name] = 'isEnabled';
      }
    }
    // Fall back to common variable map
    else if (name.length === 1 && commonVariableMap[name]) {
      renameMap[name] = commonVariableMap[name];
    }
    // For 2-letter variables, try to make something more descriptive
    else {
      renameMap[name] = name + 'Value';
    }
  });

  // Perform the replacements
  Object.entries(renameMap).forEach(([oldName, newName]) => {
    // Use regex with word boundaries to avoid partial replacements
    const regex = new RegExp(`\\b${oldName}\\b`, 'g');
    const count = (code.match(regex) || []).length;

    if (count > 0) {
      renamed = renamed.replace(regex, newName);
      replacements += count;
    }
  });

  // Format the code after renaming for better readability
  renamed = formatCode(renamed).code;

  return {
    code: renamed,
    stats: {
      variablesRenamed: Object.keys(renameMap).length,
      totalReplacements: replacements,
      renameMap
    }
  };
}

/**
 * Flatten nested control flow structures
 *
 * @param {string} code - Code with nested control flow
 * @param {Object} options - Flattening options
 * @returns {Object} Code with flattened control flow and metadata
 */
export function flattenControlFlow(code, options = {}) {
  const { maxDepth = 2 } = options;

  let flattened = code;
  let transformations = {
    nestedIfs: 0,
    nestedLoops: 0,
    whileTrue: 0,
    switchMappings: 0
  };

  // 1. Handle nested if statements
  // This is a simplified approach that works for basic cases
  // In a real implementation, you would use a proper parser and AST manipulation

  // Find deeply nested if statements (3 or more levels)
  const deepNestedIfPattern = /if\s*\([^{]*\)\s*{[^{]*if\s*\([^{]*\)\s*{[^{]*if\s*\([^{]*\)\s*{/g;
  const deepNestedIfs = [...(flattened.match(deepNestedIfPattern) || [])];

  if (deepNestedIfs.length > 0) {
    // For each deeply nested if, try to flatten it using if-else-if structure
    deepNestedIfs.forEach(nestedIfStart => {
      // Find the full nested if block - this is a simplified approach
      const startIndex = flattened.indexOf(nestedIfStart);
      if (startIndex !== -1) {
        // Extract a reasonable chunk of code that should contain the nested ifs
        const codeChunk = flattened.substring(startIndex, startIndex + 500);

        // Try to identify the pattern of nested ifs with simple conditions
        const pattern = /if\s*\(([^{]*)\)\s*{[^{]*if\s*\(([^{]*)\)\s*{[^{]*if\s*\(([^{]*)\)\s*{([^}]*)}[^}]*else\s*{([^}]*)}[^}]*}[^}]*else\s*{([^}]*)}/;
        const match = codeChunk.match(pattern);

        if (match) {
          // We found a pattern we can flatten
          const condition1 = match[1].trim();
          const condition2 = match[2].trim();
          const condition3 = match[3].trim();
          const block1 = match[4].trim();
          const block2 = match[5].trim();
          const elseBlock = match[6].trim();

          // Create a flattened version using if-else-if
          const flattenedIf = `
// Flattened nested if statements
if (${condition1} && ${condition2} && ${condition3}) {
  ${block1}
} else if (${condition1} && ${condition2}) {
  ${block2}
} else if (${condition1}) {
  ${elseBlock}
}`;

          // Replace the nested structure with our flattened version
          // This is a simplified approach and might not work for all cases
          const originalCode = codeChunk.substring(0, match[0].length);
          flattened = flattened.replace(originalCode, flattenedIf);
          transformations.nestedIfs++;
        }
      }
    });
  }

  // 2. Handle while(true) loops with breaks
  const whileTruePattern = /while\s*\(\s*true\s*\)\s*{([^}]*)}/g;
  const whileTrueMatches = [...flattened.matchAll(whileTruePattern)];

  whileTrueMatches.forEach(match => {
    const loopBody = match[1];
    const breakPattern = /if\s*\(([^)]+)\)\s*{\s*break;\s*}/;
    const breakMatch = loopBody.match(breakPattern);

    if (breakMatch) {
      // This is a while(true) with a conditional break that can be simplified
      const breakCondition = breakMatch[1];
      const negatedCondition = breakCondition.includes('!')
        ? breakCondition.replace('!', '').trim()
        : `!(${breakCondition})`;

      // Create a standard while loop
      const newLoop = `while (${negatedCondition}) {${loopBody.replace(breakMatch[0], '')}}`;

      // Replace the original loop
      flattened = flattened.replace(match[0], newLoop);
      transformations.whileTrue++;
    }
  });

  // 3. Handle switch statements with mappings
  const switchMappingPattern = /switch\s*\(([^)]*\[[^)]*\])\)\s*{([^}]*)}/g;
  const switchMappingMatches = [...flattened.matchAll(switchMappingPattern)];

  switchMappingMatches.forEach(match => {
    const switchExpr = match[1];
    const switchBody = match[2];

    // Check if this is a mapping-based switch that can be simplified
    if (switchExpr.includes('[')) {
      const mappingMatch = switchExpr.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\[([^[\]]+)\]/);

      if (mappingMatch) {
        const mappingObj = mappingMatch[1];
        const mappingKey = mappingMatch[2];

        // Extract cases
        const casePattern = /case\s+(\d+):\s*([^}]*?)(?:break;|(?=case|default))/g;
        const cases = [...switchBody.matchAll(casePattern)];

        if (cases.length > 0) {
          // Build a simplified if-else structure
          let ifElseStructure = `// Simplified mapping switch\n`;

          cases.forEach((caseMatch, index) => {
            const caseValue = caseMatch[1];
            const caseBody = caseMatch[2].trim();

            if (index === 0) {
              ifElseStructure += `if (${mappingObj}[${mappingKey}] === ${caseValue}) {\n  ${caseBody}\n}`;
            } else {
              ifElseStructure += ` else if (${mappingObj}[${mappingKey}] === ${caseValue}) {\n  ${caseBody}\n}`;
            }
          });

          // Handle default case
          const defaultMatch = switchBody.match(/default:\s*([^}]*?)(?:break;|$)/);
          if (defaultMatch) {
            ifElseStructure += ` else {\n  ${defaultMatch[1].trim()}\n}`;
          }

          // Replace the switch with our if-else structure
          flattened = flattened.replace(match[0], ifElseStructure);
          transformations.switchMappings++;
        }
      }
    }
  });

  // Format the code after transformations
  flattened = formatCode(flattened).code;

  const totalTransformations =
    transformations.nestedIfs +
    transformations.nestedLoops +
    transformations.whileTrue +
    transformations.switchMappings;

  return {
    code: flattened,
    stats: {
      ...transformations,
      totalTransformations
    }
  };
}

/**
 * Remove unreachable (dead) code
 *
 * @param {string} code - Code with dead code blocks
 * @param {Object} options - Removal options
 * @returns {Object} Code with dead code removed and metadata
 */
export function removeDeadCode(code, options = {}) {
  const { removeEmptyBlocks = true } = options;

  let cleaned = code;
  let removals = {
    unreachableIf: 0,
    unreachableLoops: 0,
    emptyBlocks: 0,
    unusedVariables: 0
  };

  // 1. Remove if (false) { ... } blocks
  const falseIfPattern = /if\s*\(\s*false\s*\)\s*{[^}]*}/g;
  const falseIfBlocks = code.match(falseIfPattern) || [];
  if (falseIfBlocks.length > 0) {
    cleaned = cleaned.replace(falseIfPattern, '// Dead code removed: if (false) block');
    removals.unreachableIf += falseIfBlocks.length;
  }

  // 2. Remove if (0) { ... } blocks
  const zeroIfPattern = /if\s*\(\s*0\s*\)\s*{[^}]*}/g;
  const zeroIfBlocks = code.match(zeroIfPattern) || [];
  if (zeroIfBlocks.length > 0) {
    cleaned = cleaned.replace(zeroIfPattern, '// Dead code removed: if (0) block');
    removals.unreachableIf += zeroIfBlocks.length;
  }

  // 3. Remove while (false) { ... } loops
  const falseWhilePattern = /while\s*\(\s*false\s*\)\s*{[^}]*}/g;
  const falseWhileBlocks = code.match(falseWhilePattern) || [];
  if (falseWhileBlocks.length > 0) {
    cleaned = cleaned.replace(falseWhilePattern, '// Dead code removed: while (false) loop');
    removals.unreachableLoops += falseWhileBlocks.length;
  }

  // 4. Remove for loops with false conditions
  const falseForPattern = /for\s*\([^;]*;\s*false\s*;[^)]*\)\s*{[^}]*}/g;
  const falseForBlocks = code.match(falseForPattern) || [];
  if (falseForBlocks.length > 0) {
    cleaned = cleaned.replace(falseForPattern, '// Dead code removed: for loop with false condition');
    removals.unreachableLoops += falseForBlocks.length;
  }

  // 5. Remove empty blocks if option is enabled
  if (removeEmptyBlocks) {
    const emptyBlockPattern = /{\s*}/g;
    const emptyBlocks = code.match(emptyBlockPattern) || [];
    if (emptyBlocks.length > 0) {
      cleaned = cleaned.replace(emptyBlockPattern, '{}');
      removals.emptyBlocks += emptyBlocks.length;
    }
  }

  // 6. Detect and remove unused variables
  // This is a simplified approach that works for basic cases
  // In a real implementation, you would use a proper parser and scope analysis

  // First, find all variable declarations
  const varDeclarationPattern = /\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*=\s*([^;]+))?;/g;
  const varDeclarations = [...cleaned.matchAll(varDeclarationPattern)];

  // Track variables that might be unused
  const potentiallyUnused = new Map();

  varDeclarations.forEach(match => {
    const varName = match[2];
    const fullDeclaration = match[0];

    // Skip if it's a common variable name that's likely used
    if (['i', 'j', 'k', 'e', 'err', 'error', 'data', 'result'].includes(varName)) {
      return;
    }

    // Check if this variable is used elsewhere in the code
    // We need to use word boundaries to avoid partial matches
    const usagePattern = new RegExp(`\\b${varName}\\b`, 'g');
    const usages = [...cleaned.matchAll(usagePattern)];

    // If the variable only appears once (in its declaration), it's unused
    if (usages.length === 1) {
      potentiallyUnused.set(varName, fullDeclaration);
    }
  });

  // Remove unused variables
  potentiallyUnused.forEach((declaration, varName) => {
    // Double-check that this is actually the declaration and not some other usage
    if (declaration.includes(`var ${varName}`) ||
        declaration.includes(`let ${varName}`) ||
        declaration.includes(`const ${varName}`)) {

      cleaned = cleaned.replace(declaration, `// Removed unused variable: ${varName}\n`);
      removals.unusedVariables++;
    }
  });

  // Format the code after removing dead code
  cleaned = formatCode(cleaned).code;

  return {
    code: cleaned,
    stats: removals
  };
}

/**
 * Automatically deobfuscate code by applying multiple transformations in sequence
 *
 * @param {string} code - Obfuscated code to improve
 * @param {Object} options - Deobfuscation options
 * @returns {Object} Deobfuscated code and metadata
 */
export function autoDeobfuscate(code, options = {}) {
  // Track all transformations applied
  const stats = {
    transformations: {
      deadCodeRemoved: 0,
      variablesRenamed: 0,
      controlFlowFlattened: 0
    },
    originalSize: code.length,
    finalSize: 0,
    readabilityImprovement: 0
  };

  // Step 1: First remove dead code
  const deadCodeResult = removeDeadCode(code, {
    removeEmptyBlocks: options.removeEmptyBlocks !== false
  });

  let improved = deadCodeResult.code;
  stats.transformations.deadCodeRemoved =
    deadCodeResult.stats.unreachableIf +
    deadCodeResult.stats.unreachableLoops +
    deadCodeResult.stats.unusedVariables;

  // Step 2: Flatten control flow structures
  const flattenResult = flattenControlFlow(improved, {
    maxDepth: options.maxDepth || 2
  });

  improved = flattenResult.code;
  stats.transformations.controlFlowFlattened = flattenResult.stats.totalTransformations;

  // Step 3: Rename variables for better readability
  const renameResult = renameVariables(improved, {
    preserveBuiltins: options.preserveBuiltins !== false
  });

  improved = renameResult.code;
  stats.transformations.variablesRenamed = renameResult.stats.variablesRenamed;

  // Step 4: Format the final code
  const formattedResult = formatCode(improved);
  improved = formattedResult.code;

  // Calculate final stats
  stats.finalSize = improved.length;

  // Calculate a simple readability score based on transformations
  // This is a very basic heuristic - in a real app you might use a more sophisticated metric
  const totalTransformations =
    stats.transformations.deadCodeRemoved +
    stats.transformations.variablesRenamed +
    stats.transformations.controlFlowFlattened;

  stats.readabilityImprovement = Math.min(100, Math.round(totalTransformations * 10));

  return {
    code: improved,
    stats
  };
}
