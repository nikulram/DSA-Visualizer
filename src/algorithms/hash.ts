export type HashAlgorithm = "hashInsert" | "hashLookup" | "hashDelete" | "separateChaining" | "linearProbing" | "quadraticProbing" | "doubleHashing" | "rehashing" | "consistentHashing" | "bloomFilter" | "cuckooHashing";

export type HashStep = {
  keys: number[];
  table: string[][];
  activeKey: number | null;
  activeBucket: number | null;
  selectedBuckets: number[];
  message: string;
  checks: number;
};

export const hashLabels: Record<HashAlgorithm, string> = {
  hashInsert: "Hash Insert",
  hashLookup: "Hash Lookup",
  hashDelete: "Hash Delete",
  separateChaining: "Separate Chaining",
  linearProbing: "Linear Probing",
  quadraticProbing: "Quadratic Probing",
  doubleHashing: "Double Hashing",
  rehashing: "Rehashing",
  consistentHashing: "Consistent Hashing",
  bloomFilter: "Bloom Filter",
  cuckooHashing: "Cuckoo Hashing",
};

function parseHashValues(input: string) {
  const values = input
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item))
    .slice(0, 14);

  return values.length >= 4 ? values : [18, 41, 22, 44, 59, 32, 31, 73, 19, 66];
}

function cloneTable(table: string[][]) {
  return table.map((bucket) => [...bucket]);
}

function addStep(steps: HashStep[], step: HashStep) {
  steps.push({
    keys: [...step.keys],
    table: cloneTable(step.table),
    activeKey: step.activeKey,
    activeBucket: step.activeBucket,
    selectedBuckets: [...step.selectedBuckets],
    message: step.message,
    checks: step.checks,
  });
}

function hash(key: number, size: number) {
  return Math.abs(key) % size;
}

function emptyTable(size: number) {
  return Array.from({ length: size }, () => [] as string[]);
}

function hashInsertTrace(input: string): HashStep[] {
  const keys = parseHashValues(input);
  const size = 10;
  const table = emptyTable(size);
  const steps: HashStep[] = [];
  let checks = 0;

  addStep(steps, {
    keys,
    table,
    activeKey: null,
    activeBucket: null,
    selectedBuckets: [],
    message: "Hash Insert maps each key to a bucket using key mod table size.",
    checks,
  });

  for (const key of keys) {
    const bucket = hash(key, size);
    checks++;

    addStep(steps, {
      keys,
      table,
      activeKey: key,
      activeBucket: bucket,
      selectedBuckets: [bucket],
      message: `Hash ${key}: ${key} mod ${size} = bucket ${bucket}.`,
      checks,
    });

    table[bucket].push(String(key));

    addStep(steps, {
      keys,
      table,
      activeKey: key,
      activeBucket: bucket,
      selectedBuckets: [bucket],
      message: `Insert ${key} into bucket ${bucket}.`,
      checks,
    });
  }

  addStep(steps, {
    keys,
    table,
    activeKey: null,
    activeBucket: null,
    selectedBuckets: [],
    message: "Hash Insert complete.",
    checks,
  });

  return steps;
}

function hashLookupTrace(input: string): HashStep[] {
  const keys = parseHashValues(input);
  const size = 10;
  const table = emptyTable(size);
  const steps: HashStep[] = [];
  let checks = 0;

  for (const key of keys.slice(0, -1)) {
    table[hash(key, size)].push(String(key));
  }

  const target = keys[keys.length - 1];
  const bucket = hash(target, size);

  addStep(steps, {
    keys,
    table,
    activeKey: target,
    activeBucket: bucket,
    selectedBuckets: [bucket],
    message: `Lookup target ${target}. Hash points to bucket ${bucket}.`,
    checks,
  });

  for (let index = 0; index < table[bucket].length; index++) {
    checks++;
    const value = table[bucket][index];

    addStep(steps, {
      keys,
      table,
      activeKey: Number(value),
      activeBucket: bucket,
      selectedBuckets: [bucket],
      message: `Check bucket ${bucket}, chain index ${index}: ${value}.`,
      checks,
    });

    if (Number(value) === target) {
      addStep(steps, {
        keys,
        table,
        activeKey: target,
        activeBucket: bucket,
        selectedBuckets: [bucket],
        message: `Found ${target} in bucket ${bucket}.`,
        checks,
      });

      return steps;
    }
  }

  addStep(steps, {
    keys,
    table,
    activeKey: target,
    activeBucket: bucket,
    selectedBuckets: [bucket],
    message: `${target} was not found in bucket ${bucket}.`,
    checks,
  });

  return steps;
}

