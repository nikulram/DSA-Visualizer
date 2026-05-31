import type { CatalogSection } from "./types";
import { sortingCatalog } from "./sorting";
import { searchingCatalog } from "./searching";
import { pathfindingCatalog } from "./pathfinding";
import { graphTraversalAndConnectivityCatalog } from "./graph-traversal-and-connectivity";
import { minimumSpanningTreeCatalog } from "./minimum-spanning-tree";
import { networkFlowAndMatchingCatalog } from "./network-flow-and-matching";
import { treesCatalog } from "./trees";
import { heapsAndPriorityQueuesCatalog } from "./heaps-and-priority-queues";
import { hashingAndMapsCatalog } from "./hashing-and-maps";
import { dynamicProgrammingCatalog } from "./dynamic-programming";
import { stringAlgorithmsCatalog } from "./string-algorithms";
import { backtrackingAndCombinatoricsCatalog } from "./backtracking-and-combinatorics";
import { computationalGeometryCatalog } from "./computational-geometry";
import { numberTheoryAndMathCatalog } from "./number-theory-and-math";
import { cryptographyCatalog } from "./cryptography";
import { compressionCatalog } from "./compression";
import { databaseAndSystemsCatalog } from "./database-and-systems";
import { machineLearningAndAiSearchCatalog } from "./machine-learning-and-ai-search";

export const algorithmCatalog: CatalogSection[] = [
  sortingCatalog,
  searchingCatalog,
  pathfindingCatalog,
  graphTraversalAndConnectivityCatalog,
  minimumSpanningTreeCatalog,
  networkFlowAndMatchingCatalog,
  treesCatalog,
  heapsAndPriorityQueuesCatalog,
  hashingAndMapsCatalog,
  dynamicProgrammingCatalog,
  stringAlgorithmsCatalog,
  backtrackingAndCombinatoricsCatalog,
  computationalGeometryCatalog,
  numberTheoryAndMathCatalog,
  cryptographyCatalog,
  compressionCatalog,
  databaseAndSystemsCatalog,
  machineLearningAndAiSearchCatalog,
];

export type { AlgorithmKind, CatalogEntry, CatalogSection } from "./types";
