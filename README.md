# DSA Visualizer

DSA Visualizer is an open-source interactive algorithm visualization platform built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, lucide-react, shaders, and Vitest.

It provides step-by-step visualizations for algorithms across sorting, searching, pathfinding, trees, graphs, dynamic programming, greedy algorithms, hashing, systems, compression, number theory, computational geometry, machine learning, AI search, backtracking, combinatorics, and cryptography.

## Status

- Full catalog completed
- No `status: "soon"` entries remain
- Test suite passing
- Production build passing
- MIT licensed

## Quick Start

```bash
git clone https://github.com/nikulram/DSA-Visualizer.git
cd DSA-Visualizer
npm install
npm run dev
```

## Validate Locally

```bash
npm run check
```

This runs TypeScript, Vitest, and production build.

## Project Structure

```text
src/
  algorithms/          Algorithm trace engines
  catalog/             Algorithm catalog metadata
  components/          Shared UI components
  router/              Screen routing and navigation helpers
  theme/               Design tokens
  visualFamilies/      Visual family registry
  __tests__/           Vitest tests
```

## Algorithm Development Rules

Each algorithm family should stay in its own module. Do not mix unrelated algorithm families in the same file.

## Contributing

Contributors should work through issues and pull requests only. Before opening a PR, run:

```bash
npm run check
```

Every algorithm fix should be focused, tested, and approved by the maintainer before merge.

## Credits

Created and maintained by Nikul Ram.

Built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, lucide-react, shaders, and Vitest.

See `THIRD_PARTY_NOTICES.md`, `licenses.production.json`, and `package.json` for dependency and license details.

## License

MIT. See `LICENSE`.
