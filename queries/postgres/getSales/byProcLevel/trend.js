/* *********************************************** ALL PROGRAM SALES *********************************************** */

// All sales row totals by week for a program

const getWklySalesByProg = async (program, start, end) => {
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

const getWklySalesByProgTotalCol = async (program, start, end) => {
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

const getWklyBpByType = async (program, start, end) => {
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

const getWklyBpByTypeTotalCol = async (program, start, end) => {
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

const getWklySalesByItemTypeBp = async (program, start, end) => {
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

const getWklySalesByItemTypeBpTotalCol = async (program, start, end) => {
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

const getWklySalesByItemTypeWithoutBp = async (program, start, end) => {
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

const getWklySalesByItemTypeWithoutBpTotalCol = async (program, start, end) => {
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

const getWklySalesByProcLevel = async (program, start, end) => {
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

const getWklySalesByProcLevelTotalCol = async (program, start, end) => {
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

module.exports.getWklySalesByProg = getWklySalesByProg
module.exports.getWklySalesByProgTotalCol = getWklySalesByProgTotalCol
module.exports.getWklyBpByType = getWklyBpByType
module.exports.getWklyBpByTypeTotalCol = getWklyBpByTypeTotalCol
module.exports.getWklySalesByItemTypeWithoutBp = getWklySalesByItemTypeWithoutBp
module.exports.getWklySalesByItemTypeBp = getWklySalesByItemTypeBp
module.exports.getWklySalesByItemTypeWithoutBpTotalCol = getWklySalesByItemTypeWithoutBpTotalCol
module.exports.getWklySalesByItemTypeBpTotalCol = getWklySalesByItemTypeBpTotalCol
module.exports.getWklySalesByProcLevel = getWklySalesByProcLevel
module.exports.getWklySalesByProcLevelTotalCol = getWklySalesByProcLevelTotalCol
