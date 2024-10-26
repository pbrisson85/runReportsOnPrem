const sql = require('../../../server')
const { startOfDay } = require('date-fns')

const getClosestWeekEndDate = async (totalsEndDate, log) => {
  console.log(`query postgres getClosestWeekEndDate (${log}) for totals end date: ${startOfDay(new Date(totalsEndDate))} ...`)

  const closestWeekEndDate = await sql`
        SELECT 
            max(t.formatted_date) As date
        
        FROM "accountingPeriods".period_by_day AS t 
        
        WHERE t.week = (
            SELECT 
                tt.week 
            FROM "accountingPeriods".period_by_day AS tt 
            WHERE tt.formatted_date = ${startOfDay(new Date(totalsEndDate))}
            ) 
            AND t.fiscal_year = (
                SELECT 
                    ttt.fiscal_year 
                FROM "accountingPeriods".period_by_day AS ttt 
                WHERE ttt.formatted_date = ${startOfDay(new Date(totalsEndDate))}
                )
        `

  return closestWeekEndDate[0]?.date
}

module.exports = getClosestWeekEndDate
