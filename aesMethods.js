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

var aes = {};



aes.keyExpansion = function(key) {
  // return array of round keys (176 bytes long for 16 byte key)
  // key should be a byte array of length 16
  if (key.length !== 16 || typeof key === 'string') {
    return 'Error in aes.keyExpansion. Input key should be length 16 byte array (hex).'
  }
  
  // The first 16 bytes of the expandedKey are equal to the origin key.
  var expandedKey = key;

  // Generate each 4 byte addition using these repeating operators
  // Note: There are 44 rounds; counting is 0-indexed (meaning r43 is last)

  // RCon table
  var rcon = [
    '01000000',
    '02000000',
    '04000000',
    '08000000',
    '10000000',
    '20000000',
    '40000000',
    '80000000',
    '1b000000',
    '36000000',
    '6c000000',
    'd8000000',
    'ab000000',
    '4d000000',
    '9a000000'
  ]

  // SBox table
  var sBox = [ 0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
             0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
             0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
             0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
             0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
             0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
             0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
             0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
             0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
             0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
             0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
             0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
             0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
             0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
             0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
             0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16 ];

  var newSbox = [];
  sBox.forEach(function(byte) {
    var converted = byte.toString(16);

    while (converted.length < 2) {
      converted = converted.split('');
      converted.unshift('0');
      converted = converted.join('');
    }

    newSbox.push(converted);
  })

  sBox = newSbox;

  // Create our XOR function
  var doXOR = function(hex1, hex2, hex3) {
    // hex3 may not be present. This is ok.
    var bin1 = conversion.convert(hex1, 'hex', 'bin');
    var bin2 = conversion.convert(hex2, 'hex', 'bin');
    if (hex3) var bin3 = conversion.convert(hex3, 'hex', 'bin');

    var result = encrypt.fixedXOR(bin1, bin2);
    if (hex3) result = encrypt.fixedXOR(result, bin3);

    return conversion.convert(result, 'bin', 'hex');
  }



  // IF round % 4 === 0 THEN XOR the following values:
    // the last four generated bytes rotated left, then sboxed
    // the rcon value of (round / 4) - 1
    // the 4 bytes starting at (round-4) * 4 (the first 4 bytes of the prev generated full key)
  // ELSE, THEN XOR the following values:
    // the 4 bytes starting at (round-4) * 4
    // the 4 bytes starting at (round-1) * 4

  //   ... 4 3 2 1
  // rot : 3 2 1 4


  for (var round = 4; round <= 43; round++) {
    if (round % 4 === 0) {
      // Rotate left
      var last4 = [];
      last4.push(expandedKey[expandedKey.length-4]);
      last4.push(expandedKey[expandedKey.length-3]);
      last4.push(expandedKey[expandedKey.length-2]);
      last4.push(expandedKey[expandedKey.length-1]);
      last4.push(last4.shift());
      // sbox
      last4[0] = sBox[conversion.convert(parseInt(last4[0], 16))];
      last4[1] = sBox[conversion.convert(parseInt(last4[1], 16))];
      last4[2] = sBox[conversion.convert(parseInt(last4[2], 16))];
      last4[3] = sBox[conversion.convert(parseInt(last4[3], 16))];
      // This is our first value
      var firstVal = last4.join('');

      // Get rcon
      var secondVal = rcon[(round/4)-1];

      // Get starting 
      var first4 = [];
      first4.push(expandedKey[(round-4)*4]);
      first4.push(expandedKey[(round-4)*4 + 1]);
      first4.push(expandedKey[(round-4)*4 + 2]);
      first4.push(expandedKey[(round-4)*4 + 3]);
      var thirdVal = first4.join('');

      // Do xor
      var result = doXOR(firstVal, secondVal, thirdVal);
      expandedKey.push(result);
    }
    else {
      // Get last 4 bytes
      var last4 = [];
      last4.push(expandedKey[expandedKey.length-4]);
      last4.push(expandedKey[expandedKey.length-3]);
      last4.push(expandedKey[expandedKey.length-2]);
      last4.push(expandedKey[expandedKey.length-1]);

      var firstVal = last4.join('');

      // Get bytes from a bit ago
      var first4 = [];
      first4.push(expandedKey[(round-4)*4]);
      first4.push(expandedKey[(round-4)*4 + 1]);
      first4.push(expandedKey[(round-4)*4 + 2]);
      first4.push(expandedKey[(round-4)*4 + 3]);
      var secondVal = first4.join('');

      // Do xor
      var result = doXOR(firstVal, secondVal);
      expandedKey.push(result);
    }
  }

  return expandedKey;
}

