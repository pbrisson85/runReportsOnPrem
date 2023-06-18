const unflattedCogsRecalc = (data, keys) => {
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
      unflat[key] = { cogs: row.cogs }
    } else {
      // Hit duplicate. Summing dollars
      console.log(`Duplicate key: ${key}.`)
      unflat[key] = { cogs: parseFloat(row.cogs) + parseFloat(unflat[key].cogs) }
    }
  })

  return unflat
}

module.exports = unflattedCogsRecalc
