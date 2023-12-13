const sql = require('../../../../server')

const getFiscalPeriodsMap = async () => {
  console.log(`query postgres for getFiscalPeriodsMap ...`)

  const map = await sql`
      SELECT 
        DISTINCT(p.period_serial) AS period_serial,
        p.period AS period, -- used to default the end dropdown. Also used to sync the comparison year timeframe with primary year timeframe
        p.fiscal_year,  -- used to filter on front end dropdown population
        MIN(p.formatted_date) AS date_start, 
        MAX(p.formatted_date) AS date_end, 
        TO_CHAR(MIN(p.formatted_date), 'mm/dd/yy') || ' (' || p.period_serial || ') ' AS display_start, 
        TO_CHAR(MAX(p.formatted_date), 'mm/dd/yy') || ' (' || p.period_serial || ') ' AS display_end, 
        'fiscal_periods' AS map, -- front end flag
        FALSE AS "prevent_filterByYear", -- used to filter on front end dropdown population

        CASE WHEN p.period = (
          SELECT c.period
          FROM "accountingPeriods".period_by_day AS c
          WHERE c.formatted_date = CURRENT_DATE) THEN TRUE ELSE FALSE END AS default_end

      FROM "accountingPeriods".period_by_day AS p

      WHERE p.fiscal_year <= (
        SELECT d.fiscal_year
        FROM "accountingPeriods".period_by_day AS d
        WHERE d.formatted_date = CURRENT_DATE
        )

      GROUP BY p.period_serial, p.period, p.fiscal_year
      ORDER BY p.fiscal_year, p.period ASC
      `

  return map
}

const getFiscalQuartersMap = async () => {
  console.log(`query postgres for getFiscalQuartersMap ...`)

  const map = await sql`
    SELECT 
        DISTINCT(p.quarter_serial) AS quarter_serial, 
        p.fiscal_year, -- used to filter on front end dropdown population
        p.fiscal_quarter AS period, -- used to default the end dropdown. Also used to sync the comparison year timeframe with primary year timeframe 
        MIN(p.formatted_date) AS date_start, 
        MAX(p.formatted_date) AS date_end, 
        TO_CHAR(MIN(p.formatted_date), 'mm/dd/yy') || ' (' || p.quarter_serial || ') ' AS display_start, 
        TO_CHAR(MAX(p.formatted_date), 'mm/dd/yy') || ' (' || p.quarter_serial || ') ' AS display_end, 
        'fiscal_quarters' AS map, 
        FALSE AS "prevent_filterByYear", -- used to filter on front end dropdown population

        CASE WHEN p.fiscal_quarter = (
          SELECT c.fiscal_quarter
          FROM "accountingPeriods".period_by_day AS c
          WHERE c.formatted_date = CURRENT_DATE) THEN TRUE ELSE FALSE END AS default_end

    FROM "accountingPeriods".period_by_day AS p

    WHERE p.fiscal_year <= (
      SELECT d.fiscal_year
      FROM "accountingPeriods".period_by_day AS d
      WHERE d.formatted_date = CURRENT_DATE
      )

    GROUP BY p.quarter_serial, p.fiscal_year, p.fiscal_quarter
    ORDER BY p.fiscal_year, p.fiscal_quarter ASC
      `

  return map
}

const getWeeksMap = async () => {
  console.log(`query postgres for getWeeksMap ...`)

  const map = await sql`
      SELECT 
        p.week_serial, 
        p.fiscal_year,  -- used to filter on front end dropdown population
        p.week As period, -- used to default the end dropdown. Also used to sync the comparison year timeframe with primary year timeframe 
        MIN(p.formatted_date) AS date_start, 
        MAX(p.formatted_date) AS date_end, 
        TO_CHAR(MIN(p.formatted_date), 'mm/dd/yy') || ' (' || p.week_serial || ') ' AS display_start, 
        TO_CHAR(MAX(p.formatted_date), 'mm/dd/yy') || ' (' || p.week_serial || ') ' AS display_end, 
        'weeks' AS map, 
        TRUE AS default_map, 
        FALSE AS "prevent_filterByYear",  -- used to filter on front end dropdown population

        CASE WHEN p.week = (
          SELECT c.week
          FROM "accountingPeriods".period_by_day AS c
          WHERE c.formatted_date = CURRENT_DATE) THEN TRUE ELSE FALSE END AS default_end

      FROM "accountingPeriods".period_by_day AS p
      WHERE p.fiscal_year <= (
        SELECT d.fiscal_year
        FROM "accountingPeriods".period_by_day AS d
        WHERE d.formatted_date = CURRENT_DATE
        )
      GROUP BY p.week_serial, p.fiscal_year, p.week, p.period_serial, p.period
      ORDER BY p.week_serial ASC
      `

  return map
}

