const sql = require('../../../../../../server')

const getRowsFirstLevelDetail = async (config, start, end, program, filters) => {
  try {
    console.log(`query postgres to get weekly purchses ...`)

    const response = await sql
        `SELECT ms.item_num AS l1_label, ms.description AS l2_label, ${sql(config.l2_field)} AS l3_label , ${sql(config.l3_field)} AS l4_label 
          FROM "salesReporting".sales_line_items 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
          
            WHERE sales_line_items.formatted_invoice_date >= ${start} AND sales_line_items.formatted_invoice_date <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND ${sql(config.l1_field)} = ${filters[0]} 
          
          GROUP BY ms.item_num, ms.description, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
          
        UNION SELECT ms.item_num AS l1_label, ms.description AS l2_label, ${sql(config.l2_field)} AS l3_label , ${sql(config.l3_field)} AS l4_label 
          FROM "invenReporting".perpetual_inventory 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = perpetual_inventory.item_number 
          
            WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ${sql(config.l1_field)} = ${filters[0]} 
          
          GROUP BY ms.item_num, ms.description, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
          
        UNION SELECT ms.item_num AS l1_label, ms.description AS l2_label, ${sql(config.l2_field)} AS l3_label , ${sql(config.l3_field)} AS l4_label 
          FROM "salesReporting".sales_orders 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_orders.item_num 
          
            WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) AND ${sql(config.l1_field)} = ${filters[0]} 
          
          GROUP BY ms.item_num, ms.description, ${sql(config.l2_field)}, ${sql(config.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail
