const sql = require('../../../../server')

const l1_getAveSales = async config => {
  if (!config.baseFormat.l1_field) return []
  // loop through config trailing weeks for date ranges and denominators to get ave.

  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data period total (l1_getAveSales) ...`)

    const promises = []
    for (trailingWeek of config.trailingWeeks) {
      promises.push(sql
        `SELECT 
        ${trailingWeek.dataName} AS column, 
        COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
        'SUBTOTAL' AS l2_label, 
        'SUBTOTAL' AS l3_label, 
        'SUBTOTAL' AS l4_label, 
        'SUBTOTAL' AS l5_label, 
        SUM(pj.lbs)/${trailingWeek.weeks} AS lbs, 
        SUM(pj.sales)/${trailingWeek.weeks} AS "grossSales", 
        SUM(pj.cogs)/${trailingWeek.weeks} AS cogs, 
        SUM(pj.othp)/${trailingWeek.weeks} AS othp, 
        (SUM(pj.sales)-SUM(pj.othp))/${trailingWeek.weeks} AS "netSales", 
        (SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks} AS "grossMargin", 
        COALESCE(((SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks})/NULLIF((SUM(pj.sales)/${trailingWeek.weeks}),0),0) AS "grossMarginPercent",
        COALESCE((SUM(pj.sales)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "grossSalesPerLb", 
        COALESCE((SUM(pj.cogs)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "cogsPerLb", 
        COALESCE((SUM(pj.othp)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "othpPerLb", 
        COALESCE(((SUM(pj.sales)-SUM(pj.othp))/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "netSalesPerLb", 
        COALESCE(((SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks})//NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "grossMarginPerLb"
      
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
              sl.formatted_invoice_date >= ${trailingWeek.start} AND sl.formatted_invoice_date <= ${trailingWeek.end} 
          `: sql``}
  
          ${config.totals.useProjection.so ? sql`
          UNION ALL
            SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
        
            FROM "salesReporting".sales_orders AS so
              
            WHERE 
              so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
              AND so.formatted_ship_date >= ${trailingWeek.start} AND so.formatted_ship_date <= ${trailingWeek.end}
          `: sql``}
  
          ${config.totals.useProjection.pr ? sql` 
          UNION ALL
            SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_gross,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp 
          
            FROM "salesReporting".projected_sales AS pr        
          
            WHERE 
              pr.date >= ${trailingWeek.start} AND pr.date <= ${trailingWeek.end}
            `: sql``}
  
            ) AS pj
  
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = pj.item_num
  
            WHERE
            1=1 
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
            ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
  
            GROUP BY ${sql(config.baseFormat.l1_field)} `) //prettier-ignore
    }
    const results = await Promise.all(promises)

    const reduced = results.reduce((acc, cur) => {
      return acc.concat(cur)
    }, [])

    return reduced
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getAveSales = async config => {
  if (!config.baseFormat.l2_field) return []

  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data period total (l2_getAveSales) ...`)

    const promises = []
    for (trailingWeek of config.trailingWeeks) {
      promises.push(sql
      `SELECT 
      ${trailingWeek.dataName} AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 
      'SUBTOTAL' AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      SUM(pj.lbs)/${trailingWeek.weeks} AS lbs, 
      SUM(pj.sales)/${trailingWeek.weeks} AS "grossSales", 
      SUM(pj.cogs)/${trailingWeek.weeks} AS cogs, 
      SUM(pj.othp)/${trailingWeek.weeks} AS othp, 
      (SUM(pj.sales)-SUM(pj.othp))/${trailingWeek.weeks} AS "netSales", 
      (SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks} AS "grossMargin", 
      COALESCE(((SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks})/NULLIF((SUM(pj.sales)/${trailingWeek.weeks}),0),0) AS "grossMarginPercent",
      COALESCE((SUM(pj.sales)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "grossSalesPerLb", 
      COALESCE((SUM(pj.cogs)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "cogsPerLb", 
      COALESCE((SUM(pj.othp)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "othpPerLb", 
      COALESCE(((SUM(pj.sales)-SUM(pj.othp))/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "netSalesPerLb", 
      COALESCE(((SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks})//NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "grossMarginPerLb"
      
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
            sl.formatted_invoice_date >= ${trailingWeek.start} AND sl.formatted_invoice_date <= ${trailingWeek.end}
          `: sql``}

        ${config.totals.useProjection.so ? sql`
        UNION ALL
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${trailingWeek.start} AND so.formatted_ship_date <= ${trailingWeek.end}
          `: sql``}

        ${config.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_gross,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp 
        
          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${trailingWeek.start} AND pr.date <= ${trailingWeek.end}
          `: sql``}

          ) AS pj

          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_num

          WHERE
          1=1 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}`) //prettier-ignore
    }
    const results = await Promise.all(promises)

    const reduced = results.reduce((acc, cur) => {
      return acc.concat(cur)
    }, [])

    return reduced
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getAveSales = async config => {
  if (!config.baseFormat.l3_field) return []

  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data period total (l3_getAveSales) ...`)

    const trailingWeeks = []
    for (trailingWeek of config.trailingWeeks) {
      const response = await sql
      `SELECT 
      ${trailingWeek.dataName} AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label,
      SUM(pj.lbs)/${trailingWeek.weeks} AS lbs, 
      SUM(pj.sales)/${trailingWeek.weeks} AS "grossSales", 
      SUM(pj.cogs)/${trailingWeek.weeks} AS cogs, 
      SUM(pj.othp)/${trailingWeek.weeks} AS othp, 
      (SUM(pj.sales)-SUM(pj.othp))/${trailingWeek.weeks} AS "netSales", 
      (SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks} AS "grossMargin", 
      COALESCE(((SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks})/NULLIF((SUM(pj.sales)/${trailingWeek.weeks}),0),0) AS "grossMarginPercent",
      COALESCE((SUM(pj.sales)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "grossSalesPerLb", 
      COALESCE((SUM(pj.cogs)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "cogsPerLb", 
      COALESCE((SUM(pj.othp)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "othpPerLb", 
      COALESCE(((SUM(pj.sales)-SUM(pj.othp))/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "netSalesPerLb", 
      COALESCE(((SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks})//NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "grossMarginPerLb"
      
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
            sl.formatted_invoice_date >= ${trailingWeek.start} AND sl.formatted_invoice_date <= ${trailingWeek.end}
          `: sql``}

        ${config.totals.useProjection.so ? sql`
        UNION ALL
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${trailingWeek.start} AND so.formatted_ship_date <= ${trailingWeek.end}
          `: sql``}

        ${config.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_gross,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp 
        
          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${trailingWeek.start} AND pr.date <= ${trailingWeek.end}
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

      trailingWeeks.push(...response)
    }
    return trailingWeeks
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getAveSales = async config => {
  if (!config.baseFormat.l4_field) return []

  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data period total (l4_getAveSales) ...`)

    const trailingWeeks = []
    for (trailingWeek of config.trailingWeeks) {
      const response = await sql
      `SELECT 
      ${trailingWeek.dataName} AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 
      COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      SUM(pj.lbs)/${trailingWeek.weeks} AS lbs, 
      SUM(pj.sales)/${trailingWeek.weeks} AS "grossSales", 
      SUM(pj.cogs)/${trailingWeek.weeks} AS cogs, 
      SUM(pj.othp)/${trailingWeek.weeks} AS othp, 
      (SUM(pj.sales)-SUM(pj.othp))/${trailingWeek.weeks} AS "netSales", 
      (SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks} AS "grossMargin", 
      COALESCE(((SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks})/NULLIF((SUM(pj.sales)/${trailingWeek.weeks}),0),0) AS "grossMarginPercent",
      COALESCE((SUM(pj.sales)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "grossSalesPerLb", 
      COALESCE((SUM(pj.cogs)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "cogsPerLb", 
      COALESCE((SUM(pj.othp)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "othpPerLb", 
      COALESCE(((SUM(pj.sales)-SUM(pj.othp))/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "netSalesPerLb", 
      COALESCE(((SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks})//NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "grossMarginPerLb"
      
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
            sl.formatted_invoice_date >= ${trailingWeek.start} AND sl.formatted_invoice_date <= ${trailingWeek.end}
          `: sql``}

        ${config.totals.useProjection.so ? sql`
        UNION ALL
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${trailingWeek.start} AND so.formatted_ship_date <= ${trailingWeek.end}
          `: sql``}

        ${config.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_gross,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp 
        
          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${trailingWeek.start} AND pr.date <= ${trailingWeek.end}
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

      trailingWeeks.push(...response)
    }
    return trailingWeeks
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getAveSales = async config => {
  if (!config.baseFormat.l5_field) return []

  try {
    console.log(`${config.user} - level 5: query postgres to get FG sales data period total (l4_getAveSales) ...`)

    const trailingWeeks = []
    for (trailingWeek of config.trailingWeeks) {
      const response = await sql
      `SELECT 
      ${trailingWeek.dataName} AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 
      COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 
      COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, 
      SUM(pj.lbs)/${trailingWeek.weeks} AS lbs, 
      SUM(pj.sales)/${trailingWeek.weeks} AS "grossSales", 
      SUM(pj.cogs)/${trailingWeek.weeks} AS cogs, 
      SUM(pj.othp)/${trailingWeek.weeks} AS othp, 
      (SUM(pj.sales)-SUM(pj.othp))/${trailingWeek.weeks} AS "netSales", 
      (SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks} AS "grossMargin", 
      COALESCE(((SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks})/NULLIF((SUM(pj.sales)/${trailingWeek.weeks}),0),0) AS "grossMarginPercent",
      COALESCE((SUM(pj.sales)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "grossSalesPerLb", 
      COALESCE((SUM(pj.cogs)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "cogsPerLb", 
      COALESCE((SUM(pj.othp)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "othpPerLb", 
      COALESCE(((SUM(pj.sales)-SUM(pj.othp))/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "netSalesPerLb", 
      COALESCE(((SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks})//NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "grossMarginPerLb"
      
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
            sl.formatted_invoice_date >= ${trailingWeek.start} AND sl.formatted_invoice_date <= ${trailingWeek.end}
          `: sql``}

        ${config.totals.useProjection.so ? sql`
        UNION ALL
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${trailingWeek.start} AND so.formatted_ship_date <= ${trailingWeek.end}
          `: sql``}

        ${config.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_gross,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp 
        
          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${trailingWeek.start} AND pr.date <= ${trailingWeek.end}
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

      trailingWeeks.push(...response)
    }
    return trailingWeeks
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getAveSales = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data period total (l0_getAveSales) ...`)

    const trailingWeeks = []
    for (trailingWeek of config.trailingWeeks) {
      const response = await sql
      `
      SELECT 
      ${trailingWeek.dataName} AS column, 
      'TOTAL' AS l1_label, 
      SUM(pj.lbs)/${trailingWeek.weeks} AS lbs, 
      SUM(pj.sales)/${trailingWeek.weeks} AS "grossSales", 
      SUM(pj.cogs)/${trailingWeek.weeks} AS cogs, 
      SUM(pj.othp)/${trailingWeek.weeks} AS othp, 
      (SUM(pj.sales)-SUM(pj.othp))/${trailingWeek.weeks} AS "netSales", 
      (SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks} AS "grossMargin", 
      COALESCE(((SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks})/NULLIF((SUM(pj.sales)/${trailingWeek.weeks}),0),0) AS "grossMarginPercent",
      COALESCE((SUM(pj.sales)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "grossSalesPerLb", 
      COALESCE((SUM(pj.cogs)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "cogsPerLb", 
      COALESCE((SUM(pj.othp)/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "othpPerLb", 
      COALESCE(((SUM(pj.sales)-SUM(pj.othp))/${trailingWeek.weeks})/NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "netSalesPerLb", 
      COALESCE(((SUM(pj.sales)-SUM(pj.othp)-SUM(pj.cogs))/${trailingWeek.weeks})//NULLIF((SUM(pj.lbs)/${trailingWeek.weeks}),0),0) AS "grossMarginPerLb"
      
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
            sl.formatted_invoice_date >= ${trailingWeek.start} AND sl.formatted_invoice_date <= ${trailingWeek.end} 
        `: sql``}

        ${config.totals.useProjection.so ? sql`
        UNION ALL
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so 
         
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
            AND so.formatted_ship_date >= ${trailingWeek.start} AND so.formatted_ship_date <= ${trailingWeek.end}
        `: sql``}

        ${config.totals.useProjection.pr ? sql` 
        UNION ALL
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_gross,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp 
        
          FROM "salesReporting".projected_sales AS pr        
        
          WHERE 
            pr.date >= ${trailingWeek.start} AND pr.date <= ${trailingWeek.end}
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

      trailingWeeks.push(...response)
    }
    return trailingWeeks
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = { l0_getAveSales, l1_getAveSales, l2_getAveSales, l3_getAveSales, l4_getAveSales, l5_getAveSales }
