// ---------- Small utility helpers (global) ----------
const U = {
  clamp(v, lo, hi){ return v < lo ? lo : v > hi ? hi : v; },
  rand(a, b){ return a + Math.random() * (b - a); },
  randInt(a, b){ return Math.floor(a + Math.random() * (b - a + 1)); },
  chance(p){ return Math.random() < p; },
  choice(arr){ return arr[Math.floor(Math.random() * arr.length)]; },
  shuffle(arr){
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  // weighted pick: items = [{w:number, ...}]
  weighted(items){
    let total = 0;
    for (const it of items) total += (it.w || 1);
    let r = Math.random() * total;
    for (const it of items){ r -= (it.w || 1); if (r <= 0) return it; }
    return items[items.length - 1];
  },
  lerp(a, b, t){ return a + (b - a) * t; },
  dist(ax, ay, bx, by){ return Math.abs(ax - bx) + Math.abs(ay - by); },
  el(id){ return document.getElementById(id); },
  make(tag, cls, html){
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
};
