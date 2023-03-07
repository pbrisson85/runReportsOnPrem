const getDistinctProcLevels = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres master supplement to get proc levels for ${program} to build rows template ...`)

    const response = await pgClient.query(
      'SELECT DISTINCT(TRIM(master_supplement.fg_treatment)) AS subRow FROM "salesReporting".sales_line_items WHERE sales_line_items.item_type = $1 AND sales_line_items.program = $2 AND sales_line_items.byproduct_type IS NULL',
      ['FG', program]
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getDistinctProcLevels
