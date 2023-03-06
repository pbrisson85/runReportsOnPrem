const { createConnection } = require('../../database/seasoftODBC')

const getInvoiceHeader = async (firstDayOfFy, firstDayOfNextFy) => {
  try {
    const odbcConn = await createConnection()

    console.log(`query ODBC for Invoice Archive Header ...`)

    const queryString = "SELECT {fn RTRIM(\"Invoice Archive Header\".INVOICE_NUMBER)} AS INVOICE_NUMBER, {fn RTRIM(\"Invoice Archive Header\".ORIGINAL_ORDER_INVOICE)} AS ORIGINAL_ORDER_INVOICE, {fn RTRIM(\"Invoice Archive Header\".DOCUMENT_NUMBER)} AS DOCUMENT_NUMBER, \"Invoice Archive Header\".INVOICE_DATE, \"Invoice Archive Header\".DATE_SHIPPED, \"Invoice Archive Header\".SHIP_DATE, \"Invoice Archive Header\".GL_POSTING_DATE, {fn RTRIM(\"Invoice Archive Header\".CUSTOMER_CODE)} AS CUSTOMER_CODE, {fn RTRIM(\"Invoice Archive Header\".CUSTOMER_NAME)} AS CUSTOMER_NAME, {fn RTRIM(\"Invoice Archive Header\".SHIPTO_CODE)} AS SHIPTO_CODE, {fn RTRIM(\"Invoice Archive Header\".TRUCK_ROUTE)} AS TRUCK_ROUTE, {fn RTRIM(\"Invoice Archive Header\".CUSTOMER_ORDER_NUMBER)} AS CUSTOMER_ORDER_NUMBER, {fn RTRIM(\"Invoice Archive Header\".SHIP_METHOD)} AS SHIP_METHOD, {fn RTRIM(\"Invoice Archive Header\".REASON_CODE)} AS REASON_CODE, {fn RTRIM(\"Invoice Archive Header\".CUSTOMER_TERMS_CODE)} AS CUSTOMER_TERMS_CODE, {fn RTRIM(\"Invoice Archive Header\".SHIP_VIA_CODE)} AS SHIP_VIA_CODE FROM 'Invoice Archive Header' WHERE \"Invoice Archive Header\".INVOICE_DATE >= ? AND \"Invoice Archive Header\".INVOICE_DATE < ?" //prettier-ignore

    const data = await odbcConn.query(queryString, [firstDayOfFy, firstDayOfNextFy])

    await odbcConn.close()

    return data
  } catch (error) {
    console.error(error)
  }
}

module.exports = getInvoiceHeader
