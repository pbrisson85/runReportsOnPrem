const sql = require('../../../../../../server')

const getRowsFirstLevelDetail = async (config, start, end, program, filters) => {
  try {
    console.log(`query postgres to get row labels ...`)

    const response = await sql
        `SELECT ms.item_num AS l1_label, ms.description AS l2_label, ${sql(config.l2_field)} AS l3_label , ${sql(config.l3_field)} AS l4_label 
          FROM "salesReporting".sales_line_items 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
          
            WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} ${program ? sql`AND ms.program = ${program}`: sql``} AND ${sql(config.l1_field)} = ${filters[0]} AND sales_line_items.customer_code = ${filters[3]} 
          
          GROUP BY ms.item_num, ms.description, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
          
        UNION SELECT ms.item_num AS l1_label, ms.description AS l2_label, ${sql(config.l2_field)} AS l3_label , ${sql(config.l3_field)} AS l4_label 
          FROM "salesReporting".sales_orders 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_orders.item_num 
          
            WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} ${program ? sql`AND ms.program = ${program}`: sql``} AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) AND ${sql(config.l1_field)} = ${filters[0]} AND sales_orders.customer_code = ${filters[3]} 
          
          GROUP BY ms.item_num, ms.description, ${sql(config.l2_field)}, ${sql(config.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail
