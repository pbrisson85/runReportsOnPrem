const unflattenByCompositKeySum = (data, config) => {
  let unflat = {}

  // create list of keys from config passed in
  const vals = Object.values(config)

  let dupKeyCounter = 0
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
        if (dupKeyCounter <= 20) console.log('dupKeyCounter', dupKeyCounter) //DEBUG
        if (dupKeyCounter <= 20) console.log('k', k) //DEBUG
        if (dupKeyCounter <= 20) console.log('typeof unflat[key][k]', typeof unflat[key][k]) //DEBUG

        if (typeof unflat[key][k] === 'number') {
          if (dupKeyCounter <= 20) console.log('unflat[key][k]', unflat[key][k]) //DEBUG
          if (dupKeyCounter <= 20) console.log('row[k]', row[k]) //DEBUG

          unflat[key][k] += row[k]
        }
      })
      dupKeyCounter++
    }
  })

  return unflat
}

module.exports = unflattenByCompositKeySum
