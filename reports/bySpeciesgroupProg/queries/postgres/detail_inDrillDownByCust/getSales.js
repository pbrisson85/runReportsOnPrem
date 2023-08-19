/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group col total for period

const lvl_1_subtotal_getSales_detail = async (startWeek, endWeek, program, filters, year) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres to get FG sales data period total ...`)

    console.log('startWeek: ', startWeek)
    console.log('endWeek: ', endWeek)
    console.log('program: ', program)
    console.log('filters: ', filters)
    console.log('year: ', year)

    const response = await pgClient.query(
      `SELECT sl.net_sales_ext, sl.gross_margin_lb, sl.cost_lb, sl.net_sales_lb, sl.othp_lb, sl.gross_sales_lb, sl.location, sl.customer_code, sl.customer_name, sl.invoice_number, sl.line_number, sl.formatted_invoice_date, sl.week_serial, sl.item_number, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, sl.calc_gm_rept_weight, sl.gross_sales_ext, sl.othp_ext, sl.cogs_ext_gl, sl.gross_margin_ext 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE sl.week >= $1 AND sl.week <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.species_group = $4 AND sl.customer_code = $5 AND sl.fiscal_year = $6`,
      [startWeek, endWeek, 'FG', filters[0], filters[3], year]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 Group *********************************************** */

// FG Program col total for period

const lvl_2_subtotal_getSales_detail = async (startWeek, endWeek, program, filters, year) => {
  console.log('startWeek: ', startWeek)
  console.log('endWeek: ', endWeek)
  console.log('program: ', program)
  console.log('filters: ', filters)
  console.log('year: ', year)

  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres to get FG sales data period total ...`)

    const response = await pgClient.query(
      `SELECT sl.net_sales_ext, sl.gross_margin_lb, sl.cost_lb, sl.net_sales_lb, sl.othp_lb, sl.gross_sales_lb, sl.location, sl.customer_code, sl.customer_name, sl.invoice_number, sl.line_number, sl.formatted_invoice_date, sl.week_serial, sl.item_number, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, sl.calc_gm_rept_weight, sl.gross_sales_ext, sl.othp_ext, sl.cogs_ext_gl, sl.gross_margin_ext 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE sl.week >= $1 AND sl.week <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.species_group = $4 AND ms.program = $5 AND sl.customer_code = $6 AND sl.fiscal_year = $7`,
      [startWeek, endWeek, 'FG', filters[0], filters[1], filters[3], year]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Totals *********************************************** */

// All sales col total for a program

const lvl_0_total_getSales_detail = async (startWeek, endWeek, program, filters, year) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres to get FG sales data period total ...`)

    const response = await pgClient.query(
      `SELECT sl.net_sales_ext, sl.gross_margin_lb, sl.cost_lb, sl.net_sales_lb, sl.othp_lb, sl.gross_sales_lb, sl.location, sl.customer_code, sl.customer_name, sl.invoice_number, sl.line_number, sl.formatted_invoice_date, sl.week_serial, sl.item_number, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, sl.calc_gm_rept_weight, sl.gross_sales_ext, sl.othp_ext, sl.cogs_ext_gl, sl.gross_margin_ext
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE sl.week >= $1 AND sl.week <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND sl.customer_code = $4 AND sl.fiscal_year = $5`,
      [startWeek, endWeek, 'FG', filters[3], year]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_0_total_getSales_detail = lvl_0_total_getSales_detail
module.exports.lvl_2_subtotal_getSales_detail = lvl_2_subtotal_getSales_detail
module.exports.lvl_1_subtotal_getSales_detail = lvl_1_subtotal_getSales_detail
