export type GeometryAlgorithm = "grahamScan" | "jarvisMarch" | "quickHull" | "sweepLine" | "closestPair" | "lineSegmentIntersection" | "pointInPolygon" | "delaunayTriangulation" | "voronoiDiagram";

export type GeometryPoint = {
  x: number;
  y: number;
};

export type GeometryStep = {
  points: GeometryPoint[];
  hull: number[];
  active: number | null;
  compared: number[];
  lines: Array<[number, number]>;
  message: string;
  checks: number;
};

export const geometryLabels: Record<GeometryAlgorithm, string> = {
  grahamScan: "Graham Scan",
  jarvisMarch: "Jarvis March",
  quickHull: "QuickHull",
  sweepLine: "Sweep Line",
  closestPair: "Closest Pair of Points",
  lineSegmentIntersection: "Line Segment Intersection",
  pointInPolygon: "Point in Polygon",
  delaunayTriangulation: "Delaunay Triangulation",
  voronoiDiagram: "Voronoi Diagram",
};

function parseGeometryPoints(input: string): GeometryPoint[] {
  const nums = input
    .split(/[\s,]+/)
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item));

  const points: GeometryPoint[] = [];

  for (let i = 0; i + 1 < nums.length; i += 2) {
    points.push({ x: nums[i], y: nums[i + 1] });
  }

  return points.length >= 5
    ? points.slice(0, 16)
    : [
        { x: 12, y: 70 },
        { x: 22, y: 22 },
        { x: 36, y: 55 },
        { x: 48, y: 18 },
        { x: 58, y: 78 },
        { x: 72, y: 36 },
        { x: 82, y: 64 },
        { x: 90, y: 12 },
      ];
}

function cross(a: GeometryPoint, b: GeometryPoint, c: GeometryPoint) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function distanceFromLine(a: GeometryPoint, b: GeometryPoint, p: GeometryPoint) {
  return Math.abs(cross(a, b, p));
}

function addStep(steps: GeometryStep[], step: GeometryStep) {
  steps.push({
    points: step.points.map((point) => ({ ...point })),
    hull: [...step.hull],
    active: step.active,
    compared: [...step.compared],
    lines: step.lines.map(([a, b]) => [a, b]),
    message: step.message,
    checks: step.checks,
  });
}

function grahamScanTrace(input: string): GeometryStep[] {
  const points = parseGeometryPoints(input);
  const steps: GeometryStep[] = [];
  let checks = 0;

  const pivotIndex = points.reduce((best, point, index) => {
    const current = points[best];
    return point.y < current.y || (point.y === current.y && point.x < current.x) ? index : best;
  }, 0);

  const order = points
    .map((point, index) => ({ point, index }))
    .filter((item) => item.index !== pivotIndex)
    .sort((a, b) => {
      const turn = cross(points[pivotIndex], a.point, b.point);
      return turn === 0
        ? Math.hypot(a.point.x - points[pivotIndex].x, a.point.y - points[pivotIndex].y) -
            Math.hypot(b.point.x - points[pivotIndex].x, b.point.y - points[pivotIndex].y)
        : -turn;
    })
    .map((item) => item.index);

  const hull = [pivotIndex];

  addStep(steps, {
    points,
    hull,
    active: pivotIndex,
    compared: order,
    lines: [],
    message: "Graham Scan chooses the lowest-left point as pivot and sorts the remaining points by polar angle.",
    checks,
  });

  for (const index of order) {
    checks++;

    while (hull.length >= 2) {
      const b = hull[hull.length - 1];
      const a = hull[hull.length - 2];
      const turn = cross(points[a], points[b], points[index]);

      addStep(steps, {
        points,
        hull,
        active: index,
        compared: [a, b, index],
        lines: [[a, b], [b, index]],
        message: turn <= 0 ? "Right turn or collinear. Pop the last hull point." : "Left turn. Keep the hull point.",
        checks,
      });

      if (turn > 0) break;
      hull.pop();
    }

    hull.push(index);

    addStep(steps, {
      points,
      hull,
      active: index,
      compared: [index],
      lines: hull.map((value, i) => [value, hull[(i + 1) % hull.length]]),
      message: `Add point ${index} to the hull stack.`,
      checks,
    });
  }

  addStep(steps, {
    points,
    hull,
    active: null,
    compared: [],
    lines: hull.map((value, i) => [value, hull[(i + 1) % hull.length]]),
    message: "Graham Scan complete.",
    checks,
  });

  return steps;
}

function jarvisMarchTrace(input: string): GeometryStep[] {
  const points = parseGeometryPoints(input);
  const steps: GeometryStep[] = [];
  let checks = 0;

  let left = 0;
  for (let i = 1; i < points.length; i++) {
    if (points[i].x < points[left].x) left = i;
  }

  const hull: number[] = [];
  let current = left;

  addStep(steps, {
    points,
    hull,
    active: current,
    compared: [],
    lines: [],
    message: "Jarvis March starts from the leftmost point and wraps around the outside.",
    checks,
  });

  do {
    hull.push(current);
    let next = (current + 1) % points.length;

    for (let candidate = 0; candidate < points.length; candidate++) {
      if (candidate === current) continue;
      checks++;

      const turn = cross(points[current], points[next], points[candidate]);

      addStep(steps, {
        points,
        hull,
        active: current,
        compared: [next, candidate],
        lines: [[current, next], [current, candidate]],
        message: turn < 0 ? `Point ${candidate} is more clockwise. Update wrapping edge.` : `Keep current candidate ${next}.`,
        checks,
      });

      if (turn < 0) next = candidate;
    }

    current = next;
  } while (current !== left && hull.length <= points.length);

  addStep(steps, {
    points,
    hull,
    active: null,
    compared: [],
    lines: hull.map((value, i) => [value, hull[(i + 1) % hull.length]]),
    message: "Jarvis March complete.",
    checks,
  });

  return steps;
}

function quickHullTrace(input: string): GeometryStep[] {
  const points = parseGeometryPoints(input);
  const steps: GeometryStep[] = [];
  let checks = 0;

  const min = points.reduce((best, point, index) => point.x < points[best].x ? index : best, 0);
  const max = points.reduce((best, point, index) => point.x > points[best].x ? index : best, 0);
  const hull = new Set<number>([min, max]);

  addStep(steps, {
    points,
    hull: [...hull],
    active: null,
    compared: [min, max],
    lines: [[min, max]],
    message: "QuickHull starts with the leftmost and rightmost points, splitting the set by a baseline.",
    checks,
  });

  function recurse(a: number, b: number, candidates: number[]) {
    if (candidates.length === 0) return;

    let farthest = candidates[0];
    for (const candidate of candidates) {
      checks++;
      if (distanceFromLine(points[a], points[b], points[candidate]) > distanceFromLine(points[a], points[b], points[farthest])) {
        farthest = candidate;
      }
    }

    hull.add(farthest);

    addStep(steps, {
      points,
      hull: [...hull],
      active: farthest,
      compared: candidates,
      lines: [[a, farthest], [farthest, b]],
      message: `Choose farthest point ${farthest} from edge ${a}-${b}.`,
      checks,
    });

    const leftA = candidates.filter((point) => cross(points[a], points[farthest], points[point]) > 0);
    const leftB = candidates.filter((point) => cross(points[farthest], points[b], points[point]) > 0);

    recurse(a, farthest, leftA);
    recurse(farthest, b, leftB);
  }

  const above = points.map((_, index) => index).filter((index) => cross(points[min], points[max], points[index]) > 0);
  const below = points.map((_, index) => index).filter((index) => cross(points[max], points[min], points[index]) > 0);

  recurse(min, max, above);
  recurse(max, min, below);

  const hullList = [...hull];

  addStep(steps, {
    points,
    hull: hullList,
    active: null,
    compared: [],
    lines: hullList.map((value, i) => [value, hullList[(i + 1) % hullList.length]]),
    message: "QuickHull complete.",
    checks,
  });

  return steps;
}

function sweepLineTrace(input: string): GeometryStep[] {
  const points = parseGeometryPoints(input);
  const steps: GeometryStep[] = [];
  const order = points.map((point, index) => ({ point, index })).sort((a, b) => a.point.x - b.point.x);
  const active: number[] = [];
  let checks = 0;
  let closest: [number, number] | null = null;
  let best = Infinity;

  addStep(steps, {
    points,
    hull: [],
    active: null,
    compared: order.map((item) => item.index),
    lines: [],
    message: "Sweep Line processes points from left to right and keeps nearby active points.",
    checks,
  });

  for (const item of order) {
    checks++;

    for (const other of active) {
      const d = Math.hypot(points[item.index].x - points[other].x, points[item.index].y - points[other].y);

      if (d < best) {
        best = d;
        closest = [item.index, other];
      }
    }

    active.push(item.index);

    addStep(steps, {
      points,
      hull: active,
      active: item.index,
      compared: active,
      lines: closest ? [closest] : [],
      message: closest
        ? `Sweep at x=${item.point.x}. Current closest pair is ${closest[0]}-${closest[1]}.`
        : `Sweep at x=${item.point.x}. Add first active point.`,
      checks,
    });
  }

  addStep(steps, {
    points,
    hull: active,
    active: null,
    compared: [],
    lines: closest ? [closest] : [],
    message: "Sweep Line complete.",
    checks,
  });

  return steps;
}


