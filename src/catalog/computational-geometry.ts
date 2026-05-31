import type { CatalogSection } from "./types";

export const computationalGeometryCatalog: CatalogSection = {
    title: "Computational Geometry",
  description: "Visualize points, hulls, sweeps, intersections, and geometric tests.",
    entries: [
      { title: "Graham Scan", tag: "O(n log n)", status: "playable", kind: "geometry", id: "grahamScan" },
      { title: "Jarvis March", tag: "O(nh)", status: "playable", kind: "geometry", id: "jarvisMarch" },
      { title: "QuickHull", tag: "O(n log n) avg", status: "playable", kind: "geometry", id: "quickHull" },
      { title: "Sweep Line", tag: "O(n log n)", status: "playable", kind: "geometry", id: "sweepLine" },
      { title: "Closest Pair of Points", tag: "O(n log n)", status: "playable", kind: "geometry", id: "closestPair" },
      { title: "Line Segment Intersection", tag: "O((n+k)log n)", status: "playable", kind: "geometry", id: "lineSegmentIntersection" },
      { title: "Point in Polygon", tag: "O(n)", status: "playable", kind: "geometry", id: "pointInPolygon" },
      { title: "Delaunay Triangulation", tag: "O(n log n)", status: "playable", kind: "geometry", id: "delaunayTriangulation" },
      { title: "Voronoi Diagram", tag: "O(n log n)", status: "playable", kind: "geometry", id: "voronoiDiagram" },
    ],
  };
