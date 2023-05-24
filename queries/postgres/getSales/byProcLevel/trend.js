/* *********************************************** ALL PROGRAM SALES *********************************************** */

// All sales row totals by week for a program

const getAllSalesRowTotals = async (program, start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses for ${program} ...`)

    const response = await pgClient.query(
      'SELECT sales_line_items.week_serial AS column, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp, \'total\' AS min_row, $1 AS maj_row FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE master_supplement.program = $1 AND sales_line_items.formatted_invoice_date >= $2 AND sales_line_items.formatted_invoice_date <= $3 GROUP BY sales_line_items.week_serial, maj_row ORDER BY sales_line_items.week_serial',
      [program, start, end]
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// All sales col total for a program

const getAllSalesColTotals = async (program, start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses for ${program} ...`)

    const response = await pgClient.query(
      'SELECT \'TOTAL\' AS column, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp, \'total\' AS min_row, $1 AS maj_row FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE master_supplement.program = $1 AND sales_line_items.formatted_invoice_date >= $2 AND sales_line_items.formatted_invoice_date <= $3 GROUP BY maj_row',
      [program, start, end]
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** BY PRODUCT PROGRAM SALES *********************************************** */

// By product detail rows by week for a program

const getByProdDetRows = async (program, start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses for ${program} ...`)

    const response = await pgClient.query(
      'SELECT sales_line_items.week_serial AS column, \'BP\' AS maj_row, master_supplement.byproduct_type AS min_row, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE master_supplement.item_type = $1 AND master_supplement.program = $2 AND sales_line_items.formatted_invoice_date >= $3 AND sales_line_items.formatted_invoice_date <= $4 AND master_supplement.byproduct_type IS NOT NULL GROUP BY sales_line_items.week_serial, master_supplement.byproduct_type ORDER BY sales_line_items.week_serial, master_supplement.byproduct_type',
      ['FG', program, start, end]
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// By product detail col totals for a program

const getByProdDetColTotals = async (program, start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses for ${program} ...`)

    const response = await pgClient.query(
      'SELECT \'TOTAL\' AS column, \'BP\' AS maj_row, master_supplement.byproduct_type AS min_row, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE master_supplement.item_type = $1 AND master_supplement.program = $2 AND sales_line_items.formatted_invoice_date >= $3 AND sales_line_items.formatted_invoice_date <= $4 AND master_supplement.byproduct_type IS NOT NULL GROUP BY master_supplement.byproduct_type ORDER BY master_supplement.byproduct_type',
      ['FG', program, start, end]
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// By Product Row totals by week

const getByProdTotRow = async (program, start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses for ${program} ...`)

    const response = await pgClient.query(
          'SELECT sales_line_items.week_serial AS column, \'BP\' AS maj_row, \'subtotal\' AS min_row, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE master_supplement.program = $1 AND sales_line_items.formatted_invoice_date >= $2 AND sales_line_items.formatted_invoice_date <= $3 AND master_supplement.byproduct_type IS NOT NULL GROUP BY sales_line_items.week_serial, master_supplement.item_type ORDER BY sales_line_items.week_serial, master_supplement.item_type',
          [program, start, end]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// By Product Col total for period

const getByProdColTotal = async (program, start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses for ${program} ...`)

    const response = await pgClient.query(
          'SELECT \'TOTAL\' AS column, \'BP\' AS maj_row, \'subtotal\' AS min_row, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE master_supplement.program = $1 AND sales_line_items.formatted_invoice_date >= $2 AND sales_line_items.formatted_invoice_date <= $3 AND master_supplement.byproduct_type IS NOT NULL GROUP BY master_supplement.item_type ORDER BY master_supplement.item_type',
          [program, start, end]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** FG & WIP PROGRAM SALES *********************************************** */

// FG & WIP row totals by week

const getFgWipRmTotalsRow = async (program, start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses for ${program} ...`)

    const response = await pgClient.query(
        'SELECT sales_line_items.week_serial AS column, master_supplement.item_type AS maj_row, \'subtotal\' AS min_row, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE master_supplement.program = $1 AND sales_line_items.formatted_invoice_date >= $2 AND sales_line_items.formatted_invoice_date <= $3 AND master_supplement.byproduct_type IS NULL GROUP BY sales_line_items.week_serial, master_supplement.item_type ORDER BY sales_line_items.week_serial, master_supplement.item_type',
        [program, start, end]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG & WIP col total for period

const getFgWipRmTotalsCol = async (program, start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses for ${program} ...`)

    const response = await pgClient.query(
        'SELECT \'TOTAL\' AS column, master_supplement.item_type AS maj_row, \'subtotal\' AS min_row, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE master_supplement.program = $1 AND sales_line_items.formatted_invoice_date >= $2 AND sales_line_items.formatted_invoice_date <= $3 AND master_supplement.byproduct_type IS NULL GROUP BY master_supplement.item_type ORDER BY master_supplement.item_type',
        [program, start, end]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG detail rows by week for a program

const getFgWipRmDetRows = async (program, start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses for ${program} ...`)

    const response = await pgClient.query(
      'SELECT sales_line_items.week_serial AS column, \'FG\' AS maj_row, master_supplement.fg_treatment AS min_row, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE master_supplement.item_type = $1 AND master_supplement.program = $2 AND sales_line_items.formatted_invoice_date >= $3 AND sales_line_items.formatted_invoice_date <= $4 AND master_supplement.byproduct_type IS NULL GROUP BY sales_line_items.week_serial, master_supplement.fg_treatment ORDER BY sales_line_items.week_serial, master_supplement.fg_treatment',
      ['FG', program, start, end]
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG detail col total for period

const getFgWipRmDetColTotal = async (program, start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses for ${program} ...`)

    const response = await pgClient.query(
      'SELECT \'TOTAL\' AS column, \'FG\' AS maj_row, master_supplement.fg_treatment AS min_row, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE master_supplement.item_type = $1 AND master_supplement.program = $2 AND sales_line_items.formatted_invoice_date >= $3 AND sales_line_items.formatted_invoice_date <= $4 AND master_supplement.byproduct_type IS NULL GROUP BY master_supplement.fg_treatment ORDER BY master_supplement.fg_treatment',
      ['FG', program, start, end]
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getAllSalesRowTotals = getAllSalesRowTotals
module.exports.getAllSalesColTotals = getAllSalesColTotals
module.exports.getByProdDetRows = getByProdDetRows
module.exports.getByProdDetColTotals = getByProdDetColTotals
module.exports.getFgWipRmTotalsRow = getFgWipRmTotalsRow
module.exports.getByProdTotRow = getByProdTotRow
module.exports.getFgWipRmTotalsCol = getFgWipRmTotalsCol
module.exports.getByProdColTotal = getByProdColTotal
module.exports.getFgWipRmDetRows = getFgWipRmDetRows
module.exports.getFgWipRmDetColTotal = getFgWipRmDetColTotal
