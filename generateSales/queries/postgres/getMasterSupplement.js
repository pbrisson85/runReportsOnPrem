const getMasterSupplement = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for inven master supplement ...`)

    const response = await pgClient.query(
      'SELECT TRIM(ms.item_num) AS item_num, TRIM(ms.description) AS description, TRIM(ms.species) AS species, TRIM(ms.inven_category) AS inven_category, TRIM(ms.seafood_category) AS seafood_category, TRIM(ms.item_type) AS item_type, TRIM(ms.size_name) AS size_name, TRIM(ms.byproduct_type) AS byproduct_type, TRIM(ms.program) AS program, TRIM(ms.species_group) AS species_group, TRIM(ms.fg_treatment) AS fg_treatment FROM "invenReporting".master_supplement AS ms'
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getMasterSupplement
