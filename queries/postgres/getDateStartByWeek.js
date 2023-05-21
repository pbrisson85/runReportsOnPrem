const getStartOfWeek = async dateWeekEnd => {
  const { Client } = require('pg')
  const pgClient = new Client() // config from ENV
  await pgClient.connect()

  console.log(`query postgres for accounting period ends by week serial for FY: ${fy} ...`)

  const periodsByWeek = await pgClient.query(
    'SELECT period_by_week.formatted_date_start FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end = $1',
    [dateWeekEnd]
  )

  await pgClient.end()

  return periodsByWeek.rows
}

module.exports.getStartOfWeek = getStartOfWeek
