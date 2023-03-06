const { createConnection } = require('../../database/seasoftODBC')

const getInvoiceAllocationsTable = async (firstDayOfFy, firstDayOfNextFy) => {
  try {
    const odbcConn = await createConnection()

    console.log(`query ODBC for Invoice Allocations ...`)

    const queryString = "SELECT {fn RTRIM(\"Invoice Allocations\".INVOICE_NUMBER)} AS INVOICE_NUMBER, {fn RTRIM(\"Invoice Allocations\".INVOICE_LINE_NUMBER)} AS INVOICE_LINE_NUMBER, \"Invoice Allocations\".INVOICE_DATE, \"Invoice Allocations\".EXPENSE_APPLIED_DATE, {fn RTRIM(\"Invoice Allocations\".EXPENSE_CODE)} AS EXPENSE_CODE, {fn RTRIM(\"Invoice Allocations\".EXPENSE_DESCRIPTION)} AS EXPENSE_DESCRIPTION, \"Invoice Allocations\".EXPENSE_AMOUNT, {fn RTRIM(\"Invoice Allocations\".CUSTOMER_CODE)} AS CUSTOMER_CODE, {fn RTRIM(\"Invoice Allocations\".PRODUCT_NUMBER)} AS PRODUCT_NUMBER FROM 'Invoice Allocations' WHERE \"Invoice Allocations\".INVOICE_DATE >= ? AND \"Invoice Allocations\".INVOICE_DATE < ? AND \"Invoice Allocations\".EXPENSE_CODE <> 'SALE'" //prettier-ignore

    const data = await odbcConn.query(queryString, [firstDayOfFy, firstDayOfNextFy])

    await odbcConn.close()

    return data
  } catch (error) {
    console.error(error)
  }
}

module.exports = getInvoiceAllocationsTable
