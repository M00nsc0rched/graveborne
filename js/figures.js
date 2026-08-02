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

  // The Gravethief, off the reference sheet: a low hood with a gold-trimmed
  // edge, a beaked steel mask set back inside it, a blackened breastplate over
  // striated leather, and a dagger carried low. Planted wide — the reference
  // stands in a fighting crouch, not to attention.
  function rogue(c){
    ground(c);
    const spine = (y) => 50 + Math.round(Math.sin((y - 20) / 40) * 1.6);

    // ---- the cloak, hung behind the near shoulder ----
    for (let y = 26; y < 82; y++){
      const t = (y - 26) / 56, w = 8 + Math.round(t * 8);
      px(c, 34 - Math.round(t * 7), y, w, 1, '#0a0910');
      px(c, 34 - Math.round(t * 7), y, 1, 1, '#1d1a26');
    }
    tatter(c, 27, 81, 16, '#0a0910', 3);

    // ---- legs, splayed into the reference's wide stance ----
    for (const dir of [-1, 1]){
      for (let y = 58; y < 92; y++){
        const t = (y - 58) / 34;
        const x = spine(y) + dir * (3 + Math.round(t * 9)) - (dir < 0 ? 6 : 0);
        const w = 7 - (t > 0.6 ? 1 : 0);
        px(c, x, y, w, 1, dir < 0 ? '#2b2620' : '#221e19');
        px(c, x, y, 1, 1, dir < 0 ? '#463d31' : '#332c24');
        px(c, x + w - 1, y, 1, 1, '#100e0c');
      }
      // shin plates, and the turned-out boot
      const bx = spine(88) + dir * 12 - (dir < 0 ? 6 : 0);
      for (let i = 0; i < 3; i++) px(c, bx, 74 + i*5, 6, 3, '#3b342b');
      for (let i = 0; i < 3; i++) px(c, bx, 74 + i*5, 6, 1, '#5c5142');
      px(c, bx - 2, 89, 11, 5, '#2a231b');
      px(c, bx + (dir < 0 ? -5 : 4), 92, 7, 2, '#2a231b');
      px(c, bx - 2, 89, 11, 1, '#463c2f');
    }

    // ---- the coat: striated leather, layered in panels ----
    // it has a waist — the first pass ran shoulder to knee at one width and
    // read as a crate with a head on it
    const body = (y) => y < 26 ? 8 + (y - 20) * 0.83
                      : y < 46 ? 13 - (y - 26) * 0.17
                      : y < 70 ? 9.6 + (y - 46) * 0.11
                               : 0;
    for (let y = 20; y <= 70; y++){
      const w = Math.round(body(y) * 2); if (w <= 0) continue;
      const x = spine(y) - Math.round(w / 2);
      cloth(c, x, y, w, 1, '#15120f', '#2e2820', '#463d31', 4);
    }
    // the panel edges the reference layers down the skirt
    for (const hy of [55, 62, 68]){
      const w = Math.round(body(hy) * 2), x = spine(hy) - Math.round(w / 2);
      px(c, x, hy, w, 1, '#100e0b'); px(c, x, hy + 1, w, 1, '#40372c');
    }
    tatter(c, 39, 69, 23, '#100e0b', 5);

    // ---- the breastplate ----
    for (let y = 26; y < 45; y++){
      const w = 16 - Math.round(Math.abs(y - 33) * 0.45), x = spine(y) - Math.round(w / 2);
      px(c, x, y, w, 1, '#20202a');
      px(c, x, y, 2, 1, '#3c3c4c');
      px(c, x + w - 2, y, 2, 1, '#0c0c11');
    }
    px(c, 50, 27, 1, 17, '#3a3a49');                                     // centre seam
    px(c, 47, 25, 6, 3, '#7d6a3c'); px(c, 49, 26, 2, 1, '#c0a558');      // collar clasp

    // ---- arms ----
    // carried clear of the ribs, so they read as limbs and not as coat
    for (const dir of [-1, 1]){
      for (let y = 26; y < (dir < 0 ? 52 : 56); y++){
        const t = (y - 26) / 30, w = 6 - Math.round(t * 1);
        const x = dir < 0 ? spine(y) - 14 - w + Math.round(t * 3)
                          : spine(y) + 13 + Math.round(t * 2);
        px(c, x, y, w, 1, dir < 0 ? '#332c23' : '#241f19');
        px(c, x, y, 1, 1, dir < 0 ? '#4e4436' : '#382f26');
        px(c, x + w - 1, y, 1, 1, '#0f0d0b');
      }
      // buckled bracer, then the glove
      const bx = dir < 0 ? 32 : 64, by = dir < 0 ? 39 : 43;
      px(c, bx, by, 6, 11, dir < 0 ? '#3a3229' : '#2b251e');
      px(c, bx, by, 6, 1, dir < 0 ? '#5c5142' : '#443a2f');
      for (let i = 0; i < 3; i++) px(c, bx, by + 2 + i*4, 6, 1, '#15120f');
      px(c, dir < 0 ? 32 : 64, dir < 0 ? 50 : 54, 6, 6, '#181410');
      px(c, dir < 0 ? 32 : 64, dir < 0 ? 50 : 54, 6, 1, '#332b23');
    }

    // ---- belt, and the straps slung off it ----
    for (let y = 46; y < 52; y++){
      const w = Math.round(body(y) * 2) - 1, x = spine(y) - Math.round(w / 2);
      px(c, x, y, w, 1, y === 46 || y === 51 ? '#100e0b' : '#4a3d2c');
    }
    px(c, 47, 46, 7, 6, '#6d5c38'); px(c, 49, 48, 3, 2, '#100e0b');
    for (let i = 0; i < 8; i++) px(c, 43 + i, 52 + i, 2, 1, '#4a3d2c');  // diagonal strap
    for (let i = 0; i < 6; i++) px(c, 57 - i, 52 + i, 2, 1, '#3b3122');
    px(c, 39, 50, 5, 8, '#332b21'); px(c, 39, 50, 5, 1, '#4e4436');      // hip pouch
    px(c, 58, 55, 4, 4, '#6d5c38'); px(c, 59, 56, 2, 2, '#100e0b');      // ring

    // ---- hood, and the mantle across the shoulders ----
    for (let y = 5; y <= 26; y++){
      const hw = y < 15 ? 3.5 + (y - 5) * 0.75 : 11 + (y - 15) * 0.25;
      const w = Math.round(hw * 2), x = spine(y) - Math.round(w / 2);
      px(c, x, y, w, 1, '#141810');
      px(c, x, y, 2, 1, '#28301e');
      px(c, x + w - 2, y, 2, 1, '#080a06');
    }
    // the gold trim running round the hood's edge
    for (let y = 9; y < 24; y++){
      const hw = y < 15 ? 3.5 + (y - 5) * 0.75 : 11 + (y - 15) * 0.25;
      px(c, spine(y) - Math.round(hw) + 2, y, 1, 1, '#9a8244');
    }
    px(c, 44, 8, 12, 1, '#9a8244');
    // the opening: a dark well the mask sits back inside
    for (let y = 11; y < 25; y++){
      const w = 13 - Math.round(Math.abs(y - 17) * 0.7);
      px(c, spine(y) - Math.round(w / 2), y, w, 1, '#05060a');
    }

    // ---- the beaked steel mask ----
    for (let y = 12; y < 22; y++){
      const w = 10 - Math.round((y - 12) * 0.55), x = spine(y) - Math.round(w / 2);
      px(c, x, y, w, 1, '#59575f');
      px(c, x, y, 1, 1, '#8b8894');
      px(c, x + w - 1, y, 1, 1, '#302f36');
    }
    px(c, 46, 14, 3, 2, '#07070b'); px(c, 52, 14, 3, 2, '#07070b');      // eye slits
    for (let i = 0; i < 6; i++)                                          // the beak
      px(c, 49 - (i < 3 ? 0 : 1), 19 + i, 3 - (i > 3 ? 1 : 0), 1, i < 3 ? '#6d6a74' : '#4a4850');
    px(c, 49, 19, 1, 5, '#a09da8');
    // the mantle wrapped over the shoulders, under the hood
    for (let y = 24; y < 31; y++){
      const w = 22 + (y - 24), x = spine(y) - Math.round(w / 2);
      px(c, x, y, w, 1, '#141810');
      px(c, x, y, 2, 1, '#28301e');
      px(c, x + w - 2, y, 2, 1, '#080a06');
    }
    px(c, 40, 30, 20, 1, '#0a0c07');

    // ---- the dagger, held low in the near hand ----
    px(c, 33, 48, 3, 6, '#2a231b');
    px(c, 31, 46, 7, 2, '#6d5c38');
    for (let i = 0; i < 14; i++){
      const bx = 33 - Math.round(i * 0.8);
      px(c, bx, 54 + i, 3 - (i > 10 ? 1 : 0), 1, '#8a8794');
      px(c, bx, 54 + i, 1, 1, '#cbc8d4');
    }

    grain(c, 0.055);
    rimLight(c, 'rgba(255,190,120,0.16)');
    formShadow(c);
  }

  // The Ashen Cultist: a crimson mantle gathered at the throat with silver
  // brooches, a bronze mask under the hood, one spiked pauldron, and a cloak
  // that reaches the floor and spreads there.
  function cultist(c){
    ground(c);
    const spine = () => 50;

    // ---- the cloak, floor-length and spreading at the hem ----
    for (let y = 24; y <= 93; y++){
      const t = (y - 24) / 69;
      const w = Math.round((11 + t * t * 27) * 2), x = 50 - Math.round(w / 2);
      px(c, x, y, w, 1, '#4e1018');
      px(c, x, y, 3, 1, '#7d1c26');
      px(c, x + w - 3, y, 3, 1, '#2a080d');
    }
    // the folds the reference drapes down the front, kept inside the hem —
    // spreading them by the same factor as the cloak walked them off its edge
    for (const [off, fy, fh] of [[-14,42,50],[-6,34,58],[3,36,56],[12,46,46],[20,58,34],[-21,56,36]])
      for (let y = fy; y < fy + fh && y <= 93; y++){
        const t = (y - 24) / 69, half = 11 + t * t * 27;
        const fx = 50 + Math.round(off * (1 + t * 1.7));
        if (fx < 50 - half + 3 || fx > 50 + half - 4) continue;
        px(c, fx, y, 2, 1, '#380b12');
        px(c, fx + 2, y, 1, 1, '#6b1721');
      }
    // boots, just showing under the hem
    px(c, 52, 88, 9, 5, '#241a14'); px(c, 55, 92, 8, 2, '#241a14');
    px(c, 52, 88, 9, 1, '#3d2e23');

    // ---- the arms, in dark sleeves under the mantle ----
    for (const dir of [-1, 1]){
      for (let y = 30; y < 62; y++){
        const t = (y - 30) / 32, w = 7 - Math.round(t * 2);
        const x = dir < 0 ? 50 - 15 - w + Math.round(t * 3) : 50 + 14 - Math.round(t * 2);
        px(c, x, y, w, 1, '#2a1218');
        px(c, x, y, 1, 1, '#43202a');
      }
      px(c, dir < 0 ? 36 : 60, 60, 6, 7, '#3d2a1c');                     // gloved hand
      px(c, dir < 0 ? 36 : 60, 60, 6, 1, '#5e4429');
      for (let i = 0; i < 3; i++) px(c, dir < 0 ? 36 : 60, 66 + i, 5 - i, 1, '#3d2a1c');
    }
    // bronze vambrace on the spiked side
    px(c, 60, 46, 7, 13, '#6b4826'); px(c, 60, 46, 7, 1, '#a3763d');
    px(c, 60, 52, 7, 1, '#3f2a15'); px(c, 66, 46, 1, 13, '#3f2a15');

    // ---- the spiked pauldron ----
    // a solid bronze shell first; the spikes ride its outer edge rather than
    // fanning off the shoulder as loose sticks
    for (let y = 26; y < 44; y++){
      const t = (y - 26) / 18, w = 15 - Math.round(t * 5);
      px(c, 58, y, w, 1, '#7a5430');
      px(c, 58, y, 2, 1, '#b5854a');
      px(c, 58 + w - 2, y, 2, 1, '#432c17');
    }
    for (let i = 0; i < 4; i++) px(c, 58, 29 + i*4, 15 - i*2, 1, '#5c3d21');  // ridges
    for (let i = 0; i < 4; i++){                                          // the spikes
      const sy = 28 + i*4, sx = 73 - i*2, len = 7 - i;
      for (let j = 0; j < len; j++)
        px(c, sx + j, sy - Math.round(j * 0.7), 2, 2, j > len - 3 ? '#c99a58' : '#8b6238');
    }

    // ---- the mantle over the shoulders, gathered at the throat ----
    for (let y = 22; y < 40; y++){
      const w = 34 - Math.round(Math.abs(y - 30) * 0.7), x = 50 - Math.round(w / 2);
      px(c, x, y, w, 1, '#6b1721');
      px(c, x, y, 3, 1, '#9c2430');
      px(c, x + w - 3, y, 3, 1, '#3d0d14');
    }
    for (const [off, fy] of [[-11,26],[-4,24],[4,25],[11,27]])
      for (let y = fy; y < 40; y++) px(c, 50 + off, y, 2, 1, '#4e1018');
    // the small silver brooches the mantle is gathered with — the first pass
    // sized them like windows
    // small and tarnished — anything paler than this reads as a second pair of
    // eyes on the chest, because everything around it is crimson
    px(c, 42, 30, 2, 2, '#6e6154'); px(c, 42, 30, 1, 1, '#928275');
    px(c, 42, 32, 1, 3, '#4a4038');
    px(c, 56, 33, 2, 2, '#6e6154'); px(c, 56, 33, 1, 1, '#928275');
    px(c, 56, 35, 1, 3, '#4a4038');

    // ---- the hood ----
    for (let y = 4; y <= 26; y++){
      const hw = y < 13 ? 3 + (y - 4) * 0.85 : 10.7 + (y - 13) * 0.42;
      const w = Math.round(hw * 2), x = 50 - Math.round(w / 2);
      px(c, x, y, w, 1, '#5e131c');
      px(c, x, y, 3, 1, '#93222e');
      px(c, x + w - 3, y, 3, 1, '#330a10');
    }
    for (let y = 10; y < 24; y++){
      const w = 13 - Math.round(Math.abs(y - 16) * 0.6);
      px(c, 50 - Math.round(w / 2), y, w, 1, '#0a0509');
    }

    // ---- the bronze mask ----
    for (let y = 9; y < 24; y++){
      const w = 11 - Math.round((y - 9) * 0.42), x = 50 - Math.round(w / 2);
      px(c, x, y, w, 1, '#7d5c34');
      px(c, x, y, 1, 1, '#b98f4f');
      px(c, x + w - 1, y, 1, 1, '#4a3520');
    }
    px(c, 46, 13, 2, 4, '#07060a'); px(c, 52, 13, 2, 4, '#07060a');       // slit eyes
    px(c, 49, 11, 1, 10, '#a37c44');                                      // ridge
    for (let i = 0; i < 3; i++) px(c, 47 + i*2, 19, 1, 2, '#4a3520');     // vents
    px(c, 48, 22, 3, 2, '#644828');                                       // the point

    grain(c, 0.05);
    rimLight(c, 'rgba(255,140,90,0.16)');
    formShadow(c);
  }

  // The Gilded Inquisitor: that wide flanged helm above everything, a steel
  // gorget, a floor-length black robe with a gilt-edged scarlet band down the
  // front, and a tall thin staff with a conical head.
  function inquisitor(c){
    ground(c);

    // ---- the staff, clear of the helm's flare ----
    px(c, 78, 20, 2, 72, '#3e3e48');
    px(c, 78, 20, 1, 72, '#63636f');
    for (let y = 4; y < 20; y++){                                         // conical head
      const w = y < 12 ? 2 + (y - 4) * 0.62 : 7 - (y - 12) * 0.75;
      const ww = Math.max(2, Math.round(w));
      px(c, 79 - Math.round(ww / 2), y, ww, 1, '#5a5a66');
      px(c, 79 - Math.round(ww / 2), y, 1, 1, '#8f8f9c');
    }
    px(c, 76, 18, 6, 2, '#7a7a88');

    // ---- the robe: a straight column, barely flaring ----
    for (let y = 28; y <= 93; y++){
      const t = (y - 28) / 65, w = Math.round((11 + t * 7) * 2);
      const x = 50 - Math.round(w / 2);
      px(c, x, y, w, 1, '#17161c');
      px(c, x, y, 3, 1, '#2b2a33');
      px(c, x + w - 3, y, 3, 1, '#0a090d');
    }
    for (const [off, fy] of [[-13,44],[-7,36],[8,36],[14,48]])
      for (let y = fy; y <= 93; y++){
        const t = (y - 28) / 65;
        px(c, 50 + Math.round(off * (1 + t * 0.6)), y, 1, 1, '#0d0c11');
      }
    // the scarlet band, gilt-edged, running the length of the robe
    for (let y = 34; y <= 90; y++){
      const t = (y - 34) / 56, w = 7 + Math.round(t * 3);
      const x = 50 - Math.round(w / 2);
      px(c, x, y, w, 1, '#7a280f');
      px(c, x, y, 1, 1, '#a8471a');
      px(c, x + w - 1, y, 1, 1, '#4c1709');
      if (y % 7 === 0) px(c, x + 1, y, w - 2, 1, '#9c3d15');             // brocade
    }
    px(c, 44, 33, 13, 2, '#7a280f');
    for (let y = 34; y <= 90; y++){                                       // the gilt edges
      const t = (y - 34) / 56, w = 7 + Math.round(t * 3), x = 50 - Math.round(w / 2);
      if (y % 3) continue;
      px(c, x - 1, y, 1, 1, '#8a7233'); px(c, x + w, y, 1, 1, '#8a7233');
    }
    for (let i = 0; i < 4; i++) px(c, 47 + i, 90 + i, 2, 1, '#7a280f');   // pointed tail
    for (let i = 0; i < 4; i++) px(c, 53 - i, 90 + i, 2, 1, '#7a280f');

    // ---- arms: one ribbed sleeve down to a gauntlet, one raised to the staff ----
    for (let y = 30; y < 62; y++){                                        // near arm, hanging
      const t = (y - 30) / 32, w = 8 - Math.round(t * 2);
      px(c, 32 + Math.round(t * 3), y, w, 1, '#25242d');
      px(c, 32 + Math.round(t * 3), y, 1, 1, '#3f3e4a');
    }
    for (let i = 0; i < 7; i++) px(c, 32 + Math.round(i * 0.4), 32 + i*4, 8 - Math.round(i*0.3), 2, '#33323d');
    px(c, 34, 60, 7, 11, '#3a3944'); px(c, 34, 60, 7, 1, '#5a5966');      // gauntlet
    for (let i = 0; i < 3; i++) px(c, 34, 63 + i*3, 7, 1, '#191820');
    for (let y = 30; y < 44; y++){                                        // far arm, to the staff
      const t = (y - 30) / 14;
      px(c, 62 + Math.round(t * 11), y, 7 - Math.round(t * 2), 1, '#20202a');
      px(c, 62 + Math.round(t * 11), y, 1, 1, '#38373f');
    }
    px(c, 74, 42, 7, 8, '#3a3944'); px(c, 74, 42, 7, 1, '#5a5966');       // hand on the shaft
    for (let i = 0; i < 3; i++) px(c, 74, 44 + i*2, 7, 1, '#191820');

    // ---- the steel gorget over the shoulders ----
    for (let y = 24; y < 34; y++){
      const w = 30 - Math.round((y - 24) * 0.4), x = 50 - Math.round(w / 2);
      px(c, x, y, w, 1, '#3d3c47');
      px(c, x, y, 2, 1, '#5f5e6c');
      px(c, x + w - 2, y, 2, 1, '#1d1c24');
    }
    for (let i = 0; i < 3; i++) px(c, 36 + i*3, 26, 2, 5, '#565563');     // fluting
    px(c, 36, 33, 28, 1, '#14131a');

    // ---- the helm ----
    // An anvil, not a plank: the crown is broad and its corners sweep *up*,
    // the sides fall away in a concave curve, and the whole thing funnels into
    // a narrow throat. Painted column by column, since the profile is a
    // function of how far out from the centre you are, not of height.
    // the throat first, running the whole way down to the gorget — without it
    // the crown reads as a bar balanced on a post with daylight under it
    for (let y = 12; y < 30; y++){
      const w = 12 + Math.round(Math.max(0, y - 22) * 0.9), x = 50 - Math.round(w / 2);
      px(c, x, y, w, 1, '#3c3b46');
      px(c, x, y, 2, 1, '#5a5965');
      px(c, x + w - 2, y, 2, 1, '#22212a');
    }
    for (let dx = -16; dx <= 16; dx++){
      const a = Math.abs(dx), x = 50 + dx;
      const top = 9 - Math.round((a * a) / 64);          // corners rise
      const bot = 24 - Math.round(a * 0.86);             // sides fall away
      if (bot < top) continue;
      const edge = a > 13, lit = dx < -4;
      px(c, x, top, 1, bot - top + 1, edge ? '#6a6975' : (lit ? '#565560' : '#43424d'));
      px(c, x, top, 1, 2, '#82818d');                    // the crown's lit edge
      if (a > 7) px(c, x, bot - 1, 1, 2, '#26252d');
    }
    px(c, 41, 13, 18, 1, '#8a7233');                                      // the gilt line
    for (let y = 15; y < 22; y++){                                        // the dark of the face
      const w = 8 - Math.round(Math.abs(y - 18) * 0.7);
      px(c, 50 - Math.round(w / 2), y, w, 1, '#0a0a0e');
    }
    px(c, 50, 16, 1, 5, '#4a4954');
    px(c, 46, 22, 8, 1, '#2a2932');

    grain(c, 0.045);
    rimLight(c, 'rgba(255,170,110,0.13)');
    formShadow(c);
  }

  // The Rattling Skeleton: an arrow still through the skull, a red cloak gone
  // to rags, a round shield on one arm and a notched falchion in the other.
  function skeleton(c){
    ground(c);
    const BONE = '#cdc6b4', BMID = '#a49c8a', BDK = '#6b6455';

    // ---- the cloak, hung behind and torn to strips ----
    for (let y = 26; y < 88; y++){
      const t = (y - 26) / 62, w = 26 + Math.round(t * 16);
      px(c, 50 - Math.round(w / 2), y, w, 1, '#3a1016');
      px(c, 50 - Math.round(w / 2), y, 2, 1, '#5c1a22');
      px(c, 50 + Math.round(w / 2) - 2, y, 2, 1, '#20080c');
    }
    for (const off of [-16, -7, 6, 15])
      for (let y = 34; y < 88; y++) px(c, 50 + off, y, 2, 1, '#280a0f');
    tatter(c, 28, 87, 44, '#280a0f', 6);

    // ---- legs ----
    for (const dir of [-1, 1]){
      for (let y = 60; y < 88; y++){
        const t = (y - 60) / 28;
        const x = 50 + dir * (3 + Math.round(t * 5)) - (dir < 0 ? 4 : 0);
        const w = 5 - (t > 0.4 && t < 0.75 ? 1 : 0);                      // thin at the shin
        px(c, x, y, w, 1, dir < 0 ? BMID : BDK);
        px(c, x, y, 1, 1, dir < 0 ? BONE : BMID);
      }
      const fx = 50 + dir * 8 - (dir < 0 ? 4 : 0);
      px(c, fx - 1, 84, 7, 7, '#4a3226');                                 // strapped boots
      px(c, fx - 1, 84, 7, 1, '#6e4c39');
      px(c, fx - 1, 87, 7, 1, '#2c1c14');
      px(c, fx - 3, 90, 10, 3, '#3c281e');
    }
    // pelvis
    for (let y = 54; y < 62; y++){
      const w = 17 - (y - 54), x = 50 - Math.round(w / 2);
      px(c, x, y, w, 1, BMID); px(c, x, y, 1, 1, BONE);
    }
    px(c, 48, 56, 5, 5, '#2a2620');

    // ---- ribcage and spine ----
    px(c, 48, 30, 3, 26, BMID); px(c, 48, 30, 1, 26, BONE);               // spine
    for (let i = 0; i < 7; i++){
      const y = 32 + i*3, w = 22 - Math.abs(i - 2) * 2;
      const x = 50 - Math.round(w / 2);
      px(c, x, y, w, 2, i % 2 ? BMID : BONE);
      px(c, x, y + 1, w, 1, '#5d5749');
      px(c, x, y, 1, 2, '#2c2822'); px(c, x + w - 1, y, 1, 2, '#2c2822');
    }
    px(c, 40, 28, 20, 3, BONE); px(c, 40, 30, 20, 1, BMID);               // collarbones
    // the shoulder-rags the reference leaves clinging to the bone
    px(c, 36, 27, 10, 9, '#5c1a22'); px(c, 36, 27, 10, 1, '#7d2530');
    for (let i = 0; i < 5; i++) px(c, 36 + i*2, 36, 2, 2 + (i % 3), '#3a1016');
    for (let i = 0; i < 10; i++) px(c, 43 + i, 33 + i, 2, 1, '#4a3226');  // baldric

    // ---- arms ----
    for (let y = 30; y < 58; y++){                                        // shield arm
      const t = (y - 30) / 28;
      px(c, 36 - Math.round(t * 3), y, 4, 1, BDK);
      px(c, 36 - Math.round(t * 3), y, 1, 1, BMID);
    }
    for (let y = 30; y < 62; y++){                                        // sword arm
      const t = (y - 30) / 32;
      px(c, 61 + Math.round(t * 4), y, 4, 1, BMID);
      px(c, 61 + Math.round(t * 4), y, 1, 1, BONE);
    }
    px(c, 64, 60, 6, 6, BMID); px(c, 64, 60, 6, 1, BONE);                 // the sword hand

    // ---- the shield, tall and battered ----
    for (let y = 38; y < 82; y++){
      const t = (y - 38) / 44;
      const w = Math.round(Math.sin((t * 0.86 + 0.07) * Math.PI) * 20) + 4;
      const x = 26 - Math.round(w / 2) + 6;
      px(c, x, y, w, 1, '#3a3941');
      px(c, x, y, 2, 1, '#565560');
      px(c, x + w - 2, y, 2, 1, '#1d1c22');
      if (y % 9 === 0) px(c, x + 2, y, w - 4, 1, '#464550');
      // the reference's shield has been through a war — hack marks and rot
      if (y % 13 === 4) px(c, x + 3, y, Math.max(1, w - 9), 1, '#2e2d34');
    }
    px(c, 24, 56, 8, 3, '#605f6a');                                       // boss
    px(c, 28, 44, 2, 26, '#2c2b32');
    for (let i = 0; i < 6; i++) px(c, 22 + i, 66 + i, 2, 1, '#1e1d23');   // a long split

    // ---- the falchion ----
    px(c, 66, 56, 3, 8, '#4a3226'); px(c, 64, 54, 8, 2, '#6d5c38');
    for (let i = 0; i < 22; i++){
      const bx = 68 + Math.round(i * 0.5), w = i < 14 ? 3 : 4;
      px(c, bx, 64 + i, w, 1, '#7d7b84');
      px(c, bx, 64 + i, 1, 1, '#b0aeb8');
    }

    // ---- the skull ----
    for (let y = 8; y < 24; y++){
      const w = y < 18 ? 18 - Math.round(Math.abs(y - 13) * 0.5) : 14 - (y - 18);
      const x = 50 - Math.round(w / 2);
      px(c, x, y, w, 1, BONE);
      px(c, x, y, 2, 1, '#e8e2d2');
      px(c, x + w - 2, y, 2, 1, BMID);
    }
    px(c, 43, 13, 5, 5, '#100e0c'); px(c, 52, 13, 5, 5, '#100e0c');       // sockets
    px(c, 44, 13, 3, 1, '#3a352c'); px(c, 53, 13, 3, 1, '#3a352c');
    px(c, 48, 18, 4, 3, '#100e0c');                                       // nasal cavity
    for (let i = 0; i < 5; i++) px(c, 44 + i*2, 21, 1, 3, '#4a443a');     // teeth
    px(c, 43, 20, 14, 1, '#8d8676');
    for (let i = 0; i < 6; i++) px(c, 41 - (i % 2), 10 + i*2, 2, 3, '#2a2620'); // lank hair
    for (let i = 0; i < 6; i++) px(c, 58 + (i % 2), 11 + i*2, 2, 3, '#2a2620');
    // the arrow, still through it — entering at one temple and out the far
    // side, low enough that a good span of shaft shows clear of the bone
    for (let ax = 28; ax <= 72; ax++){
      const ay = 19 - Math.round((ax - 28) * 0.2);
      if (ax > 41 && ax < 59) continue;                                   // buried in the skull
      px(c, ax, ay, 1, 2, '#5a4530');
      px(c, ax, ay, 1, 1, '#836a48');
    }
    for (let i = 0; i < 5; i++){                                          // fletching
      const ax = 28 + i, ay = 19 - Math.round(i * 0.2);
      px(c, ax, ay - 2 - Math.round(i * 0.4), 1, 3, '#7d3038');
      px(c, ax, ay + 2, 1, 2 + Math.round(i * 0.4), '#7d3038');
    }
    for (let i = 0; i < 4; i++)                                           // the head, far side
      px(c, 69 + i, 11 - Math.round(i * 0.2) - (i > 1 ? 1 : 0), 1, 3 - (i > 1 ? 1 : 0), '#a8a5b2');

    grain(c, 0.05);
    rimLight(c, 'rgba(200,220,255,0.10)');
    formShadow(c);
  }
  const PAINTERS = {
    hero_knight: knight, hero_mage: mage, hero_warden: warden,
    npc_alchemist: alchemist, hero_necromancer: necromancer, hero_rogue: rogue,
    // enemies — each of these sprites is worn by several foes, so a figure here
    // dresses the common kind, its elite and its guardian all at once
    en_cultist: cultist, en_inquisitor: inquisitor, en_skeleton: skeleton,
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
