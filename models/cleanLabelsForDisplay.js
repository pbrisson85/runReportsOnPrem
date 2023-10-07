const _ = require('lodash')

const cleanLabelsForDisplay = (flattenedMappedData, config) => {
  /* TEST */ let collapsedLabels = true

  const shiftTotals = config?.subtotalRowFormats?.shiftTotals
  const shiftTotalsCss = config?.subtotalRowFormats?.shiftTotalsCss
  const dataLabelInSubtotals = config?.subtotalRowFormats?.dataLabelInSubtotals
  const subtotalLabelInSubtotals = config?.subtotalRowFormats?.subtotalLabelInSubtotals

  const cacheData = _.cloneDeep(flattenedMappedData)

  // determine highest data level (how many label cols) to know how to shift all to the
  let maxLevel = 0
  if (config.l1_field) maxLevel = 1
  if (config.l2_field) maxLevel = 2
  if (config.l3_field) maxLevel = 3
  if (config.l4_field) maxLevel = 4

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
      l3Value = row.l3_label
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
      const dataLabel = dataLabelInSubtotals ? row.l1_label : ''
      const subtotalLabel = subtotalLabelInSubtotals ? ' subtotal' : ''
      if (collapsedLabels) {
        flattenedMappedData[idx].l1_label = maxLevel === 1 ? `${dataLabel}${subtotalLabel}` : ''
        flattenedMappedData[idx].l2_label = maxLevel === 2 ? `${dataLabel}${subtotalLabel}` : ''
        flattenedMappedData[idx].l3_label = maxLevel === 3 ? `${dataLabel}${subtotalLabel}` : ''
        flattenedMappedData[idx].l4_label = maxLevel === 4 ? `${dataLabel}${subtotalLabel}` : ''
      } else if (shiftTotals || shiftTotalsCss) {
        flattenedMappedData[idx].l1_label = ''
        flattenedMappedData[idx].l2_label = `${dataLabel}${subtotalLabel}`
        flattenedMappedData[idx].l3_label = ''
        flattenedMappedData[idx].l4_label = ''
      } else {
        flattenedMappedData[idx].l1_label = `${dataLabel}${subtotalLabel}`
        flattenedMappedData[idx].l2_label = ''
        flattenedMappedData[idx].l3_label = ''
        flattenedMappedData[idx].l4_label = ''
      }

      if (shiftTotalsCss) {
        flattenedMappedData[idx].l2_total = true
        flattenedMappedData[idx].shiftTotalsCss = true
      } else {
        flattenedMappedData[idx].l1_total = true
      }
    }

    // If dataLevel 2 and there is a dataLevel 3 then update as a subtotal label
    if (row.datalevel === 2 && config.l3_field) {
      const dataLabel = dataLabelInSubtotals ? row.l2_label : ''
      const subtotalLabel = subtotalLabelInSubtotals ? ' subtotal' : ''

      if (collapsedLabels) {
        flattenedMappedData[idx].l1_label = maxLevel === 1 ? `${dataLabel}${subtotalLabel}` : ''
        flattenedMappedData[idx].l2_label = maxLevel === 2 ? `${dataLabel}${subtotalLabel}` : ''
        flattenedMappedData[idx].l3_label = maxLevel === 3 ? `${dataLabel}${subtotalLabel}` : ''
        flattenedMappedData[idx].l4_label = maxLevel === 4 ? `${dataLabel}${subtotalLabel}` : ''
      } else if (shiftTotals || shiftTotalsCss) {
        flattenedMappedData[idx].l1_label = ''
        flattenedMappedData[idx].l2_label = ''
        flattenedMappedData[idx].l3_label = `${dataLabel}${subtotalLabel}`
        flattenedMappedData[idx].l4_label = ''
      } else {
        flattenedMappedData[idx].l1_label = ''
        flattenedMappedData[idx].l2_label = `${dataLabel}${subtotalLabel}`
        flattenedMappedData[idx].l3_label = ''
        flattenedMappedData[idx].l4_label = ''
      }

      if (shiftTotalsCss) {
        flattenedMappedData[idx].l3_total = true
        flattenedMappedData[idx].shiftTotalsCss = true
      } else {
        flattenedMappedData[idx].l2_total = true
      }
    }

    // If dataLevel 3 and there is a dataLevel 4 then update as a subtotal label
    if (row.datalevel === 3 && config.l4_field) {
      const dataLabel = dataLabelInSubtotals ? row.l3_label : ''
      const subtotalLabel = subtotalLabelInSubtotals ? ' subtotal' : ''

      if (collapsedLabels) {
        flattenedMappedData[idx].l1_label = maxLevel === 1 ? `${dataLabel}${subtotalLabel}` : ''
        flattenedMappedData[idx].l2_label = maxLevel === 2 ? `${dataLabel}${subtotalLabel}` : ''
        flattenedMappedData[idx].l3_label = maxLevel === 3 ? `${dataLabel}${subtotalLabel}` : ''
        flattenedMappedData[idx].l4_label = maxLevel === 4 ? `${dataLabel}${subtotalLabel}` : ''
      } else if (shiftTotals || shiftTotalsCss) {
        flattenedMappedData[idx].l1_label = ''
        flattenedMappedData[idx].l2_label = ''
        flattenedMappedData[idx].l3_label = ''
        flattenedMappedData[idx].l4_label = `${dataLabel}${subtotalLabel}`
      } else {
        flattenedMappedData[idx].l1_label = ''
        flattenedMappedData[idx].l2_label = ''
        flattenedMappedData[idx].l3_label = `${dataLabel}${subtotalLabel}`
        flattenedMappedData[idx].l4_label = ''
      }

      if (shiftTotalsCss) {
        flattenedMappedData[idx].l4_total = true
        flattenedMappedData[idx].shiftTotalsCss = true
      } else {
        flattenedMappedData[idx].l3_total = true
      }
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
  })

  return flattenedMappedData
}

module.exports = cleanLabelsForDisplay
