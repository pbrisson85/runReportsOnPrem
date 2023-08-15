const sql = require('../../../../server')

const getWeekForDate = async date => {
  console.log(`get week for date: ${date} ...`)

  const response = await sql
    `SELECT p.week
     FROM "accountingPeriods".period_by_day AS p
     WHERE p.formatted_date = ${date}` //prettier-ignore

  // If week is 52 then return 53 since some years have 53 weeks

  let week = parseInt(response[0].week)

  if (week === 52) {
    week = 53
  }

  return week
}

module.exports.getWeekForDate = getWeekForDate