function closestPairTrace(input: string): GeometryStep[] {
  const points = parseGeometryPoints(input);
  const steps: GeometryStep[] = [];
  let checks = 0;
  let best: [number, number] | null = null;
  let bestDistance = Infinity;

  const order = points.map((point, index) => ({ point, index })).sort((a, b) => a.point.x - b.point.x);

  addStep(steps, {
    points,
    hull: [],
    active: null,
    compared: order.map((item) => item.index),
    lines: [],
    message: "Closest Pair sorts points by x-coordinate and compares nearby candidates.",
    checks,
  });

  for (let i = 0; i < order.length; i++) {
    for (let j = i + 1; j < order.length; j++) {
      if (order[j].point.x - order[i].point.x > bestDistance) break;

      checks++;
      const a = order[i].index;
      const b = order[j].index;
      const distance = Math.hypot(points[a].x - points[b].x, points[a].y - points[b].y);

      if (distance < bestDistance) {
        bestDistance = distance;
        best = [a, b];
      }

      addStep(steps, {
        points,
        hull: best ? [...best] : [],
        active: b,
        compared: [a, b],
        lines: best ? [best] : [[a, b]],
        message: `Compare points ${a} and ${b}. Best distance is ${bestDistance.toFixed(2)}.`,
        checks,
      });
    }
  }

  addStep(steps, {
    points,
    hull: best ? [...best] : [],
    active: null,
    compared: best ? [...best] : [],
    lines: best ? [best] : [],
    message: best ? `Closest pair is ${best[0]}-${best[1]}.` : "Closest Pair complete.",
    checks,
  });

  return steps;
}

function orientation(a: GeometryPoint, b: GeometryPoint, c: GeometryPoint) {
  const value = cross(a, b, c);
  return value === 0 ? 0 : value > 0 ? 1 : -1;
}

function segmentsIntersect(a: GeometryPoint, b: GeometryPoint, c: GeometryPoint, d: GeometryPoint) {
  const o1 = orientation(a, b, c);
  const o2 = orientation(a, b, d);
  const o3 = orientation(c, d, a);
  const o4 = orientation(c, d, b);

  return o1 !== o2 && o3 !== o4;
}

function lineSegmentIntersectionTrace(input: string): GeometryStep[] {
  const points = parseGeometryPoints(input);
  const steps: GeometryStep[] = [];
  const segments: Array<[number, number]> = [];

  for (let i = 0; i + 1 < points.length; i += 2) {
    segments.push([i, i + 1]);
  }

  let checks = 0;
  const intersections: number[] = [];

  addStep(steps, {
    points,
    hull: [],
    active: null,
    compared: segments.flat(),
    lines: segments,
    message: "Line Segment Intersection checks segment pairs for crossing.",
    checks,
  });

  for (let i = 0; i < segments.length; i++) {
    for (let j = i + 1; j < segments.length; j++) {
      checks++;

      const [a, b] = segments[i];
      const [c, d] = segments[j];
      const hit = segmentsIntersect(points[a], points[b], points[c], points[d]);

      if (hit) {
        intersections.push(a, b, c, d);
      }

      addStep(steps, {
        points,
        hull: intersections,
        active: hit ? c : null,
        compared: [a, b, c, d],
        lines: [segments[i], segments[j]],
        message: hit
          ? `Segments ${a}-${b} and ${c}-${d} intersect.`
          : `Segments ${a}-${b} and ${c}-${d} do not intersect.`,
        checks,
      });
    }
  }

  addStep(steps, {
    points,
    hull: intersections,
    active: null,
    compared: intersections,
    lines: segments,
    message: intersections.length > 0 ? "Line Segment Intersection complete. Crossings found." : "Line Segment Intersection complete. No crossings found.",
    checks,
  });

  return steps;
}

function pointInPolygonTrace(input: string): GeometryStep[] {
  const points = parseGeometryPoints(input);
  const steps: GeometryStep[] = [];
  const polygon = points.slice(0, Math.max(3, points.length - 1)).map((_, index) => index);
  const testIndex = points.length - 1;
  const test = points[testIndex];
  let inside = false;
  let checks = 0;

  addStep(steps, {
    points,
    hull: polygon,
    active: testIndex,
    compared: [],
    lines: polygon.map((value, index) => [value, polygon[(index + 1) % polygon.length]]),
    message: `Point in Polygon casts a ray from test point ${testIndex}.`,
    checks,
  });

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    checks++;
    const pi = points[polygon[i]];
    const pj = points[polygon[j]];

    const crosses =
      pi.y > test.y !== pj.y > test.y &&
      test.x < ((pj.x - pi.x) * (test.y - pi.y)) / (pj.y - pi.y || 1) + pi.x;

    if (crosses) inside = !inside;

    addStep(steps, {
      points,
      hull: polygon,
      active: testIndex,
      compared: [polygon[j], polygon[i], testIndex],
      lines: [[polygon[j], polygon[i]]],
      message: crosses
        ? `Ray crosses edge ${polygon[j]}-${polygon[i]}. Toggle inside to ${inside}.`
        : `Ray does not cross edge ${polygon[j]}-${polygon[i]}.`,
      checks,
    });
  }

  addStep(steps, {
    points,
    hull: polygon,
    active: testIndex,
    compared: [testIndex],
    lines: polygon.map((value, index) => [value, polygon[(index + 1) % polygon.length]]),
    message: inside ? `Point ${testIndex} is inside the polygon.` : `Point ${testIndex} is outside the polygon.`,
    checks,
  });

  return steps;
}

