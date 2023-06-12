const { getDateEndPerWeekByRange } = require('../../shared/queries/postgres/getDateEndPerWeek')
const {
  lvl_1_subtotal_getSalesByWk,
  lvl_2_subtotal_getSalesByWk,
  lvl_0_total_getSalesByWk,
  lvl_1_subtotal_getSalesPeriodToDate,
  lvl_2_subtotal_getSalesPeriodToDate,
  lvl_0_total_getSalesPeriodToDate,
} = require('../queries/postgres/getSalesTrend')
const {
  lvl_1_subtotal_getFgInven,
  lvl_2_subtotal_getFgInven,
  lvl_0_total_getFgInven,
  lvl_1_subtotal_getFgInTransit,
  lvl_2_subtotal_getFgInTransit,
  lvl_0_total_getFgInTransit,
  lvl_1_subtotal_getFgAtLoc,
  lvl_2_subtotal_getFgAtLoc,
  lvl_0_total_getFgAtLoc,
} = require('../queries/postgres/getFgInven')
const {
  lvl_1_subtotal_getRmInven,
  lvl_2_subtotal_getRmInven,
  lvl_0_total_getRmInven,
  lvl_1_subtotal_getRmInTransit,
  lvl_2_subtotal_getRmInTransit,
  lvl_0_total_getRmInTransit,
  lvl_1_subtotal_getRmAtLoc,
  lvl_2_subtotal_getRmAtLoc,
  lvl_0_total_getRmAtLoc,
} = require('../queries/postgres/getRmInven')
const { lvl_1_subtotal_getFgPo, lvl_2_subtotal_getFgPo, lvl_0_total_getFgPo } = require('../queries/postgres/getFgOpenPo')
const { lvl_1_subtotal_getRmPo, lvl_2_subtotal_getRmPo, lvl_0_total_getRmPo } = require('../queries/postgres/getRmOpenPo')
const { lvl_1_subtotal_getSo, lvl_2_subtotal_getSo, lvl_0_total_getSo } = require('../queries/postgres/getSo')
const { getLevelTwoRows, getLevelOneRows } = require('../queries/postgres/getRows')
const unflattenRowTemplate = require('../../shared/models/unflattenRowTemplate')
const mapSalesToRowTemplates = require('../../shared/models/mapSalesToRowTemplatesTwoLevel')
const mapInvenToRowTemplates = require('../../shared/models/mapInvenToRowTemplatesTwoLevel')
const combineMappedRows = require('../../shared/models/combineMappedRows')
const cleanLabelsForDisplay = require('../../shared/models/cleanLabelsForDisplay')
const labelCols = require('../queries/hardcode/cols')

