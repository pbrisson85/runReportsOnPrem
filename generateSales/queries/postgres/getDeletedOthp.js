const getDeletedOthp = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for deleted othp table ...`)

    const response = await pgClient.query('SELECT t.othp_code, t.contra FROM "salesReporting".deleted_othp AS t')

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getDeletedOthp
