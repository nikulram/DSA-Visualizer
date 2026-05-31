import type { CatalogSection } from "./types";

export const databaseAndSystemsCatalog: CatalogSection = {
    title: "Database and Systems",
  description: "Show database, cache, scheduling, and systems algorithms.",
    entries: [
      { title: "B-Tree Index Search", tag: "O(log n)", status: "playable", kind: "tree", id: "bTreeIndexAlias" },
      { title: "Hash Join", tag: "O(n + m)", status: "playable", kind: "system", id: "hashJoin" },
      { title: "Merge Join", tag: "O(n + m)", status: "playable", kind: "system", id: "mergeJoin" },
      { title: "Nested Loop Join", tag: "O(nm)", status: "playable", kind: "system", id: "nestedLoopJoin" },
      { title: "Query Optimization", tag: "Cost-based", status: "playable", kind: "system", id: "queryOptimization" },
      { title: "Two-Phase Locking", tag: "Concurrency", status: "playable", kind: "system", id: "twoPhaseLocking" },
      { title: "LRU Cache", tag: "O(1)", status: "playable", kind: "system", id: "lruCache" },
      { title: "LFU Cache", tag: "O(1)", status: "playable", kind: "system", id: "lfuCache" },
      { title: "Round Robin Scheduling", tag: "O(n)", status: "playable", kind: "system", id: "roundRobin" },
      { title: "Shortest Job First", tag: "O(n log n)", status: "playable", kind: "system", id: "shortestJobFirst" },
      { title: "CPU Priority Scheduling", tag: "Priority", status: "playable", kind: "system", id: "priorityScheduling" },
      { title: "Banker's Algorithm", tag: "Safety", status: "playable", kind: "system", id: "bankersAlgorithm" },
    ],
  };
