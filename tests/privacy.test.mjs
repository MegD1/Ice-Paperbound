import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const allowed = new Set([
  ".gitignore", "README.md", "README.zh-CN.md", "index.html", "package.json", "package-lock.json",
  "tsconfig.json", "vite.config.ts", "playwright.config.ts",
  "src/main.tsx", "src/BookshelfScene.tsx", "src/BookBinding.ts", "src/content.ts",
  "src/styles.css", "public/textures/book-spines.webp", "docs/preview.png",
  "tests/privacy.test.mjs", "tests/studio.spec.ts",
]);
const ignored = new Set([".git", "node_modules", "dist", "test-results", "playwright-report"]);
const files = [];
function walk(dir, prefix = "") {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!prefix && ignored.has(item.name)) continue;
    const name = prefix + item.name;
    if (item.isDirectory()) walk(path.join(dir, item.name), `${name}/`);
    else files.push(name);
  }
}
walk(root);

test("only the explicitly approved standalone files are present", () => {
  assert.deepEqual(files.filter(file => !allowed.has(file)), []);
  assert.ok(files.includes("public/textures/book-spines.webp"));
  assert.ok(files.includes("README.md"));
  assert.ok(files.includes("README.zh-CN.md"));
  assert.ok(!files.some(file => /\.(pdf|docx|pptx|pem|key)$/i.test(file)));
});

test("application source contains no personal routes, credentials, or local paths", () => {
  const source = files.filter(file => file.startsWith("src/") || file === "index.html")
    .map(file => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
  for (const pattern of [
    /mailto:/i,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    /\/Users\//,
    /archive-data|bookshelf-content|research\/|portfolio\//,
    /(?:ghp_|gho_|github_pat_)[A-Za-z0-9_]{20,}/,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  ]) assert.doesNotMatch(source, pattern);
});

test("no database, authentication, or server routes are required", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.deepEqual(Object.keys(pkg.dependencies).sort(), ["@gsap/react", "gsap", "react", "react-dom", "three"]);
  assert.equal(pkg.private, true);
});
