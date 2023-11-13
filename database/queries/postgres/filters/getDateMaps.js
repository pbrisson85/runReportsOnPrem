const sql = require('../../../../server')

const getFiscalPeriodsMap = async () => {
  console.log(`query postgres for getFiscalPeriodsMap ...`)

  const map = await sql`
      SELECT 
          DISTINCT(w.period_serial) AS period_serial, w.fiscal_year, w.period_num, MIN(w.date_start) AS date_start, MAX(w.date_end) AS date_end, MIN(w.date_start) || ' (' || RIGHT(w.period_serial,3) || ') ' AS display_start, MAX(w.date_end) || ' (' || RIGHT(w.period_serial,3) || ') ' AS display_end, MIN(w.week) AS wk_first, MAX(w.week) AS wk_last, 'fiscal_periods' AS map 

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
      SELECT w.week_serial, w.fiscal_year, w.week, w.period_serial, w.period_num, w.date_start, w.date_end, w.date_start || ' (' || RIGHT(w.week_serial,3) || ') ' AS display_start, w.date_end || ' (' || RIGHT(w.week_serial,3) || ') ' AS display_end, 'weeks' AS map, 'true' AS default_map

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
        DISTINCT(p.fiscal_year) AS fiscal_year, MIN(p.period_num) AS p_first, MAX(p.period_num) AS p_last, MIN(p.week) AS wk_first, MAX(p.week) AS wk_last, 'fiscal_years' AS map

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

const getCurrentFiscalYear = async () => {
  console.log(`query postgres for getCurrentFiscalYear ...`)
  const year = await sql`
      SELECT d.fiscal_year
        FROM "accountingPeriods".period_by_day AS d
      WHERE d.formatted_date = CURRENT_DATE
      `
  return year
}

module.exports.getFiscalPeriodsMap = getFiscalPeriodsMap
module.exports.getWeeksMap = getWeeksMap
module.exports.getFiscalYearMap = getFiscalYearMap
module.exports.getCurrentFiscalYear = getCurrentFiscalYear
