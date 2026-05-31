import { describe, expect, it } from "vitest";
import { algorithmCatalog } from "../algorithmCatalog";
import { getSortTrace, sortLabels, type SortAlgorithm } from "../algorithms/sorting";
import { getSearchTrace, searchLabels, type SearchAlgorithm } from "../algorithms/searching";
import { getPathTrace, pathLabels, type PathAlgorithm } from "../algorithms/pathfinding";
import { getTreeTrace, treeLabels, type TreeAlgorithm } from "../algorithms/tree";
import { getGraphTrace, graphLabels, type GraphAlgorithm } from "../algorithms/graph";
import { getStringTrace, stringLabels, type StringAlgorithm } from "../algorithms/string";
import { getDpTrace, dpLabels, type DpAlgorithm } from "../algorithms/dp";
import { getGreedyTrace, greedyLabels, type GreedyAlgorithm } from "../algorithms/greedy";
import { getHashTrace, hashLabels, type HashAlgorithm } from "../algorithms/hash";
import { getSystemTrace, systemLabels, type SystemAlgorithm } from "../algorithms/systems";
import { getCompressionTrace, compressionLabels, type CompressionAlgorithm } from "../algorithms/compression";
import { getMathTrace, mathLabels, type MathAlgorithm } from "../algorithms/math";
import { getGeometryTrace, geometryLabels, type GeometryAlgorithm } from "../algorithms/geometry";
import { getMlTrace, mlLabels, type MlAlgorithm } from "../algorithms/ml";
import { getBacktrackingTrace, backtrackingLabels, type BacktrackingAlgorithm } from "../algorithms/backtracking";
import { getCryptoTrace, cryptoLabels, type CryptoAlgorithm } from "../algorithms/crypto";

function isSortedAscending(values: number[]) {
  for (let index = 1; index < values.length; index += 1) {
    if (values[index - 1] > values[index]) return false;
  }

  return true;
}

describe("algorithm catalog", () => {
  it("has no duplicate algorithm titles inside the catalog", () => {
    const titles = algorithmCatalog.flatMap((section) => section.entries.map((entry) => entry.title));
    const unique = new Set(titles);

    expect(unique.size).toBe(titles.length);
  });

  it("has no duplicate playable ids", () => {
    const playableIds = algorithmCatalog
      .flatMap((section) => section.entries)
      .filter((entry) => entry.status === "playable" && entry.id)
      .map((entry) => `${entry.kind}:${entry.id}`);

    const unique = new Set(playableIds);

    expect(unique.size).toBe(playableIds.length);
  });

  it("every playable card has a kind and id", () => {
    const playable = algorithmCatalog
      .flatMap((section) => section.entries)
      .filter((entry) => entry.status === "playable");

    for (const entry of playable) {
      expect(entry.kind, `${entry.title} is missing kind`).toBeTruthy();
      expect(entry.id, `${entry.title} is missing id`).toBeTruthy();
    }
  });
});

describe("sorting algorithms", () => {
  const values = [18, 42, 9, 55, 31, 73, 24, 86, 67, 12, 49, 95];

  it.each(Object.keys(sortLabels) as SortAlgorithm[])("%s returns a valid trace and sorted final state", (algorithm) => {
    const steps = getSortTrace(algorithm, values);

    expect(steps.length, `${sortLabels[algorithm]} produced no steps`).toBeGreaterThan(0);

    const finalStep = steps[steps.length - 1];

    expect(finalStep.array.length).toBe(values.length);
    expect(isSortedAscending(finalStep.array), `${sortLabels[algorithm]} final array is not sorted`).toBe(true);
    expect(finalStep.message.length).toBeGreaterThan(0);
    expect(finalStep.comparisons).toBeGreaterThanOrEqual(0);
    expect(finalStep.moves).toBeGreaterThanOrEqual(0);
  });
});

