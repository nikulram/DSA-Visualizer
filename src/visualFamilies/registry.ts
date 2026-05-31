import type { AlgorithmKind } from "../catalog";
import type { VisualFamilyConfig } from "./types";

export const visualFamilyByKind: Record<AlgorithmKind, VisualFamilyConfig> = {
  sort: {
    family: "array-bars",
    label: "Array bars",
    description: "Used for sorting and reorder-based array algorithms.",
  },
  search: {
    family: "array-row",
    label: "Array row",
    description: "Used for target lookup, comparisons, and index movement.",
  },
  path: {
    family: "grid-maze",
    label: "Grid maze",
    description: "Used for maze, pathfinding, flood fill, and grid traversal algorithms.",
  },
  graph: {
    family: "classic-graph",
    label: "Classic graph",
    description: "Used for graph traversal, SCC, MST, flow, matching, and connectivity algorithms.",
  },
  tree: {
    family: "tree",
    label: "Tree",
    description: "Used for binary trees, BSTs, heaps, tries, segment trees, and tree-like structures.",
  },
  string: {
    family: "string-row",
    label: "String row",
    description: "Used for text matching, pattern alignment, string DP, and suffix algorithms.",
  },
  dp: {
    family: "dp-table",
    label: "DP table",
    description: "Used for dynamic programming states, matrices, rows, and recurrence tables.",
  },
  greedy: {
    family: "greedy-table",
    label: "Greedy table",
    description: "Used for local-choice algorithms, schedules, value tables, and selected rows.",
  },
  hash: {
    family: "hash-table",
    label: "Hash table",
    description: "Used for buckets, chains, probing, lookup, insert, and delete operations.",
  },
  system: {
    family: "greedy-table",
    label: "Systems table",
    description: "Used for caches, scheduling queues, database rows, and systems algorithms.",
  },
  compression: {
    family: "string-row",
    label: "Compression table",
    description: "Used for dictionary coding, entropy coding, transforms, and compressed output tokens.",
  },
  math: {
    family: "dp-table",
    label: "Math table",
    description: "Used for number theory, modular arithmetic, sieves, and iterative numeric methods.",
  },
  geometry: {
    family: "classic-graph",
    label: "Geometry plane",
    description: "Used for points, hull edges, sweep lines, intersections, and planar algorithms.",
  },
  ml: {
    family: "dp-table",
    label: "ML table",
    description: "Used for clusters, classification rows, model scores, and AI search states.",
  },
  backtracking: {
    family: "dp-table",
    label: "Backtracking board",
    description: "Used for recursive choices, constraint grids, branch paths, and undo steps.",
  },
  crypto: {
    family: "dp-table",
    label: "Crypto rounds",
    description: "Used for keys, block rounds, modular arithmetic, hashes, and key derivation steps.",
  },
};
