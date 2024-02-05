const sql = require('../../../../server')

const getTrendColsWo = async config => {
  if (!config.dates.trends.queryGrouping) return []

  console.log(`${config.user} - getTrendColsWo`)

  // closest so far: || ${sql`'_${sql(woActivity)}'`}

  try {
    const eachTimeSeries = []

    for (woActivity of config.baseFilters.wo.woActivities) {
      const response = await sql`
      SELECT 
          ${sql(config.dates.trends.queryGrouping)} || ${sql`REPLACE('_${sql(woActivity)}','"', '')`} AS "dataName", 
          TO_CHAR(MAX(p.formatted_date),'MM/DD/YY') || ${sql`REPLACE(' ${sql(woActivity)}','"', '')`} AS "displayName", 
          MIN(p.formatted_date) AS "colStartDate",  
          MAX(p.formatted_date) AS "colEndDate",
          TRUE AS "timeSeriesCol",
          'wo' || ${sql`REPLACE('_${sql(woActivity)}','"', '')`} AS "colType" -- should match the colType as the col that drives what is seen on front end via double click
      
      FROM "accountingPeriods".period_by_day AS p
      
      WHERE p.formatted_date >= ${config.dates.trends.startDate} AND p.formatted_date <= ${config.dates.trends.endDate} 
      
      GROUP BY ${sql(config.dates.trends.queryGrouping)} 
  
      ORDER BY ${sql(config.dates.trends.queryGrouping)} ASC` //prettier-ignore

      eachTimeSeries.push(...response)
    }

    return eachTimeSeries
  } catch (error) {
    console.log(error)
    console.log(error.query)
  }
}

module.exports = { getTrendColsWo }
