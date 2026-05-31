export type DpAlgorithm = "knapsack" | "coinChange" | "lis" | "kadane" | "matrixChain" | "floydWarshall" | "bellmanFordTable" | "dijkstraTable" | "subsetSum" | "rodCutting" | "dpOnTrees";

export type DpStep = {
  values: number[];
  secondary: number[];
  active: number[];
  table: number[][];
  output: number[];
  message: string;
  checks: number;
};

export const dpLabels: Record<DpAlgorithm, string> = {
  knapsack: "0/1 Knapsack",
  coinChange: "Coin Change",
  lis: "Longest Increasing Subsequence",
  kadane: "Kadane",
  matrixChain: "Matrix Chain Multiplication",
  floydWarshall: "Floyd-Warshall",
  bellmanFordTable: "Bellman-Ford Table Mode",
  dijkstraTable: "Dijkstra Table Mode",
  subsetSum: "Subset Sum",
  rodCutting: "Rod Cutting",
  dpOnTrees: "DP on Trees",
};

function addStep(steps: DpStep[], step: DpStep) {
  steps.push({
    values: [...step.values],
    secondary: [...step.secondary],
    active: [...step.active],
    table: step.table.map((row) => [...row]),
    output: [...step.output],
    message: step.message,
    checks: step.checks,
  });
}

function parseDpValues(input: string) {
  const values = input
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item))
    .slice(0, 12);

  return values.length >= 3 ? values : [3, 4, 5, 8, 10, 2, 6, 7];
}

function knapsackTrace(input: string): DpStep[] {
  const values = parseDpValues(input).slice(0, 5);
  const weights = [2, 3, 4, 5, 6].slice(0, values.length);
  const capacity = 10;
  const table = Array.from({ length: values.length + 1 }, () => new Array(capacity + 1).fill(0));
  const steps: DpStep[] = [];
  let checks = 0;

  addStep(steps, {
    values,
    secondary: weights,
    active: [],
    table,
    output: [],
    message: "0/1 Knapsack chooses whether to skip or take each item under a capacity limit.",
    checks,
  });

  for (let item = 1; item <= values.length; item++) {
    for (let cap = 0; cap <= capacity; cap++) {
      checks++;
      const skip = table[item - 1][cap];
      const take = weights[item - 1] <= cap ? values[item - 1] + table[item - 1][cap - weights[item - 1]] : -Infinity;

      table[item][cap] = Math.max(skip, take);

      addStep(steps, {
        values,
        secondary: weights,
        active: [item - 1, cap],
        table,
        output: table[item],
        message:
          weights[item - 1] <= cap
            ? `Item ${item} fits. DP[${item}][${cap}] = max(skip ${skip}, take ${take}) = ${table[item][cap]}.`
            : `Item ${item} is too heavy for capacity ${cap}. Carry ${skip}.`,
        checks,
      });
    }
  }

  addStep(steps, {
    values,
    secondary: weights,
    active: [],
    table,
    output: table[values.length],
    message: `Knapsack complete. Best value at capacity ${capacity} is ${table[values.length][capacity]}.`,
    checks,
  });

  return steps;
}

function coinChangeTrace(input: string): DpStep[] {
  const coins = parseDpValues(input).filter((value) => value > 0).slice(0, 5);
  const amount = 18;
  const dp = new Array(amount + 1).fill(Infinity);
  const table: number[][] = [];
  const steps: DpStep[] = [];
  let checks = 0;

  dp[0] = 0;

  addStep(steps, {
    values: coins,
    secondary: [amount],
    active: [],
    table: [dp.map((value) => (value === Infinity ? -1 : value))],
    output: [],
    message: "Coin Change computes the minimum coins needed for each amount.",
    checks,
  });

  for (const coin of coins) {
    for (let total = coin; total <= amount; total++) {
      checks++;
      const candidate = dp[total - coin] + 1;

      if (candidate < dp[total]) dp[total] = candidate;

      table.push(dp.map((value) => (value === Infinity ? -1 : value)));

      addStep(steps, {
        values: coins,
        secondary: [amount],
        active: [coin, total],
        table: [dp.map((value) => (value === Infinity ? -1 : value))],
        output: dp.map((value) => (value === Infinity ? 0 : value)),
        message: `Using coin ${coin}, update amount ${total}. Minimum coins is ${dp[total] === Infinity ? "unreachable" : dp[total]}.`,
        checks,
      });
    }
  }

  addStep(steps, {
    values: coins,
    secondary: [amount],
    active: [],
    table: [dp.map((value) => (value === Infinity ? -1 : value))],
    output: dp.map((value) => (value === Infinity ? 0 : value)),
    message: `Coin Change complete. Amount ${amount} needs ${dp[amount] === Infinity ? "no valid combination" : `${dp[amount]} coins`}.`,
    checks,
  });

  return steps;
}

