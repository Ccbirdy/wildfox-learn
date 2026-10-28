# WildFox Project Notes for AI / Future Context

## Project purpose
This repo is a lightweight local Go study viewer built around SGF chess records. The goal is to browse files under `resource/sgf`, select a `.sgf` file, and display it in the embedded EidoGo board.

## Core entry points
- `index.php` — main app page
- `src/main.php` — small API layer for listing files
- `src/fileOption.php` — directory scanning and SGF file listing
- `js/wildfox/maingui.js` — UI logic for folder and file browser
- `js/eidogo/` — local board viewer used to render SGF

## Important behavior
- The project was originally designed with a fake login screen, but the current simplified version skips login entirely.
- The main interface is a directory explorer that loads from `resource/sgf`.
- The data is not a database-backed app; it reads files on disk.
- It is meant for local usage, not a production web app.

## How the app loads SGF files
1. The browser loads `index.php`.
2. `showMainExplorer()` runs on startup.
3. `loadRootExplorer()` calls `loadSgfDirectory('../resource/sgf')`.
4. `src/main.php?action=getFileList` returns the directory entries.
5. Clicking a folder calls `loadSgfDirectory(path)`.
6. Clicking a `.sgf` file calls `loadEidogo('player-container', normalizedPath)`.
7. EidoGo renders the SGF board and moves.

## Key implementation details
- The AJAX endpoint is in `src/main.php`.
- `fileOption::getFileList($pathName)` scans a folder path and returns file names.
- Chinese directory names are converted with `iconv` because the project uses localized paths like `《围棋中盘技巧》坂田荣男`.
- Paths from the frontend are normalized before passing to EidoGo.

## Typical run command
```bash
php -S localhost:8080
```
Then open:
```text
http://localhost:8080/index.php
```

## Data folders
Common directories under `resource/sgf` include:
- `fight/`
- `liveAndDie/`
- `curcia/`
- `guanzi/`
- `IgoManual/`

## Known caveat
Some old menu entries in the original app still reference paths that do not exist. The simplified browser avoids those and directly reads the real folders under `resource/sgf`.

## Encoding fix that was required
A large subset of the SGF files in this project are encoded in GB2312/GBK, and some directory names also use Chinese characters. The original implementation attempted to read them as UTF-8 without first normalizing the text, which caused unreadable text in the EidoGo comments panel.

The fix was:
- handle SGF head declarations like `CA[gb2312]` before conversion
- normalize file names and display names from localized folder names like `《围棋中盘技巧》坂田荣男`
- convert content to UTF-8 before passing it to EidoGo
- avoid relying on `mbstring`, which is not available in the current PHP environment

This was applied in `src/fileOption.php` and verified through the actual local browser flow.

## Why this matters for future work
If future AI agents need to modify behavior, they should look at:
- `index.php` for the main UI shell
- `js/wildfox/maingui.js` for the directory/file selection flow
- `src/main.php` and `src/fileOption.php` for backend listing logic
- `resource/sgf` for actual data files

This should reduce the need to re-read the whole repo whenever changing display logic or data loading behavior.

## Current usage summary
- Start the local PHP server with:
  ```bash
  php -S localhost:8080
  ```
- Open:
  ```text
  http://localhost:8080/index.php
  ```
- The app loads from `resource/sgf` and does not require a login.
- Select a folder, then select a `.sgf` file to open it directly.

## Important note for debugging
If a SGF file is still unreadable, check both the file encoding and the path. Most of the Chinese-labeled game collections under `resource/sgf` follow the GB2312/GBK pattern, so any future fix should preserve the conversion logic before sending the content to the parser.
