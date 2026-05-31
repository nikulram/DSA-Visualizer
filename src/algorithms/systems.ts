export type SystemAlgorithm = "lruCache" | "lfuCache" | "roundRobin" | "shortestJobFirst" | "bankersAlgorithm" | "twoPhaseLocking" | "hashJoin" | "mergeJoin" | "nestedLoopJoin" | "queryOptimization" | "bTreeIndexSystem" | "priorityScheduling";

export type SystemStep = {
  values: number[];
  queue: string[];
  table: string[][];
  active: number | null;
  selected: number[];
  message: string;
  checks: number;
};

export const systemLabels: Record<SystemAlgorithm, string> = {
  lruCache: "LRU Cache",
  lfuCache: "LFU Cache",
  roundRobin: "Round Robin Scheduling",
  shortestJobFirst: "Shortest Job First",
  bankersAlgorithm: "Banker's Algorithm",
  twoPhaseLocking: "Two-Phase Locking",
  hashJoin: "Hash Join",
  mergeJoin: "Merge Join",
  nestedLoopJoin: "Nested Loop Join",
  queryOptimization: "Query Optimization",
  bTreeIndexSystem: "B-Tree Index Search",
  priorityScheduling: "CPU Priority Scheduling",
};

function parseSystemValues(input: string) {
  const values = input
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item))
    .slice(0, 14);

  return values.length >= 4 ? values : [1, 2, 3, 1, 4, 5, 2, 1, 2, 3, 4, 5];
}

function addStep(steps: SystemStep[], step: SystemStep) {
  steps.push({
    values: [...step.values],
    queue: [...step.queue],
    table: step.table.map((row) => [...row]),
    active: step.active,
    selected: [...step.selected],
    message: step.message,
    checks: step.checks,
  });
}

function lruCacheTrace(input: string): SystemStep[] {
  const requests = parseSystemValues(input);
  const capacity = 4;
  const cache: number[] = [];
  const steps: SystemStep[] = [];
  let checks = 0;

  addStep(steps, {
    values: requests,
    queue: [],
    table: [["MRU", "Cache", "LRU"]],
    active: null,
    selected: [],
    message: "LRU Cache evicts the least recently used key when capacity is full.",
    checks,
  });

  for (const key of requests) {
    checks++;
    const hit = cache.includes(key);

    if (hit) {
      cache.splice(cache.indexOf(key), 1);
      cache.unshift(key);

      addStep(steps, {
        values: requests,
        queue: cache.map(String),
        table: cache.map((value, index) => [index === 0 ? "MRU" : "", String(value), index === cache.length - 1 ? "LRU" : ""]),
        active: key,
        selected: [key],
        message: `Cache hit for ${key}. Move it to the most-recent position.`,
        checks,
      });
    } else {
      let evicted: number | null = null;

      if (cache.length >= capacity) {
        evicted = cache.pop() ?? null;
      }

      cache.unshift(key);

      addStep(steps, {
        values: requests,
        queue: cache.map(String),
        table: cache.map((value, index) => [index === 0 ? "MRU" : "", String(value), index === cache.length - 1 ? "LRU" : ""]),
        active: key,
        selected: evicted === null ? [key] : [key, evicted],
        message: evicted === null
          ? `Cache miss for ${key}. Insert it as most recent.`
          : `Cache miss for ${key}. Evict least-recent key ${evicted}, then insert ${key}.`,
        checks,
      });
    }
  }

  addStep(steps, {
    values: requests,
    queue: cache.map(String),
    table: cache.map((value, index) => [index === 0 ? "MRU" : "", String(value), index === cache.length - 1 ? "LRU" : ""]),
    active: null,
    selected: [],
    message: "LRU Cache simulation complete.",
    checks,
  });

  return steps;
}

