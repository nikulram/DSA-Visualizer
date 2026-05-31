export type MlAlgorithm = "kMeans" | "knn" | "naiveBayes" | "decisionTree" | "randomForest" | "svm" | "gradientBoosting" | "expectationMaximization" | "minimax" | "alphaBetaPruning" | "mcts" | "qLearning";

export type MlPoint = {
  x: number;
  y: number;
  label: string;
};

export type MlStep = {
  points: MlPoint[];
  centers: MlPoint[];
  active: number | null;
  selected: number[];
  table: string[][];
  message: string;
  checks: number;
};

export const mlLabels: Record<MlAlgorithm, string> = {
  kMeans: "K-Means",
  knn: "KNN",
  naiveBayes: "Naive Bayes",
  decisionTree: "Decision Tree",
  randomForest: "Random Forest",
  svm: "SVM",
  gradientBoosting: "Gradient Boosting",
  expectationMaximization: "Expectation Maximization",
  minimax: "Minimax",
  alphaBetaPruning: "Alpha-Beta Pruning",
  mcts: "Monte Carlo Tree Search",
  qLearning: "Q-Learning",
};

function parseMlPoints(input: string): MlPoint[] {
  const nums = input
    .split(/[\s,]+/)
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item));

  const points: MlPoint[] = [];

  for (let i = 0; i + 1 < nums.length; i += 2) {
    points.push({
      x: nums[i],
      y: nums[i + 1],
      label: nums[i] + nums[i + 1] > 90 ? "B" : "A",
    });
  }

  return points.length >= 6
    ? points.slice(0, 18)
    : [
        { x: 12, y: 18, label: "A" },
        { x: 18, y: 28, label: "A" },
        { x: 24, y: 20, label: "A" },
        { x: 58, y: 64, label: "B" },
        { x: 66, y: 72, label: "B" },
        { x: 74, y: 62, label: "B" },
        { x: 44, y: 48, label: "?" },
      ];
}

function addStep(steps: MlStep[], step: MlStep) {
  steps.push({
    points: step.points.map((point) => ({ ...point })),
    centers: step.centers.map((point) => ({ ...point })),
    active: step.active,
    selected: [...step.selected],
    table: step.table.map((row) => [...row]),
    message: step.message,
    checks: step.checks,
  });
}

function distance(a: MlPoint, b: MlPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function kMeansTrace(input: string): MlStep[] {
  const points = parseMlPoints(input).filter((point) => point.label !== "?");
  let centers: MlPoint[] = [
    { x: points[0].x, y: points[0].y, label: "C0" },
    { x: points[points.length - 1].x, y: points[points.length - 1].y, label: "C1" },
  ];
  const assignments = new Array(points.length).fill(0);
  const steps: MlStep[] = [];
  let checks = 0;

  addStep(steps, {
    points,
    centers,
    active: null,
    selected: [],
    table: [["Point", "Cluster", "Distance"]],
    message: "K-Means alternates between assigning points to nearest centers and recomputing centers.",
    checks,
  });

  for (let iteration = 0; iteration < 4; iteration++) {
    for (let i = 0; i < points.length; i++) {
      checks++;
      const d0 = distance(points[i], centers[0]);
      const d1 = distance(points[i], centers[1]);
      assignments[i] = d0 <= d1 ? 0 : 1;

      addStep(steps, {
        points,
        centers,
        active: i,
        selected: [i],
        table: [[`P${i}`, `C${assignments[i]}`, Math.min(d0, d1).toFixed(2)]],
        message: `Assign point ${i} to nearest center C${assignments[i]}.`,
        checks,
      });
    }

    centers = centers.map((center, cluster) => {
      const group = points.filter((_, index) => assignments[index] === cluster);
      if (group.length === 0) return center;

      return {
        x: group.reduce((sum, point) => sum + point.x, 0) / group.length,
        y: group.reduce((sum, point) => sum + point.y, 0) / group.length,
        label: `C${cluster}`,
      };
    });

    addStep(steps, {
      points,
      centers,
      active: null,
      selected: assignments.map((cluster, index) => cluster === iteration % 2 ? index : -1).filter((index) => index >= 0),
      table: centers.map((center, index) => [`C${index}`, center.x.toFixed(2), center.y.toFixed(2)]),
      message: `Iteration ${iteration + 1}: recompute cluster centers.`,
      checks,
    });
  }

  addStep(steps, {
    points,
    centers,
    active: null,
    selected: [],
    table: centers.map((center, index) => [`C${index}`, center.x.toFixed(2), center.y.toFixed(2)]),
    message: "K-Means complete.",
    checks,
  });

  return steps;
}

function knnTrace(input: string): MlStep[] {
  const points = parseMlPoints(input);
  const targetIndex = points.findIndex((point) => point.label === "?");
  const target = targetIndex >= 0 ? points[targetIndex] : { x: 44, y: 48, label: "?" };
  const training = points.filter((point) => point.label !== "?");
  const steps: MlStep[] = [];
  const scored: Array<{ index: number; label: string; distance: number }> = [];
  let checks = 0;

  addStep(steps, {
    points: [...training, target],
    centers: [target],
    active: null,
    selected: [],
    table: [["Point", "Label", "Distance"]],
    message: "KNN classifies a target by the majority label among its nearest neighbors.",
    checks,
  });

  training.forEach((point, index) => {
    checks++;
    const d = distance(point, target);
    scored.push({ index, label: point.label, distance: d });

    addStep(steps, {
      points: [...training, target],
      centers: [target],
      active: index,
      selected: [index],
      table: scored.map((item) => [`P${item.index}`, item.label, item.distance.toFixed(2)]),
      message: `Measure distance from target to point ${index}.`,
      checks,
    });
  });

  const nearest = scored.sort((a, b) => a.distance - b.distance).slice(0, 3);
  const votes = nearest.reduce<Record<string, number>>((acc, item) => {
    acc[item.label] = (acc[item.label] ?? 0) + 1;
    return acc;
  }, {});
  const label = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];

  addStep(steps, {
    points: [...training, { ...target, label }],
    centers: [{ ...target, label }],
    active: training.length,
    selected: nearest.map((item) => item.index),
    table: nearest.map((item) => [`P${item.index}`, item.label, item.distance.toFixed(2)]),
    message: `KNN complete. Majority vote predicts class ${label}.`,
    checks,
  });

  return steps;
}

