/* *********************************************** FG SIZE *********************************************** */
const getFgBySize = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    // Level 3 detail

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, master_supplement.fg_fresh_frozen AS maj_row, master_supplement.fg_treatment AS min_row, master_supplement.size_name AS third_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND master_supplement.program = $2 GROUP BY master_supplement.fg_fresh_frozen, master_supplement.fg_treatment, master_supplement.size_name',
      ['FG', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** FG PROCESSING LEVEL *********************************************** */

// FG on hand (includes in transit)
const getFgByProcessingLevel = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    // Level 2 detail

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, master_supplement.fg_fresh_frozen AS maj_row, master_supplement.fg_treatment AS min_row, \'PROC SUBTOTAL\' AS third_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND master_supplement.program = $2 GROUP BY master_supplement.fg_fresh_frozen, master_supplement.fg_treatment',
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

const getFgInTransitByProgram = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'FG IN TRANSIT\' AS column, master_supplement.species_group AS maj_row, master_supplement.program AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = $2 GROUP BY master_supplement.species_group, master_supplement.program',
      ['FG', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location

const getFgAtLocationByProgram = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'FG ON HAND\' AS column, master_supplement.species_group AS maj_row, master_supplement.program AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 GROUP BY master_supplement.species_group, master_supplement.program',
      ['FG', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** FG FRESH/FROZEN GROUP *********************************************** */

// FG on hand (includes in transit)

const getFgByFreshFrozen = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    // level 1 detail

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, master_supplement.fg_fresh_frozen AS maj_row, \'FREEZE SUBTOTAL\' AS min_row, \'FREEZE SUBTOTAL\' AS, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND master_supplement.program = $2 GROUP BY master_supplement.fg_fresh_frozen',
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

const getFgInTransitBySpecies = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'FG IN TRANSIT\' AS column, master_supplement.species_group AS maj_row, \'SUBTOTAL\' AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = $2 GROUP BY master_supplement.species_group',
      ['FG', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location

const getFgAtLocationBySepcies = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'FG ON HAND\' AS column, master_supplement.species_group AS maj_row, \'SUBTOTAL\' AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 GROUP BY master_supplement.species_group',
      ['FG', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL INVEN *********************************************** */

// FG on hand (includes in transit)

const getFgTotal = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    // level 0 detail (TOTAL)

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, \'FG SALES\' AS maj_row, \'TOTAL\' AS min_row, \'TOTAL\' AS third_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND master_supplement.program = $2',
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

const getFgInTransitTotal = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'FG IN TRANSIT\' AS column, \'FG SALES\' AS maj_row, \'TOTAL\' AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = $2',
      ['FG', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location

const getFgAtLocationTotal = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'FG ON HAND\' AS column, \'FG SALES\' AS maj_row, \'TOTAL\' AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2',
      ['FG', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getFgBySize = getFgBySize
module.exports.getFgByProcessingLevel = getFgByProcessingLevel
module.exports.getFgInTransitByProgram = getFgInTransitByProgram
module.exports.getFgAtLocationByProgram = getFgAtLocationByProgram
module.exports.getFgByFreshFrozen = getFgByFreshFrozen
module.exports.getFgInTransitBySpecies = getFgInTransitBySpecies
module.exports.getFgAtLocationBySepcies = getFgAtLocationBySepcies
module.exports.getFgTotal = getFgTotal
module.exports.getFgInTransitTotal = getFgInTransitTotal
module.exports.getFgAtLocationTotal = getFgAtLocationTotal
