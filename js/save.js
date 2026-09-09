// ---------- Persistence: codex of discovered encounter variants + meta ----------
const Save = {
  KEY_CODEX: 'graveborne_codex_v1',
  KEY_META: 'graveborne_meta_v1',
  KEY_SANCTUM: 'graveborne_sanctum_v1',
  KEY_OPTS: 'graveborne_opts_v1',

  _read(key, fallback){
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch(e){ return fallback; }
  },
  _write(key, val){
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){}
  },

  codex(){ return this._read(this.KEY_CODEX, {}); },
  isDiscovered(id){ return !!this.codex()[id]; },
  discover(id){
    const c = this.codex();
    if (!c[id]){ c[id] = { at: Date.now() }; this._write(this.KEY_CODEX, c); return true; }
    return false;
  },
  discoveredCount(){ return Object.keys(this.codex()).length; },

  meta(){ return this._read(this.KEY_META, { runs: 0, deepest: 0, wins: 0, deaths: 0, souls: 0 }); },
  saveMeta(m){ this._write(this.KEY_META, m); },
  bumpRun(){ const m = this.meta(); m.runs++; this.saveMeta(m); },
  recordDepth(d){ const m = this.meta(); if (d > m.deepest){ m.deepest = d; this.saveMeta(m); } },
  recordWin(){ const m = this.meta(); m.wins++; this.saveMeta(m); },
  recordDeath(){ const m = this.meta(); m.deaths++; this.saveMeta(m); },

  // ---- Souls: the persistent, stable currency (survives death) ----
  souls(){ const m = this.meta(); return m.souls || 0; },
  addSouls(n){ const m = this.meta(); m.souls = Math.max(0, (m.souls||0) + n); this.saveMeta(m); return m.souls; },
  spendSouls(n){ const m = this.meta(); if ((m.souls||0) < n) return false; m.souls -= n; this.saveMeta(m); return true; },

  // ---- Sanctum: permanent between-run upgrades (persistent ranks) ----
  sanctum(){ return this._read(this.KEY_SANCTUM, {}); },
  sanctumLevel(id){ return this.sanctum()[id] || 0; },
  incSanctum(id){ const s = this.sanctum(); s[id] = (s[id]||0) + 1; this._write(this.KEY_SANCTUM, s); return s[id]; },
  resetSanctum(){ this._write(this.KEY_SANCTUM, {}); },

  // ---- Achievements: permanent unlocks (e.g. the Alchemist class) ----
  KEY_ACH: 'graveborne_ach_v1',
  achievements(){ return this._read(this.KEY_ACH, {}); },
  hasAchievement(id){ return !!this.achievements()[id]; },
  earnAchievement(id){ const a = this.achievements(); if (a[id]) return false; a[id] = { at: Date.now() }; this._write(this.KEY_ACH, a); return true; },
  revokeAchievement(id){ const a = this.achievements(); if (!a[id]) return false; delete a[id]; this._write(this.KEY_ACH, a); return true; },

  // ---- Display options: how much screen the game takes, and which way up ----
  // fill: 0.80–1.00 of the phone's viewport · orient: 'auto' | 'landscape'
  // motion: 'smooth' slides between tiles (+ a faint trail) · 'instant' snaps, as it used to
  // lang: 'en' source text · 'hu' Hungarian, falling back to English where untranslated
  opts(){ return this._read(this.KEY_OPTS, { fill: 1, orient: 'auto', motion: 'smooth', lang: 'en' }); },
  setOpt(k, v){ const o = this.opts(); o[k] = v; this._write(this.KEY_OPTS, o); return o; },

  // ---------- The roster: a player keeps several souls, each with its own
  // progress. A character is its player object plus what the city remembers of
  // it. Dying deletes the record; Souls are meta and survive in KEY_META.
  KEY_ROSTER: 'graveborne_roster_v1',

  roster(){ return this._read(this.KEY_ROSTER, { chars: {}, activeId: null }); },
  chars(){ const r = this.roster(); return Object.values(r.chars).sort((a,b) => b.born - a.born); },
  getChar(id){ return this.roster().chars[id] || null; },
  activeChar(){ const r = this.roster(); return r.activeId ? (r.chars[r.activeId] || null) : null; },
  setActive(id){ const r = this.roster(); r.activeId = id; this._write(this.KEY_ROSTER, r); },
  putChar(c){
    const r = this.roster();
    r.chars[c.id] = c;
    this._write(this.KEY_ROSTER, r);
    return c;
  },
  newChar(classId, player){
    const id = 'c' + Date.now().toString(36) + Math.floor(Math.random()*1e6).toString(36);
    const c = { id, classId, born: Date.now(), descents: 0, player, flags: {}, met: {}, contract: null };
    this.putChar(c);
    this.setActive(id);
    return c;
  },
  // death is final for the soul, not for the ledger: the record goes, the Souls stay
  killChar(id){
    const r = this.roster();
    delete r.chars[id];
    if (r.activeId === id) r.activeId = null;
    this._write(this.KEY_ROSTER, r);
  },

  wipe(){
    localStorage.removeItem(this.KEY_CODEX);
    localStorage.removeItem(this.KEY_META);
    localStorage.removeItem(this.KEY_SANCTUM);
    localStorage.removeItem(this.KEY_ACH);
    localStorage.removeItem(this.KEY_ROSTER);
  }
};
