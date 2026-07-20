// ================= GRAVEBORNE — main engine =================
const VW = 21, VH = 13, TS = 16;      // viewport tiles + tile size
const FINAL_DEPTH = 5;
const FOV_R = 5;
const MARK_AT = -40;   // honor <= this  → Marked: hunted by the Inquisition, richer loot
const HALLOW_AT = 40;  // honor >= this  → Hallowed: safe, friendly encounters, leaner loot

function alignment(h){ return h <= MARK_AT ? 'MARKED' : h >= HALLOW_AT ? 'HALLOWED' : 'MORTAL'; }

// ---- Biomes: helpers for the current floor's terrain ----
function curBiome(){ return Data.BIOMES[G.biome || 'catacombs']; }
function biomeClassMods(p){ const b = (typeof G !== 'undefined' && G.biome) ? Data.BIOMES[G.biome] : null; return (b && b.classMods && b.classMods[p.classId]) || {}; }
function fovRadius(){
  const b = curBiome(), cm = biomeClassMods(G.player);
  return Math.max(2, FOV_R + (b.fov || 0) + (cm.fov || 0) + (G.floorFov || 0));
}
// each new depth has a chance to shift terrain; depth 1 is always the Catacombs,
// and the Gloamlord keeps his throne in the Whitemarrow
function rollBiome(){
  if (G.depth === 1) return 'catacombs';
  if (G.depth === FINAL_DEPTH) return 'ossuary';
  if (G.biome && U.chance(0.35)) return G.biome;
  return U.choice(Object.keys(Data.BIOMES).filter(k => k !== G.biome));
}

// ---- Bounty / Heat: the hunt ramps the longer you linger while Marked ----
const HEAT_TIER_NAMES = ['Wanted', 'Hunted', 'Pursued', 'Condemned'];
function heatTier(h){ return h >= 75 ? 3 : h >= 50 ? 2 : h >= 25 ? 1 : 0; }
function heatScale(){ return 1 + 0.15 * heatTier(G.player ? (G.player.heat||0) : 0); }
// initial hunters + reinforcement cadence by heat tier
const HEAT_FLOOR_HUNTERS = [1, 1, 2, 3];
const HEAT_REINFORCE_CD  = [999, 14, 10, 7];
// loot/soul multipliers by alignment — the core low-vs-high tradeoff
function lootMods(){
  const a = alignment(G.player.honor);
  if (a === 'MARKED')   return { a, goldMult:1.6,  dropBonus:0.25,  tierMod:1,  soulMult:1.5 };
  if (a === 'HALLOWED') return { a, goldMult:0.55, dropBonus:-0.15, tierMod:-1, soulMult:0.8 };
  return { a, goldMult:1, dropBonus:0, tierMod:0, soulMult:1 };
}

let canvas, ctx;
let G = {
  state:'TITLE',   // TITLE, CHARSELECT, EXPLORE, COMBAT, EVENT, GAMEOVER, VICTORY
  player:null, floor:null, depth:1,
  combat:null, busy:false, time:0, moving:false, selClass:'knight',
};

// ---------------- init ----------------
function init(){
  canvas = U.el('game');
  ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  window.addEventListener('keydown', onKey);
  initTouchControls();
  requestAnimationFrame(loop);
  showTitle();
}

// ---------------- touch controls (phones/tablets) ----------------
function initTouchControls(){
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) document.body.classList.add('touch');
  const pad = U.el('touch-controls');
  if (!pad) return;
  let repeatTimer = null;
  const act = (btn) => {
    if (G.state !== 'EXPLORE' || G.busy) return;
    if (btn.dataset.wait){ worldTurn(); if (G.state === 'EXPLORE') revealFOV(); return; }
    move(parseInt(btn.dataset.dx, 10), parseInt(btn.dataset.dy, 10));
  };
  const stop = () => { if (repeatTimer){ clearInterval(repeatTimer); repeatTimer = null; } };
  for (const btn of pad.querySelectorAll('.dpad-btn')){
    const start = (e) => {
      e.preventDefault();
      stop();
      btn.classList.add('pressed');
      act(btn);
      repeatTimer = setInterval(() => act(btn), 200);   // hold to keep stepping
    };
    const end = () => { btn.classList.remove('pressed'); stop(); };
    btn.addEventListener('touchstart', start, { passive:false });
    btn.addEventListener('touchend', end);
    btn.addEventListener('touchcancel', end);
    btn.addEventListener('mousedown', start);
    btn.addEventListener('mouseup', end);
    btn.addEventListener('mouseleave', end);
  }
}

function loop(t){
  G.time = t;
  render();
  requestAnimationFrame(loop);
}

// ---------------- input ----------------
function onKey(e){
  const k = e.key.toLowerCase();
  // modal-driven states ignore movement keys
  if (G.state === 'EXPLORE' && !G.busy && !G.moving){
    if (k === 'arrowup' || k === 'w'){ move(0,-1); e.preventDefault(); }
    else if (k === 'arrowdown' || k === 's'){ move(0,1); e.preventDefault(); }
    else if (k === 'arrowleft' || k === 'a'){ move(-1,0); e.preventDefault(); }
    else if (k === 'arrowright' || k === 'd'){ move(1,0); e.preventDefault(); }
    else if (k === ' '){ worldTurn(); revealFOV(); e.preventDefault(); }   // wait
    else if (k === 'i'){ showInventory(); }
    else if (k === 'c'){ showCodex(true); }
  } else if (G.state === 'COMBAT' && !G.busy && G.combat && G.combat.turn === 'player'){
    const n = parseInt(k, 10);
    if (n >= 1 && n <= G.player.skills.length){ doPlayer(G.player.skills[n-1]); }
  }
}

// ================= PLAYER =================
function newPlayer(classId){
  const c = Data.CLASSES[classId];
  const p = {
    classId, name:c.name, sprite:c.sprite,
    baseHp:c.base.hp, baseSp:c.base.sp, baseAtk:c.base.atk, baseDef:c.base.def, baseMag:c.base.mag, baseSpd:c.base.spd,
    hp:c.base.hp, sp:c.base.sp, honor:c.honor, gold:20,
    skills:c.skills.slice(), equip:{weapon:null,armor:null,trinket:null}, inv:[],
    statuses:{}, shield:0, x:0, y:0, dir:1, allies:[],
    heat:0, reinforceCd:null,
  };
  applySanctum(p);
  recomputeStats(p);
  p.hp = p.maxhp; p.sp = p.maxsp;
  return p;
}

// apply permanent Sanctum upgrades to a freshly-made player (before recompute)
function applySanctum(p){
  const S = Save;
  p.baseHp  += 6 * S.sanctumLevel('vigor');
  p.baseAtk += 1 * S.sanctumLevel('whet');
  p.baseDef += 1 * S.sanctumLevel('ward');
  p.baseMag += 1 * S.sanctumLevel('arcane');
  p.baseSp  += 1 * S.sanctumLevel('focus');
  p.gold    += 15 * S.sanctumLevel('pockets');
  p.honor    = U.clamp(p.honor + 8 * S.sanctumLevel('oath'), -100, 100);
  for (let i = 0; i < S.sanctumLevel('provision'); i++) p.inv.push('potion_heal');
}
function siphonMult(){ return 1 + 0.2 * Save.sanctumLevel('siphon'); }
function sanctumCost(u, rank){ return Math.round(u.base + u.growth * (rank - 1)); }
function sanctumSummary(){
  const S = Save, parts = [];
  const map = [['vigor','HP',6],['whet','ATK',1],['ward','DEF',1],['arcane','MAG',1],['focus','SP',1],['pockets','Gold',15],['oath','Honor',8]];
  for (const [id,label,per] of map){ const l = S.sanctumLevel(id); if (l) parts.push(`+${per*l} ${label}`); }
  const prov = S.sanctumLevel('provision'); if (prov) parts.push(`${prov} Draught${prov>1?'s':''}`);
  const si = S.sanctumLevel('siphon'); if (si) parts.push(`+${20*si}% Souls`);
  const fa = S.sanctumLevel('favor'); if (fa) parts.push(`−${10*fa}% shop`);
  return parts.join(' · ');
}

function recomputeStats(p){
  let hp=p.baseHp, sp=p.baseSp, atk=p.baseAtk, def=p.baseDef, mag=p.baseMag, spd=p.baseSpd;
  const flags = { honorMul:1, lifesteal:0 };
  for (const slot of ['weapon','armor','trinket']){
    const id = p.equip[slot]; if (!id) continue;
    const it = Data.ITEMS[id], m = it.mods || {};
    hp+=m.hp||0; sp+=m.sp||0; atk+=m.atk||0; def+=m.def||0; mag+=m.mag||0; spd+=m.spd||0;
    if (it.flag){ if (it.flag.honorMul) flags.honorMul *= it.flag.honorMul; if (it.flag.lifesteal) flags.lifesteal += it.flag.lifesteal; }
  }
  // the current biome treats each class differently
  const bm = biomeClassMods(p);
  hp+=bm.hp||0; sp+=bm.sp||0; atk+=bm.atk||0; def+=bm.def||0; mag+=bm.mag||0; spd+=bm.spd||0;
  p.maxhp=Math.max(1,hp); p.maxsp=Math.max(1,sp);
  p.atk=atk; p.def=def; p.mag=mag; p.spd=spd; p.flags=flags;
  if (p.hp>p.maxhp) p.hp=p.maxhp; if (p.sp>p.maxsp) p.sp=p.maxsp;
}

function gainHonor(amt){
  const p = G.player;
  if (amt > 0) amt = Math.round(amt * p.flags.honorMul);
  p.honor = U.clamp(p.honor + amt, -100, 100);
}

function statSum(m){ m=m||{}; return (m.atk||0)+(m.def||0)+(m.mag||0)+(m.spd||0)+(m.hp||0)*0.5+(m.sp||0); }

