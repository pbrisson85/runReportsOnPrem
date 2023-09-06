// Filters the order ship to state field for valid states

const cleanStates = (states, orderInfo) => {
  const statesArr = states.map(state => state.code)

  const validStates = orderInfo.filter((order, idx) => {
    return statesArr.includes(order.SHIPTO_STATE)
  })

  return validStates
}

module.exports = cleanStates