function hashDeleteTrace(input: string): HashStep[] {
  const keys = parseHashValues(input);
  const size = 10;
  const table = emptyTable(size);
  const steps: HashStep[] = [];
  let checks = 0;

  for (const key of keys) {
    table[hash(key, size)].push(String(key));
  }

  const target = keys[Math.floor(keys.length / 2)];
  const bucket = hash(target, size);

  addStep(steps, {
    keys,
    table,
    activeKey: target,
    activeBucket: bucket,
    selectedBuckets: [bucket],
    message: `Delete target ${target}. Hash points to bucket ${bucket}.`,
    checks,
  });

  for (let index = 0; index < table[bucket].length; index++) {
    checks++;

    addStep(steps, {
      keys,
      table,
      activeKey: Number(table[bucket][index]),
      activeBucket: bucket,
      selectedBuckets: [bucket],
      message: `Inspect bucket ${bucket}, chain index ${index}.`,
      checks,
    });

    if (Number(table[bucket][index]) === target) {
      table[bucket].splice(index, 1);

      addStep(steps, {
        keys,
        table,
        activeKey: target,
        activeBucket: bucket,
        selectedBuckets: [bucket],
        message: `Remove ${target} from bucket ${bucket}.`,
        checks,
      });

      return steps;
    }
  }

  addStep(steps, {
    keys,
    table,
    activeKey: target,
    activeBucket: bucket,
    selectedBuckets: [bucket],
    message: `${target} was not present, so nothing changed.`,
    checks,
  });

  return steps;
}

function separateChainingTrace(input: string): HashStep[] {
  const keys = parseHashValues(input);
  const size = 7;
  const table = emptyTable(size);
  const steps: HashStep[] = [];
  let checks = 0;

  addStep(steps, {
    keys,
    table,
    activeKey: null,
    activeBucket: null,
    selectedBuckets: [],
    message: "Separate Chaining stores colliding keys in a linked list or bucket chain.",
    checks,
  });

  for (const key of keys) {
    const bucket = hash(key, size);
    checks++;

    addStep(steps, {
      keys,
      table,
      activeKey: key,
      activeBucket: bucket,
      selectedBuckets: [bucket],
      message: `Hash ${key} to bucket ${bucket}. If occupied, append to the chain.`,
      checks,
    });

    table[bucket].push(String(key));

    addStep(steps, {
      keys,
      table,
      activeKey: key,
      activeBucket: bucket,
      selectedBuckets: [bucket],
      message:
        table[bucket].length > 1
          ? `Collision handled by chaining. Bucket ${bucket} now has ${table[bucket].length} items.`
          : `Bucket ${bucket} was empty, so ${key} starts the chain.`,
      checks,
    });
  }

  addStep(steps, {
    keys,
    table,
    activeKey: null,
    activeBucket: null,
    selectedBuckets: [],
    message: "Separate Chaining complete.",
    checks,
  });

  return steps;
}


function openAddressTrace(input: string, mode: "linear" | "quadratic" | "double"): HashStep[] {
  const keys = parseHashValues(input).slice(0, 9);
  const size = 11;
  const table = emptyTable(size);
  const steps: HashStep[] = [];
  let checks = 0;

  function stepOffset(key: number, attempt: number) {
    if (mode === "linear") return attempt;
    if (mode === "quadratic") return attempt * attempt;
    return attempt * (1 + (Math.abs(key) % (size - 2)));
  }

  addStep(steps, {
    keys,
    table,
    activeKey: null,
    activeBucket: null,
    selectedBuckets: [],
    message:
      mode === "linear"
        ? "Linear Probing resolves collisions by checking the next slot."
        : mode === "quadratic"
          ? "Quadratic Probing resolves collisions using square jumps."
          : "Double Hashing resolves collisions using a second hash as the jump size.",
    checks,
  });

  for (const key of keys) {
    const base = hash(key, size);

    for (let attempt = 0; attempt < size; attempt++) {
      checks++;
      const bucket = (base + stepOffset(key, attempt)) % size;

      addStep(steps, {
        keys,
        table,
        activeKey: key,
        activeBucket: bucket,
        selectedBuckets: [bucket],
        message: `Key ${key}: base bucket ${base}, attempt ${attempt}, checking slot ${bucket}.`,
        checks,
      });

      if (table[bucket].length === 0) {
        table[bucket] = [String(key)];

        addStep(steps, {
          keys,
          table,
          activeKey: key,
          activeBucket: bucket,
          selectedBuckets: [bucket],
          message: `Place ${key} in slot ${bucket}.`,
          checks,
        });

        break;
      }

      addStep(steps, {
        keys,
        table,
        activeKey: key,
        activeBucket: bucket,
        selectedBuckets: [bucket],
        message: `Slot ${bucket} is occupied by ${table[bucket][0]}, so keep probing.`,
        checks,
      });
    }
  }

  addStep(steps, {
    keys,
    table,
    activeKey: null,
    activeBucket: null,
    selectedBuckets: [],
    message:
      mode === "linear"
        ? "Linear Probing complete."
        : mode === "quadratic"
          ? "Quadratic Probing complete."
          : "Double Hashing complete.",
    checks,
  });

  return steps;
}

