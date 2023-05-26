/* *********************************************** RM PROGRAM SALES *********************************************** */

// RM on hand grouped by program (includes in transit)

const getRmOnOrderByProgram = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
       'SELECT \'RM ON ORDER\' AS column, master_supplement.species_group AS maj_row, master_supplement.program AS min_row, SUM(on_order_lbs) AS lbs, SUM(on_order_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.item_type = $1 AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) GROUP BY master_supplement.species_group, master_supplement.program', ['RM']
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** RM SPECIES GROUP *********************************************** */

const getRmOnOrderBySpecies = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
         'SELECT \'RM ON ORDER\' AS column, master_supplement.species_group AS maj_row, \'SUBTOTAL\' AS min_row, SUM(on_order_lbs) AS lbs, SUM(on_order_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.item_type = $1 AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) GROUP BY master_supplement.species_group', ['RM']
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL INVEN *********************************************** */

const getRmOnOrderTotal = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for RM on hand ...`)

    const response = await pgClient.query(
         'SELECT \'RM ON ORDER\' AS column, \'Rm SALES\' AS maj_row, \'TOTAL\' AS min_row, SUM(on_order_lbs) AS lbs, SUM(on_order_extended) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = perpetual_inventory.item_number WHERE master_supplement.item_type = $1 AND perpetual_inventory.on_order_lbs <> 0 AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory)', ['RM']
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRmOnOrderByProgram = getRmOnOrderByProgram
module.exports.getRmOnOrderBySpecies = getRmOnOrderBySpecies
module.exports.getRmOnOrderTotal = getRmOnOrderTotal
