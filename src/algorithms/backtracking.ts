export type BacktrackingAlgorithm = "backtracking" | "nQueens" | "sudokuSolver" | "subsetGeneration" | "permutationGeneration" | "combinationGeneration" | "branchAndBound" | "sjt";

export type BacktrackingStep = {
  board: string[][];
  active: [number, number] | null;
  path: string[];
  choices: string[];
  message: string;
  checks: number;
};

export const backtrackingLabels: Record<BacktrackingAlgorithm, string> = {
  backtracking: "Backtracking",
  nQueens: "N Queens",
  sudokuSolver: "Sudoku Solver",
  subsetGeneration: "Subset Generation",
  permutationGeneration: "Permutation Generation",
  combinationGeneration: "Combination Generation",
  branchAndBound: "Branch and Bound",
  sjt: "Steinhaus-Johnson-Trotter",
};

function parseValues(input: string) {
  const values = input
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);

  return values.length ? values : ["A", "B", "C", "D"];
}

function addStep(steps: BacktrackingStep[], step: BacktrackingStep) {
  steps.push({
    board: step.board.map((row) => [...row]),
    active: step.active ? [...step.active] as [number, number] : null,
    path: [...step.path],
    choices: [...step.choices],
    message: step.message,
    checks: step.checks,
  });
}

function genericBacktrackingTrace(input: string): BacktrackingStep[] {
  const values = parseValues(input).slice(0, 4);
  const steps: BacktrackingStep[] = [];
  const path: string[] = [];
  let checks = 0;

  function dfs(index: number) {
    checks++;

    addStep(steps, {
      board: [values, path, values.map((value) => path.includes(value) ? "used" : "open")],
      active: [1, index],
      path,
      choices: values.filter((value) => !path.includes(value)),
      message: `At depth ${index}, choose one available option.`,
      checks,
    });

    if (index === values.length) {
      addStep(steps, {
        board: [values, path, ["solution"]],
        active: null,
        path,
        choices: [],
        message: `Solution found: ${path.join(" -> ")}.`,
        checks,
      });
      return true;
    }

    for (const value of values) {
      if (path.includes(value)) continue;

      path.push(value);

      addStep(steps, {
        board: [values, path, values.map((item) => item === value ? "try" : "")],
        active: [1, path.length - 1],
        path,
        choices: values.filter((item) => !path.includes(item)),
        message: `Choose ${value}. Continue deeper.`,
        checks,
      });

      if (dfs(index + 1)) return true;

      path.pop();

      addStep(steps, {
        board: [values, path, values.map((item) => item === value ? "undo" : "")],
        active: [1, path.length],
        path,
        choices: values.filter((item) => !path.includes(item)),
        message: `Backtrack from ${value}. Undo the choice.`,
        checks,
      });
    }

    return false;
  }

  addStep(steps, {
    board: [values],
    active: null,
    path,
    choices: values,
    message: "Backtracking tries a choice, recurses, and undoes the choice if needed.",
    checks,
  });

  dfs(0);

  return steps;
}

