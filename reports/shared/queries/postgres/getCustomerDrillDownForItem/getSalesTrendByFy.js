const sql = require('../../../../../server')

/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const lvl_1_subtotal_getSalesByFy = async item => {
  try {
    console.log(`level 1: query postgres to get FG sales data by week ...`)

    const response =
      await sql
      `SELECT sl.fiscal_year AS column, sl.customer_code AS l1_label, sl.customer_name AS l2_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_num = ${item} 
      
      GROUP BY sl.fiscal_year, sl.customer_code, sl.customer_name
      
      ORDER BY sl.fiscal_year` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Totals *********************************************** */

// All sales row totals by week for a program

const lvl_0_total_getSalesByFy = async item => {
  try {
    console.log(`level 0: query postgres to get FG sales data by week ...`)

    const response =
      await sql
      `SELECT sl.fiscal_year AS column, 'FG SALES' AS l1_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_num = ${item} 
      
      GROUP BY sl.fiscal_year 
      
      ORDER BY sl.fiscal_year` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_0_total_getSalesByFy = lvl_0_total_getSalesByFy
module.exports.lvl_1_subtotal_getSalesByFy = lvl_1_subtotal_getSalesByFy
