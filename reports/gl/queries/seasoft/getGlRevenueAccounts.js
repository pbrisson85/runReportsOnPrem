const { createConnection } = require('../../../../database/seasoftODBC')

const getGlRevenueAccounts = async () => {
  try {
    const odbcConn = await createConnection()

    console.log(`query ODBC for GL Revenue Accounts ...`)

    const queryString = "SELECT {fn RTRIM(ACCOUNT_NUMBER FROM)} \"GL Chart Of Accounts\" WHERE COMPANY_NUMBER = ? AND DESCRIPTION LIKE ? AND ACCOUNT_NUMBER < ?" //prettier-ignore

    const data = await odbcConn.query(queryString, ['0001', 'SAL%', 3800])

    await odbcConn.close()

    return data
  } catch (error) {
    console.error(error)
  }
}

module.exports = getGlRevenueAccounts
