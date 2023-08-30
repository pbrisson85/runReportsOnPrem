const unflattenByCompositeKey = (data, keys) => {
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
      unflat[key] = [{ ...row }]
    } else {
      unflat[key].push({ ...row })
    }
  })

  return unflat
}

module.exports = unflattenByCompositeKey