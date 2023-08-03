const requestEmailNotification = require('../../../requests/requestEmail')

const unflattenByCompositKey = require('./unflattenByCompositKey')

const calcWeeksInvOnHand = (invenData, salesData, colName, numLabels) => {
  // Do not know how many columns the data is grouped by
  let sales_unflat = {}
  if (numLabels === 1) {
    sales_unflat = unflattenByCompositKey(salesData, { 1: 'l1_label' })
  } else if (numLabels === 2) {
    sales_unflat = unflattenByCompositKey(salesData, { 1: 'l1_label', 2: 'l2_label' })
  } else if (numLabels === 3) {
    sales_unflat = unflattenByCompositKey(salesData, { 1: 'l1_label', 2: 'l2_label', 3: 'l3_label' })
  } else {
    requestEmailNotification(`Error in calcWeeksInvOnHand.js: numLabels is not 1, 2, or 3. numLabels = ${numLabels}`)
  }

  const weeksInvOnHand = invenData.map(row => {
    const { lbs, cogs, l1_label, l2_label, l3_label } = row

    let lbsPerWeek = null
    let cogsPerWeek = null
    let key = null
    let calcData = null
    if (numLabels === 1) {
      key = `${l1_label}`
      lbsPerWeek = sales_unflat[key]?.lbs ?? 0
      cogsPerWeek = sales_unflat[key]?.cogs ?? 0
    } else if (numLabels === 2) {
      key = `${l1_label}-${l2_label}`
      lbsPerWeek = sales_unflat[key]?.lbs ?? 0
      cogsPerWeek = sales_unflat[key]?.cogs ?? 0
    } else if (numLabels === 3) {
      key = `${l1_label}-${l2_label}-${l3_label}`
      lbsPerWeek = sales_unflat[key]?.lbs ?? 0
      cogsPerWeek = sales_unflat[key]?.cogs ?? 0
    } else {
      calcData = {
        ...row,
        column: colName,
        lbs: 0,
        cogs: 0,
        weeksOnHandFlag: true, // in inventory rows map will not calc / lb, will only use the weight or cogs ratio
      }

      return calcData
    }

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
