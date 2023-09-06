const { createConnection } = require('../../../database/seasoftODBC')

const getOrderInfo = async () => {
  try {
    const odbcConn = await createConnection()

    console.log(`query ODBC for order info ...`)

    const queryString = `
    
    SELECT 
      {fn RTRIM("Invoice Archive Order Info".DOCUMENT_NUMBER)} AS DOCUMENT_NUMBER, 
      {fn RTRIM("Invoice Archive Order Info".SHIPTO_STATE)} AS SHIPTO_STATE
    FROM 'Invoice Archive Order Info'
    WHERE "Invoice Archive Order Info".SHIPTO_STATE <> '' 
    ` //prettier-ignore

    const data = await odbcConn.query(queryString)

    await odbcConn.close()

    return data
  } catch (error) {
    console.error(error)
  }
}

module.exports = getOrderInfo
