const sql = require('../../../../server')

const l1_getPercentSales = async (config, denominator, colName) => {
  if (!config.baseFormat.l1_field) return []
  if (denominator === null) return []

  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data period total (l1_getPercentSales: ${colName}) ...`)

    const response = await sql
      `SELECT  
      ${colName} AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      'SUBTOTAL' AS l2_label, 
      'SUBTOTAL' AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(pj.lbs)/${(denominator.lbs)},0) AS lbs, 
      COALESCE(SUM(pj.sales)/${(denominator.sales)},0) AS "grossSales", 
      COALESCE(SUM(pj.cogs)/${(denominator.cogs)},0) AS cogs, 
      COALESCE(SUM(pj.othp)/${(denominator.othp)},0) AS othp, 
      COALESCE(SUM(pj.gross_margin)/${(denominator.gross_margin)},0) AS "grossMargin", 
      COALESCE(SUM(pj.net_sales)/${(denominator.net_sales)},0) AS "netSales", 
      0 AS "grossMarginPercent", 
      COALESCE(SUM(pj.sales)/${(denominator.sales)},0) AS "grossSalesPerLb", 
      COALESCE(SUM(pj.cogs)/${(denominator.cogs)},0) AS "cogsPerLb", 
      COALESCE(SUM(pj.othp)/${(denominator.othp)},0) AS "othpPerLb", 
      COALESCE(SUM(pj.gross_margin)/${(denominator.gross_margin)},0) AS "grossMarginPerLb", 
      COALESCE(SUM(pj.net_sales)/${(denominator.net_sales)},0) AS "netSalesPerLb"

      FROM (
        SELECT 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          'dummy' AS item_num, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp, 
          0 AS gross_margin, 
          0 AS net_sales 
        WHERE
          1=2

        ${config.totals.useProjection.sl ? sql`
        UNION ALL 
          SELECT 
            sl.invoice_number AS doc_num, 
            sl.line_number, 
            sl.item_number AS item_num, 
            COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
            COALESCE(sl.gross_sales_ext,0) AS sales, 
            COALESCE(sl.cogs_ext_gl,0) AS cogs, 
            COALESCE(sl.othp_ext,0) AS othp, 
            COALESCE(sl.gross_sales_ext-sl.cogs_ext_gl-sl.othp_ext,0) AS gross_margin, 
            COALESCE(sl.gross_sales_ext-sl.othp_ext,0) AS net_sales 
          
          FROM "salesReporting".sales_line_items AS sl 
            
          WHERE 
            sl.formatted_invoice_date >= ${config.totals.primary.startDate} AND sl.formatted_invoice_date <= ${config.totals.primary.endDate} 
        `: sql``}

        ${config.totals.useProjection.so ? sql`
        UNION ALL
          SELECT 
            so.so_num AS doc_num, 
            so.so_line AS line_number, 
            so.item_num AS item_num, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp, 
            COALESCE(so.ext_sales-so.ext_cost-so.ext_othp,0) AS gross_margin, 
            COALESCE(so.ext_sales-so.ext_othp,0) AS net_sales 
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${config.totals.primary.startDate} AND so.formatted_ship_date <= ${config.totals.primary.endDate}
        `: sql``}

        ${config.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT 
            'PROJECTION' AS doc_num, 
            'PROJECTION' AS line_number, 
            pr.item_number AS item_num, 
            COALESCE(pr.lbs,0) AS lbs, 
            COALESCE(pr.sales_gross,0) AS sales, 
            COALESCE(pr.cogs,0) AS cogs, 
            COALESCE(pr.othp,0) AS othp, 
            COALESCE(pr.sales_gross-pr.cogs-pr.othp,0) AS gross_margin, 
            COALESCE(pr.sales_gross-pr.othp,0) AS net_sales 
        
          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${config.totals.primary.startDate} AND pr.date <= ${config.totals.primary.endDate}
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

const l2_getPercentSales = async (config, denominator, colName) => {
  if (!config.baseFormat.l2_field) return []
  if (denominator === null) return []

  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data period total (l2_getPercentSales: ${colName}) ...`)

    const response = await sql
      `SELECT  
      ${colName} AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      'SUBTOTAL' AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(pj.lbs)/${(denominator.lbs)},0) AS lbs, 
      COALESCE(SUM(pj.sales)/${(denominator.sales)},0) AS "grossSales", 
      COALESCE(SUM(pj.cogs)/${(denominator.cogs)},0) AS cogs, 
      COALESCE(SUM(pj.othp)/${(denominator.othp)},0) AS othp, 
      COALESCE(SUM(pj.gross_margin)/${(denominator.gross_margin)},0) AS "grossMargin", 
      COALESCE(SUM(pj.net_sales)/${(denominator.net_sales)},0) AS "netSales", 
      0 AS "grossMarginPercent", 
      COALESCE(SUM(pj.sales)/${(denominator.sales)},0) AS "grossSalesPerLb", 
      COALESCE(SUM(pj.cogs)/${(denominator.cogs)},0) AS "cogsPerLb", 
      COALESCE(SUM(pj.othp)/${(denominator.othp)},0) AS "othpPerLb", 
      COALESCE(SUM(pj.gross_margin)/${(denominator.gross_margin)},0) AS "grossMarginPerLb", 
      COALESCE(SUM(pj.net_sales)/${(denominator.net_sales)},0) AS "netSalesPerLb"
      
      FROM (
        SELECT 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          'dummy' AS item_num, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp , 
          0 AS gross_margin, 
          0 AS net_sales 
        WHERE
          1=2

        ${config.totals.useProjection.sl ? sql`
        UNION ALL 
          SELECT 
            sl.invoice_number AS doc_num, 
            sl.line_number, 
            sl.item_number AS item_num, 
            COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
            COALESCE(sl.gross_sales_ext,0) AS sales, 
            COALESCE(sl.cogs_ext_gl,0) AS cogs, 
            COALESCE(sl.othp_ext,0) AS othp, 
            COALESCE(sl.gross_sales_ext-sl.cogs_ext_gl-sl.othp_ext,0) AS gross_margin, 
            COALESCE(sl.gross_sales_ext-sl.othp_ext,0) AS net_sales  
          
          FROM "salesReporting".sales_line_items AS sl
            
          WHERE
            sl.formatted_invoice_date >= ${config.totals.primary.startDate} AND sl.formatted_invoice_date <= ${config.totals.primary.endDate}
          `: sql``}

        ${config.totals.useProjection.so ? sql`
        UNION ALL
          SELECT 
            so.so_num AS doc_num, 
            so.so_line AS line_number, 
            so.item_num AS item_num, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp, 
            COALESCE(so.ext_sales-so.ext_cost-so.ext_othp,0) AS gross_margin, 
            COALESCE(so.ext_sales-so.ext_othp,0) AS net_sales 
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${config.totals.primary.startDate} AND so.formatted_ship_date <= ${config.totals.primary.endDate}
          `: sql``}

        ${config.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT '
            PROJECTION' AS doc_num, 
            'PROJECTION' AS line_number, 
            pr.item_number AS item_num, 
            COALESCE(pr.lbs,0) AS lbs,
            COALESCE(pr.sales_gross,0) AS sales, 
            COALESCE(pr.cogs,0) AS cogs, 
            COALESCE(pr.othp,0) AS othp, 
            COALESCE(pr.sales_gross-pr.cogs-pr.othp,0) AS gross_margin, 
            COALESCE(pr.sales_gross-pr.othp,0) AS net_sales 
        
          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${config.totals.primary.startDate} AND pr.date <= ${config.totals.primary.endDate}
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

const l3_getPercentSales = async (config, denominator, colName) => {
  if (!config.baseFormat.l3_field) return []
  if (denominator === null) return []

  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data period total (l3_getPercentSales: ${colName}) ...`)

    const response = await sql
      `SELECT  
      ${colName} AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(pj.lbs)/${(denominator.lbs)},0) AS lbs, 
      COALESCE(SUM(pj.sales)/${(denominator.sales)},0) AS "grossSales", 
      COALESCE(SUM(pj.cogs)/${(denominator.cogs)},0) AS cogs, 
      COALESCE(SUM(pj.othp)/${(denominator.othp)},0) AS othp, 
      COALESCE(SUM(pj.gross_margin)/${(denominator.gross_margin)},0) AS "grossMargin", 
      COALESCE(SUM(pj.net_sales)/${(denominator.net_sales)},0) AS "netSales", 
      0 AS "grossMarginPercent", 
      COALESCE(SUM(pj.sales)/${(denominator.sales)},0) AS "grossSalesPerLb", 
      COALESCE(SUM(pj.cogs)/${(denominator.cogs)},0) AS "cogsPerLb", 
      COALESCE(SUM(pj.othp)/${(denominator.othp)},0) AS "othpPerLb", 
      COALESCE(SUM(pj.gross_margin)/${(denominator.gross_margin)},0) AS "grossMarginPerLb", 
      COALESCE(SUM(pj.net_sales)/${(denominator.net_sales)},0) AS "netSalesPerLb"
      
      FROM (
        SELECT 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          'dummy' AS item_num, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp, 
          0 AS gross_margin, 
          0 AS net_sales  
        WHERE
          1=2

        ${config.totals.useProjection.sl ? sql`
        UNION ALL 
          SELECT 
            sl.invoice_number AS doc_num, 
            sl.line_number, 
            sl.item_number AS item_num, 
            COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
            COALESCE(sl.gross_sales_ext,0) AS sales, 
            COALESCE(sl.cogs_ext_gl,0) AS cogs, 
            COALESCE(sl.othp_ext,0) AS othp, 
            COALESCE(sl.gross_sales_ext-sl.cogs_ext_gl-sl.othp_ext,0) AS gross_margin, 
            COALESCE(sl.gross_sales_ext-sl.othp_ext,0) AS net_sales  
          
          FROM "salesReporting".sales_line_items AS sl
            
          WHERE
            sl.formatted_invoice_date >= ${config.totals.primary.startDate} AND sl.formatted_invoice_date <= ${config.totals.primary.endDate}
          `: sql``}

        ${config.totals.useProjection.so ? sql`
        UNION ALL
          SELECT 
            so.so_num AS doc_num, 
            so.so_line AS line_number, 
            so.item_num AS item_num, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp, 
            COALESCE(so.ext_sales-so.ext_cost-so.ext_othp,0) AS gross_margin, 
            COALESCE(so.ext_sales-so.ext_othp,0) AS net_sales 
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${config.totals.primary.startDate} AND so.formatted_ship_date <= ${config.totals.primary.endDate}
          `: sql``}

        ${config.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT 
            'PROJECTION' AS doc_num, 
            'PROJECTION' AS line_number, 
            pr.item_number AS item_num, 
            COALESCE(pr.lbs,0) AS lbs, 
            COALESCE(pr.sales_gross,0) AS sales, 
            COALESCE(pr.cogs,0) AS cogs, 
            COALESCE(pr.othp,0) AS othp, 
            COALESCE(pr.sales_gross-pr.cogs-pr.othp,0) AS gross_margin, 
            COALESCE(pr.sales_gross-pr.othp,0) AS net_sales 
        
          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${config.totals.primary.startDate} AND pr.date <= ${config.totals.primary.endDate}
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

const l4_getPercentSales = async (config, denominator, colName) => {
  if (!config.baseFormat.l4_field) return []
  if (denominator === null) return []

  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data period total (l4_getPercentSales: ${colName}) ...`)

    const response = await sql
      `SELECT  
      ${colName} AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(pj.lbs)/${(denominator.lbs)},0) AS lbs, 
      COALESCE(SUM(pj.sales)/${(denominator.sales)},0) AS "grossSales", 
      COALESCE(SUM(pj.cogs)/${(denominator.cogs)},0) AS cogs, 
      COALESCE(SUM(pj.othp)/${(denominator.othp)},0) AS othp, 
      COALESCE(SUM(pj.gross_margin)/${(denominator.gross_margin)},0) AS "grossMargin", 
      COALESCE(SUM(pj.net_sales)/${(denominator.net_sales)},0) AS "netSales", 
      0 AS "grossMarginPercent", 
      COALESCE(SUM(pj.sales)/${(denominator.sales)},0) AS "grossSalesPerLb", 
      COALESCE(SUM(pj.cogs)/${(denominator.cogs)},0) AS "cogsPerLb", 
      COALESCE(SUM(pj.othp)/${(denominator.othp)},0) AS "othpPerLb", 
      COALESCE(SUM(pj.gross_margin)/${(denominator.gross_margin)},0) AS "grossMarginPerLb", 
      COALESCE(SUM(pj.net_sales)/${(denominator.net_sales)},0) AS "netSalesPerLb"
      
      FROM (
        SELECT 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          'dummy' AS item_num, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp, 
          0 AS gross_margin, 
          0 AS net_sales  
        WHERE
          1=2

        ${config.totals.useProjection.sl ? sql`
        UNION ALL 
          SELECT 
            sl.invoice_number AS doc_num, 
            sl.line_number, 
            sl.item_number AS item_num, 
            COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
            COALESCE(sl.gross_sales_ext,0) AS sales, 
            COALESCE(sl.cogs_ext_gl,0) AS cogs, 
            COALESCE(sl.othp_ext,0) AS othp, 
            COALESCE(sl.gross_sales_ext-sl.cogs_ext_gl-sl.othp_ext,0) AS gross_margin, 
            COALESCE(sl.gross_sales_ext-sl.othp_ext,0) AS net_sales  
          
          FROM "salesReporting".sales_line_items AS sl
            
          WHERE
            sl.formatted_invoice_date >= ${config.totals.primary.startDate} AND sl.formatted_invoice_date <= ${config.totals.primary.endDate}
          `: sql``}

        ${config.totals.useProjection.so ? sql`
        UNION ALL
          SELECT 
            so.so_num AS doc_num, 
            so.so_line AS line_number, 
            so.item_num AS item_num, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp, 
            COALESCE(so.ext_sales-so.ext_cost-so.ext_othp,0) AS gross_margin, 
            COALESCE(so.ext_sales-so.ext_othp,0) AS net_sales 
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${config.totals.primary.startDate} AND so.formatted_ship_date <= ${config.totals.primary.endDate}
          `: sql``}

        ${config.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT 
            'PROJECTION' AS doc_num, 
            'PROJECTION' AS line_number, 
            pr.item_number AS item_num, 
            COALESCE(pr.lbs,0) AS lbs, 
            COALESCE(pr.sales_gross,0) AS sales, 
            COALESCE(pr.cogs,0) AS cogs, 
            COALESCE(pr.othp,0) AS othp, 
            COALESCE(pr.sales_gross-pr.cogs-pr.othp,0) AS gross_margin, 
            COALESCE(pr.sales_gross-pr.othp,0) AS net_sales 
        
          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${config.totals.primary.startDate} AND pr.date <= ${config.totals.primary.endDate}
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

const l5_getPercentSales = async (config, denominator, colName) => {
  if (!config.baseFormat.l5_field) return []
  if (denominator === null) return []

  try {
    console.log(`${config.user} - level 5: query postgres to get FG sales data period total (l4_getPercentSales: ${colName}) ...`)

    const response = await sql
      `SELECT  
      ${colName} AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
      COALESCE(${sql(config.baseFormat.l5_field)},'NO VALUE') AS l5_label, 
      COALESCE(SUM(pj.lbs)/${(denominator.lbs)},0) AS lbs, 
      COALESCE(SUM(pj.sales)/${(denominator.sales)},0) AS "grossSales", 
      COALESCE(SUM(pj.cogs)/${(denominator.cogs)},0) AS cogs, 
      COALESCE(SUM(pj.othp)/${(denominator.othp)},0) AS othp, 
      COALESCE(SUM(pj.gross_margin)/${(denominator.gross_margin)},0) AS "grossMargin", 
      COALESCE(SUM(pj.net_sales)/${(denominator.net_sales)},0) AS "netSales", 
      0 AS "grossMarginPercent", 
      COALESCE(SUM(pj.sales)/${(denominator.sales)},0) AS "grossSalesPerLb", 
      COALESCE(SUM(pj.cogs)/${(denominator.cogs)},0) AS "cogsPerLb", 
      COALESCE(SUM(pj.othp)/${(denominator.othp)},0) AS "othpPerLb", 
      COALESCE(SUM(pj.gross_margin)/${(denominator.gross_margin)},0) AS "grossMarginPerLb", 
      COALESCE(SUM(pj.net_sales)/${(denominator.net_sales)},0) AS "netSalesPerLb"
      
      FROM (
        SELECT 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          'dummy' AS item_num, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp, 
          0 AS gross_margin, 
          0 AS net_sales  
        WHERE
          1=2

        ${config.totals.useProjection.sl ? sql`
        UNION ALL 
          SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp, COALESCE(sl.gross_sales_ext-sl.cogs_ext_gl-sl.othp_ext,0) AS gross_margin, COALESCE(sl.gross_sales_ext-sl.othp_ext,0) AS net_sales  
          
          FROM "salesReporting".sales_line_items AS sl
            
          WHERE
            sl.formatted_invoice_date >= ${config.totals.primary.startDate} AND sl.formatted_invoice_date <= ${config.totals.primary.endDate}
          `: sql``}

        ${config.totals.useProjection.so ? sql`
        UNION ALL
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp, COALESCE(so.ext_sales-so.ext_cost-so.ext_othp,0) AS gross_margin, COALESCE(so.ext_sales-so.ext_othp,0) AS net_sales 
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${config.totals.primary.startDate} AND so.formatted_ship_date <= ${config.totals.primary.endDate}
          `: sql``}

        ${config.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_gross,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp, COALESCE(pr.sales_gross-pr.cogs-pr.othp,0) AS gross_margin, COALESCE(pr.sales_gross-pr.othp,0) AS net_sales 
        
          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${config.totals.primary.startDate} AND pr.date <= ${config.totals.primary.endDate}
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

const l0_getPercentSales = async (config, denominator, colName) => {
  if (denominator === null) return []

  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data period total (l0_getPercentSales: ${colName}) ...`)

    const response = await sql
      `
      SELECT  
      ${colName} AS column, 
      'TOTAL' AS l1_label, 
      COALESCE(SUM(pj.lbs)/${(denominator.lbs)},0) AS lbs, 
      COALESCE(SUM(pj.sales)/${(denominator.sales)},0) AS "grossSales", 
      COALESCE(SUM(pj.cogs)/${(denominator.cogs)},0) AS cogs, 
      COALESCE(SUM(pj.othp)/${(denominator.othp)},0) AS othp, 
      COALESCE(SUM(pj.gross_margin)/${(denominator.gross_margin)},0) AS "grossMargin", 
      COALESCE(SUM(pj.net_sales)/${(denominator.net_sales)},0) AS "netSales", 
      0 AS "grossMarginPercent", 
      COALESCE(SUM(pj.sales)/${(denominator.sales)},0) AS "grossSalesPerLb", 
      COALESCE(SUM(pj.cogs)/${(denominator.cogs)},0) AS "cogsPerLb", 
      COALESCE(SUM(pj.othp)/${(denominator.othp)},0) AS "othpPerLb", 
      COALESCE(SUM(pj.gross_margin)/${(denominator.gross_margin)},0) AS "grossMarginPerLb", 
      COALESCE(SUM(pj.net_sales)/${(denominator.net_sales)},0) AS "netSalesPerLb"
      
      FROM (
        SELECT 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          'dummy' AS item_num, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp, 
          0 AS gross_margin, 
          0 AS net_sales  
        WHERE
          1=2

        ${config.totals.useProjection.sl ? sql`
        UNION ALL 
          SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp, COALESCE(sl.gross_sales_ext-sl.cogs_ext_gl-sl.othp_ext,0) AS gross_margin, COALESCE(sl.gross_sales_ext-sl.othp_ext,0) AS net_sales  
        
          FROM "salesReporting".sales_line_items AS sl 
            
          WHERE 
            sl.formatted_invoice_date >= ${config.totals.primary.startDate} AND sl.formatted_invoice_date <= ${config.totals.primary.endDate} 
        `: sql``}

        ${config.totals.useProjection.so ? sql`
        UNION ALL
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp, COALESCE(so.ext_sales-so.ext_cost-so.ext_othp,0) AS gross_margin, COALESCE(so.ext_sales-so.ext_othp,0) AS net_sales 
      
          FROM "salesReporting".sales_orders AS so 
         
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
            AND so.formatted_ship_date >= ${config.totals.primary.startDate} AND so.formatted_ship_date <= ${config.totals.primary.endDate}
        `: sql``}

        ${config.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_gross,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp, COALESCE(pr.sales_gross-pr.cogs-pr.othp,0) AS gross_margin, COALESCE(pr.sales_gross-pr.othp,0) AS net_sales 
        
          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${config.totals.primary.startDate} AND pr.date <= ${config.totals.primary.endDate}
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

module.exports = { l0_getPercentSales, l1_getPercentSales, l2_getPercentSales, l3_getPercentSales, l4_getPercentSales, l5_getPercentSales }
