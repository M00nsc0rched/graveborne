# GRAVEBORNE

A pixel-art, top-down **dark-fantasy dungeon crawler** in the spirit of **Buriedbornes**
(turn-based skill combat), **Rogue** (procedural depths, permadeath, stepwise turns),
and **Barony** (explorable top-down floors).

Its signature system: your **HONOR** warps what the dungeon shows you. The dishonored
see threats where the pure see people — so the *same* encounter plays out completely
differently across runs, and a **Codex** tracks which variants you've uncovered.

## How to play (no install)

- **Double-click `index.html`** — it runs in any modern browser, fully offline.
  (Everything is plain `<script>` tags and code-drawn pixel art; there are no build
  steps and no external files.)
- Optional local server (nicer save persistence in some browsers): from the parent
  folder run `powershell -ExecutionPolicy Bypass -File serve.ps1`, then open
  `http://localhost:8777/`.

## Controls

| Action | Keys |
|---|---|
| Move | WASD / Arrow keys (each step = one dungeon turn) |
| Wait | Space |
| Inventory & skills | I |
| Codex | C |
| Combat skills | Click the buttons, or press 1–4 |

**On phones and tablets** (iOS Safari included) the screen is laid out for one thumb and
never scrolls:

- **☰ Menu** sits on the dungeon view (top-right) and holds everything — *Inventory &
  Skills* (flagged when a Level Up is affordable), *Followers*, the **Chronicle** (the
  full event log, read on demand), *Codex*, *Abandon Run*.
- With the log tucked into the Menu, the **dungeon view takes the whole screen** — 641px
  tall on a 430×932 phone, more than double what it was.
- The **D-pad lives at the bottom**, where your thumb rests — tap to step, hold to keep
  stepping, centre **●** waits a turn.
- In combat the live log strip returns above your skills, so you still see each blow as
  it lands.
- In combat the D-pad gives way to your skills, the stage shrinks to make room, and a
  dedicated **Flee** button takes the Menu's corner.