const getWeeklyProgramSales = async (start, end) => {
  ///////////////////////////////// INVENTORY DATA

  /* TOTAL FG */
  const lvl_1_subtotal_fgInven = await lvl_1_subtotal_getFgInven()
  const lvl_2_subtotal_fgInven = await lvl_2_subtotal_getFgInven()
  const lvl_0_total_fgInven = await lvl_0_total_getFgInven()
  /* FG IN TRANSIT*/
  const lvl_1_subtotal_fgInTransit = await lvl_1_subtotal_getFgInTransit()
  const lvl_2_subtotal_fgInTransit = await lvl_2_subtotal_getFgInTransit()
  const lvl_0_total_fgInTransit = await lvl_0_total_getFgInTransit()
  /* FG ON HAND (LESS IN TRANSIT) */
  const lvl_1_subtotal_fgAtLoc = await lvl_1_subtotal_getFgAtLoc()
  const lvl_2_subtotal_fgAtLoc = await lvl_2_subtotal_getFgAtLoc()
  const lvl_0_total_fgAtLocation = await lvl_0_total_getFgAtLoc()
  /* FG ON ORDER */
  const lvl_1_subtotal_fgPo = await lvl_1_subtotal_getFgPo()
  const lvl_2_subtotal_fgPo = await lvl_2_subtotal_getFgPo()
  const lvl_0_total_fgPo = await lvl_0_total_getFgPo()
  /* TOTAL RM */
  const lvl_1_subtotal_rmInven = await lvl_1_subtotal_getRmInven()
  const lvl_2_subtotal_rmInven = await lvl_2_subtotal_getRmInven()
  const lvl_0_total_rmInven = await lvl_0_total_getRmInven()
  /* RM IN TRANSIT (OUT COUNTRY PLUS IN TRANSIT) */
  const lvl_1_subtotal_rmInTransit = await lvl_1_subtotal_getRmInTransit()
  const lvl_2_subtotal_rmInTransit = await lvl_2_subtotal_getRmInTransit()
  const lvl_0_total_rmInTransit = await lvl_0_total_getRmInTransit()
  /* RM ON HAND (IN COUNTRY LESS IN TRANSIT) */
  const lvl_1_subtotal_rmAtLoc = await lvl_1_subtotal_getRmAtLoc()
  const lvl_2_subtotal_rmAtLoc = await lvl_2_subtotal_getRmAtLoc()
  const lvl_0_total_rmAtLoc = await lvl_0_total_getRmAtLoc()
  /* RM ON ORDER */
  const lvl_1_subtotal_rmPo = await lvl_1_subtotal_getRmPo()
  const lvl_2_subtotal_rmPo = await lvl_2_subtotal_getRmPo()
  const lvl_0_total_rmPo = await lvl_0_total_getRmPo()

  ///////////////////////////////// SALES ORDERS
  const lvl_1_subtotal_so = await lvl_1_subtotal_getSo()
  const lvl_2_subtotal_so = await lvl_2_subtotal_getSo()
  const lvl_0_total_so = await lvl_0_total_getSo()

  ///////////////////////////////// SALES DATA
  /* EACH PERIOD */
  const lvl_1_subtotal_salesByWk = await lvl_1_subtotal_getSalesByWk(start, end)
  const lvl_2_subtotal_salesByWk = await lvl_2_subtotal_getSalesByWk(start, end)
  const lvl_0_total_salesByWk = await lvl_0_total_getSalesByWk(start, end)
  /* TOTAL COL */
  const lvl_1_subtotal_salesPeriodToDate = await lvl_1_subtotal_getSalesPeriodToDate(start, end)
  const lvl_2_subtotal_salesPeriodToDate = await lvl_2_subtotal_getSalesPeriodToDate(start, end)
  const lvl_0_total_salesPeriodToDate = await lvl_0_total_getSalesPeriodToDate(start, end)

  ///////////////////////////////// ROWS
  const levelOneRows = await getLevelOneRows(start, end)
  const levelTwoRows = await getLevelTwoRows(start, end)
  const totalsRow = [{ l1_sublevel 0: 'FG SALES', l2_sublevel 0: 'TOTAL' }]

  // COMPILE FINAL ROW TEMPLATE
  const rowTemplate = [...levelTwoRows, ...levelOneRows]
    .sort((a, b) => {
      if (a.l2_subtotal < b.l2_subtotal) return -1
      if (a.l2_subtotal > b.l2_subtotal) return 1
      return 0
    })
    .sort((a, b) => {
      if (a.l1_subtotal < b.l1_subtotal) return -1
      if (a.l1_subtotal > b.l1_subtotal) return 1
      return 0
    })

  rowTemplate.push(...totalsRow)

  // map data into row template
  const rowTemplate_unflat = unflattenRowTemplate(rowTemplate)

  const mappedSales = mapSalesToRowTemplates(
    [
      ...lvl_1_subtotal_salesPeriodToDate,
      ...lvl_2_subtotal_salesPeriodToDate,
      ...lvl_0_total_salesPeriodToDate,
      ...lvl_1_subtotal_so,
      ...lvl_2_subtotal_so,
      ...lvl_0_total_so,
      ...lvl_1_subtotal_salesByWk,
      ...lvl_2_subtotal_salesByWk,
      ...lvl_0_total_salesByWk,
    ],
    rowTemplate_unflat
  )

  const mappedInven = mapInvenToRowTemplates(
    [
      ...lvl_1_subtotal_fgInven,
      ...lvl_2_subtotal_fgInven,
      ...lvl_0_total_fgInven,
      ...lvl_1_subtotal_fgInTransit,
      ...lvl_2_subtotal_fgInTransit,
      ...lvl_0_total_fgInTransit,
      ...lvl_1_subtotal_fgAtLoc,
      ...lvl_2_subtotal_fgAtLoc,
      ...lvl_0_total_fgAtLocation,
      ...lvl_1_subtotal_fgPo,
      ...lvl_2_subtotal_fgPo,
      ...lvl_0_total_fgPo,
      ...lvl_1_subtotal_rmInven,
      ...lvl_2_subtotal_rmInven,
      ...lvl_0_total_rmInven,
      ...lvl_1_subtotal_rmInTransit,
      ...lvl_2_subtotal_rmInTransit,
      ...lvl_0_total_rmInTransit,
      ...lvl_1_subtotal_rmAtLoc,
      ...lvl_2_subtotal_rmAtLoc,
      ...lvl_0_total_rmAtLoc,
      ...lvl_1_subtotal_rmPo,
      ...lvl_2_subtotal_rmPo,
      ...lvl_0_total_rmPo,
    ],
    rowTemplate_unflat
  )

  const mappedData = combineMappedRows(mappedSales, mappedInven)
  // clean out rows with zero sales
  Object.keys(mappedData).forEach(key => {
    if (Object.keys(mappedData[key]).length === 1) {
      delete mappedData[key]
    }
  })
  const flattenedMappedData = Object.values(mappedData)

  // remove row labels for l1_subtotal except first row of each grouping
  const finalData = cleanLabelsForDisplay(flattenedMappedData)

  // get data column names
  const dataCols = await getDateEndPerWeekByRange(start, end)

  // return
  return { data: finalData, cols: dataCols, labelCols: labelCols }
}

module.exports = getWeeklyProgramSales
