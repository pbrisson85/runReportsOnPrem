// Get the SO+SL report for all SO ans SL for each week applicable. Meaning: look at first week of SO. Test if there are any SL in this week. Look at following week. Stop when there are no more SL in the week.

const sql = require('../../../../server')

/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const l1_getSalesProjectionByWk = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data by week (l1_getSalesProjectionByWk) ...`)

    const response = await sql
      `SELECT pj.column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, sl.week_serial || '_pj' AS column, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
        
        FROM "salesReporting".sales_line_items AS sl

        WHERE
          sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end}
        
        UNION 
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, so.week_serial || '_pj' AS column, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so        
      
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}

        UNION 
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, ps.week_serial || '_pj' AS column, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
        
          FROM "salesReporting".projected_sales AS ps        
        
          WHERE 
            ps.date >= ${start} AND ps.date <= ${end}
          
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

// FG Species Group col total for period

const l1_getSalesProjectionPeriodToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data period total (l1_getSalesProjectionPeriodToDate) ...`)

    const response = await sql
      `SELECT 'SALES PROJECTION TOTAL' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
        
        FROM "salesReporting".sales_line_items AS sl 
          
        WHERE 
          sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
          
        UNION 
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}

        UNION 
        SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
      
        FROM "salesReporting".projected_sales AS ps        
      
        WHERE 
          ps.date >= ${start} AND ps.date <= ${end}

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

// FG Program row totals by week

const l2_getSalesProjectionByWk = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data by week (l2_getSalesProjectionByWk) ...`)

    const response = await sql
      `SELECT pj.column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, sl.week_serial || '_pj' AS column, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
        
        FROM "salesReporting".sales_line_items AS sl
          
        WHERE
          sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end}
        
        UNION 
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, so.week_serial || '_pj' AS column, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so
           
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}

        UNION 
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, ps.week_serial || '_pj' AS column, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
          
          FROM "salesReporting".projected_sales AS ps        
          
          WHERE 
              ps.date >= ${start} AND ps.date <= ${end}

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

// FG Program col total for period

const l2_getSalesProjectionPeriodToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data period total (l2_getSalesProjectionPeriodToDate) ...`)

    const response = await sql
      `SELECT 'SALES PROJECTION TOTAL' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
        
        FROM "salesReporting".sales_line_items AS sl
          
        WHERE
          sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end}
        
        UNION 
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
            
        UNION 
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
        
          FROM "salesReporting".projected_sales AS ps        
        
          WHERE 
            ps.date >= ${start} AND ps.date <= ${end}

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

// FG Program row totals by week

const l3_getSalesProjectionByWk = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data by week (l3_getSalesProjectionByWk) ...`)

    const response = await sql
      `SELECT pj.column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, sl.week_serial || '_pj' AS column, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
        
        FROM "salesReporting".sales_line_items AS sl
          
        WHERE
          sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end}
          
        UNION 
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, so.week_serial || '_pj' AS column, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
           
        UNION 
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, ps.week_serial || '_pj' AS column, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
        
          FROM "salesReporting".projected_sales AS ps        
        
          WHERE 
            ps.date >= ${start} AND ps.date <= ${end}


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

// FG Program col total for period

const l3_getSalesProjectionPeriodToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data period total (l3_getSalesProjectionPeriodToDate) ...`)

    const response = await sql
      `SELECT 'SALES PROJECTION TOTAL' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
        
        FROM "salesReporting".sales_line_items AS sl
          
        WHERE
          sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end}
          
        UNION 
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
            
        
        UNION 
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
        
          FROM "salesReporting".projected_sales AS ps        
        
          WHERE 
            ps.date >= ${start} AND ps.date <= ${end}

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

// FG Program row totals by week

const l4_getSalesProjectionByWk = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data by week (l4_getSalesProjectionByWk) ...`)

    const response = await sql
      `SELECT pj.column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, sl.week_serial || '_pj' AS column, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
        
        FROM "salesReporting".sales_line_items AS sl
          
        WHERE
          sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end}
          
        UNION 
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, so.week_serial || '_pj' AS column, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
            
        UNION 
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, ps.week_serial || '_pj' AS column, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
        
          FROM "salesReporting".projected_sales AS ps        
        
          WHERE 
            ps.date >= ${start} AND ps.date <= ${end}

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

// FG Program col total for period

const l4_getSalesProjectionPeriodToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data period total (l4_getSalesProjectionPeriodToDate) ...`)

    const response = await sql
      `SELECT 'SALES PROJECTION TOTAL' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
        
        FROM "salesReporting".sales_line_items AS sl
          
        WHERE
          sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end}
          
        UNION 
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
            
        
        UNION 
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
        
          FROM "salesReporting".projected_sales AS ps        
        
          WHERE 
            ps.date >= ${start} AND ps.date <= ${end}

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

