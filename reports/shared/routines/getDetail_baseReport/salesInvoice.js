const {
  lvl_0_total_getSales_detail,
  lvl_2_subtotal_getSales_detail,
  lvl_1_subtotal_getSales_detail,
  lvl_3_subtotal_getSales_detail,
} = require('../../queries/postgres/getDetail_baseReport/getSales')

const getDetail = async (config, program, filters, startWeek, endWeek, year) => {
  let detail = null

  if (filters[1] === 'SUBTOTAL' && filters[2] === 'SUBTOTAL') {
    // get level 1 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]
    detail = await lvl_1_subtotal_getSales_detail(config, startWeek, endWeek, program, filters, year)
  }

  if (filters[1] !== 'SUBTOTAL' && filters[2] === 'SUBTOTAL') {
    // get level 2 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]
    detail = await lvl_2_subtotal_getSales_detail(config, startWeek, endWeek, program, filters, year)
  }

  if (filters[1] !== 'SUBTOTAL' && filters[2] !== 'SUBTOTAL' && filters[1] !== 'TOTAL' && filters[2] !== 'TOTAL') {
    // get level 3 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]
    detail = await lvl_3_subtotal_getSales_detail(config, startWeek, endWeek, program, filters, year)
  }

  if (filters[1] === 'TOTAL' && filters[2] === 'TOTAL') {
    // get level 0 total where freeze = filters[0] and soak = filters[1] and size = filters[2]
    detail = await lvl_0_total_getSales_detail(config, startWeek, endWeek, program, filters, year)
  }

  return detail
}

module.exports = getDetail