function lfuCacheTrace(input: string): SystemStep[] {
  const requests = parseSystemValues(input);
  const capacity = 4;
  const cache = new Map<number, { frequency: number; age: number }>();
  const steps: SystemStep[] = [];
  let clock = 0;
  let checks = 0;

  addStep(steps, {
    values: requests,
    queue: [],
    table: [["Key", "Frequency", "Age"]],
    active: null,
    selected: [],
    message: "LFU Cache evicts the least frequently used key. Ties use older age.",
    checks,
  });

  for (const key of requests) {
    checks++;
    clock++;

    if (cache.has(key)) {
      const item = cache.get(key)!;
      item.frequency++;
      item.age = clock;

      addStep(steps, {
        values: requests,
        queue: [...cache.keys()].map(String),
        table: [...cache.entries()].map(([cacheKey, meta]) => [String(cacheKey), String(meta.frequency), String(meta.age)]),
        active: key,
        selected: [key],
        message: `Cache hit for ${key}. Increase frequency to ${item.frequency}.`,
        checks,
      });
    } else {
      let evicted: number | null = null;

      if (cache.size >= capacity) {
        const victim = [...cache.entries()].sort((a, b) => a[1].frequency - b[1].frequency || a[1].age - b[1].age)[0];
        evicted = victim[0];
        cache.delete(evicted);
      }

      cache.set(key, { frequency: 1, age: clock });

      addStep(steps, {
        values: requests,
        queue: [...cache.keys()].map(String),
        table: [...cache.entries()].map(([cacheKey, meta]) => [String(cacheKey), String(meta.frequency), String(meta.age)]),
        active: key,
        selected: evicted === null ? [key] : [key, evicted],
        message: evicted === null
          ? `Cache miss for ${key}. Insert with frequency 1.`
          : `Cache miss for ${key}. Evict LFU key ${evicted}, then insert ${key}.`,
        checks,
      });
    }
  }

  addStep(steps, {
    values: requests,
    queue: [...cache.keys()].map(String),
    table: [...cache.entries()].map(([cacheKey, meta]) => [String(cacheKey), String(meta.frequency), String(meta.age)]),
    active: null,
    selected: [],
    message: "LFU Cache simulation complete.",
    checks,
  });

  return steps;
}

function roundRobinTrace(input: string): SystemStep[] {
  const bursts = parseSystemValues(input).slice(0, 7).map((value) => Math.max(1, value));
  const quantum = 3;
  const remaining = [...bursts];
  const queue = bursts.map((_, index) => index);
  const completed: number[] = [];
  const steps: SystemStep[] = [];
  let time = 0;
  let checks = 0;

  addStep(steps, {
    values: bursts,
    queue: queue.map((index) => `P${index}`),
    table: bursts.map((burst, index) => [`P${index}`, `burst ${burst}`, `left ${remaining[index]}`]),
    active: null,
    selected: [],
    message: `Round Robin gives each process a time quantum of ${quantum}.`,
    checks,
  });

  while (queue.length > 0) {
    const process = queue.shift()!;
    const slice = Math.min(quantum, remaining[process]);
    remaining[process] -= slice;
    time += slice;
    checks++;

    addStep(steps, {
      values: bursts,
      queue: queue.map((index) => `P${index}`),
      table: bursts.map((burst, index) => [`P${index}`, `burst ${burst}`, `left ${remaining[index]}`]),
      active: process,
      selected: completed,
      message: `Run P${process} for ${slice} time units. Clock is now ${time}.`,
      checks,
    });

    if (remaining[process] > 0) {
      queue.push(process);

      addStep(steps, {
        values: bursts,
        queue: queue.map((index) => `P${index}`),
        table: bursts.map((burst, index) => [`P${index}`, `burst ${burst}`, `left ${remaining[index]}`]),
        active: process,
        selected: completed,
        message: `P${process} still has ${remaining[process]} left, so it returns to the back of the queue.`,
        checks,
      });
    } else {
      completed.push(process);

      addStep(steps, {
        values: bursts,
        queue: queue.map((index) => `P${index}`),
        table: bursts.map((burst, index) => [`P${index}`, `burst ${burst}`, `left ${remaining[index]}`]),
        active: process,
        selected: completed,
        message: `P${process} finished.`,
        checks,
      });
    }
  }

  addStep(steps, {
    values: bursts,
    queue: [],
    table: bursts.map((burst, index) => [`P${index}`, `burst ${burst}`, "done"]),
    active: null,
    selected: completed,
    message: "Round Robin Scheduling complete.",
    checks,
  });

  return steps;
}

