const sql = require('../../../../server')

const l1_getSoTrend = async (config, trendQuery) => {
  if (!config.trends.queryGrouping) return []
  if (!trendQuery.so.l1_label) return []

  try {
    console.log(`${config.user} - level 1: query postgres for FG Sales Orders By Week ...`)

    const response = await sql
        `SELECT 
          ${sql(config.trends.queryGrouping)} || '_so' AS column, 
          ${trendQuery.so.l1_label ? sql`COALESCE(${sql(trendQuery.so.l1_label)}, 'NO VALUE') AS l1_label,`: sql``} 
          ${trendQuery.so.l2_label ? sql`COALESCE(${sql(trendQuery.so.l2_label)}, 'NO VALUE') AS l2_label,`: sql``} 
          ${trendQuery.so.l3_label ? sql`COALESCE(${sql(trendQuery.so.l3_label)}, 'NO VALUE') AS l3_label,`: sql``} 
          ${trendQuery.so.l4_label ? sql`COALESCE(${sql(trendQuery.so.l4_label)}, 'NO VALUE') AS l4_label,`: sql``} 
          ${trendQuery.so.l5_label ? sql`COALESCE(${sql(trendQuery.so.l5_label)}, 'NO VALUE') AS l5_label,`: sql``} 
          ${trendQuery.so.l6_label ? sql`COALESCE(${sql(trendQuery.so.l6_label)}, 'NO VALUE') AS l6_label,`: sql``} 
          ${trendQuery.so.l7_label ? sql`COALESCE(${sql(trendQuery.so.l7_label)}, 'NO VALUE') AS l7_label,`: sql``} 
          COALESCE(SUM(so.ext_weight),0) AS lbs, 
          COALESCE(SUM(so.ext_sales),0) AS "grossSales", 
          COALESCE(SUM(so.ext_cost),0) AS cogs, 
          COALESCE(SUM(so.ext_othp),0) AS othp, 
          COALESCE(SUM(so.ext_sales) - SUM(so.ext_othp),0) AS "netSales", 
          COALESCE(SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp),0) AS "grossMargin", 
          COALESCE((SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp)) / NULLIF(SUM(so.ext_sales),0),0) AS "grossMarginPercent", 
          COALESCE(SUM(so.ext_sales)/NULLIF(SUM(so.ext_weight),0),0) AS "grossSalesPerLb", 
          COALESCE((SUM(so.ext_sales) - SUM(so.ext_othp))/NULLIF(SUM(so.ext_weight),0),0) AS "netSalesPerLb", 
          COALESCE((SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp))/NULLIF(SUM(so.ext_weight),0),0) AS "grossMarginPerLb", 
          COALESCE(SUM(so.ext_cost)/NULLIF(SUM(so.ext_weight),0),0) AS "cogsPerLb", 
          COALESCE(SUM(so.ext_othp)/NULLIF(SUM(so.ext_weight),0),0) AS "othpPerLb" 
         
        FROM "salesReporting".sales_orders AS so
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = so.item_num 
          LEFT OUTER JOIN "masters".customer_supplement AS cs 
            ON cs.customer_code = so.customer_code 
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON so.formatted_ship_date = p.formatted_date
         
        WHERE 
          so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``}
          ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
          ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
          ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
          ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
          ${config.trendFilters.customer ? sql`AND so.customer_code = ${config.trendFilters.customer}`: sql``} 
          ${config.trendFilters.salesPerson ? sql`AND so.out_sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
          ${config.trendFilters.country ? sql`AND so.country = ${config.trendFilters.country}`: sql``} 
          ${config.trendFilters.state ? sql`AND so.state = ${config.trendFilters.state}`: sql``} 
          ${config.trendFilters.export ? sql`AND so.domestic = ${config.trendFilters.export}`: sql``} 
          ${config.trendFilters.northAmerica ? sql`AND so.north_america = ${config.trendFilters.northAmerica}`: sql``}  
          ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
          ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
          ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
          ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``}  
          ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
         
        GROUP BY 
          ${sql(config.trends.queryGrouping)}, 
          ${trendQuery.so.l1_label ? sql`${sql(trendQuery.so.l1_label)}`: sql``} 
          ${trendQuery.so.l2_label ? sql`, ${sql(trendQuery.so.l2_label)}`: sql``} 
          ${trendQuery.so.l3_label ? sql`, ${sql(trendQuery.so.l3_label)}`: sql``} 
          ${trendQuery.so.l4_label ? sql`, ${sql(trendQuery.so.l4_label)}`: sql``} 
          ${trendQuery.so.l5_label ? sql`, ${sql(trendQuery.so.l5_label)}`: sql``} 
          ${trendQuery.so.l6_label ? sql`, ${sql(trendQuery.so.l6_label)}`: sql``} 
          ${trendQuery.so.l7_label ? sql`, ${sql(trendQuery.so.l7_label)}`: sql``} 
         
         ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getSoTrend = async config => {
  if (!config.trends.queryGrouping) return []

  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders By Week ...`)

    const response = await sql
           `SELECT 
            ${sql(config.trends.queryGrouping)} || '_so' AS column,
            'TOTAL' AS l1_label,  
            COALESCE(SUM(so.ext_weight),0) AS lbs, 
            COALESCE(SUM(so.ext_sales),0) AS "grossSales", 
            COALESCE(SUM(so.ext_cost),0) AS cogs, 
            COALESCE(SUM(so.ext_othp),0) AS othp, 
            COALESCE(SUM(so.ext_sales) - SUM(so.ext_othp),0) AS "netSales", 
            COALESCE(SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp),0) AS "grossMargin", 
            COALESCE((SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp)) / NULLIF(SUM(so.ext_sales),0),0) AS "grossMarginPercent", 
            COALESCE(SUM(so.ext_sales)/NULLIF(SUM(so.ext_weight),0),0) AS "grossSalesPerLb", 
            COALESCE((SUM(so.ext_sales) - SUM(so.ext_othp))/NULLIF(SUM(so.ext_weight),0),0) AS "netSalesPerLb", 
            COALESCE((SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp))/NULLIF(SUM(so.ext_weight),0),0) AS "grossMarginPerLb", 
            COALESCE(SUM(so.ext_cost)/NULLIF(SUM(so.ext_weight),0),0) AS "cogsPerLb", 
            COALESCE(SUM(so.ext_othp)/NULLIF(SUM(so.ext_weight),0),0) AS "othpPerLb" 
           
           FROM "salesReporting".sales_orders AS so
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = so.item_num 
            LEFT OUTER JOIN "masters".customer_supplement AS cs 
              ON cs.customer_code = so.customer_code 
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
              ON so.formatted_ship_date = p.formatted_date
           
           WHERE 
            so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``}
            ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
            ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
            ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
            ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
            ${config.trendFilters.customer ? sql`AND so.customer_code = ${config.trendFilters.customer}`: sql``} 
            ${config.trendFilters.salesPerson ? sql`AND so.out_sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
            ${config.trendFilters.country ? sql`AND so.country = ${config.trendFilters.country}`: sql``} 
            ${config.trendFilters.state ? sql`AND so.state = ${config.trendFilters.state}`: sql``} 
            ${config.trendFilters.export ? sql`AND so.domestic = ${config.trendFilters.export}`: sql``} 
            ${config.trendFilters.northAmerica ? sql`AND so.north_america = ${config.trendFilters.northAmerica}`: sql``}  
            ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
            ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
            ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
            ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
            ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``} 
            ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
           
           GROUP BY ${sql(config.trends.queryGrouping)} 
           
           ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l1_getSoTrend = l1_getSoTrend
module.exports.l0_getSoTrend = l0_getSoTrend
