const sql = require('../../../server')

const getClosestWeekEndDate = async (totalsEndDate, log) => {
  console.log(`query postgres getClosestWeekEndDate (${log}) for totals end date: ${totalsEndDate} ...`)

  const closestWeekEndDate = await sql`
        SELECT 
            max(t.formatted_date) As date
        
        FROM "accountingPeriods".period_by_day AS t 
        
        WHERE t.week = (
            SELECT 
                tt.week 
            FROM "accountingPeriods".period_by_day AS tt 
            WHERE tt.formatted_date = ${totalsEndDate}
            ) 
            AND t.fiscal_year = (
                SELECT 
                    ttt.fiscal_year 
                FROM "accountingPeriods".period_by_day AS ttt 
                WHERE ttt.formatted_date = ${totalsEndDate}
                )
        `

  console.log(`closestWeekEndDate (${log}): ${JSON.stringify(closestWeekEndDate)}`)

  return closestWeekEndDate[0]?.date
}

module.exports = getClosestWeekEndDate
