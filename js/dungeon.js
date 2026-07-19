// ---------- Procedural dungeon generation (rooms + corridors) ----------
const TILE = { WALL:0, FLOOR:1, DOOR:2, HAZARD:3 };

function makeDungeon(depth, opts){
  opts = opts || {};
  const isFinal = !!opts.finalFloor;
  const w = U.clamp(34 + depth * 3, 36, 54);
  const h = U.clamp(24 + depth * 2, 26, 34);

  const tiles = new Array(w * h).fill(TILE.WALL);
  const idx = (x, y) => y * w + x;
  const inb = (x, y) => x >= 0 && y >= 0 && x < w && y < h;

  // --- place non-overlapping rooms ---
  const rooms = [];
  const roomTarget = U.clamp(9 + depth * 2, 10, 16);
  let tries = 0;
  while (rooms.length < roomTarget && tries < 400){
    tries++;
    const rw = U.randInt(5, 9), rh = U.randInt(4, 7);
    const rx = U.randInt(1, w - rw - 2), ry = U.randInt(1, h - rh - 2);
    const room = { x:rx, y:ry, w:rw, h:rh, cx:Math.floor(rx+rw/2), cy:Math.floor(ry+rh/2) };
    // reject if overlaps existing (with 1-tile margin)
    let ok = true;
    for (const o of rooms){
      if (rx - 1 <= o.x + o.w && rx + rw + 1 >= o.x && ry - 1 <= o.y + o.h && ry + rh + 1 >= o.y){ ok = false; break; }
    }
    if (!ok) continue;
    rooms.push(room);
    for (let y = ry; y < ry + rh; y++)
      for (let x = rx; x < rx + rw; x++)
        tiles[idx(x, y)] = TILE.FLOOR;
  }

  // --- connect rooms with L corridors (in placement order) ---
  const carveH = (x1, x2, y) => { for (let x = Math.min(x1,x2); x <= Math.max(x1,x2); x++) if (tiles[idx(x,y)]===TILE.WALL) tiles[idx(x,y)] = TILE.FLOOR; };
  const carveV = (y1, y2, x) => { for (let y = Math.min(y1,y2); y <= Math.max(y1,y2); y++) if (tiles[idx(x,y)]===TILE.WALL) tiles[idx(x,y)] = TILE.FLOOR; };
  for (let i = 1; i < rooms.length; i++){
    const a = rooms[i-1], b = rooms[i];
    if (U.chance(0.5)){ carveH(a.cx, b.cx, a.cy); carveV(a.cy, b.cy, b.cx); }
    else { carveV(a.cy, b.cy, a.cx); carveH(a.cx, b.cx, b.cy); }
  }

  const d = {
    depth, w, h, tiles, rooms, isFinal,
    visible: new Array(w * h).fill(false),
    explored: new Array(w * h).fill(false),
    entities: [],
    idx, inb,
    tileAt(x, y){ return inb(x, y) ? tiles[idx(x, y)] : TILE.WALL; },
    isWalkable(x, y){ return this.tileAt(x, y) !== TILE.WALL; },
    entityAt(x, y){ return this.entities.find(e => e.x === x && e.y === y && !e.dead); },
    removeEntity(e){ const i = this.entities.indexOf(e); if (i >= 0) this.entities.splice(i, 1); },
  };

  // --- player start + stairs ---
  const first = rooms[0], last = rooms[rooms.length - 1];
  d.playerStart = { x:first.cx, y:first.cy };
  if (!isFinal){
    d.entities.push({ type:'stairs', x:last.cx, y:last.cy });
    // a Legendary Guardian bars the stair — slay it or stay
    const gid = Data.BIOME_GUARDIANS[opts.biome] || 'morr';
    let placed = false;
    for (const [ox,oy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[-1,1],[1,-1]]){
      const gx = last.cx+ox, gy = last.cy+oy;
      if (d.tileAt(gx,gy) === TILE.FLOOR && !d.entityAt(gx,gy) && !(gx===first.cx&&gy===first.cy)){
        d.entities.push({ type:'guardian', enemyId:gid, x:gx, y:gy });
        placed = true; break;
      }
    }
    if (!placed) d.entities.push({ type:'guardian', enemyId:gid, x:last.cx, y:Math.max(1,last.cy-1) });
  }

  // helper: random free floor tile inside a room, avoiding occupied/reserved
  const occupied = (x, y) => (x===first.cx && y===first.cy) || d.entityAt(x, y);
  const randInRoom = (room) => {
    for (let t = 0; t < 20; t++){
      const x = U.randInt(room.x, room.x + room.w - 1);
      const y = U.randInt(room.y, room.y + room.h - 1);
      if (d.tileAt(x, y) === TILE.FLOOR && !occupied(x, y)) return { x, y };
    }
    return null;
  };

  // --- BOSS on final floor ---
  if (isFinal){
    d.entities.push({ type:'enemy', enemyId:'boss', x:last.cx, y:last.cy, boss:true });
  }

  // --- enemies (biome tags tilt the mix: undead crowd the Whitemarrow, spirits the Drowned Halls...) ---
  const tagW = (opts.biome && Data.BIOMES[opts.biome] && Data.BIOMES[opts.biome].enemyTags) || {};
  const pool = Data.enemyPool(depth).map(id => {
    let w = 1;
    for (const t of (Data.ENEMIES[id].tags || [])) if (tagW[t] != null) w = Math.max(w, 0) * tagW[t];
    return { id, w };
  });
  const midRooms = rooms.slice(1, isFinal ? rooms.length - 1 : rooms.length);
  for (const room of midRooms){
    const count = U.randInt(1, depth >= 3 ? 2 : 1);
    for (let k = 0; k < count; k++){
      const p = randInRoom(room);
      if (!p) continue;
      d.entities.push({ type:'enemy', enemyId:U.weighted(pool).id, x:p.x, y:p.y });
    }
  }

  // --- events (unique per floor; pool/count may be alignment/biome-filtered) ---
  const evtPool = (opts.eventKeys && opts.eventKeys.length) ? opts.eventKeys.slice() : Object.keys(Data.EVENTS);
  const eventKeys = opts.eventsOrdered ? evtPool : U.shuffle(evtPool);
  const eventCount = opts.eventCount != null ? opts.eventCount : U.clamp(1 + Math.floor(depth/2), 1, 3);
  const eventRooms = U.shuffle(rooms.slice(1, rooms.length - (isFinal?0:1)));
  for (let i = 0; i < eventCount && i < eventKeys.length && i < eventRooms.length; i++){
    const p = randInRoom(eventRooms[i]);
    if (!p) continue;
    d.entities.push({ type:'event', eventId:eventKeys[i], x:p.x, y:p.y });
  }

  // --- chests (larger floors hide more) ---
  const chestCount = U.randInt(2, 3);
  for (let i = 0; i < chestCount; i++){
    const room = U.choice(rooms);
    const p = randInRoom(room);
    if (p) d.entities.push({ type:'chest', x:p.x, y:p.y, tier:U.clamp(Math.ceil(depth/2),1,3) });
  }

  // --- hazards: biome-scarred tiles in small clusters (visible, walkable, dangerous) ---
  // placed after entities so nothing spawns standing in one
  const hazardClusters = U.clamp(3 + depth, 4, 9);
  for (let c = 0; c < hazardClusters; c++){
    for (let t = 0; t < 40; t++){
      const x = U.randInt(1, w-2), y = U.randInt(1, h-2);
      if (tiles[idx(x,y)] !== TILE.FLOOR) continue;
      if (Math.abs(x - first.cx) + Math.abs(y - first.cy) < 3) continue;   // keep the start clear
      if (d.entityAt(x,y)) continue;
      let cx = x, cy = y;
      const size = U.randInt(2, 4);
      for (let s = 0; s < size; s++){
        if (tiles[idx(cx,cy)] === TILE.FLOOR && !d.entityAt(cx,cy) && !(cx === first.cx && cy === first.cy))
          tiles[idx(cx,cy)] = TILE.HAZARD;
        const dir = U.choice([[1,0],[-1,0],[0,1],[0,-1]]);
        cx = U.clamp(cx + dir[0], 1, w-2); cy = U.clamp(cy + dir[1], 1, h-2);
      }
      break;
    }
  }

  // --- torches (decorative, near room corners) ---
  for (const room of rooms){
    if (U.chance(0.6)){
      const cx = U.chance(0.5) ? room.x : room.x + room.w - 1;
      const cy = U.chance(0.5) ? room.y : room.y + room.h - 1;
      if (d.tileAt(cx, cy) === TILE.FLOOR && !d.entityAt(cx, cy) && !(cx===first.cx&&cy===first.cy))
        d.entities.push({ type:'torch', x:cx, y:cy, blocking:false });
    }
  }

  return d;
}
