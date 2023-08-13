const getRowsFirstLevelDetail = async (config, start, end, program, filters) => {
  try {
    console.log(`query postgres to get weekly purchses ...`)

    const response = await sql
        `SELECT sl.customer_code AS l1_label, sl.customer_name AS l2_label 
          FROM "salesReporting".sales_line_items AS sl
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sl.item_number 
          WHERE sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND ms.species = ${filters[0]} 
          
          GROUP BY sl.customer_code, sl.customer_name 
          
        UNION SELECT so.customer_code AS l1_label, so.customer_name AS l2_label 
          FROM "salesReporting".sales_orders AS so
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = so.item_num 
          WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND so.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) AND ms.species = ${filters[0]} 
          
          GROUP BY so.customer_code, so.customer_name` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail
