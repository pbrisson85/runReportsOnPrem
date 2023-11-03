const unflattenByCompositKey = require('./unflattenByCompositKey')

const calcMomentum = (fourWk, twelveWk, colName) => {
  // Do not know how many columns the data is grouped by
  const fourWk_unflat = unflattenByCompositKey(fourWk, {
    1: 'l1_label',
    2: 'l2_label',
    3: 'l3_label',
    4: 'l4_label',
    5: 'l5_label',
    6: 'l6_label',
  })

  const twelveWk_unflat = unflattenByCompositKey(twelveWk, {
    1: 'l1_label',
    2: 'l2_label',
    3: 'l3_label',
    4: 'l4_label',
    5: 'l5_label',
    6: 'l6_label',
  })

  // Since there could be keys in either inven, po, or so that are not in the other, we need to get all the keys
  const allKeys = [...new Set([...Object.keys(fourWk_unflat), ...Object.keys(twelveWk_unflat)])]

  // Calculate the total lbs and cogs for each key

  const momentumSales = allKeys.map(key => {
    const row = fourWk_unflat[key] ?? twelveWk_unflat[key]
    let { l1_label, l2_label, l3_label, l4_label, l5_label, l6_label } = row

    const lbsFourWk = cy_unflat[key]?.lbs ?? 0
    const lbsTwelveWk = py_unflat[key]?.lbs ?? 0

    const salesFourWk = cy_unflat[key]?.sales ?? 0
    const salesTwelveWk = py_unflat[key]?.sales ?? 0

    const cogsFourWk = cy_unflat[key]?.cogs ?? 0
    const cogsTwelveWk = py_unflat[key]?.cogs ?? 0

    const othpFourWk = cy_unflat[key]?.othp ?? 0
    const othpTwelveWk = py_unflat[key]?.othp ?? 0

    const calcData = {
      l1_label,
      l2_label,
      l3_label,
      l4_label,
      l5_label,
      l6_label,
      column: colName,
      lbs: lbsFourWk - lbsTwelveWk,
      sales: salesFourWk - salesTwelveWk,
      cogs: cogsFourWk - cogsTwelveWk,
      othp: othpFourWk - othpTwelveWk,
    }

    return calcData
  })

  return momentumSales
}

module.exports = calcMomentum
