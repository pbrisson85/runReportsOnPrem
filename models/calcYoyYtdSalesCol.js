const calcYoyYtdSalesCol = (eachRowData, colName) => {
  // manually filter out anything that is not 2022/2023

  const filteredData = eachRowData.filter(row => row.column === '2022_ytd' || row.column === '2023_ytd')

  console.log('filteredData', filteredData)

  const yoySales = filteredData.map((row, idx) => {
    //console.log('idx, row', idx, row)

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
