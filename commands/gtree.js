import fs from "fs/promises";
import path from "path";
import { toPosix, loadGitIgnores, makeIgnore } from "../utils/ignore.js";

/**
 * Recursively build directory tree.
 */
async function buildTree(dirPath, parentRules, options, depth = 0) {
  if (typeof options.depth === "number" && options.depth >= 0 && depth >= options.depth) {
    return { name: path.basename(dirPath), path: dirPath, type: "dir", children: [] };
  }

  let entries;
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    console.warn(`Skipping unreadable directory: ${dirPath}`);
    return { name: path.basename(dirPath), path: dirPath, type: "dir", children: [] };
  }

  const localRules = await loadGitIgnores(dirPath);
  const ig = makeIgnore(parentRules, localRules);

  entries = entries
    .filter((e) => e.name !== ".git" && e.name !== "node_modules")
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

  const children = [];
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const rel = toPosix(path.relative(options.root, fullPath));

    if (ig.ignores(rel) || ig.ignores(rel + "/")) continue;

    if (entry.isDirectory()) {
      const subtree = await buildTree(fullPath, [...(parentRules || []), ...localRules], options, depth + 1);
      children.push(subtree);
    } else {
      children.push({ name: entry.name, path: fullPath, type: "file" });
    }
  }

  return { name: path.basename(dirPath), path: dirPath, type: "dir", children };
}

/**
 * Print ASCII tree.
 */
function printAsciiTree(node) {
  console.log(node.name);

  function walk(children, prefix) {
    children.forEach((child, index) => {
      const isLast = index === children.length - 1;
      const pointer = isLast ? "└── " : "├── ";
      console.log(prefix + pointer + child.name);

      if (child.type === "dir") {
        walk(child.children, prefix + (isLast ? "    " : "│   "));
      }
    });
  }

  walk(node.children, "");
}

/**
 * Main gtree entry.
 */
export async function gtree(dir, options = {}) {
  const cwd = path.resolve(dir);
  options.root = cwd;

  const tree = await buildTree(cwd, [], options);

  if (options.json) {
    console.log(JSON.stringify(tree, null, 2));
  } else {
    printAsciiTree(tree);
  }
}
