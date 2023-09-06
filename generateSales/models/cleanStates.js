// Filters the order ship to state field for valid states

const cleanStates = (states, orderInfo) => {
  console.log('states', states)

  const statesArr = states.map(state => state.code)

  const validStates = orderInfo.map((order, idx) => {
    if (idx < 20) {
      console.log('order', order)
    }

    return statesArr.includes(order.SHIPTO_STATE)
  })

  console.log('validStates[0]', validStates[0])

  return validStates
}

module.exports = cleanStates