function grantItem(id){
  const p = G.player, it = Data.ITEMS[id], slot = it.slot, cur = p.equip[slot];
  const newScore = statSum(it.mods) + (it.flag?6:0);
  const curScore = cur ? statSum(Data.ITEMS[cur].mods) + (Data.ITEMS[cur].flag?6:0) : -1;
  if (newScore > curScore){
    p.equip[slot] = id; recomputeStats(p);
    log(`You equip the ${it.name}.`, 'gold');
    if (cur){ const g = 6 + Math.round(statSum(Data.ITEMS[cur].mods)); p.gold += g; log(`Sold your old ${Data.ITEMS[cur].name} for ${g} gold.`, 'dim'); }
  } else {
    const g = 6 + Math.round(statSum(it.mods)); p.gold += g;
    log(`You find a ${it.name}, but keep your gear — sold for ${g} gold.`, 'dim');
  }
}

// ================= FLOOR / MOVEMENT =================
function startRun(){
  Save.bumpRun();
  G.biome = null;
  G.player = newPlayer(G.selClass);
  G.depth = 1;
  enterFloor();
  hideModal();
  G.state = 'EXPLORE';
  U.el('log').innerHTML = '';
  log(`You descend into the Graveborne depths as the ${G.player.name}.`, 'hi');
  log('Your HONOR shapes what you find here. The dishonored see threats where the pure see people.', 'mag');
  updateHUD();
  renderActions();
}

function enterFloor(){
  const final = G.depth === FINAL_DEPTH;
  const align = alignment(G.player.honor);

  // roll this depth's terrain first — it gates events and reshapes the chosen character
  const prevBiome = G.biome;
  G.biome = rollBiome();
  const b = curBiome();
  G.floorFov = 0;                       // floor-scoped sight bonuses (lanterns etc.) reset
  recomputeStats(G.player);

  // events eligible here: alignment-gated (MARKED/HALLOWED) and biome-gated;
  // the biome's native encounter goes first so it's guaranteed a spot
  const eligible = Object.keys(Data.EVENTS).filter(k => {
    const ev = Data.EVENTS[k];
    if (ev.require && ev.require !== align) return false;
    if (ev.biome && ev.biome !== G.biome) return false;
    return true;
  });
  const eventKeys = [
    ...U.shuffle(eligible.filter(k => Data.EVENTS[k].biome)),
    ...U.shuffle(eligible.filter(k => !Data.EVENTS[k].biome)),
  ];
  let eventCount = U.clamp(1 + Math.floor(G.depth/2), 1, 3);
  if (align === 'HALLOWED') eventCount = U.clamp(eventCount + 1, 1, 4);   // the kind draw near

  G.floor = makeDungeon(G.depth, { finalFloor: final, eventKeys, eventCount, eventsOrdered: true, biome: G.biome });
  G.player.x = G.floor.playerStart.x;
  G.player.y = G.floor.playerStart.y;
  Save.recordDepth(G.depth);
  revealFOV();

  if (G.biome !== prevBiome){
    log(`— ${b.name} —`, 'gold');
    log(b.flavor, 'dim');
    const cm = biomeClassMods(G.player);
    const effs = modStr(cm);
    if (effs && effs !== 'trinket') log(`${b.name} marks the ${G.player.name}: ${effs}.`, 'mag');
    const sight = (b.fov || 0) + (cm.fov || 0);
    if (sight) log(sight > 0 ? 'The light carries further here.' : 'The dark presses close; you cannot see as far.', sight > 0 ? 'good' : 'bad');
    if (b.hazard){
      const immune = b.hazard.immune === G.player.classId;
      log(`${b.hazard.name} scar this floor — the glowing ground is not your friend.${immune ? ' (They cannot harm you.)' : ''}`, immune ? 'dim' : 'bad');
    }
  }

  if (final){ log('The air turns to grave-cold. The Gloamthrone waits on this floor.', 'bad'); return; }

  const gd = G.floor.entities.find(e => e.type === 'guardian');
  if (gd) log(`◆ ${Data.ENEMIES[gd.enemyId].name} guards the stair on this floor. None descend unchallenged.`, 'gold');

  // the biome's named terror may prowl this floor (likelier the deeper you go)
  if (G.depth >= 2 && U.chance(0.25 + G.depth * 0.07)){
    const eliteId = Data.BIOME_ELITES[G.biome];
    const spot = eliteId && freeTileAway(G.floor, G.player.x, G.player.y, 8);
    if (spot){
      G.floor.entities.push({ type:'enemy', enemyId:eliteId, x:spot.x, y:spot.y, elite:true, sight:8 });
      log(`Something large claims this floor — ${Data.ENEMIES[eliteId].name} prowls the dark.`, 'bad');
    }
  }

  if (align === 'MARKED'){
    const tier = heatTier(G.player.heat || 0);
    spawnHunters(G.floor, HEAT_FLOOR_HUNTERS[tier]);
    G.player.reinforceCd = HEAT_REINFORCE_CD[tier];
  }
  if (align === 'HALLOWED'){
    const h = Math.round(G.player.maxhp * 0.12);
    if (h > 0 && G.player.hp < G.player.maxhp){ G.player.hp = Math.min(G.player.maxhp, G.player.hp + h); log(`A quiet warmth follows the Hallowed; you recover ${h} HP.`, 'good'); }
  }
}

// spawn Inquisition hunters that relentlessly stalk the Marked
function spawnHunters(f, count){
  let placed = 0;
  for (let n = 0; n < count; n++){
    const spot = freeTileAway(f, G.player.x, G.player.y, 5);
    if (!spot) continue;
    f.entities.push({ type:'enemy', enemyId:U.choice(Data.HUNTER_POOL), x:spot.x, y:spot.y, hunter:true, sight:12 });
    placed++;
  }
  if (placed) log('Armored steps echo in the dark. The Gilded Inquisition has your scent.', 'bad');
}
function freeTileAway(f, px, py, minDist){
  for (let t = 0; t < 100; t++){
    const x = U.randInt(1, f.w-2), y = U.randInt(1, f.h-2);
    if (f.tileAt(x,y) !== TILE.FLOOR || f.entityAt(x,y)) continue;
    if (U.dist(x,y,px,py) < minDist) continue;
    return { x, y };
  }
  return null;
}

function descend(){
  // the stair is barred while its Legendary Guardian lives
  const g = G.floor.entities.find(e => e.type === 'guardian');
  if (g){
    log('The stair is barred while its guardian draws breath.', 'bad');
    guardianConfront(g);
    return;
  }
  // between floors: visit the Hollow Merchant before the next floor
  openShop();
}
function doDescend(){
  hideModal();
  G.depth++;
  const earned = gainSouls(6);
  log(`You take the stairs down. Depth ${G.depth}. The descent yields ${earned} Souls.`, 'hi');
  enterFloor();
  G.state = 'EXPLORE'; G.busy = false;
  updateHUD(); renderActions();
}
// award Souls with the Soul Siphon multiplier applied; returns amount earned
function gainSouls(n){
  const g = Math.round(n * siphonMult());
  Save.addSouls(g);
  updateHUD();
  return g;
}

function move(dx, dy){
  const p = G.player, f = G.floor;
  p.dir = dx < 0 ? -1 : dx > 0 ? 1 : p.dir;
  const tx = p.x + dx, ty = p.y + dy;
  if (!f.isWalkable(tx, ty)) return;
  const e = f.entityAt(tx, ty);
  if (e){
    if (e.type === 'enemy'){ startCombat(e); return; }
    if (e.type === 'guardian'){ guardianConfront(e); return; }
    if (e.type === 'event'){ triggerEvent(e.eventId, e); return; }
    if (e.type === 'torch'){ return; }
    if (e.type === 'chest'){ openChest(e); return; }   // stays in place; open then removed
    if (e.type === 'stairs'){ descend(); return; }
  }
  p.x = tx; p.y = ty;
  if (f.tileAt(tx, ty) === TILE.HAZARD){
    if (!applyHazard()) return;              // hazard killed you
    if (G.state !== 'EXPLORE') return;       // snare ambush pulled you into combat
  }
  worldTurn();
  revealFOV();
}

// stepping onto a biome hazard tile; returns false if it kills you
function applyHazard(){
  const hz = curBiome().hazard, p = G.player;
  if (!hz) return true;
  if (hz.immune === p.classId){
    floatOn(true, 'unharmed', '#8a7f9e');
    log(`The ${hz.name.toLowerCase()} cannot touch you.`, 'dim');
    return true;
  }
  let dmg = 0;
  switch (hz.kind){
    case 'phys':   dmg = Math.max(1, Math.round(4 + G.depth - p.def * 0.3));
      log(`${hz.name} bite at you for ${dmg}.`, 'bad'); break;
    case 'poison': dmg = 2; p.statuses.poison = { dmg:3, turns:3 };
      log('Spores fill your lungs — you are poisoned!', 'bad'); break;
    case 'chill':  dmg = 3; p.sp = Math.max(0, p.sp - 2);
      log(`Frigid water saps you — ${dmg} HP and 2 SP.`, 'bad'); break;
    case 'fire':   dmg = 7 + G.depth;
      log(`A fire vent scorches you for ${dmg}!`, 'bad'); break;
    case 'snare':
      log('Roots seize your legs — the dark moves around you!', 'bad');
      p.hp -= 2; floatOn(true, '-2', hz.color); updateHUD();
      if (p.hp <= 0){ lose(); return false; }
      worldTurn();                            // the floor gets a free step while you tear loose
      return true;                            // (an ambush may already have begun)
  }
  p.hp -= dmg;
  if (dmg > 0) floatOn(true, `-${dmg}`, hz.color);
  updateHUD();
  if (p.hp <= 0){ lose(); return false; }
  return true;
}

function openChest(e){
  const p = G.player, mods = lootMods();
  const tier = U.clamp((e.tier || 1) + mods.tierMod, 1, 3);
  const gold = Math.max(1, Math.round((U.randInt(5, 14) + G.depth * 2) * mods.goldMult));
  p.gold += gold;
  log(`You pry open a chest — ${gold} gold.`, 'gold');
  if (U.chance(U.clamp(0.55 + mods.dropBonus, 0.1, 0.95))) grantItem(Data.rollItemId(tier));
  else { p.inv.push('potion_heal'); log('Inside rests a Draught of Mending.', 'good'); }
  G.floor.removeEntity(e);
  updateHUD();
}

