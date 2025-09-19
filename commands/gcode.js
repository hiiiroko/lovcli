import fs from "fs/promises";
import fssync from "fs";
import path from "path";
import { toPosix, loadGitIgnores, loadDumpIgnores, makeIgnore } from "../utils/ignore.js";

/**
 * Check if a file is binary by reading the first 512 bytes.
 */
async function isBinaryFile(filePath) {
  try {
    const fd = await fs.open(filePath, "r");
    const buffer = Buffer.alloc(512);
    const { bytesRead } = await fd.read(buffer, 0, 512, 0);
    await fd.close();
    for (let i = 0; i < bytesRead; i++) {
      if (buffer[i] === 0) return true;
    }
    return false;
  } catch {
    return true;
  }
}

/**
 * Recursively collect code files.
 */
async function collectCodeFiles(dirPath, parentRules, root, outputFilePath, results = []) {
  let entries;
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    console.warn(`Skipping unreadable directory: ${dirPath}`);
    return;
  }

  const localGit = await loadGitIgnores(dirPath);
  const localDump = await loadDumpIgnores(dirPath);
  const ig = makeIgnore(parentRules, [...localGit, ...localDump]);

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = toPosix(path.relative(root, fullPath));

    if (["node_modules", ".git"].includes(entry.name)) continue;
    if (fullPath === outputFilePath) continue;
    if (entry.isFile() && entry.name === "CODEDUMP.txt") continue;

    if (ig.ignores(relPath) || (entry.isDirectory() && ig.ignores(relPath + "/"))) continue;

    if (entry.isDirectory()) {
      await collectCodeFiles(fullPath, [...(parentRules || []), ...localGit, ...localDump], root, outputFilePath, results);
    } else {
      if (await isBinaryFile(fullPath)) continue;
      results.push({ path: relPath, abs: fullPath });
    }
  }
  return results;
}

/**
 * Box-style header for file sections.
 */
function makeBoxHeader(filePath) {
  const content = ` ${filePath} `;
  const border = "═".repeat(content.length);
  return `╔${border}╗\n║${content}║\n╚${border}╝\n`;
}

/**
 * Main gcode entry.
 */
export async function gcode(dir = ".") {
  const targetDir = path.resolve(dir);
  const outputFilePath = path.join(targetDir, "CODEDUMP.txt");

  console.log(`Cleaning old code dumps in ${targetDir}...`);
  try {
    await fs.unlink(outputFilePath);
  } catch {}

  console.log(`Generating CODEDUMP.txt in ${targetDir}...`);

  const codeFiles = await collectCodeFiles(targetDir, [], targetDir, outputFilePath);

  codeFiles.sort((a, b) => a.path.localeCompare(b.path));

  const stream = fssync.createWriteStream(outputFilePath, { encoding: "utf8" });
  for (const file of codeFiles) {
    const header = makeBoxHeader(file.path);
    stream.write(header);
    const content = await fs.readFile(file.abs, "utf8");
    stream.write(content + "\n\n");
  }
  stream.end();

  console.log(`Done! Generated ${codeFiles.length} files.`);
}
