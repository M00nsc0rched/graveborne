// ---------- Combat figures: 100x100, composed rather than hand-plotted ----------
// The floor keeps its 24x24 sprites; a fight deserves more, and at a hundred
// pixels a side hand-placing every one as text stops being workable. So each
// fighter is painted from layers instead — silhouette, cloth, plate, straps,
// then the light — on a pixel-aligned grid, so it still belongs to the same art
// as the tiles even though no one typed it out square by square.
//
// Each figure is painted once into an offscreen canvas and reused; combat asks
// for it by the same sprite name the floor uses, and falls back to the 24x24 art
// for anything without a painter yet.
const Figures = (function(){
  'use strict';
  const SIZE = 100;
  const cache = {};

  // ---- primitives ----
  // Everything lands on whole pixels: the look stays blocky and deliberate
  // rather than drifting into soft vector shapes.
  function px(c, x, y, w, h, col){
    if (w <= 0 || h <= 0) return;
    c.fillStyle = col;
    c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }
  // a slab with its own top light and bottom shadow — the workhorse for armour
  function slab(c, x, y, w, h, dark, mid, light){
    px(c, x, y, w, h, mid);
    px(c, x, y, w, 2, light);
    px(c, x, y + h - 2, w, 2, dark);
    px(c, x, y, 1, h, light);
    px(c, x + w - 1, y, 1, h, dark);
  }
  // cloth: a panel broken by vertical folds, darker in the creases
  function cloth(c, x, y, w, h, dark, mid, light, folds){
    px(c, x, y, w, h, mid);
    const n = folds || 3;
    for (let i = 1; i < n; i++){
      const fx = x + Math.round(w * i / n);
      px(c, fx - 1, y, 2, h, dark);
      px(c, fx + 1, y, 1, h, light);
    }
    px(c, x, y, 1, h, dark);
    px(c, x + w - 1, y, 1, h, dark);
  }
  // a ragged lower edge, for robes that have been down here a while
  function tatter(c, x, y, w, col, seed){
    for (let i = 0; i < w; i += 2){
      const d = 2 + ((seed * (i + 3)) % 7);
      px(c, x + i, y, 2, d, col);
    }
  }
  function strap(c, x, y, w, dark, mid, buckle){
    px(c, x, y, w, 4, mid);
    px(c, x, y, w, 1, dark);
    px(c, x, y + 3, w, 1, dark);
    if (buckle){ px(c, x + Math.round(w/2) - 3, y - 1, 6, 6, buckle); px(c, x + Math.round(w/2) - 1, y + 1, 2, 2, dark); }
  }
  function glow(c, cx, cy, r, col){
    const g = c.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.fill();
  }
  // the standing shadow every figure gets, so none of them float by accident
  function ground(c){
    const g = c.createRadialGradient(50, 95, 2, 50, 95, 26);
    g.addColorStop(0, 'rgba(0,0,0,0.55)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.beginPath(); c.ellipse(50, 95, 26, 6, 0, 0, 7); c.fill();
  }
  // one warm edge down the left of the figure, matching the torch-lit scene
  function rimLight(c, col){
    c.save(); c.globalCompositeOperation = 'source-atop';
    const g = c.createLinearGradient(24, 0, 50, 0);
    g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.fillRect(0, 0, SIZE, SIZE);
    c.restore();
  }
  // a fixed speckle over whatever has already been painted, so flat cloth reads
  // as fabric rather than fill — the traced figures carry their own texture, and
  // without this the painted ones sit next to them looking like flat colour
  function grain(c, amt){
    c.save(); c.globalCompositeOperation = 'source-atop';
    for (let y = 0; y < SIZE; y++)
      for (let x = 0; x < SIZE; x++){
        let h = (x * 374761393 + y * 668265263) | 0;
        h = (h ^ (h >>> 13)) * 1274126177 | 0;
        const r = (h ^ (h >>> 16)) & 255;
        if (r < 40){ c.fillStyle = 'rgba(210,205,225,' + amt + ')'; c.fillRect(x, y, 1, 1); }
        else if (r > 215){ c.fillStyle = 'rgba(0,0,0,' + (amt * 1.6) + ')'; c.fillRect(x, y, 1, 1); }
      }
    c.restore();
  }
  // and a shadow pass down the right, so the form turns away from the light
  function formShadow(c){
    c.save(); c.globalCompositeOperation = 'source-atop';
    const g = c.createLinearGradient(56, 0, 82, 0);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.42)');
    c.fillStyle = g; c.fillRect(0, 0, SIZE, SIZE);
    c.restore();
  }

  // ---- shared humanoid scaffold ----
  // Legs, torso and arms in one place, so six characters share a build and only
  // differ where the sketches actually differ.
  function legs(c, o){
    const { dark, mid, light } = o;
    slab(c, 40, 66, 8, 22, dark, mid, light);
    slab(c, 52, 66, 8, 22, dark, mid, light);
    px(c, 38, 88, 12, 5, o.bootDark || dark);
    px(c, 50, 88, 12, 5, o.bootDark || dark);
    px(c, 38, 88, 12, 1, o.bootLight || mid);
    px(c, 50, 88, 12, 1, o.bootLight || mid);
  }
  // A trunk, not a card: broad at the chest, drawn in at the waist, flaring
  // again at the hips. Built row by row so the edge actually tapers.
  function torso(c, o){
    const { dark, mid, light } = o;
    for (let y = 36; y < 66; y++){
      const t = (y - 36) / 30;
      // chest 34 wide -> waist 24 -> hips 30
      const w = t < 0.55 ? 34 - Math.round(t / 0.55 * 10)
                         : 24 + Math.round((t - 0.55) / 0.45 * 6);
      const x = 50 - w / 2;
      px(c, x, y, w, 1, mid);
      px(c, x, y, 2, 1, light);
      px(c, x + w - 2, y, 2, 1, dark);
    }
    px(c, 33, 36, 34, 2, light);
    px(c, 49, 38, 2, 24, dark);                  // sternum line
    px(c, 36, 64, 28, 2, dark);
  }
  // Arms hang from the shoulder and narrow toward the wrist, with a hand block
  // at the end — thin enough that they read as limbs rather than posts.
  function arms(c, o){
    const { dark, mid, light } = o;
    for (const dir of [-1, 1]){
      for (let y = 38; y < 68; y++){
        const t = (y - 38) / 30;
        const w = 9 - Math.round(t * 3);
        const x = dir < 0 ? 33 - w - Math.round(t * 2) : 67 + Math.round(t * 2);
        px(c, x, y, w, 1, mid);
        px(c, dir < 0 ? x : x + w - 1, y, 1, 1, dir < 0 ? light : dark);
      }
      const hx = dir < 0 ? 23 : 69;
      px(c, hx, 67, 8, 7, o.gloveDark || dark);
      px(c, hx, 67, 8, 1, mid);
    }
  }
  function pauldrons(c, o){
    const { dark, mid, light } = o;
    slab(c, 20, 33, 16, 10, dark, mid, light);
    slab(c, 64, 33, 16, 10, dark, mid, light);
  }
  function head(c, o){
    const { dark, mid, light } = o;
    slab(c, 38, 12, 24, 22, dark, mid, light);
    px(c, 42, 34, 16, 4, dark);                   // neck
  }

  // ================= the six =================

  // Dark plate, horned helm, greatsword point-down, kite shield.
  function knight(c){
    const P = { dark:'#14131c', mid:'#33313f', light:'#5d5b6c' };
    ground(c);
    legs(c, { ...P, bootDark:'#0e0d14', bootLight:'#3c3a48' });
    torso(c, P);
    arms(c, P);
    pauldrons(c, { dark:'#0f0e15', mid:'#3a3846', light:'#6b697c' });
    head(c, { dark:'#0f0e15', mid:'#34323f', light:'#5f5d6f' });
    // visor: a dark slit with a lit brow above it
    px(c, 40, 22, 20, 5, '#08070c');
    px(c, 40, 20, 20, 2, '#6e6c80');
    for (let i = 0; i < 4; i++) px(c, 43 + i*5, 22, 2, 5, '#1b1a24');
    // horns sweeping up and out of the helm
    for (let i = 0; i < 10; i++){
      px(c, 37 - i, 12 - i, 3, 3, i < 6 ? '#2a2836' : '#4a4858');
      px(c, 60 + i, 12 - i, 3, 3, i < 6 ? '#2a2836' : '#4a4858');
    }
    // breastplate emblem
    px(c, 44, 42, 12, 12, '#8a6a28');
    px(c, 46, 44, 8, 8, '#d0a84e');
    px(c, 48, 46, 4, 4, '#ffe08a');
    strap(c, 33, 60, 34, '#0d0c12', '#4a3520', '#8a6a28');
    // greatsword, hilt at the hand and the blade hanging to the floor
    px(c, 20, 58, 16, 4, '#6a5a3a');                       // crossguard
    px(c, 26, 54, 4, 6, '#3a3448');                        // grip
    px(c, 26, 50, 4, 4, '#d0a84e');                        // pommel
    px(c, 26, 62, 4, 32, '#8e8ea6');                       // blade
    px(c, 27, 62, 1, 32, '#cdcde0');                       // fuller highlight
    px(c, 26, 94, 4, 4, '#6e6e86');
    // kite shield on the other side
    px(c, 70, 40, 20, 30, '#3a2a18');
    px(c, 72, 42, 16, 26, '#5a4020');
    px(c, 70, 40, 20, 2, '#7a5a30');
    for (let i = 0; i < 5; i++) px(c, 74 + i*3, 44, 2, 22, '#4a3418');
    px(c, 74, 68, 12, 10, '#3a2a18');                      // the point
    px(c, 78, 50, 6, 6, '#d0a84e');                        // boss
    rimLight(c, 'rgba(255,190,120,0.18)');
    formShadow(c);
  }

  // Slender, pale hair, a dark band across the eyes, gold-trimmed black gown.
  function mage(c){
    const P = { dark:'#0d0b14', mid:'#1e1a2c', light:'#332c48' };
    ground(c);
    // the gown: narrow at the waist, spreading to a pooled hem
    for (let y = 40; y < 92; y++){
      const w = 16 + Math.round((y - 40) * 0.86);
      cloth(c, 50 - w/2, y, w, 1, P.dark, P.mid, P.light, 5);
    }
    tatter(c, 6, 90, 88, P.dark, 5);
    torso(c, P);
    arms(c, { ...P, gloveDark:'#0a0810' });
    // shawl over the shoulders, falling to the elbows
    px(c, 26, 34, 48, 12, '#161227');
    px(c, 26, 34, 48, 2, '#3a3252');
    px(c, 26, 44, 10, 14, '#12101f');
    px(c, 64, 44, 10, 14, '#12101f');
    head(c, { dark:'#6a4a30', mid:'#e6b892', light:'#f2d0b0' });
    // hair: pale, swept back, falling past the shoulders
    px(c, 36, 8, 28, 10, '#c9b98e');
    px(c, 34, 12, 6, 26, '#b3a37c');
    px(c, 60, 12, 6, 26, '#b3a37c');
    px(c, 38, 8, 24, 3, '#f4ecd8');
    // the band across the eyes
    px(c, 37, 21, 26, 6, '#0a0810');
    px(c, 37, 21, 26, 1, '#2e2740');
    px(c, 44, 30, 12, 2, '#c98a86');                       // mouth
    // gold running down the front of the gown
    for (let y = 44; y < 88; y += 4) px(c, 49, y, 3, 3, '#d0a84e');
    px(c, 42, 42, 16, 3, '#d0a84e');
    strap(c, 38, 58, 24, '#0a0810', '#2a2440', '#d0a84e');
    rimLight(c, 'rgba(200,170,255,0.16)');
    formShadow(c);
  }

  // Ethereal, mint-pale, a crown of blooms and ribbons of light. She does not
  // stand, so she gets none of the standing scaffold: the body is drawn as one
  // tapering column of light that frays away below the waist.
  function warden(c){
    glow(c, 50, 52, 48, 'rgba(127,208,194,0.14)');
    // ribbons, drawn first so the body sits in front of them
    c.lineWidth = 2;
    for (const dir of [-1, 1]){
      for (let k = 0; k < 3; k++){
        c.strokeStyle = `rgba(168,237,224,${0.7 - k * 0.18})`;
        c.beginPath();
        c.moveTo(50 + dir * 12, 44 + k * 8);
        c.bezierCurveTo(50 + dir * (34 + k * 8), 46 + k * 10,
                        50 + dir * (30 + k * 6), 74 + k * 6,
                        50 + dir * (12 + k * 5), 88 + k * 3);
        c.stroke();
      }
    }
    // the column: shoulders down to a frayed tail, tapering the whole way
    for (let y = 34; y < 96; y++){
      const t = (y - 34) / 62;
      let w;
      if (t < 0.18)      w = 26 - Math.round(t / 0.18 * 8);      // shoulders in
      else if (t < 0.45) w = 18 + Math.round((t - 0.18) / 0.27 * 6);
      else               w = 24 - Math.round((t - 0.45) / 0.55 * 20);
      const x = 50 - w / 2;
      const a = y > 80 ? Math.max(0, 1 - (y - 80) / 18) : 1;
      c.globalAlpha = a;
      px(c, x, y, w, 1, '#6fbfb0');
      px(c, x, y, 2, 1, '#cdf6ec');
      px(c, x + w - 2, y, 2, 1, '#2a5c58');
      if (y % 7 === 0) px(c, x + 3, y, w - 6, 1, '#8fd8cc');      // a fold catching light
      c.globalAlpha = 1;
    }
    // arms, thin and held a little away from the body
    for (const dir of [-1, 1]){
      for (let y = 38; y < 64; y++){
        const t = (y - 38) / 26;
        const w = 6 - Math.round(t * 2);
        const x = dir < 0 ? 34 - w - Math.round(t * 4) : 66 + Math.round(t * 4);
        px(c, x, y, w, 1, '#8fd8cc');
        px(c, dir < 0 ? x : x + w - 1, y, 1, 1, dir < 0 ? '#cdf6ec' : '#3a6a62');
      }
    }
    // head and veil
    slab(c, 39, 12, 22, 22, '#3a6a62', '#a8ede0', '#e6fbf6');
    px(c, 43, 22, 5, 4, '#123a36'); px(c, 53, 22, 5, 4, '#123a36');
    px(c, 46, 30, 8, 2, '#3a6a62');
    px(c, 37, 30, 26, 6, '#7fd0c2');                              // veil across the throat
    // the bloom crown
    px(c, 30, 9, 40, 2, '#4e9e92');
    for (const bx of [31, 43, 55, 65]){
      px(c, bx, 2, 8, 8, '#eef0e0');
      px(c, bx + 1, 3, 6, 2, '#f8fbf0');
      px(c, bx + 3, 4, 3, 3, '#c03636');
      px(c, bx + 3, 10, 2, 4, '#4e9e92');
    }
    rimLight(c, 'rgba(180,255,240,0.20)');
  }

  // Plague beak, hood and long coat, belts of vials, acid-green glow.
  function alchemist(c){
    const P = { dark:'#1a1208', mid:'#2f2413', light:'#4a3a1e' };
    ground(c);
    for (let y = 44; y < 88; y++){
      const w = 30 + Math.round((y - 44) * 0.5);
      cloth(c, 50 - w/2, y, w, 1, '#120c06', '#241a0d', '#3e3018', 4);
    }
    tatter(c, 22, 86, 56, '#120c06', 3);
    legs(c, { dark:'#0f0a05', mid:'#241a0d', light:'#3a2c16', bootDark:'#0a0703' });
    torso(c, P);
    arms(c, { ...P, gloveDark:'#120c06' });
    pauldrons(c, { dark:'#120c06', mid:'#2a2011', light:'#463618' });
    // hood over the mask
    px(c, 34, 8, 32, 30, '#1e1509');
    px(c, 34, 8, 32, 3, '#3a2c16');
    head(c, { dark:'#3a3448', mid:'#6e6c80', light:'#b8b6c8' });
    px(c, 40, 16, 20, 12, '#8e8ca0');                       // mask face
    px(c, 43, 20, 5, 4, '#0d1a18'); px(c, 53, 20, 5, 4, '#0d1a18');   // lenses
    px(c, 43, 20, 5, 1, '#7fd0c2'); px(c, 53, 20, 5, 1, '#7fd0c2');
    // the beak, long and pale, angled down
    for (let i = 0; i < 16; i++) px(c, 46 - i, 28 + Math.round(i * 0.55), 4 - Math.round(i/6), 3, i < 10 ? '#cdcbd8' : '#9a98a8');
    // belts of vials across the body, each one lit from inside
    strap(c, 30, 52, 40, '#0d0904', '#4a3520', '#8a6a28');
    strap(c, 32, 62, 36, '#0d0904', '#4a3520', '#8a6a28');
    for (let i = 0; i < 5; i++){
      const vx = 34 + i * 7;
      px(c, vx, 56, 5, 8, '#1d2a10');
      px(c, vx + 1, 58, 3, 5, '#b6ff5a');
      glow(c, vx + 2, 60, 7, 'rgba(182,255,90,0.28)');
    }
    // and the flask in the raised hand
    px(c, 18, 46, 10, 12, '#26340f');
    px(c, 20, 48, 6, 8, '#b6ff5a');
    px(c, 21, 42, 4, 5, '#3a3020');
    glow(c, 23, 52, 16, 'rgba(182,255,90,0.34)');
    rimLight(c, 'rgba(182,255,90,0.14)');
    formShadow(c);
  }

  // Wide hat, ragged robe, a shoulder pole with two cold lanterns.
  function necromancer(c){
    const P = { dark:'#08070c', mid:'#15131e', light:'#262233' };
    ground(c);
    for (let y = 40; y < 92; y++){
      const w = 26 + Math.round((y - 40) * 0.62);
      cloth(c, 50 - w/2, y, w, 1, '#050409', '#12101a', '#221e2e', 5);
    }
    tatter(c, 14, 90, 72, '#050409', 7);
    torso(c, P);
    arms(c, P);
    head(c, { dark:'#050409', mid:'#0d0c14', light:'#1a1824' });
    px(c, 42, 22, 5, 4, '#7fd0c2'); px(c, 53, 22, 5, 4, '#7fd0c2');   // cold eyes
    glow(c, 44, 24, 9, 'rgba(127,208,194,0.35)');
    glow(c, 56, 24, 9, 'rgba(127,208,194,0.35)');
    // the hat: a wide, slightly drooping cone
    px(c, 40, 2, 20, 8, '#15131e');
    for (let i = 0; i < 5; i++) px(c, 38 - i*4, 10 + i, 24 + i*8, 3, i < 3 ? '#1c1a28' : '#12101a');
    px(c, 14, 14, 72, 3, '#0d0c14');
    px(c, 14, 14, 72, 1, '#2a2638');
    // the pole across the shoulders, with a lantern swinging at each end
    px(c, 6, 40, 88, 3, '#4a3520');
    px(c, 6, 40, 88, 1, '#6a4a2a');
    for (const lx of [10, 84]){
      px(c, lx + 2, 43, 1, 10, '#3a2a1a');
      px(c, lx - 2, 53, 10, 14, '#0f2e2c');
      px(c, lx, 55, 6, 10, '#7fd0c2');
      px(c, lx + 1, 57, 4, 6, '#cdf6ec');
      px(c, lx - 2, 53, 10, 2, '#3a2a1a');
      glow(c, lx + 3, 60, 20, 'rgba(127,208,194,0.30)');
    }
    rimLight(c, 'rgba(127,208,194,0.12)');
    formShadow(c);
  }

  // The Gravethief. There is no concept plate for this one to be lifted from,
  // so it is still painted — but built to the proportions the traced figures
  // actually have: the head is a seventh of the height, not a third, and the
  // shoulders are two heads across. None of the shared scaffold is used; a
  // thief is a narrower build than the plated classes share.
  function rogue(c){
    ground(c);

    // A spine that drifts rather than running dead straight, and one profile
    // every layer agrees on. Shoulders at 25, belt at 49, knees at 71.
    const spine = (y) => 50 + Math.round(Math.sin((y - 20) / 34) * 2.4);
    const body = (y) => y < 25 ? 8 + (y - 20) * 1.0            // into the shoulders
                      : y < 49 ? 13 - (y - 25) * 0.17          // to the belt
                      : y < 72 ? 9 + (y - 49) * 0.20           // the coat below it
                               : 0;

    // ---- legs, behind the coat ----
    // the weight is on the near leg; the far one is set back and half a step short
    for (const [dx, sh] of [[-7, 0], [2, 1]]){
      const top = 64, bot = sh ? 90 : 93;
      for (let y = top; y < bot; y++){
        const w = 6 - (y > bot - 10 ? 1 : 0), x = spine(y) + dx;
        px(c, x, y, w, 1, sh ? '#0c0a11' : '#12101d');
        px(c, x, y, 1, 1, sh ? '#161421' : '#201c2b');
      }
      // the pale shin wraps, tightening toward the ankle
      for (let i = 0; i < 4; i++)
        px(c, spine(bot) + dx, bot - 18 + i*4, 6 - i, 2, sh ? '#4e442c' : '#75663f');
      const fx = spine(bot) + dx;
      px(c, fx - 2, bot - 2, 10, 4, sh ? '#0a0810' : '#0d0b12');          // boot
      px(c, fx - 5, bot + 1, 13, 2, sh ? '#0a0810' : '#0d0b12');          // long toe
      px(c, fx - 2, bot - 2, 10, 1, sh ? '#191623' : '#282434');
    }

    // ---- the coat ----
    for (let y = 20; y <= 72; y++){
      const w = Math.round(body(y) * 2); if (w <= 0) continue;
      const x = spine(y) - Math.round(w / 2);
      px(c, x, y, w, 1, y < 49 ? '#191725' : '#141221');
      px(c, x, y, 2, 1, '#2c2840');
      px(c, x + w - 2, y, 2, 1, '#09080e');
    }
    for (const [off, fy, fh, lit] of [[-6,52,20,0],[-1,50,22,1],[5,52,19,0],[-9,58,13,0],[8,58,13,0]])
      for (let y = fy; y < fy + fh; y++){
        px(c, spine(y) + off, y, 1, 1, '#0e0c16');
        if (lit) px(c, spine(y) + off + 1, y, 1, 1, '#292437');
      }
    tatter(c, 38, 71, 25, '#0c0a12', 5);

    // ---- arms ----
    // the near one carried forward with the knife, the far one dropped back
    for (const dir of [-1, 1]){
      for (let y = 26; y < (dir < 0 ? 52 : 55); y++){
        const t = (y - 26) / 28, w = 5 - Math.round(t * 1);
        const x = dir < 0 ? spine(y) - 11 - w + Math.round(t * 4)
                          : spine(y) + 10 - Math.round(t * 2);
        px(c, x, y, w, 1, dir < 0 ? '#1b1927' : '#131120');
        px(c, dir < 0 ? x : x + w - 1, y, 1, 1, dir < 0 ? '#302b40' : '#0a0810');
      }
      // bracer, then the gloved hand
      const bx = dir < 0 ? 36 : 59, by = dir < 0 ? 40 : 43;
      px(c, bx, by, 5, 9, dir < 0 ? '#231e2e' : '#191524');
      px(c, bx, by, 5, 1, dir < 0 ? '#3f3850' : '#2a2537');
      px(c, bx, by + 2, 5, 1, dir < 0 ? '#75663f' : '#50462c');
      px(c, bx, by + 6, 5, 1, dir < 0 ? '#75663f' : '#50462c');
      px(c, dir < 0 ? 37 : 59, dir < 0 ? 51 : 54, 5, 5, '#0d0b13');
      px(c, dir < 0 ? 37 : 59, dir < 0 ? 51 : 54, 5, 1, '#251f31');
    }

    // ---- belt, and the ladder of brass straps under it ----
    for (let y = 46; y < 51; y++){
      const w = Math.round(body(y) * 2) - 2, x = spine(y) - Math.round(w / 2);
      px(c, x, y, w, 1, y === 46 || y === 50 ? '#0a0810' : '#3a2f21');
    }
    px(c, 48, 46, 5, 5, '#7a6737'); px(c, 50, 48, 2, 2, '#0a0810');
    for (let i = 0; i < 3; i++){
      const x = spine(52 + i*5) - 4;
      px(c, x, 52 + i*5, 8, 2, '#54481f');
      px(c, x, 52 + i*5, 8, 1, '#7d6c40');
    }
    px(c, 38, 50, 6, 7, '#241e2c'); px(c, 38, 50, 6, 1, '#3b3245');       // pouch
    for (let i = 0; i < 3; i++) px(c, 60 + i*2, 50, 1, 4 + i, '#6f5f34'); // picks

    // ---- hood, one head tall ----
    for (let y = 5; y <= 26; y++){
      const hw = y < 14 ? 3 + (y - 5) * 0.72 : 9.5 + (y - 14) * 0.14;
      const w = Math.round(hw * 2), x = spine(y) - Math.round(w / 2);
      px(c, x, y, w, 1, '#151321');
      px(c, x, y, 2, 1, '#2b2739');
      px(c, x + w - 2, y, 2, 1, '#09080e');
    }
    // the opening: a dark well the mask is set back inside
    for (let y = 10; y < 24; y++){
      const w = 12 - Math.round(Math.abs(y - 16) * 0.6);
      px(c, spine(y) - Math.round(w / 2), y, w, 1, '#07060b');
    }

    // ---- the mask ----
    // small, dull bone, narrowing at the jaw so it reads as a face in shadow
    for (let y = 11; y < 23; y++){
      const w = 10 - Math.round((y - 11) * 0.3), x = spine(y) - Math.round(w / 2);
      px(c, x, y, w, 1, '#4c4856');
      px(c, x, y, 1, 1, '#726d7d');
      px(c, x + w - 1, y, 1, 1, '#2c2936');
    }
    px(c, 46, 14, 3, 3, '#07060b'); px(c, 51, 14, 3, 3, '#07060b');      // eye pits
    px(c, 46, 14, 3, 1, '#26232e'); px(c, 51, 14, 3, 1, '#26232e');
    px(c, 50, 13, 1, 8, '#3d3947');                                       // centre seam
    for (let i = 0; i < 3; i++) px(c, 47 + i*2, 20, 1, 1, '#312e3a');     // stitched mouth
    // the cowl wound round the throat, hiding the hood's seam
    for (let y = 24; y < 30; y++){
      const w = 17 - (y - 24), x = spine(y) - Math.round(w / 2);
      px(c, x, y, w, 1, y === 24 ? '#332d42' : '#1f1b2b');
      px(c, x, y, 1, 1, '#3a3448');
    }

    // ---- the knife, carried low in the near hand ----
    px(c, 38, 50, 2, 6, '#2a2334');                                       // grip
    px(c, 36, 48, 6, 2, '#7a6737');                                       // guard
    for (let i = 0; i < 15; i++){
      const bx = 38 - Math.round(i * 0.4);
      px(c, bx, 56 + i, 2, 1, '#8f8a9e');
      px(c, bx, 56 + i, 1, 1, '#c9c4d6');
    }

    grain(c, 0.06);
    rimLight(c, 'rgba(255,190,120,0.16)');
    formShadow(c);
  }

  const PAINTERS = {
    hero_knight: knight, hero_mage: mage, hero_warden: warden,
    npc_alchemist: alchemist, hero_necromancer: necromancer, hero_rogue: rogue,
  };

  // ---- traced art ----
  // Where a character has art carried over from its concept sheet, that is what
  // it looks like; the painters below are the fallback for the ones that do not
  // have one. Decoding a data URI still goes through the image's load event, so
  // the painter covers the first frames and the traced canvas replaces it the
  // moment it is ready.
  const ART = (typeof FIGURE_ART === 'object' && FIGURE_ART) || {};
  const traced = {};
  for (const name in ART){
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement('canvas');
      cv.width = SIZE; cv.height = SIZE;
      const c = cv.getContext('2d');
      c.imageSmoothingEnabled = false;
      c.drawImage(img, 0, 0, SIZE, SIZE);
      traced[name] = cv;
    };
    img.src = 'data:image/png;base64,' + ART[name];
  }

  return {
    SIZE,
    has(name){ return !!PAINTERS[name] || !!ART[name]; },
    // painted once, then reused — combat redraws every frame
    get(name){
      if (traced[name]) return traced[name];
      if (!PAINTERS[name]) return null;
      if (cache[name]) return cache[name];
      const cv = document.createElement('canvas');
      cv.width = SIZE; cv.height = SIZE;
      const c = cv.getContext('2d');
      c.imageSmoothingEnabled = false;
      PAINTERS[name](c);
      cache[name] = cv;
      return cv;
    },
    // draw at an arbitrary box, snapping to whole pixels so it stays crisp
    draw(ctx, name, x, y, size){
      const cv = this.get(name);
      if (!cv) return false;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(cv, Math.round(x), Math.round(y), Math.round(size), Math.round(size));
      return true;
    },
  };
})();
