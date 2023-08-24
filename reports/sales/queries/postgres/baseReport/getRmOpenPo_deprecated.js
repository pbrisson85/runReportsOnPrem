const sql = require('../../../../../server')
/* *********************************************** Level 1 *********************************************** */

const lvl_1_subtotal_getRmPo = async program => {
  try {
    console.log(`level 1: query postgres for RM open PO ...`)

    const response =
      await sql`SELECT 'RM ON ORDER' AS column, ms.species AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label,  COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs,  COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs 
         
         FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
         
         WHERE ms.item_type = ${'RM'} AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = ${program} 
         
         GROUP BY ms.species` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 *********************************************** */

// RM open PO grouped by program (includes in transit)

const lvl_2_subtotal_getRmPo = async program => {
  try {
    console.log(`level 2: query postgres for RM open PO ...`)

    const response =
      await sql`SELECT 'RM ON ORDER' AS column, ms.species AS l1_label, ms.brand AS l2_label, 'SUBTOTAL' AS l3_label,  COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs,  COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs 
       
       FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
       
       WHERE ms.item_type = ${'RM'} AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = ${program} 
       
       GROUP BY ms.species, ms.brand` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 *********************************************** */

// RM open PO grouped by program (includes in transit)

const lvl_3_subtotal_getRmPo = async program => {
  try {
    console.log(`level 3: query postgres for RM open PO ...`)

    const response =
      await sql`SELECT 'RM ON ORDER' AS column, ms.species AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label,  COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs,  COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs 
       
       FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
       
       WHERE ms.item_type = ${'RM'} AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = ${program} 
       
       GROUP BY ms.species, ms.brand, ms.size_name` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getRmPo = async program => {
  try {
    console.log(`level 0: query postgres for RM open PO ...`)

    const response =
      await sql`SELECT 'RM ON ORDER' AS column, 'FG SALES' AS l1_label, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label,  COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs,  COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs 
         
         FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
         
         WHERE ms.item_type = ${'RM'} AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = ${program}` //prettier-ignore ['RM', program]

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_1_subtotal_getRmPo = lvl_1_subtotal_getRmPo
module.exports.lvl_2_subtotal_getRmPo = lvl_2_subtotal_getRmPo
module.exports.lvl_3_subtotal_getRmPo = lvl_3_subtotal_getRmPo
module.exports.lvl_0_total_getRmPo = lvl_0_total_getRmPo
