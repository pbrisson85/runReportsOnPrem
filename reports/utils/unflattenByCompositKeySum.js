const unflattenByCompositKeySum = (data, config) => {
  let unflat = {}

  // create list of keys from config passed in
  const vals = Object.values(config)

  data.forEach((row, idx) => {
    idx <= 20 && console.log('row', row)

    // build key
    let key = null
    vals.forEach(val => {
      if (!key) {
        key = `${row[val]}`
      } else {
        key = `${key}-${row[val]}`
      }
    })

    idx <= 20 && console.log('key', key)

    // add row to key
    if (!unflat[key]) {
      unflat[key] = { ...row }

      idx <= 20 && console.log('unflat[key]', unflat[key])
    } else {
      const keys = Object.keys(row)

      keys.forEach(k => {
        idx <= 20 && console.log('k', k)

        idx <= 20 && console.log('typeof unflat[key][k]', typeof unflat[key][k])

        if (typeof unflat[key][k] === 'number') {
          idx <= 20 && console.log('unflat[key][k]', unflat[key][k])
          idx <= 20 && console.log('row[k]', row[k])

          unflat[key][k] += row[k]
        }
      })
    }
  })

  return unflat
}

module.exports = unflattenByCompositKeySum
