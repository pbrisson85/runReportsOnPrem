const getDateEndPerWeek = async fy => {
  const { Client } = require('pg')
  const pgClient = new Client() // config from ENV
  await pgClient.connect()

  console.log(`query postgres for accounting period ends by week serial for FY: ${fy} ...`)

  const periodsByWeek = await pgClient.query(
    'SELECT period_by_week.week_serial AS dataName, period_by_week.date_end AS displayName, period_by_week.week AS week FROM "accountingPeriods".period_by_week WHERE period_by_week.fiscal_year = $1 ORDER BY period_by_week.week ASC',
    [fy]
  )

  await pgClient.end()

  return periodsByWeek.rows
}

const getDateEndPerWeekByRange = async (start, end) => {
  const { Client } = require('pg')
  const pgClient = new Client() // config from ENV
  await pgClient.connect()

  console.log(`getDateEndPerWeekByRange, query postgres for accounting period ends by week serial for ${start} through ${end} ...`)

  const periodsByWeek = await pgClient.query(
    'SELECT period_by_week.week_serial AS dataName, period_by_week.date_end AS displayName FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end >= $1 AND period_by_week.formatted_date_end <= $2 ORDER BY period_by_week.week ASC',
    [start, end]
  )

  await pgClient.end()

  return periodsByWeek.rows
}

const getDateEndPerWeekByRange_so = async (start, end) => {
  const { Client } = require('pg')
  const pgClient = new Client() // config from ENV
  await pgClient.connect()

  console.log(`getDateEndPerWeekByRange_so, query postgres for accounting period ends by week serial for ${start} through ${end} ...`)

  const periodsByWeek = await pgClient.query(
    'SELECT period_by_week.week_serial || \'_so\' AS dataName, period_by_week.date_end AS displayName FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end >= $1 AND period_by_week.formatted_date_end <= $2 ORDER BY period_by_week.formatted_date_end ASC',
    [start, end]
  )

  await pgClient.end()

  return periodsByWeek.rows
}

const getDateEndPerWeekByRange_so_tg = async (start, end) => {
  const { Client } = require('pg')
  const pgClient = new Client() // config from ENV
  await pgClient.connect()

  console.log(`getDateEndPerWeekByRange_so_tg, query postgres for accounting period ends by week serial for ${start} through ${end} ...`)

  const periodsByWeek = await pgClient.query(
    'SELECT period_by_week.week_serial || \'_so_tg\' AS dataName, period_by_week.date_end AS displayName FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end >= $1 AND period_by_week.formatted_date_end <= $2 ORDER BY period_by_week.formatted_date_end ASC',
    [start, end]
  )

  await pgClient.end()

  return periodsByWeek.rows
}

const getDateEndPerWeekByRange_so_untg = async (start, end) => {
  const { Client } = require('pg')
  const pgClient = new Client() // config from ENV
  await pgClient.connect()

  console.log(`getDateEndPerWeekByRange_so_untg, query postgres for accounting period ends by week serial for ${start} through ${end} ...`)

  const periodsByWeek = await pgClient.query(
    'SELECT period_by_week.week_serial || \'_so_untg\' AS dataName, period_by_week.date_end AS displayName FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end >= $1 AND period_by_week.formatted_date_end <= $2 ORDER BY period_by_week.formatted_date_end ASC',
    [start, end]
  )

  await pgClient.end()

  return periodsByWeek.rows
}

module.exports.getDateEndPerWeekByRange = getDateEndPerWeekByRange
module.exports.getDateEndPerWeek = getDateEndPerWeek
module.exports.getDateEndPerWeekByRange_so = getDateEndPerWeekByRange_so
module.exports.getDateEndPerWeekByRange_so_tg = getDateEndPerWeekByRange_so_tg
module.exports.getDateEndPerWeekByRange_so_untg = getDateEndPerWeekByRange_so_untg
