const intOp = function (data, input) {
  let output
  let i = 0
  const op = (n) => {
    const arr = [
      data[i] % 100,
      Math.floor((data[i] % 1000) / 100),
      Math.floor((data[i] % 10000) / 1000),
      Math.floor((data[i] % 100000) / 10000),
    ]
    if (n === 1) return arr[1]
    if (n === 2) return arr[2]
    if (n === 3) return arr[3]
    return arr[0]
  }
  const el1 = () => (op(1) ? data[i + 1] : data[data[i + 1]])
  const el2 = () => (op(2) ? data[i + 2] : data[data[i + 2]])
  const res4 = () => data[i + 3]
  const res2 = () => data[i + 1]
  while (op() !== 99 && op() !== undefined) {
    switch (op()) {
      case 1: // add
        data[res4()] = el1() + el2()
        i += 4
        break
      case 2: // multiply
        data[res4()] = el1() * el2()
        i += 4
        break
      case 3: // input
        data[res2()] = input
        i += 2
        break
      case 4: // output
        output = el1()
        i += 2
        break
      case 5: // jump to if true (not zero)
        if (el1() !== 0) {
          i = el2()
        } else {
          i += 3
        }
        break
      case 6: // jum to if false (zero)
        if (el1() === 0) {
          i = el2()
        } else {
          i += 3
        }
        break
      case 7: // less than
        if (el1() < el2()) {
          data[res4()] = 1
        } else {
          data[res4()] = 0
        }
        i += 4
        break
      case 8: // equals
        if (el1() === el2()) {
          data[res4()] = 1
        } else {
          data[res4()] = 0
        }
        i += 4
        break
      default:
        break
    }
  }
  return output
}

module.exports = intOp
