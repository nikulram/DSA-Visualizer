import type { CatalogSection } from "./types";

export const graphTraversalAndConnectivityCatalog: CatalogSection = {
    title: "Graph Traversal and Connectivity",
  description: "Traverse graphs, detect components, SCCs, bridges, and articulation points.",
    entries: [
      { title: "BFS Traversal", tag: "O(V + E)", status: "playable", kind: "graph", id: "graphBfs" },
      { title: "DFS Traversal", tag: "O(V + E)", status: "playable", kind: "graph", id: "graphDfs" },
      { title: "Topological Sort", tag: "O(V + E)", status: "playable", kind: "graph", id: "topological" },
      { title: "Flood Fill", tag: "O(n)", status: "playable", kind: "path", id: "floodFill" },
      { title: "Connected Components", tag: "O(V + E)", status: "playable", kind: "graph", id: "connectedComponents" },
      { title: "Kosaraju SCC", tag: "O(V + E)", status: "playable", kind: "graph", id: "kosaraju" },
      { title: "Tarjan SCC", tag: "O(V + E)", status: "playable", kind: "graph", id: "tarjan" },
      { title: "Bridge Finding", tag: "O(V + E)", status: "playable", kind: "graph", id: "bridgeFinding" },
      { title: "Articulation Points", tag: "O(V + E)", status: "playable", kind: "graph", id: "articulationPoints" },
      { title: "Union Find", tag: "α(n)", status: "playable", kind: "graph", id: "unionFind" },
      { title: "Path Compression", tag: "α(n)", status: "playable", kind: "graph", id: "pathCompression" },
    ],
  };
