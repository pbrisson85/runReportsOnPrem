const { byItem_getSalesByWk_detail, byItem_getSalesPeriodToDate_detail } = require('../queries/postgres/detailByItem/getSales')

const getDetail = async (program, filters, columnDataName, startWeek, periodEnd) => {
  let detail = null

  switch (columnDataName) {
    case 'SALES TOTAL':
      detail = await byItem_getSalesPeriodToDate_detail(startWeek, periodEnd, filters)
      break
    default:
      // this is a trned column
      detail = await byItem_getSalesByWk_detail(filters, columnDataName, startWeek, periodEnd)
      break
  }

  return detail
}

module.exports = getDetail
