const sql = require('../../../../server')

// FG open PO grouped by program (includes in transit)

const getPo_detail = async config => {
  try {
    console.log(`${config.user} - level ${config.baseFilters.queryLevel}: query postgres for FG open PO ...`)

    const response = await sql
       `SELECT 
        p.item_number, 
        ms.description, 
        p.location_code, 
        p.location_country, 
        ms.fg_fresh_frozen, 
        ms.species, 
        ms.fg_treatment, 
        ms.brand, 
        ms.size_name, 
        p.po_vendor, 
        p.po_number, 
        p.eta_date, 
        p.on_order_lbs, 
        p.on_order_extended, 
        COALESCE(p.on_order_extended/p.on_order_lbs,0) AS cost_lb
       
       FROM "purchaseReporting".po_received AS po 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = po.item_number 
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p 
            ON po.receipt_date = p.formatted_date  
          
      WHERE 
        p.on_order_lbs <> 0 
        AND p.version = (SELECT MAX(p2.version) - 1 FROM "invenReporting".perpetual_inventory AS p2) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.slice.speciesGroup ? sql`AND ${config.slice.speciesGroup === 'NO VALUE' ? sql`ms.species_group IS NULL` : sql`ms.species_group = ${config.slice.speciesGroup}`}` : sql`` }
        ${config.slice.species ? sql`AND ${config.slice.species === 'NO VALUE' ? sql`ms.species IS NULL` : sql`ms.species = ${config.slice.species}`}` : sql`` }
        ${config.slice.program ? sql`AND ${config.slice.program === 'NO VALUE' ? sql`ms.program IS NULL` : sql`ms.program = ${config.slice.program}`}` : sql`` }
        ${config.slice.item ? sql`AND ${config.slice.item === 'NO VALUE' ? sql`ms.item_num IS NULL` : sql`ms.item_num = ${config.slice.item}`}` : sql`` }
        ${config.slice.freshFrozen ? sql`AND ${config.slice.freshFrozen === 'NO VALUE' ? sql`ms.fg_fresh_frozen IS NULL` : sql`ms.fg_fresh_frozen = ${config.slice.freshFrozen}`}` : sql`` } 
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
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

module.exports.getPo_detail = getPo_detail
