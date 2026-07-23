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

  // ---- Display options: how much screen the game takes, and which way up ----
  // fill: 0.80–1.00 of the phone's viewport · orient: 'auto' | 'landscape'
  opts(){ return this._read(this.KEY_OPTS, { fill: 1, orient: 'auto' }); },
  setOpt(k, v){ const o = this.opts(); o[k] = v; this._write(this.KEY_OPTS, o); return o; },

  wipe(){
    localStorage.removeItem(this.KEY_CODEX);
    localStorage.removeItem(this.KEY_META);
    localStorage.removeItem(this.KEY_SANCTUM);
  }
};
