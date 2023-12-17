const getInvenViews = require('../../filters/getInvenReportsOptions')

const getInvenReportsAging = reqBody => {
  // front end selection
  const aging = typeof reqBody.invenReportColsOption?.aging !== 'undefined' ? reqBody.invenReportCols.aging : null
  if (aging) return aging

  // no aging look for default
  const invenViews = getInvenViews()
  const d = invenViews.filter(option => option.default)
  return d[0]?.aging ?? null
}

const getInvenReportsGrouping = reqBody => {
  // front end selection
  const grouping = typeof reqBody.invenReportColsOption?.grouping !== 'undefined' ? reqBody.invenReportCols.grouping : null
  if (grouping) return grouping

  // no aging look for default
  const invenViews = getInvenViews()
  const d = invenViews.filter(option => option.default)
  return d[0]?.grouping ?? null
}

module.exports.getInvenReportsAging = getInvenReportsAging
module.exports.getInvenReportsGrouping = getInvenReportsGrouping
