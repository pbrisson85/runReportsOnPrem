const calcRevCogsGl = require('../queries/calcRevCogsGl')

const glRevCogs = async fy => {
  // Make DB Call
  console.log(`Calc revenue and COGS for FY:${fy} routine... \n`)

  const revCogsGl = await calcRevCogsGl(fy)

  return revCogsGl
}

module.exports = glRevCogs
