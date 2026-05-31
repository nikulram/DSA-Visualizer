export type StringAlgorithm = "kmp" | "rabinKarp" | "boyerMoore" | "zAlgorithm" | "manacher" | "ahoCorasick" | "editDistance" | "lcs" | "suffixAutomaton" | "burrowsWheelerTransform";

export type StringStep = {
  text: string;
  pattern: string;
  textIndex: number | null;
  patternIndex: number | null;
  matchedText: number[];
  matchedPattern: number[];
  windowStart: number;
  message: string;
  checks: number;
};

export const stringLabels: Record<StringAlgorithm, string> = {
  kmp: "KMP String Matching",
  rabinKarp: "Rabin-Karp",
  boyerMoore: "Boyer-Moore",
  zAlgorithm: "Z Algorithm",
  manacher: "Manacher",
  ahoCorasick: "Aho-Corasick",
  editDistance: "Edit Distance",
  lcs: "Longest Common Subsequence",
  suffixAutomaton: "Suffix Automaton",
  burrowsWheelerTransform: "Burrows-Wheeler Transform",
};

function addStep(steps: StringStep[], step: StringStep) {
  steps.push({
    text: step.text,
    pattern: step.pattern,
    textIndex: step.textIndex,
    patternIndex: step.patternIndex,
    matchedText: [...step.matchedText],
    matchedPattern: [...step.matchedPattern],
    windowStart: step.windowStart,
    message: step.message,
    checks: step.checks,
  });
}

function normalizeText(text: string) {
  const value = text.trim().toUpperCase();
  return value.length > 0 ? value.slice(0, 32) : "ABABDABACDABABCABAB";
}

function normalizePattern(pattern: string) {
  const value = pattern.trim().toUpperCase();
  return value.length > 0 ? value.slice(0, 16) : "ABABCABAB";
}

function lpsArray(pattern: string) {
  const lps = new Array(pattern.length).fill(0);
  let length = 0;
  let index = 1;

  while (index < pattern.length) {
    if (pattern[index] === pattern[length]) {
      length++;
      lps[index] = length;
      index++;
    } else if (length !== 0) {
      length = lps[length - 1];
    } else {
      lps[index] = 0;
      index++;
    }
  }

  return lps;
}

function kmpTrace(textInput: string, patternInput: string): StringStep[] {
  const text = normalizeText(textInput);
  const pattern = normalizePattern(patternInput);
  const steps: StringStep[] = [];
  const lps = lpsArray(pattern);
  let i = 0;
  let j = 0;
  let checks = 0;

  addStep(steps, {
    text,
    pattern,
    textIndex: null,
    patternIndex: null,
    matchedText: [],
    matchedPattern: [],
    windowStart: 0,
    message: `KMP precomputes LPS matchedText: [${lps.join(", ")}].`,
    checks,
  });

  while (i < text.length) {
    checks++;

    const matchedText = Array.from({ length: j }, (_, index) => i - j + index).filter((item) => item >= 0);
    const matchedPattern = Array.from({ length: j }, (_, index) => index);

    addStep(steps, {
      text,
      pattern,
      textIndex: i,
      patternIndex: j,
      matchedText,
      matchedPattern,
      windowStart: i - j,
      message: `Compare text[${i}] ${text[i]} with pattern[${j}] ${pattern[j]}.`,
      checks,
    });

    if (text[i] === pattern[j]) {
      i++;
      j++;

      if (j === pattern.length) {
        addStep(steps, {
          text,
          pattern,
          textIndex: i - 1,
          patternIndex: j - 1,
          matchedText: Array.from({ length: pattern.length }, (_, index) => i - pattern.length + index),
          matchedPattern: Array.from({ length: pattern.length }, (_, index) => index),
          windowStart: i - pattern.length,
          message: `Pattern found at index ${i - pattern.length}.`,
          checks,
        });
        j = lps[j - 1];
      }
    } else if (j !== 0) {
      j = lps[j - 1];

      addStep(steps, {
        text,
        pattern,
        textIndex: i,
        patternIndex: j,
        matchedText: [],
        matchedPattern: [],
        windowStart: i - j,
        message: `Mismatch. Use LPS to move pattern index back to ${j} without moving text backward.`,
        checks,
      });
    } else {
      i++;
    }
  }

  addStep(steps, {
    text,
    pattern,
    textIndex: null,
    patternIndex: null,
    matchedText: [],
    matchedPattern: [],
    windowStart: 0,
    message: "KMP scan complete.",
    checks,
  });

  return steps;
}

