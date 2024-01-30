const sql = require('../../../../server')

// FG Program col total for period

const getSales_detail = async (config, startDate, endDate) => {
  try {
    console.log(`${config.user} - level ${config.baseFilters.queryLevel}: query postgres to get FG sales data period total ...`)

    const response = await sql
      `SELECT 
        sl.net_sales_ext, sl.gross_margin_lb, sl.cost_lb, sl.net_sales_lb, sl.othp_lb, sl.gross_sales_lb, sl.location, sl.customer_code, sl.customer_name, sl.invoice_number, sl.line_number, sl.formatted_invoice_date, sl.week_serial, sl.item_number, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, sl.calc_gm_rept_weight, sl.gross_sales_ext, sl.othp_ext, sl.cogs_ext_gl, sl.gross_margin_ext 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE 
        sl.formatted_invoice_date >= ${startDate} AND sl.formatted_invoice_date <= ${endDate}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.trendFilters.speciesGroup ? sql`AND ${config.trendFilters.speciesGroup === 'NO VALUE' ? sql`ms.species_group IS NULL` : sql`ms.species_group = ${config.trendFilters.speciesGroup}`}` : sql`` }
        ${config.trendFilters.species ? sql`AND ${config.trendFilters.species === 'NO VALUE' ? sql`ms.species IS NULL` : sql`ms.species = ${config.trendFilters.species}`}` : sql`` }
        ${config.trendFilters.program ? sql`AND ${config.trendFilters.program === 'NO VALUE' ? sql`ms.program IS NULL` : sql`ms.program = ${config.trendFilters.program}`}` : sql`` }
        ${config.trendFilters.item ? sql`AND ${config.trendFilters.item === 'NO VALUE' ? sql`ms.item_num IS NULL` : sql`ms.item_num = ${config.trendFilters.item}`}` : sql`` }
        ${config.trendFilters.freshFrozen ? sql`AND ${config.trendFilters.freshFrozen === 'NO VALUE' ? sql`ms.fg_fresh_frozen IS NULL` : sql`ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`}` : sql`` }
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.baseFilters.queryLevel > 0 ? sql`AND ${config.baseFilters.l1_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l1_field)} IS NULL` : sql`${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}`}` : sql`` }
        ${config.baseFilters.queryLevel > 1 ? sql`AND ${config.baseFilters.l2_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l2_field)} IS NULL` : sql`${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}`}` : sql`` }
        ${config.baseFilters.queryLevel > 2 ? sql`AND ${config.baseFilters.l3_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l3_field)} IS NULL` : sql`${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}`}` : sql`` }
        ${config.baseFilters.queryLevel > 3 ? sql`AND ${config.baseFilters.l4_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l4_field)} IS NULL` : sql`${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}`}` : sql`` }
        ${config.baseFilters.queryLevel > 4 ? sql`AND ${config.baseFilters.l5_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l5_field)} IS NULL` : sql`${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}`}` : sql`` }
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getSales_detail = getSales_detail
