/* *********************************************** FG PROGRAM SALES *********************************************** */

// FG on hand grouped by program (includes in transit)

const getFgByProgram = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, master_supplement.species_group AS maj_row, master_supplement.program AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS sales, SUM(perpetual_inventory.cost_extended) AS cogs, SUM(perpetual_inventory.cost_extended) AS othp FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) GROUP BY master_supplement.species_group, master_supplement.program',
      ['FG']
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG in transit grouped by program

const getFgInTransitByProgram = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'IN TRANSIT\' AS column, master_supplement.species_group AS maj_row, master_supplement.program AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS sales, SUM(perpetual_inventory.cost_extended) AS cogs, SUM(perpetual_inventory.cost_extended) AS othp FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = $2 GROUP BY master_supplement.species_group, master_supplement.program',
      ['FG', 'IN TRANSIT']
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location grouped by program

const getFgAtLocationByProgram = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'ON HAND\' AS column, master_supplement.species_group AS maj_row, master_supplement.program AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS sales, SUM(perpetual_inventory.cost_extended) AS cogs, SUM(perpetual_inventory.cost_extended) AS othp FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 GROUP BY master_supplement.species_group, master_supplement.program',
      ['FG', 'IN TRANSIT']
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** FG SPECIES GROUP *********************************************** */

// FG on hand grouped by species (includes in transit)

const getFgBySpecies = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, master_supplement.species_group AS maj_row, \'SUBTOTAL\' AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS sales, SUM(perpetual_inventory.cost_extended) AS cogs, SUM(perpetual_inventory.cost_extended) AS othp FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) GROUP BY master_supplement.species_group',
      ['FG']
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG in transit grouped by species

const getFgInTransitBySpecies = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'IN TRANSIT\' AS column, master_supplement.species_group AS maj_row, \'SUBTOTAL\' AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS sales, SUM(perpetual_inventory.cost_extended) AS cogs, SUM(perpetual_inventory.cost_extended) AS othp FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = $2 GROUP BY master_supplement.species_group',
      ['FG', 'IN TRANSIT']
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location grouped by species

const getFgAtLocationBySepcies = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'ON HAND\' AS column, master_supplement.species_group AS maj_row, \'SUBTOTAL\' AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS sales, SUM(perpetual_inventory.cost_extended) AS cogs, SUM(perpetual_inventory.cost_extended) AS othp FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 GROUP BY master_supplement.species_group',
      ['FG', 'IN TRANSIT']
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL INVEN *********************************************** */

// FG on hand grouped by species (includes in transit)

const getFgTotal = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, \'FG SALES\' AS maj_row, \'TOTAL\' AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS sales, SUM(perpetual_inventory.cost_extended) AS cogs, SUM(perpetual_inventory.cost_extended) AS othp FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory)',
      ['FG']
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG in transit grouped by species

const getFgInTransitTotal = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'IN TRANSIT\' AS column, \'FG SALES\' AS maj_row, \'TOTAL\' AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS sales, SUM(perpetual_inventory.cost_extended) AS cogs, SUM(perpetual_inventory.cost_extended) AS othp FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = $2',
      ['FG', 'IN TRANSIT']
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location grouped by species

const getFgAtLocationTotal = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'ON HAND\' AS column, \'FG SALES\' AS maj_row, \'TOTAL\' AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS sales, SUM(perpetual_inventory.cost_extended) AS cogs, SUM(perpetual_inventory.cost_extended) AS othp FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2',
      ['FG', 'IN TRANSIT']
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getFgByProgram = getFgByProgram
module.exports.getFgInTransitByProgram = getFgInTransitByProgram
module.exports.getFgAtLocationByProgram = getFgAtLocationByProgram
module.exports.getFgBySpecies = getFgBySpecies
module.exports.getFgInTransitBySpecies = getFgInTransitBySpecies
module.exports.getFgAtLocationBySepcies = getFgAtLocationBySepcies
module.exports.getFgTotal = getFgTotal
module.exports.getFgInTransitTotal = getFgInTransitTotal
module.exports.getFgAtLocationTotal = getFgAtLocationTotal
