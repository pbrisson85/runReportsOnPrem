const getDistinctProcLevels = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres master supplement to get proc levels for ${program} to build rows template ...`)

    const response = await pgClient.query(
      'SELECT DISTINCT(TRIM(master_supplement.fg_treatment)) AS fg_treatment, TRIM(master_supplement.item_type) AS type, TRIM(master_supplement.seafood_category) AS seafood_category FROM "salesReporting".master_supplement WHERE master_supplement.item_type = $1 AND master_supplement.program = $2 AND master_supplement.byproduct_type IS NULL',
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
