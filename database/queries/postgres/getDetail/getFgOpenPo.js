const sql = require('../../../../server')

// FG open PO grouped by program (includes in transit)

const getFgPo_detail = async config => {
  try {
    console.log(`${config.user} - level ${config.queryLevel}: query postgres for FG open PO ...`)

    const response = await sql
       `SELECT p.item_number, ms.description, p.location_code, p.location_country, ms.fg_fresh_frozen, ms.species, ms.fg_treatment, ms.brand, ms.size_name, p.po_vendor, p.po_number, p.eta_date, p.on_order_lbs, p.on_order_extended, COALESCE(p.on_order_extended/p.on_order_lbs,0) AS cost_lb
       
       FROM "invenReporting".perpetual_inventory AS p
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = p.item_number 
          
      WHERE 
        p.on_order_lbs <> 0 
        AND p.version = (SELECT MAX(p2.version) - 1 FROM "invenReporting".perpetual_inventory AS p2) 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``} 
        ${config.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.freshFrozen}`: sql``}  
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
        ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
        ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
        ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``}
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getFgPo_detail = getFgPo_detail
