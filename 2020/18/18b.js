const fs = require("fs")

const data = parseData(fs.readFileSync("data.txt", "utf8"))

function parseData(string) {
  return string
    .replace(/\)/g, " )")
    .replace(/\(/g, "( ")
    .replace(/\r\n/g, "\n")
    .split(/\n/g)
    .map((row) => row.split(" "))
}

function exec(operator, operand1, operand2) {
  if (operator === "*") return operand1 * operand2
  if (operator === "+") return operand1 + operand2
}

function sum(acc, cur) {
  return acc + cur
}

function eval(equation) {
  const operators = []
  const operands = []
  for (element of equation) {
    let operator
    if (element === "(" || element === "*" || element === "+") {
      operators.push(element)
      continue
    }
    if (element === ")") {
      while ((operator = operators.pop()) !== "(") {
        operands.push(exec(operator, operands.pop(), operands.pop()))
      }
      if (operands.length > 1) {
        if (operators[operators.length - 1] === "+")
          operands.push(exec(operators.pop(), operands.pop(), operands.pop()))
        continue
      }
      continue
    }
    operator = operators[operators.length - 1]
    if (operator === undefined || operator === "(" || operator === "*") {
      operands.push(Number(element))
      continue
    }
    operands.push(exec(operators.pop(), operands.pop(), Number(element)))
  }
  while ((operator = operators.pop()) === "*") {
    operands.push(exec(operator, operands.pop(), operands.pop()))
  }
  return operands.pop()
}

const testData = parseData(`1 + 2 * 3 + 4 * 5 + 6
1 + (2 * 3) + (4 * (5 + 6))
2 * 3 + (4 * 5)
5 + (8 * 3 + 9 + 3 * 4 * 3)
5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))
((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`)

const testResults = [231, 51, 46, 1445, 669060, 23340]

const test = testData
  .map(eval)
  .map((e, i) => [e, testResults[i], testResults[i] === e])

console.info("Tests:")
console.info(test)
console.info(test.every((e) => e[2] === true))

const result = data.map(eval)

console.info(result.reduce(sum))
