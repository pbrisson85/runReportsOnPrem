const getInvenViews = require('../../filters/data/getInvenReportsOptions')

const getInvenReportsAging = reqBody => {
  // front end selection
  const aging = reqBody.invenReportCols?.aging ?? null

  if (aging) return aging

  // no aging look for default
  const invenViews = getInvenViews()
  const d = invenViews.find(option => option.default)

  return d?.aging ?? null
}

const getInvenReportsGrouping = reqBody => {
  // front end selection
  const grouping = reqBody.invenReportCols?.grouping ?? null
  if (grouping) return grouping

  // no aging look for default
  const invenViews = getInvenViews()
  const d = invenViews.find(option => option.default)
  return d?.grouping ?? null
}

module.exports.getInvenReportsAging = getInvenReportsAging
module.exports.getInvenReportsGrouping = getInvenReportsGrouping
