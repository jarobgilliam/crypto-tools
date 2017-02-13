// This contains all the code involved in the cryptopals challenges. 

var conversion = {};
// Since binary is at the core of everything we do, conversions only go to 
// and from binary. The exception is the last function, which allows for
// base conversion using other functions.

conversion.hexToBin = function(str) {
  var result = '';
  
  // String must be divisible by 2 
  if (str.length % 2 !== 0) return 'Error in hexToBin. Str must be divisible by 2.';
  
  // Split into parts of size 2
  var parts = str.match(/.{1,2}/g);
  
  // Convert each part to binary, pad if necessary and add to result.
  for (var i = 0; i < parts.length; i++) {
    // convert
    var bin = parseInt(parts[i], 16).toString(2);
    // pad
    while (bin.length % 8 !== 0) {
      bin = bin.split('');
      bin.unshift('0');
      bin = bin.join('');
    }
    // add to result
    result += bin;
  }
  
  return result;
}

conversion.binToHex = function(str) {

  // Input must be in complete bytes
  if (str.length % 8 !== 0) {
    return 'Error in binToHex. String must be in complete bytes.';
  }

  var parts = str.match(/.{1,8}/g);
  var result = '';
  
  for (var i = 0; i < parts.length; i++) {
    var hex = parseInt(parts[i], 2).toString(16);
    if (hex.length < 2) {
      hex = hex.split('');
      hex.unshift('0');
      hex = hex.join('');
    }
    result += hex;
  }
  return result;
}

conversion.binToBase64 = function(str) {
  var result = '';
  
  // Ensure the string is composed of complete bytes.
  if (str.length % 8 !== 0) return 'Error in binToBase64. Input string must be divible by 8.';
  
  // Count the number of bytes.
  var numBytes = str.length / 8;
  
  // If the number of bytes is not divisible by three, we need to add padding.
  var padding = 0;
  if (numBytes % 3 === 1) str += '0000000000000000', padding+= 2;
  else if (numBytes % 3 === 2) str += '00000000', padding += 1;

  // Split into blocks of length 6
  var parts = str.match(/.{1,6}/g);
  
  // Define alphabet
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  
  // Use parts and alphabet to construct result base64 string
  for (var i = 0; i < parts.length; i++) {
    var index = parseInt(parts[i], 2);
    result += alphabet[index];
  }
  
  // Replace trailing A's if padding exists
  if (padding === 2 && result[result.length-2] === 'A') {
    result = result.split('');
    result[result.length-2] = '=';
    result = result.join('');
  }
  if (padding > 0 && result[result.length-1] === 'A') { 
    result = result.split('');
    result[result.length-1] = '=';
    result = result.join('');
  }
  return result;
}

conversion.base64ToBin = function(str) {
  // A valid base64 string has a multiple of 8 bytes
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  
  // Convert every character to its 6 bit binary representation
  var base64 = str.split('');
  var result = '';

  for (var i = 0; i < base64.length; i++) {
    if (base64[i] === '=') result += '000000';
    else {
      var index = alphabet.indexOf(base64[i]);
      // Index should not be greater than 63 or less than 0
      if (index < 0 || index > 63) {
        return 'Error in base64ToBin. Index found out of bounds. Must be 0 <= i < 64.';
      }
      var bin = index.toString(2);
      // Add padding, if necessary
      while (bin.length < 6) {
        bin = bin.split('');
        bin.unshift('0');
        bin = bin.join('');
      }
      result += bin;
    }
  }
  
  // Now remove 0 padding for each =
  if (str[str.length-1] === '=') {
    result = result.split('');
    for (var j = 0; j < 8; j++) {
      result.pop();
    }
    result = result.join('');
  }
  
  if (str[str.length-2] === '=') {
    result = result.split('');
    for (var k = 0; k < 8; k++) {
      result.pop();
    }
    result = result.join('');
  }
  
  return result;
}

conversion.binToASCII = function(str) {
  // Input should consist of whole bytes.
  if (str.length % 8 !== 0) {
    return 'Error in binToASCII. Input should consist of whole bytes.';
  }

  // Split into parts for conversion.
  var parts = str.match(/.{1,8}/g);

  // Convert
  var result = '';
  parts.map(function(part) {
    result += String.fromCharCode(parseInt(part, 2));
  })

  return result;
}

conversion.ASCIIToBin = function(str) {
  var result = '';

  for (var i = 0; i < str.length; i++) {
    var char = str[i];
    var bin = char.charCodeAt(0).toString(2);
    // pad into byte
    while (bin.length < 8) {
      bin = bin.split('');
      bin.unshift('0');
      bin = bin.join('');
    }
    result += bin;
  }

  return result;
}

