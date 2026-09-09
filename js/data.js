// ---------- Game data: skills, classes, enemies, items, events, codex ----------

// ---------- Skills ----------
// Every skill belongs to a class (`cls`) and has three tiers (`lv`). A class may
// learn ANY skill — nothing is permanently locked away — but wielding one that
// isn't yours costs you: it lands at 40% strength (60% weaker) and can never be
// upgraded past tier 1. `open:false` marks a class signature no one else may take.
// `cls:'common'` belongs to everybody: full strength, upgradeable by all.
const SKILLS = {
  // ---- common ----
  strike: { name:'Strike', type:'attack', cost:0, cls:'common', open:true, desc:'A reliable melee blow.',
    lv:[{power:12},{power:20},{power:40}] },

  // ================= KNIGHT — ironclad vanguard =================
  guard: { name:'Guard', type:'defend', cost:1, cls:'knight', open:false, desc:'Raise a shield (DEF× + honor).',
    lv:[{shield:'def2'},{shield:'def5'},{shield:'def10'}] },
  shieldbash: { name:'Shield Bash', type:'attack', cost:1, cls:'knight', open:false, desc:'A stunning bash.',
    lv:[{power:8,effect:{stun:0.05}},{power:10,effect:{stun:0.10}},{power:15,effect:{stun:0.10}}] },
  rally: { name:'Rally', type:'buff', cost:2, cls:'knight', open:false, desc:'Steel yourself: regen + ATK up.',
    lv:[{effect:{regen:{amt:5,turns:3},atkbuff:{amt:5,turns:3}}},
        {effect:{regen:{amt:10,turns:3},atkbuff:{amt:10,turns:3}}},
        {effect:{regen:{amt:10,turns:5},atkbuff:{amt:10,turns:5}}}] },
  ironskin: { name:'Iron Skin', type:'defend', cost:2, cls:'knight', open:true, desc:'A heavy guard.',
    lv:[{shield:'def2'},{shield:'def5'},{shield:'def6'}] },
  execute: { name:'Execute', type:'attack', cost:3, cls:'knight', open:true, desc:'A brutal finisher; often critical.',
    lv:[{power:22,effect:{crit:0.40}},{power:22,effect:{crit:0.40},execute:0.10},{power:22,effect:{crit:0.40},execute:0.20}] },
  warcry: { name:'War Cry', type:'buff', cost:2, cls:'knight', open:true, desc:'A roar that swells your strength.',
    lv:[{effect:{atkbuff:{amt:6,turns:2}}},{effect:{atkbuff:{amt:10,turns:2}}},{effect:{atkbuff:{amt:10,turns:5}}}] },
  zeal: { name:'Zeal', type:'attack', cost:5, cls:'knight', open:true, desc:'A flurry of fast blows in one breath.',
    lv:[{power:5,hits:5,acc:0.80},{power:5,hits:10,acc:0.70},{power:5,hits:14,acc:0.50}] },
  aelanwyr: { name:'Aelanwyr', type:'attack', cost:10, cls:'knight', open:false, desc:'I shall make weapons from their bones.',
    lv:[{power:30},{power:35},{power:40}] },
  whirlwind: { name:'Whirlwind', type:'attack', cost:4, cls:'knight', open:true, desc:'Spin through everything within reach.',
    lv:[{power:20},{power:26},{power:34}] },
  bash: { name:'Bash', type:'attack', cost:1, cls:'knight', open:true, desc:'A plain, heavy, honest hit.',
    lv:[{power:14},{power:18},{power:24}] },
  leapslam: { name:'Leap Slam', type:'attack', cost:3, cls:'knight', open:true, desc:'Come down on them with all your weight.',
    lv:[{power:16,effect:{stun:0.25}},{power:20,effect:{stun:0.30}},{power:26,effect:{stun:0.35}}] },
  taunt: { name:'Taunt', type:'magic', cost:1, cls:'knight', open:true, desc:'Make it angry and clumsy.',
    lv:[{power:2,effect:{weaken:{amt:4,turns:3}}},{power:2,effect:{weaken:{amt:7,turns:3}}},{power:2,effect:{weaken:{amt:10,turns:4}}}] },
  ignorepain: { name:'Ignore Pain', type:'buff', cost:2, cls:'knight', open:true, desc:'Refuse the wound for a while.',
    lv:[{effect:{shield:'def2',regen:{amt:6,turns:3}}},{effect:{shield:'def3',regen:{amt:9,turns:3}}},{effect:{shield:'def4',regen:{amt:12,turns:4}}}] },
  furiouscharge: { name:'Furious Charge', type:'attack', cost:3, cls:'knight', open:true, desc:'Close the gap shoulder-first.',
    lv:[{power:18,effect:{crit:0.20}},{power:24,effect:{crit:0.30}},{power:30,effect:{crit:0.40}}] },
  seismicslam: { name:'Seismic Slam', type:'attack', cost:4, cls:'knight', open:true, desc:'Split the floor under it.',
    lv:[{power:24},{power:30},{power:38}] },
  revenge: { name:'Revenge', type:'attack', cost:2, cls:'knight', open:true, desc:'Answer the last blow with interest.',
    lv:[{power:14,effect:{lifesteal:0.40}},{power:18,effect:{lifesteal:0.50}},{power:24,effect:{lifesteal:0.60}}] },
  stalwart: { name:'Stalwart Ward', type:'defend', cost:3, cls:'knight', open:true, desc:'Plant your feet and hold.',
    lv:[{shield:'def3'},{shield:'def6'},{shield:'def8'}] },
  undyingrage: { name:'Undying Rage', type:'buff', cost:4, cls:'knight', open:true, desc:'Anger that will not let you fall.',
    lv:[{effect:{atkbuff:{amt:10,turns:3},regen:{amt:8,turns:3}}},
        {effect:{atkbuff:{amt:14,turns:3},regen:{amt:12,turns:3}}},
        {effect:{atkbuff:{amt:14,turns:5},regen:{amt:12,turns:5}}}] },
  bloodthirst: { name:'Bloodthirst', type:'attack', cost:3, cls:'knight', open:true, desc:'Take back what it took from you.',
    lv:[{power:20,effect:{lifesteal:0.30}},{power:26,effect:{lifesteal:0.40}},{power:32,effect:{lifesteal:0.50}}] },
  shieldcharge: { name:'Shield Charge', type:'attack', cost:2, cls:'knight', open:true, desc:'Run it down behind the boss of your shield.',
    lv:[{power:12,effect:{stun:0.20}},{power:16,effect:{stun:0.30}},{power:22,effect:{stun:0.35}}] },

  // ================= ROGUE — shadow & steel =================
  // Eliza's own. cls 'none' keeps it out of every pool, shop and steal — no one
  // else in the dark knows how to ask for something and be given it.
  charm: { name:'Charm', type:'steal', cost:5, cls:'none', open:false, hidden:true,
    desc:"She smiles at it, and for three turns it would rather please her than kill you. Takes half of what it hits with — a twentieth, from the great ones.",
    lv:[{ stealPct:0.50, bossPct:0.05, turns:3 }] },

  backstab: { name:'Backstab', type:'attack', cost:5, cls:'rogue', open:true, desc:'Vicious strike, often critical.',
    lv:[{power:20,effect:{crit:0.25}},{power:20,effect:{crit:0.50}},{power:30,effect:{crit:0.50}}] },
  poisonblade: { name:'Poison Blade', type:'attack', cost:2, cls:'rogue', open:true, desc:'Venom-coated cut.',
    lv:[{power:10,effect:{poison:{dmg:4,turns:3}}},{power:15,effect:{poison:{dmg:7,turns:3}}},{power:20,effect:{poison:{dmg:7,turns:3}}}] },
  bleed: { name:'Rend', type:'attack', cost:2, cls:'rogue', open:true, desc:'Open a bleeding wound.',
    lv:[{power:9,effect:{poison:{dmg:5,turns:3}}},{power:15,effect:{poison:{dmg:5,turns:5}}},{power:25,effect:{poison:{dmg:5,turns:5}}}] },
  cleave: { name:'Cleave', type:'attack', cost:2, cls:'rogue', open:true, desc:'A wide swing that opens them up.',
    lv:[{power:17,effect:{poison:{dmg:5,turns:3}}},{power:17,effect:{poison:{dmg:10,turns:3}}},{power:25,effect:{poison:{dmg:10,turns:3}}}] },
  plaguetouch: { name:'Plague Touch', type:'magic', cost:2, cls:'rogue', open:true, desc:'A rot that festers deep.',
    lv:[{power:4,effect:{poison:{dmg:6,turns:4}}},{power:4,effect:{poison:{dmg:9,turns:4}}},{power:4,effect:{poison:{dmg:15,turns:4}}}] },
  siphoncut: { name:'Siphon Cut', type:'attack', cost:2, cls:'rogue', open:true, desc:'Steal vitality with steel.',
    lv:[{power:12,effect:{lifesteal:0.50}},{power:15,effect:{lifesteal:0.50}},{power:20,effect:{lifesteal:0.50}}] },
  fanofknives: { name:'Fan of Knives', type:'attack', cost:3, cls:'rogue', open:true, desc:'Throw everything that has an edge.',
    lv:[{power:7,hits:3,acc:0.85},{power:7,hits:4,acc:0.85},{power:8,hits:5,acc:0.85}] },
  caltrops: { name:'Caltrops', type:'magic', cost:2, cls:'rogue', open:true, desc:'Salt the ground it has to stand on.',
    lv:[{power:3,effect:{weaken:{amt:4,turns:3},poison:{dmg:3,turns:3}}},
        {power:3,effect:{weaken:{amt:6,turns:3},poison:{dmg:5,turns:3}}},
        {power:3,effect:{weaken:{amt:8,turns:4},poison:{dmg:7,turns:4}}}] },
  shadowstrike: { name:'Shadow Strike', type:'attack', cost:3, cls:'rogue', open:true, desc:'It never sees where you were.',
    lv:[{power:22,effect:{crit:0.35}},{power:26,effect:{crit:0.40}},{power:32,effect:{crit:0.45}}] },
  impale: { name:'Impale', type:'attack', cost:3, cls:'rogue', open:true, desc:'Put the point through and leave it there.',
    lv:[{power:26,effect:{crit:0.20}},{power:32,effect:{crit:0.25}},{power:40,effect:{crit:0.30}}] },
  smokescreen: { name:'Smoke Screen', type:'defend', cost:2, cls:'rogue', open:true, desc:'Be somewhere else when it swings.',
    lv:[{shield:'def2'},{shield:'def4'},{shield:'def6'}] },
  venomstrike: { name:'Venom Strike', type:'attack', cost:2, cls:'rogue', open:true, desc:'A shallow cut carrying something deep.',
    lv:[{power:12,effect:{poison:{dmg:8,turns:3}}},{power:14,effect:{poison:{dmg:11,turns:3}}},{power:16,effect:{poison:{dmg:14,turns:4}}}] },
  grimharvest: { name:'Grim Harvest', type:'attack', cost:3, cls:'rogue', open:true, desc:'Take the warmth out of it.',
    lv:[{power:16,effect:{lifesteal:0.60}},{power:20,effect:{lifesteal:0.70}},{power:26,effect:{lifesteal:0.80}}] },
  puncture: { name:'Puncture', type:'attack', cost:1, cls:'rogue', open:true, desc:'Cheap, quick, and it keeps bleeding.',
    lv:[{power:10,effect:{poison:{dmg:3,turns:4}}},{power:13,effect:{poison:{dmg:5,turns:4}}},{power:17,effect:{poison:{dmg:6,turns:5}}}] },
  bladefury: { name:'Blade Fury', type:'attack', cost:4, cls:'rogue', open:true, desc:'Steel everywhere at once.',
    lv:[{power:8,hits:4,acc:0.75},{power:9,hits:5,acc:0.75},{power:10,hits:6,acc:0.75}] },
  nightstalker: { name:'Nightstalker', type:'buff', cost:2, cls:'rogue', open:true, desc:'The dark agrees with you.',
    lv:[{effect:{atkbuff:{amt:7,turns:3}}},{effect:{atkbuff:{amt:11,turns:3}}},{effect:{atkbuff:{amt:11,turns:5}}}] },
  exploitweakness: { name:'Exploit Weakness', type:'magic', cost:2, cls:'rogue', open:true, desc:'You have already found the seam.',
    lv:[{power:4,effect:{weaken:{amt:8,turns:3}}},{power:4,effect:{weaken:{amt:12,turns:3}}},{power:4,effect:{weaken:{amt:16,turns:4}}}] },
  deathblossom: { name:'Death Blossom', type:'attack', cost:5, cls:'rogue', open:true, desc:'Everything you have, all at once.',
    lv:[{power:8,hits:6,acc:0.60},{power:9,hits:7,acc:0.60},{power:10,hits:8,acc:0.65}] },
  shadowdance: { name:'Shadow Dance', type:'buff', cost:3, cls:'rogue', open:true, desc:'Move the way the lamplight does.',
    lv:[{effect:{atkbuff:{amt:6,turns:3},regen:{amt:5,turns:3}}},
        {effect:{atkbuff:{amt:9,turns:3},regen:{amt:8,turns:3}}},
        {effect:{atkbuff:{amt:9,turns:5},regen:{amt:8,turns:5}}}] },
  lacerate: { name:'Lacerate', type:'attack', cost:3, cls:'rogue', open:true, desc:'Open it wide enough that it stays open.',
    lv:[{power:14,effect:{poison:{dmg:9,turns:3}}},{power:18,effect:{poison:{dmg:12,turns:3}}},{power:22,effect:{poison:{dmg:12,turns:5}}}] },

  // ================= MAGE — dark-arts adept =================
  firebolt: { name:'Hollow Fire', type:'magic', cost:2, cls:'mage', open:true, desc:'Hurl a bolt of cold flame.',
    lv:[{power:16},{power:20,effect:{poison:{dmg:10,turns:3}}},{power:22,effect:{poison:{dmg:15,turns:3}}}] },
  hex: { name:'Hex', type:'magic', cost:2, cls:'mage', open:true, desc:'Curse the foe; its ATK falls.',
    lv:[{power:4,effect:{weaken:{amt:5,turns:3}}},{power:4,effect:{weaken:{amt:15,turns:3}}},{power:4,effect:{weaken:{amt:20,turns:3}}}] },
  drain: { name:'Life Drain', type:'magic', cost:20, cls:'mage', open:true, desc:"Siphon the foe's vitality.",
    lv:[{power:14,effect:{lifesteal:1.0}},{power:17,effect:{lifesteal:1.0}},{power:30,effect:{lifesteal:1.0}}] },
  meditate: { name:'Meditate', type:'buff', cost:0, cls:'mage', open:true, desc:'Sacrifice health for focus.',
    lv:[{selfDmg:10,spGain:10},{selfDmg:20,spGain:20},{selfDmg:30,spGain:30}] },
  frostlance: { name:'Frost Lance', type:'magic', cost:3, cls:'mage', open:true, desc:'Piercing cold that may freeze.',
    lv:[{power:17,effect:{stun:0.30}},{power:20,effect:{stun:0.30}},{power:20,effect:{stun:0.40}}] },
  frozenorb: { name:'Frozen Orb', type:'magic', cost:4, cls:'mage', open:true, desc:'A slow, turning wheel of ice.',
    lv:[{power:24,effect:{stun:0.25}},{power:30,effect:{stun:0.30}},{power:36,effect:{stun:0.35}}] },
  chainlightning: { name:'Chain Lightning', type:'magic', cost:3, cls:'mage', open:true, desc:'It leaps and leaps again.',
    lv:[{power:8,hits:3,acc:0.90},{power:9,hits:4,acc:0.90},{power:10,hits:5,acc:0.90}] },
  blizzard: { name:'Blizzard', type:'magic', cost:4, cls:'mage', open:true, desc:'Bring the winter down on it.',
    lv:[{power:22,effect:{poison:{dmg:6,turns:3}}},{power:27,effect:{poison:{dmg:8,turns:3}}},{power:32,effect:{poison:{dmg:10,turns:4}}}] },
  inferno: { name:'Inferno', type:'magic', cost:3, cls:'mage', open:true, desc:'Hold the flame on it and do not stop.',
    lv:[{power:18,effect:{poison:{dmg:8,turns:3}}},{power:22,effect:{poison:{dmg:11,turns:3}}},{power:26,effect:{poison:{dmg:14,turns:4}}}] },
  bonespear: { name:'Bone Spear', type:'magic', cost:3, cls:'mage', open:true, desc:'Something of theirs, sharpened.',
    lv:[{power:24},{power:30},{power:38}] },
  corpseexplosion: { name:'Corpse Explosion', type:'magic', cost:4, cls:'mage', open:true, desc:'Use what is already dead.',
    lv:[{power:28},{power:35},{power:44}] },
  teeth: { name:'Teeth', type:'magic', cost:1, cls:'mage', open:true, desc:'A cheap mouthful of splinters.',
    lv:[{power:5,hits:3,acc:0.80},{power:6,hits:4,acc:0.80},{power:7,hits:5,acc:0.80}] },
  amplifydamage: { name:'Amplify Damage', type:'magic', cost:2, cls:'mage', open:true, desc:'Everything hurts it more now.',
    lv:[{power:3,effect:{weaken:{amt:10,turns:3}}},{power:3,effect:{weaken:{amt:14,turns:3}}},{power:3,effect:{weaken:{amt:18,turns:4}}}] },
  ironmaiden: { name:'Iron Maiden', type:'magic', cost:3, cls:'mage', open:true, desc:'Let its own strength open it.',
    lv:[{power:6,effect:{weaken:{amt:6,turns:4},poison:{dmg:5,turns:4}}},
        {power:6,effect:{weaken:{amt:9,turns:4},poison:{dmg:8,turns:4}}},
        {power:6,effect:{weaken:{amt:12,turns:5},poison:{dmg:11,turns:5}}}] },
  energyshield: { name:'Energy Shield', type:'defend', cost:2, cls:'mage', open:true, desc:'Hold the harm off with thought alone.',
    lv:[{shield:'def2'},{shield:'def4'},{shield:'def6'}] },
  staticfield: { name:'Static Field', type:'magic', cost:2, cls:'mage', open:true, desc:'Bleed the charge out of it.',
    lv:[{power:14,effect:{weaken:{amt:4,turns:2}}},{power:18,effect:{weaken:{amt:6,turns:2}}},{power:22,effect:{weaken:{amt:8,turns:3}}}] },
  glacialspike: { name:'Glacial Spike', type:'magic', cost:3, cls:'mage', open:true, desc:'Freeze it where it stands.',
    lv:[{power:20,effect:{stun:0.35}},{power:24,effect:{stun:0.40}},{power:28,effect:{stun:0.45}}] },
  firewall: { name:'Fire Wall', type:'magic', cost:3, cls:'mage', open:true, desc:'It has to come through this.',
    lv:[{power:12,effect:{poison:{dmg:12,turns:3}}},{power:14,effect:{poison:{dmg:16,turns:3}}},{power:16,effect:{poison:{dmg:20,turns:4}}}] },
  lowerresist: { name:'Lower Resist', type:'magic', cost:2, cls:'mage', open:true, desc:'Take its guard apart from the inside.',
    lv:[{power:4,effect:{weaken:{amt:8,turns:3}}},{power:4,effect:{weaken:{amt:11,turns:3}}},{power:4,effect:{weaken:{amt:14,turns:4}}}] },
  convince: { name:'Convince', type:'magic', cost:30, cls:'mage', open:false, desc:'Ask, in the old way, and sometimes it says yes.',
    lv:[{power:2,charm:0.05},{power:2,charm:0.10},{power:2,charm:0.12}] },

  // ================= NECROMANCER — the cursed one (Diablo-II inspired) =================
  // cls 'necromancer', not open: no other class learns these, and the Necromancer
  // learns none but its own. theme tags let the style-passive lock a run to one set.
  // ---- Offensive: bone, poison, and curses that make the dead do the work ----
  n_bonespear:   { name:'Bone Spear',      type:'magic', cost:3, cls:'necromancer', open:false, theme:'offense', desc:'A shard of the dead, thrown clean through.',
    lv:[{power:22},{power:28},{power:36}] },
  n_teeth:       { name:'Teeth',           type:'magic', cost:1, cls:'necromancer', open:false, theme:'offense', desc:'A cheap spray of splintered bone.',
    lv:[{power:6,hits:3,acc:0.85},{power:7,hits:4,acc:0.85},{power:8,hits:5,acc:0.85}] },
  n_poisonnova:  { name:'Poison Nova',     type:'magic', cost:4, cls:'necromancer', open:false, theme:'offense', desc:'A ring of rot that spares nothing near.',
    lv:[{power:14,effect:{poison:{dmg:10,turns:3}}},{power:18,effect:{poison:{dmg:14,turns:3}}},{power:22,effect:{poison:{dmg:18,turns:4}}}] },
  n_corpseburst: { name:'Corpse Explosion',type:'magic', cost:4, cls:'necromancer', open:false, theme:'offense', desc:'Use what is already dead against what is not.',
    lv:[{power:26},{power:34},{power:44}] },
  n_bonespirit:  { name:'Bone Spirit',     type:'magic', cost:3, cls:'necromancer', open:false, theme:'offense', desc:'A hunting ghost of bone that finds the gap.',
    lv:[{power:20,effect:{crit:0.25}},{power:26,effect:{crit:0.30}},{power:32,effect:{crit:0.40}}] },
  n_amplify:     { name:'Amplify Damage',  type:'magic', cost:2, cls:'necromancer', open:false, theme:'offense', desc:'Everything bites it deeper now.',
    lv:[{power:3,effect:{weaken:{amt:10,turns:3}}},{power:3,effect:{weaken:{amt:14,turns:3}}},{power:3,effect:{weaken:{amt:18,turns:4}}}] },
  n_lowerresist: { name:'Lower Resist',    type:'magic', cost:2, cls:'necromancer', open:false, theme:'offense', desc:'Take its guard apart from the inside.',
    lv:[{power:4,effect:{weaken:{amt:8,turns:3}}},{power:4,effect:{weaken:{amt:11,turns:3}}},{power:4,effect:{weaken:{amt:14,turns:4}}}] },
  n_bloodstar:   { name:'Blood Star',      type:'magic', cost:3, cls:'necromancer', open:false, theme:'offense', desc:'Cast your own blood as a burning star, and drink it back.',
    lv:[{power:16,effect:{lifesteal:1.0}},{power:20,effect:{lifesteal:1.0}},{power:26,effect:{lifesteal:1.0}}] },
  // ---- Defensive: bone armor, the golem's guard, and curses that unstring the foe ----
  n_bonearmor:   { name:'Bone Armor',      type:'defend', cost:2, cls:'necromancer', open:false, theme:'defense', desc:'A cage of the dead, worn close.',
    lv:[{shield:'def3'},{shield:'def5'},{shield:'def7'}] },
  n_bonewall:    { name:'Bone Wall',       type:'defend', cost:3, cls:'necromancer', open:false, theme:'defense', desc:'Raise the dead between you and the blow.',
    lv:[{shield:'def5'},{shield:'def8'},{shield:'def10'}] },
  n_boneprison:  { name:'Bone Prison',     type:'magic', cost:3, cls:'necromancer', open:false, theme:'defense', desc:'Close it in a fist of bone — it cannot move.',
    lv:[{power:10,effect:{stun:0.45}},{power:12,effect:{stun:0.55}},{power:14,effect:{stun:0.65}}] },
  n_claygolem:   { name:'Clay Golem',      type:'buff', cls:'necromancer', open:false, theme:'defense', cost:3, desc:'A servant of mud stands its watch — shield and slow mending.',
    lv:[{effect:{shield:'def3',regen:{amt:6,turns:4}}},{effect:{shield:'def5',regen:{amt:9,turns:4}}},{effect:{shield:'def6',regen:{amt:12,turns:5}}}] },
  n_dimvision:   { name:'Dim Vision',      type:'magic', cost:2, cls:'necromancer', open:false, theme:'defense', desc:'Blind it to you; its arm forgets the way.',
    lv:[{power:3,effect:{weaken:{amt:7,turns:3}}},{power:3,effect:{weaken:{amt:10,turns:3}}},{power:3,effect:{weaken:{amt:13,turns:4}}}] },
  n_weaken:      { name:'Weaken',          type:'magic', cost:1, cls:'necromancer', open:false, theme:'defense', desc:'Its strength runs out through your curse.',
    lv:[{power:2,effect:{weaken:{amt:6,turns:3}}},{power:2,effect:{weaken:{amt:9,turns:3}}},{power:2,effect:{weaken:{amt:12,turns:4}}}] },
  n_lifetap:     { name:'Life Tap',        type:'buff', cost:2, cls:'necromancer', open:false, theme:'defense', desc:'Open a vein between you — mend, and steel yourself.',
    lv:[{effect:{regen:{amt:6,turns:3},shield:'def2'}},{effect:{regen:{amt:9,turns:3},shield:'def3'}},{effect:{regen:{amt:12,turns:4},shield:'def4'}}] },
  n_decrepify:   { name:'Decrepify',       type:'magic', cost:3, cls:'necromancer', open:false, theme:'defense', desc:'Age it a hundred years in a breath — slow, and weak.',
    lv:[{power:4,effect:{weaken:{amt:9,turns:3},stun:0.25}},{power:4,effect:{weaken:{amt:13,turns:3},stun:0.30}},{power:5,effect:{weaken:{amt:17,turns:4},stun:0.35}}] },

  // ================= WARDEN — holy protector =================
  smite: { name:'Smite', type:'magic', cost:3, cls:'warden', open:true, holy:true, desc:'Holy fire; scourges the undead.',
    lv:[{power:18,holy:true},{power:25,holy:true},{power:30,holy:true}] },
  prayer: { name:'Warding Prayer', type:'buff', cost:2, cls:'warden', open:true, desc:'Regen and a warding shield.',
    lv:[{effect:{regen:{amt:5,turns:3},shield:'def'}},
        {effect:{regen:{amt:10,turns:3},shield:'def'}},
        {effect:{regen:{amt:15,turns:3},shield:'def'}}] },
  heal: { name:'Mend', type:'heal', cost:3, cls:'warden', open:true, desc:'Mend wounds (MAG× + base).',
    lv:[{healBase:8,magMult:2},{healBase:10,magMult:2},{healBase:10,magMult:3}] },
  sanctuary: { name:'Sanctuary', type:'buff', cost:3, cls:'warden', open:true, desc:'Strong regen and a warding shield.',
    lv:[{effect:{regen:{amt:8,turns:3},shield:'def'}},
        {effect:{regen:{amt:15,turns:3},shield:'def'}},
        {effect:{regen:{amt:8,turns:3},shield:'def5'}}] },
  rallyalt: { name:"Zealot's Rally", type:'buff', cost:2, cls:'warden', open:true, desc:'Steel yourself and the vow with you.',
    lv:[{effect:{regen:{amt:5,turns:3},atkbuff:{amt:5,turns:3}}},
        {effect:{regen:{amt:7,turns:3},atkbuff:{amt:7,turns:3}}},
        {effect:{regen:{amt:10,turns:3},atkbuff:{amt:7,turns:3}}}] },
  holybolt: { name:'Holy Bolt', type:'magic', cost:2, cls:'warden', open:true, desc:'A clean light, cheaply spent.',
    lv:[{power:14,holy:true},{power:18,holy:true},{power:23,holy:true}] },
  blessedhammer: { name:'Blessed Hammer', type:'magic', cost:3, cls:'warden', open:true, desc:'It turns in the air and comes back.',
    lv:[{power:20,holy:true},{power:26,holy:true},{power:33,holy:true}] },
  fistoftheheavens: { name:'Fist of the Heavens', type:'magic', cost:4, cls:'warden', open:true, desc:'Something above finally looks down.',
    lv:[{power:28,holy:true},{power:35,holy:true},{power:44,holy:true}] },
  prayeraura: { name:'Prayer', type:'buff', cost:2, cls:'warden', open:true, desc:'A slow mending you carry with you.',
    lv:[{effect:{regen:{amt:8,turns:4}}},{effect:{regen:{amt:12,turns:4}}},{effect:{regen:{amt:16,turns:5}}}] },
  cleansing: { name:'Cleansing', type:'buff', cost:1, cls:'warden', open:true, desc:'Draw the rot back out.',
    lv:[{effect:{regen:{amt:4,turns:2}},cleanse:true},{effect:{regen:{amt:7,turns:3}},cleanse:true},{effect:{regen:{amt:10,turns:3}},cleanse:true}] },
  vigor: { name:'Vigor', type:'buff', cost:2, cls:'warden', open:true, desc:'Strength enough for the next hour.',
    lv:[{effect:{atkbuff:{amt:5,turns:3},regen:{amt:5,turns:3}}},
        {effect:{atkbuff:{amt:8,turns:3},regen:{amt:8,turns:3}}},
        {effect:{atkbuff:{amt:8,turns:5},regen:{amt:8,turns:5}}}] },
  redemption: { name:'Redemption', type:'heal', cost:3, cls:'warden', open:true, desc:'Take back what the dark spent.',
    lv:[{healBase:12,magMult:2},{healBase:16,magMult:2},{healBase:20,magMult:3}] },
  conviction: { name:'Conviction', type:'magic', cost:2, cls:'warden', open:true, desc:'Its certainty falters first.',
    lv:[{power:5,holy:true,effect:{weaken:{amt:8,turns:3}}},
        {power:5,holy:true,effect:{weaken:{amt:12,turns:3}}},
        {power:5,holy:true,effect:{weaken:{amt:16,turns:4}}}] },
  holyshield: { name:'Holy Shield', type:'defend', cost:2, cls:'warden', open:true, desc:'A guard with a vow behind it.',
    lv:[{shield:'def3'},{shield:'def5'},{shield:'def7'}] },
  consecration: { name:'Consecration', type:'magic', cost:3, cls:'warden', open:true, desc:'Make the ground itself hostile to it.',
    lv:[{power:16,holy:true,effect:{poison:{dmg:5,turns:3}}},
        {power:20,holy:true,effect:{poison:{dmg:8,turns:3}}},
        {power:24,holy:true,effect:{poison:{dmg:11,turns:4}}}] },
  salvation: { name:'Salvation', type:'buff', cost:3, cls:'warden', open:true, desc:'Cover yourself and mend as you go.',
    lv:[{effect:{shield:'def4',regen:{amt:8,turns:3}}},
        {effect:{shield:'def6',regen:{amt:12,turns:3}}},
        {effect:{shield:'def8',regen:{amt:16,turns:4}}}] },
  zealotsoath: { name:"Zealot's Oath", type:'buff', cost:3, cls:'warden', open:true, desc:'Swear it again and mean it harder.',
    lv:[{effect:{atkbuff:{amt:8,turns:3},regen:{amt:6,turns:3}}},
        {effect:{atkbuff:{amt:12,turns:3},regen:{amt:9,turns:3}}},
        {effect:{atkbuff:{amt:12,turns:5},regen:{amt:9,turns:5}}}] },
  divinegrace: { name:'Divine Grace', type:'heal', cost:2, cls:'warden', open:true, desc:'A small, unearned kindness.',
    lv:[{healBase:10,magMult:1},{healBase:14,magMult:2},{healBase:18,magMult:2}] },
  lastrites: { name:'Last Rites', type:'magic', cost:4, cls:'warden', open:true, desc:'Say the words that end things.',
    lv:[{power:30,holy:true},{power:38,holy:true},{power:48,holy:true}] },
  auraoflight: { name:'Aura of Light', type:'buff', cost:2, cls:'warden', open:true, desc:'Stand in your own lantern-light.',
    lv:[{effect:{shield:'def2',regen:{amt:5,turns:4}}},
        {effect:{shield:'def3',regen:{amt:8,turns:4}}},
        {effect:{shield:'def4',regen:{amt:11,turns:5}}}] },
};

