const fs = require("fs")
const { Grid, toKey, cloneObj } = require("./graph")

console.time()
const data = fs
  .readFileSync("data.txt", "utf8")
  .split("\r\n")
  .map((row) => row.split(""))

const grid = new Grid()
const neighbors = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
]

const edges = []
const height = data.length
const width = data[0].length
for (let i = 1; i < height - 1; i++) {
  for (let j = 1; j < width - 1; j++) {
    parseCell(i, j)
  }
}
edges.forEach(([A, B]) => grid.addEdge(A, B))

function parseCell(i, j) {
  const type = data[i][j]
  if (type === "#") return
  let group
  if (/[A-Z]/.test(type)) group = "door"
  if (/[a-z]/.test(type)) group = "key"
  grid.addNode([i, j], { type, group })
  neighbors.forEach(([y, x]) => {
    if (data[i + y][j + x] !== "#")
      edges.push([toKey([i, j]), toKey([i + y, j + x])])
  })
}

// Compress paths between distinct nodes
const allDistinct = grid.getDistinctCells()
const allKeys = allDistinct.filter((e) => e.group === "key")
const allDoors = allDistinct.filter((e) => e.group === "door")
const start = grid.getCellByType("@")
const notDoors = [...allKeys, start]
const filter = allDoors.map((e) => e.key)
const compressed = grid
  .compress()
  .filter((e) => !(filter.includes(e[0]) || filter.includes(e[1])))
  .filter((e) => e[0] !== e[1] && e[1] !== grid.getCellByType("@").key)
  .map((e) => {
    e[2].keyA = e[0]
    e[2].keyB = e[1]
    e[2].typeA = notDoors.find(({ key }) => e[0] === key).type
    e[2].typeB = notDoors.find(({ key }) => e[1] === key).type
    return e[2]
  })
console.timeLog()

function getQuadrant(key) {
  const [row, col] = key.split(",").map(Number)
  if (row < grid.height / 2 && col > grid.width / 2) return 0
  if (row > grid.height / 2 && col > grid.width / 2) return 1
  if (row > grid.height / 2 && col < grid.width / 2) return 2
  if (row < grid.height / 2 && col < grid.width / 2) return 3
}

const finalResults = []
for (let q = 0; q < 4; q++) {
  console.info("Robot " + q)
  const quadrantKeys = allKeys.filter(({ key }) => getQuadrant(key) === q)
  const quadrantDoors = allDoors.filter(({ key }) => getQuadrant(key) === q)
  const compressedQuadrant = cloneObj(
    compressed
      .filter(
        ({ keyA, keyB }) =>
          (getQuadrant(keyA) === q || keyA === start.key) &&
          getQuadrant(keyB) === q
      )
      .map((link) => ({
        ...link,
        doors: link.doors.filter((type) =>
          quadrantDoors
            .filter((door) =>
              quadrantKeys.some((key) => key.key === door.key.toLowerCase())
            )
            .some((door) => door.type === type)
        ),
      }))
  )

  const finalists = []
  let que = [{ ...start, keyChain: [], depth: 0 }]
  const visited = new Map()

  for (let i = 0; i < quadrantKeys.length; i++) {
    const newQue = []
    for (const node of que) {
      const paths = compressedQuadrant.filter(
        ({ keyA, typeB, doors }) =>
          keyA === node.key &&
          !node.keyChain.includes(typeB) &&
          !doors.some((door) => !node.keyChain.includes(door.toLowerCase()))
      )
      const sources = paths.map(({ keyB: key, typeB, depth }) => ({
        key,
        keyChain: [...node.keyChain, typeB],
        depth: depth + node.depth,
      }))
      sources
        .sort((a, b) => a.depth - b.depth)
        .forEach((source) => {
          const list = [...source.keyChain]
          const last = list.pop()
          const hash = list.sort().join("") + last
          const visitedDepth = visited.get(hash)
          if (!visitedDepth || visitedDepth > source.depth) {
            visited.set(hash, source.depth)
            newQue.push(source)
          }
          if (source.keyChain.length === quadrantKeys.length) {
            finalists.push(source)
          }
        })
    }
    que = newQue
    console.info(i, que.length)
  }

  const result = finalists.sort((a, b) => a.depth - b.depth)[0]
  console.info(result)
  finalResults.push(result)
  console.info()
}
console.info("Total steps:")
console.info(
  finalResults.map((e) => e.depth).reduce((acc, cur) => acc + cur) - 4 * 2
)
console.timeEnd()