// heat climbs while Marked (faster the deeper your dishonor), decays otherwise
function updateHeat(){
  const p = G.player;
  if (alignment(p.honor) === 'MARKED'){
    const gain = 0.5 + (MARK_AT - p.honor) * 0.012;   // -40 → 0.5/turn, -100 → 1.2/turn
    p.heat = U.clamp((p.heat||0) + gain, 0, 100);
    const tier = heatTier(p.heat);
    if (tier >= 1){
      const cd = HEAT_REINFORCE_CD[tier];
      if (p.reinforceCd == null || p.reinforceCd > cd) p.reinforceCd = cd;   // never longer than current tier's cadence
      p.reinforceCd -= 1;
      if (p.reinforceCd <= 0){ spawnReinforcement(); p.reinforceCd = cd; }
    }
  } else {
    p.heat = Math.max(0, (p.heat||0) - 2);
    p.reinforceCd = null;
  }
  updateHUD();
}
function spawnReinforcement(){
  const f = G.floor;
  const spot = freeTileAway(f, G.player.x, G.player.y, 6);
  if (!spot) return;
  // at Condemned, the Golden Blade takes the hunt himself — once per floor
  if (heatTier(G.player.heat || 0) >= 3 && !f.captainCame){
    f.captainCame = true;
    f.entities.push({ type:'enemy', enemyId:'inquisitor_captain', x:spot.x, y:spot.y, hunter:true, elite:true, sight:14 });
    log('A golden light kindles in the dark. SAINT CASSIEL, THE GOLDEN BLADE has taken the hunt himself.', 'bad');
    return;
  }
  f.entities.push({ type:'enemy', enemyId:U.choice(Data.HUNTER_POOL), x:spot.x, y:spot.y, hunter:true, sight:12 });
  log('The hunt closes in — Inquisition reinforcements arrive.', 'bad');
}

// the deep talks to the damned — flavor whispers for tainted souls, hunted marks, and the truly deep
function maybeWhisper(){
  const p = G.player;
  const listening = p.honor <= -20 || (p.heat || 0) >= 50 || G.depth >= 4;
  if (listening && U.chance(0.025)) log('<i>' + U.choice(Data.WHISPERS) + '</i>', 'mag');
}

// enemies take a step toward the player; one may ambush into combat
function worldTurn(){
  const p = G.player, f = G.floor;
  updateHeat();
  maybeWhisper();
  // poison ticks with every step taken in the world
  if (p.statuses.poison){
    const d = p.statuses.poison.dmg;
    p.hp -= d; floatOn(true, `-${d}`, '#7fae3a');
    log(`Poison courses through you — ${d} HP.`, 'bad');
    if (--p.statuses.poison.turns <= 0) delete p.statuses.poison;
    updateHUD();
    if (p.hp <= 0){ lose(); return; }
  }
  for (const e of f.entities.slice()){
    if (e.type !== 'enemy') continue;
    const d = U.dist(e.x, e.y, p.x, p.y);
    const sight = e.sight || 6;
    let nx = e.x, ny = e.y;
    if (e.hunter || d <= sight){
      // greedy step toward player
      const sx = Math.sign(p.x - e.x), sy = Math.sign(p.y - e.y);
      const opts = [];
      if (Math.abs(p.x - e.x) >= Math.abs(p.y - e.y)){ if (sx) opts.push([sx,0]); if (sy) opts.push([0,sy]); }
      else { if (sy) opts.push([0,sy]); if (sx) opts.push([sx,0]); }
      for (const [ox,oy] of opts){ const cx=e.x+ox, cy=e.y+oy;
        if (cx===p.x && cy===p.y){ startCombat(e, true); return; }
        if (f.isWalkable(cx,cy) && f.tileAt(cx,cy)!==TILE.HAZARD && !f.entityAt(cx,cy)){ nx=cx; ny=cy; break; }
      }
    } else if (U.chance(0.35)){
      const dirs = U.shuffle([[1,0],[-1,0],[0,1],[0,-1]]);
      for (const [ox,oy] of dirs){ const cx=e.x+ox, cy=e.y+oy;
        if (cx===p.x&&cy===p.y) continue;
        if (f.isWalkable(cx,cy) && f.tileAt(cx,cy)!==TILE.HAZARD && !f.entityAt(cx,cy)){ nx=cx; ny=cy; break; }
      }
    }
    e.x = nx; e.y = ny;
  }
}

function revealFOV(){
  const f = G.floor, p = G.player;
  const r = fovRadius();
  f.visible.fill(false);
  for (let y = p.y - r; y <= p.y + r; y++){
    for (let x = p.x - r; x <= p.x + r; x++){
      if (!f.inb(x,y)) continue;
      if (Math.max(Math.abs(x-p.x), Math.abs(y-p.y)) > r) continue;
      const i = f.idx(x,y);
      f.visible[i] = true; f.explored[i] = true;
    }
  }
}

// ================= COMBAT =================
function makeEnemyInstance(id){
  const e = Data.ENEMIES[id];
  let f = e.boss ? 1 : (1 + (G.depth - 1) * 0.12);
  if (e.hunter) f *= heatScale();   // the hunt grows stronger with your bounty
  return {
    id, name:e.name, sprite:e.sprite,
    maxhp:Math.round(e.hp*f), hp:Math.round(e.hp*f),
    atk:Math.round(e.atk*(e.boss?1:f)), def:e.def, mag:Math.round(e.mag*(e.boss?1:f)), spd:e.spd,
    moves:e.moves, tags:e.tags||[], gold:e.gold, boss:!!e.boss, hunter:!!e.hunter, elite:!!e.elite, guardian:!!e.guardian, drop:e.drop, dialogue:e.dialogue, isEnemy:true,
    shield:0, statuses:{},
  };
}

function startCombat(entity, ambush){
  const enemy = makeEnemyInstance(entity.enemyId);
  const p = G.player;
  const carriedPoison = p.statuses.poison;   // spore-sickness follows you into the fight
  p.statuses = {}; p.shield = 0;
  if (carriedPoison) p.statuses.poison = carriedPoison;
  G.combat = { enemy, origin:entity, turn:'player', boss:enemy.boss };
  G.state = 'COMBAT';
  log(`— ${enemy.name}${enemy.boss?' (BOSS)':''} blocks your path! ${ambress(ambush)}—`, 'bad');
  beginPlayerTurn();
}
function ambress(a){ return a ? 'It ambushes you! ' : ''; }

function effAtk(c){ let a=c.atk + (c.statuses.atkbuff?c.statuses.atkbuff.amt:0) - (c.statuses.weaken?c.statuses.weaken.amt:0); return Math.max(1,a); }

function shieldValue(spec, c, isPlayer){
  const hb = isPlayer ? Math.max(0, Math.floor(G.player.honor/6)) : 0;
  if (spec === 'def2') return c.def*2 + hb;
  if (spec === 'def')  return c.def + hb;
  return (spec|0) + hb;
}

function startOfTurn(c, isPlayer){
  if (c.statuses.poison){
    const dmg = c.statuses.poison.dmg; c.hp -= dmg;
    log(`${isPlayer?'You suffer':c.name+' suffers'} ${dmg} from festering wounds.`, 'bad');
    floatOn(isPlayer, `-${dmg}`, '#7fae3a');
    if (--c.statuses.poison.turns <= 0) delete c.statuses.poison;
  }
  if (c.statuses.regen){
    const amt = c.statuses.regen.amt; c.hp = Math.min(maxHp(c,isPlayer), c.hp+amt);
    log(`${isPlayer?'You recover':c.name+' recovers'} ${amt} HP.`, 'good');
    floatOn(isPlayer, `+${amt}`, '#6fbf6a');
    if (--c.statuses.regen.turns <= 0) delete c.statuses.regen;
  }
  for (const s of ['atkbuff','weaken']){ if (c.statuses[s] && --c.statuses[s].turns <= 0) delete c.statuses[s]; }
}
function maxHp(c,isPlayer){ return isPlayer ? G.player.maxhp : c.maxhp; }

function resolveAction(src, dst, action, srcIsPlayer){
  const dstIsPlayer = !srcIsPlayer;
  const type = action.type;

  if (type === 'defend'){
    const v = shieldValue(action.shield, src, srcIsPlayer);
    src.shield += v; log(`${srcIsPlayer?'You brace':src.name+' braces'} — shield ${v}.`, 'hi');
    floatOn(srcIsPlayer, `+${v}⛊`, '#8ab0e0'); return;
  }
  if (type === 'heal'){
    const amt = srcIsPlayer ? (src.mag*2 + (action.healBase||0)) : (action.healFlat||8);
    src.hp = Math.min(maxHp(src,srcIsPlayer), src.hp + amt);
    log(`${srcIsPlayer?'You mend':src.name+' mends'} ${amt} HP.`, 'good');
    floatOn(srcIsPlayer, `+${amt}`, '#6fbf6a'); return;
  }
  if (type === 'buff'){
    const ef = action.effect || {};
    if (ef.regen)   src.statuses.regen   = { ...ef.regen };
    if (ef.atkbuff) src.statuses.atkbuff = { ...ef.atkbuff };
    if (ef.shield){ const v = shieldValue(ef.shield, src, srcIsPlayer); src.shield += v; }
    log(`${srcIsPlayer?'You steel yourself':src.name+' steels itself'}. (${action.name})`, 'hi');
    floatOn(srcIsPlayer, action.name, '#c8a24a'); return;
  }

  // attack / magic
  let dmg;
  if (type === 'magic') dmg = action.power * src.mag/10 - dst.def*0.25;
  else                  dmg = action.power * effAtk(src)/10 - dst.def*0.5;
  if (action.holy && dst.tags && dst.tags.includes('undead')){ dmg *= 1.5; }
  dmg *= U.rand(0.9, 1.1);
  let crit = false;
  if (action.effect && action.effect.crit && U.chance(action.effect.crit)){ dmg *= 1.8; crit = true; }
  dmg = Math.max(1, Math.round(dmg));

  // shield absorb
  if (dst.shield > 0){ const ab = Math.min(dst.shield, dmg); dst.shield -= ab; dmg -= ab;
    if (ab>0) log(`${dstIsPlayer?'Your':dst.name+"'s"} shield absorbs ${ab}.`, 'dim'); }

  dst.hp -= dmg;
  log(`${srcIsPlayer?'You':src.name} use ${action.name}${crit?' — CRITICAL!':''} for ${dmg} damage.`, srcIsPlayer?'hi':'bad');
  floatOn(dstIsPlayer, `-${dmg}`, crit?'#ffcf5a':'#c03636');

  // lifesteal (skill + player trinket flag)
  let ls = (action.effect && action.effect.lifesteal) || 0;
  if (srcIsPlayer) ls += (G.player.flags.lifesteal || 0);
  if (ls > 0){ const h = Math.max(1, Math.round(dmg*ls)); src.hp = Math.min(maxHp(src,srcIsPlayer), src.hp+h);
    log(`${srcIsPlayer?'You drain':src.name+' drains'} ${h} HP.`, 'mag'); floatOn(srcIsPlayer, `+${h}`, '#a85cc8'); }

  // on-hit effects to dst
  const ef = action.effect || {};
  if (ef.poison){ dst.statuses.poison = { ...ef.poison }; log(`${dstIsPlayer?'You are':dst.name+' is'} afflicted!`, 'bad'); }
  if (ef.weaken){ dst.statuses.weaken = { ...ef.weaken }; log(`${dstIsPlayer?'Your':dst.name+"'s"} strength wanes.`, 'mag'); }
  if (ef.stun && U.chance(ef.stun)){ dst.statuses.stun = 1; log(`${dstIsPlayer?'You are':dst.name+' is'} stunned!`, 'hi'); }
}

