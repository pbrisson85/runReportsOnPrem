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
        `SELECT sl.customer_code AS l1_label, sl.customer_name AS l2_label 
          FROM "salesReporting".sales_line_items AS sl
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sl.item_number 
          WHERE sl.formatted_invoice_date >= $1 AND sl.formatted_invoice_date <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND ms.fg_fresh_frozen = $5 AND ms.fg_treatment = $6 AND ms.size_name = $7 
          
          GROUP BY sl.customer_code, sl.customer_name 
          
        UNION SELECT so.customer_code AS l1_label, so.customer_name AS l2_label 
          FROM "salesReporting".sales_orders AS so
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = so.item_num 
          WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND so.version = (SELECT MAX(so.version) - 1 FROM "salesReporting".sales_orders) AND ms.fg_fresh_frozen = $5 AND ms.fg_treatment = $6 AND ms.size_name = $7 
          
          GROUP BY so.customer_code, so.customer_name`,
        [start, end, 'FG', program, filters[0], filters[1], filters[2]]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail
