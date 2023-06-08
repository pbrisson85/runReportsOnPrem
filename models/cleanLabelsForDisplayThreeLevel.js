const cleanLabelsForDisplay = flattenedMappedData => {
  let subTotalFound = false
  flattenedMappedData.forEach((row, idx) => {
    subTotalFound = testL1Subtotal(row, idx, subTotalFound, flattenedMappedData)
    subTotalFound = testL2Subtotal(row, idx, subTotalFound, flattenedMappedData)
  })

  return flattenedMappedData
}

const testL1Subtotal = (row, idx, subTotalFound, flattenedMappedData) => {
  console.log('entering testL1Subtotal and subTotalFound is :', subTotalFound)
  console.log('undeited labels', row.l1_grouping, row.l2_grouping, row.l3_grouping)

  // leave first row alone
  if (idx === 0) return subTotalFound

  // subtotal hit flip flag true but return hidden species flag
  if (row.l2_grouping.toUpperCase().includes('SUBTOTAL')) {
    subTotalFound = true
    console.log('l1 subtotal found')

    // If row IS an l1 subtotal then change l1 label to '[name] SUBTOTAL'
    flattenedMappedData[idx].l1_grouping = `${flattenedMappedData[idx].l1_grouping} SUBTOTAL`
    flattenedMappedData[idx].l2_grouping = ''
    flattenedMappedData[idx].l3_grouping = ''
    return subTotalFound
  }

  // If row is NOT an l1 subtotal, remove l1 label
  if (!subTotalFound) {
    flattenedMappedData[idx].l1_grouping = ''
    console.log('l1 subtotal NOT found')
    return subTotalFound
  }

  // not first row, not subtotal, but a subtotal has been found. This is the first row after the subtotal. flip flag false for next row and return the species for this row
  subTotalFound = false
  console.log('PRIOR L1 was subtotal. Resetting flag to false')
  return subTotalFound
}

const testL2Subtotal = (row, idx, subTotalFound, flattenedMappedData) => {
  console.log('entering testL2Subtotal and subTotalFound is :', subTotalFound)
  console.log('undeited labels', row.l1_grouping, row.l2_grouping, row.l3_grouping)

  // leave first row alone
  if (idx === 0) return subTotalFound

  // subtotal hit flip flag true but return hidden species flag
  if (row.l3_grouping.toUpperCase().includes('SUBTOTAL')) {
    subTotalFound = true

    // If row IS an l2 subtotal then change l1 label to '[name] SUBTOTAL'
    flattenedMappedData[idx].l1_grouping = ''
    flattenedMappedData[idx].l2_grouping = `${flattenedMappedData[idx].l2_grouping} SUBTOTAL`
    flattenedMappedData[idx].l3_grouping = ''
    return subTotalFound
  }

  // If row is NOT an l1 subtotal, remove l1 label
  if (!subTotalFound) {
    // flattenedMappedData[idx].l2_grouping = ''
    return subTotalFound
  }

  // not first row, not subtotal, but a subtotal has been found. This is the first row after the subtotal. flip flag false for next row and return the species for this row
  subTotalFound = false
  return subTotalFound
}

module.exports = cleanLabelsForDisplay
