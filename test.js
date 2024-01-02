const inv0 = {}
const inv1 = { test: 'test' }

const lengthIs0 = Object.keys(inv0).length
console.log('lengthIs0', lengthIs0)
if (lengthIs0) {
  console.log('lengthIs0 is true')
} else {
  console.log('lengthIs0 is false')
}
console.log('lengthIs0 === false', lengthIs0 === false)
console.log('lengthIs0 == false', lengthIs0 == false)

const lengthIs1 = Object.keys(inv1).length
console.log('lengthIs1', lengthIs1)
if (lengthIs1) {
  console.log('lengthIs1 is true')
} else {
  console.log('lengthIs1 is false')
}
console.log('lengthIs1 === true', lengthIs1 === true)
console.log('lengthIs1 == true', lengthIs1 == true)
