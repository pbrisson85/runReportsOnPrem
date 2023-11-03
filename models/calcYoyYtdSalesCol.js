const calcYoyYtdSalesCol = (eachRowData, colName) => {
  const yoySales = eachRowData.map((row, idx) => {
    console.log('row, idx ', row)

    const { lbs, sales, cogs, othp, column, l1_label, l2_label } = row

    return {
      ...row,
      column: colName,
      lbs: 1,
      sales: 1,
      cogs: 1,
      othp: 1,
    }
  })

  return yoySales
}

module.exports = calcYoyYtdSalesCol
