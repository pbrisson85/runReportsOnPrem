const calcYoyYtdSalesCol = (eachRowData, colName) => {
  const yoySales = eachRowData.map(row => {
    const cols = Object.keys(row)

    console.log('row: ', row)
    console.log('cols: ', cols)

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
