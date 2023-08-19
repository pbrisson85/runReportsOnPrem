const {
  lvl_0_total_getSales_detail,
  lvl_2_subtotal_getSales_detail,
  lvl_1_subtotal_getSales_detail,
} = require('../../../shared/queries/postgres/getDetail_inTrendByCust/getSales')

const getDetail = async (config, program, filters, startWeek, endWeek, year) => {
  let detail = null

  if (filters[0] === 'SUBTOTAL' || filters[1] === 'SUBTOTAL') {
    // get level 1 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]
    console.log('1')
    detail = await lvl_1_subtotal_getSales_detail(config, startWeek, endWeek, config.program, filters, year)
  }

  if (filters[0] !== 'SUBTOTAL' && filters[1] !== 'SUBTOTAL') {
    console.log('2')
    // get level 2 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]
    detail = await lvl_2_subtotal_getSales_detail(config, startWeek, endWeek, config.program, filters, year)
  }

  if (filters[1] === 'TOTAL') {
    console.log('3')
    // get level 0 total where freeze = filters[0] and soak = filters[1] and size = filters[2]
    detail = await lvl_0_total_getSales_detail(config, startWeek, endWeek, config.program, filters, year)
  }

  return detail
}

module.exports = getDetail