function beginPlayerTurn(){
  const p = G.player;
  startOfTurn(p, true);
  updateHUD();
  if (p.hp <= 0){ lose(); return; }
  if (p.statuses.stun){ delete p.statuses.stun; log('You are stunned and lose your turn!', 'bad');
    G.combat.turn='enemy'; renderActions(); setTimeout(beginEnemyTurn, 650); return; }
  p.sp = Math.min(p.maxsp, p.sp + 1);
  G.combat.turn = 'player'; G.busy = false;
  updateHUD(); renderActions();
}

function doPlayer(skillId){
  if (G.busy || G.state!=='COMBAT') return;
  const p = G.player, sk = Data.SKILLS[skillId];
  if (sk.cost > p.sp) return;
  p.sp -= sk.cost;
  G.busy = true; G.combat.turn = 'enemy'; renderActions();
  resolveAction(p, G.combat.enemy, { ...sk }, true);
  updateHUD();
  if (G.combat.enemy.hp <= 0){ setTimeout(win, 550); return; }
  setTimeout(beginEnemyTurn, 620);
}

function usePotion(){
  if (G.busy) return;
  const p = G.player, i = p.inv.indexOf('potion_heal');
  if (i < 0) return;
  p.inv.splice(i,1);
  const heal = Data.CONSUMABLES.potion_heal.heal;
  p.hp = Math.min(p.maxhp, p.hp + heal);
  log(`You drink a Draught of Mending (+${heal} HP).`, 'good'); floatOn(true, `+${heal}`, '#6fbf6a');
  updateHUD();
  if (G.state === 'COMBAT'){ G.busy=true; G.combat.turn='enemy'; renderActions(); setTimeout(beginEnemyTurn, 500); }
  else renderActions();
}

function flee(){
  if (G.busy || G.combat.boss || G.combat.enemy.guardian) return;
  const p = G.player, en = G.combat.enemy;
  const chance = U.clamp(0.45 + (p.spd - en.spd)*0.03, 0.15, 0.85);
  if (U.chance(chance)){ log('You break away into the dark.', 'hi'); endCombatReturn(); }
  else { log('You fail to escape!', 'bad'); G.busy=true; G.combat.turn='enemy'; renderActions(); setTimeout(beginEnemyTurn, 500); }
}

function beginEnemyTurn(){
  const c = G.combat; if (!c) return;
  const en = c.enemy, p = G.player;
  startOfTurn(en, false); updateHUD();
  if (en.hp <= 0){ win(); return; }
  if (en.statuses.stun){ delete en.statuses.stun; log(`${en.name} is stunned!`, 'good'); setTimeout(beginPlayerTurn, 550); return; }
  const move = U.weighted(en.moves);
  resolveAction(en, p, move, false);
  updateHUD();
  if (p.hp <= 0){ lose(); return; }
  setTimeout(beginPlayerTurn, 600);
}

function win(){
  const c = G.combat; if (!c) return;
  const en = c.enemy, p = G.player;
  const mods = lootMods();
  let gold = U.randInt(en.gold[0], en.gold[1]);
  gold = Math.max(1, Math.round(gold * mods.goldMult * (en.hunter ? 1.4 : 1)));
  p.gold += gold;
  log(`${en.name} falls. +${gold} gold.`, 'gold'); floatOn(false, `+${gold}✦`, '#d0a84e');
  const earnedSouls = gainSouls((en.boss ? 15 : en.guardian ? 10 : en.elite ? 6 : 2) * (en.hunter ? 3 : 1) * mods.soulMult);
  G.floor.removeEntity(c.origin);
  if (en.boss){ log(`The Gloamlord's death releases ${earnedSouls} Souls.`, 'mag'); G.combat=null; setTimeout(victory, 700); updateHUD(); return; }
  // drops — guardians and elites pay a guaranteed premium; hunters likewise; alignment shifts the rest
  if (en.guardian){
    if (en.dialogue && en.dialogue.defeat) log(`${en.name}: ${en.dialogue.defeat}`, 'mag');
    grantItem(Data.rollItemId(3));
    p.inv.push('potion_heal'); log("The guardian's hoard yields a Draught of Mending.", 'good');
    log(`A legend falls. +${earnedSouls} Souls — and the stair below stands unbarred.`, 'gold');
  } else if (en.elite){
    grantItem(en.drop || Data.rollItemId(3));
    p.inv.push('potion_heal'); log('The elite\'s cache holds a Draught of Mending.', 'good');
    log(`${en.name} is slain — a named terror, ended by your hand. +${earnedSouls} Souls.`, 'mag');
    if (en.hunter) p.heat = Math.max(0, (p.heat||0) - 25);   // felling the Captain cows the hunt
  } else if (en.hunter){
    grantItem(Data.rollItemId(U.clamp(Math.ceil(G.depth/2)+1, 1, 3)));
    if (U.chance(0.5)){ p.inv.push('potion_heal'); log('The hunter carried a Draught of Mending.', 'good'); }
    p.heat = Math.max(0, (p.heat||0) - 8);   // thinning the hunt buys a little breathing room
    log('Slaying the Inquisition pays in blood-gold and souls.', 'mag');
  } else {
    const dropChance = U.clamp(0.35 + mods.dropBonus, 0.05, 0.95);
    const tier = U.clamp(Math.ceil(G.depth/2) + mods.tierMod, 1, 3);
    if (U.chance(dropChance)) grantItem(Data.rollItemId(tier));
    else if (U.chance(0.25)){ p.inv.push('potion_heal'); log('It dropped a Draught of Mending.', 'good'); }
  }
  G.combat = null; G.state = 'EXPLORE'; G.busy = false;
  updateHUD(); renderActions();
}

function endCombatReturn(){ G.combat=null; G.state='EXPLORE'; G.busy=false; updateHUD(); renderActions(); }

function lose(){
  G.busy = true; G.state = 'GAMEOVER';
  Save.recordDeath();
  // gold scatters, but Souls cling to you (stable currency survives death)
  const converted = Math.floor((G.player.gold || 0) / 3);
  if (converted > 0) Save.addSouls(converted);
  G.lastConverted = converted;
  log('Darkness takes you. Your bones join the Graveborne.', 'bad');
  if (converted > 0) log(`Your gold scatters — but ${converted} Souls cling to you beyond death.`, 'mag');
  showGameOver();
}
function victory(){
  G.state = 'VICTORY'; Save.recordWin();
  log('The Gloamlord collapses into dust. The depths fall silent.', 'good');
  showVictory();
}

// ================= EVENTS (honor-driven) =================
function triggerEvent(eventId, entity){
  const ev = Data.EVENTS[eventId];
  const variantKey = ev.perceive(G.player.honor);
  const v = ev.variants[variantKey] || ev.variants.clear;
  G.state = 'EVENT';
  G.pendingEvent = { eventId, entity };

  const sheet = U.make('div', 'sheet');
  const art = U.make('canvas'); art.width = 120; art.height = 120; art.className = 'scene-art';
  sheet.appendChild(art);
  Sprites.toCanvas(art, v.art, 9);

  sheet.appendChild(U.make('div', 'sect', ev.name));
  if (variantKey === 'warped')
    sheet.appendChild(U.make('div', 'p dim', '<i>Your dishonor colors what you see…</i>'));
  sheet.appendChild(U.make('div', 'p', v.text));

  const row = U.make('div');
  for (const ch of v.choices){
    const b = Btn(ch.label, () => chooseOutcome(eventId, ch.to, entity), ch.kind === 'danger' ? 'btn danger' : 'btn');
    row.appendChild(b);
  }
  sheet.appendChild(row);
  setModal(sheet);
}

function chooseOutcome(eventId, outId, entity){
  const ev = Data.EVENTS[eventId];
  let out = ev.outcomes[outId];
  let eff = { ...(out.effects||{}) };
  let text = out.text;

  // ----- special: mirror gaze resolves by honor tier -----
  // ----- special: the Nameless god's coin — all things are decided thus -----
  if (out.special === 'coin_flip'){
    if (U.chance(0.5)){
      text = "The coin rings off the black iron, spins — and lands. “HEADS,” says the voice, from inside your own chest. “THE GOD IS AMUSED.” Strength floods you like cold water poured into a cracked jug.";
      eff = { maxhp:6, atk:2, codex:'coin_bless' };
    } else {
      text = "The coin rings off the black iron, spins — and lands. “TAILS,” says the voice, from inside your own chest. “THE GOD IS AMUSED.” Something is taken. You feel lighter afterward, and less.";
      eff = { maxhp:-8, honor:-4, codex:'coin_curse', reveal:'The coin has no faces. It decides anyway. It always decides.' };
    }
  }

  if (out.special === 'mirror_gaze'){
    const h = G.player.honor;
    if (h >= 20){ text = "The reflection straightens, and light pours from it like dawn through a cracked door. It sets a phantom crown upon your brow. You feel larger than your wounds."; eff = { maxhp:8, heal:99, honor:4, codex:'mir_saint' }; }
    else if (h <= -20){ text = "The reflection grins with too many teeth. It is you, unmasked — and it is not afraid. It reaches through the glass and pours cold power into your hands."; eff = { atk:5, honor:-6, codex:'mir_fiend' }; }
    else { text = "The reflection wavers, half-lit, undecided — as you are. It offers only a moment's clarity before the fog returns."; eff = { sp:99, heal:12, codex:'mir_gray' }; }
  }

  const summary = applyEffects(eff);
  if (entity) G.floor.removeEntity(entity);
  updateHUD();
  showOutcome(ev.name, text, summary, eff.reveal, eff.combat);
}

