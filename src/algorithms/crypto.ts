export type CryptoAlgorithm = "rsa" | "diffieHellman" | "ecc" | "aes" | "des" | "chacha20" | "sha256" | "sha3" | "hmac" | "pbkdf2" | "bcrypt" | "argon2";

export type CryptoStep = {
  blocks: string[];
  active: number | null;
  roundKeys: string[];
  table: string[][];
  output: string[];
  message: string;
  checks: number;
};

export const cryptoLabels: Record<CryptoAlgorithm, string> = {
  rsa: "RSA",
  diffieHellman: "Diffie-Hellman",
  ecc: "Elliptic Curve Crypto",
  aes: "AES",
  des: "DES",
  chacha20: "ChaCha20",
  sha256: "SHA-256",
  sha3: "SHA-3",
  hmac: "HMAC",
  pbkdf2: "PBKDF2",
  bcrypt: "bcrypt",
  argon2: "Argon2",
};

function normalizeInput(input: string) {
  return input.trim() || "HELLO";
}

function addStep(steps: CryptoStep[], step: CryptoStep) {
  steps.push({
    blocks: [...step.blocks],
    active: step.active,
    roundKeys: [...step.roundKeys],
    table: step.table.map((row) => [...row]),
    output: [...step.output],
    message: step.message,
    checks: step.checks,
  });
}

function modPow(base: number, exponent: number, mod: number) {
  let result = 1;
  base %= mod;

  while (exponent > 0) {
    if (exponent % 2 === 1) result = (result * base) % mod;
    base = (base * base) % mod;
    exponent = Math.floor(exponent / 2);
  }

  return result;
}

function rsaTrace(input: string): CryptoStep[] {
  const text = normalizeInput(input);
  const steps: CryptoStep[] = [];
  const p = 11;
  const q = 17;
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  const e = 7;
  const d = 23;
  const message = text.charCodeAt(0) % n;
  let checks = 0;

  addStep(steps, {
    blocks: [text],
    active: null,
    roundKeys: [`p=${p}`, `q=${q}`, `n=${n}`],
    table: [["p", "q", "n"], [String(p), String(q), String(n)]],
    output: [],
    message: "RSA chooses two primes, multiplies them into n, then creates public and private exponents.",
    checks,
  });

  checks++;
  const cipher = modPow(message, e, n);

  addStep(steps, {
    blocks: [String(message), String(cipher)],
    active: 1,
    roundKeys: [`public e=${e}`, `n=${n}`],
    table: [["m", "e", "c"], [String(message), String(e), String(cipher)]],
    output: [`cipher=${cipher}`],
    message: `Encrypt with c = m^e mod n. Here ${message}^${e} mod ${n} = ${cipher}.`,
    checks,
  });

  checks++;
  const plain = modPow(cipher, d, n);

  addStep(steps, {
    blocks: [String(cipher), String(plain)],
    active: 1,
    roundKeys: [`private d=${d}`, `phi=${phi}`],
    table: [["c", "d", "m"], [String(cipher), String(d), String(plain)]],
    output: [`plain=${plain}`],
    message: `Decrypt with m = c^d mod n. Result is ${plain}.`,
    checks,
  });

  return steps;
}

function diffieHellmanTrace(): CryptoStep[] {
  const steps: CryptoStep[] = [];
  const p = 23;
  const g = 5;
  const a = 6;
  const b = 15;
  let checks = 0;

  addStep(steps, {
    blocks: [`p=${p}`, `g=${g}`],
    active: null,
    roundKeys: [],
    table: [["prime p", "generator g"], [String(p), String(g)]],
    output: [],
    message: "Diffie-Hellman lets two parties agree on a shared secret over a public channel.",
    checks,
  });

  checks++;
  const A = modPow(g, a, p);
  const B = modPow(g, b, p);

  addStep(steps, {
    blocks: [`A=${A}`, `B=${B}`],
    active: 0,
    roundKeys: [`Alice private=${a}`, `Bob private=${b}`],
    table: [["Alice public", "Bob public"], [String(A), String(B)]],
    output: [`A=${A}`, `B=${B}`],
    message: "Each side publishes g raised to its private exponent modulo p.",
    checks,
  });

  checks++;
  const aliceSecret = modPow(B, a, p);
  const bobSecret = modPow(A, b, p);

  addStep(steps, {
    blocks: [`Alice secret=${aliceSecret}`, `Bob secret=${bobSecret}`],
    active: 1,
    roundKeys: [`B^a mod p`, `A^b mod p`],
    table: [["Alice", "Bob"], [String(aliceSecret), String(bobSecret)]],
    output: [`shared=${aliceSecret}`],
    message: "Both sides derive the same shared secret.",
    checks,
  });

  return steps;
}

