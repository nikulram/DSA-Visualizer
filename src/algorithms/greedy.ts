export type GreedyAlgorithm = "activitySelection" | "jobSequencing" | "huffmanCoding" | "fractionalKnapsack" | "primTable" | "kruskalTable" | "intervalScheduling" | "gasStation";

export type GreedyStep = {
  values: number[];
  secondary: number[];
  active: number[];
  selected: number[];
  treeValues: string[];
  treeEdges: Array<[number, number]>;
  message: string;
  checks: number;
};

export const greedyLabels: Record<GreedyAlgorithm, string> = {
  activitySelection: "Activity Selection",
  jobSequencing: "Job Sequencing",
  huffmanCoding: "Huffman Coding",
  fractionalKnapsack: "Fractional Knapsack",
  primTable: "Prim MST Table",
  kruskalTable: "Kruskal DSU Table",
  intervalScheduling: "Interval Scheduling",
  gasStation: "Gas Station",
};

function addStep(steps: GreedyStep[], step: GreedyStep) {
  steps.push({
    values: [...step.values],
    secondary: [...step.secondary],
    active: [...step.active],
    selected: [...step.selected],
    treeValues: [...step.treeValues],
    treeEdges: step.treeEdges.map((edge) => [edge[0], edge[1]]),
    message: step.message,
    checks: step.checks,
  });
}

function parseGreedyValues(input: string) {
  const values = input
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item))
    .slice(0, 12);

  return values.length >= 4 ? values : [1, 3, 0, 5, 8, 5, 2, 4, 6, 7, 9, 9];
}

function activitySelectionTrace(input: string): GreedyStep[] {
  const raw = parseGreedyValues(input);
  const activities = Array.from({ length: Math.floor(raw.length / 2) }, (_, index) => ({
    start: raw[index * 2],
    finish: Math.max(raw[index * 2], raw[index * 2 + 1]),
    index,
  })).sort((a, b) => a.finish - b.finish);

  const steps: GreedyStep[] = [];
  const selected: number[] = [];
  let lastFinish = -Infinity;
  let checks = 0;

  addStep(steps, {
    values: activities.map((item) => item.start),
    secondary: activities.map((item) => item.finish),
    active: [],
    selected,
    treeValues: [],
    treeEdges: [],
    message: "Activity Selection sorts activities by earliest finish time.",
    checks,
  });

  for (const activity of activities) {
    checks++;

    addStep(steps, {
      values: activities.map((item) => item.start),
      secondary: activities.map((item) => item.finish),
      active: [activity.index],
      selected,
      treeValues: [],
      treeEdges: [],
      message: `Check activity ${activity.index}: start ${activity.start}, finish ${activity.finish}.`,
      checks,
    });

    if (activity.start >= lastFinish) {
      selected.push(activity.index);
      lastFinish = activity.finish;

      addStep(steps, {
        values: activities.map((item) => item.start),
        secondary: activities.map((item) => item.finish),
        active: [activity.index],
        selected,
        treeValues: [],
        treeEdges: [],
        message: `Select activity ${activity.index} because it starts after the last selected finish time.`,
        checks,
      });
    } else {
      addStep(steps, {
        values: activities.map((item) => item.start),
        secondary: activities.map((item) => item.finish),
        active: [activity.index],
        selected,
        treeValues: [],
        treeEdges: [],
        message: `Skip activity ${activity.index} because it overlaps the current schedule.`,
        checks,
      });
    }
  }

  addStep(steps, {
    values: activities.map((item) => item.start),
    secondary: activities.map((item) => item.finish),
    active: [],
    selected,
    treeValues: [],
    treeEdges: [],
    message: `Activity Selection complete. Selected ${selected.length} compatible activities.`,
    checks,
  });

  return steps;
}