// Support is meant to be dear. Healing, shields and buffs cost far more SP than
// a plain swing, so you spend your defence rather than spam it — a paid skill of
// these kinds jumps by 7 SP (capped at 12). Free ones (Meditate) stay free, and
// attacks — even lifesteal ones — are untouched. Enemy/follower moves live in
// their own tables, so this only touches the player's skill list.
for (const _id in SKILLS){
  const _sk = SKILLS[_id];
  if (_sk.cost > 0 && (_sk.type === 'defend' || _sk.type === 'buff' || _sk.type === 'heal'))
    _sk.cost = Math.min(12, _sk.cost + 7);
}

// ---------- Class passives ----------
// One signature rule per class, always on, no button to press.
const PASSIVES = {
  mage: [
    { name:'Accretion',  desc:'Every fight you win teaches her something: +5 to one random stat and +5 power to one random skill, for the rest of the descent.' },
  ],
  knight: [ { name:'Oathbound', desc:'Against the undead you open every fight already braced: a shield and your fury up.' } ],
  warden: [ { name:'Last Vigil', desc:'Once per descent a killing blow leaves you at 1 HP — then you have 2 turns to finish the foe, or it finishes you.' } ],
  rogue:  [ { name:"Cutthroat's Luck", desc:'Each fight the coin picks one: every strike bleeds, or your critical hits land far harder.' } ],
  alchemist: [ { name:'Iron Palate', desc:'A lifetime of tasting the worst leaves nothing that can turn your stomach. You are immune to poison, rot and bleed.' } ],
  necromancer: [ { name:'The Cursed Path', desc:'At the start of each descent you choose a path — Offensive or Defensive — and for that whole run you may only learn spells of that one discipline.' } ],
};

const CLASSES = {
  knight: {
    id:'knight', name:'Ashen Knight', role:'Ironclad vanguard', sprite:'hero_knight',
    base:{ hp:60, sp:6, atk:14, def:12, mag:4, spd:6 }, honor:30,
    skills:['strike','guard','shieldbash','rally'],
    flavor:'Sworn to a dead order. Rebukes the dark with shield and vow. Begins honorable.'
  },
  rogue: {
    id:'rogue', name:'Gravethief', role:'Shadow & steel', sprite:'hero_rogue',
    base:{ hp:34, sp:8, atk:16, def:6, mag:6, spd:12 }, honor:0,
    skills:['strike','backstab','poisonblade','bleed'],
    flavor:'Owes nothing to gods or kings. Fast, deadly, and morally unwritten.'
  },
  mage: {
    id:'mage', name:'Hollow Witch', role:'Dark-arts adept', sprite:'hero_mage',
    base:{ hp:20, sp:25, atk:2, def:8, mag:19, spd:3 }, honor:-20,
    skills:['firebolt','hex','drain','meditate'],
    flavor:'Traffics with things better left buried. Begins already tainted.'
  },
  warden: {
    id:'warden', name:'Oathwarden', role:'Holy protector', sprite:'hero_warden',
    base:{ hp:30, sp:9, atk:11, def:10, mag:12, spd:7 }, honor:40,
    skills:['strike','smite','prayer','heal'],
    flavor:'A lantern in the deep. Mercy is a weapon. Begins most honorable.'
  },
  // Unlocked by slaying Omen in the cathedral. A glass-cannon mage: almost nothing
  // with steel, but savage magic. The Cursed Path passive locks each run to one
  // spell discipline (see necroStyle handling in game.js).
  necromancer: {
    id:'necromancer', name:'The Necromancer', role:'The cursed one', sprite:'hero_necromancer',
    base:{ hp:25, sp:30, atk:5, def:9, mag:47, spd:10 }, honor:-20,
    skills:['strike'], locked:'omen',
    flavor:'Omen, unmade and worn as a name. The dead answer it; the living learn to.'
  },
  // Unlocked by finishing the potion-maker's quest. Uses INT (crafting-grown)
  // in place of SP, cannot strike or cast, and fights only by brewing and
  // throwing potions. See usesInt / craftOnly.
  alchemist: {
    id:'alchemist', name:'The Alchemist', role:'Bartender in another life', sprite:'npc_alchemist',
    base:{ hp:30, sp:8, atk:0, def:17, mag:0, spd:14 }, honor:10,
    skills:[], usesInt:true, craftOnly:true, locked:'one_drink',
    flavor:'Poured drinks in a kinder life. Down here she pours worse. She starts with one recipe and brews her INT up to the rest.'
  },
};

// ---------- Followers ----------
// A follower fights beside you and must be kept alive the same way you are:
// fed, healed, and given focus — out of its OWN pack. If one dies, your honor
// is slammed to the absolute floor. Taking one is a promise, not a perk.
const FOLLOWERS = {
  waif: {
    id:'waif', name:'The Waif', sprite:'npc_child',
    base:{ hp:34, sp:6, atk:9, def:4, mag:3, spd:11 },
    skill:'backstab',
    flavor:'Small, quick, and far too willing. She has decided you are worth following.',
  },
  penitent: {
    id:'penitent', name:'The Unchained', sprite:'npc_beggar',
    base:{ hp:52, sp:4, atk:12, def:8, mag:0, spd:5 },
    skill:'cleave',
    flavor:'You took him off the hook. He has not put the chain down; he swings it now for you.',
  },
  acolyte: {
    id:'acolyte', name:'The Grey Acolyte', sprite:'npc_woman',
    base:{ hp:30, sp:11, atk:5, def:4, mag:13, spd:8 },
    skill:'firebolt',
    flavor:'She reads the dark like a page. She will spend herself lighting it for you.',
  },
  // The Gravethief's wife. She walks behind no one else, and she does not die
  // down here — when it goes badly she is simply gone, and does not come back.
  eliza: {
    id:'eliza', name:'Eliza Sinclair', sprite:'npc_eliza',
    base:{ hp:44, sp:14, atk:14, def:6, mag:4, spd:15 },
    skills:['backstab','bleed','charm'],
    only:'rogue',
    flees:true,
    flavor:'Your wife, and a better thief than you. She did not follow you down here — she got here first.',
  },
};

// ---------- Enemies ----------
// moves: inline actions with weights (w). type: attack|magic|defend|heal|buff
const ENEMIES = {
  rat: { id:'rat', name:'Plague Rat', sprite:'en_rat', tier:1, tags:['beast'],
    hp:18, atk:7, def:2, mag:0, spd:9, gold:[2,6],
    moves:[ {name:'Gnaw',type:'attack',power:9,w:3}, {name:'Filthy Nip',type:'attack',power:6,effect:{poison:{dmg:2,turns:2}},w:1} ] },
  skeleton: { id:'skeleton', name:'Rattling Skeleton', sprite:'en_skeleton', tier:1, tags:['undead'],
    hp:26, atk:10, def:6, mag:0, spd:6, gold:[4,9],
    moves:[ {name:'Bone Club',type:'attack',power:11,w:3}, {name:'Rusty Slash',type:'attack',power:9,w:2}, {name:'Reassemble',type:'heal',healFlat:7,w:1} ] },
  wolf: { id:'wolf', name:'Dire Wolf', sprite:'en_wolf', tier:2, tags:['beast'],
    hp:28, atk:14, def:4, mag:0, spd:14, gold:[3,8],
    moves:[ {name:'Maul',type:'attack',power:13,w:3}, {name:'Lunge',type:'attack',power:11,effect:{stun:0.3},w:2}, {name:'Howl',type:'buff',effect:{atkbuff:{amt:4,turns:3}},w:1} ] },
  ghoul: { id:'ghoul', name:'Grave Ghoul', sprite:'en_ghoul', tier:2, tags:['undead'],
    hp:34, atk:12, def:5, mag:2, spd:7, gold:[5,11],
    moves:[ {name:'Rend',type:'attack',power:12,w:3}, {name:'Rotting Bite',type:'attack',power:9,effect:{poison:{dmg:4,turns:3}},w:2} ] },
  cultist: { id:'cultist', name:'Ashen Cultist', sprite:'en_cultist', tier:3, tags:['human'],
    hp:30, atk:9, def:5, mag:12, spd:8, gold:[6,14],
    moves:[ {name:'Dark Bolt',type:'magic',power:13,w:3}, {name:'Hex',type:'magic',power:6,effect:{weaken:{amt:4,turns:2}},w:2}, {name:'Blood Rite',type:'heal',healFlat:9,w:1} ] },
  shade: { id:'shade', name:'Wailing Shade', sprite:'en_shade', tier:3, tags:['spirit'],
    hp:32, atk:8, def:8, mag:14, spd:11, gold:[7,15],
    moves:[ {name:'Chill Touch',type:'magic',power:12,effect:{weaken:{amt:3,turns:2}},w:3}, {name:'Soul Drain',type:'magic',power:10,effect:{lifesteal:0.6},w:2}, {name:'Fade',type:'defend',shield:'def2',w:1} ] },
  bat: { id:'bat', name:'Crypt Bat', sprite:'en_bat', tier:1, tags:['beast'],
    hp:14, atk:8, def:1, mag:0, spd:15, gold:[2,5],
    moves:[ {name:'Dive',type:'attack',power:9,w:3}, {name:'Blood Sip',type:'attack',power:7,effect:{lifesteal:0.5},w:2}, {name:'Screech',type:'magic',power:4,effect:{weaken:{amt:2,turns:2}},w:1} ] },
  ooze: { id:'ooze', name:'Grave Ooze', sprite:'en_ooze', tier:1, tags:['beast'],
    hp:30, atk:7, def:7, mag:0, spd:3, gold:[3,7],
    moves:[ {name:'Engulf',type:'attack',power:8,w:3}, {name:'Caustic Touch',type:'attack',power:6,effect:{poison:{dmg:3,turns:3}},w:2}, {name:'Reform',type:'heal',healFlat:6,w:1} ] },
  archer: { id:'archer', name:'Bone Archer', sprite:'en_archer', tier:2, tags:['undead'],
    hp:24, atk:13, def:4, mag:0, spd:10, gold:[4,10],
    moves:[ {name:'Loosed Shaft',type:'attack',power:13,w:3}, {name:'Pinning Shot',type:'attack',power:8,effect:{stun:0.3},w:2}, {name:'Barbed Arrow',type:'attack',power:7,effect:{poison:{dmg:3,turns:2}},w:1} ] },
  drownedthrall: { id:'drownedthrall', name:'Drowned Thrall', sprite:'en_drowned', tier:2, tags:['undead','spirit'],
    hp:36, atk:11, def:6, mag:4, spd:5, gold:[5,11],
    moves:[ {name:'Waterlogged Fist',type:'attack',power:12,w:3}, {name:'Drag Under',type:'attack',power:10,effect:{stun:0.25},w:2}, {name:'Brine Spit',type:'magic',power:9,effect:{weaken:{amt:3,turns:2}},w:1} ] },
  imp: { id:'imp', name:'Ash Imp', sprite:'en_imp', tier:3, tags:['spirit'],
    hp:26, atk:9, def:4, mag:13, spd:13, gold:[6,13],
    moves:[ {name:'Cinder Bolt',type:'magic',power:12,w:3}, {name:'Singe',type:'magic',power:8,effect:{poison:{dmg:3,turns:2}},w:2}, {name:'Cackle',type:'buff',effect:{atkbuff:{amt:3,turns:3}},w:1} ] },
  rotpriest: { id:'rotpriest', name:'Rot Priest', sprite:'en_rotpriest', tier:3, tags:['human'],
    hp:34, atk:8, def:5, mag:13, spd:7, gold:[7,15],
    moves:[ {name:'Litany of Rot',type:'magic',power:11,effect:{poison:{dmg:4,turns:3}},w:3}, {name:'Crooked Staff',type:'attack',power:9,w:2}, {name:'Vile Blessing',type:'heal',healFlat:10,w:1} ] },
  bonehound: { id:'bonehound', name:'Bone Hound', sprite:'en_bonehound', tier:3, tags:['undead','beast'],
    hp:38, atk:15, def:6, mag:0, spd:12, gold:[7,14],
    moves:[ {name:'Crunch',type:'attack',power:14,w:3}, {name:'Marrow Snap',type:'attack',power:12,effect:{stun:0.3},w:2}, {name:'Death Rattle',type:'magic',power:6,effect:{weaken:{amt:4,turns:2}},w:1} ] },
  boss: { id:'boss', name:'Gloamlord, Warden of Bone', sprite:'en_boss', tier:99, tags:['undead','boss'],
    hp:300, atk:22, def:13, mag:20, spd:11, gold:[60,100], boss:true, throne:'ossuary', drop:'gloamheart',
    moves:[ {name:'Grave Cleave',type:'attack',power:22,w:3}, {name:'Necrotic Wave',type:'magic',power:20,effect:{poison:{dmg:6,turns:3}},w:2},
            {name:'Soul Rend',type:'magic',power:18,effect:{lifesteal:0.6},w:2}, {name:'Marrow Storm',type:'magic',power:9,hits:3,acc:0.85,w:2},
            {name:'Skullcracker',type:'attack',power:16,effect:{stun:0.5},w:1}, {name:'Crippling Dread',type:'magic',power:12,effect:{weaken:{amt:8,turns:3}},w:1},
            {name:'Feast of Souls',type:'heal',healFlat:28,w:1}, {name:'Bone Ward',type:'defend',shield:'def2',w:1} ],
    dialogue:{ defeat:'“The bone... remembers... nothing...”' } },

  // ---- Thrones: one of these holds the bottom of any given descent. Each keeps
  // a different biome and fights out of a different discipline, borrowing the
  // player classes' own kits — so the last room asks you a different question
  // depending on who is sitting in it.
  boss_choir: { id:'boss_choir', name:'The Gilded Sepulchre, Voice of the Choir', sprite:'en_velvet', tier:99, tags:['spirit','boss'],
    hp:285, atk:18, def:16, mag:24, spd:10, gold:[60,100], boss:true, throne:'cathedral', drop:'choir_reliquary',
    moves:[ {name:'Fist of the Heavens',type:'magic',power:21,holy:true,w:3},
            {name:'Blessed Hammer',type:'magic',power:14,hits:2,acc:0.9,holy:true,w:2},
            {name:'Smite',type:'attack',power:19,effect:{stun:0.4},w:2},
            {name:'Conviction',type:'magic',power:11,effect:{weaken:{amt:8,turns:3}},w:2},
            {name:'The Gilded Verdict',type:'magic',power:24,holy:true,execute:0.18,w:1},
            {name:'Holy Shield',type:'defend',shield:'def2',w:1},
            {name:'Redemption',type:'heal',healFlat:30,w:1},
            {name:'Sanctuary',type:'buff',effect:{shield:'def2',atkbuff:{amt:6,turns:3}},w:1} ],
    dialogue:{
      intro:'“The Choir sang until the roof came down, and then it sang under the roof. I am what the singing left. Kneel, and I will make the verdict quick.”',
      class:{ knight:'“An ash-sworn shield. Your order swore to us once, before it decided its conscience was its own.”',
              rogue:'“A thief in a chapel. Take what you like. It is all evidence.”',
              mage:'“Borrowed power in a holy place. The See has a word for that, and a pyre to go with it.”',
              warden:'“A lantern. You carry the same light I do and you carry it badly — for anyone, to anywhere, without a docket.”',
              necromancer:'“You wear a dead thing as a name. Stand still. This is the part of the liturgy for you.”',
              alchemist:'“A brewer. Every heresy I have burned started with somebody deciding what went in the cup.”' },
      marked:'“The ink on you is our ink. You have saved me the trouble of an introduction.”',
      hallowed:'“Clean. Genuinely clean. It changes the sentence not at all, but I will say the words properly for you.”',
      items:{ aureate_edge:'“Cassiel\'s blade. He was better than you and he is not here. Consider what that means.”',
              saints_knuckle:'“That knuckle was catalogued. You are carrying stolen scripture.”' },
      defeat:'“The verdict... was never... mine to give...”' } },

  boss_keep: { id:'boss_keep', name:'Lord Vantage, the Last Garrison', sprite:'en_captain', tier:99, tags:['undead','boss'],
    hp:340, atk:26, def:18, mag:6, spd:8, gold:[60,100], boss:true, throne:'castle', drop:'garrison_bulwark',
    moves:[ {name:'Shield Charge',type:'attack',power:19,effect:{stun:0.35},w:3},
            {name:'Seismic Slam',type:'attack',power:21,effect:{stun:0.5},w:2},
            {name:'Whirlwind',type:'attack',power:10,hits:3,acc:0.9,w:2},
            {name:'Execute',type:'attack',power:20,execute:0.25,w:2},
            {name:'Revenge',type:'attack',power:23,effect:{crit:0.3},w:2},
            {name:'War Cry',type:'buff',effect:{atkbuff:{amt:8,turns:3}},w:1},
            {name:'Iron Skin',type:'defend',shield:'def2',w:1},
            {name:'Undying Rage',type:'buff',effect:{regen:{amt:9,turns:4},atkbuff:{amt:5,turns:3}},w:1} ],
    dialogue:{
      intro:'“The relief column was three days out. That was eleven decades ago. Until it arrives, this gate is held. State your business or be treated as the enemy, which you are.”',
      class:{ knight:'“You know the drill I am running. Good. Then you know I will not stop running it.”',
              rogue:'“Sappers came over that wall for two months. I killed forty of them. I am not tired.”',
              mage:'“They shelled us with worse than you carry.”',
              warden:'“A field chaplain. We had one. He walked out on the ninth day and I have not forgiven him.”',
              necromancer:'“You raise the dead. I AM the dead, and I am still at my post. Explain to me what you think you are offering.”',
              alchemist:'“A quartermaster\'s trade. If you have anything for the wounded, there are no wounded. There is only me.”' },
      marked:'“The Choir wants you. The Choir also never sent the relief. You will find that buys you nothing here.”',
      hallowed:'“You have kept faith with something. So have I. That is not a reason to let you past.”',
      items:{ oathblade:'“That blade swore. So did I. One of us is going to find out whose oath was worth more.”' },
      defeat:'“Post... relieved...”' } },

  boss_knife: { id:'boss_knife', name:'The Thousandth Knife', sprite:'npc_silhouette', tier:99, tags:['spirit','boss'],
    hp:250, atk:24, def:9, mag:8, spd:18, gold:[60,100], boss:true, throne:'umbral', drop:'thousandth_knife',
    moves:[ {name:'Backstab',type:'attack',power:20,effect:{crit:0.35},w:3},
            {name:'Fan of Knives',type:'attack',power:8,hits:4,acc:0.8,w:2},
            {name:'Shadow Strike',type:'attack',power:18,effect:{crit:0.25,lifesteal:0.4},w:2},
            {name:'Poison Blade',type:'attack',power:14,effect:{poison:{dmg:7,turns:3}},w:2},
            {name:'Death Blossom',type:'attack',power:11,hits:3,acc:0.95,effect:{crit:0.2},w:1},
            {name:'Exploit Weakness',type:'magic',power:10,effect:{weaken:{amt:8,turns:3}},w:1},
            {name:'Nightstalker',type:'buff',effect:{atkbuff:{amt:7,turns:3}},w:1},
            {name:'Smoke Screen',type:'defend',shield:'def2',w:1} ],
    dialogue:{
      intro:'“Nine hundred and ninety-nine went into the Blackwood ahead of you, and nine hundred and ninety-nine knives came out of it. You are a round number. I have been looking forward to a round number.”',
      class:{ knight:'“Armour. Good. It takes longer and I get to watch you understand it.”',
              rogue:'“Oh — professional courtesy. I will use your own opening on you and you will recognise it on the way down.”',
              mage:'“Cast something. I am already behind you.”',
              warden:'“Bring the light closer. It only shows me where the rest of you is.”',
              necromancer:'“You will try to raise me afterwards. Others have. There is nothing here to raise; I am an accumulation.”',
              alchemist:'“Poison. Sweet of you. I am made of the last person who tried that.”' },
      marked:'“Hunted. Then we want the same thing from this conversation — for it to be quiet.”',
      hallowed:'“Clean hands, in the Blackwood. That is not innocence. That is inexperience.”',
      items:{ skinners_needle:'“The Seamstress\'s needle. She and I have an arrangement about leftovers.”' },
      defeat:'“One... thousand... and one...”' } },

  boss_kiln: { id:'boss_kiln', name:'Ashmother Vyre, the Kiln Unbanked', sprite:'en_cultist', tier:99, tags:['human','boss'],
    hp:265, atk:12, def:11, mag:27, spd:12, gold:[60,100], boss:true, throne:'ember', drop:'kiln_ember',
    moves:[ {name:'Inferno',type:'magic',power:22,w:3},
            {name:'Fire Wall',type:'magic',power:12,effect:{poison:{dmg:8,turns:3}},w:2},
            {name:'Chain Lightning',type:'magic',power:9,hits:3,acc:0.9,w:2},
            {name:'Static Field',type:'magic',power:14,effect:{weaken:{amt:6,turns:2}},w:2},
            {name:'Iron Maiden',type:'magic',power:13,effect:{lifesteal:0.5},w:2},
            {name:'Lower Resist',type:'magic',power:10,effect:{weaken:{amt:9,turns:3}},w:1},
            {name:'The Kiln Unbanked',type:'magic',power:26,effect:{poison:{dmg:6,turns:2}},w:1},
            {name:'Energy Shield',type:'defend',shield:'def2',w:1} ],
    dialogue:{
      intro:'“I banked this fire for four hundred years so it would still be here when somebody worth burning came down the stair. Do not apologise. You are the first one who was worth the wait.”',
      class:{ knight:'“Steel conducts. Steel holds heat. You have come to a kiln wearing an oven.”',
              rogue:'“There is nowhere in this chasm that is not already warm. There is nothing to hide behind but the air.”',
              mage:'“A colleague. A poor one — you ration it. Fire that is rationed is fire that goes out.”',
              warden:'“Light. I have a great deal of light. Mine does something.”',
              necromancer:'“Ash does not answer to you. I have already burned everything you would have called.”',
              alchemist:'“You boil things. I have been boiling one thing for four centuries. Come and compare methods.”' },
      marked:'“The Choir marked you and then did nothing about it. Typical of them. I finish work.”',
      hallowed:'“Unburnt, so far. Every log is unburnt, so far.”',
      items:{ gloamheart:'“You are carrying the Warden\'s heart into MY chasm. The arrogance of it is almost worth sparing you for.”' },
      defeat:'“Let it... go out...”' } },

  // ---- Hunters: the Gilded Inquisition (stalk the Marked; drop premium loot) ----
  inquisitor: { id:'inquisitor', name:'Gilded Inquisitor', sprite:'en_inquisitor', tier:1, tags:['human','hunter'], hunter:true,
    hp:46, atk:14, def:8, mag:12, spd:9, gold:[18,30],
    moves:[ {name:'Judgement',type:'magic',power:16,holy:true,w:3}, {name:'Gilded Slash',type:'attack',power:14,w:2}, {name:'Sanctify',type:'defend',shield:'def2',w:1} ] },
  witch_hunter: { id:'witch_hunter', name:'Witch-Hunter', sprite:'en_witch_hunter', tier:1, tags:['human','hunter'], hunter:true,
    hp:38, atk:15, def:6, mag:4, spd:13, gold:[16,26],
    moves:[ {name:'Crossbow Bolt',type:'attack',power:14,w:3}, {name:'Venom Bolt',type:'attack',power:10,effect:{poison:{dmg:5,turns:3}},w:2}, {name:'Bola',type:'attack',power:6,effect:{stun:0.5},w:1} ] },
  penitent: { id:'penitent', name:'Chained Penitent', sprite:'en_penitent', tier:1, tags:['human','hunter'], hunter:true,
    hp:62, atk:16, def:6, mag:0, spd:5, gold:[14,24],
    moves:[ {name:'Chain Sweep',type:'attack',power:15,w:3}, {name:'Zealous Crush',type:'attack',power:20,w:1}, {name:'Endure',type:'defend',shield:'def2',w:1} ] },
};

