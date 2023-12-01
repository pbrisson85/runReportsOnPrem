const sql = require('../../../../server')

const getTrendColsWeeks = async config => {
  console.log(
    `${config.user} - getTrendColsWeeks, query postgres for column periods ${new Date(
      config.trends.startDate
    ).toLocaleDateString()} through ${new Date(config.trends.endDate).toLocaleDateString()} ...`
  )

  const periods = await sql`
    SELECT p.week_serial AS dataName, TO_CHAR(MAX(p.formatted_date),'MM/DD/YY') AS displayName, MIN(p.formatted_date) AS start_date,  MAX(p.formatted_date) AS end_date
    
    FROM "accountingPeriods".period_by_day AS p
    
    WHERE p.formatted_date >= ${config.trends.startDate} AND p.formatted_date <= ${config.trends.endDate} 
    
    GROUP BY p.week_serial

    ORDER BY p.week_serial ASC`

  return periods
}

module.exports.getTrendColsWeeks = getTrendColsWeeks
