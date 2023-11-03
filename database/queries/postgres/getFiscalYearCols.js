const sql = require('../../../server')

const getFiscalYearCols = async () => {
  console.log(`query postgres for fiscal years in sales subledger ...`)

  const fys = await sql`SELECT 
      DISTINCT(sl.fiscal_year) AS dataName, 
      sl.fiscal_year AS displayName, TRUE AS fyTrendCol
    FROM "salesReporting".sales_line_items AS sl 
    
    ORDER BY sl.fiscal_year ASC`

  // note that fyTrendCol is used for styling on front end

  return fys
}

const getFiscalYearYtdCols = async (startYear, endYear) => {
  console.log(`query postgres for fiscal years in sales subledger ...`)

  const fys = await sql`SELECT 
      DISTINCT(sl.fiscal_year) || '_ytd' AS dataName, 
      sl.fiscal_year  || ' YTD' AS displayName, TRUE AS fyYtdTrendCol
    FROM "salesReporting".sales_line_items AS sl 

    WHERE sl.fiscal_year >= ${startYear} AND sl.fiscal_year <= ${endYear}
    
    ORDER BY sl.fiscal_year || '_ytd' ASC`

  // note that fyYtdTrendCol is used for styling on front end

  return fys
}

module.exports.getFiscalYearCols = getFiscalYearCols
module.exports.getFiscalYearYtdCols = getFiscalYearYtdCols