function applyEffects(eff){
  const p = G.player, out = [];
  if (eff.honor){ gainHonor(eff.honor); out.push([`${eff.honor>0?'+':''}${eff.honor} Honor`, eff.honor>0?'good':'bad']); }
  if (eff.honorToward != null){ const d = U.clamp(eff.honorToward - p.honor, -5, 5); p.honor += d; out.push([`Honor drifts toward ${eff.honorToward}`, 'mag']); }
  if (eff.gold){ p.gold = Math.max(0, p.gold + eff.gold); out.push([`${eff.gold>0?'+':''}${eff.gold} Gold`, eff.gold>0?'good':'bad']); }
  if (eff.heal){ const before=p.hp; p.hp = eff.heal>=99 ? p.maxhp : Math.min(p.maxhp, p.hp+eff.heal); out.push([`+${p.hp-before} HP`, 'good']); }
  if (eff.sp){ const before=p.sp; p.sp = eff.sp>=99 ? p.maxsp : Math.min(p.maxsp, p.sp+eff.sp); if (p.sp-before) out.push([`+${p.sp-before} SP`, 'good']); }
  if (eff.maxhp){ p.baseHp += eff.maxhp; recomputeStats(p); p.hp = Math.max(1, Math.min(p.maxhp, p.hp + eff.maxhp)); out.push([`${eff.maxhp>0?'+':''}${eff.maxhp} Max HP`, eff.maxhp>0?'good':'bad']); }
  if (eff.atk){ p.baseAtk += eff.atk; recomputeStats(p); out.push([`+${eff.atk} ATK`, 'good']); }
  if (eff.def){ p.baseDef += eff.def; recomputeStats(p); out.push([`+${eff.def} DEF`, 'good']); }
  if (eff.mag){ p.baseMag += eff.mag; recomputeStats(p); out.push([`+${eff.mag} MAG`, 'good']); }
  if (eff.item){ grantItem(eff.item); out.push([`Received: ${Data.ITEMS[eff.item].name}`, 'gold']); }
  if (eff.potion){ p.inv.push(eff.potion); out.push([`Received: ${Data.CONSUMABLES[eff.potion].name}`, 'gold']); }
  if (eff.fovBoost){ G.floorFov = (G.floorFov || 0) + eff.fovBoost; revealFOV(); out.push([`+${eff.fovBoost} sight this floor`, 'good']); }
  if (eff.clearHunters){ const n = G.floor.entities.filter(e=>e.hunter).length; G.floor.entities = G.floor.entities.filter(e=>!e.hunter); if (n) out.push(['The hunters withdraw', 'good']); }
  if (eff.heatDown){ p.heat = Math.max(0, (p.heat||0) - eff.heatDown); out.push(['The hunt cools', 'good']); }
  if (eff.heatUp){ p.heat = Math.min(100, (p.heat||0) + eff.heatUp); out.push(['The hunt intensifies', 'bad']); }
  if (eff.spawnHunter){ spawnHunters(G.floor, 1); out.push(['You are hunted the harder', 'bad']); }
  if (eff.codex){ if (Save.discover(eff.codex)){ const g = gainSouls(4); out.push([`✦ Codex unlocked (+${g} Souls)`, 'mag']); } }
  return out;
}

// ================= RENDERING =================
function render(){
  if (!ctx) return;
  if (G.state === 'COMBAT' && G.combat) renderCombat();
  else if (G.player && G.floor) renderExplore();
  else { ctx.fillStyle = '#08070c'; ctx.fillRect(0,0,canvas.width,canvas.height); }
}

function drawTile(t, sx, sy, x, y){
  const pal = curBiome().pal;
  if (t === TILE.WALL){
    ctx.fillStyle = pal.wallFace; ctx.fillRect(sx, sy, TS, TS);
    ctx.fillStyle = pal.wallTop; ctx.fillRect(sx, sy, TS, 4);
    ctx.fillStyle = pal.wallDark; ctx.fillRect(sx, sy+TS-3, TS, 3);
    ctx.fillStyle = '#0a0a0f'; ctx.fillRect(sx, sy, 1, TS); ctx.fillRect(sx+TS-1, sy, 1, TS);
  } else if (t === TILE.HAZARD){
    const hz = curBiome().hazard;
    ctx.fillStyle = pal.floorB; ctx.fillRect(sx, sy, TS, TS);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(sx, sy, TS, 1); ctx.fillRect(sx, sy, 1, TS);
    // pulsing biome-colored scatter so danger reads at a glance
    const pulse = 0.55 + 0.45 * Math.sin(G.time / 320 + x * 7 + y * 13);
    ctx.globalAlpha = pulse;
    ctx.fillStyle = hz.color;
    const s1 = (x*31 + y*17) % 9, s2 = (x*13 + y*29) % 7;
    ctx.fillRect(sx + 3 + s1 % 5, sy + 4 + s2 % 4, 3, 3);
    ctx.fillRect(sx + 9 - (s2 % 3), sy + 9 + (s1 % 3), 2, 2);
    ctx.fillStyle = hz.accent;
    ctx.fillRect(sx + 5 + (s2 % 4), sy + 3 + (s1 % 5), 2, 2);
    ctx.fillRect(sx + 11 - (s1 % 4), sy + 11 - (s2 % 4), 2, 2);
    ctx.globalAlpha = 1;
  } else {
    const alt = (x + y) % 2 === 0;
    ctx.fillStyle = alt ? pal.floorA : pal.floorB; ctx.fillRect(sx, sy, TS, TS);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(sx, sy, TS, 1); ctx.fillRect(sx, sy, 1, TS);
    // deterministic speckle (spore-glow, water-glint, embers... per biome)
    const seed = (x*928371 + y*1237) % 97;
    if (seed < 8){ ctx.fillStyle = pal.speck; ctx.fillRect(sx + (seed%TS), sy + ((seed*3)%TS), 2, 2); }
  }
}

function renderExplore(){
  const f = G.floor, p = G.player;
  ctx.fillStyle = '#050409'; ctx.fillRect(0,0,canvas.width,canvas.height);
  const camX = U.clamp(p.x - (VW>>1), 0, Math.max(0, f.w - VW));
  const camY = U.clamp(p.y - (VH>>1), 0, Math.max(0, f.h - VH));

  // tiles
  for (let vy = 0; vy < VH; vy++){
    for (let vx = 0; vx < VW; vx++){
      const x = camX+vx, y = camY+vy; if (!f.inb(x,y)) continue;
      const i = f.idx(x,y); const sx = vx*TS, sy = vy*TS;
      if (!f.explored[i]) continue;
      drawTile(f.tileAt(x,y), sx, sy, x, y);
    }
  }
  // static entities (remembered) + dynamic (visible only)
  for (const e of f.entities){
    const i = f.idx(e.x, e.y);
    const vis = f.visible[i], seen = f.explored[i];
    const sx = (e.x-camX)*TS, sy = (e.y-camY)*TS;
    if (sx < -TS || sy < -TS || sx > canvas.width || sy > canvas.height) continue;
    if (e.type === 'enemy'){ if (!vis) continue; Sprites.draw(ctx, Data.ENEMIES[e.enemyId].sprite, sx+2, sy+2, 1);
      if (e.elite){ ctx.fillStyle='#d0a84e'; ctx.fillRect(sx+5,sy,1,2); ctx.fillRect(sx+7,sy-1,2,3); ctx.fillRect(sx+10,sy,1,2); } }
    else if (e.type === 'guardian'){ if (!seen) continue; Sprites.draw(ctx, Data.ENEMIES[e.enemyId].sprite, sx+2, sy+2, 1);
      const gp = 0.6+0.4*Math.sin(G.time/250);
      ctx.globalAlpha = gp; ctx.fillStyle='#ffcf5a';
      ctx.fillRect(sx+7,sy-2,2,2); ctx.fillRect(sx+6,sy-1,1,1); ctx.fillRect(sx+9,sy-1,1,1);
      ctx.globalAlpha = 1; }
    else if (e.type === 'event'){ if (!seen) continue; drawMarker(sx, sy, '!', '#c8a24a'); }
    else if (e.type === 'chest'){ if (!seen) continue; Sprites.draw(ctx, 'obj_chest', sx+2, sy+2, 1); }
    else if (e.type === 'stairs'){ if (!seen) continue; Sprites.draw(ctx, 'obj_stairs', sx+2, sy+2, 1); }
    else if (e.type === 'torch'){ if (!vis) continue; const fl = Math.sin(G.time/120 + e.x)*0.5+0.5; Sprites.draw(ctx, 'obj_torch', sx+2, sy+2 - (fl>0.6?1:0), 1); }
  }
  // player
  Sprites.draw(ctx, p.sprite, (p.x-camX)*TS+2, (p.y-camY)*TS+2, 1);

  // fog: darken explored-not-visible
  for (let vy = 0; vy < VH; vy++){
    for (let vx = 0; vx < VW; vx++){
      const x = camX+vx, y = camY+vy; if (!f.inb(x,y)) continue;
      const i = f.idx(x,y); const sx=vx*TS, sy=vy*TS;
      if (!f.explored[i]){ ctx.fillStyle = '#050409'; ctx.fillRect(sx,sy,TS,TS); }
      else if (!f.visible[i]){ ctx.fillStyle = 'rgba(5,4,10,0.6)'; ctx.fillRect(sx,sy,TS,TS); }
    }
  }
  // torch + player light (colors follow the biome)
  const pal = curBiome().pal;
  ctx.globalCompositeOperation = 'lighter';
  radial((p.x-camX)*TS+8, (p.y-camY)*TS+8, 70, `rgba(${pal.ambient},0.30)`);
  for (const e of f.entities){ if (e.type==='torch' && f.visible[f.idx(e.x,e.y)]){
    const fl = Math.sin(G.time/120 + e.x)*0.2+0.8;
    radial((e.x-camX)*TS+8, (e.y-camY)*TS+8, 46, `rgba(${pal.torch},${0.28*fl})`); } }
  ctx.globalCompositeOperation = 'source-over';
  vignette();
}

