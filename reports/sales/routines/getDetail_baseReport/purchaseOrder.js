const {
  lvl_0_total_getFgPo_detail,
  lvl_2_subtotal_getFgPo_detail,
  lvl_1_subtotal_getFgPo_detail,
  lvl_3_subtotal_getFgPo_detail,
} = require('../../queries/postgres/getDetail_baseReport/getFgOpenPo')

const getDetail = async (level, config, program, filters) => {
  let detail = null

  if (level === 1) {
    // get level 1 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]

    detail = await lvl_1_subtotal_getFgPo_detail(config, program, filters)
  }

  if (level === 2) {
    // get level 2 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]

    detail = await lvl_2_subtotal_getFgPo_detail(config, program, filters)
  }

  if (level === 3) {
    // get level 3 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]

    detail = await lvl_3_subtotal_getFgPo_detail(config, program, filters)
  }

  if (level === 0) {
    // get level 0 total where freeze = filters[0] and soak = filters[1] and size = filters[2]

    detail = await lvl_0_total_getFgPo_detail(config, program, filters)
  }

  return detail
}

module.exports = getDetail
