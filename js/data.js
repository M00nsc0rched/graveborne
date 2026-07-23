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
  drain: { name:'Life Drain', type:'magic', cost:3, cls:'mage', open:true, desc:"Siphon the foe's vitality.",
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

// ---------- Class passives ----------
// One signature rule per class, always on, no button to press.
const PASSIVES = {
  mage: [
    { name:'Accretion',  desc:'Every fight you win teaches her something: +5 to one random stat and +5 power to one random skill, for the rest of the descent.' },
  ],
  knight: [ { name:'Oathbound', desc:'Against the undead you open every fight already braced: a shield and your fury up.' } ],
  warden: [ { name:'Last Vigil', desc:'Once per descent a killing blow leaves you at 1 HP — then you have 2 turns to finish the foe, or it finishes you.' } ],
  rogue:  [ { name:"Cutthroat's Luck", desc:'Each fight the coin picks one: every strike bleeds, or your critical hits land far harder.' } ],
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
    hp:130, atk:16, def:10, mag:14, spd:9, gold:[45,70], boss:true,
    moves:[ {name:'Grave Cleave',type:'attack',power:18,w:3}, {name:'Necrotic Wave',type:'magic',power:16,effect:{poison:{dmg:5,turns:3}},w:2},
            {name:'Soul Rend',type:'magic',power:14,effect:{lifesteal:0.5},w:2}, {name:'Bone Ward',type:'defend',shield:'def2',w:1} ] },

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
const BIOME_ELITES = { catacombs:'gravemaw', fungal:'sporetyrant', drowned:'undertow', ember:'cinderprophet', ossuary:'marrowcantor', umbral:'rootwolf' };

// ---- Decorative props: dressing that fits each biome. Purely visual — they
// never block a route (see the decorative-entity rule in game.js/dungeon.js).
const BIOME_PROPS = {
  catacombs: ['obj_shelf','obj_statue','obj_table','obj_chair','obj_urn','obj_sarcophagus','obj_brazier'],
  fungal:    ['obj_mushroom','obj_stump','obj_barrel','obj_urn'],
  drowned:   ['obj_barrel','obj_urn','obj_statue','obj_table'],
  ember:     ['obj_brazier','obj_barrel','obj_statue','obj_bones'],
  ossuary:   ['obj_bones','obj_sarcophagus','obj_statue','obj_urn','obj_shelf'],
  umbral:    ['obj_stump','obj_mushroom','obj_bones','obj_urn'],
};

// ---- Legendary Guardians: one bars the stair on every floor; slay them to descend ----
// dialogue.lines: intro always; class[job] always; marked/hallowed by alignment; items by equipped weapon.
Object.assign(ENEMIES, {
  morr: { id:'morr', name:'Morr, the Tollkeeper', sprite:'en_skeleton', guardian:true, tier:1, tags:['undead'],
    hp:85, atk:15, def:10, mag:8, spd:8, gold:[30,50],
    moves:[ {name:'Toll Scythe',type:'attack',power:17,w:3}, {name:'Coin of the Dead',type:'magic',power:12,effect:{weaken:{amt:5,turns:3}},w:2},
            {name:'Grave Tax',type:'magic',power:12,effect:{lifesteal:0.6},w:2}, {name:'Vault Ward',type:'defend',shield:'def2',w:1} ],
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
    hp:100, atk:14, def:7, mag:10, spd:6, gold:[28,48],
    moves:[ {name:'Root Crush',type:'attack',power:16,w:3}, {name:'Spore Tide',type:'magic',power:11,effect:{poison:{dmg:5,turns:3}},w:2},
            {name:'Regrow',type:'heal',healFlat:14,w:1} ],
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
    hp:88, atk:12, def:8, mag:16, spd:9, gold:[30,50],
    moves:[ {name:'Baptism',type:'magic',power:16,w:3}, {name:'Undertow',type:'magic',power:11,effect:{lifesteal:0.6},w:2},
            {name:'Depth Chill',type:'magic',power:9,effect:{weaken:{amt:5,turns:3}},w:1}, {name:'Font Ward',type:'defend',shield:'def2',w:1} ],
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
    hp:90, atk:13, def:8, mag:17, spd:9, gold:[32,52],
    moves:[ {name:'Kilnfire',type:'magic',power:17,w:3}, {name:'Glaze',type:'attack',power:13,effect:{stun:0.3},w:2},
            {name:'Stoke the Coals',type:'buff',effect:{atkbuff:{amt:5,turns:3}},w:1} ],
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
    hp:95, atk:16, def:12, mag:10, spd:7, gold:[32,52],
    moves:[ {name:'Catalogue Pin',type:'attack',power:15,effect:{stun:0.35},w:2}, {name:'Filing Dirge',type:'magic',power:12,effect:{weaken:{amt:5,turns:3}},w:2},
            {name:'Marrow Audit',type:'attack',power:16,w:3}, {name:'Bone Ward',type:'defend',shield:'def2',w:1} ],
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
    hp:92, atk:15, def:9, mag:15, spd:12, gold:[30,50],
    moves:[ {name:'Smother',type:'magic',power:15,w:3}, {name:'Shadow Lash',type:'attack',power:14,w:2},
            {name:'Unlight',type:'magic',power:9,effect:{weaken:{amt:5,turns:3}},w:2}, {name:'Fade',type:'defend',shield:'def2',w:1} ],
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
});

// which legend bars each biome's stair
const BIOME_GUARDIANS = { catacombs:'morr', fungal:'mycel', drowned:'brine', ember:'pyraxes', ossuary:'curator', umbral:'firstshadow' };

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
  bloodroot:  { name:'Bloodroot',      glyph:'✿', color:'#c05070' },
  gravemoss:  { name:'Gravemoss',      glyph:'❧', color:'#7fae3a' },
  wickthorn:  { name:'Wickthorn',      glyph:'✤', color:'#c8a24a' },
  nightcap:   { name:'Nightcap',       glyph:'❀', color:'#9a5cc0' },
  ashen_lily: { name:'Ashen Lily',     glyph:'✽', color:'#c9bfd6' },
  weepwort:   { name:'Weepwort',       glyph:'❦', color:'#7fb0d0' },
  gallowvine: { name:'Gallowvine',     glyph:'☙', color:'#6fbf6a' },
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
// pal: wallTop/wallFace/wallDark/floorA/floorB/speck are colors; ambient/torch are "r,g,b" for light gradients
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
  drowned: { id:'drowned', name:'The Drowned Halls',
    pal:{ wallTop:'#2f3a52', wallFace:'#1c2434', wallDark:'#0d121c', floorA:'#111721', floorB:'#0f141d', speck:'#2a4a66', ambient:'50,70,110', torch:'80,140,224' },
    fov:0, enemyTags:{spirit:3},
    classMods:{ knight:{spd:-2, def:1}, rogue:{spd:-1}, mage:{sp:2}, warden:{mag:2} },
    hazard:{ name:'Frigid Pools', kind:'chill', color:'#4a74c0', accent:'#7fb0d0' },
    flavor:'Black water sheets the stone. Every pool remembers a face that is not yours.' },
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
  umbral: { id:'umbral', name:'The Umbral Weald',
    pal:{ wallTop:'#2a2138', wallFace:'#171126', wallDark:'#0a0714', floorA:'#0e0a17', floorB:'#0c0914', speck:'#070510', ambient:'60,45,85', torch:'150,90,220' },
    fov:-2, enemyTags:{spirit:2, beast:1.5},
    classMods:{ knight:{def:-1}, rogue:{spd:2, fov:2}, mage:{mag:2}, warden:{fov:1} },
    hazard:{ name:'Root Snares', kind:'snare', color:'#9a5cc0', accent:'#5a3a78', immune:'rogue' },
    flavor:'A forest of petrified roots where the lamplight simply gives up.' },
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

const Data = { SKILLS, PASSIVES, CLASSES, FOLLOWERS, ENEMIES, EVENT_ICONS, SETS, RARITY, ITEMS, CONSUMABLES, PLANTS, ITEM_POOL, HUNTER_POOL, BIOME_ELITES, BIOME_GUARDIANS, BIOME_PROPS, HONOR_TIERS, EVENTS, CODEX, SANCTUM, BIOMES, WHISPERS, DISCOURAGEMENTS, DESERTIONS,
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
