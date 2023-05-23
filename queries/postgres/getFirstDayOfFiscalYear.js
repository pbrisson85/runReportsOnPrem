const getFirstDayOfFiscalYear = async fiscalYear => {
  const { Client } = require('pg')
  const pgClient = new Client() // config from ENV
  await pgClient.connect()

  console.log(`query postgres for first day of fiscal year ${fiscalYear} ...`)

  const periodsByDay = await pgClient.query(
    "SELECT MIN(period_by_day.date::DATE) AS date FROM \"accountingPeriods\".period_by_day WHERE period_by_day.fiscal_year = $1", [fiscalYear]) //prettier-ignore

  await pgClient.end()

  console.log(
    `first day: ${periodsByDay.rows[0].date.toLocaleDateString('en-US', {
      timeZone: 'America/New_York',
    })} ...`
  )

  return periodsByDay.rows[0].date.toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
  })
}

module.exports = getFirstDayOfFiscalYear
