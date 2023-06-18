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
      unflat[key] = { ...row, dollars: [row.dollars], major_code_name: [major_code_name] }
    } else {
      // Hit duplicate. Summing dollars
      console.log(`Duplicate key. summing dollars: ${key}`)
      unflat[key] = { ...row, dollars: dollars.push(row.dollars), major_code_name: major_code_name.push(row.major_code_name) }
    }
  })

  return unflat
}

module.exports = unflattenByCompositKey
