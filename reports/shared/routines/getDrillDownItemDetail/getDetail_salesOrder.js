const { byItem_getSo_detail, byItem_getSoTagged_detail, byItem_getSoUntagged_detail } = require('../../queries/postgres/detailByItem/getSo')

const {
  byItem_getSoByWk_detail,
  byItem_getSoByWkTagged_detail,
  byItem_getSoByWkUntagged_detail,
} = require('../../queries/postgres/detailByItem/getSoByWeek')

const getDetail = async (program, filters, columnDataName) => {
  let detail = null

  switch (columnDataName) {
    case 'FG OPEN ORDER':
      detail = await byItem_getSo_detail(filters[0])
      break
    case 'FG OPEN ORDER TAGGED':
      detail = await byItem_getSoTagged_detail(filters[0])
      break
    case 'FG OPEN ORDER UNTAGGED':
      detail = await byItem_getSoUntagged_detail(filters[0])
      break
    default:
      // Must be a trend column
      // note colName is 2023-W15_so , 2023-W15_so_untg, 2023-W15_so_tg
      const isSo = columnDataName.split('_').length === 2 && columnDataName.split('_')[1] === 'so'
      const isSoUntg = columnDataName.split('_')[2] === 'untg'
      const isSoTg = columnDataName.split('_')[2] === 'tg'
      const weekSerial = columnDataName.split('_')[0]

      // query trend for all sales orders
      if (isSo) detail = await byItem_getSoByWk_detail(filters[0], weekSerial)
      // query trend for untagged sales orders
      if (isSoUntg) detail = await byItem_getSoByWkUntagged_detail(filters[0], weekSerial)
      // query trend for tagged sales orders
      if (isSoTg) detail = await byItem_getSoByWkTagged_detail(filters[0], weekSerial)
      break
  }

  return detail
}

module.exports = getDetail
