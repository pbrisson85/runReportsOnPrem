const unflattenByCompositKey = require('./unflattenByCompositKey')

const calcInventoryAvailable = (fgInven, fgPo, fgSo, colName) => {
  // Do not know how many columns the data is grouped by
  const fgInven_unflat = unflattenByCompositKey(fgInven, {
    1: 'l1_label',
    2: 'l2_label',
    3: 'l3_label',
    4: 'l4_label',
    5: 'l5_label',
    6: 'l6_label',
  })

  const fgPo_unflat = unflattenByCompositKey(fgPo, {
    1: 'l1_label',
    2: 'l2_label',
    3: 'l3_label',
    4: 'l4_label',
    5: 'l5_label',
    6: 'l6_label',
  })

  const fgSo_unflat = unflattenByCompositKey(fgSo, {
    1: 'l1_label',
    2: 'l2_label',
    3: 'l3_label',
    4: 'l4_label',
    5: 'l5_label',
    6: 'l6_label',
  })

  // Since there could be keys in either inven, po, or so that are not in the other, we need to get all the keys
  const allKeys = [...new Set([...Object.keys(fgSo_unflat), ...Object.keys(fgPo_unflat), ...Object.keys(fgInven_unflat)])]

  // Calculate the total lbs and cogs for each key

  const invenAvailable = allKeys.map(key => {
    const row = fgInven_unflat[key] ?? fgPo_unflat[key] ?? fgSo_unflat[key]
    let { l1_label, l2_label, l3_label, l4_label, l5_label, l6_label } = row

    const lbsInven = fgInven_unflat[key]?.lbs ?? 0
    const cogsInven = fgInven_unflat[key]?.cogs ?? 0
    const lbsPo = fgPo_unflat[key]?.lbs ?? 0
    const cogsPo = fgPo_unflat[key]?.cogs ?? 0
    const lbsSo = fgSo_unflat[key]?.lbs ?? 0
    const cogsSo = fgSo_unflat[key]?.cogs ?? 0

    const calcData = {
      l1_label,
      l2_label,
      l3_label,
      l4_label,
      l5_label,
      l6_label,
      column: colName,
      lbs: lbsInven + lbsPo - lbsSo,
      cogs: cogsInven + cogsPo - cogsSo,
      suppressCalcPerLb: false, // in inventory rows map will not calc / lb, will only use the weight or cogs ratio
    }

    return calcData
  })

  return invenAvailable
}

module.exports = calcInventoryAvailable

/*
[INVEN] + [PURCHASE ORDER] - [SALES ORDER]
*/
