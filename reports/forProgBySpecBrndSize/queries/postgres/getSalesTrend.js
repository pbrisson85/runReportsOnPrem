/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const lvl_1_subtotal_getSalesByWk = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres to get FG sales data by week ...`)

    const response = await pgClient.query(
      'SELECT sales_line_items.week_serial AS column, ms.species AS l1_label, \'SUBTOTAL\' AS l2_label, \'SUBTOTAL\' AS l3_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.calc_gl_gross_sales),0) AS sales, COALESCE(SUM(sales_line_items.calc_gl_cogs),0) AS cogs, COALESCE(SUM(sales_line_items.calc_gl_othp),0) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 GROUP BY sales_line_items.week_serial, ms.species ORDER BY sales_line_items.week_serial',
      [start, end, 'FG', program]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Species Group col total for period

const lvl_1_subtotal_getSalesPeriodToDate = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres to get FG sales data period total ...`)

    const response = await pgClient.query(
      'SELECT \'SALES TOTAL\' AS column, ms.species AS l1_label, \'SUBTOTAL\' AS l2_label, \'SUBTOTAL\' AS l3_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.calc_gl_gross_sales),0) AS sales, COALESCE(SUM(sales_line_items.calc_gl_cogs),0) AS cogs, COALESCE(SUM(sales_line_items.calc_gl_othp),0) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 GROUP BY ms.species',
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

const lvl_2_subtotal_getSalesByWk = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres to get FG sales data by week ...`)

    const response = await pgClient.query(
      'SELECT sales_line_items.week_serial AS column, ms.species AS l1_label, ms.brand AS l2_label, \'SUBTOTAL\' AS l3_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.calc_gl_gross_sales),0) AS sales, COALESCE(SUM(sales_line_items.calc_gl_cogs),0) AS cogs, COALESCE(SUM(sales_line_items.calc_gl_othp),0) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 GROUP BY sales_line_items.week_serial, ms.species, ms.brand ORDER BY sales_line_items.week_serial',
      [start, end, 'FG', program]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Program col total for period

const lvl_2_subtotal_getSalesPeriodToDate = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres to get FG sales data period total ...`)

    const response = await pgClient.query(
      'SELECT \'SALES TOTAL\' AS column, ms.species AS l1_label, ms.brand AS l2_label, \'SUBTOTAL\' AS l3_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.calc_gl_gross_sales),0) AS sales, COALESCE(SUM(sales_line_items.calc_gl_cogs),0) AS cogs, COALESCE(SUM(sales_line_items.calc_gl_othp),0) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 GROUP BY ms.species, ms.brand',
      [start, end, 'FG', program]
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

const lvl_3_subtotal_getSalesByWk = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres to get FG sales data by week ...`)

    const response = await pgClient.query(
      'SELECT sales_line_items.week_serial AS column, ms.species AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.calc_gl_gross_sales),0) AS sales, COALESCE(SUM(sales_line_items.calc_gl_cogs),0) AS cogs, COALESCE(SUM(sales_line_items.calc_gl_othp),0) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 GROUP BY sales_line_items.week_serial, ms.species, ms.brand, ms.size_name ORDER BY sales_line_items.week_serial',
      [start, end, 'FG', program]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Program col total for period

const lvl_3_subtotal_getSalesPeriodToDate = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres to get FG sales data period total ...`)

    const response = await pgClient.query(
      'SELECT \'SALES TOTAL\' AS column, ms.species AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.calc_gl_gross_sales),0) AS sales, COALESCE(SUM(sales_line_items.calc_gl_cogs),0) AS cogs, COALESCE(SUM(sales_line_items.calc_gl_othp),0) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 GROUP BY ms.species, ms.brand, ms.size_name',
      [start, end, 'FG', program]
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

const lvl_0_total_getSalesByWk = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres to get FG sales data by week ...`)

    const response = await pgClient.query(
      'SELECT sales_line_items.week_serial AS column, \'FG SALES\' AS l1_label, \'TOTAL\' AS l2_label, \'TOTAL\' AS l3_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.calc_gl_gross_sales),0) AS sales, COALESCE(SUM(sales_line_items.calc_gl_cogs),0) AS cogs, COALESCE(SUM(sales_line_items.calc_gl_othp),0) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 GROUP BY sales_line_items.week_serial ORDER BY sales_line_items.week_serial',
      [start, end, 'FG', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// All sales col total for a program

const lvl_0_total_getSalesPeriodToDate = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres to get FG sales data period total ...`)

    const response = await pgClient.query(
      'SELECT \'SALES TOTAL\' AS column, \'FG SALES\' AS l1_label, \'TOTAL\' AS l2_label, \'TOTAL\' AS l3_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.calc_gl_gross_sales),0) AS sales, COALESCE(SUM(sales_line_items.calc_gl_cogs),0) AS cogs, COALESCE(SUM(sales_line_items.calc_gl_othp),0) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4',
      [start, end, 'FG', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_0_total_getSalesByWk = lvl_0_total_getSalesByWk
module.exports.lvl_0_total_getSalesPeriodToDate = lvl_0_total_getSalesPeriodToDate
module.exports.lvl_2_subtotal_getSalesByWk = lvl_2_subtotal_getSalesByWk
module.exports.lvl_2_subtotal_getSalesPeriodToDate = lvl_2_subtotal_getSalesPeriodToDate
module.exports.lvl_1_subtotal_getSalesByWk = lvl_1_subtotal_getSalesByWk
module.exports.lvl_1_subtotal_getSalesPeriodToDate = lvl_1_subtotal_getSalesPeriodToDate
module.exports.lvl_3_subtotal_getSalesByWk = lvl_3_subtotal_getSalesByWk
module.exports.lvl_3_subtotal_getSalesPeriodToDate = lvl_3_subtotal_getSalesPeriodToDate
