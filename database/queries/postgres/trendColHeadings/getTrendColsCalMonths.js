const sql = require('../../../../server')

const getTrendColsCalMonths = async config => {
  const periodsByWeek = await sql`
    SELECT p.cal_month_serial AS dataName, TO_CHAR(MAX(p.formatted_date),'MM/DD/YY') AS displayName, MIN(p.formatted_date) AS start_date,  MAX(p.formatted_date) AS end_date
    
    FROM "accountingPeriods".period_by_day AS p
    
    WHERE p.formatted_date >= ${config.trends.startDate} AND p.formatted_date <= ${config.trends.endDate} 
    
    GROUP BY p.cal_month_serial

    ORDER BY p.cal_month_serial ASC`

  return periodsByWeek
}

module.exports.getTrendColsCalMonths = getTrendColsCalMonths
