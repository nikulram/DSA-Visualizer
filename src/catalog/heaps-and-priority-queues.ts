import type { CatalogSection } from "./types";

export const heapsAndPriorityQueuesCatalog: CatalogSection = {
    title: "Heaps and Priority Queues",
  description: "Visualize heap insertion, extraction, heapify, and priority queue structures.",
    entries: [
      { title: "Min Heap Insert", tag: "O(log n)", status: "playable", kind: "tree", id: "minHeapInsert" },
      { title: "Max Heap Insert", tag: "O(log n)", status: "playable", kind: "tree", id: "maxHeapInsert" },
      { title: "Heapify", tag: "O(n)", status: "playable", kind: "tree", id: "heapifyTree" },
      { title: "Extract Min", tag: "O(log n)", status: "playable", kind: "tree", id: "extractMin" },
      { title: "Extract Max", tag: "O(log n)", status: "playable", kind: "tree", id: "extractMax" },
      { title: "Decrease Key", tag: "O(log n)", status: "playable", kind: "tree", id: "decreaseKey" },
      { title: "Binomial Heap", tag: "O(log n)", status: "playable", kind: "tree", id: "binomialHeap" },
      { title: "Fibonacci Heap", tag: "Amortized", status: "playable", kind: "tree", id: "fibonacciHeap" },
    ],
  };
