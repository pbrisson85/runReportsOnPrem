const reconcileRevenue = (glRevenueAccounts, glPeriodActivity_unflat, glDepartments, recalcedRev_unflat) => {
  // get every revenue - dept - period combo to compare recalc to GL:

  const periods = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  const reconciliationRevenue = []
  let netDifferences = 0

  // Loop through each contra GL account

  glRevenueAccounts.forEach(rev => {
    const revGl = rev.ACCOUNT_NUMBER

    // loop through each department
    glDepartments.forEach(dept => {
      const deptCode = dept.DEPARTMENT_NUMBER

      // loop through each period
      periods.forEach(period => {
        // now have every possible key
        const key = `${revGl}-${deptCode}-${period}`

        // DO STUFF HERE
        let revRecalcDollars = 0

        if (typeof recalcedRev_unflat[`${revGl}-${parseInt(deptCode)}-${period}`] !== 'undefined') {
          revRecalcDollars += parseFloat(recalcedRev_unflat[`${revGl}-${parseInt(deptCode)}-${period}`].sales)
        }

        // Get the GL dollars
        let glDollars = 0

        if (typeof glPeriodActivity_unflat[`${revGl}-${deptCode}`] !== 'undefined') {
          glDollars = glPeriodActivity_unflat[`${revGl}-${deptCode}`][period]
        }

        // compare the two
        const difference = parseFloat(revRecalcDollars) - parseFloat(glDollars)

        if (difference !== 0) {
          netDifferences += parseFloat(difference.toFixed(2))

          reconciliationRevenue.push({
            key,
            revGl,
            deptCode,
            period,
            glDollars,
            revRecalcDollars: parseFloat(revRecalcDollars.toFixed(2)),
            difference: parseFloat(difference.toFixed(2)),
          })
        }
      })
    })
  })

  console.log('netDifferences in REVENUE journal entires: ', netDifferences)

  return reconciliationRevenue
}

module.exports = reconcileRevenue