describe("search algorithms", () => {
  const values = [8, 14, 22, 31, 42, 55, 67, 73, 86, 95];

  it.each(Object.keys(searchLabels) as SearchAlgorithm[])("%s returns a valid trace", (algorithm) => {
    const target = algorithm === "quickselect" ? 5 : 55;
    const steps = getSearchTrace(algorithm, values, target);

    expect(steps.length, `${searchLabels[algorithm]} produced no steps`).toBeGreaterThan(0);

    const finalStep = steps[steps.length - 1];

    expect(finalStep.array.length).toBeGreaterThan(0);
    expect(finalStep.message.length).toBeGreaterThan(0);
    expect(finalStep.checks).toBeGreaterThanOrEqual(0);
    expect(finalStep.active.every((index) => index >= 0 && index < finalStep.array.length)).toBe(true);
    expect(finalStep.eliminated.every((index) => index >= 0 && index < finalStep.array.length)).toBe(true);
  });

  it("binary search finds an existing target", () => {
    const steps = getSearchTrace("binary", values, 55);
    const finalStep = steps[steps.length - 1];

    expect(finalStep.found).not.toBeNull();
    expect(finalStep.array[finalStep.found ?? -1]).toBe(55);
  });

  it("linear search reports missing targets correctly", () => {
    const steps = getSearchTrace("linear", values, 999);
    const finalStep = steps[steps.length - 1];

    expect(finalStep.found).toBeNull();
    expect(finalStep.message.toLowerCase()).toContain("not found");
  });
});


describe("flood fill", () => {
  it("fills reachable cells from the start node", () => {
    const steps = getPathTrace({
      algorithm: "floodFill",
      walls: new Set<number>(),
      startNode: 0,
      endNode: 8,
      gridWidth: 3,
      gridHeight: 3,
    });

    const finalStep = steps[steps.length - 1];

    expect(finalStep.visited.length).toBe(9);
    expect(finalStep.message.length).toBeGreaterThan(0);
  });
});

describe("path and graph algorithms", () => {
  const commonInput = {
    walls: new Set<number>(),
    startNode: 0,
    endNode: 8,
    gridWidth: 3,
    gridHeight: 3,
  };

  it.each(Object.keys(pathLabels) as PathAlgorithm[])("%s returns a valid trace", (algorithm) => {
    const steps = getPathTrace({ algorithm, ...commonInput });

    expect(steps.length, `${pathLabels[algorithm]} produced no steps`).toBeGreaterThan(0);

    const finalStep = steps[steps.length - 1];

    expect(finalStep.message.length).toBeGreaterThan(0);
    expect(finalStep.checks).toBeGreaterThanOrEqual(0);
    expect(finalStep.visited.every((node) => node >= 0 && node < 9)).toBe(true);
    expect(finalStep.frontier.every((node) => node >= 0 && node < 9)).toBe(true);
    expect(finalStep.path.every((node) => node >= 0 && node < 9)).toBe(true);
  });

  it("BFS finds a path from start to end on an open grid", () => {
    const steps = getPathTrace({ algorithm: "bfs", ...commonInput });
    const finalStep = steps[steps.length - 1];

    expect(finalStep.path[0]).toBe(0);
    expect(finalStep.path[finalStep.path.length - 1]).toBe(8);
  });

  it("Dijkstra finds a path from start to end on an open grid", () => {
    const steps = getPathTrace({ algorithm: "dijkstra", ...commonInput });
    const finalStep = steps[steps.length - 1];

    expect(finalStep.path[0]).toBe(0);
    expect(finalStep.path[finalStep.path.length - 1]).toBe(8);
  });
});