function eccTrace(): CryptoStep[] {
  const steps: CryptoStep[] = [];
  const base = { x: 3, y: 6 };
  const privateKey = 7;
  let checks = 0;

  addStep(steps, {
    blocks: [`G=(${base.x},${base.y})`],
    active: null,
    roundKeys: [`private=${privateKey}`],
    table: [["Operation", "Point", "Meaning"]],
    output: [],
    message: "Elliptic Curve Crypto repeatedly adds a base point to create a public key.",
    checks,
  });

  let x = base.x;
  let y = base.y;

  for (let i = 1; i <= privateKey; i++) {
    checks++;
    x = (x + base.x + i) % 17;
    y = (y + base.y + i * 2) % 17;

    addStep(steps, {
      blocks: [`${i}G`, `(${x},${y})`],
      active: i,
      roundKeys: [`double/add ${i}`],
      table: [[`step ${i}`, `(${x},${y})`, "point addition"]],
      output: [`public=(${x},${y})`],
      message: `Point operation ${i}: move to (${x}, ${y}).`,
      checks,
    });
  }

  addStep(steps, {
    blocks: [`Public key (${x},${y})`],
    active: null,
    roundKeys: [`private=${privateKey}`],
    table: [["Private scalar", "Public point"], [String(privateKey), `(${x},${y})`]],
    output: [`(${x},${y})`],
    message: "ECC visual complete.",
    checks,
  });

  return steps;
}

function aesTrace(input: string): CryptoStep[] {
  const text = normalizeInput(input).padEnd(16, "_").slice(0, 16);
  const blocks = text.match(/.{1,4}/g) ?? [text];
  const steps: CryptoStep[] = [];
  let state = [...blocks];
  let checks = 0;

  addStep(steps, {
    blocks: state,
    active: null,
    roundKeys: ["K0"],
    table: [["Round", "Step", "State"]],
    output: [],
    message: "AES transforms a 128-bit block through repeated substitution, shifting, mixing, and round-key addition.",
    checks,
  });

  const rounds = ["SubBytes", "ShiftRows", "MixColumns", "AddRoundKey"];

  rounds.forEach((round, index) => {
    checks++;
    state = state.map((block, blockIndex) => `${blockIndex}${block.split("").reverse().join("")}`.slice(0, 4));

    addStep(steps, {
      blocks: state,
      active: index,
      roundKeys: [`K${index + 1}`],
      table: [[String(index + 1), round, state.join(" ")]],
      output: state,
      message: `AES round step: ${round}.`,
      checks,
    });
  });

  addStep(steps, {
    blocks: state,
    active: null,
    roundKeys: ["final"],
    table: [["Cipher block", state.join(" ")]],
    output: state,
    message: "AES visual complete.",
    checks,
  });

  return steps;
}


function desTrace(input: string): CryptoStep[] {
  const text = normalizeInput(input).padEnd(8, "_").slice(0, 8);
  const steps: CryptoStep[] = [];
  let blocks: string[] = text.match(/.{1,2}/g) ?? [text];
  let checks = 0;

  addStep(steps, {
    blocks,
    active: null,
    roundKeys: ["K1", "K2", "K3"],
    table: [["Round", "Left", "Right"]],
    output: [],
    message: "DES is a Feistel block cipher. Each round swaps halves after applying a round function.",
    checks,
  });

  for (let round = 1; round <= 4; round++) {
    checks++;
    blocks = blocks.map((block, index) => `${block.split("").reverse().join("")}${index}`.slice(0, 2));

    addStep(steps, {
      blocks,
      active: round % blocks.length,
      roundKeys: [`K${round}`],
      table: [[String(round), blocks.slice(0, 2).join(""), blocks.slice(2).join("")]],
      output: blocks,
      message: `DES round ${round}: expand, mix with key, substitute, permute, then swap halves.`,
      checks,
    });
  }

  addStep(steps, {
    blocks,
    active: null,
    roundKeys: ["final permutation"],
    table: [["Cipher", blocks.join("")]],
    output: [blocks.join("")],
    message: "DES visual complete.",
    checks,
  });

  return steps;
}

