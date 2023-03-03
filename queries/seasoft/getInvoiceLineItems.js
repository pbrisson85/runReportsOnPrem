const { createConnection } = require('../../database/seasoftODBC')

const getInvoiceLineItems = async (firstDayOfFy, firstDayOfNextFy) => {
  try {
    const odbcConn = await createConnection()

    console.log(`query ODBC for Invoice Archive Line Items ...`)

    const queryString = "SELECT {fn RTRIM(\"Invoice Archive Line Items\".ITEM_NUMBER)} AS ITEM_NUMBER, {fn RTRIM(\"Invoice Archive Line Items\".ITEM_DESCRIPTION_1)} AS ITEM_DESCRIPTION, \"Invoice Archive Line Items\".QTY_SHIPPED, {fn RTRIM(\"Invoice Archive Line Items\".PRICING_UNIT)} AS PRICING_UNIT,  \"Invoice Archive Line Items\".STOCK_QTY_SHIPPED, {fn RTRIM(\"Invoice Archive Line Items\".STOCK_UNIT_OF_MEASURE)} AS STOCK_UNIT_OF_MEASURE, \"Invoice Archive Line Items\".LIST_PRICE, \"Invoice Archive Line Items\".NET_PRICE_EXTENSION, \"Invoice Archive Line Items\".PRODUCT_ONLY_PRICE, \"Invoice Archive Line Items\".PRODUCT_ONLY_EXTENSION, \"Invoice Archive Line Items\".INVOICE_EXT_COST, {fn RTRIM(\"Invoice Archive Line Items\".ODBC_INVOICE_NUMBER)} AS INVOICE_NUMBER, {fn RTRIM(\"Invoice Archive Line Items\".ODBC_LINE_NUMBER)} AS ODBC_LINE_NUMBER, \"Invoice Archive Line Items\".ODBC_INVOICE_DATE, {fn RTRIM(\"Invoice Archive Line Items\".ORDER_LINE_KEY)} AS ORDER_LINE_KEY, \"Invoice Archive Line Items\".BILLING_WEIGHT, {fn RTRIM(\"Invoice Archive Line Items\".GL_DIST)} AS GL_DIST, {fn RTRIM(\"Invoice Archive Line Items\".INSIDE_SALESPERSON_CODE)} AS INSIDE_SALESPERSON_CODE, {fn RTRIM(\"Invoice Archive Line Items\".OUTSIDE_SALESPERSON_CODE)} AS OUTSIDE_SALESPERSON_CODE FROM 'Invoice Archive Line Items' WHERE \"Invoice Archive Line Items\".ODBC_INVOICE_DATE >= ? AND \"Invoice Archive Line Items\".ODBC_INVOICE_DATE < ?" //prettier-ignore

    const data = await odbcConn.query(queryString, [firstDayOfFy, firstDayOfNextFy])

    await odbcConn.close()

    return data
  } catch (error) {
    console.error(error)
  }
}

module.exports = getInvoiceLineItems
