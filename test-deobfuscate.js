// Test script for deobfuscation functions
const { autoDeobfuscate, renameVariables, flattenControlFlow, removeDeadCode } = require('./src/utils/transformers.js');
const fs = require('fs');

// Sample obfuscated code
const obfuscatedCode = `
// Sample obfuscated JavaScript code for testing deobfuscation
(function() {
  var a = 10;
  var b = 20;
  var c = function(d) {
    var e = d + a;
    var f = function(g) {
      return g * e;
    };
    return f(b);
  };
  
  // Nested control flow
  function h(i) {
    if (i > 0) {
      if (i < 10) {
        if (i % 2 === 0) {
          return i * 2;
        } else {
          return i * 3;
        }
      } else {
        return i;
      }
    }
    return 0;
  }
  
  // Dead code
  if (false) {
    console.log("This will never execute");
  }
  
  var j = 0;
  while (false) {
    j++;
  }
  
  // Switch with mapping
  var k = {
    'a': 1,
    'b': 2,
    'c': 3
  };
  
  function l(m) {
    var n;
    switch(k[m]) {
      case 1:
        n = "Option A";
        break;
      case 2:
        n = "Option B";
        break;
      case 3:
        n = "Option C";
        break;
      default:
        n = "Unknown";
    }
    return n;
  }
  
  // Unused variables
  var o = "unused";
  var p = 42;
  
  // Complex while(true) with breaks
  function q(r) {
    var s = 0;
    while (true) {
      s++;
      if (s > r) {
        break;
      }
      if (s % 5 === 0) {
        continue;
      }
      // Do something with s
    }
    return s;
  }
  
  console.log(c(5));
  console.log(h(8));
  console.log(l('b'));
  console.log(q(15));
})();
`;

// Test individual transformations
console.log('=== TESTING RENAME VARIABLES ===');
const renameResult = renameVariables(obfuscatedCode);
console.log(renameResult.code.substring(0, 500) + '...');
console.log('Stats:', renameResult.stats);
console.log('\n');

console.log('=== TESTING FLATTEN CONTROL FLOW ===');
const flattenResult = flattenControlFlow(obfuscatedCode);
console.log(flattenResult.code.substring(0, 500) + '...');
console.log('Stats:', flattenResult.stats);
console.log('\n');

console.log('=== TESTING REMOVE DEAD CODE ===');
const removeResult = removeDeadCode(obfuscatedCode);
console.log(removeResult.code.substring(0, 500) + '...');
console.log('Stats:', removeResult.stats);
console.log('\n');

// Test auto deobfuscate
console.log('=== TESTING AUTO DEOBFUSCATE ===');
const autoResult = autoDeobfuscate(obfuscatedCode);
console.log(autoResult.code);
console.log('Stats:', autoResult.stats);
