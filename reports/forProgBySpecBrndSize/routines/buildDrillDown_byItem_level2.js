const { getDateEndPerWeekByRange } = require('../../shared/queries/postgres/getDateEndPerWeek')
const {
  lvl_1_subtotal_getSalesByWk,
  lvl_0_total_getSalesByWk,
  lvl_1_subtotal_getSalesPeriodToDate,
  lvl_0_total_getSalesPeriodToDate,
} = require('../queries/postgres/byItem_level2/getSalesTrend')
const {
  lvl_1_subtotal_getFgInven,
  lvl_0_total_getFgInven,
  lvl_1_subtotal_getFgInTransit,
  lvl_0_total_getFgInTransit,
  lvl_1_subtotal_getFgAtLoc,
  lvl_0_total_getFgAtLoc,
  lvl_1_subtotal_getFgAtLoc_untagged,
  lvl_0_total_getFgAtLoc_untagged,
  lvl_1_subtotal_getFgAtLoc_tagged,
  lvl_0_total_getFgAtLoc_tagged,
} = require('../queries/postgres/byItem_level2/getFgInven')

const { lvl_1_subtotal_getFgPo, lvl_0_total_getFgPo } = require('../queries/postgres/byItem_level2/getFgOpenPo')

const {
  lvl_1_subtotal_getSo,
  lvl_0_total_getSo,
  lvl_1_subtotal_getSoTagged,
  lvl_0_total_getSoTagged,
  lvl_1_subtotal_getSoUntagged,
  lvl_0_total_getSoUntagged,
} = require('../queries/postgres/byItem_level2/getSo')
const { getRowsFirstLevelDetail } = require('../queries/postgres/byItem_level2/getRows')

const mapSalesToRowTemplates = require('../../shared/models/mapSalesToRowTemplatesOneLevel')
const mapInvenToRowTemplates = require('../../shared/models/mapInvenToRowTemplatesOneLevel')
const combineMappedRows = require('../../shared/models/combineMappedRows')
const cleanLabelsForDisplay = require('../../shared/models/cleanLabelsForDisplay')
const unflattenByCompositKey = require('../../shared/models/unflattenByCompositKey')

const labelCols = require('../queries/hardcode/cols_byItem_level2')

