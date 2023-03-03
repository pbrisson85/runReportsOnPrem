const getFirstDayOfFiscalYear = async fiscalYear => {
  const { Client } = require('pg')
  const pgClient = new Client() // config from ENV
  await pgClient.connect()

  console.log('query postgres for first day of fiscal year ...')

  const periodsByDay = await pgClient.query(
    "SELECT period_by_day.date FROM \"accountingPeriods\".period_by_day WHERE period_by_day.fiscal_year = $1 AND period_by_day.week = $2 AND period_by_day.day = $3", [fiscalYear,1,'Sun']) //prettier-ignore

  await pgClient.end()

  return periodsByDay.rows
}

module.exports = getFirstDayOfFiscalYear
