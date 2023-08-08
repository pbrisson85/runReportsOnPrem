const unflattenByCompositKey = require('./unflattenByCompositKey')

const calcWeeksInvOnHand = (invenData, salesData, colName) => {
  // Do not know how many columns the data is grouped by
  const sales_unflat = unflattenByCompositKey(salesData, {
    1: 'l1_label',
    2: 'l2_label',
    3: 'l3_label',
    4: 'l4_label',
    5: 'l5_label',
    6: 'l6_label',
  })

  const weeksInvOnHand = invenData.map(row => {
    const { lbs, cogs, l1_label, l2_label, l3_label, l4_label, l5_label, l6_label } = row

    let lbsPerWeek = null
    let cogsPerWeek = null
    let key = null
    let calcData = null

    key = `${l1_label}-${l2_label}-${l3_label}-${l4_label}-${l5_label}-${l6_label}`
    lbsPerWeek = sales_unflat[key]?.lbs ?? 0
    cogsPerWeek = sales_unflat[key]?.cogs ?? 0

    calcData = {
      ...row,
      column: colName,
      lbs: lbsPerWeek === 0 ? 0 : lbs / lbsPerWeek,
      cogs: cogsPerWeek === 0 ? 0 : cogs / cogsPerWeek,
      weeksOnHandFlag: true, // in inventory rows map will not calc / lb, will only use the weight or cogs ratio
    }

    return calcData
  })

  return weeksInvOnHand
}

module.exports = calcWeeksInvOnHand
