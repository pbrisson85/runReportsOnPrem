const sql = require('../../../../server')

const getTrendColsCalMonths = async config => {
  console.log(
    `${config.user} - getTrendColsCalMonths, query postgres for column periods ${new Date(
      config.trends.startDate
    ).toLocaleDateString()} through ${new Date(config.trends.endDate).toLocaleDateString()} ...`
  )

  const periods = await sql`
    SELECT p.cal_month_serial AS dataName, TO_CHAR(MAX(p.formatted_date),'MM/DD/YY') AS displayName, MIN(p.formatted_date) AS start_date,  MAX(p.formatted_date) AS end_date
    
    FROM "accountingPeriods".period_by_day AS p
    
    WHERE p.formatted_date >= ${config.trends.startDate} AND p.formatted_date <= ${config.trends.endDate} 
    
    GROUP BY p.cal_month_serial

    ORDER BY p.cal_month_serial ASC`

  return periods
}

module.exports.getTrendColsCalMonths = getTrendColsCalMonths
