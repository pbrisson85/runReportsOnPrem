const sql = require('../../../../server')

const l1_getSalesTrend = async (config, trendQuery) => {
  if (!config.trends.queryGrouping) return []
  if (!trendQuery.sl.l1_label) return []

  try {
    console.log(`${config.user} - level 1: (l1_getSalesTrend) query postgres to get FG sales data by week ...`)

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
      
      FROM (
        SELECT
          'dummy' AS item_number,
          'dummy' AS customer_code,
          '01-01-23' AS column, 
          ${trendQuery.sl.l1_label ? sql`'dummy' AS l1_label,` : sql``} 
          ${trendQuery.sl.l2_label ? sql`'dummy' AS l2_label,` : sql``} 
          ${trendQuery.sl.l3_label ? sql`'dummy' AS l3_label,` : sql``} 
          ${trendQuery.sl.l4_label ? sql`'dummy' AS l4_label,` : sql``} 
          ${trendQuery.sl.l5_label ? sql`'dummy' AS l5_label,` : sql``} 
          ${trendQuery.sl.l6_label ? sql`'dummy' AS l6_label,` : sql``} 
          ${trendQuery.sl.l7_label ? sql`'dummy' AS l7_label,` : sql``} 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp 
        WHERE 1=2

        ${config.totals.useProjection.sl ? sql`
        UNION ALL
        SELECT
          sl.item_number,
          sl.customer_code,
          ${sql(config.trends.queryGrouping)}::TEXT AS column, 
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
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON sl.formatted_invoice_date = p.formatted_date

        WHERE 
          ${!config.trends.yearTrend ? sql`
          p.formatted_date >= ${config.trends.startDate} 
          AND p.formatted_date <= ${config.trends.endDate}` : 
        sql`
          ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
          AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
          AND ${sql(config.trends.queryGrouping)} IN ${sql(config.trends.yearTrend.years)}
        ` } 
          ${config.trendFilters.customer ? sql`AND sl.customer_code = ${config.trendFilters.customer}`: sql``} 
          ${config.trendFilters.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.trendFilters.salesPerson}`: sql``} 
          ${config.trendFilters.country ? sql`AND sl.country = ${config.trendFilters.country}`: sql``} 
          ${config.trendFilters.state ? sql`AND sl.state = ${config.trendFilters.state}`: sql``} 
          ${config.trendFilters.export ? sql`AND sl.domestic = ${config.trendFilters.export}`: sql``} 
          ${config.trendFilters.northAmerica ? sql`AND sl.north_america = ${config.trendFilters.northAmerica}`: sql``} 
          `: sql``}

        ${config.totals.useProjection.so ? sql`
        UNION ALL
          SELECT 
            so.item_num AS item_number,
            so.customer_code,
            ${sql(config.trends.queryGrouping)}  AS column, 
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
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
              ON so.formatted_ship_date = p.formatted_date

          WHERE 
            so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)
            ${!config.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.trends.startDate} 
              AND p.formatted_date <= ${config.trends.endDate}` : 
            sql`
              AND ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
              AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
              AND ${sql(config.trends.queryGrouping)} IN ${sql(config.trends.yearTrend.years)}
            ` }
            ${config.trendFilters.customer ? sql`AND so.customer_code = ${config.trendFilters.customer}`: sql``} 
            ${config.trendFilters.salesPerson ? sql`AND so.out_sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
            ${config.trendFilters.country ? sql`AND so.country = ${config.trendFilters.country}`: sql``} 
            ${config.trendFilters.state ? sql`AND so.state = ${config.trendFilters.state}`: sql``} 
            ${config.trendFilters.export ? sql`AND so.domestic = ${config.trendFilters.export}`: sql``} 
            ${config.trendFilters.northAmerica ? sql`AND so.north_america = ${config.trendFilters.northAmerica}`: sql``} 
            `: sql``}

        ${config.totals.useProjection.pr ? sql`
        UNION ALL
          SELECT
          pr.item_number,
          pr.customer_code,
          ${sql(config.trends.queryGrouping)}  AS column, 
          ${trendQuery.pr.l1_label ? sql`${sql(trendQuery.pr.l1_label)} AS l1_label,`: sql``} 
          ${trendQuery.pr.l2_label ? sql`${sql(trendQuery.pr.l2_label)} AS l2_label,`: sql``} 
          ${trendQuery.pr.l3_label ? sql`${sql(trendQuery.pr.l3_label)} AS l3_label,`: sql``} 
          ${trendQuery.pr.l4_label ? sql`${sql(trendQuery.pr.l4_label)} AS l4_label,`: sql``} 
          ${trendQuery.pr.l5_label ? sql`${sql(trendQuery.pr.l5_label)} AS l5_label,`: sql``} 
          ${trendQuery.pr.l6_label ? sql`${sql(trendQuery.pr.l6_label)} AS l6_label,`: sql``} 
          ${trendQuery.pr.l7_label ? sql`${sql(trendQuery.pr.l7_label)} AS l7_label,`: sql``} 
          COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_gross,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp
            
          FROM "salesReporting".projected_sales AS pr  
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pr.item_number 
            LEFT OUTER JOIN "masters".customer_supplement AS cs 
              ON cs.customer_code = pr.customer_code 
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
              ON pr.date = p.formatted_date
        
          WHERE 
          ${!config.trends.yearTrend ? sql`
              p.formatted_date >= ${config.trends.startDate} 
              AND p.formatted_date <= ${config.trends.endDate}` : 
            sql`
              ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
              AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
              AND ${sql(config.trends.queryGrouping)} IN ${sql(config.trends.yearTrend.years)}
            ` } 
          ${config.trendFilters.customer ? sql`AND pr.customer_code = ${config.trendFilters.customer}`: sql``} 
          ${config.trendFilters.salesPerson ? sql`AND pr.sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
          ${config.trendFilters.country ? sql`AND pr.country = ${config.trendFilters.country}`: sql``} 
          ${config.trendFilters.state ? sql`AND pr.state = ${config.trendFilters.state}`: sql``} 
          ${config.trendFilters.export ? sql`AND pr.domestic = ${config.trendFilters.export}`: sql``} 
          ${config.trendFilters.northAmerica ? sql`AND pr.north_america = ${config.trendFilters.northAmerica}`: sql``}
          `: sql``}


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

const l0_getSalesTrend = async config => {
  if (!config.trends.queryGrouping) return []

  try {
    console.log(`${config.user} - level 0: (l0_getSalesTrend) query postgres to get FG sales data by week ...`)

    const response = await sql
    `SELECT pj.column,
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
    
    FROM (
      SELECT
          'dummy' AS item_number,
          'dummy' AS customer_code,
          '01-01-23' AS column, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp 
        WHERE 1=2

      ${config.totals.useProjection.sl ? sql`
      UNION ALL
        SELECT
          sl.item_number,
          sl.customer_code,
          ${sql(config.trends.queryGrouping)}  AS column, 
          COALESCE(sl.calc_gm_rept_weight,0) AS lbs, 
          COALESCE(sl.gross_sales_ext,0) AS sales, 
          COALESCE(sl.cogs_ext_gl,0) AS cogs, 
          COALESCE(sl.othp_ext,0) AS othp 

        FROM "salesReporting".sales_line_items AS sl
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = sl.item_number 
          LEFT OUTER JOIN "masters".customer_supplement AS cs 
            ON cs.customer_code = sl.customer_code
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON sl.formatted_invoice_date = p.formatted_date

        WHERE 
          ${!config.trends.yearTrend ? sql`
          p.formatted_date >= ${config.trends.startDate} 
          AND p.formatted_date <= ${config.trends.endDate}` : 
        sql`
          ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
          AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
          AND ${sql(config.trends.queryGrouping)} IN ${sql(config.trends.yearTrend.years)}
        ` } 
          ${config.trendFilters.customer ? sql`AND sl.customer_code = ${config.trendFilters.customer}`: sql``} 
          ${config.trendFilters.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.trendFilters.salesPerson}`: sql``} 
          ${config.trendFilters.country ? sql`AND sl.country = ${config.trendFilters.country}`: sql``} 
          ${config.trendFilters.state ? sql`AND sl.state = ${config.trendFilters.state}`: sql``} 
          ${config.trendFilters.export ? sql`AND sl.domestic = ${config.trendFilters.export}`: sql``} 
          ${config.trendFilters.northAmerica ? sql`AND sl.north_america = ${config.trendFilters.northAmerica}`: sql``} 
          `: sql``}

      ${config.totals.useProjection.so ? sql`
      UNION ALL
        SELECT 
            so.item_num AS item_number,
            so.customer_code,
            ${sql(config.trends.queryGrouping)}  AS column, 
            COALESCE(so.ext_weight,0) AS lbs, 
            COALESCE(so.ext_sales,0) AS sales, 
            COALESCE(so.ext_cost,0) AS cogs, 
            COALESCE(so.ext_othp,0) AS othp 
       
        FROM "salesReporting".sales_orders AS so
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = so.item_num 
            LEFT OUTER JOIN "masters".customer_supplement AS cs 
              ON cs.customer_code = so.customer_code
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
              ON so.formatted_ship_date = p.formatted_date

        WHERE 
          so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)
          ${!config.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.trends.startDate} 
              AND p.formatted_date <= ${config.trends.endDate}` : 
            sql`
              AND ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
              AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
              AND ${sql(config.trends.queryGrouping)} IN ${sql(config.trends.yearTrend.years)}
            ` }
          ${config.trendFilters.customer ? sql`AND so.customer_code = ${config.trendFilters.customer}`: sql``} 
          ${config.trendFilters.salesPerson ? sql`AND so.out_sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
          ${config.trendFilters.country ? sql`AND so.country = ${config.trendFilters.country}`: sql``} 
          ${config.trendFilters.state ? sql`AND so.state = ${config.trendFilters.state}`: sql``} 
          ${config.trendFilters.export ? sql`AND so.domestic = ${config.trendFilters.export}`: sql``} 
          ${config.trendFilters.northAmerica ? sql`AND so.north_america = ${config.trendFilters.northAmerica}`: sql``} 
          `: sql``}

          ${config.totals.useProjection.pr ? sql`
          UNION ALL
            SELECT
            pr.item_number,
            pr.customer_code,
            ${sql(config.trends.queryGrouping)}  AS column, 
            COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_gross,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp 
              
            FROM "salesReporting".projected_sales AS pr  
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = pr.item_number 
              LEFT OUTER JOIN "masters".customer_supplement AS cs 
                ON cs.customer_code = pr.customer_code 
              LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
                ON pr.date = p.formatted_date
          
            WHERE 
            ${!config.trends.yearTrend ? sql`
              p.formatted_date >= ${config.trends.startDate} 
              AND p.formatted_date <= ${config.trends.endDate}` : 
            sql`
              ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
              AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
              AND ${sql(config.trends.queryGrouping)} IN ${sql(config.trends.yearTrend.years)}
            ` }
            ${config.trendFilters.customer ? sql`AND pr.customer_code = ${config.trendFilters.customer}`: sql``} 
            ${config.trendFilters.salesPerson ? sql`AND pr.sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
            ${config.trendFilters.country ? sql`AND pr.country = ${config.trendFilters.country}`: sql``} 
            ${config.trendFilters.state ? sql`AND pr.state = ${config.trendFilters.state}`: sql``} 
            ${config.trendFilters.export ? sql`AND pr.domestic = ${config.trendFilters.export}`: sql``} 
            ${config.trendFilters.northAmerica ? sql`AND pr.north_america = ${config.trendFilters.northAmerica}`: sql``}
          `: sql``}
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

module.exports.l0_getSalesTrend = l0_getSalesTrend
module.exports.l1_getSalesTrend = l1_getSalesTrend