function shortestJobFirstTrace(input: string): SystemStep[] {
  const bursts = parseSystemValues(input).slice(0, 8).map((value) => Math.max(1, value));
  const jobs = bursts.map((burst, index) => ({ index, burst })).sort((a, b) => a.burst - b.burst);
  const completed: number[] = [];
  const steps: SystemStep[] = [];
  let time = 0;
  let checks = 0;

  addStep(steps, {
    values: bursts,
    queue: jobs.map((job) => `P${job.index}`),
    table: jobs.map((job) => [`P${job.index}`, `burst ${job.burst}`, "waiting"]),
    active: null,
    selected: [],
    message: "Shortest Job First sorts ready jobs by smallest burst time.",
    checks,
  });

  for (const job of jobs) {
    checks++;
    time += job.burst;
    completed.push(job.index);

    addStep(steps, {
      values: bursts,
      queue: jobs.filter((item) => !completed.includes(item.index)).map((item) => `P${item.index}`),
      table: jobs.map((item) => [
        `P${item.index}`,
        `burst ${item.burst}`,
        completed.includes(item.index) ? "done" : "waiting",
      ]),
      active: job.index,
      selected: completed,
      message: `Run shortest available job P${job.index} for ${job.burst}. Clock is now ${time}.`,
      checks,
    });
  }

  addStep(steps, {
    values: bursts,
    queue: [],
    table: jobs.map((job) => [`P${job.index}`, `burst ${job.burst}`, "done"]),
    active: null,
    selected: completed,
    message: "Shortest Job First complete.",
    checks,
  });

  return steps;
}


function bankersAlgorithmTrace(input: string): SystemStep[] {
  const values = parseSystemValues(input).slice(0, 5).map((value) => Math.max(1, value));
  const available = [3, 3, 2];
  const allocation = [
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2],
  ].slice(0, values.length);
  const maxNeed = [
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3],
  ].slice(0, values.length);

  const need = maxNeed.map((row, i) => row.map((max, j) => max - allocation[i][j]));
  const finished = new Set<number>();
  const safeOrder: number[] = [];
  const steps: SystemStep[] = [];
  let work = [...available];
  let checks = 0;

  addStep(steps, {
    values,
    queue: values.map((_, index) => `P${index}`),
    table: need.map((row, index) => [`P${index}`, `need ${row.join("/")}`, `alloc ${allocation[index].join("/")}`]),
    active: null,
    selected: [],
    message: "Banker's Algorithm checks if processes can finish in a safe order using available resources.",
    checks,
  });

  while (finished.size < values.length) {
    let progressed = false;

    for (let i = 0; i < values.length; i++) {
      if (finished.has(i)) continue;

      checks++;
      const canFinish = need[i].every((resourceNeed, j) => resourceNeed <= work[j]);

      addStep(steps, {
        values,
        queue: values.map((_, index) => finished.has(index) ? `P${index}: done` : `P${index}`),
        table: need.map((row, index) => [`P${index}`, `need ${row.join("/")}`, `work ${work.join("/")}`]),
        active: i,
        selected: safeOrder,
        message: canFinish
          ? `P${i} can finish because need ${need[i].join("/")} <= work ${work.join("/")}.`
          : `P${i} cannot finish yet. Need ${need[i].join("/")} but work is ${work.join("/")}.`,
        checks,
      });

      if (canFinish) {
        work = work.map((value, j) => value + allocation[i][j]);
        finished.add(i);
        safeOrder.push(i);
        progressed = true;

        addStep(steps, {
          values,
          queue: values.map((_, index) => finished.has(index) ? `P${index}: done` : `P${index}`),
          table: need.map((row, index) => [`P${index}`, `need ${row.join("/")}`, `work ${work.join("/")}`]),
          active: i,
          selected: safeOrder,
          message: `P${i} finishes and releases allocation. New work is ${work.join("/")}.`,
          checks,
        });
      }
    }

    if (!progressed) break;
  }

  addStep(steps, {
    values,
    queue: [],
    table: need.map((row, index) => [`P${index}`, `need ${row.join("/")}`, finished.has(index) ? "safe" : "blocked"]),
    active: null,
    selected: safeOrder,
    message: finished.size === values.length
      ? `Safe sequence found: ${safeOrder.map((i) => `P${i}`).join(" -> ")}.`
      : "No safe sequence exists with current resources.",
    checks,
  });

  return steps;
}

