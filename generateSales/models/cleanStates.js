// Filters the order ship to state field for valid states

const cleanStates = (states, orderInfo) => {
  const validStates = orderInfo.map(order => {
    return states.includes(order.SHIPTO_STATE)
  })

  return validStates
}

module.exports = cleanStates
