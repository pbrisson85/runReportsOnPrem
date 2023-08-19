const sql = require('../../../../../server')

/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group col total for period

const lvl_1_subtotal_getSales_detail = async (config, start, end, program, filters, year) => {
  try {
    console.log(`level 1: query postgres to get FG sales data period total ...`)

    const response = await sql
      `SELECT sl.net_sales_ext, sl.gross_margin_lb, sl.cost_lb, sl.net_sales_lb, sl.othp_lb, sl.gross_sales_lb, sl.location, sl.customer_code, sl.customer_name, sl.invoice_number, sl.line_number, sl.formatted_invoice_date, sl.week_serial, sl.item_number, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, sl.calc_gm_rept_weight, sl.gross_sales_ext, sl.othp_ext, sl.cogs_ext_gl, sl.gross_margin_ext 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE sl.week >= ${start} AND sl.week <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} ${program ? sql`AND ms.program = ${program}`: sql``} AND ${sql(config.l1_field)} =  ${filters[0]} AND sl.customer_code = ${filters[3]} AND sl.fiscal_year = ${year}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 Group *********************************************** */

// FG Program col total for period

const lvl_2_subtotal_getSales_detail = async (config, start, end, program, filters, year) => {
  try {
    console.log(`level 2: query postgres to get FG sales data period total ...`)

    console.log('config', config)
    console.log('start', start)
    console.log('end', end)
    console.log('program', program)
    console.log('filters', filters)
    console.log('year', year)

    const response = await sql
      `SELECT sl.net_sales_ext, sl.gross_margin_lb, sl.cost_lb, sl.net_sales_lb, sl.othp_lb, sl.gross_sales_lb, sl.location, sl.customer_code, sl.customer_name, sl.invoice_number, sl.line_number, sl.formatted_invoice_date, sl.week_serial, sl.item_number, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, sl.calc_gm_rept_weight, sl.gross_sales_ext, sl.othp_ext, sl.cogs_ext_gl, sl.gross_margin_ext 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE sl.week >= ${start} AND sl.week <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} ${program ? sql`AND ms.program = ${program}`: sql``} AND ${sql(config.l1_field)} =  ${filters[0]} AND ${sql(config.l2_field)} =  ${filters[1]} AND sl.customer_code = ${filters[3]} AND sl.fiscal_year = ${year}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 Group *********************************************** */

// FG Program col total for period

const lvl_3_subtotal_getSales_detail = async (config, start, end, program, filters, year) => {
  try {
    console.log(`level 3: query postgres to get FG sales data period total ...`)

    const response = await sql
      `SELECT sl.net_sales_ext, sl.gross_margin_lb, sl.cost_lb, sl.net_sales_lb, sl.othp_lb, sl.gross_sales_lb, sl.location, sl.customer_code, sl.customer_name, sl.invoice_number, sl.line_number, sl.formatted_invoice_date, sl.week_serial, sl.item_number, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, sl.calc_gm_rept_weight, sl.gross_sales_ext, sl.othp_ext, sl.cogs_ext_gl, sl.gross_margin_ext 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE sl.week >= ${start} AND sl.week <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} ${program ? sql`AND ms.program = ${program}`: sql``} AND ${sql(config.l1_field)} =  ${filters[0]} AND ${sql(config.l2_field)} =  ${filters[1]} AND ${sql(config.l1_field)} =  ${filters[2]} AND sl.customer_code = ${filters[3]} AND sl.fiscal_year = ${year}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Totals *********************************************** */

// All sales col total for a program

const lvl_0_total_getSales_detail = async (config, start, end, program, filters, year) => {
  try {
    console.log(`level 0: query postgres to get FG sales data period total ...`)

    const response = await sql
      `SELECT sl.net_sales_ext, sl.gross_margin_lb, sl.cost_lb, sl.net_sales_lb, sl.othp_lb, sl.gross_sales_lb, sl.location, sl.customer_code, sl.customer_name, sl.invoice_number, sl.line_number, sl.formatted_invoice_date, sl.week_serial, sl.item_number, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, sl.calc_gm_rept_weight, sl.gross_sales_ext, sl.othp_ext, sl.cogs_ext_gl, sl.gross_margin_ext
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE sl.week >= ${start} AND sl.week <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} ${program ? sql`AND ms.program = ${program}`: sql``} AND sl.customer_code = ${filters[3]} AND sl.fiscal_year = ${year}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_0_total_getSales_detail = lvl_0_total_getSales_detail
module.exports.lvl_2_subtotal_getSales_detail = lvl_2_subtotal_getSales_detail
module.exports.lvl_1_subtotal_getSales_detail = lvl_1_subtotal_getSales_detail
module.exports.lvl_3_subtotal_getSales_detail = lvl_3_subtotal_getSales_detail
