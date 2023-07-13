/*
NOTE TO GET A COMPLETE POPULATION OF ALL POSSIBLE ROW LABELS PERFORMING A UNION OF 

"salesReporting".sales_line_items
"invenReporting".perpetual_inventory <-- Includes PO's
"salesReporting".sales_orders

*/

const getRowsThirdLevelDetail = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses ...`)

    const response = await pgClient.query(
        `SELECT ms.species AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label 
        
            FROM "salesReporting".sales_line_items 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sales_line_items.item_number 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.program = $2 
            
            GROUP BY ms.species, ms.brand, ms.size_name 
        
        UNION SELECT ms.species AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label 
        
            FROM "invenReporting".perpetual_inventory 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = perpetual_inventory.item_number 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2 
            
            GROUP BY ms.species, ms.brand, ms.size_name 
        
        UNION SELECT ms.species AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label 
        
            FROM "salesReporting".sales_orders 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sales_orders.item_num 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 
            
            GROUP BY ms.species, ms.brand, ms.size_name`,
        [ 'FG', program]
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
        `SELECT ms.species AS l1_label, ms.brand AS l2_label, \'SUBTOTAL\' AS l3_label 
        
            FROM "salesReporting".sales_line_items 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sales_line_items.item_number 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.program = $2 
            
            GROUP BY ms.species, ms.brand 
            
        UNION SELECT ms.species AS l1_label, ms.brand AS l2_label, \'SUBTOTAL\' AS l3_label 
        
            FROM "invenReporting".perpetual_inventory 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = perpetual_inventory.item_number 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.program = $2 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
            
            GROUP BY ms.species, ms.brand 
        
        UNION SELECT ms.species AS l1_label, ms.brand AS l2_label, \'SUBTOTAL\' AS l3_label 
        
            FROM "salesReporting".sales_orders 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sales_orders.item_num 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.program = $2 AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
            
            GROUP BY ms.species, ms.brand`,
        [ 'FG', program]
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
        `SELECT ms.species AS l1_label, \'SUBTOTAL\' AS l2_label, \'SUBTOTAL\' AS l3_label 
        
            FROM "salesReporting".sales_line_items 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sales_line_items.item_number 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.program = $2 GROUP BY ms.species 
        
        UNION SELECT ms.species AS l1_label, \'SUBTOTAL\' AS l2_label, \'SUBTOTAL\' AS l3_label 
        
            FROM "invenReporting".perpetual_inventory 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = perpetual_inventory.item_number 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.program = $2 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
            
            GROUP BY ms.species 
        
        UNION SELECT ms.species AS l1_label, \'SUBTOTAL\' AS l2_label, \'SUBTOTAL\' AS l3_label 
        
            FROM "salesReporting".sales_orders 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sales_orders.item_num 
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.program = $2 AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
            
            GROUP BY ms.species`,
        [ 'FG', program]
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