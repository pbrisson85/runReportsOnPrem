const calcOthpGl = require('../queries/postgres/calcOthpGl')
const getContraSalesGlMap = require('../queries/postgres/getContraSalesGlMap')
const getMajCodeGlMap = require('../queries/postgres/getMajCodeGlMap')
const unflattenByCompositKeyOverwriteDups = require('../../shared/models/unflattenByCompositKey')
const unflattenByCompositKeyPushDups = require('../models/unflattenByCompositKey')
const getGlPeriodActivity = require('../queries/seasoft/getGlPeriodActivity')
const mapOthpGlRecalc = require('../models/mapOthpGlRecalc')

const glOthp = async fy => {
  // Make DB Call
  console.log(`Calc OTHP for FY:${fy} routine... \n`)

  /* QUERY DATA */
  const othpGl = await calcOthpGl(fy)
  const contraSalesGlMap = await getContraSalesGlMap()
  const majCodeGlMap = await getMajCodeGlMap()
  const glPeriodActivity = await getGlPeriodActivity(fy)

  /* MODEL DATA */
  // create othp allocation
  const contraSalesGlMap_unflat = unflattenByCompositKeyOverwriteDups(contraSalesGlMap, { 1: 'contra' })
  const majCodeGlMap_unflat = unflattenByCompositKeyOverwriteDups(majCodeGlMap, { 1: 'name' })
  const glPeriodActivity_unflat = unflattenByCompositKeyPushDups(glPeriodActivity, { 1: 'ACCOUNT_NUMBER', 2: 'DEPARTMENT_CODE' })

  const mappedOthpGl = mapOthpGlRecalc(othpGl, contraSalesGlMap_unflat, majCodeGlMap_unflat)
  const othpTieOut_unflat = unflattenByCompositKey(mappedOthpGl, { 1: 'othp_gl', 2: 'dept' })

  // map the othp type into the othp gl data

  return { glPeriodActivity_unflat, othpTieOut_unflat }
}

module.exports = glOthp
