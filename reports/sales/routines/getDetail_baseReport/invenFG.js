const {
  lvl_3_subtotal_getFgInven_detail,
  lvl_3_subtotal_getFgInTransit_detail,
  lvl_3_subtotal_getFgAtLoc_detail,
  lvl_3_subtotal_getFgAtLoc_untagged_detail,
  lvl_3_subtotal_getFgAtLoc_tagged_detail,
} = require('../../queries/postgres/getDetail_baseReport/getFgInven')

const getDetail = async (level, config, program, filters, columnDataName) => {
  let detail = null

  switch (columnDataName) {
    case 'FG INVEN':
      detail = await lvl_3_subtotal_getFgInven_detail(config, program, filters, level)
      break
    case 'FG IN TRANSIT':
      detail = await lvl_3_subtotal_getFgInTransit_detail(config, program, filters, level)
      break
    case 'FG ON HAND':
      detail = await lvl_3_subtotal_getFgAtLoc_detail(config, program, filters, level)
      break
    case 'FG ON HAND UNTAGGED':
      detail = await lvl_3_subtotal_getFgAtLoc_untagged_detail(config, program, filters, level)
      break
    case 'FG ON HAND TAGGED':
      detail = await lvl_3_subtotal_getFgAtLoc_tagged_detail(config, program, filters, level)
      break
  }

  return detail
}

module.exports = getDetail
