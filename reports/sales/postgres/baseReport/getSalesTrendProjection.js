const sql = require('../../../../server')

const l1_getSalesTrend = async config => {
  if (!config.dates.trends.queryGrouping) return []
  if (!config.baseFormat.l1_field) return []

  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data by week (l1_getSalesTrend) ...`)

    const response = await sql
      `
      WITH othp_lines AS (
        SELECT * FROM ${sql(othpTableConfig.othpTable)}
      )
      
      SELECT 
      pj.column, 
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
      ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)})/NULLIF(SUM(pj.lbs),0),0) AS ${sql(gl.display_name + 'PerLb')}`)}`}
      
      FROM (
        SELECT 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          'dummy' AS item_num, 
          'dummy' AS column, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp 
          ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`}
        WHERE
          1=2

        ${config.dates.trends.useProjection.sl ? sql`
        UNION ALL 
          SELECT 
            sl.invoice_number AS doc_num, 
            sl.line_number, 
            sl.item_number AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
            COALESCE(sl.gross_sales_ext,0) AS sales, 
            COALESCE(sl.cogs_ext_gl,0) AS cogs, 
            COALESCE(sl.othp_ext,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(oc.${sql(gl.display_name)},0) AS ${sql(gl.display_name)} `)}`}
          
          FROM "salesReporting".sales_line_items AS sl 
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p 
              ON sl.formatted_invoice_date = p.formatted_date 
            LEFT OUTER JOIN ${sql(othpTableConfig.othpTable)} AS oc 
              ON oc.invoice_num = sl.invoice_number AND oc.invoice_line = sl.line_number 

          WHERE 
            ${!config.dates.trends.yearTrend ? sql`
              p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql` 
              ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)} 
            ` } 

        `: sql``}
        
        ${config.dates.trends.useProjection.so ? sql`  
        UNION ALL 
          SELECT 
            so.so_num AS doc_num, 
            so.so_line AS line_number, 
            so.item_num AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for sales orders yet

          FROM "salesReporting".sales_orders AS so 
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p 
            ON so.formatted_ship_date = p.formatted_date 

          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
            ${!config.dates.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql`
              AND ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
            ` } 
          
        
        `: sql``} 

        ${config.dates.trends.useProjection.pr ? sql` 
        UNION ALL 
          SELECT 
            'PROJECTION' AS doc_num, 
            'PROJECTION' AS line_number, 
            pr.item_number AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(pr.lbs,0) AS lbs, 
            COALESCE(pr."grossSales",0) AS sales, 
            COALESCE(pr.cogs,0) AS cogs, 
            COALESCE(pr.othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for projections yet
        
          FROM "salesReporting".projected_sales AS pr 
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p 
              ON pr.date = p.formatted_date 

          WHERE 
          ${!config.dates.trends.yearTrend ? sql`
            p.formatted_date >= ${config.dates.trends.startDate} 
            AND p.formatted_date <= ${config.dates.trends.endDate}` : 
          sql`
            ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
            AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
            AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
          ` }
        
        `: sql``}

          ) AS pj
          
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

      WHERE
        1=1 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY pj.column, ${sql(config.baseFormat.l1_field)} 
      
      ORDER BY pj.column` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    console.log(error.query)
    return error
  }
}

const l2_getSalesTrend = async config => {
  if (!config.dates.trends.queryGrouping) return []
  if (!config.baseFormat.l2_field) return []

  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data by week (l2_getSalesTrend) ...`)

    const response = await sql
      `
      WITH othp_lines AS (
        SELECT * FROM ${sql(othpTableConfig.othpTable)}
      )
      
      SELECT 
      pj.column, 
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
      ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)})/NULLIF(SUM(pj.lbs),0),0) AS ${sql(gl.display_name + 'PerLb')}`)}`}

      FROM (
        SELECT 
          'dummy' AS doc_num,
          'dummy' AS line_number, 
          'dummy' AS item_num, 
          'dummy' AS column, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp 
          ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`}
        WHERE
          1=2


        ${config.dates.trends.useProjection.sl ? sql`
        UNION ALL
          SELECT 
            sl.invoice_number AS doc_num, 
            sl.line_number, 
            sl.item_number AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
            COALESCE(sl.gross_sales_ext,0) AS sales, 
            COALESCE(sl.cogs_ext_gl,0) AS cogs, 
            COALESCE(sl.othp_ext,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(oc.${sql(gl.display_name)},0) AS ${sql(gl.display_name)} `)}`}
          
          FROM "salesReporting".sales_line_items AS sl
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
              ON sl.formatted_invoice_date = p.formatted_date
            LEFT OUTER JOIN ${sql(othpTableConfig.othpTable)} AS oc
              ON oc.invoice_num = sl.invoice_number AND oc.invoice_line = sl.line_number
            
          WHERE
            ${!config.dates.trends.yearTrend ? sql`
            p.formatted_date >= ${config.dates.trends.startDate} 
            AND p.formatted_date <= ${config.dates.trends.endDate}` : 
          sql`
            ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
            AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
            AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
          ` }
        
        `: sql``}


        ${config.dates.trends.useProjection.so ? sql`  
        UNION ALL
          SELECT 
            so.so_num AS doc_num, 
            so.so_line AS line_number, 
            so.item_num AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for sales orders yet
      
          FROM "salesReporting".sales_orders AS so
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON so.formatted_ship_date = p.formatted_date
           
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            ${!config.dates.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql`
              AND ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
            ` }
        
        `: sql``}


        ${config.dates.trends.useProjection.pr ? sql` 
        UNION ALL
          SELECT 
            'PROJECTION' AS doc_num, 
            'PROJECTION' AS line_number, 
            pr.item_number AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(pr.lbs,0) AS lbs, 
            COALESCE(pr."grossSales",0) AS sales, 
            COALESCE(pr.cogs,0) AS cogs, 
            COALESCE(pr.othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for projections yet
          
          FROM "salesReporting".projected_sales AS pr 
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON pr.date = p.formatted_date       
          
          WHERE 
            ${!config.dates.trends.yearTrend ? sql`
            p.formatted_date >= ${config.dates.trends.startDate} 
            AND p.formatted_date <= ${config.dates.trends.endDate}` : 
          sql`
            ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
            AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
            AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
          ` }
        
        `: sql``}


          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY pj.column, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)} 
      
      ORDER BY pj.column` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getSalesTrend = async config => {
  if (!config.dates.trends.queryGrouping) return []
  if (!config.baseFormat.l3_field) return []

  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data by week (l3_getSalesTrend) ...`)

    const response = await sql
      `
      WITH othp_lines AS (
        SELECT * FROM ${sql(othpTableConfig.othpTable)}
      )
      
      SELECT 
      pj.column, 
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
      ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)})/NULLIF(SUM(pj.lbs),0),0) AS ${sql(gl.display_name + 'PerLb')}`)}`}

      FROM (
        SELECT 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          'dummy' AS item_num, 
          'dummy' AS column, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp 
          ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`}
        WHERE
          1=2

        ${config.dates.trends.useProjection.sl ? sql`
        UNION ALL
          SELECT 
            sl.invoice_number AS doc_num, 
            sl.line_number, 
            sl.item_number AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
            COALESCE(sl.gross_sales_ext,0) AS sales, 
            COALESCE(sl.cogs_ext_gl,0) AS cogs, 
            COALESCE(sl.othp_ext,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(oc.${sql(gl.display_name)},0) AS ${sql(gl.display_name)} `)}`}
          
          FROM "salesReporting".sales_line_items AS sl
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
              ON sl.formatted_invoice_date = p.formatted_date
            LEFT OUTER JOIN ${sql(othpTableConfig.othpTable)} AS oc
              ON oc.invoice_num = sl.invoice_number AND oc.invoice_line = sl.line_number
            
          WHERE
            ${!config.dates.trends.yearTrend ? sql`
            p.formatted_date >= ${config.dates.trends.startDate} 
            AND p.formatted_date <= ${config.dates.trends.endDate}` : 
          sql`
            ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
            AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
            AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
          ` }
        
        `: sql``}


        ${config.dates.trends.useProjection.so ? sql`  
        UNION ALL
          SELECT 
            so.so_num AS doc_num, 
            so.so_line AS line_number, 
            so.item_num AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for sales orders yet
      
          FROM "salesReporting".sales_orders AS so
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON so.formatted_ship_date = p.formatted_date
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            ${!config.dates.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql`
              AND ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
            ` }
        
        `: sql``}

        ${config.dates.trends.useProjection.pr ? sql` 
        UNION ALL
          SELECT 
            'PROJECTION' AS doc_num, 
            'PROJECTION' AS line_number, 
            pr.item_number AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(pr.lbs,0) AS lbs, 
            COALESCE(pr."grossSales",0) AS sales, 
            COALESCE(pr.cogs,0) AS cogs, 
            COALESCE(pr.othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for projections yet
        
          FROM "salesReporting".projected_sales AS pr    
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON pr.date = p.formatted_date    
        
          WHERE 
            ${!config.dates.trends.yearTrend ? sql`
            p.formatted_date >= ${config.dates.trends.startDate} 
            AND p.formatted_date <= ${config.dates.trends.endDate}` : 
          sql`
            ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
            AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
            AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
          ` }
        
        `: sql``}



          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY pj.column, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}
      
      ORDER BY pj.column` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getSalesTrend = async config => {
  if (!config.dates.trends.queryGrouping) return []
  if (!config.baseFormat.l4_field) return []

  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data by week (l4_getSalesTrend) ...`)

    const response = await sql
      `
      WITH othp_lines AS (
        SELECT * FROM ${sql(othpTableConfig.othpTable)}
      )
      
      SELECT 
      pj.column, 
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
      ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)})/NULLIF(SUM(pj.lbs),0),0) AS ${sql(gl.display_name + 'PerLb')}`)}`}
      
      FROM (
        SELECT 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          'dummy' AS item_num, 
          'dummy' AS column, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp 
          ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`}
        WHERE
          1=2

        ${config.dates.trends.useProjection.sl ? sql`
        UNION ALL
          SELECT 
            sl.invoice_number AS doc_num, 
            sl.line_number, 
            sl.item_number AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
            COALESCE(sl.gross_sales_ext,0) AS sales, 
            COALESCE(sl.cogs_ext_gl,0) AS cogs, 
            COALESCE(sl.othp_ext,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(oc.${sql(gl.display_name)},0) AS ${sql(gl.display_name)} `)}`}
          
          FROM "salesReporting".sales_line_items AS sl
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
              ON sl.formatted_invoice_date = p.formatted_date
            LEFT OUTER JOIN ${sql(othpTableConfig.othpTable)} AS oc
              ON oc.invoice_num = sl.invoice_number AND oc.invoice_line = sl.line_number
            
          WHERE
            ${!config.dates.trends.yearTrend ? sql`
            p.formatted_date >= ${config.dates.trends.startDate} 
            AND p.formatted_date <= ${config.dates.trends.endDate}` : 
          sql`
            ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
            AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
            AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
          ` }
        
        
        `: sql``}


        ${config.dates.trends.useProjection.so ? sql`  
        UNION ALL
          SELECT 
            so.so_num AS doc_num, 
            so.so_line AS line_number, 
            so.item_num AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for sales orders yet
      
          FROM "salesReporting".sales_orders AS so
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON so.formatted_ship_date = p.formatted_date
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            ${!config.dates.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql`
              AND ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
            ` }
        
        `: sql``}


        ${config.dates.trends.useProjection.pr ? sql` 
        UNION ALL
          SELECT 
            'PROJECTION' AS doc_num, 
            'PROJECTION' AS line_number, 
            pr.item_number AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(pr.lbs,0) AS lbs, 
            COALESCE(pr."grossSales",0) AS sales, 
            COALESCE(pr.cogs,0) AS cogs, 
            COALESCE(pr.othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for projections yet
        
          FROM "salesReporting".projected_sales AS pr     
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON pr.date = p.formatted_date   
        
          WHERE 
            ${!config.dates.trends.yearTrend ? sql`
            p.formatted_date >= ${config.dates.trends.startDate} 
            AND p.formatted_date <= ${config.dates.trends.endDate}` : 
          sql`
            ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
            AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
            AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
          ` }
        
        
        `: sql``}


          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY pj.column, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}
      
      ORDER BY pj.column` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getSalesTrend = async config => {
  if (!config.dates.trends.queryGrouping) return []
  if (!config.baseFormat.l5_field) return []

  try {
    console.log(`${config.user} - level 5: query postgres to get FG sales data by week (l4_getSalesTrend) ...`)

    const response = await sql
      `
      WITH othp_lines AS (
        SELECT * FROM ${sql(othpTableConfig.othpTable)}
      )
      
      SELECT 
      pj.column, 
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
      ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)})/NULLIF(SUM(pj.lbs),0),0) AS ${sql(gl.display_name + 'PerLb')}`)}`}

      FROM (
        SELECT 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          'dummy' AS item_num, 
          'dummy' AS column, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp 
          ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`}
        WHERE
          1=2

      ${config.dates.trends.useProjection.sl ? sql`
        UNION ALL
          SELECT 
            sl.invoice_number AS doc_num, 
            sl.line_number, 
            sl.item_number AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
            COALESCE(sl.gross_sales_ext,0) AS sales, 
            COALESCE(sl.cogs_ext_gl,0) AS cogs, 
            COALESCE(sl.othp_ext,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(oc.${sql(gl.display_name)},0) AS ${sql(gl.display_name)} `)}`}
          
          FROM "salesReporting".sales_line_items AS sl
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
              ON sl.formatted_invoice_date = p.formatted_date
            LEFT OUTER JOIN ${sql(othpTableConfig.othpTable)} AS oc
              ON oc.invoice_num = sl.invoice_number AND oc.invoice_line = sl.line_number
            
          WHERE
            ${!config.dates.trends.yearTrend ? sql`
            p.formatted_date >= ${config.dates.trends.startDate} 
            AND p.formatted_date <= ${config.dates.trends.endDate}` : 
          sql`
            ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
            AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
            AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
          ` }
        
        
        `: sql``}


        ${config.dates.trends.useProjection.so ? sql`  
        UNION ALL
          SELECT 
            so.so_num AS doc_num, 
            so.so_line AS line_number, 
            so.item_num AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for sales orders yet
      
          FROM "salesReporting".sales_orders AS so
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON so.formatted_ship_date = p.formatted_date
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            ${!config.dates.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql`
              AND ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
            ` }
        
        
        `: sql``}


        ${config.dates.trends.useProjection.pr ? sql` 
        UNION ALL
          SELECT 
            'PROJECTION' AS doc_num, 
            'PROJECTION' AS line_number, 
            pr.item_number AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(pr.lbs,0) AS lbs, 
            COALESCE(pr."grossSales",0) AS sales, 
            COALESCE(pr.cogs,0) AS cogs, 
            COALESCE(pr.othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for projections yet
        
          FROM "salesReporting".projected_sales AS pr   
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON pr.date = p.formatted_date     
        
          WHERE 
          ${!config.dates.trends.yearTrend ? sql`
              p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql`
              ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
            ` }
        
        `: sql``}

          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY pj.column, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}
      
      ORDER BY pj.column` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getSalesTrend = async config => {
  if (!config.dates.trends.queryGrouping) return []

  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data by week (l0_getSalesTrend) ...`)

    const response = await sql
      `
      WITH othp_lines AS (
        SELECT * FROM ${sql(othpTableConfig.othpTable)}
      )
      
      SELECT 
      pj.column, 
      'TOTAL' AS l1_label, 
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
      ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(SUM(pj.${sql(gl.display_name)})/NULLIF(SUM(pj.lbs),0),0) AS ${sql(gl.display_name + 'PerLb')}`)}`}

      FROM (
        SELECT 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          'dummy' AS item_num, 
          'dummy' AS column, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp 
          ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`}
        WHERE
          1=2

      ${config.dates.trends.useProjection.sl ? sql`
        UNION ALL 
          SELECT 
            sl.invoice_number AS doc_num, 
            sl.line_number, 
            sl.item_number AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
            COALESCE(sl.gross_sales_ext,0) AS sales, 
            COALESCE(sl.cogs_ext_gl,0) AS cogs, 
            COALESCE(sl.othp_ext,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(oc.${sql(gl.display_name)},0) AS ${sql(gl.display_name)} `)}`}
        
          FROM "salesReporting".sales_line_items AS sl 
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
              ON sl.formatted_invoice_date = p.formatted_date
            LEFT OUTER JOIN ${sql(othpTableConfig.othpTable)} AS oc
              ON oc.invoice_num = sl.invoice_number AND oc.invoice_line = sl.line_number
            
          WHERE 
            ${!config.dates.trends.yearTrend ? sql`
            p.formatted_date >= ${config.dates.trends.startDate} 
            AND p.formatted_date <= ${config.dates.trends.endDate}` : 
          sql`
            ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
            AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
            AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
          ` }
          
        `: sql``}


        ${config.dates.trends.useProjection.so ? sql`  
        UNION ALL
          SELECT 
            so.so_num AS doc_num, 
            so.so_line AS line_number, 
            so.item_num AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for sales orders yet
      
          FROM "salesReporting".sales_orders AS so 
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON so.formatted_ship_date = p.formatted_date
          
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
            ${!config.dates.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql`
              AND ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
            ` }
          
        `: sql``}


        ${config.dates.trends.useProjection.pr ? sql` 
        UNION ALL
          SELECT 
            'PROJECTION' AS doc_num, 
            'PROJECTION' AS line_number, 
            pr.item_number AS item_num, 
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(pr.lbs,0) AS lbs, 
            COALESCE(pr."grossSales",0) AS sales, 
            COALESCE(pr.cogs,0) AS cogs, 
            COALESCE(pr.othp,0) AS othp 
            ${sql`${othpTableConfig.othpGls.map(gl => sql`, 0 AS ${sql(gl.display_name)} `)}`} -- no data for projections yet
        
          FROM "salesReporting".projected_sales AS pr  
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON pr.date = p.formatted_date      
        
          WHERE 
            ${!config.dates.trends.yearTrend ? sql`
            p.formatted_date >= ${config.dates.trends.startDate} 
            AND p.formatted_date <= ${config.dates.trends.endDate}` : 
          sql`
            ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
            AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
            AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
          ` }
          
        `: sql``}

          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY pj.column 
      
      ORDER BY pj.column` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = { l0_getSalesTrend, l1_getSalesTrend, l2_getSalesTrend, l3_getSalesTrend, l4_getSalesTrend, l5_getSalesTrend }
