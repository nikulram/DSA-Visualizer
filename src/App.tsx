import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { algorithmCatalog, type CatalogEntry } from "./algorithmCatalog";
import { getSortTrace, sortLabels, type SortAlgorithm, type SortStep } from "./algorithms/sorting";
import { getPathTrace, pathLabels, type PathAlgorithm, type PathStep } from "./algorithms/pathfinding";
import { getTreeTrace, treeLabels, type TreeAlgorithm, type TreeStep } from "./algorithms/tree";
import { getSearchTrace, searchLabels, type SearchAlgorithm, type SearchStep } from "./algorithms/searching";
import { getGraphModel, getGraphTrace, graphLabels, type GraphAlgorithm, type GraphStep, type GraphVisualMode } from "./algorithms/graph";
import { getStringTrace, stringLabels, type StringAlgorithm, type StringStep } from "./algorithms/string";
import { getDpTrace, dpLabels, type DpAlgorithm, type DpStep } from "./algorithms/dp";
import { getGreedyTrace, greedyLabels, type GreedyAlgorithm, type GreedyStep } from "./algorithms/greedy";
import { getHashTrace, hashLabels, type HashAlgorithm, type HashStep } from "./algorithms/hash";
import { getSystemTrace, systemLabels, type SystemAlgorithm, type SystemStep } from "./algorithms/systems";
import { getCompressionTrace, compressionLabels, type CompressionAlgorithm, type CompressionStep } from "./algorithms/compression";
import { getMathTrace, mathLabels, type MathAlgorithm, type MathStep } from "./algorithms/math";
import { getGeometryTrace, geometryLabels, type GeometryAlgorithm, type GeometryStep } from "./algorithms/geometry";
import { getMlTrace, mlLabels, type MlAlgorithm, type MlStep } from "./algorithms/ml";
import { getBacktrackingTrace, backtrackingLabels, type BacktrackingAlgorithm, type BacktrackingStep } from "./algorithms/backtracking";
import { getCryptoTrace, cryptoLabels, type CryptoAlgorithm, type CryptoStep } from "./algorithms/crypto";
import { algorithmAliases } from "./router/algorithmAliases";
import type { Screen } from "./router/screens";
import { getBackScreen } from "./router/navigation";

import {
  ArrowLeft,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  StepForward,
} from "lucide-react";

const gridWidth = 13;
const gridHeight = 7;
const defaultStartNode = 14;
const defaultEndNode = 76;

const defaultWalls = [
  18, 19, 20, 21,
  33, 46, 59,
  37, 38, 39,
  50, 63,
  56, 57, 58,
  70, 71,
];

const presets = {
  random: [42, 18, 73, 9, 55, 31, 86, 24, 67, 12, 49, 95],
  nearlySorted: [8, 14, 22, 31, 29, 44, 51, 63, 59, 70, 82, 91],
  reverse: [96, 88, 79, 71, 62, 54, 46, 38, 29, 21, 13, 5],
  duplicates: [35, 12, 35, 80, 12, 55, 55, 20, 90, 20, 70, 35],
};

function randomValues() {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 90) + 8);
}

