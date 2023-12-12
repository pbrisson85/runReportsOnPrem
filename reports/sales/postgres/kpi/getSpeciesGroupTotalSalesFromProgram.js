const sql = require('../../../../server')

const getSpeciesGroupTotalSales = async (start, end, config) => {
  try {
    console.log(`${config.user} - look up species group for program ${config.baseFilters.program} ...`)

    const response = await sql`
      SELECT ${config.useProjection ? sql`'SALES PROJECTION TOTAL'`: sql`'SALES TOTAL'`} AS column ${config.baseFilters.itemType ? sql`, REPLACE('${sql(config.baseFilters.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
      
        FROM "salesReporting".sales_line_items AS sl 
          
        WHERE 
          sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        
        ${config.useProjection ? sql`
          UNION
            SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
    
            FROM "salesReporting".sales_orders AS so 
       
            WHERE 
              so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
              AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
         `: sql``} 
        
          ) AS pj
          
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.species_group IN (
            SELECT DISTINCT(ms.species_group) AS species_group
              FROM "invenReporting".master_supplement AS ms
              WHERE ms.program = ${config.baseFilters.program})`: sql``}
            
          ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getSpeciesGroupTotalSales