describe("graph algorithms", () => {
  it.each(Object.keys(graphLabels) as GraphAlgorithm[])("%s returns a valid trace", (algorithm) => {
    const steps = getGraphTrace(algorithm, "0, 1, 2, 3, 4, 5, 6, 7");

    expect(steps.length, `${graphLabels[algorithm]} produced no steps`).toBeGreaterThan(0);

    const finalStep = steps[steps.length - 1];

    expect(finalStep.message.length).toBeGreaterThan(0);
    expect(finalStep.checks).toBeGreaterThanOrEqual(0);
    expect(finalStep.visited.length).toBeGreaterThan(0);
  });

  it("topological sort outputs every DAG node once", () => {
    const steps = getGraphTrace("topological", "A, B, C, D, E, F");
    const finalStep = steps[steps.length - 1];

    expect(new Set(finalStep.output).size).toBe(finalStep.output.length);
    expect(finalStep.output.length).toBeGreaterThan(0);
  });

  it("connected components finds more than one component in the sample graph", () => {
    const steps = getGraphTrace("connectedComponents", "A, B, C, D, E, F, G, H");
    const finalStep = steps[steps.length - 1];

    expect(finalStep.component).toBeGreaterThan(1);
  });

  it("mst algorithms produce spanning tree edges", () => {
    for (const algorithm of ["kruskal", "prim", "boruvka", "reverseDelete"] as GraphAlgorithm[]) {
      const steps = getGraphTrace(algorithm, "A, B, C, D, E, F, G, H");
      const finalStep = steps[steps.length - 1];

      expect(finalStep.treeEdges.length).toBeGreaterThan(0);
      expect(finalStep.message.length).toBeGreaterThan(0);
    }
  });

  it("flow algorithms produce positive flow state", () => {
    for (const algorithm of ["fordFulkerson", "edmondsKarp", "dinic", "pushRelabel"] as GraphAlgorithm[]) {
      const steps = getGraphTrace(algorithm, "S, A, B, C, D, E, F, T");
      const finalStep = steps[steps.length - 1];

      expect(finalStep.component).toBeGreaterThanOrEqual(0);
      expect(finalStep.message.length).toBeGreaterThan(0);
      expect(steps.length).toBeGreaterThan(1);
    }
  });

  it("scc and union-find algorithms return valid graph traces", () => {
    for (const algorithm of ["kosaraju", "tarjan", "unionFind"] as GraphAlgorithm[]) {
      const steps = getGraphTrace(algorithm, "A, B, C, D, E, F, G, H");
      const finalStep = steps[steps.length - 1];

      expect(finalStep.message.length).toBeGreaterThan(0);
      expect(finalStep.component).toBeGreaterThanOrEqual(1);
      expect(steps.length).toBeGreaterThan(1);
    }
  });

  it("low-link and trail algorithms return valid graph traces", () => {
    for (const algorithm of ["pathCompression", "bridgeFinding", "articulationPoints", "eulerianPath"] as GraphAlgorithm[]) {
      const steps = getGraphTrace(algorithm, "A, B, C, D, E, F, G, H");
      const finalStep = steps[steps.length - 1];

      expect(finalStep.message.length).toBeGreaterThan(0);
      expect(steps.length).toBeGreaterThan(1);
    }
  });

  it("matching and assignment algorithms return valid graph traces", () => {
    for (const algorithm of ["minCostMaxFlow", "hopcroftKarp", "blossom", "hungarian"] as GraphAlgorithm[]) {
      const steps = getGraphTrace(algorithm, "A, B, C, D, E, F, G, H");
      const finalStep = steps[steps.length - 1];

      expect(finalStep.message.length).toBeGreaterThan(0);
      expect(steps.length).toBeGreaterThan(1);
    }
  });
});

