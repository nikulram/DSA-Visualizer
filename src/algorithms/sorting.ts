export type SortAlgorithm = "bubble" | "insertion" | "selection" | "merge" | "quick" | "heap" | "counting" | "radix" | "bucket" | "shell" | "cocktail" | "comb" | "cycle" | "pigeonhole" | "pancake" | "exchange" | "gnome" | "oddEven" | "binaryInsertion" | "stooge" | "bead" | "tim" | "intro" | "bogo" | "strand" | "bitonic" | "smooth";

export type SortStep = {
  array: number[];
  active: number[];
  sorted: number[];
  message: string;
  comparisons: number;
  moves: number;
};

export const sortLabels: Record<SortAlgorithm, string> = {
  bubble: "Bubble Sort",
  insertion: "Insertion Sort",
  selection: "Selection Sort",
  merge: "Merge Sort",
  quick: "Quick Sort",
  heap: "Heap Sort",
  counting: "Counting Sort",
  radix: "Radix Sort",
  bucket: "Bucket Sort",
  shell: "Shell Sort",
  cocktail: "Cocktail Sort",
  comb: "Comb Sort",
  cycle: "Cycle Sort",
  pigeonhole: "Pigeonhole Sort",
  pancake: "Pancake Sort",
  exchange: "Exchange Sort",
  gnome: "Gnome Sort",
  oddEven: "Odd-Even Sort",
  binaryInsertion: "Binary Insertion Sort",
  stooge: "Stooge Sort",
  bead: "Bead Sort",
  tim: "TimSort",
  intro: "IntroSort",
  bogo: "Bogo Sort",
  strand: "Strand Sort",
  bitonic: "Bitonic Sort",
  smooth: "Smoothsort",
};

function makeSortStep(
  array: number[],
  active: number[],
  sorted: number[],
  message: string,
  comparisons: number,
  moves: number,
): SortStep {
  return {
    array: [...array],
    active: [...active],
    sorted: [...sorted],
    message,
    comparisons,
    moves,
  };
}

function bubbleTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;

  steps.push(makeSortStep(arr, [], [], "Start from the left. Compare neighboring values.", comparisons, moves));

  for (let i = 0; i < arr.length - 1; i++) {
    let changed = false;

    for (let j = 0; j < arr.length - i - 1; j++) {
      comparisons++;
      steps.push(makeSortStep(arr, [j, j + 1], [...sorted], "Compare the two highlighted values.", comparisons, moves));

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        moves++;
        changed = true;
        steps.push(makeSortStep(arr, [j, j + 1], [...sorted], "Swap them because the left value is larger.", comparisons, moves));
      }
    }

    sorted.add(arr.length - i - 1);
    steps.push(makeSortStep(arr, [], [...sorted], "The largest remaining value is now finalized.", comparisons, moves));

    if (!changed) break;
  }

  for (let i = 0; i < arr.length; i++) sorted.add(i);
  steps.push(makeSortStep(arr, [], [...sorted], "Sorting complete.", comparisons, moves));
  return steps;
}

function insertionTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let moves = 0;

  steps.push(makeSortStep(arr, [], [0], "The first value starts as the sorted area.", comparisons, moves));

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push(makeSortStep(arr, [i], Array.from({ length: i }, (_, x) => x), "Pick the next value and insert it into the sorted area.", comparisons, moves));

    while (j >= 0) {
      comparisons++;
      steps.push(makeSortStep(arr, [j, j + 1], Array.from({ length: i }, (_, x) => x), "Compare with the sorted area.", comparisons, moves));

      if (arr[j] <= key) break;

      arr[j + 1] = arr[j];
      moves++;
      steps.push(makeSortStep(arr, [j, j + 1], Array.from({ length: i }, (_, x) => x), "Shift the larger value to the right.", comparisons, moves));
      j--;
    }

    arr[j + 1] = key;
    moves++;
    steps.push(makeSortStep(arr, [j + 1], Array.from({ length: i + 1 }, (_, x) => x), "Place the picked value in its correct position.", comparisons, moves));
  }

  steps.push(makeSortStep(arr, [], Array.from({ length: arr.length }, (_, x) => x), "Sorting complete.", comparisons, moves));
  return steps;
}

function selectionTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;

  steps.push(makeSortStep(arr, [], [], "Find the smallest value in the unsorted area.", comparisons, moves));

  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < arr.length; j++) {
      comparisons++;
      steps.push(makeSortStep(arr, [minIndex, j], [...sorted], "Compare the current minimum with the next value.", comparisons, moves));

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        steps.push(makeSortStep(arr, [minIndex], [...sorted], "A new minimum was found.", comparisons, moves));
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      moves++;
      steps.push(makeSortStep(arr, [i, minIndex], [...sorted], "Move the minimum into the sorted area.", comparisons, moves));
    }

    sorted.add(i);
  }

  for (let i = 0; i < arr.length; i++) sorted.add(i);
  steps.push(makeSortStep(arr, [], [...sorted], "Sorting complete.", comparisons, moves));
  return steps;
}

function mergeTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let moves = 0;

  steps.push(makeSortStep(arr, [], [], "Merge Sort starts by recursively splitting the array into smaller halves.", comparisons, moves));

  function merge(left: number, mid: number, right: number) {
    const leftPart = arr.slice(left, mid + 1);
    const rightPart = arr.slice(mid + 1, right + 1);

    steps.push(makeSortStep(arr, Array.from({ length: right - left + 1 }, (_, index) => left + index), [], `Merge the sorted ranges [${left}..${mid}] and [${mid + 1}..${right}].`, comparisons, moves));

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftPart.length && j < rightPart.length) {
      comparisons++;
      const leftIndex = left + i;
      const rightIndex = mid + 1 + j;

      steps.push(makeSortStep(arr, [leftIndex, rightIndex], [], `Compare ${leftPart[i]} and ${rightPart[j]}. Smaller value goes into position ${k}.`, comparisons, moves));

      if (leftPart[i] <= rightPart[j]) {
        arr[k] = leftPart[i];
        i++;
      } else {
        arr[k] = rightPart[j];
        j++;
      }

      moves++;
      steps.push(makeSortStep(arr, [k], [], `Write the next sorted value into index ${k}.`, comparisons, moves));
      k++;
    }

    while (i < leftPart.length) {
      arr[k] = leftPart[i];
      moves++;
      steps.push(makeSortStep(arr, [k], [], `Copy remaining left value ${leftPart[i]} into index ${k}.`, comparisons, moves));
      i++;
      k++;
    }

    while (j < rightPart.length) {
      arr[k] = rightPart[j];
      moves++;
      steps.push(makeSortStep(arr, [k], [], `Copy remaining right value ${rightPart[j]} into index ${k}.`, comparisons, moves));
      j++;
      k++;
    }

    steps.push(makeSortStep(arr, [], Array.from({ length: right - left + 1 }, (_, index) => left + index), `Range [${left}..${right}] is now sorted.`, comparisons, moves));
  }

  function divide(left: number, right: number) {
    if (left >= right) {
      steps.push(makeSortStep(arr, [left], [left], `Single value at index ${left} is already sorted.`, comparisons, moves));
      return;
    }

    const mid = Math.floor((left + right) / 2);

    steps.push(makeSortStep(arr, Array.from({ length: right - left + 1 }, (_, index) => left + index), [], `Split range [${left}..${right}] into [${left}..${mid}] and [${mid + 1}..${right}].`, comparisons, moves));

    divide(left, mid);
    divide(mid + 1, right);
    merge(left, mid, right);
  }

  divide(0, arr.length - 1);

  steps.push(makeSortStep(arr, [], Array.from({ length: arr.length }, (_, index) => index), "Merge Sort complete.", comparisons, moves));
  return steps;
}

function quickTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;

  steps.push(makeSortStep(arr, [], [], "Quick Sort chooses a pivot and partitions values around it.", comparisons, moves));

  function partition(low: number, high: number) {
    const pivot = arr[high];
    let i = low - 1;

    steps.push(makeSortStep(arr, [high], [...sorted], `Choose ${pivot} at index ${high} as the pivot.`, comparisons, moves));

    for (let j = low; j < high; j++) {
      comparisons++;
      steps.push(makeSortStep(arr, [j, high], [...sorted], `Compare ${arr[j]} with pivot ${pivot}.`, comparisons, moves));

      if (arr[j] <= pivot) {
        i++;

        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          moves++;
          steps.push(makeSortStep(arr, [i, j], [...sorted], `Move ${arr[i]} to the left side of the pivot.`, comparisons, moves));
        } else {
          steps.push(makeSortStep(arr, [i], [...sorted], `${arr[i]} already belongs on the left side.`, comparisons, moves));
        }
      }
    }

    if (i + 1 !== high) {
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      moves++;
    }

    sorted.add(i + 1);
    steps.push(makeSortStep(arr, [i + 1], [...sorted], `Place pivot ${arr[i + 1]} into its final sorted position.`, comparisons, moves));

    return i + 1;
  }

  function quickSort(low: number, high: number) {
    if (low > high) return;

    if (low === high) {
      sorted.add(low);
      steps.push(makeSortStep(arr, [low], [...sorted], `Single value ${arr[low]} is already sorted.`, comparisons, moves));
      return;
    }

    steps.push(makeSortStep(arr, Array.from({ length: high - low + 1 }, (_, index) => low + index), [...sorted], `Partition range [${low}..${high}].`, comparisons, moves));

    const pivotIndex = partition(low, high);
    quickSort(low, pivotIndex - 1);
    quickSort(pivotIndex + 1, high);
  }

  quickSort(0, arr.length - 1);

  for (let index = 0; index < arr.length; index++) sorted.add(index);
  steps.push(makeSortStep(arr, [], [...sorted], "Quick Sort complete.", comparisons, moves));

  return steps;
}

function heapTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;

  steps.push(
    makeSortStep(
      arr,
      [],
      [],
      "Heap Sort first builds a max heap, then repeatedly moves the largest value to the end.",
      comparisons,
      moves,
    ),
  );

  function heapify(heapSize: number, rootIndex: number) {
    let largest = rootIndex;
    const left = rootIndex * 2 + 1;
    const right = rootIndex * 2 + 2;

    steps.push(
      makeSortStep(
        arr,
        [rootIndex],
        [...sorted],
        `Heapify subtree rooted at index ${rootIndex}.`,
        comparisons,
        moves,
      ),
    );

    if (left < heapSize) {
      comparisons++;
      steps.push(
        makeSortStep(
          arr,
          [largest, left],
          [...sorted],
          `Compare left child ${arr[left]} with current largest ${arr[largest]}.`,
          comparisons,
          moves,
        ),
      );

      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < heapSize) {
      comparisons++;
      steps.push(
        makeSortStep(
          arr,
          [largest, right],
          [...sorted],
          `Compare right child ${arr[right]} with current largest ${arr[largest]}.`,
          comparisons,
          moves,
        ),
      );

      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== rootIndex) {
      [arr[rootIndex], arr[largest]] = [arr[largest], arr[rootIndex]];
      moves++;

      steps.push(
        makeSortStep(
          arr,
          [rootIndex, largest],
          [...sorted],
          `Swap so the largest value rises toward the root.`,
          comparisons,
          moves,
        ),
      );

      heapify(heapSize, largest);
    } else {
      steps.push(
        makeSortStep(
          arr,
          [rootIndex],
          [...sorted],
          `Subtree rooted at index ${rootIndex} already satisfies max-heap order.`,
          comparisons,
          moves,
        ),
      );
    }
  }

  const n = arr.length;

  steps.push(
    makeSortStep(
      arr,
      [],
      [],
      "Build max heap from the bottom non-leaf nodes upward.",
      comparisons,
      moves,
    ),
  );

  for (let index = Math.floor(n / 2) - 1; index >= 0; index--) {
    heapify(n, index);
  }

  steps.push(
    makeSortStep(
      arr,
      [0],
      [],
      "Max heap is built. The largest value is at the root.",
      comparisons,
      moves,
    ),
  );

  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    moves++;
    sorted.add(end);

    steps.push(
      makeSortStep(
        arr,
        [0, end],
        [...sorted],
        `Move largest value ${arr[end]} to final index ${end}.`,
        comparisons,
        moves,
      ),
    );

    heapify(end, 0);
  }

  sorted.add(0);

  steps.push(
    makeSortStep(
      arr,
      [],
      [...sorted],
      "Heap Sort complete.",
      comparisons,
      moves,
    ),
  );

  return steps;
}

function countingTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let moves = 0;

  if (arr.length === 0) {
    return [makeSortStep(arr, [], [], "No values to sort.", comparisons, moves)];
  }

  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const count = new Map<number, number>();
  const sorted = new Set<number>();

  steps.push(
    makeSortStep(
      arr,
      [],
      [],
      `Counting Sort scans values and creates frequency buckets from ${min} to ${max}.`,
      comparisons,
      moves,
    ),
  );

  for (let index = 0; index < arr.length; index++) {
    const value = arr[index];
    count.set(value, (count.get(value) ?? 0) + 1);
    moves++;

    steps.push(
      makeSortStep(
        arr,
        [index],
        [],
        `Count ${value}. Frequency of ${value} is now ${count.get(value)}.`,
        comparisons,
        moves,
      ),
    );
  }

  steps.push(
    makeSortStep(
      arr,
      [],
      [],
      "Counting phase complete. Now rewrite the array in sorted order using the frequencies.",
      comparisons,
      moves,
    ),
  );

  let writeIndex = 0;

  for (let value = min; value <= max; value++) {
    const frequency = count.get(value) ?? 0;

    if (frequency === 0) {
      steps.push(
        makeSortStep(
          arr,
          [],
          [...sorted],
          `Skip ${value} because its frequency is 0.`,
          comparisons,
          moves,
        ),
      );
      continue;
    }

    steps.push(
      makeSortStep(
        arr,
        [],
        [...sorted],
        `Write value ${value} exactly ${frequency} time${frequency === 1 ? "" : "s"}.`,
        comparisons,
        moves,
      ),
    );

    for (let repeat = 0; repeat < frequency; repeat++) {
      arr[writeIndex] = value;
      sorted.add(writeIndex);
      moves++;

      steps.push(
        makeSortStep(
          arr,
          [writeIndex],
          [...sorted],
          `Place ${value} at index ${writeIndex}.`,
          comparisons,
          moves,
        ),
      );

      writeIndex++;
    }
  }

  steps.push(
    makeSortStep(
      arr,
      [],
      Array.from({ length: arr.length }, (_, index) => index),
      "Counting Sort complete. The array was rebuilt directly from frequency counts.",
      comparisons,
      moves,
    ),
  );

  return steps;
}


function radixTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let moves = 0;

  if (arr.length === 0) {
    return [makeSortStep(arr, [], [], "No values to sort.", comparisons, moves)];
  }

  if (arr.some((value) => value < 0)) {
    return [
      makeSortStep(
        arr,
        [],
        [],
        "Radix Sort in this visual mode supports non-negative integers only.",
        comparisons,
        moves,
      ),
    ];
  }

  const max = Math.max(...arr);

  steps.push(
    makeSortStep(
      arr,
      [],
      [],
      "Radix Sort sorts numbers digit by digit, starting from the ones place.",
      comparisons,
      moves,
    ),
  );

  for (let place = 1; Math.floor(max / place) > 0; place *= 10) {
    const buckets: number[][] = Array.from({ length: 10 }, () => []);

    steps.push(
      makeSortStep(
        arr,
        [],
        [],
        `Start digit pass for place value ${place}.`,
        comparisons,
        moves,
      ),
    );

    for (let index = 0; index < arr.length; index++) {
      const digit = Math.floor(arr[index] / place) % 10;
      buckets[digit].push(arr[index]);
      moves++;

      steps.push(
        makeSortStep(
          arr,
          [index],
          [],
          `Read ${arr[index]}. Its digit at place ${place} is ${digit}, so it goes to bucket ${digit}.`,
          comparisons,
          moves,
        ),
      );
    }

    let writeIndex = 0;

    for (let bucketIndex = 0; bucketIndex < buckets.length; bucketIndex++) {
      if (buckets[bucketIndex].length === 0) {
        steps.push(
          makeSortStep(
            arr,
            [],
            [],
            `Bucket ${bucketIndex} is empty. Skip it.`,
            comparisons,
            moves,
          ),
        );
        continue;
      }

      steps.push(
        makeSortStep(
          arr,
          [],
          [],
          `Write back all values from bucket ${bucketIndex}.`,
          comparisons,
          moves,
        ),
      );

      for (const value of buckets[bucketIndex]) {
        arr[writeIndex] = value;
        moves++;

        steps.push(
          makeSortStep(
            arr,
            [writeIndex],
            [],
            `Place ${value} back into index ${writeIndex}.`,
            comparisons,
            moves,
          ),
        );

        writeIndex++;
      }
    }

    steps.push(
      makeSortStep(
        arr,
        [],
        [],
        `Digit pass for place ${place} complete.`,
        comparisons,
        moves,
      ),
    );
  }

  steps.push(
    makeSortStep(
      arr,
      [],
      Array.from({ length: arr.length }, (_, index) => index),
      "Radix Sort complete.",
      comparisons,
      moves,
    ),
  );

  return steps;
}

function bucketTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let moves = 0;

  if (arr.length === 0) {
    return [makeSortStep(arr, [], [], "No values to sort.", comparisons, moves)];
  }

  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const bucketCount = Math.min(6, Math.max(2, Math.ceil(Math.sqrt(arr.length))));
  const bucketRange = Math.max(1, Math.ceil((max - min + 1) / bucketCount));
  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

  steps.push(
    makeSortStep(
      arr,
      [],
      [],
      `Bucket Sort creates ${bucketCount} buckets from value range ${min} to ${max}.`,
      comparisons,
      moves,
    ),
  );

  for (let index = 0; index < arr.length; index++) {
    const value = arr[index];
    const bucketIndex = Math.min(bucketCount - 1, Math.floor((value - min) / bucketRange));
    buckets[bucketIndex].push(value);
    moves++;

    steps.push(
      makeSortStep(
        arr,
        [index],
        [],
        `Place ${value} into bucket ${bucketIndex}.`,
        comparisons,
        moves,
      ),
    );
  }

  let writeIndex = 0;
  const sorted = new Set<number>();

  for (let bucketIndex = 0; bucketIndex < buckets.length; bucketIndex++) {
    const bucket = buckets[bucketIndex];

    steps.push(
      makeSortStep(
        arr,
        [],
        [...sorted],
        bucket.length === 0
          ? `Bucket ${bucketIndex} is empty.`
          : `Sort bucket ${bucketIndex}: [${bucket.join(", ")}].`,
        comparisons,
        moves,
      ),
    );

    for (let i = 1; i < bucket.length; i++) {
      const key = bucket[i];
      let j = i - 1;

      while (j >= 0) {
        comparisons++;

        steps.push(
          makeSortStep(
            arr,
            [],
            [...sorted],
            `Inside bucket ${bucketIndex}, compare ${bucket[j]} with ${key}.`,
            comparisons,
            moves,
          ),
        );

        if (bucket[j] <= key) break;

        bucket[j + 1] = bucket[j];
        moves++;
        j--;
      }

      bucket[j + 1] = key;
      moves++;
    }

    for (const value of bucket) {
      arr[writeIndex] = value;
      sorted.add(writeIndex);
      moves++;

      steps.push(
        makeSortStep(
          arr,
          [writeIndex],
          [...sorted],
          `Write ${value} from bucket ${bucketIndex} back to index ${writeIndex}.`,
          comparisons,
          moves,
        ),
      );

      writeIndex++;
    }
  }

  steps.push(
    makeSortStep(
      arr,
      [],
      Array.from({ length: arr.length }, (_, index) => index),
      "Bucket Sort complete.",
      comparisons,
      moves,
    ),
  );

  return steps;
}

function shellTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let moves = 0;

  steps.push(
    makeSortStep(
      arr,
      [],
      [],
      "Shell Sort starts with a large gap, then reduces the gap until it becomes normal insertion sort.",
      comparisons,
      moves,
    ),
  );

  let gap = Math.floor(arr.length / 2);

  while (gap > 0) {
    steps.push(
      makeSortStep(
        arr,
        [],
        [],
        `Start a gapped insertion pass with gap = ${gap}.`,
        comparisons,
        moves,
      ),
    );

    for (let i = gap; i < arr.length; i++) {
      const temp = arr[i];
      let j = i;

      steps.push(
        makeSortStep(
          arr,
          [i],
          [],
          `Pick ${temp} at index ${i}. Compare it with values ${gap} positions behind.`,
          comparisons,
          moves,
        ),
      );

      while (j >= gap) {
        comparisons++;

        steps.push(
          makeSortStep(
            arr,
            [j, j - gap],
            [],
            `Compare ${arr[j - gap]} at index ${j - gap} with picked value ${temp}.`,
            comparisons,
            moves,
          ),
        );

        if (arr[j - gap] <= temp) break;

        arr[j] = arr[j - gap];
        moves++;

        steps.push(
          makeSortStep(
            arr,
            [j, j - gap],
            [],
            `Shift ${arr[j]} forward by gap ${gap}.`,
            comparisons,
            moves,
          ),
        );

        j -= gap;
      }

      arr[j] = temp;
      moves++;

      steps.push(
        makeSortStep(
          arr,
          [j],
          [],
          `Place ${temp} at index ${j}.`,
          comparisons,
          moves,
        ),
      );
    }

    steps.push(
      makeSortStep(
        arr,
        [],
        [],
        `Gap ${gap} pass complete.`,
        comparisons,
        moves,
      ),
    );

    gap = Math.floor(gap / 2);
  }

  steps.push(
    makeSortStep(
      arr,
      [],
      Array.from({ length: arr.length }, (_, index) => index),
      "Shell Sort complete.",
      comparisons,
      moves,
    ),
  );

  return steps;
}

function cocktailTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;

  let start = 0;
  let end = arr.length - 1;
  let swapped = true;

  steps.push(
    makeSortStep(
      arr,
      [],
      [],
      "Cocktail Sort moves left to right, then right to left, shrinking both ends.",
      comparisons,
      moves,
    ),
  );

  while (swapped) {
    swapped = false;

    steps.push(
      makeSortStep(
        arr,
        Array.from({ length: end - start + 1 }, (_, index) => start + index),
        [...sorted],
        `Forward pass from index ${start} to ${end}.`,
        comparisons,
        moves,
      ),
    );

    for (let i = start; i < end; i++) {
      comparisons++;

      steps.push(
        makeSortStep(
          arr,
          [i, i + 1],
          [...sorted],
          `Compare ${arr[i]} and ${arr[i + 1]} moving forward.`,
          comparisons,
          moves,
        ),
      );

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        moves++;
        swapped = true;

        steps.push(
          makeSortStep(
            arr,
            [i, i + 1],
            [...sorted],
            "Swap because the left value is larger.",
            comparisons,
            moves,
          ),
        );
      }
    }

    sorted.add(end);

    steps.push(
      makeSortStep(
        arr,
        [end],
        [...sorted],
        `Largest remaining value is finalized at index ${end}.`,
        comparisons,
        moves,
      ),
    );

    if (!swapped) break;

    swapped = false;
    end--;

    steps.push(
      makeSortStep(
        arr,
        Array.from({ length: end - start + 1 }, (_, index) => start + index),
        [...sorted],
        `Backward pass from index ${end} to ${start}.`,
        comparisons,
        moves,
      ),
    );

    for (let i = end; i > start; i--) {
      comparisons++;

      steps.push(
        makeSortStep(
          arr,
          [i - 1, i],
          [...sorted],
          `Compare ${arr[i - 1]} and ${arr[i]} moving backward.`,
          comparisons,
          moves,
        ),
      );

      if (arr[i - 1] > arr[i]) {
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        moves++;
        swapped = true;

        steps.push(
          makeSortStep(
            arr,
            [i - 1, i],
            [...sorted],
            "Swap so the smaller value moves left.",
            comparisons,
            moves,
          ),
        );
      }
    }

    sorted.add(start);

    steps.push(
      makeSortStep(
        arr,
        [start],
        [...sorted],
        `Smallest remaining value is finalized at index ${start}.`,
        comparisons,
        moves,
      ),
    );

    start++;
  }

  for (let index = 0; index < arr.length; index++) {
    sorted.add(index);
  }

  steps.push(
    makeSortStep(
      arr,
      [],
      [...sorted],
      "Cocktail Sort complete.",
      comparisons,
      moves,
    ),
  );

  return steps;
}

function combTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;

  let gap = arr.length;
  const shrink = 1.3;
  let swapped = true;

  steps.push(
    makeSortStep(
      arr,
      [],
      [],
      "Comb Sort improves Bubble Sort by comparing values far apart first, then shrinking the gap.",
      comparisons,
      moves,
    ),
  );

  while (gap > 1 || swapped) {
    gap = Math.max(1, Math.floor(gap / shrink));
    swapped = false;

    steps.push(
      makeSortStep(
        arr,
        [],
        [...sorted],
        `Start pass with gap = ${gap}.`,
        comparisons,
        moves,
      ),
    );

    for (let i = 0; i + gap < arr.length; i++) {
      const j = i + gap;
      comparisons++;

      steps.push(
        makeSortStep(
          arr,
          [i, j],
          [...sorted],
          `Compare ${arr[i]} at index ${i} with ${arr[j]} at index ${j}.`,
          comparisons,
          moves,
        ),
      );

      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        swapped = true;
        moves++;

        steps.push(
          makeSortStep(
            arr,
            [i, j],
            [...sorted],
            `Swap because ${arr[j]} was larger than ${arr[i]}.`,
            comparisons,
            moves,
          ),
        );
      }
    }

    steps.push(
      makeSortStep(
        arr,
        [],
        [...sorted],
        `Gap ${gap} pass complete.`,
        comparisons,
        moves,
      ),
    );
  }

  for (let index = 0; index < arr.length; index++) {
    sorted.add(index);
  }

  steps.push(
    makeSortStep(
      arr,
      [],
      [...sorted],
      "Comb Sort complete.",
      comparisons,
      moves,
    ),
  );

  return steps;
}

function cycleTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;

  steps.push(
    makeSortStep(
      arr,
      [],
      [],
      "Cycle Sort places each value directly into its final position with minimal writes.",
      comparisons,
      moves,
    ),
  );

  for (let cycleStart = 0; cycleStart <= arr.length - 2; cycleStart++) {
    let item = arr[cycleStart];
    let position = cycleStart;

    steps.push(
      makeSortStep(
        arr,
        [cycleStart],
        [...sorted],
        `Start a cycle with value ${item} at index ${cycleStart}.`,
        comparisons,
        moves,
      ),
    );

    for (let i = cycleStart + 1; i < arr.length; i++) {
      comparisons++;

      steps.push(
        makeSortStep(
          arr,
          [cycleStart, i],
          [...sorted],
          `Check whether ${arr[i]} is smaller than ${item}.`,
          comparisons,
          moves,
        ),
      );

      if (arr[i] < item) {
        position++;
      }
    }

    if (position === cycleStart) {
      sorted.add(cycleStart);

      steps.push(
        makeSortStep(
          arr,
          [cycleStart],
          [...sorted],
          `${item} is already in its final position.`,
          comparisons,
          moves,
        ),
      );

      continue;
    }

    while (item === arr[position]) {
      position++;
    }

    if (position !== cycleStart) {
      [item, arr[position]] = [arr[position], item];
      moves++;
      sorted.add(position);

      steps.push(
        makeSortStep(
          arr,
          [position],
          [...sorted],
          `Place ${arr[position]} into its correct position at index ${position}.`,
          comparisons,
          moves,
        ),
      );
    }

    while (position !== cycleStart) {
      position = cycleStart;

      for (let i = cycleStart + 1; i < arr.length; i++) {
        comparisons++;

        steps.push(
          makeSortStep(
            arr,
            [cycleStart, i],
            [...sorted],
            `Find the correct position for carried value ${item}.`,
            comparisons,
            moves,
          ),
        );

        if (arr[i] < item) {
          position++;
        }
      }

      while (item === arr[position]) {
        position++;
      }

      [item, arr[position]] = [arr[position], item];
      moves++;
      sorted.add(position);

      steps.push(
        makeSortStep(
          arr,
          [position],
          [...sorted],
          `Rotate cycle and place ${arr[position]} at index ${position}.`,
          comparisons,
          moves,
        ),
      );
    }
  }

  for (let index = 0; index < arr.length; index++) {
    sorted.add(index);
  }

  steps.push(
    makeSortStep(
      arr,
      [],
      [...sorted],
      "Cycle Sort complete.",
      comparisons,
      moves,
    ),
  );

  return steps;
}

function pigeonholeTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;

  if (arr.length === 0) {
    return [makeSortStep(arr, [], [], "No values to sort.", comparisons, moves)];
  }

  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = max - min + 1;
  const holes = Array.from({ length: range }, () => 0);

  steps.push(
    makeSortStep(
      arr,
      [],
      [],
      `Pigeonhole Sort creates one hole for every value from ${min} to ${max}.`,
      comparisons,
      moves,
    ),
  );

  for (let index = 0; index < arr.length; index++) {
    const value = arr[index];
    holes[value - min]++;
    moves++;

    steps.push(
      makeSortStep(
        arr,
        [index],
        [],
        `Drop ${value} into hole ${value - min}. Count for ${value} is now ${holes[value - min]}.`,
        comparisons,
        moves,
      ),
    );
  }

  let writeIndex = 0;

  for (let holeIndex = 0; holeIndex < holes.length; holeIndex++) {
    const value = holeIndex + min;
    const count = holes[holeIndex];

    if (count === 0) {
      steps.push(
        makeSortStep(
          arr,
          [],
          [...sorted],
          `Hole for value ${value} is empty. Skip it.`,
          comparisons,
          moves,
        ),
      );
      continue;
    }

    steps.push(
      makeSortStep(
        arr,
        [],
        [...sorted],
        `Read hole for value ${value}. It contains ${count} item${count === 1 ? "" : "s"}.`,
        comparisons,
        moves,
      ),
    );

    for (let repeat = 0; repeat < count; repeat++) {
      arr[writeIndex] = value;
      sorted.add(writeIndex);
      moves++;

      steps.push(
        makeSortStep(
          arr,
          [writeIndex],
          [...sorted],
          `Write ${value} into index ${writeIndex}.`,
          comparisons,
          moves,
        ),
      );

      writeIndex++;
    }
  }

  steps.push(
    makeSortStep(
      arr,
      [],
      Array.from({ length: arr.length }, (_, index) => index),
      "Pigeonhole Sort complete.",
      comparisons,
      moves,
    ),
  );

  return steps;
}

function pancakeTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;

  function flip(end: number) {
    let left = 0;
    let right = end;

    steps.push(
      makeSortStep(
        arr,
        Array.from({ length: end + 1 }, (_, index) => index),
        [...sorted],
        `Flip the prefix from index 0 to index ${end}.`,
        comparisons,
        moves,
      ),
    );

    while (left < right) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      moves++;

      steps.push(
        makeSortStep(
          arr,
          [left, right],
          [...sorted],
          `Swap positions ${left} and ${right} during the flip.`,
          comparisons,
          moves,
        ),
      );

      left++;
      right--;
    }
  }

  steps.push(
    makeSortStep(
      arr,
      [],
      [],
      "Pancake Sort repeatedly flips prefixes to move the largest unsorted value to the end.",
      comparisons,
      moves,
    ),
  );

  for (let size = arr.length; size > 1; size--) {
    let maxIndex = 0;

    steps.push(
      makeSortStep(
        arr,
        Array.from({ length: size }, (_, index) => index),
        [...sorted],
        `Find the largest value in the unsorted prefix [0..${size - 1}].`,
        comparisons,
        moves,
      ),
    );

    for (let i = 1; i < size; i++) {
      comparisons++;

      steps.push(
        makeSortStep(
          arr,
          [maxIndex, i],
          [...sorted],
          `Compare current largest ${arr[maxIndex]} with ${arr[i]}.`,
          comparisons,
          moves,
        ),
      );

      if (arr[i] > arr[maxIndex]) {
        maxIndex = i;

        steps.push(
          makeSortStep(
            arr,
            [maxIndex],
            [...sorted],
            `New largest value is ${arr[maxIndex]} at index ${maxIndex}.`,
            comparisons,
            moves,
          ),
        );
      }
    }

    if (maxIndex !== size - 1) {
      if (maxIndex !== 0) {
        flip(maxIndex);
      }

      flip(size - 1);
    }

    sorted.add(size - 1);

    steps.push(
      makeSortStep(
        arr,
        [size - 1],
        [...sorted],
        `Largest remaining value is finalized at index ${size - 1}.`,
        comparisons,
        moves,
      ),
    );
  }

  sorted.add(0);

  steps.push(
    makeSortStep(
      arr,
      [],
      [...sorted],
      "Pancake Sort complete.",
      comparisons,
      moves,
    ),
  );

  return steps;
}

function exchangeTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;

  steps.push(makeSortStep(arr, [], [], "Exchange Sort compares every pair and swaps when the left value is larger.", comparisons, moves));

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      comparisons++;

      steps.push(
        makeSortStep(
          arr,
          [i, j],
          [...sorted],
          `Compare ${arr[i]} at index ${i} with ${arr[j]} at index ${j}.`,
          comparisons,
          moves,
        ),
      );

      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        moves++;

        steps.push(
          makeSortStep(
            arr,
            [i, j],
            [...sorted],
            "Swap because the left value is larger.",
            comparisons,
            moves,
          ),
        );
      }
    }

    sorted.add(i);
    steps.push(makeSortStep(arr, [i], [...sorted], `Index ${i} is now finalized.`, comparisons, moves));
  }

  sorted.add(arr.length - 1);
  steps.push(makeSortStep(arr, [], [...sorted], "Exchange Sort complete.", comparisons, moves));
  return steps;
}

function gnomeTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;
  let index = 0;

  steps.push(makeSortStep(arr, [], [], "Gnome Sort walks forward when ordered and steps backward after swaps.", comparisons, moves));

  while (index < arr.length) {
    if (index === 0) {
      steps.push(makeSortStep(arr, [index], [...sorted], "At the first index, move forward.", comparisons, moves));
      index++;
      continue;
    }

    comparisons++;
    steps.push(
      makeSortStep(
        arr,
        [index - 1, index],
        [...sorted],
        `Compare ${arr[index - 1]} and ${arr[index]}.`,
        comparisons,
        moves,
      ),
    );

    if (arr[index] >= arr[index - 1]) {
      steps.push(makeSortStep(arr, [index], [...sorted], "Pair is ordered, move forward.", comparisons, moves));
      index++;
    } else {
      [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
      moves++;

      steps.push(
        makeSortStep(
          arr,
          [index - 1, index],
          [...sorted],
          "Swap and step backward to keep fixing earlier values.",
          comparisons,
          moves,
        ),
      );

      index--;
    }
  }

  for (let i = 0; i < arr.length; i++) sorted.add(i);
  steps.push(makeSortStep(arr, [], [...sorted], "Gnome Sort complete.", comparisons, moves));
  return steps;
}

function oddEvenTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;
  let sortedPass = false;
  let pass = 1;

  steps.push(makeSortStep(arr, [], [], "Odd-Even Sort alternates odd-index and even-index neighbor comparisons.", comparisons, moves));

  while (!sortedPass) {
    sortedPass = true;

    steps.push(makeSortStep(arr, [], [...sorted], `Pass ${pass}: compare odd pairs.`, comparisons, moves));

    for (let i = 1; i <= arr.length - 2; i += 2) {
      comparisons++;

      steps.push(makeSortStep(arr, [i, i + 1], [...sorted], `Odd phase: compare indices ${i} and ${i + 1}.`, comparisons, moves));

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        moves++;
        sortedPass = false;

        steps.push(makeSortStep(arr, [i, i + 1], [...sorted], "Swap during odd phase.", comparisons, moves));
      }
    }

    steps.push(makeSortStep(arr, [], [...sorted], `Pass ${pass}: compare even pairs.`, comparisons, moves));

    for (let i = 0; i <= arr.length - 2; i += 2) {
      comparisons++;

      steps.push(makeSortStep(arr, [i, i + 1], [...sorted], `Even phase: compare indices ${i} and ${i + 1}.`, comparisons, moves));

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        moves++;
        sortedPass = false;

        steps.push(makeSortStep(arr, [i, i + 1], [...sorted], "Swap during even phase.", comparisons, moves));
      }
    }

    pass++;
  }

  for (let i = 0; i < arr.length; i++) sorted.add(i);
  steps.push(makeSortStep(arr, [], [...sorted], "Odd-Even Sort complete.", comparisons, moves));
  return steps;
}

function binaryInsertionTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let moves = 0;

  steps.push(makeSortStep(arr, [], [0], "Binary Insertion Sort uses binary search to find where each picked value belongs.", comparisons, moves));

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let left = 0;
    let right = i;

    steps.push(
      makeSortStep(
        arr,
        [i],
        Array.from({ length: i }, (_, index) => index),
        `Pick ${key} from index ${i}. Use binary search inside the sorted prefix.`,
        comparisons,
        moves,
      ),
    );

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      comparisons++;

      steps.push(
        makeSortStep(
          arr,
          [mid, i],
          Array.from({ length: i }, (_, index) => index),
          `Compare picked value ${key} with middle value ${arr[mid]} at index ${mid}.`,
          comparisons,
          moves,
        ),
      );

      if (key < arr[mid]) {
        right = mid;
        steps.push(makeSortStep(arr, [mid], Array.from({ length: i }, (_, index) => index), `Target position is left of index ${mid}.`, comparisons, moves));
      } else {
        left = mid + 1;
        steps.push(makeSortStep(arr, [mid], Array.from({ length: i }, (_, index) => index), `Target position is right of index ${mid}.`, comparisons, moves));
      }
    }

    for (let j = i; j > left; j--) {
      arr[j] = arr[j - 1];
      moves++;

      steps.push(
        makeSortStep(
          arr,
          [j - 1, j],
          Array.from({ length: i }, (_, index) => index),
          `Shift ${arr[j]} right to make room for ${key}.`,
          comparisons,
          moves,
        ),
      );
    }

    arr[left] = key;
    moves++;

    steps.push(
      makeSortStep(
        arr,
        [left],
        Array.from({ length: i + 1 }, (_, index) => index),
        `Insert ${key} at index ${left}.`,
        comparisons,
        moves,
      ),
    );
  }

  steps.push(makeSortStep(arr, [], Array.from({ length: arr.length }, (_, index) => index), "Binary Insertion Sort complete.", comparisons, moves));
  return steps;
}

function stoogeTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;

  steps.push(makeSortStep(arr, [], [], "Stooge Sort recursively sorts overlapping two-thirds sections.", comparisons, moves));

  function stooge(left: number, right: number) {
    if (left >= right) return;

    comparisons++;
    steps.push(makeSortStep(arr, [left, right], [...sorted], `Compare index ${left} and index ${right}.`, comparisons, moves));

    if (arr[left] > arr[right]) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      moves++;
      steps.push(makeSortStep(arr, [left, right], [...sorted], "Swap because the left value is larger.", comparisons, moves));
    }

    if (right - left + 1 > 2) {
      const third = Math.floor((right - left + 1) / 3);

      steps.push(makeSortStep(arr, Array.from({ length: right - left + 1 }, (_, i) => left + i), [...sorted], `Sort first two-thirds of range [${left}..${right}].`, comparisons, moves));
      stooge(left, right - third);

      steps.push(makeSortStep(arr, Array.from({ length: right - left + 1 }, (_, i) => left + i), [...sorted], `Sort last two-thirds of range [${left}..${right}].`, comparisons, moves));
      stooge(left + third, right);

      steps.push(makeSortStep(arr, Array.from({ length: right - left + 1 }, (_, i) => left + i), [...sorted], `Sort first two-thirds again for range [${left}..${right}].`, comparisons, moves));
      stooge(left, right - third);
    }
  }

  stooge(0, arr.length - 1);

  for (let i = 0; i < arr.length; i++) sorted.add(i);
  steps.push(makeSortStep(arr, [], [...sorted], "Stooge Sort complete.", comparisons, moves));
  return steps;
}

function beadTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;

  if (arr.some((value) => value < 0 || !Number.isInteger(value))) {
    return [makeSortStep(arr, [], [], "Bead Sort supports non-negative integers only.", comparisons, moves)];
  }

  const max = Math.max(...arr);

  steps.push(makeSortStep(arr, [], [], "Bead Sort represents each value as beads, lets beads fall by gravity, then reads the sorted values.", comparisons, moves));

  for (let level = 1; level <= max; level++) {
    const beadCount = arr.filter((value) => value >= level).length;
    comparisons += arr.length;

    steps.push(
      makeSortStep(
        arr,
        [],
        [...sorted],
        `Level ${level}: ${beadCount} value${beadCount === 1 ? "" : "s"} have a bead at this height.`,
        comparisons,
        moves,
      ),
    );
  }

  const result = [...arr].sort((a, b) => a - b);

  for (let index = 0; index < result.length; index++) {
    arr[index] = result[index];
    sorted.add(index);
    moves++;

    steps.push(
      makeSortStep(
        arr,
        [index],
        [...sorted],
        `Read gravity result and write ${result[index]} into index ${index}.`,
        comparisons,
        moves,
      ),
    );
  }

  steps.push(makeSortStep(arr, [], [...sorted], "Bead Sort complete.", comparisons, moves));
  return steps;
}

function timTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let moves = 0;
  const sorted = new Set<number>();
  const minRun = 4;

  steps.push(makeSortStep(arr, [], [], "TimSort finds small runs, sorts each run, then merges runs.", comparisons, moves));

  function insertionRun(left: number, right: number) {
    steps.push(makeSortStep(arr, Array.from({ length: right - left + 1 }, (_, i) => left + i), [...sorted], `Sort run [${left}..${right}] using insertion sort.`, comparisons, moves));

    for (let i = left + 1; i <= right; i++) {
      const key = arr[i];
      let j = i - 1;

      while (j >= left) {
        comparisons++;
        steps.push(makeSortStep(arr, [j, j + 1], [...sorted], `Inside run, compare ${arr[j]} with picked value ${key}.`, comparisons, moves));

        if (arr[j] <= key) break;

        arr[j + 1] = arr[j];
        moves++;
        steps.push(makeSortStep(arr, [j, j + 1], [...sorted], `Shift ${arr[j + 1]} right inside the run.`, comparisons, moves));
        j--;
      }

      arr[j + 1] = key;
      moves++;
      steps.push(makeSortStep(arr, [j + 1], [...sorted], `Place ${key} into the run.`, comparisons, moves));
    }
  }

  function merge(left: number, mid: number, right: number) {
    const leftPart = arr.slice(left, mid + 1);
    const rightPart = arr.slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;

    steps.push(makeSortStep(arr, Array.from({ length: right - left + 1 }, (_, x) => left + x), [...sorted], `Merge runs [${left}..${mid}] and [${mid + 1}..${right}].`, comparisons, moves));

    while (i < leftPart.length && j < rightPart.length) {
      comparisons++;
      steps.push(makeSortStep(arr, [left + i, mid + 1 + j], [...sorted], `Compare ${leftPart[i]} and ${rightPart[j]}.`, comparisons, moves));

      if (leftPart[i] <= rightPart[j]) {
        arr[k] = leftPart[i];
        i++;
      } else {
        arr[k] = rightPart[j];
        j++;
      }

      moves++;
      steps.push(makeSortStep(arr, [k], [...sorted], `Write next merged value into index ${k}.`, comparisons, moves));
      k++;
    }

    while (i < leftPart.length) {
      arr[k] = leftPart[i];
      moves++;
      steps.push(makeSortStep(arr, [k], [...sorted], `Copy remaining left run value ${leftPart[i]}.`, comparisons, moves));
      i++;
      k++;
    }

    while (j < rightPart.length) {
      arr[k] = rightPart[j];
      moves++;
      steps.push(makeSortStep(arr, [k], [...sorted], `Copy remaining right run value ${rightPart[j]}.`, comparisons, moves));
      j++;
      k++;
    }
  }

  for (let start = 0; start < arr.length; start += minRun) {
    insertionRun(start, Math.min(start + minRun - 1, arr.length - 1));
  }

  for (let size = minRun; size < arr.length; size *= 2) {
    for (let left = 0; left < arr.length; left += 2 * size) {
      const mid = Math.min(left + size - 1, arr.length - 1);
      const right = Math.min(left + 2 * size - 1, arr.length - 1);

      if (mid < right) {
        merge(left, mid, right);
      }
    }
  }

  for (let i = 0; i < arr.length; i++) sorted.add(i);
  steps.push(makeSortStep(arr, [], [...sorted], "TimSort complete.", comparisons, moves));
  return steps;
}

function introTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;
  const depthLimit = Math.max(1, Math.floor(2 * Math.log2(Math.max(2, arr.length))));

  steps.push(makeSortStep(arr, [], [], `IntroSort starts as Quick Sort with depth limit ${depthLimit}.`, comparisons, moves));

  function insertionRange(left: number, right: number) {
    steps.push(makeSortStep(arr, Array.from({ length: right - left + 1 }, (_, i) => left + i), [...sorted], `Use insertion fallback for small range [${left}..${right}].`, comparisons, moves));

    for (let i = left + 1; i <= right; i++) {
      const key = arr[i];
      let j = i - 1;

      while (j >= left) {
        comparisons++;
        steps.push(makeSortStep(arr, [j, j + 1], [...sorted], `Compare ${arr[j]} with ${key}.`, comparisons, moves));

        if (arr[j] <= key) break;

        arr[j + 1] = arr[j];
        moves++;
        steps.push(makeSortStep(arr, [j, j + 1], [...sorted], `Shift ${arr[j + 1]} right.`, comparisons, moves));
        j--;
      }

      arr[j + 1] = key;
      moves++;
      steps.push(makeSortStep(arr, [j + 1], [...sorted], `Place ${key}.`, comparisons, moves));
    }
  }

  function partition(low: number, high: number) {
    const pivot = arr[high];
    let i = low - 1;

    steps.push(makeSortStep(arr, [high], [...sorted], `Choose pivot ${pivot} for range [${low}..${high}].`, comparisons, moves));

    for (let j = low; j < high; j++) {
      comparisons++;
      steps.push(makeSortStep(arr, [j, high], [...sorted], `Compare ${arr[j]} with pivot ${pivot}.`, comparisons, moves));

      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          moves++;
          steps.push(makeSortStep(arr, [i, j], [...sorted], "Swap into pivot-left partition.", comparisons, moves));
        }
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    moves++;
    steps.push(makeSortStep(arr, [i + 1], [...sorted], `Place pivot at index ${i + 1}.`, comparisons, moves));

    return i + 1;
  }

  function intro(low: number, high: number, depth: number) {
    if (low >= high) {
      if (low === high) sorted.add(low);
      return;
    }

    if (high - low <= 4 || depth === 0) {
      insertionRange(low, high);
      for (let i = low; i <= high; i++) sorted.add(i);
      return;
    }

    steps.push(makeSortStep(arr, Array.from({ length: high - low + 1 }, (_, i) => low + i), [...sorted], `Quick partition range [${low}..${high}], depth remaining ${depth}.`, comparisons, moves));

    const pivotIndex = partition(low, high);
    sorted.add(pivotIndex);
    intro(low, pivotIndex - 1, depth - 1);
    intro(pivotIndex + 1, high, depth - 1);
  }

  intro(0, arr.length - 1, depthLimit);

  for (let i = 0; i < arr.length; i++) sorted.add(i);
  steps.push(makeSortStep(arr, [], [...sorted], "IntroSort complete.", comparisons, moves));
  return steps;
}

function isSortedAscending(values: number[]) {
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1] > values[i]) return false;
  }

  return true;
}

function deterministicShuffle(values: number[], seed: number) {
  const arr = [...values];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = (seed * 17 + i * 31) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function bogoTrace(input: number[]): SortStep[] {
  let arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let moves = 0;
  const sorted = new Set<number>();

  steps.push(
    makeSortStep(
      arr,
      [],
      [],
      "Bogo Sort repeatedly shuffles until the array is sorted. This visual caps attempts for safety.",
      comparisons,
      moves,
    ),
  );

  const maxAttempts = Math.min(120, Math.max(24, arr.length * arr.length * 2));

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    comparisons += Math.max(0, arr.length - 1);

    steps.push(
      makeSortStep(
        arr,
        [],
        [],
        `Attempt ${attempt}: check if the current order is sorted.`,
        comparisons,
        moves,
      ),
    );

    if (isSortedAscending(arr)) {
      for (let index = 0; index < arr.length; index++) sorted.add(index);

      steps.push(
        makeSortStep(
          arr,
          [],
          [...sorted],
          "Bogo Sort got lucky and found a sorted order.",
          comparisons,
          moves,
        ),
      );

      return steps;
    }

    arr = deterministicShuffle(arr, attempt);
    moves += arr.length;

    steps.push(
      makeSortStep(
        arr,
        Array.from({ length: arr.length }, (_, index) => index),
        [],
        "Shuffle the full array and try again.",
        comparisons,
        moves,
      ),
    );
  }

  const correct = [...arr].sort((a, b) => a - b);

  steps.push(
    makeSortStep(
      arr,
      [],
      [],
      "Attempt cap reached. To keep the visual usable, the demo now shows the sorted target order.",
      comparisons,
      moves,
    ),
  );

  for (let index = 0; index < arr.length; index++) {
    arr[index] = correct[index];
    sorted.add(index);
    moves++;

    steps.push(
      makeSortStep(
        arr,
        [index],
        [...sorted],
        `Demo completion: place ${arr[index]} at index ${index}.`,
        comparisons,
        moves,
      ),
    );
  }

  steps.push(makeSortStep(arr, [], [...sorted], "Bogo Sort demo complete.", comparisons, moves));
  return steps;
}

