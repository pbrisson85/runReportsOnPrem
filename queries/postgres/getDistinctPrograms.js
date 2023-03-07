const getDistinctPrograms = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get list of programs for filters ...`)

    const response = await pgClient.query(
      'SELECT DISTINCT(TRIM(sales_line_items.program)) AS label, (TRIM(sales_line_items.program)) AS "dataName" FROM "salesReporting".sales_line_items WHERE sales_line_items.type = $1 AND sales_line_items.byproduct_type IS NULL',
      ['FG']
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getDistinctPrograms
