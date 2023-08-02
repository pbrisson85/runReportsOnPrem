const calcPercentKeyCol = (eachRowData, denomKey, numerKey) => {
  // create obj with each key value as the new key. increment each value. These will be the denominators

  console.log('\n\n')
  console.log('in calcPercentKeyCol...', '\n')
  console.log('eachRowData.length', eachRowData.length, '\n')
  console.log('eachRowData[0]', eachRowData[0], '\n')
  console.log('denomKey', denomKey)
  console.log('numerKey', numerKey, '\n')

  let denoms = {}

  eachRowData.forEach(row => {
    const { lbs, sales, cogs, othp } = row
    const denomCategory = row[denomKey]

    if (typeof denoms[denomCategory] === 'undefined') {
      denoms[denomCategory] = {
        lbs,
        sales,
        cogs,
        othp,
      }
    } else {
      denoms[denomCategory].lbs += lbs
      denoms[denomCategory].sales += sales
      denoms[denomCategory].cogs += cogs
      denoms[denomCategory].othp += othp
    }
  })

  console.log('denoms', denoms, '\n')

  return []

  // loop through each and add denom if the key exists in denoms
  const percent_key = eachRowData.map(row => {
    if (typeof denom[row[numerKey]] === 'undefined') {
      return {
        ...row,
        column: colName,

        lbs_numerator: lbs,
        sales_numerator: sales,
        cogs_numerator: cogs,
        othp_numerator: othp,

        lbs_denominator: coLbs,
        sales_denominator: coSales,
        cogs_denominator: coCogs,
        othp_denominator: coOthp,

        percentFormat: true, // flag for the map sales rows model
      }
    }
    const { lbs: coLbs, sales: coSales, cogs: coCogs, othp: coOthp } = totalData

    const { lbs, sales, cogs, othp } = row

    return {
      ...row,
      column: colName,

      lbs_numerator: lbs,
      sales_numerator: sales,
      cogs_numerator: cogs,
      othp_numerator: othp,

      lbs_denominator: coLbs,
      sales_denominator: coSales,
      cogs_denominator: coCogs,
      othp_denominator: coOthp,

      percentFormat: true, // flag for the map sales rows model
    }
  })

  return percent_key
}

module.exports = calcPercentKeyCol