function lisTrace(input: string): DpStep[] {
  const values = parseDpValues(input);
  const dp = new Array(values.length).fill(1);
  const steps: DpStep[] = [];
  let checks = 0;

  addStep(steps, {
    values,
    secondary: dp,
    active: [],
    table: [dp],
    output: dp,
    message: "LIS computes the longest increasing subsequence ending at each index.",
    checks,
  });

  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < i; j++) {
      checks++;

      if (values[j] < values[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }

      addStep(steps, {
        values,
        secondary: dp,
        active: [j, i],
        table: [dp],
        output: dp,
        message:
          values[j] < values[i]
            ? `${values[j]} < ${values[i]}, so LIS at index ${i} can extend from index ${j}.`
            : `${values[j]} is not smaller than ${values[i]}, so it cannot extend this subsequence.`,
        checks,
      });
    }
  }

  addStep(steps, {
    values,
    secondary: dp,
    active: [],
    table: [dp],
    output: dp,
    message: `LIS complete. Length is ${Math.max(...dp)}.`,
    checks,
  });

  return steps;
}

function kadaneTrace(input: string): DpStep[] {
  const values = parseDpValues(input);
  const steps: DpStep[] = [];
  const bestAt: number[] = [];
  let current = values[0];
  let best = values[0];
  let checks = 0;

  bestAt.push(current);

  addStep(steps, {
    values,
    secondary: bestAt,
    active: [0],
    table: [bestAt],
    output: [best],
    message: `Kadane starts with first value ${values[0]}.`,
    checks,
  });

  for (let i = 1; i < values.length; i++) {
    checks++;
    current = Math.max(values[i], current + values[i]);
    best = Math.max(best, current);
    bestAt.push(current);

    addStep(steps, {
      values,
      secondary: bestAt,
      active: [i],
      table: [bestAt],
      output: [best],
      message: `At index ${i}, choose max(start new ${values[i]}, extend ${current}). Best so far is ${best}.`,
      checks,
    });
  }

  addStep(steps, {
    values,
    secondary: bestAt,
    active: [],
    table: [bestAt],
    output: [best],
    message: `Kadane complete. Maximum subarray sum is ${best}.`,
    checks,
  });

  return steps;
}


function matrixChainTrace(input: string): DpStep[] {
  const dims = parseDpValues(input).filter((value) => value > 0).slice(0, 6);
  const values = dims.length >= 4 ? dims : [10, 30, 5, 60, 15];
  const n = values.length - 1;
  const table = Array.from({ length: n }, () => new Array(n).fill(0));
  const steps: DpStep[] = [];
  let checks = 0;

  addStep(steps, {
    values,
    secondary: [],
    active: [],
    table,
    output: [],
    message: "Matrix Chain Multiplication chooses the cheapest parenthesization, not the actual multiplication result.",
    checks,
  });

  for (let length = 2; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
      const j = i + length - 1;
      table[i][j] = Infinity;

      for (let k = i; k < j; k++) {
        checks++;
        const cost = table[i][k] + table[k + 1][j] + values[i] * values[k + 1] * values[j + 1];

        if (cost < table[i][j]) table[i][j] = cost;

        addStep(steps, {
          values,
          secondary: [i, k, j],
          active: [i, j, k],
          table: table.map((row) => row.map((value) => value === Infinity ? -1 : value)),
          output: [table[i][j]],
          message: `Split chain [${i}..${j}] at ${k}. Cost = ${cost}. Best so far = ${table[i][j]}.`,
          checks,
        });
      }
    }
  }

  addStep(steps, {
    values,
    secondary: [],
    active: [],
    table,
    output: [table[0][n - 1]],
    message: `Matrix Chain complete. Minimum multiplication cost is ${table[0][n - 1]}.`,
    checks,
  });

  return steps;
}

