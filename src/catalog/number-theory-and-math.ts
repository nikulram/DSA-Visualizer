import type { CatalogSection } from "./types";

export const numberTheoryAndMathCatalog: CatalogSection = {
    title: "Number Theory and Math",
  description: "Show numeric algorithms, modular arithmetic, primality, and iterative math.",
    entries: [
      { title: "Euclidean Algorithm", tag: "O(log n)", status: "playable", kind: "math", id: "euclidean" },
      { title: "Extended Euclidean", tag: "O(log n)", status: "playable", kind: "math", id: "extendedEuclidean" },
      { title: "Sieve of Eratosthenes", tag: "O(n log log n)", status: "playable", kind: "math", id: "sieve" },
      { title: "Modular Exponentiation", tag: "O(log n)", status: "playable", kind: "math", id: "modularExponentiation" },
      { title: "Miller-Rabin", tag: "Probabilistic", status: "playable", kind: "math", id: "millerRabin" },
      { title: "AKS Primality", tag: "Polynomial", status: "playable", kind: "math", id: "aksPrimality" },
      { title: "Chinese Remainder Theorem", tag: "O(k log n)", status: "playable", kind: "math", id: "chineseRemainder" },
      { title: "Fast Fourier Transform", tag: "O(n log n)", status: "playable", kind: "math", id: "fft" },
      { title: "Karatsuba Multiplication", tag: "O(n^1.585)", status: "playable", kind: "math", id: "karatsuba" },
      { title: "Newton Method", tag: "Iterative", status: "playable", kind: "math", id: "newtonMethod" },
      { title: "Gradient Descent", tag: "Iterative", status: "playable", kind: "math", id: "gradientDescent" },
      { title: "Monte Carlo Method", tag: "Randomized", status: "playable", kind: "math", id: "monteCarloMethod" },
    ],
  };