function jobSequencingTrace(input: string): GreedyStep[] {
  const values = parseGreedyValues(input).slice(0, 8);
  const deadlines = [2, 1, 2, 1, 3, 2, 3, 4].slice(0, values.length);
  const jobs = values.map((profit, index) => ({ profit, deadline: deadlines[index], index })).sort((a, b) => b.profit - a.profit);
  const maxDeadline = Math.max(...deadlines);
  const slots = new Array(maxDeadline).fill(-1);
  const selected: number[] = [];
  let checks = 0;

  const steps: GreedyStep[] = [];

  addStep(steps, {
    values: jobs.map((job) => job.profit),
    secondary: jobs.map((job) => job.deadline),
    active: [],
    selected,
    treeValues: slots.map((slot) => (slot === -1 ? "_" : `J${slot}`)),
    treeEdges: [],
    message: "Job Sequencing sorts jobs by profit and places each job in the latest available slot before its deadline.",
    checks,
  });

  for (const job of jobs) {
    for (let slot = Math.min(maxDeadline, job.deadline) - 1; slot >= 0; slot--) {
      checks++;

      addStep(steps, {
        values: jobs.map((item) => item.profit),
        secondary: jobs.map((item) => item.deadline),
        active: [job.index, slot],
        selected,
        treeValues: slots.map((item) => (item === -1 ? "_" : `J${item}`)),
        treeEdges: [],
        message: `Try job ${job.index} with profit ${job.profit} in slot ${slot + 1}.`,
        checks,
      });

      if (slots[slot] === -1) {
        slots[slot] = job.index;
        selected.push(job.index);

        addStep(steps, {
          values: jobs.map((item) => item.profit),
          secondary: jobs.map((item) => item.deadline),
          active: [job.index, slot],
          selected,
          treeValues: slots.map((item) => (item === -1 ? "_" : `J${item}`)),
          treeEdges: [],
          message: `Place job ${job.index} in slot ${slot + 1}.`,
          checks,
        });

        break;
      }
    }
  }

  addStep(steps, {
    values: jobs.map((job) => job.profit),
    secondary: jobs.map((job) => job.deadline),
    active: [],
    selected,
    treeValues: slots.map((slot) => (slot === -1 ? "_" : `J${slot}`)),
    treeEdges: [],
    message: `Job Sequencing complete. Total profit is ${selected.reduce((sum, index) => sum + values[index], 0)}.`,
    checks,
  });

  return steps;
}

function huffmanCodingTrace(input: string): GreedyStep[] {
  const frequencies = parseGreedyValues(input).filter((value) => value > 0).slice(0, 8);
  const queue = frequencies.map((freq, index) => ({ label: String.fromCharCode(65 + index), freq, node: index }));
  const treeValues = queue.map((item) => `${item.label}:${item.freq}`);
  const treeEdges: Array<[number, number]> = [];
  const selected: number[] = [];
  const steps: GreedyStep[] = [];
  let checks = 0;

  addStep(steps, {
    values: frequencies,
    secondary: [],
    active: [],
    selected,
    treeValues,
    treeEdges,
    message: "Huffman Coding repeatedly merges the two lowest-frequency nodes.",
    checks,
  });

  while (queue.length > 1) {
    queue.sort((a, b) => a.freq - b.freq);
    const left = queue.shift()!;
    const right = queue.shift()!;
    const mergedIndex = treeValues.length;
    const merged = {
      label: `${left.label}${right.label}`,
      freq: left.freq + right.freq,
      node: mergedIndex,
    };

    treeValues.push(`${merged.label}:${merged.freq}`);
    treeEdges.push([mergedIndex, left.node], [mergedIndex, right.node]);
    selected.push(left.node, right.node);
    checks++;

    addStep(steps, {
      values: frequencies,
      secondary: queue.map((item) => item.freq),
      active: [left.node, right.node, mergedIndex],
      selected,
      treeValues,
      treeEdges,
      message: `Merge ${left.label}:${left.freq} and ${right.label}:${right.freq} into ${merged.label}:${merged.freq}.`,
      checks,
    });

    queue.push(merged);
  }

  addStep(steps, {
    values: frequencies,
    secondary: [],
    active: queue.length ? [queue[0].node] : [],
    selected,
    treeValues,
    treeEdges,
    message: "Huffman Coding complete. Lower frequencies become deeper leaves, higher frequencies get shorter codes.",
    checks,
  });

  return steps;
}

