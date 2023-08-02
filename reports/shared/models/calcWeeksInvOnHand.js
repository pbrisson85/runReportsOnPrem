const requestEmailNotification = require('../../../requests/requestEmail')

const unflattenByCompositKey = require('./unflattenByCompositKey')

const calcWeeksInvOnHand = (invenData, salesData, colName, numLabels) => {
  console.log('invenData', invenData)
  console.log('salesData', salesData)

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

  console.log('sales_unflat', sales_unflat)

  const weeksInvOnHand = invenData.map(row => {
    console.log('row', row)

    const { lbs, cogs, l1_label, l2_label, l3_label } = row

    let lbsPerWeek = null
    let cogsPerWeek = null
    let key = null
    if (numLabels === 1) {
      key = `${l1_label}`
      lbsPerWeek = sales_unflat[key].lbs
      lbsPerWeek = sales_unflat[key].cogs
    } else if (numLabels === 2) {
      key = `${l1_label}-${l2_label}`
      lbsPerWeek = sales_unflat[key].lbs
      lbsPerWeek = sales_unflat[key].cogs
    } else if (numLabels === 3) {
      key = `${l1_label}-${l2_label}-${l3_label}`
      lbsPerWeek = sales_unflat[key].lbs
      lbsPerWeek = sales_unflat[key].cogs
    } else {
      return {
        ...row,
        column: colName,
        lbs: lbs / lbsPerWeek,
        cogs: cogs / cogsPerWeek,
      }
    }

    return {
      ...row,
      column: colName,
      lbs: lbs,
      cogs: cogs,
    }
  })

  return weeksInvOnHand
}

module.exports = calcWeeksInvOnHand
