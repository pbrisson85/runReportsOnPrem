const sql = require('../../../../server')

const getTrendColsWo = async (config, woActivityGroups) => {
  if (!config.trends.queryGrouping) return []

  console.log(`${config.user} - getTrendColsWo`)

  const eachTimeSeries = []

  for (woActivity of woActivityGroups) {
    const response = await sql`
    SELECT 
      ${sql(config.trends.queryGrouping)} || '_' || ${sql(woActivity)} AS "dataName", 
        TO_CHAR(MAX(p.formatted_date),'MM/DD/YY') AS "displayName", 
        MIN(p.formatted_date) AS "colStartDate",  
        MAX(p.formatted_date) AS "colEndDate",
        TRUE AS "timeSeriesCol",
        'wo_' || ${sql(woActivity)} AS "colType" -- should match the colType as the col that drives what is seen on front end via double click
    
    FROM "accountingPeriods".period_by_day AS p
    
    WHERE p.formatted_date >= ${config.trends.startDate} AND p.formatted_date <= ${config.trends.endDate} 
    
    GROUP BY ${sql(config.trends.queryGrouping)}

    ORDER BY ${sql(config.trends.queryGrouping)} ASC`

    eachTimeSeries.push(...response)
  }

  return eachTimeSeries
}

module.exports = { getTrendColsWo }
