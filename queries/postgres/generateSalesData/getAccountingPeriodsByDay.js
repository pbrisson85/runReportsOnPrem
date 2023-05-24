const getAccountingPeriodsByDay = async posting_year => {
  const { Client } = require('pg')
  const pgClient = new Client() // config from ENV
  await pgClient.connect()

  console.log('query postgres for accounting periods by day ...')

  const periodsByDay = await pgClient.query(
    'SELECT period_by_day.date, period_by_day.period, period_by_day.week, period_by_day.week_serial, period_by_day.period_serial, period_by_day.fiscal_year FROM "accountingPeriods".period_by_day WHERE period_by_day.fiscal_year = $1',
    [posting_year]
  )

  await pgClient.end()

  return periodsByDay.rows
}

module.exports = getAccountingPeriodsByDay
