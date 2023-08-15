const sql = require('../../../../../../server')

/* *********************************************** Level 1 *********************************************** */

const byItem_getFgPo_detail = async item => {
  try {
    console.log(`level 1: query postgres for FG open PO ...`)

    const response =
      await sql`SELECT p.item_number, ms.description, p.location_code, p.location_country, ms.fg_fresh_frozen, ms.species, ms.fg_treatment, ms.brand, ms.size_name, p.po_vendor, p.po_number, p.eta_date, p.on_order_lbs, p.on_order_extended, COALESCE(p.on_order_extended/p.on_order_lbs,0) AS cost_lb
         
         FROM "invenReporting".perpetual_inventory AS p
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = p.item_number 
            
        WHERE ms.item_num = ${item} AND p.on_order_lbs <> 0 AND p.version = (SELECT MAX(p2.version) - 1 FROM "invenReporting".perpetual_inventory AS p2) ` //prettier-ignore [itemCode]

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.byItem_getFgPo_detail = byItem_getFgPo_detail
