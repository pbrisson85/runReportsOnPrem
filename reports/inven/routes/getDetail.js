const router = require('express').Router()
const getReportConfig = require('../../utils/getReportConfig')
const { getInven_detail } = require('../postgres/getDetail/getInven')
const { getPo_detail } = require('../postgres/getDetail/getOpenPo')
const { getSo_detail } = require('../postgres/getDetail/getSo')
const detailColsMap = require('../data/detailCols/colsMap')
const groupByOptions = require('../../filters/data/detailGroupBy')

// left off trying to get detail and rowSlice to work on inven reports. Was in the middel of renaming inventory col type to inven only. Once detail and slice work next is to get the cols to be able to group by location and rows to be able to have location as well. THEN can move on to the production report. ***************************

// THEN need custom reports where there is a dataType/view and decimals override on the cols so that mixed data types can be show on one report

router.post('/', async (req, res) => {
  console.log(`\nget detail route HIT...`)

  const { colStartDate, colEndDate, colType } = req.body

  req.body.module = 'inven'

  const config = await getReportConfig(req.body)

  let data = null

  console.log(`\n${config.user} - get detail data for ${config.baseFormat.dataName} route HIT...`)

  if (colType === 'inven') {
    data = await getInven_detail(config, colStartDate, colEndDate)
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

  console.log(`${config.user} - get detail data for ${config.baseFormat.dataName} route COMPLETE. \n`)
  res.send({ data, cols, menu })
})

module.exports = router
