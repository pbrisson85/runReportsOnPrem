const { createConnection } = require('../../../../database/seasoftODBC')

const getGlDepartments = async () => {
  try {
    const odbcConn = await createConnection()

    console.log(`query ODBC for GL departments ...`)

    const queryString = "SELECT DEPARTMENT_NUMBER FROM \"GL Department File\" WHERE COMPANY_NUMBER = ?" //prettier-ignore

    const data = await odbcConn.query(queryString, ['0001'])

    await odbcConn.close()

    return data
  } catch (error) {
    console.error(error)
  }
}

module.exports = getGlDepartments