function drawMarker(sx, sy, chr, color){
  ctx.fillStyle = '#0a0810'; ctx.fillRect(sx+5, sy+3, 6, 10);
  ctx.fillStyle = color; ctx.font = 'bold 11px monospace'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(chr, sx+8, sy+8);
}
function radial(cx, cy, r, color){
  const g = ctx.createRadialGradient(cx,cy,0,cx,cy,r);
  g.addColorStop(0,color); g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,r,0,7); ctx.fill();
}
function vignette(){
  const g = ctx.createRadialGradient(canvas.width/2,canvas.height/2,60,canvas.width/2,canvas.height/2,200);
  g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,0.55)');
  ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,canvas.height);
}

function renderCombat(){
  const en = G.combat.enemy, p = G.player;
  // backdrop
  const grd = ctx.createLinearGradient(0,0,0,canvas.height);
  grd.addColorStop(0,'#140d1e'); grd.addColorStop(1,'#080610');
  ctx.fillStyle = grd; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#0d0a16'; ctx.fillRect(0, canvas.height-46, canvas.width, 46);
  ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fillRect(0, canvas.height-46, canvas.width, 2);
  // pillars
  for (const px of [30, canvas.width-42]){ ctx.fillStyle='#1a1428'; ctx.fillRect(px,20,12,canvas.height-60); ctx.fillStyle='#241c34'; ctx.fillRect(px,20,12,4); }
  // light
  ctx.globalCompositeOperation='lighter';
  radial(canvas.width*0.62, 74, 90, 'rgba(150,60,120,0.10)');
  ctx.globalCompositeOperation='source-over';

  // enemy sprite (right/upper) — bosses, guardians and elites loom larger
  const es = (en.boss || en.elite || en.guardian) ? 7 : 6;
  const ex = Math.round(canvas.width*0.60), ey = 34;
  Sprites.draw(ctx, en.sprite, ex, ey, es);
  // enemy nameplate + hp (gold for named elites, gold ◆ for guardians)
  ctx.textAlign='left'; ctx.textBaseline='alphabetic';
  ctx.fillStyle = (en.elite || en.guardian) ? '#d0a84e' : '#c9bfd6'; ctx.font='8px monospace';
  ctx.fillText((en.guardian ? '◆ ' : en.elite ? '★ ' : '') + en.name.toUpperCase(), 12, 16);
  bar(12, 20, 150, 8, en.hp/en.maxhp, '#7a1f1f', '#c03636');
  ctx.fillStyle='#eae0f0'; ctx.font='7px monospace'; ctx.fillText(`${Math.max(0,en.hp)}/${en.maxhp}`, 16, 27);
  if (en.shield>0){ ctx.fillStyle='#8ab0e0'; ctx.fillText(`⛊${en.shield}`, 120, 27); }
  drawStatusIcons(en, 12, 30);

  // player sprite (left/lower)
  Sprites.draw(ctx, p.sprite, 40, canvas.height-84, 5);
  drawStatusIcons(p, 40, canvas.height-20);
  if (p.shield>0){ ctx.fillStyle='#8ab0e0'; ctx.font='8px monospace'; ctx.fillText(`⛊${p.shield}`, 92, canvas.height-70); }

  vignette();
}
function bar(x,y,w,h,frac,c1,c2){
  ctx.fillStyle='#000'; ctx.fillRect(x-1,y-1,w+2,h+2);
  ctx.fillStyle='#1a1526'; ctx.fillRect(x,y,w,h);
  const g=ctx.createLinearGradient(x,0,x+w,0); g.addColorStop(0,c1); g.addColorStop(1,c2);
  ctx.fillStyle=g; ctx.fillRect(x,y,Math.max(0,Math.round(w*U.clamp(frac,0,1))),h);
}
function drawStatusIcons(c, x, y){
  const s=[]; if(c.statuses.poison)s.push(['☠','#7fae3a']); if(c.statuses.weaken)s.push(['▼','#a85cc8']);
  if(c.statuses.regen)s.push(['+','#6fbf6a']); if(c.statuses.atkbuff)s.push(['▲','#d0a84e']); if(c.statuses.stun)s.push(['✦','#e0e0f0']);
  ctx.font='8px monospace'; ctx.textAlign='left';
  s.forEach((it,i)=>{ ctx.fillStyle=it[1]; ctx.fillText(it[0], x+i*10, y); });
}

// ================= HUD / LOG / FX =================
function updateHUD(){
  const p = G.player; if (!p) return;
  U.el('hud-name').textContent = p.name;
  setBar('hp', p.hp, p.maxhp); setBar('sp', p.sp, p.maxsp);
  const tier = Data.honorTier(p.honor);
  U.el('honor-mark').style.left = ((p.honor+100)/200*100) + '%';
  const ht = U.el('honor-txt'); ht.textContent = p.honor; ht.style.color = tier.color;
  U.el('honor-mark').style.background = tier.color;
  U.el('gold-txt').textContent = p.gold;
  U.el('souls-txt').textContent = Save.souls();
  U.el('depth-txt').textContent = G.depth + (G.biome ? ' · ' + curBiome().name.replace(/^The /, '').toUpperCase() : '');

  // alignment badge + transition announcements
  const a = alignment(p.honor), badge = U.el('align-badge');
  if (a === 'MARKED'){ badge.textContent = 'MARKED'; badge.className = 'align-badge marked'; }
  else if (a === 'HALLOWED'){ badge.textContent = 'HALLOWED'; badge.className = 'align-badge hallowed'; }
  else { badge.textContent = ''; badge.className = 'align-badge'; }
  if (p._align !== a){
    if (p._align !== undefined){
      if (a === 'MARKED') log('You are MARKED. The Gilded Inquisition hunts the dishonored — but the spoils of sin run rich.', 'bad');
      else if (a === 'HALLOWED') log('You are HALLOWED. The dark stays its hand and the kind draw near — though fortune turns modest.', 'good');
      else if (p._align === 'MARKED') log('The Inquisition loses your scent. You are no longer Marked.', 'hi');
      else if (p._align === 'HALLOWED') log("The light's special favor fades. You are no longer Hallowed.", 'hi');
    }
    p._align = a;
  }

  // bounty / heat meter — visible while Marked or while heat lingers
  const heat = p.heat || 0, bounty = U.el('bounty');
  if (a === 'MARKED' || heat > 0){
    const tier = heatTier(heat);
    bounty.className = 'bounty t' + tier;
    U.el('bounty-fill').style.width = heat + '%';
    U.el('bounty-tier').textContent = HEAT_TIER_NAMES[tier];
  } else {
    bounty.className = 'bounty hidden';
  }
}
function setBar(kind, cur, max){
  U.el(kind+'-fill').style.width = U.clamp(cur/max*100,0,100)+'%';
  U.el(kind+'-txt').textContent = `${Math.max(0,Math.round(cur))}/${max}`;
}
function log(text, cls){
  const box = U.el('log');
  const line = U.make('div', 'line'+(cls?' '+cls:''), text);
  box.appendChild(line);
  while (box.children.length > 80) box.removeChild(box.firstChild);
  box.scrollTop = box.scrollHeight;
}
function floatOn(isPlayer, text, color){
  const fx = U.el('fx');
  const d = U.make('div', 'float', text); d.style.color = color;
  let xf, yf;
  if (G.state === 'COMBAT'){ xf = isPlayer ? 0.22 : 0.66; yf = isPlayer ? 0.62 : 0.28; }
  else { xf = 0.5; yf = 0.5; }
  d.style.left = (xf*100)+'%'; d.style.top = (yf*100)+'%';
  fx.appendChild(d); setTimeout(()=>d.remove(), 1000);
}

// ================= ACTION PANEL =================
function renderActions(){
  const box = U.el('actions'); box.innerHTML = '';
  const tc = U.el('touch-controls');
  if (tc) tc.classList.toggle('combat', G.state === 'COMBAT');
  if (G.state === 'EXPLORE'){
    const onStairs = false;
    box.appendChild(Btn('Inventory & Skills', showInventory, 'btn', 'I'));
    box.appendChild(Btn('Codex of Encounters', ()=>showCodex(true), 'btn', 'C'));
    box.appendChild(Btn('Abandon Run', confirmAbandon, 'btn danger'));
    const tip = U.make('div','line dim','Walk into foes to fight · ✦ chests · ! events · stairs descend · glowing tiles are hazards.');
    tip.style.marginTop='4px'; box.appendChild(tip);
  } else if (G.state === 'COMBAT' && G.combat){
    const p = G.player, myTurn = G.combat.turn === 'player' && !G.busy;
    p.skills.forEach((id, idx) => {
      const sk = Data.SKILLS[id];
      const b = Btn('', ()=>doPlayer(id), 'btn '+(sk.type==='defend'||sk.type==='heal'||sk.type==='buff'?'good':''), String(idx+1));
      b.innerHTML = `<span class="k">${idx+1}</span>${sk.name}${sk.cost?`<span class="cost">${sk.cost} SP</span>`:''}<span class="sub">${sk.desc}</span>`;
      b.disabled = !myTurn || sk.cost > p.sp;
      box.appendChild(b);
    });
    const potions = p.inv.filter(x=>x==='potion_heal').length;
    if (potions){ const b = Btn(`Draught of Mending ×${potions}`, usePotion, 'btn good'); b.disabled=!myTurn; box.appendChild(b); }
    if (!G.combat.boss && !G.combat.enemy.guardian){ const b = Btn('Flee', flee, 'btn'); b.disabled=!myTurn; box.appendChild(b); }
  }
}

function Btn(label, fn, cls, key){
  const b = U.make('button', cls||'btn');
  if (label) b.innerHTML = (key?`<span class="k">${key}</span>`:'') + label;
  b.onclick = fn;
  return b;
}

