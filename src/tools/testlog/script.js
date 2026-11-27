const $=id=>document.getElementById(id);
// Test Log: a written summary of every test session behind the toolkit's formulas (no raw data).
// Each session: when, where, setup, how much was logged, what was tested, what it showed, what changed on the site.
const TOPICS={lk:"Luck",my:"Rare minerals",cp:"Capacity",md:"Modifiers",wt:"Drop tables",kg:"Weights"};
const S=[
{id:"galaxis5-2711",date:"27/11/26",title:"Eruptions in Magma Furnace and Infernal Heart, single minerals 1.1× heavier, and weights up to 11,500 capacity",zone:"28 zones, mostly Lifespring Oasis",topics:["kg","lk","md"],kind:"wt",
 setup:{Luck:"Caps 1 – 100,000, and 28,000 – 119,000 uncapped",Capacity:"4,904 – 11,513",["Size Boost"]:"8.4×, 8.8×, 14.8× and 33.3×",["Modifier Boost"]:"842%, 1,053% and 1,917%"},
 amount:{Minerals:2794365,Pans:19818},
 tested:["Each zone's factor and the heaviest roll in every zone","Volcanic eruptions: which zones, how much heavier, when","Minerals past 15.5: which ones and when","How weights spread from 9,800 to 11,500 capacity, and at Size Boost 33.3×","Luck caps, and uncapped luck","Modifier chance at 842% and 1,053% Modifier Boost"],
 found:["Every zone's lightest was 0.75 × its factor again, in all 28 zones","Five Volcanic Eruptions, in Magma Furnace and Infernal Heart (before, only Windswept Beach): every mineral exactly 1.5× heavier (lightest 0.75 × 1.5, heaviest 17 × 1.5) and about 1.5× more minerals per pan. The game's text says 2× size; the logs say 1.5× every time. They started on the hour or half hour (00:00, 01:00, 07:00 and 13:30) and ended 15 minutes later",
  "Minerals past 15.5 come from one mineral at a time: now and then one or a few minerals in a zone come out exactly 1.1× heavier for a while (lightest 0.825, about 20% of them past 15.5, top 17.05), while the rest of the same pans stay between 0.75 and 15.5. Diamond (84,000 logged) and Aetherite (43,000) never went past 15.5; Pyrelith did on 20%. It happened more while luck was capped (14% of mineral-minutes) than uncapped (5%). Cause unknown",
  "Weights from 9,800 to 11,500 capacity fit the model within about 1.5% (typical, average and top 10%), so the fit holds well past the 9,245 it was checked to. It also holds at Size Boost 33.3×",
  "Luck caps again behaved like 57% of their number (53–61% in 25 cap and zone pairs, 935,000 capped minerals). Uncapped luck came out at about 0.88× the luck shown in most zones; Enchanted Ruins, Magma Furnace, Sunset Beach, Windswept Beach and Overgrown Grotto came out much lower at high luck (0.3–0.7×), so their drop tables are off at high luck",
  "1,053% Modifier Boost: 54% unmodified (toolkit 54%). 1,917%: 20% (toolkit 20%). 842%: 55% overall, 62% in the steadiest hours (toolkit 60%). Which modifier you get matched within about 20%",
  "Minerals per pan can't be checked on this log: pans came every 2–3 seconds and the logger's pan numbers don't line up with real pans (1 to 7× √capacity in one pan)",
  "3,907 rows were minerals that can't drop where they were logged, almost all the same 21 minerals coming back every third pan in Rotwood Swamp (storage), including every Entombed and Treasured one. 8,862 rows the logger couldn't read. Both left out"],
 changed:["A Volcanic Eruption is now 1.5× heavier in Weight Range, Mechanics and Formulas (was 2×)","The 15.5 to 17 tail is explained as single minerals coming out 1.1× heavier","Every zone's measured count updated (7.9M minerals)"]},
{id:"all-2611",date:"26/11/26",title:"Every log at once: pan size, weight, zone factors and modifiers",zone:"29 zones",topics:["kg","mods","pan"],kind:"wt",
 setup:{Luck:"10 – 150,000",Capacity:"5,592 – 9,245",["Modifier Boost"]:"475%, 1,081%, 1,661%, 1,831% and 1,917%"},
 amount:{Minerals:5121071,Pans:47128},
 tested:["Fewest, most and average minerals per pan against capacity","Lightest and heaviest weight, and each zone's factor","Chance a mineral gets a modifier, and which one"],
 found:["Average minerals per pan is 0.678 × capacity^0.565 to within 0.2% on average over 37,772 normal pans; a refit changed it by under 1%, so it stays","Fewest per pan, ⌊½√capacity⌋, held on every full pan. 0.28% of pans were part-filled (1 to 40 minerals) and are left out","Most per pan, 2.5√capacity, held on 99.97% of pans; 13 went up to 2.73√capacity","Stretches with 15 to 25% more minerals per pan at the same capacity are the Tempered shovel enchant: zone by zone it matched +5% per point of the Pharaoh's Shovel's 11 Toughness above the deposit's, up to +25% (1.25 at toughness 6 and under, 1.20 at 7, 1.15 at 8, 1.05 at 10, 1.00 at 11)","Every zone's lightest mineral was exactly 0.75 × its factor across 5.1M minerals, in 29 zones. Haunted Creek showed up for the first time (580 minerals, lightest 0.82, so most likely 0.80)","The heaviest roll was 17.0 in every zone; 1.58% of minerals landed between 15.5 and 17. 18 rows past 17 were the same 6 Bloodstones logged three times with identical weights (minerals coming back from storage)","Which modifier you get matched the model within about 10% for every modifier at every boost","Whether a mineral gets one at all matched up to about 1,100% Modifier Boost, then the old formula said too few: at 1,917% it said 29% unmodified, steady hours showed 20%"],
 changed:["Modifier chance now follows the measured points: 73% unmodified at 475%, 53% at 1,081%, 20% at 1,917%","The 15.5 to 17 tail is now 1.6% of minerals (was 1.4%)","Haunted Creek ×0.80 added; every zone's measured count updated"]},
{id:"galaxis4-2611",date:"26/11/26",title:"Weights re-checked on 1.2M more minerals, and a second eruption",zone:"17 zones, mostly Sandstone Stream and Lifespring Oasis",topics:["kg"],kind:"wt",
 setup:{Luck:"10 – 100,000+",Capacity:"7,283",["Size Boost"]:"14.8×",["Modifier Boost"]:"1,917%"},
 amount:{Minerals:1201982},
 tested:["Each zone's factor, from its lightest mineral","The heaviest roll in every zone","Volcanic eruptions","Modifier chance at 1,917% Modifier Boost"],
 found:["Every zone's factor matched the site's, and Azuralite Oasis came out at 0.96 on 29,438 minerals (it was from a much smaller log before)","The heaviest roll was 17.0 again in every zone, and 1.73% of minerals went past 15.5","A second Volcanic Eruption in Windswept Beach on 24/11 at 05:30: every mineral exactly 1.5× heavier (lightest 0.75 × 1.5, heaviest 17 × 1.5), from one minute to the next. The first was also in Windswept Beach","At 1,917% Modifier Boost 19 to 21% of minerals had no modifier in steady hours, with dips to 5 to 11% when something else was on","No minerals out of place, and 879 rows the logger couldn't read (weight and modifier UNKNOWN), left out"],
 changed:["Azuralite Oasis counts as measured in Weight Range's zone table"]},
{id:"galaxis3-2411",date:"24/11/26",title:"Heaviest roll and zone factors, re-checked on 2.57M minerals",zone:"24 zones, mostly Mystic Floodplains",topics:["kg"],kind:"wt",
 setup:{Luck:"10,000 – 100,000+",Capacity:"6,692 – 8,638",["Size Boost"]:"14.3× and 14.8×",Zones:"24 zones; 961,000 of the minerals from Mystic Floodplains"},
 amount:{Minerals:2567732},
 tested:["Whether any weight goes past 15.5 × base × (1 + Size Boost) × zone factor","Each zone's factor, measured from its lightest mineral","Whether the spread of weights between the lightest and heaviest still fits"],
 found:["About 1.4% of minerals went past 15.5, and none past 17.05. Every zone tops out at 17.0 once its factor is taken out","It comes and goes: some 10-minute stretches have none past 15.5, others 1–4.6%. In those stretches the lightest is still 0.75, so it isn't everything getting heavier: it fits about a quarter of minerals coming out 1.1× heavier (15.5 × 1.1 = 17.05). It doesn't depend on the mutation","Zone factors land on steps: 0.80 Rubble Creek Sands, 0.88 Rubble Creek Deposits, 0.92 Fortune River, 0.96 Magma Furnace, Sunset Beach, Volcanic Sands and Windswept Beach, 1.00 for nine zones, 1.04 Astral Caverns, Deeproot Spring, Enchanted Ruins, Frozen Peak, Fungal Marsh and Rotwood Swamp, 1.12 Abyssal Depth and Infernal Heart, 1.20 Timelocked Sanctuary","Windswept Beach came out at 0.96, not the 1.12 the older log gave","The typical, average and top-10% weights still match the fitted spread within about 1% at every capacity"],
 changed:["Heaviest possible weight is now 17 × base × (1 + Size Boost) × zone factor (was 15.5), with a thin tail between 15.5 and 17: Weight Range, Size Boost Finder, 5-Star Crafter, Mechanics, Formulas and Test Data Check","Zone factors updated to the steps above","Weight Range has a table of every zone's factor"]},
{id:"galaxis2-2011",date:"20/11/26",title:"Luck caps and weights, re-check at Size Boost 12.6×",zone:"29 zones, mostly Sandstone Stream",topics:["lk","kg"],kind:"lk",
 setup:{Luck:"Caps 1 – 50,000, and up to 123,000 uncapped",Capacity:"8,160 – 9,245",["Modifier Boost"]:"4.75×",["Size Boost"]:"7.15× and 12.6×",Zones:"29 zones; 543,000 of the minerals from Sandstone Stream"},
 amount:{Minerals:652655},
 tested:["Whether the zone size factors hold on separate data and at a new Size Boost","Whether a luck cap still works like 56% of its number","Whether anything in the log makes weights 1.5× or 2× heavier (Solar Magnifier)"],
 found:["Zone factors repeat: Rubble Creek 0.80 (0.80 before), Rubble Creek Deposits 0.88 (0.89), Sandstone Stream 1.00 (1.00), Volcanic Sands 0.95–0.96 (0.96), and the same at Size Boost 12.6×, which the first log never had","Caps again behave like 56% of their number: exactly 0.56 for caps of 100 to 50,000 (72,000 capped minerals), 0.54–0.58 for caps of 1 and 10. Uncapped luck came out at 0.96× the luck shown","No stretch of the log has weights 1.5× or 2× above the normal range. The heaviest Gold anywhere is 16.96× its base × (1 + Size Boost) × zone, against a normal top of 15.5×","For about 7 minutes (09:41–09:49, mostly Rubble Creek) every weight was 1.10× heavier, smallest and biggest alike. What caused it isn't known: it isn't in the logged Size Boost"],
 changed:["Nothing: the zone factors and the 0.56 luck cap already in the toolkit both held up"]},
{id:"galaxis-2011",date:"20/11/26",title:"Capped and uncapped luck in 26 zones",zone:"26 zones",topics:["lk","cp","md","kg"],kind:"lk",
 setup:{Luck:"Caps 1 – 10,000, and 2,500 – 99,000 uncapped",Capacity:"7,817 – 10,493",["Modifier Boost"]:"4.75×",["Size Boost"]:"7.15× and 7.55×",Zones:"26 zones, from Rubble Creek to Timelocked Sanctuary"},
 amount:{Pans:6080,Minerals:650265},
 tested:["What a luck cap really gives, with more than half the log panned at a cap","Whether weights still fit 0.75 to 15.5 × base × (1 + Size Boost) in zones other than Meteor Falls","Minerals per pan and the modifier rate at a new capacity and Modifier Boost"],
 found:["Every cap from 100 to 10,000 behaved like 56% of its number (54–60% in each of 17 zones, 326,000 capped minerals). Uncapped luck came out at about 86% of the luck shown, so a cap is about 0.65× of uncapped luck, close to the old 63%","Each zone multiplies weights by its own factor: ×0.80 in Rubble Creek, ×0.93 in Fortune River, about ×1 in most zones, ×1.12 in Infernal Heart, Abyssal Depth and Windswept Beach, ×1.20 in Timelocked Sanctuary. The factor was the same at both Size Boosts and hours apart","With the zone factor, weights stay between 0.75 and 15.5 × base × (1 + Size Boost) (Gold reached 15.0–15.5 in every long session), and the spread matched the weight model: median 11.1–11.6× vs 11.2–11.5×, top 10% 14.5× vs 14.5×, 27.6% small vs 26%","Minerals per pan at 8,160 capacity (2,220 pans): 109.3 vs 109.7 predicted. Some zones ran lower (Abyssal Depth about 19%, Fortune River about 15%), on short runs","Modifier rate 26.5% vs 27% predicted at 4.75×, the lowest boost checked since the refit; the mix within about 10% for the common ones, Cosmic, Mutated and Perfect a little more often than predicted","A few base weights look slightly off: Selenite about 10% heavier than listed, Pyrelith and Golden Pearl about 8%, Pearl about 8% lighter"],
 changed:["Luck caps now count as 0.56 × the cap everywhere (was 0.63): Best Luck Cap, Dredge, Build Compare and the farm routes","New zone size factor: Weight Range, Size Boost Finder, Mechanics and the 5-Star Crafter's max weight let you pick a zone; Test Data Check uses each row's zone","Formulas: weight formulas now include the zone factor, plus a zone table and the luck cap formula"]},
{id:"logger4-1711",date:"17/11/26",title:"Check at two capacities",zone:"Meteor Falls",topics:["lk","my","cp","md","kg"],kind:"lk",
 setup:{Luck:"26,400 – 267,000",Capacity:"7,240 then 5,462",["Modifier Boost"]:"16.6×"},
 amount:{Pans:8180,Minerals:776278},
 tested:["Whether the 17/11 formulas hold on the biggest run so far","The lowest and highest number of minerals a pan can hold"],
 found:["Items per pan: 102.0 vs 102.5 predicted at 7,240 capacity, 85.5 vs 87.5 at 5,462","A pan never held fewer than ½ × √capacity minerals (37 at 5,462, 42 at 7,240) or more than about 2.5 × √capacity (183 and 212)","Gold, Pyrite, Nickel and Sapphire within 1%; mid-tier within about 8%; Mythics about 9% under the prediction (4,349 vs 4,793)","Modifier rate 69.2% vs 66.1% predicted, every modifier's share within 1.5 points","Weights: all between 0.75 and 15.5 × base × (1 + Size Boost), and the spread matched the capacity model within about a point","Lapis Lazuli again about 1.6× more common than predicted"],
 changed:["Test Data Check now handles files this big","Pan size range added to the findings"]},
{id:"weights-kg-1711",date:"17/11/26",title:"Mineral weights across every logged run",zone:"All logged runs",topics:["kg","cp"],kind:"wt",
 setup:{Capacity:"1,856 – 7,240 (20 different values)",["Size Boost"]:"14.2× – 22.4×"},
 amount:{["Minerals re-checked"]:1500000},
 tested:["Where weights fall between the lightest and heaviest possible","Whether capacity, luck, modifier, mineral or position in the pan changes the weight"],
 found:["Every weight falls between 0.75 and 15.5 × base weight × (1 + Size Boost); common minerals hit both ends almost exactly","About 26% of minerals always come out small (0.75 – 1.88 × base × (1 + Size Boost))","The rest are spread evenly at low capacity; the bigger the pan, the more of them lean to the heavy end (half beat 5.6× at 1,856 capacity, 10.9× at 7,240)","Luck, modifier, which mineral and where it lands in the pan made no difference"],
 changed:["New tools: Weight Range and Size Boost Finder","Test Data Check shows each mineral's lightest and heaviest against the limits"]},
{id:"logger3-1711",date:"17/11/26",title:"Check on new data",zone:"Meteor Falls",topics:["lk","my","cp","md"],kind:"lk",
 setup:{Luck:"40,500 – 264,000",Capacity:"7,240",["Modifier Boost"]:"16.6×"},
 amount:{Pans:1096,Minerals:112342},
 tested:["Whether the 17/11 formulas predict a run they weren't fitted on"],
 found:["Items per pan: 102.5 measured, formula 102.5","Gold, Pyrite, Nickel and Sapphire within 3%; mid-tier minerals within 3–10%","Normal modifier rate 69.6% vs 66.1% predicted, and the modifier mix within about 2 points for every modifier","649 Mythics vs 754 predicted: the very rare boost was a little too strong (without it the prediction would be 398)","Lapis Lazuli again about 1.8× more common than predicted, as in every run"],
 changed:["Very rare boost refit on all data: up to ×1.86 instead of ×1.9"]},
{id:"mods-1711",date:"17/11/26",title:"Modifiers",zone:"Meteor Falls",topics:["md","my"],kind:"md",
 setup:{Luck:"27,800 – 267,000",["Modifier Boost"]:"16.6× (1,660%)",Capacity:"5,462 and 7,240"},
 amount:{Pans:918,Minerals:84522},
 tested:["How often a mineral gets a normal modifier at a high Modifier Boost","Which modifier you get, at many different luck values","Whether the earlier Mythic result repeats"],
 found:["68.8% of minerals got a normal modifier. The toolkit said 39% and never went higher","The rate didn't move with luck: 68–69.5% from 45,000 to 207,000 luck","Modifier mix: Iridescent 28.9%, Cosmic 20.2%, Irradiated 12.7%, Shiny 11.4%, Pure 9.4%, Glowing 6.4%, Mutated 5.6%, Scorching 4.9%, Perfect 0.56%","Mythics again about 1.5× what the luck model said (441 found vs 288), while Gold, Pyrite, Nickel and Diamond were within 1%"],
 changed:["Modifier chance is now 1 − 0.937^boost (no 39% cap)","Which-modifier rolls are now 11.7 × boost^0.84 + 2 per 1,000 luck, with no luck cap","Very rare minerals get up to ×1.86 in the luck model"]},
{id:"night-1711",date:"17/11/26",title:"Luck changing every pan",zone:"Meteor Falls",topics:["lk","my","cp"],kind:"lk",
 setup:{Luck:"26,400 – 266,000",Capacity:"7,240 then 5,462",["Size Boost"]:"14.76×"},
 amount:{Pans:4975,Minerals:457578},
 tested:["The luck formula across a ten times wider luck range than before","Items per pan at two capacities","Whether the Mythic odds listed for Meteor Falls hold"],
 found:["Items per pan: 101.8 at 7,240 capacity and 86.4 at 5,462. The capacity formula predicts 102.5 and 87.5; √capacity would say 85 and 74","Common and uncommon minerals were within 3% of the old luck model; Cobalt, Iridium, Diamond and Radium within ~15%","All four Mythics (Vortessence, Star Garnet, Aetherium, Sunstone) came out at almost exactly 2× the prediction, Starpiercer was spot on"],
 changed:["Confirmed the new items-per-pan formula","Part of the data for the 17/11 luck model refit"]},
{id:"frd-1711",date:"17/11/26",title:"Fortune River Delta at luck 1 and at 78,000",zone:"Fortune River Delta",topics:["lk","cp","wt"],kind:"lk",
 setup:{Luck:"1 and 78,279",Capacity:"5,462",["Size Boost"]:"14.76×",["Modifier Boost"]:"16.6×"},
 amount:{Pans:269,Minerals:23057},
 tested:["Items per pan at a big capacity","Luck at one fixed high value against luck 1"],
 found:["85.7 items per pan, the same at both luck values, so luck doesn't change how many you get","√capacity (73.9) was clearly too low; 0.678 × capacity^0.565 (87.5) fits","The luck-1 pans matched the zone's base drop chances almost exactly (Gold 55.7% vs 54.7%)","Iridium and Moonstone have the same listed odds but came out 326 vs 130, and Aurorite 27× too often: the luck model gave the whole share of tied minerals to just one of them"],
 changed:["Items per pan switched from √capacity to 0.678 × capacity^0.565 in every tool","Minerals with the same odds now split their chance evenly"]},
{id:"weights-1711",date:"17/11/26",title:"The game's drop weights, zone by zone",zone:"All 35 zones",topics:["wt"],kind:"wt",
 setup:{Source:"The game's own weight table",Zones:"35"},
 amount:{Zones:35},
 tested:["Whether the toolkit's drop chances match the game's weights"],
 found:["Every zone matches to within 1%, except The Void","Three zones only differ in name: Abyssal Depths, The Magma Furnace and Rubble Creek","The Void in the game table is a fixed table with Voidstone at 1 in 91.4 million; the toolkit treats it as a rotating pool (1 in 138 million)","So the extra Mythics at Meteor Falls aren't a data mistake"],
 changed:["Nothing needed changing, apart from The Void, which is still open"]},
{id:"sand-1311",date:"13/11/26",title:"Sandstone Stream and Meteor Falls, totem on and off",zone:"Sandstone Stream, Meteor Falls",topics:["lk","md"],kind:"lk",
 setup:{Luck:"24,000 – 61,300",Capacity:"2,833 – 3,494",["Modifier Boost"]:"9.19× – 9.26×",["Luck Totem"]:"On and off"},
 amount:{Minerals:80903},
 tested:["Drops with and without the Luck Totem","Modifier rate at about 9× boost"],
 found:["About 41% of minerals got a normal modifier at 9.2× boost","Meteor Falls Mythics were about 2× the luck model here too"],
 changed:["Part of the data for the 17/11 luck and modifier refits"]},
{id:"fixed-1211",date:"12/11/26",title:"Fixed-luck tests in six zones",zone:"Frozen Peak, Fortune River Delta, Fortune River, Volcanic Springs, Infernal Heart, Sandstone Stream",topics:["lk","md"],kind:"lk",
 setup:{Luck:"Set to 5,000, 10,000, 23,000, 24,000, 35,000, 39,000 and 50,000",Capacity:"2,779",["Size Boost"]:"22.2×",["Modifier Boost"]:"9.26×"},
 amount:{Minerals:258655},
 tested:["The luck formula at low luck values","How the modifier rate changes between zones at the same boost"],
 found:["The low-luck end of the luck model (5,000–10,000) mostly comes from these","Modifier rate at 9.26× boost ranged from 41% (Sandstone Stream) to 57% (Infernal Heart): something other than boost raises it in some sessions"],
 changed:["Part of the data for the 11/11 and 17/11 luck fits and the 17/11 modifier fit"]},
{id:"low-1211",date:"12/11/26",title:"Low Modifier Boost test",zone:"Fortune River",topics:["md","lk"],kind:"md",
 setup:{Luck:"7,900 and 11,400",["Modifier Boost"]:"1.13×",Capacity:"1,242",["Size Boost"]:"3.32×"},
 amount:{Minerals:69693},
 tested:["How often modifiers show up with almost no Modifier Boost"],
 found:["Only about 10% of minerals got a normal modifier at 1.13× boost","With so little boost the mix leans heavily to Irradiated, Scorching and Glowing; Cosmic and up are rare"],
 changed:["The low end of the modifier formula (1 − 0.937^boost) rests on this"]},
{id:"big-1111",date:"11/11/26",title:"Haunted Creek and Meteor Falls",zone:"Haunted Creek, Meteor Falls, plus Timelocked Sanctuary, Frozen Peak, Astral Caverns, Fungal Marsh, Sandstone Stream, Starfall River, The Void",topics:["lk","my","md"],kind:"lk",
 setup:{Luck:"19,500 – 74,000",Capacity:"1,856 – 4,101",["Size Boost"]:"14.2× – 22.4×",["Modifier Boost"]:"5.97× – 9.19×"},
 amount:{Minerals:2353754},
 tested:["The first proper fit of the luck formula","Modifier rate and mix at 6× to 9× boost"],
 found:["Haunted Creek (1.24 million minerals) and Meteor Falls (950,000) are the backbone of the luck model","Mythics in most zones came out 1.5–2.7× more often than the luck model said; zones whose Mythics are only 1 in 3–12 million matched","Normal modifier rate: about 36% at 6× boost and 37–50% at 8.4–9.2×"],
 changed:["The 11/11 luck model came from this","Re-used in the 17/11 luck, rare-mineral and modifier refits"]},
];
// headline findings, each pointing at the sessions it comes from
const FIND=[
 ["Luck works like extra rolls of the zone's drop table, keeping the rarest. Best fit: 29% roll once, 3% about luck ÷ 23 times, 19% about 0.41 × luck, 49% about 1.74 × luck.",["big-1111","fixed-1211","sand-1311","night-1711","frd-1711"]],
 ["Very rare minerals (base odds about 1 in 18 million to 1 in 1.5 billion, most Mythics) drop about 1.86× more often than the rolls alone say. Seen in 8 of 11 zones.",["big-1111","sand-1311","night-1711","mods-1711","logger3-1711","logger4-1711"]],
 ["A full pan holds about 0.678 × capacity^0.565 minerals on average (≈20 at 400, 87 at 5,462, 102 at 7,240), never fewer than ½ × √capacity and not more than about 2.5 × √capacity. Luck doesn't change it.",["galaxis-2011","frd-1711","night-1711","logger3-1711","logger4-1711"]],
 ["Chance of a normal modifier is 1 − 0.937^boost (×): about 10% at 1.1×, 36% at 6×, 45% at 9×, 69% at 16.6×. Luck doesn't change it.",["low-1211","big-1111","fixed-1211","mods-1711","galaxis-2011"]],
 ["Which modifier you get works like luck: about 11.7 × boost^0.84 + 2 per 1,000 luck rolls, keeping the rarest.",["big-1111","fixed-1211","mods-1711"]],
 ["A mineral weighs base × (1 + Size Boost) × zone factor × k, with k from 0.75 to 15.5. About 26% roll small; the rest lean heavier the bigger your pan. Zones multiply weights by ×0.80 (Rubble Creek) up to ×1.20 (Timelocked Sanctuary).",["weights-kg-1711","logger4-1711","galaxis-2011"]],
 ["A luck cap pans like 56% of its number, the same for every cap from 100 to 50,000 and in every zone tested.",["galaxis-2011","galaxis2-2011"]],
 ["The toolkit's drop chances match the game's own weights in 34 of 35 zones.",["weights-1711"]],
];
const OPEN=[
 "Why Lapis Lazuli drops about 1.8× more often than its listed odds say.",
 "Why the very rare band gets about ×1.86. It's measured, not explained.",
 "Why the modifier rate at the same boost is about 40% in some sessions and 52–57% in others (zone, weather or a totem?).",
 "The Void: fixed table (Voidstone 1 in 91.4M) or rotating pool (1 in 138M)?",
 "Modifier Boost above 16.6× and luck above 267,000 are untested.",
 "How weights spread below 1,856 or above 11,500 capacity, and whether a Volcanic Eruption stacks with the Solar Magnifier.",
 "What makes a single mineral come out 1.1× heavier for a while, and why the game says an eruption doubles sizes when every logged one was 1.5×.",
 "Why zones change weights (×0.80 to ×1.20), and the factor for zones not logged yet (Meteor Falls is assumed ×1).",
 "How much the Solar Magnifier really changes weights: the toolkit and the official wiki say ×1.5, no log has shown it yet.",
];
const ORDER=S.map(x=>x.id);
// only show setup values that matter for what the session tested
const NEED={Luck:["lk","my","md"],Capacity:["cp"],["Modifier Boost"]:["md"],["Luck Totem"]:["lk"],["Size Boost"]:[],Zones:[]};
const setupOf=x=>Object.entries(x.setup).filter(([k])=>!NEED[k]||NEED[k].some(t=>x.topics.includes(t)));
let st={t:"",q:""};try{Object.assign(st,JSON.parse(localStorage.getItem("tl-s")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("tl-s",JSON.stringify(st))}catch(e){}};
const n0=v=>Number(v).toLocaleString("en-US");
function tiles(){
  const mins=S.reduce((a,x)=>a+(x.amount.Minerals||0),0),pans=S.reduce((a,x)=>a+(x.amount.Pans||0),0);
  const zones=new Set();S.forEach(x=>x.zone.split(/,\s*|\s+plus\s+/).forEach(z=>{if(!/^All/.test(z))zones.add(z.trim())}));
  $("tiles").innerHTML=[["Minerals logged",n0(mins),"across "+S.filter(x=>x.amount.Minerals).length+" sessions"],
    ["Zones tested",zones.size,"plus the game's table for all 35"],["Luck tested","1 – 267k","most data 5k – 267k"],
    ["Modifier Boost tested","1.1× – 16.6×",""],["Logged pans",n0(pans),"in sessions that counted pans"]]
    .map(([l,v,s])=>`<div class="tile"><span class="lab">${l}</span><b>${v}</b>${s?`<small>${s}</small>`:""}</div>`).join("");
  const nm=id=>{const x=S.find(s=>s.id===id);return x?`<a href="#${id}" data-go="${id}">${esc(x.title)}</a>`:""};
  if(false)$("find").innerHTML=FIND.map(([t,ids])=>`<li>${esc(t)} <span class="src">from: ${ids.map(nm).join(", ")}</span></li>`).join("");
  if(false)$("open").innerHTML=OPEN.map(t=>`<li>${esc(t)}</li>`).join("");
}
function hi(t,q){t=esc(t);if(!q)return t;const i=t.toLowerCase().indexOf(q);return i<0?t:t.slice(0,i)+"<mark>"+t.slice(i,i+q.length)+"</mark>"+t.slice(i+q.length)}
function render(){
  const q=st.q.trim().toLowerCase();
  $("topics").querySelectorAll("[data-t]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.t===st.t)));
  const rows=S.filter(x=>(!st.t||x.topics.includes(st.t))&&(!q||JSON.stringify([x.title,x.zone,x.setup,x.tested]).toLowerCase().includes(q)));
  $("count").textContent=`${rows.length} of ${S.length} sessions`;
  $("list").innerHTML=rows.length?rows.map(x=>`<article class="ses ${x.kind}" id="${x.id}">
    <div class="sh"><h3>${hi(x.title,q)}</h3></div>
    <div class="tags"><span class="tag">${hi(x.zone,q)}</span></div>
    <div class="setup">${x.amount.Minerals?`<div><span>Minerals</span><b>${n0(x.amount.Minerals)}</b></div>`:""}${setupOf(x).filter(([k])=>k!=="Zones").map(([k,v])=>`<div><span>${esc(k)}</span><b>${hi(v,q)}</b></div>`).join("")}</div>
    <h4>What was tested</h4><ul>${x.tested.map(t=>`<li>${hi(t,q)}</li>`).join("")}</ul>
  </article>`).join(""):`<p class="empty">No sessions match.</p>`;
}
$("topics").insertAdjacentHTML("beforeend",`<button type="button" class="chip sm" data-t="">All</button>`+Object.entries(TOPICS).map(([k,v])=>`<button type="button" class="chip sm" data-t="${k}">${v}</button>`).join(""));
$("topics").onclick=e=>{const b=e.target.closest("[data-t]");if(!b)return;st.t=b.dataset.t;save();render()};
$("q").value=st.q;$("q").addEventListener("input",e=>{st.q=e.target.value;save();render()});
document.addEventListener("click",e=>{const a=e.target.closest("[data-go]");if(!a)return;e.preventDefault();st.t="";st.q="";$("q").value="";save();render();const el=$(a.dataset.go);if(el){el.scrollIntoView({behavior:"smooth",block:"start"});el.animate([{outline:"2px solid var(--accent)"},{outline:"2px solid transparent"}],{duration:1600})}});
tiles();render();
