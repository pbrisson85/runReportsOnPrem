const joinSalesData = (
  salesHeader_unflat,
  salesLines,
  invenSupplemental_unflat,
  mappedPeriodsPerDay,
  invReasCodes_unflat,
  salespersonMaster_unflat,
  shipToFile_unflat,
  customerMaster_unflat
) => {
  const joinedSalesData = salesLines.map((invoiceLine, idx) => {
    const dateArr = invoiceLine.ODBC_INVOICE_DATE.split('-')
    // result: [yyyy,m,d]

    const invoiceDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], 0, 0, 0, 0).toLocaleString('en-US', {
      timeZone: 'America/New_York',
    })

    const invReasCode = salesHeader_unflat[invoiceLine.ODBC_INVOICE_NUMBER].REASON_CODE
    const cust_code = salesHeader_unflat[invoiceLine.ODBC_INVOICE_NUMBER].CUSTOMER_CODE
    const shipto_code = salesHeader_unflat[invoiceLine.ODBC_INVOICE_NUMBER].SHIPTO_CODE

    return {
      ...invoiceLine,
      invenSupplemental: invenSupplemental_unflat[invoiceLine.ITEM_NUMBER],
      period: mappedPeriodsPerDay[invoiceDate],
      header: salesHeader_unflat[invoiceLine.ODBC_INVOICE_NUMBER],
      invReasCodes: invReasCode === null ? { TABLE_CODE: null, TABLE_DESC: null, TABLE_FLD01_ADJ_INV: null } : invReasCodes_unflat[invReasCode],
      salesPerson: salespersonMaster_unflat[invoiceLine.OUTSIDE_SALESPERSON_CODE][0],
      shipToFile: shipToFile_unflat[`${cust_code}-${shipto_code}`][0],
      customerMaster: customerMaster_unflat[cust_code][0],
    }
  })

  return joinedSalesData
}

module.exports = joinSalesData