function rabinKarpTrace(textInput: string, patternInput: string): StringStep[] {
  const text = normalizeText(textInput);
  const pattern = normalizePattern(patternInput);
  const steps: StringStep[] = [];
  const base = 256;
  const mod = 101;
  let patternHash = 0;
  let windowHash = 0;
  let highPower = 1;
  let checks = 0;

  for (let i = 0; i < pattern.length - 1; i++) highPower = (highPower * base) % mod;

  for (let i = 0; i < pattern.length; i++) {
    patternHash = (base * patternHash + pattern.charCodeAt(i)) % mod;
    windowHash = (base * windowHash + (text.charCodeAt(i) || 0)) % mod;
  }

  addStep(steps, {
    text,
    pattern,
    textIndex: null,
    patternIndex: null,
    matchedText: [],
    matchedPattern: [],
    windowStart: 0,
    message: `Rabin-Karp hashes the pattern. Pattern hash is ${patternHash}.`,
    checks,
  });

  for (let start = 0; start <= text.length - pattern.length; start++) {
    checks++;

    addStep(steps, {
      text,
      pattern,
      textIndex: start,
      patternIndex: null,
      matchedText: Array.from({ length: pattern.length }, (_, index) => start + index),
      matchedPattern: [],
      windowStart: start,
      message: `Window [${start}..${start + pattern.length - 1}] hash is ${windowHash}. Compare with pattern hash ${patternHash}.`,
      checks,
    });

    if (windowHash === patternHash) {
      let matched = true;

      for (let j = 0; j < pattern.length; j++) {
        checks++;

        addStep(steps, {
          text,
          pattern,
          textIndex: start + j,
          patternIndex: j,
          matchedText: Array.from({ length: j }, (_, index) => start + index),
          matchedPattern: Array.from({ length: j }, (_, index) => index),
          windowStart: start,
          message: `Hash matched. Verify character ${j}.`,
          checks,
        });

        if (text[start + j] !== pattern[j]) {
          matched = false;
          break;
        }
      }

      if (matched) {
        addStep(steps, {
          text,
          pattern,
          textIndex: start,
          patternIndex: 0,
          matchedText: Array.from({ length: pattern.length }, (_, index) => start + index),
          matchedPattern: Array.from({ length: pattern.length }, (_, index) => index),
          windowStart: start,
          message: `Pattern found at index ${start}.`,
          checks,
        });
      }
    }

    if (start < text.length - pattern.length) {
      windowHash =
        (base * (windowHash - text.charCodeAt(start) * highPower) + text.charCodeAt(start + pattern.length)) % mod;
      if (windowHash < 0) windowHash += mod;
    }
  }

  addStep(steps, {
    text,
    pattern,
    textIndex: null,
    patternIndex: null,
    matchedText: [],
    matchedPattern: [],
    windowStart: 0,
    message: "Rabin-Karp scan complete.",
    checks,
  });

  return steps;
}

