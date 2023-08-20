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
} = require('../../queries/postgres/getDetail_baseReport/getSo')

const {
  lvl_1_subtotal_getSoByWk_detail,
  lvl_1_subtotal_getSoByWkTagged_detail,
  lvl_1_subtotal_getSoByWkUntagged_detail,
  lvl_2_subtotal_getSoByWk_detail,
  lvl_2_subtotal_getSoByWkTagged_detail,
  lvl_2_subtotal_getSoByWkUntagged_detail,
  lvl_3_subtotal_getSoByWk_detail,
  lvl_3_subtotal_getSoByWkTagged_detail,
  lvl_3_subtotal_getSoByWkUntagged_detail,
  lvl_0_total_getSoByWk_detail,
  lvl_0_total_getSoByWkTagged_detail,
  lvl_0_total_getSoByWkUntagged_detail,
} = require('../../queries/postgres/getDetail_baseReport/getSoByWeek')

const getDetail = async (level, config, program, filters, columnDataName) => {
  let detail = null

  if (level === 1) {
    // get level 1 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'FG OPEN ORDER':
        detail = await lvl_1_subtotal_getSo_detail(config, program, filters)
        break
      case 'FG OPEN ORDER TAGGED':
        detail = await lvl_1_subtotal_getSoTagged_detail(config, program, filters)
        break
      case 'FG OPEN ORDER UNTAGGED':
        detail = await lvl_1_subtotal_getSoUntagged_detail(config, program, filters)
        break
      default:
        // Must be a trend column
        // note colName is 2023-W15_so , 2023-W15_so_untg, 2023-W15_so_tg
        const isSo = columnDataName.split('_').length === 2 && columnDataName.split('_')[1] === 'so'
        const isSoUntg = columnDataName.split('_')[2] === 'untg'
        const isSoTg = columnDataName.split('_')[2] === 'tg'
        const weekSerial = columnDataName.split('_')[0]

        // query trend for all sales orders
        if (isSo) detail = await lvl_1_subtotal_getSoByWk_detail(config, program, filters, weekSerial)
        // query trend for untagged sales orders
        if (isSoUntg) detail = await lvl_1_subtotal_getSoByWkUntagged_detail(config, program, filters, weekSerial)
        // query trend for tagged sales orders
        if (isSoTg) detail = await lvl_1_subtotal_getSoByWkTagged_detail(config, program, filters, weekSerial)
        break
    }
  }

  if (level === 2) {
    // get level 2 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'FG OPEN ORDER':
        detail = await lvl_2_subtotal_getSo_detail(config, program, filters)
        break
      case 'FG OPEN ORDER TAGGED':
        detail = await lvl_2_subtotal_getSoTagged_detail(config, program, filters)
        break
      case 'FG OPEN ORDER UNTAGGED':
        detail = await lvl_2_subtotal_getSoUntagged_detail(config, program, filters)
        break
      default:
        // Must be a trend column
        // note colName is 2023-W15_so , 2023-W15_so_untg, 2023-W15_so_tg
        const isSo = columnDataName.split('_').length === 2 && columnDataName.split('_')[1] === 'so'
        const isSoUntg = columnDataName.split('_')[2] === 'untg'
        const isSoTg = columnDataName.split('_')[2] === 'tg'
        const weekSerial = columnDataName.split('_')[0]

        // query trend for all sales orders
        if (isSo) detail = await lvl_2_subtotal_getSoByWk_detail(config, program, filters, weekSerial)
        // query trend for untagged sales orders
        if (isSoUntg) detail = await lvl_2_subtotal_getSoByWkUntagged_detail(config, program, filters, weekSerial)
        // query trend for tagged sales orders
        if (isSoTg) detail = await lvl_2_subtotal_getSoByWkTagged_detail(config, program, filters, weekSerial)
        break
    }
  }

  if (level === 3) {
    // get level 3 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'FG OPEN ORDER':
        detail = await lvl_3_subtotal_getSo_detail(config, program, filters)
        break
      case 'FG OPEN ORDER TAGGED':
        detail = await lvl_3_subtotal_getSoTagged_detail(config, program, filters)
        break
      case 'FG OPEN ORDER UNTAGGED':
        detail = await lvl_3_subtotal_getSoUntagged_detail(config, program, filters)
        break
      default:
        // Must be a trend column
        // note colName is 2023-W15_so , 2023-W15_so_untg, 2023-W15_so_tg
        const isSo = columnDataName.split('_').length === 2 && columnDataName.split('_')[1] === 'so'
        const isSoUntg = columnDataName.split('_')[2] === 'untg'
        const isSoTg = columnDataName.split('_')[2] === 'tg'
        const weekSerial = columnDataName.split('_')[0]

        // query trend for all sales orders
        if (isSo) detail = await lvl_3_subtotal_getSoByWk_detail(config, program, filters, weekSerial)
        // query trend for untagged sales orders
        if (isSoUntg) detail = await lvl_3_subtotal_getSoByWkUntagged_detail(config, program, filters, weekSerial)
        // query trend for tagged sales orders
        if (isSoTg) detail = await lvl_3_subtotal_getSoByWkTagged_detail(config, program, filters, weekSerial)
        break
    }
  }

  if (level === 0) {
    // get level 0 total where freeze = filters[0] and soak = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'FG OPEN ORDER':
        detail = await lvl_0_total_getSo_detail(config, program, filters)
        break
      case 'FG OPEN ORDER TAGGED':
        detail = await lvl_0_total_getSoTagged_detail(config, program, filters)
        break
      case 'FG OPEN ORDER UNTAGGED':
        detail = await lvl_0_total_getSoUntagged_detail(config, program, filters)
        break
      default:
        // Must be a trend column
        // note colName is 2023-W15_so , 2023-W15_so_untg, 2023-W15_so_tg
        const isSo = columnDataName.split('_').length === 2 && columnDataName.split('_')[1] === 'so'
        const isSoUntg = columnDataName.split('_')[2] === 'untg'
        const isSoTg = columnDataName.split('_')[2] === 'tg'
        const weekSerial = columnDataName.split('_')[0]

        // query trend for all sales orders
        if (isSo) detail = await lvl_0_total_getSoByWk_detail(config, program, filters, weekSerial)
        // query trend for untagged sales orders
        if (isSoUntg) detail = await lvl_0_total_getSoByWkUntagged_detail(config, program, filters, weekSerial)
        // query trend for tagged sales orders
        if (isSoTg) detail = await lvl_0_total_getSoByWkTagged_detail(config, program, filters, weekSerial)
        break
    }
  }

  return detail
}

module.exports = getDetail
