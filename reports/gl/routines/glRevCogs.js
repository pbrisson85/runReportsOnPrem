const calcRevCogsGl = require('../queries/postgres/calcRevCogsGl')
const getGlDepartments = require('../queries/seasoft/getGlDepartments')
const getGlRevenueAccounts = require('../queries/seasoft/getGlRevenueAccounts')
const getGlCogsAccounts = require('../queries/seasoft/getGlCogsAccounts')
const getGlPeriodActivity = require('../queries/seasoft/getGlPeriodActivity')

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
  // reconcile revenue and cogs

  return { revCogsGl, glRevenueAccounts, glCogsAccounts, glPeriodActivity, glDepartments }
}

module.exports = glRevCogs
