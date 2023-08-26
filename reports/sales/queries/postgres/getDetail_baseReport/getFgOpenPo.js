const sql = require('../../../../../server')

// FG open PO grouped by program (includes in transit)

const lvl_3_subtotal_getFgPo_detail = async (config, program, filters, level) => {
  try {
    console.log(`level 3: query postgres for FG open PO ...`)

    const response = await sql
       `SELECT p.item_number, ms.description, p.location_code, p.location_country, ms.fg_fresh_frozen, ms.species, ms.fg_treatment, ms.brand, ms.size_name, p.po_vendor, p.po_number, p.eta_date, p.on_order_lbs, p.on_order_extended, COALESCE(p.on_order_extended/p.on_order_lbs,0) AS cost_lb
       
       FROM "invenReporting".perpetual_inventory AS p
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = p.item_number 
          
      WHERE ms.item_type = ${'FG'} AND p.on_order_lbs <> 0 AND p.version = (SELECT MAX(p2.version) - 1 FROM "invenReporting".perpetual_inventory AS p2) ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} ${level > 0 ? sql`AND ${sql(config.l1_field)} = ${filters[0]}` : sql``} ${level > 1 ? sql`AND ${sql(config.l2_field)} = ${filters[1]}` : sql``} ${level > 2 ? sql`AND ${sql(config.l3_field)} = ${filters[2]}` : sql``}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_3_subtotal_getFgPo_detail = lvl_3_subtotal_getFgPo_detail
