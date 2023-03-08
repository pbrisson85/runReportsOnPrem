const getDistinctProcLevels = async (program, fy) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres master supplement to get proc levels for ${program} to build rows template ...`)

    const response = await pgClient.query(
      'SELECT DISTINCT(TRIM(sales_line_items.fg_treatment)) AS min_row, \'FG\' AS maj_row FROM "salesReporting".sales_line_items WHERE sales_line_items.item_type = $1 AND sales_line_items.program = $2 AND sales_line_items.byproduct_type IS NULL AND sales_line_items.fiscal_year = $3',
      ['FG', program, fy]
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getDistinctProcLevels
