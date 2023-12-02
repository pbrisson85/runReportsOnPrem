const sql = require('../../../../server')

// FG Program col total for period

const getSales_detail = async (config, startDate, endDate) => {
  try {
    console.log(`${config.user} - level ${config.baseFilters.queryLevel}: query postgres to get FG sales data period total ...`)

    const response = await sql
      `SELECT sl.net_sales_ext, sl.gross_margin_lb, sl.cost_lb, sl.net_sales_lb, sl.othp_lb, sl.gross_sales_lb, sl.location, sl.customer_code, sl.customer_name, sl.invoice_number, sl.line_number, sl.formatted_invoice_date, sl.week_serial, sl.item_number, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, sl.calc_gm_rept_weight, sl.gross_sales_ext, sl.othp_ext, sl.cogs_ext_gl, sl.gross_margin_ext 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
        LEFT OUTER JOIN "masters".customer_supplement AS cs 
          ON cs.customer_code = sl.customer_code
          
      WHERE 
        sl.formatted_invoice_date >= ${startDate} AND sl.formatted_invoice_date <= ${endDate}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
        ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
        ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
        ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``} 
        ${config.trendFilters.customer ? sql`AND sl.customer_code = ${config.trendFilters.customer}`: sql``} 
        ${config.trendFilters.custType ? sql`AND cs.category = ${config.trendFilters.custType}`: sql``} 
        ${config.trendFilters.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.trendFilters.salesPerson}`: sql``} 
        ${config.trendFilters.country ? sql`AND sl.country = ${config.trendFilters.country}`: sql``} 
        ${config.trendFilters.state ? sql`AND sl.state = ${config.trendFilters.state}`: sql``} 
        ${config.trendFilters.export ? sql`AND sl.domestic = ${config.trendFilters.export}`: sql``} 
        ${config.trendFilters.northAmerica ? sql`AND sl.north_america = ${config.trendFilters.northAmerica}`: sql``} 
        ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.l1_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.l2_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.l3_filter}` : sql``}
        ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.l4_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.l5_filter}` : sql``}
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getSales_detail = getSales_detail
