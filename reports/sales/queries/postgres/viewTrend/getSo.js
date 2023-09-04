const sql = require('../../../../../server')

/* *********************************************** level 1 *********************************************** */

const lvl_1_subtotal_getSo = async (config, trendQuery) => {
  try {
    console.log(`${config.user} - level 1: query postgres for FG Sales Orders ...`)

    const response = await sql
         `SELECT 
          'FG OPEN ORDER' AS column, 
          ${trendQuery.so.l1_label ? sql`${sql(trendQuery.so.l1_label)} AS l1_label,`: sql``} 
          ${trendQuery.so.l2_label ? sql`${sql(trendQuery.so.l2_label)} AS l2_label,`: sql``} 
          ${trendQuery.so.l3_label ? sql`${sql(trendQuery.so.l3_label)} AS l3_label,`: sql``} 
          ${trendQuery.so.l4_label ? sql`${sql(trendQuery.so.l4_label)} AS l4_label,`: sql``} 
          ${trendQuery.so.l5_label ? sql`${sql(trendQuery.so.l5_label)} AS l5_label,`: sql``} 
          ${trendQuery.so.l6_label ? sql`${sql(trendQuery.so.l6_label)} AS l6_label,`: sql``} 
          ${trendQuery.so.l7_label ? sql`${sql(trendQuery.so.l7_label)} AS l7_label,`: sql``} 
          COALESCE(SUM(so.ext_weight),0) AS lbs, 
          COALESCE(SUM(so.ext_sales),0) AS sales, 
          COALESCE(SUM(so.ext_cost),0) AS cogs, 
          COALESCE(SUM(so.ext_othp),0) AS othp 
         
         FROM "salesReporting".sales_orders AS so
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = so.item_num 
         
         WHERE 
          ms.item_type = ${'FG'} 
          AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
          ${config.program ? sql`AND ms.program = ${config.program}`: sql``}
          ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
          ${config.customer ? sql`AND so.customer_code = ${config.customer}`: sql``} 
          ${config.salesPerson ? sql`AND so.out_sales_rep = ${config.salesPerson}`: sql``}  
          ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          AND ms.byproduct_type IS NULL  
          ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
          ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
          ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
          ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
         
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

const lvl_1_subtotal_getSoTagged = async (config, trendQuery) => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
           `SELECT 
            'FG OPEN ORDER TAGGED' AS column, 
            ${trendQuery.so.l1_label ? sql`${sql(trendQuery.so.l1_label)} AS l1_label,`: sql``} 
            ${trendQuery.so.l2_label ? sql`${sql(trendQuery.so.l2_label)} AS l2_label,`: sql``} 
            ${trendQuery.so.l3_label ? sql`${sql(trendQuery.so.l3_label)} AS l3_label,`: sql``} 
            ${trendQuery.so.l4_label ? sql`${sql(trendQuery.so.l4_label)} AS l4_label,`: sql``} 
            ${trendQuery.so.l5_label ? sql`${sql(trendQuery.so.l5_label)} AS l5_label,`: sql``} 
            ${trendQuery.so.l6_label ? sql`${sql(trendQuery.so.l6_label)} AS l6_label,`: sql``} 
            ${trendQuery.so.l7_label ? sql`${sql(trendQuery.so.l7_label)} AS l7_label,`: sql``} 
            COALESCE(SUM(so.tagged_weight),0) AS lbs, 
            COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, 
            COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, 
            COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
           
           FROM "salesReporting".sales_orders AS so
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = so.item_num 
           
           WHERE 
            ms.item_type = ${'FG'} 
            AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``}
            ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
            ${config.customer ? sql`AND so.customer_code = ${config.customer}`: sql``} 
            ${config.salesPerson ? sql`AND so.out_sales_rep = ${config.salesPerson}`: sql``}  
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            AND ms.byproduct_type IS NULL AND so.tagged_weight > 0  
            ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
            ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
            ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
            ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
           
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

const lvl_1_subtotal_getSoUntagged = async (config, trendQuery) => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT 
        'FG OPEN ORDER UNTAGGED' AS column, 
        ${trendQuery.so.l1_label ? sql`${sql(trendQuery.so.l1_label)} AS l1_label,`: sql``} 
        ${trendQuery.so.l2_label ? sql`${sql(trendQuery.so.l2_label)} AS l2_label,`: sql``} 
        ${trendQuery.so.l3_label ? sql`${sql(trendQuery.so.l3_label)} AS l3_label,`: sql``} 
        ${trendQuery.so.l4_label ? sql`${sql(trendQuery.so.l4_label)} AS l4_label,`: sql``} 
        ${trendQuery.so.l5_label ? sql`${sql(trendQuery.so.l5_label)} AS l5_label,`: sql``} 
        ${trendQuery.so.l6_label ? sql`${sql(trendQuery.so.l6_label)} AS l6_label,`: sql``} 
        ${trendQuery.so.l7_label ? sql`${sql(trendQuery.so.l7_label)} AS l7_label,`: sql``} 
        COALESCE(SUM(so.untagged_weight),0) AS lbs, 
        COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, 
        COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, 
        COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``}
        ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
        ${config.customer ? sql`AND so.customer_code = ${config.customer}`: sql``} 
        ${config.salesPerson ? sql`AND so.out_sales_rep = ${config.salesPerson}`: sql``}  
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
        AND so.untagged_weight > 0  
        ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
        ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
        ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
        ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
      
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

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getSo = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders ...`)

    const response = await sql
           `SELECT 
            'FG OPEN ORDER' AS column, 
            'FG SALES' AS l1_label, 
