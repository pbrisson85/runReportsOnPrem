const { createConnection } = require('../../../database/seasoftODBC')

const getOrderInfo = async () => {
  try {
    const odbcConn = await createConnection()

    console.log(`query ODBC for customer master file ...`)

    const queryString = `
    
    SELECT 
      {fn RTRIM("Customer Master File".DOCUMENT_NUMBER)} AS DOCUMENT_NUMBER, 
      {fn RTRIM("Customer Master File".SHIPTO_STATE)} AS SHIPTO_STATE
    FROM 'Invoice Archive Order Info'
    WHERE SHIPTO_STATE <> '' 
    ` //prettier-ignore

    const data = await odbcConn.query(queryString)

    await odbcConn.close()

    return data
  } catch (error) {
    console.error(error)
  }
}

module.exports = getOrderInfo