aes.addRoundKey = function(state, roundKey) {
  // This simply XORs each byte in state by the corresponding byte in roundKey.
  // Notably, they must both be of equal length.
  if (state.length !== roundKey.length) {
    return 'Error in aes.addRoundKey. State and roundKey must be arrays of length 16.'
  }

  var newState = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  for (var i = 0; i < 16; i++) {
    var bin1 = conversion.convert(state[i], 'hex', 'bin');
    var bin2 = conversion.convert(roundKey[i], 'hex', 'bin');

    var xor = encrypt.fixedXOR(bin1, bin2);
    var newHex = conversion.convert(xor, 'bin', 'hex');
    newState[i] = newHex;
  }

  return newState;
};

aes.subBytes = function(state) {

  // state should be an array of length 16, always
  if (state.length !== 16) {
    return 'Error in aes.subBytes. State is not array of length 16.';
  }

  var sBox = [ 0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
             0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
             0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
             0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
             0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
             0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
             0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
             0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
             0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
             0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
             0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
             0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
             0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
             0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
             0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
             0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16 ];

  var newSbox = [];
  sBox.forEach(function(byte) {
    var converted = byte.toString(16);

    while (converted.length < 2) {
      converted = converted.split('');
      converted.unshift('0');
      converted = converted.join('');
    }

    newSbox.push(converted);
  })

  sBox = newSbox;

  var newState = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

  // Substitute bytes
  for (var i = 0; i < state.length; i++) {
    var byte = state[i];

    var i1 = parseInt(byte[0], 16);
    var i2 = parseInt(byte[1], 16);

    var subLocation = i1*16 + i2;

    newState[i] = sBox[subLocation];
  }

  return newState;
};

aes.shiftRows = function(state) {
  // New state
  var n = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  // Because lazy we will do this manually. Todo: do this programatically, if a 
  // more elegant programatic solution exists.
  var s = state;

  n[0] = s[0];
  n[1] = s[1];
  n[2] = s[2];
  n[3] = s[3];

  n[4] = s[5];
  n[5] = s[6];
  n[6] = s[7];
  n[7] = s[4];

  n[8] = s[10];
  n[9] = s[11];
  n[10] = s[8];
  n[11] = s[9];

  n[12] = s[15]
  n[13] = s[12]
  n[14] = s[13]
  n[15] = s[14]

  return n;
};

