const { getDateEndPerWeekByRange, getDateEndPerWeekByRange_so } = require('../../shared/queries/postgres/getDateEndPerWeek')
const { getLatestShipWk, getEarliestShipWk } = require('../../shared/queries/postgres/getSoDates')
const {
  lvl_1_subtotal_getSalesByWk,
  lvl_0_total_getSalesByWk,
  lvl_1_subtotal_getSalesPeriodToDate,
  lvl_0_total_getSalesPeriodToDate,
} = require('../queries/postgres/byCustomer_level2/getSalesTrend')
const { lvl_1_subtotal_getSo, lvl_0_total_getSo } = require('../queries/postgres/byCustomer_level2/getSo')
const { lvl_1_subtotal_getSo_byWk, lvl_0_total_getSo_byWk } = require('../queries/postgres/byCustomer_level2/getSoByWeek')
const { getRowsFirstLevelDetail } = require('../queries/postgres/byCustomer_level2/getRows')
const mapSalesToRowTemplates = require('../../shared/models/mapSalesToRowTemplatesOneLevel')
const cleanLabelsForDisplay = require('../../shared/models/cleanLabelsForDisplay')
const unflattenByCompositKey = require('../../shared/models/unflattenByCompositKey')
const labelCols = require('../queries/hardcode/cols_byCustomer')

const buildDrillDown = async (program, start, end, filters) => {
  console.log(program, '\n', start, '\n', end, '\n', filters)

  // ///////////////////////////////// SALES ORDERS
  /* ALL SO */
  const lvl_1_subtotal_so = await lvl_1_subtotal_getSo(program, filters)
  const lvl_0_total_so = await lvl_0_total_getSo(program, filters)
  const lvl_1_subtotal_so_byWk = await lvl_1_subtotal_getSo_byWk(program, filters)
  const lvl_0_total_so_byWk = await lvl_0_total_getSo_byWk(program, filters)

  // ///////////////////////////////// SALES DATA
  const lvl_1_subtotal_salesByWk = await lvl_1_subtotal_getSalesByWk(start, end, program, filters)
  const lvl_0_total_salesByWk = await lvl_0_total_getSalesByWk(start, end, program, filters)
  const lvl_1_subtotal_salesPeriodToDate = await lvl_1_subtotal_getSalesPeriodToDate(start, end, program, filters)
  const lvl_0_total_salesPeriodToDate = await lvl_0_total_getSalesPeriodToDate(start, end, program, filters)

  ///////////////////////////////// ROWS
  const rowsFirstLevelDetail = await getRowsFirstLevelDetail(start, end, program, filters)
  const totalsRow = [{ totalRow: true, l1_label: `FG SALES`, l2_label: `TOTAL` }] // Need an l2_label of TOTAL for front end styling
  const filterRow = [{ filterRow: true, l1_label: `PROGRAM: ${program}, FILTERS: ${filters[0]}, ${filters[1]}, ${filters[2]}` }] // shows at top of report

  // COMPILE FINAL ROW TEMPLATE
  const rowTemplate = [...rowsFirstLevelDetail, ...totalsRow]

  // map data into row template
  const rowTemplate_unflat = unflattenByCompositKey(rowTemplate, {
    1: 'l1_label',
  })

  const mappedData = mapSalesToRowTemplates(
    [
      ...lvl_1_subtotal_salesByWk,
      ...lvl_0_total_salesByWk,
      ...lvl_1_subtotal_salesPeriodToDate,
      ...lvl_0_total_salesPeriodToDate,
      ...lvl_1_subtotal_so,
      ...lvl_0_total_so,
      ...lvl_1_subtotal_so_byWk,
      ...lvl_0_total_so_byWk,
    ],
    rowTemplate_unflat
  )

  // clean out rows with zero activity
  Object.keys(mappedData).forEach(key => {
    // If the length = 1, then there is only the one label and no other columns are populated
    if (Object.keys(mappedData[key]).length === 1) {
      delete mappedData[key]
    }
  })

  const flattenedMappedData = Object.values(mappedData)
  let finalData = cleanLabelsForDisplay(flattenedMappedData, '')
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l1_label < b.l1_label) return -1
      if (a.l1_label > b.l1_label) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l2_label.includes('TOTAL')) return 1
      if (b.l2_label.includes('TOTAL')) return -1
      return 0
    }) // no label in total row, first col
  finalData = [...filterRow, ...finalData]

  const salesCols = await getDateEndPerWeekByRange(start, end)

  // get so by week cols
  const start_so = await getEarliestShipWk()
  const end_so = await getLatestShipWk()
  const soCols = await getDateEndPerWeekByRange_so(start_so, end_so)

  // return
  return { data: finalData, salesCols: salesCols, labelCols: labelCols, soCols }
}

module.exports = buildDrillDown