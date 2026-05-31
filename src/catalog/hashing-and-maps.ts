import type { CatalogSection } from "./types";

export const hashingAndMapsCatalog: CatalogSection = {
    title: "Hashing and Maps",
  description: "Show hash buckets, collisions, probing, chaining, and map behavior.",
    entries: [
      { title: "Hash Insert", tag: "O(1) avg", status: "playable", kind: "hash", id: "hashInsert" },
      { title: "Rehashing", tag: "Resize table", status: "playable", kind: "hash", id: "rehashing" },
      { title: "Hash Lookup", tag: "O(1) avg", status: "playable", kind: "hash", id: "hashLookup" },
      { title: "Hash Delete", tag: "O(1) avg", status: "playable", kind: "hash", id: "hashDelete" },
      { title: "Separate Chaining", tag: "O(1) avg", status: "playable", kind: "hash", id: "separateChaining" },
      { title: "Linear Probing", tag: "Open address", status: "playable", kind: "hash", id: "linearProbing" },
      { title: "Quadratic Probing", tag: "Open address", status: "playable", kind: "hash", id: "quadraticProbing" },
      { title: "Double Hashing", tag: "Open address", status: "playable", kind: "hash", id: "doubleHashing" },
      { title: "Consistent Hashing", tag: "O(log n)", status: "playable", kind: "hash", id: "consistentHashing" },
      { title: "Bloom Filter", tag: "O(k)", status: "playable", kind: "hash", id: "bloomFilter" },
      { title: "Cuckoo Hashing", tag: "O(1) avg", status: "playable", kind: "hash", id: "cuckooHashing" },
    ],
  };
