export type MathAlgorithm = "euclidean" | "extendedEuclidean" | "sieve" | "modularExponentiation" | "millerRabin" | "chineseRemainder" | "fft" | "karatsuba" | "aksPrimality" | "newtonMethod" | "gradientDescent" | "monteCarloMethod";

export type MathStep = {
  values: number[];
  table: string[][];
  active: number | null;
  output: string[];
  message: string;
  checks: number;
};

export const mathLabels: Record<MathAlgorithm, string> = {
  euclidean: "Euclidean Algorithm",
  extendedEuclidean: "Extended Euclidean",
  sieve: "Sieve of Eratosthenes",
  modularExponentiation: "Modular Exponentiation",
  millerRabin: "Miller-Rabin",
  chineseRemainder: "Chinese Remainder Theorem",
  fft: "Fast Fourier Transform",
  karatsuba: "Karatsuba Multiplication",
  aksPrimality: "AKS Primality",
  newtonMethod: "Newton Method",
  gradientDescent: "Gradient Descent",
  monteCarloMethod: "Monte Carlo Method",
};

function parseMathValues(input: string) {
  const values = input
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item))
    .slice(0, 20);

  return values.length >= 2 ? values : [252, 105, 2, 13, 497];
}

function addStep(steps: MathStep[], step: MathStep) {
  steps.push({
    values: [...step.values],
    table: step.table.map((row) => [...row]),
    active: step.active,
    output: [...step.output],
    message: step.message,
    checks: step.checks,
  });
}

function euclideanTrace(input: string): MathStep[] {
  const values = parseMathValues(input);
  let a = Math.abs(values[0] || 252);
  let b = Math.abs(values[1] || 105);
  const steps: MathStep[] = [];
  const table: string[][] = [];
  const output: string[] = [];
  let checks = 0;

  addStep(steps, {
    values: [a, b],
    table,
    active: null,
    output,
    message: "Euclidean Algorithm repeatedly replaces (a, b) with (b, a mod b).",
    checks,
  });

  while (b !== 0) {
    checks++;
    const remainder = a % b;
    table.push([String(a), String(b), String(remainder)]);
    output.push(`${a} mod ${b} = ${remainder}`);

    addStep(steps, {
      values: [a, b, remainder],
      table,
      active: remainder,
      output,
      message: `${a} mod ${b} = ${remainder}. Continue with (${b}, ${remainder}).`,
      checks,
    });

    a = b;
    b = remainder;
  }

  addStep(steps, {
    values: [a],
    table,
    active: a,
    output: [`gcd = ${a}`],
    message: `Euclidean Algorithm complete. GCD is ${a}.`,
    checks,
  });

  return steps;
}

function extendedEuclideanTrace(input: string): MathStep[] {
  const values = parseMathValues(input);
  let oldR = Math.abs(values[0] || 252);
  let r = Math.abs(values[1] || 105);
  let oldS = 1;
  let s = 0;
  let oldT = 0;
  let t = 1;
  const steps: MathStep[] = [];
  const table: string[][] = [["q", "r", "s", "t"]];
  let checks = 0;

  addStep(steps, {
    values: [oldR, r],
    table,
    active: null,
    output: [],
    message: "Extended Euclidean also tracks coefficients s and t such that ax + by = gcd(a, b).",
    checks,
  });

  while (r !== 0) {
    checks++;
    const q = Math.floor(oldR / r);

    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
    [oldT, t] = [t, oldT - q * t];

    table.push([String(q), String(oldR), String(oldS), String(oldT)]);

    addStep(steps, {
      values: [oldR, r, oldS, oldT],
      table,
      active: oldR,
      output: [`s=${oldS}`, `t=${oldT}`],
      message: `Use quotient ${q}. Current gcd candidate is ${oldR}, coefficients are s=${oldS}, t=${oldT}.`,
      checks,
    });
  }

  addStep(steps, {
    values: [oldR, oldS, oldT],
    table,
    active: oldR,
    output: [`gcd=${oldR}`, `s=${oldS}`, `t=${oldT}`],
    message: `Extended Euclidean complete. gcd=${oldR}, s=${oldS}, t=${oldT}.`,
    checks,
  });

  return steps;
}

