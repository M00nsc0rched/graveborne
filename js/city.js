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
      card.onclick = () => { Save.setActive(ch.id); showCity(ch); };
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
  const art = U.make('canvas'); art.width = 120; art.height = 120; art.className = 'scene-art';
  s.appendChild(art); try { Sprites.toCanvas(art, ch.player.sprite, 9); } catch(e){}
  s.appendChild(U.make('div','p', bs.long || ''));
  if (bs.goal) s.appendChild(U.make('div','p dim', `<i>${T('What you came for:')} ${bs.goal}</i>`));
  const row = U.make('div','row');
  row.appendChild(Btn('Visit the city', ()=>showCity(ch), 'btn center good'));
  row.appendChild(Btn('Cancel', showRoster, 'btn center'));
  s.appendChild(row);
  setModal(s);
}

// ================= THE CITY =================
const CITY_BUILDINGS = [
  { id:'tavern',  name:'The Rope and Lantern', desc:'Work, drink, and the only door in Hollowgate that leads down.', open:true },
  { id:'smithy',  name:'The Cold Forge',       desc:'The fire is banked and the shutters are down.', open:false },
  { id:'chapel',  name:'The Grey Chapel',      desc:'The Choir keeps it locked from the inside.', open:false },
  { id:'market',  name:'Gallows Market',       desc:'Stalls, mostly empty. Nobody is buying.', open:false },
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
    const card = U.make('div','codex-item' + (b.open ? ' open' : ' locked'));
    card.appendChild(U.make('h4', null, b.name));
    card.appendChild(U.make('div','d', b.desc));
    if (b.open) card.onclick = () => showTavern(ch);
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

function showNpc(ch, npc){
  ch.met[npc.id] = true; Save.putChar(ch);
  const { sheet, body } = pagedSheet(npc.name, ()=>showTavern(ch));
  const art = U.make('canvas'); art.width = 120; art.height = 120; art.className = 'scene-art';
  body.appendChild(art); try { Sprites.toCanvas(art, npc.sprite, 9); } catch(e){}
  body.appendChild(U.make('div','p dim', npc.intro));
  for (const l of npcLines(npc, ch)) body.appendChild(U.make('div','p', l.text));

  const row = U.make('div','row');
  if (npc.id === 'wanderer') row.appendChild(Btn('Ask about work', ()=>showContracts(ch), 'btn center good'));
  if (npc.id === 'quartermaster') row.appendChild(Btn('Read the board', ()=>showBounties(ch), 'btn center good'));
  row.appendChild(Btn('Back', ()=>showTavern(ch), 'btn center'));
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
  Object.assign(window, { showRoster, showCity, showTavern, showNpc, showContracts,
                          characterMade, returnToCity, soulLost, dreadOf, cityTier,
                          showBounties, bountyWorth, npcLines, contractOffer, confirmDescent });
}
