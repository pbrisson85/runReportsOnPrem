const getLevelOneRows = async (start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses ...`)

    const response = await pgClient.query(
      ` SELECT ms.species_group AS l1_label, \'SUBTOTAL\' AS l2_label 
        
          FROM "salesReporting".sales_line_items 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_line_items.item_number 
              
          WHERE sales_line_items.week >= $1 AND sales_line_items.week <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 
          
          GROUP BY ms.species_group 
        
        UNION SELECT ms.species_group AS l1_label, \'SUBTOTAL\' AS l2_label 
          
          FROM "invenReporting".perpetual_inventory 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = perpetual_inventory.item_number 
              
          WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
          
          GROUP BY ms.species_group, ms.program 
        
        UNION SELECT ms.species_group AS l1_label, \'SUBTOTAL\' AS l2_label 
      
          FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
              
          WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
          
          GROUP BY ms.species_group, ms.program`,
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
        `SELECT ms.species_group AS l1_label, ms.program AS l2_label 
        
          FROM "salesReporting".sales_line_items 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_line_items.item_number 
              
          WHERE sales_line_items.week >= $1 AND sales_line_items.week <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 
          
          GROUP BY ms.species_group, ms.program 
        
        UNION SELECT ms.species_group AS l1_label, ms.program AS l2_label 
        
          FROM "invenReporting".perpetual_inventory 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = perpetual_inventory.item_number 
              
          WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
          
          GROUP BY ms.species_group, ms.program 
          
        UNION SELECT ms.species_group AS l1_label, ms.program AS l2_label 
          
          FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
              
          WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
          
          GROUP BY ms.species_group, ms.program`,
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
