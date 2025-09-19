export function run() {
  console.log(`
lovcli — personal cli toolbox

usage:
  lovcli <command> [options]

options:
  -v, --version  show version
  -h, --help     show help for command

commands:
  gtree [dir]    print directory tree (respects .gitignore, hides .git and node_modules)
  gcode [dir]    generate a code dump (respects .gitignore and .dumpignore, excludes binaries, node_modules, .git, and the output file itself)
  `);
}
