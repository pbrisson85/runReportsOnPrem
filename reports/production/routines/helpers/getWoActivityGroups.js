const sql = require('../../../server')

const getWoActivityGroups = async () => {
  try {
    console.log(`${user} - getWoActivityGroups ...`)

    const response = await sql`
        SELECT 
            MIN(sales_orders.formatted_ship_date) AS formatted_ship_date 
    
        FROM "salesReporting".sales_orders 
        
        WHERE sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)
      ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getWoActivityGroups
