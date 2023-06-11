/* *********************************************** Level 1 *********************************************** */

// FG Species Group totals by week

const lvl_1_subtotal_getSalesByWk = async (start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get FG sales data ...`)

    const response = await pgClient.query(
      'SELECT sales_line_items.week_serial AS column, master_supplement.species_group AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 GROUP BY sales_line_items.week_serial, master_supplement.species_group ORDER BY sales_line_items.week_serial',
      [start, end, 'FG']
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Species Group col total for period

const lvl_1_subtotal_getSalesPeriodToDate = async (start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get FG sales data ...`)

    const response = await pgClient.query(
      'SELECT \'TOTAL\' AS column, master_supplement.species_group AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 GROUP BY master_supplement.species_group',
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

const lvl_2_subtotal_getSalesByWk = async (start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get FG sales data ...`)

    const response = await pgClient.query(
      'SELECT sales_line_items.week_serial AS column, master_supplement.species_group AS l1_subtotal, master_supplement.program AS l2_subtotal, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 GROUP BY sales_line_items.week_serial, master_supplement.species_group, master_supplement.program ORDER BY sales_line_items.week_serial',
      [start, end, 'FG']
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Program col total for period

const lvl_2_subtotal_getSalesPeriodToDate = async (start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get FG sales data ...`)

    const response = await pgClient.query(
      'SELECT \'TOTAL\' AS column, master_supplement.species_group AS l1_subtotal, master_supplement.program AS l2_subtotal, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 GROUP BY master_supplement.species_group, master_supplement.program',
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

const dataTotal_getSalesByWk = async (start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get FG sales data ...`)

    const response = await pgClient.query(
      'SELECT sales_line_items.week_serial AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3 GROUP BY sales_line_items.week_serial ORDER BY sales_line_items.week_serial',
      [start, end, 'FG']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const dataTotal_getSalesPeriodToDate = async (start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get FG sales data ...`)

    const response = await pgClient.query(
      'SELECT \'TOTAL\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $3',
      [start, end, 'FG']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.dataTotal_getSalesByWk = dataTotal_getSalesByWk
module.exports.dataTotal_getSalesPeriodToDate = dataTotal_getSalesPeriodToDate
module.exports.lvl_2_subtotal_getSalesByWk = lvl_2_subtotal_getSalesByWk
module.exports.lvl_2_subtotal_getSalesPeriodToDate = lvl_2_subtotal_getSalesPeriodToDate
module.exports.lvl_1_subtotal_getSalesByWk = lvl_1_subtotal_getSalesByWk
module.exports.lvl_1_subtotal_getSalesPeriodToDate = lvl_1_subtotal_getSalesPeriodToDate