const buildDrillDown = async (program, start, end, filters) => {
  console.log(program, '\n', start, '\n', end, '\n', filters)

  ///////////////////////////////// INVENTORY DATA
  /* TOTAL FG (FG) */
  const lvl_1_subtotal_fgInven = await lvl_1_subtotal_getFgInven(program, filters)
  const lvl_0_total_fgInven = await lvl_0_total_getFgInven(program, filters)
  /* FG IN TRANSIT*/
  const lvl_1_subtotal_fgInTransit = await lvl_1_subtotal_getFgInTransit(program, filters)
  const lvl_0_total_fgInTransit = await lvl_0_total_getFgInTransit(program, filters)
  /* FG ON HAND (LESS IN TRANSIT) */
  const lvl_1_subtotal_fgAtLoc = await lvl_1_subtotal_getFgAtLoc(program, filters)
  const lvl_0_total_fgAtLoc = await lvl_0_total_getFgAtLoc(program, filters)
  /* FG ON HAND UNTAGGED */
  const lvl_1_subtotal_fgAtLoc_untagged = await lvl_1_subtotal_getFgAtLoc_untagged(program, filters)
  const lvl_0_total_fgAtLoc_untagged = await lvl_0_total_getFgAtLoc_untagged(program, filters)
  /* FG ON HAND TAGGED */
  const lvl_1_subtotal_fgAtLoc_tagged = await lvl_1_subtotal_getFgAtLoc_tagged(program, filters)
  const lvl_0_total_fgAtLoc_tagged = await lvl_0_total_getFgAtLoc_tagged(program, filters)

  /* FG ON ORDER */
  const lvl_1_subtotal_fgPo = await lvl_1_subtotal_getFgPo(program, filters)
  const lvl_0_total_fgPo = await lvl_0_total_getFgPo(program, filters)

  // ///////////////////////////////// SALES ORDERS
  /* ALL SO */
  const lvl_1_subtotal_so = await lvl_1_subtotal_getSo(program, filters)
  const lvl_0_total_so = await lvl_0_total_getSo(program, filters)
  /* TAGGED SO */
  const lvl_1_subtotal_soTagged = await lvl_1_subtotal_getSoTagged(program, filters)
  const lvl_0_total_soTagged = await lvl_0_total_getSoTagged(program, filters)
  /* UNTAGGED SO */
  const lvl_1_subtotal_soUntagged = await lvl_1_subtotal_getSoUntagged(program, filters)
  const lvl_0_total_soUntagged = await lvl_0_total_getSoUntagged(program, filters)

  // ///////////////////////////////// SALES DATA
  const lvl_1_subtotal_salesByWk = await lvl_1_subtotal_getSalesByWk(start, end, program, filters)
  const lvl_0_total_salesByWk = await lvl_0_total_getSalesByWk(start, end, program, filters)
  const lvl_1_subtotal_salesPeriodToDate = await lvl_1_subtotal_getSalesPeriodToDate(start, end, program, filters)
  const lvl_0_total_salesPeriodToDate = await lvl_0_total_getSalesPeriodToDate(start, end, program, filters)

  ///////////////////////////////// ROWS
  const rowsFirstLevelDetail = await getRowsFirstLevelDetail(start, end, program, filters)
  const totalsRow = [{ l1_label: `FG SALES`, l2_label: `TOTAL` }] // Need an l2_label of TOTAL for front end styling
  const filterRow = [{ filterRow: true, l1_label: `PROGRAM: ${program}, FILTERS: ${filters[0]}, ${filters[1]}` }] // shows at top of report

  // COMPILE FINAL ROW TEMPLATE
  const rowTemplate = [...rowsFirstLevelDetail, ...totalsRow]

  // map data into row template
  const rowTemplate_unflat = unflattenByCompositKey(rowTemplate, {
    1: 'l1_label',
  })

  const mappedSales = mapSalesToRowTemplates(
    [
      ...lvl_1_subtotal_salesByWk,
      ...lvl_0_total_salesByWk,
      ...lvl_1_subtotal_salesPeriodToDate,
      ...lvl_0_total_salesPeriodToDate,
      ...lvl_1_subtotal_so,
      ...lvl_0_total_so,
      ...lvl_1_subtotal_soTagged,
      ...lvl_0_total_soTagged,
      ...lvl_1_subtotal_soUntagged,
      ...lvl_0_total_soUntagged,
    ],
    rowTemplate_unflat
  )

  const mappedInven = mapInvenToRowTemplates(
    [
      ...lvl_1_subtotal_fgInven,
      ...lvl_0_total_fgInven,
      ...lvl_1_subtotal_fgInTransit,
      ...lvl_0_total_fgInTransit,
      ...lvl_1_subtotal_fgAtLoc,
      ...lvl_0_total_fgAtLoc,
      ...lvl_1_subtotal_fgAtLoc_untagged,
      ...lvl_0_total_fgAtLoc_untagged,
      ...lvl_1_subtotal_fgAtLoc_tagged,
      ...lvl_0_total_fgAtLoc_tagged,
      ...lvl_1_subtotal_fgPo,
      ...lvl_0_total_fgPo,
    ],
    rowTemplate_unflat
  )

  const mappedData = combineMappedRows(mappedSales, mappedInven)

  // clean out rows with zero activity
  Object.keys(mappedData).forEach(key => {
    // If the length = 1, then there is only the one label and no other columns are populated
    if (Object.keys(mappedData[key]).length === 1) {
      delete mappedData[key]
    }
  })

  const flattenedMappedData = Object.values(mappedData)
  let finalData = cleanLabelsForDisplay(flattenedMappedData, '') // no label in total row, first col
  finalData = [...filterRow, ...finalData]

  const dataCols = await getDateEndPerWeekByRange(start, end)

  // return
  return { data: finalData, cols: dataCols, labelCols: labelCols }
}

module.exports = buildDrillDown
