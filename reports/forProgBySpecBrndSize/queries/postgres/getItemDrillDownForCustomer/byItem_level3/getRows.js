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
              
          WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND ms.species = $5 AND ms.brand = $6 AND ms.size_name = $7 AND sales_line_items.customer_code = $8 
          
          GROUP BY ms.item_num, ms.description 
        
        UNION SELECT ms.item_num AS l1_label,  ms.description AS l2_label 
        
          FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
              
          WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) AND ms.species = $5 AND ms.brand = $6 AND ms.size_name = $7 AND sales_orders.customer_code = $8 
          
          GROUP BY ms.item_num, ms.description`,
        [start, end, 'FG', program, filters[0], filters[1], filters[2], filters[3]]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail