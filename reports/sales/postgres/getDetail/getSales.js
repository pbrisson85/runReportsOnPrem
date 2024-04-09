const sql = require('../../../../server')

// FG Program col total for period

const getSales_detail = async (config, startDate, endDate, othpTableConfig) => {
  try {
    console.log(`${config.user} - level ${config.baseFilters.queryLevel}: query postgres to get FG sales data period total ...`)

    const response = await sql
      `
      WITH othp_lines AS (
        SELECT * FROM ${sql(othpTableConfig.othpTable)}
      )
      
      
      SELECT sl.net_sales_ext, sl.gross_margin_lb, sl.cost_lb, sl.net_sales_lb, sl.othp_lb, sl.gross_sales_lb, sl.location, sl.customer_code, sl.customer_name, sl.invoice_number, sl.line_number, sl.formatted_invoice_date, sl.week_serial, sl.item_number, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, sl.calc_gm_rept_weight, sl.gross_sales_ext, sl.othp_ext, sl.cogs_ext_gl, sl.gross_margin_ext ${sql`${othpTableConfig.othpGls.map(gl => sql`, COALESCE(oc.${sql(gl.display_name)},0)::NUMERIC AS ${sql(gl.display_name)} `)}`} 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN ${sql(othpTableConfig.othpTable)} AS oc
          ON oc.invoice_num = sl.invoice_number AND oc.invoice_line = sl.line_number
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
        LEFT OUTER JOIN "masters".customer_supplement AS cs 
          ON cs.customer_code = sl.customer_code
        LEFT OUTER JOIN "masters".terms AS term
          ON sl.customer_terms_code = term.code
          
      WHERE 
        sl.formatted_invoice_date >= ${startDate} AND sl.formatted_invoice_date <= ${endDate}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.slice.speciesGroup ? sql`AND ms.species_group = ${config.slice.speciesGroup}`: sql``}
        ${config.slice.species ? sql`AND ms.species = ${config.slice.species}`: sql``}
        ${config.slice.program ? sql`AND ms.program = ${config.slice.program}`: sql``}
        ${config.slice.item ? sql`AND ms.item_num = ${config.slice.item}`: sql``} 
        ${config.slice.customer ? sql`AND sl.customer_code = ${config.slice.customer}`: sql``} 
        ${config.slice.custType ? sql`AND cs.category = ${config.slice.custType}`: sql``} 
        ${config.slice.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.slice.salesPerson}`: sql``} 
        ${config.slice.country ? sql`AND sl.country = ${config.slice.country}`: sql``} 
        ${config.slice.state ? sql`AND sl.state = ${config.slice.state}`: sql``} 
        ${config.slice.export ? sql`AND sl.domestic = ${config.slice.export}`: sql``} 
        ${config.slice.northAmerica ? sql`AND sl.north_america = ${config.slice.northAmerica}`: sql``} 
        ${config.slice.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.slice.freshFrozen}`: sql``}  
        ${config.slice.term ? sql`AND term.code = ${config.slice.term}`: sql``} 
        ${config.slice.insured ? sql`AND term.insured_status = ${config.slice.insured}`: sql``} 
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
        ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
        ` //prettier-ignore

    console.log(response)

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getSales_detail = getSales_detail
