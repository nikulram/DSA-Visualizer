export type TreeAlgorithm =
  | "treeBfs"
  | "preorder"
  | "inorder"
  | "postorder"
  | "bstInsert"
  | "bstSearch"
  | "bstDelete"
  | "treeSort"
  | "avlTree"
  | "redBlackTree"
  | "bTree"
  | "bPlusTreeSearch"
  | "trie"
  | "segmentTree"
  | "fenwickTree"
  | "suffixTree"
  | "suffixArray"
  | "minHeapInsert"
  | "maxHeapInsert"
  | "heapifyTree"
  | "extractMin"
  | "extractMax"
  | "decreaseKey"
  | "binomialHeap"
  | "fibonacciHeap";

export type TreeStep = {
  active: number | null;
  visited: number[];
  pending: number[];
  stack: number[];
  output: number[];
  message: string;
  rule: string;
  treeValues?: number[];
  treeEdges?: Array<[number, number]>;
  treePositions?: Array<{ left: string; top: string }>;
};

export const treeLabels: Record<TreeAlgorithm, string> = {
  treeBfs: "Binary Tree BFS",
  preorder: "Preorder Traversal",
  inorder: "Inorder Traversal",
  postorder: "Postorder Traversal",
  bstInsert: "BST Insert",
  bstSearch: "BST Search",
  bstDelete: "BST Delete",
  treeSort: "Tree Sort",
  avlTree: "AVL Tree",
  redBlackTree: "Red-Black Tree",
  bTree: "B-Tree",
  bPlusTreeSearch: "B+ Tree Search",
  trie: "Trie",
  segmentTree: "Segment Tree",
  fenwickTree: "Fenwick Tree",
  suffixTree: "Suffix Tree",
  suffixArray: "Suffix Array",
  minHeapInsert: "Min Heap Insert",
  maxHeapInsert: "Max Heap Insert",
  heapifyTree: "Heapify",
  extractMin: "Extract Min",
  extractMax: "Extract Max",
  decreaseKey: "Decrease Key",
  binomialHeap: "Binomial Heap",
  fibonacciHeap: "Fibonacci Heap",
};