function naiveBayesTrace(input: string): MlStep[] {
  const points = parseMlPoints(input).filter((point) => point.label !== "?");
  const steps: MlStep[] = [];
  let checks = 0;

  const classes = ["A", "B"];
  const table: string[][] = [["Class", "Prior", "High-X likelihood"]];
  const target = { x: 55, y: 55, label: "?" };

  addStep(steps, {
    points: [...points, target],
    centers: [target],
    active: null,
    selected: [],
    table,
    message: "Naive Bayes estimates class probability from priors and feature likelihoods.",
    checks,
  });

  const scores = classes.map((label) => {
    checks++;
    const group = points.filter((point) => point.label === label);
    const prior = group.length / points.length;
    const highX = group.filter((point) => point.x >= 50).length + 1;
    const likelihood = highX / (group.length + 2);
    const score = prior * likelihood;

    table.push([label, prior.toFixed(2), likelihood.toFixed(2)]);

    addStep(steps, {
      points: [...points, target],
      centers: [target],
      active: null,
      selected: points.map((point, index) => point.label === label ? index : -1).filter((index) => index >= 0),
      table,
      message: `Class ${label}: prior ${prior.toFixed(2)} times likelihood ${likelihood.toFixed(2)} gives score ${score.toFixed(3)}.`,
      checks,
    });

    return { label, score };
  });

  const best = scores.sort((a, b) => b.score - a.score)[0];

  addStep(steps, {
    points: [...points, { ...target, label: best.label }],
    centers: [{ ...target, label: best.label }],
    active: points.length,
    selected: [],
    table,
    message: `Naive Bayes complete. Predicted class is ${best.label}.`,
    checks,
  });

  return steps;
}


