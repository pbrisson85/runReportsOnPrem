const calcOthpGl = require('../queries/postgres/calcOthpGl')
const getContraSalesGlMap = require('../queries/postgres/getContraSalesGlMap')
const getMajCodeGlMap = require('../queries/postgres/getMajCodeGlMap')
const unflattenByCompositKey = require('../../shared/models/unflattenByCompositKey')

const glOthp = async fy => {
  // Make DB Call
  console.log(`Calc OTHP for FY:${fy} routine... \n`)

  /* QUERY DATA */
  const othpGl = await calcOthpGl(fy)
  const contraSalesGlMap = await getContraSalesGlMap()
  const majCodeGlMap = await getMajCodeGlMap()

  /* MODEL DATA */
  // create othp allocation
  const contraSalesGlMap_unflat = unflattenByCompositKey(contraSalesGlMap, { 1: 'contra' })

  // map the othp type into the othp gl data
  const mapped = othpGl.map(othp => {
    const othpType = contraSalesGlMap_unflat[othp.othp_gl][0].category

    return {
      ...othp,
      othpType,
    }
  })

  return { mapped }
}

module.exports = glOthp