function floydWarshallTrace(input: string): DpStep[] {
  const labels = parseDpValues(input).slice(0, 5);
  const n = Math.max(4, Math.min(5, labels.length || 4));
  const values = Array.from({ length: n }, (_, index) => index);
  const inf = 999;
  const table = Array.from({ length: n }, () => new Array(n).fill(inf));
  const edges = [
    [0, 1, 3],
    [0, 2, 8],
    [1, 2, 2],
    [1, 3, 5],
    [2, 3, 1],
    [3, 0, 4],
  ];
  const steps: DpStep[] = [];
  let checks = 0;

  for (let i = 0; i < n; i++) table[i][i] = 0;
  for (const [from, to, weight] of edges) {
    if (from < n && to < n) table[from][to] = weight;
  }

  addStep(steps, {
    values,
    secondary: [],
    active: [],
    table,
    output: [],
    message: "Floyd-Warshall starts with direct edge distances, then tries every node as an intermediate.",
    checks,
  });

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        checks++;
        const throughK = table[i][k] + table[k][j];

        if (throughK < table[i][j]) table[i][j] = throughK;

        addStep(steps, {
          values,
          secondary: [k],
          active: [i, j, k],
          table,
          output: table[i],
          message: `Try path ${i} to ${j} through ${k}. Current best distance is ${table[i][j] >= inf ? "∞" : table[i][j]}.`,
          checks,
        });
      }
    }
  }

  addStep(steps, {
    values,
    secondary: [],
    active: [],
    table,
    output: table.flat().filter((value) => value < inf),
    message: "Floyd-Warshall complete. Table now stores all-pairs shortest paths.",
    checks,
  });

  return steps;
}

function bellmanFordTableTrace(input: string): DpStep[] {
  const parsed = parseDpValues(input);
  const n = Math.max(5, Math.min(7, parsed.length || 6));
  const values = Array.from({ length: n }, (_, index) => index);
  const inf = 999;
  const edges = [
    [0, 1, 6],
    [0, 2, 5],
    [0, 3, 5],
    [1, 4, -1],
    [2, 1, -2],
    [2, 4, 1],
    [3, 2, -2],
    [3, 5, -1],
    [4, 6, 3],
    [5, 6, 3],
  ].filter(([from, to]) => from < n && to < n);

  const dist = new Array(n).fill(inf);
  dist[0] = 0;
  const table: number[][] = [[...dist]];
  const steps: DpStep[] = [];
  let checks = 0;

  addStep(steps, {
    values,
    secondary: [],
    active: [0],
    table,
    output: dist,
    message: "Bellman-Ford table mode relaxes every edge for V - 1 rounds.",
    checks,
  });

  for (let round = 1; round < n; round++) {
    let changed = false;

    for (const [from, to, weight] of edges) {
      checks++;

      if (dist[from] !== inf && dist[from] + weight < dist[to]) {
        dist[to] = dist[from] + weight;
        changed = true;
      }

      addStep(steps, {
        values,
        secondary: [round],
        active: [from, to],
        table: [...table, [...dist]],
        output: dist,
        message: `Round ${round}: relax edge ${from} to ${to} with weight ${weight}. Distance to ${to} is ${dist[to] >= inf ? "∞" : dist[to]}.`,
        checks,
      });
    }

    table.push([...dist]);
    if (!changed) break;
  }

  addStep(steps, {
    values,
    secondary: [],
    active: [],
    table,
    output: dist,
    message: "Bellman-Ford table complete. Distances are finalized if no negative cycle is reachable.",
    checks,
  });

  return steps;
}