function delaunayTriangulationTrace(input: string): GeometryStep[] {
  const points = parseGeometryPoints(input);
  const steps: GeometryStep[] = [];
  const centerIndex = points.reduce((best, point, index) => {
    const avgX = points.reduce((sum, item) => sum + item.x, 0) / points.length;
    const avgY = points.reduce((sum, item) => sum + item.y, 0) / points.length;
    const currentBest = points[best];
    const currentDist = Math.hypot(currentBest.x - avgX, currentBest.y - avgY);
    const nextDist = Math.hypot(point.x - avgX, point.y - avgY);
    return nextDist < currentDist ? index : best;
  }, 0);

  const order = points
    .map((point, index) => ({ point, index }))
    .filter((item) => item.index !== centerIndex)
    .sort((a, b) => Math.atan2(a.point.y - points[centerIndex].y, a.point.x - points[centerIndex].x) - Math.atan2(b.point.y - points[centerIndex].y, b.point.x - points[centerIndex].x))
    .map((item) => item.index);

  const lines: Array<[number, number]> = [];
  let checks = 0;

  addStep(steps, {
    points,
    hull: [centerIndex],
    active: centerIndex,
    compared: order,
    lines,
    message: "Delaunay Triangulation connects nearby points while avoiding skinny triangles. This visual builds a radial triangulation approximation.",
    checks,
  });

  for (let i = 0; i < order.length; i++) {
    checks++;
    const a = order[i];
    const b = order[(i + 1) % order.length];

    lines.push([centerIndex, a], [a, b], [b, centerIndex]);

    addStep(steps, {
      points,
      hull: [centerIndex, a, b],
      active: a,
      compared: [centerIndex, a, b],
      lines,
      message: `Add triangle ${centerIndex}-${a}-${b}.`,
      checks,
    });
  }

  addStep(steps, {
    points,
    hull: [centerIndex, ...order],
    active: null,
    compared: [],
    lines,
    message: "Delaunay Triangulation visual complete.",
    checks,
  });

  return steps;
}


function voronoiDiagramTrace(input: string): GeometryStep[] {
  const points = parseGeometryPoints(input);
  const steps: GeometryStep[] = [];
  const lines: Array<[number, number]> = [];
  let checks = 0;

  addStep(steps, {
    points,
    hull: [],
    active: null,
    compared: points.map((_, index) => index),
    lines,
    message: "Voronoi Diagram partitions the plane by nearest site. This visual builds perpendicular bisector relationships.",
    checks,
  });

  for (let i = 0; i < points.length; i++) {
    let nearest = -1;
    let best = Infinity;

    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;

      checks++;
      const distance = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);

      if (distance < best) {
        best = distance;
        nearest = j;
      }
    }

    if (nearest >= 0) {
      lines.push([i, nearest]);
    }

    addStep(steps, {
      points,
      hull: [i, nearest].filter((value) => value >= 0),
      active: i,
      compared: nearest >= 0 ? [i, nearest] : [i],
      lines,
      message: nearest >= 0
        ? `Site ${i} is closest to site ${nearest}. A Voronoi boundary lies between them.`
        : `Site ${i} has no neighbor.`,
      checks,
    });
  }

  addStep(steps, {
    points,
    hull: points.map((_, index) => index),
    active: null,
    compared: [],
    lines,
    message: "Voronoi Diagram visual complete.",
    checks,
  });

  return steps;
}

export function getGeometryTrace(algorithm: GeometryAlgorithm, input: string): GeometryStep[] {
  if (algorithm === "grahamScan") return grahamScanTrace(input);
  if (algorithm === "jarvisMarch") return jarvisMarchTrace(input);
  if (algorithm === "quickHull") return quickHullTrace(input);
  if (algorithm === "sweepLine") return sweepLineTrace(input);
  if (algorithm === "closestPair") return closestPairTrace(input);
  if (algorithm === "lineSegmentIntersection") return lineSegmentIntersectionTrace(input);
  if (algorithm === "pointInPolygon") return pointInPolygonTrace(input);
  if (algorithm === "delaunayTriangulation") return delaunayTriangulationTrace(input);
  return voronoiDiagramTrace(input);
}
