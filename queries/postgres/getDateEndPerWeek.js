const getDateEndPerWeek = async fy => {
  const { Client } = require('pg')
  const pgClient = new Client() // config from ENV
  await pgClient.connect()

  console.log(`query postgres for accounting period ends by week serial for FY: ${fy} ...`)

  const periodsByWeek = await pgClient.query(
    'SELECT period_by_week.week_serial AS dataName, period_by_week.date_end AS displayName FROM "accountingPeriods".period_by_week WHERE period_by_week.fiscal_year = $1 ORDER BY period_by_week.week ASC',
    [fy]
  )

  await pgClient.end()

  return periodsByWeek.rows
}

module.exports.getDateEndPerWeek = getDateEndPerWeek
