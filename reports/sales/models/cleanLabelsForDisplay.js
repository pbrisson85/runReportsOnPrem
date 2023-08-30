const _ = require('lodash')

const cleanLabelsForDisplay = (flattenedMappedData, config) => {
  const keys = Object.keys(flattenedMappedData)
  console.log('row 1', flattenedMappedData[keys[0]])
  console.log('row 2', flattenedMappedData[keys[1]])
  console.log('row 3', flattenedMappedData[keys[2]])
  console.log('row 4', flattenedMappedData[keys[3]])
  console.log('row 5', flattenedMappedData[keys[4]])

  /*
  
  level 0

    l1_label: 'FG SALES',
    l2_label: 'TOTAL',
    l3_label: 'TOTAL',
    l4_label: 'TOTAL',

  level 1

    l1_label: '',
    l2_label: 'SUBTOTAL',
    l3_label: 'SUBTOTAL',
    l4_label: 'SUBTOTAL',

  level 2

    l1_label: '',
    l2_label: '',
    l3_label: 'SUBTOTAL',
    l4_label: 'SUBTOTAL',

  level 3

    l1_label: '',
    l2_label: '',
    l3_label: '',
    l4_label: 'SUBTOTAL',

  level 4  
  
    l1_label: '',
    l2_label: '',
    l3_label: '',
    l4_label: '',
  
  */

  const cacheData = _.cloneDeep(flattenedMappedData)

  // Need to track when the l1, l2, l3, l4 values change so that we can hide them except for the first occurance
  let l1Value = ''
  let l2Value = ''
  let l3Value = ''

  cacheData.forEach((row, idx) => {
    // Save the original label in a "filter" value so that the front end can pass back on API calls
    flattenedMappedData[idx].l1_filter = row.l1_label
    flattenedMappedData[idx].l2_filter = row.l2_label
    flattenedMappedData[idx].l3_filter = row.l3_label
    flattenedMappedData[idx].l4_filter = row.l4_label

    // Set initial values
    if (idx === 0) {
      l1Value = row.l1_label
      l2Value = row.l2_label
      l3Value = row.l3_label // NEW **

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

    // If l3 grouping does not change then don't show it
    if (row.l3_label === l3Value) {
      flattenedMappedData[idx].l3_label = ''
    }

    // always update the dataLevel 1 subtotal label
    if (row.datalevel === 1) {
      flattenedMappedData[idx].l1_label = `${row.l1_label} SUBTOTAL`
      flattenedMappedData[idx].l2_label = ''
      flattenedMappedData[idx].l3_label = ''
      flattenedMappedData[idx].l4_label = ''
    }

    // If dataLevel 2 and there is a dataLevel 3 then update as a subtotal label
    if (row.datalevel === 2 && config.l3_field) {
      flattenedMappedData[idx].l1_label = ''
      flattenedMappedData[idx].l2_label = `${row.l2_label} SUBTOTAL`
      flattenedMappedData[idx].l3_label = ''
      flattenedMappedData[idx].l4_label = ''
    }

    // If dataLevel 3 and there is a dataLevel 4 then update as a subtotal label
    if (row.datalevel === 3 && config.l4_field) {
      flattenedMappedData[idx].l1_label = ''
      flattenedMappedData[idx].l2_label = ''
      flattenedMappedData[idx].l3_label = `${row.l3_label} SUBTOTAL`
      flattenedMappedData[idx].l4_label = ''
    }

    // if l1 grouping does change, set new value
    if (row.l1_label !== l1Value) {
      l1Value = row.l1_label
    }

    // if l2 grouping does change, set new value
    if (row.l2_label !== l2Value) {
      l2Value = row.l2_label
    }

    // if l3 grouping does change, set new value
    if (row.l3_label !== l3Value) {
      l3Value = row.l3_label
    }

    // re-label total row with program filter
    if (config.program && idx === cacheData.length - 1) {
      flattenedMappedData[idx].l1_label = `${config.program} FG`
    }
  })

  return flattenedMappedData
}

module.exports = cleanLabelsForDisplay