function nQueensTrace(input: string): BacktrackingStep[] {
  const n = Math.max(4, Math.min(6, Number(parseValues(input)[0]) || 4));
  const board = Array.from({ length: n }, () => Array(n).fill("."));
  const steps: BacktrackingStep[] = [];
  const queens: number[] = [];
  let checks = 0;

  function safe(row: number, col: number) {
    for (let r = 0; r < row; r++) {
      const c = queens[r];

      if (c === col || Math.abs(c - col) === Math.abs(r - row)) return false;
    }

    return true;
  }

  function solve(row: number): boolean {
    if (row === n) {
      addStep(steps, {
        board,
        active: null,
        path: queens.map((col, rowIndex) => `Q${rowIndex}:${col}`),
        choices: [],
        message: "N Queens solution complete.",
        checks,
      });
      return true;
    }

    for (let col = 0; col < n; col++) {
      checks++;

      addStep(steps, {
        board,
        active: [row, col],
        path: queens.map((qCol, qRow) => `Q${qRow}:${qCol}`),
        choices: [`row ${row}`, `col ${col}`],
        message: `Check if a queen can be placed at row ${row}, column ${col}.`,
        checks,
      });

      if (!safe(row, col)) {
        addStep(steps, {
          board,
          active: [row, col],
          path: queens.map((qCol, qRow) => `Q${qRow}:${qCol}`),
          choices: [],
          message: "Conflict found. Try next column.",
          checks,
        });
        continue;
      }

      board[row][col] = "Q";
      queens[row] = col;

      addStep(steps, {
        board,
        active: [row, col],
        path: queens.map((qCol, qRow) => `Q${qRow}:${qCol}`),
        choices: [],
        message: `Place queen at (${row}, ${col}).`,
        checks,
      });

      if (solve(row + 1)) return true;

      board[row][col] = ".";
      queens.pop();

      addStep(steps, {
        board,
        active: [row, col],
        path: queens.map((qCol, qRow) => `Q${qRow}:${qCol}`),
        choices: [],
        message: `Backtrack from (${row}, ${col}).`,
        checks,
      });
    }

    return false;
  }

  addStep(steps, {
    board,
    active: null,
    path: [],
    choices: [`n=${n}`],
    message: "N Queens places one queen per row without column or diagonal conflicts.",
    checks,
  });

  solve(0);

  return steps;
}

function sudokuSolverTrace(): BacktrackingStep[] {
  const board = [
    ["5", "3", ".", ".", "7", ".", ".", ".", "."],
    ["6", ".", ".", "1", "9", "5", ".", ".", "."],
    [".", "9", "8", ".", ".", ".", ".", "6", "."],
    ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
    ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
    ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
    [".", "6", ".", ".", ".", ".", "2", "8", "."],
    [".", ".", ".", "4", "1", "9", ".", ".", "5"],
    [".", ".", ".", ".", "8", ".", ".", "7", "9"],
  ];

  const steps: BacktrackingStep[] = [];
  let checks = 0;

  function canPlace(row: number, col: number, value: string) {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === value || board[i][col] === value) return false;
    }

    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (board[r][c] === value) return false;
      }
    }

    return true;
  }

  function solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== ".") continue;

        for (let value = 1; value <= 9; value++) {
          checks++;
          const candidate = String(value);

          addStep(steps, {
            board,
            active: [row, col],
            path: [`try ${candidate}`],
            choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            message: `Try ${candidate} at cell (${row}, ${col}).`,
            checks,
          });

          if (!canPlace(row, col, candidate)) continue;

          board[row][col] = candidate;

          addStep(steps, {
            board,
            active: [row, col],
            path: [`place ${candidate}`],
            choices: [],
            message: `${candidate} is valid here. Continue solving.`,
            checks,
          });

          if (steps.length > 80 || solve()) return true;

          board[row][col] = ".";

          addStep(steps, {
            board,
            active: [row, col],
            path: [`undo ${candidate}`],
            choices: [],
            message: `Backtrack from ${candidate}.`,
            checks,
          });
        }

        return false;
      }
    }

    return true;
  }

  addStep(steps, {
    board,
    active: null,
    path: [],
    choices: [],
    message: "Sudoku Solver fills empty cells with valid digits using backtracking.",
    checks,
  });

  solve();

  addStep(steps, {
    board,
    active: null,
    path: [],
    choices: [],
    message: "Sudoku Solver visual complete.",
    checks,
  });

  return steps;
}

function subsetGenerationTrace(input: string): BacktrackingStep[] {
  const values = parseValues(input).slice(0, 5);
  const steps: BacktrackingStep[] = [];
  const path: string[] = [];
  let checks = 0;

  function dfs(index: number) {
    checks++;

    addStep(steps, {
      board: [values, path],
      active: [1, index],
      path,
      choices: index < values.length ? [`skip ${values[index]}`, `take ${values[index]}`] : [],
      message: index === values.length ? `Emit subset {${path.join(", ")}}.` : `At ${values[index]}, branch into skip or take.`,
      checks,
    });

    if (index === values.length) return;

    dfs(index + 1);

    path.push(values[index]);
    dfs(index + 1);
    path.pop();
  }

  addStep(steps, {
    board: [values],
    active: null,
    path,
    choices: values,
    message: "Subset Generation explores two branches for each item: skip or take.",
    checks,
  });

  dfs(0);

  return steps;
}


