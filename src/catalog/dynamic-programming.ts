import type { CatalogSection } from "./types";

export const dynamicProgrammingCatalog: CatalogSection = {
    title: "Dynamic Programming",
  description: "Track table, row, and state transitions for DP algorithms.",
    entries: [
      { title: "Fibonacci DP", tag: "O(n)", status: "playable", kind: "dp", id: "fibonacciDpAlias" },
      { title: "0/1 Knapsack", tag: "DP O(nW)", status: "playable", kind: "dp", id: "knapsack" },
      { title: "Unbounded Knapsack", tag: "O(nW)", status: "playable", kind: "dp", id: "unboundedKnapsackAlias" },
      { title: "Coin Change", tag: "DP", status: "playable", kind: "dp", id: "coinChange" },
      { title: "Longest Common Subsequence", tag: "DP O(nm)", status: "playable", kind: "string", id: "lcs" },
      { title: "Longest Increasing Subsequence", tag: "DP O(n²)", status: "playable", kind: "dp", id: "lis" },
      { title: "Edit Distance", tag: "DP O(nm)", status: "playable", kind: "string", id: "editDistance" },
      { title: "Matrix Chain Multiplication", tag: "DP O(n³)", status: "playable", kind: "dp", id: "matrixChain" },
      { title: "Kadane Algorithm", tag: "O(n)", status: "playable", kind: "dp", id: "kadaneAlias" },
      { title: "Subset Sum", tag: "O(nS)", status: "playable", kind: "dp", id: "subsetSum" },
      { title: "Rod Cutting", tag: "O(n²)", status: "playable", kind: "dp", id: "rodCutting" },
      { title: "DP on Trees", tag: "O(n)", status: "playable", kind: "dp", id: "dpOnTrees" },
    ],
  };
