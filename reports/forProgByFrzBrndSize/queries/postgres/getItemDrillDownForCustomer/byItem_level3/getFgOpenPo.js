// method of converting from standard report to item drillDown:
// Level 1:
// 1. replace: [something] AS l1_label, [something] AS l2_label, [something] AS l3_label with ms.item_num AS l1_label
// 2. add: WHERE ms.fg_fresh_frozen = filters[0] AND ms.brand = filters[1] AND ms.size_name = filters[2]
// 3. change GROUP BY to ms.item_num

// Level 2: delete
// Level 3: delete
// Total:
// 1. replace: [something] AS l1_label, [something] AS l2_label, [something] AS l3_label with ms.item_num AS l1_label
// 2. add: WHERE ms.fg_fresh_frozen = filters[0] AND ms.brand = filters[1] AND ms.size_name = filters[2]

/* *********************************************** Level 1 *********************************************** */

const lvl_1_subtotal_getFgPo = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG open PO ...`)

    const response = await pgClient.query(
         'SELECT \'FG ON ORDER\' AS column, ms.item_num AS l1_label, ms.description AS l2_label, COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.item_type = $1 AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2 AND ms.fg_fresh_frozen = $3 AND ms.brand = $4 AND ms.size_name = $5 GROUP BY ms.item_num, ms.description', ['FG', program, filters[0], filters[1], filters[2]]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getFgPo = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG open PO ...`)

    const response = await pgClient.query(
         'SELECT \'FG ON ORDER\' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.item_type = $1 AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2 AND ms.fg_fresh_frozen = $3 AND ms.brand = $4 AND ms.size_name = $5', ['FG', program, filters[0], filters[1], filters[2]]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_1_subtotal_getFgPo = lvl_1_subtotal_getFgPo
module.exports.lvl_0_total_getFgPo = lvl_0_total_getFgPo