function permutationGenerationTrace(input: string): BacktrackingStep[] {
  const values = parseValues(input).slice(0, 4);
  const steps: BacktrackingStep[] = [];
  const path: string[] = [];
  const used = new Set<string>();
  let checks = 0;

  function dfs() {
    checks++;

    addStep(steps, {
      board: [values, path, values.map((value) => used.has(value) ? "used" : "open")],
      active: [1, path.length],
      path,
      choices: values.filter((value) => !used.has(value)),
      message: path.length === values.length ? `Emit permutation ${path.join("")}.` : "Pick any unused value for the next position.",
      checks,
    });

    if (path.length === values.length) return;

    for (const value of values) {
      if (used.has(value)) continue;

      used.add(value);
      path.push(value);

      addStep(steps, {
        board: [values, path, values.map((item) => item === value ? "take" : "")],
        active: [1, path.length - 1],
        path,
        choices: values.filter((item) => !used.has(item)),
        message: `Take ${value}.`,
        checks,
      });

      dfs();

      path.pop();
      used.delete(value);

      addStep(steps, {
        board: [values, path, values.map((item) => item === value ? "undo" : "")],
        active: [1, path.length],
        path,
        choices: values.filter((item) => !used.has(item)),
        message: `Undo ${value} and try another branch.`,
        checks,
      });

      if (steps.length > 90) return;
    }
  }

  addStep(steps, {
    board: [values],
    active: null,
    path,
    choices: values,
    message: "Permutation Generation builds every ordering by choosing unused values.",
    checks,
  });

  dfs();

  return steps;
}

function combinationGenerationTrace(input: string): BacktrackingStep[] {
  const values = parseValues(input).slice(0, 6);
  const k = Math.min(3, values.length);
  const steps: BacktrackingStep[] = [];
  const path: string[] = [];
  let checks = 0;

  function dfs(start: number) {
    checks++;

    addStep(steps, {
      board: [values, path],
      active: [1, start],
      path,
      choices: values.slice(start),
      message: path.length === k ? `Emit combination {${path.join(", ")}}.` : `Choose next item from index ${start}.`,
      checks,
    });

    if (path.length === k) return;

    for (let i = start; i < values.length; i++) {
      path.push(values[i]);

      addStep(steps, {
        board: [values, path],
        active: [0, i],
        path,
        choices: values.slice(i + 1),
        message: `Include ${values[i]} and recurse with later values only.`,
        checks,
      });

      dfs(i + 1);
      path.pop();

      addStep(steps, {
        board: [values, path],
        active: [0, i],
        path,
        choices: values.slice(i + 1),
        message: `Backtrack from ${values[i]}.`,
        checks,
      });

      if (steps.length > 90) return;
    }
  }

  addStep(steps, {
    board: [values],
    active: null,
    path,
    choices: values,
    message: `Combination Generation chooses ${k} items without caring about order.`,
    checks,
  });

  dfs(0);

  return steps;
}

