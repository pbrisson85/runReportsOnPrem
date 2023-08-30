const sql = require('../../../../server')

const getDateEndPerWeek = async fy => {
  console.log(`query postgres for accounting period ends by week serial for FY: ${fy} ...`)

  const periodsByWeek =
    await sql`SELECT period_by_week.week_serial AS dataName, period_by_week.date_end AS displayName, period_by_week.week AS week FROM "accountingPeriods".period_by_week WHERE period_by_week.fiscal_year = ${fy} ORDER BY period_by_week.week ASC`

  return periodsByWeek
}

const getDateEndPerWeekByRange = async (start, end, config) => {
  console.log(
    `${config.user} - getDateEndPerWeekByRange, query postgres for accounting period ends by week serial for ${start} through ${end} ...`
  )

  const periodsByWeek =
    await sql`SELECT period_by_week.week_serial AS dataName, period_by_week.date_end AS displayName FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end >= ${start} AND period_by_week.formatted_date_end <= ${end} ORDER BY period_by_week.week ASC`

  return periodsByWeek
}

const getDateEndPerWeekByRange_so = async (start, end, config) => {
  console.log(
    `${config.user} - getDateEndPerWeekByRange_so, query postgres for accounting period ends by week serial for ${start} through ${end} ...`
  )

  const periodsByWeek =
    await sql`SELECT period_by_week.week_serial || '_so' AS dataName, period_by_week.date_end AS displayName FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end >= ${start} AND period_by_week.formatted_date_end <= ${end} ORDER BY period_by_week.formatted_date_end ASC`

  return periodsByWeek
}

const getDateEndPerWeekByRange_so_tg = async (start, end, config) => {
  console.log(
    `${config.user} - getDateEndPerWeekByRange_so_tg, query postgres for accounting period ends by week serial for ${start} through ${end} ...`
  )

  const periodsByWeek =
    await sql`SELECT period_by_week.week_serial || '_so_tg' AS dataName, period_by_week.date_end AS displayName FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end >= ${start} AND period_by_week.formatted_date_end <= ${end} ORDER BY period_by_week.formatted_date_end ASC`

  return periodsByWeek
}

const getDateEndPerWeekByRange_so_untg = async (start, end, config) => {
  console.log(
    `${config.user} - getDateEndPerWeekByRange_so_untg, query postgres for accounting period ends by week serial for ${start} through ${end} ...`
  )

  const periodsByWeek =
    await sql`SELECT period_by_week.week_serial || '_so_untg' AS dataName, period_by_week.date_end AS displayName FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end >= ${start} AND period_by_week.formatted_date_end <= ${end} ORDER BY period_by_week.formatted_date_end ASC`

  return periodsByWeek
}

module.exports.getDateEndPerWeekByRange = getDateEndPerWeekByRange
module.exports.getDateEndPerWeek = getDateEndPerWeek
module.exports.getDateEndPerWeekByRange_so = getDateEndPerWeekByRange_so
module.exports.getDateEndPerWeekByRange_so_tg = getDateEndPerWeekByRange_so_tg
module.exports.getDateEndPerWeekByRange_so_untg = getDateEndPerWeekByRange_so_untg
