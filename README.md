# CBCS Unit 4: Shell Scripting Study Wiki

> **Also here:** [Unit 5: PowerShell](unit5/README.md), a separate wiki in the same style. Open `unit5/index.html`.

A self-contained, offline study wiki for CBCS Unit 4 (Shell Scripting). It has twelve lab guides, eight command tutorials, a one-page cheat sheet and a set of practice datasets. Every example on every page runs against the files in `datasets/`, so you can paste a command into your terminal and get the output shown on the page.

## Getting started

There is nothing to install or build. Clone the repo and open `index.html` in a browser:

```bash
git clone <repo-url> 25cbcs-notes
cd 25cbcs-notes
open index.html        # macOS
xdg-open index.html    # Linux
```

The pages work straight from `file://`, with no server, CDN or network access.

Then keep a terminal open in the same folder and try an example:

```bash
# top 3 client IPs in the sample web log
awk '{print $1}' datasets/access.log | sort | uniq -c | sort -rn | head -3
```

```
     18 192.168.1.10
     14 192.168.1.15
     13 10.0.0.5
```

## What's inside

### Labs

Each lab has three runnable use cases with expected output, followed by viva and exam questions.

| # | Lab | Topics |
|---|-----|--------|
| 01 | [Multi-function scripting](labs/lab01-multi-function.html) | Functions, arguments, return codes, local scope, libraries, `getopts` |
| 02 | [Interactive menus & colors](labs/lab02-menus-colors.html) | `select`, `case` loops, ANSI escape codes, `tput`, `read` prompts |
| 03 | [Remote script execution](labs/lab03-remote-execution.html) | SSH keys, heredocs over SSH, multi-host runs, `scp`/`rsync` |
| 04 | [JSON with jq](labs/lab04-json-jq.html) | Filtering, transforming and reporting on JSON |
| 05 | [Cloudflare API](labs/lab05-cloudflare-api.html) | API tokens, zones, DNS records with `curl` and `jq` |
| 06 | [Access log analysis](labs/lab06-access-logs.html) | Top IPs, status codes, bandwidth, attack detection |
| 07 | [Automated email alerts](labs/lab07-email-alerts.html) | `mail`/`msmtp`, threshold checks, HTML reports, cron |
| 08 | [Password generation](labs/lab08-password-generation.html) | `/dev/urandom`, `openssl`, policy rules, passphrases, hashing |
| 09 | [Pipes & redirection](labs/lab09-pipes-redirection.html) | stdin/stdout/stderr, file descriptors, `tee`, process substitution |
| 10 | [WordPress on LAMP](labs/lab10-wordpress-lamp.html) | Scripted Apache, MySQL, PHP and WordPress install |
| 11 | [Backup & retention](labs/lab11-backup-retention.html) | `tar`, `mysqldump`, rotation, `find -mtime` cleanup, verification |
| 12 | [Service health monitoring](labs/lab12-service-health.html) | `systemctl`, HTTP and port checks, auto-restart, status output |

### Command tutorials

Stand-alone pages for the text-processing tools used across the labs. Read these first if `awk` or `jq` are new to you.

- [grep](tools/grep.html): search text with patterns
- [sed](tools/sed.html): stream editing and in-place config edits
- [awk](tools/awk.html): fields, patterns, arrays and reports
- [jq](tools/jq.html): select, map, group and reshape JSON
- [sort & uniq](tools/sort-uniq.html): ordering and frequency counts
- [cut, tr, paste, wc, head, tail, tee](tools/cut-tr.html): slicing and translating
- [find & xargs](tools/find-xargs.html): finding files and acting on them safely
- [curl](tools/curl.html): HTTP requests, headers, JSON bodies, timeouts

### Reference

- [Cheat sheet](reference/cheatsheet.html): dense one-page revision sheet, printable with Ctrl+P
- [Dataset library](reference/datasets.html): describes every practice file

## Repository layout

```
.
├── index.html        # home page and table of contents
├── labs/             # lab01 … lab12
├── tools/            # command tutorials
├── reference/        # cheat sheet and dataset library
├── datasets/         # sample logs, CSV, JSON and config files used by every example
└── assets/
    ├── style.css     # shared styles
    └── app.js        # shared sidebar navigation and page behaviour
```

### Practice datasets

| File | Contents |
|------|----------|
| `access.log` | Apache/Nginx combined log, 80 lines |
| `auth.log` | sshd / sudo syslog lines |
| `employees.csv`, `employees_v2.csv` | Employee records with header |
| `sales.csv` | Sales records with header, 30 rows |
| `users.json` | Array of 12 user objects |
| `servers.json` | Nested server inventory |
| `cf_zones.json`, `cf_dns_records.json`, `cf_error.json` | Cloudflare API v4 responses |
| `servers.txt`, `services.txt` | Host inventory and service check definitions |
| `df.txt` | `df -h` snapshot |
| `backups_listing.txt` | `ls -l` of a backup directory |
| `app.conf`, `wp-config-sample.php` | Config files for `sed` edits |
| `tags.txt`, `wordlist.txt` | Word lists for `sort`/`uniq` and passphrases |

## Requirements

- Bash 5 on Linux with GNU coreutils, `sed`, `awk` and `grep`
- `jq` and `curl` for the JSON and API labs
- `openssl` for Lab 08

**macOS users:** `sed -i`, `date -d` and some `awk` functions behave differently on BSD tools. To match the outputs exactly, install the GNU versions:

```bash
brew install gnu-sed gawk coreutils jq
```

The labs that touch real systems (03, 07, 10, 11, 12) need SSH access, a mail relay or `sudo` on an Ubuntu VM. Run them on a disposable VM rather than your own machine.

## Adding a page

1. Copy an existing page from the same section as a template.
2. Set `data-root` (`""` at the top level, `"../"` in subfolders) and a unique `data-page` id on `<body>`.
3. Add the page to the `NAV` list in `assets/app.js` so it appears in the sidebar, and add a card to `index.html`.
