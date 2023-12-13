const getStartOfWeek = async dateWeekEnd => {
  const { Client } = require('pg')
  const pgClient = new Client() // config from ENV
  await pgClient.connect()

  console.log(`query postgres for accounting period start of week ending: ${dateWeekEnd} ...`)

  // DO NOT CHANGE THIS TO USE POSTGRES JS LIBRABRY!!! IT WILL MESS UP THE TIME ZONE ON THE DATE AND THEN THE QUERIES THAT USE THIS WILL BE WRONG!!

  const periodsByWeek = await pgClient.query(
    'SELECT period_by_week.formatted_date_start FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end = $1',
    [dateWeekEnd]
  )

  await pgClient.end()

  return periodsByWeek.rows
}

module.exports.getStartOfWeek = getStartOfWeek
