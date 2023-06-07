const getRowsThirdLevelDetail = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses ...`)

    // Note that pulling the same query form the sales data and the inventory data and using a union because we may have inventory on hand that does not have sales and the row will not exist otherwise

    const response = await pgClient.query(
        'SELECT master_supplement.fg_fresh_frozen AS maj_row, master_supplement.fg_treatment AS min_row, master_supplement.size_name AS thrid_row FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 AND master_supplement.program = $4 GROUP BY master_supplement.fg_fresh_frozen, master_supplement.fg_treatment, master_supplement.size_name UNION SELECT master_supplement.fg_fresh_frozen AS maj_row, master_supplement.fg_treatment AS min_row, master_supplement.size_name AS thrid_row FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND master_supplement.program = $4 GROUP BY master_supplement.fg_fresh_frozen, master_supplement.fg_treatment, master_supplement.size_name',
        [start, end, 'FG', program]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const getRowsSecondLevelDetail = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses ...`)

    const response = await pgClient.query(
        'SELECT master_supplement.fg_fresh_frozen AS maj_row, master_supplement.fg_treatment AS min_row, \'PROC SUBTOTAL\' AS third_row FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 AND master_supplement.program = $4 GROUP BY master_supplement.fg_fresh_frozen, master_supplement.fg_treatment UNION SELECT master_supplement.fg_fresh_frozen AS maj_row, master_supplement.fg_treatment AS min_row, \'PROC SUBTOTAL\' AS third_row FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 AND master_supplement.program = $4 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) GROUP BY master_supplement.fg_fresh_frozen, master_supplement.fg_treatment',
        [start, end, 'FG', program]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const getRowsFirstLevelDetail = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses ...`)

    const response = await pgClient.query(
        'SELECT master_supplement.fg_fresh_frozen AS maj_row, \'FREEZE SUBTOTAL\' AS min_row, \'FREEZE SUBTOTAL\' AS third_row FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 AND master_supplement.program = $4 GROUP BY master_supplement.fg_fresh_frozen UNION SELECT master_supplement.fg_fresh_frozen AS maj_row, \'FREEZE SUBTOTAL\' AS min_row, \'FREEZE SUBTOTAL\' AS third_row FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 AND master_supplement.program = $4 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) GROUP BY master_supplement.fg_fresh_frozen',
        [start, end, 'FG', program]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail
module.exports.getRowsSecondLevelDetail = getRowsSecondLevelDetail
module.exports.getRowsThirdLevelDetail = getRowsThirdLevelDetail
