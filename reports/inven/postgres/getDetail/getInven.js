const sql = require('../../../../server')

// FG on hand (includes in transit)
const getInven_detail = async (config, startDate, endDate) => {
  try {
    console.log(`${config.user} - level ${config.baseFilters.queryLevel} Detail: query postgres for FG on hand ...`)

    // Level 2 detail

    const response = await sql
          `SELECT pi.receipt_date, pi.location_date, pi.lot_text, pi.msc_cert_bool AS msc, pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
          
          FROM "invenReporting".perpetual_inventory AS pi 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pi.item_number 
              
          WHERE 
            pi.on_hand_lbs <> 0 
            AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
            ${endDate ? sql`AND pi.receipt_date <= ${endDate}`: sql``}
            ${startDate ? sql`AND pi.receipt_date >= ${startDate}`: sql``}
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``}
            ${config.slice.speciesGroup ? sql`AND ms.species_group = ${config.slice.speciesGroup}`: sql``}
            ${config.slice.species ? sql`AND ms.species = ${config.slice.species}`: sql``}
            ${config.slice.program ? sql`AND ms.program = ${config.slice.program}`: sql``}
            ${config.slice.item ? sql`AND ms.item_num = ${config.slice.item}`: sql``}  
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

module.exports.getInven_detail = getInven_detail
