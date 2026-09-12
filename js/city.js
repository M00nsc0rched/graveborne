// ---------- Hollowgate: the meta-layer above the stair ----------
// A player keeps a roster of souls. Each one is made once, lives in the city
// between descents, and is deleted the moment it dies. Everything below the
// stair is the Deep Dark; nothing in this file knows how combat works.

// ---- how a room reads the soul in front of it ----
function cityTier(p){ return alignment(p.honor); }
function cityMood(p){ return City.CITY_MOOD[cityTier(p)] || 'neutral'; }

// Pick the lines an NPC actually says: every gate that passes speaks, and the
// ungated line is the floor so nobody is ever left standing there in silence.
function npcLines(npc, ch){
  const p = ch.player, tier = cityTier(p);
  const out = [];
  for (const l of npc.lines){
    if (l.cls   && l.cls   !== ch.classId) continue;
    if (l.tier  && l.tier  !== tier) continue;
    if (l.codex && !Save.isDiscovered(l.codex)) continue;
    if (l.flag  && !ch.flags[l.flag]) continue;
    out.push(l);
  }
  const gated = out.filter(l => l.cls || l.tier || l.codex || l.flag);
  const plain = out.filter(l => !(l.cls || l.tier || l.codex || l.flag));
  return gated.length ? gated : plain;      // a specific line always beats the generic one
}

// ---- the difficulty a soul has earned. Each completed descent makes the Deep
// Dark half again as bad, compounding, which is what was asked for and is why
// the fourth one is a different game from the first. ----
function dreadOf(ch){ return Math.pow(1.5, ch ? (ch.descents || 0) : 0); }
// Localised here rather than at the call sites: this label is concatenated into
// larger strings that carry markup, and an exact-match lookup would never see it.
function dreadLabel(ch){
  const n = ch ? (ch.descents || 0) : 0;
  if (!n) return T('Untouched — the Deep Dark has not met you yet.');
  return T(`Descents survived: ${n} · the dark comes back ${Math.round((dreadOf(ch) - 1) * 100)}% heavier`);
}

// ================= ROSTER =================
function showRoster(){
  G.state = 'TITLE';
  const chars = Save.chars();
  const { sheet, body } = pagedSheet('Graveborne — Hollowgate', null);
  sheet.querySelector('.sheet-head .x-btn').remove();   // nowhere to close to; this is the front door
  body.appendChild(U.make('div','title-big','GRAVEBORNE'));
  body.appendChild(U.make('div','title-sub','· THE DEEP DARK ·'));
  body.appendChild(U.make('div','p center dim',`<i>${U.choice(Data.DISCOURAGEMENTS)}</i>`));
  const m = Save.meta();
  body.appendChild(U.make('div','p center',
    `<span style="color:#7fb0d0">◈ ${Save.souls()} ${T('Souls')}</span> — ${T('the one coin that outlives a soul.')}`));
  body.appendChild(U.make('div','p center dim',
    `Descents: ${m.runs} · Deepest: ${m.deepest} · Codex: ${Save.discoveredCount()}/${Data.CODEX.length}`));

  if (chars.length){
    body.appendChild(U.make('div','sect','Your souls'));
    for (const ch of chars){
      const bs = City.BACKSTORY[ch.classId] || {};
      const p = ch.player, tier = Data.honorTier(p.honor);
      const card = U.make('div','codex-item open');
      card.appendChild(U.make('h4', null, `${bs.title || p.name} — ${T('Lv')} ${p.level}`));
      card.appendChild(U.make('div','d',
        `<span style="color:${tier.color}">${tier.name}</span> · ${p.gold}✦ · ${dreadLabel(ch)}`));
      const wasHeld = armCardRelease(card, ch);
      card.onclick = () => { if (wasHeld()) return; Save.setActive(ch.id); showCity(ch); };
      body.appendChild(card);
    }
  } else {
    body.appendChild(U.make('div','p center dim',
      'No one is standing in Hollowgate. Someone has to be, before anything can go down the stair.'));
  }

  const row = U.make('div','row');
  row.appendChild(Btn('New soul', showCharSelect, 'btn center' + (chars.length ? '' : ' good')));
  row.appendChild(Btn('Codex', ()=>showCodex(false), 'btn center'));
  row.appendChild(Btn('Settings', ()=>showSettings(showRoster), 'btn center'));
  body.appendChild(row);
  body.appendChild(U.make('div','p center dim', 'v' + GAME_VERSION));
  setModal(sheet);
}

