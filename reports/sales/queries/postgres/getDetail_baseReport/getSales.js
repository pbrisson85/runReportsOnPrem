const sql = require('../../../../../server')

// FG Program col total for period

const getSales_detail = async (config, start, end, program, filters, year, level) => {
  try {
    console.log(`level 3: query postgres to get FG sales data period total ...`)

    const response = await sql
      `SELECT sl.net_sales_ext, sl.gross_margin_lb, sl.cost_lb, sl.net_sales_lb, sl.othp_lb, sl.gross_sales_lb, sl.location, sl.customer_code, sl.customer_name, sl.invoice_number, sl.line_number, sl.formatted_invoice_date, sl.week_serial, sl.item_number, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, sl.calc_gm_rept_weight, sl.gross_sales_ext, sl.othp_ext, sl.cogs_ext_gl, sl.gross_margin_ext 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE sl.week >= ${start} AND sl.week <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} ${level > 0 ? sql`AND ${sql(config.l1_field)} = ${filters[0]}` : sql``} ${level > 1 ? sql`AND ${sql(config.l2_field)} = ${filters[1]}` : sql``} ${level > 2 ? sql`AND ${sql(config.l3_field)} = ${filters[2]}` : sql``} AND sl.fiscal_year = ${year}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getSales_detail = getSales_detail
