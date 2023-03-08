const getDistinctItemTypes = async (program, fy) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres sales reporting to get item types for ${program} to build rows template ...`)

    const response = await pgClient.query(
      'SELECT DISTINCT(TRIM(salesReporting.item_type)) AS maj_row, \'subtotal\' AS min_row FROM "salesReporting".sales_line_items WHERE sales_line_items.program = $1 AND sales_line_items.byproduct_type IS NULL AND sales_line_items.fiscal_year = $2',
      [program, fy]
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getDistinctItemTypes
