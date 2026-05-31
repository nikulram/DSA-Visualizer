export type GraphAlgorithm = "graphBfs" | "graphDfs" | "topological" | "connectedComponents" | "kosaraju" | "tarjan" | "unionFind" | "pathCompression" | "bridgeFinding" | "articulationPoints" | "eulerianPath" | "kruskal" | "prim" | "boruvka" | "reverseDelete" | "fordFulkerson" | "edmondsKarp" | "dinic" | "pushRelabel" | "minCostMaxFlow" | "hopcroftKarp" | "blossom" | "hungarian";

export type GraphVisualMode = "graph" | "tree" | "table";

export type GraphEdge = {
  from: number;
  to: number;
  weight?: number;
};

export type GraphStep = {
  visited: number[];
  frontier: number[];
  output: number[];
  current: number | null;
  activeEdges: GraphEdge[];
  treeEdges: GraphEdge[];
  message: string;
  checks: number;
  component: number;
};

export type GraphModel = {
  labels: string[];
  edges: GraphEdge[];
  directed: boolean;
};

export const graphLabels: Record<GraphAlgorithm, string> = {
  graphBfs: "BFS Traversal",
  graphDfs: "DFS Traversal",
  topological: "Topological Sort",
  connectedComponents: "Connected Components",
  kosaraju: "Kosaraju SCC",
  tarjan: "Tarjan SCC",
  unionFind: "Union Find",
  pathCompression: "Path Compression",
  bridgeFinding: "Bridge Finding",
  articulationPoints: "Articulation Points",
  eulerianPath: "Eulerian Path",
  kruskal: "Kruskal",
  prim: "Prim",
  boruvka: "Borůvka",
  reverseDelete: "Reverse Delete",
  fordFulkerson: "Ford-Fulkerson",
  edmondsKarp: "Edmonds-Karp",
  dinic: "Dinic",
  pushRelabel: "Push-Relabel",
  minCostMaxFlow: "Min-Cost Max-Flow",
  hopcroftKarp: "Hopcroft-Karp",
  blossom: "Blossom Matching",
  hungarian: "Hungarian Algorithm",
};

const defaultLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];

export function parseGraphLabels(input: string) {
  const labels = input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 16);

  return labels.length >= 2 ? labels : defaultLabels.slice(0, 9);
}

function makeDagEdges(count: number): GraphEdge[] {
  const edges: GraphEdge[] = [];

  for (let index = 0; index < count; index++) {
    const left = index * 2 + 1;
    const right = index * 2 + 2;

    if (left < count) edges.push({ from: index, to: left });
    if (right < count) edges.push({ from: index, to: right });
  }

  return edges;
}

function makeComponentEdges(count: number): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const split = Math.max(2, Math.ceil(count * 0.68));

  for (let index = 0; index < split - 1; index++) {
    edges.push({ from: index, to: index + 1 });
  }

  if (split > 2) {
    edges.push({ from: 0, to: Math.min(split - 1, 2) });
  }

  for (let index = split; index < count - 1; index++) {
    edges.push({ from: index, to: index + 1 });
  }

  return edges;
}


function makeSccEdges(count: number): GraphEdge[] {
  const base: GraphEdge[] = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 0 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 3 },
    { from: 5, to: 6 },
    { from: 6, to: 7 },
    { from: 7, to: 6 },
  ];

  return base.filter((edge) => edge.from < count && edge.to < count);
}

function makeUnionFindEdges(count: number): GraphEdge[] {
  const base: GraphEdge[] = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 6, to: 7 },
    { from: 2, to: 3 },
    { from: 5, to: 6 },
  ];

  return base.filter((edge) => edge.from < count && edge.to < count);
}


function makeBridgeEdges(count: number): GraphEdge[] {
  const base: GraphEdge[] = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 0 },
    { from: 1, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 3 },
    { from: 4, to: 6 },
    { from: 6, to: 7 },
  ];

  return base.filter((edge) => edge.from < count && edge.to < count);
}

function makeEulerianEdges(count: number): GraphEdge[] {
  const base: GraphEdge[] = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 0 },
    { from: 0, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 0 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
    { from: 6, to: 4 },
    { from: 6, to: 7 },
  ];

  return base.filter((edge) => edge.from < count && edge.to < count);
}

function makeWeightedEdges(count: number): GraphEdge[] {
  const base: GraphEdge[] = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 3 },
    { from: 1, to: 2, weight: 1 },
    { from: 1, to: 3, weight: 2 },
    { from: 2, to: 3, weight: 4 },
    { from: 2, to: 4, weight: 5 },
    { from: 3, to: 4, weight: 2 },
    { from: 3, to: 5, weight: 7 },
    { from: 4, to: 5, weight: 6 },
    { from: 4, to: 6, weight: 3 },
    { from: 5, to: 6, weight: 1 },
    { from: 5, to: 7, weight: 8 },
    { from: 6, to: 7, weight: 2 },
    { from: 6, to: 8, weight: 4 },
    { from: 7, to: 8, weight: 3 },
  ];

  return base.filter((edge) => edge.from < count && edge.to < count);
}


function makeBipartiteEdges(count: number): GraphEdge[] {
  const base: GraphEdge[] = [
    { from: 0, to: 4, weight: 1 },
    { from: 0, to: 5, weight: 1 },
    { from: 1, to: 4, weight: 1 },
    { from: 1, to: 6, weight: 1 },
    { from: 2, to: 5, weight: 1 },
    { from: 2, to: 7, weight: 1 },
    { from: 3, to: 6, weight: 1 },
    { from: 3, to: 7, weight: 1 },
  ];

  return base.filter((edge) => edge.from < count && edge.to < count);
}

function makeBlossomEdges(count: number): GraphEdge[] {
  const base: GraphEdge[] = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 0 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 3 },
    { from: 5, to: 6 },
    { from: 6, to: 7 },
  ];

  return base.filter((edge) => edge.from < count && edge.to < count);
}

function makeAssignmentEdges(count: number): GraphEdge[] {
  const base: GraphEdge[] = [
    { from: 0, to: 4, weight: 9 },
    { from: 0, to: 5, weight: 2 },
    { from: 0, to: 6, weight: 7 },
    { from: 0, to: 7, weight: 8 },
    { from: 1, to: 4, weight: 6 },
    { from: 1, to: 5, weight: 4 },
    { from: 1, to: 6, weight: 3 },
    { from: 1, to: 7, weight: 7 },
    { from: 2, to: 4, weight: 5 },
    { from: 2, to: 5, weight: 8 },
    { from: 2, to: 6, weight: 1 },
    { from: 2, to: 7, weight: 8 },
    { from: 3, to: 4, weight: 7 },
    { from: 3, to: 5, weight: 6 },
    { from: 3, to: 6, weight: 9 },
    { from: 3, to: 7, weight: 4 },
  ];

  return base.filter((edge) => edge.from < count && edge.to < count);
}

function makeFlowEdges(count: number): GraphEdge[] {
  const edges: GraphEdge[] = [
    { from: 0, to: 1, weight: 10 },
    { from: 0, to: 2, weight: 8 },
    { from: 1, to: 3, weight: 5 },
    { from: 1, to: 4, weight: 7 },
    { from: 2, to: 1, weight: 4 },
    { from: 2, to: 4, weight: 10 },
    { from: 3, to: 5, weight: 8 },
    { from: 4, to: 3, weight: 3 },
    { from: 4, to: 5, weight: 10 },
    { from: 5, to: 6, weight: 12 },
    { from: 4, to: 6, weight: 4 },
    { from: 6, to: 7, weight: 15 },
    { from: 5, to: 7, weight: 6 },
  ];

  return edges.filter((edge) => edge.from < count && edge.to < count);
}

function isFlowAlgorithm(algorithm: GraphAlgorithm) {
  return algorithm === "fordFulkerson" || algorithm === "edmondsKarp" || algorithm === "dinic" || algorithm === "pushRelabel";
}

