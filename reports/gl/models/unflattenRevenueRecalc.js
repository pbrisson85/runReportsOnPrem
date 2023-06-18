const unflattedRevenueRecalc = (data, keys) => {
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
      unflat[key] = { sales: row.sales }
    } else {
      // Hit duplicate. Summing dollars
      console.log(`Duplicate key: ${key}.`)
      unflat[key] = { sales: parseFloat(row.sales) + parseFloat(unflat[key].sales) }
    }
  })

  return unflat
}

module.exports = unflattedRevenueRecalc
