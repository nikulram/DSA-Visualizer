import type { CatalogSection } from "./types";

export const networkFlowAndMatchingCatalog: CatalogSection = {
    title: "Network Flow and Matching",
  description: "Visualize augmenting paths, flow networks, and matching algorithms.",
    entries: [
      { title: "Ford-Fulkerson", tag: "O(Ef)", status: "playable", kind: "graph", id: "fordFulkerson" },
      { title: "Edmonds-Karp", tag: "O(VE²)", status: "playable", kind: "graph", id: "edmondsKarp" },
      { title: "Dinic", tag: "O(V²E)", status: "playable", kind: "graph", id: "dinic" },
      { title: "Push-Relabel", tag: "O(V³)", status: "playable", kind: "graph", id: "pushRelabel" },
      { title: "Min-Cost Max-Flow", tag: "Flow + cost", status: "playable", kind: "graph", id: "minCostMaxFlow" },
      { title: "Hopcroft-Karp", tag: "O(E√V)", status: "playable", kind: "graph", id: "hopcroftKarp" },
      { title: "Blossom Matching", tag: "General matching", status: "playable", kind: "graph", id: "blossom" },
      { title: "Hungarian Algorithm", tag: "O(n³)", status: "playable", kind: "graph", id: "hungarian" },
    ],
  };
