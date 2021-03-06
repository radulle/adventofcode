const fs = require("fs");

global.console.infoTime = (logMe) => {
  console.time();
  console.info(typeof logMe === "function" ? logMe() : logMe);
  console.timeEnd();
};

try {
  const data = fs.readFileSync("data.txt", "utf8").split("\n").map(Number);
  console.infoTime(() => useMap(data, 2020));
  console.infoTime(() => useArr(data, 2020));
} catch (err) {
  console.error(err);
}

function useMap(data, num) {
  const map = new Map();
  for (const x of data) {
    for (const y of data) {
      for (const z of data) {
        map.set(x + y + z, [x, y, z, x * y * z]);
      }
    }
  }
  return map.get(num);
}

function useArr(data, num) {
  const sums = data.map((x) => data.map((y) => [x, y, x + y]));
  const sums2 = data.map((z) =>
    sums.flat().map(([x, y, xy]) => [x, y, z, xy + z])
  );
  const flat = sums2.flat();
  const filter = flat
    .filter((e) => e[3] === num)
    .map((e) => [...e, e[0] * e[1] * e[2]]);
  return filter;
}
