const sql = require('../../../../../server')
const { programFilter } = require('../../queryFilters/queryFilters')

/* *********************************************** Level 1 *********************************************** */

const lvl_1_subtotal_getFgPo = async (config, program) => {
  try {
    console.log(`level 1: query postgres for FG open PO ...`)

    const programOption = programFilter(program, sql)

    const response = await sql
         `SELECT 'FG ON ORDER' AS column, ${sql(config.l1_field)} AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs 
        
         FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
         
         WHERE ms.item_type = ${'FG'} AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) ${programOption} 
         
         GROUP BY ${sql(config.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 *********************************************** */

// FG open PO grouped by program (includes in transit)

const lvl_2_subtotal_getFgPo = async (config, program) => {
  try {
    console.log(`level 2: query postgres for FG open PO ...`)

    const response = await sql
       `SELECT 'FG ON ORDER' AS column, ${sql(config.l1_field)} AS l1_label, ${sql(config.l2_field)} AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs 
       
       FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
       
       WHERE ms.item_type = ${'FG'} AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) ${programFilter} 
       
       GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 *********************************************** */

// FG open PO grouped by program (includes in transit)

const lvl_3_subtotal_getFgPo = async (config, program) => {
  try {
    console.log(`level 3: query postgres for FG open PO ...`)

    const response = await sql
       `SELECT 'FG ON ORDER' AS column, ${sql(config.l1_field)} AS l1_label, ${sql(config.l2_field)} AS l2_label, ${sql(config.l3_field)} AS l3_label, COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs 
       
       FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
       
       WHERE ms.item_type = ${'FG'} AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) ${program ? sql`AND ms.program = ${program}`: sql``} 
       
       GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getFgPo = async (config, program) => {
  try {
    console.log(`level 0: query postgres for FG open PO ...`)

    const response = await sql
         `SELECT 'FG ON ORDER' AS column, 'FG SALES' AS l1_label, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs 
         
         FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
         
         WHERE ms.item_type = ${'FG'} AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) ${program ? sql`AND ms.program = ${program}`: sql``}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_1_subtotal_getFgPo = lvl_1_subtotal_getFgPo
module.exports.lvl_2_subtotal_getFgPo = lvl_2_subtotal_getFgPo
module.exports.lvl_3_subtotal_getFgPo = lvl_3_subtotal_getFgPo
module.exports.lvl_0_total_getFgPo = lvl_0_total_getFgPo
