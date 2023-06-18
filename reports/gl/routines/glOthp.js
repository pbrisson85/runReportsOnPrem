const calcOthpGl = require('../queries/postgres/calcOthpGl')
const getContraSalesGlMap = require('../queries/postgres/getContraSalesGlMap')
const getMajCodeGlMap = require('../queries/postgres/getMajCodeGlMap')
const unflattenByCompositKeyOverwriteDups = require('../../shared/models/unflattenByCompositKey')
const unflattedForOthpGlTie = require('../models/unflattedForOthpGlTie')
const unflattedPeriodActivity = require('../models/unflattenPeriodActivity')
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
  const glPeriodActivity_unflat = unflattedPeriodActivity(glPeriodActivity, { 1: 'ACCOUNT_NUMBER', 2: 'DEPARTMENT_CODE' })

  const mappedOthpGl = mapOthpGlRecalc(othpGl, contraSalesGlMap_unflat, majCodeGlMap_unflat)
  const othpTieOut_unflat = unflattedForOthpGlTie(mappedOthpGl, { 1: 'othp_gl', 2: 'dept', 3: 'period' }) // adds each additional recrd to dollars and major_code_name arrays

  // othpTieOut_unflat is used to tie out the othp GL (effected by othp updates on invoices and then booked to gl via journal entry)
  // Need another object to tie out the othp allocation

  // loop through the gl period activity and compare to the othpTieOut_unflat
  const reconciliationOthp = []
  const periodActivityKeys = Object.keys(glPeriodActivity_unflat)
  periodActivityKeys.forEach(key => {
    const glAcct = key.split('-')[0]
    const dept = key.split('-')[1]
    const periods = Object.keys(glPeriodActivity_unflat[key])

    // loop through each period
    periods.forEach(period => {
      const glDollars = glPeriodActivity_unflat[key][period]

      // Get the calced othp dollar amount

      let othpCalcDollars = 0
      if (typeof othpTieOut_unflat[`${glAcct}-${dept}-${period}`] !== 'undefined') {
        othpCalcDollars = othpTieOut_unflat[`${glAcct}-${dept}-${period}`].dollars.reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
      }

      // compare the two
      const difference = parseFloat(glDollars) - parseFloat(othpCalcDollars)

      reconciliationOthp.push({
        glAcct,
        dept,
        period,
        glDollars,
        othpCalcDollars,
        difference,
      })
    })
  })

  return reconciliationOthp
}

module.exports = glOthp