const getFiscalYearMap = async () => {
  console.log(`query postgres for getFiscalYearMap ...`)

  const map = await sql`
    SELECT 
      DISTINCT ON (p.fiscal_year) p.fiscal_year AS fiscal_year, 
      p.fiscal_year AS label, 
      p.fiscal_year AS "dataName", 
      TO_CHAR(MIN(p.formatted_date), 'mm/dd/yy') || ' (' || p.fiscal_year || ') ' AS display_start,
      TO_CHAR(MAX(p.formatted_date), 'mm/dd/yy') || ' (' || p.fiscal_year || ') ' AS display_end,
      MIN(p.formatted_date) AS date_start, 
      MAX(p.formatted_date) AS date_end, 
      'fiscal_years' AS map, 

      TRUE AS "prevent_filterByYear",  -- used to filter on front end dropdown population

      CASE WHEN p.fiscal_year = (
        SELECT c.fiscal_year
        FROM "accountingPeriods".period_by_day AS c
        WHERE c.formatted_date = CURRENT_DATE) THEN TRUE ELSE FALSE END AS default,
      
      CASE WHEN p.fiscal_year = (
        SELECT d.fiscal_year
        FROM "accountingPeriods".period_by_day AS d
        WHERE d.formatted_date = CURRENT_DATE) THEN TRUE ELSE FALSE END AS "trueOnNoSelection",

      2 AS "maxSelections"

    FROM "accountingPeriods".period_by_day AS p

    WHERE p.fiscal_year <= (
      SELECT d.fiscal_year
      FROM "accountingPeriods".period_by_day AS d
      WHERE d.formatted_date = CURRENT_DATE
      )
    GROUP BY p.fiscal_year
    ORDER BY p.fiscal_year DESC
      `
  return map
}

const getFiscalYtdMap = async () => {
  console.log(`query postgres for getFiscalYtdMap ...`)

  const map = await sql`
    SELECT 
      p.week_serial, 
      p.fiscal_year,  -- used to filter on front end dropdown population
      p.week AS period, 
      MIN(p.formatted_date) AS date_start, 
      MAX(p.formatted_date) AS date_end, 
      TO_CHAR(MIN(p.formatted_date), 'mm/dd/yy') || ' (' || p.week_serial || ') ' AS display_start, 
      TO_CHAR(MAX(p.formatted_date), 'mm/dd/yy') || ' (' || p.week_serial || ') ' AS display_end, 
      'fiscal_ytd' AS map, 
      FALSE AS default_map, 
      TRUE AS "prevent_filterByYear",  -- used to filter on front end dropdown population

      CASE WHEN p.week = (
        SELECT c.week
        FROM "accountingPeriods".period_by_day AS c
        WHERE c.formatted_date = CURRENT_DATE) THEN TRUE ELSE FALSE END AS default_end

    FROM "accountingPeriods".period_by_day AS p
    WHERE p.fiscal_year = (
      SELECT d.fiscal_year
      FROM "accountingPeriods".period_by_day AS d
      WHERE d.formatted_date = CURRENT_DATE
      )
    GROUP BY p.week_serial, p.fiscal_year, p.week, p.period_serial, p.period
    ORDER BY p.week_serial ASC
      `
  return map
}

const getCalMonthsMap = async () => {
  console.log(`query postgres for getCalMonthsMap ...`)

  const map = await sql`
  SELECT 
    DISTINCT ON (p.cal_month_serial) p.cal_month AS cal_month, 
    p.cal_month AS period, -- used to default the end dropdown. Also used to sync the comparison year timeframe with primary year timeframe
    TO_CHAR(MIN(p.formatted_date), 'mm/dd/yy') || ' (' || p.cal_month_serial || ') ' AS display_start,
    TO_CHAR(MAX(p.formatted_date), 'mm/dd/yy') || ' (' || p.cal_month_serial || ') ' AS display_end,
    MIN(p.formatted_date) AS date_start, 
    MAX(p.formatted_date) AS date_end, 
    p.cal_year,  -- used to filter on front end dropdown population
    'cal_months' AS map, 
    FALSE AS "prevent_filterByYear",  -- used to filter on front end dropdown population

    CASE WHEN p.cal_month = (
      SELECT c.cal_month
      FROM "accountingPeriods".period_by_day AS c
      WHERE c.formatted_date = CURRENT_DATE) THEN TRUE ELSE FALSE END AS default_end

  FROM "accountingPeriods".period_by_day AS p

  WHERE p.cal_year <= (
    SELECT d.cal_year
    FROM "accountingPeriods".period_by_day AS d
    WHERE d.formatted_date = CURRENT_DATE
    )
  GROUP BY p.cal_month, p.cal_month_serial, p.cal_year
      `
  return map
}

