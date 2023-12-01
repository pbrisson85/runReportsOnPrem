const sql = require('../../../../server')

const getTrendColsFiscalQuarters = async config => {
  console.log(
    `${config.user} - getTrendColsFiscalQuarters, query postgres for column periods ${new Date(
      config.trends.startDate
    ).toLocaleDateString()} through ${new Date(config.trends.endDate).toLocaleDateString()} ...`
  )

  const periods = await sql`
    SELECT p.quarter_serial AS dataName, TO_CHAR(MAX(p.formatted_date),'MM/DD/YY') AS displayName, MIN(p.formatted_date) AS start_date,  MAX(p.formatted_date) AS end_date
    
    FROM "accountingPeriods".period_by_day AS p
    
    WHERE p.formatted_date >= ${config.trends.startDate} AND p.formatted_date <= ${config.trends.endDate} 
    
    GROUP BY p.quarter_serial

    ORDER BY p.quarter_serial ASC`

  return periods
}

module.exports.getTrendColsFiscalQuarters = getTrendColsFiscalQuarters
