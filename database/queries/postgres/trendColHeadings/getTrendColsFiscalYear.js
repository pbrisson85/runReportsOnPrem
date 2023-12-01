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
    
    WHERE p.fiscal_year IN ${config.trends.trendYears}
    ${config.trends.fyYtd ? sql` AND sl.week >= ${1} AND sl.week <= ${config.trends.endWeek}` : sql``}

    GROUP BY p.fiscal_year

    ORDER BY p.fiscal_year ASC`

  return periods
}

module.exports.getTrendColsFiscalYear = getTrendColsFiscalYear
