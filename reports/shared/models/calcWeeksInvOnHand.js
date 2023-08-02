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
    console.log('row', row)

    const { lbs, cogs, l1_label, l2_label, l3_label } = row

    let lbsPerWeek = null
    let cogsPerWeek = null
    let key = null
    let calcData = null
    if (numLabels === 1) {
      console.log('numLabels === 1')

      key = `${l1_label}`
      lbsPerWeek = sales_unflat[key]?.lbs ?? 0
      lbsPerWeek = sales_unflat[key]?.cogs ?? 0

      console.log('key', key)
      console.log('sales_unflat[key]', sales_unflat[key])
    } else if (numLabels === 2) {
      console.log('numLabels === 2')

      key = `${l1_label}-${l2_label}`
      lbsPerWeek = sales_unflat[key]?.lbs ?? 0
      lbsPerWeek = sales_unflat[key]?.cogs ?? 0

      console.log('key', key)
      console.log('sales_unflat[key]', sales_unflat[key])
    } else if (numLabels === 3) {
      console.log('numLabels === 3')

      key = `${l1_label}-${l2_label}-${l3_label}`
      lbsPerWeek = sales_unflat[key]?.lbs ?? 0
      lbsPerWeek = sales_unflat[key]?.cogs ?? 0

      console.log('key', key)
      console.log('sales_unflat[key]', sales_unflat[key])
    } else {
      console.log('Error in calcWeeksInvOnHand.js: numLabels is not 1, 2, or 3. numLabels = ', numLabels)
      console.log('row', row)
      console.log('calcData', calcData)

      calcData = {
        ...row,
        column: colName,
        lbs: lbs,
        cogs: cogs,
      }

      return calcData
    }

    console.log('lbs', lbs)
    console.log('cogs', cogs)
    console.log('lbsPerWeek', lbsPerWeek)
    console.log('cogsPerWeek', cogsPerWeek)

    calcData = {
      ...row,
      column: colName,
      lbs: lbsPerWeek === 0 ? 0 : lbs / lbsPerWeek,
      cogs: cogsPerWeek === 0 ? 0 : cogs / cogsPerWeek,
    }

    console.log('calcData', calcData)

    return calcData
  })

  return weeksInvOnHand
}

module.exports = calcWeeksInvOnHand