function dijkstraTableTrace(input: string): DpStep[] {
  const parsed = parseDpValues(input);
  const n = Math.max(5, Math.min(7, parsed.length || 6));
  const values = Array.from({ length: n }, (_, index) => index);
  const inf = 999;
  const edges = [
    [0, 1, 4],
    [0, 2, 2],
    [1, 2, 1],
    [1, 3, 5],
    [2, 3, 8],
    [2, 4, 10],
    [3, 4, 2],
    [3, 5, 6],
    [4, 5, 3],
    [5, 6, 1],
  ].filter(([from, to]) => from < n && to < n);

  const dist = new Array(n).fill(inf);
  const visited = new Set<number>();
  const table: number[][] = [];
  const steps: DpStep[] = [];
  let checks = 0;

  dist[0] = 0;

  addStep(steps, {
    values,
    secondary: [],
    active: [0],
    table: [[...dist]],
    output: dist,
    message: "Dijkstra table mode repeatedly selects the unvisited node with the smallest known distance.",
    checks,
  });

  while (visited.size < n) {
    let current = -1;

    for (let node = 0; node < n; node++) {
      if (!visited.has(node) && (current === -1 || dist[node] < dist[current])) {
        current = node;
      }
    }

    if (current === -1 || dist[current] === inf) break;

    visited.add(current);

    addStep(steps, {
      values,
      secondary: [...visited],
      active: [current],
      table: [...table, [...dist]],
      output: dist,
      message: `Pick node ${current} with smallest distance ${dist[current]}.`,
      checks,
    });

    for (const [from, to, weight] of edges) {
      if (from !== current) continue;

      checks++;
      if (dist[from] + weight < dist[to]) dist[to] = dist[from] + weight;

      addStep(steps, {
        values,
        secondary: [...visited],
        active: [from, to],
        table: [...table, [...dist]],
        output: dist,
        message: `Relax edge ${from} to ${to} with weight ${weight}. Distance to ${to} is ${dist[to]}.`,
        checks,
      });
    }

    table.push([...dist]);
  }

  addStep(steps, {
    values,
    secondary: [...visited],
    active: [],
    table,
    output: dist,
    message: "Dijkstra table complete. Distances are finalized for reachable nodes.",
    checks,
  });

  return steps;
}


function subsetSumTrace(input: string): DpStep[] {
  const values = parseDpValues(input).slice(0, 7).map((value) => Math.max(1, Math.abs(value)));
  const target = Math.min(30, Math.max(8, values.reduce((sum, value) => sum + value, 0) - values[0]));
  const table = Array.from({ length: values.length + 1 }, () => Array(target + 1).fill(false));
  const steps: DpStep[] = [];
  let checks = 0;

  table[0][0] = true;

  addStep(steps, {
    values,
    table: table.map((row) => row.map((cell) => cell ? 1 : 0)),
    active: [0],
    secondary: [0],
    message: `Subset Sum asks whether any subset can reach target ${target}.`,
    checks,
    output: [],
  });

  for (let i = 1; i <= values.length; i++) {
    table[i][0] = true;

    for (let sum = 1; sum <= target; sum++) {
      const without = table[i - 1][sum];
      const withItem = sum >= values[i - 1] ? table[i - 1][sum - values[i - 1]] : false;
      table[i][sum] = without || withItem;

      addStep(steps, {
        values,
        table: table.map((row) => row.map((cell) => cell ? 1 : 0)),
        active: [i],
        secondary: [sum],
        message: `Using value ${values[i - 1]}, target ${sum}: ${table[i][sum] ? "reachable" : "not reachable"}.`,
        checks,
        output: table[i][sum] ? [sum] : [],
      });
    }
  }

  addStep(steps, {
    values,
    table: table.map((row) => row.map((cell) => cell ? 1 : 0)),
    active: [values.length],
    secondary: [target],
    message: table[values.length][target]
      ? `Subset Sum complete. Target ${target} is reachable.`
      : `Subset Sum complete. Target ${target} is not reachable.`,
    checks,
    output: [table[values.length][target] ? 1 : 0],
  });

  return steps;
}