export function getTreeTrace(algorithm: TreeAlgorithm, values: number[]): TreeStep[] {
  type BstNode = {
    value: number;
    left: number | null;
    right: number | null;
  };

  const steps: TreeStep[] = [];

  function exists(index: number) {
    return index >= 0 && index < values.length;
  }

  function addStep(step: TreeStep) {
    steps.push({
      active: step.active,
      visited: [...step.visited],
      pending: [...step.pending],
      stack: [...step.stack],
      output: [...step.output],
      message: step.message,
      rule: step.rule,
      treeValues: step.treeValues ? [...step.treeValues] : undefined,
      treeEdges: step.treeEdges ? step.treeEdges.map((edge) => [edge[0], edge[1]]) : undefined,
      treePositions: step.treePositions ? step.treePositions.map((position) => ({ ...position })) : undefined,
    });
  }

  function getBstEdges(nodes: BstNode[]) {
    const edges: Array<[number, number]> = [];

    nodes.forEach((node, index) => {
      if (node.left !== null) edges.push([index, node.left]);
      if (node.right !== null) edges.push([index, node.right]);
    });

    return edges;
  }

  function getBstPositions(nodes: BstNode[]) {
    const positions: Array<{ left: string; top: string }> = nodes.map(() => ({
      left: "50%",
      top: "12%",
    }));

    function place(index: number | null, depth: number, min: number, max: number) {
      if (index === null) return;

      const mid = (min + max) / 2;
      positions[index] = {
        left: `${mid}%`,
        top: `${12 + depth * 20}%`,
      };

      place(nodes[index].left, depth + 1, min, mid);
      place(nodes[index].right, depth + 1, mid, max);
    }

    place(0, 0, 4, 96);
    return positions;
  }

  function bstSnapshot(
    nodes: BstNode[],
    active: number | null,
    visited: number[],
    stack: number[],
    output: number[],
    pending: number[],
    message: string,
    rule: string,
  ) {
    addStep({
      active,
      visited,
      pending,
      stack,
      output,
      message,
      rule,
      treeValues: nodes.map((node) => node.value),
      treeEdges: getBstEdges(nodes),
      treePositions: getBstPositions(nodes),
    });
  }

  function insertIntoBst(
    nodes: BstNode[],
    value: number,
    visited: number[],
    output: number[],
    pending: number[],
  ) {
    if (nodes.length === 0) {
      nodes.push({ value, left: null, right: null });
      visited.push(0);
      bstSnapshot(
        nodes,
        0,
        visited,
        [0],
        output,
        pending,
        `Insert ${value} as the root node.`,
        "BST rule: smaller values go left, larger or equal values go right.",
      );
      return;
    }

    let current = 0;
    const path: number[] = [];

    while (true) {
      path.push(current);
      visited.push(current);

      bstSnapshot(
        nodes,
        current,
        visited,
        path,
        output,
        pending,
        `Compare ${value} with ${nodes[current].value}.`,
        value < nodes[current].value
          ? `${value} is smaller, so move left.`
          : `${value} is greater or equal, so move right.`,
      );

      if (value < nodes[current].value) {
        if (nodes[current].left === null) {
          nodes.push({ value, left: null, right: null });
          const insertedIndex = nodes.length - 1;
          nodes[current].left = insertedIndex;
          visited.push(insertedIndex);

          bstSnapshot(
            nodes,
            insertedIndex,
            visited,
            [...path, insertedIndex],
            output,
            pending,
            `Insert ${value} as the left child of ${nodes[current].value}.`,
            "A smaller value becomes part of the left subtree.",
          );
          return;
        }

        current = nodes[current].left!;
      } else {
        if (nodes[current].right === null) {
          nodes.push({ value, left: null, right: null });
          const insertedIndex = nodes.length - 1;
          nodes[current].right = insertedIndex;
          visited.push(insertedIndex);

          bstSnapshot(
            nodes,
            insertedIndex,
            visited,
            [...path, insertedIndex],
            output,
            pending,
            `Insert ${value} as the right child of ${nodes[current].value}.`,
            "A greater or equal value becomes part of the right subtree.",
          );
          return;
        }

        current = nodes[current].right!;
      }
    }
  }

  if (values.length === 0) {
    return [
      {
        active: null,
        visited: [],
        pending: [],
        stack: [],
        output: [],
        message: "No tree values were provided.",
        rule: "Add values to create a tree.",
      },
    ];
  }


  function simpleBalancedTreeTrace(name: "AVL Tree" | "Red-Black Tree") {
    const sorted = [...values].sort((a, b) => a - b);
    const treeValues: number[] = [];
    const treeEdges: Array<[number, number]> = [];
    const treePositions: Array<{ left: string; top: string }> = [];
    const visited: number[] = [];
    const output: number[] = [];

    function buildBalanced(items: number[], depth: number, min: number, max: number, parent: number | null): number | null {
      if (items.length === 0) return null;

      const mid = Math.floor(items.length / 2);
      const index = treeValues.length;
      const value = items[mid];

      treeValues.push(value);
      treePositions.push({
        left: `${(min + max) / 2}%`,
        top: `${12 + depth * 20}%`,
      });

      if (parent !== null) treeEdges.push([parent, index]);

      visited.push(index);
      output.push(value);

      addStep({
        active: index,
        visited,
        pending: sorted.slice(output.length),
        stack: [index],
        output,
        message:
          name === "AVL Tree"
            ? `Insert ${value}, then check balance factor. Rotate if height difference becomes greater than 1.`
            : `Insert ${value}, color/recolor nodes, and rotate if red-black rules are violated.`,
        rule:
          name === "AVL Tree"
            ? "AVL rule: every node keeps left/right subtree heights within 1."
            : "Red-black rule: maintain black-height and prevent two red nodes in a row.",
        treeValues,
        treeEdges,
        treePositions,
      });

      buildBalanced(items.slice(0, mid), depth + 1, min, (min + max) / 2, index);
      buildBalanced(items.slice(mid + 1), depth + 1, (min + max) / 2, max, index);

      return index;
    }

    addStep({
      active: null,
      visited: [],
      pending: values.map((_, index) => index),
      stack: [],
      output: [],
      message:
        name === "AVL Tree"
          ? "AVL Tree starts as a BST, then rebalances with rotations after insertions."
          : "Red-Black Tree starts as a BST, then uses colors, recoloring, and rotations to stay balanced.",
      rule:
        name === "AVL Tree"
          ? "Keep the tree height logarithmic by rotating unbalanced nodes."
          : "Keep the tree approximately balanced using red/black color rules.",
    });

    buildBalanced(sorted, 0, 5, 95, null);

    addStep({
      active: null,
      visited,
      pending: [],
      stack: [],
      output,
      message: `${name} construction complete. The visual shows a balanced search tree shape.`,
      rule:
        name === "AVL Tree"
          ? "AVL rotations preserve BST order while restoring height balance."
          : "Red-black fixes preserve BST order while keeping the tree height bounded.",
      treeValues,
      treeEdges,
      treePositions,
    });

    return steps;
  }

  function bTreeTrace() {
    const sorted = [...values].sort((a, b) => a - b);
    const nodeValues: number[] = [];
    const edges: Array<[number, number]> = [];
    const positions: Array<{ left: string; top: string }> = [];
    const visited: number[] = [];
    const output: number[] = [];

    addStep({
      active: null,
      visited: [],
      pending: values.map((_, index) => index),
      stack: [],
      output: [],
      message: "B-Tree stores multiple keys per node and splits nodes when they get too full.",
      rule: "B-Tree rule: keep keys sorted inside nodes and keep all leaves at the same depth.",
    });

    const chunks: number[][] = [];

    for (let index = 0; index < sorted.length; index += 3) {
      chunks.push(sorted.slice(index, index + 3));
    }

    chunks.forEach((chunk, index) => {
      nodeValues.push(Number(chunk.join("")));
      positions.push({
        left: `${12 + index * (76 / Math.max(1, chunks.length - 1))}%`,
        top: index === 0 ? "18%" : "58%",
      });

      if (index > 0) edges.push([0, index]);

      visited.push(index);
      output.push(...chunk);

      addStep({
        active: index,
        visited,
        pending: sorted.slice(output.length),
        stack: [index],
        output,
        message:
          index === 0
            ? `Create root node with keys [${chunk.join(", ")}].`
            : `Create/split child node with keys [${chunk.join(", ")}].`,
        rule: "Each B-Tree node can store several sorted keys.",
        treeValues: nodeValues,
        treeEdges: edges,
        treePositions: positions,
      });
    });

    addStep({
      active: null,
      visited,
      pending: [],
      stack: [],
      output,
      message: "B-Tree visual complete. Keys are grouped into multi-key nodes.",
      rule: "Real B-Trees split and promote median keys; this visual shows the multiway-node structure.",
      treeValues: nodeValues,
      treeEdges: edges,
      treePositions: positions,
    });

    return steps;
  }

  function trieTrace() {
    const words = ["CAT", "CAR", "CARD", "DOG", "DOT"];
    const nodeValues: number[] = [0];
    const edges: Array<[number, number]> = [];
    const positions: Array<{ left: string; top: string }> = [{ left: "50%", top: "10%" }];
    const visited: number[] = [];
    const output: number[] = [];
    const lookup = new Map<string, number>([["", 0]]);

    addStep({
      active: 0,
      visited: [0],
      pending: [],
      stack: [0],
      output: [],
      message: "Trie starts with an empty root. Each edge represents the next character in a word.",
      rule: "Trie rule: words sharing a prefix share the same path.",
      treeValues: nodeValues,
      treeEdges: edges,
      treePositions: positions,
    });

    for (const word of words) {
      let prefix = "";
      let parent = 0;

      for (let depth = 0; depth < word.length; depth++) {
        prefix += word[depth];

        if (!lookup.has(prefix)) {
          const index = nodeValues.length;
          lookup.set(prefix, index);
          nodeValues.push(word.charCodeAt(depth));
          edges.push([parent, index]);
          positions.push({
            left: `${12 + (index * 17) % 76}%`,
            top: `${22 + depth * 17}%`,
          });
        }

        const current = lookup.get(prefix)!;
        parent = current;

        if (!visited.includes(current)) visited.push(current);
        output.push(word.charCodeAt(depth));

        addStep({
          active: current,
          visited,
          pending: [],
          stack: [current],
          output,
          message: `Insert prefix ${prefix}. Shared prefixes reuse existing trie nodes.`,
          rule: "Trie lookup follows one character per level.",
          treeValues: nodeValues,
          treeEdges: edges,
          treePositions: positions,
        });
      }

      addStep({
        active: parent,
        visited,
        pending: [],
        stack: [parent],
        output,
        message: `Mark end of word ${word}.`,
        rule: "A terminal marker separates a full word from a prefix.",
        treeValues: nodeValues,
        treeEdges: edges,
        treePositions: positions,
      });
    }

    addStep({
      active: null,
      visited,
      pending: [],
      stack: [],
      output,
      message: "Trie construction complete. Prefixes like CA are shared by CAT, CAR, and CARD.",
      rule: "Trie is best for prefix search, autocomplete, and dictionary lookup.",
      treeValues: nodeValues,
      treeEdges: edges,
      treePositions: positions,
    });

    return steps;
  }


  function segmentTreeTrace() {
    const data = values.slice(0, 8);
    const treeValues: number[] = [];
    const treeEdges: Array<[number, number]> = [];
    const treePositions: Array<{ left: string; top: string }> = [];
    const visited: number[] = [];
    const output: number[] = [];

    function build(left: number, right: number, depth: number, min: number, max: number, parent: number | null): number {
      const index = treeValues.length;
      const sum = data.slice(left, right + 1).reduce((a, b) => a + b, 0);

      treeValues.push(sum);
      treePositions.push({
        left: `${(min + max) / 2}%`,
        top: `${10 + depth * 18}%`,
      });

      if (parent !== null) treeEdges.push([parent, index]);

      visited.push(index);
      output.push(sum);

      addStep({
        active: index,
        visited,
        pending: data.slice(right + 1),
        stack: [index],
        output,
        message: `Build segment [${left}..${right}] with sum ${sum}.`,
        rule: "Segment Tree rule: each parent stores an aggregate of its child ranges.",
        treeValues,
        treeEdges,
        treePositions,
      });

      if (left !== right) {
        const mid = Math.floor((left + right) / 2);
        build(left, mid, depth + 1, min, (min + max) / 2, index);
        build(mid + 1, right, depth + 1, (min + max) / 2, max, index);
      }

      return index;
    }

    addStep({
      active: null,
      visited: [],
      pending: data,
      stack: [],
      output: [],
      message: "Segment Tree builds range aggregates so range queries can be answered quickly.",
      rule: "Split the array recursively. Store each segment sum in a tree node.",
    });

    build(0, data.length - 1, 0, 4, 96, null);

    addStep({
      active: null,
      visited,
      pending: [],
      stack: [],
      output,
      message: "Segment Tree complete. Range sums can now be answered by combining selected nodes.",
      rule: "Query time is O(log n) for many range operations.",
      treeValues,
      treeEdges,
      treePositions,
    });

    return steps;
  }

  function fenwickTreeTrace() {
    const data = values.slice(0, 8);
    const bit = new Array(data.length + 1).fill(0);
    const visited: number[] = [];
    const output: number[] = [];
    const treeValues = bit.slice(1);
    const treeEdges: Array<[number, number]> = [];
    const treePositions: Array<{ left: string; top: string }> = data.map((_, index) => ({
      left: `${10 + index * (80 / Math.max(1, data.length - 1))}%`,
      top: `${35 + (index % 2) * 22}%`,
    }));

    addStep({
      active: null,
      visited: [],
      pending: data,
      stack: [],
      output: [],
      message: "Fenwick Tree stores partial sums using index jumps based on the lowest set bit.",
      rule: "Update index i, then move to i + lowbit(i).",
      treeValues,
      treeEdges,
      treePositions,
    });

    for (let i = 0; i < data.length; i++) {
      let index = i + 1;

      while (index <= data.length) {
        bit[index] += data[i];
        const activeIndex = index - 1;

        if (!visited.includes(activeIndex)) visited.push(activeIndex);
        output.push(bit[index]);

        addStep({
          active: activeIndex,
          visited,
          pending: data.slice(i + 1),
          stack: [activeIndex],
          output,
          message: `Add ${data[i]} to BIT index ${index}. Next index is ${index + (index & -index)}.`,
          rule: "Fenwick update follows parent links using lowbit.",
          treeValues: bit.slice(1),
          treeEdges,
          treePositions,
        });

        index += index & -index;
      }
    }

    addStep({
      active: null,
      visited,
      pending: [],
      stack: [],
      output,
      message: "Fenwick Tree complete. Prefix sums are answered by moving downward with i -= lowbit(i).",
      rule: "Both update and prefix query are O(log n).",
      treeValues: bit.slice(1),
      treeEdges,
      treePositions,
    });

    return steps;
  }

  function suffixTreeTrace() {
    const word = "BANANA";
    const suffixes = Array.from({ length: word.length }, (_, index) => word.slice(index));
    const treeValues: number[] = [0];
    const treeEdges: Array<[number, number]> = [];
    const treePositions: Array<{ left: string; top: string }> = [{ left: "50%", top: "10%" }];
    const visited: number[] = [0];
    const output: number[] = [];
    const prefixToIndex = new Map<string, number>([["", 0]]);

    addStep({
      active: 0,
      visited,
      pending: [],
      stack: [0],
      output: [],
      message: "Suffix Tree indexes every suffix of a string in a compressed prefix tree.",
      rule: "Shared prefixes reuse the same path.",
      treeValues,
      treeEdges,
      treePositions,
    });

    for (const suffix of suffixes) {
      let prefix = "";
      let parent = 0;

      for (let depth = 0; depth < suffix.length; depth++) {
        prefix += suffix[depth];

        if (!prefixToIndex.has(prefix)) {
          const index = treeValues.length;
          prefixToIndex.set(prefix, index);
          treeValues.push(suffix.charCodeAt(depth));
          treeEdges.push([parent, index]);
          treePositions.push({
            left: `${10 + (index * 13) % 80}%`,
            top: `${20 + depth * 11}%`,
          });
        }

        const current = prefixToIndex.get(prefix)!;
        parent = current;

        if (!visited.includes(current)) visited.push(current);
        output.push(suffix.charCodeAt(depth));

        addStep({
          active: current,
          visited,
          pending: [],
          stack: [current],
          output,
          message: `Insert suffix prefix ${prefix}.`,
          rule: "Suffix Tree supports fast substring lookup after indexing all suffixes.",
          treeValues,
          treeEdges,
          treePositions,
        });
      }
    }

    addStep({
      active: null,
      visited,
      pending: [],
      stack: [],
      output,
      message: "Suffix Tree visual complete for BANANA.",
      rule: "A full implementation compresses long single-child paths for space efficiency.",
      treeValues,
      treeEdges,
      treePositions,
    });

    return steps;
  }

  function suffixArrayTrace() {
    const word = "BANANA";
    const suffixes = Array.from({ length: word.length }, (_, index) => ({
      index,
      suffix: word.slice(index),
    }));

    addStep({
      active: null,
      visited: [],
      pending: suffixes.map((item) => item.index),
      stack: [],
      output: [],
      message: "Suffix Array lists every suffix, then sorts suffixes lexicographically.",
      rule: "Suffix arrays support fast substring search with binary search.",
    });

    suffixes.forEach((item) => {
      addStep({
        active: item.index,
        visited: [item.index],
        pending: suffixes.map((entry) => entry.index),
        stack: [item.index],
        output: [],
        message: `Create suffix at index ${item.index}: ${item.suffix}.`,
        rule: "Each suffix is represented by its starting index.",
      });
    });

    suffixes.sort((a, b) => a.suffix.localeCompare(b.suffix));

    suffixes.forEach((item, sortedIndex) => {
      addStep({
        active: item.index,
        visited: suffixes.slice(0, sortedIndex + 1).map((entry) => entry.index),
        pending: suffixes.slice(sortedIndex + 1).map((entry) => entry.index),
        stack: [item.index],
        output: suffixes.slice(0, sortedIndex + 1).map((entry) => entry.index),
        message: `Sorted position ${sortedIndex}: suffix ${item.suffix} starts at index ${item.index}.`,
        rule: "Sorted suffix indexes form the suffix array.",
      });
    });

    addStep({
      active: null,
      visited: suffixes.map((item) => item.index),
      pending: [],
      stack: [],
      output: suffixes.map((item) => item.index),
      message: `Suffix Array complete: [${suffixes.map((item) => item.index).join(", ")}].`,
      rule: "Use binary search over this array for substring queries.",
    });

    return steps;
  }


  function heapPositions(count: number) {
    return Array.from({ length: count }, (_, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const first = 2 ** level - 1;
      const offset = index - first;
      const nodes = 2 ** level;

      return {
        left: `${((offset + 1) / (nodes + 1)) * 100}%`,
        top: `${10 + level * 20}%`,
      };
    });
  }

  function heapEdges(count: number): Array<[number, number]> {
    const edges: Array<[number, number]> = [];

    for (let index = 0; index < count; index++) {
      const left = index * 2 + 1;
      const right = index * 2 + 2;

      if (left < count) edges.push([index, left]);
      if (right < count) edges.push([index, right]);
    }

    return edges;
  }

  function heapTrace(isMinHeap: boolean, mode: "insert" | "heapify" | "extract") {
    const heap = values.slice(0, 10);
    const visited: number[] = [];
    const output: number[] = [];

    function compare(child: number, parent: number) {
      return isMinHeap ? child < parent : child > parent;
    }

    function pushHeapState(active: number | null, message: string, pending = heap.slice()) {
      addStep({
        active,
        visited,
        pending,
        stack: active === null ? [] : [active],
        output,
        message,
        rule: isMinHeap
          ? "Min heap rule: every parent is less than or equal to its children."
          : "Max heap rule: every parent is greater than or equal to its children.",
        treeValues: heap,
        treeEdges: heapEdges(heap.length),
        treePositions: heapPositions(heap.length),
      });
    }

    if (mode === "insert") {
      heap.length = 0;

      pushHeapState(null, `${isMinHeap ? "Min" : "Max"} Heap Insert starts with an empty heap.`);

      for (const value of values.slice(0, 10)) {
        heap.push(value);
        let index = heap.length - 1;

        if (!visited.includes(index)) visited.push(index);

        pushHeapState(index, `Insert ${value} at the next open complete-tree position.`);

        while (index > 0) {
          const parent = Math.floor((index - 1) / 2);

          if (!compare(heap[index], heap[parent])) {
            pushHeapState(index, `Heap rule is satisfied between child ${heap[index]} and parent ${heap[parent]}.`);
            break;
          }

          [heap[index], heap[parent]] = [heap[parent], heap[index]];
          output.push(heap[parent]);

          pushHeapState(parent, `Swap with parent to restore heap order.`);

          index = parent;
        }
      }

      pushHeapState(null, `${isMinHeap ? "Min" : "Max"} Heap Insert complete.`);
      return steps;
    }

    if (mode === "heapify") {
      pushHeapState(null, "Heapify starts from the last internal node and sifts down.");

      for (let start = Math.floor(heap.length / 2) - 1; start >= 0; start--) {
        let index = start;

        while (true) {
          const left = index * 2 + 1;
          const right = index * 2 + 2;
          let best = index;

          if (left < heap.length && compare(heap[left], heap[best])) best = left;
          if (right < heap.length && compare(heap[right], heap[best])) best = right;

          if (!visited.includes(index)) visited.push(index);

          pushHeapState(index, `Sift down node at index ${index}.`);

          if (best === index) break;

          [heap[index], heap[best]] = [heap[best], heap[index]];
          output.push(heap[index]);

          pushHeapState(best, `Swap index ${index} with child ${best}.`);

          index = best;
        }
      }

      pushHeapState(null, "Heapify complete. The array now satisfies heap order.");
      return steps;
    }

    pushHeapState(null, "Extract Min starts from a valid min heap. First heapify the input.");

    for (let start = Math.floor(heap.length / 2) - 1; start >= 0; start--) {
      let index = start;

      while (true) {
        const left = index * 2 + 1;
        const right = index * 2 + 2;
        let best = index;

        if (left < heap.length && heap[left] < heap[best]) best = left;
        if (right < heap.length && heap[right] < heap[best]) best = right;
        if (best === index) break;

        [heap[index], heap[best]] = [heap[best], heap[index]];
        index = best;
      }
    }

    pushHeapState(0, `Minimum value is ${heap[0]} at the root.`);

    const min = heap[0];
    output.push(min);
    heap[0] = heap[heap.length - 1];
    heap.pop();

    pushHeapState(0, `Move last value to root after extracting ${min}.`);

    let index = 0;

    while (true) {
      const left = index * 2 + 1;
      const right = index * 2 + 2;
      let best = index;

      if (left < heap.length && heap[left] < heap[best]) best = left;
      if (right < heap.length && heap[right] < heap[best]) best = right;

      if (!visited.includes(index)) visited.push(index);

      if (best === index) break;

      [heap[index], heap[best]] = [heap[best], heap[index]];
      pushHeapState(best, `Sift down to restore min heap order.`);
      index = best;
    }

    pushHeapState(null, `Extract Min complete. Extracted value: ${min}.`);
    return steps;
  }

  if (algorithm === "minHeapInsert") return heapTrace(true, "insert");
  if (algorithm === "maxHeapInsert") return heapTrace(false, "insert");
  if (algorithm === "heapifyTree") return heapTrace(true, "heapify");
  if (algorithm === "extractMin") return heapTrace(true, "extract");


  function advancedHeapPositions(count: number) {
    return Array.from({ length: count }, (_, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const first = 2 ** level - 1;
      const offset = index - first;
      const nodes = 2 ** level;

      return {
        left: `${((offset + 1) / (nodes + 1)) * 100}%`,
        top: `${10 + level * 20}%`,
      };
    });
  }

  function advancedHeapEdges(count: number): Array<[number, number]> {
    const edges: Array<[number, number]> = [];

    for (let index = 0; index < count; index++) {
      const left = index * 2 + 1;
      const right = index * 2 + 2;

      if (left < count) edges.push([index, left]);
      if (right < count) edges.push([index, right]);
    }

    return edges;
  }

  function extractMaxTrace() {
    const heap = values.slice(0, 10);

    for (let start = Math.floor(heap.length / 2) - 1; start >= 0; start--) {
      let index = start;

      while (true) {
        const left = index * 2 + 1;
        const right = index * 2 + 2;
        let best = index;

        if (left < heap.length && heap[left] > heap[best]) best = left;
        if (right < heap.length && heap[right] > heap[best]) best = right;
        if (best === index) break;

        [heap[index], heap[best]] = [heap[best], heap[index]];
        index = best;
      }
    }

    const visited: number[] = [0];
    const output: number[] = [];

    addStep({
      active: 0,
      visited,
      pending: heap,
      stack: [0],
      output,
      message: `Extract Max starts with the maximum value ${heap[0]} at the root.`,
      rule: "Max heap rule: every parent is greater than or equal to its children.",
      treeValues: heap,
      treeEdges: advancedHeapEdges(heap.length),
      treePositions: advancedHeapPositions(heap.length),
    });

    const max = heap[0];
    output.push(max);
    heap[0] = heap[heap.length - 1];
    heap.pop();

    addStep({
      active: 0,
      visited,
      pending: heap,
      stack: [0],
      output,
      message: `Remove ${max}. Move the last value to the root and sift down.`,
      rule: "After extraction, restore heap order by swapping with the larger child.",
      treeValues: heap,
      treeEdges: advancedHeapEdges(heap.length),
      treePositions: advancedHeapPositions(heap.length),
    });

    let index = 0;

    while (true) {
      const left = index * 2 + 1;
      const right = index * 2 + 2;
      let best = index;

      if (left < heap.length && heap[left] > heap[best]) best = left;
      if (right < heap.length && heap[right] > heap[best]) best = right;

      if (best === index) break;

      [heap[index], heap[best]] = [heap[best], heap[index]];
      index = best;

      if (!visited.includes(index)) visited.push(index);

      addStep({
        active: index,
        visited,
        pending: heap,
        stack: [index],
        output,
        message: "Swap with the larger child while sifting down.",
        rule: "Sift-down continues until the max heap property is restored.",
        treeValues: heap,
        treeEdges: advancedHeapEdges(heap.length),
        treePositions: advancedHeapPositions(heap.length),
      });
    }

    addStep({
      active: null,
      visited,
      pending: heap,
      stack: [],
      output,
      message: `Extract Max complete. Extracted value: ${max}.`,
      rule: "The remaining tree is still a valid max heap.",
      treeValues: heap,
      treeEdges: advancedHeapEdges(heap.length),
      treePositions: advancedHeapPositions(heap.length),
    });

    return steps;
  }

  function decreaseKeyTrace() {
    const heap = values.slice(0, 10);

    for (let start = Math.floor(heap.length / 2) - 1; start >= 0; start--) {
      let index = start;

      while (true) {
        const left = index * 2 + 1;
        const right = index * 2 + 2;
        let best = index;

        if (left < heap.length && heap[left] < heap[best]) best = left;
        if (right < heap.length && heap[right] < heap[best]) best = right;
        if (best === index) break;

        [heap[index], heap[best]] = [heap[best], heap[index]];
        index = best;
      }
    }

    const target = Math.min(heap.length - 1, 5);
    const oldValue = heap[target];
    heap[target] = Math.max(0, heap[target] - 12);
    const visited: number[] = [target];
    const output: number[] = [heap[target]];

    addStep({
      active: target,
      visited,
      pending: heap,
      stack: [target],
      output,
      message: `Decrease key at index ${target}: ${oldValue} becomes ${heap[target]}.`,
      rule: "In a min heap, decreasing a key may violate order with the parent, so bubble up.",
      treeValues: heap,
      treeEdges: advancedHeapEdges(heap.length),
      treePositions: advancedHeapPositions(heap.length),
    });

    let index = target;

    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);

      if (heap[parent] <= heap[index]) {
        addStep({
          active: index,
          visited,
          pending: heap,
          stack: [index],
          output,
          message: "Parent is already smaller, so the min heap rule is restored.",
          rule: "Decrease Key stops when parent <= child.",
          treeValues: heap,
          treeEdges: advancedHeapEdges(heap.length),
          treePositions: advancedHeapPositions(heap.length),
        });
        break;
      }

      [heap[parent], heap[index]] = [heap[index], heap[parent]];
      index = parent;

      if (!visited.includes(index)) visited.push(index);

      addStep({
        active: index,
        visited,
        pending: heap,
        stack: [index],
        output,
        message: "Bubble the decreased value upward.",
        rule: "A smaller key moves toward the root in a min heap.",
        treeValues: heap,
        treeEdges: advancedHeapEdges(heap.length),
        treePositions: advancedHeapPositions(heap.length),
      });
    }

    addStep({
      active: null,
      visited,
      pending: heap,
      stack: [],
      output,
      message: "Decrease Key complete.",
      rule: "The heap order is valid again after bubbling up.",
      treeValues: heap,
      treeEdges: advancedHeapEdges(heap.length),
      treePositions: advancedHeapPositions(heap.length),
    });

    return steps;
  }

  function binomialHeapTrace() {
    const roots = values.slice(0, 8).sort((a, b) => a - b);
    const treeValues: number[] = [];
    const treeEdges: Array<[number, number]> = [];
    const treePositions: Array<{ left: string; top: string }> = [];
    const visited: number[] = [];
    const output: number[] = [];

    addStep({
      active: null,
      visited: [],
      pending: roots,
      stack: [],
      output: [],
      message: "Binomial Heap is a forest of binomial trees. Trees of the same degree are linked during union.",
      rule: "A binomial heap keeps at most one tree of each degree.",
    });

    roots.forEach((value, index) => {
      treeValues.push(value);
      treePositions.push({
        left: `${10 + index * 11}%`,
        top: "18%",
      });

      visited.push(index);
      output.push(value);

      addStep({
        active: index,
        visited,
        pending: roots.slice(index + 1),
        stack: [index],
        output,
        message: `Insert root ${value} as a degree-0 binomial tree.`,
        rule: "Insertion creates a small heap, then union links equal-degree roots.",
        treeValues,
        treeEdges,
        treePositions,
      });

      if (index > 0 && index % 2 === 1) {
        const parent = treeValues[index - 1] <= treeValues[index] ? index - 1 : index;
        const child = parent === index ? index - 1 : index;
        treeEdges.push([parent, child]);
        treePositions[child] = {
          left: treePositions[parent].left,
          top: "42%",
        };

        addStep({
          active: parent,
          visited,
          pending: roots.slice(index + 1),
          stack: [parent, child],
          output,
          message: "Link two equal-degree binomial trees under the smaller root.",
          rule: "The smaller root remains root after linking.",
          treeValues,
          treeEdges,
          treePositions,
        });
      }
    });

    addStep({
      active: null,
      visited,
      pending: [],
      stack: [],
      output,
      message: "Binomial Heap visual complete. The forest demonstrates root linking by degree.",
      rule: "Extract-min later scans roots and removes the smallest root tree.",
      treeValues,
      treeEdges,
      treePositions,
    });

    return steps;
  }

  function fibonacciHeapTrace() {
    const roots = values.slice(0, 9).sort((a, b) => a - b);
    const treeValues: number[] = [];
    const treeEdges: Array<[number, number]> = [];
    const treePositions: Array<{ left: string; top: string }> = [];
    const visited: number[] = [];
    const output: number[] = [];

    addStep({
      active: null,
      visited: [],
      pending: roots,
      stack: [],
      output: [],
      message: "Fibonacci Heap keeps a loose root list. Inserts and decrease-key are very cheap amortized.",
      rule: "Most work is delayed until extract-min consolidation.",
    });

    roots.forEach((value, index) => {
      treeValues.push(value);
      treePositions.push({
        left: `${8 + index * 10}%`,
        top: "22%",
      });

      visited.push(index);
      output.push(value);

      addStep({
        active: index,
        visited,
        pending: roots.slice(index + 1),
        stack: [index],
        output,
        message: `Add ${value} to the root list.`,
        rule: "Fibonacci heap insert is O(1) amortized.",
        treeValues,
        treeEdges,
        treePositions,
      });
    });

    for (let index = 1; index < treeValues.length; index += 2) {
      treeEdges.push([0, index]);
      treePositions[index] = {
        left: `${20 + index * 7}%`,
        top: "50%",
      };

      addStep({
        active: index,
        visited,
        pending: [],
        stack: [0, index],
        output,
        message: `During consolidation, link root ${treeValues[index]} under the minimum root ${treeValues[0]}.`,
        rule: "Consolidation links roots with equal degree after extract-min.",
        treeValues,
        treeEdges,
        treePositions,
      });
    }

    addStep({
      active: null,
      visited,
      pending: [],
      stack: [],
      output,
      message: "Fibonacci Heap visual complete. It shows lazy root insertion and later consolidation.",
      rule: "Decrease-key can cut a node and move it back to the root list.",
      treeValues,
      treeEdges,
      treePositions,
    });

    return steps;
  }

  if (algorithm === "extractMax") return extractMaxTrace();
  if (algorithm === "decreaseKey") return decreaseKeyTrace();
  if (algorithm === "binomialHeap") return binomialHeapTrace();
  if (algorithm === "fibonacciHeap") return fibonacciHeapTrace();

  if (algorithm === "segmentTree") return segmentTreeTrace();
  if (algorithm === "fenwickTree") return fenwickTreeTrace();
  if (algorithm === "suffixTree") return suffixTreeTrace();
  if (algorithm === "suffixArray") return suffixArrayTrace();

  if (algorithm === "avlTree") return simpleBalancedTreeTrace("AVL Tree");
  if (algorithm === "redBlackTree") return simpleBalancedTreeTrace("Red-Black Tree");
  if (algorithm === "bTree") return bTreeTrace();
  if (algorithm === "bPlusTreeSearch") return bPlusTreeSearchTrace();
  if (algorithm === "trie") return trieTrace();

  if (algorithm === "bstInsert" || algorithm === "bstSearch" || algorithm === "bstDelete" || algorithm === "treeSort") {
    const nodes: BstNode[] = [];
    const visited: number[] = [];
    const output: number[] = [];
    const pendingValues = [...values];

    addStep({
      active: null,
      visited: [],
      pending: values.map((_, index) => index),
      stack: [],
      output: [],
      message:
        algorithm === "treeSort"
          ? "This is the original input tree. Press Play to rebuild it as a Binary Search Tree, then run inorder traversal."
          : algorithm === "bstSearch"
            ? "This is the original input tree. Press Play to build the BST, then search using left/right decisions."
            : "This is the original input tree. Press Play to insert each value into a Binary Search Tree.",
      rule: "Input order is not automatically a BST. The algorithm will rebuild the correct BST step by step.",
      treeValues: values,
    });

    values.forEach((value) => {
      pendingValues.shift();
      insertIntoBst(nodes, value, visited, output, pendingValues);
    });

    if (algorithm === "bstInsert") {
      bstSnapshot(
        nodes,
        null,
        nodes.map((_, index) => index),
        [],
        nodes.map((node) => node.value),
        [],
        "BST insert complete. The tree now follows the BST ordering rule.",
        "Every node's left subtree is smaller and right subtree is greater or equal.",
      );

      return steps;
    }

    if (algorithm === "bstDelete") {
      return bstDeleteTrace();
    }

    if (algorithm === "bstSearch") {
      const target = values[values.length - 1];
      let current: number | null = 0;
      const path: number[] = [];

      bstSnapshot(
        nodes,
        current,
        [],
        [],
        [],
        [],
        `Search for ${target}.`,
        "BST search compares at each node and chooses only one branch.",
      );

      while (current !== null) {
        path.push(current);

        bstSnapshot(
          nodes,
          current,
          path,
          path,
          [],
          [],
          `Compare target ${target} with node ${nodes[current].value}.`,
          target === nodes[current].value
            ? "Target found."
            : target < nodes[current].value
              ? "Target is smaller, so search left."
              : "Target is larger, so search right.",
        );

        if (target === nodes[current].value) break;
        current = target < nodes[current].value ? nodes[current].left : nodes[current].right;
      }

      bstSnapshot(
        nodes,
        current,
        path,
        [],
        current === null ? [] : [nodes[current].value],
        [],
        current === null ? `${target} was not found.` : `${target} was found in the BST.`,
        "BST search finishes when the target is found or the branch becomes empty.",
      );

      return steps;
    }

    const inorderOrder: number[] = [];

    function inorderBst(index: number | null) {
      if (index === null) return;

      bstSnapshot(
        nodes,
        index,
        inorderOrder,
        [index],
        inorderOrder.map((nodeIndex) => nodes[nodeIndex].value),
        [],
        `Go left from ${nodes[index].value} before outputting it.`,
        "Tree Sort uses inorder traversal: Left, Root, Right.",
      );

      inorderBst(nodes[index].left);

      inorderOrder.push(index);
      bstSnapshot(
        nodes,
        index,
        inorderOrder,
        [index],
        inorderOrder.map((nodeIndex) => nodes[nodeIndex].value),
        [],
        `Output ${nodes[index].value}.`,
        "Inorder on a BST outputs values in sorted order.",
      );

      inorderBst(nodes[index].right);
    }

    inorderBst(0);

    bstSnapshot(
      nodes,
      null,
      inorderOrder,
      [],
      inorderOrder.map((nodeIndex) => nodes[nodeIndex].value),
      [],
      "Tree Sort complete. Output is sorted.",
      "Build BST, then inorder traversal produces sorted values.",
    );

    return steps;
  }


  function bstDeleteTrace() {
    const sorted = [...values].sort((a, b) => a - b);
    const target = sorted[Math.floor(sorted.length / 2)] ?? values[0];
    const remaining = values.filter((value, index) => !(value === target && index === values.indexOf(target)));

    addStep({
      active: target,
      visited: [],
      pending: values,
      stack: [],
      output: [],
      message: `BST Delete starts by searching for ${target}.`,
      rule: "BST delete has three cases: leaf, one child, or two children.",
      treeValues: values,
    });

    addStep({
      active: target,
      visited: [target],
      pending: values.filter((value) => value !== target),
      stack: [target],
      output: [],
      message: `Found ${target}. If it has two children, replace it with its inorder successor.`,
      rule: "For a two-child node, copy the smallest value from the right subtree, then delete that successor.",
      treeValues: values,
    });

    const successor = sorted.find((value) => value > target) ?? null;

    addStep({
      active: successor,
      visited: successor === null ? [target] : [target, successor],
      pending: remaining,
      stack: successor === null ? [] : [successor],
      output: remaining,
      message: successor === null
        ? `${target} has no inorder successor in this sample, so remove the node directly.`
        : `Use inorder successor ${successor} to preserve BST ordering.`,
      rule: "After deletion, inorder traversal must remain sorted.",
      treeValues: remaining,
    });

    addStep({
      active: null,
      visited: remaining,
      pending: [],
      stack: [],
      output: [...remaining].sort((a, b) => a - b),
      message: "BST Delete complete.",
      rule: "The BST property is preserved after reconnecting the affected subtree.",
      treeValues: remaining,
    });

    return steps;
  }

  function bPlusTreeSearchTrace() {
    const sorted = [...values].sort((a, b) => a - b);
    const target = sorted[Math.floor(sorted.length / 2)] ?? values[0];
    const leafSize = 3;
    const leaves = [];

    for (let i = 0; i < sorted.length; i += leafSize) {
      leaves.push(sorted.slice(i, i + leafSize));
    }

    const separators = leaves.slice(1).map((leaf) => leaf[0]);

    addStep({
      active: target,
      visited: [],
      pending: separators,
      stack: [],
      output: [],
      message: `B+ Tree Search starts at the internal index keys [${separators.join(", ")}].`,
      rule: "Internal nodes guide the search. Actual records live in linked leaves.",
      treeValues: sorted,
    });

    let leafIndex = 0;
    while (leafIndex < separators.length && target >= separators[leafIndex]) {
      leafIndex++;
    }

    addStep({
      active: target,
      visited: separators.slice(0, leafIndex + 1),
      pending: leaves[leafIndex] ?? [],
      stack: [leafIndex],
      output: [],
      message: `Target ${target} routes to leaf page ${leafIndex}.`,
      rule: "Choose the child pointer whose separator range contains the target.",
      treeValues: sorted,
    });

    const leaf = leaves[leafIndex] ?? [];

    for (const value of leaf) {
      addStep({
        active: value,
        visited: leaf.slice(0, leaf.indexOf(value) + 1),
        pending: leaf.slice(leaf.indexOf(value) + 1),
        stack: [leafIndex],
        output: value === target ? [value] : [],
        message: value === target ? `Found ${target} in the leaf page.` : `Scan leaf key ${value}.`,
        rule: "B+ Tree lookup finishes with a short search inside one leaf page.",
        treeValues: sorted,
      });

      if (value === target) break;
    }

    addStep({
      active: target,
      visited: leaf,
      pending: [],
      stack: [],
      output: [target],
      message: "B+ Tree Search complete.",
      rule: "Leaf-level chaining makes range scans efficient after the point lookup.",
      treeValues: sorted,
    });

    return steps;
  }

  if (algorithm === "treeBfs") {
    const queue = [0];
    const visited: number[] = [];
    const output: number[] = [];

    addStep({
      active: null,
      visited,
      pending: queue,
      stack: [],
      output,
      message: "Start with the root in the queue.",
      rule: "BFS uses a queue: first in, first out.",
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      visited.push(current);
      output.push(values[current]);

      addStep({
        active: current,
        visited,
        pending: queue,
        stack: [],
        output,
        message: `Visit ${values[current]} and remove it from the front of the queue.`,
        rule: "Visit the oldest pending node first.",
      });

      const left = current * 2 + 1;
      const right = current * 2 + 2;

      if (exists(left)) {
        queue.push(left);
        addStep({
          active: current,
          visited,
          pending: queue,
          stack: [],
          output,
          message: `Add left child ${values[left]} to the queue.`,
          rule: "After visiting a node, enqueue its children from left to right.",
        });
      }

      if (exists(right)) {
        queue.push(right);
        addStep({
          active: current,
          visited,
          pending: queue,
          stack: [],
          output,
          message: `Add right child ${values[right]} to the queue.`,
          rule: "Right child is added after the left child.",
        });
      }
    }

    addStep({
      active: null,
      visited,
      pending: [],
      stack: [],
      output,
      message: "BFS traversal complete.",
      rule: "All queued nodes were visited level by level.",
    });

    return steps;
  }

  const visited: number[] = [];
  const output: number[] = [];
  const callStack: number[] = [];

  addStep({
    active: null,
    visited,
    pending: [],
    stack: callStack,
    output,
    message: "Start recursive traversal at the root.",
    rule:
      algorithm === "preorder"
        ? "Preorder rule: Root, Left, Right."
        : algorithm === "inorder"
          ? "Inorder rule: Left, Root, Right."
          : "Postorder rule: Left, Right, Root.",
  });

  function dfs(index: number) {
    if (!exists(index)) return;

    callStack.push(index);
    addStep({
      active: index,
      visited,
      pending: [],
      stack: callStack,
      output,
      message: `Enter node ${values[index]}.`,
      rule: "Push this node onto the recursive call stack.",
    });

    if (algorithm === "preorder") {
      visited.push(index);
      output.push(values[index]);
      addStep({
        active: index,
        visited,
        pending: [],
        stack: callStack,
        output,
        message: `Visit ${values[index]} before going left or right.`,
        rule: "Preorder visits the root first.",
      });
    }

    const left = index * 2 + 1;
    const right = index * 2 + 2;

    if (exists(left)) {
      addStep({
        active: left,
        visited,
        pending: [],
        stack: callStack,
        output,
        message: `Move from ${values[index]} to left child ${values[left]}.`,
        rule: "Explore the left subtree first.",
      });
      dfs(left);
    }

    if (algorithm === "inorder") {
      visited.push(index);
      output.push(values[index]);
      addStep({
        active: index,
        visited,
        pending: [],
        stack: callStack,
        output,
        message: `Visit ${values[index]} after finishing its left subtree.`,
        rule: "Inorder visits Left, then Root, then Right.",
      });
    }

    if (exists(right)) {
      addStep({
        active: right,
        visited,
        pending: [],
        stack: callStack,
        output,
        message: `Move from ${values[index]} to right child ${values[right]}.`,
        rule: "After the left side, explore the right subtree.",
      });
      dfs(right);
    }

    if (algorithm === "postorder") {
      visited.push(index);
      output.push(values[index]);
      addStep({
        active: index,
        visited,
        pending: [],
        stack: callStack,
        output,
        message: `Visit ${values[index]} after both children are complete.`,
        rule: "Postorder visits the root last.",
      });
    }

    callStack.pop();
    addStep({
      active: callStack.at(-1) ?? null,
      visited,
      pending: [],
      stack: callStack,
      output,
      message: `Return from node ${values[index]}.`,
      rule: "Pop the completed node from the recursive call stack.",
    });
  }

  dfs(0);

  addStep({
    active: null,
    visited,
    pending: [],
    stack: [],
    output,
    message: `${treeLabels[algorithm]} traversal complete.`,
    rule: "Every reachable node has been processed by the traversal rule.",
  });

  return steps;
}
