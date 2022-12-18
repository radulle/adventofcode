// #grid3d #gridBFS3d

const { input, consoleTime, StackQue } = require("lib");

consoleTime(() => solve());

function solve() {
  const data = input()
    .split("\n")
    .map((e) => e.split(",").map((e) => +e + 2));

  let size = -Infinity;
  for (const [x, y, z] of data) {
    if (x > size) size = x;
    if (y > size) size = y;
    if (z > size) size = z;
  }
  size += 3;

  const lava = new Array(size).fill().map(() =>
    Array(size)
      .fill()
      .map(() => Array(size).fill(" "))
  );
  data.forEach(([x, y, z]) => (lava[x][y][z] = "#"));

  console.info(gridArea(lava));

  const water = gridBFS(lava, 0, 0, 0);
  console.info(gridArea(water));
}

function gridArea(grid) {
  const size = grid.length;
  const dx = [-1, 1, 0, 0, 0, 0];
  const dy = [0, 0, 1, -1, 0, 0];
  const dz = [0, 0, 0, 0, 1, -1];
  const neighbors = dx.length;
  let area = 0;

  for (let x = 1; x < size - 1; x++) {
    for (let y = 1; y < size - 1; y++) {
      for (let z = 1; z < size - 1; z++) {
        if (grid[x][y][z] !== "#") continue;
        for (let i = 0; i < neighbors; i++) {
          if (grid[x + dx[i]][y + dy[i]][z + dz[i]] === "#") continue;
          area++;
        }
      }
    }
  }

  return area;
}

function gridBFS(grid, sx, sy, sz, f) {
  const dx = [-1, 1, 0, 0, 0, 0];
  const dy = [0, 0, 1, -1, 0, 0];
  const dz = [0, 0, 0, 0, 1, -1];
  const neighbors = dx.length;

  const X = grid.length;
  const Y = grid[0].length;
  const Z = grid[0][0].length;
  const qx = new StackQue();
  const qy = new StackQue();
  const qz = new StackQue();
  const visited = new Array(X)
    .fill()
    .map(() => new Array(Y).fill().map(() => new Array(Z).fill()));
  const result = new Array(X)
    .fill()
    .map(() => new Array(Y).fill().map(() => new Array(Z).fill(" ")));

  qx.enqueue(sx);
  qy.enqueue(sy);
  qz.enqueue(sz);
  visited[sx][sy][sz] = true;
  let dist = 0;
  let currentLayerCount = 1;
  let nextLayerCount = 0;

  function exploreNeighbors(x, y, z) {
    for (let i = 0; i < neighbors; i++) {
      const xx = x + dx[i];
      const yy = y + dy[i];
      const zz = z + dz[i];
      if (xx < 0 || yy < 0 || zz < 0 || xx >= X || yy >= Y || zz >= Z) continue;
      if (visited[xx][yy][zz]) continue;
      if (grid[xx][yy][zz] === "#") continue;
      qx.enqueue(xx);
      qy.enqueue(yy);
      qz.enqueue(zz);
      visited[xx][yy][zz] = true;
      nextLayerCount++;
    }
  }

  while (qx.size > 0) {
    const x = qx.dequeue();
    const y = qy.dequeue();
    const z = qz.dequeue();
    const f = grid[x][y][z];
    if (f !== "#") result[x][y][z] = "#"; // dist
    exploreNeighbors(x, y, z);
    currentLayerCount--;
    if (currentLayerCount === 0) {
      currentLayerCount = nextLayerCount;
      nextLayerCount = 0;
      dist++;
    }
  }
  return result;
}