function branchAndBoundTrace(input: string): BacktrackingStep[] {
  const values = parseValues(input).map((value) => Number(value)).filter((value) => Number.isFinite(value));
  const profits = values.length >= 4 ? values.slice(0, 5) : [9, 7, 6, 4, 3];
  const capacity = 12;
  const weights = [5, 4, 3, 2, 2];
  const steps: BacktrackingStep[] = [];
  const path: string[] = [];
  let best = 0;
  let checks = 0;

  function bound(index: number, profit: number, weight: number) {
    let estimate = profit;
    let remaining = capacity - weight;

    for (let i = index; i < profits.length && remaining > 0; i++) {
      if (weights[i] <= remaining) {
        estimate += profits[i];
        remaining -= weights[i];
      } else {
        estimate += profits[i] * (remaining / weights[i]);
        break;
      }
    }

    return estimate;
  }

  function dfs(index: number, profit: number, weight: number) {
    checks++;
    const estimate = bound(index, profit, weight);

    addStep(steps, {
      board: [
        profits.map(String),
        weights.map(String),
        [`profit ${profit}`, `weight ${weight}`, `bound ${estimate.toFixed(1)}`],
      ],
      active: [2, index],
      path,
      choices: [`best ${best}`, `capacity ${capacity}`],
      message: estimate <= best ? `Prune branch. Bound ${estimate.toFixed(1)} cannot beat best ${best}.` : `Explore branch with bound ${estimate.toFixed(1)}.`,
      checks,
    });

    if (estimate <= best || index === profits.length) {
      best = Math.max(best, profit);
      return;
    }

    if (weight + weights[index] <= capacity) {
      path.push(`take ${index}`);
      dfs(index + 1, profit + profits[index], weight + weights[index]);
      path.pop();
    }

    path.push(`skip ${index}`);
    dfs(index + 1, profit, weight);
    path.pop();
  }

  addStep(steps, {
    board: [profits.map(String), weights.map(String)],
    active: null,
    path,
    choices: [`capacity ${capacity}`],
    message: "Branch and Bound explores only branches whose upper bound can still beat the best solution.",
    checks,
  });

  dfs(0, 0, 0);

  addStep(steps, {
    board: [[`best ${best}`]],
    active: null,
    path,
    choices: [],
    message: `Branch and Bound complete. Best profit is ${best}.`,
    checks,
  });

  return steps;
}

function sjtTrace(input: string): BacktrackingStep[] {
  const values = parseValues(input).slice(0, 4);
  const nums = values.map((_, index) => index + 1);
  const dirs = nums.map(() => -1);
  const steps: BacktrackingStep[] = [];
  let checks = 0;

  function mobileIndex() {
    let bestIndex = -1;

    for (let i = 0; i < nums.length; i++) {
      const next = i + dirs[i];

      if (next < 0 || next >= nums.length) continue;
      if (nums[i] <= nums[next]) continue;

      if (bestIndex === -1 || nums[i] > nums[bestIndex]) bestIndex = i;
    }

    return bestIndex;
  }

  addStep(steps, {
    board: [nums.map(String), dirs.map((dir) => dir === -1 ? "left" : "right")],
    active: null,
    path: [nums.join("")],
    choices: [],
    message: "Steinhaus-Johnson-Trotter generates permutations by moving the largest mobile element.",
    checks,
  });

  while (steps.length < 30) {
    checks++;
    const index = mobileIndex();

    if (index === -1) break;

    const swapWith = index + dirs[index];
    const moving = nums[index];

    [nums[index], nums[swapWith]] = [nums[swapWith], nums[index]];
    [dirs[index], dirs[swapWith]] = [dirs[swapWith], dirs[index]];

    for (let i = 0; i < nums.length; i++) {
      if (nums[i] > moving) dirs[i] *= -1;
    }

    addStep(steps, {
      board: [nums.map(String), dirs.map((dir) => dir === -1 ? "left" : "right")],
      active: [0, swapWith],
      path: [nums.join("")],
      choices: [`moved ${moving}`],
      message: `Move mobile value ${moving}, then reverse directions of larger values.`,
      checks,
    });
  }

  addStep(steps, {
    board: [nums.map(String)],
    active: null,
    path: [nums.join("")],
    choices: [],
    message: "Steinhaus-Johnson-Trotter visual complete.",
    checks,
  });

  return steps;
}

export function getBacktrackingTrace(algorithm: BacktrackingAlgorithm, input: string): BacktrackingStep[] {
  if (algorithm === "backtracking") return genericBacktrackingTrace(input);
  if (algorithm === "nQueens") return nQueensTrace(input);
  if (algorithm === "sudokuSolver") return sudokuSolverTrace();
  if (algorithm === "subsetGeneration") return subsetGenerationTrace(input);
  if (algorithm === "permutationGeneration") return permutationGenerationTrace(input);
  if (algorithm === "combinationGeneration") return combinationGenerationTrace(input);
  if (algorithm === "branchAndBound") return branchAndBoundTrace(input);
  return sjtTrace(input);
}
