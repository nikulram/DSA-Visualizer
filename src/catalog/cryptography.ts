import type { CatalogSection } from "./types";

export const cryptographyCatalog: CatalogSection = {
    title: "Cryptography",
  description: "Explain crypto primitives, hashing, key exchange, and encryption workflows.",
    entries: [
      { title: "RSA", tag: "Public key", status: "playable", kind: "crypto", id: "rsa" },
      { title: "Diffie-Hellman", tag: "Key exchange", status: "playable", kind: "crypto", id: "diffieHellman" },
      { title: "Elliptic Curve Crypto", tag: "ECC", status: "playable", kind: "crypto", id: "ecc" },
      { title: "AES", tag: "Block cipher", status: "playable", kind: "crypto", id: "aes" },
      { title: "DES", tag: "Legacy cipher", status: "playable", kind: "crypto", id: "des" },
      { title: "ChaCha20", tag: "Stream cipher", status: "playable", kind: "crypto", id: "chacha20" },
      { title: "SHA-256", tag: "Hash", status: "playable", kind: "crypto", id: "sha256" },
      { title: "SHA-3", tag: "Hash", status: "playable", kind: "crypto", id: "sha3" },
      { title: "HMAC", tag: "MAC", status: "playable", kind: "crypto", id: "hmac" },
      { title: "PBKDF2", tag: "KDF", status: "playable", kind: "crypto", id: "pbkdf2" },
      { title: "bcrypt", tag: "Password hash", status: "playable", kind: "crypto", id: "bcrypt" },
      { title: "Argon2", tag: "Password hash", status: "playable", kind: "crypto", id: "argon2" },
    ],
  };
