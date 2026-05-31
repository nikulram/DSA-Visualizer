export type PathAlgorithm = "dijkstra" | "astar" | "bfs" | "dfs" | "greedy" | "bellmanFord" | "floodFill" | "bidirectional" | "johnson";

export type PathStep = {
  visited: number[];
  frontier: number[];
  path: number[];
  current: number | null;
  message: string;
  checks: number;
};

export const pathLabels: Record<PathAlgorithm, string> = {
  dijkstra: "Dijkstra",
  astar: "A* Search",
  bfs: "Breadth-First Search",
  dfs: "Depth-First Search",
  greedy: "Greedy Best-First Search",
  bellmanFord: "Bellman-Ford",
  floodFill: "Flood Fill",
  bidirectional: "Bidirectional Search",
  johnson: "Johnson's Algorithm",
};

function point(id: number, gridWidth: number) {
  return {
    x: id % gridWidth,
    y: Math.floor(id / gridWidth),
  };
}

function heuristic(a: number, b: number, gridWidth: number) {
  const pa = point(a, gridWidth);
  const pb = point(b, gridWidth);
  return Math.abs(pa.x - pb.x) + Math.abs(pa.y - pb.y);
}

function neighbors(id: number, walls: Set<number>, gridWidth: number, gridHeight: number) {
  const { x, y } = point(id, gridWidth);

  const list = [
    y > 0 ? id - gridWidth : null,
    y < gridHeight - 1 ? id + gridWidth : null,
    x > 0 ? id - 1 : null,
    x < gridWidth - 1 ? id + 1 : null,
  ];

  return list.filter((value): value is number => value !== null && !walls.has(value));
}

function buildPath(previous: Map<number, number>, end: number, startNode: number) {
  const path = [end];
  let current = end;

  while (previous.has(current)) {
    current = previous.get(current)!;
    path.unshift(current);
  }

  return path[0] === startNode ? path : [];
}


function bidirectionalTrace(
  walls: Set<number>,
  startNode: number,
  endNode: number,
  gridWidth: number,
  gridHeight: number,
): PathStep[] {
  const steps: PathStep[] = [];
  const startQueue = [startNode];
  const endQueue = [endNode];
  const startVisited = new Set([startNode]);
  const endVisited = new Set([endNode]);
  const previous = new Map<number, number>();
  let checks = 0;

  steps.push({
    visited: [...startVisited, ...endVisited],
    frontier: [...startQueue, ...endQueue],
    path: [],
    current: null,
    message: "Bidirectional Search expands from both start and end until the two frontiers meet.",
    checks,
  });

  while (startQueue.length && endQueue.length) {
    const fromStart = startQueue.shift()!;
    checks++;

    for (const next of neighbors(fromStart, walls, gridWidth, gridHeight)) {
      if (startVisited.has(next)) continue;

      startVisited.add(next);
      previous.set(next, fromStart);
      startQueue.push(next);

      if (endVisited.has(next)) {
        steps.push({
          visited: [...startVisited, ...endVisited],
          frontier: [...startQueue, ...endQueue],
          path: [next],
          current: next,
          message: `Frontiers meet at ${next}. Search complete.`,
          checks,
        });

        return steps;
      }
    }

    const fromEnd = endQueue.shift()!;
    checks++;

    for (const next of neighbors(fromEnd, walls, gridWidth, gridHeight)) {
      if (endVisited.has(next)) continue;

      endVisited.add(next);
      endQueue.push(next);

      if (startVisited.has(next)) {
        steps.push({
          visited: [...startVisited, ...endVisited],
          frontier: [...startQueue, ...endQueue],
          path: [next],
          current: next,
          message: `Frontiers meet at ${next}. Search complete.`,
          checks,
        });

        return steps;
      }
    }

    steps.push({
      visited: [...startVisited, ...endVisited],
      frontier: [...startQueue, ...endQueue],
      path: [],
      current: fromStart,
      message: "Expand one layer from each side.",
      checks,
    });
  }

  return steps;
}

