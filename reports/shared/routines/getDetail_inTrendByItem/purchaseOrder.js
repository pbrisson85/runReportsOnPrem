const { byItem_getFgPo_detail } = require('../../queries/postgres/getDetail_inTrendByItem/getFgOpenPo')

const getDetail = async (program, filters) => {
  const detail = byItem_getFgPo_detail(filters[0])

  return detail
}

module.exports = getDetail
