// method of converting from standard report to item drillDown:
// Level 1:
// 1. replace: [something] AS l1_label, [something] AS l2_label, [something] AS l3_label with ms.item_num AS l1_label
// 2. add: WHERE ms.fg_fresh_frozen = filters[0] AND ms.fg_treatment = filters[1] AND ms.size_name = filters[2]
// 3. change GROUP BY to ms.item_num

// Level 2: delete
// Level 3: delete
// Total:
// 1. replace: [something] AS l1_label, [something] AS l2_label, [something] AS l3_label with ms.item_num AS l1_label
// 2. add: WHERE ms.fg_fresh_frozen = filters[0] AND ms.fg_treatment = filters[1] AND ms.size_name = filters[2]

/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const lvl_1_subtotal_getSalesByWk = async (start, end, program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres to get FG sales data by week ...`)

    const response = await pgClient.query(
      'SELECT sales_line_items.week_serial AS column, ms.item_num AS l1_label, ms.description AS l2_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.calc_gl_gross_sales),0) AS sales, COALESCE(SUM(sales_line_items.calc_gl_cogs),0) AS cogs, COALESCE(SUM(sales_line_items.calc_gl_othp),0) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND ms.fg_fresh_frozen = $5 AND ms.fg_treatment = $6 AND ms.size_name = $7 GROUP BY sales_line_items.week_serial, ms.item_num, ms.description ORDER BY sales_line_items.week_serial',
      [start, end, 'FG', program, filters[0], filters[1], filters[2]]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Species Group col total for period

const lvl_1_subtotal_getSalesPeriodToDate = async (start, end, program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres to get FG sales data period total ...`)

    const response = await pgClient.query(
      'SELECT \'TOTAL\' AS column, ms.item_num AS l1_label, ms.description AS l2_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.calc_gl_gross_sales),0) AS sales, COALESCE(SUM(sales_line_items.calc_gl_cogs),0) AS cogs, COALESCE(SUM(sales_line_items.calc_gl_othp),0) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND ms.fg_fresh_frozen = $5 AND ms.fg_treatment = $6 AND ms.size_name = $7 GROUP BY ms.item_num, ms.description',
      [start, end, 'FG', program, filters[0], filters[1], filters[2]]
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

const lvl_0_total_getSalesByWk = async (start, end, program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres to get FG sales data by week ...`)

    const response = await pgClient.query(
      'SELECT sales_line_items.week_serial AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.calc_gl_gross_sales),0) AS sales, COALESCE(SUM(sales_line_items.calc_gl_cogs),0) AS cogs, COALESCE(SUM(sales_line_items.calc_gl_othp),0) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND ms.fg_fresh_frozen = $5 AND ms.fg_treatment = $6 AND ms.size_name = $7 GROUP BY sales_line_items.week_serial ORDER BY sales_line_items.week_serial',
      [start, end, 'FG', program, filters[0], filters[1], filters[2]]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// All sales col total for a program

const lvl_0_total_getSalesPeriodToDate = async (start, end, program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres to get FG sales data period total ...`)

    const response = await pgClient.query(
      'SELECT \'TOTAL\' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.calc_gl_gross_sales),0) AS sales, COALESCE(SUM(sales_line_items.calc_gl_cogs),0) AS cogs, COALESCE(SUM(sales_line_items.calc_gl_othp),0) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.program = $4 AND ms.fg_fresh_frozen = $5 AND ms.fg_treatment = $6 AND ms.size_name = $7',
      [start, end, 'FG', program, filters[0], filters[1], filters[2]]
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
module.exports.lvl_1_subtotal_getSalesByWk = lvl_1_subtotal_getSalesByWk
module.exports.lvl_1_subtotal_getSalesPeriodToDate = lvl_1_subtotal_getSalesPeriodToDate
