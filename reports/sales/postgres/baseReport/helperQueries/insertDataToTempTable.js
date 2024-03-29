const sql = require('../../../../../server')

const insertDataToTempTable = async (config, dataForTempTable, tempTableName) => {
  try {
    console.log(`${config.user} - insertDataToTempTable ...`)

    let promises = []
    for (let i = 0; i < dataForTempTable.length; i++) {
      const row = dataForTempTable[i]

      promises.push(
      sql`
        INSERT INTO ${sql(tempTableName)} (${sql(row)})
        `) //prettier-ignore
    }

    await Promise.all(promises)

    // const response = await sql`
    // INSERT INTO ${sql(tempTableName)} ${sql(dataForTempTable)}
    // ` //prettier-ignore

    return
  } catch (error) {
    console.log(error)
    // console.log(error.query)
    console.log(error.message)
    return error
  }
}

module.exports = insertDataToTempTable
