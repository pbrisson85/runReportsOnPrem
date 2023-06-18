const unflattenByCompositKey = (data, keys) => {
  let unflat = {}

  const vals = Object.values(keys)

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
      // Hit duplicate. Summing dollars
      unflat[key] = { ...row, dollars: unflat[key].dollars + row.dollars }
    }
  })

  return unflat
}

module.exports = unflattenByCompositKey