// ================= MODALS =================
function setModal(node){ const m = U.el('modal'); m.innerHTML=''; m.appendChild(node); m.classList.remove('hidden'); }
function hideModal(){ U.el('modal').classList.add('hidden'); }

function showTitle(){
  const s = U.make('div','sheet');
  s.appendChild(U.make('div','title-big','GRAVEBORNE'));
  s.appendChild(U.make('div','title-sub','· A DARK-FANTASY DESCENT ·'));
  s.appendChild(U.make('div','p center dim','Buriedbornes-style skill combat · roguelike depths · your <b style="color:#c8a24a">HONOR</b> decides what the dark shows you.'));
  const m = Save.meta();
  s.appendChild(U.make('div','p center',
    `<span style="color:#7fb0d0">◈ ${Save.souls()} Souls</span> &nbsp;—&nbsp; your stable coin, kept across every death.`));
  s.appendChild(U.make('div','p center dim',
    `Runs: ${m.runs} · Deepest: ${m.deepest} · Wins: ${m.wins} · Codex: ${Save.discoveredCount()}/${Data.CODEX.length}`));
  const row = U.make('div','row');
  row.appendChild(Btn('Begin Descent', showCharSelect, 'btn center'));
  row.appendChild(Btn('Sanctum ◈', showSanctum, 'btn center'));
  row.appendChild(Btn('Codex', ()=>showCodex(false), 'btn center'));
  s.appendChild(row);
  setModal(s);
}

function showCharSelect(){
  G.state='CHARSELECT';
  const s = U.make('div','sheet');
  s.appendChild(U.make('div','sect','Choose Your Doomed'));
  s.appendChild(U.make('div','p dim','Each begins at a different point on the road of honor — and will meet the depths differently for it.'));
  const ss = sanctumSummary();
  if (ss) s.appendChild(U.make('div','p','<span style="color:#7fb0d0">Sanctum boons active:</span> ' + ss));
  const grid = U.make('div','cards');
  const cards = {};
  for (const id in Data.CLASSES){
    const c = Data.CLASSES[id];
    const card = U.make('div','card'+(id===G.selClass?' sel':''));
    const cv = U.make('canvas'); cv.width=52; cv.height=52; card.appendChild(cv); Sprites.toCanvas(cv, c.sprite, 4);
    const info = U.make('div');
    info.appendChild(U.make('h3',null,c.name));
    info.appendChild(U.make('div','role',c.role));
    const b=c.base;
    info.appendChild(U.make('div','stats',
      `<b>HP</b> ${b.hp} · <b>SP</b> ${b.sp} · <b>ATK</b> ${b.atk} · <b>DEF</b> ${b.def} · <b>MAG</b> ${b.mag} · <b>SPD</b> ${b.spd}<br>` +
      `Honor start: <span style="color:${Data.honorTier(c.honor).color}">${c.honor} (${Data.honorTier(c.honor).name})</span><br>` +
      `<span style="color:#8a7f9e">${c.flavor}</span>`));
    card.appendChild(info);
    card.onclick = ()=>{ G.selClass=id; for(const k in cards) cards[k].classList.toggle('sel', k===id); };
    cards[id]=card; grid.appendChild(card);
  }
  s.appendChild(grid);
  const row = U.make('div','row');
  row.appendChild(Btn('Descend', startRun, 'btn center'));
  row.appendChild(Btn('Back', showTitle, 'btn center'));
  s.appendChild(row);
  setModal(s);
}

function showOutcome(title, text, summary, reveal, combat){
  const s = U.make('div','sheet');
  s.appendChild(U.make('div','sect',title));
  s.appendChild(U.make('div','p',text));
  if (reveal) s.appendChild(U.make('div','p dim','<i>'+reveal+' Only another path — another honor — will show you its truth.</i>'));
  if (summary && summary.length){
    const wrap = U.make('div'); wrap.style.margin='6px 0 4px';
    for (const [t,c] of summary){ const tag=U.make('span','tag '+(c==='good'?'good':c==='bad'?'bad':'mag'),t); wrap.appendChild(tag); }
    s.appendChild(wrap);
  }
  const row = U.make('div','row');
  const label = combat ? 'Draw steel' : 'Continue';
  row.appendChild(Btn(label, ()=>{
    hideModal();
    if (combat){ const def = Data.ENEMIES[combat]; startCombat({ type:'enemy', enemyId:combat, hunter:!!def.hunter, elite:!!def.elite }, false); }
    else { G.state='EXPLORE'; G.busy=false; renderActions(); }
  }, combat ? 'btn danger center' : 'btn center'));
  s.appendChild(row);
  setModal(s);
}

// ================= LEGENDARY GUARDIANS =================
function guardianConfront(entity){
  const def = Data.ENEMIES[entity.enemyId], dlg = def.dialogue || {};
  const p = G.player;
  G.state = 'EVENT';

  const s = U.make('div','sheet');
  const art = U.make('canvas'); art.width = 120; art.height = 120; art.className = 'scene-art';
  s.appendChild(art); Sprites.toCanvas(art, def.sprite, 9);
  s.appendChild(U.make('div','sect', '◆ ' + def.name + ' — Guardian of the Stair'));
  if (dlg.intro) s.appendChild(U.make('div','p', dlg.intro));

  // it looks you over: job first, then your soul, then what you carry
  if (dlg.class && dlg.class[p.classId]) s.appendChild(U.make('div','p dim', dlg.class[p.classId]));
  const a = alignment(p.honor);
  if (a === 'MARKED' && dlg.marked) s.appendChild(U.make('div','p dim', dlg.marked));
  else if (a === 'HALLOWED' && dlg.hallowed) s.appendChild(U.make('div','p dim', dlg.hallowed));
  if (dlg.items){
    for (const slot of ['weapon','armor','trinket']){
      const id = p.equip[slot];
      if (id && dlg.items[id]){ s.appendChild(U.make('div','p dim', dlg.items[id])); break; }
    }
  }

  const row = U.make('div','row');
  row.appendChild(Btn('Draw steel', ()=>{ hideModal(); startCombat(entity, false); }, 'btn danger center'));
  row.appendChild(Btn('Step back', ()=>{ hideModal(); G.state='EXPLORE'; G.busy=false; renderActions(); }, 'btn center'));
  s.appendChild(row);
  setModal(s);
}

// ================= SHOP (between floors) =================
const SHOP_RELICS = ['soul_edge','marrow_maul','stormbrand','gravewarden','plate','bloodstone','witch_eye','saints_knuckle','nights_eye','hexed_scythe','ring_of_honor','chainmail','war_pick'];

function goldPrice(base){ const favor = Save.sanctumLevel('favor'); return Math.max(1, Math.round(base * (1 - 0.1*favor))); }
function gearPriceGold(id){ const it=Data.ITEMS[id]; return goldPrice(14 + statSum(it.mods)*5 + (it.flag?20:0)); }
function relicPriceSouls(id){ const it=Data.ITEMS[id]; return Math.round(20 + statSum(it.mods)*3 + (it.flag?12:0)); }
function modStr(m){ m=m||{}; const parts=[]; for (const k of ['atk','def','mag','spd','hp','sp']){ if (m[k]) parts.push(`${m[k]>0?'+':''}${m[k]} ${k.toUpperCase()}`); } return parts.join(' · ') || 'trinket'; }

function forceEquip(id){
  const p=G.player, it=Data.ITEMS[id], slot=it.slot, cur=p.equip[slot];
  p.equip[slot]=id; recomputeStats(p);
  log(`You buy the ${it.name}.`, 'gold');
  if (cur){ const g=6+Math.round(statSum(Data.ITEMS[cur].mods)); p.gold+=g; log(`The merchant takes your old ${Data.ITEMS[cur].name} for ${g} gold.`, 'dim'); }
}

function rollShopStock(nextDepth){
  const tier=U.clamp(Math.ceil(nextDepth/2),1,3);
  const gearIds=U.shuffle(Data.ITEM_POOL[tier].slice());
  const gear=[];
  for (let i=0;i<2 && i<gearIds.length;i++){ const id=gearIds[i]; gear.push({ id, price:gearPriceGold(id), sold:false }); }
  const rids=U.shuffle(SHOP_RELICS.slice());
  const relics=[ { kind:'vigor', price:26, sold:false }, { kind:'item', id:rids[0], price:relicPriceSouls(rids[0]), sold:false } ];
  return { gear, relics, absDone:false, nextDepth };
}

function openShop(){ G.state='SHOP'; G.shop = rollShopStock(G.depth+1); renderShop(); }

function shopLine(labelHTML, subHTML, priceHTML, disabled, onBuy){
  const b = U.make('button', 'btn shop-item'+(disabled?' sold':''));
  b.innerHTML = `<span>${labelHTML}${priceHTML}</span>${subHTML?`<span class="sub">${subHTML}</span>`:''}`;
  b.disabled = disabled; b.onclick = onBuy;
  return b;
}

