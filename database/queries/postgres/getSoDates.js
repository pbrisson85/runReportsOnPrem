const sql = require('../../../server')

const getEarliestShipWk = async config => {
  try {
    console.log(`${config.user} - Query Postgres for earliest ship week ...`)

    const response =
      await sql`SELECT MIN(sales_orders.formatted_ship_date) AS formatted_ship_date FROM "salesReporting".sales_orders WHERE sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)`

    return response[0].formatted_ship_date
  } catch (error) {
    console.error(error)
    return error
  }
}

const getLatestShipWk = async config => {
  try {
    console.log(`${config.user} - Query Postgres for latest ship week ...`)

    const response =
      await sql`SELECT MAX(sales_orders.formatted_ship_date) AS formatted_ship_date FROM "salesReporting".sales_orders WHERE sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)`

    return response[0].formatted_ship_date
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getEarliestShipWk = getEarliestShipWk
module.exports.getLatestShipWk = getLatestShipWk
