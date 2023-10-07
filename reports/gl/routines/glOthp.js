const calcOthpGl = require('../queries/postgres/calcOthpGl')
const getContraSalesGlMap = require('../queries/postgres/getContraSalesGlMap')
const getMajCodeGlMap = require('../queries/postgres/getMajCodeGlMap')
const unflattenByCompositKeyOverwriteDups = require('../../../models/unflattenByCompositKey')
const unflattedForOthpGlTie = require('../models/unflattedForOthpGlTie')
const unflattedPeriodActivity = require('../models/unflattenPeriodActivity')
const getGlPeriodActivity = require('../queries/seasoft/getGlPeriodActivity')
const mapOthpGlRecalc = require('../models/mapOthpGlRecalc')
const reconcileOthp = require('../models/reconcileOthp')
const getGlDepartments = require('../queries/seasoft/getGlDepartments')

const glOthp = async fy => {
  // Make DB Call
  console.log(`Calc OTHP for FY:${fy} routine... \n`)

  /* QUERY DATA */
  const othpGl = await calcOthpGl(fy)
  const contraSalesGlMap = await getContraSalesGlMap()
  const majCodeGlMap = await getMajCodeGlMap()
  const glPeriodActivity = await getGlPeriodActivity(fy)
  const glDepartments = await getGlDepartments()

  /* MODEL DATA */
  // create othp allocation
  const contraSalesGlMap_unflat = unflattenByCompositKeyOverwriteDups(contraSalesGlMap, { 1: 'contra' })
  const majCodeGlMap_unflat = unflattenByCompositKeyOverwriteDups(majCodeGlMap, { 1: 'name' })
  const glPeriodActivity_unflat = unflattedPeriodActivity(glPeriodActivity, { 1: 'ACCOUNT_NUMBER', 2: 'DEPARTMENT_CODE' })
  const mappedOthpGlRecalc = mapOthpGlRecalc(othpGl, contraSalesGlMap_unflat, majCodeGlMap_unflat) // This is the master recalc
  const othpRecalc_unflat = unflattedForOthpGlTie(mappedOthpGlRecalc, { 1: 'othp_gl', 2: 'dept', 3: 'period' }) // adds each additional recrd to dollars and major_code_name arrays

  /* RECONCILIATIONS */
  const reconciliationOthp = reconcileOthp(glPeriodActivity_unflat, othpRecalc_unflat, glDepartments, contraSalesGlMap)

  /* ALLOCATION */

  // NEED TO GO BACK AND NORMALIZE THE DEPARTMENT CODES. IN SOME RECORDS THEY ARE STRING, SOME THEY ARE INT. SEE THE OTHPRECONCILIATION FUNCTION

  return reconciliationOthp
}

module.exports = glOthp
