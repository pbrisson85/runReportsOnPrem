const getRowsFirstLevelDetail = async (start, end, program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get row labels ...`)

    const response = await pgClient.query(
        `SELECT ms.item_num AS l1_label, ms.description AS l2_label, ms.fg_treatment AS l3_label , ms.size_name AS l4_label 
          FROM "salesReporting".sales_line_items 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
          
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.species_group = $2 AND sales_line_items.customer_code = $3 
          
          GROUP BY ms.item_num, ms.description, ms.fg_treatment, ms.size_name 
          
          UNION SELECT ms.item_num AS l1_label, ms.description AS l2_label, ms.fg_treatment AS l3_label , ms.size_name AS l4_label 
          FROM "salesReporting".sales_orders 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_orders.item_num 
          
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) AND ms.species_group = $2 AND sales_orders.customer_code = $3 
          
          GROUP BY ms.item_num, ms.description, ms.fg_treatment, ms.size_name`,
        ['FG', filters[0], filters[3]]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail
