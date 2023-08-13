const sql = require('../../../../server')

const getRowsThirdLevelDetail = async (config, start, end, program) => {
  try {
    console.log(`query postgres to get weekly purchses ...`)

    const response = await sql
        `SELECT ${config.l1_field} AS l1_label, ${config.l2_field} AS l2_label, ${config.l3_field} AS l3_label 
        
          FROM "salesReporting".sales_line_items 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_line_items.item_number 
        
          WHERE sales_line_items.formatted_invoice_date >= ${start} AND sales_line_items.formatted_invoice_date <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} 
          
          GROUP BY ${config.l1_field}, ${config.l2_field}, ${config.l3_field} 
        
        UNION SELECT ${config.l1_field} AS l1_label, ${config.l2_field} AS l2_label, ${config.l3_field} AS l3_label 
        
          FROM "invenReporting".perpetual_inventory 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = perpetual_inventory.item_number 
        
          WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = ${program} 
          
          GROUP BY ${config.l1_field}, ${config.l2_field}, ${config.l3_field} 
        
        UNION SELECT ${config.l1_field} AS l1_label, ${config.l2_field} AS l2_label, ${config.l3_field} AS l3_label 
        
          FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
        
          WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} 
          
          GROUP BY ${config.l1_field}, ${config.l2_field}, ${config.l3_field}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const getRowsSecondLevelDetail = async (config, start, end, program) => {
  try {
    console.log(`query postgres to get weekly purchses ...`)

    const response = await sql
        `SELECT ${config.l1_field} AS l1_label, ${config.l2_field} AS l2_label, 'SUBTOTAL' AS l3_label 
        
          FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number 
        
          WHERE sales_line_items.formatted_invoice_date >= ${start} AND sales_line_items.formatted_invoice_date <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} 
          
          GROUP BY ${config.l1_field}, ${config.l2_field} 
        
        UNION SELECT ${config.l1_field} AS l1_label, ${config.l2_field} AS l2_label, 'SUBTOTAL' AS l3_label 
        
          FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
        
          WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
          
          GROUP BY ${config.l1_field}, ${config.l2_field} 
        
        UNION SELECT ${config.l1_field} AS l1_label, ${config.l2_field} AS l2_label, 'SUBTOTAL' AS l3_label 
        
          FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
        
          WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
          
          GROUP BY ${config.l1_field}, ${config.l2_field}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const getRowsFirstLevelDetail = async (config, start, end, program) => {
  try {
    console.log(`query postgres to get weekly purchses ...`)

    const response = await sql
        `SELECT ${config.l1_field} AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label 
        
          FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number 
          
          WHERE sales_line_items.formatted_invoice_date >= ${start} AND sales_line_items.formatted_invoice_date <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} 
          
          GROUP BY ${config.l1_field} 
        
        UNION SELECT ${config.l1_field} AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label 
        
          FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
          
          WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
          
          GROUP BY ${config.l1_field} 
        
        UNION SELECT ${config.l1_field} AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label 
        
          FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
          
          WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
          
          GROUP BY ${config.l1_field}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail
module.exports.getRowsSecondLevelDetail = getRowsSecondLevelDetail
module.exports.getRowsThirdLevelDetail = getRowsThirdLevelDetail
