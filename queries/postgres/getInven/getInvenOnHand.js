// SUM OF ALL INVENTORY ON HAND

const getInvenOnHandByProgram = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for ${program} inventory totals ...`)

    const response = await pgClient.query(
      'SELECT SUM(on_hand_lbs) AS weight, SUM(cost_extended) AS extended_cost FROM "invenReporting".perpetual_inventory WHERE program = $1 AND item_type = $2 AND version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory)',
      [program, 'RM']
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// SUM OF INVENTORY IN TRANSIT

const getInvenInTransitByProgram = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for ${program} inventory totals ...`)

    const response = await pgClient.query(
      'SELECT SUM(on_hand_lbs) AS weight, SUM(cost_extended) AS extended_cost FROM "invenReporting".perpetual_inventory WHERE program = $1 AND item_type = $2 AND location_type = $3 AND version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory)',
      [program, 'RM', 'IN TRANSIT']
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}
