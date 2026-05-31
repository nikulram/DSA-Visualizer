import type { CatalogSection } from "./types";

export const stringAlgorithmsCatalog: CatalogSection = {
    title: "String Algorithms",
  description: "Visualize pattern matching, suffix structures, and string DP.",
    entries: [
      { title: "Naive String Search", tag: "O(nm)", status: "playable", kind: "string", id: "naiveStringSearchAlias" },
      { title: "KMP", tag: "O(n + m)", status: "playable", kind: "string", id: "kmpAlias" },
      { title: "Rabin-Karp", tag: "Rolling hash", status: "playable", kind: "string", id: "rabinKarp" },
      { title: "Boyer-Moore", tag: "Sublinear avg", status: "playable", kind: "string", id: "boyerMoore" },
      { title: "Aho-Corasick", tag: "Multi-pattern", status: "playable", kind: "string", id: "ahoCorasick" },
      { title: "Z Algorithm", tag: "O(n + m)", status: "playable", kind: "string", id: "zAlgorithm" },
      { title: "Manacher", tag: "Palindrome O(n)", status: "playable", kind: "string", id: "manacher" },
      { title: "Suffix Array", tag: "String search", status: "playable", kind: "tree", id: "suffixArray" },
      { title: "Suffix Tree", tag: "String index", status: "playable", kind: "tree", id: "suffixTree" },
      { title: "Suffix Automaton", tag: "O(n)", status: "playable", kind: "string", id: "suffixAutomaton" },
      { title: "Burrows-Wheeler Transform", tag: "O(n)", status: "playable", kind: "string", id: "burrowsWheelerTransform" },
      { title: "Levenshtein Distance", tag: "O(nm)", status: "playable", kind: "string", id: "levenshteinAlias" },
    ],
  };
