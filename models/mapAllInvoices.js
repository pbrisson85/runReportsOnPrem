const mapAllInvoices = (sales, invenSupplemental_unflat, mappedPeriodsPerDay) => {
  const mappedSales = sales
    .map(invoiceLine => {
      const dateArr = invoiceLine.ODBC_INVOICE_DATE.split('-')
      // result: [yyyy,m,d]

      const invoiceDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], 0, 0, 0, 0).toLocaleString('en-US', {
        timeZone: 'America/New_York',
      })

      return {
        ...invoiceLine,
        invenSupplemental: invenSupplemental_unflat[invoiceLine.ITEM_NUMBER],
        period: mappedPeriodsPerDay[invoiceDate],
      }
    })
    .filter(invoiceLine => {
      console.log(invoiceLine.ITEM_NUMBER)
      return invenSupplemental_unflat[invoiceLine.ITEM_NUMBER].inven_category === 'SEAFOOD'
    })

  return mappedSales
}

module.exports = mapAllInvoices
