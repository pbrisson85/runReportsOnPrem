const router = require('express').Router()
const getReportConfig = require('../../utils/getReportConfig')
const { getPo_detail } = require('../postgres/getDetail/getOpenPo')
const { getSo_detail } = require('../postgres/getDetail/getSo')
const detailColsMap = require('../data/detailCols/colsMap')
const groupByOptions = require('../../filters/data/detailGroupBy')

router.post('/', async (req, res) => {
  const { colStartDate, colEndDate, timeSeriesCol } = req.body
  let { colType } = req.body // for now manually determining if projeciton vs sales below. Need to override col type to projection to get correct cols

  req.body.module = 'cash_po'

  const config = await getReportConfig(req.body)

  let data = null

  console.log(`\n${config.user} - get detail data for ${config.baseFormat.dataName} route HIT...`)

  if (colType === timeSeriesCol) {
    data = await getSo_detail(config, config.dates.salesOrders.startDate, config.dates.salesOrders.endDate)
  }

  if (colType === 'purchaseOrder') {
    data = await getPo_detail(config)
  }

  // Assign columns and menu
  const cols = detailColsMap[colType]
  const menu = groupByOptions[colType]

  console.log(`${config.user} - get detail data for ${config.baseFormat.dataName} route COMPLETE. \n`)
  res.send({ data, cols, menu })
})

module.exports = router
