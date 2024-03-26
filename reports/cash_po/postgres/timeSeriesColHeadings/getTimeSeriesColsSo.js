const sql = require('../../../../server')

const getTrendColsSo = async config => {
  if (!config.dates.trends.queryGrouping) return []

  console.log(
    `${config.user} - getDateEndPerWeekByRange_so, query postgres for accounting period ends by week serial for ${new Date(
      config.dates.salesOrders.startDate
    ).toLocaleDateString()} through ${new Date(config.dates.salesOrders.endDate).toLocaleDateString()} ...`
  )

  const periods = await sql`
    SELECT 
      ${sql(config.dates.trends.queryGrouping)} || '_so' AS "dataName", 
        TO_CHAR(MIN(p.formatted_date),'MM/DD/YY') || ' - ' || TO_CHAR(MAX(p.formatted_date),'MM/DD/YY') || ' (' || ${sql(config.dates.trends.queryGrouping)} || ')'  AS "displayName", 
        MIN(p.formatted_date) AS "colStartDate",  
        MAX(p.formatted_date) AS "colEndDate",
        TRUE AS "timeSeriesCol",
        'salesOrder' AS "colType" -- should match the colType as the col that drives what is seen on front end via double click
    
    FROM "accountingPeriods".period_by_day AS p
    
    WHERE p.formatted_date >= ${config.dates.salesOrders.startDate} AND p.formatted_date <= ${config.dates.salesOrders.endDate}
    
    GROUP BY ${sql(config.dates.trends.queryGrouping)}

    ORDER BY ${sql(config.dates.trends.queryGrouping)} ASC`

  return periods
} //prettier-ignore

module.exports.getTrendColsSo = getTrendColsSo
