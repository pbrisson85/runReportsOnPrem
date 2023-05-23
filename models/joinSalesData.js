const joinSalesData = (salesHeader_unflat, salesLines, invenSupplemental_unflat, mappedPeriodsPerDay, invReasCodes_unflat) => {
  const joinedSalesData = salesLines.map(invoiceLine => {
    const dateArr = invoiceLine.ODBC_INVOICE_DATE.split('-')
    // result: [yyyy,m,d]

    const invoiceDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], 0, 0, 0, 0).toLocaleString('en-US', {
      timeZone: 'America/New_York',
    })

    const invReasCode = salesHeader_unflat[invoiceLine.ODBC_INVOICE_NUMBER].REASON_CODE

    if (invoiceLine.ODBC_INVOICE_NUMBER === '544211D') {
      console.log('invoiceLine', invoiceLine)
      console.log('invoiceDate', invoiceDate)

      console.log('mappedPeriodsPerDay[invoiceDate]', mappedPeriodsPerDay[invoiceDate])
      console.log('mappedPeriodsPerDay[04-01-2019]', mappedPeriodsPerDay['04-01-2019'])
    }

    return {
      ...invoiceLine,
      invenSupplemental: invenSupplemental_unflat[invoiceLine.ITEM_NUMBER],
      period: mappedPeriodsPerDay[invoiceDate],
      header: salesHeader_unflat[invoiceLine.ODBC_INVOICE_NUMBER],
      invReasCodes: invReasCode === null ? { TABLE_CODE: null, TABLE_DESC: null, TABLE_FLD01_ADJ_INV: null } : invReasCodes_unflat[invReasCode],
    }
  })

  return joinedSalesData
}

module.exports = joinSalesData
