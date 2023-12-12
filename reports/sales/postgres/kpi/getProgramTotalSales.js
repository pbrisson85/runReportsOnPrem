const sql = require('../../../../server')

const getProgramTotalSales = async config => {
  try {
    console.log(`${config.user} - getProgramTotalSales ...`)

    const response = await sql
      `
      SELECT SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp
      
      FROM (
        SELECT 'dummy' AS doc_num, 'dummy' AS line_number, 'dummy' AS item_num, 0 AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
        FROM "salesReporting".sales_line_items AS d
        WHERE
          1=2

        ${config.totals.useProjection.sl ? sql`
        UNION ALL 
          SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
        
          FROM "salesReporting".sales_line_items AS sl 
            
          WHERE 
            sl.formatted_invoice_date >= ${config.totals.startDatePrimary} AND sl.formatted_invoice_date <= ${config.totals.endDatePrimary} 
        `: sql``}

        ${config.totals.useProjection.so ? sql`
        UNION ALL
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so 
         
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
            AND so.formatted_ship_date >= ${config.totals.startDatePrimary} AND so.formatted_ship_date <= ${config.totals.endDatePrimary}
        `: sql``}

        ${config.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_net,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp 
        
          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${config.totals.startDatePrimary} AND pr.date <= ${config.totals.endDatePrimary}
          `: sql``}

          ) AS pj
          
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
          ` //prettier-ignore

    return response[0]
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getProgramTotalSales = getProgramTotalSales
