const sql = require('../../../../../server')
/* *********************************************** level 1 *********************************************** */

const lvl_1_subtotal_getSo_byWk = async config => {
  try {
    console.log(`${config.user} - level 1: query postgres for FG Sales Orders By Week ...`)

    const response = await sql
         `SELECT so.week_serial || '_so' AS column, so.out_sales_rep AS l1_label, so.out_sales_rep_name AS l2_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
         
         FROM "salesReporting".sales_orders AS so 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = so.item_num 
            
        WHERE 
          ms.item_type = ${'FG'} 
          AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
          ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
          ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
          ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          AND ms.byproduct_type IS NULL 
          ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
          ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
          ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
          ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
        
        GROUP BY so.week_serial, so.out_sales_rep, so.out_sales_rep_name 
        
        ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getSo_byWk = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders By Week ...`)

    const response = await sql
           `SELECT so.week_serial || '_so' AS column, 'FG SALES' AS l1_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
           
           FROM "salesReporting".sales_orders AS so 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = so.item_num 
              
          WHERE 
            ms.item_type = ${'FG'} 
            AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            AND ms.byproduct_type IS NULL 
            ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
            ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
            ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
            ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
          
          GROUP BY so.week_serial 
          
          ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_1_subtotal_getSo_byWk = lvl_1_subtotal_getSo_byWk
module.exports.lvl_0_total_getSo_byWk = lvl_0_total_getSo_byWk
