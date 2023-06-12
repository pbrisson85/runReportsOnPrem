const _ = require('lodash')

const cleanLabelsForDisplay = (flattenedMappedData, filter) => {
  const cacheData = _.cloneDeep(flattenedMappedData)

  let l1Value = ''
  let l2Value = ''

  cacheData.forEach((row, idx) => {
    // Set initial values
    if (idx === 0) {
      l1Value = row.l1_subtotal
      l2Value = row.l2_subtotal

      return
    }

    // If l1 grouping does not change then don't show it
    if (row.l1_subtotal === l1Value) {
      flattenedMappedData[idx].l1_subtotal = ''
    }

    // If l2 grouping does not change then don't show it
    if (row.l2_subtotal === l2Value) {
      flattenedMappedData[idx].l2_subtotal = ''
    }

    // If l2 grouping includes subtotal then update the labels
    if (row.l2_subtotal.toUpperCase().includes('SUBTOTAL')) {
      flattenedMappedData[idx].l1_subtotal = `${row.l1_subtotal} SUBTOTAL`
      flattenedMappedData[idx].l2_subtotal = ''
      flattenedMappedData[idx].l3_subtotal = ''
    }

    // If l3 grouping includes subtotal then update the labels
    if (row.l3_subtotal?.toUpperCase().includes('SUBTOTAL') && !row.l2_subtotal.toUpperCase().includes('SUBTOTAL')) {
      flattenedMappedData[idx].l1_subtotal = ''
      flattenedMappedData[idx].l2_subtotal = `${row.l2_subtotal} SUBTOTAL`
      flattenedMappedData[idx].l3_subtotal = ''
    }

    // if l1 grouping does change, set new value
    if (row.l1_subtotal !== l1Value) {
      l1Value = row.l1_subtotal
    }

    // if l2 grouping does change, set new value
    if (row.l2_subtotal !== l2Value) {
      l2Value = row.l2_subtotal
    }

    // If filter, show in total row as l1 label
    if (filter && idx === cacheData.length - 1) {
      flattenedMappedData[idx].l1_subtotal = filter
      flattenedMappedData[idx].l2_subtotal = 'FG'
    }
  })

  return flattenedMappedData
}

module.exports = cleanLabelsForDisplay
