const unflattedForOthpGlTie = (data, keys) => {
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
      unflat[key] = { ...row, dollars: [row.dollars], major_code_name: [row.major_code_name] }
      delete unflat[key].allocationGl // example FG and By Prod have same othp GL - Dept but not same allocation accounts
      delete unflat[key].allocattedGl // example FG and By Prod have same othp GL - Dept but not same allocation accounts
    } else {
      // Hit duplicate. Summing dollars
      console.log(`Duplicate key: ${key}`)

      unflat[key].dollars.push(row.dollars)
      unflat[key].major_code_name.push(row.major_code_name)
    }
  })

  return unflat
}

module.exports = unflattedForOthpGlTie
