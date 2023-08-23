const sql = require('../../../../../../server')

/* *********************************************** Level 1 *********************************************** */

const lvl_1_subtotal_getFgPo = async (config, program, filters) => {
  try {
    console.log(`level 1: query postgres for FG open PO ...`)

    const response = await sql
         `SELECT 'FG ON ORDER' AS column, ms.item_num AS l1_label, ms.description AS l2_label, ms.fg_fresh_frozen AS l3_label, ms.fg_treatment AS l4_label, ms.brand AS l5_label, ms.size_name AS l6_label, COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs 
         
         FROM "invenReporting".perpetual_inventory 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = perpetual_inventory.item_number 
            
        WHERE ms.item_type = ${'FG'} AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        
        GROUP BY ms.item_num, ms.description, ms.fg_fresh_frozen, ms.fg_treatment, ms.brand, ms.size_name` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getFgPo = async (config, program, filters) => {
  try {
    console.log(`level 0: query postgres for FG open PO ...`)

    const response = await sql
         `SELECT 'FG ON ORDER' AS column, 'FG SALES' AS l1_label, COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs 
         
         FROM "invenReporting".perpetual_inventory 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = perpetual_inventory.item_number 
            
        WHERE ms.item_type = ${'FG'} AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_1_subtotal_getFgPo = lvl_1_subtotal_getFgPo
module.exports.lvl_0_total_getFgPo = lvl_0_total_getFgPo
