/*
NOTE TO GET A COMPLETE POPULATION OF ALL POSSIBLE ROW LABELS PERFORMING A UNION OF 

"salesReporting".sales_line_items
"invenReporting".perpetual_inventory <-- Includes PO's
"salesReporting".sales_orders

*/

const getRowsFirstLevelDetail = async (start, end, program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses ...`)

    const response = await pgClient.query(
        `SELECT ms.item_num AS l1_label, ms.description AS l2_label, ms.fg_treatment AS l3_label , ms.size_name AS l4_label 
          FROM "salesReporting".sales_line_items 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
          
            WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND ms.species = $5 
          
          GROUP BY ms.item_num, ms.description, ms.fg_treatment, ms.size_name 
          
        UNION SELECT ms.item_num AS l1_label, ms.description AS l2_label, ms.fg_treatment AS l3_label , ms.size_name AS l4_label 
          FROM "invenReporting".perpetual_inventory 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = perpetual_inventory.item_number 
          
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.species = $5 
          
          GROUP BY ms.item_num, ms.description, ms.fg_treatment, ms.size_name 
          
        UNION SELECT ms.item_num AS l1_label, ms.description AS l2_label, ms.fg_treatment AS l3_label , ms.size_name AS l4_label 
          FROM "salesReporting".sales_orders 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_orders.item_num 
          
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) AND ms.species = $5 
          
          GROUP BY ms.item_num, ms.description, ms.fg_treatment, ms.size_name`,
        [start, end, 'FG', program, filters[0]]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail
