const sql = require('../../../../server')

/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const l1_getSalesProjByWk = async (config, start, end, trendQuery) => {
  try {
    console.log(`${config.user} - level 1: (getSalesTrend Lvl3) query postgres to get FG sales data by week ...`)

    const response = await sql
      `SELECT pj.column, pj.l1_label, pj.l2_label, pj.l3_label, pj.l4_label, pj.l5_label, pj.l6_label, pj.l7_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS slaes, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp
      
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

        WHERE 
          sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
          ${config.customer ? sql`AND sl.customer_code = ${config.customer}`: sql``} 
          ${config.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.salesPerson}`: sql``} 
          ${config.country ? sql`AND sl.country = ${config.country}`: sql``} 
          ${config.state ? sql`AND sl.state = ${config.state}`: sql``} 
          ${config.export ? sql`AND sl.domestic = ${config.export}`: sql``} 
          ${config.northAmerica ? sql`AND sl.north_america = ${config.northAmerica}`: sql``} 

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

          WHERE 
            so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)
            AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
            ${config.customer ? sql`AND so.customer_code = ${config.customer}`: sql``} 
            ${config.salesPerson ? sql`AND so.out_sales_rep = ${config.salesPerson}`: sql``} 
            ${config.country ? sql`AND so.country = ${config.country}`: sql``} 
            ${config.state ? sql`AND so.state = ${config.state}`: sql``} 
            ${config.export ? sql`AND so.domestic = ${config.export}`: sql``} 
            ${config.northAmerica ? sql`AND so.north_america = ${config.northAmerica}`: sql``} 
            
      ) AS pj
      
      LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
        ON ms.item_num = pj.item_number 
      LEFT OUTER JOIN "masters".customer_supplement AS cs 
        ON cs.customer_code = pj.customer_code
      
      WHERE 
        1=1
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.speciesGroup ? sql`AND ms.species_group = ${config.speciesGroup}`: sql``}
        ${config.species ? sql`AND ms.species = ${config.species}`: sql``}
        ${config.programDrilldown ? sql`AND ms.program = ${config.programDrilldown}`: sql``}
        ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
        ${config.custType ? sql`AND cs.category = ${config.custType}`: sql``} 
        ${config.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.freshFrozen}`: sql``}  
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
        ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
        ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
        ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
        ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
      
      GROUP BY 
        pj.column 
        ${trendQuery.sl.l1_label ? sql`, pj.l1_label`: sql``} 
        ${trendQuery.sl.l2_label ? sql`, pj.l1_label`: sql``} 
        ${trendQuery.sl.l3_label ? sql`, pj.l1_label`: sql``} 
        ${trendQuery.sl.l4_label ? sql`, pj.l1_label`: sql``} 
        ${trendQuery.sl.l5_label ? sql`, pj.l1_label`: sql``} 
        ${trendQuery.sl.l6_label ? sql`, pj.l1_label`: sql``} 
        ${trendQuery.sl.l7_label ? sql`, pj.l1_label`: sql``} 
      
      ORDER BY pj.column` //prettier-ignore

    console.log('l1_getSalesProjByWk', response)

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
    `SELECT 'SALES PROJECTION TOTAL' AS column, pj.l1_label, pj.l2_label, pj.l3_label, pj.l4_label, pj.l5_label, pj.l6_label, pj.l7_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS slaes, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp
    
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

      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.customer ? sql`AND sl.customer_code = ${config.customer}`: sql``} 
        ${config.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.salesPerson}`: sql``} 
        ${config.country ? sql`AND sl.country = ${config.country}`: sql``} 
        ${config.state ? sql`AND sl.state = ${config.state}`: sql``} 
        ${config.export ? sql`AND sl.domestic = ${config.export}`: sql``} 
        ${config.northAmerica ? sql`AND sl.north_america = ${config.northAmerica}`: sql``} 

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

        WHERE 
          so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)
          AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
          ${config.customer ? sql`AND so.customer_code = ${config.customer}`: sql``} 
          ${config.salesPerson ? sql`AND so.out_sales_rep = ${config.salesPerson}`: sql``} 
          ${config.country ? sql`AND so.country = ${config.country}`: sql``} 
          ${config.state ? sql`AND so.state = ${config.state}`: sql``} 
          ${config.export ? sql`AND so.domestic = ${config.export}`: sql``} 
          ${config.northAmerica ? sql`AND so.north_america = ${config.northAmerica}`: sql``} 
          

    ) AS pj
    
    LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
      ON ms.item_num = pj.item_number 
    LEFT OUTER JOIN "masters".customer_supplement AS cs 
      ON cs.customer_code = pj.customer_code
    
    WHERE 
      1=1
      ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
      ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
      ${config.speciesGroup ? sql`AND ms.species_group = ${config.speciesGroup}`: sql``}
      ${config.species ? sql`AND ms.species = ${config.species}`: sql``}
      ${config.programDrilldown ? sql`AND ms.program = ${config.programDrilldown}`: sql``}
      ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
      ${config.custType ? sql`AND cs.category = ${config.custType}`: sql``} 
      ${config.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.freshFrozen}`: sql``}  
      ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
      ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
      ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
      ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
      ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
    
    GROUP BY 
      ${trendQuery.sl.l1_label ? sql`, pj.l1_label`: sql``} 
      ${trendQuery.sl.l2_label ? sql`, pj.l1_label`: sql``} 
      ${trendQuery.sl.l3_label ? sql`, pj.l1_label`: sql``} 
      ${trendQuery.sl.l4_label ? sql`, pj.l1_label`: sql``} 
      ${trendQuery.sl.l5_label ? sql`, pj.l1_label`: sql``} 
      ${trendQuery.sl.l6_label ? sql`, pj.l1_label`: sql``} 
      ${trendQuery.sl.l7_label ? sql`, pj.l1_label`: sql``} 
    
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
    `SELECT pj.column, ${config.itemType ? sql`, REPLACE('${sql(config.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 
    'TOTAL' AS l2_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS slaes, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp
    
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
        ${config.customer ? sql`AND sl.customer_code = ${config.customer}`: sql``} 
        ${config.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.salesPerson}`: sql``} 
        ${config.country ? sql`AND sl.country = ${config.country}`: sql``} 
        ${config.state ? sql`AND sl.state = ${config.state}`: sql``} 
        ${config.export ? sql`AND sl.domestic = ${config.export}`: sql``} 
        ${config.northAmerica ? sql`AND sl.north_america = ${config.northAmerica}`: sql``} 

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
          ${config.customer ? sql`AND so.customer_code = ${config.customer}`: sql``} 
          ${config.salesPerson ? sql`AND so.out_sales_rep = ${config.salesPerson}`: sql``} 
          ${config.country ? sql`AND so.country = ${config.country}`: sql``} 
          ${config.state ? sql`AND so.state = ${config.state}`: sql``} 
          ${config.export ? sql`AND so.domestic = ${config.export}`: sql``} 
          ${config.northAmerica ? sql`AND so.north_america = ${config.northAmerica}`: sql``} 
          

    ) AS pj
    
    LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
      ON ms.item_num = pj.item_number 
    LEFT OUTER JOIN "masters".customer_supplement AS cs 
      ON cs.customer_code = pj.customer_code
    
    WHERE 
      1=1
      ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
      ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
      ${config.speciesGroup ? sql`AND ms.species_group = ${config.speciesGroup}`: sql``}
      ${config.species ? sql`AND ms.species = ${config.species}`: sql``}
      ${config.programDrilldown ? sql`AND ms.program = ${config.programDrilldown}`: sql``}
      ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
      ${config.custType ? sql`AND cs.category = ${config.custType}`: sql``} 
      ${config.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.freshFrozen}`: sql``}  
      ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
      ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
      ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
      ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
      ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
    
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
    `SELECT 'SALES PROJECTION TOTAL' AS column, 'SALES TOTAL' AS column
    ${config.itemType ? sql`, REPLACE('${sql(config.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 
    'TOTAL' AS l2_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS slaes, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp
    
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
        ${config.customer ? sql`AND sl.customer_code = ${config.customer}`: sql``} 
        ${config.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.salesPerson}`: sql``} 
        ${config.country ? sql`AND sl.country = ${config.country}`: sql``} 
        ${config.state ? sql`AND sl.state = ${config.state}`: sql``} 
        ${config.export ? sql`AND sl.domestic = ${config.export}`: sql``} 
        ${config.northAmerica ? sql`AND sl.north_america = ${config.northAmerica}`: sql``} 

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
          ${config.customer ? sql`AND so.customer_code = ${config.customer}`: sql``} 
          ${config.salesPerson ? sql`AND so.out_sales_rep = ${config.salesPerson}`: sql``} 
          ${config.country ? sql`AND so.country = ${config.country}`: sql``} 
          ${config.state ? sql`AND so.state = ${config.state}`: sql``} 
          ${config.export ? sql`AND so.domestic = ${config.export}`: sql``} 
          ${config.northAmerica ? sql`AND so.north_america = ${config.northAmerica}`: sql``} 
    ) AS pj
    
    LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
      ON ms.item_num = pj.item_number 
    LEFT OUTER JOIN "masters".customer_supplement AS cs 
      ON cs.customer_code = pj.customer_code
    
    WHERE 
      1=1
      ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
      ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
      ${config.speciesGroup ? sql`AND ms.species_group = ${config.speciesGroup}`: sql``}
      ${config.species ? sql`AND ms.species = ${config.species}`: sql``}
      ${config.programDrilldown ? sql`AND ms.program = ${config.programDrilldown}`: sql``}
      ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
      ${config.custType ? sql`AND cs.category = ${config.custType}`: sql``} 
      ${config.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.freshFrozen}`: sql``}  
      ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
      ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
      ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
      ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
      ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
      
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
