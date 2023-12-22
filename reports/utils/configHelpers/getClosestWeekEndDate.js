const sql = require('../../../server')

const getClosestWeekEndDate = async totalsEndDate => {
  console.log(`query postgres getClosestWeekEndDate for totals end date: ${totalsEndDate} ...`)

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
        `

  return closestWeekEndDate[0]?.date
}

module.exports = getClosestWeekEndDate