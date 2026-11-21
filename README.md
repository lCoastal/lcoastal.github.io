# Prospecting Toolkit – test data

Raw mineral logs and the tables built from them. This branch is separate from
the site (`main`), so nothing here is served on the live toolkit.

## Logs

| File | Date | Pans | Finds | Zones | Luck | Capacity | Size Boost | Mod Boost | Test Log |
|---|---|---|---|---|---|---|---|---|---|
| `logs/2026-11-18_abyssal-run.txt.gz` | 18/11/26 | 1,016 | 51,006 | 2 | 100 – 10,000 | 5,592 / 7,411 | 15.15 | 16.61 | – |
| `logs/2026-11-19_galaxishub-1.txt.gz` | 19–20/11/26 | 8,731 | 650,265 | 26 | 1 – capped | 7,817 – 10,493 | 7.15 / 7.55 | 4.75 | `galaxis-2011` |
| `logs/2026-11-20_galaxishub-2.txt.gz` | 20/11/26 | 9,760 | 652,655 | 29 | 1 – capped | 5,837 – 9,245 | 7.15 / 12.60 | 4.75 / 10.81 | `galaxis2-2011` |

What each was used for:

- **galaxishub-1**: weight bounds (0.75–15.5 × base), zone size factors
  (0.80 Rubble Creek – 1.20 Timelocked Sanctuary), luck caps counting as
  0.56 × cap, uncapped luck at 0.86×.
- **galaxishub-2**: re-check of all of the above at Size Boost 12.6 and
  Mod Boost 10.8; everything replicated. 59 weights logged as `UNKNOWN`
  (dropped). One unexplained ×1.10 weight window 09:41–09:49, mostly
  Rubble Creek; the log looks like it holds more than one account at once.
  No ×1.5 or ×2 weights, so Solar Magnifier is still unconfirmed.
- **abyssal-run**: Abyssal Depths at luck 100 / 5,000 / 10,000 with high
  Mod Boost (16.6); almost every find is mutated.

`reference/modifier_craft_multipliers.tsv` is the crafting weight multiplier
for each modifier.

## Tables

- `summary.csv`: one row per log × zone × luck × capacity × Size Boost ×
  Mod Boost, with first/last time, pans, finds, mutated finds, unknown
  weights and kg per pan.
- `minerals.csv.gz`: the same groups split by mineral, with finds, mutated
  finds and min / median / max weight.

## Adding a new log

1. Copy the logger's `.txt` into `logs/` as `YYYY-MM-DD_short-name.txt`.
2. `gzip -9 logs/*.txt`
3. `python3 scripts/summarize.py` (needs pandas) to rebuild both tables.
4. Add a row to the table above and commit.

Column format the script expects (tab-separated, header row):
`Time, Pan, Mineral, Mutation, Weight (kg), ItemID, Luck, Size Boost,
Modifier Boost, Capacity, Zone`.
