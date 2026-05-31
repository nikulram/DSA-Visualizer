export type CompressionAlgorithm = "lz78" | "lzw" | "arithmeticCoding" | "bwtCompression" | "runLengthEncoding" | "deflate" | "huffmanDecoding" | "deltaEncoding" | "lz77";

export type CompressionStep = {
  text: string;
  output: string[];
  dictionary: string[][];
  activeIndex: number | null;
  activeToken: string;
  message: string;
  checks: number;
};

export const compressionLabels: Record<CompressionAlgorithm, string> = {
  lz78: "LZ78",
  lzw: "LZW",
  arithmeticCoding: "Arithmetic Coding",
  bwtCompression: "BWT Compression",
  runLengthEncoding: "Run-Length Encoding",
  deflate: "Deflate",
  huffmanDecoding: "Huffman Decoding",
  deltaEncoding: "Delta Encoding",
  lz77: "LZ77",
};

function normalizeInput(input: string) {
  const value = input.trim().toUpperCase().replace(/[^A-Z0-9_$]/g, "");
  return value.length > 0 ? value.slice(0, 24) : "BANANA_BANDANA";
}

function addStep(steps: CompressionStep[], step: CompressionStep) {
  steps.push({
    text: step.text,
    output: [...step.output],
    dictionary: step.dictionary.map((row) => [...row]),
    activeIndex: step.activeIndex,
    activeToken: step.activeToken,
    message: step.message,
    checks: step.checks,
  });
}

function lz78Trace(input: string): CompressionStep[] {
  const text = normalizeInput(input);
  const dictionary = [["0", ""]];
  const dict = new Map<string, number>([["", 0]]);
  const output: string[] = [];
  const steps: CompressionStep[] = [];
  let phrase = "";
  let checks = 0;

  addStep(steps, {
    text,
    output,
    dictionary,
    activeIndex: null,
    activeToken: "",
    message: "LZ78 builds a dictionary of phrases and emits (prefix index, next character) tokens.",
    checks,
  });

  for (let i = 0; i < text.length; i++) {
    checks++;
    const candidate = phrase + text[i];

    addStep(steps, {
      text,
      output,
      dictionary,
      activeIndex: i,
      activeToken: candidate,
      message: `Check phrase "${candidate}" in the dictionary.`,
      checks,
    });

    if (dict.has(candidate)) {
      phrase = candidate;
      continue;
    }

    const prefixIndex = dict.get(phrase) ?? 0;
    const token = `(${prefixIndex}, ${text[i]})`;
    output.push(token);
    dict.set(candidate, dictionary.length);
    dictionary.push([String(dictionary.length), candidate]);

    addStep(steps, {
      text,
      output,
      dictionary,
      activeIndex: i,
      activeToken: token,
      message: `Emit ${token} and add "${candidate}" to the dictionary.`,
      checks,
    });

    phrase = "";
  }

  if (phrase.length > 0) {
    const token = `(${dict.get(phrase) ?? 0}, EOF)`;
    output.push(token);

    addStep(steps, {
      text,
      output,
      dictionary,
      activeIndex: text.length - 1,
      activeToken: token,
      message: `Flush remaining phrase "${phrase}" as ${token}.`,
      checks,
    });
  }

  addStep(steps, {
    text,
    output,
    dictionary,
    activeIndex: null,
    activeToken: "",
    message: "LZ78 compression complete.",
    checks,
  });

  return steps;
}

function lzwTrace(input: string): CompressionStep[] {
  const text = normalizeInput(input);
  const unique = Array.from(new Set(text.split("")));
  const dictionary = unique.map((char, index) => [String(index), char]);
  const dict = new Map(dictionary.map(([index, value]) => [value, Number(index)]));
  const output: string[] = [];
  const steps: CompressionStep[] = [];
  let phrase = text[0] ?? "";
  let checks = 0;

  addStep(steps, {
    text,
    output,
    dictionary,
    activeIndex: 0,
    activeToken: phrase,
    message: "LZW starts with a dictionary of single characters.",
    checks,
  });

  for (let i = 1; i < text.length; i++) {
    checks++;
    const char = text[i];
    const candidate = phrase + char;

    addStep(steps, {
      text,
      output,
      dictionary,
      activeIndex: i,
      activeToken: candidate,
      message: `Check whether "${candidate}" already exists in the dictionary.`,
      checks,
    });

    if (dict.has(candidate)) {
      phrase = candidate;
      continue;
    }

    output.push(String(dict.get(phrase)));
    dict.set(candidate, dictionary.length);
    dictionary.push([String(dictionary.length), candidate]);

    addStep(steps, {
      text,
      output,
      dictionary,
      activeIndex: i,
      activeToken: phrase,
      message: `Emit code for "${phrase}" and add "${candidate}".`,
      checks,
    });

    phrase = char;
  }

  if (phrase) {
    output.push(String(dict.get(phrase)));

    addStep(steps, {
      text,
      output,
      dictionary,
      activeIndex: text.length - 1,
      activeToken: phrase,
      message: `Flush final phrase "${phrase}".`,
      checks,
    });
  }

  addStep(steps, {
    text,
    output,
    dictionary,
    activeIndex: null,
    activeToken: "",
    message: "LZW compression complete.",
    checks,
  });

  return steps;
}

