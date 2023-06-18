const calcRevCogsGl = require('../queries/postgres/calcRevCogsGl')
const getGlDepartments = require('../queries/seasoft/getGlDepartments')
const getGlRevenueAccounts = require('../queries/seasoft/getGlRevenueAccounts')
const getGlCogsAccounts = require('../queries/seasoft/getGlCogsAccounts')
const getGlPeriodActivity = require('../queries/seasoft/getGlPeriodActivity')
const unflattedRevenueRecalc = require('../models/unflattenRevenueRecalc')
const unflattedCogsRecalc = require('../models/unflattenCogsRecalc')

const glRevCogs = async fy => {
  // Make DB Call
  console.log(`Calc revenue and COGS for FY:${fy} routine... \n`)

  /* QUERY DATA */
  const glRevenueAccounts = await getGlRevenueAccounts() // description like 'SAL%' && less than 3800 for now
  const glCogsAccounts = await getGlCogsAccounts() // description like 'COG%' for now
  const glPeriodActivity = await getGlPeriodActivity(fy)
  const glDepartments = await getGlDepartments()
  const revCogsGl = await calcRevCogsGl(fy)

  /* MODEL DATA */
  const recalcedRev_unflat = unflattedRevenueRecalc(revCogsGl, { 1: 'sales_gl', 2: 'dept_gl', 3: 'period' })
  const recalcedCogs_unflat = unflattedCogsRecalc(revCogsGl, { 1: 'cogs_gl', 2: 'dept_gl', 3: 'period' })

  // reconcile revenue and cogs
  //const reconciledRev = reconcileRev(glRevenueAccounts, glPeriodActivity, glDepartments, revCogsGl)
  //const reconciledCogs = reconcileCogs(glCogsAccounts, glPeriodActivity, glDepartments, revCogsGl)

  return { recalcedRev_unflat, recalcedCogs_unflat }
}

module.exports = glRevCogs