function twoPhaseLockingTrace(input: string): SystemStep[] {
  const values = parseSystemValues(input).slice(0, 6);
  const transactions = values.map((_, index) => `T${index % 3}`);
  const resources = values.map((value, index) => `R${Math.abs(value + index) % 4}`);
  const locks = new Map<string, string>();
  const selected: number[] = [];
  const steps: SystemStep[] = [];
  let shrinking = false;
  let checks = 0;

  addStep(steps, {
    values,
    queue: transactions,
    table: [["Transaction", "Resource", "Lock state"]],
    active: null,
    selected,
    message: "Two-Phase Locking has a growing phase for acquiring locks and a shrinking phase for releasing locks.",
    checks,
  });

  for (let i = 0; i < values.length; i++) {
    const tx = transactions[i];
    const resource = resources[i];
    checks++;

    if (!shrinking && !locks.has(resource)) {
      locks.set(resource, tx);
      selected.push(i);

      addStep(steps, {
        values,
        queue: transactions.slice(i + 1),
        table: [...locks.entries()].map(([res, owner]) => [owner, res, "locked"]),
        active: i,
        selected,
        message: `${tx} acquires lock on ${resource} during the growing phase.`,
        checks,
      });
    } else {
      shrinking = true;

      addStep(steps, {
        values,
        queue: transactions.slice(i + 1),
        table: [...locks.entries()].map(([res, owner]) => [owner, res, "locked"]),
        active: i,
        selected,
        message: `${tx} cannot freely acquire after shrinking begins. Release phase is active.`,
        checks,
      });

      const release = [...locks.keys()][0];
      if (release) locks.delete(release);

      addStep(steps, {
        values,
        queue: transactions.slice(i + 1),
        table: [...locks.entries()].map(([res, owner]) => [owner, res, "locked"]),
        active: i,
        selected,
        message: `Release lock ${release}. Once shrinking starts, no new locks should be acquired by that transaction.`,
        checks,
      });
    }
  }

  const finalLockTable =
    locks.size > 0
      ? [...locks.entries()].map(([res, owner]) => [owner, res, "remaining"])
      : [["All transactions", "All resources", "released"]];

  addStep(steps, {
    values,
    queue: [],
    table: finalLockTable,
    active: null,
    selected,
    message: "Two-Phase Locking visual complete.",
    checks,
  });

  return steps;
}

