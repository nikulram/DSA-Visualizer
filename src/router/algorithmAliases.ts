export type AliasKind = "tree" | "string" | "dp";

export type AlgorithmAliasRoute = {
  kind: AliasKind;
  target: string;
};

export const algorithmAliases: Record<string, AlgorithmAliasRoute> = {
  binaryTreeDfsAlias: { kind: "tree", target: "preorder" },
  levelOrderAlias: { kind: "tree", target: "treeBfs" },
  segmentTreeQueryAlias: { kind: "tree", target: "segmentTree" },
  fenwickTreeQueryAlias: { kind: "tree", target: "fenwickTree" },
  bTreeIndexAlias: { kind: "tree", target: "bTree" },
  kmpAlias: { kind: "string", target: "kmp" },
  naiveStringSearchAlias: { kind: "string", target: "rabinKarp" },
  levenshteinAlias: { kind: "string", target: "editDistance" },
  fibonacciDpAlias: { kind: "dp", target: "lis" },
  unboundedKnapsackAlias: { kind: "dp", target: "coinChange" },
  kadaneAlias: { kind: "dp", target: "kadane" },
};

export type AlgorithmAliasId = keyof typeof algorithmAliases;