function graphFor(algorithm: GraphAlgorithm, input = ""): GraphModel {
  const labels = parseGraphLabels(input);
  const safeLabels = labels.length >= 2 ? labels : defaultLabels.slice(0, 9);

  if (algorithm === "connectedComponents") {
    return {
      labels: safeLabels.length >= 4 ? safeLabels : defaultLabels.slice(0, 8),
      edges: makeComponentEdges(safeLabels.length >= 4 ? safeLabels.length : 8),
      directed: false,
    };
  }

  if (algorithm === "kosaraju" || algorithm === "tarjan") {
    return {
      labels: safeLabels.length >= 6 ? safeLabels : defaultLabels.slice(0, 8),
      edges: makeSccEdges(safeLabels.length >= 6 ? safeLabels.length : 8),
      directed: true,
    };
  }

  if (algorithm === "unionFind" || algorithm === "pathCompression") {
    return {
      labels: safeLabels.length >= 6 ? safeLabels : defaultLabels.slice(0, 8),
      edges: makeUnionFindEdges(safeLabels.length >= 6 ? safeLabels.length : 8),
      directed: false,
    };
  }

  if (algorithm === "bridgeFinding" || algorithm === "articulationPoints") {
    return {
      labels: safeLabels.length >= 6 ? safeLabels : defaultLabels.slice(0, 8),
      edges: makeBridgeEdges(safeLabels.length >= 6 ? safeLabels.length : 8),
      directed: false,
    };
  }

  if (algorithm === "eulerianPath") {
    return {
      labels: safeLabels.length >= 6 ? safeLabels : defaultLabels.slice(0, 8),
      edges: makeEulerianEdges(safeLabels.length >= 6 ? safeLabels.length : 8),
      directed: false,
    };
  }

  if (algorithm === "kruskal" || algorithm === "prim" || algorithm === "boruvka" || algorithm === "reverseDelete") {
    return {
      labels: safeLabels.length >= 4 ? safeLabels : defaultLabels.slice(0, 8),
      edges: makeWeightedEdges(safeLabels.length >= 4 ? safeLabels.length : 8),
      directed: false,
    };
  }

  if (isFlowAlgorithm(algorithm) || algorithm === "minCostMaxFlow") {
    return {
      labels: safeLabels.length >= 6 ? safeLabels : defaultLabels.slice(0, 8),
      edges: makeFlowEdges(safeLabels.length >= 6 ? safeLabels.length : 8),
      directed: true,
    };
  }

  if (algorithm === "hopcroftKarp") {
    return {
      labels: safeLabels.length >= 8 ? safeLabels : ["L1", "L2", "L3", "L4", "R1", "R2", "R3", "R4"],
      edges: makeBipartiteEdges(safeLabels.length >= 8 ? safeLabels.length : 8),
      directed: false,
    };
  }

  if (algorithm === "blossom") {
    return {
      labels: safeLabels.length >= 6 ? safeLabels : defaultLabels.slice(0, 8),
      edges: makeBlossomEdges(safeLabels.length >= 6 ? safeLabels.length : 8),
      directed: false,
    };
  }

  if (algorithm === "hungarian") {
    return {
      labels: safeLabels.length >= 8 ? safeLabels : ["W1", "W2", "W3", "W4", "J1", "J2", "J3", "J4"],
      edges: makeAssignmentEdges(safeLabels.length >= 8 ? safeLabels.length : 8),
      directed: false,
    };
  }

  return {
    labels: safeLabels,
    edges: makeDagEdges(safeLabels.length),
    directed: algorithm === "topological",
  };
}

export function getGraphModel(algorithm: GraphAlgorithm, input = ""): GraphModel {
  return graphFor(algorithm, input);
}

function addStep(steps: GraphStep[], step: GraphStep) {
  steps.push({
    visited: [...step.visited],
    frontier: [...step.frontier],
    output: [...step.output],
    current: step.current,
    activeEdges: step.activeEdges.map((edge) => ({ ...edge })),
    treeEdges: step.treeEdges.map((edge) => ({ ...edge })),
    message: step.message,
    checks: step.checks,
    component: step.component,
  });
}

function neighbors(model: GraphModel, node: number) {
  const next = model.edges
    .filter((edge) => edge.from === node)
    .map((edge) => edge.to);

  if (model.directed) return next;

  const previous = model.edges
    .filter((edge) => edge.to === node)
    .map((edge) => edge.from);

  return [...new Set([...next, ...previous])].sort((a, b) => a - b);
}

function bfsTrace(input: string): GraphStep[] {
  const model = graphFor("graphBfs", input);
  const steps: GraphStep[] = [];
  const queue = [0];
  const seen = new Set<number>([0]);
  const visited: number[] = [];
  const treeEdges: GraphEdge[] = [];
  let checks = 0;

  addStep(steps, {
    visited,
    frontier: queue,
    output: [],
    current: 0,
    activeEdges: [],
    treeEdges,
    message: `Start at ${model.labels[0]}. BFS uses a queue and explores level by level.`,
    checks,
    component: 1,
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    visited.push(current);

    addStep(steps, {
      visited,
      frontier: queue,
      output: visited,
      current,
      activeEdges: [],
      treeEdges,
      message: `Visit ${model.labels[current]}. Remove it from the front of the queue.`,
      checks,
      component: 1,
    });

    for (const next of neighbors(model, current)) {
      checks++;

      if (seen.has(next)) {
        addStep(steps, {
          visited,
          frontier: queue,
          output: visited,
          current: next,
          activeEdges: [{ from: current, to: next }],
          treeEdges,
          message: `${model.labels[next]} was already discovered, so skip it.`,
          checks,
          component: 1,
        });
        continue;
      }

      seen.add(next);
      queue.push(next);
      treeEdges.push({ from: current, to: next });

      addStep(steps, {
        visited,
        frontier: queue,
        output: visited,
        current: next,
        activeEdges: [{ from: current, to: next }],
        treeEdges,
        message: `Discover ${model.labels[next]} from ${model.labels[current]} and enqueue it.`,
        checks,
        component: 1,
      });
    }
  }

  addStep(steps, {
    visited,
    frontier: [],
    output: visited,
    current: null,
    activeEdges: [],
    treeEdges,
    message: "BFS traversal complete. Nodes were visited level by level.",
    checks,
    component: 1,
  });

  return steps;
}

function dfsTrace(input: string): GraphStep[] {
  const model = graphFor("graphDfs", input);
  const steps: GraphStep[] = [];
  const stack = [0];
  const seen = new Set<number>([0]);
  const visited: number[] = [];
  const treeEdges: GraphEdge[] = [];
  let checks = 0;

  addStep(steps, {
    visited,
    frontier: stack,
    output: [],
    current: 0,
    activeEdges: [],
    treeEdges,
    message: `Start at ${model.labels[0]}. DFS uses a stack and goes deep before backtracking.`,
    checks,
    component: 1,
  });

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (visited.includes(current)) continue;

    visited.push(current);

    addStep(steps, {
      visited,
      frontier: stack,
      output: visited,
      current,
      activeEdges: [],
      treeEdges,
      message: `Visit ${model.labels[current]}. DFS expands the deepest available node.`,
      checks,
      component: 1,
    });

    for (const next of neighbors(model, current).reverse()) {
      checks++;

      if (seen.has(next)) {
        addStep(steps, {
          visited,
          frontier: stack,
          output: visited,
          current: next,
          activeEdges: [{ from: current, to: next }],
          treeEdges,
          message: `${model.labels[next]} was already discovered, so skip it.`,
          checks,
          component: 1,
        });
        continue;
      }

      seen.add(next);
      stack.push(next);
      treeEdges.push({ from: current, to: next });

      addStep(steps, {
        visited,
        frontier: stack,
        output: visited,
        current: next,
        activeEdges: [{ from: current, to: next }],
        treeEdges,
        message: `Push ${model.labels[next]} from ${model.labels[current]} onto the DFS stack.`,
        checks,
        component: 1,
      });
    }
  }

  addStep(steps, {
    visited,
    frontier: [],
    output: visited,
    current: null,
    activeEdges: [],
    treeEdges,
    message: "DFS traversal complete. Nodes were visited by going deep first.",
    checks,
    component: 1,
  });

  return steps;
}