function fractionalKnapsackTrace(input: string): GreedyStep[] {
  const values = parseGreedyValues(input).filter((value) => value > 0).slice(0, 6);
  const weights = [2, 3, 4, 5, 6, 7].slice(0, values.length);
  const capacity = 12;
  const items = values
    .map((value, index) => ({ value, weight: weights[index], ratio: value / weights[index], index }))
    .sort((a, b) => b.ratio - a.ratio);

  const selected: number[] = [];
  const steps: GreedyStep[] = [];
  let remaining = capacity;
  let total = 0;
  let checks = 0;

  addStep(steps, {
    values: items.map((item) => item.value),
    secondary: items.map((item) => item.weight),
    active: [],
    selected,
    treeValues: [],
    treeEdges: [],
    message: "Fractional Knapsack sorts items by value per weight ratio.",
    checks,
  });

  for (const item of items) {
    if (remaining <= 0) break;

    checks++;
    const takeWeight = Math.min(remaining, item.weight);
    const fraction = takeWeight / item.weight;
    total += item.value * fraction;
    remaining -= takeWeight;
    selected.push(item.index);

    addStep(steps, {
      values: items.map((entry) => entry.value),
      secondary: items.map((entry) => entry.weight),
      active: [item.index],
      selected,
      treeValues: [],
      treeEdges: [],
      message:
        fraction === 1
          ? `Take all of item ${item.index}. Value ${item.value}, weight ${item.weight}.`
          : `Take ${(fraction * 100).toFixed(0)}% of item ${item.index}. Added value ${(item.value * fraction).toFixed(2)}.`,
      checks,
    });
  }

  addStep(steps, {
    values: items.map((item) => item.value),
    secondary: items.map((item) => item.weight),
    active: [],
    selected,
    treeValues: [],
    treeEdges: [],
    message: `Fractional Knapsack complete. Total value is ${total.toFixed(2)}.`,
    checks,
  });

  return steps;
}


function primTableTrace(input: string): GreedyStep[] {
  const values = parseGreedyValues(input).slice(0, 7);
  const n = Math.max(5, Math.min(7, values.length));
  const edges = [
    [0, 1, 4],
    [0, 2, 3],
    [1, 2, 1],
    [1, 3, 2],
    [2, 3, 4],
    [2, 4, 5],
    [3, 4, 2],
    [3, 5, 7],
    [4, 5, 6],
    [4, 6, 3],
    [5, 6, 1],
  ].filter(([a, b]) => a < n && b < n);

  const inTree = new Set<number>([0]);
  const selected: number[] = [0];
  const treeValues = Array.from({ length: n }, (_, index) => `V${index}: ${index === 0 ? 0 : "∞"}`);
  const treeEdges: Array<[number, number]> = [];
  const steps: GreedyStep[] = [];
  let checks = 0;

  addStep(steps, {
    values: Array.from({ length: n }, (_, index) => index),
    secondary: [],
    active: [0],
    selected,
    treeValues,
    treeEdges,
    message: "Prim table mode starts from one node and keeps adding the cheapest crossing edge.",
    checks,
  });

  while (inTree.size < n) {
    const candidates = edges
      .filter(([a, b]) => inTree.has(a) !== inTree.has(b))
      .sort((a, b) => a[2] - b[2]);

    if (candidates.length === 0) break;

    const [from, to, weight] = candidates[0];
    const next = inTree.has(from) ? to : from;
    checks++;

    addStep(steps, {
      values: Array.from({ length: n }, (_, index) => index),
      secondary: candidates.map((edge) => edge[2]),
      active: [from, to],
      selected,
      treeValues,
      treeEdges,
      message: `Choose cheapest crossing edge V${from}-V${to} with weight ${weight}.`,
      checks,
    });

    inTree.add(next);
    selected.push(next);
    treeEdges.push([from, to]);
    treeValues[next] = `V${next}: ${weight}`;

    addStep(steps, {
      values: Array.from({ length: n }, (_, index) => index),
      secondary: candidates.map((edge) => edge[2]),
      active: [next],
      selected,
      treeValues,
      treeEdges,
      message: `Add V${next} to the MST table.`,
      checks,
    });
  }

  addStep(steps, {
    values: Array.from({ length: n }, (_, index) => index),
    secondary: [],
    active: [],
    selected,
    treeValues,
    treeEdges,
    message: "Prim table mode complete. Selected rows form the MST.",
    checks,
  });

  return steps;
}

