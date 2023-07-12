const getRowsFirstLevelDetail = async (start, end, program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses ...`)

    const response = await pgClient.query(
        `SELECT ms.item_num AS l1_label,  ms.description AS l2_label 
            FROM "salesReporting".sales_line_items 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sales_line_items.item_number 
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.program = $2 AND ms.species = $3 AND ms.fg_treatment = $4 AND ms.size_name = $5 
             GROUP BY ms.item_num, ms.description 
        
        UNION SELECT ms.item_num AS l1_label,  ms.description AS l2_label 
            FROM "invenReporting".perpetual_inventory 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = perpetual_inventory.item_number 
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.program = $2 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.species = $3 AND ms.fg_treatment = $4 AND ms.size_name = $5 
              GROUP BY ms.item_num, ms.description 
          
        UNION SELECT ms.item_num AS l1_label,  ms.description AS l2_label 
            FROM "salesReporting".sales_orders 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sales_orders.item_num 
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.program = $2 AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) AND ms.species = $3 AND ms.fg_treatment = $4 AND ms.size_name = $5     
             GROUP BY ms.item_num, ms.description`,
        [ 'FG', program, filters[0], filters[1], filters[2]]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail
