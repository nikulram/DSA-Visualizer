import type { Screen } from "./screens";

export function getBackScreen(screen: Screen): Screen {
  if (screen === "sortSetup") return "menu";
  if (screen === "pathSetup") return "menu";
  if (screen === "treeSetup") return "menu";
  if (screen === "searchSetup") return "menu";
  if (screen === "graphSetup") return "menu";
  if (screen === "stringSetup") return "menu";
  if (screen === "dpSetup") return "menu";
  if (screen === "greedySetup") return "menu";
  if (screen === "hashSetup") return "menu";
  if (screen === "systemSetup") return "menu";
  if (screen === "compressionSetup") return "menu";
  if (screen === "mathSetup") return "menu";
  if (screen === "geometrySetup") return "menu";
  if (screen === "mlSetup") return "menu";
  if (screen === "backtrackingSetup") return "menu";
  if (screen === "cryptoSetup") return "menu";

  if (screen === "sortVisual") return "sortSetup";
  if (screen === "pathVisual") return "pathSetup";
  if (screen === "treeVisual") return "treeSetup";
  if (screen === "searchVisual") return "searchSetup";
  if (screen === "graphVisual") return "graphSetup";
  if (screen === "stringVisual") return "stringSetup";
  if (screen === "dpVisual") return "dpSetup";
  if (screen === "greedyVisual") return "greedySetup";
  if (screen === "hashVisual") return "hashSetup";
  if (screen === "systemVisual") return "systemSetup";
  if (screen === "compressionVisual") return "compressionSetup";
  if (screen === "mathVisual") return "mathSetup";
  if (screen === "geometryVisual") return "geometrySetup";
  if (screen === "mlVisual") return "mlSetup";
  if (screen === "backtrackingVisual") return "backtrackingSetup";
  if (screen === "cryptoVisual") return "cryptoSetup";

  return "menu";
}

export function isVisualScreen(screen: Screen) {
  return screen.endsWith("Visual");
}
