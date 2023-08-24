const sql = require('../../../../../server')

/* *********************************************** level 1 *********************************************** */

const lvl_1_subtotal_getSo_byWk = async item => {
  try {
    console.log(`level 1: query postgres for FG Sales Orders By Week ...`)

    const response =
      await sql`SELECT so.week_serial || '_so' AS column, so.customer_code AS l1_label, so.customer_name AS l2_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
         
         FROM "salesReporting".sales_orders AS so 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = so.item_num 
            
        WHERE ms.item_num = ${item} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.byproduct_type IS NULL 
        
        GROUP BY so.week_serial, so.customer_code, so.customer_name 
        
        ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getSo_byWk = async item => {
  try {
    console.log(`level 0: query postgres for FG Sales Orders By Week ...`)

    const response =
      await sql`SELECT so.week_serial || '_so' AS column, 'FG SALES' AS l1_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
           
           FROM "salesReporting".sales_orders AS so 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = so.item_num 
              
          WHERE ms.item_num = ${item} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.byproduct_type IS NULL 
          
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
