import fs from "node:fs";
import { execFileSync } from "node:child_process";

const DRY_RUN = process.env.DRY_RUN !== "0";
const catalogDir = "src/catalog";
const files = fs.readdirSync(catalogDir).filter((file) => file.endsWith(".ts"));

const labels = [
  ["algorithm-validation", "0E8A16", "Validate algorithm correctness and trace behavior"],
  ["visual-polish", "1D76DB", "Improve visual clarity and UI behavior"],
  ["testing", "5319E7", "Improve or add tests"],
  ["documentation", "0075CA", "Documentation updates"],
  ["bug", "D73A4A", "Something is broken"],
  ["performance", "FBCA04", "Performance or bundle-size improvement"],
  ["accessibility", "C5DEF5", "Accessibility improvement"],
  ["good-first-issue", "7057FF", "Good for new contributors"],
  ["needs-maintainer-review", "B60205", "Requires maintainer approval"],
];

function run(args) {
  console.log(`gh ${args.join(" ")}`);
  if (!DRY_RUN) execFileSync("gh", args, { stdio: "inherit" });
}

for (const [name, color, description] of labels) {
  run(["label", "create", name, "--color", color, "--description", description, "--force"]);
}

const issues = [];

for (const file of files) {
  const fullPath = `${catalogDir}/${file}`;
  const content = fs.readFileSync(fullPath, "utf8");
  const sectionTitle = content.match(/title:\s*"([^"]+)"/)?.[1] ?? file.replace(".ts", "");
  const regex = /\{\s*title:\s*"([^"]+)",\s*tag:\s*"([^"]+)",\s*status:\s*"playable",\s*kind:\s*"([^"]+)",\s*id:\s*"([^"]+)"/g;

  for (const match of content.matchAll(regex)) {
    const [, title, tag, kind, id] = match;
    issues.push({
      title: `[Algorithm Validation]: ${title}`,
      labels: ["algorithm-validation", "needs-maintainer-review"],
      body: `## Algorithm\n\n- Title: ${title}\n- ID: ${id}\n- Kind: ${kind}\n- Category: ${sectionTitle}\n- Tag: ${tag}\n\n## Goal\n\nValidate algorithm logic, visual trace state, editable input behavior, explanation text, and final output.\n\n## Checklist\n\n- [ ] Confirm the algorithm logic is correct\n- [ ] Confirm the visualization matches the algorithm\n- [ ] Confirm step messages are accurate\n- [ ] Confirm edge cases\n- [ ] Add or update tests if logic changes\n- [ ] Run npm run check\n- [ ] Maintainer approval before merge`,
    });
  }
}

issues.push(
  { title: "[Testing]: Add deeper edge-case tests for every algorithm family", labels: ["testing", "needs-maintainer-review"], body: "Add focused tests for empty input, small input, duplicate values, invalid values, and final-state correctness across all algorithm families." },
  { title: "[Visual Polish]: Review all mobile layouts", labels: ["visual-polish"], body: "Check all visual families on small screens and fix overflow, clipping, spacing, or unreadable text." },
  { title: "[Performance]: Investigate bundle splitting", labels: ["performance"], body: "Vite reports a large chunk warning. Review code splitting opportunities without breaking the visual architecture." },
  { title: "[Accessibility]: Keyboard and screen-reader pass", labels: ["accessibility"], body: "Review controls, contrast, focus states, labels, and keyboard navigation." },
  { title: "[Documentation]: Add screenshots and GIFs", labels: ["documentation"], body: "Add visual examples for major algorithm families to README and docs." }
);

console.log(`Prepared ${issues.length} issues.`);
for (const issue of issues) {
  run(["issue", "create", "--title", issue.title, "--body", issue.body, "--label", issue.labels.join(",")]);
}
