const {
  lvl_0_total_getSales_detail,
  lvl_2_subtotal_getSales_detail,
  lvl_1_subtotal_getSales_detail,
} = require('../queries/postgres/detail_inDrillDownByCust/getSales')

const getDetail = async (program, filters, startWeek, endWeek, year) => {
  let detail = null

  if (filters[0] === 'SUBTOTAL' || filters[1] === 'SUBTOTAL') {
    // get level 1 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]
    detail = await lvl_1_subtotal_getSales_detail(startWeek, endWeek, program, filters, year, year)
  }

  if (filters[0] !== 'SUBTOTAL' && filters[1] !== 'SUBTOTAL') {
    // get level 2 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]
    detail = await lvl_2_subtotal_getSales_detail(startWeek, endWeek, program, filters, year, year)
  }

  if (filters[1] === 'TOTAL') {
    // get level 0 total where freeze = filters[0] and soak = filters[1] and size = filters[2]
    detail = await lvl_0_total_getSales_detail(startWeek, endWeek, program, filters, year, year)
  }

  return detail
}

module.exports = getDetail
