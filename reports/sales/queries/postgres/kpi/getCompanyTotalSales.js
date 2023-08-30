const sql = require('../../../../../server')

const getCompanyTotalSales = async (start, end) => {
  try {
    console.log(`level 0: query postgres to get FG sales data period total ...`)

    const response =
      await sql
        `SELECT 'SALES TOTAL' AS column, 'FG SALES' AS l1_label, 'TOTAL' AS l2_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
        
        FROM "salesReporting".sales_line_items 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = sales_line_items.item_number
  
        WHERE sales_line_items.formatted_invoice_date >= ${start} AND sales_line_items.formatted_invoice_date <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getCompanyTotalSales = getCompanyTotalSales