function parseValues(input: string) {
  const parsed = input
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item) && item > 0)
    .slice(0, 18);

  return parsed.length >= 2 ? parsed : presets.random;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [sortAlgorithm, setSortAlgorithm] = useState<SortAlgorithm>("bubble");
  const [pathAlgorithm, setPathAlgorithm] = useState<PathAlgorithm>("dijkstra");
  const [pathVisualMode, setPathVisualMode] = useState<"map" | "tree">("map");
  const [treeAlgorithm, setTreeAlgorithm] = useState<TreeAlgorithm>("treeBfs");
  const [searchAlgorithm, setSearchAlgorithm] = useState<SearchAlgorithm>("linear");
  const [graphAlgorithm, setGraphAlgorithm] = useState<GraphAlgorithm>("graphBfs");
  const [graphVisualMode, setGraphVisualMode] = useState<GraphVisualMode>("graph");
  const [stringAlgorithm, setStringAlgorithm] = useState<StringAlgorithm>("kmp");
  const [stringTextInput, setStringTextInput] = useState("ABABDABACDABABCABAB");
  const [stringPatternInput, setStringPatternInput] = useState("ABABCABAB");
  const [dpAlgorithm, setDpAlgorithm] = useState<DpAlgorithm>("knapsack");
  const [dpInput, setDpInput] = useState("3, 4, 5, 8, 10, 2, 6, 7");
  const [greedyAlgorithm, setGreedyAlgorithm] = useState<GreedyAlgorithm>("activitySelection");
  const [greedyInput, setGreedyInput] = useState("1, 3, 0, 5, 8, 5, 2, 4, 6, 7, 9, 9");
  const [hashAlgorithm, setHashAlgorithm] = useState<HashAlgorithm>("hashInsert");
  const [hashInput, setHashInput] = useState("18, 41, 22, 44, 59, 32, 31, 73, 19, 66");
  const [systemAlgorithm, setSystemAlgorithm] = useState<SystemAlgorithm>("lruCache");
  const [systemInput, setSystemInput] = useState("1, 2, 3, 1, 4, 5, 2, 1, 2, 3, 4, 5");
  const [compressionAlgorithm, setCompressionAlgorithm] = useState<CompressionAlgorithm>("lz78");
  const [compressionInput, setCompressionInput] = useState("BANANA_BANDANA");
  const [mathAlgorithm, setMathAlgorithm] = useState<MathAlgorithm>("euclidean");
  const [mathInput, setMathInput] = useState("252, 105, 2, 13, 497");
  const [geometryAlgorithm, setGeometryAlgorithm] = useState<GeometryAlgorithm>("grahamScan");
  const [geometryInput, setGeometryInput] = useState("12,70, 22,22, 36,55, 48,18, 58,78, 72,36, 82,64, 90,12");
  const [mlAlgorithm, setMlAlgorithm] = useState<MlAlgorithm>("kMeans");
  const [mlInput, setMlInput] = useState("12,18, 18,28, 24,20, 58,64, 66,72, 74,62, 44,48");
  const [backtrackingAlgorithm, setBacktrackingAlgorithm] = useState<BacktrackingAlgorithm>("backtracking");
  const [backtrackingInput, setBacktrackingInput] = useState("A, B, C, D");
  const [cryptoAlgorithm, setCryptoAlgorithm] = useState<CryptoAlgorithm>("rsa");
  const [cryptoInput, setCryptoInput] = useState("HELLO");
  const [graphInput, setGraphInput] = useState("A, B, C, D, E, F, G, H, I");
  const [values, setValues] = useState<number[]>(presets.random);
  const [arrayInput, setArrayInput] = useState(presets.random.join(", "));
  const [treeInput, setTreeInput] = useState("50, 25, 75, 12, 35, 60, 90, 5, 18, 30, 40, 55, 65, 82, 95");
  const [searchInput, setSearchInput] = useState("8, 14, 22, 31, 42, 55, 67, 73, 86, 95");
  const [searchTargetInput, setSearchTargetInput] = useState("55");
  const [pathTreeInput, setPathTreeInput] = useState("S, A, B, C, D, E, F");
  const [walls, setWalls] = useState<Set<number>>(() => new Set(defaultWalls));
  const [startNode, setStartNode] = useState(defaultStartNode);
  const [endNode, setEndNode] = useState(defaultEndNode);
  const [wallTool, setWallTool] = useState<"draw" | "erase" | "start" | "end">("draw");
  const [dragging, setDragging] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [speed, setSpeed] = useState(60);

  const sortSteps = useMemo(() => getSortTrace(sortAlgorithm, values), [sortAlgorithm, values]);
  const pathSteps = useMemo(
    () =>
      getPathTrace({
        algorithm: pathAlgorithm,
        walls,
        startNode,
        endNode,
        gridWidth,
        gridHeight,
      }),
    [pathAlgorithm, walls, startNode, endNode],
  );
  const graphTreeSteps = useMemo(() => getGraphTreeTrace(pathAlgorithm, pathTreeInput), [pathAlgorithm, pathTreeInput]);
  const activePathSteps = pathVisualMode === "tree" ? graphTreeSteps : pathSteps;
  const treeValues = useMemo(() => parseValues(treeInput).slice(0, 15), [treeInput]);
  const treeSteps = useMemo(() => getTreeTrace(treeAlgorithm, treeValues), [treeAlgorithm, treeValues]);
  const searchValues = useMemo(() => parseValues(searchInput).slice(0, 18), [searchInput]);
  const searchTarget = useMemo(() => Number(searchTargetInput) || searchValues[0] || 0, [searchTargetInput, searchValues]);
  const searchSteps = useMemo(() => getSearchTrace(searchAlgorithm, searchValues, searchTarget), [searchAlgorithm, searchValues, searchTarget]);
  const graphSteps = useMemo(() => getGraphTrace(graphAlgorithm, graphInput), [graphAlgorithm, graphInput]);
  const stringSteps = useMemo(() => getStringTrace(stringAlgorithm, stringTextInput, stringPatternInput), [stringAlgorithm, stringTextInput, stringPatternInput]);
  const dpSteps = useMemo(() => getDpTrace(dpAlgorithm, dpInput), [dpAlgorithm, dpInput]);
  const greedySteps = useMemo(() => getGreedyTrace(greedyAlgorithm, greedyInput), [greedyAlgorithm, greedyInput]);
  const hashSteps = useMemo(() => getHashTrace(hashAlgorithm, hashInput), [hashAlgorithm, hashInput]);
  const systemSteps = useMemo(() => getSystemTrace(systemAlgorithm, systemInput), [systemAlgorithm, systemInput]);
  const compressionSteps = useMemo(() => getCompressionTrace(compressionAlgorithm, compressionInput), [compressionAlgorithm, compressionInput]);
  const mathSteps = useMemo(() => getMathTrace(mathAlgorithm, mathInput), [mathAlgorithm, mathInput]);
  const geometrySteps = useMemo(() => getGeometryTrace(geometryAlgorithm, geometryInput), [geometryAlgorithm, geometryInput]);
  const mlSteps = useMemo(() => getMlTrace(mlAlgorithm, mlInput), [mlAlgorithm, mlInput]);
  const backtrackingSteps = useMemo(() => getBacktrackingTrace(backtrackingAlgorithm, backtrackingInput), [backtrackingAlgorithm, backtrackingInput]);
  const cryptoSteps = useMemo(() => getCryptoTrace(cryptoAlgorithm, cryptoInput), [cryptoAlgorithm, cryptoInput]);
  const isSortVisual = screen === "sortVisual";
  const isPathVisual = screen === "pathVisual";
  const isTreeVisual = screen === "treeVisual";
  const isSearchVisual = screen === "searchVisual";
  const isGraphVisual = screen === "graphVisual";
  const isStringVisual = screen === "stringVisual";
  const isDpVisual = screen === "dpVisual";
  const isGreedyVisual = screen === "greedyVisual";
  const isHashVisual = screen === "hashVisual";
  const isSystemVisual = screen === "systemVisual";
  const isCompressionVisual = screen === "compressionVisual";
  const isMathVisual = screen === "mathVisual";
  const isGeometryVisual = screen === "geometryVisual";
  const isMlVisual = screen === "mlVisual";
  const isBacktrackingVisual = screen === "backtrackingVisual";
  const isCryptoVisual = screen === "cryptoVisual";
  const steps = isSortVisual ? sortSteps : isPathVisual ? activePathSteps : isTreeVisual ? treeSteps : isGraphVisual ? graphSteps : isStringVisual ? stringSteps : isDpVisual ? dpSteps : isGreedyVisual ? greedySteps : isHashVisual ? hashSteps : isSystemVisual ? systemSteps : isCompressionVisual ? compressionSteps : isMathVisual ? mathSteps : isGeometryVisual ? geometrySteps : isMlVisual ? mlSteps : isBacktrackingVisual ? backtrackingSteps : isCryptoVisual ? cryptoSteps : searchSteps;
  const currentSortStep = sortSteps[Math.min(stepIndex, sortSteps.length - 1)];
  const currentPathStep = activePathSteps[Math.min(stepIndex, activePathSteps.length - 1)];
  const currentTreeStep = treeSteps[Math.min(stepIndex, treeSteps.length - 1)];
  const currentSearchStep = searchSteps[Math.min(stepIndex, searchSteps.length - 1)];
  const currentGraphStep = graphSteps[Math.min(stepIndex, graphSteps.length - 1)];
  const currentStringStep = stringSteps[Math.min(stepIndex, stringSteps.length - 1)];
  const currentDpStep = dpSteps[Math.min(stepIndex, dpSteps.length - 1)];
  const currentGreedyStep = greedySteps[Math.min(stepIndex, greedySteps.length - 1)];
  const currentHashStep = hashSteps[Math.min(stepIndex, hashSteps.length - 1)];
  const currentSystemStep = systemSteps[Math.min(stepIndex, systemSteps.length - 1)];
  const currentCompressionStep = compressionSteps[Math.min(stepIndex, compressionSteps.length - 1)];
  const currentMathStep = mathSteps[Math.min(stepIndex, mathSteps.length - 1)];
  const currentGeometryStep = geometrySteps[Math.min(stepIndex, geometrySteps.length - 1)];
  const currentMlStep = mlSteps[Math.min(stepIndex, mlSteps.length - 1)];
  const currentBacktrackingStep = backtrackingSteps[Math.min(stepIndex, backtrackingSteps.length - 1)];
  const currentCryptoStep = cryptoSteps[Math.min(stepIndex, cryptoSteps.length - 1)];

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [screen, sortAlgorithm, pathAlgorithm, pathVisualMode, pathTreeInput, treeAlgorithm, searchAlgorithm, graphAlgorithm, graphVisualMode, graphInput, stringAlgorithm, stringTextInput, stringPatternInput, dpAlgorithm, dpInput, greedyAlgorithm, greedyInput, hashAlgorithm, hashInput, systemAlgorithm, systemInput, compressionAlgorithm, compressionInput, mathAlgorithm, mathInput, geometryAlgorithm, geometryInput, mlAlgorithm, mlInput, backtrackingAlgorithm, backtrackingInput, cryptoAlgorithm, cryptoInput, values, walls, treeInput, searchInput, searchTargetInput]);

  useEffect(() => {
    if (!playing || (!isSortVisual && !isPathVisual && !isTreeVisual && !isSearchVisual && !isGraphVisual && !isStringVisual && !isDpVisual && !isGreedyVisual && !isHashVisual && !isSystemVisual && !isCompressionVisual && !isMathVisual && !isGeometryVisual && !isMlVisual && !isBacktrackingVisual && !isCryptoVisual)) return;

    if (stepIndex >= steps.length - 1) {
      setPlaying(false);
      return;
    }

    const delay = Math.max(55, 820 - speed * 7);
    const timer = window.setTimeout(() => {
      setStepIndex((value) => Math.min(value + 1, steps.length - 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [playing, stepIndex, steps.length, speed, isSortVisual, isPathVisual, isTreeVisual, isSearchVisual, isGraphVisual, isStringVisual, isDpVisual, isGreedyVisual, isHashVisual, isSystemVisual, isCompressionVisual, isMathVisual, isGeometryVisual, isMlVisual, isBacktrackingVisual, isCryptoVisual]);

  function chooseSort(algorithm: SortAlgorithm) {
    setSortAlgorithm(algorithm);
    setScreen("sortSetup");
  }

  function choosePath(algorithm: PathAlgorithm) {
    setPathAlgorithm(algorithm);
    setScreen("pathSetup");
  }

  function chooseTree(algorithm: TreeAlgorithm) {
    setTreeAlgorithm(algorithm);
    setScreen("treeSetup");
  }

  function chooseSearch(algorithm: SearchAlgorithm) {
    setSearchAlgorithm(algorithm);
    setScreen("searchSetup");
  }

  function chooseGraph(algorithm: GraphAlgorithm) {
    setGraphAlgorithm(algorithm);
    setScreen("graphSetup");
  }

  function chooseString(algorithm: StringAlgorithm) {
    setStringAlgorithm(algorithm);
    setScreen("stringSetup");
  }

  function chooseDp(algorithm: DpAlgorithm) {
    setDpAlgorithm(algorithm);
    setScreen("dpSetup");
  }

  function chooseGreedy(algorithm: GreedyAlgorithm) {
    setGreedyAlgorithm(algorithm);
    setScreen("greedySetup");
  }

  function chooseHash(algorithm: HashAlgorithm) {
    setHashAlgorithm(algorithm);
    setScreen("hashSetup");
  }

  function chooseSystem(algorithm: SystemAlgorithm) {
    setSystemAlgorithm(algorithm);
    setScreen("systemSetup");
  }

  function chooseCompression(algorithm: CompressionAlgorithm) {
    setCompressionAlgorithm(algorithm);
    setScreen("compressionSetup");
  }

  function chooseMath(algorithm: MathAlgorithm) {
    setMathAlgorithm(algorithm);
    setScreen("mathSetup");
  }

  function chooseGeometry(algorithm: GeometryAlgorithm) {
    setGeometryAlgorithm(algorithm);
    setScreen("geometrySetup");
  }

  function chooseMl(algorithm: MlAlgorithm) {
    setMlAlgorithm(algorithm);
    setScreen("mlSetup");
  }

  function chooseBacktracking(algorithm: BacktrackingAlgorithm) {
    setBacktrackingAlgorithm(algorithm);
    setScreen("backtrackingSetup");
  }

  function chooseCrypto(algorithm: CryptoAlgorithm) {
    setCryptoAlgorithm(algorithm);
    setScreen("cryptoSetup");
  }

  function startSort() {
    setValues(parseValues(arrayInput));
    setScreen("sortVisual");
  }

  function startPath() {
    setScreen("pathVisual");
  }

  function startTree() {
    setScreen("treeVisual");
  }

  function startSearch() {
    setScreen("searchVisual");
  }

  function startGraph() {
    setScreen("graphVisual");
  }

  function startString() {
    setScreen("stringVisual");
  }

  function startDp() {
    setScreen("dpVisual");
  }

  function startGreedy() {
    setScreen("greedyVisual");
  }

  function startHash() {
    setScreen("hashVisual");
  }

  function startSystem() {
    setScreen("systemVisual");
  }

  function startCompression() {
    setScreen("compressionVisual");
  }

  function startMath() {
    setScreen("mathVisual");
  }

  function startGeometry() {
    setScreen("geometryVisual");
  }

  function startMl() {
    setScreen("mlVisual");
  }

  function startBacktracking() {
    setScreen("backtrackingVisual");
  }

  function startCrypto() {
    setScreen("cryptoVisual");
  }

  function resetRun() {
    setPlaying(false);
    setStepIndex(0);
  }

  function editWall(id: number) {
    if (wallTool === "start") {
      if (id === endNode) return;
      setStartNode(id);
      setWalls((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
      return;
    }

    if (wallTool === "end") {
      if (id === startNode) return;
      setEndNode(id);
      setWalls((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
      return;
    }

    if (id === startNode || id === endNode) return;

    setWalls((current) => {
      const next = new Set(current);

      if (wallTool === "draw") next.add(id);
      else next.delete(id);

      return next;
    });
  }

  function backToMenu() {
    setScreen("menu");
    setPlaying(false);
    setStepIndex(0);
  }

  function goBack() {
    setPlaying(false);
    setStepIndex(0);
    setScreen(getBackScreen(screen));
  }

  return (
    <main className="h-screen overflow-hidden px-4 py-4 text-slate-950">
      <section className="mx-auto flex h-full max-w-[1600px] flex-col gap-4">
        <header className="px-4 py-3">

          <button
            type="button"
            onClick={backToMenu}
            className="text-base font-extrabold tracking-[0.22em] text-slate-950"
          >
            
          </button>

          {screen !== "menu" ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
            >
              <ArrowLeft size={16} />
              {screen === "sortVisual" || screen === "pathVisual" ? "Back to setup" : "Menu"}
            </button>
          ) : null}
        </header>

        {screen === "menu" ? (
          <MenuScreen chooseSort={chooseSort} choosePath={choosePath} chooseTree={chooseTree} chooseSearch={chooseSearch} chooseGraph={chooseGraph} chooseString={chooseString} chooseDp={chooseDp} chooseGreedy={chooseGreedy} chooseHash={chooseHash} chooseSystem={chooseSystem} chooseCompression={chooseCompression} chooseMath={chooseMath} chooseGeometry={chooseGeometry} chooseMl={chooseMl} chooseBacktracking={chooseBacktracking} chooseCrypto={chooseCrypto} />
        ) : null}

        {screen === "sortSetup" ? (
          <SortSetup
            algorithm={sortAlgorithm}
            arrayInput={arrayInput}
            setArrayInput={setArrayInput}
            startSort={startSort}
          />
        ) : null}

        {screen === "searchSetup" ? (
          <SearchSetup
            algorithm={searchAlgorithm}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            targetInput={searchTargetInput}
            setTargetInput={setSearchTargetInput}
            startSearch={startSearch}
          />
        ) : null}

        {screen === "cryptoSetup" ? (
          <CryptoSetup
            algorithm={cryptoAlgorithm}
            input={cryptoInput}
            setInput={setCryptoInput}
            startCrypto={startCrypto}
          />
        ) : null}

        {screen === "backtrackingSetup" ? (
          <BacktrackingSetup
            algorithm={backtrackingAlgorithm}
            input={backtrackingInput}
            setInput={setBacktrackingInput}
            startBacktracking={startBacktracking}
          />
        ) : null}

        {screen === "mlSetup" ? (
          <MlSetup
            algorithm={mlAlgorithm}
            input={mlInput}
            setInput={setMlInput}
            startMl={startMl}
          />
        ) : null}

        {screen === "geometrySetup" ? (
          <GeometrySetup
            algorithm={geometryAlgorithm}
            input={geometryInput}
            setInput={setGeometryInput}
            startGeometry={startGeometry}
          />
        ) : null}

        {screen === "mathSetup" ? (
          <MathSetup
            algorithm={mathAlgorithm}
            input={mathInput}
            setInput={setMathInput}
            startMath={startMath}
          />
        ) : null}

        {screen === "compressionSetup" ? (
          <CompressionSetup
            algorithm={compressionAlgorithm}
            input={compressionInput}
            setInput={setCompressionInput}
            startCompression={startCompression}
          />
        ) : null}

        {screen === "systemSetup" ? (
          <SystemSetup
            algorithm={systemAlgorithm}
            input={systemInput}
            setInput={setSystemInput}
            startSystem={startSystem}
          />
        ) : null}

        {screen === "hashSetup" ? (
          <HashSetup
            algorithm={hashAlgorithm}
            input={hashInput}
            setInput={setHashInput}
            startHash={startHash}
          />
        ) : null}

        {screen === "greedySetup" ? (
          <GreedySetup
            algorithm={greedyAlgorithm}
            input={greedyInput}
            setInput={setGreedyInput}
            startGreedy={startGreedy}
          />
        ) : null}

        {screen === "dpSetup" ? (
          <DpSetup
            algorithm={dpAlgorithm}
            input={dpInput}
            setInput={setDpInput}
            startDp={startDp}
          />
        ) : null}

        {screen === "stringSetup" ? (
          <StringSetup
            algorithm={stringAlgorithm}
            textInput={stringTextInput}
            setTextInput={setStringTextInput}
            patternInput={stringPatternInput}
            setPatternInput={setStringPatternInput}
            startString={startString}
          />
        ) : null}

        {screen === "graphSetup" ? (
          <GraphSetup
            algorithm={graphAlgorithm}
            visualMode={graphVisualMode}
            setVisualMode={setGraphVisualMode}
            graphInput={graphInput}
            setGraphInput={setGraphInput}
            startGraph={startGraph}
          />
        ) : null}

        {screen === "treeSetup" ? (
          <TreeSetup
            algorithm={treeAlgorithm}
            treeInput={treeInput}
            setTreeInput={setTreeInput}
            startTree={startTree}
          />
        ) : null}

        {screen === "pathSetup" ? (
          <PathSetup
            algorithm={pathAlgorithm}
            walls={walls}
            setWalls={setWalls}
            startNode={startNode}
            endNode={endNode}
            wallTool={wallTool}
            setWallTool={setWallTool}
            dragging={dragging}
            setDragging={setDragging}
            editWall={editWall}
            loadMaze={() => setWalls(new Set(defaultWalls))}
            clearWalls={() => setWalls(new Set())}
            visualMode={pathVisualMode}
            setVisualMode={setPathVisualMode}
            treeInput={pathTreeInput}
            setTreeInput={setPathTreeInput}
            startPath={startPath}
          />
        ) : null}

        {screen === "sortVisual" ? (
          <VisualShell
            title={sortLabels[sortAlgorithm]}
            subtitle={currentSortStep.message}
            stepIndex={stepIndex}
            totalSteps={sortSteps.length}
            playing={playing}
            setPlaying={setPlaying}
            step={() => setStepIndex((value) => Math.min(value + 1, sortSteps.length - 1))}
            reset={resetRun}
            speed={speed}
            setSpeed={setSpeed}
            metrics={[
              ["Comparisons", currentSortStep.comparisons],
              ["Moves", currentSortStep.moves],
            ]}
          >
            <SortingVisual step={currentSortStep} />
          </VisualShell>
        ) : null}

        {screen === "searchVisual" ? (
          <VisualShell
            title={searchLabels[searchAlgorithm]}
            subtitle={currentSearchStep.message}
            stepIndex={stepIndex}
            totalSteps={searchSteps.length}
            playing={playing}
            setPlaying={setPlaying}
            step={() => setStepIndex((value) => Math.min(value + 1, searchSteps.length - 1))}
            reset={resetRun}
            speed={speed}
            setSpeed={setSpeed}
            metrics={[
              ["Checks", currentSearchStep.checks],
              ["Target", searchTarget],
            ]}
          >
            <SearchVisual step={currentSearchStep} />
          </VisualShell>
        ) : null}

        {screen === "cryptoVisual" ? (
          <VisualShell
            title={cryptoLabels[cryptoAlgorithm]}
            subtitle={currentCryptoStep.message}
            stepIndex={stepIndex}
            totalSteps={cryptoSteps.length}
            playing={playing}
            setPlaying={setPlaying}
            step={() => setStepIndex((value) => Math.min(value + 1, cryptoSteps.length - 1))}
            reset={resetRun}
            speed={speed}
            setSpeed={setSpeed}
            metrics={[
              ["Checks", currentCryptoStep.checks],
              ["Output", currentCryptoStep.output.length],
            ]}
          >
            <CryptoVisual step={currentCryptoStep} />
          </VisualShell>
        ) : null}

        {screen === "backtrackingVisual" ? (
          <VisualShell
            title={backtrackingLabels[backtrackingAlgorithm]}
            subtitle={currentBacktrackingStep.message}
            stepIndex={stepIndex}
            totalSteps={backtrackingSteps.length}
            playing={playing}
            setPlaying={setPlaying}
            step={() => setStepIndex((value) => Math.min(value + 1, backtrackingSteps.length - 1))}
            reset={resetRun}
            speed={speed}
            setSpeed={setSpeed}
            metrics={[
              ["Checks", currentBacktrackingStep.checks],
              ["Path", currentBacktrackingStep.path.length],
            ]}
          >
            <BacktrackingVisual step={currentBacktrackingStep} />
          </VisualShell>
        ) : null}

        {screen === "mlVisual" ? (
          <VisualShell
            title={mlLabels[mlAlgorithm]}
            subtitle={currentMlStep.message}
            stepIndex={stepIndex}
            totalSteps={mlSteps.length}
            playing={playing}
            setPlaying={setPlaying}
            step={() => setStepIndex((value) => Math.min(value + 1, mlSteps.length - 1))}
            reset={resetRun}
            speed={speed}
            setSpeed={setSpeed}
            metrics={[
              ["Checks", currentMlStep.checks],
              ["Selected", currentMlStep.selected.length],
            ]}
          >
            <MlVisual step={currentMlStep} />
          </VisualShell>
        ) : null}

        {screen === "geometryVisual" ? (
          <VisualShell
            title={geometryLabels[geometryAlgorithm]}
            subtitle={currentGeometryStep.message}
            stepIndex={stepIndex}
            totalSteps={geometrySteps.length}
            playing={playing}
            setPlaying={setPlaying}
            step={() => setStepIndex((value) => Math.min(value + 1, geometrySteps.length - 1))}
            reset={resetRun}
            speed={speed}
            setSpeed={setSpeed}
            metrics={[
              ["Checks", currentGeometryStep.checks],
              ["Hull", currentGeometryStep.hull.length],
            ]}
          >
            <GeometryVisual step={currentGeometryStep} />
          </VisualShell>
        ) : null}

        {screen === "mathVisual" ? (
          <VisualShell
            title={mathLabels[mathAlgorithm]}
            subtitle={currentMathStep.message}
            stepIndex={stepIndex}
            totalSteps={mathSteps.length}
            playing={playing}
            setPlaying={setPlaying}
            step={() => setStepIndex((value) => Math.min(value + 1, mathSteps.length - 1))}
            reset={resetRun}
            speed={speed}
            setSpeed={setSpeed}
            metrics={[
              ["Checks", currentMathStep.checks],
              ["Output", currentMathStep.output.length],
            ]}
          >
            <MathVisual step={currentMathStep} />
          </VisualShell>
        ) : null}

        {screen === "compressionVisual" ? (
          <VisualShell
            title={compressionLabels[compressionAlgorithm]}
            subtitle={currentCompressionStep.message}
            stepIndex={stepIndex}
            totalSteps={compressionSteps.length}
            playing={playing}
            setPlaying={setPlaying}
            step={() => setStepIndex((value) => Math.min(value + 1, compressionSteps.length - 1))}
            reset={resetRun}
            speed={speed}
            setSpeed={setSpeed}
            metrics={[
              ["Checks", currentCompressionStep.checks],
              ["Output", currentCompressionStep.output.length],
            ]}
          >
            <CompressionVisual step={currentCompressionStep} />
          </VisualShell>
        ) : null}

        {screen === "systemVisual" ? (
          <VisualShell
            title={systemLabels[systemAlgorithm]}
            subtitle={currentSystemStep.message}
            stepIndex={stepIndex}
            totalSteps={systemSteps.length}
            playing={playing}
            setPlaying={setPlaying}
            step={() => setStepIndex((value) => Math.min(value + 1, systemSteps.length - 1))}
            reset={resetRun}
            speed={speed}
            setSpeed={setSpeed}
            metrics={[
              ["Checks", currentSystemStep.checks],
              ["Selected", currentSystemStep.selected.length],
            ]}
          >
            <SystemVisual step={currentSystemStep} />
          </VisualShell>
        ) : null}

        {screen === "hashVisual" ? (
          <VisualShell
            title={hashLabels[hashAlgorithm]}
            subtitle={currentHashStep.message}
            stepIndex={stepIndex}
            totalSteps={hashSteps.length}
            playing={playing}
            setPlaying={setPlaying}
            step={() => setStepIndex((value) => Math.min(value + 1, hashSteps.length - 1))}
            reset={resetRun}
            speed={speed}
            setSpeed={setSpeed}
            metrics={[
              ["Checks", currentHashStep.checks],
              ["Bucket", currentHashStep.activeBucket ?? 0],
            ]}
          >
            <HashVisual step={currentHashStep} />
          </VisualShell>
        ) : null}

        {screen === "greedyVisual" ? (
          <VisualShell
            title={greedyLabels[greedyAlgorithm]}
            subtitle={currentGreedyStep.message}
            stepIndex={stepIndex}
            totalSteps={greedySteps.length}
            playing={playing}
            setPlaying={setPlaying}
            step={() => setStepIndex((value) => Math.min(value + 1, greedySteps.length - 1))}
            reset={resetRun}
            speed={speed}
            setSpeed={setSpeed}
            metrics={[
              ["Checks", currentGreedyStep.checks],
              ["Selected", currentGreedyStep.selected.length],
            ]}
          >
            <GreedyVisual step={currentGreedyStep} />
          </VisualShell>
        ) : null}

        {screen === "dpVisual" ? (
          <VisualShell
            title={dpLabels[dpAlgorithm]}
            subtitle={currentDpStep.message}
            stepIndex={stepIndex}
            totalSteps={dpSteps.length}
            playing={playing}
            setPlaying={setPlaying}
            step={() => setStepIndex((value) => Math.min(value + 1, dpSteps.length - 1))}
            reset={resetRun}
            speed={speed}
            setSpeed={setSpeed}
            metrics={[
              ["Checks", currentDpStep.checks],
              ["Output", currentDpStep.output[currentDpStep.output.length - 1] ?? 0],
            ]}
          >
            <DpVisual step={currentDpStep} />
          </VisualShell>
        ) : null}

        {screen === "stringVisual" ? (
          <VisualShell
            title={stringLabels[stringAlgorithm]}
            subtitle={currentStringStep.message}
            stepIndex={stepIndex}
            totalSteps={stringSteps.length}
            playing={playing}
            setPlaying={setPlaying}
            step={() => setStepIndex((value) => Math.min(value + 1, stringSteps.length - 1))}
            reset={resetRun}
            speed={speed}
            setSpeed={setSpeed}
            metrics={[
              ["Checks", currentStringStep.checks],
              ["Pattern", currentStringStep.pattern.length],
            ]}
          >
            <StringVisual step={currentStringStep} />
          </VisualShell>
        ) : null}

        {screen === "graphVisual" ? (
          <VisualShell
            title={graphLabels[graphAlgorithm]}
            subtitle={currentGraphStep.message}
            stepIndex={stepIndex}
            totalSteps={graphSteps.length}
            playing={playing}
            setPlaying={setPlaying}
            step={() => setStepIndex((value) => Math.min(value + 1, graphSteps.length - 1))}
            reset={resetRun}
            speed={speed}
            setSpeed={setSpeed}
            metrics={[
              ["Checks", currentGraphStep.checks],
              ["Visited", currentGraphStep.visited.length],
            ]}
          >
            <GraphVisual algorithm={graphAlgorithm} graphInput={graphInput} step={currentGraphStep} visualMode={graphVisualMode} />
          </VisualShell>
        ) : null}

        {screen === "treeVisual" ? (
          <VisualShell
            title={treeLabels[treeAlgorithm]}
            subtitle={currentTreeStep.message}
            stepIndex={stepIndex}
            totalSteps={treeSteps.length}
            playing={playing}
            setPlaying={setPlaying}
            step={() => setStepIndex((value) => Math.min(value + 1, treeSteps.length - 1))}
            reset={resetRun}
            speed={speed}
            setSpeed={setSpeed}
            metrics={[
              ["Nodes", treeValues.length],
              ["Visited", currentTreeStep.visited.length],
            ]}
          >
            <TreeVisual values={treeValues} step={currentTreeStep} />
          </VisualShell>
        ) : null}

        {screen === "pathVisual" ? (
          <VisualShell
            title={pathLabels[pathAlgorithm]}
            subtitle={currentPathStep.message}
            stepIndex={stepIndex}
            totalSteps={activePathSteps.length}
            playing={playing}
            setPlaying={setPlaying}
            step={() => setStepIndex((value) => Math.min(value + 1, activePathSteps.length - 1))}
            reset={resetRun}
            speed={speed}
            setSpeed={setSpeed}
            metrics={[
              ["Node checks", currentPathStep.checks],
              ["Visited", currentPathStep.visited.length],
            ]}
          >
            <PathVisual
              step={currentPathStep}
              walls={walls}
              startNode={startNode}
              endNode={endNode}
              visualMode={pathVisualMode}
              treeInput={pathTreeInput}
            />
          </VisualShell>
        ) : null}
      </section>
    </main>
  );
}


function parseGraphNodeLabels(input: string) {
  const labels = input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 31);

  return labels.length > 0 ? labels : ["S", "A", "B", "C", "D", "E", "F"];
}

function buildGraphTreePath(previous: Map<number, number>, node: number) {
  const path = [node];
  let current = node;

  while (previous.has(current)) {
    current = previous.get(current)!;
    path.unshift(current);
  }

  return path;
}

function getGraphTreeTrace(algorithm: PathAlgorithm, input: string): PathStep[] {
  const labels = parseGraphNodeLabels(input);
  const start = 0;
  const target = labels.length - 1;
  const steps: PathStep[] = [];
  const visited = new Set<number>();
  const seen = new Set<number>([start]);
  const previous = new Map<number, number>();
  let checks = 0;

  function children(index: number) {
    return [index * 2 + 1, index * 2 + 2].filter((child) => child < labels.length);
  }

  function pushStep(current: number | null, frontier: number[], message: string) {
    steps.push({
      visited: [...visited],
      frontier: [...frontier],
      path: current === null ? [] : buildGraphTreePath(previous, current),
      current,
      message,
      checks,
    });
  }

  const algorithmName = pathLabels[algorithm] ?? "Graph search";

  pushStep(start, [start], `${algorithmName} starts at node ${labels[start]} and searches for target node ${labels[target]}.`);

  if (algorithm === "dfs") {
    const stack = [start];

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (visited.has(current)) continue;

      visited.add(current);
      pushStep(current, [...stack], current === target ? `Found target ${labels[target]}. Stop search.` : `Visit node ${labels[current]}.`);

      if (current === target) break;

      const nextNodes = children(current).reverse();

      for (const next of nextNodes) {
        checks++;

        if (seen.has(next)) continue;

        seen.add(next);
        previous.set(next, current);
        stack.push(next);
        pushStep(next, [...stack], `Push child node ${labels[next]} onto the DFS stack.`);
      }
    }

    pushStep(target, [], visited.has(target) ? `DFS complete. Target ${labels[target]} was found.` : `DFS complete. Target ${labels[target]} was not found.`);
    return steps;
  }

  if (algorithm === "greedy" || algorithm === "astar" || algorithm === "dijkstra") {
    const distance = new Map<number, number>([[start, 0]]);
    const frontier = [start];

    while (frontier.length > 0) {
      frontier.sort((a, b) => {
        const da = distance.get(a) ?? Infinity;
        const db = distance.get(b) ?? Infinity;
        const ha = Math.abs(target - a);
        const hb = Math.abs(target - b);

        if (algorithm === "greedy") return ha - hb;
        if (algorithm === "astar") return da + ha - (db + hb);
        return da - db;
      });

      const current = frontier.shift()!;
      if (visited.has(current)) continue;

      visited.add(current);
      pushStep(
        current,
        [...frontier],
        current === target
          ? `Found target ${labels[target]}. Stop search.`
          : algorithm === "greedy"
            ? `Visit node ${labels[current]} because it looks closest to the target.`
            : algorithm === "astar"
              ? `Visit node ${labels[current]} using distance plus heuristic.`
              : `Visit node ${labels[current]} using shortest known distance.`,
      );

      if (current === target) break;

      for (const next of children(current)) {
        checks++;

        if (visited.has(next)) continue;

        const candidate = (distance.get(current) ?? 0) + 1;

        if (!seen.has(next) || candidate < (distance.get(next) ?? Infinity)) {
          seen.add(next);
          distance.set(next, candidate);
          previous.set(next, current);
          frontier.push(next);
          pushStep(next, [...frontier], `Add child node ${labels[next]} to the frontier.`);
        }
      }
    }

    pushStep(target, [], visited.has(target) ? `${algorithmName} complete. Target ${labels[target]} was found.` : `${algorithmName} complete. Target ${labels[target]} was not found.`);
    return steps;
  }

  // BFS-style fallback for BFS, Bellman-Ford, Floyd-Warshall, Johnson, Bidirectional, Topological on this tree view.
  const queue = [start];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (visited.has(current)) continue;

    visited.add(current);
    pushStep(current, [...queue], current === target ? `Found target ${labels[target]}. Stop search.` : `Visit node ${labels[current]}.`);

    if (current === target) break;

    for (const next of children(current)) {
      checks++;

      if (seen.has(next)) continue;

      seen.add(next);
      previous.set(next, current);
      queue.push(next);
      pushStep(next, [...queue], `Add child node ${labels[next]} to the queue.`);
    }
  }

  pushStep(target, [], visited.has(target) ? `${algorithmName} complete. Target ${labels[target]} was found.` : `${algorithmName} complete. Target ${labels[target]} was not found.`);
  return steps;
}


function ArrowIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function RollingText({ children }: { children: string }) {
  return (
    <span className="relative block h-[20px] overflow-hidden">
      <span className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
        <span className="h-[20px] leading-[20px]">{children}</span>
        <span className="h-[20px] leading-[20px]">{children}</span>
      </span>
    </span>
  );
}

function OrangeLinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="group flex w-fit items-center gap-3 rounded-full bg-[#F26522] py-2 pl-5 pr-2 text-[13px] font-semibold leading-[14px] text-white transition-colors duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-[#e05a1a] sm:pl-6"
    >
      <RollingText>{label}</RollingText>

      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#F26522] transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
        <ArrowIcon size={15} />
      </span>
    </a>
  );
}

function MenuScreen({
  chooseSort,
  choosePath,
  chooseTree,
  chooseSearch,
  chooseGraph,
  chooseString,
  chooseDp,
  chooseGreedy,
  chooseHash,
  chooseSystem,
  chooseCompression,
  chooseMath,
  chooseGeometry,
  chooseMl,
  chooseBacktracking,
  chooseCrypto,
}: {
  chooseSort: (algorithm: SortAlgorithm) => void;
  choosePath: (algorithm: PathAlgorithm) => void;
  chooseTree: (algorithm: TreeAlgorithm) => void;
  chooseSearch: (algorithm: SearchAlgorithm) => void;
  chooseGraph: (algorithm: GraphAlgorithm) => void;
  chooseString: (algorithm: StringAlgorithm) => void;
  chooseDp: (algorithm: DpAlgorithm) => void;
  chooseGreedy: (algorithm: GreedyAlgorithm) => void;
  chooseHash: (algorithm: HashAlgorithm) => void;
  chooseSystem: (algorithm: SystemAlgorithm) => void;
  chooseCompression: (algorithm: CompressionAlgorithm) => void;
  chooseMath: (algorithm: MathAlgorithm) => void;
  chooseGeometry: (algorithm: GeometryAlgorithm) => void;
  chooseMl: (algorithm: MlAlgorithm) => void;
  chooseBacktracking: (algorithm: BacktrackingAlgorithm) => void;
  chooseCrypto: (algorithm: CryptoAlgorithm) => void;
}) {

  const [catalogQuery, setCatalogQuery] = useState("");

  function fuzzyMatch(text: string, query: string) {
    const source = text.toLowerCase().replace(/[^a-z0-9]/g, "");
    const target = query.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (!target) return true;
    if (source.includes(target)) return true;

    let pointer = 0;

    for (const char of source) {
      if (char === target[pointer]) pointer++;
      if (pointer === target.length) return true;
    }

    return false;
  }

  const filteredCatalog = algorithmCatalog
    .map((section) => ({
      ...section,
      entries: section.entries.filter((entry) =>
        fuzzyMatch(`${entry.title} ${entry.tag} ${section.title}`, catalogQuery),
      ),
    }))
    .filter((section) => section.entries.length > 0);

  function openAlgorithm(entry: CatalogEntry) {
    if (entry.status !== "playable") return;

    if (entry.id && algorithmAliases[entry.id]) {
      const alias = algorithmAliases[entry.id];

      if (alias.kind === "tree") chooseTree(alias.target as TreeAlgorithm);
      if (alias.kind === "string") chooseString(alias.target as StringAlgorithm);
      if (alias.kind === "dp") chooseDp(alias.target as DpAlgorithm);

      return;
    }

    if (entry.kind === "sort") {
      if (
        entry.id === "bubble" ||
        entry.id === "insertion" ||
        entry.id === "selection" ||
        entry.id === "merge" ||
        entry.id === "quick" ||
        entry.id === "heap" ||
        entry.id === "counting" ||
        entry.id === "radix" ||
        entry.id === "bucket" ||
        entry.id === "shell" ||
        entry.id === "cocktail" ||
        entry.id === "comb" ||
        entry.id === "cycle" ||
        entry.id === "pigeonhole" ||
        entry.id === "pancake" ||
        entry.id === "exchange" ||
        entry.id === "gnome" ||
        entry.id === "oddEven" ||
        entry.id === "binaryInsertion" ||
        entry.id === "stooge" ||
        entry.id === "bead" ||
        entry.id === "tim" ||
        entry.id === "intro" ||
        entry.id === "bogo" ||
        entry.id === "strand" ||
        entry.id === "bitonic" ||
        entry.id === "smooth" ||
        entry.id === "stooge" ||
        entry.id === "bead" ||
        entry.id === "tim" ||
        entry.id === "intro" ||
        entry.id === "bogo" ||
        entry.id === "strand" ||
        entry.id === "bitonic" ||
        entry.id === "smooth"
      ) {
        chooseSort(entry.id);
      }
      return;
    }

    if (entry.kind === "path") {
      if (
        entry.id === "dijkstra" ||
        entry.id === "astar" ||
        entry.id === "bfs" ||
        entry.id === "dfs" ||
        entry.id === "greedy" ||
        entry.id === "bellmanFord" ||
        entry.id === "bidirectional" ||
        entry.id === "johnson" ||
        entry.id === "floodFill"
      ) {
        choosePath(entry.id);
      }
      return;
    }

    if (entry.kind === "search") {
      if (
        entry.id === "linear" ||
        entry.id === "binary" ||
        entry.id === "jump" ||
        entry.id === "exponential" ||
        entry.id === "interpolation" ||
        entry.id === "ternary" ||
        entry.id === "fibonacci" ||
        entry.id === "quickselect"
      ) {
        chooseSearch(entry.id);
      }
      return;
    }

    if (entry.kind === "crypto") {
      if (
        entry.id === "rsa" ||
        entry.id === "diffieHellman" ||
        entry.id === "ecc" ||
        entry.id === "aes" ||
        entry.id === "des" ||
        entry.id === "chacha20" ||
        entry.id === "sha256" ||
        entry.id === "sha3" ||
        entry.id === "hmac" ||
        entry.id === "pbkdf2" ||
        entry.id === "bcrypt" ||
        entry.id === "argon2"
      ) {
        chooseCrypto(entry.id);
      }
      return;
    }

    if (entry.kind === "backtracking") {
      if (
        entry.id === "backtracking" ||
        entry.id === "nQueens" ||
        entry.id === "sudokuSolver" ||
        entry.id === "subsetGeneration" ||
        entry.id === "permutationGeneration" ||
        entry.id === "combinationGeneration" ||
        entry.id === "branchAndBound" ||
        entry.id === "sjt"
      ) {
        chooseBacktracking(entry.id);
      }
      return;
    }

    if (entry.kind === "ml") {
      if (
        entry.id === "kMeans" ||
        entry.id === "knn" ||
        entry.id === "naiveBayes" ||
        entry.id === "decisionTree" ||
        entry.id === "randomForest" ||
        entry.id === "svm" ||
        entry.id === "gradientBoosting" ||
        entry.id === "expectationMaximization" ||
        entry.id === "minimax" ||
        entry.id === "alphaBetaPruning" ||
        entry.id === "mcts" ||
        entry.id === "qLearning"
      ) {
        chooseMl(entry.id);
      }
      return;
    }

    if (entry.kind === "geometry") {
      if (
        entry.id === "grahamScan" ||
        entry.id === "jarvisMarch" ||
        entry.id === "quickHull" ||
        entry.id === "sweepLine" ||
        entry.id === "closestPair" ||
        entry.id === "lineSegmentIntersection" ||
        entry.id === "pointInPolygon" ||
        entry.id === "delaunayTriangulation" ||
        entry.id === "voronoiDiagram"
      ) {
        chooseGeometry(entry.id);
      }
      return;
    }

    if (entry.kind === "math") {
      if (
        entry.id === "euclidean" ||
        entry.id === "extendedEuclidean" ||
        entry.id === "sieve" ||
        entry.id === "modularExponentiation" ||
        entry.id === "millerRabin" ||
        entry.id === "chineseRemainder" ||
        entry.id === "fft" ||
        entry.id === "karatsuba" ||
        entry.id === "aksPrimality" ||
        entry.id === "newtonMethod" ||
        entry.id === "gradientDescent" ||
        entry.id === "monteCarloMethod"
      ) {
        chooseMath(entry.id);
      }
      return;
    }

    if (entry.kind === "compression") {
      if (
        entry.id === "lz78" ||
        entry.id === "lzw" ||
        entry.id === "arithmeticCoding" ||
        entry.id === "bwtCompression" ||
        entry.id === "runLengthEncoding" ||
        entry.id === "deflate" ||
        entry.id === "huffmanDecoding" ||
        entry.id === "deltaEncoding" ||
        entry.id === "lz77"
      ) {
        chooseCompression(entry.id);
      }
      return;
    }

    if (entry.kind === "system") {
      if (
        entry.id === "lruCache" ||
        entry.id === "lfuCache" ||
        entry.id === "roundRobin" ||
        entry.id === "shortestJobFirst" ||
        entry.id === "bankersAlgorithm" ||
        entry.id === "twoPhaseLocking" ||
        entry.id === "hashJoin" ||
        entry.id === "mergeJoin" ||
        entry.id === "nestedLoopJoin" ||
        entry.id === "queryOptimization" ||
        entry.id === "bTreeIndexSystem" ||
        entry.id === "priorityScheduling"
      ) {
        chooseSystem(entry.id);
      }
      return;
    }

    if (entry.kind === "hash") {
      if (
        entry.id === "hashInsert" ||
        entry.id === "hashLookup" ||
        entry.id === "hashDelete" ||
        entry.id === "separateChaining" ||
        entry.id === "linearProbing" ||
        entry.id === "quadraticProbing" ||
        entry.id === "doubleHashing" ||
        entry.id === "rehashing" ||
        entry.id === "consistentHashing" ||
        entry.id === "bloomFilter" ||
        entry.id === "cuckooHashing"
      ) {
        chooseHash(entry.id);
      }
      return;
    }

    if (entry.kind === "greedy") {
      if (
        entry.id === "activitySelection" ||
        entry.id === "jobSequencing" ||
        entry.id === "huffmanCoding" ||
        entry.id === "fractionalKnapsack" ||
        entry.id === "primTable" ||
        entry.id === "kruskalTable" ||
        entry.id === "intervalScheduling" ||
        entry.id === "gasStation"
      ) {
        chooseGreedy(entry.id);
      }
      return;
    }

    if (entry.kind === "dp") {
      if (
        entry.id === "knapsack" ||
        entry.id === "coinChange" ||
        entry.id === "lis" ||
        entry.id === "kadane" ||
        entry.id === "matrixChain" ||
        entry.id === "floydWarshall" ||
        entry.id === "bellmanFordTable" ||
        entry.id === "dijkstraTable" ||
        entry.id === "subsetSum" ||
        entry.id === "rodCutting" ||
        entry.id === "dpOnTrees"
      ) {
        chooseDp(entry.id);
      }
      return;
    }

    if (entry.kind === "string") {
      if (
        entry.id === "kmp" ||
        entry.id === "rabinKarp" ||
        entry.id === "boyerMoore" ||
        entry.id === "zAlgorithm" ||
        entry.id === "manacher" ||
        entry.id === "ahoCorasick" ||
        entry.id === "editDistance" ||
        entry.id === "lcs" ||
        entry.id === "suffixAutomaton" ||
        entry.id === "burrowsWheelerTransform"
      ) {
        chooseString(entry.id);
      }
      return;
    }

    if (entry.kind === "graph") {
      if (
        entry.id === "graphBfs" ||
        entry.id === "graphDfs" ||
        entry.id === "topological" ||
        entry.id === "connectedComponents" ||
        entry.id === "kosaraju" ||
        entry.id === "tarjan" ||
        entry.id === "unionFind" ||
        entry.id === "pathCompression" ||
        entry.id === "bridgeFinding" ||
        entry.id === "articulationPoints" ||
        entry.id === "eulerianPath" ||
        entry.id === "kruskal" ||
        entry.id === "prim" ||
        entry.id === "boruvka" ||
        entry.id === "reverseDelete" ||
        entry.id === "fordFulkerson" ||
        entry.id === "edmondsKarp" ||
        entry.id === "dinic" ||
        entry.id === "pushRelabel" ||
        entry.id === "minCostMaxFlow" ||
        entry.id === "hopcroftKarp" ||
        entry.id === "blossom" ||
        entry.id === "hungarian"
      ) {
        chooseGraph(entry.id);
      }
      return;
    }

    if (entry.kind === "tree") {
      if (
        entry.id === "treeBfs" ||
        entry.id === "preorder" ||
        entry.id === "inorder" ||
        entry.id === "postorder" ||
        entry.id === "bstInsert" ||
        entry.id === "bstSearch" ||
        entry.id === "bstDelete" ||
        entry.id === "treeSort" ||
        entry.id === "avlTree" ||
        entry.id === "redBlackTree" ||
        entry.id === "bTree" ||
        entry.id === "bPlusTreeSearch" ||
        entry.id === "trie" ||
        entry.id === "segmentTree" ||
        entry.id === "fenwickTree" ||
        entry.id === "suffixTree" ||
        entry.id === "suffixArray" ||
        entry.id === "minHeapInsert" ||
        entry.id === "maxHeapInsert" ||
        entry.id === "heapifyTree" ||
        entry.id === "extractMin" ||
        entry.id === "extractMax" ||
        entry.id === "decreaseKey" ||
        entry.id === "binomialHeap" ||
        entry.id === "fibonacciHeap"
      ) {
        chooseTree(entry.id);
      }
    }
  }

  const playableCount = algorithmCatalog.reduce(
    (count, section) => count + section.entries.filter((entry) => entry.status === "playable").length,
    0,
  );

  const totalCount = algorithmCatalog.reduce((count, section) => count + section.entries.length, 0);

  return (
    <section className="grid min-h-0 flex-1 gap-4 xl:max-h-[calc(100dvh-7rem)] xl:grid-cols-[0.72fr_1.28fr]">
      <div className="nr-hero-shell relative min-h-0 overflow-y-auto nr-glass rounded-[2rem] border border-white/70 bg-white/72 backdrop-blur-xl p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
        <p className="text-[11px] font-black uppercase tracking-[0.30em] text-slate-500">
          
        </p>
        <h1 className="nr-brand-title">
            DSA Visualizer <span className="nr-brand-by">by Nikul Ram</span>
          </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
          Search, choose, customize, and run the visual.
          </p>
          <p className="mt-3 max-w-xl text-sm font-bold leading-6 text-slate-500">
            For more information about this project, visit GitHub:{" "}
            <a
              href="https://github.com/nikulram/DSA-Visualizer"
              target="_blank"
              rel="noreferrer"
              className="font-extrabold text-slate-500 underline underline-offset-4 hover:text-slate-950"
            >
              github.com/nikulram/DSA-Visualizer
            </a>
        </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <OrangeLinkButton href="https://www.nikulram.com/projects" label="Back to Projects" />
            <OrangeLinkButton href="https://www.nikulram.com" label="Back to Home" />
          </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Stat label="Active" value={String(playableCount)} />
          <Stat label="Catalog" value={`${totalCount}`} />
          <Stat label="Families" value={String(algorithmCatalog.length)} />
        </div>
      </div>

      <div className="flex min-h-0 flex-col overflow-hidden nr-glass rounded-[2rem] border border-white/70 bg-white/72 backdrop-blur-xl p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.30em] text-slate-400">
              Algorithm catalog
            </p>
            <h2 className="mt-1 text-[1.65rem] font-extrabold text-slate-950">
              DSA Visualizer
            </h2>
          </div>
        </div>

        <div className="mb-4">
          <input
            value={catalogQuery}
            onChange={(event) => setCatalogQuery(event.target.value)}
            placeholder="Search algorithms, Big-O, graph, sort, tree..."
            className="w-full rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-4 text-base font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:shadow-xl focus:shadow-sky-100/80"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-2 pb-10">
          {filteredCatalog.length > 0 ? (
            <div className="nr-catalog-master-grid">
              {filteredCatalog.flatMap((section) => [
                <h3 key={`${section.title}-heading`} className="nr-catalog-heading-row">
                  {section.title}
                </h3>,
                ...section.entries.map((entry) => (
                  <AlgorithmCard
                    key={`${section.title}-${entry.title}`}
                    title={entry.title}
                    tag={entry.tag}
                    disabled={entry.status !== "playable"}
                    onClick={() => openAlgorithm(entry)}
                  />
                )),
              ])}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white/55 p-6 text-center">
              <p className="text-lg font-extrabold text-slate-950">No algorithm found</p>
              <p className="mt-2 text-sm font-bold text-slate-500">Try search terms like sort, graph, tree, BFS, heap, or O(n).</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SearchSetup({
  algorithm,
  searchInput,
  setSearchInput,
  targetInput,
  setTargetInput,
  startSearch,
}: {
  algorithm: SearchAlgorithm;
  searchInput: string;
  setSearchInput: (value: string) => void;
  targetInput: string;
  setTargetInput: (value: string) => void;
  startSearch: () => void;
}) {
  return (
    <section className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[0.75fr_1.25fr]">
      <SetupPanel
        title={searchLabels[algorithm]}
        subtitle={
          algorithm === "linear"
            ? "Enter values in any order. Linear Search checks one by one."
            : "Enter values in any order. This visual sorts the array first because this search requires sorted input."
        }
        buttonText="Start Visualization"
        onStart={startSearch}
      />

      <div className="nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Search input</p>
        <h2 className="mt-2 text-[2rem] font-extrabold">Enter array and target</h2>
        <p className="mt-3 text-slate-600">
          Use comma-separated values. Binary, Jump, and Exponential Search will use a sorted copy.
        </p>

        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          className="mt-5 w-full rounded-2xl border border-slate-200 bg-white/55 px-5 py-4 text-lg font-bold text-slate-950 outline-none focus:border-sky-400"
        />

        <input
          value={targetInput}
          onChange={(event) => setTargetInput(event.target.value)}
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-white/55 px-5 py-4 text-lg font-bold text-slate-950 outline-none focus:border-orange-400"
          placeholder="Target value"
        />

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => {
              setSearchInput("8, 14, 22, 31, 42, 55, 67, 73, 86, 95");
              setTargetInput("55");
            }}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:bg-cyan-50"
          >
            Found case
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchInput("8, 14, 22, 31, 42, 55, 67, 73, 86, 95");
              setTargetInput("100");
            }}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:bg-cyan-50"
          >
            Missing case
          </button>
          <button
            type="button"
            onClick={() => {
              const values = randomValues().slice(0, 12);
              setSearchInput(values.join(", "));
              setTargetInput(String(values[Math.floor(values.length / 2)]));
            }}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:bg-cyan-50"
          >
            Random
          </button>
        </div>
      </div>
    </section>
  );
}

function SortSetup({
  algorithm,
  arrayInput,
  setArrayInput,
  startSort,
}: {
  algorithm: SortAlgorithm;
  arrayInput: string;
  setArrayInput: (value: string) => void;
  startSort: () => void;
}) {
  return (
    <section className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[0.75fr_1.25fr]">
      <SetupPanel
        title={sortLabels[algorithm]}
        subtitle="Set the numbers first. Then launch the visual run."
        buttonText="Start Visualization"
        onStart={startSort}
      />

      <div className="nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Custom numbers</p>
        <h2 className="mt-2 text-[2rem] font-extrabold">Enter your own array</h2>
        <p className="mt-3 text-slate-600">
          Use commas between numbers. Keep it around 8 to 18 values for the best visual.
        </p>

        <input
          value={arrayInput}
          onChange={(event) => setArrayInput(event.target.value)}
          className="mt-5 w-full rounded-2xl border border-slate-200 bg-white/55 px-5 py-4 text-lg font-bold text-slate-950 outline-none focus:border-sky-400"
        />

        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          {Object.entries(presets).map(([name, values]) => (
            <button
              key={name}
              type="button"
              onClick={() => setArrayInput(values.join(", "))}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold capitalize text-slate-700 transition hover:border-sky-200 hover:bg-cyan-50"
            >
              {name.replace(/([A-Z])/g, " $1")}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setArrayInput(randomValues().join(", "))}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-extrabold text-slate-900 transition hover:bg-cyan-200"
        >
          <Shuffle size={16} />
          Randomize
        </button>
      </div>
    </section>
  );
}













function CryptoSetup({
  algorithm,
  input,
  setInput,
  startCrypto,
}: {
  algorithm: CryptoAlgorithm;
  input: string;
  setInput: (value: string) => void;
  startCrypto: () => void;
}) {
  return (
    <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[0.72fr_1.28fr]">
      <SetupPanel
        title={cryptoLabels[algorithm]}
        subtitle="Crypto visuals show keys, block state, modular operations, rounds, and final output."
        buttonText="Start Visualization"
        onStart={startCrypto}
      />

      <div className="nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Crypto input</p>
        <h2 className="mt-2 text-[2rem] font-extrabold">Enter message</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
          Use any short text. Public-key algorithms use it as a compact numeric message.
        </p>

        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="HELLO"
          className="mt-5 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-4 text-base font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:shadow-xl focus:shadow-sky-100/80"
        />
      </div>
    </section>
  );
}

function BacktrackingSetup({
  algorithm,
  input,
  setInput,
  startBacktracking,
}: {
  algorithm: BacktrackingAlgorithm;
  input: string;
  setInput: (value: string) => void;
  startBacktracking: () => void;
}) {
  return (
    <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[0.72fr_1.28fr]">
      <SetupPanel
        title={backtrackingLabels[algorithm]}
        subtitle="Backtracking visuals show recursive path, choices, board state, checks, and undo steps."
        buttonText="Start Visualization"
        onStart={startBacktracking}
      />

      <div className="nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Backtracking input</p>
        <h2 className="mt-2 text-[2rem] font-extrabold">Enter values</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
          Use comma-separated values. N Queens can use a board size like 4 or 5.
        </p>

        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="A, B, C, D"
          className="mt-5 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-4 text-base font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:shadow-xl focus:shadow-sky-100/80"
        />
      </div>
    </section>
  );
}

function MlSetup({
  algorithm,
  input,
  setInput,
  startMl,
}: {
  algorithm: MlAlgorithm;
  input: string;
  setInput: (value: string) => void;
  startMl: () => void;
}) {
  return (
    <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[0.72fr_1.28fr]">
      <SetupPanel
        title={mlLabels[algorithm]}
        subtitle="Machine learning visuals use editable x,y points, clusters, class labels, and probability tables."
        buttonText="Start Visualization"
        onStart={startMl}
      />

      <div className="nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">ML input</p>
        <h2 className="mt-2 text-[2rem] font-extrabold">Enter x,y points</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
          Use comma-separated pairs. Labels are inferred from the point positions for this visual batch.
        </p>

        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="12,18, 18,28, 58,64, 66,72"
          className="mt-5 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-4 text-base font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:shadow-xl focus:shadow-sky-100/80"
        />
      </div>
    </section>
  );
}

function GeometrySetup({
  algorithm,
  input,
  setInput,
  startGeometry,
}: {
  algorithm: GeometryAlgorithm;
  input: string;
  setInput: (value: string) => void;
  startGeometry: () => void;
}) {
  return (
    <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[0.72fr_1.28fr]">
      <SetupPanel
        title={geometryLabels[algorithm]}
        subtitle="Geometry algorithms use editable x,y point pairs, hull edges, active comparisons, and sweep state."
        buttonText="Start Visualization"
        onStart={startGeometry}
      />

      <div className="nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Geometry input</p>
        <h2 className="mt-2 text-[2rem] font-extrabold">Enter x,y points</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
          Use comma-separated pairs: x1,y1, x2,y2, x3,y3. The visual normalizes the points into a plane.
        </p>

        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="12,70, 22,22, 36,55, 48,18"
          className="mt-5 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-4 text-base font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:shadow-xl focus:shadow-sky-100/80"
        />
      </div>
    </section>
  );
}

function MathSetup({
  algorithm,
  input,
  setInput,
  startMath,
}: {
  algorithm: MathAlgorithm;
  input: string;
  setInput: (value: string) => void;
  startMath: () => void;
}) {
  return (
    <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[0.72fr_1.28fr]">
      <SetupPanel
        title={mathLabels[algorithm]}
        subtitle="Math algorithms show numeric states, recurrence tables, active values, and computed output."
        buttonText="Start Visualization"
        onStart={startMath}
      />

      <div className="nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Math input</p>
        <h2 className="mt-2 text-[2rem] font-extrabold">Enter numbers</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
          Use comma-separated numbers. Euclidean uses first two. Modular exponentiation uses base, exponent, modulus.
        </p>

        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="252, 105, 2, 13, 497"
          className="mt-5 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-4 text-base font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:shadow-xl focus:shadow-sky-100/80"
        />
      </div>
    </section>
  );
}

function CompressionSetup({
  algorithm,
  input,
  setInput,
  startCompression,
}: {
  algorithm: CompressionAlgorithm;
  input: string;
  setInput: (value: string) => void;
  startCompression: () => void;
}) {
  return (
    <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[0.72fr_1.28fr]">
      <SetupPanel
        title={compressionLabels[algorithm]}
        subtitle="Compression algorithms show dictionaries, active tokens, transformed rows, and encoded output."
        buttonText="Start Visualization"
        onStart={startCompression}
      />

      <div className="nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Compression input</p>
        <h2 className="mt-2 text-[2rem] font-extrabold">Enter text</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
          Use letters, numbers, underscore, or dollar sign. The visual shows each emitted token.
        </p>

        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="BANANA_BANDANA"
          className="mt-5 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-4 text-base font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:shadow-xl focus:shadow-sky-100/80"
        />
      </div>
    </section>
  );
}

function SystemSetup({
  algorithm,
  input,
  setInput,
  startSystem,
}: {
  algorithm: SystemAlgorithm;
  input: string;
  setInput: (value: string) => void;
  startSystem: () => void;
}) {
  return (
    <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[0.72fr_1.28fr]">
      <SetupPanel
        title={systemLabels[algorithm]}
        subtitle="Systems algorithms use queues, cache tables, process rows, and selected states."
        buttonText="Start Visualization"
        onStart={startSystem}
      />

      <div className="nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Systems input</p>
        <h2 className="mt-2 text-[2rem] font-extrabold">Enter values</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
          Use comma-separated numbers. Cache algorithms treat them as requests. Scheduling algorithms treat them as burst times.
        </p>

        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="1, 2, 3, 1, 4, 5, 2, 1, 2, 3, 4, 5"
          className="mt-5 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-4 text-base font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:shadow-xl focus:shadow-sky-100/80"
        />
      </div>
    </section>
  );
}

function HashSetup({
  algorithm,
  input,
  setInput,
  startHash,
}: {
  algorithm: HashAlgorithm;
  input: string;
  setInput: (value: string) => void;
  startHash: () => void;
}) {
  return (
    <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[0.72fr_1.28fr]">
      <SetupPanel
        title={hashLabels[algorithm]}
        subtitle="Hash algorithms map keys into buckets. The visual shows bucket indexes, collisions, and chains."
        buttonText="Start Visualization"
        onStart={startHash}
      />

      <div className="nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Hash input</p>
        <h2 className="mt-2 text-[2rem] font-extrabold">Enter keys</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
          Use comma-separated numbers. The visual hashes each key into a bucket and shows collisions clearly.
        </p>

        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="18, 41, 22, 44, 59, 32, 31, 73, 19, 66"
          className="mt-5 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-4 text-base font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:shadow-xl focus:shadow-sky-100/80"
        />
      </div>
    </section>
  );
}

function GreedySetup({
  algorithm,
  input,
  setInput,
  startGreedy,
}: {
  algorithm: GreedyAlgorithm;
  input: string;
  setInput: (value: string) => void;
  startGreedy: () => void;
}) {
  return (
    <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[0.72fr_1.28fr]">
      <SetupPanel
        title={greedyLabels[algorithm]}
        subtitle="Greedy algorithms make the best local choice at each step. The visual shows selected items, skipped items, and the active rule."
        buttonText="Start Visualization"
        onStart={startGreedy}
      />

      <div className="nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Greedy input</p>
        <h2 className="mt-2 text-[2rem] font-extrabold">Enter values</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
          Use comma-separated numbers. Activity Selection treats pairs as start/finish times.
        </p>

        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="1, 3, 0, 5, 8, 5, 2, 4, 6, 7, 9, 9"
          className="mt-5 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-4 text-base font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:shadow-xl focus:shadow-sky-100/80"
        />
      </div>
    </section>
  );
}

function DpSetup({
  algorithm,
  input,
  setInput,
  startDp,
}: {
  algorithm: DpAlgorithm;
  input: string;
  setInput: (value: string) => void;
  startDp: () => void;
}) {
  return (
    <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[0.72fr_1.28fr]">
      <SetupPanel
        title={dpLabels[algorithm]}
        subtitle="Dynamic programming visualizes state transitions using rows, bars, and DP tables."
        buttonText="Start Visualization"
        onStart={startDp}
      />

      <div className="nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">DP input</p>
        <h2 className="mt-2 text-[2rem] font-extrabold">Enter values</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
          Use comma-separated numbers. Each algorithm maps them into the correct DP structure.
        </p>

        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="3, 4, 5, 8, 10, 2, 6, 7"
          className="mt-5 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-4 text-base font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:shadow-xl focus:shadow-sky-100/80"
        />
      </div>
    </section>
  );
}

function StringSetup({
  algorithm,
  textInput,
  setTextInput,
  patternInput,
  setPatternInput,
  startString,
}: {
  algorithm: StringAlgorithm;
  textInput: string;
  setTextInput: (value: string) => void;
  patternInput: string;
  setPatternInput: (value: string) => void;
  startString: () => void;
}) {
  return (
    <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[0.72fr_1.28fr]">
      <SetupPanel
        title={stringLabels[algorithm]}
        subtitle="String matching uses a text row and pattern row so every comparison, shift, hash, or prefix jump is visible."
        buttonText="Start Visualization"
        onStart={startString}
      />

      <div className="nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">String input</p>
        <h2 className="mt-2 text-[2rem] font-extrabold">Enter text and pattern</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
          Use letters or numbers. The visual keeps the text on one row and the pattern on a second row.
        </p>

        <div className="mt-5 grid gap-4">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Text</span>
            <input
              value={textInput}
              onChange={(event) => setTextInput(event.target.value)}
              placeholder="ABABDABACDABABCABAB"
              className="mt-2 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-4 text-base font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:shadow-xl focus:shadow-sky-100/80"
            />
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Pattern</span>
            <input
              value={patternInput}
              onChange={(event) => setPatternInput(event.target.value)}
              placeholder="ABABCABAB"
              className="mt-2 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-4 text-base font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:shadow-xl focus:shadow-sky-100/80"
            />
          </label>
        </div>
      </div>
    </section>
  );
}

function GraphSetup({
  algorithm,
  visualMode,
  setVisualMode,
  graphInput,
  setGraphInput,
  startGraph,
}: {
  algorithm: GraphAlgorithm;
  visualMode: GraphVisualMode;
  setVisualMode: (value: GraphVisualMode) => void;
  graphInput: string;
  setGraphInput: (value: string) => void;
  startGraph: () => void;
}) {
  const modeCopy: Record<GraphVisualMode, string> = {
    graph: "Classic node-link graph with highlighted frontier, visited nodes, and traversal edges.",
    tree: "Search tree view showing the exact expansion tree created by the algorithm.",
    table: "Adjacency list view showing neighbors, frontier, output order, and current node.",
  };

  return (
    <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[0.72fr_1.28fr]">
      <SetupPanel
        title={graphLabels[algorithm]}
        subtitle={modeCopy[visualMode]}
        buttonText="Start Visualization"
        onStart={startGraph}
      />

      <div className="nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Graph input</p>
        <h2 className="mt-2 text-[2rem] font-extrabold">Customize nodes and view</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
          Enter custom node labels. Use letters like A, B, C, D or numbers like 0, 1, 2, 3.
          The graph rebuilds automatically from your node count.
        </p>

        <div className="mt-5">
          <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Node labels</label>
          <input
            value={graphInput}
            onChange={(event) => setGraphInput(event.target.value)}
            placeholder="A, B, C, D, E, F, G"
            className="mt-2 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-4 text-base font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:shadow-xl focus:shadow-sky-100/80"
          />
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            ["graph", "Classic graph", "Best for traversal, SCCs, matching, assignment, components, MST edges, flow paths, and graph structure."],
            ["tree", "Build tree", "Best for expansion order, DFS trees, parent chains, MST construction, augmenting paths, and matching growth."],
            ["table", "Adjacency list", "Best for queues, stacks, low-link values, parent tables, costs, capacities, and assignments."],
          ].map(([mode, title, description]) => (
            <button
              key={mode}
              type="button"
              onClick={() => setVisualMode(mode as GraphVisualMode)}
              className={`rounded-2xl border p-4 text-left transition ${
                visualMode === mode
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white/65 text-slate-700 hover:bg-white"
              }`}
            >
              <p className="text-sm font-extrabold">{title}</p>
              <p className={`mt-2 text-xs font-semibold leading-6 ${visualMode === mode ? "text-white/75" : "text-slate-500"}`}>
                {description}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white/55 p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Current algorithm</p>
          <p className="mt-2 text-xl font-extrabold text-slate-950">{graphLabels[algorithm]}</p>
          <p className="mt-2 text-sm font-semibold leading-7 text-slate-600">{modeCopy[visualMode]}</p>
        </div>
      </div>
    </section>
  );
}

function TreeSetup({
  algorithm,
  treeInput,
  setTreeInput,
  startTree,
}: {
  algorithm: TreeAlgorithm;
  treeInput: string;
  setTreeInput: (value: string) => void;
  startTree: () => void;
}) {
  return (
    <section className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[0.75fr_1.25fr]">
      <SetupPanel
        title={treeLabels[algorithm]}
        subtitle={
          algorithm === "bstInsert" || algorithm === "bstSearch" || algorithm === "treeSort"
            ? "Enter values as an input array. The visual builds a Binary Search Tree."
            : "Enter values in level order. The visual turns them into a binary tree."
        }
        buttonText="Start Visualization"
        onStart={startTree}
      />

      <div className="nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Custom tree</p>
        <h2 className="mt-2 text-[2rem] font-extrabold">
          {algorithm === "bstInsert" || algorithm === "bstSearch" || algorithm === "treeSort"
            ? "Enter BST input values"
            : "Enter level-order values"}
        </h2>
        <p className="mt-3 text-slate-600">
          {algorithm === "bstInsert" || algorithm === "bstSearch" || algorithm === "treeSort"
            ? "Values are inserted one by one. For Tree Sort, inorder traversal produces sorted output."
            : "Example: root first, then left child, right child, and so on. Up to 15 nodes works best."}
        </p>

        <input
          value={treeInput}
          onChange={(event) => setTreeInput(event.target.value)}
          className="mt-5 w-full rounded-2xl border border-slate-200 bg-white/55 px-5 py-4 text-lg font-bold text-slate-950 outline-none focus:border-sky-400"
        />

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setTreeInput("50, 25, 75, 12, 35, 60, 90, 5, 18, 30, 40, 55, 65, 82, 95")}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:bg-cyan-50"
          >
            Balanced tree
          </button>
          <button
            type="button"
            onClick={() => setTreeInput("10, 20, 30, 40, 50, 60, 70")}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:bg-cyan-50"
          >
            Small tree
          </button>
          <button
            type="button"
            onClick={() => setTreeInput(randomValues().slice(0, 15).join(", "))}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:bg-cyan-50"
          >
            Random tree
          </button>
        </div>
      </div>
    </section>
  );
}

function PathSetup({
  algorithm,
  walls,
  setWalls,
  startNode,
  endNode,
  wallTool,
  setWallTool,
  dragging,
  setDragging,
  editWall,
  loadMaze,
  clearWalls,
  visualMode,
  setVisualMode,
  treeInput,
  setTreeInput,
  startPath,
}: {
  algorithm: PathAlgorithm;
  walls: Set<number>;
  setWalls: (value: Set<number>) => void;
  startNode: number;
  endNode: number;
  wallTool: "draw" | "erase" | "start" | "end";
  setWallTool: (value: "draw" | "erase" | "start" | "end") => void;
  dragging: boolean;
  setDragging: (value: boolean) => void;
  editWall: (id: number) => void;
  loadMaze: () => void;
  clearWalls: () => void;
  visualMode: "map" | "tree";
  setVisualMode: (value: "map" | "tree") => void;
  treeInput: string;
  setTreeInput: (value: string) => void;
  startPath: () => void;
}) {
  const labels = treeInput
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 15);

  const previewLabels = labels.length > 0 ? labels : ["S", "A", "B", "C", "D", "E", "F"];

  return (
    <section className="grid min-h-0 flex-1 gap-4 xl:max-h-[calc(100dvh-7rem)] xl:grid-cols-[0.72fr_1.28fr]">
      <SetupPanel
        title={pathLabels[algorithm]}
        subtitle={
          visualMode === "map"
            ? "Build a maze with walls, then launch the grid path visual."
            : "Enter graph node labels, then launch a logical graph traversal visual."
        }
        buttonText="Start Visualization"
        onStart={startPath}
      />

      <div className="flex min-h-0 flex-col nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.30em] text-slate-400">Visual type</p>
            <h2 className="mt-2 text-[2rem] font-extrabold">
              {visualMode === "map" ? "Create the maze" : "Create the search tree"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
              {visualMode === "map"
                ? "Use S, E, and walls for pathfinding on a grid."
                : "Use graph node labels. The first node is the start, the last node is the target, and the algorithm visits nodes by traversal/search rules. It does not sort values."}
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setVisualMode("map")}
              className={`rounded-full px-5 py-3 text-sm font-extrabold ${
                visualMode === "map" ? "nr-pill-dark" : "bg-white/60 text-slate-700"
              }`}
            >
              Grid map
            </button>
            <button
              type="button"
              onClick={() => setVisualMode("tree")}
              className={`rounded-full px-5 py-3 text-sm font-extrabold ${
                visualMode === "tree" ? "nr-pill-dark" : "bg-white/60 text-slate-700"
              }`}
            >
              Graph traversal tree
            </button>
          </div>
        </div>

        {visualMode === "map" ? (
          <>
            <div className="mb-4 flex flex-wrap justify-end gap-2">
              {(["draw", "erase", "start", "end"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setWallTool(mode)}
                  className={`rounded-full px-5 py-3 text-sm font-extrabold capitalize ${
                    wallTool === mode ? "nr-pill-dark" : "bg-white/60 text-slate-700"
                  }`}
                >
                  {mode === "draw" ? "Draw" : mode}
                </button>
              ))}
            </div>

            <EditableGrid
              walls={walls}
              startNode={startNode}
              endNode={endNode}
              dragging={dragging}
              setDragging={setDragging}
              editWall={editWall}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={loadMaze}
                className="rounded-full border border-slate-200 bg-white/60 px-5 py-3 text-sm font-bold text-slate-700"
              >
                Maze preset
              </button>
              <button
                type="button"
                onClick={() => {
                  setWalls(new Set());
                  clearWalls();
                }}
                className="rounded-full border border-slate-200 bg-white/60 px-5 py-3 text-sm font-bold text-slate-700"
              >
                Clear walls
              </button>
            </div>
          </>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-white/55 p-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Tree labels</p>
              <input
                value={treeInput}
                onChange={(event) => setTreeInput(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg font-bold text-slate-950 outline-none focus:border-sky-400"
                placeholder="S, A, B, C, D, E, F"
              />
              <p className="mt-2 text-sm font-semibold text-slate-500">
                Comma-separated graph nodes. First node = start. Last node = target. Labels stay in graph structure order, not sorted order.
              </p>
            </div>

            <GraphSearchTreePreview labels={previewLabels} />

            <div className="grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setTreeInput("S, A, B, C, D, E, F")}
                className="nr-soft-card rounded-2xl border border-slate-200/80 bg-white/68 p-4 text-left text-sm font-extrabold text-slate-700 hover:border-sky-200 hover:bg-cyan-50"
              >
                BFS level order
              </button>
              <button
                type="button"
                onClick={() => setTreeInput("S, A, B, C, D, E, F, G, H, I, J")}
                className="nr-soft-card rounded-2xl border border-slate-200/80 bg-white/68 p-4 text-left text-sm font-extrabold text-slate-700 hover:border-sky-200 hover:bg-cyan-50"
              >
                Larger traversal
              </button>
              <button
                type="button"
                onClick={() => setTreeInput("S, A, B, C, E")}
                className="nr-soft-card rounded-2xl border border-slate-200/80 bg-white/68 p-4 text-left text-sm font-extrabold text-slate-700 hover:border-sky-200 hover:bg-cyan-50"
              >
                Target 9 path
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function GraphSearchTreePreview({ labels }: { labels: string[] }) {
  const nodes = labels.slice(0, 15);
  const [treeZoom, setTreeZoom] = useState(0.68);
  const [treePan, setTreePan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const positions = nodes.map((_, index) => {
    const level = Math.floor(Math.log2(index + 1));
    const first = 2 ** level - 1;
    const offset = index - first;
    const count = 2 ** level;

    return {
      left: `${((offset + 1) / (count + 1)) * 100}%`,
      top: `${10 + level * 17}%`,
    };
  });

  function zoomTree(delta: number) {
    setTreeZoom((current) => {
      const next = current + delta;
      return Math.min(1.5, Math.max(0.55, Number(next.toFixed(2))));
    });
  }

  return (
    <div
      className={`grid flex-1 place-items-center overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white ${
        panning ? "cursor-grabbing" : "cursor-grab"
      }`}
      onWheel={(event) => {
        event.preventDefault();
        zoomTree(event.deltaY > 0 ? -0.06 : 0.06);
      }}
      onMouseDown={(event) => {
        setPanning(true);
        setPanStart({ x: event.clientX - treePan.x, y: event.clientY - treePan.y });
      }}
      onMouseMove={(event) => {
        if (!panning) return;
        setTreePan({ x: event.clientX - panStart.x, y: event.clientY - panStart.y });
      }}
      onMouseUp={() => setPanning(false)}
      onMouseLeave={() => setPanning(false)}
    >
      <div
        className="relative h-[420px] w-full max-w-5xl transition-transform duration-150"
        style={{
          transform: `translate(${treePan.x}px, ${treePan.y}px) scale(${treeZoom})`,
          transformOrigin: "center center",
        }}
      >
        <svg className="absolute inset-0 h-full w-full">
          {nodes.slice(1).map((_, index) => {
            const child = index + 1;
            const parent = Math.floor((child - 1) / 2);

            return (
              <line
                key={`${parent}-${child}`}
                x1={positions[parent].left}
                y1={positions[parent].top}
                x2={positions[child].left}
                y2={positions[child].top}
                stroke="#cbd5e1"
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {nodes.map((label, index) => {
          const isStart = index === 0 || label.toUpperCase() === "S";
          const isEnd = label.toUpperCase() === "E";

          const style = isStart
            ? "bg-orange-500 border-orange-700 text-white"
            : isEnd
              ? "bg-rose-500 border-rose-700 text-white"
              : index < 3
                ? "bg-yellow-100 border-violet-300 text-violet-900"
                : "bg-white border-slate-300 text-slate-700";

          return (
            <div
              key={`${label}-${index}`}
              className={`absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-lg font-extrabold shadow-md ${style}`}
              style={positions[index]}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}


function SetupPanel({
  title,
  subtitle,
  buttonText,
  onStart,
}: {
  title: string;
  subtitle: string;
  buttonText: string;
  onStart: () => void;
}) {
  return (
    <div className="nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
      <p className="text-[11px] font-black uppercase tracking-[0.30em] text-slate-500">Setup</p>
      <h1 className="mt-3 text-5xl font-extrabold text-slate-950">{title}</h1>
      <p className="mt-5 text-lg leading-8 text-slate-600">{subtitle}</p>

      <button
        type="button"
        onClick={onStart}
        className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 text-base font-extrabold text-white shadow-xl shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800"
      >
        <Play size={18} />
        {buttonText}
      </button>
    </div>
  );
}

function VisualShell({
  title,
  subtitle,
  stepIndex,
  totalSteps,
  playing,
  setPlaying,
  step,
  reset,
  speed,
  setSpeed,
  metrics,
  children,
}: {
  title: string;
  subtitle: string;
  stepIndex: number;
  totalSteps: number;
  playing: boolean;
  setPlaying: (value: boolean | ((current: boolean) => boolean)) => void;
  step: () => void;
  reset: () => void;
  speed: number;
  setSpeed: (value: number) => void;
  metrics: [string, number][];
  children: React.ReactNode;
}) {
  return (
    <section className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="nr-glass rounded-[2rem] border border-slate-200/70 bg-white/72 backdrop-blur-xl p-5 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <p className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-extrabold text-slate-900">
          Step {stepIndex + 1} of {totalSteps}
        </p>
        <h1 className="mt-5 text-4xl font-extrabold">{title}</h1>
        <p className="mt-4 rounded-2xl border border-slate-200 bg-white/55 p-4 text-sm font-semibold leading-7 text-slate-700">
          {subtitle}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {metrics.map(([label, value]) => (
            <Stat key={label} label={label} value={String(value)} />
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-extrabold text-white"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
            {playing
              ? "Pause"
              : title.toLowerCase().includes("sort")
                ? "Run sort"
                : title.toLowerCase().includes("path") ||
                    title.toLowerCase().includes("dijkstra") ||
                    title.toLowerCase().includes("a*") ||
                    title.toLowerCase().includes("bellman") ||
                    title.toLowerCase().includes("floyd")
                  ? "Run pathfind"
                  : title.toLowerCase().includes("search") &&
                      !title.toLowerCase().includes("breadth") &&
                      !title.toLowerCase().includes("depth")
                    ? "Run search"
                    : title.toLowerCase().includes("tree")
                      ? "Run tree"
                      : "Run traversal"}
          </button>

          <button
            type="button"
            onClick={step}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-800"
          >
            <StepForward size={16} />
            Next step
          </button>

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-800"
          >
            <RotateCcw size={16} />
            Restart
          </button>
        </div>

        <label className="mt-5 block">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Speed</span>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            className="mt-3 w-full accent-cyan-500"
          />
        </label>
      </aside>

      <div className="min-h-0">{children}</div>
    </section>
  );
}

function SearchVisual({ step }: { step: SearchStep }) {
  const active = new Set(step.active);
  const eliminated = new Set(step.eliminated);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  function zoomSearch(delta: number) {
    setZoom((current) => {
      const next = current + delta;
      return Math.min(1.35, Math.max(0.65, Number(next.toFixed(2))));
    });
  }

  return (
    <div className="grid min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex h-full min-h-0 flex-col rounded-[2rem] border border-slate-200 bg-white/70 p-5 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <div className="mb-4">
          <p className="text-[11px] font-black uppercase tracking-[0.30em] text-slate-400">Visual run</p>
          <h2 className="text-[1.65rem] font-extrabold">Search space</h2>
        </div>

        <div
          className={`relative min-h-0 flex-1 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          onWheel={(event) => {
            event.preventDefault();
            zoomSearch(event.deltaY > 0 ? -0.05 : 0.05);
          }}
          onMouseDown={(event) => {
            setDragging(true);
            setDragStart({ x: event.clientX - pan.x, y: event.clientY - pan.y });
          }}
          onMouseMove={(event) => {
            if (!dragging) return;
            setPan({ x: event.clientX - dragStart.x, y: event.clientY - dragStart.y });
          }}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
        >
          <div
            className="flex h-full items-center justify-center transition-transform duration-150"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "center center" }}
          >
            <div className="w-full max-w-full rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${step.array.length}, minmax(48px, 1fr))` }}
              >
                {step.array.map((value, index) => {
                  const isActive = active.has(index);
                  const isEliminated = eliminated.has(index);
                  const isFound = step.found === index;

                  const color = isFound
                    ? "border-emerald-700 bg-emerald-600 text-white shadow-emerald-200"
                    : isActive
                      ? "border-orange-500 bg-orange-500 text-white shadow-orange-200"
                      : isEliminated
                        ? "border-slate-200 bg-white/60 text-slate-400"
                        : "border-slate-200 bg-white text-slate-800 shadow-slate-100";

                  return (
                    <div key={`${index}-${value}`} className="flex flex-col items-center gap-2">
                      <div className={`flex h-14 w-full min-w-12 items-center justify-center rounded-2xl border-2 text-lg font-extrabold shadow-md transition-all duration-200 ${color}`}>
                        {value}
                      </div>
                      <div className="rounded-full border border-slate-200 bg-white/55 px-2 py-1 text-[10px] font-extrabold text-slate-500">
                        i = {index}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto rounded-[2rem] border border-slate-200 bg-white/70 p-4 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <div className="rounded-2xl border border-slate-200 bg-white/55 p-4">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Current action</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-800">{step.message}</p>
        </div>

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-700">Focused values</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {step.active.length > 0 ? (
              step.active.map((index) => (
                <span key={`active-${index}`} className="rounded-xl border border-orange-300 bg-orange-500 px-3 py-2 text-sm font-extrabold text-white">
                  {step.array[index]}
                </span>
              ))
            ) : (
              <span className="text-sm font-semibold text-orange-700">No focused value</span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Result</p>
          <p className="mt-2 text-sm font-bold text-emerald-900">
            {step.found === null ? "Not found yet" : `Found at index ${step.found}`}
          </p>
        </div>
      </aside>
    </div>
  );
}

function SortingVisual({ step }: { step: SortStep }) {
  const maxValue = Math.max(...step.array);
  const active = new Set(step.active);
  const sorted = new Set(step.sorted);
  const [viewMode, setViewMode] = useState<"classic" | "bars">("classic");
  const [sortZoom, setSortZoom] = useState(1);
  const [sortPan, setSortPan] = useState({ x: 0, y: 0 });
  const [sortDragging, setSortDragging] = useState(false);
  const [sortDragStart, setSortDragStart] = useState({ x: 0, y: 0 });

  function zoomSort(delta: number) {
    setSortZoom((current) => {
      const next = current + delta;
      return Math.min(1.35, Math.max(0.65, Number(next.toFixed(2))));
    });
  }

  return (
    <div className="grid min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex h-full min-h-0 flex-col rounded-[2rem] border border-slate-200 bg-white/70 p-5 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.30em] text-slate-400">Visual run</p>
            <h2 className="text-[1.65rem] font-extrabold">Array transformation</h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-extrabold">
            <button
              type="button"
              onClick={() => setViewMode("classic")}
              className={`rounded-full px-4 py-2 ${
                viewMode === "classic" ? "nr-pill-dark" : "bg-white/60 text-slate-700"
              }`}
            >
              Classic cells
            </button>
            <button
              type="button"
              onClick={() => setViewMode("bars")}
              className={`rounded-full px-4 py-2 ${
                viewMode === "bars" ? "nr-pill-dark" : "bg-white/60 text-slate-700"
              }`}
            >
              Chart bars
            </button>
          </div>
        </div>

        <div
          className={`relative min-h-0 flex-1 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 ${sortDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onWheel={(event) => {
            event.preventDefault();
            zoomSort(event.deltaY > 0 ? -0.05 : 0.05);
          }}
          onMouseDown={(event) => {
            setSortDragging(true);
            setSortDragStart({ x: event.clientX - sortPan.x, y: event.clientY - sortPan.y });
          }}
          onMouseMove={(event) => {
            if (!sortDragging) return;
            setSortPan({ x: event.clientX - sortDragStart.x, y: event.clientY - sortDragStart.y });
          }}
          onMouseUp={() => setSortDragging(false)}
          onMouseLeave={() => setSortDragging(false)}
        >
          <div
            className="h-full w-full transition-transform duration-150"
            style={{
              transform: `translate(${sortPan.x}px, ${sortPan.y}px) scale(${sortZoom})`,
              transformOrigin: "center center",
            }}
          >
            {viewMode === "classic" ? (
              <ClassicArrayVisual step={step} />
            ) : (
              <BarArrayVisual step={step} maxValue={maxValue} active={active} sorted={sorted} />
            )}
          </div>
        </div>
      </div>

      <SortInfoPanel step={step} />
    </div>
  );
}

function SortInfoPanel({ step }: { step: SortStep }) {
  const activeValues = step.active.map((index) => step.array[index]);
  const sortedValues = step.sorted.map((index) => step.array[index]);

  return (
    <aside className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto rounded-[2rem] border border-slate-200 bg-white/70 p-4 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
      <div className="rounded-2xl border border-slate-200 bg-white/55 p-4">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Current action</p>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-800">{step.message}</p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white/68 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Focused values</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {activeValues.length > 0 ? (
            activeValues.map((value, index) => (
              <span
                key={`active-${index}-${value}`}
                className="rounded-xl border border-orange-300 bg-orange-50 px-3 py-2 text-sm font-extrabold text-orange-800"
              >
                {value}
              </span>
            ))
          ) : (
            <span className="text-sm font-semibold text-slate-400">No focused value</span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white/68 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Finalized values</p>
        <div className="mt-3 flex min-h-10 flex-wrap gap-2">
          {sortedValues.length > 0 ? (
            sortedValues.map((value, index) => (
              <span
                key={`sorted-${index}-${value}`}
                className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-extrabold text-emerald-800"
              >
                {value}
              </span>
            ))
          ) : (
            <span className="text-sm font-semibold text-slate-400">None yet</span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white/68 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Counters</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-200 bg-white/55 p-3">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Comparisons</p>
            <p className="mt-1 text-[1.65rem] font-extrabold text-slate-950">{step.comparisons}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/55 p-3">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Moves</p>
            <p className="mt-1 text-[1.65rem] font-extrabold text-slate-950">{step.moves}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ClassicArrayVisual({ step }: { step: SortStep }) {
  const active = new Set(step.active);
  const sorted = new Set(step.sorted);
  const minActive = step.active.length > 0 ? Math.min(...step.active) : null;
  const maxActive = step.active.length > 0 ? Math.max(...step.active) : null;

  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-full rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              Current array state
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              Orange shows the current focus. Green shows finalized values.
            </p>
          </div>

          <div className="flex gap-2 text-xs font-extrabold">
            <span className="rounded-full border border-orange-300 bg-orange-50 px-3 py-2 text-orange-800">
              Active
            </span>
            <span className="rounded-full border border-emerald-700 bg-emerald-600 px-3 py-2 text-white">
              Finalized
            </span>
          </div>
        </div>

        <div className="overflow-hidden pb-2">
          <div
            className="grid min-w-max gap-2"
            style={{ gridTemplateColumns: `repeat(${step.array.length}, minmax(48px, 1fr))` }}
          >
            {step.array.map((value, index) => {
              const isActive = active.has(index);
              const isSorted = sorted.has(index);
              const isBetweenActive =
                minActive !== null &&
                maxActive !== null &&
                index >= minActive &&
                index <= maxActive &&
                step.active.length >= 2;

              const color = isActive
                ? "border-orange-500 bg-orange-500 text-white shadow-orange-200"
                : isSorted
                  ? "border-emerald-700 bg-emerald-600 text-white shadow-emerald-200"
                  : "border-slate-200 bg-white text-slate-800 shadow-slate-100";

              return (
                <div key={`${index}-${value}`} className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-14 w-full min-w-12 items-center justify-center rounded-2xl border-2 text-lg font-extrabold shadow-md transition-all duration-200 ${color} ${
                      isBetweenActive ? "ring-4 ring-orange-100" : ""
                    }`}
                  >
                    {value}
                  </div>

                  <div
                    className={`h-1.5 w-full rounded-full transition ${
                      isBetweenActive ? "bg-orange-500" : "bg-slate-200"
                    }`}
                  />

                  <div className="rounded-full border border-slate-200 bg-white/55 px-2 py-1 text-[10px] font-extrabold text-slate-500">
                    i = {index}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {step.active.length >= 2 ? (
          <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-900">
            Working with indices {step.active.join(", ")}.
          </div>
        ) : step.active.length === 1 ? (
          <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-900">
            Focused on index {step.active[0]}.
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white/55 px-4 py-3 text-sm font-bold text-slate-600">
            Phase step - no single array cell is focused.
          </div>
        )}
      </div>
    </div>
  );
}

function BarArrayVisual({
  step,
  maxValue,
  active,
  sorted,
}: {
  step: SortStep;
  maxValue: number;
  active: Set<number>;
  sorted: Set<number>;
}) {
  return (
    <div className="flex h-full items-end gap-3">
      {step.array.map((value, index) => {
        const height = Math.max(12, (value / maxValue) * 90);
        const isActive = active.has(index);
        const isSorted = sorted.has(index);

        const color = isActive
          ? "border-cyan-600 bg-cyan-500"
          : isSorted
            ? "border-emerald-800 bg-emerald-600"
            : "border-slate-300 bg-slate-300";

        return (
          <div key={`${index}-${value}`} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
            <div className={`w-full max-w-16 rounded-t-2xl border-2 transition-all duration-200 ${color}`} style={{ height: `${height}%` }} />
            <div className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-sm font-extrabold text-slate-700">
              {value}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TreeVisual({ values, step }: { values: number[]; step: TreeStep }) {
  const visited = new Set(step.visited);
  const pending = new Set(step.pending);
  const stack = new Set(step.stack);
  const active = step.active;
  const [treeZoom, setTreeZoom] = useState(0.68);
  const [treePan, setTreePan] = useState({ x: 0, y: 0 });
  const [treeDragging, setTreeDragging] = useState(false);
  const [treeDragStart, setTreeDragStart] = useState({ x: 0, y: 0 });

  function zoomTree(delta: number) {
    setTreeZoom((current) => {
      const next = current + delta;
      return Math.min(1.45, Math.max(0.55, Number(next.toFixed(2))));
    });
  }

  const displayValues = step.treeValues ?? values;

  const positions =
    step.treePositions ??
    displayValues.map((_, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const levelStart = 2 ** level - 1;
      const positionInLevel = index - levelStart;
      const nodesInLevel = 2 ** level;

      return {
        left: `${((positionInLevel + 1) / (nodesInLevel + 1)) * 100}%`,
        top: `${12 + level * 22}%`,
      };
    });

  const edges =
    step.treeEdges ??
    displayValues.slice(1).map((_, index) => {
      const child = index + 1;
      const parent = Math.floor((child - 1) / 2);

      return [parent, child] as const;
    });

  return (
    <div className="grid min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex h-full min-h-0 flex-col rounded-[2rem] border border-slate-200 bg-white/70 p-5 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.30em] text-slate-400">Visual run</p>
            <h2 className="text-[1.65rem] font-extrabold">
            {step.treeValues ? "BST / tree transformation" : "Binary tree traversal"}
          </h2>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 text-xs font-extrabold">
            <Legend label="Pending" className="bg-sky-200 border border-sky-400" />
            <Legend label="Stack" className="bg-violet-100 border border-violet-300" />
            <Legend label="Active" className="bg-orange-500" />
            <Legend label="Visited" className="bg-yellow-100 border border-violet-300" />
          </div>
        </div>

        <div
          className={`relative min-h-0 flex-1 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/55 p-4 ${treeDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onWheel={(event) => {
            event.preventDefault();
            zoomTree(event.deltaY > 0 ? -0.06 : 0.06);
          }}
          onMouseDown={(event) => {
            setTreeDragging(true);
            setTreeDragStart({ x: event.clientX - treePan.x, y: event.clientY - treePan.y });
          }}
          onMouseMove={(event) => {
            if (!treeDragging) return;
            setTreePan({ x: event.clientX - treeDragStart.x, y: event.clientY - treeDragStart.y });
          }}
          onMouseUp={() => setTreeDragging(false)}
          onMouseLeave={() => setTreeDragging(false)}
        >
          <div
            className="absolute inset-0 transition-transform duration-150"
            style={{
              transform: `translate(${treePan.x}px, ${treePan.y}px) scale(${treeZoom})`,
              transformOrigin: "center top",
            }}
          >
          <svg className="absolute inset-0 h-full w-full">
            {edges.map(([parent, child]) => (
              <line
                key={`${parent}-${child}`}
                x1={positions[parent].left}
                y1={positions[parent].top}
                x2={positions[child].left}
                y2={positions[child].top}
                stroke="#cbd5e1"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ))}
          </svg>

          {displayValues.map((value, index) => {
            const isVisited = visited.has(index);
            const isPending = pending.has(index);
            const isInStack = stack.has(index);
            const isActive = active === index;

            const style = isActive
              ? "border-orange-700 bg-orange-500 text-white shadow-lg shadow-orange-200"
              : isVisited
                ? "border-violet-300 bg-yellow-100 text-violet-900 shadow-md shadow-yellow-100"
                : isInStack
                  ? "border-violet-300 bg-violet-100 text-violet-900 shadow-md shadow-violet-100"
                  : isPending
                    ? "border-sky-400 bg-sky-200 text-sky-900 shadow-md shadow-sky-100"
                    : "border-slate-300 bg-white text-slate-700 shadow-sm";

            return (
              <div
                key={`${index}-${value}`}
                className={`absolute z-10 flex h-14 min-w-14 max-w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 px-3 text-center text-sm font-extrabold leading-tight transition-all duration-300 ${style}`}
                style={positions[index]}
              >
                {value}
              </div>
            );
          })}
          </div>
        </div>
      </div>

      <aside className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto rounded-[2rem] border border-slate-200 bg-white/70 p-4 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <div className="rounded-2xl border border-slate-200 bg-white/55 p-4">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Rule</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-800">{step.rule}</p>
        </div>

        <TraceBox title="Output order" values={step.output} />
        <TraceBox title="Queue / pending input" values={step.pending.map((indexOrValue) => displayValues[indexOrValue] ?? indexOrValue)} />
        <TraceBox title="DFS/BST path stack" values={step.stack.map((index) => displayValues[index])} />
      </aside>
    </div>
  );
}

function TraceBox({ title, values }: { title: string; values: number[] }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/68 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">{title}</p>
      <div className="mt-3 flex min-h-10 flex-wrap gap-2">
        {values.length > 0 ? (
          values.map((value, index) => (
            <span
              key={`${title}-${index}-${value}`}
              className="rounded-xl border border-slate-200 bg-white/55 px-3 py-2 text-sm font-extrabold text-slate-700"
            >
              {value}
            </span>
          ))
        ) : (
          <span className="text-sm font-semibold text-slate-400">Empty</span>
        )}
      </div>
    </div>
  );
}

function EditableGrid({
  walls,
  startNode,
  endNode,
  dragging,
  setDragging,
  editWall,
}: {
  walls: Set<number>;
  startNode: number;
  endNode: number;
  dragging: boolean;
  setDragging: (value: boolean) => void;
  editWall: (id: number) => void;
}) {
  const [gridZoom, setGridZoom] = useState(1);
  const [gridPan, setGridPan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  function zoomGrid(delta: number) {
    setGridZoom((current) => {
      const next = current + delta;
      return Math.min(1.5, Math.max(0.55, Number(next.toFixed(2))));
    });
  }

  return (
    <div
      className={`flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/55 p-3 ${
        panning ? "cursor-grabbing" : "cursor-default"
      }`}
      onWheel={(event) => {
        event.preventDefault();
        zoomGrid(event.deltaY > 0 ? -0.06 : 0.06);
      }}
      onMouseDown={(event) => {
        if (event.shiftKey) {
          setPanning(true);
          setPanStart({ x: event.clientX - gridPan.x, y: event.clientY - gridPan.y });
        }
      }}
      onMouseMove={(event) => {
        if (!panning) return;
        setGridPan({ x: event.clientX - panStart.x, y: event.clientY - panStart.y });
      }}
      onMouseUp={() => {
        setPanning(false);
        setDragging(false);
      }}
      onMouseLeave={() => {
        setPanning(false);
        setDragging(false);
      }}
    >
      <div
        className="grid gap-1.5 transition-transform duration-150"
        style={{
          gridTemplateColumns: `repeat(${gridWidth}, minmax(34px, 52px))`,
          gridAutoRows: "minmax(34px, 52px)",
          transform: `translate(${gridPan.x}px, ${gridPan.y}px) scale(${gridZoom})`,
          transformOrigin: "center center",
        }}
      >
        {Array.from({ length: gridWidth * gridHeight }, (_, id) => {
          const isStart = id === startNode;
          const isEnd = id === endNode;
          const isWall = walls.has(id);

          return (
            <button
              key={id}
              type="button"
              onMouseDown={(event) => {
                if (event.shiftKey) return;
                setDragging(true);
                editWall(id);
              }}
              onMouseEnter={() => {
                if (dragging && !panning) editWall(id);
              }}
              onMouseUp={() => setDragging(false)}
              className={`aspect-square rounded-lg border text-sm font-extrabold transition ${
                isStart
                  ? "border-orange-700 bg-orange-500 text-white"
                  : isEnd
                    ? "border-rose-600 bg-rose-500 text-white"
                    : isWall
                      ? "border-slate-950 bg-slate-900"
                      : "border-slate-200 bg-white hover:bg-cyan-50"
              }`}
            >
              {isStart ? "S" : isEnd ? "E" : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}


function PathVisual({
  step,
  walls,
  startNode,
  endNode,
  visualMode,
  treeInput,
}: {
  step: PathStep;
  walls: Set<number>;
  startNode: number;
  endNode: number;
  visualMode: "map" | "tree";
  treeInput: string;
}) {
  const visited = new Set(step.visited);
  const frontier = new Set(step.frontier);
  const path = new Set(step.path);
  const [pathZoom, setPathZoom] = useState(0.68);
  const [pathPan, setPathPan] = useState({ x: 0, y: 0 });
  const [pathDragging, setPathDragging] = useState(false);
  const [pathDragStart, setPathDragStart] = useState({ x: 0, y: 0 });

  function zoomPath(delta: number) {
    setPathZoom((current) => {
      const next = current + delta;
      return Math.min(1.5, Math.max(0.55, Number(next.toFixed(2))));
    });
  }

  return (
    <div className="grid min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex h-full min-h-0 flex-col rounded-[2rem] border border-slate-200 bg-white/70 p-5 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.30em] text-slate-400">Visual run</p>
            <h2 className="text-[1.65rem] font-extrabold">
              {visualMode === "map" ? "Path search map" : "Graph traversal tree"}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-extrabold">
            <Legend label="Visited" className="bg-yellow-100 border border-violet-300" />
            <Legend label="Frontier" className="bg-sky-500" />
            <Legend label="Path" className="bg-emerald-600" />
          </div>
        </div>

        <div
          className={`flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/55 p-3 ${pathDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onWheel={(event) => {
            event.preventDefault();
            zoomPath(event.deltaY > 0 ? -0.06 : 0.06);
          }}
          onMouseDown={(event) => {
            setPathDragging(true);
            setPathDragStart({ x: event.clientX - pathPan.x, y: event.clientY - pathPan.y });
          }}
          onMouseMove={(event) => {
            if (!pathDragging) return;
            setPathPan({ x: event.clientX - pathDragStart.x, y: event.clientY - pathDragStart.y });
          }}
          onMouseUp={() => setPathDragging(false)}
          onMouseLeave={() => setPathDragging(false)}
        >
          {visualMode === "tree" ? (
            <GraphSearchTreeRunVisual
              step={step}
              treeInput={treeInput}
              zoom={pathZoom}
              pan={pathPan}
            />
          ) : (
            <div
              className="grid gap-1.5 transition-transform duration-150"
              style={{
                gridTemplateColumns: `repeat(${gridWidth}, minmax(34px, 52px))`,
                gridAutoRows: "minmax(34px, 52px)",
                transform: `translate(${pathPan.x}px, ${pathPan.y}px) scale(${pathZoom})`,
                transformOrigin: "center center",
              }}
            >
              {Array.from({ length: gridWidth * gridHeight }, (_, id) => {
                const isStart = id === startNode;
                const isEnd = id === endNode;
                const isWall = walls.has(id);
                const isCurrent = step.current === id;

                let color = "border-slate-200 bg-white text-slate-400";
                if (visited.has(id)) color = "border-violet-300 bg-yellow-100 text-violet-900";
                if (frontier.has(id)) color = "border-sky-600 bg-sky-500 text-white";
                if (path.has(id)) color = "border-emerald-800 bg-emerald-600 text-white";
                if (isWall) color = "border-slate-950 bg-slate-900 text-white";
                if (isStart) color = "border-orange-700 bg-orange-500 text-white";
                if (isEnd) color = "border-rose-700 bg-rose-500 text-white";

                return (
                  <div
                    key={id}
                    className={`flex aspect-square items-center justify-center rounded-lg border text-sm font-extrabold transition ${color} ${
                      isCurrent && !isStart && !isEnd ? "ring-4 ring-amber-300" : ""
                    }`}
                  >
                    {isStart ? "S" : isEnd ? "E" : ""}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <PathInfoPanel step={step} visualMode={visualMode} treeInput={treeInput} />
    </div>
  );
}

function PathInfoPanel({
  step,
  visualMode,
  treeInput,
}: {
  step: PathStep;
  visualMode: "map" | "tree";
  treeInput: string;
}) {
  const labels = visualMode === "tree" ? parseGraphNodeLabels(treeInput) : [];
  const currentLabel =
    visualMode === "tree" && step.current !== null
      ? labels[step.current] ?? String(step.current)
      : step.current === null
        ? "None"
        : String(step.current);

  const frontierLabels =
    visualMode === "tree"
      ? step.frontier.map((index) => labels[index] ?? String(index))
      : step.frontier.map(String);

  const pathLabelsForPanel =
    visualMode === "tree"
      ? step.path.map((index) => labels[index] ?? String(index))
      : step.path.map(String);

  const targetLabel = visualMode === "tree" ? labels[labels.length - 1] ?? "Target" : "E";

  return (
    <aside className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto rounded-[2rem] border border-slate-200 bg-white/70 p-4 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
      <div className="rounded-2xl border border-slate-200 bg-white/55 p-4">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Current action</p>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-800">{step.message}</p>
      </div>

      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-700">Current node</p>
        <p className="mt-2 text-[2rem] font-extrabold text-orange-900">{currentLabel}</p>
        <p className="mt-2 text-sm font-bold text-orange-800">
          Target: {targetLabel}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white/68 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">What this view means</p>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
          {visualMode === "tree"
            ? "This is a graph traversal/search tree, not a sorting visual. BFS visits level by level, DFS goes deep first, and Dijkstra/A* choose the next node by priority. Node values do not get sorted."
            : "This is a grid path search. It shows explored cells, frontier cells, walls, and the best reconstructed path."}
        </p>
      </div>

      <TraceBox title="Frontier" values={frontierLabels.map((value, index) => Number.isNaN(Number(value)) ? index : Number(value))} />

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Current path</p>
        <div className="mt-3 flex min-h-10 flex-wrap gap-2">
          {pathLabelsForPanel.length > 0 ? (
            pathLabelsForPanel.map((value, index) => (
              <span
                key={`path-panel-${index}-${value}`}
                className="rounded-xl border border-emerald-300 bg-emerald-600 px-3 py-2 text-sm font-extrabold text-white"
              >
                {value}
              </span>
            ))
          ) : (
            <span className="text-sm font-semibold text-emerald-700">No path yet</span>
          )}
        </div>
      </div>

      {visualMode === "tree" ? (
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-700">Visit order</p>
          <div className="mt-3 flex min-h-10 flex-wrap gap-2">
            {step.visited.length > 0 ? (
              step.visited.map((index) => (
                <span
                  key={`visit-order-${index}`}
                  className="rounded-xl border border-violet-300 bg-yellow-100 px-3 py-2 text-sm font-extrabold text-violet-900"
                >
                  {labels[index] ?? index}
                </span>
              ))
            ) : (
              <span className="text-sm font-semibold text-violet-700">No visited nodes yet</span>
            )}
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200/80 bg-white/68 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Counters</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-200 bg-white/55 p-3">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Visited</p>
            <p className="mt-1 text-[1.65rem] font-extrabold text-slate-950">{step.visited.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/55 p-3">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Checks</p>
            <p className="mt-1 text-[1.65rem] font-extrabold text-slate-950">{step.checks}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}


function GraphSearchTreeRunVisual({
  step,
  treeInput,
  zoom,
  pan,
}: {
  step: PathStep;
  treeInput: string;
  zoom: number;
  pan: { x: number; y: number };
}) {
  const labels = parseGraphNodeLabels(treeInput);
  const nodes = labels;
  const targetIndex = nodes.length - 1;
  const visitedSet = new Set(step.visited);
  const frontierSet = new Set(step.frontier);
  const pathSet = new Set(step.path);

  const positions = nodes.map((_, index) => {
    const level = Math.floor(Math.log2(index + 1));
    const first = 2 ** level - 1;
    const offset = index - first;
    const count = 2 ** level;

    return {
      left: `${((offset + 1) / (count + 1)) * 100}%`,
      top: `${10 + level * 17}%`,
    };
  });

  return (
    <div
      className="relative h-full w-full transition-transform duration-150"
      style={{
        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        transformOrigin: "center center",
      }}
    >
      <svg className="absolute inset-0 h-full w-full">
        {nodes.slice(1).map((_, index) => {
          const child = index + 1;
          const parent = Math.floor((child - 1) / 2);
          const isPathEdge = pathSet.has(parent) && pathSet.has(child);

          return (
            <line
              key={`${parent}-${child}`}
              x1={positions[parent].left}
              y1={positions[parent].top}
              x2={positions[child].left}
              y2={positions[child].top}
              stroke={isPathEdge ? "#059669" : "#cbd5e1"}
              strokeWidth={isPathEdge ? "4" : "2.5"}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {nodes.map((label, index) => {
        const isStart = index === 0;
        const isTarget = index === targetIndex;
        const isVisited = visitedSet.has(index);
        const isFrontier = frontierSet.has(index);
        const isCurrent = step.current === index;
        const isPath = pathSet.has(index);

        let style = "bg-white border-slate-300 text-slate-700";
        if (isVisited) style = "bg-yellow-100 border-violet-300 text-violet-900";
        if (isFrontier) style = "bg-sky-500 border-sky-600 text-white";
        if (isPath) style = "bg-emerald-600 border-emerald-800 text-white";
        if (isStart) style = "bg-orange-500 border-orange-700 text-white";
        if (isTarget) style = "bg-rose-500 border-rose-700 text-white";
        if (isCurrent && !isStart && !isTarget) style = "bg-orange-500 border-orange-700 text-white";

        return (
          <div
            key={`${label}-${index}`}
            className={`absolute z-10 flex h-14 min-w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 px-3 text-base font-extrabold shadow-md transition ${style}`}
            style={positions[index]}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}


function AlgorithmCard({
  title,
  tag,
  disabled,
  onClick,
}: {
  title: string;
  tag: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const lower = `${title} ${tag}`.toLowerCase();

  const actionLabel = disabled
    ? "Coming soon"
    : lower.includes("sort") ||
        lower.includes("heap") ||
        lower.includes("radix") ||
        lower.includes("bucket") ||
        lower.includes("merge") ||
        lower.includes("quick") ||
        lower.includes("counting")
      ? "Run sort"
      : lower.includes("linear search") ||
          lower.includes("binary search") ||
          lower.includes("jump search") ||
          lower.includes("interpolation") ||
          lower.includes("exponential search") ||
          lower.includes("fibonacci search") ||
          lower.includes("quickselect")
        ? "Run search"
        : lower.includes("tree") ||
            lower.includes("preorder") ||
            lower.includes("inorder") ||
            lower.includes("postorder") ||
            lower.includes("bst") ||
            lower.includes("tree sort")
          ? "Run tree"
          : lower.includes("bfs") ||
              lower.includes("dfs") ||
              lower.includes("breadth") ||
              lower.includes("depth") ||
              lower.includes("traversal")
            ? "Run traversal"
            : lower.includes("dijkstra") ||
                lower.includes("a*") ||
                lower.includes("astar") ||
                lower.includes("bellman") ||
                lower.includes("floyd") ||
                lower.includes("johnson") ||
                lower.includes("path") ||
                lower.includes("greedy best")
              ? "Run pathfind"
              : lower.includes("mst") ||
                  lower.includes("prim") ||
                  lower.includes("kruskal") ||
                  lower.includes("boruvka") ||
                  lower.includes("component") ||
                  lower.includes("scc") ||
                  lower.includes("topological")
                ? "Run graph"
                : "Open visual";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`nr-algorithm-card nr-card-hover group ${
        disabled
          ? "cursor-not-allowed border-slate-200 bg-white/55 opacity-60"
          : "border-slate-200/80 bg-white/70 shadow-sm shadow-slate-200/60 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/70"
      }`}
    >
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{tag}</p>
        <h3 className="mt-2 text-base font-extrabold tracking-[-0.015em] text-slate-950 leading-snug">{title}</h3>
      </div>
      <p
        className={`nr-card-action mt-2 inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${
          disabled
            ? "bg-white/60 text-slate-500"
            : "bg-white/80 text-slate-900 ring-1 ring-slate-200 group-hover:bg-[#0b1220] group-hover:text-white"
        }`}
      >
        {actionLabel}
      </p>
    </button>
  );
}



function GraphVisual({
  algorithm,
  graphInput,
  step,
  visualMode,
}: {
  algorithm: GraphAlgorithm;
  graphInput: string;
  step: GraphStep;
  visualMode: GraphVisualMode;
}) {
  const model = getGraphModel(algorithm, graphInput);
  const positions = makeGraphPositions(model.labels.length);
  const activeEdgeKeys = new Set(step.activeEdges.map((edge) => `${edge.from}-${edge.to}`));
  const treeEdgeKeys = new Set(step.treeEdges.map((edge) => `${edge.from}-${edge.to}`));
  const visited = new Set(step.visited);
  const frontier = new Set(step.frontier);
  const output = new Set(step.output);

  if (visualMode === "table") {
    return (
      <div className="grid h-full min-h-[520px] gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/35 p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Adjacency list</p>
          <div className="mt-4 grid gap-2">
            {model.labels.map((label, index) => {
              const next = model.edges
                .filter((edge) => edge.from === index || (!model.directed && edge.to === index))
                .map((edge) => (edge.from === index ? edge.to : edge.from));

              return (
                <div
                  key={`${label}-${index}`}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-bold ${
                    step.current === index
                      ? "border-orange-300 bg-orange-50 text-orange-900"
                      : visited.has(index)
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-white/70 text-slate-700"
                  }`}
                >
                  <span>{label}</span>
                  <span className="text-slate-500">
                    {next.length > 0 ? next.map((node) => model.labels[node]).join(", ") : "none"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200/70 bg-white/35 p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Run state</p>
          <InfoList label="Frontier" values={step.frontier.map((node) => model.labels[node])} />
          <InfoList label="Visited" values={step.visited.map((node) => model.labels[node])} />
          <InfoList label="Output" values={step.output.map((node) => model.labels[node])} />
          {algorithm === "connectedComponents" ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white/70 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Component</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-950">{step.component}</p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  const edgesToDraw = visualMode === "tree" ? step.treeEdges : model.edges;

  return (
    <PanZoomSurface>
      <svg className="absolute inset-0 h-full w-full">
        {edgesToDraw.map((edge) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          const key = `${edge.from}-${edge.to}`;
          const reverseKey = `${edge.to}-${edge.from}`;
          const isActive = activeEdgeKeys.has(key) || activeEdgeKeys.has(reverseKey);
          const isTree = visualMode === "tree" || treeEdgeKeys.has(key) || treeEdgeKeys.has(reverseKey);

          return (
            <g key={key}>
              <line
                x1={from.left}
                y1={from.top}
                x2={to.left}
                y2={to.top}
                stroke={isActive ? "#f97316" : isTree ? "#059669" : "#cbd5e1"}
                strokeWidth={isActive ? "5" : isTree ? "4" : "3"}
                strokeLinecap="round"
                opacity={isActive ? "0.95" : "0.75"}
              />
              {edge.weight ? (
                <text
                  x={`${(parseFloat(from.left) + parseFloat(to.left)) / 2}%`}
                  y={`${(parseFloat(from.top) + parseFloat(to.top)) / 2}%`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-slate-700 text-[11px] font-black"
                >
                  {edge.weight}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      {model.labels.map((label, index) => {
        const isCurrent = step.current === index;
        const isVisited = visited.has(index);
        const isFrontier = frontier.has(index);
        const isOutput = output.has(index);

        return (
          <div
            key={`${label}-${index}`}
            className={`absolute z-10 flex h-14 min-w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 px-3 text-base font-extrabold shadow-md ${
              isCurrent
                ? "border-orange-700 bg-orange-500 text-white"
                : isVisited
                  ? "border-emerald-700 bg-emerald-500 text-white"
                  : isFrontier
                    ? "border-sky-500 bg-sky-100 text-sky-800"
                    : isOutput
                      ? "border-violet-500 bg-violet-100 text-violet-800"
                      : "border-slate-200 bg-white text-slate-700"
            }`}
            style={positions[index]}
          >
            {label}
          </div>
        );
      })}

      <div className="absolute bottom-4 left-4 right-4 grid gap-2 rounded-2xl border border-slate-200/70 bg-white/55 p-4 text-sm font-bold text-slate-700 backdrop-blur md:grid-cols-3">
        <InfoList label="Frontier" values={step.frontier.map((node) => model.labels[node])} compact />
        <InfoList label="Visited" values={step.visited.map((node) => model.labels[node])} compact />
        <InfoList label="Output" values={step.output.map((node) => model.labels[node])} compact />
      </div>
    </PanZoomSurface>
  );
}

function makeGraphPositions(count: number) {
  const centerX = 50;
  const centerY = 48;
  const radiusX = 34;
  const radiusY = 30;

  if (count <= 1) return [{ left: "50%", top: "50%" }];

  return Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (index / count) * Math.PI * 2;

    return {
      left: `${centerX + Math.cos(angle) * radiusX}%`,
      top: `${centerY + Math.sin(angle) * radiusY}%`,
    };
  });
}

function PanZoomSurface({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState({ x: 0, y: 0, zoom: 0.9 });
  const dragRef = useRef<{ startX: number; startY: number; x: number; y: number } | null>(null);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      x: view.x,
      y: view.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;

    setView((current) => ({
      ...current,
      x: dragRef.current!.x + event.clientX - dragRef.current!.startX,
      y: dragRef.current!.y + event.clientY - dragRef.current!.startY,
    }));
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function onWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault();

    const direction = event.deltaY > 0 ? -1 : 1;
    const nextZoom = Math.min(1.65, Math.max(0.55, view.zoom + direction * 0.08));

    setView((current) => ({
      ...current,
      zoom: nextZoom,
    }));
  }

  return (
    <div className="relative h-full min-h-[520px] overflow-hidden rounded-[2rem] border border-slate-200/70 bg-transparent">
      <div
        role="presentation"
        className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="relative h-full min-h-[520px] w-full"
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
            transformOrigin: "center",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function InfoList({ label, values, compact = false }: { label: string; values: string[]; compact?: boolean }) {
  return (
    <div className={compact ? "" : "mt-4 rounded-2xl border border-slate-200 bg-white/70 p-4"}>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-extrabold text-slate-900">
        {values.length > 0 ? values.join(" → ") : "Empty"}
      </p>
    </div>
  );
}












function CryptoVisual({ step }: { step: CryptoStep }) {
  return (
    <div className="grid h-full min-h-[520px] gap-4 overflow-auto rounded-[2rem] border border-slate-200/70 bg-transparent p-5 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Blocks / state</p>
        <div className="mt-4 grid gap-3">
          {step.blocks.map((block, index) => (
            <div
              key={`${block}-${index}`}
              className={`rounded-2xl border px-4 py-3 text-sm font-black ${
                step.active === index
                  ? "border-orange-300 bg-orange-100 text-orange-900"
                  : "border-slate-200 bg-white/70 text-slate-800"
              }`}
            >
              {block}
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-slate-500">Round keys</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {step.roundKeys.map((key, index) => (
            <span key={`${key}-${index}`} className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-black text-sky-800">
              {key}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Crypto table</p>
        <div className="mt-4 grid gap-2">
          {step.table.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white/65 p-3">
              {row.slice(0, 3).map((cell, cellIndex) => (
                <span key={`${cell}-${cellIndex}`} className="rounded-xl bg-white/70 px-3 py-2 text-sm font-black text-slate-800">
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-slate-500">Output</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {step.output.length ? step.output.map((item, index) => (
            <span key={`${item}-${index}`} className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800">
              {item}
            </span>
          )) : (
            <span className="rounded-full border border-slate-200 bg-white/65 px-4 py-2 text-sm font-black text-slate-500">waiting</span>
          )}
        </div>
      </div>
    </div>
  );
}

function BacktrackingVisual({ step }: { step: BacktrackingStep }) {
  return (
    <div className="grid h-full min-h-[520px] gap-4 overflow-auto rounded-[2rem] border border-slate-200/70 bg-transparent p-5 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Board / recursion state</p>

        <div className="mt-4 grid gap-2">
          {step.board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-wrap gap-2">
              {row.map((cell, colIndex) => {
                const active = step.active?.[0] === rowIndex && step.active?.[1] === colIndex;

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`flex min-h-11 min-w-11 items-center justify-center rounded-2xl border px-3 text-sm font-black ${
                      active
                        ? "border-orange-300 bg-orange-100 text-orange-900"
                        : cell === "Q"
                          ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                          : cell === "."
                            ? "border-slate-200 bg-white/45 text-slate-400"
                            : "border-slate-200 bg-white/70 text-slate-800"
                    }`}
                  >
                    {cell}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Path</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {step.path.length ? step.path.map((item, index) => (
            <span key={`${item}-${index}`} className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-black text-sky-800">
              {item}
            </span>
          )) : (
            <span className="rounded-full border border-slate-200 bg-white/65 px-4 py-2 text-sm font-black text-slate-500">empty</span>
          )}
        </div>

        <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-slate-500">Choices</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {step.choices.length ? step.choices.map((item, index) => (
            <span key={`${item}-${index}`} className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800">
              {item}
            </span>
          )) : (
            <span className="rounded-full border border-slate-200 bg-white/65 px-4 py-2 text-sm font-black text-slate-500">none</span>
          )}
        </div>
      </div>
    </div>
  );
}

function MlVisual({ step }: { step: MlStep }) {
  const allPoints = [...step.points, ...step.centers];
  const minX = Math.min(...allPoints.map((point) => point.x));
  const maxX = Math.max(...allPoints.map((point) => point.x));
  const minY = Math.min(...allPoints.map((point) => point.y));
  const maxY = Math.max(...allPoints.map((point) => point.y));
  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);

  const toSvg = (point: { x: number; y: number }) => ({
    x: 45 + ((point.x - minX) / spanX) * 610,
    y: 355 - ((point.y - minY) / spanY) * 300,
  });

  return (
    <div className="grid h-full min-h-[520px] gap-4 overflow-auto rounded-[2rem] border border-slate-200/70 bg-transparent p-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <svg viewBox="0 0 700 400" className="h-[420px] w-full">
          <rect x="20" y="20" width="660" height="360" rx="28" fill="rgba(255,255,255,0.55)" stroke="rgba(148,163,184,0.45)" />

          {step.points.map((point, index) => {
            const pos = toSvg(point);
            const selected = step.selected.includes(index);
            const active = step.active === index;

            return (
              <g key={index}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={active ? 11 : selected ? 10 : 8}
                  className={point.label === "B" ? "fill-sky-500" : point.label === "?" ? "fill-orange-400" : "fill-emerald-500"}
                  opacity={selected || active ? 1 : 0.72}
                />
                <text x={pos.x + 10} y={pos.y - 10} className="fill-slate-700 text-[13px] font-black">
                  {point.label}{index}
                </text>
              </g>
            );
          })}

          {step.centers.map((center, index) => {
            const pos = toSvg(center);
            return (
              <g key={`center-${index}`}>
                <rect x={pos.x - 9} y={pos.y - 9} width="18" height="18" rx="4" className="fill-fuchsia-500" />
                <text x={pos.x + 12} y={pos.y + 4} className="fill-slate-800 text-[13px] font-black">
                  {center.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Model state</p>
        <div className="mt-4 grid gap-2">
          {step.table.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white/65 p-3">
              {row.slice(0, 3).map((cell, cellIndex) => (
                <span key={`${cell}-${cellIndex}`} className="rounded-xl bg-white/70 px-3 py-2 text-sm font-black text-slate-800">
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GeometryVisual({ step }: { step: GeometryStep }) {
  const minX = Math.min(...step.points.map((point) => point.x));
  const maxX = Math.max(...step.points.map((point) => point.x));
  const minY = Math.min(...step.points.map((point) => point.y));
  const maxY = Math.max(...step.points.map((point) => point.y));
  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);

  const toSvg = (point: { x: number; y: number }) => ({
    x: 45 + ((point.x - minX) / spanX) * 610,
    y: 355 - ((point.y - minY) / spanY) * 300,
  });

  return (
    <div className="grid h-full min-h-[520px] gap-4 overflow-auto rounded-[2rem] border border-slate-200/70 bg-transparent p-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <svg viewBox="0 0 700 400" className="h-[420px] w-full">
          <rect x="20" y="20" width="660" height="360" rx="28" fill="rgba(255,255,255,0.55)" stroke="rgba(148,163,184,0.45)" />

          {step.lines.map(([a, b], index) => {
            const from = toSvg(step.points[a]);
            const to = toSvg(step.points[b]);

            return (
              <line
                key={`${a}-${b}-${index}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="currentColor"
                className="text-sky-500"
                strokeWidth="4"
                strokeLinecap="round"
              />
            );
          })}

          {step.points.map((point, index) => {
            const pos = toSvg(point);
            const isHull = step.hull.includes(index);
            const isCompared = step.compared.includes(index);
            const isActive = step.active === index;

            return (
              <g key={index}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? 11 : isHull ? 9 : isCompared ? 8 : 7}
                  className={
                    isActive
                      ? "fill-orange-400"
                      : isHull
                        ? "fill-emerald-400"
                        : isCompared
                          ? "fill-sky-400"
                          : "fill-slate-500"
                  }
                />
                <text x={pos.x + 10} y={pos.y - 10} className="fill-slate-700 text-[13px] font-black">
                  {index}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Geometry state</p>

        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white/65 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Hull / active set</p>
            <p className="mt-2 text-lg font-black text-slate-900">{step.hull.join(" → ") || "empty"}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/65 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Compared</p>
            <p className="mt-2 text-lg font-black text-slate-900">{step.compared.join(", ") || "none"}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/65 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Message</p>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{step.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MathVisual({ step }: { step: MathStep }) {
  return (
    <div className="grid h-full min-h-[520px] gap-4 overflow-auto rounded-[2rem] border border-slate-200/70 bg-transparent p-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Values</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {step.values.map((value, index) => (
            <div
              key={`${value}-${index}`}
              className={`flex h-12 min-w-12 items-center justify-center rounded-2xl border px-3 text-sm font-black ${
                step.active === value || step.active === index
                  ? "border-orange-300 bg-orange-100 text-orange-900"
                  : value < 0
                    ? "border-slate-200 bg-slate-100 text-slate-400"
                    : "border-slate-200 bg-white/70 text-slate-800"
              }`}
            >
              {Math.abs(value)}
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-slate-500">Output</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {step.output.length > 0 ? step.output.map((token, index) => (
            <span key={`${token}-${index}`} className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800">
              {token}
            </span>
          )) : (
            <span className="rounded-full border border-slate-200 bg-white/65 px-4 py-2 text-sm font-black text-slate-500">
              waiting
            </span>
          )}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Step table</p>
        <div className="mt-4 grid gap-2">
          {step.table.slice(-18).map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white/65 p-3">
              {row.slice(0, 3).map((cell, cellIndex) => (
                <span key={`${cell}-${cellIndex}`} className="rounded-xl bg-white/70 px-3 py-2 text-sm font-black text-slate-800">
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompressionVisual({ step }: { step: CompressionStep }) {
  return (
    <div className="grid h-full min-h-[520px] gap-4 overflow-auto rounded-[2rem] border border-slate-200/70 bg-transparent p-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Input text</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {step.text.split("").map((char, index) => (
            <div
              key={`${char}-${index}`}
              className={`flex h-12 min-w-12 items-center justify-center rounded-2xl border px-3 text-sm font-black ${
                step.activeIndex === index
                  ? "border-orange-300 bg-orange-100 text-orange-900"
                  : "border-slate-200 bg-white/70 text-slate-800"
              }`}
            >
              {char}
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-slate-500">Encoded output</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {step.output.length > 0 ? step.output.map((token, index) => (
            <span key={`${token}-${index}`} className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800">
              {token}
            </span>
          )) : (
            <span className="rounded-full border border-slate-200 bg-white/65 px-4 py-2 text-sm font-black text-slate-500">
              waiting
            </span>
          )}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Dictionary / table</p>
        <div className="mt-4 grid gap-2">
          {step.dictionary.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white/65 p-3">
              {row.slice(0, 3).map((cell, cellIndex) => (
                <span key={`${cell}-${cellIndex}`} className="rounded-xl bg-white/70 px-3 py-2 text-sm font-black text-slate-800">
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SystemVisual({ step }: { step: SystemStep }) {
  const selected = new Set(step.selected);

  return (
    <div className="grid h-full min-h-[520px] gap-4 overflow-auto rounded-[2rem] border border-slate-200/70 bg-transparent p-5 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Input / request stream</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {step.values.map((value, index) => (
            <div
              key={`${value}-${index}`}
              className={`flex h-12 min-w-12 items-center justify-center rounded-2xl border px-3 text-sm font-black ${
                step.active === value || step.active === index
                  ? "border-orange-300 bg-orange-100 text-orange-900"
                  : selected.has(value) || selected.has(index)
                    ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                    : "border-slate-200 bg-white/70 text-slate-800"
              }`}
            >
              {value}
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-slate-500">Queue / cache state</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {step.queue.length > 0 ? step.queue.map((item, index) => (
            <span key={`${item}-${index}`} className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-black text-slate-800">
              {item}
            </span>
          )) : (
            <span className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-black text-slate-500">
              empty
            </span>
          )}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">State table</p>
        <div className="mt-4 grid gap-2">
          {step.table.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white/65 p-3">
              {row.map((cell, cellIndex) => (
                <span key={`${cell}-${cellIndex}`} className="rounded-xl bg-white/70 px-3 py-2 text-sm font-black text-slate-800">
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HashVisual({ step }: { step: HashStep }) {
  const selected = new Set(step.selectedBuckets);

  return (
    <div className="grid h-full min-h-[520px] gap-4 overflow-auto rounded-[2rem] border border-slate-200/70 bg-transparent p-5 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Keys</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {step.keys.map((key, index) => (
            <div
              key={`${key}-${index}`}
              className={`flex h-12 min-w-12 items-center justify-center rounded-2xl border px-3 text-sm font-black ${
                step.activeKey === key
                  ? "border-orange-300 bg-orange-100 text-orange-900"
                  : "border-slate-200 bg-white/70 text-slate-800"
              }`}
            >
              {key}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Hash table</p>
        <div className="mt-4 grid gap-2">
          {step.table.map((bucket, index) => (
            <div
              key={index}
              className={`grid grid-cols-[64px_1fr] items-center gap-3 rounded-2xl border p-3 ${
                selected.has(index)
                  ? "border-orange-300 bg-orange-50"
                  : "border-slate-200 bg-white/65"
              }`}
            >
              <div className="rounded-xl bg-slate-950 px-3 py-2 text-center text-xs font-black text-white">
                {index}
              </div>

              <div className="flex min-h-10 flex-wrap items-center gap-2">
                {bucket.length > 0 ? bucket.map((value, itemIndex) => (
                  <span
                    key={`${value}-${itemIndex}`}
                    className={`rounded-full border px-3 py-1.5 text-sm font-black ${
                      Number(value) === step.activeKey
                        ? "border-orange-300 bg-orange-100 text-orange-900"
                        : "border-emerald-200 bg-emerald-50 text-emerald-800"
                    }`}
                  >
                    {value}
                  </span>
                )) : (
                  <span className="text-sm font-bold text-slate-400">empty</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GreedyVisual({ step }: { step: GreedyStep }) {
  const active = new Set(step.active);
  const selected = new Set(step.selected);

  return (
    <div className="grid h-full min-h-[520px] gap-4 overflow-auto rounded-[2rem] border border-slate-200/70 bg-transparent p-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Greedy row</p>
        <div className="mt-4 flex min-w-max items-end gap-2">
          {step.values.map((value, index) => (
            <div key={`${value}-${index}`} className="flex flex-col items-center gap-2">
              <div
                className={`flex w-14 items-end justify-center rounded-t-2xl text-xs font-black text-white ${
                  active.has(index)
                    ? "bg-orange-500"
                    : selected.has(index)
                      ? "bg-emerald-500"
                      : "bg-slate-900"
                }`}
                style={{ height: `${Math.max(34, Math.min(180, Math.abs(value) * 10))}px` }}
              >
                {value}
              </div>
              <span className="text-xs font-bold text-slate-500">{index}</span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-slate-500">Secondary row</p>
        <div className="mt-4 flex min-w-max gap-2">
          {step.secondary.slice(0, 16).map((value, index) => (
            <div
              key={`${value}-${index}`}
              className={`flex h-12 min-w-12 items-center justify-center rounded-xl border px-3 text-sm font-black ${
                active.has(index)
                  ? "border-orange-300 bg-orange-100 text-orange-900"
                  : "border-slate-200 bg-white/70 text-slate-800"
              }`}
            >
              {value}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Selected / tree state</p>
        <div className="mt-4 grid gap-2">
          {step.treeValues.length > 0 ? (
            step.treeValues.slice(-18).map((value, index) => (
              <div
                key={`${value}-${index}`}
                className={`rounded-xl border px-4 py-3 text-sm font-black ${
                  active.has(index)
                    ? "border-orange-300 bg-orange-100 text-orange-900"
                    : selected.has(index)
                      ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                      : "border-slate-200 bg-white/70 text-slate-800"
                }`}
              >
                {value}
              </div>
            ))
          ) : (
            <div className="flex flex-wrap gap-2">
              {step.selected.length > 0 ? step.selected.map((value, index) => (
                <span key={`${value}-${index}`} className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800">
                  {value}
                </span>
              )) : (
                <span className="rounded-full border border-slate-200 bg-white/65 px-4 py-2 text-sm font-black text-slate-600">
                  Nothing selected yet
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DpVisual({ step }: { step: DpStep }) {
  const active = new Set(step.active);

  return (
    <div className="grid h-full min-h-[520px] gap-4 overflow-auto rounded-[2rem] border border-slate-200/70 bg-transparent p-5 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Values</p>
        <div className="mt-4 flex min-w-max items-end gap-2">
          {step.values.map((value, index) => (
            <div key={`${value}-${index}`} className="flex flex-col items-center gap-2">
              <div
                className={`flex w-12 items-end justify-center rounded-t-2xl text-xs font-black text-white ${
                  active.has(index) ? "bg-orange-500" : "bg-slate-900"
                }`}
                style={{ height: `${Math.max(34, Math.min(180, Math.abs(value) * 10))}px` }}
              >
                {value}
              </div>
              <span className="text-xs font-bold text-slate-500">{index}</span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-slate-500">Current output row</p>
        <div className="mt-4 flex min-w-max gap-2">
          {step.output.slice(0, 16).map((value, index) => (
            <div
              key={`${value}-${index}`}
              className="flex h-12 min-w-12 items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-3 text-sm font-black text-slate-800"
            >
              {value}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/45 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">DP table</p>
        <div className="mt-4 max-h-[420px] overflow-auto">
          <div className="grid gap-1">
            {step.table.slice(-12).map((row, rowIndex) => (
              <div key={rowIndex} className="flex min-w-max gap-1">
                {row.slice(0, 18).map((value, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-xs font-black ${
                      active.has(colIndex)
                        ? "border-orange-300 bg-orange-100 text-orange-900"
                        : "border-slate-200 bg-white/65 text-slate-700"
                    }`}
                  >
                    {value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StringVisual({ step }: { step: StringStep }) {
  const chars = step.text.split("");
  const patternChars = step.pattern.split("");
  const matchedText = new Set(step.matchedText);
  const matchedPattern = new Set(step.matchedPattern);

  return (
    <div className="flex h-full min-h-[520px] flex-col justify-center gap-8 overflow-auto rounded-[2rem] border border-slate-200/70 bg-transparent p-6">
      <div>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-slate-500">Text row</p>
        <div className="flex min-w-max gap-2">
          {chars.map((char, index) => {
            const active = step.textIndex === index;
            const matched = matchedText.has(index);

            return (
              <div
                key={`${char}-${index}`}
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-lg font-black ${
                  active
                    ? "border-orange-700 bg-orange-500 text-white"
                    : matched
                      ? "border-emerald-700 bg-emerald-500 text-white"
                      : "border-slate-200 bg-white/65 text-slate-800"
                }`}
              >
                {char}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ paddingLeft: `${Math.max(0, step.windowStart) * 64}px` }}>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-slate-500">Pattern row</p>
        <div className="flex min-w-max gap-2">
          {patternChars.map((char, index) => {
            const active = step.patternIndex === index;
            const matched = matchedPattern.has(index);

            return (
              <div
                key={`${char}-${index}`}
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-lg font-black ${
                  active
                    ? "border-sky-700 bg-sky-500 text-white"
                    : matched
                      ? "border-emerald-700 bg-emerald-500 text-white"
                      : "border-slate-200 bg-white/65 text-slate-800"
                }`}
              >
                {char}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/68 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-[1.65rem] font-extrabold text-slate-950">{value}</p>
    </div>
  );
}

function Legend({ label, className }: { label: string; className: string }) {
  return (
    <div className="flex items-center gap-2 nr-chip rounded-full border border-slate-200/80 bg-white/68 px-3 py-2 text-slate-600">
      <span className={`h-3 w-3 rounded-full ${className}`} />
      <span>{label}</span>
    </div>
  );
}