// Made at the end of character creation. The soul exists now; it has simply not
// gone anywhere yet.
function characterMade(ch){
  const bs = City.BACKSTORY[ch.classId] || {};
  const s = U.make('div','sheet');
  s.appendChild(U.make('div','sect', bs.title || ch.player.name));
  s.appendChild(U.make('div','p', bs.long || ''));
  if (bs.goal) s.appendChild(U.make('div','p dim', `<i>${T('What you came for:')} ${bs.goal}</i>`));
  const row = U.make('div','row');
  row.appendChild(Btn('Visit the city', ()=>showCity(ch), 'btn center good'));
  row.appendChild(Btn('Cancel', showRoster, 'btn center'));
  s.appendChild(row);
  setModal(s);
}


// ---- letting go of a soul ----
// Hold the card and it fogs and fades under your thumb, further the longer you
// hold. Let go early and it comes back; hold it all the way out and the game
// asks whether you meant it. A tap still just opens the city, so nothing about
// the ordinary gesture changes.
const FADE_MS = 1100;
function armCardRelease(card, ch){
  let raf = null, timer = null, start = 0, done = false;

  const paint = (k) => {
    card.style.filter = `blur(${(k * 5).toFixed(2)}px)`;
    card.style.opacity = (1 - k * 0.85).toFixed(3);
    card.style.transform = `scale(${(1 - k * 0.06).toFixed(3)})`;
  };
  const clear = () => {
    if (raf) cancelAnimationFrame(raf); raf = null;
    if (timer) clearTimeout(timer); timer = null;
    card.style.filter = ''; card.style.opacity = ''; card.style.transform = '';
    card.classList.remove('letting-go');
  };
  const step = () => {
    const k = Math.min(1, (performance.now() - start) / FADE_MS);
    paint(k);
    if (k < 1) raf = requestAnimationFrame(step);
  };

  // The question is asked on a timer and only the fog is painted on frames.
  // requestAnimationFrame stops entirely while the page is not being drawn, so a
  // hold that began before the screen slept would otherwise never resolve.
  const begin = (e) => {
    if (done) return;
    // a second finger, or the right button, is not a hold
    if (e.type === 'pointerdown' && e.button !== 0) return;
    done = false; start = performance.now();
    card.classList.add('letting-go');
    raf = requestAnimationFrame(step);
    timer = setTimeout(() => { done = true; clear(); confirmLetGo(ch); }, FADE_MS);
  };
  const cancel = () => { if (!done) clear(); };

  card.addEventListener('pointerdown', begin);
  card.addEventListener('pointerup', cancel);
  card.addEventListener('pointerleave', cancel);
  card.addEventListener('pointercancel', cancel);
  // holding on a phone otherwise raises the text-selection menu over the card
  card.addEventListener('contextmenu', (e) => e.preventDefault());
  return () => done;
}

function confirmLetGo(ch){
  const bs = City.BACKSTORY[ch.classId] || {};
  const p = ch.player;
  const s = U.make('div','sheet');
  s.appendChild(U.make('div','sect','Let go of this life?'));
  s.appendChild(U.make('div','p',
    `${bs.title || p.name}, level ${p.level}, ${ch.descents || 0} descents survived. Nothing of this one is kept but the Souls, which were never really its own.`));
  s.appendChild(U.make('div','p dim','<i>There is no undoing it. The roster simply has one fewer name in it.</i>'));
  const row = U.make('div','row');
  row.appendChild(Btn('Let it go', () => {
    Save.killChar(ch.id);
    log('The name goes off the slate.', 'dim');
    showRoster();
  }, 'btn danger center'));
  row.appendChild(Btn('Keep it', showRoster, 'btn center'));
  s.appendChild(row);
  setModal(s);
}

