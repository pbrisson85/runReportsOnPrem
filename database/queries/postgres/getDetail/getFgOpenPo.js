const sql = require('../../../../server')

// FG open PO grouped by program (includes in transit)

const getFgPo_detail = async config => {
  try {
    console.log(`${config.user} - level ${config.baseFilters.queryLevel}: query postgres for FG open PO ...`)

    const response = await sql
       `SELECT p.item_number, ms.description, p.location_code, p.location_country, ms.fg_fresh_frozen, ms.species, ms.fg_treatment, ms.brand, ms.size_name, p.po_vendor, p.po_number, p.eta_date, p.on_order_lbs, p.on_order_extended, COALESCE(p.on_order_extended/p.on_order_lbs,0) AS cost_lb
       
       FROM "invenReporting".perpetual_inventory AS p
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = p.item_number 
          
      WHERE 
        p.on_order_lbs <> 0 
        AND p.version = (SELECT MAX(p2.version) - 1 FROM "invenReporting".perpetual_inventory AS p2) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
        ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
        ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
        ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``} 
        ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
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

module.exports.getFgPo_detail = getFgPo_detail
