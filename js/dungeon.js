// ---------- Procedural dungeon generation (rooms + corridors) ----------
// Reworked to read like a proper crawl map: a guaranteed central ritual sanctum,
// a mix of great halls / chambers / cells, short nearest-neighbour corridors with
// a few loops, doors at the room mouths, and walls densely lined with torches and
// biome furniture. Nothing decorative ever blocks a route.
const TILE = { WALL:0, FLOOR:1, DOOR:2, HAZARD:3 };

function makeDungeon(depth, opts){
  opts = opts || {};
  const isFinal = !!opts.finalFloor;
  const w = U.clamp(34 + depth * 3, 36, 54);
  const h = U.clamp(24 + depth * 2, 26, 34);

  const tiles = new Array(w * h).fill(TILE.WALL);
  const idx = (x, y) => y * w + x;
  const inb = (x, y) => x >= 0 && y >= 0 && x < w && y < h;

  const rooms = [];
  const mk = (x, y, rw, rh, kind) => ({ x, y, w:rw, h:rh, cx:Math.floor(x+rw/2), cy:Math.floor(y+rh/2), kind });
  const carveRoom = (r) => { for (let y=r.y; y<r.y+r.h; y++) for (let x=r.x; x<r.x+r.w; x++) tiles[idx(x,y)] = TILE.FLOOR; };
  // reject placements that touch an existing room (2-tile mortar between them)
  const overlaps = (r) => rooms.some(o =>
    r.x-2 <= o.x+o.w && r.x+r.w+2 >= o.x && r.y-2 <= o.y+o.h && r.y+r.h+2 >= o.y);

  // --- 1) the ritual sanctum: a large chamber near the middle, always present ---
  const fw = U.randInt(8, 10), fh = U.randInt(7, 9);
  const fx = U.clamp(Math.floor(w/2 - fw/2) + U.randInt(-2, 2), 2, w - fw - 2);
  const fy = U.clamp(Math.floor(h/2 - fh/2) + U.randInt(-2, 2), 2, h - fh - 2);
  const feature = mk(fx, fy, fw, fh, 'sanctum');
  rooms.push(feature); carveRoom(feature);
  const FEATURE = 0;

  // --- 2) the rest: great halls, ordinary chambers, and cramped cells ---
  const roomTarget = U.clamp(10 + depth * 2, 12, 18);
  let tries = 0;
  while (rooms.length < roomTarget && tries < 700){
    tries++;
    const roll = U.rand(0, 1);
    const kind = roll < 0.16 ? 'hall' : roll < 0.60 ? 'chamber' : 'cell';
    const [rw, rh] = kind === 'hall'    ? [U.randInt(8, 11), U.randInt(6, 8)]
                   : kind === 'chamber' ? [U.randInt(5, 7),  U.randInt(4, 6)]
                                        : [U.randInt(3, 4),  U.randInt(3, 4)];
    const rx = U.randInt(1, w - rw - 2), ry = U.randInt(1, h - rh - 2);
    const room = mk(rx, ry, rw, rh, kind);
    if (overlaps(room)) continue;
    rooms.push(room); carveRoom(room);
  }

  // --- connect rooms: nearest-neighbour tree, then a few loops ---
  const carveH = (x1, x2, y) => { for (let x = Math.min(x1,x2); x <= Math.max(x1,x2); x++) if (tiles[idx(x,y)]===TILE.WALL) tiles[idx(x,y)] = TILE.FLOOR; };
  const carveV = (y1, y2, x) => { for (let y = Math.min(y1,y2); y <= Math.max(y1,y2); y++) if (tiles[idx(x,y)]===TILE.WALL) tiles[idx(x,y)] = TILE.FLOOR; };
  const connect = (a, b) => {
    if (U.chance(0.5)){ carveH(a.cx, b.cx, a.cy); carveV(a.cy, b.cy, b.cx); }
    else { carveV(a.cy, b.cy, a.cx); carveH(a.cx, b.cx, b.cy); }
  };
  const dist = (a, b) => Math.abs(a.cx-b.cx) + Math.abs(a.cy-b.cy);
  const inTree = new Set([0]);
  while (inTree.size < rooms.length){
    let best = null;
    for (const i of inTree) for (let j = 0; j < rooms.length; j++){
      if (inTree.has(j)) continue;
      const dd = dist(rooms[i], rooms[j]);
      if (!best || dd < best.d) best = { i, j, d:dd };
    }
    if (!best) break;
    connect(rooms[best.i], rooms[best.j]); inTree.add(best.j);
  }
  const loops = Math.floor(rooms.length * 0.22);
  for (let k = 0; k < loops; k++){
    const a = U.randInt(0, rooms.length-1), b = U.randInt(0, rooms.length-1);
    if (a !== b) connect(rooms[a], rooms[b]);
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

  // --- start & stairs: two rooms far apart, with the sanctum landmark between ---
  const farthestFrom = (ref, exclude) => {
    let best = null;
    for (let i = 0; i < rooms.length; i++){ if (exclude.has(i)) continue;
      const dd = dist(rooms[i], ref); if (!best || dd > best.d) best = { i, d:dd }; }
    return best ? best.i : 0;
  };
  const startIdx = farthestFrom(feature, new Set([FEATURE]));
  const stairIdx = farthestFrom(rooms[startIdx], new Set([FEATURE, startIdx]));
  const first = rooms[startIdx], last = rooms[stairIdx];
  d.playerStart = { x:first.cx, y:first.cy };

  // --- doors: at the narrow mouths where a corridor meets a room ---
  const roomTiles = new Set();
  for (const r of rooms) for (let y=r.y; y<r.y+r.h; y++) for (let x=r.x; x<r.x+r.w; x++) roomTiles.add(x+','+y);
  const isWall  = (x, y) => !inb(x,y) || tiles[idx(x,y)] === TILE.WALL;
  const isFloor = (x, y) => inb(x,y) && tiles[idx(x,y)] !== TILE.WALL;
  const doorCells = [];
  for (let y = 1; y < h-1; y++) for (let x = 1; x < w-1; x++){
    if (tiles[idx(x,y)] !== TILE.FLOOR) continue;
    if (roomTiles.has(x+','+y)) continue;                       // a corridor tile only
    const vert = isWall(x-1,y) && isWall(x+1,y) && isFloor(x,y-1) && isFloor(x,y+1);
    const horz = isWall(x,y-1) && isWall(x,y+1) && isFloor(x-1,y) && isFloor(x+1,y);
    if (!vert && !horz) continue;                               // a one-wide pinch
    const mouth = roomTiles.has(x+','+(y-1)) || roomTiles.has(x+','+(y+1))
               || roomTiles.has((x-1)+','+y) || roomTiles.has((x+1)+','+y);
    if (mouth) doorCells.push([x, y]);
  }
  U.shuffle(doorCells);
  const doorPlaced = new Set();
  const maxDoors = Math.min(doorCells.length, 6 + depth);
  for (const [x, y] of doorCells){
    if (doorPlaced.size >= maxDoors) break;
    let crowded = false;
    for (let dy=-1; dy<=1; dy++) for (let dx=-1; dx<=1; dx++) if (doorPlaced.has((x+dx)+','+(y+dy))) crowded = true;
    if (crowded) continue;
    tiles[idx(x,y)] = TILE.DOOR; doorPlaced.add(x+','+y);
  }

  // --- guardian bars the stair (non-final); boss holds the last room (final) ---
  if (!isFinal){
    d.entities.push({ type:'stairs', x:last.cx, y:last.cy });
    const gid = Data.BIOME_GUARDIANS[opts.biome] || 'morr';
    let placed = false;
    for (const [ox,oy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[-1,1],[1,-1]]){
      const gx = last.cx+ox, gy = last.cy+oy;
      if (d.tileAt(gx,gy) === TILE.FLOOR && !d.entityAt(gx,gy) && !(gx===first.cx&&gy===first.cy)){
        d.entities.push({ type:'guardian', enemyId:gid, x:gx, y:gy }); placed = true; break;
      }
    }
    if (!placed) d.entities.push({ type:'guardian', enemyId:gid, x:last.cx, y:Math.max(1,last.cy-1) });
  } else {
    d.entities.push({ type:'enemy', enemyId:'boss', x:last.cx, y:last.cy, boss:true });
  }

  // helper: a random free floor tile inside a room, avoiding occupied/reserved
  const occupied = (x, y) => (x===first.cx && y===first.cy) || d.entityAt(x, y);
  const randInRoom = (room) => {
    for (let t = 0; t < 24; t++){
      const x = U.randInt(room.x, room.x + room.w - 1);
      const y = U.randInt(room.y, room.y + room.h - 1);
      if (d.tileAt(x, y) === TILE.FLOOR && !occupied(x, y)) return { x, y };
    }
    return null;
  };

  // --- the sanctum's altar, and the prize that waits beside it ---
  d.entities.push({ type:'prop', sprite:'obj_altar', x:feature.cx, y:feature.cy, blocking:false, ritual:true });
  for (const [ox,oy] of [[0,2],[2,0],[0,-2],[-2,0],[1,1],[-1,-1]]){
    const cx = feature.cx+ox, cy = feature.cy+oy;
    if (d.tileAt(cx,cy) === TILE.FLOOR && !d.entityAt(cx,cy) && !(cx===first.cx&&cy===first.cy)){
      d.entities.push({ type:'chest', x:cx, y:cy, tier:U.clamp(Math.ceil(depth/2)+1, 1, 3) }); break;
    }
  }

  // --- enemies: biome tags tilt the mix; the sanctum and your start stay clear ---
  const tagW = (opts.biome && Data.BIOMES[opts.biome] && Data.BIOMES[opts.biome].enemyTags) || {};
  const pool = Data.enemyPool(depth).map(id => {
    let wt = 1;
    for (const t of (Data.ENEMIES[id].tags || [])) if (tagW[t] != null) wt = Math.max(wt, 0) * tagW[t];
    return { id, w:wt };
  });
  for (let ri = 0; ri < rooms.length; ri++){
    if (ri === FEATURE || ri === startIdx) continue;
    if (isFinal && ri === stairIdx) continue;                 // the boss stands alone
    const room = rooms[ri];
    // cells are cramped side-chambers — only some hold a lurker, so the floor
    // doesn't turn into a monster in every closet
    let count = room.kind === 'cell' ? (U.chance(0.5) ? 1 : 0)
              : U.randInt(1, depth >= 3 ? 2 : 1) + (room.kind === 'hall' ? 1 : 0);
    for (let k = 0; k < count; k++){
      const p = randInRoom(room); if (!p) continue;
      d.entities.push({ type:'enemy', enemyId:U.weighted(pool).id, x:p.x, y:p.y });
    }
  }

  // --- events (unique per floor; pool/count may be alignment/biome-filtered) ---
  const evtPool = (opts.eventKeys && opts.eventKeys.length) ? opts.eventKeys.slice() : Object.keys(Data.EVENTS);
  const eventKeys = opts.eventsOrdered ? evtPool : U.shuffle(evtPool);
  const eventCount = opts.eventCount != null ? opts.eventCount : U.clamp(1 + Math.floor(depth/2), 1, 3);
  const eventRooms = U.shuffle(rooms.filter((r,i) => i !== FEATURE && i !== startIdx && !(isFinal && i === stairIdx)));
  for (let i = 0; i < eventCount && i < eventKeys.length && i < eventRooms.length; i++){
    const p = randInRoom(eventRooms[i]); if (!p) continue;
    d.entities.push({ type:'event', eventId:eventKeys[i], x:p.x, y:p.y });
  }

  // --- chests (larger floors hide more, on top of the sanctum's prize) ---
  const chestCount = U.randInt(2, 3);
  for (let i = 0; i < chestCount; i++){
    const p = randInRoom(U.choice(rooms));
    if (p) d.entities.push({ type:'chest', x:p.x, y:p.y, tier:U.clamp(Math.ceil(depth/2), 1, 3) });
  }

  // --- hazards: biome-scarred tiles in small clusters (visible, walkable, dangerous) ---
  const hazardClusters = U.clamp(3 + depth, 4, 9);
  for (let c = 0; c < hazardClusters; c++){
    for (let t = 0; t < 40; t++){
      const x = U.randInt(1, w-2), y = U.randInt(1, h-2);
      if (tiles[idx(x,y)] !== TILE.FLOOR) continue;
      if (Math.abs(x - first.cx) + Math.abs(y - first.cy) < 3) continue;
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

  // --- dressing: torches spaced along the walls, furniture between them, and
  // braziers ringing the arenas. None of it blocks movement (see isBlockingEntity). ---
  const freeForDressing = (x, y) =>
    d.tileAt(x, y) === TILE.FLOOR && !d.entityAt(x, y) && !(x === first.cx && y === first.cy);
  // the perimeter ring in walk order (clockwise), so torch spacing comes out even
  const perimeter = (room) => {
    const out = [];
    for (let x = room.x;              x < room.x + room.w; x++) out.push({ x, y: room.y });
    for (let y = room.y + 1;          y < room.y + room.h; y++) out.push({ x: room.x + room.w - 1, y });
    for (let x = room.x + room.w - 2; x >= room.x;         x--) out.push({ x, y: room.y + room.h - 1 });
    for (let y = room.y + room.h - 2; y > room.y;          y--) out.push({ x: room.x, y });
    return out;
  };
  // four mid-wall spots, for ringing a hall/arena symmetrically
  const ringLandmark = (room, sprite) => {
    const spots = [ {x:room.cx, y:room.y}, {x:room.cx, y:room.y+room.h-1}, {x:room.x, y:room.cy}, {x:room.x+room.w-1, y:room.cy} ];
    for (const s of spots) if (freeForDressing(s.x, s.y)) d.entities.push({ type:'prop', sprite, x:s.x, y:s.y, blocking:false });
  };

  const propList = (Data.BIOME_PROPS && Data.BIOME_PROPS[opts.biome]) || Data.BIOME_PROPS.catacombs;
  for (let ri = 0; ri < rooms.length; ri++){
    const room = rooms[ri];
    const ring = perimeter(room);
    // torches every ~4 tiles around the wall
    const spacing = room.kind === 'cell' ? 3 : 4;
    for (let k = 0; k < ring.length; k += spacing){
      const t = ring[k];
      if (freeForDressing(t.x, t.y)) d.entities.push({ type:'torch', x:t.x, y:t.y, blocking:false });
    }
    // furniture on some of the remaining wall tiles
    const want = (room.kind === 'hall' || room.kind === 'sanctum') ? U.randInt(3, 5)
               : room.kind === 'cell' ? U.randInt(0, 1)
                                      : U.randInt(1, 3);
    let placed = 0;
    for (const t of U.shuffle(ring.slice())){
      if (placed >= want) break;
      if (!freeForDressing(t.x, t.y)) continue;
      d.entities.push({ type:'prop', sprite:U.choice(propList), x:t.x, y:t.y, blocking:false });
      placed++;
    }
  }
  // the sanctum and the stair-arena get a ring of braziers for the set-piece look
  ringLandmark(feature, 'obj_brazier');
  ringLandmark(last, 'obj_brazier');

  return d;
}