const HUNTER_POOL = ['inquisitor','witch_hunter','penitent'];

// ---- Elites: named mini-bosses, one per biome, plus the Inquisition's captain ----
Object.assign(ENEMIES, {
  gravemaw: { id:'gravemaw', name:'Gravemaw, the Charnel Rat', sprite:'en_rat', elite:true, tier:1, tags:['beast'],
    hp:55, atk:16, def:5, mag:0, spd:11, gold:[20,34],
    moves:[ {name:'Charnel Gnaw',type:'attack',power:15,w:3}, {name:'Plague Bite',type:'attack',power:10,effect:{poison:{dmg:5,turns:3}},w:2}, {name:'Frenzy',type:'buff',effect:{atkbuff:{amt:5,turns:3}},w:1} ] },
  sporetyrant: { id:'sporetyrant', name:'The Sporetyrant', sprite:'en_ghoul', elite:true, tier:1, tags:['beast'],
    hp:68, atk:15, def:7, mag:4, spd:6, gold:[22,36],
    moves:[ {name:'Crushing Bough',type:'attack',power:16,w:3}, {name:'Spore Burst',type:'magic',power:10,effect:{poison:{dmg:6,turns:3}},w:2}, {name:'Regrow',type:'heal',healFlat:12,w:1} ] },
  undertow: { id:'undertow', name:'Undertow, Warden of the Flood', sprite:'en_shade', elite:true, tier:1, tags:['spirit'],
    hp:60, atk:12, def:8, mag:16, spd:10, gold:[22,36],
    moves:[ {name:'Drowning Grasp',type:'attack',power:12,effect:{stun:0.4},w:2}, {name:'Black Tide',type:'magic',power:15,w:3}, {name:'Undertow',type:'magic',power:11,effect:{lifesteal:0.6},w:2} ] },
  cinderprophet: { id:'cinderprophet', name:'The Cinder Prophet', sprite:'en_cultist', elite:true, tier:1, tags:['human'],
    hp:58, atk:10, def:6, mag:17, spd:9, gold:[24,38],
    moves:[ {name:'Fire Sermon',type:'magic',power:16,w:3}, {name:'Immolate',type:'magic',power:10,effect:{poison:{dmg:6,turns:3}},w:2}, {name:'Ashen Rite',type:'heal',healFlat:11,w:1} ] },
  marrowcantor: { id:'marrowcantor', name:'The Marrow Cantor', sprite:'en_skeleton', elite:true, tier:1, tags:['undead'],
    hp:70, atk:13, def:9, mag:12, spd:7, gold:[24,38],
    moves:[ {name:'Marrow Spike',type:'attack',power:15,w:3}, {name:'Dirge',type:'magic',power:11,effect:{weaken:{amt:5,turns:3}},w:2}, {name:'Bone Hymn',type:'defend',shield:'def2',w:1} ] },
  rootwolf: { id:'rootwolf', name:'The Rootwolf', sprite:'en_wolf', elite:true, tier:1, tags:['beast'],
    hp:62, atk:17, def:5, mag:0, spd:15, gold:[20,34],
    moves:[ {name:'Pounce',type:'attack',power:14,effect:{stun:0.35},w:2}, {name:'Rend',type:'attack',power:16,w:3}, {name:'Umbral Howl',type:'buff',effect:{atkbuff:{amt:5,turns:3}},w:1} ] },

  ironmonger: { id:'ironmonger', name:'The Ironmonger', sprite:'en_butcher', elite:true, tier:1, tags:['human'],
    hp:74, atk:18, def:11, mag:0, spd:7, gold:[24,38],
    moves:[ {name:'Anvil Drop',type:'attack',power:18,effect:{stun:0.4},w:3},
            {name:'Bash',type:'attack',power:14,w:2},
            {name:'Tongs and Quench',type:'attack',power:12,effect:{lifesteal:0.4},w:2},
            {name:'Iron Skin',type:'defend',shield:'def2',w:1},
            {name:'War Cry',type:'buff',effect:{atkbuff:{amt:6,turns:3}},w:1} ] },
  thirstjaw: { id:'thirstjaw', name:'Thirstjaw', sprite:'en_bonehound', elite:true, tier:1, tags:['beast'],
    hp:58, atk:19, def:4, mag:0, spd:17, gold:[20,34],
    moves:[ {name:'Sand Lunge',type:'attack',power:16,effect:{crit:0.3},w:3},
            {name:'Worry the Leg',type:'attack',power:9,hits:3,acc:0.85,w:2},
            {name:'Drag Under',type:'attack',power:14,effect:{stun:0.4},w:2},
            {name:'Nightstalker',type:'buff',effect:{atkbuff:{amt:6,turns:3}},w:1} ] },
  bannerless: { id:'bannerless', name:'The Bannerless', sprite:'en_captain', elite:true, tier:1, tags:['undead'],
    hp:78, atk:17, def:12, mag:4, spd:8, gold:[24,38],
    moves:[ {name:'Shield Charge',type:'attack',power:16,effect:{stun:0.35},w:3},
            {name:'Execute',type:'attack',power:16,execute:0.2,w:2},
            {name:'Whirlwind',type:'attack',power:8,hits:3,acc:0.9,w:2},
            {name:'Stalwart Ward',type:'defend',shield:'def2',w:1},
            {name:'Undying Rage',type:'buff',effect:{regen:{amt:6,turns:3},atkbuff:{amt:4,turns:3}},w:1} ] },
  chandler: { id:'chandler', name:'The Chandler', sprite:'en_shade', elite:true, tier:1, tags:['spirit'],
    hp:62, atk:10, def:8, mag:18, spd:11, gold:[24,38],
    moves:[ {name:'Wick and Flame',type:'magic',power:17,holy:true,w:3},
            {name:'Snuff',type:'magic',power:11,effect:{weaken:{amt:6,turns:3}},w:2},
            {name:'Tallow Grasp',type:'magic',power:13,effect:{lifesteal:0.5},w:2},
            {name:'Two Candles',type:'magic',power:9,hits:2,acc:0.9,w:1},
            {name:'Energy Shield',type:'defend',shield:'def2',w:1} ] },
  vellum: { id:'vellum', name:'Brother Vellum', sprite:'en_skeleton', elite:true, tier:1, tags:['undead'],
    hp:72, atk:13, def:10, mag:14, spd:8, gold:[24,38],
    moves:[ {name:'Holy Bolt',type:'magic',power:15,holy:true,w:3},
            {name:'Illuminated Letter',type:'magic',power:11,effect:{weaken:{amt:5,turns:3}},w:2},
            {name:'The Copyist\'s Hand',type:'attack',power:14,effect:{crit:0.25},w:2},
            {name:'Warding Prayer',type:'buff',effect:{shield:'def2'},w:1},
            {name:'Mend',type:'heal',healFlat:14,w:1} ] },
  inquisitor_captain: { id:'inquisitor_captain', name:'Saint Cassiel, the Golden Blade', sprite:'en_captain', elite:true, hunter:true, tier:1, tags:['human','hunter'],
    hp:85, atk:17, def:10, mag:14, spd:10, gold:[40,60], drop:'aureate_edge',
    moves:[ {name:'Golden Judgement',type:'magic',power:17,holy:true,w:3}, {name:"Executioner's Arc",type:'attack',power:16,w:3},
            {name:'Censure',type:'magic',power:9,effect:{weaken:{amt:5,turns:3}},w:1}, {name:'Aegis of the Choir',type:'defend',shield:'def2',w:1} ] },
});

// Grimdark minibosses — summoned only through their events, never spawned on floors
Object.assign(ENEMIES, {
  butcher: { id:'butcher', name:'The Butcher', sprite:'en_butcher', elite:true, tier:1, tags:['human'],
    hp:150, atk:22, def:10, mag:0, spd:8, gold:[50,80], drop:'butchers_cleaver',
    moves:[ {name:'Cleave',type:'attack',power:20,w:3}, {name:'Hook',type:'attack',power:14,effect:{stun:0.45},w:2},
            {name:'Fresh Meat',type:'heal',healFlat:16,w:1}, {name:'Red Frenzy',type:'buff',effect:{atkbuff:{amt:6,turns:3}},w:1} ] },
  seamstress: { id:'seamstress', name:'The Seamstress', sprite:'en_seamstress', elite:true, tier:1, tags:['human','spirit'],
    hp:110, atk:16, def:9, mag:14, spd:11, gold:[40,60], drop:'skinners_needle',
    moves:[ {name:'Needle Rake',type:'attack',power:15,effect:{poison:{dmg:5,turns:3}},w:3}, {name:'Unpick Seams',type:'magic',power:12,effect:{weaken:{amt:6,turns:3}},w:2},
            {name:'Thread the Flesh',type:'attack',power:13,effect:{stun:0.35},w:2}, {name:'Mend Herself',type:'heal',healFlat:14,w:1} ] },
  starveling: { id:'starveling', name:'The Starveling King', sprite:'en_starveling', elite:true, tier:1, tags:['undead'],
    hp:130, atk:18, def:7, mag:10, spd:9, gold:[45,70], drop:'starveling_crown',
    moves:[ {name:'Devouring Bite',type:'attack',power:16,effect:{lifesteal:0.8},w:3}, {name:'Hollow Roar',type:'magic',power:11,effect:{weaken:{amt:5,turns:3}},w:2},
            {name:'Feast on Marrow',type:'heal',healFlat:18,w:1}, {name:'Famine\'s Reach',type:'attack',power:19,w:2} ] },
  velvetsaint: { id:'velvetsaint', name:'The Velvet Saint', sprite:'en_velvet', elite:true, tier:1, tags:['spirit'],
    hp:105, atk:12, def:8, mag:17, spd:12, gold:[40,65], drop:'velvet_shroud',
    moves:[ {name:'Adoring Touch',type:'magic',power:14,effect:{lifesteal:0.7},w:3}, {name:'Sweet Nothings',type:'magic',power:9,effect:{weaken:{amt:6,turns:3}},w:2},
            {name:'Smothering Embrace',type:'attack',power:13,effect:{stun:0.4},w:2}, {name:'Drink Deep',type:'magic',power:16,effect:{lifesteal:0.5},w:1} ] },
});

// which named terror may prowl each biome's floors
const BIOME_ELITES = { catacombs:'gravemaw', fungal:'sporetyrant', drowned:'undertow', ember:'cinderprophet', ossuary:'marrowcantor', umbral:'rootwolf',
  dungeon:'ironmonger', desert:'thirstjaw', castle:'bannerless', cathedral:'chandler', monastery:'vellum' };

// ---- Decorative props: dressing that fits each biome. Purely visual — they
// never block a route (see the decorative-entity rule in game.js/dungeon.js).
const BIOME_PROPS = {
  catacombs: ['obj_shelf','obj_statue','obj_table','obj_chair','obj_urn','obj_sarcophagus','obj_brazier'],
  fungal:    ['obj_mushroom','obj_stump','obj_barrel','obj_urn'],
  drowned:   ['obj_barrel','obj_urn','obj_statue','obj_table'],
  ember:     ['obj_brazier','obj_barrel','obj_statue','obj_bones'],
  ossuary:   ['obj_bones','obj_sarcophagus','obj_statue','obj_urn','obj_shelf'],
  umbral:    ['obj_stump','obj_mushroom','obj_bones','obj_urn'],
  dungeon:   ['obj_barrel','obj_urn','obj_shelf','obj_table','obj_chair','obj_brazier'],
  desert:    ['obj_bones','obj_urn','obj_statue','obj_sarcophagus','obj_pillar'],
  castle:    ['obj_table','obj_chair','obj_shelf','obj_statue','obj_pillar','obj_brazier'],
  cathedral: ['obj_statue','obj_pillar','obj_brazier','obj_sarcophagus','obj_urn'],
  monastery: ['obj_shelf','obj_table','obj_chair','obj_urn','obj_brazier','obj_statue'],
};

// ---- Legendary Guardians: one bars the stair on every floor; slay them to descend ----
// dialogue.lines: intro always; class[job] always; marked/hallowed by alignment; items by equipped weapon.
Object.assign(ENEMIES, {
  morr: { id:'morr', name:'Morr, the Tollkeeper', sprite:'en_skeleton', guardian:true, tier:1, tags:['undead'],
    hp:150, atk:17, def:11, mag:9, spd:8, gold:[30,50],
    moves:[ {name:'Toll Scythe',type:'attack',power:19,w:3}, {name:"Debtor's Chains",type:'attack',power:14,effect:{stun:0.4},w:2},
            {name:'Coin of the Dead',type:'magic',power:13,effect:{weaken:{amt:6,turns:3}},w:2},
            {name:'Grave Tax',type:'magic',power:13,effect:{lifesteal:0.6},w:2}, {name:'Vault Ward',type:'defend',shield:'def2',w:1} ],
    dialogue:{
      intro:'“Nine hundred years I have kept this stair, and all who descend pay the toll. Come forward. Let me see what coin your soul is minted in.”',
      class:{ knight:'“Another ash-sworn shield. I keep three hundred of those below. They make fine railings.”',
              rogue:'“A thief\'s tread on my stair. I count sixty pilfered fortunes in my vault — your fingers will balance the ledger.”',
              mage:'“Hollow-hearted witch. Borrowed power pays double — that is the rule of borrowed things.”',
              warden:'“A lantern in the deep. It has been a long dark since one of yours lit my stair. The toll stands regardless.”' },
      marked:'“You reek of the Choir\'s ink, hunted one. The condemned pay in advance.”',
      hallowed:'“Clean hands. Rare currency down here. I almost regret the toll. Almost.”',
      items:{ soul_edge:'“That edge at your hip whispers. It was part of my vault once. It still owes me interest.”' },
      defeat:'“Paid... in... full...”' } },
  mycel: { id:'mycel', name:'Mycel, the Patient Garden', sprite:'en_ghoul', guardian:true, tier:1, tags:['beast'],
    hp:170, atk:16, def:8, mag:11, spd:6, gold:[28,48],
    moves:[ {name:'Root Crush',type:'attack',power:18,w:3}, {name:'Rootquake',type:'attack',power:16,effect:{stun:0.35},w:2},
            {name:'Spore Tide',type:'magic',power:12,effect:{poison:{dmg:6,turns:3}},w:2},
            {name:'Choking Bloom',type:'magic',power:10,effect:{weaken:{amt:6,turns:3}},w:1}, {name:'Regrow',type:'heal',healFlat:20,w:1} ],
    dialogue:{
      intro:'“Every root beneath this step is me. You have been walking on my tongue since you arrived, little morsel. Now you have found the mouth.”',
      class:{ knight:'“Iron rusts. Iron feeds. I have digested better shields than yours.”',
              rogue:'“Quick feet, quick meat.”',
              mage:'“You fed on my spores, witch. That makes you half mine already. Come collect the other half.”',
              warden:'“Your light scorches my gardens. I will grow you somewhere dark and quiet.”' },
      marked:'“The hunted rot sweetest. Fear ferments.”',
      hallowed:'“Kindness composts poorly. I will plant you anyway.”',
      items:{ oathblade:'“That blade swore an oath, bearer. Steel keeps promises longer than meat does.”' },
      defeat:'“The garden... remembers...”' } },
  brine: { id:'brine', name:'Abbess Brine', sprite:'en_shade', guardian:true, tier:1, tags:['spirit'],
    hp:150, atk:12, def:9, mag:18, spd:9, gold:[30,50],
    moves:[ {name:'Baptism',type:'magic',power:18,w:3}, {name:'Drowned Lullaby',type:'magic',power:12,effect:{stun:0.4},w:2},
            {name:'Undertow',type:'magic',power:12,effect:{lifesteal:0.6},w:2},
            {name:'Depth Chill',type:'magic',power:10,effect:{weaken:{amt:6,turns:3}},w:1}, {name:'Font Ward',type:'defend',shield:'def2',w:1} ],
    dialogue:{
      intro:'“The stair below is a font, pilgrim, and every font demands baptism. Hold your breath. I will hold the rest of you.”',
      class:{ knight:'“Plate sinks beautifully. Straight down, like a prayer.”',
              rogue:'“The water keeps what slips. You will slip nowhere but down.”',
              mage:'“The deep whispered to you, witch? I am the mouth it whispered from.”',
              warden:'“Holy water? Child. All water is mine.”' },
      marked:'“Sin floats. It only makes the drowning slower.”',
      hallowed:'“A clean soul. The font has been thirsty for one of those.”',
      items:{},
      defeat:'“At last... dry...”' } },
  pyraxes: { id:'pyraxes', name:'Pyraxes, the Kilnborn', sprite:'en_cultist', guardian:true, tier:1, tags:['human'],
    hp:155, atk:13, def:9, mag:19, spd:9, gold:[32,52],
    moves:[ {name:'Kilnfire',type:'magic',power:19,w:3}, {name:'Glaze',type:'attack',power:14,effect:{stun:0.35},w:2},
            {name:'Ember Burst',type:'magic',power:8,hits:3,acc:0.85,w:2},
            {name:'Stoke the Coals',type:'buff',effect:{atkbuff:{amt:6,turns:3}},w:1}, {name:'Slag Ward',type:'defend',shield:'def2',w:1} ],
    dialogue:{
      intro:'“I was fired in this kiln before your kingdoms cooled. Everything that descends past me goes in as clay and comes out as glaze. Come — the kiln stands open.”',
      class:{ knight:'“Ash knight. You wear my leavings as a title.”',
              rogue:'“A fast little spark. Sparks are mine too.”',
              mage:'“You borrow fire, witch. I am the lender, and the interest is due.”',
              warden:'“Your candle-god kneels to my furnace.”' },
      marked:'“The Choir feeds me its heretics. You, they will not even mourn.”',
      hallowed:'“Unburnt and honorable. The kiln loves best what resists it.”',
      items:{ aureate_edge:'“Cassiel\'s gold, at YOUR hip? You killed the saint. Then you have earned a hotter fire.”' },
      defeat:'“Cold... how... novel...”' } },
  curator: { id:'curator', name:'The White Curator', sprite:'en_curator', guardian:true, tier:1, tags:['undead'],
    hp:165, atk:17, def:13, mag:11, spd:7, gold:[32,52],
    moves:[ {name:'Catalogue Pin',type:'attack',power:15,effect:{stun:0.4},w:2}, {name:'Filing Dirge',type:'magic',power:13,effect:{weaken:{amt:6,turns:3}},w:2},
            {name:'Marrow Audit',type:'attack',power:18,w:3}, {name:'Restore Specimen',type:'heal',healFlat:18,w:1}, {name:'Bone Ward',type:'defend',shield:'def2',w:1} ],
    dialogue:{
      intro:'“Every bone below this stair is catalogued, labelled, and loved. Yours arrive unindexed. Irregular. Hold still, specimen, while I file you.”',
      class:{ knight:'“Ferrous inclusions throughout. The catalogue dislikes rust on its femurs.”',
              rogue:'“Nimble phalanges! Oh, the collection has wanted a good set for decades.”',
              mage:'“Marrow steeped in dark arts. A restricted-shelf specimen, I think.”',
              warden:'“Consecrated calcium! You will do beautifully in the reliquary wing.”' },
      marked:'“Damaged provenance. The Choir\'s marks lower your value considerably.”',
      hallowed:'“Pristine provenance. You will be the pride of the collection.”',
      items:{},
      defeat:'“File... under... failure...”' } },
  firstshadow: { id:'firstshadow', name:'The First Shadow', sprite:'npc_silhouette', guardian:true, tier:1, tags:['spirit'],
    hp:158, atk:15, def:10, mag:17, spd:12, gold:[30,50],
    moves:[ {name:'Smother',type:'magic',power:17,w:3}, {name:'Shadow Lash',type:'attack',power:15,w:2},
            {name:'Engulf',type:'magic',power:9,hits:3,acc:0.85,w:2},
            {name:'Unlight',type:'magic',power:10,effect:{weaken:{amt:6,turns:3}},w:1}, {name:'Fade',type:'defend',shield:'def2',w:1} ],
    dialogue:{
      intro:'“Before light, there was me. Every shadow you have feared in these halls was a finger of my hand. The stair is my palm. Cross it.”',
      class:{ knight:'“Your shield casts me, knight. Every lantern you raise, I grow taller at your back.”',
              rogue:'“You wear me like a cloak, little thief. Time to pay the tailor.”',
              mage:'“You called into the dark and thought it answered to you?”',
              warden:'“Light-bearer. I have eaten ten thousand of your lamps and I remember none of them.”' },
      marked:'“The Choir hunts you through MY halls. Amusing. Only I may have you.”',
      hallowed:'“So bright, so clean. You will leave such a beautiful stain.”',
      items:{},
      defeat:'“Light... always... the light...”' } },

  // Omen, the Cursed One — the cathedral's main boss. A necromancer: almost all
  // magic, and the dead answer it. Slaying it earns the Necromancer class.
  omen: { id:'omen', name:'Omen, the Cursed One', sprite:'en_omen', guardian:true, tier:1, tags:['undead'],
    hp:190, atk:9, def:10, mag:24, spd:10, gold:[36,58],
    moves:[ {name:'Bone Spear',type:'magic',power:22,w:3}, {name:'Poison Nova',type:'magic',power:13,effect:{poison:{dmg:9,turns:3}},w:2},
            {name:'Teeth',type:'magic',power:6,hits:4,acc:0.85,w:2}, {name:'Amplify Damage',type:'magic',power:4,effect:{weaken:{amt:9,turns:3}},w:1},
            {name:'Grave Regeneration',type:'buff',effect:{regen:{amt:8,turns:3}},w:1}, {name:'Bone Armor',type:'defend',shield:'def2',w:1} ],
    dialogue:{
      intro:'“I was a man, once, and then a word men were afraid to say. Now I keep this altar, and the dead keep me. Come and be counted among them.”',
      class:{ knight:'“Steel and a vow. The last one who brought me those is holding my staff\'s left hand now.”',
              rogue:'“Quick, and quiet. The quiet ones make the most patient corpses.”',
              mage:'“You reach into the same dark I did. Reach a little further. See where it ends.”',
              warden:'“A light. Good. I have missed watching one go out.”',
              alchemist:'“You brew borrowed life. I keep the real thing on a leash. Sit. Have a drink. Have the last one.”' },
      marked:'“The Choir wants you unmade. We want for so little, they and I.”',
      hallowed:'“Clean. Whole. Unbroken. I will fix all three.”',
      items:{},
      defeat:'“So this... is how it... looks from... the other side.”' } },
  turnkey: { id:'turnkey', name:'Warden Hesk, the Turnkey', sprite:'en_penitent', guardian:true, tier:1, tags:['undead'],
    hp:160, atk:18, def:13, mag:6, spd:7, gold:[30,50],
    moves:[ {name:'Shield Bash',type:'attack',power:18,effect:{stun:0.4},w:3},
            {name:'Ring of Keys',type:'attack',power:15,effect:{crit:0.25},w:2},
            {name:'Bar the Door',type:'defend',shield:'def2',w:2},
            {name:'Seismic Slam',type:'attack',power:17,effect:{stun:0.35},w:2},
            {name:'Long Sentence',type:'magic',power:11,effect:{weaken:{amt:6,turns:3}},w:2},
            {name:'War Cry',type:'buff',effect:{atkbuff:{amt:6,turns:3}},w:1} ],
    dialogue:{
      intro:'“Every door on this level answers to this ring, and every door on this level is shut. You are not on the list of people who leave. Nobody has been on it since the last governor.”',
      class:{ knight:'“Armour does not open doors. Keys open doors. I have the keys.”',
              rogue:'“A picker. Six of you have tried the mechanism. It is not a mechanism, it is me.”',
              mage:'“Burn the door if you like. There is another one behind it. There are eleven.”',
              warden:'“You would let them all out. That is exactly the problem with your sort.”',
              necromancer:'“Half this block would stand up for you. That is precisely why the block stays shut.”',
              alchemist:'“Nothing you can brew fits a lock.”' },
      marked:'“Condemned. Then you are not a visitor, you are an intake.”',
      hallowed:'“Clean record. Wrong building.”',
      items:{ grave_dagger:'“Contraband. Noted.”' },
      defeat:'“The ring... take the... ring...”' } },

  thirstpriest: { id:'thirstpriest', name:'The Sand-Sworn, Thirst of the Waste', sprite:'en_rotpriest', guardian:true, tier:1, tags:['undead'],
    hp:150, atk:14, def:9, mag:18, spd:9, gold:[30,50],
    moves:[ {name:'Scouring Wind',type:'magic',power:17,w:3},
            {name:'Sun Blister',type:'magic',power:12,effect:{poison:{dmg:6,turns:3}},w:2},
            {name:'Take the Water',type:'magic',power:14,effect:{lifesteal:0.6},w:2},
            {name:'Glass and Grit',type:'magic',power:8,hits:3,acc:0.85,w:2},
            {name:'Parched',type:'magic',power:10,effect:{weaken:{amt:7,turns:3}},w:1},
            {name:'Bank the Sand',type:'defend',shield:'def2',w:1} ],
    dialogue:{
      intro:'“There was a river here. I was its priest. The river left and the office did not, so I stayed on and took up the only sacrament remaining: I take the water out of things.”',
      class:{ knight:'“All that iron in this heat. You are cooking. I am only here to collect what boils off.”',
              rogue:'“Run, by all means. The waste is very wide and you are mostly water.”',
              mage:'“Every spell you have costs you sweat. Cast freely.”',
              warden:'“A lantern in the desert. Redundant, and thirsty.”',
              necromancer:'“Everything here is already dried and preserved. You will find the congregation unresponsive.”',
              alchemist:'“You carry liquid. That is the first interesting thing to come down this stair in ninety years.”' },
      marked:'“The Choir does not send men into the waste. They send heat and wait.”',
      hallowed:'“The pure dehydrate at exactly the same rate.”',
      items:{ pilgrim_staff:'“A pilgrim\'s staff. Pilgrims used to reach the river. Ask me how many reach it now.”' },
      defeat:'“Let it... rain...”' } },

  unrelieved: { id:'unrelieved', name:'Ser Maud the Unrelieved', sprite:'en_archer', guardian:true, tier:1, tags:['undead'],
    hp:165, atk:19, def:14, mag:5, spd:8, gold:[30,50],
    moves:[ {name:'Bulwark',type:'defend',shield:'def2',w:2},
            {name:'Halberd Sweep',type:'attack',power:19,w:3},
            {name:'Pin to the Wall',type:'attack',power:16,effect:{stun:0.45},w:2},
            {name:'Execute',type:'attack',power:19,execute:0.22,w:2},
            {name:'Hold the Line',type:'buff',effect:{shield:'def2',atkbuff:{amt:5,turns:3}},w:1},
            {name:'Revenge',type:'attack',power:21,effect:{crit:0.3},w:1} ],
    dialogue:{
      intro:'“I asked for relief at dusk. I asked again at midnight. It is a hundred and six years past midnight and I have stopped asking, but I have not stopped standing here.”',
      class:{ knight:'“You are the relief. You are a century late and you are not wearing our colours, but you are the relief, and I intend to test you for it.”',
              rogue:'“The last one who came up this stair unannounced went back down it in pieces. Announce yourself.”',
              mage:'“Sorcery held the east wall for a fortnight and then the east wall fell anyway.”',
              warden:'“Say the words over me when this is done. That is all I want and I will still try to kill you first.”',
              necromancer:'“Do not raise the garrison. They have earned the lying down.”',
              alchemist:'“Have you anything for a hundred years of standing? No. I did not think so.”' },
      marked:'“Deserter\'s ink. I know that colour. We hanged it.”',
      hallowed:'“You would have made a good officer. That is not a compliment, down here.”',
      items:{ garrison_bulwark:'“That shield is ours. Where did you — no. No, I will simply take it back.”' },
      defeat:'“Relieved... at last...”' } },

  silencekeeper: { id:'silencekeeper', name:'Abbot Sile, Who Kept the Silence', sprite:'npc_bonechoir', guardian:true, tier:1, tags:['spirit'],
    hp:155, atk:13, def:12, mag:17, spd:9, gold:[30,50],
    moves:[ {name:'Holy Bolt',type:'magic',power:16,holy:true,w:3},
            {name:'The Rule of Silence',type:'magic',power:11,effect:{stun:0.45},w:2},
            {name:'Blessed Hammer',type:'magic',power:12,hits:2,acc:0.9,holy:true,w:2},
            {name:'Penance',type:'magic',power:12,effect:{weaken:{amt:6,turns:3}},w:2},
            {name:'Warding Prayer',type:'buff',effect:{shield:'def2',regen:{amt:6,turns:3}},w:1},
            {name:'Mend',type:'heal',healFlat:18,w:1} ],
    dialogue:{
      intro:'“Do not speak. The Rule holds in this cloister whether or not there is anyone left to keep it, and I have kept it alone for three hundred years. You may fight. You may not talk.”',
      class:{ knight:'“Your order shouts its vows. Ours whispered them once and then stopped. Guess which one is still standing.”',
              rogue:'“You move quietly. It is the only courtesy anyone has shown this house in a century.”',
              mage:'“Incantation is speech. Everything you know how to do is a violation.”',
              warden:'“You pray aloud. Loudly. To be heard. Ours was never for being heard.”',
              necromancer:'“The brothers are silent and they will remain silent. Do not put words in them.”',
              alchemist:'“The stillroom is through there. It has been waiting for someone competent.”' },
      marked:'“You brought noise down the stair with you. The whole hunt of it.”',
      hallowed:'“You would have been welcome, before. The Rule does not have a clause for welcome any more.”',
      items:{ ring_of_honor:'“Vanity, worn on the hand. We took ours off.”' },
      defeat:'“...”' } },
});