function johnsonTrace(
  walls: Set<number>,
  startNode: number,
  endNode: number,
  gridWidth: number,
  gridHeight: number,
): PathStep[] {
  const steps: PathStep[] = [];
  const allNodes = Array.from({ length: gridWidth * gridHeight }, (_, index) => index).filter((node) => !walls.has(node));
  const potentials = new Map<number, number>();
  let checks = 0;

  for (const node of allNodes) {
    potentials.set(node, heuristic(startNode, node, gridWidth));
  }

  steps.push({
    visited: [],
    frontier: [startNode],
    path: [],
    current: startNode,
    message: "Johnson's Algorithm first computes vertex potentials to reweight edges.",
    checks,
  });

  const distances = new Map<number, number>([[startNode, 0]]);
  const previous = new Map<number, number>();
  const frontier = [startNode];
  const visited = new Set<number>();

  while (frontier.length) {
    frontier.sort((a, b) => (distances.get(a) ?? Infinity) - (distances.get(b) ?? Infinity));
    const current = frontier.shift()!;

    if (visited.has(current)) continue;
    visited.add(current);
    checks++;

    if (current === endNode) break;

    for (const next of neighbors(current, walls, gridWidth, gridHeight)) {
      const reweighted = 1 + (potentials.get(current) ?? 0) - (potentials.get(next) ?? 0);
      const candidate = (distances.get(current) ?? Infinity) + Math.max(1, reweighted);

      if (candidate < (distances.get(next) ?? Infinity)) {
        distances.set(next, candidate);
        previous.set(next, current);
        frontier.push(next);
      }
    }

    steps.push({
      visited: [...visited],
      frontier: [...frontier],
      path: [],
      current,
      message: `Relax reweighted edges from ${current}.`,
      checks,
    });
  }

  steps.push({
    visited: [...visited],
    frontier,
    path: buildPath(previous, endNode, startNode),
    current: endNode,
    message: "Johnson's Algorithm visual complete.",
    checks,
  });

  return steps;
}

export function getPathTrace({
  algorithm,
  walls,
  startNode,
  endNode,
  gridWidth,
  gridHeight,
}: {
  algorithm: PathAlgorithm;
  walls: Set<number>;
  startNode: number;
  endNode: number;
  gridWidth: number;
  gridHeight: number;
}): PathStep[] {
  if (algorithm === "bfs") {
    return bfsTrace(walls, startNode, endNode, gridWidth, gridHeight);
  }

  if (algorithm === "dfs") {
    return dfsTrace(walls, startNode, endNode, gridWidth, gridHeight);
  }

  if (algorithm === "bidirectional") {
    return bidirectionalTrace(walls, startNode, endNode, gridWidth, gridHeight);
  }

  if (algorithm === "johnson") {
    return johnsonTrace(walls, startNode, endNode, gridWidth, gridHeight);
  }

  if (algorithm === "greedy") {
    return greedyTrace(walls, startNode, endNode, gridWidth, gridHeight);
  }

  if (algorithm === "bellmanFord") {
    return bellmanFordTrace(walls, startNode, endNode, gridWidth, gridHeight);
  }

  if (algorithm === "floodFill") {
    return floodFillTrace(walls, startNode, gridWidth, gridHeight);
  }

  return weightedBestFirstTrace(algorithm, walls, startNode, endNode, gridWidth, gridHeight);
}


function floodFillTrace(
  walls: Set<number>,
  startNode: number,
  gridWidth: number,
  gridHeight: number,
): PathStep[] {
  const steps: PathStep[] = [];
  const queue = [startNode];
  const visited = new Set<number>([startNode]);
  let checks = 0;

  steps.push({
    visited: [],
    frontier: [startNode],
    path: [startNode],
    current: startNode,
    message: "Flood Fill starts from S and spreads to every reachable open cell.",
    checks,
  });

  while (queue.length > 0) {
    const current = queue.shift()!;

    steps.push({
      visited: [...visited],
      frontier: [...queue],
      path: [...visited],
      current,
      message: "Fill the current cell, then inspect its open neighbors.",
      checks,
    });

    for (const next of neighbors(current, walls, gridWidth, gridHeight)) {
      checks++;

      if (visited.has(next)) {
        steps.push({
          visited: [...visited],
          frontier: [...queue],
          path: [...visited],
          current: next,
          message: "This neighbor is already filled, so skip it.",
          checks,
        });
        continue;
      }

      visited.add(next);
      queue.push(next);

      steps.push({
        visited: [...visited],
        frontier: [...queue],
        path: [...visited],
        current: next,
        message: "Add this open neighbor to the fill frontier.",
        checks,
      });
    }
  }

  steps.push({
    visited: [...visited],
    frontier: [],
    path: [...visited],
    current: null,
    message: `Flood Fill complete. Filled ${visited.size} reachable cells.`,
    checks,
  });

  return steps;
}

