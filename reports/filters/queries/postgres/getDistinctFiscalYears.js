const getDistinctFiscalYears = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get list of programs for filters ...`)

    const response = await pgClient.query(
      'SELECT DISTINCT(sales_line_items.fiscal_year) AS label, sales_line_items.fiscal_year AS "dataName" FROM "salesReporting".sales_line_items'
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getDistinctFiscalYears