function arithmeticCodingTrace(input: string): CompressionStep[] {
  const text = normalizeInput(input).slice(0, 12);
  const counts = new Map<string, number>();

  for (const char of text) {
    counts.set(char, (counts.get(char) ?? 0) + 1);
  }

  const total = text.length;
  let cursor = 0;
  const ranges = new Map<string, [number, number]>();
  const dictionary: string[][] = [];

  for (const [char, count] of [...counts.entries()].sort()) {
    const low = cursor;
    const high = cursor + count / total;
    ranges.set(char, [low, high]);
    dictionary.push([char, low.toFixed(3), high.toFixed(3)]);
    cursor = high;
  }

  const output: string[] = [];
  const steps: CompressionStep[] = [];
  let low = 0;
  let high = 1;
  let checks = 0;

  addStep(steps, {
    text,
    output,
    dictionary,
    activeIndex: null,
    activeToken: "",
    message: "Arithmetic Coding assigns each symbol a probability interval, then narrows the range for every character.",
    checks,
  });

  for (let i = 0; i < text.length; i++) {
    checks++;
    const char = text[i];
    const [symbolLow, symbolHigh] = ranges.get(char)!;
    const width = high - low;
    const nextLow = low + width * symbolLow;
    const nextHigh = low + width * symbolHigh;

    low = nextLow;
    high = nextHigh;
    output.push(`[${low.toFixed(5)}, ${high.toFixed(5)})`);

    addStep(steps, {
      text,
      output,
      dictionary,
      activeIndex: i,
      activeToken: char,
      message: `Read "${char}" and narrow range to [${low.toFixed(5)}, ${high.toFixed(5)}).`,
      checks,
    });
  }

  addStep(steps, {
    text,
    output,
    dictionary,
    activeIndex: null,
    activeToken: ((low + high) / 2).toFixed(6),
    message: `Arithmetic Coding complete. Any number inside final range can represent the message.`,
    checks,
  });

  return steps;
}

function bwtCompressionTrace(input: string): CompressionStep[] {
  const base = normalizeInput(input).replace(/\$/g, "");
  const text = `${base}$`;
  const rotations = Array.from({ length: text.length }, (_, index) => text.slice(index) + text.slice(0, index));
  const sorted = [...rotations].sort();
  const output: string[] = [];
  const dictionary = rotations.map((rotation, index) => [`R${index}`, rotation]);
  const steps: CompressionStep[] = [];
  let checks = 0;

  addStep(steps, {
    text,
    output,
    dictionary,
    activeIndex: null,
    activeToken: "",
    message: "BWT creates every cyclic rotation of the text, then sorts the rotations.",
    checks,
  });

  rotations.forEach((rotation, index) => {
    checks++;

    addStep(steps, {
      text,
      output,
      dictionary,
      activeIndex: index,
      activeToken: rotation,
      message: `Create rotation ${index}: ${rotation}.`,
      checks,
    });
  });

  const sortedDictionary = sorted.map((rotation, index) => [`S${index}`, rotation]);

  sorted.forEach((rotation, index) => {
    checks++;
    const lastChar = rotation[rotation.length - 1];
    output.push(lastChar);

    addStep(steps, {
      text,
      output,
      dictionary: sortedDictionary,
      activeIndex: index,
      activeToken: rotation,
      message: `Sorted row ${index}: take last character "${lastChar}".`,
      checks,
    });
  });

  addStep(steps, {
    text,
    output,
    dictionary: sortedDictionary,
    activeIndex: null,
    activeToken: output.join(""),
    message: `BWT complete. Transformed output is ${output.join("")}.`,
    checks,
  });

  return steps;
}


