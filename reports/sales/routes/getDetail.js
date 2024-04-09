const router = require('express').Router()
const getReportConfig = require('../../utils/getReportConfig')
const { getInven_detail } = require('../postgres/getDetail/getInven')
const { getPo_detail } = require('../postgres/getDetail/getOpenPo')
const { getSales_detail } = require('../postgres/getDetail/getSales')
const { getSalesProjection_detail } = require('../postgres/getDetail/getSalesProjection')
const { getSo_detail } = require('../postgres/getDetail/getSo')
const getDetailColsMap = require('../data/detailCols/colsMap')
const groupByOptions = require('../../filters/data/detailGroupBy')

const buildOthpGlTempTable = require('../postgres/baseReport/helperRoutines/buildOthpGlTempTable')
const dropTempTable = require('../postgres/baseReport/helperQueries/dropTempOthpTable')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc
// @access  Private

router.post('/', async (req, res) => {
  const { colStartDate, colEndDate, timeSeriesCol } = req.body
  let { colType } = req.body // for now manually determining if projeciton vs sales below. Need to override col type to projection to get correct cols

  req.body.module = 'sales'

  const config = await getReportConfig(req.body)

  let data = null

  console.log(`\n${config.user} - get detail data for ${config.baseFormat.dataName} route HIT...`)

  if (colType === 'inven') {
    data = await getInven_detail(config)
  }

  if (colType === 'salesOrder' && !timeSeriesCol) {
    data = await getSo_detail(config, config.dates.salesOrders.startDate, config.dates.salesOrders.endDate)
  }

  if (colType === 'salesOrder' && timeSeriesCol) {
    data = await getSo_detail(config, colStartDate, colEndDate)
  }

  if (colType === 'salesInvoice' && !timeSeriesCol) {
    if (config.dates.totals.useProjection?.so || config.dates.totals.useProjection?.pr) {
      data = await getSalesProjection_detail(
        config,
        config.dates.totals.primary.startDate,
        config.dates.totals.primary.endDate,
        config.dates.totals.useProjection
      ) // Should try to combine with getSales_detail
      colType = 'salesProjection' // for now manually determining if projeciton vs sales below. Need to override col type to projection to get correct cols
    } else {
      // Build temp othp table *********************
      // CUSTOM TO SALES MODULE: OTHP Detail. Note this is dynamic, the GL account/categories are generated on the fly based on the data queried.
      const othpTableConfig = await buildOthpGlTempTable(config, config.dates.totals.primary.startDate, config.dates.totals.primary.endDate) // table gets dropped below

      data = await getSales_detail(config, config.dates.totals.primary.startDate, config.dates.totals.primary.endDate, othpTableConfig)

      // for some reason the othp amounts are returned as strings, so convert to numbers
      data = data.map(row => {
        const newRow = { ...row }
        Object.keys(newRow).forEach(key => {
          if (key.includes('othp_')) {
            newRow[key] = parseFloat(newRow[key])
          }
        })
        return newRow
      })

      // DROP TEMP TABLE
      await dropTempTable(othpTableConfig.othpTable)
    }
  }

  if (colType === 'salesInvoice' && timeSeriesCol) {
    if (config.dates.totals.useProjection?.so || config.dates.totals.useProjection?.pr) {
      data = await getSalesProjection_detail(config, colStartDate, colEndDate, config.dates.totals.useProjection) // Should try to combine with getSales_detail
      colType = 'salesProjection' // for now manually determining if projeciton vs sales below. Need to override col type to projection to get correct cols
    } else {
      // Build temp othp table *********************
      // CUSTOM TO SALES MODULE: OTHP Detail. Note this is dynamic, the GL account/categories are generated on the fly based on the data queried.
      const othpTableConfig = await buildOthpGlTempTable(config, colStartDate, colEndDate) // table gets dropped below

      data = await getSales_detail(config, colStartDate, colEndDate, othpTableConfig)

      // for some reason the othp amounts are returned as strings, so convert to numbers
      data = data.map(row => {
        const newRow = { ...row }
        Object.keys(newRow).forEach(key => {
          if (key.includes('othp_')) {
            newRow[key] = parseFloat(newRow[key])
          }
        })
        return newRow
      })

      // DROP TEMP TABLE
      await dropTempTable(othpTableConfig.othpTable)
    }
  }

  if (colType === 'purchaseOrder') {
    data = await getPo_detail(config)
  }

  // Assign columns and menu
  const detailColsMap = await getDetailColsMap() // This is using a function which is different from all other modules because I am dynamically building the sales cols due to othp

  let cols = detailColsMap[colType]

  // remove cols with no data (because all othp cals are being added to template but I dont like how it shows as NAN)
  const dataCols = Object.keys(data[0])
  const colKeys = Object.keys(cols)
  const colsToRemove = colKeys.filter(col => !dataCols.includes(col))

  console.log('colsToRemove', colsToRemove)

  cols = cols.filter(col => !colsToRemove.includes(col.dataName))

  const menu = groupByOptions[colType]

  console.log(`${config.user} - get detail data for ${config.baseFormat.dataName} route COMPLETE. \n`)
  res.send({ data, cols, menu })
})

module.exports = router
