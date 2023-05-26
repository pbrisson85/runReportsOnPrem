/* *********************************************** RM PROGRAM SALES *********************************************** */

// RM on hand grouped by program

const getRmByProgram = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM INVEN\' AS column, master_supplement.species_group AS maj_row, master_supplement.program AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) GROUP BY master_supplement.species_group, master_supplement.program',
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

const getRmInTransitByProgram = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM IN TRANSIT\' AS column, master_supplement.species_group AS maj_row, master_supplement.program AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND (perpetual_inventory.location_type = $2 OR perpetual_inventory.location_country <> perpetual_inventory.program_country) GROUP BY master_supplement.species_group, master_supplement.program',
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

const getRmAtLocationByProgram = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM ON HAND\' AS column, master_supplement.species_group AS maj_row, master_supplement.program AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 AND perpetual_inventory.location_country = perpetual_inventory.program_country GROUP BY master_supplement.species_group, master_supplement.program',
      ['RM', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** RM SPECIES GROUP *********************************************** */

// RM on hand grouped by species (includes in transit)

const getRmBySpecies = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM INVEN\' AS column, master_supplement.species_group AS maj_row, \'SUBTOTAL\' AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) GROUP BY master_supplement.species_group',
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

const getRmInTransitBySpecies = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM IN TRANSIT\' AS column, master_supplement.species_group AS maj_row, \'SUBTOTAL\' AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND (perpetual_inventory.location_type = $2 OR perpetual_inventory.location_country <> perpetual_inventory.program_country) GROUP BY master_supplement.species_group',
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

const getRmAtLocationBySepcies = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM ON HAND\' AS column, master_supplement.species_group AS maj_row, \'SUBTOTAL\' AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 AND perpetual_inventory.location_country = perpetual_inventory.program_country GROUP BY master_supplement.species_group',
      ['RM', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL INVEN *********************************************** */

// RM on hand grouped by species (includes in transit)

const getRmTotal = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM INVEN\' AS column, \'FG SALES\' AS maj_row, \'TOTAL\' AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory)',
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

const getRmInTransitTotal = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM IN TRANSIT\' AS column, \'FG SALES\' AS maj_row, \'TOTAL\' AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND (perpetual_inventory.location_type = $2 OR perpetual_inventory.location_country <> perpetual_inventory.program_country)',
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

const getRmAtLocationTotal = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
      'SELECT \'RM ON HAND\' AS column, \'FG SALES\' AS maj_row, \'TOTAL\' AS min_row, SUM(perpetual_inventory.on_hand_lbs) AS lbs, SUM(perpetual_inventory.cost_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.byproduct_type IS NULL AND master_supplement.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 AND perpetual_inventory.location_country = perpetual_inventory.program_country',
      ['RM', 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRmByProgram = getRmByProgram
module.exports.getRmInTransitByProgram = getRmInTransitByProgram
module.exports.getRmAtLocationByProgram = getRmAtLocationByProgram
module.exports.getRmBySpecies = getRmBySpecies
module.exports.getRmInTransitBySpecies = getRmInTransitBySpecies
module.exports.getRmAtLocationBySepcies = getRmAtLocationBySepcies
module.exports.getRmTotal = getRmTotal
module.exports.getRmInTransitTotal = getRmInTransitTotal
module.exports.getRmAtLocationTotal = getRmAtLocationTotal