function runLengthEncodingTrace(input: string): CompressionStep[] {
  const text = normalizeInput(input).replace(/_/g, "") || "AAABBBCCDAA";
  const output: string[] = [];
  const dictionary: string[][] = [];
  const steps: CompressionStep[] = [];
  let checks = 0;
  let i = 0;

  addStep(steps, {
    text,
    output,
    dictionary,
    activeIndex: null,
    activeToken: "",
    message: "Run-Length Encoding compresses repeated runs as character plus count.",
    checks,
  });

  while (i < text.length) {
    const char = text[i];
    let count = 1;
    checks++;

    while (i + count < text.length && text[i + count] === char) {
      count++;
      checks++;

      addStep(steps, {
        text,
        output,
        dictionary,
        activeIndex: i + count - 1,
        activeToken: `${char}${count}`,
        message: `Extend run of "${char}" to count ${count}.`,
        checks,
      });
    }

    const token = `${char}${count}`;
    output.push(token);
    dictionary.push([char, String(count), token]);

    addStep(steps, {
      text,
      output,
      dictionary,
      activeIndex: i,
      activeToken: token,
      message: `Emit run token ${token}.`,
      checks,
    });

    i += count;
  }

  addStep(steps, {
    text,
    output,
    dictionary,
    activeIndex: null,
    activeToken: output.join(" "),
    message: "Run-Length Encoding complete.",
    checks,
  });

  return steps;
}

function deflateTrace(input: string): CompressionStep[] {
  const text = normalizeInput(input);
  const output: string[] = [];
  const dictionary: string[][] = [];
  const steps: CompressionStep[] = [];
  let checks = 0;

  addStep(steps, {
    text,
    output,
    dictionary,
    activeIndex: null,
    activeToken: "",
    message: "Deflate combines LZ-style back references with Huffman-style coding.",
    checks,
  });

  for (let i = 0; i < text.length; i++) {
    checks++;
    let bestLength = 0;
    let bestDistance = 0;

    for (let distance = 1; distance <= Math.min(i, 8); distance++) {
      let length = 0;

      while (
        i + length < text.length &&
        text[i + length] === text[i - distance + length] &&
        length < 6
      ) {
        length++;
      }

      if (length > bestLength) {
        bestLength = length;
        bestDistance = distance;
      }
    }

    if (bestLength >= 3) {
      const token = `<${bestDistance},${bestLength}>`;
      output.push(token);
      dictionary.push(["match", `distance ${bestDistance}`, `length ${bestLength}`]);

      addStep(steps, {
        text,
        output,
        dictionary,
        activeIndex: i,
        activeToken: token,
        message: `LZ match found. Emit back reference ${token}.`,
        checks,
      });

      i += bestLength - 1;
    } else {
      const token = text[i];
      output.push(token);
      dictionary.push(["literal", token, "Huffman code"]);

      addStep(steps, {
        text,
        output,
        dictionary,
        activeIndex: i,
        activeToken: token,
        message: `No useful match. Emit literal "${token}", then Huffman-code it.`,
        checks,
      });
    }
  }

  addStep(steps, {
    text,
    output,
    dictionary,
    activeIndex: null,
    activeToken: output.join(" "),
    message: "Deflate visual complete.",
    checks,
  });

  return steps;
}

function huffmanDecodingTrace(input: string): CompressionStep[] {
  const encoded = normalizeInput(input).replace(/[^01]/g, "") || "010011101011";
  const codes = [
    ["A", "0"],
    ["B", "10"],
    ["C", "110"],
    ["D", "111"],
  ];
  const dictionary = codes.map(([char, code]) => [code, char, "prefix"]);
  const codeMap = new Map(codes.map(([char, code]) => [code, char]));
  const output: string[] = [];
  const steps: CompressionStep[] = [];
  let buffer = "";
  let checks = 0;

  addStep(steps, {
    text: encoded,
    output,
    dictionary,
    activeIndex: null,
    activeToken: "",
    message: "Huffman Decoding walks prefix bits until a full codeword is found.",
    checks,
  });

  for (let i = 0; i < encoded.length; i++) {
    checks++;
    buffer += encoded[i];

    addStep(steps, {
      text: encoded,
      output,
      dictionary,
      activeIndex: i,
      activeToken: buffer,
      message: `Read bit ${encoded[i]}. Current prefix is ${buffer}.`,
      checks,
    });

    if (codeMap.has(buffer)) {
      const char = codeMap.get(buffer)!;
      output.push(char);

      addStep(steps, {
        text: encoded,
        output,
        dictionary,
        activeIndex: i,
        activeToken: char,
        message: `Prefix ${buffer} decodes to "${char}".`,
        checks,
      });

      buffer = "";
    }
  }

  addStep(steps, {
    text: encoded,
    output,
    dictionary,
    activeIndex: null,
    activeToken: output.join(""),
    message: "Huffman Decoding complete.",
    checks,
  });

  return steps;
}

