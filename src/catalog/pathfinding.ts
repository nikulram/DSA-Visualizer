import type { CatalogSection } from "./types";

export const pathfindingCatalog: CatalogSection = {
    title: "Pathfinding",
  description: "Explore maze and grid algorithms with frontier, visited, and path states.",
    entries: [
      { title: "Dijkstra", tag: "O((V+E) log V)", status: "playable", kind: "path", id: "dijkstra" },
      { title: "A* Search", tag: "O(b^d)", status: "playable", kind: "path", id: "astar" },
      { title: "Breadth-First Search", tag: "O(V + E)", status: "playable", kind: "path", id: "bfs" },
      { title: "Depth-First Search", tag: "O(V + E)", status: "playable", kind: "path", id: "dfs" },
      { title: "Greedy Best-First Search", tag: "Heuristic", status: "playable", kind: "path", id: "greedy" },
      { title: "Prim MST Table", tag: "MST table", status: "playable", kind: "greedy", id: "primTable" },
      { title: "Kruskal DSU Table", tag: "DSU table", status: "playable", kind: "greedy", id: "kruskalTable" },
      { title: "Interval Scheduling", tag: "Greedy", status: "playable", kind: "greedy", id: "intervalScheduling" },
      { title: "Gas Station", tag: "Greedy O(n)", status: "playable", kind: "greedy", id: "gasStation" },
      { title: "Bidirectional Search", tag: "O(b^(d/2))", status: "playable", kind: "path", id: "bidirectional" },
      { title: "Bellman-Ford", tag: "O(VE)", status: "playable", kind: "path", id: "bellmanFord" },
      { title: "Floyd-Warshall", tag: "All-pairs", status: "playable", kind: "dp", id: "floydWarshall" },
      { title: "Bellman-Ford Table Mode", tag: "Relax table", status: "playable", kind: "dp", id: "bellmanFordTable" },
      { title: "Dijkstra Table Mode", tag: "Distance table", status: "playable", kind: "dp", id: "dijkstraTable" },
      { title: "Johnson's Algorithm", tag: "O(V² log V + VE)", status: "playable", kind: "path", id: "johnson" },
    ],
  };