function decisionTreeTrace(input: string): MlStep[] {
  const points = parseMlPoints(input).filter((point) => point.label !== "?");
  const steps: MlStep[] = [];
  let checks = 0;

  const table: string[][] = [["Split", "Left", "Right"]];
  const selected: number[] = [];

  addStep(steps, {
    points,
    centers: [],
    active: null,
    selected,
    table,
    message: "Decision Tree chooses feature thresholds that separate labels as cleanly as possible.",
    checks,
  });

  const thresholds = [
    { feature: "x", value: 50 },
    { feature: "y", value: 45 },
    { feature: "x", value: 30 },
  ];

  for (const split of thresholds) {
    checks++;

    const left = points.filter((point) => split.feature === "x" ? point.x < split.value : point.y < split.value);
    const right = points.filter((point) => split.feature === "x" ? point.x >= split.value : point.y >= split.value);

    const leftPurity = left.filter((point) => point.label === "A").length;
    const rightPurity = right.filter((point) => point.label === "B").length;

    table.push([
      `${split.feature} < ${split.value}`,
      `${left.length} rows`,
      `${right.length} rows`,
    ]);

    selected.splice(0, selected.length, ...points.map((point, index) => {
      const goesLeft = split.feature === "x" ? point.x < split.value : point.y < split.value;
      return goesLeft ? index : -1;
    }).filter((index) => index >= 0));

    addStep(steps, {
      points,
      centers: [{ x: split.feature === "x" ? split.value : 50, y: split.feature === "y" ? split.value : 50, label: "split" }],
      active: null,
      selected,
      table,
      message: `Try split ${split.feature} < ${split.value}. Purity score ${leftPurity + rightPurity}/${points.length}.`,
      checks,
    });
  }

  addStep(steps, {
    points,
    centers: [{ x: 50, y: 50, label: "root" }],
    active: null,
    selected: [],
    table,
    message: "Decision Tree complete. Best visual split separates low-value A points from high-value B points.",
    checks,
  });

  return steps;
}

function randomForestTrace(input: string): MlStep[] {
  const points = parseMlPoints(input).filter((point) => point.label !== "?");
  const steps: MlStep[] = [];
  const table: string[][] = [["Tree", "Sample", "Vote"]];
  let checks = 0;

  addStep(steps, {
    points,
    centers: [],
    active: null,
    selected: [],
    table,
    message: "Random Forest trains several decision trees on different samples and combines votes.",
    checks,
  });

  const trees = [
    { name: "T1", feature: "x", threshold: 50 },
    { name: "T2", feature: "y", threshold: 48 },
    { name: "T3", feature: "x", threshold: 42 },
  ];

  for (const tree of trees) {
    checks++;

    const selected = points
      .map((_, index) => (index + checks) % 2 === 0 ? index : -1)
      .filter((index) => index >= 0);

    const vote = selected
      .map((index) => points[index].label)
      .filter((label) => label === "B").length >= Math.ceil(selected.length / 2)
      ? "B"
      : "A";

    table.push([tree.name, selected.map((index) => `P${index}`).join(" "), vote]);

    addStep(steps, {
      points,
      centers: [{ x: tree.feature === "x" ? tree.threshold : 50, y: tree.feature === "y" ? tree.threshold : 50, label: tree.name }],
      active: null,
      selected,
      table,
      message: `${tree.name} trains on a bootstrap sample and votes ${vote}.`,
      checks,
    });
  }

  addStep(steps, {
    points,
    centers: [],
    active: null,
    selected: [],
    table,
    message: "Random Forest complete. Final prediction is the majority vote across trees.",
    checks,
  });

  return steps;
}

function svmTrace(input: string): MlStep[] {
  const points = parseMlPoints(input).filter((point) => point.label !== "?");
  const steps: MlStep[] = [];
  const table: string[][] = [["Step", "Margin", "Support vectors"]];
  let checks = 0;
  let margin = 8;

  addStep(steps, {
    points,
    centers: [{ x: 45, y: 45, label: "w" }],
    active: null,
    selected: [],
    table,
    message: "SVM searches for a separating boundary with the largest margin.",
    checks,
  });

  for (let iteration = 1; iteration <= 5; iteration++) {
    checks++;
    margin += iteration * 1.4;

    const support = points
      .map((point, index) => Math.abs(point.x + point.y - 90) < 25 ? index : -1)
      .filter((index) => index >= 0);

    table.push([String(iteration), margin.toFixed(2), support.map((index) => `P${index}`).join(" ")]);

    addStep(steps, {
      points,
      centers: [{ x: 45 + iteration * 2, y: 45 - iteration, label: "margin" }],
      active: null,
      selected: support,
      table,
      message: `Iteration ${iteration}: widen margin and keep closest points as support vectors.`,
      checks,
    });
  }

  addStep(steps, {
    points,
    centers: [{ x: 55, y: 40, label: "boundary" }],
    active: null,
    selected: [],
    table,
    message: "SVM complete.",
    checks,
  });

  return steps;
}

