const {
  lvl_1_subtotal_getSo_detail,
  lvl_1_subtotal_getSoTagged_detail,
  lvl_1_subtotal_getSoUntagged_detail,
  lvl_2_subtotal_getSo_detail,
  lvl_2_subtotal_getSoTagged_detail,
  lvl_2_subtotal_getSoUntagged_detail,
  lvl_3_subtotal_getSo_detail,
  lvl_3_subtotal_getSoTagged_detail,
  lvl_3_subtotal_getSoUntagged_detail,
  lvl_0_total_getSo_detail,
  lvl_0_total_getSoTagged_detail,
  lvl_0_total_getSoUntagged_detail,
} = require('../queries/postgres/detail/getSo')

const getDetail = async (program, filters, columnDataName) => {
  let detail = null

  if (filters[1] === 'SUBTOTAL' && filters[2] === 'SUBTOTAL') {
    // get level 1 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'FG OPEN ORDER':
        detail = await lvl_1_subtotal_getSo_detail(program, filters)
        break
      case 'FG OPEN ORDER TAGGED':
        detail = await lvl_1_subtotal_getSoTagged_detail(program, filters)
        break
      case 'FG OPEN ORDER UNTAGGED':
        detail = await lvl_1_subtotal_getSoUntagged_detail(program, filters)
        break
    }
  }

  if (filters[1] !== 'SUBTOTAL' && filters[2] === 'SUBTOTAL') {
    // get level 2 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'FG OPEN ORDER':
        detail = await lvl_2_subtotal_getSo_detail(program, filters)
        break
      case 'FG OPEN ORDER TAGGED':
        detail = await lvl_2_subtotal_getSoTagged_detail(program, filters)
        break
      case 'FG OPEN ORDER UNTAGGED':
        detail = await lvl_2_subtotal_getSoUntagged_detail(program, filters)
        break
    }
  }

  if (filters[1] !== 'SUBTOTAL' && filters[2] !== 'SUBTOTAL' && filters[1] !== 'TOTAL' && filters[2] !== 'TOTAL') {
    // get level 3 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'FG OPEN ORDER':
        detail = await lvl_3_subtotal_getSo_detail(program, filters)
        break
      case 'FG OPEN ORDER TAGGED':
        detail = await lvl_3_subtotal_getSoTagged_detail(program, filters)
        break
      case 'FG OPEN ORDER UNTAGGED':
        detail = await lvl_3_subtotal_getSoUntagged_detail(program, filters)
        break
    }
  }

  if (filters[1] === 'TOTAL' && filters[2] === 'TOTAL') {
    // get level 0 total where freeze = filters[0] and soak = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'FG OPEN ORDER':
        detail = await lvl_0_total_getSo_detail(program, filters)
        break
      case 'FG OPEN ORDER TAGGED':
        detail = await lvl_0_total_getSoTagged_detail(program, filters)
        break
      case 'FG OPEN ORDER UNTAGGED':
        detail = await lvl_0_total_getSoUntagged_detail(program, filters)
        break
    }
  }

  return detail
}

module.exports = getDetail
