const { createConnection } = require('../../../database/seasoftODBC')

const getInvAllocFile = async (firstDayOfFy, firstDayOfNextFy) => {
  try {
    const odbcConn = await createConnection()

    console.log(`query ODBC for Invoice Allocation File for dates ${firstDayOfFy} to ${firstDayOfNextFy} ...`)

    const queryString = "SELECT \"Invoice Allocations\".INVOICE_DATE, {fn RTRIM(\"Invoice Allocations\".INVOICE_NUMBER)} AS INVOICE_NUMBER, {fn RTRIM(\"Invoice Allocations\".INVOICE_LINE_NUMBER)} AS INVOICE_LINE_NUMBER, {fn RTRIM(\"Invoice Allocations\".PRODUCT_NUMBER)} AS PRODUCT_NUMBER, \"Invoice Allocations\".EXPENSE_AMOUNT, {fn RTRIM(\"Invoice Allocations\".EXPENSE_CODE)} AS EXPENSE_CODE FROM 'Invoice Allocations' WHERE \"Invoice Allocations\".EXPENSE_CODE <> 'SALE' AND \"Invoice Allocations\".INVOICE_DATE >= ? AND \"Invoice Allocations\".INVOICE_DATE < ?" //prettier-ignore

    const data = await odbcConn.query(queryString, [firstDayOfFy, firstDayOfNextFy])

    await odbcConn.close()

    return data
  } catch (error) {
    console.error(error)
  }
}

module.exports = getInvAllocFile

/*
"SELECT \"Invoice Allocations\".INVOICE_DATE, \"Invoice Allocations\".INVOICE_NUMBER, \"Invoice Allocations\".INVOICE_LINE_NUMBER, \"Invoice Allocations\".PRODUCT_NUMBER, \"Invoice Allocations\".EXPENSE_AMOUNT, \"Invoice Allocations\".EXPENSE_CODE, \"General Table File\".TABLE_FLD02 FROM {OJ 'Invoice Allocations' LEFT OUTER JOIN 'General Table File' ON \"Invoice Allocations\".EXPENSE_CODE = \"General Table File\".TABLE_CODE} WHERE \"Invoice Allocations\".EXPENSE_CODE <> 'SALE' AND \"General Table File\".TABLE_ID = 'OTHP' AND \"Invoice Allocations\".INVOICE_DATE >= ? AND \"Invoice Allocations\".INVOICE_DATE < ?"
*/
