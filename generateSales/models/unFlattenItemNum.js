const unflattenItemNum = flatObjArr => {
  try {
    console.log('unflattenItemNum:')
    let unflattenedObj = {}
    let itemNum

    flatObjArr.forEach(obj => {
      if (typeof obj.item_num !== 'undefined') itemNum = obj.item_num
      if (typeof obj.ITEM_NUMBER !== 'undefined') itemNum = obj.ITEM_NUMBER

      unflattenedObj[itemNum] = { ...obj }
    })

    return unflattenedObj
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = unflattenItemNum
