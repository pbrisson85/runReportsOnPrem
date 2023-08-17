const { byItem_getSales_detail } = require('../../queries/postgres/getDetail_inTrendByItem/getSales')

const getDetail = async (program, filters, startWeek, endWeek, year) => {
  const detail = await byItem_getSales_detail(startWeek, endWeek, filters, year)

  return detail
}

module.exports = getDetail
