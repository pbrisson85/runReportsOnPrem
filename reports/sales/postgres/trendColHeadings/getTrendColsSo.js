const sql = require('../../../../server')

const getTrendColsSo = async config => {
  if (!config.trends.queryGrouping) return []

  console.log(
    `${config.user} - getDateEndPerWeekByRange_so, query postgres for accounting period ends by week serial for ${new Date(
      config.salesOrders.startDate
    ).toLocaleDateString()} through ${new Date(config.salesOrders.endDate).toLocaleDateString()} ...`
  )

  const periods = await sql`
    SELECT 
      ${sql(config.trends.queryGrouping)} || '_so' AS "dataName", 
        TO_CHAR(MAX(p.formatted_date),'MM/DD/YY') AS "displayName", 
        MIN(p.formatted_date) AS "startDate",  
        MAX(p.formatted_date) AS "endDate",
        'salesOrder' AS "colType" -- should match the colType as the col that drives what is seen on front end via double click
    
    FROM "accountingPeriods".period_by_day AS p
    
    WHERE p.formatted_date >= ${config.salesOrders.startDate} AND p.formatted_date <= ${config.salesOrders.endDate} 
    
    GROUP BY ${sql(config.trends.queryGrouping)}

    ORDER BY ${sql(config.trends.queryGrouping)} ASC`

  return periods
}

const getTrendColsSoTagged = async config => {
  console.log(
    `${config.user} - getDateEndPerWeekByRange_so, query postgres for accounting period ends by week serial for ${new Date(
      config.salesOrders.startDate
    ).toLocaleDateString()} through ${new Date(config.salesOrders.endDate).toLocaleDateString()} ...`
  )

  const periods = await sql`
    SELECT 
      ${sql(config.trends.queryGrouping)} || '_so_tg' AS dataName, 
        TO_CHAR(MAX(p.formatted_date),'MM/DD/YY') AS displayName, 
        MIN(p.formatted_date) AS start_date,  
        MAX(p.formatted_date) AS end_date
    
    FROM "accountingPeriods".period_by_day AS p
    
    WHERE p.formatted_date >= ${config.salesOrders.startDate} AND p.formatted_date <= ${config.salesOrders.endDate} 
    
    GROUP BY ${sql(config.trends.queryGrouping)}

    ORDER BY ${sql(config.trends.queryGrouping)} ASC`

  return periods
}

const getTrendColsSoUntagged = async config => {
  console.log(
    `${config.user} - getDateEndPerWeekByRange_so, query postgres for accounting period ends by week serial for ${new Date(
      config.salesOrders.startDate
    ).toLocaleDateString()} through ${new Date(config.salesOrders.endDate).toLocaleDateString()} ...`
  )

  const periods = await sql`
    SELECT 
      ${sql(config.trends.queryGrouping)} || '_so_untg' AS dataName, 
        TO_CHAR(MAX(p.formatted_date),'MM/DD/YY') AS displayName, 
        MIN(p.formatted_date) AS start_date,  
        MAX(p.formatted_date) AS end_date
    
    FROM "accountingPeriods".period_by_day AS p
    
    WHERE p.formatted_date >= ${config.salesOrders.startDate} AND p.formatted_date <= ${config.salesOrders.endDate} 
    
    GROUP BY ${sql(config.trends.queryGrouping)}

    ORDER BY ${sql(config.trends.queryGrouping)} ASC`

  return periods
}

module.exports.getTrendColsSo = getTrendColsSo
module.exports.getTrendColsSoTagged = getTrendColsSoTagged
module.exports.getTrendColsSoUntagged = getTrendColsSoUntagged
