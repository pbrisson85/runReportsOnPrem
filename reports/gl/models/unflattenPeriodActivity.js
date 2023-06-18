const unflattedPeriodActivity = (data, keys) => {
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
      delete unflat[key].ACCOUNT_NUMBER
      delete unflat[key].DEPARTMENT_CODE
    } else {
      // Hit duplicate. Summing dollars
      console.log(`Duplicate key: ${key}. NOT HANBDLING DUPLICATES!!!!!!`)
    }
  })

  return unflat
}

module.exports = unflattedPeriodActivity