// FG Program row totals by week

const l5_getSalesProjectionByWk = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 5: query postgres to get FG sales data by week (l4_getSalesProjectionByWk) ...`)

    const response = await sql
      `SELECT pj.column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, sl.week_serial || '_pj' AS column, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
        
        FROM "salesReporting".sales_line_items AS sl
          
        WHERE
          sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end}
          
        UNION 
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, so.week_serial || '_pj' AS column, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
            
        UNION 
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, ps.week_serial || '_pj' AS column, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
        
          FROM "salesReporting".projected_sales AS ps        
        
          WHERE 
          ps.date >= ${start} AND ps.date <= ${end}

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

// FG Program col total for period

const l5_getSalesProjectionPeriodToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 5: query postgres to get FG sales data period total (l4_getSalesProjectionPeriodToDate) ...`)

    const response = await sql
      `SELECT 'SALES PROJECTION TOTAL' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
        
        FROM "salesReporting".sales_line_items AS sl
          
        WHERE
          sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end}
          
        UNION 
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so
            
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
            AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
            
        UNION 
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
        
          FROM "salesReporting".projected_sales AS ps        
        
          WHERE 
            ps.date >= ${start} AND ps.date <= ${end}

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

// All sales row totals by week for a program

const l0_getSalesProjectionByWk = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data by week (l0_getSalesProjectionByWk) ...`)

    const response = await sql
      `
      SELECT pj.column ${config.baseFilters.itemType ? sql`, REPLACE('${sql(config.baseFilters.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, sl.week_serial || '_pj' AS column, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
      
        FROM "salesReporting".sales_line_items AS sl 
          
        WHERE 
          sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
          
        UNION
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, so.week_serial || '_pj' AS column, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so 
          
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
            AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
         
        UNION 
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, ps.week_serial || '_pj' AS column, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
        
          FROM "salesReporting".projected_sales AS ps        
        
          WHERE 
            ps.date >= ${start} AND ps.date <= ${end}

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

// All sales col total for a program

const l0_getSalesProjectionPeriodToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data period total (l0_getSalesProjectionPeriodToDate) ...`)

    const response = await sql
      `
      SELECT 'SALES PROJECTION TOTAL' AS column ${config.baseFilters.itemType ? sql`, REPLACE('${sql(config.baseFilters.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
      
      FROM (
        SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs, COALESCE(sl.gross_sales_ext,0) AS sales, COALESCE(sl.cogs_ext_gl,0) AS cogs, COALESCE(sl.othp_ext,0) AS othp 
      
        FROM "salesReporting".sales_line_items AS sl 
          
        WHERE 
          sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
          
        UNION
          SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs, COALESCE(so.ext_sales,0) AS sales, COALESCE(so.ext_cost,0) AS cogs, COALESCE(so.ext_othp,0) AS othp 
      
          FROM "salesReporting".sales_orders AS so 
         
          WHERE 
            so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
            AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
        

        UNION 
          SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, ps.item_number AS item_num, COALESCE(ps.lbs,0) AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
        
          FROM "salesReporting".projected_sales AS ps        
        
          WHERE 
            ps.date >= ${start} AND ps.date <= ${end}

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

module.exports.l0_getSalesProjectionByWk = l0_getSalesProjectionByWk
module.exports.l0_getSalesProjectionPeriodToDate = l0_getSalesProjectionPeriodToDate
module.exports.l2_getSalesProjectionByWk = l2_getSalesProjectionByWk
module.exports.l2_getSalesProjectionPeriodToDate = l2_getSalesProjectionPeriodToDate
module.exports.l1_getSalesProjectionByWk = l1_getSalesProjectionByWk
module.exports.l1_getSalesProjectionPeriodToDate = l1_getSalesProjectionPeriodToDate
module.exports.l3_getSalesProjectionByWk = l3_getSalesProjectionByWk
module.exports.l3_getSalesProjectionPeriodToDate = l3_getSalesProjectionPeriodToDate
module.exports.l4_getSalesProjectionByWk = l4_getSalesProjectionByWk
module.exports.l4_getSalesProjectionPeriodToDate = l4_getSalesProjectionPeriodToDate
module.exports.l5_getSalesProjectionByWk = l5_getSalesProjectionByWk
module.exports.l5_getSalesProjectionPeriodToDate = l5_getSalesProjectionPeriodToDate
