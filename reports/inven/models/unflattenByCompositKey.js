const unflattenByCompositKey = (data, config) => {
  let unflat = {}

  // create list of keys from config passed in
  const vals = Object.values(config)

  let hasErrors = false

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
      // flag errors
      hasErrors = true

      // example of why this could be hit: If get trend by customer uses a l1_label (customer code) and an l2_label (customer name) the problem is there could be multiple l2_labels (customer name) for each l1_label (customer code). This is because someone can type a name into a sales order and have done so over time (see MSCL00 but many others exist). Therefore I can flatten using two keys and avoid hitting this block but I am only flattening using one key (customer code) because i want the sum to be by customer code. I dont want multiple lines for each customer code just because someone overwrote the customer name in the sales order. My fix is when I see that this block is hit I change the trend to be one level (the queries sum only by l1_label and have NO l2_label.) This is cleaned up at the end of the route with custom functionality to fill in the customer name in this case.

      console.log('hit duplicate key in unflattenByCompositKey OVERWRITTING. This means some rows will not be mapped: ', key)
      unflat[key] = { ...row } // OVERWRITTING
    }
  })

  if (hasErrors)
    console.log(`hit duplicate key in unflattenByCompositKey OVERWRITTING. This means some rows will not be mapped: ${JSON.stringify(config)}`)

  return unflat
}

module.exports = unflattenByCompositKey
