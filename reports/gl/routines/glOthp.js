const calcOthpGl = require('../queries/calcOthpGl')

const glOthp = async fy => {
  // Make DB Call
  console.log(`Calc OTHP for FY:${fy} routine... \n`)

  const othpGl = await calcOthpGl(fy)

  return othpGl
}

module.exports = glOthp