function hashJoinTrace(input: string): SystemStep[] {
  const values = parseSystemValues(input).slice(0, 10);
  const left = values.slice(0, Math.ceil(values.length / 2));
  const right = values.slice(Math.ceil(values.length / 2));
  const buckets = new Map<number, number[]>();
  const steps: SystemStep[] = [];
  const selected: number[] = [];
  let checks = 0;

  addStep(steps, {
    values,
    queue: left.map((value) => `L${value}`),
    table: [],
    active: null,
    selected,
    message: "Hash Join builds a hash table from the left relation, then probes with the right relation.",
    checks,
  });

  for (const value of left) {
    checks++;
    const bucket = value % 5;
    buckets.set(bucket, [...(buckets.get(bucket) ?? []), value]);

    addStep(steps, {
      values,
      queue: left.map((item) => `L${item}`),
      table: [...buckets.entries()].map(([bucketId, rows]) => [`bucket ${bucketId}`, rows.join(", "), "build"]),
      active: value,
      selected,
      message: `Build phase: insert left row ${value} into hash bucket ${bucket}.`,
      checks,
    });
  }

  for (const value of right) {
    checks++;
    const bucket = value % 5;
    const matches = buckets.get(bucket) ?? [];

    if (matches.includes(value)) selected.push(value);

    addStep(steps, {
      values,
      queue: right.map((item) => `R${item}`),
      table: [...buckets.entries()].map(([bucketId, rows]) => [`bucket ${bucketId}`, rows.join(", "), bucketId === bucket ? "probe" : "build"]),
      active: value,
      selected,
      message: matches.includes(value)
        ? `Probe row ${value}. Match found in bucket ${bucket}.`
        : `Probe row ${value}. No exact match in bucket ${bucket}.`,
      checks,
    });
  }

  addStep(steps, {
    values,
    queue: [],
    table: [...buckets.entries()].map(([bucketId, rows]) => [`bucket ${bucketId}`, rows.join(", "), "done"]),
    active: null,
    selected,
    message: `Hash Join complete. Matches: ${selected.join(", ") || "none"}.`,
    checks,
  });

  return steps;
}

function mergeJoinTrace(input: string): SystemStep[] {
  const values = parseSystemValues(input).slice(0, 10);
  const left = values.slice(0, Math.ceil(values.length / 2)).sort((a, b) => a - b);
  const right = values.slice(Math.ceil(values.length / 2)).sort((a, b) => a - b);
  const selected: number[] = [];
  const steps: SystemStep[] = [];
  let i = 0;
  let j = 0;
  let checks = 0;

  addStep(steps, {
    values,
    queue: [`L: ${left.join(", ")}`, `R: ${right.join(", ")}`],
    table: [["Left", "Right", "Action"]],
    active: null,
    selected,
    message: "Merge Join sorts both relations and advances two pointers.",
    checks,
  });

  while (i < left.length && j < right.length) {
    checks++;

    if (left[i] === right[j]) {
      selected.push(left[i]);

      addStep(steps, {
        values,
        queue: [`L pointer ${i}`, `R pointer ${j}`],
        table: [[String(left[i]), String(right[j]), "match"]],
        active: left[i],
        selected,
        message: `Match ${left[i]}. Advance both pointers.`,
        checks,
      });

      i++;
      j++;
    } else if (left[i] < right[j]) {
      addStep(steps, {
        values,
        queue: [`L pointer ${i}`, `R pointer ${j}`],
        table: [[String(left[i]), String(right[j]), "advance left"]],
        active: left[i],
        selected,
        message: `${left[i]} < ${right[j]}, so advance left pointer.`,
        checks,
      });

      i++;
    } else {
      addStep(steps, {
        values,
        queue: [`L pointer ${i}`, `R pointer ${j}`],
        table: [[String(left[i]), String(right[j]), "advance right"]],
        active: right[j],
        selected,
        message: `${right[j]} < ${left[i]}, so advance right pointer.`,
        checks,
      });

      j++;
    }
  }

  addStep(steps, {
    values,
    queue: [],
    table: selected.map((value) => [String(value), String(value), "joined"]),
    active: null,
    selected,
    message: `Merge Join complete. Matches: ${selected.join(", ") || "none"}.`,
    checks,
  });

  return steps;
}