// which legend bars each biome's stair

// Which throne holds the bottom of a descent — one is drawn per run, and it
// decides both the final biome and what is sitting in it.
const BOSSES = ['boss','boss_choir','boss_keep','boss_knife','boss_kiln'];
const BIOME_GUARDIANS = { catacombs:'morr', fungal:'mycel', drowned:'brine', ember:'pyraxes', ossuary:'curator', umbral:'firstshadow',
  dungeon:'turnkey', desert:'thirstpriest', castle:'unrelieved', cathedral:'omen', monastery:'silencekeeper' };

// ---------- Items ----------
const ITEMS = {
  rusted_blade:   { id:'rusted_blade', name:'Rusted Blade', slot:'weapon', mods:{atk:3}, tier:1, desc:'Pitted, but it still bites.' },
  iron_sword:     { id:'iron_sword', name:'Iron Sword', slot:'weapon', mods:{atk:6}, tier:1, desc:'Honest steel.' },
  bone_cleaver:   { id:'bone_cleaver', name:'Bone Cleaver', slot:'weapon', mods:{atk:8}, tier:2, desc:'Carved from something large.' },
  witch_wand:     { id:'witch_wand', name:'Witch Wand', slot:'weapon', mods:{mag:7}, tier:2, desc:'Hums with borrowed power.' },
  war_pick:       { id:'war_pick', name:'War Pick', slot:'weapon', mods:{atk:5,def:2}, tier:2, desc:'Punches through bone.' },
  soul_edge:      { id:'soul_edge', name:'Soul Edge', slot:'weapon', mods:{atk:11}, tier:3, desc:'It whispers when it drinks.' },
  oathblade:      { id:'oathblade', name:'Oathblade', slot:'weapon', mods:{atk:7}, flag:{honorMul:1.25}, tier:2, desc:'Sworn never to serve cruelty; honor rings louder in its wielder.' },
  aureate_edge:   { id:'aureate_edge', name:'Aureate Edge', slot:'weapon', mods:{atk:9,mag:3}, tier:3, desc:'Taken from a saint of the Choir. It still judges, but quieter.' },
  grave_dagger:   { id:'grave_dagger', name:'Grave Dagger', slot:'weapon', mods:{atk:4,spd:1}, tier:1, desc:'Quick as regret.' },
  pilgrim_staff:  { id:'pilgrim_staff', name:'Pilgrim\'s Staff', slot:'weapon', mods:{mag:4,sp:1}, tier:1, desc:'Worn smooth by ten thousand miles of prayer.' },
  hexed_scythe:   { id:'hexed_scythe', name:'Hexed Scythe', slot:'weapon', mods:{atk:6,mag:4}, tier:2, desc:'It harvests more than wheat.' },
  marrow_maul:    { id:'marrow_maul', name:'Marrow Maul', slot:'weapon', mods:{atk:10,hp:6,spd:-1}, tier:3, desc:'A femur of something that should not have femurs.' },
  stormbrand:     { id:'stormbrand', name:'Stormbrand', slot:'weapon', mods:{atk:8,spd:2}, tier:3, desc:'It hums before the thunder that never comes.' },

  leather:        { id:'leather', name:'Leather Jerkin', slot:'armor', mods:{def:3}, tier:1, desc:'Supple, worn, warm.' },
  padded_doublet: { id:'padded_doublet', name:'Padded Doublet', slot:'armor', mods:{def:2,hp:4}, tier:1, desc:'Someone stitched care into every seam.' },
  chainmail:      { id:'chainmail', name:'Chainmail', slot:'armor', mods:{def:6,hp:6}, tier:2, desc:'Rings softly as you walk.' },
  plate:          { id:'plate', name:'Dented Plate', slot:'armor', mods:{def:9,hp:10,spd:-2}, tier:2, desc:'Heavy, but it saves lives.' },
  shadow_cloak:   { id:'shadow_cloak', name:'Shadow Cloak', slot:'armor', mods:{def:4,spd:3}, tier:2, desc:'The dark clings to it.' },
  bone_lamellar:  { id:'bone_lamellar', name:'Bone Lamellar', slot:'armor', mods:{def:7,spd:-1}, tier:2, desc:'Plates of polished femur, laced with sinew.' },
  witchweave:     { id:'witchweave', name:'Witchweave Robe', slot:'armor', mods:{def:3,mag:4,sp:2}, tier:2, desc:'Spun from shadows on a moonless loom.' },
  gravewarden:    { id:'gravewarden', name:'Gravewarden Plate', slot:'armor', mods:{def:11,hp:12,spd:-3}, tier:3, desc:'Its last owner still guards a stair somewhere.' },

  ring_of_honor:  { id:'ring_of_honor', name:'Ring of Honor', slot:'trinket', mods:{}, flag:{honorMul:1.5}, tier:1, desc:'Deeds ring louder while worn.' },
  bloodstone:     { id:'bloodstone', name:'Bloodstone', slot:'trinket', mods:{}, flag:{lifesteal:0.15}, tier:2, desc:'Your blows drink a little life.' },
  charm_of_vigor: { id:'charm_of_vigor', name:'Charm of Vigor', slot:'trinket', mods:{hp:14}, tier:1, desc:'A steady, stubborn heartbeat.' },
  witch_eye:      { id:'witch_eye', name:'Witch Eye', slot:'trinket', mods:{mag:5,sp:3}, tier:2, desc:'It watches the unseen.' },
  coward_totem:   { id:'coward_totem', name:'Coward\'s Totem', slot:'trinket', mods:{def:3}, tier:1, desc:'Guilt, cast in cold metal.' },
  lucky_coin:     { id:'lucky_coin', name:'Lucky Coin', slot:'trinket', mods:{spd:2}, tier:1, desc:'It always lands on its edge.' },
  iron_rations:   { id:'iron_rations', name:'Iron Rations', slot:'trinket', mods:{hp:6,sp:2}, tier:1, desc:'Hard bread, harder resolve.' },
  grave_idol:     { id:'grave_idol', name:'Grave Idol', slot:'trinket', mods:{mag:3,hp:8}, tier:2, desc:'A small god for small mercies.' },
  hunters_fang:   { id:'hunters_fang', name:'Hunter\'s Fang', slot:'trinket', mods:{atk:4,spd:2}, tier:2, desc:'Taken from something that took from others.' },
  saints_knuckle: { id:'saints_knuckle', name:'Saint\'s Knucklebone', slot:'trinket', mods:{hp:10,sp:2}, flag:{honorMul:1.25}, tier:3, desc:'One relic the Curator never catalogued.' },
  nights_eye:     { id:'nights_eye', name:'Night\'s Eye', slot:'trinket', mods:{mag:6,spd:3}, tier:3, desc:'It blinks when you are not looking.' },
  butchers_cleaver:{ id:'butchers_cleaver', name:'Butcher\'s Cleaver', slot:'weapon', mods:{atk:9}, flag:{lifesteal:0.12}, tier:3, desc:'Still warm. It has never once been washed.' },
  soulstone:      { id:'soulstone', name:'Soulstone', slot:'trinket', mods:{mag:6,sp:2}, tier:3, desc:'A shard of burning red. It whispers your name in a voice you almost know.' },

  // ---- Uniques: one-of-a-kind, and the passive is the point ----
  widowmaker:     { id:'widowmaker', name:'Widowmaker', slot:'weapon', mods:{atk:7,spd:2}, tier:3, rarity:'unique',
    passive:{ crit:0.18 }, desc:'Notched once for every name it took. Passive: every blow finds the gap — +18% critical chance.' },
  gluttons_girdle:{ id:'gluttons_girdle', name:"Glutton's Girdle", slot:'armor', mods:{def:5,hp:14}, tier:3, rarity:'unique',
    passive:{ foodMult:0.5 }, desc:'Someone was very hungry, once, and stopped being. Passive: you burn food half as fast.' },
  reapers_tithe:  { id:'reapers_tithe', name:"Reaper's Tithe", slot:'trinket', mods:{mag:4}, tier:3, rarity:'unique',
    passive:{ soulMult:1.5 }, desc:'It counts what dies near you. Passive: every deed pays 50% more Souls.' },
  pilgrims_mercy: { id:'pilgrims_mercy', name:"Pilgrim's Mercy", slot:'trinket', mods:{hp:10,def:2}, tier:3, rarity:'unique',
    passive:{ regen:0.5 }, desc:'Warm to the touch, always. Passive: the walking itself mends you.' },
  dread_aegis:    { id:'dread_aegis', name:'Dread Aegis', slot:'armor', mods:{def:8,spd:-1}, tier:3, rarity:'unique',
    passive:{ openShield:2 }, desc:'It braces before you do. Passive: you enter every fight already shielded.' },
  ruin_brand:     { id:'ruin_brand', name:'Brand of Ruin', slot:'weapon', mods:{atk:6,mag:4}, tier:3, rarity:'unique',
    passive:{ dmg:1.20 }, desc:'It wants the fight to end badly for someone. Passive: all your damage lands 20% harder.' },

  // ---- Set: The Pauper's Vigil — three worthless things, never meant to be parted ----
  pauper_rod:  { id:'pauper_rod', name:"Pauper's Rod", slot:'weapon', mods:{atk:1}, tier:1, rarity:'set', set:'pauper',
    desc:'A stick. Genuinely, a stick. Worth nothing alone.' },
  pauper_rags: { id:'pauper_rags', name:"Pauper's Rags", slot:'armor', mods:{def:1}, tier:1, rarity:'set', set:'pauper',
    desc:'Cloth that has given up. Worth nothing alone.' },
  pauper_bowl: { id:'pauper_bowl', name:"Pauper's Bowl", slot:'trinket', mods:{hp:2}, tier:1, rarity:'set', set:'pauper',
    desc:'Empty. It has always been empty. Worth nothing alone.' },

  // ---- Set: Carrion Communion — the crow, the shroud and the bell ----
  carrion_hook:   { id:'carrion_hook', name:'Carrion Hook', slot:'weapon', mods:{atk:2}, tier:1, rarity:'set', set:'carrion',
    desc:'A meat-hook with manners. Worth little alone.' },
  carrion_shroud: { id:'carrion_shroud', name:'Carrion Shroud', slot:'armor', mods:{def:1,hp:2}, tier:1, rarity:'set', set:'carrion',
    desc:'It has been worn by the dead, but only briefly. Worth little alone.' },
  carrion_bell:   { id:'carrion_bell', name:'Carrion Bell', slot:'trinket', mods:{sp:1}, tier:1, rarity:'set', set:'carrion',
    desc:'It rings when something nearby stops breathing. Worth little alone.' },

  // ---- Legendary relics: a passive gift, and a power you may call on once per battle ----
  wellspring_stave:{ id:'wellspring_stave', name:'The Wellspring', slot:'weapon', mods:{mag:8,sp:3}, tier:3, rarity:'legendary',
    passive:{ spRegen:5, foodMult:2 },
    desc:'It gives and gives, and takes the price out of your belly. Passive: your focus refills as you walk — and the hunger comes twice as fast.',
    active:{ name:'Overdraw', desc:'Tear the well open — your focus floods back, and it is paid for in blood.',
      action:{ name:'Overdraw', type:'buff', selfDmg:12, spGain:99 } } },
  skinners_needle:{ id:'skinners_needle', name:'Skinner\'s Needle', slot:'weapon', mods:{atk:8}, flag:{lifesteal:0.1}, tier:3,
    desc:'It sews shut, and it sews open. Passive: drinks a little of every wound.',
    active:{ name:'Unstitch', desc:'Open every seam of the foe — weakness and deep bleeding.',
      action:{ name:'Unstitch', type:'magic', power:10, effect:{ weaken:{amt:8,turns:3}, poison:{dmg:6,turns:3} } } } },
  starveling_crown:{ id:'starveling_crown', name:'Crown of the Starveling', slot:'trinket', mods:{hp:12,mag:3}, tier:3,
    desc:'A crown of fused finger-bones. Passive: you are harder to empty.',
    active:{ name:'Devour', desc:'Bite with the King\'s own hunger — heal for all damage dealt.',
      action:{ name:'Devour', type:'attack', power:16, effect:{ lifesteal:1.0 } } } },
  velvet_shroud:  { id:'velvet_shroud', name:'Velvet Shroud', slot:'armor', mods:{def:6,spd:2}, tier:3,
    desc:'Warm as a held breath. Passive: the dark mistakes you for one of its own.',
    active:{ name:'Beguile', desc:'One adoring glance — the foe forgets to fight.',
      action:{ name:'Beguile', type:'magic', power:6, effect:{ stun:1.0, weaken:{amt:4,turns:3} } } } },
  gloamheart:     { id:'gloamheart', name:'Gloamheart', slot:'trinket', mods:{mag:5,hp:8}, tier:3,
    desc:'The Gloamlord\'s heart, still beating to a slower clock. Passive: old power seeps into you.',
    active:{ name:'Gloamfire', desc:'Unleash the Warden\'s cold flame in a single breath.',
      action:{ name:'Gloamfire', type:'magic', power:22, effect:{ poison:{dmg:5,turns:2} } } } },
  choir_reliquary:{ id:'choir_reliquary', name:'Reliquary of the Gilded Verdict', slot:'trinket', mods:{mag:4,def:3,hp:6}, tier:3,
    desc:'Taken off the Sepulchre. Passive: the Choir\'s own warrant, turned around.',
    active:{ name:'The Verdict', desc:'Read the sentence out. It lands like a hammer.',
      action:{ name:'The Verdict', type:'magic', power:20, holy:true, effect:{ weaken:{amt:6,turns:3} } } } },
  garrison_bulwark:{ id:'garrison_bulwark', name:'The Last Garrison', slot:'armor', mods:{def:11,hp:14}, tier:3,
    desc:'Lord Vantage\'s shield, still braced against a relief that never came.',
    active:{ name:'Hold the Line', desc:'Set yourself the way he did, and do not move.',
      action:{ name:'Hold the Line', type:'buff', effect:{ shield:'def2', atkbuff:{amt:6,turns:3} } } } },
  thousandth_knife:{ id:'thousandth_knife', name:'The Thousandth Knife', slot:'weapon', mods:{atk:10,spd:3}, flag:{crit:0.12}, tier:3,
    desc:'One knife out of a thousand, and the only one that ever came back out of the Blackwood.',
    active:{ name:'Backstab', desc:'The opening it always knew you would leave.',
      action:{ name:'Backstab', type:'attack', power:24, effect:{ crit:0.4 } } } },
  kiln_ember:    { id:'kiln_ember', name:'The Unbanked Ember', slot:'trinket', mods:{mag:6,sp:2}, tier:3,
    desc:'Four hundred years of banked fire, in a coal that has not once gone cool.',
    active:{ name:'Unbank', desc:'Let it up all at once. It has been waiting.',
      action:{ name:'Unbank', type:'magic', power:23, effect:{ poison:{dmg:7,turns:3} } } } },
};

const CONSUMABLES = {
  potion_heal:  { id:'potion_heal', name:'Draught of Mending', heal:26, desc:'Restores 26 HP in combat.' },
  potion_focus: { id:'potion_focus', name:'Draught of Focus', sp:5, desc:'Restores 5 SP — thought sharpened back into a blade.' },
  ration:      { id:'ration', name:'Grave-Bread', food:35, desc:'Coarse dark bread, baked by no one you want to meet. Restores 35 FOOD.' },
  strange_meat:{ id:'strange_meat', name:'Strange Meat', food:60, risky:true, desc:'Unlabeled, generous, still faintly warm. Restores 60 FOOD. Ask nothing.' },
};

// ---------- Quest herbs: what the potion-maker sends you gathering ----------
// Each floor's request draws three of these; the last is the one that only
// pushes up where the floor's keeper (its guardian) falls.
const PLANTS = {
  // `use` is what a non-brewer gets when they crush an extra herb on the spot —
  // they can carry only a few of each; the Alchemist alone hoards them to brew
  bloodroot:  { name:'Bloodroot',      glyph:'✿', color:'#c05070', use:{ hp:8 } },
  gravemoss:  { name:'Gravemoss',      glyph:'❧', color:'#7fae3a', use:{ food:10 } },
  wickthorn:  { name:'Wickthorn',      glyph:'✤', color:'#c8a24a', use:{ sp:6 } },
  nightcap:   { name:'Nightcap',       glyph:'❀', color:'#9a5cc0', use:{ sp:8 } },
  ashen_lily: { name:'Ashen Lily',     glyph:'✽', color:'#c9bfd6', use:{ hp:6 } },
  weepwort:   { name:'Weepwort',       glyph:'❦', color:'#7fb0d0', use:{ sp:8 } },
  gallowvine: { name:'Gallowvine',     glyph:'☙', color:'#6fbf6a', use:{ food:10 } },
};

// ---------- Potions the Alchemist brews from gathered plants ----------
// cat: offense | debuff | buff | food. Numeric fields written [base, intScale]
// scale with the brewer's INT (her max mana). verb colours the log line.
// plants: herbs a brew costs. Every brew raises INT by 2.
// intReq: the INT level a recipe unlocks at. She begins knowing only the starter
// (intReq 0); the twelve tiered recipes open as her INT climbs to 10/20/30/40,
// and their potency and effects scale up with the INT she brings to them.
const POTIONS = {
  // --- her first and only starting recipe ---
  starter_tonic:   { id:'starter_tonic',    name:'Bitter Tonic',    cat:'offense', verb:'hurl',  plants:1, intReq:0,  dmg:[10,0.12], selfHeal:[4,0.08], desc:'Her first recipe. A splash that scalds the foe and steadies the hand — 10 damage, and it mends you 4.' },
  // --- INT 10 ---
  flask_vitriol:   { id:'flask_vitriol',    name:'Vitriol Flask',   cat:'offense', verb:'hurl',  plants:2, intReq:10, dmg:[8,0.7],  effect:{ weaken:{amt:4,turns:2} }, desc:'Acid that eats armour and nerve alike.' },
  tonic_ward:      { id:'tonic_ward',       name:'Warding Tonic',   cat:'buff',    verb:'pour',  plants:2, intReq:10, buff:{ shield:[5,0.7] }, desc:'A skin of glass drawn over the skin you have.' },
  nourishing_stew: { id:'nourishing_stew',  name:'Nourishing Stew', cat:'food',    verb:'serve', plants:1, intReq:10, food:60, desc:'The one drink that actually feeds you.' },
  // --- INT 20 ---
  flask_pyre:      { id:'flask_pyre',       name:'Firebomb',        cat:'offense', verb:'hurl',  plants:2, intReq:20, dmg:[12,1.0], desc:'Bottled ignition. Throw it, then look away.' },
  vial_miasma:     { id:'vial_miasma',      name:'Miasma Vial',     cat:'debuff',  verb:'hurl',  plants:2, intReq:20, effect:{ poison:{dmg:5,turns:3}, weaken:{amt:3,turns:3} }, desc:'A cloud that rots resolve and flesh together.' },
  brew_vigor:      { id:'brew_vigor',       name:'Brew of Vigor',   cat:'buff',    verb:'pour',  plants:2, intReq:20, buff:{ atkbuff:[3,0.35], shield:[4,0.6] }, desc:'Liquid nerve: strength, and a guard to spend it behind.' },
  // --- INT 30 ---
  elixir_mend:     { id:'elixir_mend',      name:'Mending Elixir',  cat:'buff',    verb:'pour',  plants:2, intReq:30, heal:[10,1.0], desc:'Closes a wound the way a good night closes a bad day.' },
  vial_torpor:     { id:'vial_torpor',      name:'Torpor Draught',  cat:'debuff',  verb:'hurl',  plants:2, intReq:30, effect:{ stun:0.6, weaken:{amt:3,turns:2} }, desc:'Sleep, bottled — for a moment, at least.' },
  vial_solvent:    { id:'vial_solvent',     name:'Solvent Vial',    cat:'debuff',  verb:'hurl',  plants:2, intReq:30, effect:{ weaken:{amt:8,turns:3} }, desc:'It unstitches whatever holds a thing together.' },
  // --- INT 40 ---
  flask_shatter:   { id:'flask_shatter',    name:'Shatter-Glass',   cat:'offense', verb:'hurl',  plants:3, intReq:40, dmg:[16,1.3], effect:{ weaken:{amt:5,turns:2} }, desc:'A flask that flowers into a hundred edges.' },
  draught_fervor:  { id:'draught_fervor',   name:'Draught of Fervor',cat:'buff',   verb:'pour',  plants:3, intReq:40, buff:{ atkbuff:[6,0.5], regen:[2,0.25] }, desc:'Courage you can pour. It does not last, but it lands.' },
  cordial_marrow:  { id:'cordial_marrow',   name:'Marrow Cordial',  cat:'food',    verb:'serve', plants:2, intReq:40, food:100, heal:[8,0.5], desc:'Thick, warm, and best not thought about. Fills you and mends you.' },
};

// ---------- Item sets ----------
// Each piece is deliberately the feeblest thing in its slot. Wear all three and
// the set outclasses any legendary — the whole point is the commitment.
const SETS = {
  pauper: { name:"The Pauper's Vigil", pieces:['pauper_rod','pauper_rags','pauper_bowl'],
    mods:{ atk:13, def:11, hp:34, mag:6, sp:3 },
    passive:{ lifesteal:0.20, foodMult:0.5 },
    desc:'Three worthless things that were never meant to be parted. Together: +13 ATK, +11 DEF, +34 HP, +6 MAG, +3 SP, blows drink 20%, and hunger comes half as fast.' },
  carrion: { name:'Carrion Communion', pieces:['carrion_hook','carrion_shroud','carrion_bell'],
    mods:{ atk:15, def:8, hp:22, spd:3 },
    passive:{ crit:0.20, dmg:1.15 },
    desc:'The hook, the shroud and the bell. Together: +15 ATK, +8 DEF, +22 HP, +3 SPD, +20% critical chance, and all damage 15% harder.' },
};

// ---------- Item rarity ----------
const RARITY = {
  common:    { name:'Common',    color:'#c9bfd6' },
  rare:      { name:'Rare',      color:'#7fb0d0' },
  unique:    { name:'Unique',    color:'#d0a84e' },
  legendary: { name:'Legendary', color:'#c05070' },
  set:       { name:'Set',       color:'#63b7a6' },
};

// item pools by tier for treasure rolls
const ITEM_POOL = {
  1:['rusted_blade','iron_sword','grave_dagger','pilgrim_staff','leather','padded_doublet','ring_of_honor','charm_of_vigor','coward_totem','lucky_coin','iron_rations',
     'pauper_rod','pauper_rags','pauper_bowl','carrion_hook','carrion_shroud','carrion_bell'],
  2:['bone_cleaver','witch_wand','war_pick','hexed_scythe','chainmail','plate','shadow_cloak','bone_lamellar','witchweave','bloodstone','witch_eye','grave_idol','hunters_fang',
     'pauper_rod','pauper_rags','pauper_bowl','carrion_hook','carrion_shroud','carrion_bell'],
  3:['soul_edge','marrow_maul','stormbrand','gravewarden','plate','witch_eye','bloodstone','saints_knuckle','nights_eye',
     'widowmaker','gluttons_girdle','reapers_tithe','pilgrims_mercy','dread_aegis','ruin_brand','wellspring_stave'],
};

// ---------- Honor tiers ----------
const HONOR_TIERS = [
  { min:60,  name:'Radiant',   color:'#63b7a6' },
  { min:20,  name:'Honorable', color:'#8fce9c' },
  { min:-19, name:'Neutral',   color:'#c9bfd6' },
  { min:-59, name:'Tainted',   color:'#c08a5a' },
  { min:-999,name:'Vile',      color:'#c05070' },
];

// ---------- Event map glyphs ----------
// Each encounter shows what it is on the floor rather than a blank "!", so you
// can read the room before you walk into it.
const EVENT_ICONS = {
  well:         { g:'☽', c:'#7fb0d0' },   cage:        { g:'⌗', c:'#c08a5a' },
  beggar:       { g:'☂', c:'#c9bfd6' },   shrine:      { g:'†', c:'#d0a84e' },
  mirror:       { g:'◉', c:'#9a5cc0' },   hanged:      { g:'‡', c:'#c05070' },
  child:        { g:'✿', c:'#e0b0c0' },   oathblade:   { g:'⚔', c:'#c9bfd6' },
  lightbearer:  { g:'✦', c:'#7fd0c2' },   envoy:       { g:'⚖', c:'#c05070' },
  butcherdoor:  { g:'⚑', c:'#c03636' },   namelesscoin:{ g:'¤', c:'#d0a84e' },
  larder:       { g:'⌂', c:'#c08a5a' },   oathless:    { g:'◈', c:'#9a5cc0' },
  sinclair:     { g:'♥', c:'#c05070' },
  hollowprince: { g:'♛', c:'#9a5cc0' },   seamparlor:  { g:'✂', c:'#c05070' },
  banquet:      { g:'♨', c:'#d0a84e' },   velvetchapel:{ g:'☾', c:'#9a5cc0' },
  sporewife:    { g:'❀', c:'#7fae3a' },   ferryman:    { g:'≈', c:'#7fb0d0' },
  forgewidow:   { g:'⚒', c:'#e08030' },   bonechoir:   { g:'♪', c:'#eae0f0' },
  lamplighter:  { g:'☀', c:'#ffcf5a' },   overgrown:   { g:'⚐', c:'#7fae3a' },
  bride:        { g:'♡', c:'#7fb0d0' },   cindermonk:  { g:'✹', c:'#e08030' },
  saint:        { g:'☩', c:'#d0a84e' },   wolfmother:  { g:'▲', c:'#c08a5a' },
};