function rehashingTrace(input: string): HashStep[] {
  const keys = parseHashValues(input).slice(0, 10);
  let size = 5;
  let table = emptyTable(size);
  const steps: HashStep[] = [];
  let inserted = 0;
  let checks = 0;

  addStep(steps, {
    keys,
    table,
    activeKey: null,
    activeBucket: null,
    selectedBuckets: [],
    message: "Rehashing grows the table when load factor gets too high.",
    checks,
  });

  for (const key of keys) {
    const loadFactor = inserted / size;

    if (loadFactor >= 0.7) {
      const oldValues = table.flat().map(Number);
      size = size * 2 + 1;
      table = emptyTable(size);
      inserted = 0;

      addStep(steps, {
        keys,
        table,
        activeKey: key,
        activeBucket: null,
        selectedBuckets: [],
        message: `Load factor reached ${loadFactor.toFixed(2)}. Resize table to ${size} and reinsert existing keys.`,
        checks,
      });

      for (const oldKey of oldValues) {
        const bucket = hash(oldKey, size);
        table[bucket].push(String(oldKey));
        inserted++;
        checks++;

        addStep(steps, {
          keys,
          table,
          activeKey: oldKey,
          activeBucket: bucket,
          selectedBuckets: [bucket],
          message: `Reinsert ${oldKey} into new bucket ${bucket}.`,
          checks,
        });
      }
    }

    const bucket = hash(key, size);
    checks++;
    table[bucket].push(String(key));
    inserted++;

    addStep(steps, {
      keys,
      table,
      activeKey: key,
      activeBucket: bucket,
      selectedBuckets: [bucket],
      message: `Insert ${key} into bucket ${bucket}. Load factor is ${(inserted / size).toFixed(2)}.`,
      checks,
    });
  }

  addStep(steps, {
    keys,
    table,
    activeKey: null,
    activeBucket: null,
    selectedBuckets: [],
    message: "Rehashing complete.",
    checks,
  });

  return steps;
}


function simpleHash(value: number, mod: number, salt = 0) {
  return Math.abs(value * 31 + salt * 17) % mod;
}

function consistentHashingTrace(input: string): HashStep[] {
  const keys = parseHashValues(input).slice(0, 10);
  const ringSize = 24;
  const servers = [3, 9, 16, 22];
  const table = Array.from({ length: ringSize }, () => [] as string[]);
  const steps: HashStep[] = [];
  let checks = 0;

  for (const server of servers) table[server].push(`S${server}`);

  addStep(steps, {
    keys,
    table,
    activeKey: null,
    activeBucket: null,
    selectedBuckets: servers,
    message: "Consistent Hashing places servers and keys on a hash ring. A key moves clockwise to the next server.",
    checks,
  });

  for (const key of keys) {
    checks++;
    const position = simpleHash(key, ringSize);
    const server = servers.find((item) => item >= position) ?? servers[0];
    table[position].push(`K${key}`);

    addStep(steps, {
      keys,
      table,
      activeKey: key,
      activeBucket: position,
      selectedBuckets: [position, server],
      message: `Key ${key} hashes to ring position ${position}, then routes clockwise to server S${server}.`,
      checks,
    });
  }

  addStep(steps, {
    keys,
    table,
    activeKey: null,
    activeBucket: null,
    selectedBuckets: servers,
    message: "Consistent Hashing complete.",
    checks,
  });

  return steps;
}