function boyerMooreTrace(textInput: string, patternInput: string): StringStep[] {
  const text = normalizeText(textInput);
  const pattern = normalizePattern(patternInput);
  const steps: StringStep[] = [];
  const badChar = new Map<string, number>();
  let checks = 0;

  for (let i = 0; i < pattern.length; i++) badChar.set(pattern[i], i);

  addStep(steps, {
    text,
    pattern,
    textIndex: null,
    patternIndex: null,
    matchedText: [],
    matchedPattern: [],
    windowStart: 0,
    message: "Boyer-Moore builds a bad-character table and compares from right to left.",
    checks,
  });

  let shift = 0;

  while (shift <= text.length - pattern.length) {
    let j = pattern.length - 1;

    while (j >= 0) {
      checks++;

      addStep(steps, {
        text,
        pattern,
        textIndex: shift + j,
        patternIndex: j,
        matchedText: Array.from({ length: pattern.length - 1 - j }, (_, index) => shift + j + 1 + index),
        matchedPattern: Array.from({ length: pattern.length - 1 - j }, (_, index) => j + 1 + index),
        windowStart: shift,
        message: `Compare from right: text[${shift + j}] ${text[shift + j]} with pattern[${j}] ${pattern[j]}.`,
        checks,
      });

      if (pattern[j] !== text[shift + j]) break;
      j--;
    }

    if (j < 0) {
      addStep(steps, {
        text,
        pattern,
        textIndex: shift,
        patternIndex: 0,
        matchedText: Array.from({ length: pattern.length }, (_, index) => shift + index),
        matchedPattern: Array.from({ length: pattern.length }, (_, index) => index),
        windowStart: shift,
        message: `Pattern found at index ${shift}.`,
        checks,
      });

      shift += pattern.length;
    } else {
      const last = badChar.get(text[shift + j]) ?? -1;
      const move = Math.max(1, j - last);

      addStep(steps, {
        text,
        pattern,
        textIndex: shift + j,
        patternIndex: j,
        matchedText: [],
        matchedPattern: [],
        windowStart: shift,
        message: `Mismatch. Bad-character rule shifts pattern by ${move}.`,
        checks,
      });

      shift += move;
    }
  }

  addStep(steps, {
    text,
    pattern,
    textIndex: null,
    patternIndex: null,
    matchedText: [],
    matchedPattern: [],
    windowStart: 0,
    message: "Boyer-Moore scan complete.",
    checks,
  });

  return steps;
}

function zAlgorithmTrace(textInput: string, patternInput: string): StringStep[] {
  const text = normalizeText(textInput);
  const pattern = normalizePattern(patternInput);
  const combined = `${pattern}$${text}`;
  const steps: StringStep[] = [];
  const z = new Array(combined.length).fill(0);
  let left = 0;
  let right = 0;
  let checks = 0;

  addStep(steps, {
    text: combined,
    pattern,
    textIndex: null,
    patternIndex: null,
    matchedText: [],
    matchedPattern: [],
    windowStart: 0,
    message: `Z Algorithm builds Z values on pattern + separator + text: ${combined}.`,
    checks,
  });

  for (let i = 1; i < combined.length; i++) {
    if (i <= right) z[i] = Math.min(right - i + 1, z[i - left]);

    while (i + z[i] < combined.length && combined[z[i]] === combined[i + z[i]]) {
      checks++;

      addStep(steps, {
        text: combined,
        pattern,
        textIndex: i + z[i],
        patternIndex: z[i],
        matchedText: Array.from({ length: z[i] + 1 }, (_, index) => i + index),
        matchedPattern: Array.from({ length: z[i] + 1 }, (_, index) => index),
        windowStart: i,
        message: `Extend Z-box at index ${i}. Current Z value becomes ${z[i] + 1}.`,
        checks,
      });

      z[i]++;
    }

    if (i + z[i] - 1 > right) {
      left = i;
      right = i + z[i] - 1;
    }

    if (z[i] === pattern.length) {
      addStep(steps, {
        text: combined,
        pattern,
        textIndex: i,
        patternIndex: 0,
        matchedText: Array.from({ length: pattern.length }, (_, index) => i + index),
        matchedPattern: Array.from({ length: pattern.length }, (_, index) => index),
        windowStart: i,
        message: `Pattern found in combined string at Z index ${i}.`,
        checks,
      });
    }
  }

  addStep(steps, {
    text: combined,
    pattern,
    textIndex: null,
    patternIndex: null,
    matchedText: [],
    matchedPattern: [],
    windowStart: 0,
    message: `Z Algorithm complete. Z array: [${z.join(", ")}].`,
    checks,
  });

  return steps;
}


