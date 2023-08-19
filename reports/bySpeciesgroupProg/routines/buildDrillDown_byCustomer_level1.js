const { getDateEndPerWeekByRange, getDateEndPerWeekByRange_so } = require('../../shared/queries/postgres/getDateEndPerWeek')
const { getLatestShipWk, getEarliestShipWk } = require('../../shared/queries/postgres/getSoDates')
const {
  lvl_1_subtotal_getSalesByWk,
  lvl_0_total_getSalesByWk,
  lvl_1_subtotal_getSalesPeriodToDate,
  lvl_0_total_getSalesPeriodToDate,
} = require('../../shared/queries/postgres/viewCustTrend_baseReport/byCustomer_level1/getSalesTrend')
const { getCompanyTotalSales } = require('../../shared/queries/postgres/getCompanyTotalSales')
const {
  lvl_1_subtotal_getSalesByFy,
  lvl_0_total_getSalesByFy,
  lvl_1_subtotal_getSalesByFyYtd,
  lvl_0_total_getSalesByFyYtd,
} = require('../../shared/queries/postgres/viewCustTrend_baseReport/byCustomer_level1/getSalesTrendByFy')
const { getFiscalYearCols, getFiscalYearYtdCols } = require('../../shared/queries/postgres/getFiscalYearCols')
const { lvl_1_subtotal_getSo, lvl_0_total_getSo } = require('../../shared/queries/postgres/viewCustTrend_baseReport/byCustomer_level1/getSo')
const {
  lvl_1_subtotal_getSo_byWk,
  lvl_0_total_getSo_byWk,
} = require('../../shared/queries/postgres/viewCustTrend_baseReport/byCustomer_level1/getSoByWeek')
const { getRowsFirstLevelDetail } = require('../../shared/queries/postgres/viewCustTrend_baseReport/byCustomer_level1/getRows')
const {
  getRowsFirstLevelDetail: getRows_l1_showFyTrend,
} = require('../../shared/queries/postgres/viewCustTrend_baseReport/byCustomer_level1/getRowsTrendByFy')
const mapSalesToRowTemplates = require('../../shared/models/mapSalesToRowTemplatesOneLevel')
const cleanLabelsForDisplay = require('../../shared/models/cleanLabelsForDisplay')
const unflattenByCompositKey = require('../../shared/models/unflattenByCompositKey')
const labelCols = require('../queries/hardcode/cols_byCustomer')
const calcPercentSalesCol = require('../../shared/models/calcPercentSalesCol')
const calcAveWeeklySales = require('../../shared/models/calcAveWeeklySales')

