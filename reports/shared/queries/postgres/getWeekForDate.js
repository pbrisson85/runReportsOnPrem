const getWeekForDate = async date => {
  const { Client } = require('pg')
  const pgClient = new Client() // config from ENV
  await pgClient.connect()

  console.log(`get week for date: ${date} ...`)

  const response = await pgClient.query(
    `SELECT p.week
     FROM "accountingPeriods".period_by_day AS p
     WHERE p.formatted_date = $1`,
    [date]
  )

  await pgClient.end()

  // If week is 52 then return 53 since some years have 53 weeks

  let week = parseInt(response.rows[0].week)

  if (week === 52) {
    week = 53
  }

  return week
}

module.exports.getWeekForDate = getWeekForDate
