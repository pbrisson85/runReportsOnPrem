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
      TO_CHAR(MIN(p.formatted_date),'MM/DD/YY') || ' - ' || TO_CHAR(MAX(p.formatted_date),'MM/DD/YY') AS "displayName", 
      MIN(p.formatted_date) AS "colStartDate", 
      MAX(p.formatted_date) AS "colEndDate",
      TRUE AS "timeSeriesCol",
      'salesInvoice' AS "colType" -- should match the colType as the col that drives what is seen on front end via double click
    
    FROM "accountingPeriods".period_by_day AS p
    
    WHERE 
      ${
        !config.trends.yearTrend
          ? sql`
      p.formatted_date >= ${config.trends.startDate} 
      AND p.formatted_date <= ${config.trends.endDate}`
          : sql`
      ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
      AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
      AND ${sql(config.trends.queryGrouping)} IN ${sql(config.trends.yearTrend.years)}
    `
      }  
    
    GROUP BY ${sql(config.trends.queryGrouping)}

    ORDER BY ${sql(config.trends.queryGrouping)} ASC`

  return periods
}

module.exports.getTrendColsSales = getTrendColsSales
