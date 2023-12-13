const sql = require('../../../../server')

const getDateEndPerWeek = async fy => {
  console.log(`query postgres for accounting period ends by week serial for FY: ${fy} ...`)

  const periodsByWeek =
    await sql`SELECT period_by_week.week_serial AS dataName, period_by_week.date_end AS displayName, period_by_week.week AS week FROM "accountingPeriods".period_by_week WHERE period_by_week.fiscal_year = ${fy} ORDER BY period_by_week.week ASC`

  return periodsByWeek
}

module.exports.getDateEndPerWeek = getDateEndPerWeek
