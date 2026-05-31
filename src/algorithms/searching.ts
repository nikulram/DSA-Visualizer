export type SearchAlgorithm = "linear" | "binary" | "jump" | "exponential" | "interpolation" | "ternary" | "fibonacci" | "quickselect";

export type SearchStep = {
  array: number[];
  active: number[];
  eliminated: number[];
  found: number | null;
  message: string;
  checks: number;
};

export const searchLabels: Record<SearchAlgorithm, string> = {
  linear: "Linear Search",
  binary: "Binary Search",
  jump: "Jump Search",
  exponential: "Exponential Search",
  interpolation: "Interpolation Search",
  ternary: "Ternary Search",
  fibonacci: "Fibonacci Search",
  quickselect: "Quickselect",
};

function makeSearchStep(
  array: number[],
  active: number[],
  eliminated: number[],
  found: number | null,
  message: string,
  checks: number,
): SearchStep {
  return {
    array: [...array],
    active: [...active],
    eliminated: [...eliminated],
    found,
    message,
    checks,
  };
}

function linearTrace(values: number[], target: number): SearchStep[] {
  const arr = [...values];
  const steps: SearchStep[] = [];
  const eliminated = new Set<number>();
  let checks = 0;

  steps.push(makeSearchStep(arr, [], [], null, `Linear Search checks each value from left to right until it finds ${target}.`, checks));

  for (let index = 0; index < arr.length; index++) {
    checks++;
    steps.push(makeSearchStep(arr, [index], [...eliminated], null, `Check index ${index}: ${arr[index]} === ${target}?`, checks));

    if (arr[index] === target) {
      steps.push(makeSearchStep(arr, [index], [...eliminated], index, `Found ${target} at index ${index}.`, checks));
      return steps;
    }

    eliminated.add(index);
    steps.push(makeSearchStep(arr, [index], [...eliminated], null, `${arr[index]} is not the target. Move to the next index.`, checks));
  }

  steps.push(makeSearchStep(arr, [], [...eliminated], null, `${target} was not found in the array.`, checks));
  return steps;
}

function binaryTrace(values: number[], target: number): SearchStep[] {
  const arr = [...values].sort((a, b) => a - b);
  const steps: SearchStep[] = [];
  const eliminated = new Set<number>();
  let checks = 0;
  let left = 0;
  let right = arr.length - 1;

  steps.push(makeSearchStep(arr, [], [], null, `Binary Search uses a sorted array and repeatedly checks the middle for ${target}.`, checks));

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    checks++;

    steps.push(makeSearchStep(arr, [left, mid, right], [...eliminated], null, `Search range [${left}..${right}]. Check middle index ${mid}, value ${arr[mid]}.`, checks));

    if (arr[mid] === target) {
      steps.push(makeSearchStep(arr, [mid], [...eliminated], mid, `Found ${target} at sorted index ${mid}.`, checks));
      return steps;
    }

    if (arr[mid] < target) {
      for (let index = left; index <= mid; index++) eliminated.add(index);
      steps.push(makeSearchStep(arr, [mid], [...eliminated], null, `${arr[mid]} is smaller than ${target}. Eliminate the left half.`, checks));
      left = mid + 1;
    } else {
      for (let index = mid; index <= right; index++) eliminated.add(index);
      steps.push(makeSearchStep(arr, [mid], [...eliminated], null, `${arr[mid]} is larger than ${target}. Eliminate the right half.`, checks));
      right = mid - 1;
    }
  }

  steps.push(makeSearchStep(arr, [], [...eliminated], null, `${target} was not found.`, checks));
  return steps;
}

