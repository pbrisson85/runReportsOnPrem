const sql = require('../../../server')

const getDateEndPerWeek = async fy => {
  console.log(`query postgres for accounting period ends by week serial for FY: ${fy} ...`)

  const periodsByWeek =
    await sql`SELECT period_by_week.week_serial AS dataName, period_by_week.date_end AS displayName, period_by_week.week AS week FROM "accountingPeriods".period_by_week WHERE period_by_week.fiscal_year = ${fy} ORDER BY period_by_week.week ASC`

  return periodsByWeek
}

const getPeriodsMap = async () => {
  console.log(`query postgres for getPeriodsMaps ...`)

  const map = await sql`
    SELECT 
        DISTINCT(w.period_serial) AS period_serial, w.fiscal_year, w.period_num, MIN(w.week) AS wk_first, MAX(w.week) AS wk_last
      FROM "accountingPeriods".period_by_week AS w
       
      WHERE w.fiscal_year <= (
        SELECT d.fiscal_year
        FROM "accountingPeriods".period_by_day AS d
        WHERE d.formatted_date = CURRENT_DATE
        )
    
      GROUP BY w.period_serial, w.fiscal_year, w.period_num
      ORDER BY fiscal_year, wk_first ASC
    `

  return map
}

const getWeeksMap = async () => {
  console.log(`query postgres for getWeeksMap ...`)

  const map = await sql`
    SELECT w.week_serial, w.fiscal_year, w.week, w.period_serial, w.period_num
    FROM "accountingPeriods".period_by_week AS w
    WHERE w.fiscal_year <= (
      SELECT d.fiscal_year
      FROM "accountingPeriods".period_by_day AS d
      WHERE d.formatted_date = CURRENT_DATE
      )
    ORDER BY w.week_serial ASC
    `

  return map
}

const getFiscalYearMap = async () => {
  console.log(`query postgres for getFiscalYearMap ...`)

  const map = await sql`
    SELECT 
      DISTINCT(p.fiscal_year) AS fiscal_year, MIN(p.period_num) AS p_first, MAX(p.period_num) AS p_last, MIN(p.week) AS wk_first, MAX(p.week) AS wk_last
    FROM "accountingPeriods".period_by_week AS p
    WHERE p.fiscal_year <= (
      SELECT d.fiscal_year
      FROM "accountingPeriods".period_by_day AS d
      WHERE d.formatted_date = CURRENT_DATE
      )
    GROUP BY fiscal_year
    `
  return map
}

const getDateEndPerFiscalPeriodByRange = async (fy, config) => {
  console.log(`${config.user} - getDateEndPerFiscalPeriodByRange, query postgres for accounting period ends by period serial`)

  const periods = await sql`
    SELECT p.period_serial AS dataName, p.date_end AS displayName 
      FROM "accountingPeriods".period_by_month as p 
        WHERE p.fiscal_year = ${fy} 
          ORDER BY p.period ASC
  `

  return periods
}

const getDateEndPerWeekByRange = async (start, end, config) => {
  console.log(
    `${config.user} - getDateEndPerWeekByRange, query postgres for accounting period ends by week serial for ${new Date(
      start
    ).toLocaleDateString()} through ${new Date(end).toLocaleDateString()} ...`
  )

  const periodsByWeek =
    await sql`SELECT period_by_week.week_serial AS dataName, period_by_week.date_end AS displayName FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end >= ${start} AND period_by_week.formatted_date_end <= ${end} ORDER BY period_by_week.week ASC`

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

const getDateEndPerWeekByRange_so = async (start, end, config) => {
  console.log(
    `${config.user} - getDateEndPerWeekByRange_so, query postgres for accounting period ends by week serial for ${new Date(
      start
    ).toLocaleDateString()} through ${new Date(end).toLocaleDateString()} ...`
  )

  const periodsByWeek =
    await sql`SELECT period_by_week.week_serial || '_so' AS dataName, period_by_week.date_end AS displayName FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end >= ${start} AND period_by_week.formatted_date_end <= ${end} ORDER BY period_by_week.formatted_date_end ASC`

  return periodsByWeek
}

const getDateEndPerWeekByRange_so_tg = async (start, end, config) => {
  console.log(
    `${config.user} - getDateEndPerWeekByRange_so_tg, query postgres for accounting period ends by week serial for ${new Date(
      start
    ).toLocaleDateString()} through ${new Date(end).toLocaleDateString()} ...`
  )

  const periodsByWeek =
    await sql`SELECT period_by_week.week_serial || '_so_tg' AS dataName, period_by_week.date_end AS displayName FROM "accountingPeriods".period_by_week WHERE period_by_week.formatted_date_end >= ${start} AND period_by_week.formatted_date_end <= ${end} ORDER BY period_by_week.formatted_date_end ASC`

  return periodsByWeek
}

const getDateEndPerWeekByRange_so_untg = async (start, end, config) => {
  console.log(
    `${config.user} - getDateEndPerWeekByRange_so_untg, query postgres for accounting period ends by week serial for ${new Date(
      start
    ).toLocaleDateString()} through ${new Date(end).toLocaleDateString()} ...`
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
module.exports.getDateEndPerWeekByRange_pj = getDateEndPerWeekByRange_pj
module.exports.getDateEndPerFiscalPeriodByRange = getDateEndPerFiscalPeriodByRange
module.exports.getPeriodsMap = getPeriodsMap
module.exports.getWeeksMap = getWeeksMap
module.exports.getFiscalYearMap = getFiscalYearMap
