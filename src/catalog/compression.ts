import type { CatalogSection } from "./types";

export const compressionCatalog: CatalogSection = {
    title: "Compression",
  description: "Visualize dictionary, entropy, transform, and coding-based compression.",
    entries: [
      { title: "Huffman Coding", tag: "Greedy tree", status: "playable", kind: "greedy", id: "huffmanCoding" },
      { title: "Run-Length Encoding", tag: "O(n)", status: "playable", kind: "compression", id: "runLengthEncoding" },
      { title: "LZ77", tag: "Dictionary", status: "playable", kind: "compression", id: "lz77" },
      { title: "LZ78", tag: "Dictionary", status: "playable", kind: "compression", id: "lz78" },
      { title: "LZW", tag: "Dictionary", status: "playable", kind: "compression", id: "lzw" },
      { title: "Arithmetic Coding", tag: "Entropy", status: "playable", kind: "compression", id: "arithmeticCoding" },
      { title: "Deflate", tag: "LZ + Huffman", status: "playable", kind: "compression", id: "deflate" },
      { title: "Huffman Decoding", tag: "Prefix codes", status: "playable", kind: "compression", id: "huffmanDecoding" },
      { title: "Delta Encoding", tag: "Difference", status: "playable", kind: "compression", id: "deltaEncoding" },
      { title: "BWT Compression", tag: "Transform", status: "playable", kind: "compression", id: "bwtCompression" },
    ],
  };