function nestedLoopJoinTrace(input: string): SystemStep[] {
  const values = parseSystemValues(input).slice(0, 10);
  const left = values.slice(0, Math.ceil(values.length / 2));
  const right = values.slice(Math.ceil(values.length / 2));
  const selected: number[] = [];
  const steps: SystemStep[] = [];
  let checks = 0;

  addStep(steps, {
    values,
    queue: [`L: ${left.join(", ")}`, `R: ${right.join(", ")}`],
    table: [["Left row", "Right row", "Result"]],
    active: null,
    selected,
    message: "Nested Loop Join compares every row from the left relation with every row from the right relation.",
    checks,
  });

  for (const l of left) {
    for (const r of right) {
      checks++;
      const match = l === r;

      if (match) selected.push(l);

      addStep(steps, {
        values,
        queue: [`Outer row ${l}`, `Inner scan ${r}`],
        table: [[String(l), String(r), match ? "match" : "no match"]],
        active: l,
        selected,
        message: match
          ? `Compare ${l} with ${r}. Match found.`
          : `Compare ${l} with ${r}. Continue inner loop.`,
        checks,
      });
    }
  }

  addStep(steps, {
    values,
    queue: [],
    table: selected.length ? selected.map((value) => [String(value), String(value), "joined"]) : [["No matches", "-", "complete"]],
    active: null,
    selected,
    message: `Nested Loop Join complete. Matches: ${selected.join(", ") || "none"}.`,
    checks,
  });

  return steps;
}

function queryOptimizationTrace(input: string): SystemStep[] {
  const values = parseSystemValues(input).slice(0, 6).map((value) => Math.max(1, value));
  const plans = [
    ["Seq Scan + Hash Join", values[0] * 9 + 40],
    ["Index Scan + Nested Loop", values[1] * 7 + 25],
    ["Bitmap Scan + Merge Join", values[2] * 6 + 35],
    ["Covering Index Scan", values[3] * 5 + 18],
  ] as Array<[string, number]>;

  const steps: SystemStep[] = [];
  const selected: number[] = [];
  let bestIndex = 0;
  let checks = 0;

  addStep(steps, {
    values,
    queue: plans.map(([name]) => name),
    table: plans.map(([name, cost]) => [name, `cost ${cost}`, "candidate"]),
    active: null,
    selected,
    message: "Query Optimization compares candidate execution plans and picks the lowest estimated cost.",
    checks,
  });

  for (let i = 0; i < plans.length; i++) {
    checks++;

    if (plans[i][1] < plans[bestIndex][1]) bestIndex = i;

    addStep(steps, {
      values,
      queue: plans.map(([name]) => name),
      table: plans.map(([name, cost], index) => [
        name,
        `cost ${cost}`,
        index === bestIndex ? "best so far" : "candidate",
      ]),
      active: i,
      selected: [bestIndex],
      message: `Evaluate ${plans[i][0]} with estimated cost ${plans[i][1]}.`,
      checks,
    });
  }

  addStep(steps, {
    values,
    queue: [],
    table: [[plans[bestIndex][0], `cost ${plans[bestIndex][1]}`, "chosen"]],
    active: bestIndex,
    selected: [bestIndex],
    message: `Optimization complete. Choose ${plans[bestIndex][0]}.`,
    checks,
  });

  return steps;
}

