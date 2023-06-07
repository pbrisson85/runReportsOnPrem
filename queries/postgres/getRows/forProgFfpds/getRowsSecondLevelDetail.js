const getRowsSecondLevelDetail = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses ...`)

    const response = await pgClient.query(
        'SELECT master_supplement.fg_fresh_frozen AS maj_row, \'STATE SUBTOTAL\' AS min_row FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 AND master_supplement.program = $4 GROUP BY master_supplement.fg_fresh_frozen UNION SELECT master_supplement.fg_fresh_frozen AS maj_row, \'STATE SUBTOTAL\' AS min_row FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 AND master_supplement.program = $4 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) GROUP BY master_supplement.fg_fresh_frozen, master_supplement.fg_treatment',
        [start, end, 'FG', program]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsSecondLevelDetail = getRowsSecondLevelDetail