function kruskalTableTrace(input: string): GreedyStep[] {
  const values = parseGreedyValues(input).slice(0, 7);
  const n = Math.max(5, Math.min(7, values.length));
  const parent = Array.from({ length: n }, (_, index) => index);
  const rank = new Array(n).fill(0);
  const edges = [
    [0, 1, 4],
    [0, 2, 3],
    [1, 2, 1],
    [1, 3, 2],
    [2, 3, 4],
    [2, 4, 5],
    [3, 4, 2],
    [4, 5, 6],
    [5, 6, 1],
  ].filter(([a, b]) => a < n && b < n).sort((a, b) => a[2] - b[2]);

  const selected: number[] = [];
  const treeEdges: Array<[number, number]> = [];
  const steps: GreedyStep[] = [];
  let checks = 0;

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function merge(a: number, b: number) {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA === rootB) return false;

    if (rank[rootA] < rank[rootB]) parent[rootA] = rootB;
    else if (rank[rootA] > rank[rootB]) parent[rootB] = rootA;
    else {
      parent[rootB] = rootA;
      rank[rootA]++;
    }

    return true;
  }

  addStep(steps, {
    values: edges.map((edge) => edge[2]),
    secondary: parent,
    active: [],
    selected,
    treeValues: parent.map((root, index) => `V${index} -> V${root}`),
    treeEdges,
    message: "Kruskal DSU table sorts edges and tracks components with parent rows.",
    checks,
  });

  for (const [from, to, weight] of edges) {
    checks++;

    addStep(steps, {
      values: edges.map((edge) => edge[2]),
      secondary: parent,
      active: [from, to],
      selected,
      treeValues: parent.map((root, index) => `V${index} -> V${root}`),
      treeEdges,
      message: `Check edge V${from}-V${to} with weight ${weight}.`,
      checks,
    });

    if (merge(from, to)) {
      selected.push(weight);
      treeEdges.push([from, to]);

      addStep(steps, {
        values: edges.map((edge) => edge[2]),
        secondary: parent,
        active: [from, to],
        selected,
        treeValues: parent.map((root, index) => `V${index} -> V${root}`),
        treeEdges,
        message: `Accept edge V${from}-V${to}. DSU parents updated.`,
        checks,
      });
    } else {
      addStep(steps, {
        values: edges.map((edge) => edge[2]),
        secondary: parent,
        active: [from, to],
        selected,
        treeValues: parent.map((root, index) => `V${index} -> V${root}`),
        treeEdges,
        message: `Reject edge V${from}-V${to}. Same root means it creates a cycle.`,
        checks,
      });
    }
  }

  addStep(steps, {
    values: edges.map((edge) => edge[2]),
    secondary: parent,
    active: [],
    selected,
    treeValues: parent.map((root, index) => `V${index} -> V${root}`),
    treeEdges,
    message: "Kruskal DSU table complete.",
    checks,
  });

  return steps;
}

