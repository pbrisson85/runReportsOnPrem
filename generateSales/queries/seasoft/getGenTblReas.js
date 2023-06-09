const { createConnection } = require('../../database/seasoftODBC')

const getGenTbleReas = async () => {
  try {
    const odbcConn = await createConnection()

    console.log(`query ODBC for Invoice Archive Header ...`)

    const queryString = "SELECT {fn RTRIM(\"General Table File\".TABLE_CODE)} AS TABLE_CODE, {fn RTRIM(\"General Table File\".TABLE_DESC)} AS TABLE_DESC, {fn RTRIM(\"General Table File\".TABLE_FLD01)} AS TABLE_FLD01_ADJ_INV FROM 'General Table File' WHERE \"General Table File\".TABLE_ID = ?" //prettier-ignore

    const data = await odbcConn.query(queryString, ['REAS'])

    await odbcConn.close()

    return data
  } catch (error) {
    console.error(error)
  }
}

module.exports = getGenTbleReas