function sieveTrace(input: string): MathStep[] {
  const values = parseMathValues(input);
  const n = Math.max(20, Math.min(80, Math.abs(values[0] || 40)));
  const prime = new Array(n + 1).fill(true);
  prime[0] = false;
  prime[1] = false;

  const steps: MathStep[] = [];
  const output: string[] = [];
  let checks = 0;

  addStep(steps, {
    values: Array.from({ length: n + 1 }, (_, index) => index),
    table: [["Number", "State", "Reason"]],
    active: null,
    output,
    message: `Sieve marks composites up to ${n}.`,
    checks,
  });

  for (let p = 2; p * p <= n; p++) {
    checks++;

    if (!prime[p]) continue;

    addStep(steps, {
      values: Array.from({ length: n + 1 }, (_, index) => index),
      table: [[String(p), "prime", "mark multiples"]],
      active: p,
      output,
      message: `${p} is still prime. Mark multiples of ${p}.`,
      checks,
    });

    for (let multiple = p * p; multiple <= n; multiple += p) {
      prime[multiple] = false;
      checks++;

      addStep(steps, {
        values: Array.from({ length: n + 1 }, (_, index) => prime[index] ? index : -index),
        table: [[String(multiple), "composite", `multiple of ${p}`]],
        active: multiple,
        output,
        message: `Mark ${multiple} as composite.`,
        checks,
      });
    }
  }

  for (let i = 2; i <= n; i++) {
    if (prime[i]) output.push(String(i));
  }

  addStep(steps, {
    values: Array.from({ length: n + 1 }, (_, index) => prime[index] ? index : -index),
    table: output.map((value) => [value, "prime", "survived sieve"]),
    active: null,
    output,
    message: `Sieve complete. Found ${output.length} primes.`,
    checks,
  });

  return steps;
}

