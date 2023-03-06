const unflattenInvoiceNum = flatObjArr => {
  try {
    console.log('unflattenInvoiceNum:')
    let unflattenedObj = {}

    flatObjArr.forEach(obj => {
      unflattenedObj[obj.INVOICE_NUMBER] = { ...obj }
    })

    return unflattenedObj
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = unflattenInvoiceNum