Keyboard still works throughout: **M**/**Esc** menu, **I** inventory, **F** followers,
**L** chronicle, **C** codex, **1–4** combat skills.

### Install as a Home Screen app

Graveborne is a full **PWA**: it ships a web-app manifest, its own pixel-art icon,
and a service worker that caches everything — so once loaded over HTTPS (or
localhost), **it runs fully offline**.

On iPhone/iPad: open the game in Safari → tap **Share** → **Add to Home Screen**.
It launches full-screen (no browser bars), with the Ashen Knight as its icon.
On Android/Chrome the browser offers "Install app" the same way. Note: the offline
cache needs a secure origin (HTTPS or localhost); over plain LAN IP the app still
installs and runs, it just re-fetches from the server each launch.

Walk into **enemies** to fight, **✦ chests** to loot, **! events** to face an
honor-shaped encounter, and **stairs** to descend. Reach and defeat the **Gloamlord**
on depth 5 to win.

## The honor mechanic

- Each class starts at a different honor (Oathwarden +40 … Hollow Witch −20).
- Choices in encounters raise or lower honor. **Honor ≥ 0** perceives encounters
  clearly; **honor < 0** perceives them *warped* (e.g. a woman at a well becomes a
  hostile silhouette you feel compelled to attack).
- Because presentation is tied to honor, **you must play different moral roads to see
  every variant** — the Codex (title screen / pause) shows locked entries with teasing
  hints for the ones you haven't found yet. There are **86 codex entries** to uncover,
  across twenty-one encounters plus feats of butchery, hunger, and gambling.

## The body is a resource: hunger, limbs, and the coin

Three systems that make the deep feel like it's eating you back:

### FOOD (hunger)

A third HUD bar drains with **every step** (~285 steps from fed to starved). Stages:
**Hungry** (≤45) is a warning; **STARVING** (≤20, bar pulses red) cuts your attack and
magic damage by 30% and stops SP regeneration in combat; at **0 FOOD** your body eats
itself — 2 HP per step. Eat to refill: **Grave-Bread** (+35) from chests, shops, and
the Sanctum's *Deep Larder* rank; **Strange Meat** (+60) carved from slain beasts
(~30% drop) or found in *The Larder* encounter — filling, warm, and with a ~30% chance
it *disagrees with being eaten* (poison). The Hollow Merchant also serves **a hot
meal** (FOOD to full). Eating mid-combat spends your turn, as all honest meals do.

### SP (focus) — and never being stuck

**Draught of Focus** restores **5 SP**, carried in the pack and drunk like any other
draught (it spends your combat turn). Found in chests, sold by the Hollow Merchant.

Not every kit has a free skill — the **Hollow Witch** starts with none, and anyone can
swap Strike away at the Reckoning. At 0 SP that used to leave you staring at a wall of
greyed-out buttons with no way to end the turn, so SP never regenerated. Now:

- Whenever no skill is affordable, a **Catch your breath** button appears — yield the
  turn deliberately and your focus ticks back up.
- If you are *genuinely* cornered — no affordable skill, nothing usable in the pack, no
  relic power left, and a boss or guardian you cannot flee — the turn **passes to the
  enemy automatically** rather than dead-ending.
- The auto-pass deliberately does **not** fire while you still hold a draught, a relic
  power, or an escape: handing your turn away at 5 HP with a potion in your pack would
  be a worse bug than the one it fixes.

### Aimed blows (limb combat)

Every foe that isn't pure spirit has an **anatomy**: ARMS (or MAW), LEGS, HEAD — each
with its own HP pool, shown under the enemy's health bar and as a target row above
your skills. Physical attacks strike the chosen part; damage hits the limb and **40%
bleeds through** to the body. Severed limbs stay severed:

- **ARMS / MAW cut** — its ATK drops ~45% and its **heaviest attack move is gone for
  good** (a disarmed foe falls back on a Desperate Flail).
- **LEGS cut** — its SPD hits 0, it loses ~30% of its turns dragging itself, and
  **fleeing always succeeds** — you may simply walk away from the fight.
- **HEAD** — blows go wide 35% of the time, but on a common foe a finished head is a
  **decapitation: the fight ends instantly**. Bosses, guardians and elites are made of
  older law: they instead take a burst (~22% max HP) and **lose their magic**.

Body blows remain the fastest pure kill — aiming is a trade: safety now versus speed.

### The Nameless god's coin, mid-battle

If you **pocket the coin** at its altar (instead of flipping it there), it rides with
you for the rest of the run: once per battle you may **flip it in combat**. Heads —
something reaches out of the air and takes ~35% of the enemy's max HP. Tails — the
taking turns on you (~30% of your current HP, floored at 1, and −2 Honor). The god is
amused either way. Both results are Codex entries.

## The Reckoning: spend Souls on the run itself

Souls no longer only pile up between runs for the Sanctum — you spend them **mid-descent**,
from the **Inventory & Skills** screen, to grow the character you're playing *right now*.
When you can afford a level, the Inventory button lights up **◈ Level Up ready**.

- **Raise a stat** — pick **HP (+8)**, **SP / ATK / DEF / MAG / SPD (+2)**. Each level costs
  **more Souls than the last** (12 → 18 → 27 → 41 → 61 → 91 …, ×1.5 per level), so every
  point is a deliberate buy. Your level shows on the HUD (`· Lv N`).
- **Bind a new skill** — buy one of eight learnable skills (Cleave, Execute, Siphon Cut,
  War Cry, Iron Skin, Frost Lance, Plague Touch, Sanctuary) with Souls, then **swap it in for
  one of your current four**. Each skill you buy makes the next pricier (30 → 55 → 80 …).

The bite: these are the **same Souls the Sanctum keeps**, and unspent Souls survive death
while spent ones are gone for good. So every Reckoning is a wager — grow now to go deeper and
earn more, or bank for permanent upgrades. Level and learned skills last **only for the
current descent** (they reset on a new run); the Souls you spent do not come back. Formulas
live in `levelUpCost` / `skillLearnCost` and `LEVEL_STATS` in `js/game.js`; learnable skills
are the `learnable:true` entries in `SKILLS` (`js/data.js`).

## Skills: 80 of them, three tiers, and the price of borrowing

Each class owns **20 skills** (80 in total), plus **Strike**, which belongs to everyone.
Every skill has **three tiers** with hand-written effects at each step — Guard goes
DEF×2 → ×5 → ×10, Execute gains a 10% then 20% instant-kill threshold, Zeal goes from 5
swings to 14.

- **Nothing is permanently out of reach.** Any class can end up wielding any skill.
- **But borrowed steel is blunt.** A skill that isn't your class's answers at **40%
  strength (60% weaker)** — damage, healing, shields, poison, buffs, lifesteal, all of it
  — and it is **frozen at tier 1 forever**. Only what your own class was built for grows.
- **Sharpening costs Souls** (25 → 48 → …) and is done from Inventory & Skills.
- **Every descent offers a different random handful** of skills to unlock with Souls, so
  no two runs give you the same options. A class's *signature* skills (Guard, Aelanwyr,
  Convince) never appear for anyone else.

Skills draw on the Diablo lineage: Whirlwind, Seismic Slam and Ignore Pain for the Knight;
Fan of Knives, Caltrops and Death Blossom for the Gravethief; Frozen Orb, Chain Lightning,
Bone Spear, Amplify Damage and Iron Maiden for the Witch; Blessed Hammer, Fist of the
Heavens, Conviction and Salvation for the Oathwarden.

## Class passives

One signature rule each, always on:

| Class | Passive | What it does |
|---|---|---|
| **Hollow Witch** | Wellspring | **+5 SP every step** out of combat — but she burns food **twice as fast** |
| **Ashen Knight** | Oathbound | Against **undead**, every fight opens with a shield *and* his fury already up |
| **Oathwarden** | Last Vigil | **Once per descent** a killing blow leaves him on 1 HP — then **2 turns** to finish the foe. Kill it and he keeps that life; fail and it is over |
| **Gravethief** | Cutthroat's Luck | Each fight a coin picks one: **every strike bleeds** (ATK×2+5 a turn), or **critical hits bite 10% deeper** |

## Gear: rarity, passives and sets

Nothing is bought blind. **Tapping any item in the shop opens an inspection sheet**: its
full stats beside whatever you already wear in that slot, with a per-stat change column,
its passive spelled out in plain words, and — for set pieces — how many of the set you
have. Only then does the *Take it* button appear.

- **Uniques** carry an always-on passive: Widowmaker (+18% crit), Glutton's Girdle (hunger
  half speed), Reaper's Tithe (+50% Souls), Pilgrim's Mercy (mends you as you walk), Dread
  Aegis (open every fight shielded), Brand of Ruin (+20% damage).
- **Legendaries** keep their once-per-battle called power *and* a passive.
- **Sets** are the gamble. **The Pauper's Vigil** and **Carrion Communion** are three pieces
  each, and every piece is deliberately the feeblest thing in its slot — a stick, some rags,
  an empty bowl. Wear all three and the set beats anything else in the game: the Pauper's
  Vigil finishes at **+13 ATK / +11 DEF / +34 HP / +6 MAG / +3 SP**, blows that drink 20%,
  and half-speed hunger — measured against 25/23/72 for the best legendary combination.

## Setting a descent down

**Menu → Set Down the Descent** saves everything: your character, the depth, the biome, the
entire floor with its entities and every tile of fog you have lifted. The title screen then
offers **Continue**. Dying, winning or abandoning clears the save — a descent that ended
cannot be taken up again.

## Reading the floor

Encounters no longer show a blank `!`. Each of the 28 has **its own glyph and colour** —
`☽` the woman at the well, `⚖` the Inquisition's envoy, `¤` the Nameless god's coin, `✂` the
seamstress, `⚒` the forge widow, `♛` the Hollow Prince — so you can tell what waits in a
room before you walk into it.

## Followers: a promise, not a perk

The **Oathless** encounter offers you someone who wants to walk behind you. Taking them
is the heaviest decision in the game:

- They **fight beside you**, acting every round after your own action.
- They have their **own HP, SP and FOOD**, and their **own pack** — separate from yours.
  You hand provisions across; they can only use what is actually in *their* pack.
- They get hungry as you walk. Starving, they hit soft and bleed 2 HP a step.
- Enemies **can turn on them** (~30% of attacks) instead of you.
- **If they die, your honor is slammed to −100 — the absolute floor — permanently.** That
  is instant MARKED status with the Inquisition on your heels for the rest of the run.

So the game asks the question plainly: do you want the extra blade badly enough to be
responsible for a life? Once you say yes, backing out is not an option — only keeping
them alive is. Follower definitions live in `FOLLOWERS` (`js/data.js`); the upkeep,
combat turn and death penalty are `updateFollowerUpkeep` / `followerAct` /
`followerDies` in `js/game.js`.

## Prowling, pursuit and fear

- **You can be shaken off.** A foe chasing you spends a pursuit budget scaled to its
  tier — roughly 8 turns for the weakest, 14 for tier 3, ×1.6 for elites and ×3 for the
  Inquisition's hunters. Spend it and it *loses your trail* and goes back to wandering.
  Walk right into its face, though, and it finds you again.
- **Fleeing actually works.** Escaping a fight leaves that enemy **rooted for 2 turns**,
  so you get real distance instead of being re-engaged on the next step.
- **Killing the stair's guardian cows the floor.** Every lesser thing still alive there
  fights at **×0.7 HP and damage** and hunts with half its usual sight. Hunters and
  bosses are unmoved — they don't scare.

## Scenery that never blocks you

Rooms are dressed with biome-appropriate props — **bookshelves, statues, tables, chairs,
urns, sarcophagi and braziers** in the Catacombs, mushrooms and stumps in the Fungal
Deep, barrels in the Drowned Halls, bone piles in the Whitemarrow, and so on. All of it
is **purely decorative and walked straight through**: no torch, no shelf, no statue can
ever wall off a route, so you never have to re-plan a path around the furniture.

## Alignment: the low-vs-high tradeoff

Your honor total pushes you into one of three alignments (shown as a HUD badge), each a
deliberate risk/reward fork so both extremes feel worth a playthrough:

- **MARKED** (honor ≤ −40): the **Gilded Inquisition** hunts you — relentless special
  enemies (Inquisitor, Witch-Hunter, Chained Penitent) spawn on every floor and stalk
  you across it. In exchange, **loot runs rich**: ×1.6 gold, +25% drop chance, +1 item
  tier, ×1.5 Souls, and slain hunters pay premium (guaranteed tier-up gear + potion).
  A Marked-only encounter, *The Inquisition's Envoy*, lets you buy a reprieve or fight
  for the spoils. **High risk, high reward — and fast meta-progress.**
- **HALLOWED** (honor ≥ 40): **no hunters**, a small HP blessing on every floor, and
  **more/kinder encounters** (including the Hallowed-only *Lightbearer*, who heals and
  wards you). But **loot is lean**: ×0.55 gold, fewer/rougher drops, ×0.8 Souls.
  **Safe and sustaining — but you stay poor.**
- **MORTAL** (in between): baseline enemies, baseline loot.

So: descend **low** to get hunted but grow strong and rich fast, or **high** to walk
safe among friends with little to show for it. Thresholds and multipliers are consts at
the top of `js/game.js` (`MARK_AT`, `HALLOW_AT`, `lootMods()`).

### The Bounty meter (the hunt ramps the longer you linger)

While Marked, a red **BOUNTY** meter appears in the HUD and **climbs every turn** (faster
the deeper your dishonor). It escalates through four tiers, each intensifying the hunt:

| Tier | Bounty | The hunt |
|---|---|---|
| **Wanted** | 0–24 | 1 hunter per floor, no reinforcements |
| **Hunted** | 25–49 | up to 2 per floor + reinforcements every ~14 turns |
| **Pursued** | 50–74 | 2 per floor + reinforcements every ~10 turns, hunters +30% tougher |
| **Condemned** | 75–100 | 3 per floor + reinforcements every ~7 turns, hunters +45% tougher (meter pulses) |

Reinforcements literally **spawn mid-floor and close in** — so dawdling on a Marked floor
gets deadlier by the step, pushing you to keep moving or cash out. You cool the bounty by
**killing hunters** (−8 each), **paying the Inquisition's Envoy** (−40, and it clears the
floor), or **leaving Marked** (honor back above −40, heat decays ~2/turn). Scorning the
Envoy stokes it (+20 and another hunter). Tuning: `heatTier`, `HEAT_FLOOR_HUNTERS`,
`HEAT_REINFORCE_CD`, and `updateHeat()` in `js/game.js`.

## Biomes: every depth can change beneath you

Each new depth rolls its terrain — ~65% chance to shift into a different biome, ~35% to
continue the last one. Depth 1 is always the Catacombs; the Gloamlord keeps his throne
in the Whitemarrow. Each biome recolors the floor, retunes the light, tilts the enemy
mix — and **treats each class differently** (announced in the log on entry, applied for
as long as you're on the floor):

| Biome | Character effects (Knight / Thief / Witch / Warden) | Foes |
|---|---|---|
| **The Catacombs** | — neutral ground — | baseline |
| **The Fungal Deep** | −2 DEF / +2 SPD / **+3 MAG** / −2 MAG | beasts |
| **The Drowned Halls** | −2 SPD +1 DEF / −1 SPD / +2 SP / +2 MAG | spirits |
| **The Ember Chasm** | **+2 ATK** / +1 ATK −1 SPD / +2 MAG / −2 DEF | cultists |
| **The Whitemarrow** | +1 DEF / +1 SPD / −2 SP / **+3 MAG** | undead |
| **The Umbral Weald** | −1 DEF / **+2 SPD, sees in the dark** / +2 MAG / +1 sight | spirits, wolves |

The Umbral Weald darkens everyone's sight by 2 tiles — except the Gravethief, who was
made for it. Maps are also **much larger** now (up to ~54×34 with up to 16 rooms and
2–3 chests), so a floor is a real place to get lost in. Biome definitions (palette,
class mods, enemy weights, flavor) live in `BIOMES` in `js/data.js`.

### Hazard tiles

Every biome scars its floors with **glowing hazard tiles** (4–9 clusters per floor,
more the deeper you go). They're visible and walkable — stepping on one is always a
choice, and each biome punishes it differently:

| Biome | Hazard | Stepping on it |
|---|---|---|
| Catacombs | **Collapsing Rubble** | physical damage, blunted by DEF |
| Fungal Deep | **Spore Clouds** | poisons you — ticks every step, and **follows you into combat** (*Witch immune*) |
| Drowned Halls | **Frigid Pools** | damage + drains 2 SP |
| Ember Chasm | **Fire Vents** | heaviest raw damage (7 + depth) |
| Whitemarrow | **Grasping Bones** | physical damage, blunted by DEF (*Warden immune*) |
| Umbral Weald | **Root Snares** | holds you — every enemy gets a **free step** (*Gravethief immune*) |

Enemies — hunters included — **refuse to path across hazards**, so a spore field or
lava seam can be used as a wall between you and the hunt. Immunities follow each
class's biome affinity, and the floor-entry log warns you what scars the ground.
Tuning lives in each biome's `hazard` block (`js/data.js`) and `applyHazard()`
(`js/game.js`).

## Biome-native encounters

Each biome has its own NPC encounters that are **guaranteed** to appear on their home
floor (deeper floors can host both at once):

| Biome | Encounters | The heart of them |
|---|---|---|
| Fungal Deep | **The Sporewife** · **The Overgrown Soldier** | Remedies and flesh-grafts; a dead soldier still keeping his post |
| Drowned Halls | **The Ferryman** · **The Drowned Bride** | Coin for the crossing; a ring lost where the light doesn't reach |
| Ember Chasm | **The Forge Widow** · **The Cindermonk** | Honest tempering (+ATK); a vigil in live coals |
| Whitemarrow | **The Bone Choir** · **The Unfinished Saint** | A ward-hymn; a saint the bone-wrights never finished |
| Umbral Weald | **The Blind Lamplighter** · **The Wolfmother** | His lantern (**+2 sight this floor**); a den you should not have raised your blade at |

Attacking the Wolfmother's den drags you into a fight with **the Rootwolf** itself.

## Elites: named terrors

From depth 2 down, each floor has a growing chance (~32%→~60%) to be claimed by its
biome's **named elite** — a mini-boss that prowls with long sight and wears a gold
crown on the map (★ gold nameplate in combat):

*Gravemaw the Charnel Rat* (Catacombs) · *The Sporetyrant* (Fungal) · *Undertow, Warden
of the Flood* (Drowned) · *The Cinder Prophet* (Ember) · *The Marrow Cantor*
(Whitemarrow) · *The Rootwolf* (Umbral).

Elites hit hard (~2–3× a normal foe's HP) but pay a **guaranteed premium**: a tier-3
item (or their signature drop), a potion, high gold, and triple-tier Souls.

And if your **Bounty reaches Condemned**, the next reinforcement is not a hunter —
**Saint Cassiel, the Golden Blade** takes the hunt himself, once per floor. Fell him
for the **Aureate Edge** (ATK+9/MAG+3 signature blade), a heap of blood-gold and Souls,
and −25 heat: the hunt is cowed. Elite definitions live beside `ENEMIES`/`BIOME_ELITES`
in `js/data.js`.

## Legendary Guardians: none descend unchallenged

On every floor (except the Gloamlord's own), a **Legendary Guardian** stands beside the
stairs — and the stairs will not take you while it lives. Each biome has its legend:

| Biome | Guardian |
|---|---|
| Catacombs | **Morr, the Tollkeeper** — weighs your soul like coin |
| Fungal Deep | **Mycel, the Patient Garden** — you've been walking on its tongue |
| Drowned Halls | **Abbess Brine** — every stair is a font, every font demands baptism |
| Ember Chasm | **Pyraxes, the Kilnborn** — fired before your kingdoms cooled |
| Whitemarrow | **The White Curator** — your bones arrive unindexed |
| Umbral Weald | **The First Shadow** — every shadow you feared was a finger of its hand |

Walking into a guardian (or trying the stairs early) opens a **confrontation**: an
intro speech, plus lines that react to **your class**, your **alignment** (Marked or
Hallowed), and **notable gear** — Morr recognizes the Soul Edge as his own, Mycel
addresses the Oathblade directly, and Pyraxes knows exactly whose gold the Aureate
Edge is. You can step back and prepare, but there is no fleeing once steel is drawn.

Guardians fight at boss scale (◆ gold nameplate) and pay legendary spoils: a
guaranteed tier-3 item, a potion, heavy gold, and 10×-tier Souls — then die with a
last line, and the stair stands unbarred. Definitions and all dialogue live in
`ENEMIES`/`BIOME_GUARDIANS` in `js/data.js`.

## Currencies & the between-floor shop

Two currencies, one volatile and one stable:

- **Gold ✦** — per-run currency from combat, chests, and events. Lost on death.
- **Souls ◈** — the **stable currency**: saved to disk and **kept across every death**.
  Earned from kills (+2), each floor descended (+6), the boss (+15), and every new
  Codex discovery (+4). When you die, a third of your leftover gold **converts into
  Souls**, so a doomed run still leaves you richer for the next one.

Every time you take the stairs, **The Hollow Merchant** appears before the next floor:

- **Services / Wares (Gold):** heal to full, restore SP, buy potions, a *Rite of
  Absolution* (Honor +15 — buy back your name), and 2 rolled pieces of gear.
- **Reliquary (Souls):** premium, persistent-currency stock — an *Ember of Vigor*
  (+8 Max HP) and a rolled rare item. Because Souls carry over, you can save across
  several runs to afford the big buys.

## The Sanctum (permanent meta-progression)

From the **title / death / victory** screens, enter **The Sanctum** to spend Souls on
**permanent upgrades that apply to *every* future run** — the roguelite loop: die →
bank Souls → grow stronger → descend deeper. Each has ranks with rising cost:

| Upgrade | Effect |
|---|---|
| Ancestral Vigor | +6 Max HP / rank |
| Whetstone Rites | +1 ATK / rank |
| Warding Rites | +1 DEF / rank |
| Arcane Attunement | +1 MAG / rank |
| Reserve of Focus | +1 Max SP / rank |
| Deep Pockets | +15 starting Gold / rank |
| Provisioner's Pact | Start with a Draught of Mending / rank |
| The Deep Larder | Start with a Grave-Bread / rank |
| Oathkeeper's Seal | Start with +8 Honor / rank |
| Soul Siphon | +20% Souls earned from deeds / rank |
| Merchant's Favor | −10% shop Gold prices / rank |

Active boons are summarized on the character-select screen. Ranks persist across
deaths and sessions. (Upgrade definitions live in `SANCTUM` in `js/data.js`; the
whole set is tunable there.)

## Project layout

```
index.html      – shell + HUD/log/action containers
styles.css      – dark-fantasy UI theme
js/util.js      – helpers (RNG, DOM)
js/save.js      – localStorage: codex + run meta + Souls + Sanctum
js/sprites.js   – code-drawn pixel-art sprites + palette
js/data.js      – classes, skills, enemies, items, EVENTS, codex, biomes,
                  elites, guardians  ← tune balance here
js/dungeon.js   – procedural room/corridor generation + fog + hazards
js/game.js      – engine: states, rendering, movement, turn-based combat, events
```

## Ideas to extend

- More encounters/variants (add to `EVENTS` in `data.js`; wire a codex entry).
- Deeper builds: skill unlocks, more status effects, elite rooms, shops.
- A true ally system (the freed wolf currently grants a stat instead of fighting).
- Balance pass — the Witch's `firebolt` is intentionally spiky; adjust `power`/`mag`
  scaling in `data.js`/`game.js` to taste.
