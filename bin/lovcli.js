#!/usr/bin/env node
import { Command } from "commander";
import { gtree } from "../commands/gtree.js";
import { gcode } from "../commands/gcode.js";

const program = new Command();

program
  .name("lovcli")
  .description("lovcli — personal CLI toolbox")
  .version("0.2.0", "-v, --version", "show version");

// gtree command
program
  .command("gtree [dir]")
  .description("print directory tree (respects .gitignore, hides .git and node_modules)")
  .option("-d, --depth <n>", "limit recursion depth", (v) => parseInt(v, 10))
  .option("-j, --json", "output JSON format instead of tree view")
  .action((dir, options) => {
    gtree(dir || ".", options).catch((err) => {
      console.error(err.message || err);
      process.exit(1);
    });
  });

// gcode command
program
  .command("gcode [dir]")
  .description("generate a code dump (respects .gitignore and .dumpignore, excludes binaries, node_modules, .git, and the output file itself)")
  .action((dir) => {
    gcode(dir || ".").catch((err) => {
      console.error(err.message || err);
      process.exit(1);
    });
  });

// unknown command → show help (like git)
program.showHelpAfterError();
program.showSuggestionAfterError(false);

program.parse(process.argv);

// if no args provided, show help
if (process.argv.length <= 2) {
  program.outputHelp();
}
