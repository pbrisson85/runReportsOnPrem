// const inv0 = {}
// const inv1 = { test: 'test' }

// const lengthIs0 = Object.keys(inv0).length
// console.log('lengthIs0', lengthIs0)
// if (lengthIs0) {
//   console.log('lengthIs0 is true')
// } else {
//   console.log('lengthIs0 is false')
// }
// console.log('lengthIs0 === false', lengthIs0 === false)
// console.log('lengthIs0 == false', lengthIs0 == false)

// const lengthIs1 = Object.keys(inv1).length
// console.log('lengthIs1', lengthIs1)
// if (lengthIs1) {
//   console.log('lengthIs1 is true')
// } else {
//   console.log('lengthIs1 is false')
// }
// console.log('lengthIs1 === true', lengthIs1 === true)
// console.log('lengthIs1 == true', lengthIs1 == true)

const test = [{ test: 1 }, { test: 2 }, { test: 3 }]

const test1 = test[0].test
const test4 = test?.[3]?.fake

console.log('test1', test1)

console.log('test4', test4)