function gradientBoostingTrace(input: string): MlStep[] {
  const points = parseMlPoints(input).filter((point) => point.label !== "?");
  const steps: MlStep[] = [];
  const table: string[][] = [["Stage", "Weak learner", "Residual"]];
  let checks = 0;
  let residual = points.length;

  addStep(steps, {
    points,
    centers: [],
    active: null,
    selected: [],
    table,
    message: "Gradient Boosting adds weak learners one at a time to reduce residual error.",
    checks,
  });

  const learners = [
    { rule: "x < 50", focus: "A mistakes" },
    { rule: "y > 55", focus: "B mistakes" },
    { rule: "x + y > 95", focus: "hard cases" },
  ];

  learners.forEach((learner, index) => {
    checks++;
    residual = Math.max(0, residual - 2);

    const selected = points
      .map((point, pointIndex) => {
        if (index === 0) return point.x < 50 ? pointIndex : -1;
        if (index === 1) return point.y > 55 ? pointIndex : -1;
        return point.x + point.y > 95 ? pointIndex : -1;
      })
      .filter((pointIndex) => pointIndex >= 0);

    table.push([String(index + 1), learner.rule, String(residual)]);

    addStep(steps, {
      points,
      centers: [{ x: 45 + index * 8, y: 45 + index * 5, label: `h${index + 1}` }],
      active: null,
      selected,
      table,
      message: `Add weak learner ${index + 1}: ${learner.rule}. Focus on ${learner.focus}.`,
      checks,
    });
  });

  addStep(steps, {
    points,
    centers: [],
    active: null,
    selected: [],
    table,
    message: "Gradient Boosting complete.",
    checks,
  });

  return steps;
}


function expectationMaximizationTrace(input: string): MlStep[] {
  const points = parseMlPoints(input).filter((point) => point.label !== "?");
  const steps: MlStep[] = [];
  let centers: MlPoint[] = [
    { x: 25, y: 25, label: "G1" },
    { x: 65, y: 65, label: "G2" },
  ];
  let checks = 0;

  addStep(steps, {
    points,
    centers,
    active: null,
    selected: [],
    table: [["Iteration", "E-step", "M-step"]],
    message: "Expectation Maximization alternates soft assignments and parameter updates.",
    checks,
  });

  for (let iteration = 1; iteration <= 4; iteration++) {
    checks++;

    const responsibilities = points.map((point) => {
      const d0 = Math.max(1, distance(point, centers[0]));
      const d1 = Math.max(1, distance(point, centers[1]));
      const r0 = (1 / d0) / (1 / d0 + 1 / d1);
      return r0;
    });

    centers = centers.map((center, cluster) => {
      const weights = responsibilities.map((r) => cluster === 0 ? r : 1 - r);
      const total = weights.reduce((sum, value) => sum + value, 0) || 1;

      return {
        x: points.reduce((sum, point, index) => sum + point.x * weights[index], 0) / total,
        y: points.reduce((sum, point, index) => sum + point.y * weights[index], 0) / total,
        label: center.label,
      };
    });

    addStep(steps, {
      points,
      centers,
      active: null,
      selected: responsibilities.map((r, index) => r > 0.5 ? index : -1).filter((index) => index >= 0),
      table: [[String(iteration), "soft cluster weights", "update means"]],
      message: `EM iteration ${iteration}: estimate responsibilities, then update Gaussian centers.`,
      checks,
    });
  }

  addStep(steps, {
    points,
    centers,
    active: null,
    selected: [],
    table: centers.map((center) => [center.label, center.x.toFixed(2), center.y.toFixed(2)]),
    message: "Expectation Maximization complete.",
    checks,
  });

  return steps;
}