function jumpTrace(values: number[], target: number): SearchStep[] {
  const arr = [...values].sort((a, b) => a - b);
  const steps: SearchStep[] = [];
  const eliminated = new Set<number>();
  const blockSize = Math.max(1, Math.floor(Math.sqrt(arr.length)));
  let checks = 0;
  let start = 0;
  let end = blockSize;

  steps.push(makeSearchStep(arr, [], [], null, `Jump Search checks blocks of size ${blockSize}, then scans inside the target block.`, checks));

  while (start < arr.length && arr[Math.min(end, arr.length) - 1] < target) {
    const blockEnd = Math.min(end, arr.length) - 1;
    checks++;

    steps.push(makeSearchStep(arr, [start, blockEnd], [...eliminated], null, `Check block [${start}..${blockEnd}]. End value ${arr[blockEnd]} is less than ${target}.`, checks));

    for (let index = start; index <= blockEnd; index++) eliminated.add(index);

    steps.push(makeSearchStep(arr, [start, blockEnd], [...eliminated], null, `Eliminate block [${start}..${blockEnd}].`, checks));

    start = end;
    end += blockSize;
  }

  const finalEnd = Math.min(end, arr.length);

  steps.push(makeSearchStep(arr, Array.from({ length: finalEnd - start }, (_, index) => start + index), [...eliminated], null, `Scan candidate block [${start}..${finalEnd - 1}].`, checks));

  for (let index = start; index < finalEnd; index++) {
    checks++;
    steps.push(makeSearchStep(arr, [index], [...eliminated], null, `Check index ${index}: ${arr[index]} === ${target}?`, checks));

    if (arr[index] === target) {
      steps.push(makeSearchStep(arr, [index], [...eliminated], index, `Found ${target} at sorted index ${index}.`, checks));
      return steps;
    }

    eliminated.add(index);
  }

  steps.push(makeSearchStep(arr, [], [...eliminated], null, `${target} was not found.`, checks));
  return steps;
}

function exponentialTrace(values: number[], target: number): SearchStep[] {
  const arr = [...values].sort((a, b) => a - b);
  const steps: SearchStep[] = [];
  const eliminated = new Set<number>();
  let checks = 0;

  steps.push(makeSearchStep(arr, [], [], null, `Exponential Search finds a possible range for ${target}, then runs Binary Search in that range.`, checks));

  if (arr.length === 0) {
    steps.push(makeSearchStep(arr, [], [], null, "Array is empty.", checks));
    return steps;
  }

  checks++;
  steps.push(makeSearchStep(arr, [0], [], null, `Check first value ${arr[0]}.`, checks));

  if (arr[0] === target) {
    steps.push(makeSearchStep(arr, [0], [], 0, `Found ${target} at index 0.`, checks));
    return steps;
  }

  let bound = 1;

  while (bound < arr.length && arr[bound] < target) {
    checks++;
    steps.push(makeSearchStep(arr, [bound], [...eliminated], null, `Index ${bound} has ${arr[bound]}, still less than ${target}. Double the bound.`, checks));

    for (let index = Math.floor(bound / 2); index <= bound && index < arr.length; index++) {
      eliminated.add(index);
    }

    bound *= 2;
  }

  let left = Math.floor(bound / 2) + 1;
  let right = Math.min(bound, arr.length - 1);

  steps.push(makeSearchStep(arr, Array.from({ length: right - left + 1 }, (_, index) => left + index), [...eliminated], null, `Binary Search inside range [${left}..${right}].`, checks));

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    checks++;

    steps.push(makeSearchStep(arr, [left, mid, right], [...eliminated], null, `Check middle index ${mid}, value ${arr[mid]}.`, checks));

    if (arr[mid] === target) {
      steps.push(makeSearchStep(arr, [mid], [...eliminated], mid, `Found ${target} at sorted index ${mid}.`, checks));
      return steps;
    }

    if (arr[mid] < target) {
      for (let index = left; index <= mid; index++) eliminated.add(index);
      left = mid + 1;
    } else {
      for (let index = mid; index <= right; index++) eliminated.add(index);
      right = mid - 1;
    }
  }

  steps.push(makeSearchStep(arr, [], [...eliminated], null, `${target} was not found.`, checks));
  return steps;
}

function interpolationTrace(values: number[], target: number): SearchStep[] {
  const arr = [...values].sort((a, b) => a - b);
  const steps: SearchStep[] = [];
  const eliminated = new Set<number>();
  let checks = 0;
  let low = 0;
  let high = arr.length - 1;

  steps.push(makeSearchStep(arr, [], [], null, `Interpolation Search estimates where ${target} should be based on value range.`, checks));

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    let pos = low;

    if (arr[high] !== arr[low]) {
      pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));
    }

    pos = Math.max(low, Math.min(high, pos));
    checks++;

    steps.push(
      makeSearchStep(
        arr,
        [low, pos, high],
        [...eliminated],
        null,
        `Estimate position ${pos} inside range [${low}..${high}]. Check value ${arr[pos]}.`,
        checks,
      ),
    );

    if (arr[pos] === target) {
      steps.push(makeSearchStep(arr, [pos], [...eliminated], pos, `Found ${target} at sorted index ${pos}.`, checks));
      return steps;
    }

    if (arr[pos] < target) {
      for (let index = low; index <= pos; index++) eliminated.add(index);
      steps.push(makeSearchStep(arr, [pos], [...eliminated], null, `${arr[pos]} is smaller than ${target}. Eliminate left side.`, checks));
      low = pos + 1;
    } else {
      for (let index = pos; index <= high; index++) eliminated.add(index);
      steps.push(makeSearchStep(arr, [pos], [...eliminated], null, `${arr[pos]} is larger than ${target}. Eliminate right side.`, checks));
      high = pos - 1;
    }
  }

  steps.push(makeSearchStep(arr, [], [...eliminated], null, `${target} was not found.`, checks));
  return steps;
}