conversion.convert = function(str, from, to) {

  if (from === 'hex') {
    if (to === 'bin') {
      return conversion.hexToBin(str);
    }
    if (to === 'base64') {
      return conversion.binToBase64(conversion.hexToBin(str));
    }
    if (to === 'ASCII') {
      return conversion.binToASCII(conversion.hexToBin(str));
    }
    else return 'Cannot convert to that from hex.'
  }

  if (from === 'bin') {
    if (to === 'hex') {
      return conversion.binToHex(str);
    }
    if (to === 'base64') {
      return conversion.binToBase64(str);
    }
    if (to === 'ASCII') {
      return conversion.binToASCII(str);
    }
    else return 'Cannot convert to that from bin.'
  }

  if (from === 'base64') {
    if (to === 'hex') {
      return conversion.binToHex(conversion.base64ToBin(str));
    }
    if (to === 'bin') {
      return conversion.base64ToBin(str);
    }
    if (to === 'ASCII') {
      return conversion.binToASCII(conversion.base64ToBin(str));
    }
    else return 'Cannot convert to that from base64.'
  }

  if (from === 'ASCII') {
    if (to === 'hex') {
      return conversion.binToHex(conversion.ASCIIToBin(str));
    }
    if (to === 'bin') {
      return conversion.ASCIIToBin(str);
    }
    if (to === 'base64') {
      return conversion.binToBase64(conversion.ASCIIToBin(str));
    }
    else return 'Cannot convert to that from ASCII.'
  }

  else return 'Cannot convert to anything from that.'
}

var encrypt = {};
// The encrypt functions should accept and return binary values.

encrypt.fixedXOR = function(bin1, bin2) {
  // These two things should be of equal length
  if (bin1.length !== bin2.length) return 'Error in fixedXOR. Strs should be of equal bit length.';
  
  // Perform XOR 
  var result = '';
  
  for (var i = 0; i < bin1.length; i++) {
    if (bin1[i] === bin2[i]) result += '0';
    else result += '1';
  }
  
  return result;
}

encrypt.singleByteXOR = function(str, byte) {
  // str should be composed of bytes, so the length must be divisible by 8.
  if (str.length % 8 !== 0) {
    return 'Error in encrypt.singleByteXOR. Str should consist of whole bytes.';
  }

  var bin = str;

  // Extend byte to repeating bytestring of size input
  var numBytes = str.length / 8;
  var byteString = '';

  for (var i = 0; i < numBytes; i++) {
    byteString += (byte);
  }

  // This is now a fixed XOR. 
  if (bin.length !== byteString.length) {
    return 'Error in singleByteXOR. The binary strings are not the same length.';
  }
  var result = encrypt.fixedXOR(bin, byteString);

  return result;
}

encrypt.repeatingKeyXOR = function(str, key) {
  // str should be full bytes. 
  if (str.length % 8 !== 0) {
    return 'Error in encrypt.repeatingKeyXOR. Input should be in whole bytes.';
  }

  // Convert ASCII key to binary
  var keyBin = conversion.convert(key, 'ASCII', 'bin');

  // Split key into bytes
  var keyParts = keyBin.match(/.{1,8}/g);
  
  // Create the repeated key from the parts.
  var keyBytes = key.length;
  var strBytes = str.length / 8;
  var repeatedKey = '';
  var counter = 0;

  for (var i = 0; i < strBytes; i++) {
    repeatedKey += keyParts[counter];

    counter++;
    if (counter > keyBytes - 1) {
      counter = 0;
    }
  }

  // XOR against repeated key
  return encrypt.fixedXOR(str, repeatedKey);
}

var statistics = {};
// Various statistical methods, like frequency analysis.

// Make a better frequency analysis tool. 
statistics.chiSquared = function(observed) {
  // We'll be using a Chi-Square Goodness of Fit test to determine whether,
  // in this context, a sample string is likely to be english, based upon the 
  // frequency of characters in written english.
  
  // We need a few different values to make this determination. Namely:
  
  // Degrees of freedom: (number of levels - 1)
  
  // Expected frequency: An array representing the expected probability of each
  // level. (Should sum to 100).
  
  // Test statistic: The chi-squared random variable, defined by 
  // Sum[(Oi - Ei)**2 / Ei], where Oi is the observed frequency and Ei is the expected
  // frequency at each given level.
  
  // p Value is normally used for rejecting and accepting the null hypothesis (that 
  // the data does represent english text.) We will forgo using the p-value to reject 
  // and instead collect the "best" scores, then use a few other methods to guess.
  
  // Expected frequency of characters (including spaces).
  var alpha = 'abcdefghijklmnopqrstuvwxyz '
  var expectedFreq = [ '6.517',
    '1.242',
    '2.173',
    '3.498',
    '10.414',
    '1.979',
    '1.586',
    '4.929',
    '5.581',
    '0.090',
    '0.505',
    '3.315',
    '2.021',
    '5.645',
    '5.963',
    '1.376',
    '0.086',
    '4.976',
    '5.158',
    '7.294',
    '2.251',
    '0.829',
    '1.713',
    '0.137',
    '1.460',
    '0.078',
    '19.182' ]
    
  // Degrees of freedom
  var dof = alpha.length - 1;
  
  // Observed should be of length equal to the expected frequency length
  if (observed.length !== alpha.length) {
    return 'Error in statistics.chiSquared. Observed should be of length ' + alpha.length;
  }
  
  // Calculate chi-squared random variable
  var chi = 0;
  var sum = 0;
  observed.forEach(function(freq) {
    sum += freq;
  })

  for (var i = 0; i < alpha.length-1; i++) {
    var oi = observed[i] / sum;
    var ei = expectedFreq[i];
    var result = ((oi - ei) * (oi - ei)) / ei;
    chi += result;
  }
  
  return chi;
}

