const { getDateEndPerWeekByRange } = require('../../shared/queries/postgres/getDateEndPerWeek')
const {
  lvl_1_subtotal_getSalesByWk,
  lvl_2_subtotal_getSalesByWk,
  dataTotal_getSalesByWk,
  lvl_1_subtotal_getSalesPeriodToDate,
  lvl_2_subtotal_getSalesPeriodToDate,
  dataTotal_getSalesPeriodToDate,
} = require('../queries/postgres/getSalesTrend')
const {
  lvl_1_subtotal_getFgInven,
  lvl_2_subtotal_getFgInven,
  dataTotal_getFgInven,
  lvl_1_subtotal_getFgInTransit,
  lvl_2_subtotal_getFgInTransit,
  dataTotal_getFgInTransit,
  lvl_1_subtotal_getFgAtLoc,
  lvl_2_subtotal_getFgAtLoc,
  dataTotal_getFgAtLocation,
} = require('../queries/postgres/getFgInven')
const {
  lvl_1_subtotal_getRmInven,
  lvl_2_subtotal_getRmInven,
  dataTotal_getRmInven,
  lvl_1_subtotal_getRmInTransit,
  lvl_2_subtotal_getRmInTransit,
  dataTotal_getRmInTransit,
  lvl_1_subtotal_getRmAtLoc,
  lvl_2_subtotal_getRmAtLoc,
  dataTotal_getRmAtLoc,
} = require('../queries/postgres/getRmInven')
const { lvl_1_subtotal_getFgPo, lvl_2_subtotal_getFgPo, dataTotal_getFgPo } = require('../queries/postgres/getFgOpenPo')
const { lvl_1_subtotal_getRmPo, lvl_2_subtotal_getRmPo, dataTotal_getRmPo } = require('../queries/postgres/getRmOpenPo')
const { lvl_1_subtotal_getSo, lvl_2_subtotal_getSo, dataTotal_getSo } = require('../queries/postgres/getSo')
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
  const dataTotal_fgInven = await dataTotal_getFgInven()
  /* FG IN TRANSIT*/
  const lvl_1_subtotal_fgInTransit = await lvl_1_subtotal_getFgInTransit()
  const lvl_2_subtotal_fgInTransit = await lvl_2_subtotal_getFgInTransit()
  const dataTotal_fgInTransit = await dataTotal_getFgInTransit()
  /* FG ON HAND (LESS IN TRANSIT) */
  const lvl_1_subtotal_fgAtLoc = await lvl_1_subtotal_getFgAtLoc()
  const lvl_2_subtotal_fgAtLoc = await lvl_2_subtotal_getFgAtLoc()
  const dataTotal_fgAtLocation = await dataTotal_getFgAtLocation()
  /* FG ON ORDER */
  const lvl_1_subtotal_fgPo = await lvl_1_subtotal_getFgPo()
  const lvl_2_subtotal_fgPo = await lvl_2_subtotal_getFgPo()
  const dataTotal_fgPo = await dataTotal_getFgPo()
  /* TOTAL RM */
  const lvl_1_subtotal_rmInven = await lvl_1_subtotal_getRmInven()
  const lvl_2_subtotal_rmInven = await lvl_2_subtotal_getRmInven()
  const dataTotal_rmInven = await dataTotal_getRmInven()
  /* RM IN TRANSIT (OUT COUNTRY PLUS IN TRANSIT) */
  const lvl_1_subtotal_rmInTransit = await lvl_1_subtotal_getRmInTransit()
  const lvl_2_subtotal_rmInTransit = await lvl_2_subtotal_getRmInTransit()
  const dataTotal_rmInTransit = await dataTotal_getRmInTransit()
  /* RM ON HAND (IN COUNTRY LESS IN TRANSIT) */
  const lvl_1_subtotal_rmAtLoc = await lvl_1_subtotal_getRmAtLoc()
  const lvl_2_subtotal_rmAtLoc = await lvl_2_subtotal_getRmAtLoc()
  const dataTotal_rmAtLoc = await dataTotal_getRmAtLoc()
  /* RM ON ORDER */
  const lvl_1_subtotal_rmPo = await lvl_1_subtotal_getRmPo()
  const lvl_2_subtotal_rmPo = await lvl_2_subtotal_getRmPo()
  const dataTotal_rmPo = await dataTotal_getRmPo()

  ///////////////////////////////// SALES ORDERS
  const lvl_1_subtotal_so = await lvl_1_subtotal_getSo()
  const lvl_2_subtotal_so = await lvl_2_subtotal_getSo()
  const dataTotal_so = await dataTotal_getSo()

  ///////////////////////////////// SALES DATA
  /* EACH PERIOD */
  const lvl_1_subtotal_salesByWk = await lvl_1_subtotal_getSalesByWk(start, end)
  const lvl_2_subtotal_salesByWk = await lvl_2_subtotal_getSalesByWk(start, end)
  const dataTotal_salesByWk = await dataTotal_getSalesByWk(start, end)
  /* TOTAL COL */
  const lvl_1_subtotal_salesPeriodToDate = await lvl_1_subtotal_getSalesPeriodToDate(start, end)
  const lvl_2_subtotal_salesPeriodToDate = await lvl_2_subtotal_getSalesPeriodToDate(start, end)
  const dataTotal_salesPeriodToDate = await dataTotal_getSalesPeriodToDate(start, end)

  ///////////////////////////////// ROWS
  const levelOneRows = await getLevelOneRows(start, end)
  const levelTwoRows = await getLevelTwoRows(start, end)
  const totalsRow = [{ l1_subtotal: 'FG SALES', l2_subtotal: 'TOTAL' }]

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
      ...dataTotal_salesPeriodToDate,
      ...lvl_1_subtotal_so,
      ...lvl_2_subtotal_so,
      ...dataTotal_so,
      ...lvl_1_subtotal_salesByWk,
      ...lvl_2_subtotal_salesByWk,
      ...dataTotal_salesByWk,
    ],
    rowTemplate_unflat
  )

  const mappedInven = mapInvenToRowTemplates(
    [
      ...lvl_1_subtotal_fgInven,
      ...lvl_2_subtotal_fgInven,
      ...dataTotal_fgInven,
      ...lvl_1_subtotal_fgInTransit,
      ...lvl_2_subtotal_fgInTransit,
      ...dataTotal_fgInTransit,
      ...lvl_1_subtotal_fgAtLoc,
      ...lvl_2_subtotal_fgAtLoc,
      ...dataTotal_fgAtLocation,
      ...lvl_1_subtotal_fgPo,
      ...lvl_2_subtotal_fgPo,
      ...dataTotal_fgPo,
      ...lvl_1_subtotal_rmInven,
      ...lvl_2_subtotal_rmInven,
      ...dataTotal_rmInven,
      ...lvl_1_subtotal_rmInTransit,
      ...lvl_2_subtotal_rmInTransit,
      ...dataTotal_rmInTransit,
      ...lvl_1_subtotal_rmAtLoc,
      ...lvl_2_subtotal_rmAtLoc,
      ...dataTotal_rmAtLoc,
      ...lvl_1_subtotal_rmPo,
      ...lvl_2_subtotal_rmPo,
      ...dataTotal_rmPo,
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
