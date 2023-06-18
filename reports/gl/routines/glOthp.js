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
  const majCodeGlMap_unflat = unflattenByCompositKey(majCodeGlMap, { 1: 'name' })

  // map the othp type into the othp gl data
  const mapped = othpGl.map(othp => {
    // Find OTHP type (rebate, commission, discount, outbound)
    let othpType = 'OTHER' // example: OTHP mapped to 9010 extended terms
    let allocationGl = '9999' // example: OTHP mapped to 9010 extended terms

    if (typeof contraSalesGlMap_unflat[othp.othp_gl] !== 'undefined') {
      othpType = contraSalesGlMap_unflat[othp.othp_gl].category
      allocationGl = contraSalesGlMap_unflat[othp.othp_gl].allocation
    }

    // Find OTHP allocation GL accounts
    let allocattedGl = '9999' // example: OTHP mapped to 9010 extended terms

    if (typeof majCodeGlMap_unflat[othp.major_code_name] !== 'undefined') {
      allocattedGl = majCodeGlMap_unflat[othp.major_code_name][othpType]
    }

    return {
      ...othp,
      othpType,
      allocationGl,
      allocattedGl,
    }
  })

  return { mapped }
}

module.exports = glOthp