function chacha20Trace(input: string): CryptoStep[] {
  const text = normalizeInput(input);
  const words = text.padEnd(16, "_").slice(0, 16).match(/.{1,4}/g) ?? [text];
  const steps: CryptoStep[] = [];
  let state = [...words];
  let checks = 0;

  addStep(steps, {
    blocks: state,
    active: null,
    roundKeys: ["constant", "key", "counter", "nonce"],
    table: [["Quarter", "Operation", "Word state"]],
    output: [],
    message: "ChaCha20 is a stream cipher built from repeated quarter-round operations.",
    checks,
  });

  for (let quarter = 0; quarter < 8; quarter++) {
    checks++;
    const active = quarter % state.length;
    state[active] = `${state[active].split("").reverse().join("")}${quarter}`.slice(0, 4);

    addStep(steps, {
      blocks: state,
      active,
      roundKeys: [`QR${quarter + 1}`],
      table: [[String(quarter + 1), "add xor rotate", state.join(" ")]],
      output: state,
      message: `Quarter-round ${quarter + 1}: add, XOR, and rotate selected words.`,
      checks,
    });
  }

  addStep(steps, {
    blocks: state,
    active: null,
    roundKeys: ["keystream"],
    table: [["Output block", state.join(" ")]],
    output: [state.join("")],
    message: "ChaCha20 visual complete.",
    checks,
  });

  return steps;
}

function sha256Trace(input: string): CryptoStep[] {
  const text = normalizeInput(input);
  const steps: CryptoStep[] = [];
  const chunks = text.padEnd(16, "_").slice(0, 16).match(/.{1,4}/g) ?? [text];
  const constants = ["Σ0", "Σ1", "Ch", "Maj"];
  let checks = 0;
  let state = ["a", "b", "c", "d", "e", "f", "g", "h"];

  addStep(steps, {
    blocks: chunks,
    active: null,
    roundKeys: constants,
    table: [["Round", "Function", "State"]],
    output: [],
    message: "SHA-256 pads the message, expands a schedule, then compresses with 64 rounds.",
    checks,
  });

  for (let round = 1; round <= 6; round++) {
    checks++;
    state = state.map((value, index) => `${value}${round + index}`.slice(-2));

    addStep(steps, {
      blocks: state,
      active: round % state.length,
      roundKeys: [`K${round}`, constants[round % constants.length]],
      table: [[String(round), constants[round % constants.length], state.join(" ")]],
      output: state,
      message: `SHA-256 compression round ${round}: mix schedule word, constant, and working variables.`,
      checks,
    });
  }

  addStep(steps, {
    blocks: state,
    active: null,
    roundKeys: ["digest"],
    table: [["Digest", state.join("")]],
    output: [state.join("")],
    message: "SHA-256 visual complete.",
    checks,
  });

  return steps;
}

function sha3Trace(input: string): CryptoStep[] {
  const text = normalizeInput(input);
  const steps: CryptoStep[] = [];
  let lanes: string[] = text.padEnd(25, "_").slice(0, 25).match(/.{1,5}/g) ?? [text];
  const phases = ["Theta", "Rho", "Pi", "Chi", "Iota"];
  let checks = 0;

  addStep(steps, {
    blocks: lanes,
    active: null,
    roundKeys: phases,
    table: [["Phase", "Lane update", "State"]],
    output: [],
    message: "SHA-3 uses a sponge construction with Keccak permutation phases.",
    checks,
  });

  for (const phase of phases) {
    checks++;
    lanes = lanes.map((lane, index) => `${lane.slice(1)}${index}`.slice(0, 5));

    addStep(steps, {
      blocks: lanes,
      active: checks % lanes.length,
      roundKeys: [phase],
      table: [[phase, "permute lanes", lanes.join(" ")]],
      output: lanes,
      message: `SHA-3 phase ${phase}: transform the 5x5 lane state.`,
      checks,
    });
  }

  addStep(steps, {
    blocks: lanes,
    active: null,
    roundKeys: ["squeeze"],
    table: [["Digest", lanes.join("")]],
    output: [lanes.join("").slice(0, 16)],
    message: "SHA-3 visual complete.",
    checks,
  });

  return steps;
}


function hmacTrace(input: string): CryptoStep[] {
  const text = normalizeInput(input);
  const steps: CryptoStep[] = [];
  const key = "K";
  let checks = 0;

  addStep(steps, {
    blocks: [text],
    active: null,
    roundKeys: [key, "ipad", "opad"],
    table: [["Stage", "Input", "Output"]],
    output: [],
    message: "HMAC combines a secret key with an inner hash and an outer hash.",
    checks,
  });

  checks++;
  const inner = `${key}:ipad:${text}`.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0).toString(16);

  addStep(steps, {
    blocks: [text, inner],
    active: 1,
    roundKeys: ["K xor ipad"],
    table: [["Inner hash", text, inner]],
    output: [inner],
    message: "Compute inner hash over key xor ipad plus the message.",
    checks,
  });

  checks++;
  const outer = `${key}:opad:${inner}`.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0).toString(16);

  addStep(steps, {
    blocks: [inner, outer],
    active: 1,
    roundKeys: ["K xor opad"],
    table: [["Outer hash", inner, outer]],
    output: [outer],
    message: "Compute outer hash over key xor opad plus the inner digest.",
    checks,
  });

  return steps;
}

