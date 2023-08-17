const {
  lvl_0_total_getFgPo_detail,
  lvl_2_subtotal_getFgPo_detail,
  lvl_1_subtotal_getFgPo_detail,
} = require('../../shared/queries/postgres/getDetail_baseReport/getFgOpenPo')

const getDetail = async (program, filters) => {
  let detail = null

  const config = {
    l1_field: 'ms.species_group',
    l2_field: 'ms.program',
    program: null,
  }

  if (filters[0] === 'SUBTOTAL' || filters[1] === 'SUBTOTAL') {
    // get level 1 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]

    detail = await lvl_1_subtotal_getFgPo_detail(config, config.program, filters)
  }

  if (filters[0] !== 'SUBTOTAL' && filters[1] !== 'SUBTOTAL') {
    // get level 2 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]

    detail = await lvl_2_subtotal_getFgPo_detail(config, config.program, filters)
  }

  if (filters[1] === 'TOTAL') {
    // get level 0 total where freeze = filters[0] and soak = filters[1] and size = filters[2]

    detail = await lvl_0_total_getFgPo_detail(config, config.program, filters)
  }

  return detail
}

module.exports = getDetail
