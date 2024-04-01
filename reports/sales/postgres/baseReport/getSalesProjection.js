const sql = require('../../../../server')

const l1_getSalesTotalPrimary = async (config, othpTableConfig) => {
  if (!config.baseFormat.l1_field) return []
  if (config.dates.trends.yearTrend) return [] // skip totals if trend is by year

  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data period total (l1_getSalesTotalPrimary) ...`)

    const response = await sql
      `
      WITH othp_lines AS (
        SELECT * FROM ${sql(othpTableConfig.othpTable)}
      )
      
      SELECT 
        'SALES TOTAL' AS column, 
        COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
        'SUBTOTAL' AS l2_label, 
        'SUBTOTAL' AS l3_label, 
        'SUBTOTAL' AS l4_label, 
        'SUBTOTAL' AS l5_label, 
        SUM(pj.lbs) AS lbs, 
        SUM(pj.sales) AS "grossSales", 
        SUM(pj.cogs) AS cogs, 
        SUM(pj.othp) AS othp, 
        SUM(pj.sales) - SUM(pj.othp) AS "netSales", 
        SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp) AS "grossMargin", 
        COALESCE((SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp))/NULLIF(SUM(pj.sales),0),0) AS "grossMarginPercent", 
        COALESCE(SUM(pj.sales)/NULLIF(SUM(pj.lbs),0),0) AS "grossSalesPerLb", 
        COALESCE((SUM(pj.sales) - SUM(pj.othp))/NULLIF(SUM(pj.lbs),0),0) AS "netSalesPerLb", 
        COALESCE((SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp))/NULLIF(SUM(pj.lbs),0),0) AS "grossMarginPerLb", 
        COALESCE(SUM(pj.cogs)/NULLIF(SUM(pj.lbs),0),0) AS "cogsPerLb", 
        COALESCE(SUM(pj.othp)/NULLIF(SUM(pj.lbs),0),0) AS "othpPerLb"
        ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)}),0) AS ${sql(gl.display_name)} `)}`}
        ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)})/NULLIF(SUM(pj.lbs),0),0) AS ${sql(gl.display_name)}PerLb`)}`}
      
      FROM (
        SELECT 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          'dummy' AS item_num, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp 
          ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`}
        WHERE 1=2

        ${config.dates.totals.useProjection.sl ? sql`
        UNION ALL 
          SELECT 
            sl.invoice_number AS doc_num, 
            sl.line_number, 
            sl.item_number AS item_num, 
            COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
            COALESCE(sl.gross_sales_ext,0) AS sales, 
            COALESCE(sl.cogs_ext_gl,0) AS cogs, 
            COALESCE(sl.othp_ext,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(oc.${sql(gl.display_name)},0) AS ${sql(gl.display_name)} `)}`}
          
          FROM "salesReporting".sales_line_items AS sl 
            LEFT OUTER JOIN ${sql(othpTableConfig.othpTable)} AS oc
            ON oc.invoice_num = sl.invoice_number AND oc.invoice_line = sl.line_number
            
          WHERE 
            sl.formatted_invoice_date >= ${config.dates.totals.primary.startDate} 
            AND sl.formatted_invoice_date <= ${config.dates.totals.primary.endDate} 
        `: sql``}

        ${config.dates.totals.useProjection.so ? sql`
        UNION ALL
          SELECT 
            so.so_num AS doc_num, 
            so.so_line AS line_number, 
            so.item_num AS item_num, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for sales orders yet
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${config.dates.totals.primary.startDate} 
            AND so.formatted_ship_date <= ${config.dates.totals.primary.endDate}
        `: sql``}

        ${config.dates.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT 
            'PROJECTION' AS doc_num, 
            'PROJECTION' AS line_number, 
            pr.item_number AS item_num, 
            COALESCE(pr.lbs,0) AS lbs, 
            COALESCE(pr."grossSales",0) AS sales, 
            COALESCE(pr.cogs,0) AS cogs, 
            COALESCE(pr.othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for projections yet

          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${config.dates.totals.primary.startDate} 
            AND pr.date <= ${config.dates.totals.primary.endDate}
          `: sql``}

          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

          GROUP BY ${sql(config.baseFormat.l1_field)} ` //prettier-ignore

    console.log(response)

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getSalesTotalPrimary = async (config, othpTableConfig) => {
  if (!config.baseFormat.l2_field) return []
  if (config.dates.trends.yearTrend) return [] // skip totals if trend is by year

  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data period total (l2_getSalesTotalPrimary) ...`)

    const response = await sql
      `
      WITH othp_lines AS (
        SELECT * FROM ${sql(othpTableConfig.othpTable)}
      )
      
      SELECT 
      'SALES TOTAL' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      'SUBTOTAL' AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      SUM(pj.lbs) AS lbs, 
      SUM(pj.sales) AS "grossSales", 
      SUM(pj.cogs) AS cogs, 
      SUM(pj.othp) AS othp, 
      SUM(pj.sales) - SUM(pj.othp) AS "netSales", 
      SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp) AS "grossMargin", 
      COALESCE((SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp))/NULLIF(SUM(pj.sales),0),0) AS "grossMarginPercent", 
      COALESCE(SUM(pj.sales)/NULLIF(SUM(pj.lbs),0),0) AS "grossSalesPerLb", 
      COALESCE((SUM(pj.sales) - SUM(pj.othp))/NULLIF(SUM(pj.lbs),0),0) AS "netSalesPerLb", 
      COALESCE((SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp))/NULLIF(SUM(pj.lbs),0),0) AS "grossMarginPerLb", 
      COALESCE(SUM(pj.cogs)/NULLIF(SUM(pj.lbs),0),0) AS "cogsPerLb", 
      COALESCE(SUM(pj.othp)/NULLIF(SUM(pj.lbs),0),0) AS "othpPerLb"
      ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)}),0) AS ${sql(gl.display_name)} `)}`}
      ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)})/NULLIF(SUM(pj.lbs),0),0) AS ${sql(gl.display_name)}PerLb`)}`}

      FROM (
        SELECT 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          'dummy' AS item_num, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp 
          ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`}
        WHERE
          1=2

        ${config.dates.totals.useProjection.sl ? sql`
        UNION ALL 
          SELECT 
            sl.invoice_number AS doc_num, 
            sl.line_number, 
            sl.item_number AS item_num, 
            COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
            COALESCE(sl.gross_sales_ext,0) AS sales, 
            COALESCE(sl.cogs_ext_gl,0) AS cogs, 
            COALESCE(sl.othp_ext,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(oc.${sql(gl.display_name)},0) AS ${sql(gl.display_name)} `)}`}

          FROM "salesReporting".sales_line_items AS sl
            LEFT OUTER JOIN ${sql(othpTableConfig.othpTable)} AS oc
            ON oc.invoice_num = sl.invoice_number AND oc.invoice_line = sl.line_number
            
          WHERE
            sl.formatted_invoice_date >= ${config.dates.totals.primary.startDate} 
            AND sl.formatted_invoice_date <= ${config.dates.totals.primary.endDate}
          `: sql``}

        ${config.dates.totals.useProjection.so ? sql`
        UNION ALL
          SELECT 
            so.so_num AS doc_num, 
            so.so_line AS line_number, 
            so.item_num AS item_num, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for sales orders yet

          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${config.dates.totals.primary.startDate} 
            AND so.formatted_ship_date <= ${config.dates.totals.primary.endDate}
          `: sql``}

        ${config.dates.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT 
            'PROJECTION' AS doc_num, 
            'PROJECTION' AS line_number, 
            pr.item_number AS item_num, 
            COALESCE(pr.lbs,0) AS lbs, 
            COALESCE(pr."grossSales",0) AS sales, 
            COALESCE(pr.cogs,0) AS cogs, 
            COALESCE(pr.othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for projections yet

          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${config.dates.totals.primary.startDate} 
            AND pr.date <= ${config.dates.totals.primary.endDate}
          `: sql``}

          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (
            SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb
            )` : sql``}

      GROUP BY 
        ${sql(config.baseFormat.l1_field)}, 
        ${sql(config.baseFormat.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getSalesTotalPrimary = async (config, othpTableConfig) => {
  if (!config.baseFormat.l3_field) return []
  if (config.dates.trends.yearTrend) return [] // skip totals if trend is by year

  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data period total (l3_getSalesTotalPrimary) ...`)

    const response = await sql
      `
      WITH othp_lines AS (
        SELECT * FROM ${sql(othpTableConfig.othpTable)}
      )
      
      SELECT 
      'SALES TOTAL' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      SUM(pj.lbs) AS lbs, 
      SUM(pj.sales) AS "grossSales", 
      SUM(pj.cogs) AS cogs, 
      SUM(pj.othp) AS othp, 
      SUM(pj.sales) - SUM(pj.othp) AS "netSales", 
      SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp) AS "grossMargin", 
      COALESCE((SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp))/NULLIF(SUM(pj.sales),0),0) AS "grossMarginPercent", 
      COALESCE(SUM(pj.sales)/NULLIF(SUM(pj.lbs),0),0) AS "grossSalesPerLb", 
      COALESCE((SUM(pj.sales) - SUM(pj.othp))/NULLIF(SUM(pj.lbs),0),0) AS "netSalesPerLb", 
      COALESCE((SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp))/NULLIF(SUM(pj.lbs),0),0) AS "grossMarginPerLb", 
      COALESCE(SUM(pj.cogs)/NULLIF(SUM(pj.lbs),0),0) AS "cogsPerLb", 
      COALESCE(SUM(pj.othp)/NULLIF(SUM(pj.lbs),0),0) AS "othpPerLb"
      ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)}),0) AS ${sql(gl.display_name)} `)}`}
      ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)})/NULLIF(SUM(pj.lbs),0),0) AS ${sql(gl.display_name)}PerLb`)}`}

      FROM (
        SELECT 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          'dummy' AS item_num, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp 
          ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`}
        WHERE
          1=2

        ${config.dates.totals.useProjection.sl ? sql`
        UNION ALL 
          SELECT 
            sl.invoice_number AS doc_num, 
            sl.line_number, 
            sl.item_number AS item_num, 
            COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
            COALESCE(sl.gross_sales_ext,0) AS sales, 
            COALESCE(sl.cogs_ext_gl,0) AS cogs, 
            COALESCE(sl.othp_ext,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(oc.${sql(gl.display_name)},0) AS ${sql(gl.display_name)} `)}`}
          
          FROM "salesReporting".sales_line_items AS sl
            LEFT OUTER JOIN ${sql(othpTableConfig.othpTable)} AS oc
            ON oc.invoice_num = sl.invoice_number AND oc.invoice_line = sl.line_number
            
          WHERE
            sl.formatted_invoice_date >= ${config.dates.totals.primary.startDate} 
            AND sl.formatted_invoice_date <= ${config.dates.totals.primary.endDate}
          `: sql``}

        ${config.dates.totals.useProjection.so ? sql`
        UNION ALL
          SELECT 
            so.so_num AS doc_num, 
            so.so_line AS line_number, 
            so.item_num AS item_num, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for sales orders yet

          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${config.dates.totals.primary.startDate} 
            AND so.formatted_ship_date <= ${config.dates.totals.primary.endDate}
          `: sql``}

        ${config.dates.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT 
            'PROJECTION' AS doc_num, 
            'PROJECTION' AS line_number, 
            pr.item_number AS item_num, 
            COALESCE(pr.lbs,0) AS lbs, 
            COALESCE(pr."grossSales",0) AS sales, 
            COALESCE(pr.cogs,0) AS cogs, 
            COALESCE(pr.othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for projections yet

          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${config.dates.totals.primary.startDate} 
            AND pr.date <= ${config.dates.totals.primary.endDate}
          `: sql``}

          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (
            SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb
            )` : sql``}

      GROUP BY 
        ${sql(config.baseFormat.l1_field)}, 
        ${sql(config.baseFormat.l2_field)}, 
        ${sql(config.baseFormat.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getSalesTotalPrimary = async (config, othpTableConfig) => {
  if (!config.baseFormat.l4_field) return []
  if (config.dates.trends.yearTrend) return [] // skip totals if trend is by year

  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data period total (l4_getSalesTotalPrimary) ...`)

    const response = await sql
      `
      WITH othp_lines AS (
        SELECT * FROM ${sql(othpTableConfig.othpTable)}
      )
      
      SELECT 
      'SALES TOTAL' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      SUM(pj.lbs) AS lbs, 
      SUM(pj.sales) AS "grossSales", 
      SUM(pj.cogs) AS cogs, 
      SUM(pj.othp) AS othp, 
      SUM(pj.sales) - SUM(pj.othp) AS "netSales", 
      SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp) AS "grossMargin", 
      COALESCE((SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp))/NULLIF(SUM(pj.sales),0),0) AS "grossMarginPercent", 
      COALESCE(SUM(pj.sales)/NULLIF(SUM(pj.lbs),0),0) AS "grossSalesPerLb", 
      COALESCE((SUM(pj.sales) - SUM(pj.othp))/NULLIF(SUM(pj.lbs),0),0) AS "netSalesPerLb", 
      COALESCE((SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp))/NULLIF(SUM(pj.lbs),0),0) AS "grossMarginPerLb", 
      COALESCE(SUM(pj.cogs)/NULLIF(SUM(pj.lbs),0),0) AS "cogsPerLb", 
      COALESCE(SUM(pj.othp)/NULLIF(SUM(pj.lbs),0),0) AS "othpPerLb"
      ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)}),0) AS ${sql(gl.display_name)} `)}`}
      ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)})/NULLIF(SUM(pj.lbs),0),0) AS ${sql(gl.display_name)}PerLb`)}`}

      FROM (
        SELECT 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          'dummy' AS item_num, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp 
          ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`}
        WHERE
          1=2

        ${config.dates.totals.useProjection.sl ? sql`
        UNION ALL 
          SELECT 
            sl.invoice_number AS doc_num, 
            sl.line_number, 
            sl.item_number AS item_num, 
            COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
            COALESCE(sl.gross_sales_ext,0) AS sales, 
            COALESCE(sl.cogs_ext_gl,0) AS cogs, 
            COALESCE(sl.othp_ext,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(oc.${sql(gl.display_name)},0) AS ${sql(gl.display_name)} `)}`}
          
          FROM "salesReporting".sales_line_items AS sl
            LEFT OUTER JOIN ${sql(othpTableConfig.othpTable)} AS oc
            ON oc.invoice_num = sl.invoice_number AND oc.invoice_line = sl.line_number
            
          WHERE
            sl.formatted_invoice_date >= ${config.dates.totals.primary.startDate} 
            AND sl.formatted_invoice_date <= ${config.dates.totals.primary.endDate}
          `: sql``}

        ${config.dates.totals.useProjection.so ? sql`
        UNION ALL
          SELECT 
            so.so_num AS doc_num, 
            so.so_line AS line_number, 
            so.item_num AS item_num, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for sales orders yet

          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${config.dates.totals.primary.startDate} 
            AND so.formatted_ship_date <= ${config.dates.totals.primary.endDate}
          `: sql``}

        ${config.dates.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT 'PROJECTION' AS doc_num, 
          'PROJECTION' AS line_number, 
          pr.item_number AS item_num, 
          COALESCE(pr.lbs,0) AS lbs, 
          COALESCE(pr."grossSales",0) AS sales, 
          COALESCE(pr.cogs,0) AS cogs, 
          COALESCE(pr.othp,0) AS othp 
          ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for projections yet

          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${config.dates.totals.primary.startDate} 
            AND pr.date <= ${config.dates.totals.primary.endDate}
          `: sql``}

          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (
            SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb
            )` : sql``}

      GROUP BY 
        ${sql(config.baseFormat.l1_field)}, 
        ${sql(config.baseFormat.l2_field)}, 
        ${sql(config.baseFormat.l3_field)}, 
        ${sql(config.baseFormat.l4_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getSalesTotalPrimary = async (config, othpTableConfig) => {
  if (!config.baseFormat.l5_field) return []
  if (config.dates.trends.yearTrend) return [] // skip totals if trend is by year

  try {
    console.log(`${config.user} - level 5: query postgres to get FG sales data period total (l4_getSalesTotalPrimary) ...`)

    const response = await sql
      `
      WITH othp_lines AS (
        SELECT * FROM ${sql(othpTableConfig.othpTable)}
      )
      
      SELECT 
      'SALES TOTAL' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
      COALESCE(${sql(config.baseFormat.l5_field)},'NO VALUE') AS l5_label, 
      SUM(pj.lbs) AS lbs, 
      SUM(pj.sales) AS "grossSales", 
      SUM(pj.cogs) AS cogs, 
      SUM(pj.othp) AS othp, 
      SUM(pj.sales) - SUM(pj.othp) AS "netSales", 
      SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp) AS "grossMargin", 
      COALESCE((SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp))/NULLIF(SUM(pj.sales),0),0) AS "grossMarginPercent", 
      COALESCE(SUM(pj.sales)/NULLIF(SUM(pj.lbs),0),0) AS "grossSalesPerLb", 
      COALESCE((SUM(pj.sales) - SUM(pj.othp))/NULLIF(SUM(pj.lbs),0),0) AS "netSalesPerLb", 
      COALESCE((SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp))/NULLIF(SUM(pj.lbs),0),0) AS "grossMarginPerLb", 
      COALESCE(SUM(pj.cogs)/NULLIF(SUM(pj.lbs),0),0) AS "cogsPerLb", 
      COALESCE(SUM(pj.othp)/NULLIF(SUM(pj.lbs),0),0) AS "othpPerLb"
      ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)}),0) AS ${sql(gl.display_name)} `)}`}
      ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)})/NULLIF(SUM(pj.lbs),0),0) AS ${sql(gl.display_name)}PerLb`)}`}

      FROM (
        SELECT 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          'dummy' AS item_num, 0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp 
          ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`}
        WHERE
          1=2

        ${config.dates.totals.useProjection.sl ? sql`
        UNION ALL 
          SELECT 
            sl.invoice_number AS doc_num, 
            sl.line_number, 
            sl.item_number AS item_num, 
            COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
            COALESCE(sl.gross_sales_ext,0) AS sales, 
            COALESCE(sl.cogs_ext_gl,0) AS cogs, 
            COALESCE(sl.othp_ext,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(oc.${sql(gl.display_name)},0) AS ${sql(gl.display_name)} `)}`}
          
          FROM "salesReporting".sales_line_items AS sl
            LEFT OUTER JOIN ${sql(othpTableConfig.othpTable)} AS oc
            ON oc.invoice_num = sl.invoice_number AND oc.invoice_line = sl.line_number
            
          WHERE
            sl.formatted_invoice_date >= ${config.dates.totals.primary.startDate} 
            AND sl.formatted_invoice_date <= ${config.dates.totals.primary.endDate}
          `: sql``}

        ${config.dates.totals.useProjection.so ? sql`
        UNION ALL
          SELECT 
            so.so_num AS doc_num, 
            so.so_line AS line_number, 
            so.item_num AS item_num, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for sales orders yet

          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${config.dates.totals.primary.startDate} 
            AND so.formatted_ship_date <= ${config.dates.totals.primary.endDate}
          `: sql``}

        ${config.dates.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT 
            'PROJECTION' AS doc_num, 
            'PROJECTION' AS line_number, 
            pr.item_number AS item_num, 
            COALESCE(pr.lbs,0) AS lbs, 
            COALESCE(pr."grossSales",0) AS sales, 
            COALESCE(pr.cogs,0) AS cogs, 
            COALESCE(pr.othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for projections yet

          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${config.dates.totals.primary.startDate} 
            AND pr.date <= ${config.dates.totals.primary.endDate}
          `: sql``}

          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (
            SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb
            )` : sql``}

      GROUP BY 
        ${sql(config.baseFormat.l1_field)}, 
        ${sql(config.baseFormat.l2_field)}, 
        ${sql(config.baseFormat.l3_field)}, 
        ${sql(config.baseFormat.l4_field)}, 
        ${sql(config.baseFormat.l5_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getSalesTotalPrimary = async (config, othpTableConfig) => {
  if (config.dates.trends.yearTrend) return [] // skip totals if trend is by year

  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data period total (l0_getSalesTotalPrimary) ...`)

    const response = await sql
      `
      WITH othp_lines AS (
        SELECT * FROM ${sql(othpTableConfig.othpTable)}
      )

      SELECT 
      'SALES TOTAL' AS column, 'TOTAL' AS l1_label, 
      SUM(pj.lbs) AS lbs, 
      SUM(pj.sales) AS "grossSales", 
      SUM(pj.cogs) AS cogs, 
      SUM(pj.othp) AS othp, 
      SUM(pj.sales) - SUM(pj.othp) AS "netSales", 
      SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp) AS "grossMargin", 
      COALESCE((SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp))/NULLIF(SUM(pj.sales),0),0) AS "grossMarginPercent", 
      COALESCE(SUM(pj.sales)/NULLIF(SUM(pj.lbs),0),0) AS "grossSalesPerLb", 
      COALESCE((SUM(pj.sales) - SUM(pj.othp))/NULLIF(SUM(pj.lbs),0),0) AS "netSalesPerLb", 
      COALESCE((SUM(pj.sales) - SUM(pj.cogs) - SUM(pj.othp))/NULLIF(SUM(pj.lbs),0),0) AS "grossMarginPerLb", 
      COALESCE(SUM(pj.cogs)/NULLIF(SUM(pj.lbs),0),0) AS "cogsPerLb", 
      COALESCE(SUM(pj.othp)/NULLIF(SUM(pj.lbs),0),0) AS "othpPerLb"
      ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)}),0) AS ${sql(gl.display_name)} `)}`}
      ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)})/NULLIF(SUM(pj.lbs),0),0) AS ${sql(gl.display_name)}PerLb`)}`}

      FROM (
        SELECT 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          'dummy' AS item_num, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp 
          ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`}
        WHERE
          1=2

        ${config.dates.totals.useProjection.sl ? sql`
        UNION ALL 
          SELECT 
            sl.invoice_number AS doc_num, 
            sl.line_number, 
            sl.item_number AS item_num, 
            COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
            COALESCE(sl.gross_sales_ext,0) AS sales, 
            COALESCE(sl.cogs_ext_gl,0) AS cogs, 
            COALESCE(sl.othp_ext,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(oc.${sql(gl.display_name)},0) AS ${sql(gl.display_name)} `)}`}
        
          FROM "salesReporting".sales_line_items AS sl 
            LEFT OUTER JOIN ${sql(othpTableConfig.othpTable)} AS oc
            ON oc.invoice_num = sl.invoice_number AND oc.invoice_line = sl.line_number
            
          WHERE 
            sl.formatted_invoice_date >= ${config.dates.totals.primary.startDate} 
            AND sl.formatted_invoice_date <= ${config.dates.totals.primary.endDate} 
        `: sql``}

        ${config.dates.totals.useProjection.so ? sql`
        UNION ALL
          SELECT 
            so.so_num AS doc_num, 
            so.so_line AS line_number, 
            so.item_num AS item_num, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for sales orders yet
            
          FROM "salesReporting".sales_orders AS so 
         
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
            AND so.formatted_ship_date >= ${config.dates.totals.primary.startDate} 
            AND so.formatted_ship_date <= ${config.dates.totals.primary.endDate}
        `: sql``}

        ${config.dates.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT 
            'PROJECTION' AS doc_num, 
            'PROJECTION' AS line_number, 
            pr.item_number AS item_num, 
            COALESCE(pr.lbs,0) AS lbs, 
            COALESCE(pr."grossSales",0) AS sales, 
            COALESCE(pr.cogs,0) AS cogs, 
            COALESCE(pr.othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for projections yet

          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${config.dates.totals.primary.startDate} 
            AND pr.date <= ${config.dates.totals.primary.endDate}
          `: sql``}

          ) AS pj
          
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (
            SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb
            )` : sql``}
          
            ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = {
  l0_getSalesTotalPrimary,
  l1_getSalesTotalPrimary,
  l2_getSalesTotalPrimary,
  l3_getSalesTotalPrimary,
  l4_getSalesTotalPrimary,
  l5_getSalesTotalPrimary,
}
