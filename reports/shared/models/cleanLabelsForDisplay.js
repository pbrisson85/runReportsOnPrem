const _ = require('lodash')

const cleanLabelsForDisplay = (flattenedMappedData, filter) => {
  const cacheData = _.cloneDeep(flattenedMappedData)

  let l1Value = ''
  let l2Value = ''

  cacheData.forEach((row, idx) => {
    // given that original data is being mutated, adding the original "label" as the "filter" value so front end can provide it back to the backend when requesting detail
    row.l1_filter = row.l1_label
    row.l2_filter = row.l2_label
    row.l3_filter = row.l3_label

    // Set initial values
    if (idx === 0) {
      l1Value = row.l1_label
      l2Value = row.l2_label

      return
    }

    // If l1 grouping does not change then don't show it
    if (row.l1_label === l1Value) {
      flattenedMappedData[idx].l1_label = ''
    }

    // If l2 grouping does not change then don't show it
    if (row.l2_label === l2Value) {
      flattenedMappedData[idx].l2_label = ''
    }

    // If l2 grouping includes subtotal then update the labels
    if (row.l2_label.toUpperCase().includes('SUBTOTAL')) {
      flattenedMappedData[idx].l1_label = `${row.l1_label} SUBTOTAL`
      flattenedMappedData[idx].l2_label = ''
      flattenedMappedData[idx].l3_label = ''
    }

    // If l3 grouping includes subtotal then update the labels
    if (row.l3_label?.toUpperCase().includes('SUBTOTAL') && !row.l2_label.toUpperCase().includes('SUBTOTAL')) {
      flattenedMappedData[idx].l1_label = ''
      flattenedMappedData[idx].l2_label = `${row.l2_label} SUBTOTAL`
      flattenedMappedData[idx].l3_label = ''
    }

    // if l1 grouping does change, set new value
    if (row.l1_label !== l1Value) {
      l1Value = row.l1_label
    }

    // if l2 grouping does change, set new value
    if (row.l2_label !== l2Value) {
      l2Value = row.l2_label
    }

    // If filter, show in total row as l1 label
    if (filter && idx === cacheData.length - 1) {
      flattenedMappedData[idx].l1_label = `${filter} FG`
    }
  })

  return flattenedMappedData
}

module.exports = cleanLabelsForDisplay