const buildDrillDown = async (program, start, end, filters, showFyTrend, startWeek, endWeek) => {
  console.log(program, '\n', start, '\n', end, '\n', filters)

  const config = {
    l1_field: 'ms.species_group',
    l2_field: 'ms.program',
    program: null,
  }

  program = config.program

  // ///////////////////////////////// SALES ORDERS
  /* ALL SO */
  const lvl_1_subtotal_so = await lvl_1_subtotal_getSo(config, program, filters)
  const lvl_0_total_so = await lvl_0_total_getSo(config, program, filters)
  const lvl_1_subtotal_so_byWk = await lvl_1_subtotal_getSo_byWk(config, program, filters)
  const lvl_0_total_so_byWk = await lvl_0_total_getSo_byWk(config, program, filters)

  // ///////////////////////////////// SALES DATA
  const lvl_1_subtotal_salesByFy = await lvl_1_subtotal_getSalesByFy(config, start, end, program, filters)
  const lvl_0_total_salesByFy = await lvl_0_total_getSalesByFy(config, start, end, program, filters)

  const lvl_1_subtotal_salesByFyYtd = await lvl_1_subtotal_getSalesByFyYtd(config, startWeek, endWeek, program, filters)
  const lvl_0_total_salesByFyYtd = await lvl_0_total_getSalesByFyYtd(config, startWeek, endWeek, program, filters)

  const lvl_1_subtotal_salesByWk = await lvl_1_subtotal_getSalesByWk(config, start, end, program, filters)
  const lvl_0_total_salesByWk = await lvl_0_total_getSalesByWk(config, start, end, program, filters)
  const lvl_1_subtotal_salesPeriodToDate = await lvl_1_subtotal_getSalesPeriodToDate(config, start, end, program, filters)
  const lvl_0_total_salesPeriodToDate = await lvl_0_total_getSalesPeriodToDate(config, start, end, program, filters)

  const companyTotalSales = await getCompanyTotalSales(start, end)

  ///////////////////////////////// KPI DATA
  /* % COMPANY SALES */
  const lvl_1_percent_companySales = calcPercentSalesCol(companyTotalSales[0], lvl_1_subtotal_salesPeriodToDate, 'percentCompanySales')
  const lvl_0_percent_companySales = calcPercentSalesCol(companyTotalSales[0], lvl_0_total_salesPeriodToDate, 'percentCompanySales')

  /* % REPORT TOTAL */
  const lvl_1_percent_reportTotal = calcPercentSalesCol(lvl_0_total_salesPeriodToDate[0], lvl_1_subtotal_salesPeriodToDate, 'percentReportTotal')
  const lvl_0_percent_reportTotal = calcPercentSalesCol(lvl_0_total_salesPeriodToDate[0], lvl_0_total_salesPeriodToDate, 'percentReportTotal')

  /* AVE WEEKLY SALES */
  const weeks = endWeek - startWeek + 1
  const lvl_1_aveWeeklySales = calcAveWeeklySales(lvl_1_subtotal_salesPeriodToDate, 'aveWeeklySales', weeks)
  const lvl_0_aveWeeklySales = calcAveWeeklySales(lvl_0_total_salesPeriodToDate, 'aveWeeklySales', weeks)

  ///////////////////////////////// ROWS
  let rowsFirstLevelDetail
  if (showFyTrend) {
    // full fy trend requested. need rows for all data
    rowsFirstLevelDetail = await getRows_l1_showFyTrend(config, start, end, program, filters)
  } else {
    // data request with start and end dates
    rowsFirstLevelDetail = await getRowsFirstLevelDetail(config, start, end, program, filters)
  }
  const totalsRow = [{ totalRow: true, l1_label: `FG SALES`, l2_label: `TOTAL` }] // Need an l2_label of TOTAL for front end styling
  const filterRow = [{ filterRow: true, l1_label: `PROGRAM: ${program}, FILTERS: ${filters[0]}, ${filters[1]}, ${filters[2]}` }] // shows at top of report

  // COMPILE FINAL ROW TEMPLATE
  const rowTemplate = [...rowsFirstLevelDetail, ...totalsRow]

  // map data into row template
  const rowTemplate_unflat = unflattenByCompositKey(rowTemplate, {
    1: 'l1_label',
  })

  // switch to include fy trend data
  const fyTrendSales = showFyTrend
    ? [...lvl_1_subtotal_salesByFy, ...lvl_0_total_salesByFy, ...lvl_1_subtotal_salesByFyYtd, ...lvl_0_total_salesByFyYtd]
    : []

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
      ...fyTrendSales,
      ...lvl_1_percent_companySales,
      ...lvl_0_percent_companySales,
      ...lvl_1_percent_reportTotal,
      ...lvl_0_percent_reportTotal,
      ...lvl_1_aveWeeklySales,
      ...lvl_0_aveWeeklySales,
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
      if (a.l2_label === null || b.l2_label === null) {
        console.log('a: ', a)
        console.log('b: ', b)
        return 1
      }

      if (a.l2_label.includes('TOTAL')) return 1
      if (b.l2_label.includes('TOTAL')) return -1
      return 0
    }) // no label in total row, first col
  finalData = [...filterRow, ...finalData]

  const salesColsByWk = await getDateEndPerWeekByRange(start, end)

  // get data column names by fiscal year
  let salesColsByFy = null
  let salesColsByFyYtd = null
  if (showFyTrend) salesColsByFy = await getFiscalYearCols()
  if (showFyTrend) salesColsByFyYtd = await getFiscalYearYtdCols()

  // get so by week cols
  const start_so = await getEarliestShipWk()
  const end_so = await getLatestShipWk()
  const soCols = await getDateEndPerWeekByRange_so(start_so, end_so)

  // return
  return {
    data: finalData,
    salesColsByWk: salesColsByWk,
    salesColsByFy: salesColsByFy,
    salesColsByFyYtd: salesColsByFyYtd,
    labelCols: labelCols,
    soCols,
  }
}

module.exports = buildDrillDown