const getCalQuartersMap = async () => {
  console.log(`query postgres for getCalQuartersMap ...`)

  const map = await sql`
  SELECT 
    DISTINCT ON (p.cal_quarter_serial) p.cal_quarter AS cal_quarter,
    p.cal_quarter AS period, -- used to default the end dropdown. Also used to sync the comparison year timeframe with primary year timeframe
    TO_CHAR(MIN(p.formatted_date), 'mm/dd/yy') || ' (' || p.cal_quarter_serial || ') ' AS display_start,
    TO_CHAR(MAX(p.formatted_date), 'mm/dd/yy') || ' (' || p.cal_quarter_serial || ') ' AS display_end,
    MIN(formatted_date) AS date_start, 
    MAX(formatted_date) AS date_end, 
    p.cal_year,  -- used to filter on front end dropdown population
    'cal_quarters' AS map, 
    FALSE AS "prevent_filterByYear",  -- used to filter on front end dropdown population

    CASE WHEN p.cal_quarter = (
      SELECT c.cal_quarter
      FROM "accountingPeriods".period_by_day AS c
      WHERE c.formatted_date = CURRENT_DATE) THEN TRUE ELSE FALSE END AS default_end

    FROM "accountingPeriods".period_by_day AS p

    WHERE p.cal_year <= (
      SELECT d.cal_year
      FROM "accountingPeriods".period_by_day AS d
      WHERE d.formatted_date = CURRENT_DATE
      )
    GROUP BY p.cal_quarter, p.cal_quarter_serial, p.cal_year
      `
  return map
}

const getCalYearsMap = async () => {
  console.log(`query postgres for getCalYearsMap ...`)

  const map = await sql`
    SELECT 
      DISTINCT ON (p.cal_year) p.cal_year AS cal_year, 
      p.cal_year AS label, 
      p.cal_year AS "dataName", 
      TO_CHAR(MIN(p.formatted_date), 'mm/dd/yy') || ' (' || p.cal_year || ') ' AS display_start,
      TO_CHAR(MAX(p.formatted_date), 'mm/dd/yy') || ' (' || p.cal_year || ') ' AS display_end, 
      MIN(formatted_date) AS date_start, 
      MAX(formatted_date) AS date_end,
      'cal_years' AS map, 
      TRUE AS "prevent_filterByYear",  -- used to filter on front end dropdown population

      CASE WHEN p.cal_year = EXTRACT('year' FROM CURRENT_DATE) THEN TRUE ELSE FALSE END AS default,

      CASE WHEN p.cal_year = EXTRACT('year' FROM CURRENT_DATE) THEN TRUE ELSE FALSE END AS "trueOnNoSelection",

      2 AS "maxSelections"
      
    FROM "accountingPeriods".period_by_day AS p

    WHERE p.cal_year <= (
      SELECT d.cal_year
      FROM "accountingPeriods".period_by_day AS d
      WHERE d.formatted_date = CURRENT_DATE
      )
    GROUP BY p.cal_year
    ORDER BY p.cal_year DESC
      `
  return map
}

const getCalYtdMap = async () => {
  console.log(`query postgres for getCalYtdMap ...`)

  const map = await sql`
      SELECT 
        DISTINCT ON (p.cal_month_serial) p.cal_month AS cal_month, 
        p.cal_month AS period,
        TO_CHAR(MIN(p.formatted_date), 'mm/dd/yy') || ' (' || p.cal_month_serial || ') ' AS display_start,
        TO_CHAR(MAX(p.formatted_date), 'mm/dd/yy') || ' (' || p.cal_month_serial || ') ' AS display_end,
        MIN(p.formatted_date) AS date_start, 
        MAX(p.formatted_date) AS date_end, 
        p.cal_year,
        'cal_ytd' AS map, 
        TRUE AS "prevent_filterByYear",  -- used to filter on front end dropdown population

        CASE WHEN p.cal_month = (
          SELECT c.cal_month
          FROM "accountingPeriods".period_by_day AS c
          WHERE c.formatted_date = CURRENT_DATE) THEN TRUE ELSE FALSE END AS default_end

      FROM "accountingPeriods".period_by_day AS p

      WHERE p.cal_year = (
        SELECT d.cal_year
        FROM "accountingPeriods".period_by_day AS d
        WHERE d.formatted_date = CURRENT_DATE
        )
      GROUP BY cal_month, cal_month_serial, cal_year
      `
  return map
}

module.exports.getFiscalPeriodsMap = getFiscalPeriodsMap
module.exports.getWeeksMap = getWeeksMap
module.exports.getFiscalYearMap = getFiscalYearMap
module.exports.getFiscalQuartersMap = getFiscalQuartersMap
module.exports.getCalMonthsMap = getCalMonthsMap
module.exports.getCalYearsMap = getCalYearsMap
module.exports.getCalQuartersMap = getCalQuartersMap
module.exports.getFiscalYtdMap = getFiscalYtdMap
module.exports.getCalYtdMap = getCalYtdMap
