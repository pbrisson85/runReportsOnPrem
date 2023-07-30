const getWeekForDate = async date => {
  const { Client } = require('pg')
  const pgClient = new Client() // config from ENV
  await pgClient.connect()

  console.log(`get week for date: ${date} ...`)

  const week = await pgClient.query(
    `SELECT p.week
     FROM "accountingPeriods".period_by_day AS p
     WHERE p.formatted_date = $1`,
    [date]
  )

  await pgClient.end()

  console.log(week)
  console.log('week: ', week.rows[0].week)

  return week.rows[0].week
}

module.exports.getWeekForDate = getWeekForDate
