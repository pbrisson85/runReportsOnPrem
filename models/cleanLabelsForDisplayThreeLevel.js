const _ = require('lodash')

const cleanLabelsForDisplay = flattenedMappedData => {
  const cacheData = _.cloneDeep(flattenedMappedData)

  let l1Value = ''
  let l2Value = ''

  cacheData.forEach((row, idx) => {
    // Set initial values
    if (idx === 0) {
      l1Value = row.l1_grouping
      l2Value = row.l2_grouping

      return
    }

    // If l1 grouping does not change then don't show it
    if (row.l1_grouping === l1Value) {
      flattenedMappedData[idx].l1_grouping = ''
    }

    // If l2 grouping does not change then don't show it
    if (row.l2_grouping === l2Value) {
      flattenedMappedData[idx].l2_grouping = ''
    }

    // If l2 grouping includes subtotal then update the labels
    if (row.l2_grouping.toUpperCase().includes('SUBTOTAL')) {
      flattenedMappedData[idx].l1_grouping = `${row.l1_grouping} SUBTOTAL`
      flattenedMappedData[idx].l2_grouping = ''
      flattenedMappedData[idx].l3_grouping = ''
    }

    // If l3 grouping includes subtotal then update the labels
    if (row.l3_grouping.toUpperCase().includes('SUBTOTAL') && !row.l2_grouping?.toUpperCase().includes('SUBTOTAL')) {
      flattenedMappedData[idx].l1_grouping = ''
      flattenedMappedData[idx].l2_grouping = `${row.l2_grouping} SUBTOTAL`
      flattenedMappedData[idx].l3_grouping = ''
    }

    // if l1 grouping does change, set new value
    if (row.l1_grouping !== l1Value) {
      l1Value = row.l1_grouping
    }

    // if l2 grouping does change, set new value
    if (row.l2_grouping !== l2Value) {
      l2Value = row.l2_grouping
    }
  })

  return flattenedMappedData
}

module.exports = cleanLabelsForDisplay
