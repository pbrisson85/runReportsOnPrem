const sql = require('../../../../server')

const l1_getPercentOfCompanySales = async (config, companyTotalSales) => {
  if (!config.baseFormat.l1_field) return []

  console.log('companyTotalSales', companyTotalSales)

  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data period total (l1_getPercentOfCompanySales) ...`)

    const response = await sql
      `SELECT 'percentCompanySales' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(pj.lbs)/${(companyTotalSales.lbs)},0) AS lbs, COALESCE(SUM(pj.sales)/${(companyTotalSales.sales)},0) AS sales, COALESCE(SUM(pj.cogs)/${(companyTotalSales.cogs)},0) AS cogs, COALESCE(SUM(pj.othp)/${(companyTotalSales.othp)},0) AS othp
      
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

          GROUP BY ${sql(config.baseFormat.l1_field)} ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getPercentOfCompanySales = async (config, companyTotalSales) => {
  if (!config.baseFormat.l2_field) return []

  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data period total (l2_getPercentOfCompanySales) ...`)

    const response = await sql
      `SELECT 'percentCompanySales' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(pj.lbs)/${(companyTotalSales.lbs)},0) AS lbs, COALESCE(SUM(pj.sales)/${(companyTotalSales.sales)},0) AS sales, COALESCE(SUM(pj.cogs)/${(companyTotalSales.cogs)},0) AS cogs, COALESCE(SUM(pj.othp)/${(companyTotalSales.othp)},0) AS othp
      
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

      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getPercentOfCompanySales = async (config, companyTotalSales) => {
  if (!config.baseFormat.l3_field) return []

  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data period total (l3_getPercentOfCompanySales) ...`)

    const response = await sql
      `SELECT 'percentCompanySales' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(pj.lbs)/${(companyTotalSales.lbs)},0) AS lbs, COALESCE(SUM(pj.sales)/${(companyTotalSales.sales)},0) AS sales, COALESCE(SUM(pj.cogs)/${(companyTotalSales.cogs)},0) AS cogs, COALESCE(SUM(pj.othp)/${(companyTotalSales.othp)},0) AS othp
      
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

      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getPercentOfCompanySales = async (config, companyTotalSales) => {
  if (!config.baseFormat.l4_field) return []

  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data period total (l4_getPercentOfCompanySales) ...`)

    const response = await sql
      `SELECT 'percentCompanySales' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(pj.lbs)/${(companyTotalSales.lbs)},0) AS lbs, COALESCE(SUM(pj.sales)/${(companyTotalSales.sales)},0) AS sales, COALESCE(SUM(pj.cogs)/${(companyTotalSales.cogs)},0) AS cogs, COALESCE(SUM(pj.othp)/${(companyTotalSales.othp)},0) AS othp
      
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

      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getPercentOfCompanySales = async (config, companyTotalSales) => {
  if (!config.baseFormat.l5_field) return []

  try {
    console.log(`${config.user} - level 5: query postgres to get FG sales data period total (l4_getPercentOfCompanySales) ...`)

    const response = await sql
      `SELECT 'percentCompanySales' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, COALESCE(SUM(pj.lbs)/${(companyTotalSales.lbs)},0) AS lbs, COALESCE(SUM(pj.sales)/${(companyTotalSales.sales)},0) AS sales, COALESCE(SUM(pj.cogs)/${(companyTotalSales.cogs)},0) AS cogs, COALESCE(SUM(pj.othp)/${(companyTotalSales.othp)},0) AS othp
      
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

      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getPercentOfCompanySales = async (config, companyTotalSales) => {
  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data period total (l0_getPercentOfCompanySales) ...`)

    const response = await sql
      `
      SELECT 'percentCompanySales' AS column, 'TOTAL' AS l1_label, COALESCE(SUM(pj.lbs)/${(companyTotalSales.lbs)},0) AS lbs, COALESCE(SUM(pj.sales)/${(companyTotalSales.sales)},0) AS sales, COALESCE(SUM(pj.cogs)/${(companyTotalSales.cogs)},0) AS cogs, COALESCE(SUM(pj.othp)/${(companyTotalSales.othp)},0) AS othp
      
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

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l0_getPercentOfCompanySales = l0_getPercentOfCompanySales
module.exports.l2_getPercentOfCompanySales = l2_getPercentOfCompanySales
module.exports.l1_getPercentOfCompanySales = l1_getPercentOfCompanySales
module.exports.l3_getPercentOfCompanySales = l3_getPercentOfCompanySales
module.exports.l4_getPercentOfCompanySales = l4_getPercentOfCompanySales
module.exports.l5_getPercentOfCompanySales = l5_getPercentOfCompanySales
