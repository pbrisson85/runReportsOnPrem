const sql = require('../../../../../../server')

/*
NOTE TO GET A COMPLETE POPULATION OF ALL POSSIBLE ROW LABELS PERFORMING A UNION OF 

"salesReporting".sales_line_items
"invenReporting".perpetual_inventory <-- Includes PO's
"salesReporting".sales_orders

*/

const getRowsFirstLevelDetail = async (config, start, end, program, filters) => {
  try {
    console.log(`query postgres to get row labels ...`)

    const response = await sql
        `SELECT ms.item_num AS l1_label, ms.description AS l2_label, ${sql(config.l3_field)} AS l3_label 
        
            FROM "salesReporting".sales_line_items 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sales_line_items.item_number 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND ${sql(config.l1_field)} = ${filters[0]} AND ${sql(config.l2_field)} = ${filters[1]} 
            
            GROUP BY ms.item_num, ms.description, ${sql(config.l3_field)} 
        
        UNION SELECT ms.item_num AS l1_label, ms.description AS l2_label, ${sql(config.l3_field)} AS l3_label 
        
            FROM "invenReporting".perpetual_inventory 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = perpetual_inventory.item_number 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ${sql(config.l1_field)} = ${filters[0]} AND ${sql(config.l2_field)} = ${filters[1]} 
            
            GROUP BY ms.item_num, ms.description, ${sql(config.l3_field)} 
        
        UNION SELECT ms.item_num AS l1_label, ms.description AS l2_label, ${sql(config.l3_field)} AS l3_label 
        
            FROM "salesReporting".sales_orders 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sales_orders.item_num 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) AND ${sql(config.l1_field)} = ${filters[0]} AND ${sql(config.l2_field)} = ${filters[1]} 
            
            GROUP BY ms.item_num, ms.description, ${sql(config.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail
