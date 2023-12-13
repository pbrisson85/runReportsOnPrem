// Remove subtotals if there is only one row to subtotal
const collapseRedundantTotalRows = (data, level) => {
  let collapsed = null

  switch (level) {
    case 4:
      collapsed = collapseL4(data)
      collapsed = collapseL3(collapsed)
      collapsed = collapseL2(collapsed)
      return collapsed
    case 3:
      collapsed = collapseL3(data)
      collapsed = collapseL2(collapsed)
      return collapsed
    case 2:
      collapsed = collapseL2(data)
      return collapsed

    default:
      return data
  }
}

const collapseL4 = data => {
  let interval = 0

  const collapsed = data.filter((row, idx) => {
    if (idx === 0) {
      interval = 0
      interval++
      return true
    }

    if (row.l4_filter === 'SUBTOTAL' && interval === 1) {
      interval = 0
      return false
    } else if (row.l4_filter === 'SUBTOTAL' || row.l3_filter === 'SUBTOTAL') {
      interval = 0
      return true
    }

    interval++
    return true
  })

  return collapsed
}

const collapseL3 = data => {
  let interval = 0

  const collapsed = data.filter((row, idx) => {
    if (idx === 0) {
      interval = 0
      interval++
      return true
    }

    if (row.l3_filter === 'SUBTOTAL' && interval === 1) {
      interval = 0
      return false
    } else if (row.l3_filter === 'SUBTOTAL' || row.l2_filter === 'SUBTOTAL') {
      interval = 0
      return true
    }

    interval++
    return true
  })

  return collapsed
}

const collapseL2 = data => {
  let interval = 0

  const collapsed = data.filter((row, idx) => {
    if (idx === 0) {
      interval = 0
      interval++
      return true
    }

    if (row.l2_filter === 'SUBTOTAL' && interval === 1) {
      interval = 0
      return false
    } else if (row.l2_filter === 'SUBTOTAL' || row.l1_filter === 'SUBTOTAL') {
      interval = 0
      return true
    }

    interval++
    return true
  })

  return collapsed
}

module.exports = collapseRedundantTotalRows
