const router = require('express').Router()
const getReportConfig = require('../../utils/getReportConfig')
const {
  getFgInven_detail,
  getFgInTransit_detail,
  getFgAtLoc_detail,
  getFgAtLoc_untagged_detail,
  getFgAtLoc_tagged_detail,
} = require('../postgres/getDetail/getFgInven')
const { getFgPo_detail } = require('../postgres/getDetail/getFgOpenPo')
const { getSales_detail } = require('../postgres/getDetail/getSales')
const { getSalesProjection_detail } = require('../postgres/getDetail/getSalesProjection')
const { getSo_detail, getSoTagged_detail, getSoUntagged_detail } = require('../postgres/getDetail/getSo')
const detailColsMap = require('../data/detailCols/colsMap')
const groupByOptions = require('../../filters/detailGroupBy')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc
// @access  Private

router.post('/', async (req, res) => {
  const { columnDataName, reportFormat, startDate, endDate, useProjection } = req.body
  let { colType } = req.body // for now manually determining if projeciton vs sales below. Need to override col type to projection to get correct cols

  const config = await getReportConfig(req.body)

  let data = null

  console.log(`\n${config.user} - get detail data for ${reportFormat.dataName} route HIT...`)

  if (colType === 'invenFg') {
    data = await getFgInven_detail(config)
  }

  if (colType === 'salesOrder') {
    data = await getSo_detail(config, startDate, endDate)
  }

  if (colType === 'salesInvoice') {
    if (useProjection?.so || useProjection?.pr) {
      data = await getSalesProjection_detail(config, startDate, endDate, useProjection) // Should try to combine with getSales_detail
      colType = 'salesProjection' // for now manually determining if projeciton vs sales below. Need to override col type to projection to get correct cols
    } else {
      data = await getSales_detail(config, startDate, endDate)
    }
  }

  if (colType === 'purchaseOrder') {
    data = await getFgPo_detail(config)
  }

  // Assign columns and menu
  const cols = detailColsMap[colType]
  const menu = groupByOptions[colType]

  console.log(`${config.user} - get detail data for ${reportFormat.dataName} route COMPLETE. \n`)
  res.send({ data, cols, menu })
})

module.exports = router
