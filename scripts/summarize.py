#!/usr/bin/env python3
"""Rebuild summary.csv and minerals.csv from every log in logs/.

Usage:  python3 scripts/summarize.py
Logs can be plain .txt or .txt.gz, tab-separated with the logger's header:
Time, Pan, Mineral, Mutation, Weight (kg), ItemID, Luck, Size Boost,
Modifier Boost, Capacity, Zone
"""
import glob, os
import pandas as pd

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEYS = ["log", "zone", "luck", "capacity", "size_boost", "mod_boost"]

frames = []
for path in sorted(glob.glob(os.path.join(ROOT, "logs", "*.txt*"))):
    d = pd.read_csv(path, sep="\t", low_memory=False)
    d.columns = ["time", "pan", "mineral", "mutation", "weight", "item_id",
                 "luck", "size_boost", "mod_boost", "capacity", "zone"]
    d["weight"] = pd.to_numeric(d["weight"], errors="coerce")  # "UNKNOWN" -> NaN
    d["log"] = os.path.basename(path).split(".")[0]
    frames.append(d)
d = pd.concat(frames, ignore_index=True)
d["size_boost"] = d["size_boost"].round(4)
d["mod_boost"] = d["mod_boost"].round(4)
d["mutated"] = d["mutation"].fillna("None") != "None"
d["pan_key"] = d["time"].astype(str) + "#" + d["pan"].astype(str)

g = d.groupby(KEYS)
summary = pd.DataFrame({
    "first_seen": g["time"].min(),
    "last_seen": g["time"].max(),
    "pans": g["pan_key"].nunique(),
    "finds": g.size(),
    "mutated_finds": g["mutated"].sum(),
    "unknown_weights": g["weight"].apply(lambda s: int(s.isna().sum())),
    "kg_per_pan": g["weight"].sum() / g["pan_key"].nunique(),
}).reset_index()
summary["kg_per_pan"] = summary["kg_per_pan"].round(3)
summary.to_csv(os.path.join(ROOT, "summary.csv"), index=False)

m = d.groupby(KEYS + ["mineral"])
minerals = pd.DataFrame({
    "finds": m.size(),
    "mutated": m["mutated"].sum(),
    "w_min": m["weight"].min().round(4),
    "w_median": m["weight"].median().round(4),
    "w_max": m["weight"].max().round(4),
}).reset_index()
minerals.to_csv(os.path.join(ROOT, "minerals.csv.gz"), index=False, compression="gzip")

print(f"{len(frames)} logs, {len(d):,} finds, {summary['pans'].sum():,} pans")
print(f"summary.csv: {len(summary)} setups, minerals.csv.gz: {len(minerals)} rows")
