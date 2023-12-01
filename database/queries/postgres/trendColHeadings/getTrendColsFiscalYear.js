const sql = require('../../../../server')

const getTrendColsFiscalYear = async config => {
  console.log(
    `${config.user} - getTrendColsCalMonths, query postgres for column periods ${new Date(
      config.trends.startDate
    ).toLocaleDateString()} through ${new Date(config.trends.endDate).toLocaleDateString()} ...`
  )

  const periods = await sql`
    SELECT p.fiscal_year${
      config.trends.fyYtd ? sql`|| '_ytd' ` : sql``
    } AS dataName, TO_CHAR(MAX(p.formatted_date),'MM/DD/YY') AS displayName, MIN(p.formatted_date) AS start_date,  MAX(p.formatted_date) AS end_date
    
    FROM "accountingPeriods".period_by_day AS p
    
    ${config.trends.fyYtd ? sql`WHERE sl.week >= ${1} AND sl.week <= ${config.trends.endWeek}` : sql``}

    GROUP BY p.fiscal_year

    ORDER BY p.fiscal_year ASC`

  return periods
}

module.exports.getTrendColsCalMonths = getTrendColsCalMonths

const getFiscalYearCols = async () => {
  console.log(`query postgres for fiscal years in sales subledger ...`)

  const fys = await sql`SELECT 
      DISTINCT(sl.fiscal_year) AS dataName, 
      sl.fiscal_year AS displayName, TRUE AS fyTrendCol
    FROM "salesReporting".sales_line_items AS sl 
    
    ORDER BY sl.fiscal_year ASC`

  // note that fyTrendCol is used for styling on front end

  return fys
}

const getFiscalYearYtdCols = async (startYear, endYear) => {
  console.log(`query postgres for fiscal years in sales subledger ...`)

  const fys = await sql`SELECT 
      DISTINCT(sl.fiscal_year) || '_ytd' AS dataName, 
      sl.fiscal_year  || ' YTD' AS displayName, TRUE AS fyYtdTrendCol
    FROM "salesReporting".sales_line_items AS sl 

    WHERE sl.fiscal_year >= ${startYear} AND sl.fiscal_year <= ${endYear}
    
    ORDER BY sl.fiscal_year || '_ytd' ASC`

  // note that fyYtdTrendCol is used for styling on front end

  return fys
}

module.exports.getFiscalYearCols = getFiscalYearCols
module.exports.getFiscalYearYtdCols = getFiscalYearYtdCols

module.exports.getTrendColsFiscalYear = getTrendColsFiscalYear
