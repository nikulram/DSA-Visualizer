export type VisualFamily =
  | "array-row"
  | "array-bars"
  | "grid-maze"
  | "classic-graph"
  | "tree"
  | "string-row"
  | "dp-table"
  | "greedy-table"
  | "hash-table";

export type VisualFamilyConfig = {
  family: VisualFamily;
  label: string;
  description: string;
};
