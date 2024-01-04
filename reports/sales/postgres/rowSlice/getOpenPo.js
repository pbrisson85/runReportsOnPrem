const sql = require('../../../../server')

/* *********************************************** Level 1 *********************************************** */

const l1_getOpenPo = async (config, trendQuery) => {
  try {
    console.log(`${config.user} - level 1: query postgres for FG open PO ...`)

    if (!trendQuery.inv.l1_label) return []

    const response = await sql
        `
        -- create list of items to filter on. If there is ANY filter on sales then the slice should not include all items

        WITH sales_filters AS (
            SELECT
              '0' AS item_number
            WHERE 1=2
    
            ${config.totals.useProjection.sl ? sql`
            UNION
            SELECT
              DISTINCT(sl.item_number) AS item_number
            FROM "salesReporting".sales_line_items AS sl
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sl.item_number 
              LEFT OUTER JOIN "masters".customer_supplement AS cs 
                ON cs.customer_code = sl.customer_code
              LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
                ON sl.formatted_invoice_date = p.formatted_date
            WHERE 
              sl.formatted_invoice_date >= ${config.totals.primary.startDate} AND sl.formatted_invoice_date <= ${config.totals.primary.endDate} 
              ${config.trendFilters.customer ? sql`AND sl.customer_code = ${config.trendFilters.customer}`: sql``} 
              ${config.trendFilters.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.trendFilters.salesPerson}`: sql``} 
              ${config.trendFilters.country ? sql`AND sl.country = ${config.trendFilters.country}`: sql``} 
              ${config.trendFilters.state ? sql`AND sl.state = ${config.trendFilters.state}`: sql``} 
              ${config.trendFilters.export ? sql`AND sl.domestic = ${config.trendFilters.export}`: sql``} 
              ${config.trendFilters.northAmerica ? sql`AND sl.north_america = ${config.trendFilters.northAmerica}`: sql``} 
              `: sql``}
    
            ${config.totals.useProjection.so ? sql`
            UNION
              SELECT 
                DISTINCT(so.item_num) AS item_number
              FROM "salesReporting".sales_orders AS so
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                  ON ms.item_num = so.item_num 
                LEFT OUTER JOIN "masters".customer_supplement AS cs 
                  ON cs.customer_code = so.customer_code
                LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
                  ON so.formatted_ship_date = p.formatted_date
    
              WHERE 
                so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)
                AND so.formatted_ship_date >= ${config.totals.primary.startDate} AND so.formatted_ship_date <= ${config.totals.primary.endDate}
                ${config.trendFilters.customer ? sql`AND so.customer_code = ${config.trendFilters.customer}`: sql``} 
                ${config.trendFilters.salesPerson ? sql`AND so.out_sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
                ${config.trendFilters.country ? sql`AND so.country = ${config.trendFilters.country}`: sql``} 
                ${config.trendFilters.state ? sql`AND so.state = ${config.trendFilters.state}`: sql``} 
                ${config.trendFilters.export ? sql`AND so.domestic = ${config.trendFilters.export}`: sql``} 
                ${config.trendFilters.northAmerica ? sql`AND so.north_america = ${config.trendFilters.northAmerica}`: sql``} 
                `: sql``}
    
            ${config.totals.useProjection.pr ? sql`
            UNION
              SELECT
                DISTINCT(pr.item_number) AS item_number
              FROM "salesReporting".projected_sales AS pr  
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                  ON ms.item_num = pr.item_number 
                LEFT OUTER JOIN "masters".customer_supplement AS cs 
                  ON cs.customer_code = pr.customer_code 
                LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
                  ON pr.date = p.formatted_date
              WHERE 
              pr.date >= ${config.totals.primary.startDate} AND pr.date <= ${config.totals.primary.endDate} 
              ${config.trendFilters.customer ? sql`AND pr.customer_code = ${config.trendFilters.customer}`: sql``} 
              ${config.trendFilters.salesPerson ? sql`AND pr.sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
              ${config.trendFilters.country ? sql`AND pr.country = ${config.trendFilters.country}`: sql``} 
              ${config.trendFilters.state ? sql`AND pr.state = ${config.trendFilters.state}`: sql``} 
              ${config.trendFilters.export ? sql`AND pr.domestic = ${config.trendFilters.export}`: sql``} 
              ${config.trendFilters.northAmerica ? sql`AND pr.north_america = ${config.trendFilters.northAmerica}`: sql``}
              `: sql``}
        )
        
        SELECT 
          'PURCHASE ORDER' AS column, 
          ${trendQuery.inv.l1_label ? sql`${sql(trendQuery.inv.l1_label)} AS l1_label,`: sql``} 
          ${trendQuery.inv.l2_label ? sql`${sql(trendQuery.inv.l2_label)} AS l2_label,`: sql``} 
          ${trendQuery.inv.l3_label ? sql`${sql(trendQuery.inv.l3_label)} AS l3_label,`: sql``} 
          ${trendQuery.inv.l4_label ? sql`${sql(trendQuery.inv.l4_label)} AS l4_label,`: sql``} 
          ${trendQuery.inv.l5_label ? sql`${sql(trendQuery.inv.l5_label)} AS l5_label,`: sql``} 
          ${trendQuery.inv.l6_label ? sql`${sql(trendQuery.inv.l6_label)} AS l6_label,`: sql``} 
          ${trendQuery.inv.l7_label ? sql`${sql(trendQuery.inv.l7_label)} AS l7_label,`: sql``} 
          COALESCE(SUM(inv.on_order_lbs),0) AS lbs, 
          COALESCE(SUM(inv.on_order_extended),0) AS cogs, 
          COALESCE(SUM(inv.on_order_extended),0) AS "grossSales", 
          COALESCE(SUM(inv.on_order_extended),0) AS "netSales", 
          COALESCE(SUM(inv.on_order_extended),0) AS othp, 
          COALESCE(SUM(inv.on_order_extended),0) AS "grossMargin", 
          0 AS "grossMarginPercent", 
          COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "grossSalesPerLb", 
          COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "cogsPerLb", 
          COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "othpPerLb", 
          COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "netSalesPerLb", 
          COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "grossMarginPerLb"
         
        FROM "invenReporting".perpetual_inventory AS inv
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = inv.item_number 
         
        WHERE 
          inv.on_order_lbs <> 0 
          AND inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
          ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
          ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
          ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
          ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
          ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
          ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
          ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
          ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``} 
          ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
          AND inv.item_number IN (SELECT item_number FROM sales_filters) -- apply sales filters
         
        GROUP BY 
          ${trendQuery.inv.l1_label ? sql`${sql(trendQuery.inv.l1_label)}`: sql``} 
          ${trendQuery.inv.l2_label ? sql`, ${sql(trendQuery.inv.l2_label)}`: sql``} 
          ${trendQuery.inv.l3_label ? sql`, ${sql(trendQuery.inv.l3_label)}`: sql``} 
          ${trendQuery.inv.l4_label ? sql`, ${sql(trendQuery.inv.l4_label)}`: sql``} 
          ${trendQuery.inv.l5_label ? sql`, ${sql(trendQuery.inv.l5_label)}`: sql``} 
          ${trendQuery.inv.l6_label ? sql`, ${sql(trendQuery.inv.l6_label)}`: sql``} 
          ${trendQuery.inv.l7_label ? sql`, ${sql(trendQuery.inv.l7_label)}`: sql``} 
          ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const l0_getOpenPo = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG open PO ...`)

    const response = await sql
         `
         -- create list of items to filter on. If there is ANY filter on sales then the slice should not include all items

        WITH sales_filters AS (
            SELECT
              '0' AS item_number
            WHERE 1=2
    
            ${config.totals.useProjection.sl ? sql`
            UNION
            SELECT
              DISTINCT(sl.item_number) AS item_number
            FROM "salesReporting".sales_line_items AS sl
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = sl.item_number 
              LEFT OUTER JOIN "masters".customer_supplement AS cs 
                ON cs.customer_code = sl.customer_code
              LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
                ON sl.formatted_invoice_date = p.formatted_date
            WHERE 
              sl.formatted_invoice_date >= ${config.totals.primary.startDate} AND sl.formatted_invoice_date <= ${config.totals.primary.endDate} 
              ${config.trendFilters.customer ? sql`AND sl.customer_code = ${config.trendFilters.customer}`: sql``} 
              ${config.trendFilters.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.trendFilters.salesPerson}`: sql``} 
              ${config.trendFilters.country ? sql`AND sl.country = ${config.trendFilters.country}`: sql``} 
              ${config.trendFilters.state ? sql`AND sl.state = ${config.trendFilters.state}`: sql``} 
              ${config.trendFilters.export ? sql`AND sl.domestic = ${config.trendFilters.export}`: sql``} 
              ${config.trendFilters.northAmerica ? sql`AND sl.north_america = ${config.trendFilters.northAmerica}`: sql``} 
              `: sql``}
    
            ${config.totals.useProjection.so ? sql`
            UNION
              SELECT 
                DISTINCT(so.item_num) AS item_number
              FROM "salesReporting".sales_orders AS so
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                  ON ms.item_num = so.item_num 
                LEFT OUTER JOIN "masters".customer_supplement AS cs 
                  ON cs.customer_code = so.customer_code
                LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
                  ON so.formatted_ship_date = p.formatted_date
    
              WHERE 
                so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)
                AND so.formatted_ship_date >= ${config.totals.primary.startDate} AND so.formatted_ship_date <= ${config.totals.primary.endDate}
                ${config.trendFilters.customer ? sql`AND so.customer_code = ${config.trendFilters.customer}`: sql``} 
                ${config.trendFilters.salesPerson ? sql`AND so.out_sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
                ${config.trendFilters.country ? sql`AND so.country = ${config.trendFilters.country}`: sql``} 
                ${config.trendFilters.state ? sql`AND so.state = ${config.trendFilters.state}`: sql``} 
                ${config.trendFilters.export ? sql`AND so.domestic = ${config.trendFilters.export}`: sql``} 
                ${config.trendFilters.northAmerica ? sql`AND so.north_america = ${config.trendFilters.northAmerica}`: sql``} 
                `: sql``}
    
            ${config.totals.useProjection.pr ? sql`
            UNION
              SELECT
                DISTINCT(pr.item_number) AS item_number
              FROM "salesReporting".projected_sales AS pr  
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                  ON ms.item_num = pr.item_number 
                LEFT OUTER JOIN "masters".customer_supplement AS cs 
                  ON cs.customer_code = pr.customer_code 
                LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
                  ON pr.date = p.formatted_date
              WHERE 
              pr.date >= ${config.totals.primary.startDate} AND pr.date <= ${config.totals.primary.endDate} 
              ${config.trendFilters.customer ? sql`AND pr.customer_code = ${config.trendFilters.customer}`: sql``} 
              ${config.trendFilters.salesPerson ? sql`AND pr.sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
              ${config.trendFilters.country ? sql`AND pr.country = ${config.trendFilters.country}`: sql``} 
              ${config.trendFilters.state ? sql`AND pr.state = ${config.trendFilters.state}`: sql``} 
              ${config.trendFilters.export ? sql`AND pr.domestic = ${config.trendFilters.export}`: sql``} 
              ${config.trendFilters.northAmerica ? sql`AND pr.north_america = ${config.trendFilters.northAmerica}`: sql``}
              `: sql``}
        )



         
         SELECT 
          'PURCHASE ORDER' AS column,
          'TOTAL' AS l1_label,  
          COALESCE(SUM(inv.on_order_lbs),0) AS lbs, 
          COALESCE(SUM(inv.on_order_extended),0) AS cogs, 
          COALESCE(SUM(inv.on_order_extended),0) AS "grossSales", 
          COALESCE(SUM(inv.on_order_extended),0) AS "netSales", 
          COALESCE(SUM(inv.on_order_extended),0) AS othp, 
          COALESCE(SUM(inv.on_order_extended),0) AS "grossMargin", 
          0 AS "grossMarginPercent", 
          COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "grossSalesPerLb", 
          COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "cogsPerLb", 
          COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "othpPerLb", 
          COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "netSalesPerLb", 
          COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "grossMarginPerLb"
         
         FROM "invenReporting".perpetual_inventory AS inv
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = inv.item_number 
         
         WHERE 
          inv.on_order_lbs <> 0 
          AND inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
          ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
          ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
          ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
          ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
          ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
          ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
          ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
          ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``}
          ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
          AND inv.item_number IN (SELECT item_number FROM sales_filters) -- apply sales filters

          
          ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l1_getOpenPo = l1_getOpenPo
module.exports.l0_getOpenPo = l0_getOpenPo
