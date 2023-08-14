const sql = require('../../../../../../server')

const getRowsFirstLevelDetail = async (config, start, end, program, filters) => {
  try {
    console.log(`query postgres to get row labels ...`)

    const response = await sql
        `SELECT ms.item_num AS l1_label,  ms.description AS l2_label 
        
          FROM "salesReporting".sales_line_items 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_line_items.item_number 
              
          WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND ms.species = ${filters[0]} AND ms.brand = ${filters[1]} AND ms.size_name = ${filters[2]} AND sales_line_items.customer_code = ${filters[3]}
          
          GROUP BY ms.item_num, ms.description 
        
        UNION SELECT ms.item_num AS l1_label,  ms.description AS l2_label 
        
          FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
              
          WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) AND ms.species = ${filters[0]} AND ms.brand = ${filters[1]} AND ms.size_name = ${filters[2]} AND sales_orders.customer_code = ${filters[3]} 
          
          GROUP BY ms.item_num, ms.description` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail
