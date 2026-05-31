import type { CatalogSection } from "./types";

export const treesCatalog: CatalogSection = {
    title: "Trees",
  description: "Explore binary trees, balanced trees, tries, heaps, and range-query structures.",
    entries: [
      { title: "Binary Tree BFS", tag: "O(n)", status: "playable", kind: "tree", id: "treeBfs" },
      { title: "Binary Tree DFS", tag: "O(n)", status: "playable", kind: "tree", id: "binaryTreeDfsAlias" },
      { title: "Preorder Traversal", tag: "O(n)", status: "playable", kind: "tree", id: "preorder" },
      { title: "Inorder Traversal", tag: "O(n)", status: "playable", kind: "tree", id: "inorder" },
      { title: "Postorder Traversal", tag: "O(n)", status: "playable", kind: "tree", id: "postorder" },
      { title: "Level Order Traversal", tag: "O(n)", status: "playable", kind: "tree", id: "levelOrderAlias" },
      { title: "BST Search", tag: "O(h)", status: "playable", kind: "tree", id: "bstSearch" },
      { title: "BST Insert", tag: "O(h)", status: "playable", kind: "tree", id: "bstInsert" },
      { title: "BST Delete", tag: "O(h)", status: "playable", kind: "tree", id: "bstDelete" },
      { title: "Tree Sort", tag: "O(n log n) avg", status: "playable", kind: "tree", id: "treeSort" },
      { title: "AVL Tree", tag: "Self-balancing", status: "playable", kind: "tree", id: "avlTree" },
      { title: "Red-Black Tree", tag: "Balanced BST", status: "playable", kind: "tree", id: "redBlackTree" },
      { title: "B-Tree", tag: "Multiway", status: "playable", kind: "tree", id: "bTree" },
      { title: "B+ Tree Search", tag: "O(log n)", status: "playable", kind: "tree", id: "bPlusTreeSearch" },
      { title: "Trie", tag: "Prefix tree", status: "playable", kind: "tree", id: "trie" },
      { title: "Segment Tree Query", tag: "O(log n)", status: "playable", kind: "tree", id: "segmentTreeQueryAlias" },
      { title: "Fenwick Tree Query", tag: "O(log n)", status: "playable", kind: "tree", id: "fenwickTreeQueryAlias" },
    ],
  };