function rodCuttingTrace(input: string): DpStep[] {
  const prices = parseDpValues(input).slice(0, 8).map((value) => Math.max(1, Math.abs(value)));
  const n = prices.length;
  const dp = Array(n + 1).fill(0);
  const table = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
  const steps: DpStep[] = [];
  let checks = 0;

  addStep(steps, {
    values: prices,
    table,
    active: [0],
    secondary: [0],
    message: "Rod Cutting chooses the best first cut length for every rod size.",
    checks,
    output: [],
  });

  for (let length = 1; length <= n; length++) {
    for (let cut = 1; cut <= length; cut++) {
      const candidate = prices[cut - 1] + dp[length - cut];

      if (candidate > dp[length]) dp[length] = candidate;

      table[length][cut] = candidate;

      addStep(steps, {
        values: prices,
        table,
        active: [length],
        secondary: [cut],
        message: `Rod length ${length}, first cut ${cut}: revenue ${candidate}, best ${dp[length]}.`,
        checks,
        output: [dp[length]],
      });
    }
  }

  addStep(steps, {
    values: prices,
    table,
    active: [n],
    secondary: [n],
    message: `Rod Cutting complete. Best revenue for length ${n} is ${dp[n]}.`,
    checks,
    output: [dp[n]],
  });

  return steps;
}

function dpOnTreesTrace(input: string): DpStep[] {
  const values = parseDpValues(input).slice(0, 9).map((value) => Math.max(1, Math.abs(value)));
  const n = values.length;
  const include = Array(n).fill(0);
  const exclude = Array(n).fill(0);
  const table = Array.from({ length: n }, () => Array(3).fill(0));
  const steps: DpStep[] = [];
  let checks = 0;

  addStep(steps, {
    values,
    table,
    active: [0],
    secondary: [0],
    message: "DP on Trees computes include/exclude values bottom-up. Example: maximum independent set on a binary tree.",
    checks,
    output: [],
  });

  for (let i = n - 1; i >= 0; i--) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    include[i] = values[i];
    exclude[i] = 0;

    for (const child of [left, right]) {
      if (child < n) {
        include[i] += exclude[child];
        exclude[i] += Math.max(include[child], exclude[child]);
      }
    }

    table[i] = [values[i], include[i], exclude[i]];

    addStep(steps, {
      values,
      table,
      active: [i],
      secondary: [1],
      message: `Node ${i}: include=${include[i]}, exclude=${exclude[i]}.`,
      checks,
      output: [i],
    });
  }

  const best = Math.max(include[0], exclude[0]);

  addStep(steps, {
    values,
    table,
    active: [0],
    secondary: [include[0] >= exclude[0] ? 1 : 2],
    message: `DP on Trees complete. Best value is ${best}.`,
    checks,
    output: [best],
  });

  return steps;
}

export function getDpTrace(algorithm: DpAlgorithm, input: string): DpStep[] {
  if (algorithm === "knapsack") return knapsackTrace(input);
  if (algorithm === "coinChange") return coinChangeTrace(input);
  if (algorithm === "lis") return lisTrace(input);
  if (algorithm === "kadane") return kadaneTrace(input);
  if (algorithm === "matrixChain") return matrixChainTrace(input);
  if (algorithm === "floydWarshall") return floydWarshallTrace(input);
  if (algorithm === "bellmanFordTable") return bellmanFordTableTrace(input);
  if (algorithm === "dijkstraTable") return dijkstraTableTrace(input);
  if (algorithm === "subsetSum") return subsetSumTrace(input);
  if (algorithm === "rodCutting") return rodCuttingTrace(input);
  return dpOnTreesTrace(input);
}