function intervalSchedulingTrace(input: string): GreedyStep[] {
  const raw = parseGreedyValues(input);
  const intervals = Array.from({ length: Math.floor(raw.length / 2) }, (_, index) => ({
    start: raw[index * 2],
    end: Math.max(raw[index * 2], raw[index * 2 + 1]),
    index,
  })).sort((a, b) => a.end - b.end);

  const selected: number[] = [];
  let lastEnd = -Infinity;
  let checks = 0;
  const steps: GreedyStep[] = [];

  addStep(steps, {
    values: intervals.map((item) => item.start),
    secondary: intervals.map((item) => item.end),
    active: [],
    selected,
    treeValues: intervals.map((item) => `I${item.index}: ${item.start}-${item.end}`),
    treeEdges: [],
    message: "Interval Scheduling sorts intervals by earliest finish time.",
    checks,
  });

  for (const interval of intervals) {
    checks++;

    if (interval.start >= lastEnd) {
      selected.push(interval.index);
      lastEnd = interval.end;

      addStep(steps, {
        values: intervals.map((item) => item.start),
        secondary: intervals.map((item) => item.end),
        active: [interval.index],
        selected,
        treeValues: intervals.map((item) => `I${item.index}: ${item.start}-${item.end}`),
        treeEdges: [],
        message: `Select interval ${interval.index}. It starts after the last selected end.`,
        checks,
      });
    } else {
      addStep(steps, {
        values: intervals.map((item) => item.start),
        secondary: intervals.map((item) => item.end),
        active: [interval.index],
        selected,
        treeValues: intervals.map((item) => `I${item.index}: ${item.start}-${item.end}`),
        treeEdges: [],
        message: `Skip interval ${interval.index}. It overlaps the selected schedule.`,
        checks,
      });
    }
  }

  addStep(steps, {
    values: intervals.map((item) => item.start),
    secondary: intervals.map((item) => item.end),
    active: [],
    selected,
    treeValues: intervals.map((item) => `I${item.index}: ${item.start}-${item.end}`),
    treeEdges: [],
    message: `Interval Scheduling complete. Selected ${selected.length} intervals.`,
    checks,
  });

  return steps;
}

function gasStationTrace(input: string): GreedyStep[] {
  const values = parseGreedyValues(input).slice(0, 8);
  const gas = values.map((value) => Math.max(1, value));
  const cost = [2, 3, 4, 5, 1, 2, 6, 3].slice(0, gas.length);
  let total = 0;
  let tank = 0;
  let start = 0;
  let checks = 0;
  const selected: number[] = [];
  const steps: GreedyStep[] = [];

  addStep(steps, {
    values: gas,
    secondary: cost,
    active: [],
    selected,
    treeValues: gas.map((g, index) => `S${index}: gas ${g}, cost ${cost[index]}`),
    treeEdges: [],
    message: "Gas Station tracks total fuel balance and resets the start when the running tank becomes negative.",
    checks,
  });

  for (let i = 0; i < gas.length; i++) {
    checks++;
    const diff = gas[i] - cost[i];
    total += diff;
    tank += diff;

    addStep(steps, {
      values: gas,
      secondary: cost,
      active: [i],
      selected: [start],
      treeValues: gas.map((g, index) => `S${index}: gas ${g}, cost ${cost[index]}`),
      treeEdges: [],
      message: `Station ${i}: gain ${gas[i]}, cost ${cost[i]}, tank change ${diff}. Current tank ${tank}.`,
      checks,
    });

    if (tank < 0) {
      start = i + 1;
      tank = 0;

      addStep(steps, {
        values: gas,
        secondary: cost,
        active: [i],
        selected: [start],
        treeValues: gas.map((g, index) => `S${index}: gas ${g}, cost ${cost[index]}`),
        treeEdges: [],
        message: `Tank went negative. No station before or at ${i} can be the start, so reset start to ${start}.`,
        checks,
      });
    }
  }

  if (total >= 0 && start < gas.length) selected.push(start);

  addStep(steps, {
    values: gas,
    secondary: cost,
    active: [],
    selected,
    treeValues: gas.map((g, index) => `S${index}: gas ${g}, cost ${cost[index]}`),
    treeEdges: [],
    message: total >= 0 ? `Gas Station complete. Valid start is station ${start}.` : "Gas Station complete. No valid start exists.",
    checks,
  });

  return steps;
}

export function getGreedyTrace(algorithm: GreedyAlgorithm, input: string): GreedyStep[] {
  if (algorithm === "activitySelection") return activitySelectionTrace(input);
  if (algorithm === "jobSequencing") return jobSequencingTrace(input);
  if (algorithm === "huffmanCoding") return huffmanCodingTrace(input);
  if (algorithm === "fractionalKnapsack") return fractionalKnapsackTrace(input);
  if (algorithm === "primTable") return primTableTrace(input);
  if (algorithm === "kruskalTable") return kruskalTableTrace(input);
  if (algorithm === "intervalScheduling") return intervalSchedulingTrace(input);
  return gasStationTrace(input);
}
