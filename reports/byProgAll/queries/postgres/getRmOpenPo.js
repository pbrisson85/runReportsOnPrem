/* *********************************************** Level 1 *********************************************** */

const lvl_1_subtotal_getRmPo = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM open PO ...`)

    const response = await pgClient.query(
         'SELECT \'RM ON ORDER\' AS column, master_supplement.species_group AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.item_type = $1 AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) GROUP BY master_supplement.species_group', ['RM']
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

const lvl_2_subtotal_getRmPo = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM open PO ...`)

    const response = await pgClient.query(
       'SELECT \'RM ON ORDER\' AS column, master_supplement.species_group AS l1_subtotal, master_supplement.program AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.item_type = $1 AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) GROUP BY master_supplement.species_group, master_supplement.program', ['RM']
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getRmPo = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM open PO ...`)

    const response = await pgClient.query(
         'SELECT \'RM ON ORDER\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.item_type = $1 AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory)', ['RM']
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_2_subtotal_getRmPo = lvl_2_subtotal_getRmPo
module.exports.lvl_1_subtotal_getRmPo = lvl_1_subtotal_getRmPo
module.exports.lvl_0_total_getRmPo = lvl_0_total_getRmPo
