const reconcileOthp = (glPeriodActivity_unflat, othpRecalc_unflat) => {
  // loop through the gl period activity and compare to the othpRecalc_unflat
  const reconciliationOthp = []
  const netDifferences = 0

  const periodActivityKeys = Object.keys(glPeriodActivity_unflat)
  periodActivityKeys.forEach(key => {
    const glAcct = key.split('-')[0]
    const dept = parseInt(key.split('-')[1]) // need to parseInt to remove leading 0s
    const periods = Object.keys(glPeriodActivity_unflat[key])

    // loop through each period
    periods.forEach(period => {
      const glDollars = glPeriodActivity_unflat[key][period]

      // Get the calced othp dollar amount

      let othpCalcDollars = 0
      if (typeof othpRecalc_unflat[`${glAcct}-${dept}-${period}`] !== 'undefined') {
        othpCalcDollars = othpRecalc_unflat[`${glAcct}-${dept}-${period}`].dollars.reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
      }

      // compare the two
      const difference = parseFloat(othpCalcDollars) - parseFloat(glDollars)

      // Need to dynamically get this population of gl accounts ******
      if (glAcct === '3999' || glAcct === '3998' || glAcct === '3997' || glAcct === '3996') {
        if (difference !== 0) {
          netDifferences += parseFloat(difference.toFixed(2))

          reconciliationOthp.push({
            glAcct,
            dept,
            period,
            glDollars,
            othpCalcDollars: parseFloat(othpCalcDollars.toFixed(2)),
            difference: parseFloat(difference.toFixed(2)),
          })
        }
      }
    })
  })

  return reconciliationOthp
}

module.exports = reconcileOthp
