const sql = require('../../../../server')

/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const l1_getSalesProjByWk = async (config, start, end, trendQuery) => {
  try {
    console.log(`${config.user} - level 1: (getSalesTrend Lvl3) query postgres to get FG sales data by week ...`)

    const response = await sql
      `SELECT 
        pj.column, 
        ${trendQuery.sl.l1_label ? sql`pj.l1_label,`: sql``} 
        ${trendQuery.sl.l2_label ? sql`pj.l2_label,`: sql``} 
        ${trendQuery.sl.l3_label ? sql`pj.l3_label,`: sql``}
        ${trendQuery.sl.l4_label ? sql`pj.l4_label,`: sql``}
        ${trendQuery.sl.l5_label ? sql`pj.l5_label,`: sql``}
        ${trendQuery.sl.l6_label ? sql`pj.l6_label,`: sql``}
        ${trendQuery.sl.l7_label ? sql`pj.l7_label,`: sql``}
        SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp
      
      FROM (
        SELECT
          sl.item_number,
          sl.customer_code,
          sl.week_serial || '_pj' AS column, 
          ${trendQuery.sl.l1_label ? sql`${sql(trendQuery.sl.l1_label)} AS l1_label,`: sql``} 
          ${trendQuery.sl.l2_label ? sql`${sql(trendQuery.sl.l2_label)} AS l2_label,`: sql``} 
          ${trendQuery.sl.l3_label ? sql`${sql(trendQuery.sl.l3_label)} AS l3_label,`: sql``} 
          ${trendQuery.sl.l4_label ? sql`${sql(trendQuery.sl.l4_label)} AS l4_label,`: sql``} 
          ${trendQuery.sl.l5_label ? sql`${sql(trendQuery.sl.l5_label)} AS l5_label,`: sql``} 
          ${trendQuery.sl.l6_label ? sql`${sql(trendQuery.sl.l6_label)} AS l6_label,`: sql``} 
          ${trendQuery.sl.l7_label ? sql`${sql(trendQuery.sl.l7_label)} AS l7_label,`: sql``}
          COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
          COALESCE(sl.gross_sales_ext,0) AS sales, 
          COALESCE(sl.cogs_ext_gl,0) AS cogs, 
          COALESCE(sl.othp_ext,0) AS othp 

        FROM "salesReporting".sales_line_items AS sl
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = sl.item_number 
          LEFT OUTER JOIN "masters".customer_supplement AS cs 
            ON cs.customer_code = sl.customer_code

        WHERE 
          sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
          ${config.trendFilters.customer ? sql`AND sl.customer_code = ${config.trendFilters.customer}`: sql``} 
          ${config.trendFilters.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.trendFilters.salesPerson}`: sql``} 
          ${config.trendFilters.country ? sql`AND sl.country = ${config.trendFilters.country}`: sql``} 
          ${config.trendFilters.state ? sql`AND sl.state = ${config.trendFilters.state}`: sql``} 
          ${config.trendFilters.export ? sql`AND sl.domestic = ${config.trendFilters.export}`: sql``} 
          ${config.trendFilters.northAmerica ? sql`AND sl.north_america = ${config.trendFilters.northAmerica}`: sql``} 

        UNION ALL
          SELECT 
              so.item_num AS item_number,
              so.customer_code,
              so.week_serial || '_pj' AS column, 
              ${trendQuery.so.l1_label ? sql`${sql(trendQuery.so.l1_label)} AS l1_label,`: sql``} 
              ${trendQuery.so.l2_label ? sql`${sql(trendQuery.so.l2_label)} AS l2_label,`: sql``} 
              ${trendQuery.so.l3_label ? sql`${sql(trendQuery.so.l3_label)} AS l3_label,`: sql``} 
              ${trendQuery.so.l4_label ? sql`${sql(trendQuery.so.l4_label)} AS l4_label,`: sql``} 
              ${trendQuery.so.l5_label ? sql`${sql(trendQuery.so.l5_label)} AS l5_label,`: sql``} 
              ${trendQuery.so.l6_label ? sql`${sql(trendQuery.so.l6_label)} AS l6_label,`: sql``} 
              ${trendQuery.so.l7_label ? sql`${sql(trendQuery.so.l7_label)} AS l7_label,`: sql``} 
              COALESCE(so.ext_weight,0) AS lbs, 
              COALESCE(so.ext_sales,0) AS sales, 
              COALESCE(so.ext_cost,0) AS cogs, 
              COALESCE(so.ext_othp,0) AS othp 
         
          FROM "salesReporting".sales_orders AS so
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = so.item_num 
            LEFT OUTER JOIN "masters".customer_supplement AS cs 
              ON cs.customer_code = so.customer_code

          WHERE 
            so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)
            AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
            ${config.trendFilters.customer ? sql`AND so.customer_code = ${config.trendFilters.customer}`: sql``} 
            ${config.trendFilters.salesPerson ? sql`AND so.out_sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
            ${config.trendFilters.country ? sql`AND so.country = ${config.trendFilters.country}`: sql``} 
            ${config.trendFilters.state ? sql`AND so.state = ${config.trendFilters.state}`: sql``} 
            ${config.trendFilters.export ? sql`AND so.domestic = ${config.trendFilters.export}`: sql``} 
            ${config.trendFilters.northAmerica ? sql`AND so.north_america = ${config.trendFilters.northAmerica}`: sql``} 
            
      ) AS pj
      
      LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
        ON ms.item_num = pj.item_number 
      LEFT OUTER JOIN "masters".customer_supplement AS cs 
        ON cs.customer_code = pj.customer_code
      
      WHERE 
        1=1
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
        ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
        ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
        ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
        ${config.trendFilters.custType ? sql`AND cs.category = ${config.trendFilters.custType}`: sql``} 
        ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
        ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
        ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
      
      GROUP BY 
        pj.column 
        ${trendQuery.sl.l1_label ? sql`, pj.l1_label`: sql``} 
        ${trendQuery.sl.l2_label ? sql`, pj.l2_label`: sql``} 
        ${trendQuery.sl.l3_label ? sql`, pj.l3_label`: sql``} 
        ${trendQuery.sl.l4_label ? sql`, pj.l4_label`: sql``} 
        ${trendQuery.sl.l5_label ? sql`, pj.l5_label`: sql``} 
        ${trendQuery.sl.l6_label ? sql`, pj.l6_label`: sql``} 
        ${trendQuery.sl.l7_label ? sql`, pj.l7_label`: sql``}  
      
      ORDER BY pj.column` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Species Group col total for period

const l1_getSalesProjPeriodToDate = async (config, start, end, trendQuery) => {
  try {
    console.log(`${config.user} - level 1: (getSalesTrend Lvl3) query postgres to get FG sales data period total ...`)

    const response = await sql
    `SELECT 
      'SALES PROJECTION TOTAL' AS column, 
      ${trendQuery.sl.l1_label ? sql`pj.l1_label,`: sql``} 
      ${trendQuery.sl.l2_label ? sql`pj.l2_label,`: sql``} 
      ${trendQuery.sl.l3_label ? sql`pj.l3_label,`: sql``}
      ${trendQuery.sl.l4_label ? sql`pj.l4_label,`: sql``}
      ${trendQuery.sl.l5_label ? sql`pj.l5_label,`: sql``}
      ${trendQuery.sl.l6_label ? sql`pj.l6_label,`: sql``}
      ${trendQuery.sl.l7_label ? sql`pj.l7_label,`: sql``}
      SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp
    
    FROM (
      SELECT
        sl.item_number,
        sl.customer_code,
        ${trendQuery.sl.l1_label ? sql`${sql(trendQuery.sl.l1_label)} AS l1_label,`: sql``} 
        ${trendQuery.sl.l2_label ? sql`${sql(trendQuery.sl.l2_label)} AS l2_label,`: sql``} 
        ${trendQuery.sl.l3_label ? sql`${sql(trendQuery.sl.l3_label)} AS l3_label,`: sql``} 
        ${trendQuery.sl.l4_label ? sql`${sql(trendQuery.sl.l4_label)} AS l4_label,`: sql``} 
        ${trendQuery.sl.l5_label ? sql`${sql(trendQuery.sl.l5_label)} AS l5_label,`: sql``} 
        ${trendQuery.sl.l6_label ? sql`${sql(trendQuery.sl.l6_label)} AS l6_label,`: sql``} 
        ${trendQuery.sl.l7_label ? sql`${sql(trendQuery.sl.l7_label)} AS l7_label,`: sql``}
        COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
        COALESCE(sl.gross_sales_ext,0) AS sales, 
        COALESCE(sl.cogs_ext_gl,0) AS cogs, 
        COALESCE(sl.othp_ext,0) AS othp 

      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
        LEFT OUTER JOIN "masters".customer_supplement AS cs 
          ON cs.customer_code = sl.customer_code

      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.trendFilters.customer ? sql`AND sl.customer_code = ${config.trendFilters.customer}`: sql``} 
        ${config.trendFilters.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.trendFilters.salesPerson}`: sql``} 
        ${config.trendFilters.country ? sql`AND sl.country = ${config.trendFilters.country}`: sql``} 
        ${config.trendFilters.state ? sql`AND sl.state = ${config.trendFilters.state}`: sql``} 
        ${config.trendFilters.export ? sql`AND sl.domestic = ${config.trendFilters.export}`: sql``} 
        ${config.trendFilters.northAmerica ? sql`AND sl.north_america = ${config.trendFilters.northAmerica}`: sql``} 

      UNION ALL
        SELECT 
            so.item_num AS item_number,
            so.customer_code,
            ${trendQuery.so.l1_label ? sql`${sql(trendQuery.so.l1_label)} AS l1_label,`: sql``} 
            ${trendQuery.so.l2_label ? sql`${sql(trendQuery.so.l2_label)} AS l2_label,`: sql``} 
            ${trendQuery.so.l3_label ? sql`${sql(trendQuery.so.l3_label)} AS l3_label,`: sql``} 
            ${trendQuery.so.l4_label ? sql`${sql(trendQuery.so.l4_label)} AS l4_label,`: sql``} 
            ${trendQuery.so.l5_label ? sql`${sql(trendQuery.so.l5_label)} AS l5_label,`: sql``} 
            ${trendQuery.so.l6_label ? sql`${sql(trendQuery.so.l6_label)} AS l6_label,`: sql``} 
            ${trendQuery.so.l7_label ? sql`${sql(trendQuery.so.l7_label)} AS l7_label,`: sql``} 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp 
       
        FROM "salesReporting".sales_orders AS so
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = so.item_num 
            LEFT OUTER JOIN "masters".customer_supplement AS cs 
              ON cs.customer_code = so.customer_code

        WHERE 
          so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)
          AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
          ${config.trendFilters.customer ? sql`AND so.customer_code = ${config.trendFilters.customer}`: sql``} 
          ${config.trendFilters.salesPerson ? sql`AND so.out_sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
          ${config.trendFilters.country ? sql`AND so.country = ${config.trendFilters.country}`: sql``} 
          ${config.trendFilters.state ? sql`AND so.state = ${config.trendFilters.state}`: sql``} 
          ${config.trendFilters.export ? sql`AND so.domestic = ${config.trendFilters.export}`: sql``} 
          ${config.trendFilters.northAmerica ? sql`AND so.north_america = ${config.trendFilters.northAmerica}`: sql``} 
          

    ) AS pj
    
    LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
      ON ms.item_num = pj.item_number 
    LEFT OUTER JOIN "masters".customer_supplement AS cs 
      ON cs.customer_code = pj.customer_code
    
    WHERE 
      1=1
      ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
      ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
      ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
      ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
      ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
      ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
      ${config.trendFilters.custType ? sql`AND cs.category = ${config.trendFilters.custType}`: sql``} 
      ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
      ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
      ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
      ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
      ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
      ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``} 
      ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
    
    GROUP BY 
      ${trendQuery.sl.l1_label ? sql` pj.l1_label`: sql``} 
      ${trendQuery.sl.l2_label ? sql`, pj.l2_label`: sql``} 
      ${trendQuery.sl.l3_label ? sql`, pj.l3_label`: sql``} 
      ${trendQuery.sl.l4_label ? sql`, pj.l4_label`: sql``} 
      ${trendQuery.sl.l5_label ? sql`, pj.l5_label`: sql``} 
      ${trendQuery.sl.l6_label ? sql`, pj.l6_label`: sql``} 
      ${trendQuery.sl.l7_label ? sql`, pj.l7_label`: sql``} 
    
    ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Totals *********************************************** */

// All sales row totals by week for a program

const l0_getSalesProjByWk = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 0: (getSalesTrend Lvl3) query postgres to get FG sales data by week ...`)

    const response = await sql
    `SELECT pj.column ${config.baseFilters.itemType ? sql`, REPLACE('${sql(config.baseFilters.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 
    'TOTAL' AS l2_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp
    
    FROM (
      SELECT
        sl.item_number,
        sl.customer_code,
        sl.week_serial || '_pj' AS column, 
        COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
        COALESCE(sl.gross_sales_ext,0) AS sales, 
        COALESCE(sl.cogs_ext_gl,0) AS cogs, 
        COALESCE(sl.othp_ext,0) AS othp 

      FROM "salesReporting".sales_line_items AS sl

      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.trendFilters.customer ? sql`AND sl.customer_code = ${config.trendFilters.customer}`: sql``} 
        ${config.trendFilters.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.trendFilters.salesPerson}`: sql``} 
        ${config.trendFilters.country ? sql`AND sl.country = ${config.trendFilters.country}`: sql``} 
        ${config.trendFilters.state ? sql`AND sl.state = ${config.trendFilters.state}`: sql``} 
        ${config.trendFilters.export ? sql`AND sl.domestic = ${config.trendFilters.export}`: sql``} 
        ${config.trendFilters.northAmerica ? sql`AND sl.north_america = ${config.trendFilters.northAmerica}`: sql``} 

      UNION ALL
        SELECT 
            so.item_num AS item_number,
            so.customer_code,
            so.week_serial || '_pj' AS column, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp 
       
        FROM "salesReporting".sales_orders AS so

        WHERE 
          so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)
          AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
          ${config.trendFilters.customer ? sql`AND so.customer_code = ${config.trendFilters.customer}`: sql``} 
          ${config.trendFilters.salesPerson ? sql`AND so.out_sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
          ${config.trendFilters.country ? sql`AND so.country = ${config.trendFilters.country}`: sql``} 
          ${config.trendFilters.state ? sql`AND so.state = ${config.trendFilters.state}`: sql``} 
          ${config.trendFilters.export ? sql`AND so.domestic = ${config.trendFilters.export}`: sql``} 
          ${config.trendFilters.northAmerica ? sql`AND so.north_america = ${config.trendFilters.northAmerica}`: sql``} 
          

    ) AS pj
    
    LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
      ON ms.item_num = pj.item_number 
    LEFT OUTER JOIN "masters".customer_supplement AS cs 
      ON cs.customer_code = pj.customer_code
    
    WHERE 
      1=1
      ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
      ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
      ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
      ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
      ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
      ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
      ${config.trendFilters.custType ? sql`AND cs.category = ${config.trendFilters.custType}`: sql``} 
      ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
      ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
      ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
      ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
      ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
      ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``} 
      ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
    
    GROUP BY 
      pj.column  
    
    ORDER BY pj.column` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// All sales col total for a program

const l0_getSalesProjPeriodToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 0: (getSalesTrend Lvl3) query postgres to get FG sales data period total ...`)

    const response = await sql
    `SELECT 'SALES PROJECTION TOTAL' AS column
    ${config.baseFilters.itemType ? sql`, REPLACE('${sql(config.baseFilters.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 
    'TOTAL' AS l2_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp
    
    FROM (
      SELECT
        sl.item_number,
        sl.customer_code,
        COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
        COALESCE(sl.gross_sales_ext,0) AS sales, 
        COALESCE(sl.cogs_ext_gl,0) AS cogs, 
        COALESCE(sl.othp_ext,0) AS othp 

      FROM "salesReporting".sales_line_items AS sl

      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.trendFilters.customer ? sql`AND sl.customer_code = ${config.trendFilters.customer}`: sql``} 
        ${config.trendFilters.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.trendFilters.salesPerson}`: sql``} 
        ${config.trendFilters.country ? sql`AND sl.country = ${config.trendFilters.country}`: sql``} 
        ${config.trendFilters.state ? sql`AND sl.state = ${config.trendFilters.state}`: sql``} 
        ${config.trendFilters.export ? sql`AND sl.domestic = ${config.trendFilters.export}`: sql``} 
        ${config.trendFilters.northAmerica ? sql`AND sl.north_america = ${config.trendFilters.northAmerica}`: sql``} 

      UNION ALL
        SELECT 
            so.item_num AS item_number,
            so.customer_code,
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp 
       
        FROM "salesReporting".sales_orders AS so

        WHERE 
          so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)
          AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
          ${config.trendFilters.customer ? sql`AND so.customer_code = ${config.trendFilters.customer}`: sql``} 
          ${config.trendFilters.salesPerson ? sql`AND so.out_sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
          ${config.trendFilters.country ? sql`AND so.country = ${config.trendFilters.country}`: sql``} 
          ${config.trendFilters.state ? sql`AND so.state = ${config.trendFilters.state}`: sql``} 
          ${config.trendFilters.export ? sql`AND so.domestic = ${config.trendFilters.export}`: sql``} 
          ${config.trendFilters.northAmerica ? sql`AND so.north_america = ${config.trendFilters.northAmerica}`: sql``} 
    ) AS pj
    
    LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
      ON ms.item_num = pj.item_number 
    LEFT OUTER JOIN "masters".customer_supplement AS cs 
      ON cs.customer_code = pj.customer_code
    
    WHERE 
      1=1
      ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
      ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
      ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
      ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
      ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
      ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
      ${config.trendFilters.custType ? sql`AND cs.category = ${config.trendFilters.custType}`: sql``} 
      ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
      ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
      ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
      ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
      ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
      ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``} 
      ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
      
    ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l0_getSalesProjByWk = l0_getSalesProjByWk
module.exports.l0_getSalesProjPeriodToDate = l0_getSalesProjPeriodToDate
module.exports.l1_getSalesProjByWk = l1_getSalesProjByWk
module.exports.l1_getSalesProjPeriodToDate = l1_getSalesProjPeriodToDate