function manacherTrace(textInput: string, patternInput: string): StringStep[] {
  const original = normalizeText(textInput || "BANANA");
  const transformed = `#${original.split("").join("#")}#`;
  const pattern = normalizePattern(patternInput || "ANA").slice(0, 8);
  const steps: StringStep[] = [];
  const radius = new Array(transformed.length).fill(0);
  let center = 0;
  let right = 0;
  let checks = 0;

  addStep(steps, {
    text: transformed,
    pattern,
    textIndex: null,
    patternIndex: null,
    matchedText: [],
    matchedPattern: [],
    windowStart: 0,
    message: "Manacher transforms the text with separators so odd and even palindromes use one rule.",
    checks,
  });

  for (let i = 0; i < transformed.length; i++) {
    const mirror = 2 * center - i;

    if (i < right) {
      radius[i] = Math.min(right - i, radius[mirror]);
    }

    addStep(steps, {
      text: transformed,
      pattern,
      textIndex: i,
      patternIndex: null,
      matchedText: Array.from({ length: radius[i] * 2 + 1 }, (_, index) => i - radius[i] + index).filter((x) => x >= 0 && x < transformed.length),
      matchedPattern: [],
      windowStart: Math.max(0, i - radius[i]),
      message: `Center at index ${i}. Current palindrome radius is ${radius[i]}.`,
      checks,
    });

    while (
      i - radius[i] - 1 >= 0 &&
      i + radius[i] + 1 < transformed.length &&
      transformed[i - radius[i] - 1] === transformed[i + radius[i] + 1]
    ) {
      checks++;
      radius[i]++;

      addStep(steps, {
        text: transformed,
        pattern,
        textIndex: i,
        patternIndex: null,
        matchedText: Array.from({ length: radius[i] * 2 + 1 }, (_, index) => i - radius[i] + index),
        matchedPattern: [],
        windowStart: Math.max(0, i - radius[i]),
        message: `Expand around center ${i}. Radius becomes ${radius[i]}.`,
        checks,
      });
    }

    if (i + radius[i] > right) {
      center = i;
      right = i + radius[i];

      addStep(steps, {
        text: transformed,
        pattern,
        textIndex: i,
        patternIndex: null,
        matchedText: Array.from({ length: radius[i] * 2 + 1 }, (_, index) => i - radius[i] + index).filter((x) => x >= 0 && x < transformed.length),
        matchedPattern: [],
        windowStart: Math.max(0, center - radius[i]),
        message: `Update active palindrome window. Center ${center}, right boundary ${right}.`,
        checks,
      });
    }
  }

  const bestCenter = radius.indexOf(Math.max(...radius));

  addStep(steps, {
    text: transformed,
    pattern,
    textIndex: bestCenter,
    patternIndex: null,
    matchedText: Array.from({ length: radius[bestCenter] * 2 + 1 }, (_, index) => bestCenter - radius[bestCenter] + index).filter((x) => x >= 0 && x < transformed.length),
    matchedPattern: [],
    windowStart: Math.max(0, bestCenter - radius[bestCenter]),
    message: `Manacher complete. Longest palindrome radius is ${radius[bestCenter]}.`,
    checks,
  });

  return steps;
}

function ahoCorasickTrace(textInput: string, patternInput: string): StringStep[] {
  const text = normalizeText(textInput || "SHESELLSSEASHELLS");
  const patterns = (patternInput.trim() || "SHE, HE, HERS, SEA")
    .split(",")
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean)
    .slice(0, 5);

  const pattern = patterns.join("|");
  const steps: StringStep[] = [];
  const matchedText: number[] = [];
  let checks = 0;

  addStep(steps, {
    text,
    pattern,
    textIndex: null,
    patternIndex: null,
    matchedText: [],
    matchedPattern: [],
    windowStart: 0,
    message: `Aho-Corasick builds a trie for patterns: ${patterns.join(", ")}.`,
    checks,
  });

  patterns.forEach((word, patternIndex) => {
    addStep(steps, {
      text,
      pattern,
      textIndex: null,
      patternIndex,
      matchedText: [],
      matchedPattern: Array.from({ length: word.length }, (_, index) => pattern.indexOf(word) + index),
      windowStart: 0,
      message: `Insert pattern ${word} into the trie and prepare failure links.`,
      checks,
    });
  });

  for (let i = 0; i < text.length; i++) {
    checks++;

    const hits = patterns.filter((word) => text.slice(Math.max(0, i - word.length + 1), i + 1) === word);

    if (hits.length > 0) {
      for (const hit of hits) {
        const start = i - hit.length + 1;
        for (let j = start; j <= i; j++) {
          if (!matchedText.includes(j)) matchedText.push(j);
        }

        addStep(steps, {
          text,
          pattern,
          textIndex: i,
          patternIndex: pattern.indexOf(hit),
          matchedText,
          matchedPattern: Array.from({ length: hit.length }, (_, index) => pattern.indexOf(hit) + index),
          windowStart: start,
          message: `Match found for pattern ${hit} ending at text index ${i}.`,
          checks,
        });
      }
    } else {
      addStep(steps, {
        text,
        pattern,
        textIndex: i,
        patternIndex: null,
        matchedText,
        matchedPattern: [],
        windowStart: Math.max(0, i - 3),
        message: `Read ${text[i]}. Follow trie/failure links if needed.`,
        checks,
      });
    }
  }

  addStep(steps, {
    text,
    pattern,
    textIndex: null,
    patternIndex: null,
    matchedText,
    matchedPattern: [],
    windowStart: 0,
    message: "Aho-Corasick scan complete.",
    checks,
  });

  return steps;
}

