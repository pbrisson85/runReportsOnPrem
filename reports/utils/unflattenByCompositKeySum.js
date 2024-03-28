const unflattenByCompositKeySum = (data, config) => {
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
      const keys = Object.keys(row)

      keys.forEach(k => {
        if (typeof unflat[key][k] === 'number') {
          unflat[key][k] += row[k]
        }
      })
    }
  })

  return unflat
}

module.exports = unflattenByCompositKeySum