function strandTrace(input: number[]): SortStep[] {
  let inputList = [...input];
  const output: number[] = [];
  const display = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;

  steps.push(
    makeSortStep(
      display,
      [],
      [],
      "Strand Sort repeatedly pulls an increasing strand from the input, then merges it into the output.",
      comparisons,
      moves,
    ),
  );

  while (inputList.length > 0) {
    const strand: number[] = [inputList.shift()!];
    moves++;

    steps.push(
      makeSortStep(
        [...output, ...strand, ...inputList],
        [output.length],
        [...sorted],
        `Start a new strand with ${strand[0]}.`,
        comparisons,
        moves,
      ),
    );

    let index = 0;

    while (index < inputList.length) {
      comparisons++;

      steps.push(
        makeSortStep(
          [...output, ...strand, ...inputList],
          [output.length + strand.length + index],
          [...sorted],
          `Check if ${inputList[index]} can extend the increasing strand.`,
          comparisons,
          moves,
        ),
      );

      if (inputList[index] >= strand[strand.length - 1]) {
        const value = inputList.splice(index, 1)[0];
        strand.push(value);
        moves++;

        steps.push(
          makeSortStep(
            [...output, ...strand, ...inputList],
            [output.length + strand.length - 1],
            [...sorted],
            `Add ${value} to the current strand.`,
            comparisons,
            moves,
          ),
        );
      } else {
        index++;
      }
    }

    const merged: number[] = [];
    let i = 0;
    let j = 0;

    while (i < output.length && j < strand.length) {
      comparisons++;

      if (output[i] <= strand[j]) {
        merged.push(output[i]);
        i++;
      } else {
        merged.push(strand[j]);
        j++;
      }

      moves++;
      steps.push(
        makeSortStep(
          [...merged, ...output.slice(i), ...strand.slice(j), ...inputList],
          [merged.length - 1],
          Array.from({ length: merged.length }, (_, k) => k),
          "Merge strand into sorted output.",
          comparisons,
          moves,
        ),
      );
    }

    while (i < output.length) {
      merged.push(output[i]);
      i++;
      moves++;
    }

    while (j < strand.length) {
      merged.push(strand[j]);
      j++;
      moves++;
    }

    output.splice(0, output.length, ...merged);

    for (let k = 0; k < output.length; k++) sorted.add(k);

    steps.push(
      makeSortStep(
        [...output, ...inputList],
        [],
        [...sorted],
        `Current sorted output: [${output.join(", ")}].`,
        comparisons,
        moves,
      ),
    );
  }

  steps.push(makeSortStep(output, [], Array.from({ length: output.length }, (_, index) => index), "Strand Sort complete.", comparisons, moves));
  return steps;
}

function bitonicTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;

  steps.push(
    makeSortStep(
      arr,
      [],
      [],
      "Bitonic Sort builds bitonic sequences and merges them. This visual pads internally when length is not a power of two.",
      comparisons,
      moves,
    ),
  );

  const originalLength = arr.length;
  const size = 2 ** Math.ceil(Math.log2(Math.max(1, arr.length)));
  const padded = [...arr];

  while (padded.length < size) padded.push(Infinity);

  function syncVisible(active: number[], message: string) {
    for (let i = 0; i < originalLength; i++) {
      arr[i] = padded[i];
    }

    steps.push(
      makeSortStep(
        arr,
        active.filter((index) => index < originalLength),
        [...sorted],
        message,
        comparisons,
        moves,
      ),
    );
  }

  function compareAndSwap(i: number, j: number, ascending: boolean) {
    comparisons++;
    syncVisible([i, j], `Compare indices ${i} and ${j} for ${ascending ? "ascending" : "descending"} order.`);

    if ((ascending && padded[i] > padded[j]) || (!ascending && padded[i] < padded[j])) {
      [padded[i], padded[j]] = [padded[j], padded[i]];
      moves++;
      syncVisible([i, j], "Swap to satisfy bitonic direction.");
    }
  }

  for (let sequenceSize = 2; sequenceSize <= size; sequenceSize *= 2) {
    for (let subSize = sequenceSize / 2; subSize > 0; subSize = Math.floor(subSize / 2)) {
      for (let i = 0; i < size; i++) {
        const j = i ^ subSize;

        if (j > i) {
          const ascending = (i & sequenceSize) === 0;
          compareAndSwap(i, j, ascending);
        }
      }
    }
  }

  for (let index = 0; index < originalLength; index++) sorted.add(index);
  syncVisible([], "Bitonic Sort complete.");
  steps[steps.length - 1].sorted = [...sorted];

  return steps;
}

function smoothTrace(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let moves = 0;

  steps.push(
    makeSortStep(
      arr,
      [],
      [],
      "Smoothsort is heap-based. This educational visual uses Leonardo-style heap growth messages with heap-order extraction.",
      comparisons,
      moves,
    ),
  );

  function siftDown(start: number, end: number) {
    let root = start;

    while (root * 2 + 1 <= end) {
      const child = root * 2 + 1;
      let swapIndex = root;

      comparisons++;
      steps.push(makeSortStep(arr, [swapIndex, child], [...sorted], `Compare root ${arr[swapIndex]} with left child ${arr[child]}.`, comparisons, moves));

      if (arr[swapIndex] < arr[child]) {
        swapIndex = child;
      }

      if (child + 1 <= end) {
        comparisons++;
        steps.push(makeSortStep(arr, [swapIndex, child + 1], [...sorted], `Compare current candidate with right child ${arr[child + 1]}.`, comparisons, moves));

        if (arr[swapIndex] < arr[child + 1]) {
          swapIndex = child + 1;
        }
      }

      if (swapIndex === root) {
        steps.push(makeSortStep(arr, [root], [...sorted], "Heap order is satisfied for this root.", comparisons, moves));
        return;
      }

      [arr[root], arr[swapIndex]] = [arr[swapIndex], arr[root]];
      moves++;

      steps.push(makeSortStep(arr, [root, swapIndex], [...sorted], "Restore heap order by swapping downward.", comparisons, moves));
      root = swapIndex;
    }
  }

  for (let end = 0; end < arr.length; end++) {
    steps.push(makeSortStep(arr, [end], [...sorted], `Grow heap structure to include index ${end}.`, comparisons, moves));

    for (let start = Math.floor(end / 2); start >= 0; start--) {
      siftDown(start, end);
    }
  }

  for (let end = arr.length - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    sorted.add(end);
    moves++;

    steps.push(makeSortStep(arr, [0, end], [...sorted], `Move current maximum to final index ${end}.`, comparisons, moves));
    siftDown(0, end - 1);
  }

  sorted.add(0);
  steps.push(makeSortStep(arr, [], [...sorted], "Smoothsort visual complete.", comparisons, moves));
  return steps;
}

export function getSortTrace(algorithm: SortAlgorithm, values: number[]) {
  if (algorithm === "bubble") return bubbleTrace(values);
  if (algorithm === "insertion") return insertionTrace(values);
  if (algorithm === "selection") return selectionTrace(values);
  if (algorithm === "merge") return mergeTrace(values);
  if (algorithm === "quick") return quickTrace(values);
  if (algorithm === "heap") return heapTrace(values);
  if (algorithm === "counting") return countingTrace(values);
  if (algorithm === "radix") return radixTrace(values);
  if (algorithm === "bucket") return bucketTrace(values);
  if (algorithm === "shell") return shellTrace(values);
  if (algorithm === "cocktail") return cocktailTrace(values);
  if (algorithm === "comb") return combTrace(values);
  if (algorithm === "cycle") return cycleTrace(values);
  if (algorithm === "pigeonhole") return pigeonholeTrace(values);
  if (algorithm === "pancake") return pancakeTrace(values);
  if (algorithm === "exchange") return exchangeTrace(values);
  if (algorithm === "gnome") return gnomeTrace(values);
  if (algorithm === "oddEven") return oddEvenTrace(values);
  if (algorithm === "binaryInsertion") return binaryInsertionTrace(values);
  if (algorithm === "stooge") return stoogeTrace(values);
  if (algorithm === "bead") return beadTrace(values);
  if (algorithm === "tim") return timTrace(values);
  if (algorithm === "intro") return introTrace(values);
  if (algorithm === "bogo") return bogoTrace(values);
  if (algorithm === "strand") return strandTrace(values);
  if (algorithm === "bitonic") return bitonicTrace(values);
  return smoothTrace(values);
}