aes.mixColumns = function(state) {

  // Copy and convert tables

  var mul2 = 
    [0x00,0x02,0x04,0x06,0x08,0x0a,0x0c,0x0e,0x10,0x12,0x14,0x16,0x18,0x1a,0x1c,0x1e,
    0x20,0x22,0x24,0x26,0x28,0x2a,0x2c,0x2e,0x30,0x32,0x34,0x36,0x38,0x3a,0x3c,0x3e,
    0x40,0x42,0x44,0x46,0x48,0x4a,0x4c,0x4e,0x50,0x52,0x54,0x56,0x58,0x5a,0x5c,0x5e,
    0x60,0x62,0x64,0x66,0x68,0x6a,0x6c,0x6e,0x70,0x72,0x74,0x76,0x78,0x7a,0x7c,0x7e,
    0x80,0x82,0x84,0x86,0x88,0x8a,0x8c,0x8e,0x90,0x92,0x94,0x96,0x98,0x9a,0x9c,0x9e,
    0xa0,0xa2,0xa4,0xa6,0xa8,0xaa,0xac,0xae,0xb0,0xb2,0xb4,0xb6,0xb8,0xba,0xbc,0xbe,
    0xc0,0xc2,0xc4,0xc6,0xc8,0xca,0xcc,0xce,0xd0,0xd2,0xd4,0xd6,0xd8,0xda,0xdc,0xde,
    0xe0,0xe2,0xe4,0xe6,0xe8,0xea,0xec,0xee,0xf0,0xf2,0xf4,0xf6,0xf8,0xfa,0xfc,0xfe,
    0x1b,0x19,0x1f,0x1d,0x13,0x11,0x17,0x15,0x0b,0x09,0x0f,0x0d,0x03,0x01,0x07,0x05,
    0x3b,0x39,0x3f,0x3d,0x33,0x31,0x37,0x35,0x2b,0x29,0x2f,0x2d,0x23,0x21,0x27,0x25,
    0x5b,0x59,0x5f,0x5d,0x53,0x51,0x57,0x55,0x4b,0x49,0x4f,0x4d,0x43,0x41,0x47,0x45,
    0x7b,0x79,0x7f,0x7d,0x73,0x71,0x77,0x75,0x6b,0x69,0x6f,0x6d,0x63,0x61,0x67,0x65,
    0x9b,0x99,0x9f,0x9d,0x93,0x91,0x97,0x95,0x8b,0x89,0x8f,0x8d,0x83,0x81,0x87,0x85,
    0xbb,0xb9,0xbf,0xbd,0xb3,0xb1,0xb7,0xb5,0xab,0xa9,0xaf,0xad,0xa3,0xa1,0xa7,0xa5,
    0xdb,0xd9,0xdf,0xdd,0xd3,0xd1,0xd7,0xd5,0xcb,0xc9,0xcf,0xcd,0xc3,0xc1,0xc7,0xc5,
    0xfb,0xf9,0xff,0xfd,0xf3,0xf1,0xf7,0xf5,0xeb,0xe9,0xef,0xed,0xe3,0xe1,0xe7,0xe5]

  var mul3 = 
    [0x00,0x03,0x06,0x05,0x0c,0x0f,0x0a,0x09,0x18,0x1b,0x1e,0x1d,0x14,0x17,0x12,0x11,
    0x30,0x33,0x36,0x35,0x3c,0x3f,0x3a,0x39,0x28,0x2b,0x2e,0x2d,0x24,0x27,0x22,0x21,
    0x60,0x63,0x66,0x65,0x6c,0x6f,0x6a,0x69,0x78,0x7b,0x7e,0x7d,0x74,0x77,0x72,0x71,
    0x50,0x53,0x56,0x55,0x5c,0x5f,0x5a,0x59,0x48,0x4b,0x4e,0x4d,0x44,0x47,0x42,0x41,
    0xc0,0xc3,0xc6,0xc5,0xcc,0xcf,0xca,0xc9,0xd8,0xdb,0xde,0xdd,0xd4,0xd7,0xd2,0xd1,
    0xf0,0xf3,0xf6,0xf5,0xfc,0xff,0xfa,0xf9,0xe8,0xeb,0xee,0xed,0xe4,0xe7,0xe2,0xe1,
    0xa0,0xa3,0xa6,0xa5,0xac,0xaf,0xaa,0xa9,0xb8,0xbb,0xbe,0xbd,0xb4,0xb7,0xb2,0xb1,
    0x90,0x93,0x96,0x95,0x9c,0x9f,0x9a,0x99,0x88,0x8b,0x8e,0x8d,0x84,0x87,0x82,0x81,
    0x9b,0x98,0x9d,0x9e,0x97,0x94,0x91,0x92,0x83,0x80,0x85,0x86,0x8f,0x8c,0x89,0x8a,
    0xab,0xa8,0xad,0xae,0xa7,0xa4,0xa1,0xa2,0xb3,0xb0,0xb5,0xb6,0xbf,0xbc,0xb9,0xba,
    0xfb,0xf8,0xfd,0xfe,0xf7,0xf4,0xf1,0xf2,0xe3,0xe0,0xe5,0xe6,0xef,0xec,0xe9,0xea,
    0xcb,0xc8,0xcd,0xce,0xc7,0xc4,0xc1,0xc2,0xd3,0xd0,0xd5,0xd6,0xdf,0xdc,0xd9,0xda,
    0x5b,0x58,0x5d,0x5e,0x57,0x54,0x51,0x52,0x43,0x40,0x45,0x46,0x4f,0x4c,0x49,0x4a,
    0x6b,0x68,0x6d,0x6e,0x67,0x64,0x61,0x62,0x73,0x70,0x75,0x76,0x7f,0x7c,0x79,0x7a,
    0x3b,0x38,0x3d,0x3e,0x37,0x34,0x31,0x32,0x23,0x20,0x25,0x26,0x2f,0x2c,0x29,0x2a,
    0x0b,0x08,0x0d,0x0e,0x07,0x04,0x01,0x02,0x13,0x10,0x15,0x16,0x1f,0x1c,0x19,0x1a]

  var newMul2 = [];

  mul2.forEach(function(byte) {
    var converted = byte.toString(16);

    while (converted.length < 2) {
      converted = converted.split('');
      converted.unshift('0');
      converted = converted.join('');
    }

    newMul2.push(converted);
  })

  mul2 = newMul2;

  var newMul3 = [];

  mul3.forEach(function(byte) {
    var converted = byte.toString(16);

    while (converted.length < 2) {
      converted = converted.split('');
      converted.unshift('0');
      converted = converted.join('');
    }

    newMul3.push(converted);
  })

  mul3 = newMul3;

  // Define the multiplication values
  var mulVals = [2, 3, 1, 1, 1, 2, 3, 1, 1, 1, 2, 3, 3, 1, 1, 2];

  // Create a index state from state which is the state converted into decimal.
  var is = [];

  state.forEach(function(hex) {
    var dec = parseInt(hex, 16);
    is.push(dec);
  })

  // A function that does the xor process needed below
  var doXOR = function(hex1, hex2, hex3, hex4) {

    var bin1 = conversion.convert(hex1, 'hex', 'bin');
    var bin2 = conversion.convert(hex2, 'hex', 'bin');
    var bin3 = conversion.convert(hex3, 'hex', 'bin');
    var bin4 = conversion.convert(hex4, 'hex', 'bin');

    var result = encrypt.fixedXOR(bin1, bin2);
    result = encrypt.fixedXOR(result, bin3);
    result = encrypt.fixedXOR(result, bin4);

    return conversion.convert(result, 'bin', 'hex');
  }

  // 0  1  2  3     2  3  1  1
  // 4  5  6  7     1  2  3  1
  // 8  9  10 11    1  1  2  3
  // 12 13 14 15    3  1  1  2

  // Do it.
  var newState = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  newState[0] = doXOR(mul2[is[0]], mul3[is[4]], state[8], state[12]);
  newState[1] = doXOR(mul2[is[1]], mul3[is[5]], state[9], state[13]);
  newState[2] = doXOR(mul2[is[2]], mul3[is[6]], state[10], state[14]);
  newState[3] = doXOR(mul2[is[3]], mul3[is[7]], state[11], state[15]);

  newState[4] = doXOR(state[0], mul2[is[4]], mul3[is[8]], state[12]);
  newState[5] = doXOR(state[1], mul2[is[5]], mul3[is[9]], state[13]);
  newState[6] = doXOR(state[2], mul2[is[6]], mul3[is[10]], state[14]);
  newState[7] = doXOR(state[3], mul2[is[7]], mul3[is[11]], state[15]);

  newState[8] = doXOR(state[0], state[4], mul2[is[8]], mul3[is[12]]);
  newState[9] = doXOR(state[1], state[5], mul2[is[9]], mul3[is[13]]);
  newState[10] = doXOR(state[2], state[6], mul2[is[10]], mul3[is[14]]);
  newState[11] = doXOR(state[3], state[7], mul2[is[11]], mul3[is[15]]);

  newState[12] = doXOR(mul3[is[0]], state[4], state[8], mul2[is[12]]);
  newState[13] = doXOR(mul3[is[1]], state[5], state[9], mul2[is[13]]);
  newState[14] = doXOR(mul3[is[2]], state[6], state[10], mul2[is[14]]);
  newState[15] = doXOR(mul3[is[3]], state[7], state[11], mul2[is[15]]);

  return newState;
};

aes.encrypt = function(plaintext, key) {};

aes.decrypt = function(ciphertext, key) {};
