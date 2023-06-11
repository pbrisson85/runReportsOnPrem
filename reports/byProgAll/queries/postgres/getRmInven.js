/* *********************************************** Level 1 *********************************************** */

// RM on hand grouped by species (includes in transit)

const lvl_1_subtotal_getRmInven = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM INVEN\' AS column, master_supplement.species_group AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) GROUP BY master_supplement.species_group',
      ['RM']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// RM in transit grouped by species (INCLUDES OUT OF COUNTRY!!!!!)

const lvl_1_subtotal_getRmInTransit = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM IN TRANSIT\' AS column, master_supplement.species_group AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND (perpetual_inventory.location_type = $2 OR perpetual_inventory.location_country <> perpetual_inventory.program_country) GROUP BY master_supplement.species_group',
      ['RM', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// RM at location grouped by species (EXCLUDES OUT OF COUNTRY!!!!!)

const lvl_1_subtotal_getRmAtLoc = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM ON HAND\' AS column, master_supplement.species_group AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 AND perpetual_inventory.location_country = perpetual_inventory.program_country GROUP BY master_supplement.species_group',
      ['RM', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 *********************************************** */

// RM on hand grouped by program

const lvl_2_subtotal_getRmInven = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM INVEN\' AS column, master_supplement.species_group AS l1_subtotal, master_supplement.program AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) GROUP BY master_supplement.species_group, master_supplement.program',
      ['RM']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// RM in transit grouped by program (INCLUDES OUT OF COUNTRY!!!!!)

const lvl_2_subtotal_getRmInTransit = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM IN TRANSIT\' AS column, master_supplement.species_group AS l1_subtotal, master_supplement.program AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND (perpetual_inventory.location_type = $2 OR perpetual_inventory.location_country <> perpetual_inventory.program_country) GROUP BY master_supplement.species_group, master_supplement.program',
      ['RM', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// RM at location grouped by program (EXCLUDES OUT OF COUNTRY!!!!!)

const lvl_2_subtotal_getRmAtLoc = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM ON HAND\' AS column, master_supplement.species_group AS l1_subtotal, master_supplement.program AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 AND perpetual_inventory.location_country = perpetual_inventory.program_country GROUP BY master_supplement.species_group, master_supplement.program',
      ['RM', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

// RM on hand grouped by species (includes in transit)

const lvl_0_total_getRmInven = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM INVEN\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory)',
      ['RM']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// RM in transit grouped by species (INCLUDES OUT OF COUNTRY!!!!!)

const lvl_0_total_getRmInTransit = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM IN TRANSIT\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND (perpetual_inventory.location_type = $2 OR perpetual_inventory.location_country <> perpetual_inventory.program_country)',
      ['RM', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// RM at location grouped by species (EXCLUDES OUT OF COUNTRY!!!!!)

const lvl_0_total_getRmAtLoc = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM ON HAND\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 AND perpetual_inventory.location_country = perpetual_inventory.program_country',
      ['RM', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_2_subtotal_getRmInven = lvl_2_subtotal_getRmInven
module.exports.lvl_2_subtotal_getRmInTransit = lvl_2_subtotal_getRmInTransit
module.exports.lvl_2_subtotal_getRmAtLoc = lvl_2_subtotal_getRmAtLoc
module.exports.lvl_1_subtotal_getRmInven = lvl_1_subtotal_getRmInven
module.exports.lvl_1_subtotal_getRmInTransit = lvl_1_subtotal_getRmInTransit
module.exports.lvl_1_subtotal_getRmAtLoc = lvl_1_subtotal_getRmAtLoc
module.exports.lvl_0_total_getRmInven = lvl_0_total_getRmInven
module.exports.lvl_0_total_getRmInTransit = lvl_0_total_getRmInTransit
module.exports.lvl_0_total_getRmAtLoc = lvl_0_total_getRmAtLoc
