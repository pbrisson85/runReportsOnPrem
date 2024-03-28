const sql = require('../../../../server')

const insertDataToTempTable = async (config, dataForTempTable, tempTableName) => {
  try {
    console.log(`${config.user} - insertDataToTempTable ...`)

    const response = await sql`
    INSERT INTO ${sql(tempTableName)} ${sql(dataForTempTable)}
    ` //prettier-ignore

    return
  } catch (error) {
    console.error(error)
    console.log(error.query)
    return error
  }
}

module.exports = insertDataToTempTable
