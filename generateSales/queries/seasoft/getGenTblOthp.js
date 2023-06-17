const { createConnection } = require('../../../database/seasoftODBC')

const getGenTbleReas = async () => {
  try {
    const odbcConn = await createConnection()

    console.log(`query ODBC for General Table OTHP ...`)

    const queryString = "SELECT {fn RTRIM(\"General Table File\".TABLE_FLD02)} AS GL_CODE, {fn RTRIM(\"General Table File\".TABLE_CODE)} AS OTHP_CODE FROM 'General Table File' WHERE \"General Table File\".TABLE_ID = ?" //prettier-ignore

    const data = await odbcConn.query(queryString, ['OTHP'])

    await odbcConn.close()

    return data
  } catch (error) {
    console.error(error)
  }
}

module.exports = getGenTbleReas
