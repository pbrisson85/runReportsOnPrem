/* *********************************************** Level 1 *********************************************** */

const lvl_1_subtotal_getFgPo = async (config, program, filters) => {
  try {
    console.log(`level 1: query postgres for FG open PO ...`)

    const response = await sql
         `SELECT \'FG ON ORDER\' AS column, ms.item_num AS l1_label, ms.description AS l2_label, ${sql(config.l1_field)} AS l3_label, ${sql(config.l2_field)} AS l4_label , ${sql(config.l3_field)} AS l5_label, COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs 
         
         FROM "invenReporting".perpetual_inventory 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = perpetual_inventory.item_number 
            
        WHERE ms.item_type = ${'FG'} AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = ${program} 
        
        GROUP BY ms.item_num, ms.description, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const sql = require('../../../../../../server')
/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getFgPo = async (config, program, filters) => {
  try {
    console.log(`level 0: query postgres for FG open PO ...`)

    const response = await sql
         `SELECT \'FG ON ORDER\' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs 
         
         FROM "invenReporting".perpetual_inventory 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = perpetual_inventory.item_number 
            
        WHERE ms.item_type = ${'FG'} AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = ${program}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_1_subtotal_getFgPo = lvl_1_subtotal_getFgPo
module.exports.lvl_0_total_getFgPo = lvl_0_total_getFgPo