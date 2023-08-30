const sql = require('../../../../../server')

const getRowsFirstLevelDetail = async (start, end, config, showFyTrend) => {
  try {
    console.log(`${config.user} - query postgres to get row labels ...`)

    const response =
      await sql
      `SELECT sl.customer_code AS l1_label, sl.customer_name AS l2_label, ${config.queryLevel} AS datalevel 
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      WHERE 
        ${!showFyTrend ? sql`sl.formatted_invoice_date >= ${start} 
        AND sl.formatted_invoice_date <= ${end} AND ` : sql``} 
        ms.byproduct_type IS NULL 
        AND ms.item_num = ${config.item} 
      
      GROUP BY sl.customer_code, sl.customer_name 
      
    UNION SELECT so.customer_code AS l1_label, so.customer_name AS l2_label, ${config.queryLevel} AS datalevel 
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      WHERE 
        ms.byproduct_type IS NULL 
        AND ms.item_num = ${config.item} 
        AND so.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
      
      GROUP BY so.customer_code, so.customer_name` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail
