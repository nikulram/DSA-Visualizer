# Contributing to DSA Visualizer

Thank you for helping improve DSA Visualizer.

This project follows a strict review workflow so algorithm correctness and visual quality stay reliable.

## Setup

```bash
git clone https://github.com/nikulram/DSA-Visualizer.git
cd DSA-Visualizer
npm install
npm run dev
```

## Required Check

Before opening a pull request:

```bash
npm run check
```

## Branch Names

Use focused branch names:

```text
fix/dijkstra-logic
fix/aes-round-visual
test/bst-delete-cases
docs/update-readme
```

## Pull Request Rules

A PR should do one focused thing.

## Algorithm Fix Checklist

```text
- I tested the specific algorithm manually.
- I confirmed the visual steps match the algorithm.
- I checked edge cases.
- I ran npm run check.
- I did not modify unrelated algorithm families.
- I did not add secrets, credentials, or private data.
```

## Maintainer Approval

All merges require maintainer approval. Passing tests does not guarantee merge.
