// Remove subtotals if there is only one row to subtotal
const collapseRedundantTotalRows = (data, level) => {
  let l4collapsed = null
  let l3collapsed = null
  let l2collapsed = null
  switch (level) {
    case 4:
      l4collapsed = collapseL4(data)
      l3collapsed = collapseL3(l4collapsed)
      l2collapsed = collapseL2(l3collapsed)
      return l2collapsed
    case 3:
      l3collapsed = collapseL3(data)
      l2collapsed = collapseL2(l3collapsed)
      return l2collapsed
    case 2:
      l2collapsed = collapseL2(data)
      return l2collapsed

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

    if (l4_filter === 'SUBTOTAL' && interval === 1) {
      interval = 0
      return false
    } else if (l4_filter === 'SUBTOTAL' || l3_filter === 'SUBTOTAL') {
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