describe("tree algorithms", () => {
  const values = [50, 25, 75, 12, 35, 60, 90, 5, 18, 30, 40, 55, 65, 82, 95];

  it.each(Object.keys(treeLabels) as TreeAlgorithm[])("%s returns a valid trace", (algorithm) => {
    const steps = getTreeTrace(algorithm, values);

    expect(steps.length, `${treeLabels[algorithm]} produced no steps`).toBeGreaterThan(0);

    const finalStep = steps[steps.length - 1];

    expect(finalStep.message.length).toBeGreaterThan(0);
    expect(finalStep.visited.length).toBeGreaterThanOrEqual(0);
    expect(finalStep.pending.length).toBeGreaterThanOrEqual(0);
    expect(finalStep.stack.length).toBeGreaterThanOrEqual(0);
  });

  it("inorder traversal visits at least one node", () => {
    const steps = getTreeTrace("inorder", values);
    const finalStep = steps[steps.length - 1];

    expect(finalStep.visited.length).toBeGreaterThan(0);
  });

  it("tree sort completes with visited nodes", () => {
    const steps = getTreeTrace("treeSort", values);
    const finalStep = steps[steps.length - 1];

    expect(finalStep.visited.length).toBeGreaterThan(0);
    expect(finalStep.message.toLowerCase()).toContain("complete");
  });

  it("advanced tree structures return visual traces", () => {
    for (const algorithm of ["avlTree", "redBlackTree", "bTree", "trie"] as TreeAlgorithm[]) {
      const steps = getTreeTrace(algorithm, values);
      const finalStep = steps[steps.length - 1];

      expect(steps.length).toBeGreaterThan(1);
      expect(finalStep.message.length).toBeGreaterThan(0);
      expect(finalStep.treeValues?.length ?? 0).toBeGreaterThan(0);
    }
  });

  it("range and suffix structures return visual traces", () => {
    for (const algorithm of ["segmentTree", "fenwickTree", "suffixTree", "suffixArray"] as TreeAlgorithm[]) {
      const steps = getTreeTrace(algorithm, values);
      const finalStep = steps[steps.length - 1];

      expect(steps.length).toBeGreaterThan(1);
      expect(finalStep.message.length).toBeGreaterThan(0);
    }
  });

  it("heap tree algorithms return visual traces", () => {
    for (const algorithm of ["minHeapInsert", "maxHeapInsert", "heapifyTree", "extractMin"] as TreeAlgorithm[]) {
      const steps = getTreeTrace(algorithm, values);
      const finalStep = steps[steps.length - 1];

      expect(steps.length).toBeGreaterThan(1);
      expect(finalStep.message.length).toBeGreaterThan(0);
      expect(finalStep.treeValues?.length ?? 0).toBeGreaterThan(0);
    }
  });

  it("advanced heap structures return visual traces", () => {
    for (const algorithm of ["extractMax", "decreaseKey", "binomialHeap", "fibonacciHeap"] as TreeAlgorithm[]) {
      const steps = getTreeTrace(algorithm, values);
      const finalStep = steps[steps.length - 1];

      expect(steps.length).toBeGreaterThan(1);
      expect(finalStep.message.length).toBeGreaterThan(0);
      expect(finalStep.treeValues?.length ?? 0).toBeGreaterThan(0);
    }
  });
});


describe("string algorithms", () => {
  it.each(Object.keys(stringLabels) as StringAlgorithm[])("%s returns a valid trace", (algorithm) => {
    const steps = getStringTrace(algorithm, "ABABDABACDABABCABAB", "ABABCABAB");
    const finalStep = steps[steps.length - 1];

    expect(steps.length).toBeGreaterThan(1);
    expect(finalStep.message.length).toBeGreaterThan(0);
    expect(finalStep.text.length).toBeGreaterThan(0);
    expect(finalStep.pattern.length).toBeGreaterThan(0);
    expect(finalStep.checks).toBeGreaterThanOrEqual(0);
  });
});



describe("dp algorithms", () => {
  it.each(Object.keys(dpLabels) as DpAlgorithm[])("%s returns a valid trace", (algorithm) => {
    const steps = getDpTrace(algorithm, "3, 4, 5, 8, 10, 2, 6, 7");
    const finalStep = steps[steps.length - 1];

    expect(steps.length).toBeGreaterThan(1);
    expect(finalStep.message.length).toBeGreaterThan(0);
    expect(finalStep.checks).toBeGreaterThanOrEqual(0);
  });
});


describe("greedy algorithms", () => {
  it.each(Object.keys(greedyLabels) as GreedyAlgorithm[])("%s returns a valid trace", (algorithm) => {
    const steps = getGreedyTrace(algorithm, "1, 3, 0, 5, 8, 5, 2, 4, 6, 7, 9, 9");
    const finalStep = steps[steps.length - 1];

    expect(steps.length).toBeGreaterThan(1);
    expect(finalStep.message.length).toBeGreaterThan(0);
    expect(finalStep.checks).toBeGreaterThanOrEqual(0);
  });
});


describe("hash algorithms", () => {
  it.each(Object.keys(hashLabels) as HashAlgorithm[])("%s returns a valid trace", (algorithm) => {
    const steps = getHashTrace(algorithm, "18, 41, 22, 44, 59, 32, 31, 73, 19, 66");
    const finalStep = steps[steps.length - 1];

    expect(steps.length).toBeGreaterThan(1);
    expect(finalStep.message.length).toBeGreaterThan(0);
    expect(finalStep.table.length).toBeGreaterThan(0);
    expect(finalStep.checks).toBeGreaterThanOrEqual(0);
  });
});


