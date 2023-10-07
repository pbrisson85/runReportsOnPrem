const calcAveWeeklySales = (eachRowData, colName, weeks) => {
  const aveWeeklySales = eachRowData.map(row => {
    const { lbs, sales, cogs, othp, column, l1_label, l2_label } = row

    return {
      ...row,
      column: colName,
      lbs: lbs / weeks,
      sales: sales / weeks,
      cogs: cogs / weeks,
      othp: othp / weeks,
    }
  })

  return aveWeeklySales
}

module.exports = calcAveWeeklySales
