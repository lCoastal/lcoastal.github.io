---
title: Prospecting research data
date: 2026-11-26
tags: [index]
---

# Prospecting research data

Test logs and findings behind the Prospecting Toolkit ([lcoastal.github.io](https://lcoastal.github.io)). This folder isn't part of the site: nothing links to it and `_config.yml` keeps it out of the published pages. It is still visible to anyone who opens the repo on GitHub.

## Start here

- [FINDINGS.md](FINDINGS.md): everything measured so far (weight, zone factors, luck, modifiers, mutations, speed), what the logs showed, and what's still open. Read this first.
- [logs/](logs/): every test log, compressed. Read with [scripts/load.py](scripts/load.py).
- [community/](community/): tests other players shared, with their raw numbers ([2026-11-25_tests.md](community/2026-11-25_tests.md)).
- [reference/](reference/): equipment stats (5★ and 6★), treasure chest drop tables, Umbrite Ring Prismatic vs Festive.

## Adding a new log

GitHub's website takes files up to 25 MB, and a repo file can't be bigger than 100 MB. Logs are big, so compress first.

1. **Compress the log.** With 7-Zip: right-click the file, 7-Zip, Add to archive, Archive format **xz**, Compression level **Ultra**. That makes a `.xz` about 11× smaller (350 MB came down to 32 MB). A `.zip` also works but is about 3× bigger than `.xz`.
2. **Name it by date**, like `2026-11-30_galaxis.txt.xz`, so it's clear which log is which.
3. **Up to 25 MB:** open this repo on github.com, go into `research/logs`, click **Add file**, **Upload files**, drop it in, then **Commit changes**.
4. **Bigger than 25 MB:** open **Releases** (right side of the repo page), **Draft a new release**, give it a tag like `logs-2026-11-30`, drag the file into the box at the bottom (up to 2 GB per file), then **Publish release**.
5. Add a line to the table below with what the log is (zone, what you were testing, anything special like a potion or Seeker's Mark being on).

| File | Where | Date | What | Notes |
|---|---|---|---|---|
| `research/logs/2026-11-18_logger.tsv.xz` | repo | 18/11 | Meteor Falls, Abyssal Depths | 51,006 minerals |
| `research/logs/2026-11-19_galaxis.tsv.xz` | repo | 19/11 | GalaxisHub | 650,265; Windswept Beach eruption 13:00 to 13:20 |
| `research/logs/2026-11-20_galaxis.tsv.xz` | repo | 20/11 | GalaxisHub | 652,655 |
| `research/logs/2026-11-22_galaxis.tsv.xz` | repo | 22/11 to 24/11 | GalaxisHub, 24 zones | 2,567,738 |
| `research/logs/2026-11-24_galaxis.tsv.xz` | repo | 24/11 to 26/11 | GalaxisHub, 17 zones, the rest of the 22/11 log | 1,201,982; Windswept Beach eruption 05:30; 879 rows with UNKNOWN weight and modifier |
| `research/logs/2026-11-26_galaxis.tsv.xz` | repo | 26/11 06:17 to 27/11 15:46 | GalaxisHub, 28 zones, luck caps 1 to 100,000, capacity 4,904 to 11,513 | 2,794,365; five eruptions in Magma Furnace and Infernal Heart; 8,862 rows UNKNOWN; repeating storage minerals in Rotwood Swamp |

## Notes for analysing

- Read [FINDINGS.md](FINDINGS.md) first. The toolkit's code (`src/`, mainly `src/shared/common.html`) wins if it disagrees with it.
- Logs are in `research/logs/` (`.tsv.xz`, read with `scripts/load.py`) and in this repo's Releases for files over 25 MB: `gh release download <tag> --repo lCoastal/lcoastal.github.io`. The table above says what each log is.
- Log zone names differ from the toolkit's: Rubble Creek = Rubble Creek Sands, Abyssal Depths = Abyssal Depth, The Magma Furnace = Magma Furnace.
- After a new finding, update FINDINGS.md (and its Open questions), and add new logs to the table above.

Related: [FINDINGS.md](FINDINGS.md)
