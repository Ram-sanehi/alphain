/**
 * Pure TypeScript QR Code Generator (Model 2, Byte Mode, ECC Level M/L)
 * Generates a boolean[][] matrix without any external dependencies.
 */

const GF256_EXP: number[] = new Array(512);
const GF256_LOG: number[] = new Array(256);

// Initialize GF(256) log and exp tables (primitive polynomial 0x11D: x^8 + x^4 + x^3 + x^2 + 1)
(function initGF() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = x;
    GF256_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) {
      x ^= 0x11d;
    }
  }
  for (let i = 255; i < 512; i++) {
    GF256_EXP[i] = GF256_EXP[i - 255];
  }
})();

function gfMul(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return GF256_EXP[GF256_LOG[x] + GF256_LOG[y]];
}

// Generate Reed-Solomon generator polynomial of degree n
function rsGeneratorPoly(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const factor = [1, GF256_EXP[i]];
    const newPoly = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      newPoly[j] ^= gfMul(poly[j], factor[0]);
      newPoly[j + 1] ^= gfMul(poly[j], factor[1]);
    }
    poly = newPoly;
  }
  return poly;
}

// Compute Reed-Solomon ECC codewords for data
function rsComputeECC(data: number[], numECC: number): number[] {
  const gen = rsGeneratorPoly(numECC);
  const res = new Array(numECC).fill(0);
  for (let i = 0; i < data.length; i++) {
    const feedback = data[i] ^ res[0];
    for (let j = 0; j < numECC - 1; j++) {
      res[j] = res[j + 1] ^ gfMul(feedback, gen[j + 1]);
    }
    res[numECC - 1] = gfMul(feedback, gen[numECC]);
  }
  return res;
}

// Table of QR versions, capacities, and block structures (ECC Level M)
// version: [totalCodewords, dataCodewords, ecCodewordsPerBlock, numBlocks]
interface QRVersionSpec {
  version: number;
  totalCodewords: number;
  dataCodewords: number;
  ecPerBlock: number;
  blocks: { count: number; dataCodewords: number }[];
  alignmentPatterns: number[];
}

const QR_SPECS: Record<number, QRVersionSpec> = {
  3: {
    version: 3,
    totalCodewords: 70,
    dataCodewords: 44,
    ecPerBlock: 26,
    blocks: [{ count: 1, dataCodewords: 44 }],
    alignmentPatterns: [6, 22],
  },
  4: {
    version: 4,
    totalCodewords: 100,
    dataCodewords: 64,
    ecPerBlock: 18,
    blocks: [{ count: 2, dataCodewords: 32 }],
    alignmentPatterns: [6, 26],
  },
  5: {
    version: 5,
    totalCodewords: 134,
    dataCodewords: 86,
    ecPerBlock: 24,
    blocks: [{ count: 2, dataCodewords: 43 }],
    alignmentPatterns: [6, 30],
  },
  6: {
    version: 6,
    totalCodewords: 172,
    dataCodewords: 108,
    ecPerBlock: 16,
    blocks: [{ count: 4, dataCodewords: 27 }],
    alignmentPatterns: [6, 34],
  },
};

/**
 * Format Info strings for ECC M, Masks 0-7 with BCH(15,5) code masked with 0x5412
 */
const FORMAT_STRINGS: number[] = [
  0x5412 ^ 0x0000, // Mask 0 (000)
  0x5412 ^ 0x0537, // Mask 1 (001)
  0x5412 ^ 0x0a6e, // Mask 2 (010)
  0x5412 ^ 0x0f59, // Mask 3 (011)
  0x5412 ^ 0x11f5, // Mask 4 (100)
  0x5412 ^ 0x14c2, // Mask 5 (101)
  0x5412 ^ 0x1b9b, // Mask 6 (110)
  0x5412 ^ 0x1eac, // Mask 7 (111)
];