// ---------- What the dark says to you ----------
// One of these sits under the title. None of them are encouraging, because
// nothing down here is.
const DISCOURAGEMENTS = [
  'Everyone who came down here was also going to be the one who came back.',
  'You are not the first. You are barely worth counting.',
  'The depths do not need you. They will take you regardless.',
  'Bring a name worth losing, or do not bother.',
  'Nothing down here has ever been impressed.',
  'Others have gone further with less. They are still down there.',
  'The stair only goes one way, and it is not the way you think.',
  'Your bones will be indistinguishable from the rest.',
  'Whatever you are hoping to find has already found someone else.',
  'You will die tired, and it will not mean anything.',
  'Turn back. You will not, but you were told.',
  'The dark has been doing this much longer than you have.',
];
// What it says when you walk out on your own descent.
const DESERTIONS = [
  'Was that all you had?',
  "You shouldn't have come down for this little.",
  'Disappointing.',
  'Pathetic.',
  'You called that a descent.',
  'The dark barely noticed you were in it.',
  'Not even worth burying.',
  'You walked out. It was always going to be walking out.',
];

// ---------- Events (honor-driven encounters) ----------
// perceive(honor) => which variant to show. Default: honor>=0 ? 'clear' : 'warped'
const clearIfHonored = (h) => h >= 0 ? 'clear' : 'warped';
// a few encounters answer to who you are rather than what you've done
const byClass = (cls) => () => (typeof G !== 'undefined' && G.player && G.player.classId === cls) ? 'clear' : 'stranger';

