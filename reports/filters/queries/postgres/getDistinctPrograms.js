const getDistinctPrograms = async fy => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get list of programs for filters ...`)

    /*
    Original query:

    'SELECT DISTINCT(TRIM(ms.program)) AS label, (TRIM(ms.program)) AS "dataName" FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number WHERE sales_line_items.fiscal_year = $1'
    */

    const response = await pgClient.query(
      'SELECT DISTINCT(TRIM(ms.program)) AS label, (TRIM(ms.program)) AS "dataName" FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $2 AND sales_line_items.fiscal_year = $1 UNION SELECT DISTINCT(TRIM(ms.program)) AS label, (TRIM(ms.program)) AS "dataName" FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $2 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) UNION SELECT DISTINCT(TRIM(ms.program)) AS label, (TRIM(ms.program)) AS "dataName" FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.byproduct_type IS NULL AND ms.item_type = $2 AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders)',
      [fy, 'FG']
    )

    await pgClient.end()

    const all = {
      label: 'ALL',
      dataName: 'all',
    }

    const filter = [all, ...response.rows]

    return filter
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getDistinctPrograms
