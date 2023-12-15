const unflattenByCompositKey = require('../../utils/unflattenByCompositKey')

const calcYoyYtdSalesCol = (eachRowData, colName) => {
  // manually filter out anything that is not 2022/2023

  const py = eachRowData.filter(row => row.column === '2022_ytd')
  const cy = eachRowData.filter(row => row.column === '2023_ytd')

  // Do not know how many columns the data is grouped by
  const py_unflat = unflattenByCompositKey(py, {
    1: 'l1_label',
    2: 'l2_label',
    3: 'l3_label',
    4: 'l4_label',
    5: 'l5_label',
    6: 'l6_label',
  })

  const cy_unflat = unflattenByCompositKey(cy, {
    1: 'l1_label',
    2: 'l2_label',
    3: 'l3_label',
    4: 'l4_label',
    5: 'l5_label',
    6: 'l6_label',
  })

  // Since there could be keys in either inven, po, or so that are not in the other, we need to get all the keys
  const allKeys = [...new Set([...Object.keys(py_unflat), ...Object.keys(cy_unflat)])]

  // Calculate the total lbs and cogs for each key

  const yoySales = allKeys.map(key => {
    const row = py_unflat[key] ?? cy_unflat[key]
    let { l1_label, l2_label, l3_label, l4_label, l5_label, l6_label } = row

    const lbsCy = cy_unflat[key]?.lbs ?? 0
    const lbsPy = py_unflat[key]?.lbs ?? 0

    const salesCy = cy_unflat[key]?.sales ?? 0
    const salesPy = py_unflat[key]?.sales ?? 0

    const cogsCy = cy_unflat[key]?.cogs ?? 0
    const cogsPy = py_unflat[key]?.cogs ?? 0

    const othpCy = cy_unflat[key]?.othp ?? 0
    const othpPy = py_unflat[key]?.othp ?? 0

    const calcData = {
      l1_label,
      l2_label,
      l3_label,
      l4_label,
      l5_label,
      l6_label,
      column: colName,
      lbs: lbsCy - lbsPy,
      sales: salesCy - salesPy,
      cogs: cogsCy - cogsPy,
      othp: othpCy - othpPy,
    }

    return calcData
  })

  return yoySales
}

module.exports = calcYoyYtdSalesCol