function weightedBestFirstTrace(
  algorithm: "dijkstra" | "astar",
  walls: Set<number>,
  startNode: number,
  endNode: number,
  gridWidth: number,
  gridHeight: number,
): PathStep[] {
  const steps: PathStep[] = [];
  const frontier = new Set<number>([startNode]);
  const visited = new Set<number>();
  const distance = new Map<number, number>();
  const previous = new Map<number, number>();
  let checks = 0;

  distance.set(startNode, 0);

  steps.push({
    visited: [],
    frontier: [startNode],
    path: [],
    current: startNode,
    message: "Start at S. The search frontier is ready.",
    checks,
  });

  while (frontier.size > 0) {
    const current = [...frontier].sort((a, b) => {
      const da = distance.get(a) ?? Infinity;
      const db = distance.get(b) ?? Infinity;
      const scoreA = algorithm === "astar" ? da + heuristic(a, endNode, gridWidth) : da;
      const scoreB = algorithm === "astar" ? db + heuristic(b, endNode, gridWidth) : db;
      return scoreA - scoreB;
    })[0];

    frontier.delete(current);
    visited.add(current);

    steps.push({
      visited: [...visited],
      frontier: [...frontier],
      path: buildPath(previous, current, startNode),
      current,
      message: current === endNode ? "End reached. Reconstruct the best path." : "Visit the best available cell.",
      checks,
    });

    if (current === endNode) break;

    for (const next of neighbors(current, walls, gridWidth, gridHeight)) {
      checks++;

      if (visited.has(next)) continue;

      const candidate = (distance.get(current) ?? Infinity) + 1;

      if (candidate < (distance.get(next) ?? Infinity)) {
        distance.set(next, candidate);
        previous.set(next, current);
        frontier.add(next);

        steps.push({
          visited: [...visited],
          frontier: [...frontier],
          path: buildPath(previous, next, startNode),
          current: next,
          message:
            algorithm === "astar"
              ? "Add neighbor using distance plus direction to E."
              : "Add neighbor using shortest known distance.",
          checks,
        });
      }
    }
  }

  steps.push({
    visited: [...visited],
    frontier: [],
    path: buildPath(previous, endNode, startNode),
    current: endNode,
    message: "Best path is highlighted in green.",
    checks,
  });

  return steps;
}

