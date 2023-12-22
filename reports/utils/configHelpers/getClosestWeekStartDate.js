const sql = require('../../../server')

const getClosestWeekStartDate = async totalsStartDate => {
  console.log(`query postgres getClosestWeekEndDate for totals start date: ${totalsStartDate} ...`)

  const periodsByWeek = await sql`
        SELECT 
            min(t.formatted_date) As date
        
        FROM "accountingPeriods".period_by_day AS t 
        
        WHERE t.week = (
            SELECT 
                tt.week 
            FROM "accountingPeriods".period_by_day AS tt 
            WHERE tt.formatted_date = ${totalsStartDate}) 
        `

  return periodsByWeek[0]?.date
}

module.exports = getClosestWeekStartDate
