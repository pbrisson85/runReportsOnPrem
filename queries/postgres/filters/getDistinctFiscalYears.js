const getDistinctFiscalYears = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get list of programs for filters ...`)

    const response = await pgClient.query(
      'SELECT DISTINCT(sales_line_items.fiscal_year) AS label, sales_line_items.fiscal_year AS "dataName" FROM "salesReporting".sales_line_items'
    )

    const response2 = await pgClient.query('SELECT DISTINCT(sales_line_items.fiscal_year) AS label FROM "salesReporting".sales_line_items')

    console.log(response.rows)
    console.log(response2.rows)

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getDistinctFiscalYears
