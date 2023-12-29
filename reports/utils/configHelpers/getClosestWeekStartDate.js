const sql = require('../../../server')

const getClosestWeekStartDate = async (totalsStartDate, log) => {
  console.log(`query postgres getClosestWeekStartDate (${log}) for totals start date: ${totalsStartDate} ...`)

  const closestWeekStartDate = await sql`
        SELECT 
            min(t.formatted_date) As date
        
        FROM "accountingPeriods".period_by_day AS t 
        
        WHERE 
            t.week = (
                SELECT 
                    tt.week 
                FROM "accountingPeriods".period_by_day AS tt 
                WHERE tt.formatted_date = ${totalsStartDate}
                )
            AND t.fiscal_year = (
                SELECT 
                    ttt.fiscal_year 
                FROM "accountingPeriods".period_by_day AS ttt 
                WHERE ttt.formatted_date = ${totalsStartDate}
                )
        `

  console.log(`closestWeekStartDate (${log}): ${closestWeekStartDate}`)

  return closestWeekStartDate[0]?.date
}

module.exports = getClosestWeekStartDate