function minimaxTrace(input: string): MlStep[] {
  const values = parseMlPoints(input).slice(0, 8).map((point) => Math.round((point.x + point.y) / 10));
  const leaves = values.length >= 8 ? values.slice(0, 8) : [3, 5, 2, 9, 12, 5, 23, 7];
  const points = leaves.map((value, index) => ({ x: 10 + index * 10, y: 20 + value * 3, label: String(value) }));
  const steps: MlStep[] = [];
  const table: string[][] = [["Node", "Role", "Value"]];
  let checks = 0;

  addStep(steps, {
    points,
    centers: [],
    active: null,
    selected: [],
    table,
    message: "Minimax evaluates game tree leaves upward. MAX chooses high values, MIN chooses low values.",
    checks,
  });

  const level1: number[] = [];
  for (let i = 0; i < leaves.length; i += 2) {
    checks++;
    const value = Math.min(leaves[i], leaves[i + 1]);
    level1.push(value);
    table.push([`MIN ${i / 2}`, "min", String(value)]);

    addStep(steps, {
      points,
      centers: [{ x: 20 + i * 10, y: 80, label: `MIN=${value}` }],
      active: i,
      selected: [i, i + 1],
      table,
      message: `MIN node chooses min(${leaves[i]}, ${leaves[i + 1]}) = ${value}.`,
      checks,
    });
  }

  const level2: number[] = [];
  for (let i = 0; i < level1.length; i += 2) {
    checks++;
    const value = Math.max(level1[i], level1[i + 1]);
    level2.push(value);
    table.push([`MAX ${i / 2}`, "max", String(value)]);

    addStep(steps, {
      points,
      centers: [{ x: 30 + i * 20, y: 120, label: `MAX=${value}` }],
      active: i,
      selected: [i, i + 1],
      table,
      message: `MAX node chooses max(${level1[i]}, ${level1[i + 1]}) = ${value}.`,
      checks,
    });
  }

  const root = Math.min(level2[0], level2[1]);

  addStep(steps, {
    points,
    centers: [{ x: 50, y: 160, label: `root=${root}` }],
    active: null,
    selected: [],
    table: [...table, ["ROOT", "min", String(root)]],
    message: `Minimax complete. Root value is ${root}.`,
    checks,
  });

  return steps;
}

function alphaBetaPruningTrace(input: string): MlStep[] {
  const values = parseMlPoints(input).slice(0, 8).map((point) => Math.round((point.x + point.y) / 10));
  const leaves = values.length >= 8 ? values.slice(0, 8) : [3, 5, 2, 9, 12, 5, 23, 7];
  const points = leaves.map((value, index) => ({ x: 10 + index * 10, y: 20 + value * 3, label: String(value) }));
  const steps: MlStep[] = [];
  const table: string[][] = [["Leaf", "Alpha", "Beta"]];
  let alpha = -Infinity;
  let beta = Infinity;
  let best = -Infinity;
  let checks = 0;

  addStep(steps, {
    points,
    centers: [],
    active: null,
    selected: [],
    table,
    message: "Alpha-Beta Pruning skips branches that cannot change the minimax result.",
    checks,
  });

  for (let i = 0; i < leaves.length; i++) {
    checks++;
    best = Math.max(best, leaves[i]);
    alpha = Math.max(alpha, best);

    table.push([String(i), String(alpha), beta === Infinity ? "∞" : String(beta)]);

    addStep(steps, {
      points,
      centers: [{ x: 50, y: 130, label: `α=${alpha}` }],
      active: i,
      selected: [i],
      table,
      message: beta <= alpha
        ? `Prune after leaf ${i}: beta <= alpha.`
        : `Visit leaf ${i}; update alpha to ${alpha}.`,
      checks,
    });

    if (i >= 3 && beta <= alpha) break;

    if (i === 3) beta = Math.min(beta, best);
  }

  addStep(steps, {
    points,
    centers: [{ x: 50, y: 150, label: `best=${best}` }],
    active: null,
    selected: [],
    table,
    message: "Alpha-Beta Pruning complete.",
    checks,
  });

  return steps;
}

function mctsTrace(input: string): MlStep[] {
  const points = parseMlPoints(input).filter((point) => point.label !== "?").slice(0, 8);
  const steps: MlStep[] = [];
  const table: string[][] = [["Move", "Visits", "Wins"]];
  const visits = [0, 0, 0];
  const wins = [0, 0, 0];
  let checks = 0;

  addStep(steps, {
    points,
    centers: [
      { x: 25, y: 75, label: "M0" },
      { x: 50, y: 75, label: "M1" },
      { x: 75, y: 75, label: "M2" },
    ],
    active: null,
    selected: [],
    table,
    message: "Monte Carlo Tree Search repeats selection, simulation, and backpropagation.",
    checks,
  });

  for (let rollout = 1; rollout <= 9; rollout++) {
    checks++;
    const move = rollout % 3;
    visits[move]++;
    wins[move] += rollout % 2 === 0 ? 1 : 0;

    table.push([`M${move}`, String(visits[move]), String(wins[move])]);

    addStep(steps, {
      points,
      centers: [
        { x: 25, y: 75, label: `M0 ${wins[0]}/${visits[0]}` },
        { x: 50, y: 75, label: `M1 ${wins[1]}/${visits[1]}` },
        { x: 75, y: 75, label: `M2 ${wins[2]}/${visits[2]}` },
      ],
      active: move,
      selected: [move],
      table,
      message: `Rollout ${rollout}: simulate move M${move}, then backpropagate result.`,
      checks,
    });
  }

  const best = visits.map((visit, index) => ({ index, score: wins[index] / Math.max(1, visit) })).sort((a, b) => b.score - a.score)[0];

  addStep(steps, {
    points,
    centers: [{ x: 50, y: 100, label: `best M${best.index}` }],
    active: best.index,
    selected: [best.index],
    table,
    message: `MCTS complete. Choose move M${best.index}.`,
    checks,
  });

  return steps;
}