function bfsTrace(
  walls: Set<number>,
  startNode: number,
  endNode: number,
  gridWidth: number,
  gridHeight: number,
): PathStep[] {
  const steps: PathStep[] = [];
  const queue = [startNode];
  const seen = new Set<number>([startNode]);
  const visited = new Set<number>();
  const previous = new Map<number, number>();
  let checks = 0;

  steps.push({
    visited: [],
    frontier: [...queue],
    path: [],
    current: startNode,
    message: "BFS starts with S in a queue.",
    checks,
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    visited.add(current);

    steps.push({
      visited: [...visited],
      frontier: [...queue],
      path: buildPath(previous, current, startNode),
      current,
      message: current === endNode ? "End reached. BFS found the shortest unweighted path." : "Visit the oldest cell in the queue.",
      checks,
    });

    if (current === endNode) break;

    for (const next of neighbors(current, walls, gridWidth, gridHeight)) {
      checks++;

      if (seen.has(next)) continue;

      seen.add(next);
      previous.set(next, current);
      queue.push(next);

      steps.push({
        visited: [...visited],
        frontier: [...queue],
        path: buildPath(previous, next, startNode),
        current: next,
        message: "Add an unvisited neighbor to the back of the queue.",
        checks,
      });
    }
  }

  steps.push({
    visited: [...visited],
    frontier: [],
    path: buildPath(previous, endNode, startNode),
    current: endNode,
    message: "BFS complete.",
    checks,
  });

  return steps;
}

function dfsTrace(
  walls: Set<number>,
  startNode: number,
  endNode: number,
  gridWidth: number,
  gridHeight: number,
): PathStep[] {
  const steps: PathStep[] = [];
  const stack = [startNode];
  const seen = new Set<number>([startNode]);
  const visited = new Set<number>();
  const previous = new Map<number, number>();
  let checks = 0;

  steps.push({
    visited: [],
    frontier: [...stack],
    path: [],
    current: startNode,
    message: "DFS starts with S on a stack.",
    checks,
  });

  while (stack.length > 0) {
    const current = stack.pop()!;
    visited.add(current);

    steps.push({
      visited: [...visited],
      frontier: [...stack],
      path: buildPath(previous, current, startNode),
      current,
      message: current === endNode ? "End reached. DFS found a path, not necessarily shortest." : "Visit the newest cell on the stack.",
      checks,
    });

    if (current === endNode) break;

    const nextCells = neighbors(current, walls, gridWidth, gridHeight).reverse();

    for (const next of nextCells) {
      checks++;

      if (seen.has(next)) continue;

      seen.add(next);
      previous.set(next, current);
      stack.push(next);

      steps.push({
        visited: [...visited],
        frontier: [...stack],
        path: buildPath(previous, next, startNode),
        current: next,
        message: "Push an unvisited neighbor onto the stack.",
        checks,
      });
    }
  }

  steps.push({
    visited: [...visited],
    frontier: [],
    path: buildPath(previous, endNode, startNode),
    current: endNode,
    message: "DFS complete.",
    checks,
  });

  return steps;
}

function greedyTrace(
  walls: Set<number>,
  startNode: number,
  endNode: number,
  gridWidth: number,
  gridHeight: number,
): PathStep[] {
  const steps: PathStep[] = [];
  const frontier = new Set<number>([startNode]);
  const seen = new Set<number>([startNode]);
  const visited = new Set<number>();
  const previous = new Map<number, number>();
  let checks = 0;

  steps.push({
    visited: [],
    frontier: [startNode],
    path: [],
    current: startNode,
    message: "Greedy Best-First Search chooses the cell that looks closest to E.",
    checks,
  });

  while (frontier.size > 0) {
    const current = [...frontier].sort(
      (a, b) => heuristic(a, endNode, gridWidth) - heuristic(b, endNode, gridWidth),
    )[0];

    frontier.delete(current);
    visited.add(current);

    steps.push({
      visited: [...visited],
      frontier: [...frontier],
      path: buildPath(previous, current, startNode),
      current,
      message: current === endNode ? "End reached. Greedy found a path." : "Visit the frontier cell with the smallest heuristic distance to E.",
      checks,
    });

    if (current === endNode) break;

    for (const next of neighbors(current, walls, gridWidth, gridHeight)) {
      checks++;

      if (seen.has(next)) continue;

      seen.add(next);
      previous.set(next, current);
      frontier.add(next);

      steps.push({
        visited: [...visited],
        frontier: [...frontier],
        path: buildPath(previous, next, startNode),
        current: next,
        message: "Add neighbor and rank it by estimated distance to E.",
        checks,
      });
    }
  }

  steps.push({
    visited: [...visited],
    frontier: [],
    path: buildPath(previous, endNode, startNode),
    current: endNode,
    message: "Greedy Best-First Search complete.",
    checks,
  });

  return steps;
}

function bellmanFordTrace(
  walls: Set<number>,
  startNode: number,
  endNode: number,
  gridWidth: number,
  gridHeight: number,
): PathStep[] {
  const steps: PathStep[] = [];
  const allNodes = Array.from({ length: gridWidth * gridHeight }, (_, index) => index).filter(
    (node) => !walls.has(node),
  );

  const distance = new Map<number, number>();
  const previous = new Map<number, number>();
  const relaxed = new Set<number>();
  let checks = 0;

  for (const node of allNodes) {
    distance.set(node, Infinity);
  }

  distance.set(startNode, 0);
  relaxed.add(startNode);

  steps.push({
    visited: [],
    frontier: [startNode],
    path: [],
    current: startNode,
    message: "Bellman-Ford starts with distance 0 at S and infinity everywhere else.",
    checks,
  });

  for (let pass = 1; pass < allNodes.length; pass++) {
    let changed = false;

    steps.push({
      visited: [...relaxed],
      frontier: [],
      path: buildPath(previous, endNode, startNode),
      current: null,
      message: `Relaxation pass ${pass}. Check every reachable edge.`,
      checks,
    });

    for (const node of allNodes) {
      const currentDistance = distance.get(node) ?? Infinity;

      if (currentDistance === Infinity) continue;

      for (const next of neighbors(node, walls, gridWidth, gridHeight)) {
        checks++;

        steps.push({
          visited: [...relaxed],
          frontier: [next],
          path: buildPath(previous, node, startNode),
          current: node,
          message: `Check edge ${node} -> ${next}.`,
          checks,
        });

        if (currentDistance + 1 < (distance.get(next) ?? Infinity)) {
          distance.set(next, currentDistance + 1);
          previous.set(next, node);
          relaxed.add(next);
          changed = true;

          steps.push({
            visited: [...relaxed],
            frontier: [next],
            path: buildPath(previous, next, startNode),
            current: next,
            message: `Relax ${next}. Its shortest known distance improves to ${currentDistance + 1}.`,
            checks,
          });
        }
      }
    }

    if (!changed) {
      steps.push({
        visited: [...relaxed],
        frontier: [],
        path: buildPath(previous, endNode, startNode),
        current: null,
        message: "No distances changed in this pass, so Bellman-Ford can stop early.",
        checks,
      });
      break;
    }
  }

  steps.push({
    visited: [...relaxed],
    frontier: [],
    path: buildPath(previous, endNode, startNode),
    current: endNode,
    message: "Bellman-Ford complete.",
    checks,
  });

  return steps;
}
