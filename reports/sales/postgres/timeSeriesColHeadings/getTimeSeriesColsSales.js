const sql = require('../../../../server')

const getTrendColsSales = async config => {
  if (!config.dates.trends.queryGrouping) return []

  console.log(
    `${config.user} - getTrendColsWeeks, query postgres for column periods ${new Date(
      config.dates.trends.startDate
    ).toLocaleDateString()} through ${new Date(config.dates.trends.endDate).toLocaleDateString()} ...`
  )

  const periods = await sql`
    SELECT 
      ${sql(config.dates.trends.queryGrouping)} AS "dataName", 
      TO_CHAR(MIN(p.formatted_date),'MM/DD/YY') || ' - ' || TO_CHAR(MAX(p.formatted_date),'MM/DD/YY') || ' (' || ${sql(config.dates.trends.queryGrouping)} || ')' AS "displayName", 
      MIN(p.formatted_date) AS "colStartDate", 
      MAX(p.formatted_date) AS "colEndDate",
      TRUE AS "timeSeriesCol",
      'salesInvoice' AS "colType" -- should match the colType as the col that drives what is seen on front end via double click
    
    FROM "accountingPeriods".period_by_day AS p
    
    WHERE 
      ${
        !config.dates.trends.yearTrend
          ? sql`
      p.formatted_date >= ${config.dates.trends.startDate} 
      AND p.formatted_date <= ${config.dates.trends.endDate}`
          : sql`
      ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
      AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
      AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
    `
      }  
    
    GROUP BY ${sql(config.dates.trends.queryGrouping)}

    ORDER BY ${sql(config.dates.trends.queryGrouping)} ASC`

  return periods
} //prettier-ignore

module.exports.getTrendColsSales = getTrendColsSales
