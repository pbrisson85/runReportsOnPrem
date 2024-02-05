const sql = require('../../../../server')

const l1_getSo = async (config, trendQuery) => {
  if (!trendQuery.so.l1_label) return []

  try {
    console.log(`${config.user} - level 1: query postgres for FG Sales Orders ...`)

    const response = await sql
         `SELECT 
          'SALES ORDER' AS column, 
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
         
         WHERE 
          so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.slice.speciesGroup ? sql`AND ms.species_group = ${config.slice.speciesGroup}`: sql``}
          ${config.slice.species ? sql`AND ms.species = ${config.slice.species}`: sql``}
          ${config.slice.program ? sql`AND ms.program = ${config.slice.program}`: sql``}
          ${config.slice.item ? sql`AND ms.item_num = ${config.slice.item}`: sql``}  
          ${config.slice.customer ? sql`AND so.customer_code = ${config.slice.customer}`: sql``} 
          ${config.slice.custType ? sql`AND cs.category = ${config.slice.custType}`: sql``} 
          ${config.slice.salesPerson ? sql`AND so.out_sales_rep = ${config.slice.salesPerson}`: sql``}  
          ${config.slice.country ? sql`AND so.country = ${config.slice.country}`: sql``} 
          ${config.slice.state ? sql`AND so.state = ${config.slice.state}`: sql``} 
          ${config.slice.export ? sql`AND so.domestic = ${config.slice.export}`: sql``} 
          ${config.slice.northAmerica ? sql`AND so.north_america = ${config.slice.northAmerica}`: sql``} 
          ${config.slice.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.slice.freshFrozen}`: sql``}  
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
          ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
          ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
          ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``} 
          ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
         
         GROUP BY 
          ${trendQuery.so.l1_label ? sql`${sql(trendQuery.so.l1_label)}`: sql``} 
          ${trendQuery.so.l2_label ? sql`, ${sql(trendQuery.so.l2_label)}`: sql``} 
          ${trendQuery.so.l3_label ? sql`, ${sql(trendQuery.so.l3_label)}`: sql``} 
          ${trendQuery.so.l4_label ? sql`, ${sql(trendQuery.so.l4_label)}`: sql``} 
          ${trendQuery.so.l5_label ? sql`, ${sql(trendQuery.so.l5_label)}`: sql``} 
          ${trendQuery.so.l6_label ? sql`, ${sql(trendQuery.so.l6_label)}`: sql``} 
          ${trendQuery.so.l7_label ? sql`, ${sql(trendQuery.so.l7_label)}`: sql``}   
         ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getSo = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders ...`)

    const response = await sql
           `SELECT 
            'SALES ORDER' AS column,
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
           
           WHERE 
            so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
            ${config.slice.speciesGroup ? sql`AND ms.species_group = ${config.slice.speciesGroup}`: sql``}
            ${config.slice.species ? sql`AND ms.species = ${config.slice.species}`: sql``}
            ${config.slice.program ? sql`AND ms.program = ${config.slice.program}`: sql``}
            ${config.slice.item ? sql`AND ms.item_num = ${config.slice.item}`: sql``}  
            ${config.slice.customer ? sql`AND so.customer_code = ${config.slice.customer}`: sql``} 
            ${config.slice.custType ? sql`AND cs.category = ${config.slice.custType}`: sql``} 
            ${config.slice.salesPerson ? sql`AND so.out_sales_rep = ${config.slice.salesPerson}`: sql``} 
            ${config.slice.country ? sql`AND so.country = ${config.slice.country}`: sql``} 
            ${config.slice.state ? sql`AND so.state = ${config.slice.state}`: sql``} 
            ${config.slice.export ? sql`AND so.domestic = ${config.slice.export}`: sql``} 
            ${config.slice.northAmerica ? sql`AND so.north_america = ${config.slice.northAmerica}`: sql``}  
            ${config.slice.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.slice.freshFrozen}`: sql``}  
            ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
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

module.exports.l1_getSo = l1_getSo
module.exports.l0_getSo = l0_getSo