function ternaryTrace(values: number[], target: number): SearchStep[] {
  const arr = [...values].sort((a, b) => a - b);
  const steps: SearchStep[] = [];
  const eliminated = new Set<number>();
  let checks = 0;
  let left = 0;
  let right = arr.length - 1;

  steps.push(makeSearchStep(arr, [], [], null, `Ternary Search splits the sorted range into three parts while looking for ${target}.`, checks));

  while (left <= right) {
    const third = Math.floor((right - left) / 3);
    const mid1 = left + third;
    const mid2 = right - third;

    checks += 2;

    steps.push(
      makeSearchStep(
        arr,
        [left, mid1, mid2, right],
        [...eliminated],
        null,
        `Check two split points: index ${mid1} = ${arr[mid1]} and index ${mid2} = ${arr[mid2]}.`,
        checks,
      ),
    );

    if (arr[mid1] === target) {
      steps.push(makeSearchStep(arr, [mid1], [...eliminated], mid1, `Found ${target} at sorted index ${mid1}.`, checks));
      return steps;
    }

    if (arr[mid2] === target) {
      steps.push(makeSearchStep(arr, [mid2], [...eliminated], mid2, `Found ${target} at sorted index ${mid2}.`, checks));
      return steps;
    }

    if (target < arr[mid1]) {
      for (let index = mid1; index <= right; index++) eliminated.add(index);
      steps.push(makeSearchStep(arr, [mid1], [...eliminated], null, `${target} is before the first split. Keep left third.`, checks));
      right = mid1 - 1;
    } else if (target > arr[mid2]) {
      for (let index = left; index <= mid2; index++) eliminated.add(index);
      steps.push(makeSearchStep(arr, [mid2], [...eliminated], null, `${target} is after the second split. Keep right third.`, checks));
      left = mid2 + 1;
    } else {
      for (let index = left; index <= mid1; index++) eliminated.add(index);
      for (let index = mid2; index <= right; index++) eliminated.add(index);
      steps.push(makeSearchStep(arr, [mid1, mid2], [...eliminated], null, `${target} is between the split points. Keep middle third.`, checks));
      left = mid1 + 1;
      right = mid2 - 1;
    }
  }

  steps.push(makeSearchStep(arr, [], [...eliminated], null, `${target} was not found.`, checks));
  return steps;
}