// ================= THE CITY =================
const CITY_BUILDINGS = [
  { id:'tavern', name:'The Rope and Lantern', desc:'Work, drink, and the only door in Hollowgate that leads down.', go:(ch)=>showTavern(ch) },
  { id:'smithy', name:'The Cold Forge',       desc:'Steel for coin, and more steel beaten into what you already carry.', go:(ch)=>showForge(ch) },
  { id:'chapel', name:'The Grey Chapel',      desc:'The Choir keeps the rail, the ledger, and whatever is behind it.', go:(ch)=>showChapel(ch) },
  { id:'market', name:'Gallows Market',       desc:'Nothing for sale. The people who still come are the point.', go:(ch)=>showMarket(ch) },
];

function showCity(ch){
  ch = ch || Save.activeChar();
  if (!ch) return showRoster();
  Save.setActive(ch.id);
  G.state = 'TITLE';
  const p = ch.player, tier = Data.honorTier(p.honor);
  const { sheet, body } = pagedSheet('Hollowgate', showRoster);
  body.appendChild(U.make('div','p dim',
    'The last city above the Deep Dark. It has stopped growing and has not yet agreed to stop existing.'));
  body.appendChild(U.make('div','p center',
    `${City.BACKSTORY[ch.classId] ? City.BACKSTORY[ch.classId].title : p.name} · ${T('Lv')} ${p.level} · ` +
    `<span style="color:${tier.color}">${tier.name} (${p.honor})</span> · ${p.gold}✦ · ◈ ${Save.souls()}`));
  body.appendChild(U.make('div','p center dim', dreadLabel(ch)));

  for (const b of CITY_BUILDINGS){
    const card = U.make('div','codex-item open');
    card.appendChild(U.make('h4', null, b.name));
    card.appendChild(U.make('div','d', b.desc));
    card.onclick = () => b.go(ch);
    body.appendChild(card);
  }
  const row = U.make('div','row');
  row.appendChild(Btn('Inventory', ()=>{ G.player = p; showInventory(); }, 'btn center'));
  row.appendChild(Btn('Leave the city', showRoster, 'btn center'));
  body.appendChild(row);
  setModal(sheet);
}

// ================= THE TAVERN =================
function showTavern(ch){
  ch = ch || Save.activeChar();
  if (!ch) return showRoster();
  const { sheet, body } = pagedSheet('The Rope and Lantern', ()=>showCity(ch));
  body.appendChild(U.make('div','p dim',
    'Low room, long tables, and a stair in the corner that everyone in here has an opinion about.'));

  body.appendChild(U.make('div','sect','Who is in tonight'));
  for (const key in City.CITY_NPCS){
    const npc = City.CITY_NPCS[key];
    if (npc.where && npc.where !== 'tavern') continue;   // the market keeps its own people
    const card = U.make('div','codex-item open');
    const seen = ch.met[npc.id];
    card.appendChild(U.make('h4', null, npc.name + (seen ? '' : ' — ' + T('new'))));
    card.appendChild(U.make('div','d', npc.role));
    card.onclick = () => showNpc(ch, npc);
    body.appendChild(card);
  }

  if (ch.contract){
    body.appendChild(U.make('div','sect','Work in hand'));
    const c = U.make('div','codex-item open');
    c.appendChild(U.make('h4', null, ch.contract.name));
    c.appendChild(U.make('div','d', ch.contract.brief + ` — ${T('pays')} ${ch.contract.pay}✦`));
    c.onclick = () => confirmDescent(ch);
    body.appendChild(c);
  }
  setModal(sheet);
}

