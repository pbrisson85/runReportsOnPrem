const {
  byItem_getFgInven_detail,
  byItem_getFgInTransit_detail,
  byItem_getFgAtLoc_detail,
  byItem_getFgAtLoc_untagged_detail,
  byItem_getFgAtLoc_tagged_detail,
} = require('../queries/postgres/detailByItem/getFgInven')

const getDetail = async (program, filters, columnDataName) => {
  let detail = null

  switch (columnDataName) {
    case 'FG INVEN':
      detail = await byItem_getFgInven_detail(filters[0])
      break
    case 'FG IN TRANSIT':
      detail = await byItem_getFgInTransit_detail(filters[0])
      break
    case 'FG ON HAND':
      detail = await byItem_getFgAtLoc_detail(filters[0])
      break
    case 'FG ON HAND UNTAGGED':
      detail = await byItem_getFgAtLoc_untagged_detail(filters[0])
      break
    case 'FG ON HAND TAGGED':
      detail = await byItem_getFgAtLoc_tagged_detail(filters[0])
      break
  }

  return detail
}

module.exports = getDetail
