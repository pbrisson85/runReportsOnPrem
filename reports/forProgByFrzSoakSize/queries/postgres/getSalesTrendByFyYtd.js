/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const lvl_1_subtotal_getSalesByFyYtd = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres to get FG sales data by week for week ${start} through week ${end} ...`)

    const response = await pgClient.query(
      `SELECT sales_line_items.fiscal_year || '_ytd' AS column, ms.fg_fresh_frozen AS l1_label, \'SUBTOTAL\' AS l2_label, \'SUBTOTAL\' AS l3_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND sales_line_items.week >= $1 AND sales_line_items.week <= $2 
      
      GROUP BY sales_line_items.fiscal_year, ms.fg_fresh_frozen 
      
      ORDER BY sales_line_items.fiscal_year`,
      [start, end, 'FG', program]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 Group *********************************************** */

// FG Program row totals by week

const lvl_2_subtotal_getSalesByFyYtd = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres to get FG sales data by week for week ${start} through week ${end} ...`)

    const response = await pgClient.query(
      `SELECT sales_line_items.fiscal_year || '_ytd' AS column, ms.fg_fresh_frozen AS l1_label, ms.brand AS l2_label, \'SUBTOTAL\' AS l3_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND sales_line_items.week >= $1 AND sales_line_items.week <= $2 
      
      GROUP BY sales_line_items.fiscal_year, ms.fg_fresh_frozen, ms.brand 
      
      ORDER BY sales_line_items.fiscal_year`,
      [ start, end,'FG', program]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 Group *********************************************** */

// FG Program row totals by week

const lvl_3_subtotal_getSalesByFyYtd = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres to get FG sales data by week for week ${start} through week ${end} ...`)

    const response = await pgClient.query(
      `SELECT sales_line_items.fiscal_year || '_ytd' AS column, ms.fg_fresh_frozen AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND sales_line_items.week >= $1 AND sales_line_items.week <= $2 
      
      GROUP BY sales_line_items.fiscal_year, ms.fg_fresh_frozen, ms.brand, ms.size_name 
      
      ORDER BY sales_line_items.fiscal_year`,
      [start, end,'FG', program]
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

const lvl_0_total_getSalesByFyYtd = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres to get FG sales data by week for week ${start} through week ${end} ...`)

    const response = await pgClient.query(
      `SELECT sales_line_items.fiscal_year || '_ytd' AS column, \'FG SALES\' AS l1_label, \'TOTAL\' AS l2_label, \'TOTAL\' AS l3_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND sales_line_items.week >= $1 AND sales_line_items.week <= $2 
      
      GROUP BY sales_line_items.fiscal_year 
      
      ORDER BY sales_line_items.fiscal_year`,
      [start, end,'FG', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_0_total_getSalesByFyYtd = lvl_0_total_getSalesByFyYtd
module.exports.lvl_2_subtotal_getSalesByFyYtd = lvl_2_subtotal_getSalesByFyYtd
module.exports.lvl_1_subtotal_getSalesByFyYtd = lvl_1_subtotal_getSalesByFyYtd
module.exports.lvl_3_subtotal_getSalesByFyYtd = lvl_3_subtotal_getSalesByFyYtd