function pbkdf2Trace(input: string): CryptoStep[] {
  const password = normalizeInput(input);
  const steps: CryptoStep[] = [];
  let block = password;
  let checks = 0;

  addStep(steps, {
    blocks: [password, "salt"],
    active: null,
    roundKeys: ["salt", "iterations"],
    table: [["Iteration", "PRF", "Derived block"]],
    output: [],
    message: "PBKDF2 repeatedly applies a pseudorandom function to stretch a password into a key.",
    checks,
  });

  for (let i = 1; i <= 5; i++) {
    checks++;
    block = `${block}:${i}`.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0).toString(16);

    addStep(steps, {
      blocks: [block],
      active: 0,
      roundKeys: [`iter ${i}`],
      table: [[String(i), "HMAC", block]],
      output: [block],
      message: `PBKDF2 iteration ${i}: feed previous output back into the PRF.`,
      checks,
    });
  }

  addStep(steps, {
    blocks: [block],
    active: null,
    roundKeys: ["derived key"],
    table: [["Key", block]],
    output: [block],
    message: "PBKDF2 visual complete.",
    checks,
  });

  return steps;
}

function bcryptTrace(input: string): CryptoStep[] {
  const password = normalizeInput(input);
  const steps: CryptoStep[] = [];
  let state = password;
  let checks = 0;

  addStep(steps, {
    blocks: [password, "salt"],
    active: null,
    roundKeys: ["cost", "EksBlowfish"],
    table: [["Phase", "State", "Meaning"]],
    output: [],
    message: "bcrypt mixes password and salt through an expensive key schedule.",
    checks,
  });

  for (let round = 1; round <= 6; round++) {
    checks++;
    state = `${state}${round}`.split("").reverse().join("").slice(0, 12);

    addStep(steps, {
      blocks: [state],
      active: 0,
      roundKeys: [`cost round ${round}`],
      table: [[String(round), state, "expand key"]],
      output: [state],
      message: `bcrypt cost round ${round}: repeatedly expand the key schedule.`,
      checks,
    });
  }

  addStep(steps, {
    blocks: [state],
    active: null,
    roundKeys: ["final hash"],
    table: [["bcrypt hash", state]],
    output: [state],
    message: "bcrypt visual complete.",
    checks,
  });

  return steps;
}

function argon2Trace(input: string): CryptoStep[] {
  const password = normalizeInput(input);
  const steps: CryptoStep[] = [];
  const memory = Array.from({ length: 8 }, (_, index) => `${password[0] ?? "P"}${index}`);
  let checks = 0;

  addStep(steps, {
    blocks: memory,
    active: null,
    roundKeys: ["memory", "time", "parallelism"],
    table: [["Pass", "Memory block", "Action"]],
    output: [],
    message: "Argon2 is memory-hard: it fills and revisits memory blocks to resist brute-force hardware attacks.",
    checks,
  });

  for (let pass = 1; pass <= 3; pass++) {
    for (let i = 0; i < memory.length; i++) {
      checks++;
      memory[i] = `${memory[i]}${pass}`.slice(-4);

      addStep(steps, {
        blocks: memory,
        active: i,
        roundKeys: [`pass ${pass}`],
        table: [[String(pass), `B${i}`, memory[i]]],
        output: [memory[i]],
        message: `Argon2 pass ${pass}: update memory block ${i}.`,
        checks,
      });

      if (steps.length > 18) break;
    }
  }

  const final = memory.join("").slice(0, 18);

  addStep(steps, {
    blocks: memory,
    active: null,
    roundKeys: ["final hash"],
    table: [["Argon2 hash", final]],
    output: [final],
    message: "Argon2 visual complete.",
    checks,
  });

  return steps;
}

export function getCryptoTrace(algorithm: CryptoAlgorithm, input: string): CryptoStep[] {
  if (algorithm === "rsa") return rsaTrace(input);
  if (algorithm === "diffieHellman") return diffieHellmanTrace();
  if (algorithm === "ecc") return eccTrace();
  if (algorithm === "aes") return aesTrace(input);
  if (algorithm === "des") return desTrace(input);
  if (algorithm === "chacha20") return chacha20Trace(input);
  if (algorithm === "sha256") return sha256Trace(input);
  if (algorithm === "sha3") return sha3Trace(input);
  if (algorithm === "hmac") return hmacTrace(input);
  if (algorithm === "pbkdf2") return pbkdf2Trace(input);
  if (algorithm === "bcrypt") return bcryptTrace(input);
  return argon2Trace(input);
}
