/* *********************************************** Level 1 *********************************************** */

const lvl_1_subtotal_getRmPo = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for RM open PO ...`)

    const response = await pgClient.query(
         'SELECT \'RM ON ORDER\' AS column, ms.fg_fresh_frozen AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal,  COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs,  COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.item_type = $1 AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2 GROUP BY ms.fg_fresh_frozen', ['RM', program]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 *********************************************** */

// RM open PO grouped by program (includes in transit)

const lvl_2_subtotal_getRmPo = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres for RM open PO ...`)

    const response = await pgClient.query(
       'SELECT \'RM ON ORDER\' AS column, ms.fg_fresh_frozen AS l1_subtotal, ms.fg_treatment AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal,  COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs,  COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.item_type = $1 AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2 GROUP BY ms.fg_fresh_frozen, ms.fg_treatment', ['RM', program]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 *********************************************** */

// RM open PO grouped by program (includes in transit)

const lvl_3_subtotal_getRmPo = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for RM open PO ...`)

    const response = await pgClient.query(
       'SELECT \'RM ON ORDER\' AS column, ms.fg_fresh_frozen AS l1_subtotal, ms.fg_treatment AS l2_subtotal, ms.size_name AS l3_subtotal,  COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs,  COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.item_type = $1 AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2 GROUP BY ms.fg_fresh_frozen, ms.fg_treatment, ms.size_name', ['RM', program]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getRmPo = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for RM open PO ...`)

    const response = await pgClient.query(
         'SELECT \'RM ON ORDER\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, \'TOTAL\' AS l3_subtotal,  COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs,  COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.item_type = $1 AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2', ['RM', program]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_1_subtotal_getRmPo = lvl_1_subtotal_getRmPo
module.exports.lvl_2_subtotal_getRmPo = lvl_2_subtotal_getRmPo
module.exports.lvl_3_subtotal_getRmPo = lvl_3_subtotal_getRmPo
module.exports.lvl_0_total_getRmPo = lvl_0_total_getRmPo