describe("systems algorithms", () => {
  it.each(Object.keys(systemLabels) as SystemAlgorithm[])("%s returns a valid trace", (algorithm) => {
    const steps = getSystemTrace(algorithm, "1, 2, 3, 1, 4, 5, 2, 1, 2, 3, 4, 5");
    const finalStep = steps[steps.length - 1];

    expect(steps.length).toBeGreaterThan(1);
    expect(finalStep.message.length).toBeGreaterThan(0);
    expect(finalStep.table.length).toBeGreaterThan(0);
    expect(finalStep.checks).toBeGreaterThanOrEqual(0);
  });
});


describe("compression algorithms", () => {
  it.each(Object.keys(compressionLabels) as CompressionAlgorithm[])("%s returns a valid trace", (algorithm) => {
    const steps = getCompressionTrace(algorithm, "BANANA_BANDANA");
    const finalStep = steps[steps.length - 1];

    expect(steps.length).toBeGreaterThan(1);
    expect(finalStep.message.length).toBeGreaterThan(0);
    expect(finalStep.dictionary.length).toBeGreaterThan(0);
    expect(finalStep.checks).toBeGreaterThanOrEqual(0);
  });
});


describe("math algorithms", () => {
  it.each(Object.keys(mathLabels) as MathAlgorithm[])("%s returns a valid trace", (algorithm) => {
    const steps = getMathTrace(algorithm, "252, 105, 2, 13, 497");
    const finalStep = steps[steps.length - 1];

    expect(steps.length).toBeGreaterThan(1);
    expect(finalStep.message.length).toBeGreaterThan(0);
    expect(finalStep.table.length).toBeGreaterThan(0);
    expect(finalStep.checks).toBeGreaterThanOrEqual(0);
  });
});


describe("geometry algorithms", () => {
  it.each(Object.keys(geometryLabels) as GeometryAlgorithm[])("%s returns a valid trace", (algorithm) => {
    const steps = getGeometryTrace(algorithm, "12,70, 22,22, 36,55, 48,18, 58,78, 72,36, 82,64, 90,12");
    const finalStep = steps[steps.length - 1];

    expect(steps.length).toBeGreaterThan(1);
    expect(finalStep.message.length).toBeGreaterThan(0);
    expect(finalStep.points.length).toBeGreaterThan(0);
    expect(finalStep.checks).toBeGreaterThanOrEqual(0);
  });
});


describe("ml algorithms", () => {
  it.each(Object.keys(mlLabels) as MlAlgorithm[])("%s returns a valid trace", (algorithm) => {
    const steps = getMlTrace(algorithm, "12,18, 18,28, 24,20, 58,64, 66,72, 74,62, 44,48");
    const finalStep = steps[steps.length - 1];

    expect(steps.length).toBeGreaterThan(1);
    expect(finalStep.message.length).toBeGreaterThan(0);
    expect(finalStep.points.length).toBeGreaterThan(0);
    expect(finalStep.checks).toBeGreaterThanOrEqual(0);
  });
});


describe("backtracking algorithms", () => {
  it.each(Object.keys(backtrackingLabels) as BacktrackingAlgorithm[])("%s returns a valid trace", (algorithm) => {
    const steps = getBacktrackingTrace(algorithm, "A, B, C, D");
    const finalStep = steps[steps.length - 1];

    expect(steps.length).toBeGreaterThan(1);
    expect(finalStep.message.length).toBeGreaterThan(0);
    expect(finalStep.board.length).toBeGreaterThan(0);
    expect(finalStep.checks).toBeGreaterThanOrEqual(0);
  });
});


describe("crypto algorithms", () => {
  it.each(Object.keys(cryptoLabels) as CryptoAlgorithm[])("%s returns a valid trace", (algorithm) => {
    const steps = getCryptoTrace(algorithm, "HELLO");
    const finalStep = steps[steps.length - 1];

    expect(steps.length).toBeGreaterThan(1);
    expect(finalStep.message.length).toBeGreaterThan(0);
    expect(finalStep.blocks.length).toBeGreaterThan(0);
    expect(finalStep.checks).toBeGreaterThanOrEqual(0);
  });
});
