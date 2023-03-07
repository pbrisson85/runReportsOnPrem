const getMasterSupplement = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for inven master supplement ...`)

    const response = await pgClient.query(
      'SELECT TRIM(master_supplement.item_num) AS item_num, TRIM(master_supplement.description) AS description, TRIM(master_supplement.species) AS species, TRIM(master_supplement.inven_category) AS inven_category, TRIM(master_supplement.seafood_category) AS seafood_category, TRIM(master_supplement.item_type) AS item_type, TRIM(master_supplement.size_name) AS size_name, TRIM(master_supplement.byproduct_type) AS byproduct_type, TRIM(master_supplement.program) AS program, TRIM(master_supplement.species_group) AS species_group, TRIM(master_supplement.fg_treatment) AS fg_treatment FROM "invenReporting".master_supplement'
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getMasterSupplement