function qLearningTrace(input: string): MlStep[] {
  const points = parseMlPoints(input).filter((point) => point.label !== "?").slice(0, 6);
  const steps: MlStep[] = [];
  const actions = ["left", "right", "up"];
  const q = Array.from({ length: 4 }, () => Array(actions.length).fill(0));
  const table: string[][] = [["State", "Action", "Q value"]];
  const alpha = 0.5;
  const gamma = 0.8;
  let checks = 0;

  addStep(steps, {
    points,
    centers: [
      { x: 25, y: 25, label: "S0" },
      { x: 50, y: 25, label: "S1" },
      { x: 25, y: 55, label: "S2" },
      { x: 50, y: 55, label: "S3" },
    ],
    active: null,
    selected: [],
    table,
    message: "Q-Learning updates action values from reward plus discounted future value.",
    checks,
  });

  const episodes = [
    { state: 0, action: 1, next: 1, reward: 1 },
    { state: 1, action: 2, next: 3, reward: 3 },
    { state: 2, action: 1, next: 3, reward: 2 },
    { state: 0, action: 2, next: 2, reward: 1 },
    { state: 2, action: 1, next: 3, reward: 4 },
    { state: 1, action: 2, next: 3, reward: 5 },
  ];

  episodes.forEach((episode, index) => {
    checks++;

    const oldValue = q[episode.state][episode.action];
    const future = Math.max(...q[episode.next]);
    const updated = oldValue + alpha * (episode.reward + gamma * future - oldValue);
    q[episode.state][episode.action] = updated;

    table.push([
      `S${episode.state}`,
      actions[episode.action],
      updated.toFixed(2),
    ]);

    addStep(steps, {
      points,
      centers: [
        { x: 25, y: 25, label: `S0 ${Math.max(...q[0]).toFixed(1)}` },
        { x: 50, y: 25, label: `S1 ${Math.max(...q[1]).toFixed(1)}` },
        { x: 25, y: 55, label: `S2 ${Math.max(...q[2]).toFixed(1)}` },
        { x: 50, y: 55, label: `S3 ${Math.max(...q[3]).toFixed(1)}` },
      ],
      active: episode.state,
      selected: [episode.state, episode.next],
      table,
      message: `Episode ${index + 1}: update Q(S${episode.state}, ${actions[episode.action]}) to ${updated.toFixed(2)}.`,
      checks,
    });
  });

  addStep(steps, {
    points,
    centers: [
      { x: 25, y: 25, label: `S0 ${Math.max(...q[0]).toFixed(1)}` },
      { x: 50, y: 25, label: `S1 ${Math.max(...q[1]).toFixed(1)}` },
      { x: 25, y: 55, label: `S2 ${Math.max(...q[2]).toFixed(1)}` },
      { x: 50, y: 55, label: `S3 ${Math.max(...q[3]).toFixed(1)}` },
    ],
    active: null,
    selected: [],
    table,
    message: "Q-Learning visual complete.",
    checks,
  });

  return steps;
}

export function getMlTrace(algorithm: MlAlgorithm, input: string): MlStep[] {
  if (algorithm === "kMeans") return kMeansTrace(input);
  if (algorithm === "knn") return knnTrace(input);
  if (algorithm === "naiveBayes") return naiveBayesTrace(input);
  if (algorithm === "decisionTree") return decisionTreeTrace(input);
  if (algorithm === "randomForest") return randomForestTrace(input);
  if (algorithm === "svm") return svmTrace(input);
  if (algorithm === "gradientBoosting") return gradientBoostingTrace(input);
  if (algorithm === "expectationMaximization") return expectationMaximizationTrace(input);
  if (algorithm === "minimax") return minimaxTrace(input);
  if (algorithm === "alphaBetaPruning") return alphaBetaPruningTrace(input);
  if (algorithm === "mcts") return mctsTrace(input);
  return qLearningTrace(input);
}
