const sql = require('../../../../server')

const getSo_detail = async config => {
  try {
    console.log(`${config.user} - level ${config.baseFilters.queryLevel}: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.ext_weight AS lbs, so.ext_sales, so.ext_othp, so.ext_cost, so.gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_cost_per_lb AS cost_lb, so.gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged, so.out_sales_rep, credit_status_desc, logistics_status, so_entered_timestamp
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "masters".customer_supplement AS cs 
          ON cs.customer_code = so.customer_code
          
      WHERE 
        so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.slice.speciesGroup ? sql`AND ms.species_group = ${config.slice.speciesGroup}`: sql``}
        ${config.slice.species ? sql`AND ms.species = ${config.slice.species}`: sql``}
        ${config.slice.program ? sql`AND ms.program = ${config.slice.program}`: sql``}
        ${config.slice.item ? sql`AND ms.item_num = ${config.slice.item}`: sql``} 
        ${config.slice.customer ? sql`AND so.customer_code = ${config.slice.customer}`: sql``} 
        ${config.slice.custType ? sql`AND cs.category = ${config.slice.custType}`: sql``} 
        ${config.slice.salesPerson ? sql`AND so.out_sales_rep = ${config.slice.salesPerson}`: sql``} 
        ${config.slice.country ? sql`AND so.country = ${config.slice.country}`: sql``} 
        ${config.slice.state ? sql`AND so.state = ${config.slice.state}`: sql``} 
        ${config.slice.export ? sql`AND so.domestic = ${config.slice.export}`: sql``} 
        ${config.slice.northAmerica ? sql`AND so.north_america = ${config.slice.northAmerica}`: sql``} 
        ${config.slice.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.slice.freshFrozen}`: sql``}  
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
        ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``}
        ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getSo_detail = getSo_detail
