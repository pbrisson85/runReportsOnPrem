const unflattenRowTemplate = flatObjArr => {
  try {
    console.log('unflattenRowTemplate:')
    let unflattenedObj = {}

    flatObjArr.forEach(obj => {
      unflattenedObj[`${obj.l1_grouping}-${obj.l2_grouping}`] = { ...obj }
    })

    return unflattenedObj
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = unflattenRowTemplate
