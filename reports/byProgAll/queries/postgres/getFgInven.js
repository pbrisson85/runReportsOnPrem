/* *********************************************** Level 1 *********************************************** */

const lvl_1_subtotal_getFgInven = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level1: query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, master_supplement.species_group AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) GROUP BY master_supplement.species_group',
      ['FG']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getFgInTransit = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level1: query postgres for FG in transit ...`)

    const response = await pgClient.query(
      'SELECT \'FG IN TRANSIT\' AS column, master_supplement.species_group AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = $2 GROUP BY master_supplement.species_group',
      ['FG', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getFgAtLoc = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level1: query postgres for FG at location ...`)

    const response = await pgClient.query(
      'SELECT \'FG ON HAND\' AS column, master_supplement.species_group AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 GROUP BY master_supplement.species_group',
      ['FG', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 *********************************************** */

const lvl_2_subtotal_getFgInven = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level2: query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, master_supplement.species_group AS l1_subtotal, master_supplement.program AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) GROUP BY master_supplement.species_group, master_supplement.program',
      ['FG']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getFgInTransit = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level2: query postgres for FG in transit ...`)

    const response = await pgClient.query(
      'SELECT \'FG IN TRANSIT\' AS column, master_supplement.species_group AS l1_subtotal, master_supplement.program AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = $2 GROUP BY master_supplement.species_group, master_supplement.program',
      ['FG', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getFgAtLoc = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level2: query postgres for FG at location ...`)

    const response = await pgClient.query(
      'SELECT \'FG ON HAND\' AS column, master_supplement.species_group AS l1_subtotal, master_supplement.program AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 GROUP BY master_supplement.species_group, master_supplement.program',
      ['FG', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getFgInven = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`total: query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory)',
      ['FG']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getFgInTransit = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`total: query postgres for FG in transit ...`)

    const response = await pgClient.query(
      'SELECT \'FG IN TRANSIT\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = $2',
      ['FG', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getFgAtLocation = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`total: query postgres for FG at location ...`)

    const response = await pgClient.query(
      'SELECT \'FG ON HAND\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2',
      ['FG', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_2_subtotal_getFgInven = lvl_2_subtotal_getFgInven
module.exports.lvl_2_subtotal_getFgInTransit = lvl_2_subtotal_getFgInTransit
module.exports.lvl_2_subtotal_getFgAtLoc = lvl_2_subtotal_getFgAtLoc
module.exports.lvl_1_subtotal_getFgInven = lvl_1_subtotal_getFgInven
module.exports.lvl_1_subtotal_getFgInTransit = lvl_1_subtotal_getFgInTransit
module.exports.lvl_1_subtotal_getFgAtLoc = lvl_1_subtotal_getFgAtLoc
module.exports.lvl_0_total_getFgInven = lvl_0_total_getFgInven
module.exports.lvl_0_total_getFgInTransit = lvl_0_total_getFgInTransit
module.exports.lvl_0_total_getFgAtLocation = lvl_0_total_getFgAtLocation
