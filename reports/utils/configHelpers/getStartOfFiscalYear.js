const sql = require('../../../server')

const getStartOfFiscalYear = async () => {
  const periodsByWeek = await sql`
    SELECT 
        min(t.formatted_date) As date
    
    FROM "accountingPeriods".period_by_day AS t 
    
    WHERE 
        AND t.fiscal_year = (
            SELECT 
                ttt.fiscal_year 
            FROM "accountingPeriods".period_by_day AS ttt 
            WHERE ttt.formatted_date = CURRENT_DATE
            )
    `

  return periodsByWeek[0]?.date
}

module.exports = getStartOfFiscalYear
