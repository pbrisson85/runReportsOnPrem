const {
  lvl_3_subtotal_getSo_detail,
  lvl_3_subtotal_getSoTagged_detail,
  lvl_3_subtotal_getSoUntagged_detail,
} = require('../../queries/postgres/getDetail_inTrendByCust/getSo')

const {
  lvl_3_subtotal_getSoByWk_detail,
  lvl_3_subtotal_getSoByWkTagged_detail,
  lvl_3_subtotal_getSoByWkUntagged_detail,
} = require('../../queries/postgres/getDetail_inTrendByCust/getSoByWeek')

const getDetail = async (level, config, program, filters, columnDataName) => {
  let detail = null

  switch (columnDataName) {
    case 'FG OPEN ORDER':
      detail = await lvl_3_subtotal_getSo_detail(config, program, filters, level)
      break
    case 'FG OPEN ORDER TAGGED':
      detail = await lvl_3_subtotal_getSoTagged_detail(config, program, filters, level)
      break
    case 'FG OPEN ORDER UNTAGGED':
      detail = await lvl_3_subtotal_getSoUntagged_detail(config, program, filters, level)
      break
    default:
      // Must be a trend column
      // note colName is 2023-W15_so , 2023-W15_so_untg, 2023-W15_so_tg
      const isSo = columnDataName.split('_').length === 2 && columnDataName.split('_')[1] === 'so'
      const isSoUntg = columnDataName.split('_')[2] === 'untg'
      const isSoTg = columnDataName.split('_')[2] === 'tg'
      const weekSerial = columnDataName.split('_')[0]

      // query trend for all sales orders
      if (isSo) detail = await lvl_3_subtotal_getSoByWk_detail(config, program, filters, weekSerial, level)
      // query trend for untagged sales orders
      if (isSoUntg) detail = await lvl_3_subtotal_getSoByWkUntagged_detail(config, program, filters, weekSerial, level)
      // query trend for tagged sales orders
      if (isSoTg) detail = await lvl_3_subtotal_getSoByWkTagged_detail(config, program, filters, weekSerial, level)
      break
  }

  return detail
}

module.exports = getDetail
