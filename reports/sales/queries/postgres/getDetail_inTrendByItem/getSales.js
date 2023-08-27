const sql = require('../../../../../server')

const byItem_getSales_detail = async (start, end, filters, year) => {
  try {
    console.log(
      `detail query postgres to get FG sales data period total for item ${item} startting week ${start} thru week ${end} for year: ${year}  ...`
    )

    const response =
      await sql
      `SELECT sl.net_sales_ext, sl.gross_margin_lb, sl.cost_lb, sl.net_sales_lb, sl.othp_lb, sl.gross_sales_lb, sl.location, sl.customer_code, sl.customer_name, sl.invoice_number, sl.line_number, sl.formatted_invoice_date, sl.week_serial, sl.item_number, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, sl.calc_gm_rept_weight, sl.gross_sales_ext, sl.othp_ext, sl.cogs_ext_gl, sl.gross_margin_ext 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE sl.week >= ${start} AND sl.week <= ${end} AND ms.item_num = ${filters[0]} AND sl.fiscal_year = ${year}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.byItem_getSales_detail = byItem_getSales_detail
