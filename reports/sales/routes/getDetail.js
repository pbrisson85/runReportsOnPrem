const router = require('express').Router()
const getReportConfig = require('../utils/getReportConfig')
const {
  getFgInven_detail,
  getFgInTransit_detail,
  getFgAtLoc_detail,
  getFgAtLoc_untagged_detail,
  getFgAtLoc_tagged_detail,
} = require('../../../database/queries/postgres/getDetail/getFgInven')
const { getFgPo_detail } = require('../../../database/queries/postgres/getDetail/getFgOpenPo')
const { getSales_detail } = require('../../../database/queries/postgres/getDetail/getSales')
const { getSalesProjection_detail } = require('../../../database/queries/postgres/getDetail/getSalesProjection')
const { getSo_detail, getSoTagged_detail, getSoUntagged_detail } = require('../../../database/queries/postgres/getDetail/getSo')
const detailColsMap = require('../data/detailCols/colsMap')
const groupByOptions = require('../data/filters/detailGroupBy')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc
// @access  Private

router.post('/', async (req, res) => {
  const { columnDataName, colType, reportFormat, startDate, endDate } = req.body

  const config = await getReportConfig(req.body)

  console.log('detail:', startDate, endDate)

  let data = null

  console.log(`\n${config.user} - get detail data for ${reportFormat.dataName} route HIT...`)

  if (colType === 'invenFg') {
    switch (columnDataName) {
      case 'FG INVEN':
        data = await getFgInven_detail(config)
        break
      case 'FG IN TRANSIT':
        data = await getFgInTransit_detail(config)
        break
      case 'FG ON HAND':
        data = await getFgAtLoc_detail(config)
        break
      case 'FG ON HAND UNTAGGED':
        data = await getFgAtLoc_untagged_detail(config)
        break
      case 'FG ON HAND TAGGED':
        data = await getFgAtLoc_tagged_detail(config)
        break
    }
  }

  if (colType === 'salesOrder') {
    data = await getSo_detail(config, startDate, endDate) // Not handling tagged vs untagged here. ******************* Might need to revisit to correct
  }

  if (colType === 'salesInvoice') {
    data = await getSales_detail(config, startDate, endDate)
  }

  if (colType === 'salesProjection') {
    // Transform all queries to have a start week, end week, and year
    let startWeek = config.totals.startWeekPrimary
    let endWeek = config.totals.endWeekPrimary
    let year = config.totals.yearPrimary

    if (columnDataName.split('-')[1]?.charAt(0) === 'W') {
      startWeek = columnDataName.split('-')[1].split('W')[1].split('_')[0]
      endWeek = columnDataName.split('-')[1].split('W')[1].split('_')[0]
      year = columnDataName.split('-')[0]
    }

    data = await getSalesProjection_detail(config, startWeek, endWeek, year)
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
