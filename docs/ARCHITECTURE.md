# Architecture

DSA Visualizer is organized around algorithm trace engines and visual families.

Each algorithm returns a list of steps. A step represents one visual state.

Core areas:

```text
src/algorithms/       Algorithm trace engines
src/catalog/          Catalog entries
src/router/           Routing and navigation
src/visualFamilies/   Visual family registry
src/__tests__/        Test coverage
```

Catalog entries should use `status: "playable"`, `kind`, and `id` for completed algorithms.
