const sql = require('../../../server')

const getDateEndPerWeek = async fy => {
  console.log(`query postgres for accounting period ends by week serial for FY: ${fy} ...`)

  const periodsByWeek =
    await sql`SELECT period_by_week.week_serial AS dataName, period_by_week.date_end AS displayName, period_by_week.week AS week FROM "accountingPeriods".period_by_week WHERE period_by_week.fiscal_year = ${fy} ORDER BY period_by_week.week ASC`

  return periodsByWeek
}

const getDateEndPerWeekByRange_pj = async (start, end, config) => {
  console.log(
    `${config.user} - getDateEndPerWeekByRange_pj, query postgres for accounting period ends by week serial for ${new Date(
      start
    ).toLocaleDateString()} through ${new Date(end).toLocaleDateString()} ...`
  )

  const periodsByWeek =
    await sql`SELECT period_by_week.week_serial || '_pj' AS dataName, period_by_week.date_end AS displayName FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end >= ${start} AND period_by_week.formatted_date_end <= ${end} ORDER BY period_by_week.formatted_date_end ASC`

  return periodsByWeek
}

const getDateEndPerWeekByRange_so = async config => {
  console.log(
    `${config.user} - getDateEndPerWeekByRange_so, query postgres for accounting period ends by week serial for ${new Date(
      config.salesOrders.startDate
    ).toLocaleDateString()} through ${new Date(config.salesOrders.endDate).toLocaleDateString()} ...`
  )

  const periodsByWeek =
    await sql`SELECT period_by_week.week_serial || '_so' AS dataName, period_by_week.date_end AS displayName FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end >= ${config.salesOrders.startDate} AND period_by_week.formatted_date_end <= ${config.salesOrders.endDate} ORDER BY period_by_week.formatted_date_end ASC`

  return periodsByWeek
}

const getDateEndPerWeekByRange_so_tg = async config => {
  console.log(
    `${config.user} - getDateEndPerWeekByRange_so_tg, query postgres for accounting period ends by week serial for ${new Date(
      config.salesOrders.startDate
    ).toLocaleDateString()} through ${new Date(config.salesOrders.endDate).toLocaleDateString()} ...`
  )

  const periodsByWeek =
    await sql`SELECT period_by_week.week_serial || '_so_tg' AS dataName, period_by_week.date_end AS displayName FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end >= ${config.salesOrders.startDate} AND period_by_week.formatted_date_end <= ${config.salesOrders.endDate} ORDER BY period_by_week.formatted_date_end ASC`

  return periodsByWeek
}

const getDateEndPerWeekByRange_so_untg = async config => {
  console.log(
    `${config.user} - getDateEndPerWeekByRange_so_untg, query postgres for accounting period ends by week serial for ${new Date(
      config.salesOrders.startDate
    ).toLocaleDateString()} through ${new Date(config.salesOrders.endDate).toLocaleDateString()} ...`
  )

  const periodsByWeek =
    await sql`SELECT period_by_week.week_serial || '_so_untg' AS dataName, period_by_week.date_end AS displayName FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end >= ${config.salesOrders.startDate} AND period_by_week.formatted_date_end <= ${config.salesOrders.endDate} ORDER BY period_by_week.formatted_date_end ASC`

  return periodsByWeek
}

module.exports.getDateEndPerWeek = getDateEndPerWeek
module.exports.getDateEndPerWeekByRange_so = getDateEndPerWeekByRange_so
module.exports.getDateEndPerWeekByRange_so_tg = getDateEndPerWeekByRange_so_tg
module.exports.getDateEndPerWeekByRange_so_untg = getDateEndPerWeekByRange_so_untg
module.exports.getDateEndPerWeekByRange_pj = getDateEndPerWeekByRange_pj
