const getRowsFirstLevelDetail = async (start, end, program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses ...`)

    const response = await pgClient.query(
        `SELECT sl.customer_code AS l1_label, sl.customer_name AS l2_label 
          FROM "salesReporting".sales_line_items AS sl
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sl.item_number 
          WHERE sl.formatted_invoice_date >= $1 AND sl.formatted_invoice_date <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 
          
          GROUP BY sl.customer_code, sl.customer_name 
          
        UNION SELECT so.customer_code AS l1_label, so.customer_name AS l2_label 
          FROM "salesReporting".sales_orders AS so
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = so.item_num 
          WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND so.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
          
          GROUP BY so.customer_code, so.customer_name`,
        [start, end, 'FG', program]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail
