const sql = require('../../../../server')

const getDistinctFiscalYears = async () => {
  try {
    console.log(`query postgres to get list of programs for filters ...`)

    const response =
      await sql`SELECT DISTINCT(sales_line_items.fiscal_year) AS label, sales_line_items.fiscal_year AS "dataName" FROM "salesReporting".sales_line_items`

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getDistinctFiscalYears