function bTreeIndexSystemTrace(input: string): SystemStep[] {
  const values = parseSystemValues(input).slice(0, 9).sort((a, b) => a - b);
  const target = values[Math.floor(values.length / 2)];
  const root = values[Math.floor(values.length / 2)];
  const left = values.filter((value) => value < root);
  const right = values.filter((value) => value > root);
  const steps: SystemStep[] = [];
  let checks = 0;

  addStep(steps, {
    values,
    queue: [`target ${target}`],
    table: [["Root", String(root), "compare"]],
    active: root,
    selected: [],
    message: "B-Tree Index Search starts at the root index page and chooses the child range.",
    checks,
  });

  checks++;
  const branch = target <= root ? left : right;

  addStep(steps, {
    values,
    queue: [`target ${target}`],
    table: [
      ["Root key", String(root), target <= root ? "go left page" : "go right page"],
      ["Left page", left.join(", ") || "-", "range"],
      ["Right page", right.join(", ") || "-", "range"],
    ],
    active: target,
    selected: [target],
    message: `Compare target ${target} with root ${root}. Move to the correct B-Tree page.`,
    checks,
  });

  for (const value of branch) {
    checks++;

    addStep(steps, {
      values,
      queue: branch.map(String),
      table: branch.map((item) => [String(item), item === target ? "match" : "scan", "leaf page"]),
      active: value,
      selected: value === target ? [value] : [],
      message: value === target
        ? `Found target ${target} in the leaf page.`
        : `Check leaf key ${value}.`,
      checks,
    });

    if (value === target) break;
  }

  addStep(steps, {
    values,
    queue: [],
    table: [[String(target), "found", "index lookup complete"]],
    active: target,
    selected: [target],
    message: "B-Tree Index Search complete.",
    checks,
  });

  return steps;
}

function prioritySchedulingTrace(input: string): SystemStep[] {
  const bursts = parseSystemValues(input).slice(0, 7).map((value) => Math.max(1, value));
  const priorities = [3, 1, 4, 2, 5, 1, 2].slice(0, bursts.length);
  const jobs = bursts
    .map((burst, index) => ({ index, burst, priority: priorities[index] }))
    .sort((a, b) => a.priority - b.priority || a.burst - b.burst);

  const completed: number[] = [];
  const steps: SystemStep[] = [];
  let time = 0;
  let checks = 0;

  addStep(steps, {
    values: bursts,
    queue: jobs.map((job) => `P${job.index}`),
    table: jobs.map((job) => [`P${job.index}`, `priority ${job.priority}`, `burst ${job.burst}`]),
    active: null,
    selected: [],
    message: "Priority Scheduling runs the ready process with the highest priority first. Lower number means higher priority here.",
    checks,
  });

  for (const job of jobs) {
    checks++;
    time += job.burst;
    completed.push(job.index);

    addStep(steps, {
      values: bursts,
      queue: jobs.filter((item) => !completed.includes(item.index)).map((item) => `P${item.index}`),
      table: jobs.map((item) => [
        `P${item.index}`,
        `priority ${item.priority}`,
        completed.includes(item.index) ? "done" : "waiting",
      ]),
      active: job.index,
      selected: completed,
      message: `Run P${job.index} with priority ${job.priority}. Clock is now ${time}.`,
      checks,
    });
  }

  addStep(steps, {
    values: bursts,
    queue: [],
    table: jobs.map((job) => [`P${job.index}`, `priority ${job.priority}`, "done"]),
    active: null,
    selected: completed,
    message: "CPU Priority Scheduling complete.",
    checks,
  });

  return steps;
}

export function getSystemTrace(algorithm: SystemAlgorithm, input: string): SystemStep[] {
  if (algorithm === "lruCache") return lruCacheTrace(input);
  if (algorithm === "lfuCache") return lfuCacheTrace(input);
  if (algorithm === "roundRobin") return roundRobinTrace(input);
  if (algorithm === "shortestJobFirst") return shortestJobFirstTrace(input);
  if (algorithm === "bankersAlgorithm") return bankersAlgorithmTrace(input);
  if (algorithm === "twoPhaseLocking") return twoPhaseLockingTrace(input);
  if (algorithm === "hashJoin") return hashJoinTrace(input);
  if (algorithm === "mergeJoin") return mergeJoinTrace(input);
  if (algorithm === "nestedLoopJoin") return nestedLoopJoinTrace(input);
  if (algorithm === "queryOptimization") return queryOptimizationTrace(input);
  if (algorithm === "bTreeIndexSystem") return bTreeIndexSystemTrace(input);
  return prioritySchedulingTrace(input);
}
