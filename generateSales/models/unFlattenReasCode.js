const unflattenInvoiceNum = flatObjArr => {
  try {
    console.log('unflattenInvoiceNum:')
    let unflattenedObj = {}

    flatObjArr.forEach(obj => {
      unflattenedObj[obj.TABLE_CODE] = { ...obj }
    })

    return unflattenedObj
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = unflattenInvoiceNum
