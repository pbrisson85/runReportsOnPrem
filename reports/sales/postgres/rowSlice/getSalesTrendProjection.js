const sql = require('../../../../server')

const l1_getSalesTrend = async (config, trendQuery) => {
  if (!config.dates.trends.queryGrouping) return []
  if (!trendQuery.sl.l1_label) return []

  try {
    console.log(`${config.user} - level 1: (l1_getSalesTrend) query postgres to get FG sales data by week ...`)

    const response = await sql
      `SELECT 
        pj.column, 
        ${trendQuery.sl.l1_label ? sql`COALESCE(pj.l1_label, 'NO VALUE') AS l1_label,`: sql``} 
        ${trendQuery.sl.l2_label ? sql`COALESCE(pj.l2_label, 'NO VALUE') AS l2_label,`: sql``} 
        ${trendQuery.sl.l3_label ? sql`COALESCE(pj.l3_label, 'NO VALUE') AS l3_label,`: sql``} 
        ${trendQuery.sl.l4_label ? sql`COALESCE(pj.l4_label, 'NO VALUE') AS l4_label,`: sql``} 
        ${trendQuery.sl.l5_label ? sql`COALESCE(pj.l5_label, 'NO VALUE') AS l5_label,`: sql``} 
        ${trendQuery.sl.l6_label ? sql`COALESCE(pj.l6_label, 'NO VALUE') AS l6_label,`: sql``} 
        ${trendQuery.sl.l7_label ? sql`COALESCE(pj.l7_label, 'NO VALUE') AS l7_label,`: sql``} 
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
          'dummy' AS column, 
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

        ${config.dates.totals.useProjection.sl ? sql`
        UNION ALL
        SELECT
          sl.item_number,
          sl.customer_code,
          ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
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
          LEFT OUTER JOIN "masters".terms AS term
            ON sl.cust_terms_code = term.code

        WHERE 
          ${!config.dates.trends.yearTrend ? sql`
          p.formatted_date >= ${config.dates.trends.startDate} 
          AND p.formatted_date <= ${config.dates.trends.endDate}` : 
        sql`
          ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
          AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
          AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
        ` } 
          ${config.slice.customer ? sql`AND sl.customer_code = ${config.slice.customer}`: sql``} 
          ${config.slice.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.slice.salesPerson}`: sql``} 
          ${config.slice.country ? sql`AND sl.country = ${config.slice.country}`: sql``} 
          ${config.slice.state ? sql`AND sl.state = ${config.slice.state}`: sql``} 
          ${config.slice.export ? sql`AND sl.domestic = ${config.slice.export}`: sql``} 
          ${config.slice.northAmerica ? sql`AND sl.north_america = ${config.slice.northAmerica}`: sql``} 
          ${config.slice.term ? sql`AND term.code = ${config.slice.term}`: sql``} 
          ${config.slice.insured ? sql`AND term.insured_status = ${config.slice.insured}`: sql``} 
          `: sql``}

        ${config.dates.totals.useProjection.so ? sql`
        UNION ALL
          SELECT 
            so.item_num AS item_number,
            so.customer_code,
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
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
            LEFT OUTER JOIN "masters".terms AS term
              ON so.cust_terms_code = term.code

          WHERE 
            so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)
            ${!config.dates.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql`
              AND ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
            ` }
            ${config.slice.customer ? sql`AND so.customer_code = ${config.slice.customer}`: sql``} 
            ${config.slice.salesPerson ? sql`AND so.out_sales_rep = ${config.slice.salesPerson}`: sql``} 
            ${config.slice.country ? sql`AND so.country = ${config.slice.country}`: sql``} 
            ${config.slice.state ? sql`AND so.state = ${config.slice.state}`: sql``} 
            ${config.slice.export ? sql`AND so.domestic = ${config.slice.export}`: sql``} 
            ${config.slice.northAmerica ? sql`AND so.north_america = ${config.slice.northAmerica}`: sql``} 
            ${config.slice.term ? sql`AND term.code = ${config.slice.term}`: sql``} 
            ${config.slice.insured ? sql`AND term.insured_status = ${config.slice.insured}`: sql``} 
            `: sql``}

        ${config.dates.totals.useProjection.pr ? sql`
        UNION ALL
          SELECT
          pr.item_number,
          pr.customer_code,
          ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
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
            LEFT OUTER JOIN "masters".terms AS term
              ON pr.cust_terms_code = term.code
        
          WHERE 
          ${!config.dates.trends.yearTrend ? sql`
              p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql`
              ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
            ` } 
          ${config.slice.customer ? sql`AND pr.customer_code = ${config.slice.customer}`: sql``} 
          ${config.slice.salesPerson ? sql`AND pr.sales_rep = ${config.slice.salesPerson}`: sql``} 
          ${config.slice.country ? sql`AND pr.country = ${config.slice.country}`: sql``} 
          ${config.slice.state ? sql`AND pr.state = ${config.slice.state}`: sql``} 
          ${config.slice.export ? sql`AND pr.domestic = ${config.slice.export}`: sql``} 
          ${config.slice.northAmerica ? sql`AND pr.north_america = ${config.slice.northAmerica}`: sql``}
          ${config.slice.term ? sql`AND term.code = ${config.slice.term}`: sql``} 
          ${config.slice.insured ? sql`AND term.insured_status = ${config.slice.insured}`: sql``} 
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
        ${config.slice.speciesGroup ? sql`AND ms.species_group = ${config.slice.speciesGroup}`: sql``}
        ${config.slice.species ? sql`AND ms.species = ${config.slice.species}`: sql``}
        ${config.slice.program ? sql`AND ms.program = ${config.slice.program}`: sql``}
        ${config.slice.item ? sql`AND ms.item_num = ${config.slice.item}`: sql``}  
        ${config.slice.custType ? sql`AND cs.category = ${config.slice.custType}`: sql``} 
        ${config.slice.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.slice.freshFrozen}`: sql``}  
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
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
  if (!config.dates.trends.queryGrouping) return []

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
          'dummy' AS column, 
          0 AS lbs, 
          0 AS sales, 
          0 AS cogs, 
          0 AS othp 
        WHERE 1=2

      ${config.dates.totals.useProjection.sl ? sql`
      UNION ALL
        SELECT
          sl.item_number,
          sl.customer_code,
          ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
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
          LEFT OUTER JOIN "masters".terms AS term
            ON sl.cust_terms_code = term.code

        WHERE 
          ${!config.dates.trends.yearTrend ? sql`
          p.formatted_date >= ${config.dates.trends.startDate} 
          AND p.formatted_date <= ${config.dates.trends.endDate}` : 
        sql`
          ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
          AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
          AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
        ` } 
          ${config.slice.customer ? sql`AND sl.customer_code = ${config.slice.customer}`: sql``} 
          ${config.slice.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.slice.salesPerson}`: sql``} 
          ${config.slice.country ? sql`AND sl.country = ${config.slice.country}`: sql``} 
          ${config.slice.state ? sql`AND sl.state = ${config.slice.state}`: sql``} 
          ${config.slice.export ? sql`AND sl.domestic = ${config.slice.export}`: sql``} 
          ${config.slice.northAmerica ? sql`AND sl.north_america = ${config.slice.northAmerica}`: sql``} 
          ${config.slice.term ? sql`AND term.code = ${config.slice.term}`: sql``} 
          ${config.slice.insured ? sql`AND term.insured_status = ${config.slice.insured}`: sql``} 
          `: sql``}

      ${config.dates.totals.useProjection.so ? sql`
      UNION ALL
        SELECT 
            so.item_num AS item_number,
            so.customer_code,
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
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
            LEFT OUTER JOIN "masters".terms AS term 
              ON so.cust_terms_code = term.code 

        WHERE 
          so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)
          ${!config.dates.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql`
              AND ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
            ` }
          ${config.slice.customer ? sql`AND so.customer_code = ${config.slice.customer}`: sql``} 
          ${config.slice.salesPerson ? sql`AND so.out_sales_rep = ${config.slice.salesPerson}`: sql``} 
          ${config.slice.country ? sql`AND so.country = ${config.slice.country}`: sql``} 
          ${config.slice.state ? sql`AND so.state = ${config.slice.state}`: sql``} 
          ${config.slice.export ? sql`AND so.domestic = ${config.slice.export}`: sql``} 
          ${config.slice.northAmerica ? sql`AND so.north_america = ${config.slice.northAmerica}`: sql``} 
          ${config.slice.term ? sql`AND term.code = ${config.slice.term}`: sql``} 
          ${config.slice.insured ? sql`AND term.insured_status = ${config.slice.insured}`: sql``} 
          `: sql``}

          ${config.dates.totals.useProjection.pr ? sql`
          UNION ALL
            SELECT
            pr.item_number,
            pr.customer_code,
            ${sql(config.dates.trends.queryGrouping)}::TEXT AS column, 
            COALESCE(pr.lbs,0) AS lbs, COALESCE(pr.sales_gross,0) AS sales, COALESCE(pr.cogs,0) AS cogs, COALESCE(pr.othp,0) AS othp 
              
            FROM "salesReporting".projected_sales AS pr  
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = pr.item_number 
              LEFT OUTER JOIN "masters".customer_supplement AS cs 
                ON cs.customer_code = pr.customer_code 
              LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
                ON pr.date = p.formatted_date
              LEFT OUTER JOIN "masters".terms AS term
                ON pr.cust_terms_code = term.code
          
            WHERE 
            ${!config.dates.trends.yearTrend ? sql`
              p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql`
              ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
            ` }
            ${config.slice.customer ? sql`AND pr.customer_code = ${config.slice.customer}`: sql``} 
            ${config.slice.salesPerson ? sql`AND pr.sales_rep = ${config.slice.salesPerson}`: sql``} 
            ${config.slice.country ? sql`AND pr.country = ${config.slice.country}`: sql``} 
            ${config.slice.state ? sql`AND pr.state = ${config.slice.state}`: sql``} 
            ${config.slice.export ? sql`AND pr.domestic = ${config.slice.export}`: sql``} 
            ${config.slice.northAmerica ? sql`AND pr.north_america = ${config.slice.northAmerica}`: sql``}
            ${config.slice.term ? sql`AND term.code = ${config.slice.term}`: sql``} 
            ${config.slice.insured ? sql`AND term.insured_status = ${config.slice.insured}`: sql``} 
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
      ${config.slice.speciesGroup ? sql`AND ms.species_group = ${config.slice.speciesGroup}`: sql``}
      ${config.slice.species ? sql`AND ms.species = ${config.slice.species}`: sql``}
      ${config.slice.program ? sql`AND ms.program = ${config.slice.program}`: sql``}
      ${config.slice.item ? sql`AND ms.item_num = ${config.slice.item}`: sql``}  
      ${config.slice.custType ? sql`AND cs.category = ${config.slice.custType}`: sql``} 
      ${config.slice.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.slice.freshFrozen}`: sql``}  
      ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
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
