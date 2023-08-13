const sql = require('../../../../server')

const getRowsThirdLevelDetail = async (start, end, program) => {
  try {
    console.log(`query postgres to get weekly purchses ...`)

    const response = await sql
        `SELECT ms.species AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label 
        
            FROM "salesReporting".sales_line_items 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sales_line_items.item_number 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} 
            
            GROUP BY ms.species, ms.brand, ms.size_name 
        
        UNION SELECT ms.species AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label 
        
            FROM "invenReporting".perpetual_inventory 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = perpetual_inventory.item_number 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = ${program} 
            
            GROUP BY ms.species, ms.brand, ms.size_name 
        
        UNION SELECT ms.species AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label 
        
            FROM "salesReporting".sales_orders 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sales_orders.item_num 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} 
            
            GROUP BY ms.species, ms.brand, ms.size_name` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const getRowsSecondLevelDetail = async (start, end, program) => {
  try {
    console.log(`query postgres to get weekly purchses ...`)

    const response = await sql
        `SELECT ms.species AS l1_label, ms.brand AS l2_label, 'SUBTOTAL' AS l3_label 
        
            FROM "salesReporting".sales_line_items 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sales_line_items.item_number 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} 
            
            GROUP BY ms.species, ms.brand 
            
        UNION SELECT ms.species AS l1_label, ms.brand AS l2_label, 'SUBTOTAL' AS l3_label 
        
            FROM "invenReporting".perpetual_inventory 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = perpetual_inventory.item_number 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
            
            GROUP BY ms.species, ms.brand 
        
        UNION SELECT ms.species AS l1_label, ms.brand AS l2_label, 'SUBTOTAL' AS l3_label 
        
            FROM "salesReporting".sales_orders 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sales_orders.item_num 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
            
            GROUP BY ms.species, ms.brand` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const getRowsFirstLevelDetail = async (start, end, program) => {
  try {
    console.log(`query postgres to get weekly purchses ...`)

    const response = await sql
        `SELECT ms.species AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label 
        
            FROM "salesReporting".sales_line_items 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sales_line_items.item_number 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} GROUP BY ms.species 
        
        UNION SELECT ms.species AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label 
        
            FROM "invenReporting".perpetual_inventory 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = perpetual_inventory.item_number 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
            
            GROUP BY ms.species 
        
        UNION SELECT ms.species AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label 
        
            FROM "salesReporting".sales_orders 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sales_orders.item_num 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
            
            GROUP BY ms.species` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail
module.exports.getRowsSecondLevelDetail = getRowsSecondLevelDetail
module.exports.getRowsThirdLevelDetail = getRowsThirdLevelDetail
