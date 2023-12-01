const sql = require('../../../../server')

const getCalMonthByRange = async config => {
  const periodsByWeek = await sql`
    SELECT p.cal_month_serial AS dataName, p.cal_month_serial AS displayName, MIN(p.formatted_date) AS start_date,  MAX(p.formatted_date) AS end_date
    
    FROM "accountingPeriods".period_by_day AS p
    
    WHERE p.formatted_date >= ${config.trends.startDate} AND p.formatted_date <= ${config.trends.endDate} 
    
    GROUP BY p.cal_month_serial

    ORDER BY p.cal_month_serial ASC`

  console.log('periodsByWeek', periodsByWeek)

  return periodsByWeek
}

module.exports.getCalMonthByRange = getCalMonthByRange
