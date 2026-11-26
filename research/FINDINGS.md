---
title: Prospecting findings
date: 2026-11-26
tags: [findings, formulas, logs]
---

# Prospecting findings

Everything measured so far about Prospecting (Roblox): the formulas the toolkit at [lcoastal.github.io](https://lcoastal.github.io) uses, what the logs in this repo showed, and what's still open. Last updated 26/11/26, toolkit version 523.

**The toolkit's code is the final word.** If this file and the code disagree, the code wins: the weight model and zone factors are in [src/shared/common.html](../src/shared/common.html), the stat calculator in [src/tools/calc/script.js](../src/tools/calc/script.js), test write-ups in [src/tools/testlog/script.js](../src/tools/testlog/script.js).

## Contents

- [The data in this repo](#the-data-in-this-repo)
- [Weight](#weight)
- [Zone weight factors](#zone-weight-factors)
- [Minerals per pan](#minerals-per-pan)
- [Luck](#luck)
- [Modifiers](#modifiers)
- [Gear mutations](#gear-mutations)
- [Dig and shake speed](#dig-and-shake-speed)
- [Things that skew logs](#things-that-skew-logs)
- [Community tests (25/11/26)](#community-tests-251126)
- [Open questions](#open-questions)
- [Formulas page](#formulas-page)
- [Test log](#test-log)

## The data in this repo

| File | What | Minerals |
|---|---|---|
| `research/logs/2026-11-18_logger.tsv.xz` | Meteor Falls and Abyssal Depths, 32 minutes | 51,006 |
| `research/logs/2026-11-19_galaxis.tsv.xz` | GalaxisHub, 19/11 (has the Windswept Beach eruption) | 650,265 |
| `research/logs/2026-11-20_galaxis.tsv.xz` | GalaxisHub, 20/11 | 652,655 |
| `research/logs/2026-11-22_galaxis.tsv.xz` | GalaxisHub, 22/11 to 24/11, 24 zones | 2,567,738 |

Columns: `Time, Pan, Mineral, Mutation, Weight (kg), Luck, Size Boost, Modifier Boost, Capacity, Zone`. `Mutation` is the mineral's modifier (Iridescent, Glowing…; `None` if it has none). Size Boost and Modifier Boost are plain numbers (14.76 = 1,476%). The item ID column was dropped to save space. Read them with [scripts/load.py](scripts/load.py).

The logs name three zones differently from the toolkit: `Rubble Creek` = Rubble Creek Sands, `Abyssal Depths` = Abyssal Depth, `The Magma Furnace` = Magma Furnace.

Also here: [reference/](reference/) (5★/6★ equipment stats, treasure chest drop tables, Umbrite Ring Prismatic vs Festive) and [community/](community/) (tests other players shared).

## Weight

```
weight = base weight × (1 + Size Boost) × zone factor × k   (× 1.5 with the Solar Magnifier)
```

- **k is between 0.75 and 15.5 most of the time.** The lightest is exactly 0.75 in every zone.
- **k reaches 17.0 at times.** In some stretches about a quarter of minerals come out 1.1× heavier (15.5 × 1.1 = 17.05). Across 2.57M minerals about 1.4% landed between 15.5 and 17. It switches on and off by time (10-minute windows go from 0% to 4.6%), doesn't depend on the modifier, and the lightest stays 0.75 while it's on. Cause unknown.
- **The spread depends on capacity.** 26.1% are small (k evenly between 0.75 and 1.88). A share h(cap) is skewed heavy (k = 0.75 + 14.75 × Beta(a, 1.99)). The rest are even between 0.75 and 15.5. h = 0.533 × (1 − e^−((cap − 1797) / 2266)), a = 4.24 + 0.000667 × cap. Fitted on 1,856 to 7,240 capacity and confirmed within about 1% (median, mean, top 10%) from 6,692 to 8,638 capacity.
- **Below about 2,000 capacity minerals come out lighter than the model says.** The community's 1,001-capacity sample had a median of 0.67 kg where the model says 1.06.
- **Volcanic eruption: everything 1.5× heavier while it lasts.** Seen once, Windswept Beach on 19/11 from 13:00 to 13:20: all 2,986 minerals, lightest and heaviest both exactly 1.5×. That eruption is why Windswept Beach was once measured at 1.12 instead of 0.96. Which zones an eruption covers is unknown.
- **Museum max boost is at 200× base weight for every mineral** (Sandsteel at 150×). So the Size Boost a museum max needs is the same for every mineral and depends only on capacity: possible at all from 1,076% Size Boost (17× roll), and at 8,000 capacity 1 in 10 reach it at 1,273%, half at 1,670%.

## Zone weight factors

Every weight in a zone is multiplied by its factor. Measured from each zone's lightest mineral (exactly 0.75 × factor) on the 22/11 log, and the factors come in steps: 0.80, 0.88, 0.92, 0.96, 1.00, 1.04, 1.12, 1.20.

| Zone | Factor | Minerals measured |
|---|---|---|
| Rubble Creek Sands | ×0.80 | 84,630 |
| Rubble Creek Deposits | ×0.88 | 16,154 |
| Fortune River | ×0.92 | 14,489 |
| Azuralite Oasis | ×0.96 | older 20/11 log, nearest step |
| Magma Furnace | ×0.96 | 28,547 |
| Sunset Beach | ×0.96 | 100,526 |
| Volcanic Sands | ×0.96 | 18,912 |
| Windswept Beach | ×0.96 | 89,412 |
| Crystal Cavern River | ×1.00 | older 20/11 log, nearest step |
| Fortune River Delta | ×1.00 | 21,377 |
| Frostbite River | ×1.00 | 10,017 |
| Frostbite Waterfall | ×1.00 | 14,703 |
| Lifespring Oasis | ×1.00 | 54,271 |
| Meteor Falls | ×1.00 | 102,014 |
| Mystic Floodplains | ×1.00 | 960,663 |
| Sandstone Stream | ×1.00 | 246,579 |
| Starfall River | ×1.00 | 13,469 |
| Volcanic Springs | ×1.00 | older 20/11 log, nearest step |
| Astral Caverns | ×1.04 | 26,855 |
| Deeproot Spring | ×1.04 | 5,371 |
| Enchanted Ruins | ×1.04 | 295,169 |
| Frozen Peak | ×1.04 | 118,387 |
| Fungal Marsh | ×1.04 | 101,876 |
| Overgrown Grotto | ×1.04 | older 20/11 log, nearest step |
| Rotwood Swamp | ×1.04 | 45,588 |
| Abyssal Depth | ×1.12 | 25,039 |
| Infernal Heart | ×1.12 | 87,235 |
| Timelocked Sanctuary | ×1.20 | 86,449 |
| Tomb Vein I | ×1.00? | not measured yet |
| Tomb Vein II | ×1.00? | not measured yet |
| Tomb Vein III | ×1.00? | not measured yet |
| The Void | ×1.00? | not measured yet |
| Haunted Creek | ×1.00? | not measured yet |
| North Pole | ×1.00? | not measured yet |
| Seashell Beach | ×1.00? | not measured yet |

## Minerals per pan

- Average: 0.678 × capacity^0.565 (ours). The community's own fit, 0.688 × capacity^0.563, is within 0.6% of it from 1k to 30k capacity.
- Fewest in a full pan: ⌊½ × √capacity⌋ (held on 14,855 pans). Most: about 2.5 × √capacity.
- Luck doesn't change how many minerals a pan holds.

## Luck

- **Luck cap:** a capped session pans at about 0.56 × the cap (326,000 capped minerals, 17 zones, caps 100 to 10,000). The luck floor is 1.
- **Very rare minerals** (base odds about 1 in 18 million to 1 in 1.6 billion) drop about 1.9× more often than the roll model alone says (about 2.4M minerals, 11 zones).
- **At 90k+ luck the model predicts too few mid-rare minerals.** Seen in the 22/11 log, not yet fixed.
- **Nebula and Starcrusher** add +0.1 to the luck multiplier, like the museum does (not ×1.1).
- **Seeker's Mark rune:** items for your active quests are 10% easier to get. Logs taken with it on show quest minerals about 1.1× too common; nothing in a log says which minerals were quest targets.

## Modifiers

The toolkit uses: chance a mineral has a modifier = 1 − 0.9369^(Modifier Boost ÷ 100), split between modifiers by their base shares. Checked against our logs and a community test:

| Modifier Boost | Toolkit says (unmodified) | Our logs | Community test |
|---|---|---|---|
| about 475 to 503% | 73% | 68.4% (650,265 at 475%, 19/11) and 74.7% (232,931 at 475%, 20/11) | 71.3% (503%) |
| about 1,000 to 1,080% | 50% | 52.9% (419,724 at 1,081%) | 42.4% (1,012%) |
| 1,661% | 34% | 25.5% (51,006, 18/11) | |
| about 1,830 to 1,920% | 29% | 13.1% at 1,831%, 12.6% at 1,917% overall; about 20% in steady hours, 1% to 20% hour to hour | 4.2% (1,903%) |

- The toolkit predicts too few modifiers at high boost. Our logs and the community test disagree on how many; our 1,916% log swings hour to hour, so something it doesn't record (Surge, the Magnifier, night) was on part of the time.
- **The Solar Magnifier and Modifier Surge each act like doubling Modifier Boost, and they stack.** 503% with either one gave about 40 to 41% unmodified, the same as about 1,000% without. 1,012% with either gave about 1%.
- To settle it: a clean log at about 1,900% Modifier Boost, daytime, with no Surge and no Magnifier.

## Gear mutations

The toolkit shows the odds the game displays. A community test (111 to 888 crafts per ore count) shows those are off once you use several ores. The chance of no mutation matches, but results lean to the better mutations. At 10 ores: Prismatic 14.9% (game says 5.4%), Granite 31.7% (10%), Gold 7.9% (26%), Silver 0.1% (25%). Full table: [community/2026-11-25_tests.md](community/2026-11-25_tests.md#gear-mutation-odds-by-ore-used). Not in the toolkit yet.

## Dig and shake speed

Used by the toolkit's Rolls per Minute tool. Speeds in percent (100% is base).

- **Time per dig:** 143.9 × Dig Speed^−0.9324 s (Patel). Within 5% of every point from 159% to 603%. Both community dig datasets also fit about 200 ÷ Dig Speed seconds per dig, plus a fixed delay: about 1.45 s per pan in Patel's table, about 0.3 s per dig in the 120 to 1,597% list (likely a macro's hold and wait). Above about 600% untested.
- **Shakes per second:** 23.514 × Shake Speed ÷ (442.88 + Shake Speed). Within a few percent of the test from 250% to 2,000%, 23% too fast at 200%. Tested at 6 shakes per pan.
- **Digs per pan** = Capacity ÷ Dig Strength, rounded up. **Shakes per pan** = Capacity ÷ Shake Strength, rounded up. Neither can be more than the capacity.
- **Time per pan** = digs × time per dig + shakes ÷ shakes per second + about 1.15 s.

## Things that skew logs

- **Minerals that can't drop where they were logged.** 617 of 2.57M (0.02%), almost all in 24 "pans" out of 23,877, for example 104 Dinosaur Skulls in one Rotwood Swamp pan (it only drops in Infernal Heart, 1 in 54 million). These are minerals entering the inventory another way (storage, the museum, trades), logged as a pan. The toolkit's Test Data Check leaves them out and lists them.
- **Firefly Zone minerals** (Firefly Stone in Enchanted Ruins and others) drop in their zone but the toolkit's drop rates don't include Firefly Zones yet.
- **Eruptions** (×1.5 weight) and the **×1.1 stretches** (k up to 17) come and go; check by time window before trusting a zone's heaviest weights.
- **Hidden boosts** the logger doesn't record: Surge, the Solar Magnifier, night, Seeker's Mark. Hour-to-hour swings in a log usually mean one of them.

## Community tests (25/11/26)

Raw numbers: [community/2026-11-25_tests.md](community/2026-11-25_tests.md).

| Test | Matches us? |
|---|---|
| Items per pan, 0.688·Cap^0.563 | Yes, within 0.6% |
| Weights by capacity, 1,001 to 9,997 | From 2k to 10k yes, within the noise of about 200 minerals each. At 1,001 our model is too heavy |
| Dig time, 143.9·DigSpd^−0.9324 | Yes, 159% to 603% |
| Shakes per second | Yes, except 200% |
| Modifier Boost | No: the toolkit is too low at high boost |
| Gear mutation odds | No: the in-game odds the toolkit shows are wrong |

## Open questions

- Modifier chance at high boost: 4% or 20% unmodified at about 1,900%? Needs a clean log.
- What causes the ×1.1 stretches (k up to 17)?
- Which zones a Volcanic Eruption covers, and how often.
- Zone factors for Tomb Vein I, II and III, The Void, Haunted Creek, North Pole and Seashell Beach; re-measure Azuralite Oasis, Crystal Cavern River, Overgrown Grotto and Volcanic Springs.
- The weight spread below about 1,800 capacity.
- The luck model at 90k+ luck; Aurorite vs Moonstone in Fortune River Delta; Firefly Zone drop rates.
- Dig time above about 600% Dig Speed; shakes per second when a pan needs many more than 6 shakes.

## Formulas page

The toolkit's Formulas page as of version 523.

## Pans

### Average minerals per pan

```
n = 0.678 × C^0.565
```

n = average minerals in a full pan, C = capacity. Luck doesn't change it.

### Fewest and most minerals per pan

```
min = ½ × √C
max ≈ 2.5 × √C
```

min = fewest minerals a full pan can give, max = most, C = capacity. Most pans sit in the lower part of that range.

## Weight

### Lightest and heaviest weight

```
Wmin = 0.75 × B × (1 + S) × Z
Wmax = 17 × B × (1 + S) × Z
```

Estimated from the lightest and heaviest rolls in our test logs, not confirmed. Most of the time the heaviest is 15.5 × B × (1 + S) × Z; 17 shows up only in stretches where about a quarter of minerals come out 1.1× heavier. Wmin = lightest weight (kg), Wmax = heaviest weight (kg), B = the mineral's base weight (kg), S = Size Boost as a number (1,476% = 14.76), Z = the zone's size factor (see below). With the Solar Magnifier multiply by 1.5.

### Maximum weight at a Size Boost

```
Wmax = 17 × B × (1 + S) × Z
```

Best guess, from the heaviest rolls in our test logs (usually 15.5 instead of 17). Wmax = heaviest weight (kg), B = the mineral's base weight (kg), S = your Size Boost as a number (1,476% = 14.76), Z = the zone's size factor. With the Solar Magnifier multiply by 1.5.

### Minimum Size Boost for a weight

```
S = W ÷ (17 × B × Z) − 1
```

S = Size Boost you need, as a number (×100 for %, so 18.35 = 1,835%), W = the weight you want (kg), B = the mineral's base weight (kg), Z = the zone's size factor. With the Solar Magnifier use W ÷ 1.5 instead of W.

### Zone size factor

```
Z = 0.80  Rubble Creek Sands
Z = 0.88  Rubble Creek Deposits
Z = 0.92  Fortune River
Z = 0.96  Azuralite Oasis, Magma Furnace, Sunset Beach, Volcanic Sands, Windswept Beach
Z = 1.00  Crystal Cavern River, Fortune River Delta, Frostbite River, Frostbite Waterfall, Lifespring Oasis, Meteor Falls, Mystic Floodplains, Sandstone Stream, Starfall River, Volcanic Springs
Z = 1.04  Astral Caverns, Deeproot Spring, Enchanted Ruins, Frozen Peak, Fungal Marsh, Overgrown Grotto, Rotwood Swamp
Z = 1.12  Abyssal Depth, Infernal Heart
Z = 1.20  Timelocked Sanctuary
Z = 1?    Not measured yet: Haunted Creek, North Pole, Seashell Beach, The Void, Tomb Vein I, II and III
```

Z = how much a zone multiplies every weight. Measured on 2.57 million minerals in 24 zones: a zone's lightest mineral is exactly 0.75 × its factor. Azuralite Oasis, Crystal Cavern River, Overgrown Grotto and Volcanic Springs are from an older, smaller log. Zones not listed count as 1. The best place to chase a heavy piece is Timelocked Sanctuary (20% heavier than most zones).

## Luck

### Luck from a luck cap

```
L = 0.56 × cap
```

L = the luck a capped session actually pans at, cap = the cap you set. Measured on 326,000 capped minerals in 17 zones: every cap from 100 to 10,000 landed between 0.54 and 0.60. A cap only helps for minerals that get rarer with more luck; Best Luck Cap works out which.

## Museum

### Museum display boost at a weight

```
boost = Bmax × (W ÷ Kmax)^0.42
```

boost = the stat boost the display gives, Bmax = its max boost (the mineral page shows "max boost at X kg"), Kmax = that X kg, W = the piece's weight (kg). Boost caps at Bmax once W reaches Kmax, and the game shows it rounded down to 2 decimals.

### Weight for a target display boost

```
W = Kmax × (target ÷ Bmax)^2.38
```

W = weight (kg) you need, target = the boost you want, Bmax = the display's max boost, Kmax = the weight for max boost. The boost curve above, solved for weight.

### Share of max boost at a weight

```
part = (W ÷ Kmax)^0.42
```

part = how much of the max boost you get (×100 for %), W = the piece's weight (kg), Kmax = the weight for max boost. Same for every mineral, so half the max-boost weight already gives about 75%.

## Test log

The toolkit's Test Log as of version 523, newest first.

### 24/11/26: Heaviest roll and zone factors, re-checked on 2.57M minerals

Zone: 24 zones, mostly Mystic Floodplains

Setup: Luck 10,000 – 100,000+; Capacity 6,692 – 8,638; Size Boost 14.3× and 14.8×; Zones 24 zones; 961,000 of the minerals from Mystic Floodplains

Amount: Minerals 2,567,732

**Tested**
- Whether any weight goes past 15.5 × base × (1 + Size Boost) × zone factor
- Each zone's factor, measured from its lightest mineral
- Whether the spread of weights between the lightest and heaviest still fits

**Found**
- About 1.4% of minerals went past 15.5, and none past 17.05. Every zone tops out at 17.0 once its factor is taken out
- It comes and goes: some 10-minute stretches have none past 15.5, others 1–4.6%. In those stretches the lightest is still 0.75, so it isn't everything getting heavier: it fits about a quarter of minerals coming out 1.1× heavier (15.5 × 1.1 = 17.05). It doesn't depend on the mutation
- Zone factors land on steps: 0.80 Rubble Creek Sands, 0.88 Rubble Creek Deposits, 0.92 Fortune River, 0.96 Magma Furnace, Sunset Beach, Volcanic Sands and Windswept Beach, 1.00 for nine zones, 1.04 Astral Caverns, Deeproot Spring, Enchanted Ruins, Frozen Peak, Fungal Marsh and Rotwood Swamp, 1.12 Abyssal Depth and Infernal Heart, 1.20 Timelocked Sanctuary
- Windswept Beach came out at 0.96, not the 1.12 the older log gave
- The typical, average and top-10% weights still match the fitted spread within about 1% at every capacity

**Changed in the toolkit**
- Heaviest possible weight is now 17 × base × (1 + Size Boost) × zone factor (was 15.5), with a thin tail between 15.5 and 17: Weight Range, Size Boost Finder, 5-Star Crafter, Mechanics, Formulas and Test Data Check
- Zone factors updated to the steps above
- Weight Range has a table of every zone's factor


### 20/11/26: Luck caps and weights, re-check at Size Boost 12.6×

Zone: 29 zones, mostly Sandstone Stream

Setup: Luck Caps 1 – 50,000, and up to 123,000 uncapped; Capacity 8,160 – 9,245; Modifier Boost 4.75×; Size Boost 7.15× and 12.6×; Zones 29 zones; 543,000 of the minerals from Sandstone Stream

Amount: Minerals 652,655

**Tested**
- Whether the zone size factors hold on separate data and at a new Size Boost
- Whether a luck cap still works like 56% of its number
- Whether anything in the log makes weights 1.5× or 2× heavier (Solar Magnifier)

**Found**
- Zone factors repeat: Rubble Creek 0.80 (0.80 before), Rubble Creek Deposits 0.88 (0.89), Sandstone Stream 1.00 (1.00), Volcanic Sands 0.95–0.96 (0.96), and the same at Size Boost 12.6×, which the first log never had
- Caps again behave like 56% of their number: exactly 0.56 for caps of 100 to 50,000 (72,000 capped minerals), 0.54–0.58 for caps of 1 and 10. Uncapped luck came out at 0.96× the luck shown
- No stretch of the log has weights 1.5× or 2× above the normal range. The heaviest Gold anywhere is 16.96× its base × (1 + Size Boost) × zone, against a normal top of 15.5×
- For about 7 minutes (09:41–09:49, mostly Rubble Creek) every weight was 1.10× heavier, smallest and biggest alike. What caused it isn't known: it isn't in the logged Size Boost

**Changed in the toolkit**
- Nothing: the zone factors and the 0.56 luck cap already in the toolkit both held up


### 20/11/26: Capped and uncapped luck in 26 zones

Zone: 26 zones

Setup: Luck Caps 1 – 10,000, and 2,500 – 99,000 uncapped; Capacity 7,817 – 10,493; Modifier Boost 4.75×; Size Boost 7.15× and 7.55×; Zones 26 zones, from Rubble Creek to Timelocked Sanctuary

Amount: Pans 6,080; Minerals 650,265

**Tested**
- What a luck cap really gives, with more than half the log panned at a cap
- Whether weights still fit 0.75 to 15.5 × base × (1 + Size Boost) in zones other than Meteor Falls
- Minerals per pan and the modifier rate at a new capacity and Modifier Boost

**Found**
- Every cap from 100 to 10,000 behaved like 56% of its number (54–60% in each of 17 zones, 326,000 capped minerals). Uncapped luck came out at about 86% of the luck shown, so a cap is about 0.65× of uncapped luck, close to the old 63%
- Each zone multiplies weights by its own factor: ×0.80 in Rubble Creek, ×0.93 in Fortune River, about ×1 in most zones, ×1.12 in Infernal Heart, Abyssal Depth and Windswept Beach, ×1.20 in Timelocked Sanctuary. The factor was the same at both Size Boosts and hours apart
- With the zone factor, weights stay between 0.75 and 15.5 × base × (1 + Size Boost) (Gold reached 15.0–15.5 in every long session), and the spread matched the weight model: median 11.1–11.6× vs 11.2–11.5×, top 10% 14.5× vs 14.5×, 27.6% small vs 26%
- Minerals per pan at 8,160 capacity (2,220 pans): 109.3 vs 109.7 predicted. Some zones ran lower (Abyssal Depth about 19%, Fortune River about 15%), on short runs
- Modifier rate 26.5% vs 27% predicted at 4.75×, the lowest boost checked since the refit; the mix within about 10% for the common ones, Cosmic, Mutated and Perfect a little more often than predicted
- A few base weights look slightly off: Selenite about 10% heavier than listed, Pyrelith and Golden Pearl about 8%, Pearl about 8% lighter

**Changed in the toolkit**
- Luck caps now count as 0.56 × the cap everywhere (was 0.63): Best Luck Cap, Dredge, Build Compare and the farm routes
- New zone size factor: Weight Range, Size Boost Finder, Mechanics and the 5-Star Crafter's max weight let you pick a zone; Test Data Check uses each row's zone
- Formulas: weight formulas now include the zone factor, plus a zone table and the luck cap formula


### 17/11/26: Check at two capacities

Zone: Meteor Falls

Setup: Luck 26,400 – 267,000; Capacity 7,240 then 5,462; Modifier Boost 16.6×

Amount: Pans 8,180; Minerals 776,278

**Tested**
- Whether the 17/11 formulas hold on the biggest run so far
- The lowest and highest number of minerals a pan can hold

**Found**
- Items per pan: 102.0 vs 102.5 predicted at 7,240 capacity, 85.5 vs 87.5 at 5,462
- A pan never held fewer than ½ × √capacity minerals (37 at 5,462, 42 at 7,240) or more than about 2.5 × √capacity (183 and 212)
- Gold, Pyrite, Nickel and Sapphire within 1%; mid-tier within about 8%; Mythics about 9% under the prediction (4,349 vs 4,793)
- Modifier rate 69.2% vs 66.1% predicted, every modifier's share within 1.5 points
- Weights: all between 0.75 and 15.5 × base × (1 + Size Boost), and the spread matched the capacity model within about a point
- Lapis Lazuli again about 1.6× more common than predicted

**Changed in the toolkit**
- Test Data Check now handles files this big
- Pan size range added to the findings


### 17/11/26: Mineral weights across every logged run

Zone: All logged runs

Setup: Capacity 1,856 – 7,240 (20 different values); Size Boost 14.2× – 22.4×

Amount: Minerals re-checked 1,500,000

**Tested**
- Where weights fall between the lightest and heaviest possible
- Whether capacity, luck, modifier, mineral or position in the pan changes the weight

**Found**
- Every weight falls between 0.75 and 15.5 × base weight × (1 + Size Boost); common minerals hit both ends almost exactly
- About 26% of minerals always come out small (0.75 – 1.88 × base × (1 + Size Boost))
- The rest are spread evenly at low capacity; the bigger the pan, the more of them lean to the heavy end (half beat 5.6× at 1,856 capacity, 10.9× at 7,240)
- Luck, modifier, which mineral and where it lands in the pan made no difference

**Changed in the toolkit**
- New tools: Weight Range and Size Boost Finder
- Test Data Check shows each mineral's lightest and heaviest against the limits


### 17/11/26: Check on new data

Zone: Meteor Falls

Setup: Luck 40,500 – 264,000; Capacity 7,240; Modifier Boost 16.6×

Amount: Pans 1,096; Minerals 112,342

**Tested**
- Whether the 17/11 formulas predict a run they weren't fitted on

**Found**
- Items per pan: 102.5 measured, formula 102.5
- Gold, Pyrite, Nickel and Sapphire within 3%; mid-tier minerals within 3–10%
- Normal modifier rate 69.6% vs 66.1% predicted, and the modifier mix within about 2 points for every modifier
- 649 Mythics vs 754 predicted: the very rare boost was a little too strong (without it the prediction would be 398)
- Lapis Lazuli again about 1.8× more common than predicted, as in every run

**Changed in the toolkit**
- Very rare boost refit on all data: up to ×1.86 instead of ×1.9


### 17/11/26: Modifiers

Zone: Meteor Falls

Setup: Luck 27,800 – 267,000; Modifier Boost 16.6× (1,660%); Capacity 5,462 and 7,240

Amount: Pans 918; Minerals 84,522

**Tested**
- How often a mineral gets a normal modifier at a high Modifier Boost
- Which modifier you get, at many different luck values
- Whether the earlier Mythic result repeats

**Found**
- 68.8% of minerals got a normal modifier. The toolkit said 39% and never went higher
- The rate didn't move with luck: 68–69.5% from 45,000 to 207,000 luck
- Modifier mix: Iridescent 28.9%, Cosmic 20.2%, Irradiated 12.7%, Shiny 11.4%, Pure 9.4%, Glowing 6.4%, Mutated 5.6%, Scorching 4.9%, Perfect 0.56%
- Mythics again about 1.5× what the luck model said (441 found vs 288), while Gold, Pyrite, Nickel and Diamond were within 1%

**Changed in the toolkit**
- Modifier chance is now 1 − 0.937^boost (no 39% cap)
- Which-modifier rolls are now 11.7 × boost^0.84 + 2 per 1,000 luck, with no luck cap
- Very rare minerals get up to ×1.86 in the luck model


### 17/11/26: Luck changing every pan

Zone: Meteor Falls

Setup: Luck 26,400 – 266,000; Capacity 7,240 then 5,462; Size Boost 14.76×

Amount: Pans 4,975; Minerals 457,578

**Tested**
- The luck formula across a ten times wider luck range than before
- Items per pan at two capacities
- Whether the Mythic odds listed for Meteor Falls hold

**Found**
- Items per pan: 101.8 at 7,240 capacity and 86.4 at 5,462. The capacity formula predicts 102.5 and 87.5; √capacity would say 85 and 74
- Common and uncommon minerals were within 3% of the old luck model; Cobalt, Iridium, Diamond and Radium within ~15%
- All four Mythics (Vortessence, Star Garnet, Aetherium, Sunstone) came out at almost exactly 2× the prediction, Starpiercer was spot on

**Changed in the toolkit**
- Confirmed the new items-per-pan formula
- Part of the data for the 17/11 luck model refit


### 17/11/26: Fortune River Delta at luck 1 and at 78,000

Zone: Fortune River Delta

Setup: Luck 1 and 78,279; Capacity 5,462; Size Boost 14.76×; Modifier Boost 16.6×

Amount: Pans 269; Minerals 23,057

**Tested**
- Items per pan at a big capacity
- Luck at one fixed high value against luck 1

**Found**
- 85.7 items per pan, the same at both luck values, so luck doesn't change how many you get
- √capacity (73.9) was clearly too low; 0.678 × capacity^0.565 (87.5) fits
- The luck-1 pans matched the zone's base drop chances almost exactly (Gold 55.7% vs 54.7%)
- Iridium and Moonstone have the same listed odds but came out 326 vs 130, and Aurorite 27× too often: the luck model gave the whole share of tied minerals to just one of them

**Changed in the toolkit**
- Items per pan switched from √capacity to 0.678 × capacity^0.565 in every tool
- Minerals with the same odds now split their chance evenly


### 17/11/26: The game's drop weights, zone by zone

Zone: All 35 zones

Setup: Source The game's own weight table; Zones 35

Amount: Zones 35

**Tested**
- Whether the toolkit's drop chances match the game's weights

**Found**
- Every zone matches to within 1%, except The Void
- Three zones only differ in name: Abyssal Depths, The Magma Furnace and Rubble Creek
- The Void in the game table is a fixed table with Voidstone at 1 in 91.4 million; the toolkit treats it as a rotating pool (1 in 138 million)
- So the extra Mythics at Meteor Falls aren't a data mistake

**Changed in the toolkit**
- Nothing needed changing, apart from The Void, which is still open


### 13/11/26: Sandstone Stream and Meteor Falls, totem on and off

Zone: Sandstone Stream, Meteor Falls

Setup: Luck 24,000 – 61,300; Capacity 2,833 – 3,494; Modifier Boost 9.19× – 9.26×; Luck Totem On and off

Amount: Minerals 80,903

**Tested**
- Drops with and without the Luck Totem
- Modifier rate at about 9× boost

**Found**
- About 41% of minerals got a normal modifier at 9.2× boost
- Meteor Falls Mythics were about 2× the luck model here too

**Changed in the toolkit**
- Part of the data for the 17/11 luck and modifier refits


### 12/11/26: Fixed-luck tests in six zones

Zone: Frozen Peak, Fortune River Delta, Fortune River, Volcanic Springs, Infernal Heart, Sandstone Stream

Setup: Luck Set to 5,000, 10,000, 23,000, 24,000, 35,000, 39,000 and 50,000; Capacity 2,779; Size Boost 22.2×; Modifier Boost 9.26×

Amount: Minerals 258,655

**Tested**
- The luck formula at low luck values
- How the modifier rate changes between zones at the same boost

**Found**
- The low-luck end of the luck model (5,000–10,000) mostly comes from these
- Modifier rate at 9.26× boost ranged from 41% (Sandstone Stream) to 57% (Infernal Heart): something other than boost raises it in some sessions

**Changed in the toolkit**
- Part of the data for the 11/11 and 17/11 luck fits and the 17/11 modifier fit


### 12/11/26: Low Modifier Boost test

Zone: Fortune River

Setup: Luck 7,900 and 11,400; Modifier Boost 1.13×; Capacity 1,242; Size Boost 3.32×

Amount: Minerals 69,693

**Tested**
- How often modifiers show up with almost no Modifier Boost

**Found**
- Only about 10% of minerals got a normal modifier at 1.13× boost
- With so little boost the mix leans heavily to Irradiated, Scorching and Glowing; Cosmic and up are rare

**Changed in the toolkit**
- The low end of the modifier formula (1 − 0.937^boost) rests on this


### 11/11/26: Haunted Creek and Meteor Falls

Zone: Haunted Creek, Meteor Falls, plus Timelocked Sanctuary, Frozen Peak, Astral Caverns, Fungal Marsh, Sandstone Stream, Starfall River, The Void

Setup: Luck 19,500 – 74,000; Capacity 1,856 – 4,101; Size Boost 14.2× – 22.4×; Modifier Boost 5.97× – 9.19×

Amount: Minerals 2,353,754

**Tested**
- The first proper fit of the luck formula
- Modifier rate and mix at 6× to 9× boost

**Found**
- Haunted Creek (1.24 million minerals) and Meteor Falls (950,000) are the backbone of the luck model
- Mythics in most zones came out 1.5–2.7× more often than the luck model said; zones whose Mythics are only 1 in 3–12 million matched
- Normal modifier rate: about 36% at 6× boost and 37–50% at 8.4–9.2×

**Changed in the toolkit**
- The 11/11 luck model came from this
- Re-used in the 17/11 luck, rare-mineral and modifier refits


Related: [README.md](README.md), [community/2026-11-25_tests.md](community/2026-11-25_tests.md)
