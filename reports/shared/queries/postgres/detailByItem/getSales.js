/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const byItem_getSalesByWk_detail = async (filters, columnDataName, start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres to get FG sales data by week ...`)

    // STILL NEED so.rebate_lb, so.discount_lb, so.freight_lb, so.ext_comm, so.commission_lb, so.ext_rebate, so.ext_discount, so.ext_freight ************

    const response = await pgClient.query(
      `SELECT sl.net_sales_ext, sl.gross_margin_lb, sl.cost_lb, sl.net_sales_lb, sl.othp_lb, sl.gross_sales_lb, sl.location, sl.customer_code, sl.customer_name, sl.invoice_number, sl.line_number, sl.formatted_invoice_date, sl.week_serial, sl.item_number, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, sl.calc_gm_rept_weight, sl.gross_sales_ext, sl.othp_ext, sl.cogs_ext_gl, sl.gross_margin_ext
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE sl.formatted_invoice_date >= $1 AND sl.formatted_invoice_date <= $2 AND ms.item_num = $3 AND sl.week_serial = $4`,
      [start, end, filters[0], columnDataName]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Species Group col total for period

const byItem_getSalesPeriodToDate_detail = async (start, end, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres to get FG sales data period total ...`)

    const response = await pgClient.query(
      `SELECT sl.net_sales_ext, sl.gross_margin_lb, sl.cost_lb, sl.net_sales_lb, sl.othp_lb, sl.gross_sales_lb, sl.location, sl.customer_code, sl.customer_name, sl.invoice_number, sl.line_number, sl.formatted_invoice_date, sl.week_serial, sl.item_number, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, sl.calc_gm_rept_weight, sl.gross_sales_ext, sl.othp_ext, sl.cogs_ext_gl, sl.gross_margin_ext 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE sl.formatted_invoice_date >= $1 AND sl.formatted_invoice_date <= $2 AND ms.item_num = $3`,
      [start, end, filters[0]]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.byItem_getSalesByWk_detail = byItem_getSalesByWk_detail
module.exports.byItem_getSalesPeriodToDate_detail = byItem_getSalesPeriodToDate_detail
