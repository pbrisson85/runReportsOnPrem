const getLatestSaleDate = async config => {
  try {
    console.log(`${config.user} - Query Postgres for latest ship week ...`)

    const response = await sql`SELECT MAX(sales_orders.formatted_ship_date) AS formatted_ship_date FROM "salesReporting".sales_line_items AS sl`

    return response[0].formatted_ship_date
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getLatestSaleDate = getLatestSaleDate