// back is where the door leads out to - the tavern for its regulars, the market
// for the people who stand in it.
function showNpc(ch, npc, back){
  ch.met[npc.id] = true; Save.putChar(ch);
  const home = back || ((c)=>showTavern(c));
  const { sheet, body } = pagedSheet(npc.name, ()=>home(ch));
  body.appendChild(U.make('div','p dim', npc.intro));
  for (const l of npcLines(npc, ch)) body.appendChild(U.make('div','p', l.text));

  const row = U.make('div','row');
  if (npc.id === 'wanderer') row.appendChild(Btn('Ask about work', ()=>showContracts(ch), 'btn center good'));
  if (npc.id === 'quartermaster') row.appendChild(Btn('Read the board', ()=>showBounties(ch), 'btn center good'));
  row.appendChild(Btn('Back', ()=>home(ch), 'btn center'));
  body.appendChild(row);
  setModal(sheet);
}


// ---- The board. A bounty is priced off the thing it names: what it can take
// and what it can give out. Halloway does not haggle and the arithmetic is his.
function bountyWorth(e){
  const bulk = (e.hp || 0) + (e.atk || 0) * 6 + (e.mag || 0) * 5 + (e.def || 0) * 4;
  const rank = e.boss ? 3 : e.guardian ? 2 : e.elite ? 1.4 : 1;
  return Math.max(15, Math.round(bulk * rank * 0.6));
}
function bountyRank(e){
  return e.boss ? 'Throne' : e.guardian ? 'Legend' : e.elite ? 'Named' : 'Common';
}

function bountyBoard(ch){
  const ids = Object.keys(Data.ENEMIES).filter(k => {
    const e = Data.ENEMIES[k];
    return (e.elite || e.guardian) && !e.hunter;
  });
  U.shuffle(ids);
  return ids.slice(0, 4).map(id => {
    const e = Data.ENEMIES[id];
    return {
      id: 'bo_' + id, kind: 'bounty', target: id,
      name: e.name,
      brief: `${T(bountyRank(e))} · ${e.hp} ${T('HP')} · ${e.atk} ${T('ATK')} / ${e.mag} ${T('MAG')}. ${T('Halloway wants proof, not a story.')}`,
      pay: Math.round(bountyWorth(e) * (1 + 0.5 * (ch.descents || 0))),
    };
  });
}

function showBounties(ch){
  const { sheet, body } = pagedSheet('The Board', ()=>showNpc(ch, City.CITY_NPCS.quartermaster));
  body.appendChild(U.make('div','p dim',
    '"Every notice is priced off what it names. A harder thing pays more because a harder thing costs more. That is the whole of the system."'));
  for (const b of bountyBoard(ch)){
    const card = U.make('div','codex-item open');
    card.appendChild(U.make('h4', null, b.name + ' — ' + b.pay + '✦'));
    card.appendChild(U.make('div','d', b.brief));
    card.onclick = () => { ch.contract = b; Save.putChar(ch); confirmDescent(ch); };
    body.appendChild(card);
  }
  setModal(sheet);
}
// ---- the Wanderer's book. The target sets the pay and the depth. ----
function contractOffer(ch){
  const out = [];
  for (const t of City.CONTRACTS){
    const c = { id:t.id, name:t.name, kind:t.kind, brief:t.brief, pay:t.pay, target:t.target };
    if (t.kind === 'guardian'){
      const b = U.choice(Object.keys(Data.BIOMES));
      const gid = Data.BIOME_GUARDIANS[b];
      c.target = gid;
      c.brief = `${Data.ENEMIES[gid].name} ${T('bars a stair in')} ${Data.BIOMES[b].name}. ${T('Bring back the proof.')}`;
    }
    if (t.kind === 'boss'){
      c.brief = 'All the way to the bottom, and whatever is sitting on the throne this time.';
    }
    // a harder soul is sent after harder work, and paid for it
    c.pay = Math.round(c.pay * (1 + 0.5 * (ch.descents || 0)));
    out.push(c);
  }
  return out;
}