const EVENTS = {
  well: {
    name:'The Woman at the Well',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_woman',
        text:"By a moss-choked well, a woman in grey draws water. She looks up — startled, then softening. “Traveler. This deep, the living are rare. You look hurt.”",
        choices:[
          { label:'Accept her help', to:'well_help' },
          { label:'Ask what waits below', to:'well_ask' },
          { label:'Leave her in peace', to:'well_leave' },
        ] },
      warped:{ art:'npc_silhouette',
        text:"By a moss-choked well, a shrouded SILHOUETTE hunches over the black water. It does not move. Every instinct you have left screams that it will lunge the moment you look away.",
        choices:[
          { label:'Strike first', to:'well_attack', kind:'danger' },
          { label:'Approach slowly, blade lowered', to:'well_approach' },
          { label:'Back away into the dark', to:'well_leave' },
        ] },
    },
    outcomes:{
      well_help:   { text:"She binds your wounds with clean cloth and a whispered word. “Mercy is a lantern down here. Don’t let it gutter out.” You feel renewed.", effects:{ heal:30, honor:8, codex:'well_mercy' } },
      well_ask:    { text:"“The Warden of Bone keeps the Gloamthrone below,” she murmurs. “It was a man once. So were we all.” She presses three coins into your palm.", effects:{ gold:12, honor:3, codex:'well_lore' } },
      well_leave:  { text:"You leave the well behind. The dark swallows the sound of dripping water.", effects:{} },
      well_attack: { text:"Your blade finds her before your eyes do. The ‘silhouette’ was only a frightened woman drawing water. Her blood darkens the well’s rim. Something in you curdles — but her purse is heavy.", effects:{ gold:22, honor:-14, codex:'well_bloodied', reveal:'A steadier soul would have seen a different face here.' } },
      well_approach:{ text:"As you near, the shadow peels away like wet cloth — a woman, trembling, a water-skin clutched to her chest. Your restraint spared her life. “I thought you were one of THEM,” she breathes, and blesses you.", effects:{ heal:20, honor:12, codex:'well_truth' } },
    }
  },

  cage: {
    name:'The Caged Thing',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_cage',
        text:"A rusted cage hangs from the ceiling. Inside, a wounded wolf whines, one paw pinned beneath fallen stone. Its eyes track you — afraid, not hostile.",
        choices:[
          { label:'Free the wolf', to:'cage_free' },
          { label:'End its suffering', to:'cage_kill', kind:'danger' },
          { label:'Leave it be', to:'cage_leave' },
        ] },
      warped:{ art:'npc_cage',
        text:"A rusted cage hangs from the ceiling. Inside, a SNARLING BEAST thrashes and foams, straining the bars toward you. Kill it before it works loose — surely it would tear out your throat.",
        choices:[
          { label:'Kill it through the bars', to:'cage_kill', kind:'danger' },
          { label:'Look closer before you strike', to:'cage_look' },
          { label:'Leave it be', to:'cage_leave' },
        ] },
    },
    outcomes:{
      cage_free: { text:"You lever the stone aside. The wolf limps free, circles you once — then falls in at your side, a wary guardian. Your resolve hardens.", effects:{ atk:3, honor:10, codex:'cage_freed' } },
      cage_kill: { text:"Steel ends it. Whatever it was, it is quiet now. You pry a few teeth loose — worth coin to the right buyer.", effects:{ gold:14, honor:-8, codex:'cage_slain' } },
      cage_look: { text:"You lower your blade and truly look. Not a monster — a wolf, half-starved, terrified. Shame cools your blood. You free it, and it limps gratefully to your side.", effects:{ atk:3, honor:12, codex:'cage_freed', reveal:'Fear painted a monster over something that only needed help.' } },
      cage_leave:{ text:"You leave it in its cage. Its cries follow you a long, long way.", effects:{ honor:-2 } },
    }
  },

  beggar: {
    name:'The Beggar in the Dark',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_beggar',
        text:"A ragged figure huddles against the wall, hand outstretched. “Please — a coin, a crust. I’ve been lost so long I’ve forgotten the color of the sun.”",
        choices:[
          { label:'Give generously (10 gold)', to:'beg_give' },
          { label:'Share a little (4 gold)', to:'beg_share' },
          { label:'Ignore him', to:'beg_ignore' },
        ] },
      warped:{ art:'npc_beggar',
        text:"A ragged shape peels off the wall, hand grasping toward you. “Give,” it rasps. “Give. Give.” Its fingers seem too long. Is it begging — or reaching?",
        choices:[
          { label:'Cut it down', to:'beg_attack', kind:'danger' },
          { label:'Give it a coin, and watch', to:'beg_share' },
          { label:'Ignore it', to:'beg_ignore' },
        ] },
    },
    outcomes:{
      beg_give:  { text:"You press a fistful of coin into his hand. He weeps. “Bless you. Here — I’ve carried this too long.” He slips a small vial into your palm.", effects:{ gold:-10, honor:10, potion:'potion_heal', codex:'beg_alms' } },
      beg_share: { text:"You share what little you can spare. He nods, and folds something warm into your hand. “For luck, where there’s none.”", effects:{ gold:-4, honor:5, item:'charm_of_vigor', codex:'beg_alms' } },
      beg_ignore:{ text:"You step past. The whispering follows you until the dark eats it.", effects:{ honor:-3 } },
      beg_attack:{ text:"Your blade takes him mid-plea. Beneath the rags: a starved old man, coins spilling from his slack hand. The ‘reaching’ was only need. You gather the gold he might simply have given you.", effects:{ gold:16, honor:-12, codex:'beg_blood', reveal:'He would have given freely to a kinder traveler.' } },
    }
  },

  shrine: {
    name:'Shrine of the Fallen',
    perceive:()=> 'clear',
    variants:{
      clear:{ art:'npc_shrine',
        text:"A crude shrine of stacked skulls, a single candle guttering. Carved beneath: GIVE, AND BE GIVEN. The air hums with old, hungry power.",
        choices:[
          { label:'Offer your honor for power', to:'shr_offer', kind:'danger' },
          { label:'Purify the shrine (10 gold)', to:'shr_purify' },
          { label:'Pray quietly', to:'shr_pray' },
          { label:'Desecrate it for relics', to:'shr_desec', kind:'danger' },
        ] },
    },
    outcomes:{
      shr_offer:  { text:"You speak the price aloud. Cold pours into your marrow — strength, bought with something you will not get back.", effects:{ honor:-20, atk:4, mag:4, codex:'shr_pact' } },
      shr_purify: { text:"You spend coin and breath to name each skull and lay it to rest. The candle steadies. The hum fades to something like peace, and it warms you.", effects:{ gold:-10, honor:12, heal:16, codex:'shr_rest' } },
      shr_pray:   { text:"You kneel and pray for those who fell here. Nothing answers — but your mind clears, and your reserves return.", effects:{ honor:3, sp:99, codex:'shr_rest' } },
      shr_desec:  { text:"You crack the skulls open for the trinkets tucked inside. The candle gutters out. You are richer, and colder.", effects:{ gold:20, honor:-15, codex:'shr_pact' } },
    }
  },

  mirror: {
    name:'The Mirror of Truth',
    perceive:()=> 'clear',
    variants:{
      clear:{ art:'npc_mirror',
        text:"A tall mirror stands impossibly clean amid the rot. Your reflection meets your eyes — but it is not quite you.",
        choices:[
          { label:'Gaze into it', to:'mir_gaze' },
          { label:'Shatter it', to:'mir_break', kind:'danger' },
          { label:'Turn away', to:'mir_leave' },
        ] },
    },
    // mir_gaze resolves by honor tier in code (special-cased). These are fallbacks/records.
    outcomes:{
      mir_gaze:  { special:'mirror_gaze', text:"", effects:{} },
      mir_break: { text:"You shatter your own face. Shards scatter like teeth. You feel lighter — and colder — as the silvered glass fills your purse.", effects:{ gold:8, honorToward:0, codex:'mir_shatter' } },
      mir_leave: { text:"You turn away. Whatever it wanted to show you, it keeps.", effects:{} },
    }
  },

  hanged: {
    name:'The Gibbet',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_gibbet',
        text:"A man hangs from a rusted gibbet, long dead, turning slowly in the dark air. A pilgrim's medallion glints at his throat.",
        choices:[
          { label:'Cut him down and speak a rite', to:'hang_rite' },
          { label:'Search him, then lay him to rest', to:'hang_search' },
          { label:'Leave him to the dark', to:'hang_leave' },
        ] },
      warped:{ art:'npc_gibbet',
        text:"A swollen shape sways from a gibbet, pockets fat with the dead's forgotten coin. No one is watching. No one ever is, down here.",
        choices:[
          { label:'Strip the corpse of everything', to:'hang_loot', kind:'danger' },
          { label:'Cut him down first, then look', to:'hang_search' },
          { label:'Leave him', to:'hang_leave' },
        ] },
    },
    outcomes:{
      hang_rite:   { text:"You lower him gently and speak the words for the unburied dead. The turning stops. A strange peace settles in your chest.", effects:{ honor:9, sp:99, codex:'hang_rite' } },
      hang_search: { text:"You take only what the dead no longer need, then lay him flat with his hands folded. His medallion buys a candle for his memory — and a few coins for your purse.", effects:{ gold:9, honor:3, codex:'hang_rite' } },
      hang_leave:  { text:"You leave him to his slow revolutions. The creak of the rope follows you down the hall.", effects:{} },
      hang_loot:   { text:"You empty his pockets and tear the medallion free. It was a pilgrim's charm, meant to guide a soul home. He will not find his way now. Your purse, though, is heavier.", effects:{ gold:22, honor:-10, codex:'hang_robbed', reveal:'A gentler hand would have closed his eyes, not his purse.' } },
    }
  },

  child: {
    name:'The Lost Child',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_child',
        text:"A child, filthy and hollow-cheeked, hides behind fallen stone. Wide eyes track you. “Are you… one of the bad ones?” she whispers.",
        choices:[
          { label:'Kneel and share your food', to:'child_food' },
          { label:'Guide her toward the way up', to:'child_guide' },
          { label:'Leave her be', to:'child_leave' },
        ] },
      warped:{ art:'npc_child',
        text:"A small gaunt shape skitters behind the rubble, watching with wet, gleaming eyes. Too still. Too quiet. In this place, small things bite.",
        choices:[
          { label:'Drive it off with steel', to:'child_attack', kind:'danger' },
          { label:'Crouch low and look again', to:'child_approach' },
          { label:'Ignore it', to:'child_leave' },
        ] },
    },
    outcomes:{
      child_food:   { text:"You share your rations. She eats like a wolf, then presses a dented tin into your hands. “Mother's medicine. You need it more.” It is a healing draught.", effects:{ honor:11, potion:'potion_heal', codex:'child_kind' } },
      child_guide:  { text:"You walk her to a stair of grey light and watch until her small shape climbs out of the dark. She waves. It costs you nothing and everything.", effects:{ honor:8, codex:'child_kind' } },
      child_leave:  { text:"You step past. Small footsteps follow at a distance, then stop.", effects:{ honor:-3 } },
      child_attack: { text:"Steel flashes — and freezes. A child crumples against the stone, a scavenged tin rolling from her hand. Not a monster. Never a monster. You take the coins she'd hidden and try not to look at her face.", effects:{ gold:14, honor:-16, codex:'child_blood', reveal:'Only fear made her monstrous. A clean soul would have seen a frightened girl.' } },
      child_approach:{ text:"You lower yourself to her height. The shadows resolve into a trembling girl. Your patience spared her. She slips you her mother's medicine and flees toward the light.", effects:{ honor:13, potion:'potion_heal', codex:'child_truth' } },
    }
  },

  oathblade: {
    name:'The Bound Knight',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_fallen',
        text:"A knight sits slumped against the wall, breath rattling, a fine blade across his knees. “Take it,” he wheezes. “Swear it will never serve cruelty. Then let me go.”",
        choices:[
          { label:'Swear the oath and take the blade', to:'oath_accept' },
          { label:'Ease his passing first', to:'oath_ease' },
          { label:'Refuse; leave him his blade', to:'oath_leave' },
        ] },
      warped:{ art:'npc_fallen',
        text:"A dying man clutches a sword worth more than your life, too weak to lift it. It would be so easy. He can barely see you.",
        choices:[
          { label:'Take the blade from his hands', to:'oath_take', kind:'danger' },
          { label:'Wait — hear him out', to:'oath_wait' },
          { label:'Leave him', to:'oath_leave' },
        ] },
    },
    outcomes:{
      oath_accept: { text:"You kneel and swear. His shoulders loosen; the rattle eases into stillness. The Oathblade is warm in your grip, and it seems to approve of you.", effects:{ item:'oathblade', honor:8, codex:'oath_kept' } },
      oath_ease:   { text:"You give him water and a steady hand, and stay until the end. He presses the blade on you with his last strength. “Sworn,” he breathes. “Good.”", effects:{ item:'oathblade', honor:12, sp:99, codex:'oath_kept' } },
      oath_take:   { text:"You pry the sword from his fingers before he can speak. His eyes follow you out — not angry, just… disappointed. The steel is fine. The taking was not.", effects:{ item:'oathblade', honor:-12, gold:6, codex:'oath_broken', reveal:'He would have given it freely, to someone worth the gift.' } },
      oath_wait:   { text:"You wait, and listen. He asks only that the blade never serve cruelty. You swear it, and mean it. He dies smiling, and the Oathblade answers to you now.", effects:{ item:'oathblade', honor:12, codex:'oath_freely' } },
      oath_leave:  { text:"You leave him his blade and his dignity. Somewhere behind you, a long breath finally lets go.", effects:{ honor:2 } },
    }
  },

  lightbearer: {
    name:'The Lightbearer',
    require:'HALLOWED',
    perceive:()=> 'clear',
    variants:{
      clear:{ art:'npc_lightbearer',
        text:"A figure robed in pale, sourceless light waits in the passage, wholly unafraid of you. “Few come this deep with clean hands. Let me lighten what you carry.”",
        choices:[
          { label:'Accept a blessing', to:'light_bless' },
          { label:'Ask for their warding', to:'light_ward' },
          { label:'Ask only for guidance', to:'light_guide' },
        ] },
    },
    outcomes:{
      light_bless: { text:"They lay a hand upon your brow. Warmth floods every wound; your very frame feels made anew, a little stronger than before.", effects:{ heal:99, maxhp:6, sp:99, codex:'light_blessed' } },
      light_ward:  { text:"They trace a sigil of light over your heart. It hardens there, a quiet shield against the dark to come.", effects:{ def:2, honor:3, codex:'light_ward' } },
      light_guide: { text:"“Then keep your kindness — it is the rarest coin down here.” Their words settle your mind and restore your focus entirely.", effects:{ sp:99, honor:5, codex:'light_blessed' } },
    }
  },

  envoy: {
    name:"The Inquisition's Envoy",
    require:'MARKED',
    perceive:()=> 'clear',
    variants:{
      clear:{ art:'en_inquisitor',
        text:"A gilded Inquisitor steps from the shadow, blade sheathed — for now. “The Choir has marked your soul, sinner. But the faithful are practical. Your gold buys a reprieve. Your blood buys nothing.”",
        choices:[
          { label:'Pay tribute (25 gold)', to:'envoy_pay' },
          { label:'Draw steel and answer', to:'envoy_fight', kind:'danger' },
          { label:'Spit at their gilded feet', to:'envoy_scorn', kind:'danger' },
        ] },
    },
    outcomes:{
      envoy_pay:   { text:"You count out coins into a gloved palm. The Inquisitor inclines their head, and the armored steps in the dark withdraw — the hunt cools, for now.", effects:{ gold:-25, honor:4, clearHunters:true, heatDown:40, codex:'envoy_bribe' } },
      envoy_fight: { text:"“So be it, sinner.” Light kindles along their blade as they lunge — and the Inquisition's spoils go to the victor.", effects:{ combat:'inquisitor', codex:'envoy_defiant' } },
      envoy_scorn: { text:"Your spit sizzles on gilded steel. The Inquisitor's eyes narrow. “Then you will be hunted the harder.” More armored steps answer from the dark.", effects:{ honor:-8, spawnHunter:true, heatUp:20, codex:'envoy_scorn' } },
    }
  },

  // ---------- Biome-native encounters (only appear on their home floor) ----------
  butcherdoor: {
    name:"The Butcher's Door",
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'en_butcher',
        text:"A red door, warm to the touch. From beyond: the wet sound of work, and a voice like grease in a cold pan. “Ahhh… fresh meat.” Through the crack you see hooks — and on one of them, something still moving.",
        choices:[
          { label:'Break in and face the Butcher', to:'butcher_fight', kind:'danger' },
          { label:'Slip in and free the one on the hook', to:'butcher_free' },
          { label:'Take meat from the hooks and go', to:'butcher_meat', kind:'danger' },
        ] },
      warped:{ art:'en_butcher',
        text:"A red door, warm to the touch. The wet sound of work. “Ahhh… fresh meat.” Through the crack: hooks, and hanging things. Meat is meat, your stomach says. Whatever hangs in there is already past saving.",
        choices:[
          { label:'Break in and face the Butcher', to:'butcher_fight', kind:'danger' },
          { label:'Take meat from the hooks and go', to:'butcher_meat', kind:'danger' },
          { label:'Walk away from the warm door', to:'butcher_leave' },
        ] },
    },
    outcomes:{
      butcher_fight:{ text:"You put your shoulder through the red door. The thing inside turns — an apron the color of its work, a cleaver the size of a tombstone, a smile with too few teeth in it. “FRESH. MEAT.”", effects:{ combat:'butcher', codex:'butcher_faced' } },
      butcher_free: { text:"You slip in while the work is loud. The one on the hook is a man — barely, still. You take him down; he does not scream, because he has learned not to. He points once at the door, presses his bandages into your hands, and runs without a word.", effects:{ heal:20, honor:12, codex:'butcher_freed' } },
      butcher_meat: { text:"You lift a wet parcel from the nearest hook and go, quickly. Later, in the dark, you eat. Warmth spreads through you like forgiveness. You do not ask what it was. That is the mercy you allow yourself.", effects:{ heal:35, honor:-10, codex:'butcher_meat', reveal:'A cleaner soul would have seen what else hung there — and who could still be saved.' } },
      butcher_leave:{ text:"You walk away. Behind you the wet work resumes, unhurried. It was never worried you would stay.", effects:{ honor:-2 } },
    }
  },

  namelesscoin: {
    name:'The Coin of the Nameless',
    perceive:()=> 'clear',
    variants:{
      clear:{ art:'npc_shrine',
        text:"An altar of black iron, bare but for a single coin — older than any kingdom's mint, faces worn off both sides. A voice speaks without a mouth, from everywhere at once: “ALL THINGS ARE DECIDED THUS. CALL IT.”",
        choices:[
          { label:'Flip the coin', to:'coin_flip', kind:'danger' },
          { label:'Pocket the coin without flipping', to:'coin_pocket', kind:'danger' },
          { label:'Refuse the game and leave', to:'coin_leave' },
        ] },
    },
    outcomes:{
      coin_flip:  { special:'coin_flip', text:"", effects:{} },
      coin_pocket:{ text:"You take the coin and do not play. The voice does not stop you. It laughs — softly, patiently, the way one laughs at a child who has pocketed a live ember. The coin sits heavy in your pocket. It wants to be flipped. You can feel it deciding things in there.", effects:{ gold:15, honor:-8, heatUp:10, pocketCoin:true, codex:'coin_theft', reveal:'Some debts are not collected. They are grown.' } },
      coin_leave: { text:"You leave the game unplayed. The voice says nothing at all, which is somehow worse.", effects:{ honor:2 } },
    }
  },

  larder: {
    name:'The Larder',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_cage',
        text:"A cellar door stands ajar, breathing cold air that smells of salt and smoke. Inside: shelves. Hooks. Provisions enough for a garrison that never came back up. Somebody stocked this larder with great care, and that somebody is not here.",
        choices:[
          { label:'Eat your fill, here and now', to:'lard_feast' },
          { label:'Take provisions for the road', to:'lard_take' },
          { label:'Touch nothing that is not yours', to:'lard_leave' },
        ] },
      warped:{ art:'npc_cage',
        text:"A cellar door stands ajar, breathing cold air that smells of salt and smoke. Inside: shelves. Hooks. MEAT — hanging in neat rows, trimmed by a practiced hand. Your stomach votes before your eyes finish counting the hooks. Some of the cuts are long. Some of the cuts are very long.",
        choices:[
          { label:'Eat. Starving men can\'t be choosers', to:'lard_gorge', kind:'danger' },
          { label:'Take some for the road, don\'t look close', to:'lard_take' },
          { label:'Back out of this place', to:'lard_leave' },
        ] },
    },
    outcomes:{
      lard_feast: { text:"You sit among the shelves and eat like a person again — bread, salt fish, something that was honestly a pear once. Strength settles back into your hands. On the way out you leave two coins on a shelf, for whoever keeps this place. It felt important to.", effects:{ food:99, heal:8, gold:-2, honor:3, codex:'lard_fed' } },
      lard_gorge: { text:"You eat in the dark, fast, standing up, the way animals do. It is the best meal you have had down here and you know better than to wonder why the portions are so long. Behind you, on the stair, something heavy pauses — approves — and moves on. You have been fed. The word sits in your head like a hook: fed, the way livestock is fed.", effects:{ food:99, heal:10, honor:-6, heatUp:5, codex:'lard_gorged', reveal:'A cleaner soul would have found bread and salt fish here — and left coins for the keeper.' } },
      lard_take:  { text:"You wrap what travels well and fill your pack. The door swings shut behind you on its own, gently, like something saying: come back hungry.", effects:{ potion2:'strange_meat', codex:'lard_took' } },
      lard_leave: { text:"You close the cellar door on the smell of smoke and salt. Your stomach files a formal complaint. Your spine thanks you.", effects:{ honor:4 } },
    }
  },

  oathless: {
    name:'The Oathless',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_fallen',
        text:"Someone is sitting with their back to a pillar, alive, and looking at you the way the drowning look at a rope. “I can carry. I can fight, a little. I won't slow you.” A pause. “I would rather die walking behind someone than sitting here alone.”",
        choices:[
          { label:'Take them with you', to:'oath_take', kind:'danger' },
          { label:'Give them provisions and point them up', to:'oath_send' },
          { label:'Say nothing and walk on', to:'oath_leave' },
        ] },
      warped:{ art:'npc_fallen',
        text:"Something sits with its back to a pillar, watching you. It might be a person. It says it can carry, that it can fight a little, that it won't slow you — and every word arrives a half-beat after its mouth moves.",
        choices:[
          { label:'Take it with you anyway', to:'oath_take', kind:'danger' },
          { label:'Look at it properly first', to:'oath_look' },
          { label:'Walk on', to:'oath_leave' },
        ] },
    },
    outcomes:{
      oath_take: { text:"They fall in a half-step behind your shoulder and stay there. They will need feeding. They will need mending. They carry their own pack and it is not deep.\n\nUnderstand what you have just done: if they die down here, you will have led them to it, and you will never again be able to tell yourself otherwise.", effects:{ follower:true, codex:'oath_taken' } },
      oath_send: { text:"You press bread and a little coin into their hands and turn them toward the stairs you came down. They go. Whether the stair is kinder than the dark, you will never find out — which is its own mercy, for you.", effects:{ gold:-8, honor:9, codex:'oath_sent' } },
      oath_look: { text:"You look, properly, the way you should have looked at everything down here. Just a person: filthy, scared, and breathing. Shame goes through you like cold water. They flinch at whatever your face is doing, and follow you anyway.", effects:{ follower:true, honor:5, codex:'oath_seen', reveal:'Fear nearly made a monster of someone who only needed to not be alone.' } },
      oath_leave: { text:"You walk on. The sound they make is not a word. It follows you further than they could have.", effects:{ honor:-5 } },
    }
  },

  // Eliza Sinclair — once a descent, and only once. To the Gravethief she is his
  // wife; to everyone else she is a woman with a stall and no interest in them.
  sinclair: {
    name:'Eliza Sinclair',
    once:true,
    perceive: byClass('rogue'),
    variants:{
      clear:{ art:'npc_eliza',
        text:"She is crouched over a strongbox with her picks already in it, and she does not startle when your light finds her — she just looks up, and there is that mouth of hers doing the thing it does.\n\n“You took your time.” The lock gives with a click she does not look down for. “I got here two days ago. I have been robbing the dead of this place blind and I have not once needed rescuing, so wipe that off your face.”\n\nShe stands, and holds out a hand, palm up, the way she does when she means: <i>are we working, or are we talking?</i>",
        choices:[
          { label:'Take her hand — work the dark together', to:'sin_take' },
          { label:'Tell her to go back up while she still can', to:'sin_send' },
          { label:'Trade for what she has spare', to:'sin_trade' },
        ] },
      stranger:{ art:'npc_eliza',
        text:"A woman has made a stall out of an upturned crate and a folded cloak, and she is sitting behind it as calmly as a fishwife at market. She is beautiful in a way that has clearly been useful to her. Two knives lie within reach and she does not pretend otherwise.\n\n“I'm not for hire, I'm not for fighting, and I'm not lost,” she says. “I've bread and a little else, and I'll take coin for it. That's the whole of what's on offer.”",
        choices:[
          { label:'Trade with her', to:'sin_trade' },
          { label:'Leave her to her stall', to:'sin_pass' },
        ] },
    },
    outcomes:{
      sin_take: { text:"“Right then,” she says, and falls in at your shoulder — not behind it, at it, which is a distinction she has made loudly before.\n\nShe eats from her own pack, mends her own cuts, and picks her own fights. And when a fight turns bad enough, she will be gone before you can turn around: out through whatever crack she has already found, because Eliza Sinclair does not die in holes like this one. That is the arrangement. It always was.", effects:{ follower:'eliza', codex:'eliza_taken' } },
      sin_send: { text:"She hears you out with her head tilted, all the way to the end, which is more courtesy than the argument deserved.\n\n“No,” she says pleasantly, and kisses you, and goes back down the corridor you have not walked yet. You find her purse in your hand a minute later, because she is who she is.", effects:{ gold:26, honor:4, codex:'eliza_sent' } },
      sin_trade: { special:'eliza_stall', text:'' },
      sin_pass: { text:"You walk on. Behind you she is already re-folding the cloak, unbothered, a woman entirely unsurprised to be left alone with two knives.", effects:{} },
    }
  },

  hollowprince: {
    name:'The Hollow Prince',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_fallen',
        text:"A figure in tarnished court finery bows with perfect grace. “Have you seen her? My bride. Hair like spun gold. The wedding is— the wedding was—” Behind him stretches a hall of dust: a feast laid for guests a hundred years dead, and a small veiled bundle at the head table.",
        choices:[
          { label:'Tell him the truth', to:'prince_truth', kind:'danger' },
          { label:'Play the guest — toast the happy day', to:'prince_feast' },
          { label:'Bow out of the hall', to:'prince_leave' },
        ] },
      warped:{ art:'npc_fallen',
        text:"A GROTESQUE in rotted finery croons over a bundle of bones in a bridal veil, rocking it gently. Its feast-hall is dust and worse. Things like this do not grieve. Things like this lure.",
        choices:[
          { label:'Cut it down mid-song', to:'prince_slay', kind:'danger' },
          { label:'Watch the crooning a while', to:'prince_watch' },
          { label:'Back out of the hall', to:'prince_leave' },
        ] },
    },
    outcomes:{
      prince_truth:{ text:"“She is dust, my lord. A hundred years of it.” He goes very still. “Dust. Yes. I remember now. I remember the fire. I remember what I—” His grace collapses like the lie it was, and he with it, weeping, thanking you. Where he knelt lies a shard of burning red, finally still.", effects:{ item:'soulstone', honor:10, codex:'prince_truth' } },
      prince_feast:{ text:"You take a seat among the dust and raise an empty cup to the happy couple. He glows. For one hour the hall is warm and golden and full of music only he can hear — and, seated in his lie, you rest better than you have in days.", effects:{ heal:25, sp:99, honor:2, codex:'prince_feast' } },
      prince_leave:{ text:"You bow and withdraw. Behind you he resumes his rounds of the empty tables, asking, asking.", effects:{} },
      prince_slay: { text:"You cut the crooning thing down. It does not fight. It folds itself around the veiled bundle as it falls, shielding it to the last — and the bundle is bones, small ones, holding a dried bouquet. Not a lure. A mourner. The rings it wore are gold, at least.", effects:{ gold:18, honor:-13, codex:'prince_slain', reveal:'It was a groom at the grave of his bride. A century of grief, ended by a stranger in one stroke.' } },
      prince_watch:{ text:"You lower your blade and listen. The croon resolves into a wedding-song, sung in a voice worn to threads — a groom, keeping vigil over a bride a hundred years gone. He sees you, and bows. You bow back. Some things need witnesses more than they need mercy.", effects:{ sp:99, honor:9, codex:'prince_feast' } },
    }
  },

  seamparlor: {
    name:"The Seamstress' Parlor",
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'en_seamstress',
        text:"A parlor hung with finished work: coats, gloves, a wedding dress — all of leather too soft and too pale to ask about. At her bench, a long-fingered woman looks up over needles that were never made for cloth. “Sit, dear. You're coming apart at the seams. Everyone down here is. I can take you in.”",
        choices:[
          { label:'Refuse her — and her wares', to:'seam_refuse' },
          { label:'Sell her a strip of your skin', to:'seam_trade', kind:'danger' },
          { label:'End her tailoring forever', to:'seam_fight', kind:'danger' },
        ] },
      warped:{ art:'en_seamstress',
        text:"A parlor of DOLLS — rows of them, seated, dressed, glass-eyed. Some of them are breathing. The long-fingered thing at the bench pats an empty chair without looking up. “I saved you a seat, dear. I measured you three floors ago.”",
        choices:[
          { label:'Take the seat', to:'seam_trade', kind:'danger' },
          { label:'Burn the parlor bench and all', to:'seam_fight', kind:'danger' },
          { label:'Back out, slowly', to:'seam_refuse' },
        ] },
    },
    outcomes:{
      seam_refuse:{ text:"You keep your skin and your distance. As the door closes she calls after you, unbothered: “No hurry, dear. You'll come apart eventually. They all do. I do alterations.”", effects:{ honor:2, codex:'seam_refused' } },
      seam_trade: { text:"Her needle works quickly and without cruelty, which is somehow worse. She takes a hand's width from your back, nods at the grain of it, and pays in coin and a stitched blessing — the wound closes into a seam finer than any scar. You are less than you were, and neater.", effects:{ maxhp:-4, gold:30, def:2, honor:-6, codex:'seam_traded', reveal:'What she takes, she keeps. Somewhere in that parlor, a glove now fits perfectly.' } },
      seam_fight: { text:"You move — and every needle in the parlor rises with her. “A pity, dear,” she sighs, threading the first one with something red. “I had you down for a winter coat.”", effects:{ combat:'seamstress', codex:'seam_faced' } },
    }
  },

  banquet: {
    name:'The Banquet of the Starveling King',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'en_starveling',
        text:"A feast-hall where the smell reaches you first. At its head, a giant of jaundiced skin and jutting bone wears a crown grown into his skull. Around him, a banquet without end — and every dish is bones, sucked clean and arranged like delicacies. “SIT,” the Starveling King says, gracious, hollow. “EAT. NOTHING LEAVES MY TABLE FULL. NOT EVEN ME.”",
        choices:[
          { label:'Sit, and eat what is served', to:'banq_eat', kind:'danger' },
          { label:'Offer your own rations to the King', to:'banq_offer' },
          { label:'Overturn his table', to:'banq_fight', kind:'danger' },
        ] },
      warped:{ art:'en_starveling',
        text:"A feast-hall, and it smells GLORIOUS. Roast meat, warm bread, wine. At the head sits a starved giant in a crown, not eating any of it. Your stomach twists like a fist. Surely one plate. Surely he owes you one plate.",
        choices:[
          { label:'Fall on the feast and gorge', to:'banq_eat', kind:'danger' },
          { label:'Look at the food. Really look', to:'banq_look' },
          { label:'Overturn his table', to:'banq_fight', kind:'danger' },
        ] },
    },
    outcomes:{
      banq_eat:  { text:"You eat. It is bones and grave-dust and it is the finest meal of your life; you weep while you chew and cannot stop. The King watches with something like love. “GOOD,” he says. “NOW YOU UNDERSTAND ME.” The hunger will pass. Most of it.", effects:{ heal:40, maxhp:-4, honor:-8, codex:'banq_ate', reveal:'His table only serves what you brought to it. There was never any food.' } },
      banq_offer:{ text:"You lay your rations before him. The hall goes silent. The King lifts the dried bread like a relic, and for a moment his ruined face remembers being a face. “NO ONE,” he says slowly, “HAS FED ME. IN A VERY LONG TIME.” He does not eat it. He has it set at the head of the table, and lets you pass with a king's blessing.", effects:{ maxhp:6, honor:12, codex:'banq_fed' } },
      banq_look: { text:"You force yourself to look — truly look. The roast is a ribcage. The bread is vertebrae. The wine is nothing you will name even to yourself. Your hunger curdles into clarity, and the King nods, almost approving. “WISE,” he says. “STARVE STANDING.”", effects:{ sp:99, honor:8, codex:'banq_fed' } },
      banq_fight:{ text:"You put your boot through a century of arranged bones. The King rises — and rises, and rises — joints cracking like green wood. “I HAVE EATEN KINGDOMS,” he says, without anger. “YOU ARE BARELY A MOUTHFUL.”", effects:{ combat:'starveling', codex:'banq_faced' } },
    }
  },

  velvetchapel: {
    name:'The Velvet Chapel',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'en_velvet',
        text:"A side-chapel upholstered in red velvet, warm as a body, lit by candles that do not flicker. On the altar steps reclines a veiled figure of impossible grace. “Pilgrim,” she says, and the word is a hand on your neck. “You have carried so much, so far. Set it down. Rest with me a while. All I ask is a little of your warmth.”",
        choices:[
          { label:'Accept her comfort', to:'velvet_yield', kind:'danger' },
          { label:'Pray at the altar instead — to anything else', to:'velvet_pray' },
          { label:'Tear down the veil', to:'velvet_fight', kind:'danger' },
        ] },
      warped:{ art:'en_velvet',
        text:"A chapel of red velvet, and SHE is waiting in it — for you, only ever for you, she has always been waiting for you. You cannot see her face through the veil. You do not need to. Every step toward her feels like being forgiven.",
        choices:[
          { label:'Go to her', to:'velvet_yield', kind:'danger' },
          { label:'Grip your weapon until it hurts', to:'velvet_resist' },
          { label:'Tear down the veil', to:'velvet_fight', kind:'danger' },
        ] },
    },
    outcomes:{
      velvet_yield:{ text:"You set your burdens down. What follows is warmth, and hunger, and you do not speak of it after. You wake on the chapel steps alone, rested as you have not been in years — and lighter in a way that has nothing to do with your pack. Two candles have gone out. You are fairly sure they were yours.", effects:{ heal:99, sp:99, maxhp:-6, honor:-8, codex:'velvet_yielded', reveal:'She keeps what she is given. She is owed so much warmth by now that she will never be warm.' } },
      velvet_pray: { text:"You kneel past her, to the cold stone under the velvet, and pray to anything older than comfort. The warmth recoils like a touched snail. Behind you her voice loses its music for just one syllable — and that syllable is very, very old.", effects:{ sp:99, def:2, honor:9, codex:'velvet_prayed' } },
      velvet_resist:{ text:"You grip your weapon until your knuckles crack, and the pain cuts the perfume. The chapel is cold. It was always cold. The candles are tallow and the velvet is moth-eaten and SHE is still on the steps — but now you see the veil move wrong, like breath through cloth with nothing behind it. You keep your warmth, and your name.", effects:{ maxhp:4, honor:11, codex:'velvet_prayed' } },
      velvet_fight:{ text:"You take the veil in your fist and pull. What is under it is not a face. It is a mouth, and it has been patient with you long enough. “UNGRATEFUL,” the chapel says, from every seam of it at once.", effects:{ combat:'velvetsaint', codex:'velvet_faced' } },
    }
  },

  sporewife: {
    name:'The Sporewife', biome:'fungal',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_sporewife',
        text:"Half-grown into the mycelium wall, a woman tends a garden of caps and gills. Spore-light drifts from her hair like slow snow. “Sit, wanderer. The Deep provides, if you let it.”",
        choices:[
          { label:'Accept her remedy', to:'spore_remedy' },
          { label:'Ask for a spore-graft', to:'spore_graft', kind:'danger' },
          { label:'Decline and move on', to:'spore_leave' },
        ] },
      warped:{ art:'npc_silhouette',
        text:"A fungal MASS wearing a woman's shape sways against the wall, tendrils reaching from where its hair should be. It hums. Things that hum down here are calling something.",
        choices:[
          { label:'Cut it down before it spreads', to:'spore_slay', kind:'danger' },
          { label:'Watch it a while longer', to:'spore_watch' },
          { label:'Back away', to:'spore_leave' },
        ] },
    },
    outcomes:{
      spore_remedy:{ text:"She brews a tea of gill and shadow that tastes of rain on old wood. Your wounds knit as you drink. “The Deep keeps those who keep it,” she murmurs, tucking a vial into your pack.", effects:{ heal:24, honor:6, potion:'potion_heal', codex:'spore_mercy' } },
      spore_graft: { text:"She presses a living cap against your wound and whispers to it. The flesh drinks it in. You are more than you were — and slightly less yours.", effects:{ maxhp:6, honor:-4, codex:'spore_graft' } },
      spore_leave: { text:"You leave her to her patient garden. The spore-light dims behind you.", effects:{} },
      spore_slay:  { text:"You cut the humming thing apart — and find a woman inside the bloom, her herb pouch spilling remedies she grew for travelers. The Deep goes very quiet around you.", effects:{ gold:15, potion:'potion_heal', honor:-12, codex:'spore_slain', reveal:'She was tending medicine, not summoning. A cleaner soul would have smelled the tea.' } },
      spore_watch: { text:"You wait, blade low. The 'tendrils' resolve into hair strung with drying herbs; the hum is a lullaby. She opens her eyes and smiles at your patience — and heals you for it.", effects:{ heal:20, honor:10, codex:'spore_truth' } },
    }
  },

  ferryman: {
    name:'The Ferryman', biome:'drowned',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_ferryman',
        text:"A skiff glides out of the black water, poled by a hooded figure with a lantern at the prow. “Coin for the crossing, kindness for the toll,” it says, in a voice like water over stone.",
        choices:[
          { label:'Pay the toll (8 gold)', to:'ferry_toll' },
          { label:'Ask what sleeps in the water', to:'ferry_ask' },
          { label:'Wave it on', to:'ferry_leave' },
        ] },
      warped:{ art:'npc_ferryman',
        text:"A DROWNED THING poles a raft of lashed bones through the shallows. A small lockbox glints at its feet. It has not seen you. The water would cover any sound.",
        choices:[
          { label:'Take the lockbox', to:'ferry_rob', kind:'danger' },
          { label:'Hail it openly', to:'ferry_hail' },
          { label:'Leave the shore', to:'ferry_leave' },
        ] },
    },
    outcomes:{
      ferry_toll: { text:"You drop coins into a palm of wet leather. The ferryman poles you past flooded galleries you could never have walked, and sets you down rested on a far dry stair.", effects:{ gold:-8, heal:14, honor:4, codex:'ferry_toll' } },
      ferry_ask:  { text:"“The city drowned praying,” it says. “The prayers are still down there, swimming.” It tells you where the water runs shallow; your mind feels clearer for the map.", effects:{ sp:99, honor:2, codex:'ferry_toll' } },
      ferry_leave:{ text:"The skiff slides back into the dark water without a ripple.", effects:{} },
      ferry_rob:  { text:"You lift the lockbox from the raft. The 'drowned thing' turns — a ferryman, hood fallen, face lined and tired. He says nothing. He only looks at you, and poles away. The box is heavy with other travelers' fares.", effects:{ gold:20, honor:-10, codex:'ferry_robbed', reveal:'He would have carried you across for eight coins.' } },
      ferry_hail: { text:"You call out across the water. The shape straightens — a hooded ferryman, raft strung with bone charms against the deep. “Honest, this one,” he rasps, and poles you across for nothing.", effects:{ heal:12, honor:8, codex:'ferry_truth' } },
    }
  },

  forgewidow: {
    name:'The Forge Widow', biome:'ember',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_smith',
        text:"At a dying forge wedged into the chasm wall, a soot-streaked smith works a blade in the coals. “The Choir took my husband for their wars,” she says without looking up. “I still take honest work.”",
        choices:[
          { label:'Have your weapon tempered (12 gold)', to:'forge_temper' },
          { label:'Feed the forge (8 gold)', to:'forge_gift' },
          { label:'Leave her to her work', to:'forge_leave' },
        ] },
      warped:{ art:'npc_smith',
        text:"A CHOIR SMITH hammers steel in the red dark — arming your hunters, surely. The forge-light gilds her hammer. One stroke of yours would end a hundred of hers.",
        choices:[
          { label:'Kill the smith', to:'forge_blood', kind:'danger' },
          { label:'Watch her work first', to:'forge_watch' },
          { label:'Pass by in the smoke', to:'forge_leave' },
        ] },
    },
    outcomes:{
      forge_temper:{ text:"She draws your blade through the coals, quenches it in something dark, and hands it back humming. It bites deeper now.", effects:{ gold:-12, atk:2, codex:'forge_temper' } },
      forge_gift:  { text:"You feed her forge with coin and coal. She studies you a long moment. “Kindness, down here.” She stamps a maker's mark into your gear for luck — the old kind, that works.", effects:{ gold:-8, honor:7, def:1, codex:'forge_gift' } },
      forge_leave: { text:"The hammer-song follows you down the chasm, steady as a heart.", effects:{} },
      forge_blood: { text:"Your blade ends the hammer-song mid-stroke. On her bench: plowshares, door-hinges, a child's toy sword. No Choir steel. You take her good work and go.", effects:{ gold:18, atk:1, honor:-13, codex:'forge_blood', reveal:'She fixed hinges and toys. The Choir took her husband — and now you.' } },
      forge_watch: { text:"You watch from the smoke. She finishes — a cooking pot, a door-hinge, a toy sword for some child above. Not a weapon in the rack. Ashamed of your certainty, you step out; she tempers your blade without a word.", effects:{ atk:2, honor:9, codex:'forge_truth' } },
    }
  },

  bonechoir: {
    name:'The Bone Choir', biome:'ossuary',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_bonechoir',
        text:"Nine skeletons kneel in a ring, jaws open in a hymn just below hearing. The air vibrates in your teeth. Their gilt vestments have kept their color for a hundred years.",
        choices:[
          { label:'Kneel and add your voice', to:'choir_hymn' },
          { label:'Ask what they mourn', to:'choir_ask' },
          { label:'Leave them their song', to:'choir_leave' },
        ] },
      warped:{ art:'npc_bonechoir',
        text:"Nine rattling DEAD shriek soundlessly around a black altar, gilt trappings glinting on their bones. Gold like that would spend the same anywhere.",
        choices:[
          { label:'Smash them for their relics', to:'choir_smash', kind:'danger' },
          { label:'Listen before you swing', to:'choir_listen' },
          { label:'Withdraw', to:'choir_leave' },
        ] },
    },
    outcomes:{
      choir_hymn: { text:"You kneel in the ring and lend your breath to the hymn. For one held note the Whitemarrow is not a grave but a cathedral. You rise lighter than you knelt.", effects:{ sp:99, honor:8, codex:'choir_hymn' } },
      choir_ask:  { text:"The nearest skull inclines. Into your mind, a procession: a city, a plague, nine cantors who stayed singing while everyone fled. They mourn everyone who did not get a song. Including, in advance, you. It is oddly warming.", effects:{ heal:12, honor:3, codex:'choir_hymn' } },
      choir_leave:{ text:"You leave the hymn unbroken. It follows you through the bone halls like a blessing that hasn't decided yet.", effects:{} },
      choir_smash:{ text:"You break nine singers for their gold thread and gilt clasps. The hymn stops. You had not realized how much of the Whitemarrow's stillness was that song holding something back.", effects:{ gold:24, honor:-12, codex:'choir_smashed', reveal:'They were singing a ward, not a summons. Some doors only stay closed while someone sings.' } },
      choir_listen:{ text:"You lower your weapon and listen. The 'shrieking' resolves into harmony — a ward-hymn, old as the bones around it. One cantor turns its skull to you and, somehow, approves.", effects:{ sp:99, honor:10, codex:'choir_truth' } },
    }
  },

  lamplighter: {
    name:'The Blind Lamplighter', biome:'umbral',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_lamplighter',
        text:"An old man shuffles between the petrified roots, lantern held high though his eyes are milk-white. “Is someone there? The dark ate my road, and I have lamps yet to light.”",
        choices:[
          { label:'Guide him through the roots', to:'lamp_guide' },
          { label:'Ask him about the Weald', to:'lamp_ask' },
          { label:'Slip past silently', to:'lamp_slip' },
        ] },
      warped:{ art:'en_shade',
        text:"A pale LIGHT bobs between the roots, drifting deeper — the way lights do when they want you to follow. Toward treasure, perhaps. Or teeth.",
        choices:[
          { label:'Snuff the light and take the lantern', to:'lamp_snuff', kind:'danger' },
          { label:'Follow it carefully', to:'lamp_follow' },
          { label:'Ignore it', to:'lamp_leave' },
        ] },
    },
    outcomes:{
      lamp_guide: { text:"You walk him root to root, his hand on your shoulder, until the dark thins. “Kind eyes,” he says. “Borrow mine.” He presses his lantern into your hands — it burns without oil, and the Weald retreats from it.", effects:{ honor:10, fovBoost:2, codex:'lamp_guided' } },
      lamp_ask:   { text:"“The Weald grew from a forest that refused to die politely,” he says. “Keep your light low and your word good — the roots remember promises.” His directions settle your mind.", effects:{ sp:99, honor:2, codex:'lamp_guided' } },
      lamp_slip:  { text:"You slip past in the dark. Behind you, the old man calls out once, hopefully, to nobody.", effects:{ honor:-2 } },
      lamp_snuff: { text:"You snuff the light with a swing — and an old man folds around your blow, lantern clattering. Blind. He was blind, holding his lamp up for other people. The lantern still burns for you. It should not still burn for you.", effects:{ fovBoost:2, gold:6, honor:-14, codex:'lamp_snuffed', reveal:'The light was held by a blind man lighting the road for others.' } },
      lamp_follow:{ text:"You follow at a wary distance — and find not teeth but a blind old lamplighter, feeling his way between his lamps. He laughs when you speak. “Followed me like a moth! Here — walk bright.” He lends you his lantern's fire.", effects:{ fovBoost:2, honor:8, codex:'lamp_truth' } },
      lamp_leave: { text:"You let the light bob away into the roots. The dark closes behind it.", effects:{} },
    }
  },

  overgrown: {
    name:'The Overgrown Soldier', biome:'fungal',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_overgrown',
        text:"A soldier stands at a broken archway, armor split by shelf-fungus, moss where his eyes were. He has kept this post for years past his death. “Watchword, traveler,” he creaks, without malice.",
        choices:[
          { label:'Answer him kindly', to:'sold_pass' },
          { label:'Ask what he guards', to:'sold_ask' },
          { label:'Go around', to:'sold_leave' },
        ] },
      warped:{ art:'npc_overgrown',
        text:"A SHAMBLING HUSK in rusted plate blocks the archway, fungus bursting through every seam. Its shield alone would be worth prying loose — once the thing wearing it stops moving.",
        choices:[
          { label:'Break the husk apart', to:'sold_loot', kind:'danger' },
          { label:'Speak to it first', to:'sold_speak' },
          { label:'Go around', to:'sold_leave' },
        ] },
    },
    outcomes:{
      sold_pass: { text:"“No one has answered kindly in a long time,” he says, and stands aside. As you pass, he unclasps his mossy shield and presses it on you. “The post is yours now, somewhere ahead.”", effects:{ def:2, honor:8, codex:'sold_pass' } },
      sold_ask:  { text:"“I no longer remember,” he admits, and something in the armor slumps. “Only that I said I would.” You stand watch beside him a while, and the rest does you good.", effects:{ heal:16, honor:5, codex:'sold_pass' } },
      sold_leave:{ text:"You find another way through the roots. Behind you, the soldier keeps his post.", effects:{} },
      sold_loot: { text:"You batter the husk down and pry the shield free. Under the fungus: a soldier's face, still set in duty. He never once raised his weapon at you. The shield is good steel, and heavier than it should be.", effects:{ def:2, gold:12, honor:-11, codex:'sold_loot', reveal:'He only ever asked for a watchword. Any kind word would have done.' } },
      sold_speak:{ text:"“Watchword,” the husk creaks — and your blade drops. A soldier, dead and overgrown, still keeping a post no one remembers. You give him an old marching-word; he accepts it, and salutes you through.", effects:{ def:2, honor:10, codex:'sold_truth' } },
    }
  },

  bride: {
    name:'The Drowned Bride', biome:'drowned',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_bride',
        text:"A pale woman in a waterlogged wedding dress wades the shallows, searching. “My ring,” she whispers. “I cannot cross without my ring. It fell where the light doesn't reach.”",
        choices:[
          { label:'Dive for the ring', to:'bride_ring', kind:'danger' },
          { label:'Comfort her', to:'bride_comfort' },
          { label:'Leave her to the water', to:'bride_leave' },
        ] },
      warped:{ art:'npc_bride',
        text:"A WAILING HAG in rotted lace prowls the water's edge, circling a small dowry chest half-sunk in the silt. She is distracted. The chest is not far.",
        choices:[
          { label:'Snatch the dowry chest', to:'bride_dowry', kind:'danger' },
          { label:'Call out to her', to:'bride_call' },
          { label:'Slip away', to:'bride_leave' },
        ] },
    },
    outcomes:{
      bride_ring:   { text:"You wade in past your depth. The cold takes a toll — but your fingers close on a thin gold band in the silt. When you press it into her hand she is, for one moment, warm and young and radiant. “Kindness like yours crossed me over,” she says, and blesses your blood before the water takes her home.", effects:{ heal:-10, maxhp:6, honor:12, codex:'bride_ring' } },
      bride_comfort:{ text:"You cannot find her ring, so you offer what you have: company, and a promise she was not forgotten. She weeps saltwater, and the halls feel briefly less drowned.", effects:{ sp:99, honor:6, codex:'bride_ring' } },
      bride_leave:  { text:"You leave her circling the same dark pool. She will search until the water forgets her.", effects:{ honor:-2 } },
      bride_dowry:  { text:"You wrench the chest from the silt while the 'hag' wails at the water. Inside: a dowry saved coin by coin for a wedding that drowned with the city. Her cry when she sees you carry it off follows you for three halls.", effects:{ gold:24, honor:-12, codex:'bride_dowry', reveal:'She was a bride, not a hag — guarding the last of a life the flood took.' } },
      bride_call:   { text:"You call out — and the wailing stops. A bride, drowned in her dress, turns to you with silt-grey eyes. “You spoke,” she marvels. “Most only take.” She presses a wet coin into your palm: her luck-piece, given freely.", effects:{ gold:8, honor:10, codex:'bride_truth' } },
    }
  },

  cindermonk: {
    name:'The Cindermonk', biome:'ember',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_cindermonk',
        text:"A monk sits cross-legged in a bed of live coals, skin sooted but unburned, breathing slow. One eye opens as you near. “The fire only keeps what you feed it. Sit, if you dare to be warm.”",
        choices:[
          { label:'Join his vigil in the coals', to:'monk_vigil', kind:'danger' },
          { label:'Ask for his teaching', to:'monk_teach' },
          { label:'Bow and pass on', to:'monk_leave' },
        ] },
      warped:{ art:'npc_cindermonk',
        text:"A BURNING FIGURE squats in the coals, flames licking from its shoulders, muttering into the fire. Things that talk to fire down here are asking it for something. Its ember-heart would fetch a price.",
        choices:[
          { label:'Quench it and take the ember', to:'monk_quench', kind:'danger' },
          { label:'Sit across from it', to:'monk_sit' },
          { label:'Keep to the cool wall', to:'monk_leave' },
        ] },
    },
    outcomes:{
      monk_vigil: { text:"You sit in the coals. The fire tests you — takes its toll in skin — then, finding you honest, settles into your hands like a tame thing. Your blows will carry heat for the rest of this life.", effects:{ heal:-8, atk:2, mag:2, honor:6, codex:'monk_vigil' } },
      monk_teach: { text:"“Feed the fire grief and it grows. Feed it purpose and it warms.” His words bank something steady in your chest. You leave lighter, and your mind burns clean.", effects:{ sp:99, honor:4, codex:'monk_vigil' } },
      monk_leave: { text:"You bow to the man in the coals. He nods, eyes already closed again.", effects:{} },
      monk_quench:{ text:"You scatter the coals and cut the burning figure down. The flames gutter out — and a sooted old monk lies in the embers, palms open, unarmed as he ever was. The ember-heart in your hand is only a warm stone. It stays warm. It never stops being warm.", effects:{ gold:18, honor:-13, codex:'monk_quench', reveal:'He was praying, not summoning. The fire never touched anyone he didn\'t invite.' } },
      monk_sit:   { text:"You sit across the coals from the burning thing. Minutes pass. The flames lower, and a monk regards you through the smoke. “Patience, in this pit? Rare fuel.” He teaches you the coal-breath, and the fire agrees to know you.", effects:{ atk:2, honor:9, codex:'monk_truth' } },
    }
  },

  saint: {
    name:'The Unfinished Saint', biome:'ossuary',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_saint',
        text:"On a marble slab lies a skeleton half-assembled, gold wire threading its joints — a saint the bone-wrights never finished. Its scattered finger-relics glint from the niches around the room.",
        choices:[
          { label:'Gather and return the relics', to:'saint_relics' },
          { label:'Pray at the slab', to:'saint_pray' },
          { label:'Disturb nothing', to:'saint_leave' },
        ] },
      warped:{ art:'npc_saint',
        text:"A RITUAL CORPSE lies wired in gold on a slab, relic-bones scattered around it like payment. Gold wire. Relic-bones. Collectors above would pay a year's bread for a single knuckle.",
        choices:[
          { label:'Pocket the relics', to:'saint_theft', kind:'danger' },
          { label:'Set one bone back in place', to:'saint_return' },
          { label:'Back out of the chamber', to:'saint_leave' },
        ] },
    },
    outcomes:{
      saint_relics:{ text:"Niche by niche, you gather the small bones and set each where it belongs. When the last knuckle clicks home, the skeleton sighs — a long, hundred-year exhale — and warmth pours from the slab like a hand laid on your head.", effects:{ heal:99, maxhp:4, honor:11, codex:'saint_relics' } },
      saint_pray:  { text:"You kneel at the unfinished thing and pray for whoever it was meant to be. The silence has a texture, like listening. Your reserves return.", effects:{ sp:99, honor:4, codex:'saint_relics' } },
      saint_leave: { text:"You leave the saint to its long assembly. The gold wire glints until the door closes.", effects:{} },
      saint_theft: { text:"You sweep the relics into your pack, snapping the gold wire where it holds. Behind you the half-made saint settles on its slab with a sound like a dropped instrument. The relics are worth every coin — collectors don't ask where a knuckle came from.", effects:{ gold:26, honor:-13, codex:'saint_theft', reveal:'Assembled, it would have blessed any hand that helped. The wrights died before they could finish.' } },
      saint_return:{ text:"Curious, you fit one scattered bone back into the gold wire. The skeleton's jaw eases, as if a held breath let go — and you understand: not a ritual, a rescue, interrupted a century ago. You finish what you can, and the slab's warmth thanks you.", effects:{ heal:20, honor:11, codex:'saint_truth' } },
    }
  },

  wolfmother: {
    name:'The Wolfmother', biome:'umbral',
    perceive: clearIfHonored,
    variants:{
      clear:{ art:'npc_wolfmother',
        text:"In a hollow of petrified roots, a she-wolf the size of a cart nurses a tangle of pups. Her eyes find you in the dark — weighing, not hostile. Yet.",
        choices:[
          { label:'Offer your rations', to:'wolf_offer' },
          { label:'Watch the pups from a distance', to:'wolf_watch' },
          { label:'Withdraw quietly', to:'wolf_leave' },
        ] },
      warped:{ art:'npc_wolfmother',
        text:"A MONSTROUS WOLF-THING dens in the roots, small shapes squirming at its belly. A pelt like that — and whatever it whelped — would buy a month above ground. It hasn't seen you.",
        choices:[
          { label:'Attack the den', to:'wolf_den', kind:'danger' },
          { label:'Lower your blade and wait', to:'wolf_wait' },
          { label:'Retreat', to:'wolf_leave' },
        ] },
    },
    outcomes:{
      wolf_offer: { text:"You lay your rations at the hollow's edge and step back. She considers you a long time before she eats. When you leave, a pack-scent clings to you — and the Weald's smaller teeth will think twice. You move like one of hers now.", effects:{ spd:2, honor:8, codex:'wolf_offer' } },
      wolf_watch: { text:"You watch the pups tumble in the root-hollow — clumsy, growling, alive. Down here, of all places. It is the warmest thing you have seen in days, and it steadies you.", effects:{ heal:14, honor:3, codex:'wolf_offer' } },
      wolf_leave: { text:"You back out of the hollow the way you came. Her eyes follow you all the way to the dark.", effects:{} },
      wolf_den:   { text:"You raise your blade against the den — and the 'wolf-thing' rises to meet you, every hackle a spear. Whatever coin the pelt is worth, the mother means to make you earn it.", effects:{ honor:-12, combat:'rootwolf', codex:'wolf_den' } },
      wolf_wait:  { text:"You lower your blade and stand still. The monster resolves in the gloom: a mother, pups at her belly, watching to see what you are. She decides you are not a threat — and lets you drink from the clean pool at the hollow's edge before you go.", effects:{ heal:18, spd:2, honor:10, codex:'wolf_truth' } },
    }
  },
};

