const sql = require('../../../../../server')

const dropTempTable = async tmpTableName => {
  try {
    console.log(`dropTempTable: ${tmpTableName} ...`)

    await sql`DROP TABLE IF EXISTS ${sql(tmpTableName)}`

    return
  } catch (error) {
    console.error(error)
    console.log(error.query)
    return error
  }
}

module.exports = dropTempTable
