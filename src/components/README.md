# Component Architecture

This folder is for reusable UI pieces.

## shell
Page-level wrappers such as visualizer shell, toolbar, controls, and metric panels.

## setup
Reusable setup panels and input forms.

## catalog
Algorithm catalog cards, filters, search, and section rendering.

## visuals
Every visual family gets its own folder:
- array: sorting/search rows and bars
- grid: maze/pathfinding/flood fill
- graph: classic graph, MST, SCC, flow, matching
- tree: binary trees, heaps, tries, segment trees
- string: text/pattern rows
- dp: DP tables and matrix views
- greedy: schedule/value/selection tables
- hash: buckets, chains, probing tables

Rule: one reusable visual template per file. Algorithm-specific logic stays in src/algorithms.
