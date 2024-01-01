const sql = require('../../../../server')

const getTrendColsSales = async config => {
  if (!config.trends.queryGrouping) return []

  console.log(
    `${config.user} - getTrendColsWeeks, query postgres for column periods ${new Date(
      config.trends.startDate
    ).toLocaleDateString()} through ${new Date(config.trends.endDate).toLocaleDateString()} ...`
  )

  const periods = await sql`
    SELECT 
      ${sql(config.trends.queryGrouping)} AS "dataName", 
      TO_CHAR(MAX(p.formatted_date),'MM/DD/YY') AS "displayName", 
      MIN(p.formatted_date) AS "startDate", 
      MAX(p.formatted_date) AS "endDate",
      'salesInvoice' AS "colType" -- should match the colType as the col that drives what is seen on front end via double click
    
    FROM "accountingPeriods".period_by_day AS p
    
    WHERE 
      p.formatted_date >= ${config.trends.startDate} 
      AND p.formatted_date <= ${config.trends.endDate} 
    
    GROUP BY ${sql(config.trends.queryGrouping)}

    ORDER BY ${sql(config.trends.queryGrouping)} ASC`

  return periods
}

module.exports.getTrendColsSales = getTrendColsSales