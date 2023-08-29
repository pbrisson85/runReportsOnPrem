const sql = require('../../../../../server')

/* *********************************************** level 1 *********************************************** */

const lvl_1_subtotal_getSo = async config => {
  try {
    console.log(`level 1: query postgres for FG Sales Orders ...`)

    const response = await sql
         `SELECT 'FG OPEN ORDER' AS column, ms.item_num AS l1_label, ms.description AS l2_label, ms.fg_fresh_frozen AS l3_label, ms.fg_treatment AS l4_label, ms.brand AS l5_label, ms.size_name AS l6_label, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp 
         
         FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
         
         WHERE 
          ms.item_type = ${'FG'} 
          AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
          ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
          ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          AND ms.byproduct_type IS NULL  
          ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
          ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
          ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``} 
          ${config.customer ? sql`AND sales_orders.customer_code = ${config.customer}`: sql``} 
         
         GROUP BY ms.item_num, ms.description, ms.fg_fresh_frozen, ms.fg_treatment, ms.brand, ms.size_name` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoTagged = async config => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
           `SELECT 'FG OPEN ORDER TAGGED' AS column, ms.item_num AS l1_label, ms.description AS l2_label, ms.fg_fresh_frozen AS l3_label, ms.fg_treatment AS l4_label, ms.brand AS l5_label, ms.size_name AS l6_label, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
           
           FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
           
           WHERE 
            ms.item_type = ${'FG'} 
            AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            AND ms.byproduct_type IS NULL AND sales_orders.tagged_weight > 0  
            ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
            ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
            ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``} 
            ${config.customer ? sql`AND sales_orders.customer_code = ${config.customer}`: sql``} 
           
           GROUP BY ms.item_num, ms.description, ms.fg_fresh_frozen, ms.fg_treatment, ms.brand, ms.size_name` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoUntagged = async config => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT 'FG OPEN ORDER UNTAGGED' AS column, ms.item_num AS l1_label, ms.description AS l2_label, ms.fg_fresh_frozen AS l3_label, ms.fg_treatment AS l4_label, ms.brand AS l5_label, ms.size_name AS l6_label, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
        AND sales_orders.untagged_weight > 0  
        ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
        ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
        ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``} 
        ${config.customer ? sql`AND sales_orders.customer_code = ${config.customer}`: sql``} 
      
      GROUP BY ms.item_num, ms.description, ms.fg_fresh_frozen, ms.fg_treatment, ms.brand, ms.size_name` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getSo = async config => {
  try {
    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await sql
           `SELECT 'FG OPEN ORDER' AS column, 'FG SALES' AS l1_label, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp 
           
           FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
           
           WHERE 
            ms.item_type = ${'FG'} 
            AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            AND ms.byproduct_type IS NULL  
            ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
            ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
            ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``} 
            ${config.customer ? sql`AND sales_orders.customer_code = ${config.customer}`: sql``}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoTagged = async config => {
  try {
    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT 'FG OPEN ORDER TAGGED' AS column, 'FG SALES' AS l1_label, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
        AND sales_orders.tagged_weight > 0  
        ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
        ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
        ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``} 
        ${config.customer ? sql`AND sales_orders.customer_code = ${config.customer}`: sql``}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoUntagged = async config => {
  try {
    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT 'FG OPEN ORDER UNTAGGED' AS column, 'FG SALES' AS l1_label, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
        AND sales_orders.untagged_weight > 0  
        ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
        ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
        ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``} 
        ${config.customer ? sql`AND sales_orders.customer_code = ${config.customer}`: sql``}` //prettier-ignore

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