console.time()
const fs = require("fs")

const data = fs
  .readFileSync("data.txt", "utf8")
  .trim()
  .replace(/\r\n/g, "\n")
  .split("\n")

const result = data.filter(
  (row) =>
    /(.*[aeiou]){3}/g.test(row) &&
    /(.)\1+/g.test(row) &&
    !/(ab|cd|pq|xy)/.test(row)
).length

console.info("Solution:")
console.info(result, "\n")
console.timeEnd()