function bloomFilterTrace(input: string): HashStep[] {
  const keys = parseHashValues(input).slice(0, 8);
  const size = 18;
  const table = Array.from({ length: size }, () => [] as string[]);
  const steps: HashStep[] = [];
  let checks = 0;

  addStep(steps, {
    keys,
    table,
    activeKey: null,
    activeBucket: null,
    selectedBuckets: [],
    message: "Bloom Filter uses multiple hash functions to set bits. Lookup may have false positives.",
    checks,
  });

  for (const key of keys.slice(0, 6)) {
    const h1 = simpleHash(key, size, 1);
    const h2 = simpleHash(key, size, 2);
    const h3 = simpleHash(key, size, 3);
    checks += 3;

    for (const bucket of [h1, h2, h3]) {
      table[bucket] = ["1"];
    }

    addStep(steps, {
      keys,
      table,
      activeKey: key,
      activeBucket: h1,
      selectedBuckets: [h1, h2, h3],
      message: `Insert ${key}. Set bits ${h1}, ${h2}, and ${h3}.`,
      checks,
    });
  }

  const target = keys[keys.length - 1];
  const checksForTarget = [simpleHash(target, size, 1), simpleHash(target, size, 2), simpleHash(target, size, 3)];
  const possiblyPresent = checksForTarget.every((bucket) => table[bucket][0] === "1");
  checks += 3;

  addStep(steps, {
    keys,
    table,
    activeKey: target,
    activeBucket: checksForTarget[0],
    selectedBuckets: checksForTarget,
    message: possiblyPresent
      ? `Lookup ${target}: all bits are set, so it may be present.`
      : `Lookup ${target}: at least one bit is missing, so it is definitely not present.`,
    checks,
  });

  return steps;
}

function cuckooHashingTrace(input: string): HashStep[] {
  const keys = parseHashValues(input).slice(0, 8);
  const size = 7;
  const tableA = Array.from({ length: size }, () => [] as string[]);
  const tableB = Array.from({ length: size }, () => [] as string[]);
  const steps: HashStep[] = [];
  let checks = 0;

  addStep(steps, {
    keys,
    table: tableA.map((bucket, index) => [`A${index}:${bucket[0] ?? "-"}`, `B${index}:${tableB[index][0] ?? "-"}`]),
    activeKey: null,
    activeBucket: null,
    selectedBuckets: [],
    message: "Cuckoo Hashing gives each key two possible homes and kicks existing keys when needed.",
    checks,
  });

  for (const key of keys) {
    let current = key;
    let inA = true;

    for (let attempt = 0; attempt < 6; attempt++) {
      checks++;
      const bucket = inA ? simpleHash(current, size, 1) : simpleHash(current, size, 2);
      const table = inA ? tableA : tableB;
      const old = table[bucket][0];

      table[bucket] = [String(current)];

      addStep(steps, {
        keys,
        table: tableA.map((item, index) => [`A${index}:${item[0] ?? "-"}`, `B${index}:${tableB[index][0] ?? "-"}`]),
        activeKey: current,
        activeBucket: bucket,
        selectedBuckets: [bucket],
        message: old
          ? `Place ${current} in ${inA ? "A" : "B"}${bucket}, kicking out ${old}.`
          : `Place ${current} in empty ${inA ? "A" : "B"}${bucket}.`,
        checks,
      });

      if (!old) break;

      current = Number(old);
      inA = !inA;
    }
  }

  addStep(steps, {
    keys,
    table: tableA.map((item, index) => [`A${index}:${item[0] ?? "-"}`, `B${index}:${tableB[index][0] ?? "-"}`]),
    activeKey: null,
    activeBucket: null,
    selectedBuckets: [],
    message: "Cuckoo Hashing visual complete.",
    checks,
  });

  return steps;
}

export function getHashTrace(algorithm: HashAlgorithm, input: string): HashStep[] {
  if (algorithm === "hashInsert") return hashInsertTrace(input);
  if (algorithm === "hashLookup") return hashLookupTrace(input);
  if (algorithm === "hashDelete") return hashDeleteTrace(input);
  if (algorithm === "separateChaining") return separateChainingTrace(input);
  if (algorithm === "linearProbing") return openAddressTrace(input, "linear");
  if (algorithm === "quadraticProbing") return openAddressTrace(input, "quadratic");
  if (algorithm === "doubleHashing") return openAddressTrace(input, "double");
  if (algorithm === "rehashing") return rehashingTrace(input);
  if (algorithm === "consistentHashing") return consistentHashingTrace(input);
  if (algorithm === "bloomFilter") return bloomFilterTrace(input);
  return cuckooHashingTrace(input);
}
