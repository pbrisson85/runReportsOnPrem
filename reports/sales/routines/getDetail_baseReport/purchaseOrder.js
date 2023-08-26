const { lvl_3_subtotal_getFgPo_detail } = require('../../queries/postgres/getDetail_baseReport/getFgOpenPo')

const getDetail = async (level, config, program, filters, level) => {
  let detail = null

  detail = await lvl_3_subtotal_getFgPo_detail(config, program, filters, level)

  return detail
}

module.exports = getDetail
