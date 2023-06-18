const getContraSalesGlMap = async fy => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to pull the contra_sales_gl_map table ...`)

    // level 1 detail

    const response = await pgClient.query(
            'SELECT category, contra, allocation FROM "salesReporting".contra_sales_gl_map'
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getContraSalesGlMap
