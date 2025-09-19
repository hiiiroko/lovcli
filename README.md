<div align="center">
<img src="https://s2.loli.net/2025/09/19/rtxj214hcYO5InG.png" alt="Lovcli Banner" width="128">

**A personal CLI toolbox to manage and explore your projects with ease.**

<a href="mailto:hiiiroko@proton.me">
	<img src="https://custom-icon-badges.herokuapp.com/badge/mail-contact_me-AE75DA?logoColor=AE75DA&style=for-the-badge&logo=mail&labelColor=363B40" alt="Contact Me"/></a>

<a href="https://codeload.github.com/hiiiroko/lovcli/zip/refs/heads/main">
	<img src="https://custom-icon-badges.herokuapp.com/badge/releases-download-33A1E0?logoColor=33A1E0&style=for-the-badge&logo=download&labelColor=363B40" alt="Download Releases"/></a>

</div>

## Features

* `gtree` — print project directory tree (respects `.gitignore`, hides `.git` and `node_modules`).
* `gcode` — generate a **CODEDUMP.txt** file containing all source code (respects `.gitignore` and `.dumpignore`, excludes binaries, `node_modules`, `.git`, and the dump file itself).
* Clean, minimal CLI design with industry-standard help messages.
* Works out-of-the-box with **pnpm**, **npm**, or **yarn**.

## Preview

```bash
$ lovcli gtree kazago --depth 1
kazago
├── .gitignore
├── assets
├── background.js
├── content.js
├── icons
├── LICENSE
├── manifest.json
├── popup.css
├── popup.html
├── popup.js
├── README.md
└── utils.js
```

```bash
$ lovcli gcode .
Cleaning old code dumps in /path/to/project...
Generating CODEDUMP.txt in /path/to/project...
Done! Generated 8 files.
```

The `CODEDUMP.txt` output:

```
╔══════════════════════════╗
║ src/index.js             ║
╚══════════════════════════╝
import fs from "fs/promises";
import path from "path";

console.log("Hello lovcli!");
```

## Install

1. Clone this repo and install dependencies:

   ```bash
   git clone https://github.com/hiiiroko/lovcli.git
   cd lovcli
   pnpm install
   ```

2. Link the CLI globally:

   ```bash
   pnpm link --global
   ```

3. Verify installation:

   ```bash
   lovcli --help
   ```

## Project Structure

```
lovcli/
├── bin/
│   └── lovcli.js        # CLI entry point
├── commands/
│   ├── gcode.js         # gcode command implementation
│   └── gtree.js         # gtree command implementation
├── utils/
│   └── ignore.js        # shared ignore logic
└── package.json
```

## Acknowledgements

lovcli is inspired by or built upon:

* [commander.js](https://github.com/tj/commander.js) – robust command-line interface library
* [ignore](https://github.com/kaelzhang/node-ignore) – `.gitignore` and ignore rule parser
* [tree](https://en.wikipedia.org/wiki/Tree_%28command%29) – classic directory listing tool

## License

MIT License – see [LICENSE](./LICENSE) for details.

## Contributing

Issues, feature requests, and PRs are welcome!

Feel free to fork the repo and open a pull request.