const mapAllInvoices = (salesHeader_unflat, salesLines, invenSupplemental_unflat, mappedPeriodsPerDay, invReasCodes_unflat) => {
  const mappedSales = salesLines.map(invoiceLine => {
    const dateArr = invoiceLine.ODBC_INVOICE_DATE.split('-')
    // result: [yyyy,m,d]

    const invoiceDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], 0, 0, 0, 0).toLocaleString('en-US', {
      timeZone: 'America/New_York',
    })

    return {
      ...invoiceLine,
      invenSupplemental: invenSupplemental_unflat[invoiceLine.ITEM_NUMBER],
      period: mappedPeriodsPerDay[invoiceDate],
      header: salesHeader_unflat[invoiceLine.ODBC_INVOICE_NUMBER],
      invReasCodes: invReasCodes_unflat[salesHeader_unflat[invoiceLine.ODBC_INVOICE_NUMBER].REASON_CODE],
    }
  })

  return mappedSales
}

module.exports = mapAllInvoices
