// Remove species and replaces with empty string except for index 0 and first row after each subtotal (clean up data for front end display)
const cleanLabelsForDisplay = flattenedMappedData => {
  let subTotalFound = false
  const flattenedMappedData_cleaned = flattenedMappedData.map((row, idx) => {
    // first row has species
    if (idx === 0) return row

    if (typeof row.min_row === 'undefined' || idx === 0) console.log(row)

    // subtotal hit flip flag true but return hidden species flag
    if (row.min_row.toUpperCase() === 'SUBTOTAL') {
      subTotalFound = true
      return { ...row, hiddenLabel: true }
    }

    // subtotal or first row not hit. return hidden species flag
    if (!subTotalFound) return { ...row, hiddenLabel: true }

    // not first row, not subtotal, but a subtotal has been found. This is the first row after the subtotal. flip flag false for next row and return the species for this row
    subTotalFound = false
    return row
  })

  return flattenedMappedData_cleaned
}

module.exports = cleanLabelsForDisplay
