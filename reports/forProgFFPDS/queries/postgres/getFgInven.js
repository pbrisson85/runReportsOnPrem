/* *********************************************** Level 1 *********************************************** */

// FG on hand (includes in transit)

const lvl_1_subtotal_getFgInven = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level1: query postgres for FG on hand ...`)

    // level 1 detail

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, master_supplement.fg_fresh_frozen AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND master_supplement.program = $2 GROUP BY master_supplement.fg_fresh_frozen',
      ['FG', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG in transit

const lvl_1_subtotal_getFgInTransit = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level1: query postgres for FG in transit ...`)

    const response = await pgClient.query(
      'SELECT \'FG IN TRANSIT\' AS column, master_supplement.fg_fresh_frozen AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = $2 AND master_supplement.program = $3 GROUP BY master_supplement.fg_fresh_frozen',
      ['FG', 'IN TRANSIT', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location

const lvl_1_subtotal_getFgAtLoc = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level1: query postgres for FG at location ...`)

    const response = await pgClient.query(
      'SELECT \'FG ON HAND\' AS column, master_supplement.fg_fresh_frozen AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 AND master_supplement.program = $3 GROUP BY master_supplement.fg_fresh_frozen',
      ['FG', 'IN TRANSIT', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 *********************************************** */

// FG on hand (includes in transit)
const lvl_2_subtotal_getFgInven = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level2: query postgres for FG on hand ...`)

    // Level 2 detail

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, master_supplement.fg_fresh_frozen AS l1_subtotal, master_supplement.fg_treatment AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND master_supplement.program = $2 GROUP BY master_supplement.fg_fresh_frozen, master_supplement.fg_treatment',
      ['FG', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG in transit

const lvl_2_subtotal_getFgInTransit = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level2: query postgres for FG in transit ...`)

    const response = await pgClient.query(
      'SELECT \'FG IN TRANSIT\' AS column, master_supplement.fg_fresh_frozen AS l1_subtotal, master_supplement.fg_treatment AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = $2 AND master_supplement.program = $3 GROUP BY master_supplement.fg_fresh_frozen, master_supplement.fg_treatment',
      ['FG', 'IN TRANSIT', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location

const lvl_2_subtotal_getFgAtLoc = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level2: query postgres for FG at location ...`)

    const response = await pgClient.query(
      'SELECT \'FG ON HAND\' AS column, master_supplement.fg_fresh_frozen AS l1_subtotal, master_supplement.fg_treatment AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 AND master_supplement.program = $3 GROUP BY master_supplement.fg_fresh_frozen, master_supplement.fg_treatment',
      ['FG', 'IN TRANSIT', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 *********************************************** */

// FG on hand (includes in transit)
const lvl_3_subtotal_getFgInven = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level3: query postgres for FG on hand ...`)

    // Level 3 detail

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, master_supplement.fg_fresh_frozen AS l1_subtotal, master_supplement.fg_treatment AS l2_subtotal, master_supplement.size_name AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND master_supplement.program = $2 GROUP BY master_supplement.fg_fresh_frozen, master_supplement.fg_treatment, master_supplement.size_name',
      ['FG', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getFgInTransit = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level3: query postgres for FG in transit ...`)

    // Level 3 detail

    const response = await pgClient.query(
      'SELECT \'FG IN TRANSIT\' AS column, master_supplement.fg_fresh_frozen AS l1_subtotal, master_supplement.fg_treatment AS l2_subtotal, master_supplement.size_name AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = $2 AND master_supplement.program = $3 GROUP BY master_supplement.fg_fresh_frozen, master_supplement.fg_treatment, master_supplement.size_name',
      ['FG', 'IN TRANSIT', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getFgAtLoc = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level3: query postgres for FG at location ...`)

    // Level 3 detail

    const response = await pgClient.query(
      'SELECT \'FG ON HAND\' AS column, master_supplement.fg_fresh_frozen AS l1_subtotal, master_supplement.fg_treatment AS l2_subtotal, master_supplement.size_name AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 AND master_supplement.program = $3 GROUP BY master_supplement.fg_fresh_frozen, master_supplement.fg_treatment, master_supplement.size_name',
      ['FG', 'IN TRANSIT', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

// FG on hand (includes in transit)

const lvl_0_total_getFgInven = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`total: query postgres for FG on hand ...`)

    // level 0 detail (TOTAL)

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, \'TOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND master_supplement.program = $2',
      ['FG', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG in transit

const lvl_0_total_getFgInTransit = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`total: query postgres for FG in transit ...`)

    const response = await pgClient.query(
      'SELECT \'FG IN TRANSIT\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, \'TOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND master_supplement.program = $2 AND perpetual_inventory.location_type = $3',
      ['FG', program, 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location

const lvl_0_total_getFgAtLocation = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`total: query postgres for FG at location ...`)

    const response = await pgClient.query(
      'SELECT \'FG ON HAND\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, \'TOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND master_supplement.program = $2 AND perpetual_inventory.location_type <> $3',
      ['FG', program, 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_3_subtotal_getFgInven = lvl_3_subtotal_getFgInven
module.exports.lvl_3_subtotal_getFgInTransit = lvl_3_subtotal_getFgInTransit
module.exports.lvl_3_subtotal_getFgAtLoc = lvl_3_subtotal_getFgAtLoc
module.exports.lvl_2_subtotal_getFgInven = lvl_2_subtotal_getFgInven
module.exports.lvl_2_subtotal_getFgInTransit = lvl_2_subtotal_getFgInTransit
module.exports.lvl_2_subtotal_getFgAtLoc = lvl_2_subtotal_getFgAtLoc
module.exports.lvl_1_subtotal_getFgInven = lvl_1_subtotal_getFgInven
module.exports.lvl_1_subtotal_getFgInTransit = lvl_1_subtotal_getFgInTransit
module.exports.lvl_1_subtotal_getFgAtLoc = lvl_1_subtotal_getFgAtLoc
module.exports.lvl_0_total_getFgInven = lvl_0_total_getFgInven
module.exports.lvl_0_total_getFgInTransit = lvl_0_total_getFgInTransit
module.exports.lvl_0_total_getFgAtLocation = lvl_0_total_getFgAtLocation
