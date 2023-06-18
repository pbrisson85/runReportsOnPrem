const { createConnection } = require('../../../../database/seasoftODBC')

const getGlCogsAccounts = async () => {
  try {
    const odbcConn = await createConnection()

    console.log(`query ODBC for GL departments ...`)

    const queryString = "SELECT ACCOUNT_NUMBER FROM \"GL Chart Of Accounts\" WHERE COMPANY_NUMBER = ? AND DESCRIPTION LIKE ?'" //prettier-ignore

    const data = await odbcConn.query(queryString, ['0001', 'COG%'])

    await odbcConn.close()

    return data
  } catch (error) {
    console.error(error)
  }
}

module.exports = getGlCogsAccounts
