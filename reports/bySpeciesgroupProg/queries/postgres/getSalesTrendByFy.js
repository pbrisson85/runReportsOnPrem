/* *********************************************** Level 1 *********************************************** */

// FG Species Group totals by week

const lvl_1_subtotal_getSalesByFy = async (start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres to get FG sales data by fiscal year ...`)

    const response = await pgClient.query(
      `SELECT sales_line_items.fiscal_year AS column, ms.species_group AS l1_label, \'SUBTOTAL\' AS l2_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 
      
      GROUP BY sales_line_items.fiscal_year, ms.species_group 
      
      ORDER BY sales_line_items.fiscal_year`,
      ['FG']
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSalesByFyYtd = async (start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres to get FG sales data by fiscal year ...`)

    const response = await pgClient.query(
      `SELECT sales_line_items.fiscal_year || '_ytd' AS column, ms.species_group AS l1_label, \'SUBTOTAL\' AS l2_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2
      
      GROUP BY sales_line_items.fiscal_year, ms.species_group 
      
      ORDER BY sales_line_items.fiscal_year`,
      [start, end, 'FG']
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Levle 2 *********************************************** */

const lvl_2_subtotal_getSalesByFy = async (start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres to get FG sales data by fiscal year ...`)

    const response = await pgClient.query(
      `SELECT sales_line_items.fiscal_year AS column, ms.species_group AS l1_label, ms.program AS l2_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 
      
      GROUP BY sales_line_items.fiscal_year, ms.species_group, ms.program 
      
      ORDER BY sales_line_items.fiscal_year`,
      ['FG']
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getSalesByFyYtd = async (start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres to get FG sales data by fiscal year ...`)

    const response = await pgClient.query(
      `SELECT sales_line_items.fiscal_year || '_ytd' AS column, ms.species_group AS l1_label, ms.program AS l2_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 
      
      GROUP BY sales_line_items.fiscal_year, ms.species_group, ms.program 
      
      ORDER BY sales_line_items.fiscal_year`,
      [start, end, 'FG']
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Total *********************************************** */

const lvl_0_total_getSalesByFy = async (start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres to get FG sales data by fiscal year ...`)

    const response = await pgClient.query(
      `SELECT sales_line_items.fiscal_year AS column, \'FG SALES\' AS l1_label, \'TOTAL\' AS l2_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 
      
      GROUP BY sales_line_items.fiscal_year 
      
      ORDER BY sales_line_items.fiscal_year`,
      ['FG']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSalesByFyYtd = async (start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres to get FG sales data by fiscal year ...`)

    const response = await pgClient.query(
      `SELECT sales_line_items.fiscal_year || '_ytd' AS column, \'FG SALES\' AS l1_label, \'TOTAL\' AS l2_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = $3 AND sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 
      
      GROUP BY sales_line_items.fiscal_year 
      
      ORDER BY sales_line_items.fiscal_year`,
      [start, end, 'FG']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_0_total_getSalesByFy = lvl_0_total_getSalesByFy
module.exports.lvl_2_subtotal_getSalesByFy = lvl_2_subtotal_getSalesByFy
module.exports.lvl_1_subtotal_getSalesByFy = lvl_1_subtotal_getSalesByFy
module.exports.lvl_0_total_getSalesByFyYtd = lvl_0_total_getSalesByFyYtd
module.exports.lvl_2_subtotal_getSalesByFyYtd = lvl_2_subtotal_getSalesByFyYtd
module.exports.lvl_1_subtotal_getSalesByFyYtd = lvl_1_subtotal_getSalesByFyYtd
