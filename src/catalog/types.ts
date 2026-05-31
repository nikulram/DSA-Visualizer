export type AlgorithmKind =
  | "sort"
  | "path"
  | "tree"
  | "search"
  | "graph"
  | "string"
  | "dp"
  | "greedy"
  | "hash"
  | "system"
  | "compression"
  | "math"
  | "geometry"
  | "ml"
  | "backtracking"
  | "crypto";

export type CatalogEntry = {
  title: string;
  tag: string;
  status: "playable" | "soon";
  kind?: AlgorithmKind;
  id?: string;
};

export type CatalogSection = {
  title: string;
  description: string;
  entries: CatalogEntry[];
};
