# CBCS Unit 5: PowerShell Study Wiki

An offline study wiki for CBCS Unit 5 (PowerShell). It uses the same theme as the Unit 4 shell wiki but runs on its own: everything it needs is inside this folder.

## Getting started

Open `unit5/index.html` in a browser. Then open PowerShell 7 (`pwsh`) **inside the `unit5` folder** so the `datasets/` paths in the examples work:

```powershell
cd unit5
Import-Csv datasets/inventory.csv | Where-Object { $_.Qty -eq 0 }
```

## Study path

1. **Fundamentals** (`basics/`): what a shell is, installing PowerShell, first commands, files and folders, and objects.
2. **Topics** (`notes/`): 19 short pages, one idea each:
   introduction, console & ISE, cmdlets, help, pipelines, writing scripts, comments, variables, user input, operators, if/else/switch, loops, arrays, hashtables, functions, scoping, error handling, profiles and script files.
3. **Labs** (`labs/`): 10 step-by-step labs, from exploring the console to a menu-driven admin tool.
4. **Revise** (`reference/`): a one-page cheat sheet and the practice files.

## Layout

```
unit5/
├── index.html      # home page and study path
├── basics/         # F1–F5 fundamentals
├── notes/          # t01–t19 topics
├── labs/           # lab01–lab10
├── reference/      # cheat sheet, practice files
├── datasets/       # students.csv, inventory.csv, servers.txt, app.log, config.json, numbers.txt
└── assets/         # style.css, app.js (nav, theme, PowerShell highlighting)
```

## Requirements

- PowerShell 7 on Windows, Linux or macOS. Almost all examples also work in Windows PowerShell 5.1.
- The ISE, execution policy and some service examples apply to Windows only; the pages mark them.

## Adding a page

1. Copy `notes/t05-pipelines.html` (topic page) or `labs/lab04-grade-calculator.html` (lab page).
2. Set `data-root="../"` and a unique `data-page` id on `<body>`.
3. Add the page to the `NAV` list in `assets/app.js` and add a card to `index.html`.
