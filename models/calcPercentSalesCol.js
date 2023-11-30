const calcPercentSalesCol = (totalData, eachRowData, colName) => {
  // get company total sales

  if (typeof totalData.lbs === 'undefined') {
    console.log('colName', colName)
    console.log('eachRowData', eachRowData)
    console.log(totalData)
  }

  const { lbs: coLbs, sales: coSales, cogs: coCogs, othp: coOthp } = totalData

  // Apply to each level of ytd sales column
  const percent_companySales = eachRowData.map(row => {
    const { lbs, sales, cogs, othp, column, l1_label, l2_label } = row

    return {
      ...row,
      column: colName,

      lbs_numerator: lbs,
      sales_numerator: sales,
      cogs_numerator: cogs,
      othp_numerator: othp,

      lbs_denominator: coLbs,
      sales_denominator: coSales,
      cogs_denominator: coCogs,
      othp_denominator: coOthp,

      percentFormat: true, // flag for the map sales rows model
    }
  })

  return percent_companySales
}

module.exports = calcPercentSalesCol
