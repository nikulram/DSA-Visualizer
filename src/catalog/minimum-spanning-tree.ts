import type { CatalogSection } from "./types";

export const minimumSpanningTreeCatalog: CatalogSection = {
    title: "Minimum Spanning Tree",
  description: "Build low-cost graph connection structures using MST algorithms.",
    entries: [
      { title: "Kruskal", tag: "O(E log E)", status: "playable", kind: "graph", id: "kruskal" },
      { title: "Prim", tag: "O(E log V)", status: "playable", kind: "graph", id: "prim" },
      { title: "Borůvka", tag: "O(E log V)", status: "playable", kind: "graph", id: "boruvka" },
      { title: "Reverse Delete", tag: "O(E log E)", status: "playable", kind: "graph", id: "reverseDelete" },
    ],
  };
