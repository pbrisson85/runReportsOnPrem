/*
NOTE TO GET A COMPLETE POPULATION OF ALL POSSIBLE ROW LABELS PERFORMING A UNION OF 

"salesReporting".sales_line_items
"invenReporting".perpetual_inventory <-- includes POs
"salesReporting".sales_orders

*/

const getLevelOneRows = async (start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses ...`)

    const response = await pgClient.query(
        'SELECT master_supplement.species_group AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 GROUP BY master_supplement.species_group UNION SELECT master_supplement.species_group AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) GROUP BY master_supplement.species_group, master_supplement.program UNION SELECT master_supplement.species_group AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_orders.item_num WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) GROUP BY master_supplement.species_group, master_supplement.program',
        [start, end, 'FG']
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const getLevelTwoRows = async (start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses ...`)

    // Note that pulling the same query form the sales data and the inventory data and using a union because we may have inventory oin hand that does not have sales and the row will not exist otherwise

    const response = await pgClient.query(
        'SELECT master_supplement.species_group AS l1_subtotal, master_supplement.program AS l2_subtotal FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 GROUP BY master_supplement.species_group, master_supplement.program UNION SELECT master_supplement.species_group AS l1_subtotal, master_supplement.program AS l2_subtotal FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) GROUP BY master_supplement.species_group, master_supplement.program UNION SELECT master_supplement.species_group AS l1_subtotal, master_supplement.program AS l2_subtotal FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_orders.item_num WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) GROUP BY master_supplement.species_group, master_supplement.program',
        [start, end, 'FG']
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getLevelTwoRows = getLevelTwoRows
module.exports.getLevelOneRows = getLevelOneRows
