const sql = require('../../../../../server')
/* *********************************************** Level 1 *********************************************** */

const l1_getRmPo = async program => {
  try {
    console.log(`${config.user} - level 1: query postgres for RM open PO ...`)

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

const l2_getRmPo = async program => {
  try {
    console.log(`${config.user} - level 2: query postgres for RM open PO ...`)

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

const l3_getRmPo = async program => {
  try {
    console.log(`${config.user} - level 3: query postgres for RM open PO ...`)

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

const l0_getRmPo = async program => {
  try {
    console.log(`${config.user} - level 0: query postgres for RM open PO ...`)

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

module.exports.l1_getRmPo = l1_getRmPo
module.exports.l2_getRmPo = l2_getRmPo
module.exports.l3_getRmPo = l3_getRmPo
module.exports.l0_getRmPo = l0_getRmPo
