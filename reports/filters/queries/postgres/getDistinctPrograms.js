const getDistinctPrograms = async fy => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get list of programs for filters ...`)

    const response = await pgClient.query(
      'SELECT DISTINCT(TRIM(ms.program)) AS label, (TRIM(ms.program)) AS "dataName" FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number WHERE sales_line_items.fiscal_year = $1',
      [fy]
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getDistinctPrograms
