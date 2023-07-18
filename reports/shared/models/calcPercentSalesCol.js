const calcPercentSalesCol = (totalData, eachRowData, colName) => {
  // get company total sales
  const { lbs: coLbs, sales: coSales, cogs: coCogs, othp: coOthp } = totalData

  // Apply to each level of ytd sales column
  const percent_companySales = eachRowData.map(row => {
    const { lbs, sales, cogs, othp, column, l1_label, l2_label } = row

    return {
      ...row,
      column: colName,
      lbs: lbs / coLbs,
      sales: sales / coSales,
      cogs: cogs / coCogs,
      othp: othp / coOthp,
      percentFormat: true, // flag for the map sales rows model
    }
  })

  return percent_companySales
}

module.exports = calcPercentSalesCol