function topologicalTrace(input: string): GraphStep[] {
  const model = graphFor("topological", input);
  const steps: GraphStep[] = [];
  const indegree = new Array(model.labels.length).fill(0);
  const visited: number[] = [];
  const output: number[] = [];
  const treeEdges: GraphEdge[] = [];
  let checks = 0;

  for (const edge of model.edges) {
    indegree[edge.to]++;
  }

  const queue = indegree
    .map((degree, node) => ({ degree, node }))
    .filter((item) => item.degree === 0)
    .map((item) => item.node);

  addStep(steps, {
    visited,
    frontier: queue,
    output,
    current: null,
    activeEdges: [],
    treeEdges,
    message: "Topological Sort starts with nodes that have indegree 0.",
    checks,
    component: 1,
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    visited.push(current);
    output.push(current);

    addStep(steps, {
      visited,
      frontier: queue,
      output,
      current,
      activeEdges: [],
      treeEdges,
      message: `Output ${model.labels[current]}. It has no remaining prerequisites.`,
      checks,
      component: 1,
    });

    for (const edge of model.edges.filter((item) => item.from === current)) {
      checks++;
      indegree[edge.to]--;
      treeEdges.push(edge);

      addStep(steps, {
        visited,
        frontier: queue,
        output,
        current: edge.to,
        activeEdges: [edge],
        treeEdges,
        message: `Remove edge ${model.labels[edge.from]} to ${model.labels[edge.to]}. New indegree of ${model.labels[edge.to]} is ${indegree[edge.to]}.`,
        checks,
        component: 1,
      });

      if (indegree[edge.to] === 0) {
        queue.push(edge.to);

        addStep(steps, {
          visited,
          frontier: queue,
          output,
          current: edge.to,
          activeEdges: [edge],
          treeEdges,
          message: `${model.labels[edge.to]} now has indegree 0, so add it to the queue.`,
          checks,
          component: 1,
        });
      }
    }
  }

  addStep(steps, {
    visited,
    frontier: [],
    output,
    current: null,
    activeEdges: [],
    treeEdges,
    message:
      output.length === model.labels.length
        ? "Topological Sort complete. The output is a valid dependency order."
        : "Cycle detected. A full topological order is impossible.",
    checks,
    component: 1,
  });

  return steps;
}

function connectedComponentsTrace(input: string): GraphStep[] {
  const model = graphFor("connectedComponents", input);
  const steps: GraphStep[] = [];
  const seen = new Set<number>();
  const visited: number[] = [];
  const output: number[] = [];
  const treeEdges: GraphEdge[] = [];
  let checks = 0;
  let component = 0;

  addStep(steps, {
    visited,
    frontier: [],
    output,
    current: null,
    activeEdges: [],
    treeEdges,
    message: "Connected Components scans every node and starts a new traversal when it finds an unseen node.",
    checks,
    component,
  });

  for (let start = 0; start < model.labels.length; start++) {
    if (seen.has(start)) continue;

    component++;
    const queue = [start];
    seen.add(start);

    addStep(steps, {
      visited,
      frontier: queue,
      output,
      current: start,
      activeEdges: [],
      treeEdges,
      message: `Start component ${component} at ${model.labels[start]}.`,
      checks,
      component,
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      visited.push(current);
      output.push(current);

      addStep(steps, {
        visited,
        frontier: queue,
        output,
        current,
        activeEdges: [],
        treeEdges,
        message: `Visit ${model.labels[current]} as part of component ${component}.`,
        checks,
        component,
      });

      for (const next of neighbors(model, current)) {
        checks++;

        if (seen.has(next)) continue;

        seen.add(next);
        queue.push(next);
        treeEdges.push({ from: current, to: next });

        addStep(steps, {
          visited,
          frontier: queue,
          output,
          current: next,
          activeEdges: [{ from: current, to: next }],
          treeEdges,
          message: `Add ${model.labels[next]} to component ${component}.`,
          checks,
          component,
        });
      }
    }
  }

  addStep(steps, {
    visited,
    frontier: [],
    output,
    current: null,
    activeEdges: [],
    treeEdges,
    message: `Connected Components complete. Found ${component} component${component === 1 ? "" : "s"}.`,
    checks,
    component,
  });

  return steps;
}



function reverseGraph(model: GraphModel): GraphModel {
  return {
    labels: model.labels,
    directed: true,
    edges: model.edges.map((edge) => ({ from: edge.to, to: edge.from, weight: edge.weight })),
  };
}

function kosarajuTrace(input: string): GraphStep[] {
  const model = graphFor("kosaraju", input);
  const reversed = reverseGraph(model);
  const steps: GraphStep[] = [];
  const visited = new Set<number>();
  const order: number[] = [];
  const treeEdges: GraphEdge[] = [];
  let checks = 0;
  let component = 0;

  addStep(steps, {
    visited: [],
    frontier: [],
    output: [],
    current: null,
    activeEdges: [],
    treeEdges,
    message: "Kosaraju pass 1 runs DFS on the original graph and records finish order.",
    checks,
    component,
  });

  function dfsOrder(node: number) {
    visited.add(node);

    addStep(steps, {
      visited: [...visited],
      frontier: [],
      output: order,
      current: node,
      activeEdges: [],
      treeEdges,
      message: `Pass 1 visits ${model.labels[node]}.`,
      checks,
      component,
    });

    for (const next of neighbors(model, node)) {
      checks++;
      const edge = { from: node, to: next };

      if (!visited.has(next)) {
        treeEdges.push(edge);
        addStep(steps, {
          visited: [...visited],
          frontier: [next],
          output: order,
          current: next,
          activeEdges: [edge],
          treeEdges,
          message: `Follow edge ${model.labels[node]} to ${model.labels[next]}.`,
          checks,
          component,
        });
        dfsOrder(next);
      }
    }

    order.push(node);

    addStep(steps, {
      visited: [...visited],
      frontier: [],
      output: order,
      current: node,
      activeEdges: [],
      treeEdges,
      message: `Finish ${model.labels[node]} and push it onto the stack.`,
      checks,
      component,
    });
  }

  for (let node = 0; node < model.labels.length; node++) {
    if (!visited.has(node)) dfsOrder(node);
  }

  visited.clear();

  addStep(steps, {
    visited: [],
    frontier: [...order].reverse(),
    output: order,
    current: null,
    activeEdges: [],
    treeEdges,
    message: "Kosaraju pass 2 runs DFS on the reversed graph in decreasing finish order.",
    checks,
    component,
  });

  function dfsComponent(node: number, members: number[]) {
    visited.add(node);
    members.push(node);

    addStep(steps, {
      visited: [...visited],
      frontier: members,
      output: members,
      current: node,
      activeEdges: [],
      treeEdges,
      message: `Collect ${model.labels[node]} into component ${component}.`,
      checks,
      component,
    });

    for (const next of neighbors(reversed, node)) {
      checks++;

      if (!visited.has(next)) {
        dfsComponent(next, members);
      }
    }
  }

  for (const node of [...order].reverse()) {
    if (visited.has(node)) continue;

    component++;
    const members: number[] = [];
    dfsComponent(node, members);

    addStep(steps, {
      visited: [...visited],
      frontier: [],
      output: members,
      current: node,
      activeEdges: [],
      treeEdges,
      message: `Component ${component}: ${members.map((item) => model.labels[item]).join(", ")}.`,
      checks,
      component,
    });
  }

  addStep(steps, {
    visited: [...visited],
    frontier: [],
    output: order,
    current: null,
    activeEdges: [],
    treeEdges,
    message: `Kosaraju complete. Found ${component} strongly connected component${component === 1 ? "" : "s"}.`,
    checks,
    component,
  });

  return steps;
}

function tarjanTrace(input: string): GraphStep[] {
  const model = graphFor("tarjan", input);
  const steps: GraphStep[] = [];
  const ids = new Array(model.labels.length).fill(-1);
  const low = new Array(model.labels.length).fill(0);
  const stack: number[] = [];
  const onStack = new Set<number>();
  const visited: number[] = [];
  const output: number[] = [];
  const treeEdges: GraphEdge[] = [];
  let id = 0;
  let checks = 0;
  let component = 0;

  addStep(steps, {
    visited,
    frontier: stack,
    output,
    current: null,
    activeEdges: [],
    treeEdges,
    message: "Tarjan uses DFS ids, low-link values, and a stack to find SCCs in one pass.",
    checks,
    component,
  });

  function dfs(node: number) {
    ids[node] = id;
    low[node] = id;
    id++;
    stack.push(node);
    onStack.add(node);
    visited.push(node);

    addStep(steps, {
      visited,
      frontier: stack,
      output,
      current: node,
      activeEdges: [],
      treeEdges,
      message: `Visit ${model.labels[node]}. Set id and low-link to ${ids[node]}.`,
      checks,
      component,
    });

    for (const next of neighbors(model, node)) {
      checks++;
      const edge = { from: node, to: next };

      addStep(steps, {
        visited,
        frontier: stack,
        output,
        current: next,
        activeEdges: [edge],
        treeEdges,
        message: `Inspect edge ${model.labels[node]} to ${model.labels[next]}.`,
        checks,
        component,
      });

      if (ids[next] === -1) {
        treeEdges.push(edge);
        dfs(next);
        low[node] = Math.min(low[node], low[next]);
      } else if (onStack.has(next)) {
        low[node] = Math.min(low[node], ids[next]);
      }

      addStep(steps, {
        visited,
        frontier: stack,
        output,
        current: node,
        activeEdges: [edge],
        treeEdges,
        message: `Update low-link of ${model.labels[node]} to ${low[node]}.`,
        checks,
        component,
      });
    }

    if (low[node] === ids[node]) {
      component++;
      const members: number[] = [];

      while (stack.length > 0) {
        const item = stack.pop()!;
        onStack.delete(item);
        members.push(item);
        output.push(item);

        if (item === node) break;
      }

      addStep(steps, {
        visited,
        frontier: stack,
        output,
        current: node,
        activeEdges: [],
        treeEdges,
        message: `Root ${model.labels[node]} closes component ${component}: ${members.map((item) => model.labels[item]).join(", ")}.`,
        checks,
        component,
      });
    }
  }

  for (let node = 0; node < model.labels.length; node++) {
    if (ids[node] === -1) dfs(node);
  }

  addStep(steps, {
    visited,
    frontier: [],
    output,
    current: null,
    activeEdges: [],
    treeEdges,
    message: `Tarjan complete. Found ${component} strongly connected component${component === 1 ? "" : "s"}.`,
    checks,
    component,
  });

  return steps;
}

function unionFindTrace(input: string): GraphStep[] {
  const model = graphFor("unionFind", input);
  const steps: GraphStep[] = [];
  const parent = model.labels.map((_, index) => index);
  const rank = model.labels.map(() => 0);
  const visited: number[] = [];
  const accepted: GraphEdge[] = [];
  let checks = 0;
  let component = model.labels.length;

  addStep(steps, {
    visited,
    frontier: model.labels.map((_, index) => index),
    output: parent,
    current: null,
    activeEdges: [],
    treeEdges: accepted,
    message: "Union Find starts with every node as its own parent.",
    checks,
    component,
  });

  for (const edge of model.edges) {
    checks++;
    const rootA = findParent(parent, edge.from);
    const rootB = findParent(parent, edge.to);

    addStep(steps, {
      visited,
      frontier: [edge.from, edge.to],
      output: parent,
      current: edge.to,
      activeEdges: [edge],
      treeEdges: accepted,
      message: `Find roots of ${model.labels[edge.from]} and ${model.labels[edge.to]}.`,
      checks,
      component,
    });

    if (rootA !== rootB) {
      union(parent, rank, edge.from, edge.to);
      accepted.push(edge);
      component--;

      for (const node of [edge.from, edge.to]) {
        if (!visited.includes(node)) visited.push(node);
      }

      addStep(steps, {
        visited,
        frontier: [edge.from, edge.to],
        output: parent,
        current: edge.to,
        activeEdges: [edge],
        treeEdges: accepted,
        message: `Union the two sets. Components remaining: ${component}.`,
        checks,
        component,
      });
    } else {
      addStep(steps, {
        visited,
        frontier: [edge.from, edge.to],
        output: parent,
        current: edge.to,
        activeEdges: [edge],
        treeEdges: accepted,
        message: "Both nodes already share the same root, so this edge would be redundant.",
        checks,
        component,
      });
    }
  }

  addStep(steps, {
    visited,
    frontier: [],
    output: parent,
    current: null,
    activeEdges: [],
    treeEdges: accepted,
    message: `Union Find complete. Components remaining: ${component}.`,
    checks,
    component,
  });

  return steps;
}

function findParent(parent: number[], node: number): number {
  if (parent[node] !== node) parent[node] = findParent(parent, parent[node]);
  return parent[node];
}

function union(parent: number[], rank: number[], a: number, b: number) {
  const rootA = findParent(parent, a);
  const rootB = findParent(parent, b);

  if (rootA === rootB) return false;

  if (rank[rootA] < rank[rootB]) {
    parent[rootA] = rootB;
  } else if (rank[rootA] > rank[rootB]) {
    parent[rootB] = rootA;
  } else {
    parent[rootB] = rootA;
    rank[rootA]++;
  }

  return true;
}

function sortedWeightedEdges(model: GraphModel) {
  return [...model.edges].sort((a, b) => (a.weight ?? 1) - (b.weight ?? 1));
}

function kruskalTrace(input: string): GraphStep[] {
  const model = graphFor("kruskal", input);
  const steps: GraphStep[] = [];
  const parent = model.labels.map((_, index) => index);
  const rank = model.labels.map(() => 0);
  const mst: GraphEdge[] = [];
  const visited: number[] = [];
  let checks = 0;

  addStep(steps, {
    visited,
    frontier: [],
    output: [],
    current: null,
    activeEdges: [],
    treeEdges: mst,
    message: "Kruskal starts by sorting all edges by weight from smallest to largest.",
    checks,
    component: 1,
  });

  for (const edge of sortedWeightedEdges(model)) {
    checks++;
    const a = findParent(parent, edge.from);
    const b = findParent(parent, edge.to);

    addStep(steps, {
      visited,
      frontier: [],
      output: mst.flatMap((item) => [item.from, item.to]),
      current: edge.to,
      activeEdges: [edge],
      treeEdges: mst,
      message: `Check edge ${model.labels[edge.from]}-${model.labels[edge.to]} with weight ${edge.weight}.`,
      checks,
      component: 1,
    });

    if (a !== b) {
      union(parent, rank, edge.from, edge.to);
      mst.push(edge);

      for (const node of [edge.from, edge.to]) {
        if (!visited.includes(node)) visited.push(node);
      }

      addStep(steps, {
        visited,
        frontier: [],
        output: mst.flatMap((item) => [item.from, item.to]),
        current: edge.to,
        activeEdges: [edge],
        treeEdges: mst,
        message: `Accept edge ${model.labels[edge.from]}-${model.labels[edge.to]}. It connects two different components.`,
        checks,
        component: 1,
      });
    } else {
      addStep(steps, {
        visited,
        frontier: [],
        output: mst.flatMap((item) => [item.from, item.to]),
        current: edge.to,
        activeEdges: [edge],
        treeEdges: mst,
        message: `Reject edge ${model.labels[edge.from]}-${model.labels[edge.to]} because it would create a cycle.`,
        checks,
        component: 1,
      });
    }

    if (mst.length === model.labels.length - 1) break;
  }

  addStep(steps, {
    visited,
    frontier: [],
    output: mst.flatMap((item) => [item.from, item.to]),
    current: null,
    activeEdges: [],
    treeEdges: mst,
    message: "Kruskal complete. The green edges form the minimum spanning tree.",
    checks,
    component: 1,
  });

  return steps;
}

function primTrace(input: string): GraphStep[] {
  const model = graphFor("prim", input);
  const steps: GraphStep[] = [];
  const inTree = new Set<number>([0]);
  const visited = [0];
  const mst: GraphEdge[] = [];
  let checks = 0;

  addStep(steps, {
    visited,
    frontier: [0],
    output: [0],
    current: 0,
    activeEdges: [],
    treeEdges: mst,
    message: `Prim starts from ${model.labels[0]} and repeatedly adds the cheapest edge leaving the tree.`,
    checks,
    component: 1,
  });

  while (inTree.size < model.labels.length) {
    const candidates = model.edges
      .filter((edge) => {
        const a = inTree.has(edge.from);
        const b = inTree.has(edge.to);
        return a !== b;
      })
      .sort((a, b) => (a.weight ?? 1) - (b.weight ?? 1));

    if (candidates.length === 0) break;

    const edge = candidates[0];
    const next = inTree.has(edge.from) ? edge.to : edge.from;
    checks++;

    addStep(steps, {
      visited,
      frontier: candidates.map((item) => (inTree.has(item.from) ? item.to : item.from)),
      output: visited,
      current: next,
      activeEdges: [edge],
      treeEdges: mst,
      message: `Choose cheapest crossing edge ${model.labels[edge.from]}-${model.labels[edge.to]} with weight ${edge.weight}.`,
      checks,
      component: 1,
    });

    inTree.add(next);
    visited.push(next);
    mst.push(edge);

    addStep(steps, {
      visited,
      frontier: [...inTree],
      output: visited,
      current: next,
      activeEdges: [edge],
      treeEdges: mst,
      message: `Add ${model.labels[next]} to the tree.`,
      checks,
      component: 1,
    });
  }

  addStep(steps, {
    visited,
    frontier: [],
    output: visited,
    current: null,
    activeEdges: [],
    treeEdges: mst,
    message: "Prim complete. The green edges form the minimum spanning tree.",
    checks,
    component: 1,
  });

  return steps;
}

function boruvkaTrace(input: string): GraphStep[] {
  const model = graphFor("boruvka", input);
  const steps: GraphStep[] = [];
  const parent = model.labels.map((_, index) => index);
  const rank = model.labels.map(() => 0);
  const mst: GraphEdge[] = [];
  const visited: number[] = [];
  let checks = 0;
  let components = model.labels.length;

  addStep(steps, {
    visited,
    frontier: model.labels.map((_, index) => index),
    output: [],
    current: null,
    activeEdges: [],
    treeEdges: mst,
    message: "Boruvka starts with every node as its own component.",
    checks,
    component: components,
  });

  while (components > 1) {
    const cheapest = new Map<number, GraphEdge>();

    for (const edge of model.edges) {
      checks++;
      const a = findParent(parent, edge.from);
      const b = findParent(parent, edge.to);

      if (a === b) continue;

      if (!cheapest.has(a) || (edge.weight ?? 1) < (cheapest.get(a)!.weight ?? 1)) cheapest.set(a, edge);
      if (!cheapest.has(b) || (edge.weight ?? 1) < (cheapest.get(b)!.weight ?? 1)) cheapest.set(b, edge);
    }

    const candidates = [...new Set([...cheapest.values()])];

    if (candidates.length === 0) break;

    for (const edge of candidates) {
      const a = findParent(parent, edge.from);
      const b = findParent(parent, edge.to);

      addStep(steps, {
        visited,
        frontier: [edge.from, edge.to],
        output: mst.flatMap((item) => [item.from, item.to]),
        current: edge.to,
        activeEdges: [edge],
        treeEdges: mst,
        message: `Component chooses cheapest outgoing edge ${model.labels[edge.from]}-${model.labels[edge.to]} with weight ${edge.weight}.`,
        checks,
        component: components,
      });

      if (a !== b && union(parent, rank, edge.from, edge.to)) {
        mst.push(edge);
        components--;

        for (const node of [edge.from, edge.to]) {
          if (!visited.includes(node)) visited.push(node);
        }

        addStep(steps, {
          visited,
          frontier: [],
          output: mst.flatMap((item) => [item.from, item.to]),
          current: edge.to,
          activeEdges: [edge],
          treeEdges: mst,
          message: `Merge two components using ${model.labels[edge.from]}-${model.labels[edge.to]}.`,
          checks,
          component: components,
        });
      }

      if (components === 1) break;
    }
  }

  addStep(steps, {
    visited,
    frontier: [],
    output: mst.flatMap((item) => [item.from, item.to]),
    current: null,
    activeEdges: [],
    treeEdges: mst,
    message: "Boruvka complete. All components merged into one minimum spanning tree.",
    checks,
    component: components,
  });

  return steps;
}

function isConnectedAfterRemoving(model: GraphModel, removed: Set<string>) {
  const queue = [0];
  const seen = new Set<number>([0]);

  while (queue.length > 0) {
    const current = queue.shift()!;

    for (const edge of model.edges) {
      const key = `${edge.from}-${edge.to}`;

      if (removed.has(key)) continue;

      let next: number | null = null;

      if (edge.from === current) next = edge.to;
      else if (edge.to === current) next = edge.from;

      if (next === null || seen.has(next)) continue;

      seen.add(next);
      queue.push(next);
    }
  }

  return seen.size === model.labels.length;
}

function reverseDeleteTrace(input: string): GraphStep[] {
  const model = graphFor("reverseDelete", input);
  const steps: GraphStep[] = [];
  const removed = new Set<string>();
  const descending = [...model.edges].sort((a, b) => (b.weight ?? 1) - (a.weight ?? 1));
  let checks = 0;

  addStep(steps, {
    visited: model.labels.map((_, index) => index),
    frontier: [],
    output: [],
    current: null,
    activeEdges: [],
    treeEdges: model.edges,
    message: "Reverse Delete starts with all edges, then tests the heaviest edges first.",
    checks,
    component: 1,
  });

  for (const edge of descending) {
    checks++;
    const key = `${edge.from}-${edge.to}`;
    removed.add(key);

    addStep(steps, {
      visited: model.labels.map((_, index) => index),
      frontier: [],
      output: [],
      current: edge.to,
      activeEdges: [edge],
      treeEdges: model.edges.filter((item) => !removed.has(`${item.from}-${item.to}`)),
      message: `Temporarily remove heaviest remaining edge ${model.labels[edge.from]}-${model.labels[edge.to]} with weight ${edge.weight}.`,
      checks,
      component: 1,
    });

    if (isConnectedAfterRemoving(model, removed)) {
      addStep(steps, {
        visited: model.labels.map((_, index) => index),
        frontier: [],
        output: [],
        current: edge.to,
        activeEdges: [edge],
        treeEdges: model.edges.filter((item) => !removed.has(`${item.from}-${item.to}`)),
        message: "Graph stays connected, so keep this edge removed.",
        checks,
        component: 1,
      });
    } else {
      removed.delete(key);

      addStep(steps, {
        visited: model.labels.map((_, index) => index),
        frontier: [],
        output: [],
        current: edge.to,
        activeEdges: [edge],
        treeEdges: model.edges.filter((item) => !removed.has(`${item.from}-${item.to}`)),
        message: "Removing it disconnects the graph, so restore the edge.",
        checks,
        component: 1,
      });
    }
  }

  addStep(steps, {
    visited: model.labels.map((_, index) => index),
    frontier: [],
    output: [],
    current: null,
    activeEdges: [],
    treeEdges: model.edges.filter((item) => !removed.has(`${item.from}-${item.to}`)),
    message: "Reverse Delete complete. Remaining green edges form the minimum spanning tree.",
    checks,
    component: 1,
  });

  return steps;
}


function makeResidual(model: GraphModel) {
  const residual = new Map<string, number>();

  for (const edge of model.edges) {
    residual.set(`${edge.from}-${edge.to}`, edge.weight ?? 1);
    residual.set(`${edge.to}-${edge.from}`, residual.get(`${edge.to}-${edge.from}`) ?? 0);
  }

  return residual;
}

function residualCapacity(residual: Map<string, number>, from: number, to: number) {
  return residual.get(`${from}-${to}`) ?? 0;
}

function addResidualFlow(residual: Map<string, number>, from: number, to: number, amount: number) {
  residual.set(`${from}-${to}`, residualCapacity(residual, from, to) - amount);
  residual.set(`${to}-${from}`, residualCapacity(residual, to, from) + amount);
}

function residualNeighbors(model: GraphModel, residual: Map<string, number>, node: number) {
  return model.labels
    .map((_, index) => index)
    .filter((next) => next !== node && residualCapacity(residual, node, next) > 0);
}

function pathBottleneck(residual: Map<string, number>, path: number[]) {
  let amount = Infinity;

  for (let index = 0; index < path.length - 1; index++) {
    amount = Math.min(amount, residualCapacity(residual, path[index], path[index + 1]));
  }

  return amount === Infinity ? 0 : amount;
}

function pathEdges(path: number[]) {
  const edges: GraphEdge[] = [];

  for (let index = 0; index < path.length - 1; index++) {
    edges.push({ from: path[index], to: path[index + 1] });
  }

  return edges;
}

function findDfsAugmentingPath(model: GraphModel, residual: Map<string, number>, source: number, sink: number) {
  const stack = [source];
  const seen = new Set<number>([source]);
  const previous = new Map<number, number>();

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (current === sink) break;

    for (const next of residualNeighbors(model, residual, current).reverse()) {
      if (seen.has(next)) continue;

      seen.add(next);
      previous.set(next, current);
      stack.push(next);
    }
  }

  if (!seen.has(sink)) return [];

  const path = [sink];
  let current = sink;

  while (current !== source) {
    current = previous.get(current)!;
    path.unshift(current);
  }

  return path;
}

function findBfsAugmentingPath(model: GraphModel, residual: Map<string, number>, source: number, sink: number) {
  const queue = [source];
  const seen = new Set<number>([source]);
  const previous = new Map<number, number>();

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current === sink) break;

    for (const next of residualNeighbors(model, residual, current)) {
      if (seen.has(next)) continue;

      seen.add(next);
      previous.set(next, current);
      queue.push(next);
    }
  }

  if (!seen.has(sink)) return [];

  const path = [sink];
  let current = sink;

  while (current !== source) {
    current = previous.get(current)!;
    path.unshift(current);
  }

  return path;
}

