const sql = require('../../../../server')

const l1_getSalesTrend = async config => {
  if (!config.trends.queryGrouping) return []
  if (!config.baseFormat.l1_field) return []

  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data by week (l1_getSalesTrend) ...`)

    const response = await sql
      `SELECT pj.column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT 'dummy' AS doc_num, 'dummy' AS line_number, 'dummy' AS item_num, 'dummy' AS column, 0 AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
        FROM "salesReporting".sales_line_items AS d
        WHERE
          1=2

        ${config.trends.useProjection.sl ? sql`
        UNION ALL 
          SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
          
          FROM "salesReporting".sales_line_items AS sl
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON sl.formatted_invoice_date = p.formatted_date

          WHERE
            sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate}
          `: sql``}
        
        ${config.trends.useProjection.so ? sql`  
        UNION ALL
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so  
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON so.formatted_ship_date = p.formatted_date      
      
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${config.trends.startDate} AND so.formatted_ship_date <= ${config.trends.endDate}
          `: sql``}

        ${config.trends.useProjection.pr ? sql` 
        UNION ALL
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_gross,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp 
        
          FROM "salesReporting".projected_sales AS pr        
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON pr.date = p.formatted_date 

          WHERE 
            pr.date >= ${config.trends.startDate} AND pr.date <= ${config.trends.endDate}
          `: sql``}

          ) AS pj
          
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

      WHERE
        1=1 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY pj.column, ${sql(config.baseFormat.l1_field)} 
      
      ORDER BY pj.column` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getSalesTrend = async config => {
  if (!config.trends.queryGrouping) return []
  if (!config.baseFormat.l2_field) return []

  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data by week (l2_getSalesTrend) ...`)

    const response = await sql
      `SELECT pj.column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp
      
      FROM (
        SELECT 'dummy' AS doc_num, 'dummy' AS line_number, 'dummy' AS item_num, 'dummy' AS column, 0 AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
        FROM "salesReporting".sales_line_items AS d
        WHERE
          1=2


        ${config.trends.useProjection.sl ? sql`
        UNION ALL
          SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
          
          FROM "salesReporting".sales_line_items AS sl
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON sl.formatted_invoice_date = p.formatted_date
            
          WHERE
            sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate}
        `: sql``}


        ${config.trends.useProjection.so ? sql`  
        UNION ALL
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON so.formatted_ship_date = p.formatted_date
           
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${config.trends.startDate} AND so.formatted_ship_date <= ${config.trends.endDate}
        `: sql``}


        ${config.trends.useProjection.pr ? sql` 
        UNION ALL
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_gross,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp 
          
          FROM "salesReporting".projected_sales AS pr 
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON pr.date = p.formatted_date       
          
          WHERE 
              pr.date >= ${config.trends.startDate} AND pr.date <= ${config.trends.endDate}
        `: sql``}


          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY pj.column, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)} 
      
      ORDER BY pj.column` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getSalesTrend = async config => {
  if (!config.trends.queryGrouping) return []
  if (!config.baseFormat.l3_field) return []

  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data by week (l3_getSalesTrend) ...`)

    const response = await sql
      `SELECT pj.column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp
      
      FROM (
        SELECT 'dummy' AS doc_num, 'dummy' AS line_number, 'dummy' AS item_num, 'dummy' AS column, 0 AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
        FROM "salesReporting".sales_line_items AS d
        WHERE
          1=2

        ${config.trends.useProjection.sl ? sql`
        UNION ALL
          SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
          
          FROM "salesReporting".sales_line_items AS sl
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON sl.formatted_invoice_date = p.formatted_date
            
          WHERE
            sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate}
        `: sql``}


        ${config.trends.useProjection.so ? sql`  
        UNION ALL
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON so.formatted_ship_date = p.formatted_date
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${config.trends.startDate} AND so.formatted_ship_date <= ${config.trends.endDate}
        `: sql``}

        ${config.trends.useProjection.pr ? sql` 
        UNION ALL
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_gross,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp 
        
          FROM "salesReporting".projected_sales AS pr    
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON pr.date = p.formatted_date    
        
          WHERE 
            pr.date >= ${config.trends.startDate} AND pr.date <= ${config.trends.endDate}
        `: sql``}



          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY pj.column, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}
      
      ORDER BY pj.column` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getSalesTrend = async config => {
  if (!config.trends.queryGrouping) return []
  if (!config.baseFormat.l4_field) return []

  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data by week (l4_getSalesTrend) ...`)

    const response = await sql
      `SELECT pj.column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp
      
      FROM (
        SELECT 'dummy' AS doc_num, 'dummy' AS line_number, 'dummy' AS item_num, 'dummy' AS column, 0 AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
        FROM "salesReporting".sales_line_items AS d
        WHERE
          1=2

        ${config.trends.useProjection.sl ? sql`
        UNION ALL
          SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
          
          FROM "salesReporting".sales_line_items AS sl
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON sl.formatted_invoice_date = p.formatted_date
            
          WHERE
            sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate}
        `: sql``}


        ${config.trends.useProjection.so ? sql`  
        UNION ALL
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON so.formatted_ship_date = p.formatted_date
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${config.trends.startDate} AND so.formatted_ship_date <= ${config.trends.endDate}
        `: sql``}


        ${config.trends.useProjection.pr ? sql` 
        UNION ALL
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_gross,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp 
        
          FROM "salesReporting".projected_sales AS pr     
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON pr.date = p.formatted_date   
        
          WHERE 
            pr.date >= ${config.trends.startDate} AND pr.date <= ${config.trends.endDate}
        `: sql``}


          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY pj.column, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}
      
      ORDER BY pj.column` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getSalesTrend = async config => {
  if (!config.trends.queryGrouping) return []
  if (!config.baseFormat.l5_field) return []

  try {
    console.log(`${config.user} - level 5: query postgres to get FG sales data by week (l4_getSalesTrend) ...`)

    const response = await sql
      `SELECT pj.column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp
      
      FROM (
        SELECT 'dummy' AS doc_num, 'dummy' AS line_number, 'dummy' AS item_num, 'dummy' AS column, 0 AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
        FROM "salesReporting".sales_line_items AS d
        WHERE
          1=2

      ${config.trends.useProjection.sl ? sql`
        UNION ALL
          SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
          
          FROM "salesReporting".sales_line_items AS sl
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON sl.formatted_invoice_date = p.formatted_date
            
          WHERE
            sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate}
        `: sql``}


        ${config.trends.useProjection.so ? sql`  
        UNION ALL
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON so.formatted_ship_date = p.formatted_date
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${config.trends.startDate} AND so.formatted_ship_date <= ${config.trends.endDate}
        `: sql``}


        ${config.trends.useProjection.pr ? sql` 
        UNION ALL
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_gross,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp 
        
          FROM "salesReporting".projected_sales AS pr   
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON pr.date = p.formatted_date     
        
          WHERE 
          pr.date >= ${config.trends.startDate} AND pr.date <= ${config.trends.endDate}
        `: sql``}

          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY pj.column, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}
      
      ORDER BY pj.column` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getSalesTrend = async config => {
  if (!config.trends.queryGrouping) return []

  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data by week (l0_getSalesTrend) ...`)

    const response = await sql
      `
      SELECT pj.column, 'TOTAL' AS l1_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp
      
      FROM (
        SELECT 'dummy' AS doc_num, 'dummy' AS line_number, 'dummy' AS item_num, 'dummy' AS column, 0 AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
        FROM "salesReporting".sales_line_items AS d
        WHERE
          1=2

      ${config.trends.useProjection.sl ? sql`
        UNION ALL 
          SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
        
          FROM "salesReporting".sales_line_items AS sl 
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON sl.formatted_invoice_date = p.formatted_date
            
          WHERE 
            sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate} 
          `: sql``}


        ${config.trends.useProjection.so ? sql`  
        UNION ALL
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so 
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON so.formatted_ship_date = p.formatted_date
          
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
            AND so.formatted_ship_date >= ${config.trends.startDate} AND so.formatted_ship_date <= ${config.trends.endDate}
          `: sql``}


        ${config.trends.useProjection.pr ? sql` 
        UNION ALL
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, ${sql(config.trends.queryGrouping)} AS column, COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_gross,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp 
        
          FROM "salesReporting".projected_sales AS pr  
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON pr.date = p.formatted_date      
        
          WHERE 
            pr.date >= ${config.trends.startDate} AND pr.date <= ${config.trends.endDate}
          `: sql``}

          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY pj.column 
      
      ORDER BY pj.column` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l0_getSalesTrend = l0_getSalesTrend
module.exports.l2_getSalesTrend = l2_getSalesTrend
module.exports.l1_getSalesTrend = l1_getSalesTrend
module.exports.l3_getSalesTrend = l3_getSalesTrend
module.exports.l4_getSalesTrend = l4_getSalesTrend
module.exports.l5_getSalesTrend = l5_getSalesTrend
