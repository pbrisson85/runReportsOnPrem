const calcPercentKeyCol = (eachRowData, denomKey, numerKey, colName) => {
  // create obj with each key value as the new key. increment each value. These will be the denominators
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

  // loop through each and add denom if the key exists in denoms
  const percent_key = eachRowData.map(row => {
    const { lbs, sales, cogs, othp } = row

    if (typeof denoms[row[denomKey]] === 'undefined') {
      // if the key doesn't exist in denoms, return the row with 0s
      return {
        ...row,
        column: colName,

        lbs_numerator: lbs,
        sales_numerator: sales,
        cogs_numerator: cogs,
        othp_numerator: othp,

        lbs_denominator: 0,
        sales_denominator: 0,
        cogs_denominator: 0,
        othp_denominator: 0,

        percentFormat: true, // flag for the map sales rows model
      }
    } else {
      // if the key does exist in denoms, return the row with the values
      const { lbs: coLbs, sales: coSales, cogs: coCogs, othp: coOthp } = denoms[row[denomKey]]

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
  })

  return percent_key
}

module.exports = calcPercentKeyCol