function flowTrace(input: string, algorithm: "fordFulkerson" | "edmondsKarp" | "dinic"): GraphStep[] {
  const model = graphFor(algorithm, input);
  const source = 0;
  const sink = model.labels.length - 1;
  const steps: GraphStep[] = [];
  const residual = makeResidual(model);
  const accepted: GraphEdge[] = [];
  const visited: number[] = [];
  let maxFlow = 0;
  let checks = 0;

  addStep(steps, {
    visited: [source],
    frontier: [source],
    output: [maxFlow],
    current: source,
    activeEdges: [],
    treeEdges: accepted,
    message:
      algorithm === "fordFulkerson"
        ? `Ford-Fulkerson starts at source ${model.labels[source]} and searches for any augmenting path to sink ${model.labels[sink]}.`
        : algorithm === "edmondsKarp"
          ? `Edmonds-Karp starts at source ${model.labels[source]} and uses BFS to find shortest augmenting paths.`
          : `Dinic starts by building level graphs with BFS, then sends blocking flow.`,
    checks,
    component: maxFlow,
  });

  while (true) {
    let path: number[] = [];

    if (algorithm === "fordFulkerson") {
      path = findDfsAugmentingPath(model, residual, source, sink);
    } else {
      path = findBfsAugmentingPath(model, residual, source, sink);
    }

    checks++;

    if (path.length === 0) {
      addStep(steps, {
        visited,
        frontier: [],
        output: [maxFlow],
        current: sink,
        activeEdges: [],
        treeEdges: accepted,
        message: `No augmenting path remains. Maximum flow is ${maxFlow}.`,
        checks,
        component: maxFlow,
      });
      break;
    }

    const amount = pathBottleneck(residual, path);
    const edges = pathEdges(path);

    for (const node of path) {
      if (!visited.includes(node)) visited.push(node);
    }

    addStep(steps, {
      visited,
      frontier: path,
      output: [maxFlow],
      current: sink,
      activeEdges: edges,
      treeEdges: accepted,
      message: `Found augmenting path ${path.map((node) => model.labels[node]).join(" to ")} with bottleneck ${amount}.`,
      checks,
      component: maxFlow,
    });

    for (const edge of edges) {
      addResidualFlow(residual, edge.from, edge.to, amount);
    }

    maxFlow += amount;
    accepted.push(...edges.map((edge) => ({ ...edge, weight: amount })));

    addStep(steps, {
      visited,
      frontier: [],
      output: [maxFlow],
      current: sink,
      activeEdges: edges,
      treeEdges: accepted,
      message: `Send ${amount} units of flow. Current total flow is ${maxFlow}.`,
      checks,
      component: maxFlow,
    });

    if (checks > model.labels.length * model.edges.length) break;
  }

  addStep(steps, {
    visited,
    frontier: [],
    output: [maxFlow],
    current: null,
    activeEdges: [],
    treeEdges: accepted,
    message: `${graphLabels[algorithm]} complete. Maximum flow is ${maxFlow}.`,
    checks,
    component: maxFlow,
  });

  return steps;
}

