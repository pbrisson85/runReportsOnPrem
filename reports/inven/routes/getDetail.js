const router = require('express').Router()
const getReportConfig = require('../../utils/getReportConfig')
const { getInven_detail } = require('../postgres/getDetail/getInven')
const { getPo_detail } = require('../postgres/getDetail/getOpenPo')
const { getSales_detail } = require('../postgres/getDetail/getSales')
const { getSalesProjection_detail } = require('../postgres/getDetail/getSalesProjection')
const { getSo_detail } = require('../postgres/getDetail/getSo')
const detailColsMap = require('../data/detailCols/colsMap')
const groupByOptions = require('../../filters/data/detailGroupBy')

router.post('/', async (req, res) => {
  console.log(`\nget detail route HIT...`)

  const { reportFormat, startDateInven, endDateInven } = req.body
  let { colType } = req.body // for now manually determining if projeciton vs sales below. Need to override col type to projection to get correct cols

  const config = await getReportConfig(req.body)

  let data = null

  console.log(`\n${config.user} - get detail data for ${reportFormat.dataName} route HIT...`)

  if (colType === 'inven') {
    data = await getInven_detail(config, startDateInven, endDateInven)
  }

  if (colType === 'salesOrder') {
    data = await getSo_detail(config)
  }

  if (colType === 'purchaseOrder') {
    data = await getPo_detail(config)
  }

  // Assign columns and menu
  const cols = detailColsMap[colType]
  const menu = groupByOptions[colType]

  console.log(`${config.user} - get detail data for ${reportFormat.dataName} route COMPLETE. \n`)
  res.send({ data, cols, menu })
})

module.exports = router