'TOTAL' AS l2_label,  
            COALESCE(SUM(so.ext_weight),0) AS lbs, 
            COALESCE(SUM(so.ext_sales),0) AS sales, 
            COALESCE(SUM(so.ext_cost),0) AS cogs, 
            COALESCE(SUM(so.ext_othp),0) AS othp 
           
           FROM "salesReporting".sales_orders AS so 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = so.item_num 
           
           WHERE 
            ms.item_type = ${'FG'} 
            AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``}
            ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
            ${config.customer ? sql`AND so.customer_code = ${config.customer}`: sql``} 
            ${config.salesPerson ? sql`AND so.out_sales_rep = ${config.salesPerson}`: sql``}  
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            AND ms.byproduct_type IS NULL  
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

const lvl_0_total_getSoTagged = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT 
        'FG OPEN ORDER TAGGED' AS column, 
        'FG SALES' AS l1_label, 
'TOTAL' AS l2_label,  
        COALESCE(SUM(so.tagged_weight),0) AS lbs, 
        COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, 
        COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, 
        COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``}
        ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
        ${config.customer ? sql`AND so.customer_code = ${config.customer}`: sql``} 
        ${config.salesPerson ? sql`AND so.out_sales_rep = ${config.salesPerson}`: sql``}  
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
        AND so.tagged_weight > 0  
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

const lvl_0_total_getSoUntagged = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT 
        'FG OPEN ORDER UNTAGGED' AS column, 
        'FG SALES' AS l1_label, 
'TOTAL' AS l2_label,  
        COALESCE(SUM(so.untagged_weight),0) AS lbs, 
        COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, 
        COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, 
        COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``}
        ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
        ${config.customer ? sql`AND so.customer_code = ${config.customer}`: sql``} 
        ${config.salesPerson ? sql`AND so.out_sales_rep = ${config.salesPerson}`: sql``}  
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
        AND so.untagged_weight > 0  
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

module.exports.lvl_1_subtotal_getSo = lvl_1_subtotal_getSo
module.exports.lvl_0_total_getSo = lvl_0_total_getSo
module.exports.lvl_0_total_getSoTagged = lvl_0_total_getSoTagged
module.exports.lvl_0_total_getSoUntagged = lvl_0_total_getSoUntagged
module.exports.lvl_1_subtotal_getSoTagged = lvl_1_subtotal_getSoTagged
module.exports.lvl_1_subtotal_getSoUntagged = lvl_1_subtotal_getSoUntagged