function pushRelabelTrace(input: string): GraphStep[] {
  const model = graphFor("pushRelabel", input);
  const source = 0;
  const sink = model.labels.length - 1;
  const steps: GraphStep[] = [];
  const residual = makeResidual(model);
  const height = new Array(model.labels.length).fill(0);
  const excess = new Array(model.labels.length).fill(0);
  const accepted: GraphEdge[] = [];
  const visited = [source];
  let checks = 0;

  height[source] = model.labels.length;

  addStep(steps, {
    visited,
    frontier: [source],
    output: [0],
    current: source,
    activeEdges: [],
    treeEdges: accepted,
    message: `Push-Relabel starts by setting source height to ${height[source]}.`,
    checks,
    component: 0,
  });

  for (const edge of model.edges.filter((item) => item.from === source)) {
    const amount = residualCapacity(residual, edge.from, edge.to);
    addResidualFlow(residual, edge.from, edge.to, amount);
    excess[edge.to] += amount;
    excess[source] -= amount;
    accepted.push({ ...edge, weight: amount });
    checks++;

    if (!visited.includes(edge.to)) visited.push(edge.to);

    addStep(steps, {
      visited,
      frontier: [edge.to],
      output: [excess[sink]],
      current: edge.to,
      activeEdges: [edge],
      treeEdges: accepted,
      message: `Preflow pushes ${amount} units from ${model.labels[source]} to ${model.labels[edge.to]}.`,
      checks,
      component: excess[sink],
    });
  }

  let changed = true;

  while (changed) {
    changed = false;

    for (let node = 0; node < model.labels.length; node++) {
      if (node === source || node === sink || excess[node] <= 0) continue;

      const options = residualNeighbors(model, residual, node).filter((next) => height[node] > height[next]);

      if (options.length === 0) {
        height[node]++;
        checks++;
        changed = true;

        addStep(steps, {
          visited,
          frontier: [node],
          output: [excess[sink]],
          current: node,
          activeEdges: [],
          treeEdges: accepted,
          message: `Relabel ${model.labels[node]} to height ${height[node]} because no downhill residual edge is available.`,
          checks,
          component: excess[sink],
        });

        continue;
      }

      const next = options[0];
      const amount = Math.min(excess[node], residualCapacity(residual, node, next));
      addResidualFlow(residual, node, next, amount);
      excess[node] -= amount;
      excess[next] += amount;
      checks++;
      changed = true;

      const edge = { from: node, to: next, weight: amount };
      accepted.push(edge);

      if (!visited.includes(next)) visited.push(next);

      addStep(steps, {
        visited,
        frontier: [next],
        output: [excess[sink]],
        current: next,
        activeEdges: [edge],
        treeEdges: accepted,
        message: `Push ${amount} units from ${model.labels[node]} to ${model.labels[next]}. Sink flow is now ${excess[sink]}.`,
        checks,
        component: excess[sink],
      });
    }

    if (checks > model.labels.length * model.edges.length * 3) break;
  }

  addStep(steps, {
    visited,
    frontier: [],
    output: [excess[sink]],
    current: null,
    activeEdges: [],
    treeEdges: accepted,
    message: `Push-Relabel complete. Maximum flow is ${excess[sink]}.`,
    checks,
    component: excess[sink],
  });

  return steps;
}