function showContracts(ch){
  const { sheet, body } = pagedSheet('The Wanderer\'s Book', ()=>showNpc(ch, City.CITY_NPCS.wanderer));
  body.appendChild(U.make('div','p dim',
    '"I do not send people down. I write down which ones went. Pick a line and I will put your name on it."'));
  for (const c of contractOffer(ch)){
    const card = U.make('div','codex-item open');
    card.appendChild(U.make('h4', null, c.name));
    card.appendChild(U.make('div','d', c.brief + ` — ${T('pays')} ${c.pay}✦`));
    card.onclick = () => { ch.contract = c; Save.putChar(ch); confirmDescent(ch); };
    body.appendChild(card);
  }
  setModal(sheet);
}

function confirmDescent(ch){
  const s = U.make('div','sheet');
  s.appendChild(U.make('div','sect','The stair'));
  s.appendChild(U.make('div','p', ch.contract ? ch.contract.brief : 'Down, then.'));
  s.appendChild(U.make('div','p dim', dreadLabel(ch)));
  if ((ch.descents || 0) > 0)
    s.appendChild(U.make('div','p dim',
      '<i>You have been down before, and it noticed. Everything you meet this time is heavier than what met you last time.</i>'));
  const row = U.make('div','row');
  row.appendChild(Btn('Go down', ()=>beginDescent(ch), 'btn danger center'));
  row.appendChild(Btn('Not yet', ()=>showTavern(ch), 'btn center'));
  s.appendChild(row);
  setModal(s);
}


// ================= THE COLD FORGE =================
// Gold only. It sells steel and it beats more out of the steel you already
// carry, and the work rides on the soul rather than on the item — sell the
// sword and you keep what the forge put into your arm.
function forgeStock(ch){
  const tier = U.clamp(1 + Math.floor((ch.descents || 0) / 2), 1, 3);
  const ids = Object.keys(Data.ITEMS).filter(id => {
    const it = Data.ITEMS[id];
    return it.slot === 'weapon' && (it.tier || 1) <= tier && !it.set;
  });
  U.shuffle(ids);
  return ids.slice(0, 4);
}

// Each beating costs more than the last, so a soul cannot simply stand here
// until it is unbeatable.
function forgeCost(ch, stat){
  const n = ((ch.player.forge || {})[stat] || 0);
  return Math.round(60 * Math.pow(1.6, n) * (1 + 0.25 * (ch.descents || 0)));
}

function showForge(ch){
  ch = ch || Save.activeChar(); if (!ch) return showRoster();
  const p = ch.player;
  p.forge = p.forge || { atk:0, def:0, mag:0 };
  const { sheet, body } = pagedSheet('The Cold Forge', ()=>showCity(ch));
  body.appendChild(U.make('div','p dim center',
    '"The fire is only cold when nobody is paying. Show me coin and show me what you carry."'));
  body.appendChild(U.make('div','balance', `<span class="g">✦ ${p.gold} Gold</span>`));

  body.appendChild(U.make('div','sect','The work'));
  for (const [stat, label] of [['atk','ATK'], ['def','DEF'], ['mag','MAG']]){
    const cost = forgeCost(ch, stat), have = p.forge[stat] || 0;
    body.appendChild(shopLine(
      `Beat the ${label} up`, `+1 ${label} for good — ${have} done so far`,
      `<span class="price g">✦ ${cost}</span>`, p.gold < cost,
      () => {
        p.gold -= cost; p.forge[stat] = have + 1; recomputeStats(p);
        Save.putChar(ch);
        log(`The Cold Forge beats another point of ${label} into you.`, 'gold');
        showForge(ch);
      }));
  }

  body.appendChild(U.make('div','sect','Steel'));
  ch.forgeStock = ch.forgeStock || forgeStock(ch);
  let anything = false;
  for (const id of ch.forgeStock){
    const it = Data.ITEMS[id];
    if (p.equip.weapon === id) continue;
    anything = true;
    const cost = gearPriceGold(id);
    body.appendChild(shopLine(it.name, modStr(it.mods),
      `<span class="price g">✦ ${cost}</span>`, p.gold < cost,
      () => { p.gold -= cost; forceEquip(id); Save.putChar(ch); showForge(ch); }));
  }
  if (!anything) body.appendChild(U.make('div','p dim','The rack is bare until the next descent.'));
  setModal(sheet);
}

