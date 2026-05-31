# Algorithm Engine Architecture

Algorithm files should only produce trace data. They should not own UI.

## Current families
- sort.ts: array sorting traces
- searching.ts: array/search traces
- pathfinding.ts: grid and maze traces
- graph.ts: graph, MST, SCC, flow, matching traces
- tree.ts: tree, heap, trie, segment/fenwick/suffix traces
- string.ts: string matching and string DP traces
- dp.ts: DP table traces
- greedy.ts: greedy row/table traces
- hash.ts: hash bucket traces

Future refactor:
Split large files into one algorithm or subfamily per file, then export through an index.ts barrel.
Example:
src/algorithms/graph/traversal/bfs.ts
src/algorithms/graph/mst/kruskal.ts
src/algorithms/graph/flow/edmondsKarp.ts
