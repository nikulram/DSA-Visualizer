import type { CatalogSection } from "./types";

export const backtrackingAndCombinatoricsCatalog: CatalogSection = {
    title: "Backtracking and Combinatorics",
  description: "Explore recursive search, branching, permutations, subsets, and constraints.",
    entries: [
      { title: "Backtracking", tag: "Exponential", status: "playable", kind: "backtracking", id: "backtracking" },
      { title: "N Queens", tag: "O(n!)", status: "playable", kind: "backtracking", id: "nQueens" },
      { title: "Sudoku Solver", tag: "Backtracking", status: "playable", kind: "backtracking", id: "sudokuSolver" },
      { title: "Subset Generation", tag: "O(2ⁿ)", status: "playable", kind: "backtracking", id: "subsetGeneration" },
      { title: "Permutation Generation", tag: "O(n!)", status: "playable", kind: "backtracking", id: "permutationGeneration" },
      { title: "Combination Generation", tag: "O(C(n,k))", status: "playable", kind: "backtracking", id: "combinationGeneration" },
      { title: "Branch and Bound", tag: "Varies", status: "playable", kind: "backtracking", id: "branchAndBound" },
      { title: "Steinhaus-Johnson-Trotter", tag: "O(n!)", status: "playable", kind: "backtracking", id: "sjt" },
    ],
  };
