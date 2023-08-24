const {
  lvl_3_subtotal_getFgInven_detail,
  lvl_3_subtotal_getFgInTransit_detail,
  lvl_3_subtotal_getFgAtLoc_detail,
  lvl_2_subtotal_getFgInven_detail,
  lvl_2_subtotal_getFgInTransit_detail,
  lvl_2_subtotal_getFgAtLoc_detail,
  lvl_1_subtotal_getFgInven_detail,
  lvl_1_subtotal_getFgInTransit_detail,
  lvl_1_subtotal_getFgAtLoc_detail,
  lvl_0_total_getFgInven_detail,
  lvl_0_total_getFgInTransit_detail,
  lvl_0_total_getFgAtLoc_detail,
  lvl_3_subtotal_getFgAtLoc_untagged_detail,
  lvl_3_subtotal_getFgAtLoc_tagged_detail,
  lvl_0_total_getFgAtLoc_untagged_detail,
  lvl_0_total_getFgAtLoc_tagged_detail,
  lvl_1_subtotal_getFgAtLoc_untagged_detail,
  lvl_1_subtotal_getFgAtLoc_tagged_detail,
  lvl_2_subtotal_getFgAtLoc_untagged_detail,
  lvl_2_subtotal_getFgAtLoc_tagged_detail,
} = require('../../queries/postgres/getDetail_baseReport/getFgInven')

const getDetail = async (level, config, program, filters, columnDataName) => {
  let detail = null

  if (level === 1) {
    // get level 1 subtotal where species = filters[0] and brand = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'FG INVEN':
        detail = await lvl_1_subtotal_getFgInven_detail(config, program, filters)
        break
      case 'FG IN TRANSIT':
        detail = await lvl_1_subtotal_getFgInTransit_detail(config, program, filters)
        break
      case 'FG ON HAND':
        detail = await lvl_1_subtotal_getFgAtLoc_detail(config, program, filters)
        break
      case 'FG ON HAND UNTAGGED':
        detail = await lvl_1_subtotal_getFgAtLoc_untagged_detail(config, program, filters)
        break
      case 'FG ON HAND TAGGED':
        detail = await lvl_1_subtotal_getFgAtLoc_tagged_detail(config, program, filters)
        break
    }
  }

  if (level === 2) {
    // get level 2 subtotal where species = filters[0] and brand = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'FG INVEN':
        detail = await lvl_2_subtotal_getFgInven_detail(config, program, filters)
        break
      case 'FG IN TRANSIT':
        detail = await lvl_2_subtotal_getFgInTransit_detail(config, program, filters)
        break
      case 'FG ON HAND':
        detail = await lvl_2_subtotal_getFgAtLoc_detail(config, program, filters)
        break
      case 'FG ON HAND UNTAGGED':
        detail = await lvl_2_subtotal_getFgAtLoc_untagged_detail(config, program, filters)
        break
      case 'FG ON HAND TAGGED':
        detail = await lvl_2_subtotal_getFgAtLoc_tagged_detail(config, program, filters)
        break
    }
  }

  if (level === 3) {
    // get level 3 subtotal where species = filters[0] and brand = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'FG INVEN':
        detail = await lvl_3_subtotal_getFgInven_detail(config, program, filters)
        break
      case 'FG IN TRANSIT':
        detail = await lvl_3_subtotal_getFgInTransit_detail(config, program, filters)
        break
      case 'FG ON HAND':
        detail = await lvl_3_subtotal_getFgAtLoc_detail(config, program, filters)
        break
      case 'FG ON HAND UNTAGGED':
        detail = await lvl_3_subtotal_getFgAtLoc_untagged_detail(config, program, filters)
        break
      case 'FG ON HAND TAGGED':
        detail = await lvl_3_subtotal_getFgAtLoc_tagged_detail(config, program, filters)
        break
    }
  }

  if (level === 0) {
    // get level 0 total where species = filters[0] and brand = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'FG INVEN':
        detail = await lvl_0_total_getFgInven_detail(config, program, filters)
        break
      case 'FG IN TRANSIT':
        detail = await lvl_0_total_getFgInTransit_detail(config, program, filters)
        break
      case 'FG ON HAND':
        detail = await lvl_0_total_getFgAtLoc_detail(config, program, filters)
        break
      case 'FG ON HAND UNTAGGED':
        detail = await lvl_0_total_getFgAtLoc_untagged_detail(config, program, filters)
        break
      case 'FG ON HAND TAGGED':
        detail = await lvl_0_total_getFgAtLoc_tagged_detail(config, program, filters)
        break
    }
  }

  return detail
}

module.exports = getDetail