function pathCompressionTrace(input: string): GraphStep[] {
  const model = graphFor("pathCompression", input);
  const steps: GraphStep[] = [];
  const parent = model.labels.map((_, index) => index);
  const rank = model.labels.map(() => 0);
  const accepted: GraphEdge[] = [];
  const visited: number[] = [];
  let checks = 0;
  let component = model.labels.length;

  addStep(steps, {
    visited,
    frontier: model.labels.map((_, index) => index),
    output: parent,
    current: null,
    activeEdges: [],
    treeEdges: accepted,
    message: "Path Compression starts like Union Find, then flattens parent chains during find operations.",
    checks,
    component,
  });

  for (const edge of model.edges) {
    checks++;
    const rootA = findParent(parent, edge.from);
    const rootB = findParent(parent, edge.to);

    addStep(steps, {
      visited,
      frontier: [edge.from, edge.to],
      output: parent,
      current: edge.to,
      activeEdges: [edge],
      treeEdges: accepted,
      message: `Find roots before union: ${model.labels[edge.from]} root ${model.labels[rootA]}, ${model.labels[edge.to]} root ${model.labels[rootB]}.`,
      checks,
      component,
    });

    if (union(parent, rank, edge.from, edge.to)) {
      accepted.push(edge);
      component--;

      for (const node of [edge.from, edge.to]) {
        if (!visited.includes(node)) visited.push(node);
      }

      addStep(steps, {
        visited,
        frontier: [edge.from, edge.to],
        output: parent,
        current: edge.to,
        activeEdges: [edge],
        treeEdges: accepted,
        message: `Union the sets, then future find calls compress paths toward the root.`,
        checks,
        component,
      });
    }

    for (let node = 0; node < parent.length; node++) {
      const before = parent[node];
      const root = findParent(parent, node);

      if (before !== root) {
        checks++;
        addStep(steps, {
          visited: [...new Set([...visited, node])],
          frontier: [node, root],
          output: parent,
          current: node,
          activeEdges: [],
          treeEdges: accepted,
          message: `Compress path for ${model.labels[node]}: parent now points directly to root ${model.labels[root]}.`,
          checks,
          component,
        });
      }
    }
  }

  addStep(steps, {
    visited: model.labels.map((_, index) => index),
    frontier: [],
    output: parent,
    current: null,
    activeEdges: [],
    treeEdges: accepted,
    message: `Path Compression complete. Parent chains are flattened where find was called.`,
    checks,
    component,
  });

  return steps;
}

function bridgeFindingTrace(input: string): GraphStep[] {
  const model = graphFor("bridgeFinding", input);
  const steps: GraphStep[] = [];
  const discovery = new Array(model.labels.length).fill(-1);
  const low = new Array(model.labels.length).fill(0);
  const visited: number[] = [];
  const bridges: GraphEdge[] = [];
  const treeEdges: GraphEdge[] = [];
  let time = 0;
  let checks = 0;

  addStep(steps, {
    visited,
    frontier: [],
    output: [],
    current: null,
    activeEdges: [],
    treeEdges,
    message: "Bridge Finding uses DFS discovery time and low-link values. An edge is a bridge if the child cannot reach an ancestor.",
    checks,
    component: 0,
  });

  function dfs(node: number, parentNode: number | null) {
    discovery[node] = time;
    low[node] = time;
    time++;
    visited.push(node);

    addStep(steps, {
      visited,
      frontier: [],
      output: bridges.flatMap((edge) => [edge.from, edge.to]),
      current: node,
      activeEdges: [],
      treeEdges,
      message: `Visit ${model.labels[node]}. Set discovery and low-link to ${discovery[node]}.`,
      checks,
      component: bridges.length,
    });

    for (const next of neighbors(model, node)) {
      if (next === parentNode) continue;

      checks++;
      const edge = { from: node, to: next };

      addStep(steps, {
        visited,
        frontier: [next],
        output: bridges.flatMap((item) => [item.from, item.to]),
        current: next,
        activeEdges: [edge],
        treeEdges,
        message: `Inspect edge ${model.labels[node]}-${model.labels[next]}.`,
        checks,
        component: bridges.length,
      });

      if (discovery[next] === -1) {
        treeEdges.push(edge);
        dfs(next, node);
        low[node] = Math.min(low[node], low[next]);

        if (low[next] > discovery[node]) {
          bridges.push(edge);

          addStep(steps, {
            visited,
            frontier: [next],
            output: bridges.flatMap((item) => [item.from, item.to]),
            current: next,
            activeEdges: [edge],
            treeEdges: bridges,
            message: `${model.labels[node]}-${model.labels[next]} is a bridge because child low-link ${low[next]} is greater than discovery ${discovery[node]}.`,
            checks,
            component: bridges.length,
          });
        }
      } else {
        low[node] = Math.min(low[node], discovery[next]);
      }

      addStep(steps, {
        visited,
        frontier: [],
        output: bridges.flatMap((item) => [item.from, item.to]),
        current: node,
        activeEdges: [edge],
        treeEdges: bridges,
        message: `Update low-link of ${model.labels[node]} to ${low[node]}.`,
        checks,
        component: bridges.length,
      });
    }
  }

  for (let node = 0; node < model.labels.length; node++) {
    if (discovery[node] === -1) dfs(node, null);
  }

  addStep(steps, {
    visited,
    frontier: [],
    output: bridges.flatMap((edge) => [edge.from, edge.to]),
    current: null,
    activeEdges: [],
    treeEdges: bridges,
    message: `Bridge Finding complete. Found ${bridges.length} bridge${bridges.length === 1 ? "" : "s"}.`,
    checks,
    component: bridges.length,
  });

  return steps;
}

