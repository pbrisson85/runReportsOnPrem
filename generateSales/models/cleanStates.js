// Filters the order ship to state field for valid states

const cleanStates = (states, orderInfo) => {
  const statesArr = states.map(state => state.code)
  console.log('statesArr', statesArr)

  const validStates = orderInfo.filter((order, idx) => {
    return statesArr.includes(order.SHIPTO_STATE)
  })

  console.log('validStates[0]', validStates[0])

  return validStates
}

module.exports = cleanStates
