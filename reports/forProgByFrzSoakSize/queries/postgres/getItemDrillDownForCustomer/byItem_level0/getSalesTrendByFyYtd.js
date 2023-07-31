/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const lvl_1_subtotal_getSalesByFyYtd = async (start, end, program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres to get FG sales data by week ...`)

    const response = await pgClient.query(
      `SELECT sl.fiscal_year || '_ytd' AS column, ms.item_num AS l1_label, ms.description AS l2_label, ms.fg_fresh_frozen AS l3_label, ms.fg_treatment AS l4_label , ms.size_name AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND sl.customer_code = $5 AND sl.week >= $1 AND sl.week <= $2
      
      GROUP BY sl.fiscal_year, ms.item_num, ms.description, ms.fg_fresh_frozen, ms.fg_treatment, ms.size_name 
      
      ORDER BY sl.fiscal_year`,
      [ start, end, 'FG', program, filters[3]]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Totals *********************************************** */

// All sales row totals by week for a program

const lvl_0_total_getSalesByFyYtd = async (start, end, program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres to get FG sales data by week ...`)

    const response = await pgClient.query(
      `SELECT sl.fiscal_year || '_ytd' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND sl.customer_code = $5 AND sl.week >= $1 AND sl.week <= $2
      
      GROUP BY sl.fiscal_year 
      
      ORDER BY sl.fiscal_year`,
      [ start, end, 'FG', program, filters[3]]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_0_total_getSalesByFyYtd = lvl_0_total_getSalesByFyYtd
module.exports.lvl_1_subtotal_getSalesByFyYtd = lvl_1_subtotal_getSalesByFyYtd
