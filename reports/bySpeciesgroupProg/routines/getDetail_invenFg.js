const {
  lvl_2_subtotal_getFgInven_detail,
  lvl_2_subtotal_getFgInTransit_detail,
  lvl_2_subtotal_getFgAtLoc_detail,
  lvl_1_subtotal_getFgInven_detail,
  lvl_1_subtotal_getFgInTransit_detail,
  lvl_1_subtotal_getFgAtLoc_detail,
  lvl_0_total_getFgInven_detail,
  lvl_0_total_getFgInTransit_detail,
  lvl_0_total_getFgAtLoc_detail,
  lvl_0_total_getFgAtLoc_untagged_detail,
  lvl_0_total_getFgAtLoc_tagged_detail,
  lvl_1_subtotal_getFgAtLoc_untagged_detail,
  lvl_1_subtotal_getFgAtLoc_tagged_detail,
  lvl_2_subtotal_getFgAtLoc_untagged_detail,
  lvl_2_subtotal_getFgAtLoc_tagged_detail,
} = require('../queries/postgres/detail/getFgInven')

const getDetail = async (program, filters, columnDataName) => {
  let detail = null

  if (filters[0] === 'SUBTOTAL' || filters[1] === 'SUBTOTAL') {
    // get level 1 subtotal where species = filters[0] and brand = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'FG INVEN':
        detail = await lvl_1_subtotal_getFgInven_detail(program, filters)
        break
      case 'FG IN TRANSIT':
        detail = await lvl_1_subtotal_getFgInTransit_detail(program, filters)
        break
      case 'FG ON HAND':
        detail = await lvl_1_subtotal_getFgAtLoc_detail(program, filters)
        break
      case 'FG ON HAND UNTAGGED':
        detail = await lvl_1_subtotal_getFgAtLoc_untagged_detail(program, filters)
        break
      case 'FG ON HAND TAGGED':
        detail = await lvl_1_subtotal_getFgAtLoc_tagged_detail(program, filters)
        break
    }
  }

  if (filters[0] !== 'SUBTOTAL' && filters[1] !== 'SUBTOTAL') {
    // get level 2 subtotal where species = filters[0] and brand = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'FG INVEN':
        detail = await lvl_2_subtotal_getFgInven_detail(program, filters)
        break
      case 'FG IN TRANSIT':
        detail = await lvl_2_subtotal_getFgInTransit_detail(program, filters)
        break
      case 'FG ON HAND':
        detail = await lvl_2_subtotal_getFgAtLoc_detail(program, filters)
        break
      case 'FG ON HAND UNTAGGED':
        detail = await lvl_2_subtotal_getFgAtLoc_untagged_detail(program, filters)
        break
      case 'FG ON HAND TAGGED':
        detail = await lvl_2_subtotal_getFgAtLoc_tagged_detail(program, filters)
        break
    }
  }

  if (filters[1] === 'TOTAL') {
    // get level 0 total where species = filters[0] and brand = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'FG INVEN':
        detail = await lvl_0_total_getFgInven_detail(program, filters)
        break
      case 'FG IN TRANSIT':
        detail = await lvl_0_total_getFgInTransit_detail(program, filters)
        break
      case 'FG ON HAND':
        detail = await lvl_0_total_getFgAtLoc_detail(program, filters)
        break
      case 'FG ON HAND UNTAGGED':
        detail = await lvl_0_total_getFgAtLoc_untagged_detail(program, filters)
        break
      case 'FG ON HAND TAGGED':
        detail = await lvl_0_total_getFgAtLoc_tagged_detail(program, filters)
        break
    }
  }

  console.log('detail: ', detail)

  return detail
}

module.exports = getDetail