// ================= THE GREY CHAPEL =================
// Souls, not gold. The Choir will take a donation in coin and enter it in the
// ledger as Souls, and it keeps relics behind the rail for those who can pay in
// the currency that matters.
function chapelStock(ch){
  const ids = Object.keys(Data.ITEMS).filter(id => {
    const it = Data.ITEMS[id];
    return it.slot === 'trinket' && (it.tier || 1) >= 2;
  });
  U.shuffle(ids);
  return ids.slice(0, 3);
}

function showChapel(ch){
  ch = ch || Save.activeChar(); if (!ch) return showRoster();
  const p = ch.player;
  const { sheet, body } = pagedSheet('The Grey Chapel', ()=>showCity(ch));

  // Two classes get something out of walking in that the others do not: one
  // because the order still means something to him, one because she is the only
  // person in Hollowgate who thinks she needs to be here. Once per stay.
  const blesses = (ch.classId === 'knight' || ch.classId === 'rogue');
  if (blesses && !ch.flags.chapelSeen){
    ch.flags.chapelSeen = true;
    const gain = ch.classId === 'knight' ? 6 : 4;
    p.honor = U.clamp(p.honor + gain, -100, 100);
    Save.putChar(ch);
    body.appendChild(U.make('div','p', ch.classId === 'knight'
      ? '"The order is ash and you came anyway. Kneel. It costs the Choir nothing to say the words and it is plainly costing you something to hear them."'
      : '"You came in. Everyone in this city knows what you are, and you came in anyway, and you stood at the back where you thought nobody was looking."'));
    body.appendChild(U.make('div','p good', `Your honor rises by ${gain}.`));
  } else {
    body.appendChild(U.make('div','p dim center',
      '"Coin buys bread. Souls buy the other thing. Do not confuse the two at this rail."'));
  }

  body.appendChild(U.make('div','balance',
    `<span class="g">✦ ${p.gold} Gold</span><span class="s">◈ ${Save.souls()} Souls</span>`));

  body.appendChild(U.make('div','sect','The offering'));
  for (const [gold, souls] of [[60, 4], [150, 12], [400, 36]]){
    body.appendChild(shopLine(`Give ${gold} gold`, `The ledger records ${souls} Souls`,
      `<span class="price g">✦ ${gold}</span>`, p.gold < gold,
      () => { p.gold -= gold; Save.addSouls(souls); Save.putChar(ch);
              log(`The Choir takes the coin and writes down ${souls} Souls.`, 'mag'); showChapel(ch); }));
  }
  body.appendChild(shopLine('Ask for coin back', 'The Choir returns 40 gold for 6 Souls',
    `<span class="price s">◈ 6</span>`, Save.souls() < 6,
    () => { if (!Save.spendSouls(6)) return; p.gold += 40; Save.putChar(ch);
            log('The rail opens and forty gold comes back across it.', 'gold'); showChapel(ch); }));

  body.appendChild(U.make('div','sect','Behind the rail'));
  ch.chapelStock = ch.chapelStock || chapelStock(ch);
  for (const id of ch.chapelStock){
    const it = Data.ITEMS[id];
    if (p.equip.trinket === id) continue;
    const cost = relicPriceSouls(id);
    body.appendChild(shopLine(it.name, modStr(it.mods),
      `<span class="price s">◈ ${cost}</span>`, Save.souls() < cost,
      () => { if (!Save.spendSouls(cost)) return; forceEquip(id); Save.putChar(ch); showChapel(ch); }));
  }

  // and it will take what you are carrying off your hands, in the coin it prefers
  body.appendChild(U.make('div','sect','What you carry'));
  let sold = false;
  for (const slot of ['weapon','armor','trinket']){
    const id = p.equip[slot]; if (!id) continue;
    const it = Data.ITEMS[id], worth = Math.max(4, Math.round(relicPriceSouls(id) * 0.4));
    sold = true;
    body.appendChild(shopLine(`Give up ${it.name}`, `${slot} — ${modStr(it.mods)}`,
      `<span class="price s">◈ ${worth}</span>`, false,
      () => { p.equip[slot] = null; recomputeStats(p); Save.addSouls(worth); Save.putChar(ch);
              log(`The Choir takes ${theName(it.name)} and enters ${worth} Souls against your name.`, 'mag');
              showChapel(ch); }));
  }
  if (!sold) body.appendChild(U.make('div','p dim','You are carrying nothing the Choir wants.'));
  setModal(sheet);
}

