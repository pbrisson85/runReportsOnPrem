const sql = require('../../../../server')

const getCompanyTotalSales = async (start, end, config) => {
  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data period total ...`)

    const response =
      await sql
        `SELECT 'SALES TOTAL' AS column${config.itemType ? sql`, REPLACE('${sql(config.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
        
        FROM "salesReporting".sales_line_items As sl
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = sl.item_number
  
        WHERE 
          sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
          ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
          ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getCompanyTotalSales = getCompanyTotalSales