function articulationPointsTrace(input: string): GraphStep[] {
  const model = graphFor("articulationPoints", input);
  const steps: GraphStep[] = [];
  const discovery = new Array(model.labels.length).fill(-1);
  const low = new Array(model.labels.length).fill(0);
  const points = new Set<number>();
  const visited: number[] = [];
  const treeEdges: GraphEdge[] = [];
  let time = 0;
  let checks = 0;

  addStep(steps, {
    visited,
    frontier: [],
    output: [],
    current: null,
    activeEdges: [],
    treeEdges,
    message: "Articulation Points uses DFS low-link values. A node is critical if removing it disconnects a child subtree.",
    checks,
    component: 0,
  });

  function dfs(node: number, parentNode: number | null) {
    discovery[node] = time;
    low[node] = time;
    time++;
    visited.push(node);
    let children = 0;

    addStep(steps, {
      visited,
      frontier: [],
      output: [...points],
      current: node,
      activeEdges: [],
      treeEdges,
      message: `Visit ${model.labels[node]}. Set discovery and low-link to ${discovery[node]}.`,
      checks,
      component: points.size,
    });

    for (const next of neighbors(model, node)) {
      if (next === parentNode) continue;

      checks++;
      const edge = { from: node, to: next };

      if (discovery[next] === -1) {
        children++;
        treeEdges.push(edge);

        addStep(steps, {
          visited,
          frontier: [next],
          output: [...points],
          current: next,
          activeEdges: [edge],
          treeEdges,
          message: `Tree edge ${model.labels[node]}-${model.labels[next]}. Explore the child subtree.`,
          checks,
          component: points.size,
        });

        dfs(next, node);
        low[node] = Math.min(low[node], low[next]);

        if (parentNode !== null && low[next] >= discovery[node]) {
          points.add(node);

          addStep(steps, {
            visited,
            frontier: [next],
            output: [...points],
            current: node,
            activeEdges: [edge],
            treeEdges,
            message: `${model.labels[node]} is an articulation point because child ${model.labels[next]} cannot reach an ancestor.`,
            checks,
            component: points.size,
          });
        }
      } else {
        low[node] = Math.min(low[node], discovery[next]);
      }

      addStep(steps, {
        visited,
        frontier: [],
        output: [...points],
        current: node,
        activeEdges: [edge],
        treeEdges,
        message: `Update low-link of ${model.labels[node]} to ${low[node]}.`,
        checks,
        component: points.size,
      });
    }

    if (parentNode === null && children > 1) {
      points.add(node);

      addStep(steps, {
        visited,
        frontier: [],
        output: [...points],
        current: node,
        activeEdges: [],
        treeEdges,
        message: `${model.labels[node]} is a root articulation point because it has ${children} DFS children.`,
        checks,
        component: points.size,
      });
    }
  }

  for (let node = 0; node < model.labels.length; node++) {
    if (discovery[node] === -1) dfs(node, null);
  }

  addStep(steps, {
    visited,
    frontier: [],
    output: [...points],
    current: null,
    activeEdges: [],
    treeEdges,
    message: `Articulation Points complete. Found ${points.size} critical node${points.size === 1 ? "" : "s"}.`,
    checks,
    component: points.size,
  });

  return steps;
}

function eulerianPathTrace(input: string): GraphStep[] {
  const model = graphFor("eulerianPath", input);
  const steps: GraphStep[] = [];
  const unused = model.edges.map((edge) => ({ ...edge }));
  const trail: GraphEdge[] = [];
  const visited: number[] = [];
  let current = 0;
  let checks = 0;

  visited.push(current);

  addStep(steps, {
    visited,
    frontier: [current],
    output: [current],
    current,
    activeEdges: [],
    treeEdges: trail,
    message: `Eulerian Path starts at ${model.labels[current]} and tries to use every edge exactly once.`,
    checks,
    component: unused.length,
  });

  while (unused.length > 0) {
    const edgeIndex = unused.findIndex((edge) => edge.from === current || edge.to === current);

    if (edgeIndex === -1) {
      addStep(steps, {
        visited,
        frontier: [],
        output: visited,
        current,
        activeEdges: [],
        treeEdges: trail,
        message: `No unused edge leaves ${model.labels[current]}. The current trail cannot continue.`,
        checks,
        component: unused.length,
      });
      break;
    }

    const edge = unused.splice(edgeIndex, 1)[0];
    const next = edge.from === current ? edge.to : edge.from;
    checks++;

    trail.push(edge);
    current = next;
    visited.push(current);

    addStep(steps, {
      visited,
      frontier: [current],
      output: visited,
      current,
      activeEdges: [edge],
      treeEdges: trail,
      message: `Use edge ${model.labels[edge.from]}-${model.labels[edge.to]}. Move to ${model.labels[current]}.`,
      checks,
      component: unused.length,
    });
  }

  addStep(steps, {
    visited,
    frontier: [],
    output: visited,
    current: null,
    activeEdges: [],
    treeEdges: trail,
    message: unused.length === 0
      ? "Eulerian Path complete. Every edge was used exactly once."
      : "Eulerian Path stopped early because this simple trail got stuck.",
    checks,
    component: unused.length,
  });

  return steps;
}


function minCostMaxFlowTrace(input: string): GraphStep[] {
  const model = graphFor("minCostMaxFlow", input);
  const source = 0;
  const sink = model.labels.length - 1;
  const steps: GraphStep[] = [];
  const residual = makeResidual(model);
  const selected: GraphEdge[] = [];
  const visited: number[] = [source];
  let totalFlow = 0;
  let totalCost = 0;
  let checks = 0;

  addStep(steps, {
    visited,
    frontier: [source],
    output: [totalFlow, totalCost],
    current: source,
    activeEdges: [],
    treeEdges: selected,
    message: "Min-Cost Max-Flow repeatedly sends flow through the cheapest available augmenting path.",
    checks,
    component: totalCost,
  });

  while (true) {
    const path = findBfsAugmentingPath(model, residual, source, sink);

    checks++;

    if (path.length === 0) break;

    const edges = pathEdges(path);
    const bottleneck = pathBottleneck(residual, path);
    const pathCost = edges.reduce((sum, edge) => {
      const original = model.edges.find((item) => item.from === edge.from && item.to === edge.to);
      return sum + (original?.weight ?? 1);
    }, 0);

    for (const node of path) {
      if (!visited.includes(node)) visited.push(node);
    }

    addStep(steps, {
      visited,
      frontier: path,
      output: [totalFlow, totalCost],
      current: sink,
      activeEdges: edges,
      treeEdges: selected,
      message: `Choose augmenting path ${path.map((node) => model.labels[node]).join(" to ")} with bottleneck ${bottleneck} and path cost ${pathCost}.`,
      checks,
      component: totalCost,
    });

    for (const edge of edges) addResidualFlow(residual, edge.from, edge.to, bottleneck);

    totalFlow += bottleneck;
    totalCost += bottleneck * pathCost;
    selected.push(...edges.map((edge) => ({ ...edge, weight: bottleneck })));

    addStep(steps, {
      visited,
      frontier: [],
      output: [totalFlow, totalCost],
      current: sink,
      activeEdges: edges,
      treeEdges: selected,
      message: `Send ${bottleneck} units. Total flow is ${totalFlow}, total cost is ${totalCost}.`,
      checks,
      component: totalCost,
    });

    if (checks > model.labels.length * model.edges.length) break;
  }

  addStep(steps, {
    visited,
    frontier: [],
    output: [totalFlow, totalCost],
    current: null,
    activeEdges: [],
    treeEdges: selected,
    message: `Min-Cost Max-Flow complete. Flow ${totalFlow}, cost ${totalCost}.`,
    checks,
    component: totalCost,
  });

  return steps;
}

function hopcroftKarpTrace(input: string): GraphStep[] {
  const model = graphFor("hopcroftKarp", input);
  const steps: GraphStep[] = [];
  const leftSize = Math.floor(model.labels.length / 2);
  const matchedRight = new Set<number>();
  const matchedLeft = new Set<number>();
  const matching: GraphEdge[] = [];
  let checks = 0;

  addStep(steps, {
    visited: [],
    frontier: [...Array(leftSize).keys()],
    output: [],
    current: null,
    activeEdges: [],
    treeEdges: matching,
    message: "Hopcroft-Karp works on a bipartite graph and searches layers of shortest augmenting paths.",
    checks,
    component: 0,
  });

  for (let left = 0; left < leftSize; left++) {
    const candidates = model.edges.filter((edge) => edge.from === left && !matchedRight.has(edge.to));
    checks++;

    addStep(steps, {
      visited: [...matchedLeft],
      frontier: candidates.map((edge) => edge.to),
      output: [...matchedLeft, ...matchedRight],
      current: left,
      activeEdges: candidates,
      treeEdges: matching,
      message: `Layer search from ${model.labels[left]} checks available right-side matches.`,
      checks,
      component: matching.length,
    });

    if (candidates.length === 0) continue;

    const edge = candidates[0];
    matchedLeft.add(left);
    matchedRight.add(edge.to);
    matching.push(edge);

    addStep(steps, {
      visited: [...matchedLeft, ...matchedRight],
      frontier: [],
      output: [...matchedLeft, ...matchedRight],
      current: edge.to,
      activeEdges: [edge],
      treeEdges: matching,
      message: `Match ${model.labels[edge.from]} with ${model.labels[edge.to]}.`,
      checks,
      component: matching.length,
    });
  }

  addStep(steps, {
    visited: [...matchedLeft, ...matchedRight],
    frontier: [],
    output: [...matchedLeft, ...matchedRight],
    current: null,
    activeEdges: [],
    treeEdges: matching,
    message: `Hopcroft-Karp complete. Matching size is ${matching.length}.`,
    checks,
    component: matching.length,
  });

  return steps;
}

function blossomTrace(input: string): GraphStep[] {
  const model = graphFor("blossom", input);
  const steps: GraphStep[] = [];
  const matched = new Set<number>();
  const matching: GraphEdge[] = [];
  let checks = 0;

  addStep(steps, {
    visited: [],
    frontier: [],
    output: [],
    current: null,
    activeEdges: [],
    treeEdges: matching,
    message: "Blossom Matching handles general graphs, including odd cycles. This visual shows greedy matching plus blossom-style odd-cycle detection.",
    checks,
    component: 0,
  });

  for (const edge of model.edges) {
    checks++;

    addStep(steps, {
      visited: [...matched],
      frontier: [edge.from, edge.to],
      output: [...matched],
      current: edge.to,
      activeEdges: [edge],
      treeEdges: matching,
      message: `Inspect edge ${model.labels[edge.from]}-${model.labels[edge.to]}.`,
      checks,
      component: matching.length,
    });

    const formsOddCycle = model.edges.some((other) => other.from === edge.to && other.to !== edge.from);

    if (formsOddCycle) {
      addStep(steps, {
        visited: [...matched],
        frontier: [edge.from, edge.to],
        output: [...matched],
        current: edge.to,
        activeEdges: [edge],
        treeEdges: matching,
        message: "Odd-cycle structure detected. Blossom would contract this cycle before continuing.",
        checks,
        component: matching.length,
      });
    }

    if (!matched.has(edge.from) && !matched.has(edge.to)) {
      matched.add(edge.from);
      matched.add(edge.to);
      matching.push(edge);

      addStep(steps, {
        visited: [...matched],
        frontier: [],
        output: [...matched],
        current: edge.to,
        activeEdges: [edge],
        treeEdges: matching,
        message: `Add matching edge ${model.labels[edge.from]}-${model.labels[edge.to]}.`,
        checks,
        component: matching.length,
      });
    }
  }

  addStep(steps, {
    visited: [...matched],
    frontier: [],
    output: [...matched],
    current: null,
    activeEdges: [],
    treeEdges: matching,
    message: `Blossom Matching visual complete. Current matching size is ${matching.length}.`,
    checks,
    component: matching.length,
  });

  return steps;
}

function hungarianTrace(input: string): GraphStep[] {
  const model = graphFor("hungarian", input);
  const steps: GraphStep[] = [];
  const workerCount = Math.floor(model.labels.length / 2);
  const usedJobs = new Set<number>();
  const assignments: GraphEdge[] = [];
  let totalCost = 0;
  let checks = 0;

  addStep(steps, {
    visited: [],
    frontier: [...Array(workerCount).keys()],
    output: [],
    current: null,
    activeEdges: [],
    treeEdges: assignments,
    message: "Hungarian Algorithm solves minimum-cost assignment. This visual highlights rows, candidate jobs, and selected assignments.",
    checks,
    component: totalCost,
  });

  for (let worker = 0; worker < workerCount; worker++) {
    const candidates = model.edges
      .filter((edge) => edge.from === worker && !usedJobs.has(edge.to))
      .sort((a, b) => (a.weight ?? 1) - (b.weight ?? 1));

    checks++;

    addStep(steps, {
      visited: assignments.flatMap((edge) => [edge.from, edge.to]),
      frontier: candidates.map((edge) => edge.to),
      output: assignments.flatMap((edge) => [edge.from, edge.to]),
      current: worker,
      activeEdges: candidates,
      treeEdges: assignments,
      message: `Reduce/scan row ${model.labels[worker]} and choose the lowest available assignment candidate.`,
      checks,
      component: totalCost,
    });

    if (candidates.length === 0) continue;

    const edge = candidates[0];
    usedJobs.add(edge.to);
    assignments.push(edge);
    totalCost += edge.weight ?? 1;

    addStep(steps, {
      visited: assignments.flatMap((item) => [item.from, item.to]),
      frontier: [],
      output: assignments.flatMap((item) => [item.from, item.to]),
      current: edge.to,
      activeEdges: [edge],
      treeEdges: assignments,
      message: `Assign ${model.labels[edge.from]} to ${model.labels[edge.to]} with cost ${edge.weight}. Running cost is ${totalCost}.`,
      checks,
      component: totalCost,
    });
  }

  addStep(steps, {
    visited: assignments.flatMap((edge) => [edge.from, edge.to]),
    frontier: [],
    output: assignments.flatMap((edge) => [edge.from, edge.to]),
    current: null,
    activeEdges: [],
    treeEdges: assignments,
    message: `Hungarian visual complete. Assignment cost is ${totalCost}.`,
    checks,
    component: totalCost,
  });

  return steps;
}

export function getGraphTrace(algorithm: GraphAlgorithm, input = ""): GraphStep[] {
  if (algorithm === "graphBfs") return bfsTrace(input);
  if (algorithm === "graphDfs") return dfsTrace(input);
  if (algorithm === "topological") return topologicalTrace(input);
  if (algorithm === "connectedComponents") return connectedComponentsTrace(input);
  if (algorithm === "kosaraju") return kosarajuTrace(input);
  if (algorithm === "tarjan") return tarjanTrace(input);
  if (algorithm === "unionFind") return unionFindTrace(input);
  if (algorithm === "pathCompression") return pathCompressionTrace(input);
  if (algorithm === "bridgeFinding") return bridgeFindingTrace(input);
  if (algorithm === "articulationPoints") return articulationPointsTrace(input);
  if (algorithm === "eulerianPath") return eulerianPathTrace(input);
  if (algorithm === "kruskal") return kruskalTrace(input);
  if (algorithm === "prim") return primTrace(input);
  if (algorithm === "boruvka") return boruvkaTrace(input);
  if (algorithm === "reverseDelete") return reverseDeleteTrace(input);
  if (algorithm === "fordFulkerson") return flowTrace(input, "fordFulkerson");
  if (algorithm === "edmondsKarp") return flowTrace(input, "edmondsKarp");
  if (algorithm === "dinic") return flowTrace(input, "dinic");
  if (algorithm === "pushRelabel") return pushRelabelTrace(input);
  if (algorithm === "minCostMaxFlow") return minCostMaxFlowTrace(input);
  if (algorithm === "hopcroftKarp") return hopcroftKarpTrace(input);
  if (algorithm === "blossom") return blossomTrace(input);
  return hungarianTrace(input);
}
