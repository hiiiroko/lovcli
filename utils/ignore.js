import fs from "fs/promises";
import path from "path";
import ignore from "ignore";

/**
 * Convert path to POSIX format for ignore matching.
 */
export function toPosix(p) {
  return p.split(path.sep).join("/");
}

/**
 * Load ignore rules from a given file.
 */
async function loadIgnoreFile(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return raw
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Load .gitignore rules in a directory.
 */
export async function loadGitIgnores(dir) {
  return await loadIgnoreFile(path.join(dir, ".gitignore"));
}

/**
 * Load .dumpignore rules in a directory.
 */
export async function loadDumpIgnores(dir) {
  return await loadIgnoreFile(path.join(dir, ".dumpignore"));
}

/**
 * Create a new ignore instance from parent + local rules.
 */
export function makeIgnore(parentRules = [], localRules = []) {
  const ig = ignore();
  if (Array.isArray(parentRules)) ig.add(parentRules);
  if (Array.isArray(localRules)) ig.add(localRules);
  return ig;
}
