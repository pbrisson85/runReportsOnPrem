const getMajCodeGlMap = async fy => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to pull the maj_code_gl_map table ...`)

    // level 1 detail

    const response = await pgClient.query(
              'SELECT name, dept, sales, commission, discount, rebate, outbound, cogs FROM "salesReporting".maj_code_gl_map'
            ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getMajCodeGlMap
