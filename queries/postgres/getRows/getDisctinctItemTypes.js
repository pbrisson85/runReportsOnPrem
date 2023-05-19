const getDistinctItemTypes = async (program, start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres sales reporting to get item types for ${program} to build rows template ...`)

    const response = await pgClient.query(
      'SELECT DISTINCT(TRIM(master_supplement.item_type)) AS maj_row, \'subtotal\' AS min_row FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE master_supplement.program = $1 AND master_supplement.byproduct_type IS NULL AND sales_line_items.formatted_invoice_date >= $2 AND sales_line_items.formatted_invoice_date <= $3',
      [program, start, end]
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getDistinctItemTypes