// Determine mask function
function getMaskFunc(maskPattern: number): (r: number, c: number) => boolean {
  switch (maskPattern) {
    case 0: return (r, c) => (r + c) % 2 === 0;
    case 1: return (r) => r % 2 === 0;
    case 2: return (_, c) => c % 3 === 0;
    case 3: return (r, c) => (r + c) % 3 === 0;
    case 4: return (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
    case 5: return (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0;
    case 6: return (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
    case 7: return (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
    default: return (r, c) => (r + c) % 2 === 0;
  }
}

/**
 * Generate 2D boolean array representing QR code matrix (true = black, false = white)
 */
export function generateQrMatrix(text: string): boolean[][] {
  const utf8Bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code < 0x80) {
      utf8Bytes.push(code);
    } else if (code < 0x800) {
      utf8Bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else {
      utf8Bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    }
  }

  // Find best version that fits utf8Bytes
  let spec: QRVersionSpec = QR_SPECS[3];
  for (const v of [3, 4, 5, 6]) {
    if (utf8Bytes.length + 3 <= QR_SPECS[v].dataCodewords) {
      spec = QR_SPECS[v];
      break;
    }
  }

  // Bit buffer for byte mode
  const bits: number[] = [];
  function pushBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  }

  // 1. Mode indicator: Byte mode (0100)
  pushBits(0b0100, 4);
  // 2. Character count indicator (8 bits for version 1-9)
  pushBits(utf8Bytes.length, 8);
  // 3. Payload bytes
  for (const b of utf8Bytes) {
    pushBits(b, 8);
  }
  // 4. Terminator (up to 4 bits of 0)
  const maxBits = spec.dataCodewords * 8;
  const termLen = Math.min(4, maxBits - bits.length);
  pushBits(0, termLen);
  // 5. Pad to multiple of 8
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }
  // 6. Pad bytes 0xEC and 0x11
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bits.length < maxBits) {
    pushBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  // Convert bits to data codewords
  const dataCodewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byteVal = 0;
    for (let j = 0; j < 8; j++) {
      byteVal = (byteVal << 1) | bits[i + j];
    }
    dataCodewords.push(byteVal);
  }

  // Split into blocks and compute ECC
  const blocksData: number[][] = [];
  const blocksECC: number[][] = [];
  let offset = 0;
  for (const b of spec.blocks) {
    for (let k = 0; k < b.count; k++) {
      const bData = dataCodewords.slice(offset, offset + b.dataCodewords);
      offset += b.dataCodewords;
      blocksData.push(bData);
      blocksECC.push(rsComputeECC(bData, spec.ecPerBlock));
    }
  }

  // Interleave data codewords
  const finalCodewords: number[] = [];
  const maxDataLen = Math.max(...blocksData.map((b) => b.length));
  for (let i = 0; i < maxDataLen; i++) {
    for (const b of blocksData) {
      if (i < b.length) {
        finalCodewords.push(b[i]);
      }
    }
  }
  // Interleave ECC codewords
  for (let i = 0; i < spec.ecPerBlock; i++) {
    for (const ec of blocksECC) {
      finalCodewords.push(ec[i]);
    }
  }

  // Final bit stream
  const allBits: number[] = [];
  for (const cw of finalCodewords) {
    for (let i = 7; i >= 0; i--) {
      allBits.push((cw >> i) & 1);
    }
  }
  // Add remainder bits if any (version 3..6 have 7 remainder bits for v3, 0 for v4, 7 for v5, 7 for v6)
  const remainderBitsCount = spec.version === 4 ? 0 : 7;
  for (let i = 0; i < remainderBitsCount; i++) {
    allBits.push(0);
  }

  // Build matrix
  const size = 17 + 4 * spec.version;
  const matrix: (boolean | null)[][] = Array.from({ length: size }, () => new Array(size).fill(null));
  const isFunction: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));

  function setModule(r: number, c: number, val: boolean) {
    matrix[r][c] = val;
    isFunction[r][c] = true;
  }

  // 1. Finder patterns at (0,0), (0, size-7), (size-7, 0)
  const finderPositions = [
    [0, 0],
    [0, size - 7],
    [size - 7, 0],
  ];
  for (const [fr, fc] of finderPositions) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBlack =
          r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
        setModule(fr + r, fc + c, isBlack);
      }
    }
    // Separators
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        if (r === -1 || r === 7 || c === -1 || c === 7) {
          const rr = fr + r;
          const cc = fc + c;
          if (rr >= 0 && rr < size && cc >= 0 && cc < size) {
            setModule(rr, cc, false);
          }
        }
      }
    }
  }

  // 2. Alignment patterns
  const alignCoords = spec.alignmentPatterns;
  if (alignCoords.length > 0) {
    for (const ar of alignCoords) {
      for (const ac of alignCoords) {
        // Skip if overlaps finder
        if (
          (ar === 6 && ac === 6) ||
          (ar === 6 && ac === alignCoords[alignCoords.length - 1] && ac > size - 9) ||
          (ar === alignCoords[alignCoords.length - 1] && ar > size - 9 && ac === 6)
        ) {
          continue;
        }
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            const isBlack = Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
            setModule(ar + r, ac + c, isBlack);
          }
        }
      }
    }
  }

  // 3. Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (!isFunction[6][i]) setModule(6, i, i % 2 === 0);
    if (!isFunction[i][6]) setModule(i, 6, i % 2 === 0);
  }

  // 4. Dark module
  setModule(4 * spec.version + 9, 8, true);

  // 5. Reserve format info modules
  for (let i = 0; i <= 8; i++) {
    if (!isFunction[8][i]) isFunction[8][i] = true;
    if (!isFunction[i][8]) isFunction[i][8] = true;
  }
  for (let i = 0; i < 8; i++) {
    isFunction[8][size - 1 - i] = true;
    isFunction[size - 1 - i][8] = true;
  }

  // 6. Place data bits in 2-column zig-zag
  const maskFunc = getMaskFunc(0); // Mask 0 is standard and universally decodable
  let bitIdx = 0;
  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right--; // Skip vertical timing column
    const upward = ((size - 1 - right) / 2) % 2 === 0;
    for (let vert = 0; vert < size; vert++) {
      const r = upward ? size - 1 - vert : vert;
      for (let c = right; c >= right - 1; c--) {
        if (!isFunction[r][c]) {
          const bit = bitIdx < allBits.length ? allBits[bitIdx++] : 0;
          const mask = maskFunc(r, c);
          matrix[r][c] = (bit === 1) !== mask;
        }
      }
    }
  }

  // 7. Write Format Information (ECC M, Mask 0)
  // Format string for ECC M (00) and Mask 0 (000)
  const formatVal = FORMAT_STRINGS[0];
  const formatBits: boolean[] = [];
  for (let i = 14; i >= 0; i--) {
    formatBits.push(((formatVal >> i) & 1) === 1);
  }

  // Top-left format bits
  const tlCoords: [number, number][] = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
  ];
  for (let i = 0; i < 15; i++) {
    matrix[tlCoords[i][0]][tlCoords[i][1]] = formatBits[i];
  }

  // Split format bits around bottom-left and top-right
  for (let i = 0; i < 7; i++) {
    matrix[size - 1 - i][8] = formatBits[i];
  }
  for (let i = 7; i < 15; i++) {
    matrix[8][size - 15 + i] = formatBits[i];
  }

  return matrix.map((row) => row.map((cell) => cell === true));
}
