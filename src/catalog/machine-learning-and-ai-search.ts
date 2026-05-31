import type { CatalogSection } from "./types";

export const machineLearningAndAiSearchCatalog: CatalogSection = {
    title: "Machine Learning and AI Search",
  description: "Visualize model training, decision rules, search, and reinforcement learning ideas.",
    entries: [
      { title: "K-Means", tag: "O(nki)", status: "playable", kind: "ml", id: "kMeans" },
      { title: "KNN", tag: "O(nd)", status: "playable", kind: "ml", id: "knn" },
      { title: "Naive Bayes", tag: "O(nd)", status: "playable", kind: "ml", id: "naiveBayes" },
      { title: "Decision Tree", tag: "O(nm log n)", status: "playable", kind: "ml", id: "decisionTree" },
      { title: "Random Forest", tag: "Ensemble", status: "playable", kind: "ml", id: "randomForest" },
      { title: "SVM", tag: "Optimization", status: "playable", kind: "ml", id: "svm" },
      { title: "Gradient Boosting", tag: "Ensemble", status: "playable", kind: "ml", id: "gradientBoosting" },
      { title: "Expectation Maximization", tag: "Iterative", status: "playable", kind: "ml", id: "expectationMaximization" },
      { title: "Minimax", tag: "O(b^d)", status: "playable", kind: "ml", id: "minimax" },
      { title: "Alpha-Beta Pruning", tag: "O(b^(d/2))", status: "playable", kind: "ml", id: "alphaBetaPruning" },
      { title: "Monte Carlo Tree Search", tag: "MCTS", status: "playable", kind: "ml", id: "mcts" },
      { title: "Q-Learning", tag: "RL", status: "playable", kind: "ml", id: "qLearning" },
    ],
  };
