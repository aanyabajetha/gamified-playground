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