statistics.editDistance = function(bin1, bin2) {
  // Inputs should be of equal length
  if (bin1.length !== bin2.length) {
    return 'Error in statistics.editDistance. Inputs should be of equal length.';
  }

  // Calculate edit distance
  var distance = 0;

  for (var i = 0; i < bin1.length; i++) {
    if (bin1[i] !== bin2[i]) distance++;
  }

  return distance;
}

var decrypt = {};
// The decrypt functions don't always work on binary. Types will be noted.

decrypt.singleByteXOR = function(bin) {
  // Returns the top 10 ASCII decryptions, indicating its best guess.
  // Guesses will consist of tuples -- the guess, then the distance score.
  var guesses = [];

  for (var i = 0; i < 256; i++) {
    var byte = i.toString(2);
    while (byte.length < 8) {
      byte = byte.split('');
      byte.unshift('0');
      byte = byte.join('');
    }
    

    // Get the decryption
    var decrypted = encrypt.singleByteXOR(bin, byte);
    
    // Convert the decryption to ASCII
    decrypted = conversion.convert(decrypted, 'bin', 'ASCII');

    // Tally frequency
    var occurences = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var specialChars = 0;
    var alphabet = 'abcdefghijklmnopqrstuvwxyz ';
    var occurenceSize = 0;

    for (var j = 0; j < decrypted.length; j++) {
      var char = decrypted[j].toLowerCase();
      occurenceSize++;

      if (alphabet.indexOf(char) > -1) {
        occurences[alphabet.indexOf(char)] += 1;
      } else {
        specialChars++;
      }
    }
    var guess = [decrypted, statistics.chiSquared(occurences)];

    // If there are an abnormal amount of special characters (>10%), we apply a 
    // 10 point penalty. 
    if (specialChars > occurenceSize * 0.10) {
      guess[1] += 10;
    }

    guesses.push(guess);
  }
  
  var best = ['', 1000];
  
  guesses.forEach(function(guess) {
    if (guess[1] < best[1]) {
      best[1] = guess[1];
      best[0] = guess[0];
    }
  })

  return best;
}

// Todo: Complete
decrypt.repeatingKeyXOR = function(bin) {
  // Outputs ASCII.

  // Edit contains tuples, [keysize, editDistance]
  var edits = [];

  for (var keysize = 2; keysize < 40; keysize++) {
    var firstChunk = bin.slice(0, keysize*8);
    var secondChunk = bin.slice(keysize*8, keysize*16);
    var distance = statistics.editDistance(firstChunk, secondChunk);
    distance = distance / keysize

    edits.push([keysize, distance]);
  }
  
  // Grab the three lowest edit distances
  var best = [];
  
  for (var i = 0; i < 3; i++) {
    var lowest = ['n', Infinity];
    edits.forEach(function(edit) {
      if (edit[1] < lowest[1]) {
        lowest[0] = edit[0];
        lowest[1] = edit[1];
      }
    })
    for (var j = 0; j < edits.length; j++) {
      var edit = edits[j];
      if (edit[0] === lowest[0]) {
        edit[1] = Infinity;
      }
    }
    best.push(lowest);
  }
  
  // Proceed with only the best edit. Fix later to include top 3.
  keysize = best[0][0];

  // Break block into blocks of keysize
  var blocks = [];
  
  for (var i = 0; i < bin.length; i += keysize) {
    blocks.push(bin.slice(i, i+keysize));
  }
  
  // THIS IS NOT DONE. FINISH LATER.
  
  return blocks;
}

decrypt.AES128_ECB = function(bin, key) {
  // Key is in plaintext, bin is in binary

  // Convert key to binary
  var  binKey = conversion.convert(key, 'ASCII', 'bin');

  // binKey should be 128 bits (16 bytes) long
  if (binKey.length !== 128) {
    return 'Error in decrypt.AES128_ECB. Key should be 16 bytes long.';
  }

  // Split bin into blocks of 128
  var blocks = bin.match(/.{1,128}/g);

  // XOR each block against key
  var result = '';

  blocks.forEach(function(block) {
    var partial = encrypt.fixedXOR(block, binKey);
    result += partial;
  })

  return result;
}

