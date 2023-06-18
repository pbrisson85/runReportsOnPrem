const reconcileOthp = (glPeriodActivity_unflat, othpRecalc_unflat, glDepartments, contraSalesGlMap) => {
  const periods = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  const reconciliationOthp = []
  let netDifferences = 0

  // Loop through each contra GL account
  contraSalesGlMap.forEach(contra => {
    const contraGl = contra.contra

    // loop through each department
    glDepartments.forEach(dept => {
      const deptCode = dept.DEPARTMENT_NUMBER

      // loop through each period
      periods.forEach(period => {
        // compile every possible key
        const key = `${contraGl}-${deptCode}-${period}`

        // Get the calced othp dollar amount
        let othpCalcDollars = 0
        if (typeof othpRecalc_unflat[`${contraGl}-${deptCode}-${period}`] !== 'undefined') {
          othpCalcDollars = othpRecalc_unflat[`${contraGl}-${deptCode}-${period}`].dollars.reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
        }

        // Get the GL dollars
        let glDollars = 0
        if (typeof glPeriodActivity_unflat[`${contraGl}-${deptCode}`] !== 'undefined') {
          glDollars = glPeriodActivity_unflat[`${contraGl}-${deptCode}`][period]
        }

        // compare the two
        const difference = parseFloat(othpCalcDollars) - parseFloat(glDollars)

        if (difference !== 0) {
          netDifferences += parseFloat(difference.toFixed(2))

          reconciliationOthp.push({
            contraGl,
            deptCode,
            period,
            glDollars,
            othpCalcDollars: parseFloat(othpCalcDollars.toFixed(2)),
            difference: parseFloat(difference.toFixed(2)),
          })
        }
      })
    })
  })

  return { reconciliationOthp, netDifferences }
}

module.exports = reconcileOthp
