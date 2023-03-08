const getDistinctBpTypes = async (program, fy) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres sales reporting to get bp types for ${program} to build rows template ...`)

    const response = await pgClient.query(
      'SELECT DISTINCT(TRIM(sales_line_items.byproduct_type)) AS min_row, \'BP\' AS maj_row FROM "salesReporting".sales_line_items WHERE sales_line_items.program = $1 AND sales_line_items.byproduct_type IS NOT NULL AND sales_line_items.fiscal_year = $2',
      [program, fy]
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getDistinctBpTypes
