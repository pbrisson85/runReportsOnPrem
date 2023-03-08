const unflattenRowTemplate = flatObjArr => {
  try {
    console.log('unflattenRowTemplate:')
    let unflattenedObj = {}

    flatObjArr.forEach(obj => {
      unflattenedObj[`${obj.maj_row}-${obj.min_row}`] = { ...obj }
    })

    return unflattenedObj
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = unflattenRowTemplate
