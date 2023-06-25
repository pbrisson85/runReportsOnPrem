const getEarliestShipWk = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`Query Postgres for earliest ship week ...`)

    const response = await pgClient.query(
             'SELECT MIN(sales_orders.formatted_ship_date) AS formatted_ship_date FROM "salesReporting".sales_orders WHERE sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)',
            ) //prettier-ignore

    await pgClient.end()

    return response.rows[0].formatted_ship_date
  } catch (error) {
    console.error(error)
    return error
  }
}

const getLatestShipWk = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`Query Postgres for latest ship week ...`)

    const response = await pgClient.query(
                 'SELECT MAX(sales_orders.formatted_ship_date) AS formatted_ship_date FROM "salesReporting".sales_orders WHERE sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)',
                ) //prettier-ignore

    await pgClient.end()

    return response.rows[0].formatted_ship_date
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getEarliestShipWk = getEarliestShipWk
module.exports.getLatestShipWk = getLatestShipWk