function fibonacciTrace(values: number[], target: number): SearchStep[] {
  const arr = [...values].sort((a, b) => a - b);
  const steps: SearchStep[] = [];
  const eliminated = new Set<number>();
  let checks = 0;

  let fibMm2 = 0;
  let fibMm1 = 1;
  let fibM = fibMm2 + fibMm1;

  while (fibM < arr.length) {
    fibMm2 = fibMm1;
    fibMm1 = fibM;
    fibM = fibMm2 + fibMm1;
  }

  let offset = -1;

  steps.push(makeSearchStep(arr, [], [], null, `Fibonacci Search uses Fibonacci jumps to search for ${target} in a sorted array.`, checks));

  while (fibM > 1) {
    const i = Math.min(offset + fibMm2, arr.length - 1);
    checks++;

    steps.push(
      makeSearchStep(
        arr,
        [i],
        [...eliminated],
        null,
        `Check index ${i} using Fibonacci jump. Value is ${arr[i]}.`,
        checks,
      ),
    );

    if (arr[i] < target) {
      for (let index = offset + 1; index <= i; index++) eliminated.add(index);
      fibM = fibMm1;
      fibMm1 = fibMm2;
      fibMm2 = fibM - fibMm1;
      offset = i;
      steps.push(makeSearchStep(arr, [i], [...eliminated], null, `${arr[i]} is smaller. Move offset to ${offset}.`, checks));
    } else if (arr[i] > target) {
      for (let index = i; index < arr.length; index++) {
        if (index <= offset + fibM) eliminated.add(index);
      }
      fibM = fibMm2;
      fibMm1 = fibMm1 - fibMm2;
      fibMm2 = fibM - fibMm1;
      steps.push(makeSearchStep(arr, [i], [...eliminated], null, `${arr[i]} is larger. Shrink the Fibonacci range leftward.`, checks));
    } else {
      steps.push(makeSearchStep(arr, [i], [...eliminated], i, `Found ${target} at sorted index ${i}.`, checks));
      return steps;
    }
  }

  if (fibMm1 && offset + 1 < arr.length) {
    checks++;
    const last = offset + 1;

    steps.push(makeSearchStep(arr, [last], [...eliminated], null, `Check final candidate index ${last}.`, checks));

    if (arr[last] === target) {
      steps.push(makeSearchStep(arr, [last], [...eliminated], last, `Found ${target} at sorted index ${last}.`, checks));
      return steps;
    }
  }

  steps.push(makeSearchStep(arr, [], [...eliminated], null, `${target} was not found.`, checks));
  return steps;
}

function quickselectTrace(values: number[], target: number): SearchStep[] {
  const arr = [...values];
  const steps: SearchStep[] = [];
  const eliminated = new Set<number>();
  let checks = 0;
  const k = Math.max(0, Math.min(arr.length - 1, target - 1));

  steps.push(
    makeSearchStep(
      arr,
      [],
      [],
      null,
      `Quickselect finds the kth smallest value. Target input ${target} means k = ${k + 1}.`,
      checks,
    ),
  );

  function partition(left: number, right: number) {
    const pivot = arr[right];
    let store = left;

    steps.push(makeSearchStep(arr, [right], [...eliminated], null, `Choose pivot ${pivot} at index ${right}.`, checks));

    for (let i = left; i < right; i++) {
      checks++;
      steps.push(makeSearchStep(arr, [i, right], [...eliminated], null, `Compare ${arr[i]} with pivot ${pivot}.`, checks));

      if (arr[i] < pivot) {
        [arr[store], arr[i]] = [arr[i], arr[store]];
        steps.push(makeSearchStep(arr, [store, i], [...eliminated], null, `Move ${arr[store]} into the lower partition.`, checks));
        store++;
      }
    }

    [arr[store], arr[right]] = [arr[right], arr[store]];
    steps.push(makeSearchStep(arr, [store], [...eliminated], null, `Place pivot into final partition index ${store}.`, checks));

    return store;
  }

  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const pivotIndex = partition(left, right);

    if (pivotIndex === k) {
      steps.push(makeSearchStep(arr, [pivotIndex], [...eliminated], pivotIndex, `Found kth smallest value ${arr[pivotIndex]} at index ${pivotIndex}.`, checks));
      return steps;
    }

    if (pivotIndex < k) {
      for (let index = left; index <= pivotIndex; index++) eliminated.add(index);
      steps.push(makeSearchStep(arr, [pivotIndex], [...eliminated], null, `k is to the right of pivot index ${pivotIndex}.`, checks));
      left = pivotIndex + 1;
    } else {
      for (let index = pivotIndex; index <= right; index++) eliminated.add(index);
      steps.push(makeSearchStep(arr, [pivotIndex], [...eliminated], null, `k is to the left of pivot index ${pivotIndex}.`, checks));
      right = pivotIndex - 1;
    }
  }

  steps.push(makeSearchStep(arr, [], [...eliminated], null, "Quickselect did not find a value.", checks));
  return steps;
}

export function getSearchTrace(algorithm: SearchAlgorithm, values: number[], target: number): SearchStep[] {
  if (algorithm === "linear") return linearTrace(values, target);
  if (algorithm === "binary") return binaryTrace(values, target);
  if (algorithm === "jump") return jumpTrace(values, target);
  if (algorithm === "exponential") return exponentialTrace(values, target);
  if (algorithm === "interpolation") return interpolationTrace(values, target);
  if (algorithm === "ternary") return ternaryTrace(values, target);
  if (algorithm === "fibonacci") return fibonacciTrace(values, target);
  return quickselectTrace(values, target);
}
