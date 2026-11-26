"""Read any log in this repo, compressed or not.

    from load import rows
    for r in rows("logs/2026-11-22_galaxis.tsv.xz"):
        r["Mineral"], float(r["Weight (kg)"]), r["Zone"]

Works with .tsv.xz, .tsv.gz, .zip (first file inside) and plain .tsv/.txt.
Run as a script for a quick summary:  python scripts/load.py logs/*.xz
"""
import collections, gzip, io, lzma, sys, zipfile

def _open(path):
    if path.endswith(".xz"):
        return lzma.open(path, "rt", encoding="utf-8", errors="ignore")
    if path.endswith(".gz"):
        return gzip.open(path, "rt", encoding="utf-8", errors="ignore")
    if path.endswith(".zip"):
        z = zipfile.ZipFile(path)
        return io.TextIOWrapper(z.open(z.namelist()[0]), encoding="utf-8", errors="ignore")
    return open(path, encoding="utf-8", errors="ignore")

def rows(path):
    """Yield one dict per mineral, keyed by the header names."""
    with _open(path) as f:
        head = f.readline().rstrip("\r\n").split("\t")
        for line in f:
            p = line.rstrip("\r\n").split("\t")
            if len(p) >= len(head):
                yield dict(zip(head, p))

if __name__ == "__main__":
    for path in sys.argv[1:]:
        n, zones, first, last = 0, collections.Counter(), None, None
        for r in rows(path):
            n += 1; zones[r.get("Zone", "?")] += 1
            first = first or r.get("Time"); last = r.get("Time")
        print(f"{path}: {n:,} minerals, {first} to {last}, {len(zones)} zones")
        for z, c in zones.most_common(5):
            print(f"   {z}: {c:,}")
