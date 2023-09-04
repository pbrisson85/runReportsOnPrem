const unflattenByCompositKey = (data, config) => {
  let unflat = {}

  // create list of keys from config passed in
  const vals = Object.values(config)

  data.forEach(row => {
    // build key
    let key = null
    vals.forEach(val => {
      if (!key) {
        key = `${row[val]}`
      } else {
        key = `${key}-${row[val]}`
      }
    })

    // add row to key
    if (!unflat[key]) {
      unflat[key] = { ...row }
    } else {
      console.log('hit duplicate key in unflattenByCompositKey OVERWRITTING: ', key)
      console.log('row: ', row)
      console.log('unflat[key]: ', unflat[key])

      unflat[key] = { ...row } // OVER WRITTING
    }
  })

  return unflat
}

module.exports = unflattenByCompositKey
