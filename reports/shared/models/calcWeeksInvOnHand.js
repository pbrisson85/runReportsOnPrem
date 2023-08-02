const calcWeeksInvOnHand = (invenData, salesData, colName) => {
  console.log('invenData', invenData)
  console.log('salesData', salesData)

  const weeksInvOnHand = invenData.map(row => {
    const { lbs, sales, cogs, othp, column, l1_label, l2_label } = row

    return {
      ...row,
      column: colName,
      lbs: lbs,
      sales: sales,
      cogs: cogs,
      othp: othp,
    }
  })

  return weeksInvOnHand
}

module.exports = calcWeeksInvOnHand
