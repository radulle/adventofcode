console.time()
const fs = require("fs")
const intCode = require("../intCode")

function getData(file) {
  return fs.readFileSync(file, "utf8").trim()
}

const program = getData("data.txt", "utf8").split(",").map(Number)

const network = new Array(50).fill().map((_, id) => {
  const nic = intCode([...program], [], false)
  return { inputs: [, id], outputs: [], nic }
})

let Y

main: while (true) {
  for (const { nic, inputs, outputs } of network) {
    const { value } = nic.next(inputs[0] ?? -1)
    if (value !== undefined) {
      outputs.push(value)
    }
    if (value === undefined && inputs.length) {
      inputs.shift()
    }
    if (outputs.length === 3) {
      const [dest, x, y] = outputs
      if (dest === 255) {
        Y = y
        break main
      } else {
        network[dest].inputs.push(x, y)
      }
      outputs.length = 0
    }
  }
}

console.info()
console.info("Solution:")
console.info(Y)
console.info()
console.timeEnd()