// which events use warped/clear perception (used to explain the mechanic in codex)
const CODEX = [
  { id:'well_mercy',   title:'The Well: A Kindness',   tag:'good', hint:'Somewhere, an honorable soul was offered water and mercy.' },
  { id:'well_lore',    title:'The Well: Old Words',    tag:'good', hint:'She knew what sits the throne below.' },
  { id:'well_truth',   title:'The Well: The Unmasking',tag:'mag',  hint:'One who feared, yet stayed their hand, saw the shadow fall away.' },
  { id:'well_bloodied',title:'The Well: Blood on Stone',tag:'bad', hint:'Fear can wear an innocent face and call it a threat.' },
  { id:'cage_freed',   title:'The Cage: Set Free',     tag:'good', hint:'A creature spared can become a shield.' },
  { id:'cage_slain',   title:'The Cage: Silenced',     tag:'bad',  hint:'Some things you kill just to be sure.' },
  { id:'beg_alms',     title:'The Beggar: Alms',       tag:'good', hint:'Charity in the dark is repaid in kind.' },
  { id:'beg_blood',    title:'The Beggar: The Reaching Hand', tag:'bad', hint:'A grasping hand is sometimes only an open one.' },
  { id:'shr_rest',     title:'The Shrine: Laid to Rest',tag:'good', hint:'The dead can be given peace, at a price.' },
  { id:'shr_pact',     title:'The Shrine: The Bargain',tag:'bad',  hint:'Power always keeps the receipt.' },
  { id:'mir_saint',    title:'The Mirror: The Radiant',tag:'good', hint:'The purest see themselves crowned in light.' },
  { id:'mir_gray',     title:'The Mirror: The Undecided', tag:'mag', hint:'A soul still in the balance sees only fog.' },
  { id:'mir_fiend',    title:'The Mirror: The Fiend',  tag:'bad',  hint:'The fallen see themselves at last, and are not afraid.' },
  { id:'mir_shatter',  title:'The Mirror: Shattered',  tag:'mag',  hint:'Some refuse to look at all.' },
  { id:'hang_rite',    title:'The Gibbet: Last Rites',  tag:'good', hint:'The unburied dead can still be given peace.' },
  { id:'hang_robbed',  title:'The Gibbet: Grave-Robbed',tag:'bad',  hint:'A pilgrim\'s charm, taken from a soul that needed it.' },
  { id:'child_kind',   title:'The Child: A Kindness',   tag:'good', hint:'A frightened girl, met with an open hand.' },
  { id:'child_truth',  title:'The Child: Seen True',    tag:'mag',  hint:'Fear made a monster of her, until someone looked twice.' },
  { id:'child_blood',  title:'The Child: The Small Grave', tag:'bad', hint:'The worst thing dishonor ever mistook for a threat.' },
  { id:'oath_kept',    title:'The Oath: Sworn',         tag:'good', hint:'A dying knight\'s blade, taken with a vow.' },
  { id:'oath_freely',  title:'The Oath: Freely Given',  tag:'mag',  hint:'Patience earned what greed would have stolen.' },
  { id:'oath_broken',  title:'The Oath: Stolen Steel',  tag:'bad',  hint:'A gift refused becomes a theft.' },
  { id:'light_blessed',title:'The Lightbearer: Blessed',tag:'good', hint:'Only the Hallowed are met with open light.' },
  { id:'light_ward',   title:'The Lightbearer: Warded', tag:'good', hint:'A shield of light, for clean hands only.' },
  { id:'envoy_bribe',  title:'The Envoy: A Reprieve',   tag:'mag',  hint:'Even the Inquisition is practical.' },
  { id:'envoy_defiant',title:'The Envoy: Answered',     tag:'bad',  hint:'The Marked who draw steel keep the spoils — or die.' },
  { id:'envoy_scorn',  title:'The Envoy: Scorned',      tag:'bad',  hint:'Spit at the Choir, and be hunted the harder.' },
  { id:'spore_mercy',  title:'The Sporewife: Her Tea',   tag:'good', hint:'In the Fungal Deep, the Deep provides — for the kind.' },
  { id:'spore_graft',  title:'The Sporewife: The Graft', tag:'mag',  hint:'More than you were, and slightly less yours.' },
  { id:'spore_slain',  title:'The Sporewife: Cut Bloom', tag:'bad',  hint:'The hum was a lullaby. The tendrils were herbs.' },
  { id:'spore_truth',  title:'The Sporewife: Patience',  tag:'mag',  hint:'One who watched instead of cutting saw the woman in the bloom.' },
  { id:'ferry_toll',   title:'The Ferryman: The Crossing', tag:'good', hint:'In the Drowned Halls, coin buys passage; kindness buys more.' },
  { id:'ferry_robbed', title:'The Ferryman: The Lockbox', tag:'bad',  hint:'Other travelers\' fares, taken from a tired man\'s raft.' },
  { id:'ferry_truth',  title:'The Ferryman: Hailed',     tag:'mag',  hint:'The drowned thing answered to an honest voice.' },
  { id:'forge_temper', title:'The Forge Widow: Tempered',tag:'good', hint:'Honest work, in the Ember Chasm of all places.' },
  { id:'forge_gift',   title:'The Forge Widow: Fed Coals', tag:'good', hint:'A maker\'s mark, the old kind, that works.' },
  { id:'forge_blood',  title:'The Forge Widow: Broken Song', tag:'bad', hint:'Plowshares, hinges, a toy sword. No Choir steel.' },
  { id:'forge_truth',  title:'The Forge Widow: Watched', tag:'mag',  hint:'Certainty, shamed by a cooking pot.' },
  { id:'choir_hymn',   title:'The Bone Choir: The Hymn', tag:'good', hint:'Nine cantors who stayed singing. Room for a tenth voice.' },
  { id:'choir_smashed',title:'The Bone Choir: Silenced', tag:'bad',  hint:'Some doors only stay closed while someone sings.' },
  { id:'choir_truth',  title:'The Bone Choir: Heard',    tag:'mag',  hint:'The shrieking was harmony, for those who listened.' },
  { id:'lamp_guided',  title:'The Lamplighter: Kind Eyes', tag:'good', hint:'A blind man lights the Weald for everyone but himself.' },
  { id:'lamp_snuffed', title:'The Lamplighter: Snuffed', tag:'bad',  hint:'The bobbing light was held by someone. It usually is.' },
  { id:'lamp_truth',   title:'The Lamplighter: The Moth', tag:'mag', hint:'Followed carefully, the lure turned out to be a lantern.' },
  { id:'sold_pass',    title:'The Soldier: Watchword',    tag:'good', hint:'A dead man keeps his post. A kind word is the only key.' },
  { id:'sold_loot',    title:'The Soldier: Broken Post',  tag:'bad',  hint:'He never raised his weapon. The shield was heavier after.' },
  { id:'sold_truth',   title:'The Soldier: Saluted',      tag:'mag',  hint:'An old marching-word, and the husk stood aside.' },
  { id:'bride_ring',   title:'The Bride: The Ring',       tag:'good', hint:'A thin gold band, in water past your depth.' },
  { id:'bride_dowry',  title:'The Bride: The Dowry',      tag:'bad',  hint:'Coin by coin she saved it, for a wedding the flood kept.' },
  { id:'bride_truth',  title:'The Bride: Spoken To',      tag:'mag',  hint:'Most only take. One traveler spoke.' },
  { id:'monk_vigil',   title:'The Cindermonk: The Vigil', tag:'good', hint:'The fire only keeps what you feed it.' },
  { id:'monk_quench',  title:'The Cindermonk: Quenched',  tag:'bad',  hint:'The ember-heart was a warm stone. It never stops being warm.' },
  { id:'monk_truth',   title:'The Cindermonk: Coal-Breath', tag:'mag', hint:'Patience, in the fire pit. Rare fuel.' },
  { id:'saint_relics', title:'The Saint: Assembled',      tag:'good', hint:'The last knuckle clicked home, and something exhaled.' },
  { id:'saint_theft',  title:'The Saint: Scattered',      tag:'bad',  hint:'Collectors don\'t ask where a knuckle came from.' },
  { id:'saint_truth',  title:'The Saint: One Bone',       tag:'mag',  hint:'Not a ritual — a rescue, interrupted a century ago.' },
  { id:'wolf_offer',   title:'The Wolfmother: Pack-Scent',tag:'good', hint:'Feed a mother in the dark, and move like one of hers.' },
  { id:'wolf_den',     title:'The Wolfmother: The Den',   tag:'bad',  hint:'The pelt is worth a month above ground. She makes you earn it.' },
  { id:'wolf_truth',   title:'The Wolfmother: Weighed',   tag:'mag',  hint:'She watched to see what you were, and decided.' },
  { id:'butcher_faced',title:'The Red Door: Faced',       tag:'bad',  hint:'Fresh meat, it said. It meant you.' },
  { id:'butcher_freed',title:'The Red Door: Unhooked',    tag:'good', hint:'He had learned not to scream. He remembered how to run.' },
  { id:'butcher_meat', title:'The Red Door: The Parcel',  tag:'bad',  hint:'Warmth like forgiveness. You did not ask what it was.' },
  { id:'coin_bless',   title:'The Coin: Heads',           tag:'mag',  hint:'The god was amused. This time, that was enough.' },
  { id:'coin_curse',   title:'The Coin: Tails',           tag:'bad',  hint:'Something was taken. The god was amused either way.' },
  { id:'coin_theft',   title:'The Coin: Pocketed',        tag:'bad',  hint:'Some debts are not collected. They are grown.' },
  { id:'prince_truth', title:'The Prince: The Truth',     tag:'mag',  hint:'His grace collapsed like the lie it was — and thanked you for it.' },
  { id:'prince_feast', title:'The Prince: The Wedding Guest', tag:'good', hint:'An empty cup, raised to a hundred-year-old happy day.' },
  { id:'prince_slain', title:'The Prince: The Mourner',   tag:'bad',  hint:'A groom at the grave of his bride, ended in one stroke.' },
  { id:'seam_refused', title:'The Parlor: Unaltered',     tag:'good', hint:'You kept your skin. She does alterations, whenever you change your mind.' },
  { id:'seam_traded',  title:'The Parlor: A Hand\'s Width', tag:'bad', hint:'Somewhere in that parlor, a glove now fits perfectly.' },
  { id:'seam_faced',   title:'The Parlor: Every Needle Rose', tag:'bad', hint:'She had you down for a winter coat.' },
  { id:'banq_ate',     title:'The Banquet: The Finest Meal', tag:'bad', hint:'You wept while you chewed. There was never any food.' },
  { id:'banq_fed',     title:'The Banquet: The King Fed',  tag:'good', hint:'No one had fed him in a very long time.' },
  { id:'banq_faced',   title:'The Banquet: Barely a Mouthful', tag:'bad', hint:'He has eaten kingdoms. He rose without anger.' },
  { id:'velvet_yielded', title:'The Chapel: Two Candles', tag:'bad',  hint:'You woke rested, and lighter, and you do not speak of it.' },
  { id:'velvet_prayed',  title:'The Chapel: Colder Prayers', tag:'good', hint:'You prayed to anything older than comfort. It answered.' },
  { id:'velvet_faced',   title:'The Chapel: Under the Veil', tag:'bad', hint:'It is not a face. It has been patient long enough.' },
  { id:'lard_fed',     title:'The Larder: A Guest',        tag:'good', hint:'Bread and salt fish, and two coins left for the keeper.' },
  { id:'lard_gorged',  title:'The Larder: Livestock',      tag:'bad',  hint:'Something on the stair approved of how well you ate.' },
  { id:'lard_took',    title:'The Larder: Provisions',     tag:'mag',  hint:'The door closed gently, like something saying: come back hungry.' },
  { id:'sever_first',  title:'Butchery: The First Cut',    tag:'bad',  hint:'Something lost a piece of itself, and kept fighting anyway.' },
  { id:'head_taken',   title:'Butchery: The Clean Take',   tag:'bad',  hint:'There is a stroke that ends every argument at once.' },
  { id:'starved_hollow', title:'Hunger: The Body\'s Ledger', tag:'bad', hint:'Past a certain point, the body starts paying its debts in flesh.' },
  { id:'meat_price',   title:'Hunger: The Meat\'s Price',  tag:'bad',  hint:'It was filling. It was warm. It was not free.' },
  { id:'coin_war_heads', title:'The Coin, Drawn in Battle: Heads', tag:'mag', hint:'Mid-fight, someone asked an old god to decide. It said yes.' },
  { id:'coin_war_tails', title:'The Coin, Drawn in Battle: Tails', tag:'bad', hint:'Mid-fight, someone asked an old god to decide. It decided against them.' },
  { id:'oath_taken',   title:'The Oathless: Taken On',    tag:'mag',  hint:'Someone chose to walk behind you. That is a debt, not a gift.' },
  { id:'oath_sent',    title:'The Oathless: Sent Up',     tag:'good', hint:'Bread, a little coin, and a direction that was not down.' },
  { id:'oath_seen',    title:'The Oathless: Looked At',   tag:'mag',  hint:'You looked properly, and the monster turned out to be a person.' },
  { id:'follower_lost',title:'The Oathless: Led To It',   tag:'bad',  hint:'They followed you all the way down. You are what happened to them.' },
  { id:'eliza_taken',  title:'Sinclair: At Your Shoulder', tag:'mag',  hint:'Not behind it. She has made that distinction loudly before.' },
  { id:'eliza_sent',   title:'Sinclair: Sent Away',        tag:'good', hint:'She said no pleasantly, kissed you, and left you her purse.' },
  { id:'eliza_gone',   title:'Sinclair: Out The Crack',    tag:'mag',  hint:'She does not die in holes like this one. That was the arrangement.' },
  { id:'eliza_stall',  title:'Sinclair: The Stall',        tag:'good', hint:'A crate, a folded cloak, bread for coin, and two knives within reach.' },
];

// ---------- Whispers: the deep talks to the damned (flavor lines, no mechanics) ----------
const WHISPERS = [
  'The walls here were grown, not built.',
  'Something below is counting your steps.',
  'You have been down here longer than you think.',
  'The dark does not hate you. It is worse than that. It is hungry.',
  'Turn back, says a voice that sounds exactly like yours.',
  'The stone remembers being bone.',
  '“Fresh meat,” something sighs — far away, or very near.',
  'Your shadow moved first just now. You are almost certain.',
  'Somewhere above, the sun has given up on you.',
  'The coin is still spinning, somewhere. It never landed.',
  'All the old tales were warnings. No one listened to a single one.',
  'The hooks are never empty for long.',
  'Skin is just a door. Everything down here knows how to knock.',
  'The needle remembers every hem it has ever closed. Including yours.',
  'Set another place at the table. Someone is always about to arrive.',
  'You are marinating. That is the word for what the deep is doing to you.',
  'Somewhere, a coat is being fitted. Try not to think about the measurements.',
  'The candles in the chapel are counting down. Two of them are yours.',
  'She has been waiting for you. She tells everyone that.',
  'Hunger is the oldest king. His table is never cleared.',
  'Your blood is only borrowed. The deep keeps a ledger.',
  'Whatever is beneath the veil, it smiled just now.',
  'The dolls are seated by size. There is an empty chair your size.',
  'Do not pray for rescue. Down here, something might answer.',
  'Your stomach growls, and something growls back, politely.',
  'Everything down here is missing a piece. You will fit right in.',
  'The larder is always stocked. Try not to learn the supplier.',
  'An arm is a tool. A leg is a promise. A head is a decision.',
];

// ---------- Biomes: each depth may shift terrain, light, foes — and how it treats each class ----------
// pal: ambient/torch are "r,g,b" for light gradients. Since the map became a
// drawn ink map, wallTop is the one colour key the tiles still read: inkPal() in
// game.js takes the region's stone hue from it and derives the whole paper/ink/
// hatch set, so a biome is retinted by editing wallTop alone. The remaining
// colour keys (wallFace/wallDark/floorA/floorB/speck) are the old painted-stone
// palette and no longer reach the screen.
// fov: global sight change on this floor. classMods: per-class stat deltas (fov key = personal sight change).
const BIOMES = {
  catacombs: { id:'catacombs', name:'The Catacombs',
    pal:{ wallTop:'#3a2f52', wallFace:'#241c34', wallDark:'#120d1c', floorA:'#17111f', floorB:'#140f1b', speck:'#0e0a15', ambient:'90,70,50', torch:'224,128,48' },
    fov:0, enemyTags:{}, classMods:{},
    hazard:{ name:'Collapsing Rubble', kind:'phys', color:'#6a5a7a', accent:'#3a3148' },
    flavor:'The old dark — stone, salt, and the patient dead.' },
  fungal: { id:'fungal', name:'The Fungal Deep',
    pal:{ wallTop:'#2f523a', wallFace:'#1c3424', wallDark:'#0d1c12', floorA:'#111f16', floorB:'#0f1b13', speck:'#1e3a24', ambient:'50,90,60', torch:'110,200,120' },
    fov:0, enemyTags:{beast:2.5, undead:0.6},
    classMods:{ knight:{def:-2}, rogue:{spd:2}, mage:{mag:3}, warden:{mag:-2} },
    hazard:{ name:'Spore Clouds', kind:'poison', color:'#7fae3a', accent:'#a8d060', immune:'mage' },
    flavor:'Spore-light drifts like snow. Everything here is patiently eating everything else.' },
  drowned: { id:'drowned', name:'The Sunken Harbor',
    pal:{ wallTop:'#33463f', wallFace:'#1e2e29', wallDark:'#0d1712', floorA:'#132019', floorB:'#111c17', speck:'#2f6a52', ambient:'50,90,80', torch:'90,180,150' },
    fov:0, enemyTags:{spirit:2.5, beast:1.4},
    classMods:{ knight:{spd:-2, def:1}, rogue:{spd:-1}, mage:{sp:2}, warden:{mag:2} },
    hazard:{ name:'Sucking Mire', kind:'chill', color:'#3a7a5a', accent:'#7fd0a0' },
    flavor:'A drowned harbor gone to swamp — rotted jetties, black water, and the potion-maker\'s crooked stall on the last dry stone.' },
  ember: { id:'ember', name:'The Ember Chasm',
    pal:{ wallTop:'#523a2f', wallFace:'#34211c', wallDark:'#1c0f0d', floorA:'#1f1411', floorB:'#1b110f', speck:'#c04a20', ambient:'110,60,40', torch:'224,110,48' },
    fov:1, enemyTags:{human:2.5},
    classMods:{ knight:{atk:2}, rogue:{atk:1, spd:-1}, mage:{mag:2}, warden:{def:-2} },
    hazard:{ name:'Fire Vents', kind:'fire', color:'#e08030', accent:'#ffcf5a' },
    flavor:'Heat breathes up from cracks in the world. The Choir\'s zealots love it here.' },
  ossuary: { id:'ossuary', name:'The Whitemarrow',
    pal:{ wallTop:'#5a5648', wallFace:'#3a3730', wallDark:'#1c1b16', floorA:'#211f1a', floorB:'#1d1b17', speck:'#141310', ambient:'90,85,70', torch:'210,190,140' },
    fov:0, enemyTags:{undead:3},
    classMods:{ knight:{def:1}, rogue:{spd:1}, mage:{sp:-2}, warden:{mag:3} },
    hazard:{ name:'Grasping Bones', kind:'phys', color:'#c6c0a8', accent:'#8a8570', immune:'warden' },
    flavor:'Walls of stacked bone, mortared with prayer. The dead here never finished dying.' },
  umbral: { id:'umbral', name:'The Blackwood',
    pal:{ wallTop:'#2f3a24', wallFace:'#1a2416', wallDark:'#0c130a', floorA:'#111a0e', floorB:'#0f170c', speck:'#3a5a24', ambient:'70,95,45', torch:'150,190,90' },
    fov:-2, enemyTags:{spirit:2, beast:1.5},
    classMods:{ knight:{def:-1}, rogue:{spd:2, fov:2}, mage:{mag:2}, warden:{fov:1} },
    hazard:{ name:'Root Snares', kind:'snare', color:'#6a9a3a', accent:'#3a5a1a', immune:'rogue' },
    flavor:'A forest of petrified roots where the lamplight simply gives up.' },

  // ---- new themed regions (no biome-locked events of their own; they draw from
  // the general encounter pool) ----
  dungeon: { id:'dungeon', name:'The Dungeon',
    pal:{ wallTop:'#4a4a55', wallFace:'#2c2c36', wallDark:'#151519', floorA:'#20202a', floorB:'#1c1c25', speck:'#12121c', ambient:'80,80,100', torch:'224,150,70' },
    fov:0, enemyTags:{}, classMods:{},
    hazard:{ name:'Rusted Traps', kind:'phys', color:'#7a6a5a', accent:'#48382a' },
    flavor:'Cold cells and colder iron. Whatever this place jailed, the doors are open now.' },
  desert: { id:'desert', name:'The Sunscoured Waste',
    pal:{ wallTop:'#6a5a3a', wallFace:'#463a24', wallDark:'#261f12', floorA:'#3a3020', floorB:'#342b1c', speck:'#8a7a4a', ambient:'150,120,70', torch:'255,200,90' },
    fov:1, enemyTags:{human:2.2, beast:1.5, undead:0.6},
    classMods:{ knight:{spd:-1}, rogue:{spd:1}, mage:{sp:-1}, warden:{def:1} },
    hazard:{ name:'Scouring Sand', kind:'fire', color:'#d0a050', accent:'#ffe0a0' },
    flavor:'Buried halls under a sea of sand. The heat is a hand pressing you down into it.' },
  castle: { id:'castle', name:'The Broken Keep',
    pal:{ wallTop:'#45485a', wallFace:'#2a2d3c', wallDark:'#14151f', floorA:'#1e2030', floorB:'#1a1c28', speck:'#3a4a6a', ambient:'80,90,130', torch:'224,170,90' },
    fov:0, enemyTags:{human:2.5, undead:1.3},
    classMods:{ knight:{atk:2, def:1}, rogue:{spd:1}, mage:{mag:1}, warden:{def:1} },
    hazard:{ name:'Loose Flagstones', kind:'phys', color:'#6a7088', accent:'#3a4056' },
    flavor:'A fortress that lost its war. The banners rotted; the garrison did not leave.' },
  cathedral: { id:'cathedral', name:'The Shattered Cathedral',
    pal:{ wallTop:'#4a3a5a', wallFace:'#2e2438', wallDark:'#16101c', floorA:'#201828', floorB:'#1c1522', speck:'#6a4a8a', ambient:'110,80,150', torch:'255,210,120' },
    fov:0, enemyTags:{undead:2, human:1.5, spirit:1.5},
    classMods:{ knight:{def:1}, rogue:{spd:-1}, mage:{mag:2}, warden:{mag:3} },
    hazard:{ name:'Weeping Cold', kind:'chill', color:'#8a6ac0', accent:'#c0a0f0' },
    flavor:'Stained glass over an altar no one has tended in an age. The prayers here curdled long ago.' },
  monastery: { id:'monastery', name:'The Silent Cloister',
    pal:{ wallTop:'#52463a', wallFace:'#342c22', wallDark:'#1a150f', floorA:'#26201a', floorB:'#221d17', speck:'#6a5a3a', ambient:'140,105,60', torch:'240,190,110' },
    fov:0, enemyTags:{spirit:2, human:1.6, undead:1.2},
    classMods:{ knight:{def:1}, rogue:{spd:1}, mage:{sp:1}, warden:{mag:2} },
    hazard:{ name:'Censer Fumes', kind:'poison', color:'#b0904a', accent:'#e0c070' },
    flavor:'Cells, a refectory, a library gone to mold. The brothers took a vow of silence and kept it past death.' },
};

