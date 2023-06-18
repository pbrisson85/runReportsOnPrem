const calcRevCogsGl = require('../queries/postgres/calcRevCogsGl')
const getGlDepartments = require('../queries/seasoft/getGlDepartments')
const getGlRevenueAccounts = require('../queries/seasoft/getGlRevenueAccounts')
const getGlCogsAccounts = require('../queries/seasoft/getGlCogsAccounts')
const getGlPeriodActivity = require('../queries/seasoft/getGlPeriodActivity')
const unflattedRevenueRecalc = require('../models/unflattenRevenueRecalc')
const unflattedCogsRecalc = require('../models/unflattenCogsRecalc')
const unflattedPeriodActivity = require('../models/unflattenPeriodActivity')
const reconcileRevenue = require('../models/reconcileRevenue')

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
  const glPeriodActivity_unflat = unflattedPeriodActivity(glPeriodActivity, { 1: 'ACCOUNT_NUMBER', 2: 'DEPARTMENT_CODE' })

  // reconcile revenue and cogs
  const reconciledRev = reconcileRevenue(glRevenueAccounts, glPeriodActivity_unflat, glDepartments, recalcedRev_unflat)
  //const reconciledCogs = reconcileCogs(glCogsAccounts, glPeriodActivity, glDepartments, revCogsGl)

  return { reconciledRev }
}

module.exports = glRevCogs
