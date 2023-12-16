const sql = require('../../../../server')

/* *********************************************** Level 1 Group *********************************************** */

const l1_getSalesWkDriven = async (config, startWk, endWk, year, colName) => {
  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data period total (l1_getSalesWkDriven) ...`)

    //${config.useProjection ? sql`'SALES PROJECTION TOTAL'`: sql`'SALES TOTAL'`}

    const response = await sql
      `SELECT ${sql`${colName}`} AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(pj.lbs),0) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
        
        FROM "salesReporting".sales_line_items AS sl 
          
        WHERE 
          sl.week >= ${startWk} AND sl.week <= ${endWk}
          AND sl.fiscal_year = ${year} 
        
        ${config.useProjection ? sql`
          UNION 
            SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
            FROM "salesReporting".sales_orders AS so
            
            WHERE 
              so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
              AND so.week >= ${startWk} AND so.week <= ${endWk}
              AND so.fiscal_year = ${year} 

          UNION 
            SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
          
            FROM "salesReporting".projected_sales AS ps        
          
            WHERE 
              ps.week >= ${startWk} AND ps.week <= ${endWk} AND ps.fiscal_year = ${year}

        `: sql``}
        
          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

          GROUP BY ${sql(config.baseFormat.l1_field)} ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 Group *********************************************** */

const l2_getSalesWkDriven = async (config, startWk, endWk, year, colName) => {
  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data period total (l2_getSalesWkDriven) ...`)

    const response = await sql
      `SELECT ${sql`${colName}`} AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
        
        FROM "salesReporting".sales_line_items AS sl
          
        WHERE
          sl.week >= ${startWk} AND sl.week <= ${endWk}
          AND sl.fiscal_year = ${year} 
        
        ${config.useProjection ? sql`
          UNION 
            SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
    
            FROM "salesReporting".sales_orders AS so
          
            WHERE 
              so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
              AND so.week >= ${startWk} AND so.week <= ${endWk}
              AND so.fiscal_year = ${year} 

          UNION 
            SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
          
            FROM "salesReporting".projected_sales AS ps        
          
            WHERE 
              ps.week >= ${startWk} AND ps.week <= ${endWk} AND ps.fiscal_year = ${year}

        `: sql``} 
    
          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 Group *********************************************** */

const l3_getSalesWkDriven = async (config, startWk, endWk, year, colName) => {
  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data period total (l3_getSalesWkDriven) ...`)

    const response = await sql
      `SELECT ${sql`${colName}`} AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
        
        FROM "salesReporting".sales_line_items AS sl
          
        WHERE
          sl.week >= ${startWk} AND sl.week <= ${endWk}
          AND sl.fiscal_year = ${year} 
        
        ${config.useProjection ? sql`
          UNION 
            SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
            FROM "salesReporting".sales_orders AS so
            
            WHERE 
              so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
              AND so.week >= ${startWk} AND so.week <= ${endWk}
              AND so.fiscal_year = ${year} 

          UNION 
            SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
          
            FROM "salesReporting".projected_sales AS ps        
          
            WHERE 
              ps.week >= ${startWk} AND ps.week <= ${endWk} AND ps.fiscal_year = ${year}

        `: sql``} 

          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 4 Group *********************************************** */

const l4_getSalesWkDriven = async (config, startWk, endWk, year, colName) => {
  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data period total (l4_getSalesWkDriven) ...`)

    const response = await sql
      `SELECT ${sql`${colName}`} AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
        
        FROM "salesReporting".sales_line_items AS sl
          
        WHERE
          sl.week >= ${startWk} AND sl.week <= ${endWk}
          AND sl.fiscal_year = ${year} 
        
        ${config.useProjection ? sql`
          UNION 
            SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
    
            FROM "salesReporting".sales_orders AS so
          
            WHERE 
              so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
              AND so.week >= ${startWk} AND so.week <= ${endWk}
              AND so.fiscal_year = ${year} 

          UNION 
            SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
          
            FROM "salesReporting".projected_sales AS ps        
          
            WHERE 
              ps.week >= ${startWk} AND ps.week <= ${endWk} AND ps.fiscal_year = ${year}

        `: sql``}
        
          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 5 Group *********************************************** */

const l5_getSalesWkDriven = async (config, startWk, endWk, year, colName) => {
  try {
    console.log(`${config.user} - level 5: query postgres to get FG sales data period total (l5_getSalesWkDriven) ...`)

    const response = await sql
      `SELECT ${sql`${colName}`} AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
        
        FROM "salesReporting".sales_line_items AS sl
          
        WHERE
          sl.week >= ${startWk} AND sl.week <= ${endWk}
          AND sl.fiscal_year = ${year} 
        
        ${config.useProjection ? sql`
          UNION 
            SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
    
            FROM "salesReporting".sales_orders AS so
          
            WHERE 
              so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
              AND so.week >= ${startWk} AND so.week <= ${endWk}
              AND so.fiscal_year = ${year} 

          UNION 
            SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
          
            FROM "salesReporting".projected_sales AS ps        
          
            WHERE 
              ps.week >= ${startWk} AND ps.week <= ${endWk} AND ps.fiscal_year = ${year}

        `: sql``}
        
          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Totals *********************************************** */

const l0_getSalesWkDriven = async (config, startWk, endWk, year, colName) => {
  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data period total (l0_getSalesWkDriven) ...`)

    const response = await sql
      `
      SELECT ${sql`${colName}`} AS column, 'TOTAL' AS l1_label, COALESCE(SUM(pj.lbs),0) AS lbs, COALESCE(SUM(pj.sales),0) AS sales, COALESCE(SUM(pj.cogs),0) AS cogs, COALESCE(SUM(pj.othp),0) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
      
        FROM "salesReporting".sales_line_items AS sl 
          
        WHERE 
          sl.week >= ${startWk} AND sl.week <= ${endWk}
          AND sl.fiscal_year = ${year} 
        
        ${config.useProjection ? sql`
          UNION
            SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
    
            FROM "salesReporting".sales_orders AS so 
       
            WHERE 
              so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
              AND so.week >= ${startWk} AND so.week <= ${endWk}
              AND so.fiscal_year = ${year} 

          UNION
            SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
          
            FROM "salesReporting".projected_sales AS ps        
          
            WHERE 
              ps.week >= ${startWk} AND ps.week <= ${endWk} AND ps.fiscal_year = ${year}

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

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l0_getSalesWkDriven = l0_getSalesWkDriven
module.exports.l1_getSalesWkDriven = l1_getSalesWkDriven
module.exports.l2_getSalesWkDriven = l2_getSalesWkDriven
module.exports.l3_getSalesWkDriven = l3_getSalesWkDriven
module.exports.l4_getSalesWkDriven = l4_getSalesWkDriven
module.exports.l5_getSalesWkDriven = l5_getSalesWkDriven
