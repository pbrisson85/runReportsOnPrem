const cleanLabelsForDisplay = flattenedMappedData => {
  let subTotalFound = false
  flattenedMappedData.forEach((row, idx) => {
    // leave first row alone
    if (idx === 0) return row

    // subtotal hit flip flag true but return hidden species flag
    if (row.l2_grouping.toUpperCase().includes('TOTAL')) {
      subTotalFound = true

      // If row IS an l1 subtotal then change l1 label to '[name] SUBTOTAL'
      flattenedMappedData[idx].l1_grouping = `${flattenedMappedData[idx].l1_grouping} SUBTOTAL`
      flattenedMappedData[idx].l2_grouping = ''
      flattenedMappedData[idx].l3_grouping = ''
    }

    // If row is NOT an l1 subtotal, remove l1 label
    if (!subTotalFound) {
      flattenedMappedData[idx].l1_grouping = ''
    }

    // not first row, not subtotal, but a subtotal has been found. This is the first row after the subtotal. flip flag false for next row and return the species for this row
    subTotalFound = false
  })

  return flattenedMappedData
}

module.exports = cleanLabelsForDisplay