function modularExponentiationTrace(input: string): MathStep[] {
  const values = parseMathValues(input);
  let base = Math.abs(values[0] || 2);
  let exponent = Math.abs(values[1] || 13);
  const mod = Math.max(2, Math.abs(values[2] || 497));
  const original = { base, exponent, mod };
  let result = 1;
  base %= mod;

  const steps: MathStep[] = [];
  const table: string[][] = [["result", "base", "exponent"]];
  let checks = 0;

  addStep(steps, {
    values: [original.base, original.exponent, original.mod],
    table,
    active: null,
    output: [],
    message: "Modular Exponentiation uses exponentiation by squaring.",
    checks,
  });

  while (exponent > 0) {
    checks++;

    if (exponent % 2 === 1) {
      result = (result * base) % mod;
    }

    table.push([String(result), String(base), String(exponent)]);

    addStep(steps, {
      values: [result, base, exponent],
      table,
      active: exponent,
      output: [`result=${result}`],
      message:
        exponent % 2 === 1
          ? `Exponent is odd. Multiply result by base modulo ${mod}.`
          : `Exponent is even. Skip multiply and square base.`,
      checks,
    });

    base = (base * base) % mod;
    exponent = Math.floor(exponent / 2);
  }

  addStep(steps, {
    values: [result],
    table,
    active: result,
    output: [`${original.base}^${original.exponent} mod ${mod} = ${result}`],
    message: `Modular Exponentiation complete. Answer is ${result}.`,
    checks,
  });

  return steps;
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

function millerRabinTrace(input: string): MathStep[] {
  const values = parseMathValues(input);
  const n = Math.max(5, Math.abs(values[0] || 97));
  const bases = [2, 3, 5, 7].filter((base) => base < n);
  let d = n - 1;
  let r = 0;
  const table: string[][] = [];
  const output: string[] = [];
  const steps: MathStep[] = [];
  let checks = 0;

  while (d % 2 === 0) {
    d /= 2;
    r++;
  }

  addStep(steps, {
    values: [n, d, r],
    table: [["n", "d", "r"], [String(n), String(d), String(r)]],
    active: n,
    output,
    message: `Miller-Rabin writes n - 1 as d * 2^r. Here ${n - 1} = ${d} * 2^${r}.`,
    checks,
  });

  for (const base of bases) {
    checks++;
    let x = modPow(base, d, n);
    table.push([String(base), String(x), "initial witness"]);

    addStep(steps, {
      values: [n, base, x],
      table,
      active: base,
      output,
      message: `Test base ${base}. Compute ${base}^${d} mod ${n} = ${x}.`,
      checks,
    });

    if (x === 1 || x === n - 1) {
      output.push(`${base}: pass`);
      continue;
    }

    let passed = false;

    for (let i = 1; i < r; i++) {
      checks++;
      x = (x * x) % n;
      table.push([String(base), String(x), `square ${i}`]);

      addStep(steps, {
        values: [n, base, x],
        table,
        active: x,
        output,
        message: `Square witness value. Now x = ${x}.`,
        checks,
      });

      if (x === n - 1) {
        passed = true;
        break;
      }
    }

    output.push(`${base}: ${passed ? "pass" : "composite witness"}`);

    if (!passed) {
      addStep(steps, {
        values: [n, base, x],
        table,
        active: base,
        output,
        message: `Base ${base} proves ${n} is composite.`,
        checks,
      });

      return steps;
    }
  }

  addStep(steps, {
    values: [n],
    table,
    active: n,
    output,
    message: `${n} is probably prime for the tested bases.`,
    checks,
  });

  return steps;
}

function chineseRemainderTrace(input: string): MathStep[] {
  const values = parseMathValues(input);
  const residues = [values[0] ?? 2, values[1] ?? 3, values[2] ?? 2].map((value) => Math.abs(value) % 5);
  const moduli = [3, 5, 7];
  const product = moduli.reduce((acc, value) => acc * value, 1);
  const table: string[][] = [["ai", "mi", "Mi"]];
  const output: string[] = [];
  const steps: MathStep[] = [];
  let sum = 0;
  let checks = 0;

  addStep(steps, {
    values: residues.concat(moduli),
    table,
    active: null,
    output,
    message: "Chinese Remainder Theorem combines congruences x ≡ ai mod mi.",
    checks,
  });

  for (let i = 0; i < residues.length; i++) {
    checks++;
    const ai = residues[i];
    const mi = moduli[i];
    const bigM = product / mi;
    let inverse = 1;

    while ((bigM * inverse) % mi !== 1) inverse++;

    const term = ai * bigM * inverse;
    sum += term;
    table.push([String(ai), String(mi), `${bigM} inv ${inverse}`]);
    output.push(`term ${i}: ${term}`);

    addStep(steps, {
      values: [ai, mi, bigM, inverse],
      table,
      active: ai,
      output,
      message: `For x ≡ ${ai} mod ${mi}, use M=${bigM} and inverse=${inverse}.`,
      checks,
    });
  }

  const answer = ((sum % product) + product) % product;

  addStep(steps, {
    values: [answer, product],
    table,
    active: answer,
    output: [`x ≡ ${answer} mod ${product}`],
    message: `CRT complete. Combined solution is x ≡ ${answer} mod ${product}.`,
    checks,
  });

  return steps;
}

function fftTrace(input: string): MathStep[] {
  const values = parseMathValues(input).slice(0, 8);
  const padded = [...values];

  while ((padded.length & (padded.length - 1)) !== 0) padded.push(0);

  const steps: MathStep[] = [];
  const table: string[][] = [];
  const output: string[] = [];
  let checks = 0;

  addStep(steps, {
    values: padded,
    table: [["Stage", "Size", "Operation"]],
    active: null,
    output,
    message: "FFT recursively splits coefficients into even and odd positions.",
    checks,
  });

  for (let size = 2; size <= padded.length; size *= 2) {
    checks++;

    for (let start = 0; start < padded.length; start += size) {
      const left = padded.slice(start, start + size / 2);
      const right = padded.slice(start + size / 2, start + size);
      table.push([`stage ${Math.log2(size)}`, `size ${size}`, `combine ${left.join(",")} | ${right.join(",")}`]);

      addStep(steps, {
        values: padded,
        table,
        active: start,
        output,
        message: `Combine block starting at ${start} with size ${size}.`,
        checks,
      });
    }

    output.push(`stage ${Math.log2(size)}`);
  }

  addStep(steps, {
    values: padded,
    table,
    active: null,
    output,
    message: "FFT visual complete. Coefficients were combined by powers of two.",
    checks,
  });

  return steps;
}

function karatsubaTrace(input: string): MathStep[] {
  const values = parseMathValues(input);
  const x = Math.abs(values[0] || 1234);
  const y = Math.abs(values[1] || 5678);
  const table: string[][] = [];
  const output: string[] = [];
  const steps: MathStep[] = [];
  let checks = 0;

  function karatsuba(a: number, b: number, depth: number): number {
    checks++;

    if (a < 10 || b < 10) {
      const product = a * b;
      table.push([`depth ${depth}`, `${a} * ${b}`, String(product)]);

      addStep(steps, {
        values: [a, b, product],
        table,
        active: product,
        output,
        message: `Base multiply ${a} * ${b} = ${product}.`,
        checks,
      });

      return product;
    }

    const n = Math.max(String(a).length, String(b).length);
    const half = Math.floor(n / 2);
    const power = 10 ** half;

    const highA = Math.floor(a / power);
    const lowA = a % power;
    const highB = Math.floor(b / power);
    const lowB = b % power;

    table.push([`depth ${depth}`, `${a}, ${b}`, `split ${highA}|${lowA}, ${highB}|${lowB}`]);

    addStep(steps, {
      values: [highA, lowA, highB, lowB],
      table,
      active: depth,
      output,
      message: `Split ${a} and ${b} into high and low parts.`,
      checks,
    });

    const z0 = karatsuba(lowA, lowB, depth + 1);
    const z2 = karatsuba(highA, highB, depth + 1);
    const z1 = karatsuba(lowA + highA, lowB + highB, depth + 1) - z2 - z0;
    const result = z2 * 10 ** (2 * half) + z1 * power + z0;

    output.push(`z0=${z0}`, `z1=${z1}`, `z2=${z2}`);

    addStep(steps, {
      values: [z2, z1, z0, result],
      table,
      active: result,
      output,
      message: `Combine z2, z1, z0 into ${result}.`,
      checks,
    });

    return result;
  }

  addStep(steps, {
    values: [x, y],
    table: [["Depth", "Input", "Action"]],
    active: null,
    output,
    message: "Karatsuba reduces multiplication from four recursive products to three.",
    checks,
  });

  const result = karatsuba(x, y, 0);

  addStep(steps, {
    values: [result],
    table,
    active: result,
    output: [`${x} * ${y} = ${result}`],
    message: "Karatsuba Multiplication complete.",
    checks,
  });

  return steps;
}


function aksPrimalityTrace(input: string): MathStep[] {
  const values = parseMathValues(input);
  const n = Math.max(5, Math.abs(values[0] || 31));
  const table: string[][] = [["Check", "Value", "Result"]];
  const output: string[] = [];
  const steps: MathStep[] = [];
  let checks = 0;

  addStep(steps, {
    values: [n],
    table,
    active: n,
    output,
    message: "AKS Primality is based on polynomial congruence. This visual shows the practical high-level checks.",
    checks,
  });

  const perfectPower = Number.isInteger(Math.sqrt(n)) || Number.isInteger(Math.cbrt(n));
  checks++;
  table.push(["Perfect power", String(n), perfectPower ? "composite" : "pass"]);

  addStep(steps, {
    values: [n],
    table,
    active: n,
    output,
    message: perfectPower ? `${n} is a perfect power, so it is composite.` : `${n} is not a small perfect power.`,
    checks,
  });

  if (perfectPower) return steps;

  for (let a = 2; a <= Math.min(8, n - 1); a++) {
    checks++;
    const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
    const g = gcd(n, a);

    table.push([`gcd(${n}, ${a})`, String(g), g > 1 ? "factor found" : "coprime"]);

    addStep(steps, {
      values: [n, a, g],
      table,
      active: a,
      output,
      message: g > 1 ? `Found non-trivial gcd ${g}; composite.` : `gcd(${n}, ${a}) = 1, continue.`,
      checks,
    });

    if (g > 1) return steps;
  }

  output.push("probably prime by AKS-style checks");

  addStep(steps, {
    values: [n],
    table,
    active: n,
    output,
    message: "AKS visual complete. Full AKS would verify polynomial congruence after these checks.",
    checks,
  });

  return steps;
}

function newtonMethodTrace(input: string): MathStep[] {
  const values = parseMathValues(input);
  const target = Math.max(2, Math.abs(values[0] || 25));
  let x = Math.max(1, Math.abs(values[1] || 6));
  const table: string[][] = [["Iteration", "x", "f(x)"]];
  const output: string[] = [];
  const steps: MathStep[] = [];
  let checks = 0;

  addStep(steps, {
    values: [target, x],
    table,
    active: x,
    output,
    message: `Newton Method approximates sqrt(${target}) by repeatedly improving x.`,
    checks,
  });

  for (let i = 0; i < 8; i++) {
    checks++;
    const fx = x * x - target;
    table.push([String(i), x.toFixed(6), fx.toFixed(6)]);

    addStep(steps, {
      values: [Math.round(x * 1000), Math.round(fx * 1000)],
      table,
      active: i,
      output: [`x=${x.toFixed(6)}`],
      message: `Iteration ${i}: f(x)=x²-${target}=${fx.toFixed(6)}.`,
      checks,
    });

    x = 0.5 * (x + target / x);
  }

  addStep(steps, {
    values: [Math.round(x * 1000)],
    table,
    active: Math.round(x),
    output: [`sqrt(${target}) ≈ ${x.toFixed(6)}`],
    message: "Newton Method complete.",
    checks,
  });

  return steps;
}

function gradientDescentTrace(input: string): MathStep[] {
  const values = parseMathValues(input);
  const target = Math.max(1, Math.abs(values[0] || 7));
  let x = Math.abs(values[1] || 20);
  const learningRate = 0.12;
  const table: string[][] = [["Iteration", "x", "gradient"]];
  const output: string[] = [];
  const steps: MathStep[] = [];
  let checks = 0;

  addStep(steps, {
    values: [target, x],
    table,
    active: x,
    output,
    message: `Gradient Descent minimizes f(x)=(x-${target})².`,
    checks,
  });

  for (let i = 0; i < 12; i++) {
    checks++;
    const gradient = 2 * (x - target);
    table.push([String(i), x.toFixed(4), gradient.toFixed(4)]);

    addStep(steps, {
      values: [Math.round(x * 100), Math.round(gradient * 100)],
      table,
      active: i,
      output: [`x=${x.toFixed(4)}`],
      message: `Move opposite the gradient: x = x - lr * ${gradient.toFixed(4)}.`,
      checks,
    });

    x = x - learningRate * gradient;
  }

  addStep(steps, {
    values: [Math.round(x * 100)],
    table,
    active: Math.round(x),
    output: [`minimum near x=${x.toFixed(4)}`],
    message: "Gradient Descent complete.",
    checks,
  });

  return steps;
}

function monteCarloMethodTrace(input: string): MathStep[] {
  const values = parseMathValues(input);
  const samples = Math.max(20, Math.min(80, Math.abs(values[0] || 40)));
  const table: string[][] = [["Sample", "x²+y²", "Inside?"]];
  const output: string[] = [];
  const steps: MathStep[] = [];
  let inside = 0;
  let checks = 0;

  addStep(steps, {
    values: [samples],
    table,
    active: null,
    output,
    message: "Monte Carlo Method estimates π by sampling points inside a unit square.",
    checks,
  });

  for (let i = 1; i <= samples; i++) {
    checks++;
    const x = ((i * 37) % 100) / 100;
    const y = ((i * 61) % 100) / 100;
    const radius = x * x + y * y;
    const hit = radius <= 1;

    if (hit) inside++;

    if (i <= 20 || i % 10 === 0) {
      table.push([String(i), radius.toFixed(3), hit ? "yes" : "no"]);
      const estimate = 4 * inside / i;

      addStep(steps, {
        values: [i, inside, Math.round(estimate * 1000)],
        table,
        active: i,
        output: [`π≈${estimate.toFixed(4)}`],
        message: `Sample ${i}: ${inside}/${i} inside circle, estimate π≈${estimate.toFixed(4)}.`,
        checks,
      });
    }
  }

  const estimate = 4 * inside / samples;

  addStep(steps, {
    values: [samples, inside, Math.round(estimate * 1000)],
    table,
    active: samples,
    output: [`π≈${estimate.toFixed(4)}`],
    message: "Monte Carlo Method complete.",
    checks,
  });

  return steps;
}

export function getMathTrace(algorithm: MathAlgorithm, input: string): MathStep[] {
  if (algorithm === "euclidean") return euclideanTrace(input);
  if (algorithm === "extendedEuclidean") return extendedEuclideanTrace(input);
  if (algorithm === "sieve") return sieveTrace(input);
  if (algorithm === "modularExponentiation") return modularExponentiationTrace(input);
  if (algorithm === "millerRabin") return millerRabinTrace(input);
  if (algorithm === "chineseRemainder") return chineseRemainderTrace(input);
  if (algorithm === "fft") return fftTrace(input);
  if (algorithm === "karatsuba") return karatsubaTrace(input);
  if (algorithm === "aksPrimality") return aksPrimalityTrace(input);
  if (algorithm === "newtonMethod") return newtonMethodTrace(input);
  if (algorithm === "gradientDescent") return gradientDescentTrace(input);
  return monteCarloMethodTrace(input);
}
