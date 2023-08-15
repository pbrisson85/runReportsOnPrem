const sql = require('../../../../server')
const getStartOfWeek = async dateWeekEnd => {
  console.log(`query postgres for accounting period start of week ending: ${dateWeekEnd} ...`)

  const periodsByWeek =
    await sql`SELECT period_by_week.formatted_date_start FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end = ${dateWeekEnd}`

  return periodsByWeek
}

module.exports.getStartOfWeek = getStartOfWeek