// ================= GALLOWS MARKET =================
// Nothing is for sale. The people are the point.
function showMarket(ch){
  ch = ch || Save.activeChar(); if (!ch) return showRoster();
  const { sheet, body } = pagedSheet('Gallows Market', ()=>showCity(ch));
  body.appendChild(U.make('div','p dim',
    'Two rows of stalls with nothing on them and a gallows nobody has taken down, because taking it down would be a decision and nobody here makes those any more.'));
  body.appendChild(U.make('div','sect','Who is out today'));
  let any = false;
  for (const key in City.CITY_NPCS){
    const npc = City.CITY_NPCS[key];
    if (npc.where !== 'market') continue;
    any = true;
    const card = U.make('div','codex-item open');
    card.appendChild(U.make('h4', null, npc.name + (ch.met[npc.id] ? '' : ' — ' + T('new'))));
    card.appendChild(U.make('div','d', npc.role));
    card.onclick = () => showNpc(ch, npc, showMarket);
    body.appendChild(card);
  }
  if (!any) body.appendChild(U.make('div','p dim','The square is empty today.'));
  setModal(sheet);
}

// ================= RETURNING =================
// Survived: the soul keeps everything and the city takes it back. The Deep Dark
// gets harder because it has now seen you do this once.
function returnToCity(won){
  const ch = Save.activeChar();
  if (!ch) return showRoster();
  ch.player = G.player;
  if (won){
    ch.descents = (ch.descents || 0) + 1;
    if (ch.contract){ ch.player.gold += ch.contract.pay; ch.flags['did_' + ch.contract.id] = true; }
  }
  ch.contract = null;
  // the city restocks between descents, and the chapel will bless a soul once per stay
  ch.forgeStock = null; ch.chapelStock = null; delete ch.flags.chapelSeen;
  // a soul that came back up is whole again, and its offer of skills is reshuffled
  ch.player.hp = ch.player.maxhp; ch.player.sp = ch.player.maxsp;
  ch.player.statuses = {}; ch.player.shield = 0;
  ch.player.eventsUsed = {}; ch.player.vigilUsed = false; ch.player.vigilTurns = 0;
  ch.player.follower = null; ch.player.followerLost = false; ch.player.followerFled = false;
  Save.putChar(ch);
  clearSavedRun();
  showCity(ch);
}

// Died: the record goes. Souls are meta and were already banked by lose().
function soulLost(){
  const ch = Save.activeChar();
  if (ch) Save.killChar(ch.id);
}

if (typeof window !== 'undefined'){
  Object.assign(window, { showForge, showChapel, showMarket, forgeCost, confirmLetGo,
                          showRoster, showCity, showTavern, showNpc, showContracts,
                          characterMade, returnToCity, soulLost, dreadOf, cityTier,
                          showBounties, bountyWorth, npcLines, contractOffer, confirmDescent });
}
