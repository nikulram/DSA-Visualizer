import type { CatalogSection } from "./types";

export const searchingCatalog: CatalogSection = {
    title: "Searching",
  description: "Find targets in arrays using linear, binary, and indexed search strategies.",
    entries: [
      { title: "Linear Search", tag: "O(n)", status: "playable", kind: "search", id: "linear" },
      { title: "Binary Search", tag: "O(log n)", status: "playable", kind: "search", id: "binary" },
      { title: "Jump Search", tag: "O(√n)", status: "playable", kind: "search", id: "jump" },
      { title: "Interpolation Search", tag: "O(log log n) avg", status: "playable", kind: "search", id: "interpolation" },
      { title: "Exponential Search", tag: "O(log n)", status: "playable", kind: "search", id: "exponential" },
      { title: "Ternary Search", tag: "O(log n)", status: "playable", kind: "search", id: "ternary" },
      { title: "Fibonacci Search", tag: "O(log n)", status: "playable", kind: "search", id: "fibonacci" },
      { title: "Quickselect", tag: "O(n) avg", status: "playable", kind: "search", id: "quickselect" },
    ],
  };