function renderShop(){
  const p=G.player, sh=G.shop, next=sh.nextDepth, souls=Save.souls();
  const s=U.make('div','sheet');
  const art=U.make('canvas'); art.width=64; art.height=64; art.className='merchant-art';
  s.appendChild(art); Sprites.toCanvas(art, 'npc_merchant', 5);
  s.appendChild(U.make('div','sect','The Hollow Merchant'));
  s.appendChild(U.make('div','p dim center','“Coin for the road, souls for the deep. Spend before the dark spends you.”'));
  s.appendChild(U.make('div','balance',`<span class="g">✦ ${p.gold} Gold</span><span class="s">◈ ${souls} Souls</span>`));

  s.appendChild(U.make('div','sect','Services · Gold'));
  const restCost=goldPrice(12+G.depth*6), medCost=goldPrice(8+G.depth*3), potCost=goldPrice(16+G.depth*2), absCost=goldPrice(20+G.depth*4);
  s.appendChild(shopLine('Tend your wounds','Restore HP to full',`<span class="price g">✦ ${restCost}</span>`,
    p.gold<restCost||p.hp>=p.maxhp, ()=>{ p.gold-=restCost; p.hp=p.maxhp; log('The merchant tends your wounds.','good'); updateHUD(); renderShop(); }));
  s.appendChild(shopLine('Meditate','Restore SP to full',`<span class="price g">✦ ${medCost}</span>`,
    p.gold<medCost||p.sp>=p.maxsp, ()=>{ p.gold-=medCost; p.sp=p.maxsp; log('Your reserves return.','good'); updateHUD(); renderShop(); }));
  s.appendChild(shopLine('Draught of Mending','A healing potion for your pack',`<span class="price g">✦ ${potCost}</span>`,
    p.gold<potCost, ()=>{ p.gold-=potCost; p.inv.push('potion_heal'); log('You buy a Draught of Mending.','gold'); updateHUD(); renderShop(); }));
  s.appendChild(shopLine('Rite of Absolution','Honor +15 — buy back your name',`<span class="price g">✦ ${absCost}</span>`,
    p.gold<absCost||sh.absDone||p.honor>=100, ()=>{ p.gold-=absCost; gainHonor(15); sh.absDone=true; log('You are absolved. Honor +15.','good'); updateHUD(); renderShop(); }));

  s.appendChild(U.make('div','sect','Wares · Gold'));
  for (const g of sh.gear){ const it=Data.ITEMS[g.id];
    s.appendChild(shopLine(it.name, `${modStr(it.mods)}${it.flag?' · special':''} — ${it.desc}`, `<span class="price g">✦ ${g.price}</span>`,
      g.sold||p.gold<g.price, ()=>{ p.gold-=g.price; forceEquip(g.id); g.sold=true; updateHUD(); renderShop(); })); }

  s.appendChild(U.make('div','sect','Reliquary · Souls (kept across death)'));
  for (const r of sh.relics){
    if (r.kind==='vigor'){
      s.appendChild(shopLine('Ember of Vigor','Permanently +8 Max HP this run',`<span class="price s">◈ ${r.price}</span>`,
        r.sold||souls<r.price, ()=>{ if(!Save.spendSouls(r.price)) return; p.baseHp+=8; recomputeStats(p); p.hp+=8; r.sold=true; log('You swallow an Ember of Vigor. +8 Max HP.','mag'); updateHUD(); renderShop(); }));
    } else { const it=Data.ITEMS[r.id];
      s.appendChild(shopLine(it.name, `${modStr(it.mods)}${it.flag?' · special':''} — ${it.desc}`, `<span class="price s">◈ ${r.price}</span>`,
        r.sold||souls<r.price, ()=>{ if(!Save.spendSouls(r.price)) return; forceEquip(r.id); r.sold=true; updateHUD(); renderShop(); }));
    }
  }

  const row=U.make('div','row');
  row.appendChild(Btn(`Descend to Depth ${next}`, doDescend, 'btn center'));
  s.appendChild(row);
  setModal(s);
}

// ================= SANCTUM (permanent meta-upgrades) =================
function showSanctum(){
  G.state = 'SANCTUM';
  const s = U.make('div','sheet');
  s.appendChild(U.make('div','sect','The Sanctum'));
  s.appendChild(U.make('div','p dim center','A candlelit hall between deaths. Souls bound here echo into <i>every</i> future descent — the dark cannot take what the Sanctum keeps.'));
  s.appendChild(U.make('div','balance',`<span class="s">◈ ${Save.souls()} Souls</span>`));
  for (const u of Data.SANCTUM){
    const lvl = Save.sanctumLevel(u.id), maxed = lvl >= u.max;
    const cost = sanctumCost(u, lvl + 1);
    const pips = '<span style="color:#7fb0d0">' + '●'.repeat(lvl) + '</span><span style="color:#3a3350">' + '○'.repeat(u.max - lvl) + '</span>';
    const priceHTML = maxed ? `<span class="price s">MAX</span>` : `<span class="price s">◈ ${cost}</span>`;
    s.appendChild(shopLine(`${u.name} &nbsp;${pips}`, u.desc, priceHTML, maxed || Save.souls() < cost, () => buySanctum(u)));
  }
  const row = U.make('div','row');
  row.appendChild(Btn('Back', showTitle, 'btn center'));
  s.appendChild(row);
  setModal(s);
}
function buySanctum(u){
  const lvl = Save.sanctumLevel(u.id);
  if (lvl >= u.max) return;
  const cost = sanctumCost(u, lvl + 1);
  if (!Save.spendSouls(cost)) return;
  Save.incSanctum(u.id);
  showSanctum();
}

function showInventory(){
  if (G.state !== 'EXPLORE') return;
  const p = G.player;
  const s = U.make('div','sheet');
  s.appendChild(U.make('div','sect', p.name + ' — Depth ' + G.depth));
  const tier = Data.honorTier(p.honor);
  s.appendChild(U.make('div','p',
    `<b>HP</b> ${p.hp}/${p.maxhp} · <b>SP</b> ${p.sp}/${p.maxsp} · <b>Gold</b> <span style="color:#d0a84e">${p.gold}</span><br>` +
    `<b>ATK</b> ${p.atk} · <b>DEF</b> ${p.def} · <b>MAG</b> ${p.mag} · <b>SPD</b> ${p.spd}<br>` +
    `<b>Honor</b> <span style="color:${tier.color}">${p.honor} (${tier.name})</span>`));

  s.appendChild(U.make('div','sect','Equipment'));
  for (const slot of ['weapon','armor','trinket']){
    const id = p.equip[slot]; const it = id ? Data.ITEMS[id] : null;
    s.appendChild(U.make('div','p dim',
      `<b style="color:#8ea6d8;text-transform:uppercase">${slot}</b>: ` +
      (it ? `<span style="color:#c9bfd6">${it.name}</span> — ${it.desc}` : '<i>empty</i>')));
  }

  s.appendChild(U.make('div','sect','Skills'));
  for (const id of p.skills){ const sk=Data.SKILLS[id];
    s.appendChild(U.make('div','p dim',`<span style="color:#c8a24a">${sk.name}</span> ${sk.cost?`(${sk.cost} SP)`:'(free)'} — ${sk.desc}`)); }

  const potions = p.inv.filter(x=>x==='potion_heal').length;
  s.appendChild(U.make('div','sect','Provisions'));
  s.appendChild(U.make('div','p dim', potions ? `Draught of Mending ×${potions}` : '<i>none</i>'));

  const row = U.make('div','row');
  if (potions && p.hp < p.maxhp) row.appendChild(Btn('Drink Draught (+26 HP)', ()=>{ usePotion(); hideModal(); }, 'btn good'));
  row.appendChild(Btn('Close', hideModal, 'btn center'));
  s.appendChild(row);
  setModal(s);
}

function showCodex(fromGame){
  const s = U.make('div','sheet');
  s.appendChild(U.make('div','sect', `Codex of Encounters — ${Save.discoveredCount()}/${Data.CODEX.length}`));
  s.appendChild(U.make('div','p dim','The same place wears a different face for a different soul. Discover both by walking two different roads of honor.'));
  const grid = U.make('div','codex-grid');
  for (const c of Data.CODEX){
    const known = Save.isDiscovered(c.id);
    const item = U.make('div','codex-item'+(known?'':' locked'));
    item.appendChild(U.make('h4',null, known ? c.title : '??? — '+({good:'a mercy',bad:'a cruelty',mag:'a mystery'}[c.tag]||'unknown')));
    item.appendChild(U.make('div','d', known ? c.hint : '<i>Undiscovered. '+c.hint+'</i>'));
    grid.appendChild(item);
  }
  s.appendChild(grid);
  const row = U.make('div','row');
  row.appendChild(Btn('Close', ()=>{ if (fromGame){ hideModal(); } else showTitle(); }, 'btn center'));
  s.appendChild(row);
  setModal(s);
}

function confirmAbandon(){
  const s = U.make('div','sheet');
  s.appendChild(U.make('div','sect','Abandon this run?'));
  s.appendChild(U.make('div','p','Your progress this descent will be lost. (Codex discoveries are kept.)'));
  const row = U.make('div','row');
  row.appendChild(Btn('Return to Title', ()=>{ G.player=null; G.floor=null; G.combat=null; G.state='TITLE'; showTitle(); }, 'btn danger'));
  row.appendChild(Btn('Keep Going', ()=>{ hideModal(); }, 'btn center'));
  s.appendChild(row);
  setModal(s);
}

function showGameOver(){
  const s = U.make('div','sheet');
  s.appendChild(U.make('div','title-big','YOU DIED'));
  const tier = Data.honorTier(G.player.honor);
  s.appendChild(U.make('div','p center',`You fell at Depth ${G.depth}, your honor <span style="color:${tier.color}">${tier.name} (${G.player.honor})</span>.`));
  if (G.lastConverted > 0) s.appendChild(U.make('div','p center',`<span style="color:#7fb0d0">◈ ${G.lastConverted} Souls</span> clung to you beyond death. Total: ◈ ${Save.souls()}.`));
  s.appendChild(U.make('div','p center dim',`Codex discovered: ${Save.discoveredCount()}/${Data.CODEX.length}`));
  const row = U.make('div','row');
  row.appendChild(Btn('Rise Again', showCharSelect, 'btn center'));
  row.appendChild(Btn('Sanctum ◈', showSanctum, 'btn center'));
  row.appendChild(Btn('Codex', ()=>showCodex(false), 'btn center'));
  row.appendChild(Btn('Title', showTitle, 'btn center'));
  s.appendChild(row);
  setModal(s);
}
function showVictory(){
  const s = U.make('div','sheet');
  s.appendChild(U.make('div','title-big','VICTORY'));
  const tier = Data.honorTier(G.player.honor);
  s.appendChild(U.make('div','p center','The Gloamlord is unmade. You climb back toward a sun you had almost forgotten.'));
  s.appendChild(U.make('div','p center dim',`Final honor: <span style="color:${tier.color}">${tier.name} (${G.player.honor})</span> · Codex: ${Save.discoveredCount()}/${Data.CODEX.length}`));
  s.appendChild(U.make('div','p center dim','Try a darker — or purer — soul to uncover the encounters you did not see.'));
  const row = U.make('div','row');
  row.appendChild(Btn('New Descent', showCharSelect, 'btn center'));
  row.appendChild(Btn('Sanctum ◈', showSanctum, 'btn center'));
  row.appendChild(Btn('Codex', ()=>showCodex(false), 'btn center'));
  s.appendChild(row);
  setModal(s);
}

// ---- boot ----
init();