function deltaEncodingTrace(input: string): CompressionStep[] {
  const raw = input
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item))
    .slice(0, 16);

  const numbers = raw.length >= 3 ? raw : [100, 103, 108, 110, 111, 120, 121];
  const text = numbers.join(",");
  const output: string[] = [];
  const dictionary: string[][] = [];
  const steps: CompressionStep[] = [];
  let checks = 0;

  addStep(steps, {
    text,
    output,
    dictionary,
    activeIndex: null,
    activeToken: "",
    message: "Delta Encoding stores the first value, then stores differences between consecutive values.",
    checks,
  });

  for (let i = 0; i < numbers.length; i++) {
    checks++;
    const delta = i === 0 ? numbers[i] : numbers[i] - numbers[i - 1];
    output.push(String(delta));
    dictionary.push([`x${i}`, String(numbers[i]), `delta ${delta}`]);

    addStep(steps, {
      text,
      output,
      dictionary,
      activeIndex: i,
      activeToken: String(delta),
      message: i === 0
        ? `Store first value ${numbers[i]} directly.`
        : `Store ${numbers[i]} - ${numbers[i - 1]} = ${delta}.`,
      checks,
    });
  }

  addStep(steps, {
    text,
    output,
    dictionary,
    activeIndex: null,
    activeToken: output.join(","),
    message: "Delta Encoding complete.",
    checks,
  });

  return steps;
}


function lz77Trace(input: string): CompressionStep[] {
  const text = normalizeInput(input);
  const output: string[] = [];
  const dictionary: string[][] = [];
  const steps: CompressionStep[] = [];
  let checks = 0;

  addStep(steps, {
    text,
    output,
    dictionary,
    activeIndex: null,
    activeToken: "",
    message: "LZ77 emits back references as (distance, length, next character).",
    checks,
  });

  for (let i = 0; i < text.length; i++) {
    checks++;
    let bestLength = 0;
    let bestDistance = 0;

    for (let distance = 1; distance <= Math.min(i, 8); distance++) {
      let length = 0;

      while (i + length < text.length && text[i + length] === text[i - distance + length] && length < 6) {
        length++;
      }

      if (length > bestLength) {
        bestLength = length;
        bestDistance = distance;
      }
    }

    const next = text[i + bestLength] ?? "EOF";
    const token = `(${bestDistance},${bestLength},${next})`;
    output.push(token);
    dictionary.push([`i=${i}`, `d=${bestDistance}`, `l=${bestLength}`]);

    addStep(steps, {
      text,
      output,
      dictionary,
      activeIndex: i,
      activeToken: token,
      message: bestLength > 0
        ? `Found previous match. Emit ${token}.`
        : `No previous match. Emit literal token ${token}.`,
      checks,
    });

    i += bestLength;
  }

  addStep(steps, {
    text,
    output,
    dictionary,
    activeIndex: null,
    activeToken: output.join(" "),
    message: "LZ77 compression complete.",
    checks,
  });

  return steps;
}

export function getCompressionTrace(algorithm: CompressionAlgorithm, input: string): CompressionStep[] {
  if (algorithm === "lz78") return lz78Trace(input);
  if (algorithm === "lzw") return lzwTrace(input);
  if (algorithm === "arithmeticCoding") return arithmeticCodingTrace(input);
  if (algorithm === "bwtCompression") return bwtCompressionTrace(input);
  if (algorithm === "runLengthEncoding") return runLengthEncodingTrace(input);
  if (algorithm === "deflate") return deflateTrace(input);
  if (algorithm === "huffmanDecoding") return huffmanDecodingTrace(input);
  if (algorithm === "deltaEncoding") return deltaEncodingTrace(input);
  return lz77Trace(input);
}
