const { lvl_3_subtotal_getSales_detail } = require('../../queries/postgres/getDetail_baseReport/getSales')

const getDetail = async (level, config, program, filters, startWeek, endWeek, year) => {
  let detail = null

  detail = await lvl_3_subtotal_getSales_detail(config, startWeek, endWeek, program, filters, year, level)

  return detail
}

module.exports = getDetail