function editDistanceTrace(textInput: string, patternInput: string): StringStep[] {
  const a = normalizeText(textInput || "KITTEN").slice(0, 10);
  const b = normalizePattern(patternInput || "SITTING").slice(0, 10);
  const steps: StringStep[] = [];
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  let checks = 0;

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  addStep(steps, {
    text: a,
    pattern: b,
    textIndex: null,
    patternIndex: null,
    matchedText: [],
    matchedPattern: [],
    windowStart: 0,
    message: "Edit Distance fills a DP table using insert, delete, and replace costs.",
    checks,
  });

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      checks++;
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );

      addStep(steps, {
        text: a,
        pattern: b,
        textIndex: i - 1,
        patternIndex: j - 1,
        matchedText: a[i - 1] === b[j - 1] ? [i - 1] : [],
        matchedPattern: a[i - 1] === b[j - 1] ? [j - 1] : [],
        windowStart: Math.max(0, i - 2),
        message: `DP[${i}][${j}] = ${dp[i][j]}. Compare ${a[i - 1]} with ${b[j - 1]}.`,
        checks,
      });
    }
  }

  addStep(steps, {
    text: a,
    pattern: b,
    textIndex: null,
    patternIndex: null,
    matchedText: [],
    matchedPattern: [],
    windowStart: 0,
    message: `Edit Distance complete. Minimum edits = ${dp[a.length][b.length]}.`,
    checks,
  });

  return steps;
}

function lcsTrace(textInput: string, patternInput: string): StringStep[] {
  const a = normalizeText(textInput || "ABCBDAB").slice(0, 12);
  const b = normalizePattern(patternInput || "BDCABA").slice(0, 12);
  const steps: StringStep[] = [];
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  let checks = 0;

  addStep(steps, {
    text: a,
    pattern: b,
    textIndex: null,
    patternIndex: null,
    matchedText: [],
    matchedPattern: [],
    windowStart: 0,
    message: "LCS fills a DP table to find the longest subsequence shared by both strings.",
    checks,
  });

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      checks++;

      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }

      addStep(steps, {
        text: a,
        pattern: b,
        textIndex: i - 1,
        patternIndex: j - 1,
        matchedText: a[i - 1] === b[j - 1] ? [i - 1] : [],
        matchedPattern: a[i - 1] === b[j - 1] ? [j - 1] : [],
        windowStart: Math.max(0, i - 2),
        message: `DP[${i}][${j}] = ${dp[i][j]}. ${a[i - 1] === b[j - 1] ? "Characters match, extend subsequence." : "No match, take best previous value."}`,
        checks,
      });
    }
  }

  addStep(steps, {
    text: a,
    pattern: b,
    textIndex: null,
    patternIndex: null,
    matchedText: [],
    matchedPattern: [],
    windowStart: 0,
    message: `LCS complete. Length = ${dp[a.length][b.length]}.`,
    checks,
  });

  return steps;
}