// ---------- Sanctum: permanent between-run upgrades bought with Souls ----------
const SANCTUM = [
  { id:'vigor',     name:'Ancestral Vigor',    desc:'+6 Max HP each run, per rank.',              max:5, base:15, growth:12 },
  { id:'whet',      name:'Whetstone Rites',    desc:'+1 ATK each run, per rank.',                 max:5, base:18, growth:14 },
  { id:'ward',      name:'Warding Rites',      desc:'+1 DEF each run, per rank.',                 max:5, base:18, growth:14 },
  { id:'arcane',    name:'Arcane Attunement',  desc:'+1 MAG each run, per rank.',                 max:5, base:18, growth:14 },
  { id:'focus',     name:'Reserve of Focus',   desc:'+1 Max SP each run, per rank.',              max:4, base:22, growth:16 },
  { id:'pockets',   name:'Deep Pockets',       desc:'+15 starting Gold, per rank.',               max:4, base:12, growth:8 },
  { id:'provision', name:"Provisioner's Pact", desc:'Start with a Draught of Mending, per rank.', max:2, base:25, growth:20 },
  { id:'larder',    name:'The Deep Larder',    desc:'Start with a Grave-Bread, per rank.',        max:2, base:14, growth:10 },
  { id:'oath',      name:"Oathkeeper's Seal",  desc:'Start with +8 Honor, per rank.',             max:3, base:20, growth:15 },
  { id:'siphon',    name:'Soul Siphon',        desc:'Earn +20% Souls from deeds, per rank.',       max:3, base:35, growth:25 },
  { id:'favor',     name:"Merchant's Favor",   desc:'Shop Gold prices −10%, per rank.',           max:2, base:30, growth:20 },
];


// ---------- Painted map tints: how each region's stone tileset is coloured ----------
// The old pal colours were authored for an unlit near-black dungeon, so their
// lightness is useless here and their saturation says nothing about whether a
// region should read vivid (a sunlit waste) or drained (a crypt). These eight
// numbers are the whole look of a floor: g* is the ground, s* the quarried
// stone, o* whatever creeps over both. h is a hue in degrees, s and l percent.
const PAINT = {
  catacombs: { gh:272, gs:11, gl:63, sh:268, ss:13, sl:58, oh:96,  os:20 },
  fungal:    { gh:96,  gs:17, gl:66, sh:112, ss:15, sl:60, oh:88,  os:52 },
  drowned:   { gh:168, gs:18, gl:62, sh:172, ss:15, sl:56, oh:150, os:44, out:'swamp'  },
  ember:     { gh:22,  gs:34, gl:62, sh:14,  ss:26, sl:54, oh:26,  os:62 },
  ossuary:   { gh:44,  gs:19, gl:73, sh:46,  ss:13, sl:68, oh:58,  os:24 },
  umbral:    { gh:78,  gs:24, gl:60, sh:92,  ss:16, sl:54, oh:100, os:52, out:'forest' },
  dungeon:   { gh:214, gs:7,  gl:65, sh:216, ss:8,  sl:60, oh:100, os:30 },
  desert:    { gh:36,  gs:52, gl:74, sh:34,  ss:40, sl:69, oh:72,  os:40, out:'sand'   },
  castle:    { gh:214, gs:13, gl:64, sh:218, ss:13, sl:58, oh:96,  os:34 },
  cathedral: { gh:286, gs:16, gl:64, sh:280, ss:17, sl:58, oh:298, os:30 },
  monastery: { gh:37,  gs:26, gl:69, sh:35,  ss:20, sl:63, oh:80,  os:34 },
};


// ---------- Codex stories ----------
// A hint is the smell of a thing. This is the thing. An unlocked entry opens
// into one of these, so a discovery is worth reading and not only counting.
const CODEX_LORE = {
  // -- the well --
  well_mercy: "Her name was Ordra, and she drew water for a garrison that stopped coming up for it. She kept drawing anyway; the rope wore a groove in the stone lip that you can still put a finger into. She has offered that cup to four hundred travellers. Most drew steel. She remembers the ones who drank, and she says their names into the shaft where the echo keeps them.",
  well_lore: "She was down here before the throne was filled, and she watched them carry the first Gloamlord past her well on a bier of green wood. What she told you is not prophecy. It is a witness statement, four centuries late, given to the first person who stood still long enough to hear it out.",
  well_truth: "Under the water-light she was grey and wrong, and every instinct you own said kill it. You did not. What fell away was not a mask but a habit — four hundred years of being met with a blade teaches a face to expect one. Beneath it: a tired woman, embarrassed, still holding out the cup.",
  well_bloodied: "She was reaching for the cup. You saw a claw. The stone around the well took the stain and would not give it up, and now the water tastes of iron for anyone who comes after you. She had been drawing it clean since before your grandmother's grandmother had a name.",

  // -- the cage --
  cage_freed: "The cage was Choir work — thin bars, a good lock, and a plate reading PROPERTY OF THE ASHEN SEE. Whatever they caught in the Weald had been in there long enough to wear its own shape smooth against the corner. It did not thank you. It fell in beside you at the next corridor and has not left your flank since, which is a thank-you with the words taken out.",
  cage_slain: "It was already starving when the Choir hung the cage. It could not reach you. It could not have reached you in a week of trying. You are not the first to make certain through the bars, and the small bones on the floor of it are not all its own — the last three were mercy, or something that agreed to be called mercy.",

  // -- the beggar --
  beg_alms: "He had a name and traded it for a warmer coat two winters ago; he says the deal was fair. What he gives back is not gratitude but information — he counts who goes down and who comes up, and the difference is the only ledger anyone keeps down here. You are in it now, on the good page.",
  beg_blood: "The hand came up out of the dark towards your purse, and you were right about that much. You were wrong about the rest. He was ninety, he weighed as much as a wet cloak, and the only thing in his fist was the copper he was trying to give back because you had overpaid him at the stair.",

  // -- the shrine --
  shr_rest: "Twelve of the order were laid here without rite because the priest went down the stairs first and never came back up to say the words. You said them badly, from memory, with three lines missing. It was enough. The stone went cold in the ordinary way that stone does when nothing is inside it any more.",
  shr_pact: "The thing under the altar is not a god and has never claimed to be. It is a lender. Its terms are plain, its interest is patient, and it has never once failed to collect — not in nine hundred years, not from anyone, not from the four who thought that dying settled it.",

  // -- the mirror --
  mir_saint: "The glass does not flatter and it does not lie; it only removes the distance between what you are and what you can see. A crown appeared because a crown was already there. Twenty-two travellers have stood at that mirror. Three have been shown this.",
  mir_gray: "Half-lit, undecided, neither one thing nor the other — the glass shows the ledger open and the sum not yet taken. It is the commonest reflection by far. Most people go into the dark unfinished and come out of it the same way, if they come out.",
  mir_fiend: "The teeth are yours. That is the part that takes the longest to sit down with. The glass did not add anything; it stopped subtracting, and what stood there was a thing that has stopped being afraid of itself. It reached through and gave you what you had already earned.",
  mir_shatter: "Some travellers will not look. They go at the glass with the pommel before it can finish showing them, and the shards keep working — every piece on that floor still holds a sliver of a face that refused to be seen whole. The mirror does not mind. It has been broken eleven times and has not lost the habit.",

  // -- the gibbet --
  hang_rite: "The cage on the chain held a woman who was hung for a crime the records now spell three different ways. Nobody cut her down because nobody wanted the cage. You gave her what her own city would not: the ground, and the words, and about four minutes of somebody's day.",
  hang_robbed: "The charm at her throat was a pilgrim's token, the cheap kind, stamped tin — carried by someone who intended to walk somewhere holy and got as far as this. It was worth almost nothing and she had kept it through the trial, the sentence, and the chain. Now you have it.",

  // -- the child --
  child_kind: "She is not lost, whatever she tells you; she has been down here longer than the stair has been unsafe, and she knows exactly where she is. What she has lost is the expectation of a kind hand. You gave her one. She will tell the next thing that asks about you, and she will tell it well.",
  child_truth: "Fear had already made a monster of her twice over — once in her own mind, and once in every traveller who came around that corner with a blade up. You looked twice. Under the second look she was a frightened girl with dirt on her, which was all she had ever been, and all that had ever been required of anyone was the second look.",
  child_blood: "The Codex keeps this one at the front of its bad ledger and does not soften it. She was seven. She was seven for a very long time before you came, and she was seven when you finished. Whatever you told yourself in the corridor afterwards, the grave is small, and it is the right size, and that is the whole argument.",

  // -- the oath --
  oath_kept: "Ser Hallam of the Ninth, bleeding out against a wall he had held for two days after there was any reason to. He did not want to be saved and did not ask to be. He asked for the blade to keep working. You swore, so it does — and the vow is a weight, and the weight is the point.",
  oath_freely: "You did not reach for it. That was the whole test, and he set it four hundred years ago for a fault of his own that the records no longer hold. Everyone else grabbed. You waited, and he put it in your hands himself, which is worth more than the steel is.",
  oath_broken: "He was still talking when you took it. The blade came away easily — he had no grip left to argue with — and the sentence he did not finish was probably the terms. A gift refused is a theft, and steel remembers which one it was.",

  // -- the lightbearer --
  light_blessed: "She does not appear to most. She is not hiding; there is simply nothing in the majority worth the walk. The light she carries is not a lamp and does not run out, and being met with it openly is a statement about you that no one else down here will ever make.",
  light_ward: "The ward she set will hold exactly as long as your hands stay clean, and she said so plainly, and she meant it as a kindness rather than a threat. It is the only protection in the depths with a moral clause, and the only one that has never been broken from the outside.",

  // -- the envoy --
  envoy_bribe: "The Choir's writ names you and the Envoy carries it, and the Envoy also carries a purse and an understanding of how far from the See she currently is. Doctrine is for the surface. Down here the Inquisition is a small cold woman doing arithmetic, and the arithmetic came out in your favour.",
  envoy_defiant: "Standing orders for the Marked are clear and she was reciting them when you drew. She had done this eleven times and won eleven times, and none of those eleven had anything on them worth the weight of carrying back. You do. The writ is still in her coat.",
  envoy_scorn: "You could have paid. You could have fought. You spat at the Choir instead, which costs nothing at the time and is entered into a ledger in the See the same evening. The bounty on you did not double because of the insult. It doubled because insults get filed.",

  // -- the sporewife --
  spore_mercy: "In the Fungal Deep the Deep provides, and she is the part of it that pours. The tea is made of things that should not brew and it will do you nothing but good, which is the single most suspicious fact in the region. She has been hosting for a hundred and some years and has never once poisoned a guest who sat down politely.",
  spore_graft: "What she put into you is alive, it is hers, and it is now also yours — the paperwork on that is genuinely unclear. You are more than you were. Some small percentage of the additional is on loan, and the Deep does not send notices, but it does keep count.",
  spore_slain: "The hum you cut through was a lullaby; the tendrils you cut were the hands of someone reaching for a kettle. She hosted four hundred years of travellers in a place that grows nothing kind, and the last thing she understood was that the guest had come in with the blade already out.",
  spore_truth: "You watched instead of cutting, which in the Fungal Deep is a survival skill nobody teaches. The wrongness resolved the way wrongness usually does when you give it a minute: not a horror at all, only an old woman with an unusual body and a kettle on.",

  // -- the ferryman --
  ferry_toll: "The crossing has a price and the price is a coin, and it has been a coin since before the halls drowned. He is not greedy. The coin is not for him. He puts every one into the lockbox under the seat and could not tell you who he is saving them for, only that the arrangement was made and he intends to keep his end.",
  ferry_robbed: "The lockbox held fares from travellers going back a very long way — other people's crossings, other people's debts, kept honestly by something that no longer remembers why. He did not stop you. He watched you take it and then went back to the pole, and the boat still goes across for anyone who asks.",
  ferry_truth: "Everyone else pays him or robs him. You spoke to him. Somewhere under the water in his chest a name surfaced that had not been used since the halls were dry, and he answered to it, and for a moment the thing at the pole was a man who had a job.",

  // -- the forge widow --
  forge_temper: "She keeps a working forge in the Ember Chasm, which is either the best or the worst place for one depending on how you feel about heat. She took your steel, looked at it the way a physician looks at a limb, and gave it back better. She did not ask your name and she did not need to.",
  forge_gift: "She stamps a maker's mark on the ones who feed her coals — the old mark, from before the See regulated the trade. It is not decorative. Things made under that mark hold an edge past what the metal should allow, and the four smiths who knew why are all dead.",
  forge_blood: "On her bench when you were done: plowshares, hinges, a pot with a mended handle, and a toy sword sized for a child's hand. No Choir work. No relics. No reason. She had been down here making useful things for people who never came back for them.",
  forge_truth: "You were certain, and then you looked at the bench, and the certainty had to sit down. A cooking pot is a hard thing to be afraid of. She let you look as long as you needed and then asked, without any edge in it, whether you wanted your blade seen to.",

  // -- the bone choir --
  choir_hymn: "Nine cantors went down with the last procession and nine cantors are still singing, which is either devotion or the deepest rut ever worn into a habit. The hymn is not for a god. It is a door held shut with sound, and it has been held for three hundred years by voices that no longer have throats.",
  choir_smashed: "The shrieking stopped, which was the point. What the singing was holding shut did not stop, which was not explained to you at the time and would not have been believed. Some doors only stay closed while someone sings at them. Nine did. Now none do.",
  choir_truth: "It only shrieks if you arrive expecting a shriek. Stand still through eight bars and the noise resolves into nine parts in genuine harmony, badly out of practice and absolutely committed. They made room for a tenth without breaking the line, which is the most anyone down here has ever offered a stranger.",

  // -- the lamplighter --
  lamp_guided: "He has been blind since before the Weald went dark, which is why the dark did not inconvenience him and why he never stopped lighting the road. He lights it for people he will never see, on a route he cannot walk any more, and he has never once been thanked by anyone who did not need something.",
  lamp_snuffed: "The bobbing light in the Blackwood is a lure, everyone agrees, and everyone is wrong. It was held by someone. He heard you coming and lifted it higher so you would not lose the path, and that is the position it was in when you took the pole off him.",
  lamp_truth: "You followed it carefully instead of charging it, which is the only way to find out. Bobbing, because he limps. Weaving, because he counts the trees by touch. Not a lure at all — a moth of a man, going out ahead of strangers with the only light in the Weald.",

  // -- the soldier --
  sold_pass: "The Broken Keep fell and the garrison did not leave, and most of them have stopped being anything at all. He has not. He is still on the gate, still waiting for the watchword, and the watchword has not changed because there is nobody left with the authority to change it.",
  sold_loot: "He never raised the weapon. He was at attention when you took the shield off his arm, because attention is the last thing he has, and the strap had gone into the bone a long time ago and had to be worked free.",
  sold_truth: "You gave him an old marching-word from a war two before this one, badly pronounced. He stood aside. He has stood aside for exactly nobody else, and for a moment there was a soldier in the husk who remembered being relieved of a post.",

  // -- the bride --
  bride_ring: "A thin gold band, in water past your depth, on a hand that has been holding it up out of the silt for longer than the harbour has been under. She is not offering it. She is showing it. There is a difference, and every traveller who has waded out there has failed to notice it.",
  bride_dowry: "Coin by coin over eleven years, for a wedding that the flood got to first. She kept the box through the water, the dark, and the slow business of stopping being alive, and she was still keeping it when you found the latch.",
  bride_truth: "Most travellers take. One spoke — asked her, out loud, in the water, who the ring was for. She has been waiting a hundred and forty years for the question, and the answer took some time to assemble, and it was worth the wait for both of you.",

  // -- the cindermonk --
  monk_vigil: "The order kept one fire alight as a matter of doctrine and then the order ended, and he did not get the message, and the fire is still alight. He will not explain the doctrine. He will let you sit the vigil with him, which is the only initiation that survived.",
  monk_quench: "The ember-heart in his chest was a warm stone, roughly the size of a fist, and it had never in three hundred years been used to burn anything. He did not defend it. He watched the water go on and looked, mostly, apologetic — as though the trouble of quenching him had been an imposition on you.",
  monk_truth: "You waited in the fire pit while he took a very long breath, which is what patience buys down here: the coal-breath, the old blessing, given only to those who did not fill the silence. It is rare fuel. He has given it four times.",

  // -- the saint --
  saint_relics: "Thirty-one pieces, scattered across four regions by people who wanted a knuckle each. The last one clicked home and something that had been in thirty-one places at once was finally, briefly, in one — and whatever it said in that moment was not in any language the See recorded.",
  saint_theft: "Collectors do not ask where a knuckle came from and the trade above ground is brisk. You have removed one bone from an arrangement that thirty other people have also removed one bone from, and the arithmetic on that only ever goes one direction.",
  saint_truth: "Not a ritual. A rescue, begun by someone who ran out of time about a century in, and continued by nobody until you. The remaining pieces are where they are because a person was carrying them somewhere, and got as far as this.",

  // -- the wolfmother --
  wolf_offer: "She is nursing in a place that grows nothing, and she came out to meet you because staying in the den was worse. You fed her. The pack-scent she marked you with is not affection; it is a note left for everything else in the Blackwood, and it reads: not this one.",
  wolf_den: "The pelt is worth a month above ground and the den behind her is worth nothing to anybody. She put herself between you and it and stayed there, which is the entire job, and she did it correctly right up to the end.",
  wolf_truth: "She was not stalking you. She was weighing you, from a distance, for as long as it took — and she has done this to sixty travellers and moved off from fifty-nine. Whatever the criterion is, you met it.",

  // -- the red door --
  butcher_faced: "The sign on the door says FRESH MEAT and it is not advertising. He is very good at the work, he has been at it a long time, and he was genuinely pleased to see you — the way a tradesman is pleased when the material walks in on its own legs.",
  butcher_freed: "The man on the hook had learned not to scream, which takes a while, and he had also learned exactly how the room worked. That was the useful part. He came off the hook, and he remembered the way out, and he walked it ahead of you without once looking at the wall of the previous customers.",
  butcher_meat: "It was warm and it was wrapped well and it went down like forgiveness. You did not ask. There was one obvious question and you carried the parcel past it, and the not-asking is the part the Codex has written down.",

  // -- the coin --
  coin_bless: "The coin has no faces. You have seen it, so you know. It landed, something on the other side of it was amused, and amusement in that quarter comes out as a gift roughly half the time — which is a better rate than prayer.",
  coin_curse: "Something was taken. The god was amused either way; that is the entire nature of the arrangement and it was never concealed from you. It does not punish. It does not reward. It flips, and it laughs at both results, and it has been doing this since before there was a floor here.",
  coin_theft: "You pocketed it instead of flipping it, which is not theft exactly — nobody owns it — but it is a way of declining to play while keeping the table stakes. Debts like that are not collected. They are grown, quietly, and presented much later, fully mature.",

  // -- the prince --
  prince_truth: "The grace was real once. He was married in the upper chapel with four hundred guests and he has not been able to stop being at that wedding since. Look directly at it and the whole thing comes down at once — the court, the manners, the bride's chair — and what is left is a man standing in a hall alone.",
  prince_feast: "An empty cup raised at a hundred-year-old wedding, by the only guest who has ever turned up. He noticed. He has been receiving nobody for a very long time and he knows exactly how many that is, and one is a number he had stopped expecting.",
  prince_slain: "He was a groom at the grave of his bride, and he was in the middle of an introduction. He would have let you leave. He has let everyone leave. The hall is quieter now, which some travellers have described as an improvement.",

  // -- the parlor --
  seam_refused: "She does alterations. She said so at the door, plainly, and the terms were on the table where you could read them. You kept your skin, which she took no offence at — she has a waiting list, and a customer who walks out is simply a customer who has not come round to it yet.",
  seam_traded: "A hand's width, taken neatly, sewn shut before you had finished agreeing. Somewhere in that parlor a glove now fits somebody perfectly, and she has your measurements on a card in a drawer with three hundred others.",
  seam_faced: "Every needle in the room came up at once, which is the moment most people understand the business model. She had you down for a winter coat. The pattern was already chalked, and she was, in her way, disappointed to have to hurry it.",

  // -- the banquet --
  banq_ate: "The finest meal ever set in front of you, in a hall where the plates have not been cleared since the siege. You wept while you chewed and you did not stop chewing. There was never any question of stopping. That is what makes it his table and not yours.",
  banq_fed: "You put food in front of the Starveling King, which nobody has done in the entire time he has been sitting there, and he has been sitting there since the city above forgot its own name. He ate slowly. He has eaten kingdoms fast and this took him some time.",
  banq_faced: "He has eaten kingdoms. He rose without any particular urgency, the way a man rises for a small course between two large ones, and the fact that you are reading this at all is the most remarkable line in the Codex.",

  // -- the chapel --
  velvet_yielded: "Two candles were lit for you and you woke rested, which is the rarest thing in the depths and should have been the warning. You are lighter. You cannot say by what, and neither can anyone else who has come out of that chapel sleeping well.",
  velvet_prayed: "You prayed to something older than comfort, in a chapel built for the opposite, and the cold came in and stayed. Nothing was given. Nothing was taken either, and in the Shattered Cathedral a clean exchange of nothing is a considerable win.",
  velvet_faced: "It is not a face. It has been patient for a very long time under that veil and patience is not the same as gentleness — it is only the shape gentleness leaves behind when it goes. The veil came up. Very few entries in this Codex were written afterwards.",

  // -- the larder --
  lard_fed: "Bread and salt fish, taken as a guest takes them, with two coins left on the shelf for the trouble. Whatever keeps that larder stocked has a strong opinion about the difference between a guest and a thief, and it does not need to explain the opinion twice.",
  lard_gorged: "You ate until you could not, and something on the stair listened to you doing it, and approved. Approval from that direction is a category of attention, and attention is how livestock gets counted.",
  lard_took: "You took what you needed and left the rest, and the door closed behind you gently — the way something closes a door when it has decided you may come back. That is the whole entry. It is a small thing and it is not nothing.",

  // -- butchery, by your own hand --
  sever_first: "The first one is a technical achievement and nothing else, and it goes in the ledger as such. Something lost a piece of itself and kept coming, which teaches you the useful half of the lesson: pieces are not the same as the whole, and the whole is what is trying to kill you.",
  head_taken: "There is a stroke that ends every argument at once, and once your arm knows it, your arm will keep offering it. That is the part worth writing down. Not that you took the head — that you now have a first idea, and it is that one.",

  // -- hunger --
  starved_hollow: "Past a certain point the body stops asking and starts selling: the fat, then the muscle, then the parts it was using for thinking. The ledger is real, it is itemised, and the depths have watched a great many people read it all the way to the bottom.",
  meat_price: "It was filling. It was warm. It was not free, and it was not, in the ordinary sense, meat. You knew all three of those things at the time, in the order given, and you ate anyway — which is the datum the Codex actually wanted.",

  // -- the coin, mid-fight --
  coin_war_heads: "Asking an old god for help with a blade already in motion is not prayer, it is arbitration, and it is a genuinely stupid thing to do. It came up heads. The arbitration went your way. Do not read anything into it; there is nothing in it to read.",
  coin_war_tails: "You asked mid-swing, and the answer arrived mid-swing, and it was no. The god was amused. It is always amused. The only thing that varies is which side of the amusement you are standing on when the coin comes down.",

  // -- the oathless --
  oath_taken: "She followed you out of a cell she could have opened herself at any point in the last four months, which tells you what she was actually waiting for. Not a rescue. A reason. She has decided you are one, and she is not going to check the work.",
  oath_sent: "You sent her up, and she went, because you asked and because going up is the one instruction nobody down here ever gives. Whether she made the surface is not recorded. The Codex only keeps what it saw, and what it saw was somebody choosing to spend a chance on another person.",
  oath_seen: "She spent the whole descent expecting to be spent — used for a door, a trap, a distraction, the way the last three did it. You looked at her instead, once, as a person. She has not mentioned it and she will not, and it is the single most important thing in her half of this Codex.",
  follower_lost: "She went where you led her. That is the whole of it and there is no reading of it that comes out otherwise. The Codex records the honor floor as an absolute because the depths, for once, agree with the surface about something.",

  // -- sinclair --
  eliza_taken: "Your wife, and the better thief of the two of you, which was settled years ago and is not reopened. She did not follow you down. She was here first, working, and she stepped in at your shoulder as though the intervening time had been a long errand you were late back from.",
  eliza_sent: "You sent her away and she went, at a walk, without an argument — which from her is the loudest available response. She does not die in holes like this one. That was the arrangement, and the arrangement is hers, and she is holding up her end whether or not you are.",
  eliza_gone: "Out the crack, in the dark, at speed, with the thing that was killing her still deciding where she had gone. She does not die in holes like this one. She has said it to you often enough that it has stopped being a joke and become a working method.",
  eliza_stall: "A crate, a folded cloak, bread priced for people who have no coin, and two knives within reach under the cloth. She set up a shop in the depths and undercut the Hollow Merchant, and the stall is not a disguise — she is genuinely trading, and she is genuinely armed, and both are true at once.",
};

const Data = { SKILLS, PASSIVES, CLASSES, FOLLOWERS, ENEMIES, EVENT_ICONS, SETS, RARITY, ITEMS, CONSUMABLES, PLANTS, POTIONS, ITEM_POOL, HUNTER_POOL, BIOME_ELITES, BIOME_GUARDIANS, BOSSES, BIOME_PROPS, HONOR_TIERS, EVENTS, CODEX, CODEX_LORE, SANCTUM, BIOMES, PAINT, WHISPERS, DISCOURAGEMENTS, DESERTIONS,
  honorTier(h){ for (const t of HONOR_TIERS){ if (h >= t.min) return t; } return HONOR_TIERS[HONOR_TIERS.length-1]; },
  enemyPool(depth){
    const ids = [];
    for (const k in ENEMIES){ const e = ENEMIES[k]; if (e.boss || e.hunter || e.elite || e.guardian) continue; if (e.tier <= depth + 1) ids.push(k); }
    return ids;
  },
  rollItemId(tier){
    const pool = ITEM_POOL[U.clamp(tier,1,3)] || ITEM_POOL[1];
    return U.choice(pool);
  }
};
