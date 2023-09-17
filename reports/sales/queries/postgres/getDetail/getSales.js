const sql = require('../../../../../server')

// FG Program col total for period

const getSales_detail = async (config, start, end, year) => {
  try {
    console.log(`${config.user} - level ${config.queryLevel}: query postgres to get FG sales data period total ...`)

    const response = await sql
      `SELECT sl.net_sales_ext, sl.gross_margin_lb, sl.cost_lb, sl.net_sales_lb, sl.othp_lb, sl.gross_sales_lb, sl.location, sl.customer_code, sl.customer_name, sl.invoice_number, sl.line_number, sl.formatted_invoice_date, sl.week_serial, sl.item_number, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, sl.calc_gm_rept_weight, sl.gross_sales_ext, sl.othp_ext, sl.cogs_ext_gl, sl.gross_margin_ext 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE 
        sl.week >= ${start} AND sl.week <= ${end} 
        AND ms.item_type = ${config.itemType} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``} 
        ${config.customer ? sql`AND sl.customer_code = ${config.customer}`: sql``} 
        ${config.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.salesPerson}`: sql``} 
        ${config.country ? sql`AND sl.country = ${config.country}`: sql``} 
        ${config.state ? sql`AND sl.state = ${config.state}`: sql``} 
        ${config.export ? sql`AND sl.domestic = ${config.export}`: sql``} 
        ${config.northAmerica ? sql`AND sl.north_america = ${config.northAmerica}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
        ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
        ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
        ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
        AND sl.fiscal_year = ${year}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getSales_detail = getSales_detail
