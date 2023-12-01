const getTrendColsWeeks = async config => {
  console.log(
    `${config.user} - getTrendColsWeeks, query postgres for accounting period ends by week serial for ${new Date(
      config.trends.startDate
    ).toLocaleDateString()} through ${new Date(config.trends.endDate).toLocaleDateString()} ...`
  )

  const periodsByWeek = await sql`
    SELECT p.week_serial AS dataName, p.date_end AS displayName, MIN(p.formatted_date) AS start_date,  MAX(p.formatted_date) AS end_date
    
    FROM "accountingPeriods".p AS p
    
    WHERE p.formatted_date_end >= ${config.trends.startDate} AND p.formatted_date_end <= ${config.trends.endDate} 
    
    GROUP BY p.week_serial

    ORDER BY p.week ASC`

  return periodsByWeek
}

module.exports.getTrendColsWeeks = getTrendColsWeeks