function suffixAutomatonTrace(textInput: string): StringStep[] {
  const text = normalizeText(textInput).slice(0, 18);
  const steps: StringStep[] = [];
  const states: Array<{ len: number; link: number; next: Record<string, number> }> = [
    { len: 0, link: -1, next: {} },
  ];
  let last = 0;
  let checks = 0;

  addStep(steps, {
    text,
    pattern: text,
    textIndex: -1,
    patternIndex: -1,
    matchedText: [],
    matchedPattern: [],
    windowStart: 0,
    checks,
    message: "Suffix Automaton incrementally adds one character and maintains suffix links.",
  });

  for (let i = 0; i < text.length; i++) {
    checks++;
    const char = text[i];
    const current = states.length;
    states.push({ len: states[last].len + 1, link: 0, next: {} });

    let p = last;

    while (p !== -1 && states[p].next[char] === undefined) {
      states[p].next[char] = current;
      p = states[p].link;
    }

    if (p === -1) {
      states[current].link = 0;
    } else {
      const q = states[p].next[char];
      if (states[p].len + 1 === states[q].len) {
        states[current].link = q;
      } else {
        const clone = states.length;
        states.push({
          len: states[p].len + 1,
          link: states[q].link,
          next: { ...states[q].next },
        });

        while (p !== -1 && states[p].next[char] === q) {
          states[p].next[char] = clone;
          p = states[p].link;
        }

        states[q].link = clone;
        states[current].link = clone;
      }
    }

    last = current;

    addStep(steps, {
      text,
      pattern: text,
      textIndex: i,
      patternIndex: 0,
      matchedText: states.map((_, index) => index),
      matchedPattern: [states.length],
      windowStart: 0,
      checks,
      message: `Add "${char}". Automaton now has ${states.length} states.`,
    });
  }

  addStep(steps, {
    text,
    pattern: text,
    textIndex: -1,
    patternIndex: -1,
    matchedText: states.map((_, index) => index),
    matchedPattern: [states.length],
    windowStart: 0,
    checks,
    message: "Suffix Automaton complete.",
  });

  return steps;
}


function burrowsWheelerTransformTrace(textInput: string): StringStep[] {
  const source = `${normalizeText(textInput).slice(0, 14)}$`;
  const steps: StringStep[] = [];
  let checks = 0;

  const rotations = source
    .split("")
    .map((_, index) => source.slice(index) + source.slice(0, index));

  addStep(steps, {
    text: source,
    pattern: source,
    textIndex: 0,
    patternIndex: 0,
    windowStart: 0,
    matchedText: [],
    matchedPattern: [],
    message: "Burrows-Wheeler Transform creates every cyclic rotation of the text.",
    checks,
  });

  rotations.forEach((rotation, index) => {
    checks++;

    addStep(steps, {
      text: rotation,
      pattern: source,
      textIndex: index,
      patternIndex: 0,
      windowStart: 0,
      matchedText: [index],
      matchedPattern: [],
      message: `Rotation ${index}: ${rotation}.`,
      checks,
    });
  });

  const sorted = [...rotations].sort();

  sorted.forEach((rotation, index) => {
    checks++;

    addStep(steps, {
      text: rotation,
      pattern: source,
      textIndex: index,
      patternIndex: rotation.length - 1,
      windowStart: 0,
      matchedText: [rotation.length - 1],
      matchedPattern: [index],
      message: `Sort row ${index}: take the last character "${rotation[rotation.length - 1]}".`,
      checks,
    });
  });

  const transformed = sorted.map((row) => row[row.length - 1]).join("");

  addStep(steps, {
    text: transformed,
    pattern: source,
    textIndex: transformed.length - 1,
    patternIndex: 0,
    windowStart: 0,
    matchedText: transformed.split("").map((_, index) => index),
    matchedPattern: [0],
    message: `BWT complete: ${transformed}.`,
    checks,
  });

  return steps;
}

export function getStringTrace(algorithm: StringAlgorithm, text: string, pattern: string): StringStep[] {
  if (algorithm === "kmp") return kmpTrace(text, pattern);
  if (algorithm === "rabinKarp") return rabinKarpTrace(text, pattern);
  if (algorithm === "boyerMoore") return boyerMooreTrace(text, pattern);
  if (algorithm === "zAlgorithm") return zAlgorithmTrace(text, pattern);
  if (algorithm === "manacher") return manacherTrace(text, pattern);
  if (algorithm === "ahoCorasick") return ahoCorasickTrace(text, pattern);
  if (algorithm === "editDistance") return editDistanceTrace(text, pattern);
  if (algorithm === "lcs") return lcsTrace(text, pattern);
  if (algorithm === "suffixAutomaton") return suffixAutomatonTrace(text);
  return burrowsWheelerTransformTrace(text);
}
