const {
  getDateEndPerWeekByRange,
  getDateEndPerWeekByRange_so,
  getDateEndPerWeekByRange_so_tg,
  getDateEndPerWeekByRange_so_untg,
} = require('../queries/postgres/getDateEndPerWeek')
const { getFiscalYearCols, getFiscalYearYtdCols } = require('../queries/postgres/getFiscalYearCols')
const { getLatestShipWk, getEarliestShipWk } = require('../queries/postgres/getSoDates')
const {
  l1_getSalesByWk,
  l2_getSalesByWk,
  l3_getSalesByWk,
  l4_getSalesByWk,
  l0_getSalesByWk,
  l1_getSalesPeriodToDate,
  l2_getSalesPeriodToDate,
  l3_getSalesPeriodToDate,
  l4_getSalesPeriodToDate,
  l0_getSalesPeriodToDate,
} = require('../queries/postgres/baseReport/getSalesTrendDateDriven')
const {
  l1_getSalesWkDriven,
  l2_getSalesWkDriven,
  l3_getSalesWkDriven,
  l4_getSalesWkDriven,
  l0_getSalesWkDriven,
} = require('../queries/postgres/baseReport/getSalesTrendWkDriven')
const { getCompanyTotalSales } = require('../queries/postgres/kpi/getCompanyTotalSales')
const {
  l1_getSalesByFyYtd,
  l2_getSalesByFyYtd,
  l3_getSalesByFyYtd,
  l4_getSalesByFyYtd,
  l0_getSalesByFyYtd,
} = require('../queries/postgres/baseReport/getSalesTrendByFyYtd')
const {
  l1_getFgInven,
  l2_getFgInven,
  l3_getFgInven,
  l4_getFgInven,
  l0_getFgInven,
  l1_getFgInTransit,
  l2_getFgInTransit,
  l3_getFgInTransit,
  l4_getFgInTransit,
  l0_getFgInTransit,
  l1_getFgAtLoc,
  l2_getFgAtLoc,
  l3_getFgAtLoc,
  l4_getFgAtLoc,
  l0_getFgAtLoc,
  l1_getFgAtLoc_untagged,
  l2_getFgAtLoc_untagged,
  l3_getFgAtLoc_untagged,
  l4_getFgAtLoc_untagged,
  l0_getFgAtLoc_untagged,
  l1_getFgAtLoc_tagged,
  l2_getFgAtLoc_tagged,
  l3_getFgAtLoc_tagged,
  l4_getFgAtLoc_tagged,
  l0_getFgAtLoc_tagged,
} = require('../queries/postgres/baseReport/getFgInven')
const { l1_getFgPo, l2_getFgPo, l3_getFgPo, l4_getFgPo, l0_getFgPo } = require('../queries/postgres/baseReport/getFgOpenPo')
const {
  l1_getSo,
  l2_getSo,
  l3_getSo,
  l4_getSo,
  l0_getSo,
  l1_getSoTagged,
  l2_getSoTagged,
  l3_getSoTagged,
  l4_getSoTagged,
  l0_getSoTagged,
  l1_getSoUntagged,
  l2_getSoUntagged,
  l3_getSoUntagged,
  l4_getSoUntagged,
  l0_getSoUntagged,
} = require('../queries/postgres/baseReport/getSo')
const {
  l1_getSo_byWk,
  l2_getSo_byWk,
  l3_getSo_byWk,
  l4_getSo_byWk,
  l0_getSo_byWk,
  l1_getSoTagged_byWk,
  l2_getSoTagged_byWk,
  l3_getSoTagged_byWk,
  l4_getSoTagged_byWk,
  l0_getSoTagged_byWk,
  l1_getSoUntagged_byWk,
  l2_getSoUntagged_byWk,
  l3_getSoUntagged_byWk,
  l4_getSoUntagged_byWk,
  l0_getSoUntagged_byWk,
} = require('../queries/postgres/baseReport/getSoByWeek')
const {
  getRowsFourthLevelDetail,
  getRowsThirdLevelDetail,
  getRowsSecondLevelDetail,
  getRowsFirstLevelDetail,
} = require('../queries/postgres/baseReport/getRows')
const mapSalesToRowTemplates_fourLevel = require('../models/mapSalesToRowTemplatesFourLevel')
const mapInvenToRowTemplates_fourLevel = require('../models/mapInvenToRowTemplatesFourLevel')
const mapSalesToRowTemplates_threeLevel = require('../models/mapSalesToRowTemplatesThreeLevel')
const mapInvenToRowTemplates_threeLevel = require('../models/mapInvenToRowTemplatesThreeLevel')
const mapSalesToRowTemplates_twoLevel = require('../models/mapSalesToRowTemplatesTwoLevel')
const mapInvenToRowTemplates_twoLevel = require('../models/mapInvenToRowTemplatesTwoLevel')
const combineMappedRows = require('../models/combineMappedRows')
const cleanLabelsForDisplay = require('../models/cleanLabelsForDisplay')
const unflattenByCompositKey = require('../models/unflattenByCompositKey')
const calcPercentSalesCol = require('../models/calcPercentSalesCol')
const getSpeciesGroupTotalSales = require('../queries/postgres/getSpeciesGroupTotalSalesFromProgram')
const calcAveWeeklySales = require('../models/calcAveWeeklySales')
const calcWeeksInvOnHand = require('../models/calcWeeksInvOnHand')
const calcInventoryAvailable = require('../models/calcInventoryAvailable')
const collapseRedundantTotalRows = require('../models/collapseRedundantTotalRows')
const columnConfigs = require('../data/baseCols/columns')

const buildReport = async (start, end, showFyTrend, startWeek, endWeek, config, labelCols, year, totalOnly) => {
  // The routine and all of the queries can be the same for all reports. Going to buikd out this rpeort and then change the config manually to test.

  const skip = () => {
    return () => {
      return []
    }
  }

  ///////////////////////////////// INVENTORY DATA
  /* TOTAL FG (FG) */
  const l1_fgInven = totalOnly ? skip() : () => {return l1_getFgInven(config)} //prettier-ignore
  const l2_fgInven = totalOnly ? skip() : () => {return l2_getFgInven(config)} //prettier-ignore
  const l3_fgInven = totalOnly ? skip() : config.l3_field ? () => {return l3_getFgInven(config)}: skip() //prettier-ignore
  const l4_fgInven = totalOnly ? skip() : config.l4_field ? () => {return l4_getFgInven(config)}: skip() //prettier-ignore
  const l0_fgInven = () => {return l0_getFgInven(config)} //prettier-ignore
  /* FG IN TRANSIT*/
  const l1_fgInTransit = totalOnly ? skip() : await l1_getFgInTransit(config)
  const l2_fgInTransit = totalOnly ? skip() : await l2_getFgInTransit(config)
  const l3_fgInTransit = totalOnly ? skip() : config.l3_field ? await l3_getFgInTransit(config) : skip()
  const l4_fgInTransit = totalOnly ? skip() : config.l4_field ? await l4_getFgInTransit(config) : skip()
  const l0_fgInTransit = await l0_getFgInTransit(config)
  /* FG ON HAND (LESS IN TRANSIT) */
  const l1_fgAtLoc = totalOnly ? skip() : await l1_getFgAtLoc(config)
  const l2_fgAtLoc = totalOnly ? skip() : await l2_getFgAtLoc(config)
  const l3_fgAtLoc = totalOnly ? skip() : config.l3_field ? await l3_getFgAtLoc(config) : skip()
  const l4_fgAtLoc = totalOnly ? skip() : config.l4_field ? await l4_getFgAtLoc(config) : skip()
  const l0_fgAtLoc = await l0_getFgAtLoc(config)
  /* FG ON HAND UNTAGGED */
  const l1_fgAtLoc_untagged = totalOnly ? skip() : await l1_getFgAtLoc_untagged(config)
  const l2_fgAtLoc_untagged = totalOnly ? skip() : await l2_getFgAtLoc_untagged(config)
  const l3_fgAtLoc_untagged = totalOnly ? skip() : config.l3_field ? await l3_getFgAtLoc_untagged(config) : skip()
  const l4_fgAtLoc_untagged = totalOnly ? skip() : config.l4_field ? await l4_getFgAtLoc_untagged(config) : skip()
  const l0_fgAtLoc_untagged = await l0_getFgAtLoc_untagged(config)
  /* FG ON HAND TAGGED */
  // const l1_fgAtLoc_tagged = totalOnly ? skip() : await l1_getFgAtLoc_tagged(config)
  // const l2_fgAtLoc_tagged = totalOnly ? skip() : await l2_getFgAtLoc_tagged(config)
  // const l3_fgAtLoc_tagged = totalOnly ? skip() : config.l3_field ? await l3_getFgAtLoc_tagged(config):skip()
  // const l4_fgAtLoc_tagged = totalOnly ? skip() : config.l4_field ? await l4_getFgAtLoc_tagged(config):skip()
  // const l0_fgAtLoc_tagged = await l0_getFgAtLoc_tagged(config)
  /* FG ON ORDER */
  const l1_fgPo = totalOnly ? skip() : await l1_getFgPo(config)
  const l2_fgPo = totalOnly ? skip() : await l2_getFgPo(config)
  const l3_fgPo = totalOnly ? skip() : config.l3_field ? await l3_getFgPo(config) : skip()
  const l4_fgPo = totalOnly ? skip() : config.l4_field ? await l4_getFgPo(config) : skip()
  const l0_fgPo = await l0_getFgPo(config)

  // ///////////////////////////////// SALES ORDERS
  /* ALL SO */
  const l1_so = totalOnly ? skip() : await l1_getSo(config)
  const l2_so = totalOnly ? skip() : await l2_getSo(config)
  const l3_so = totalOnly ? skip() : config.l3_field ? await l3_getSo(config) : skip()
  const l4_so = totalOnly ? skip() : config.l4_field ? await l4_getSo(config) : skip()
  const l0_so = await l0_getSo(config)

  const l1_so_byWk = totalOnly ? skip() : await l1_getSo_byWk(config)
  const l2_so_byWk = totalOnly ? skip() : await l2_getSo_byWk(config)
  const l3_so_byWk = totalOnly ? skip() : config.l3_field ? await l3_getSo_byWk(config) : skip()
  const l4_so_byWk = totalOnly ? skip() : config.l4_field ? await l4_getSo_byWk(config) : skip()
  const l0_so_byWk = await l0_getSo_byWk(config)

  /* TAGGED SO */
  // const l1_soTagged = totalOnly ? skip() : await l1_getSoTagged(config)
  // const l2_soTagged = totalOnly ? skip() : await l2_getSoTagged(config)
  // const l3_soTagged = totalOnly ? skip() : config.l3_field ? await l3_getSoTagged(config):skip()
  // const l4_soTagged = totalOnly ? skip() : config.l4_field ? await l4_getSoTagged(config):skip()
  // const l0_soTagged = await l0_getSoTagged(config)

  // const l1_soTagged_byWk = totalOnly ? skip() : await l1_getSoTagged_byWk(config)
  // const l2_soTagged_byWk = totalOnly ? skip() : await l2_getSoTagged_byWk(config)
  // const l3_soTagged_byWk = totalOnly ? skip() : config.l3_field ? await l3_getSoTagged_byWk(config):skip()
  // const l4_soTagged_byWk = totalOnly ? skip() : config.l4_field ? await l4_getSoTagged_byWk(config):skip()
  // const l0_soTagged_byWk = await l0_getSoTagged_byWk(config)

  /* UNTAGGED SO */
  const l1_soUntagged = totalOnly ? skip() : await l1_getSoUntagged(config)
  const l2_soUntagged = totalOnly ? skip() : await l2_getSoUntagged(config)
  const l3_soUntagged = totalOnly ? skip() : config.l3_field ? await l3_getSoUntagged(config) : skip()
  const l4_soUntagged = totalOnly ? skip() : config.l4_field ? await l4_getSoUntagged(config) : skip()
  const l0_soUntagged = await l0_getSoUntagged(config)

  const l1_soUntagged_byWk = totalOnly ? skip() : await l1_getSoUntagged_byWk(config)
  const l2_soUntagged_byWk = totalOnly ? skip() : await l2_getSoUntagged_byWk(config)
  const l3_soUntagged_byWk = totalOnly ? skip() : config.l3_field ? await l3_getSoUntagged_byWk(config) : skip()
  const l4_soUntagged_byWk = totalOnly ? skip() : config.l4_field ? await l4_getSoUntagged_byWk(config) : skip()
  const l0_soUntagged_byWk = await l0_getSoUntagged_byWk(config)

  // ///////////////////////////////// SALES DATA
  const l1_salesByFy = totalOnly ? skip() : await l1_getSalesByFyYtd(config, startWeek, endWeek, false)
  const l2_salesByFy = totalOnly ? skip() : await l2_getSalesByFyYtd(config, startWeek, endWeek, false)
  const l3_salesByFy = totalOnly ? skip() : config.l3_field ? await l3_getSalesByFyYtd(config, startWeek, endWeek, false) : skip()
  const l4_salesByFy = totalOnly ? skip() : config.l4_field ? await l4_getSalesByFyYtd(config, startWeek, endWeek, false) : skip()
  const l0_salesByFy = await l0_getSalesByFyYtd(config, startWeek, endWeek, false)

  const l1_salesByFyYtd = totalOnly ? skip() : await l1_getSalesByFyYtd(config, startWeek, endWeek, true)
  const l2_salesByFyYtd = totalOnly ? skip() : await l2_getSalesByFyYtd(config, startWeek, endWeek, true)
  const l3_salesByFyYtd = totalOnly ? skip() : config.l3_field ? await l3_getSalesByFyYtd(config, startWeek, endWeek, true) : skip()
  const l4_salesByFyYtd = totalOnly ? skip() : config.l4_field ? await l4_getSalesByFyYtd(config, startWeek, endWeek, true) : skip()
  const l0_salesByFyYtd = await l0_getSalesByFyYtd(config, startWeek, endWeek, true)

  const l1_salesByWk = totalOnly ? skip() : await l1_getSalesByWk(config, start, end)
  const l2_salesByWk = totalOnly ? skip() : await l2_getSalesByWk(config, start, end)
  const l3_salesByWk = totalOnly ? skip() : config.l3_field ? await l3_getSalesByWk(config, start, end) : skip()
  const l4_salesByWk = totalOnly ? skip() : config.l4_field ? await l4_getSalesByWk(config, start, end) : skip()
  const l0_salesByWk = await l0_getSalesByWk(config, start, end)

  const l1_salesPeriodToDate = totalOnly ? skip() : await l1_getSalesPeriodToDate(config, start, end)
  const l2_salesPeriodToDate = totalOnly ? skip() : await l2_getSalesPeriodToDate(config, start, end)
  const l3_salesPeriodToDate = totalOnly ? skip() : config.l3_field ? await l3_getSalesPeriodToDate(config, start, end) : skip()
  const l4_salesPeriodToDate = totalOnly ? skip() : config.l4_field ? await l4_getSalesPeriodToDate(config, start, end) : skip()
  const l0_salesPeriodToDate = await l0_getSalesPeriodToDate(config, start, end)

  const companyTotalSales = await getCompanyTotalSales(start, end, config)
  const l1_trailingTwoWeek = totalOnly ? skip() : endWeek < 2 ? skip() : await l1_getSalesWkDriven(config, endWeek - 1, endWeek, year)
  const l2_trailingTwoWeek = totalOnly ? skip() : endWeek < 2 ? skip() : await l2_getSalesWkDriven(config, endWeek - 1, endWeek, year)
  const l3_trailingTwoWeek = totalOnly ? skip() : endWeek < 2 ? skip() : config.l3_field ? await l3_getSalesWkDriven(config, endWeek - 1, endWeek, year) : skip() //prettier-ignore
  const l4_trailingTwoWeek = totalOnly ? skip() : endWeek < 2 ? skip() : config.l4_field ? await l4_getSalesWkDriven(config, endWeek - 1, endWeek, year) : skip() //prettier-ignore
  const l0_trailingTwoWeek = endWeek < 2 ? skip() : await l0_getSalesWkDriven(config, endWeek - 1, endWeek, year)

  const l1_trailingFourWeek = totalOnly ? skip() : endWeek < 4 ? skip() : await l1_getSalesWkDriven(config, endWeek - 3, endWeek, year)
  const l2_trailingFourWeek = totalOnly ? skip() : endWeek < 4 ? skip() : await l2_getSalesWkDriven(config, endWeek - 3, endWeek, year)
  const l3_trailingFourWeek = totalOnly ? skip() : endWeek < 4 ? skip() : config.l3_field ? await l3_getSalesWkDriven(config, endWeek - 3, endWeek, year) : skip() //prettier-ignore
  const l4_trailingFourWeek = totalOnly ? skip() : endWeek < 4 ? skip() : config.l4_field ? await l4_getSalesWkDriven(config, endWeek - 3, endWeek, year) : skip() //prettier-ignore
  const l0_trailingFourWeek = endWeek < 4 ? skip() : await l0_getSalesWkDriven(config, endWeek - 3, endWeek, year)

  const l1_trailingEightWeek = totalOnly ? skip() : endWeek < 8 ? skip() : await l1_getSalesWkDriven(config, endWeek - 7, endWeek, year)
  const l2_trailingEightWeek = totalOnly ? skip() : endWeek < 8 ? skip() : await l2_getSalesWkDriven(config, endWeek - 7, endWeek, year)
  const l3_trailingEightWeek = totalOnly ? skip() : endWeek < 8 ? skip() : config.l3_field ? await l3_getSalesWkDriven(config, endWeek - 7, endWeek, year) : skip() //prettier-ignore
  const l4_trailingEightWeek = totalOnly ? skip() : endWeek < 8 ? skip() : config.l4_field ? await l4_getSalesWkDriven(config, endWeek - 7, endWeek, year) : skip() //prettier-ignore
  const l0_trailingEightWeek = endWeek < 8 ? skip() : await l0_getSalesWkDriven(config, endWeek - 7, endWeek, year)

  const l1_trailingTwelveWeek = totalOnly ? skip() : endWeek < 12 ? skip() : await l1_getSalesWkDriven(config, endWeek - 11, endWeek, year)
  const l2_trailingTwelveWeek = totalOnly ? skip() : endWeek < 12 ? skip() : await l2_getSalesWkDriven(config, endWeek - 11, endWeek, year)
  const l3_trailingTwelveWeek = totalOnly ? skip() : endWeek < 12 ? skip() : config.l3_field ? await l3_getSalesWkDriven(config, endWeek - 11, endWeek, year): skip() //prettier-ignore
  const l4_trailingTwelveWeek = totalOnly ? skip() : endWeek < 12  ? skip() : config.l4_field ? await l4_getSalesWkDriven(config, endWeek - 11, endWeek, year) : skip() //prettier-ignore
  const l0_trailingTwelveWeek = endWeek < 12 ? skip() : await l0_getSalesWkDriven(config, endWeek - 11, endWeek, year)

  /*  */

  const [l1_fgInvenR, l2_fgInvenR, l3_fgInvenR, l4_fgInvenR, l0_fgInvenR] = await Promise.all([
    l1_fgInven(),
    l2_fgInven(),
    l3_fgInven(),
    l4_fgInven(),
    l0_fgInven(),
  ])

  /*   */

  ///////////////////////////////// KPI DATA
  /* % COMPANY SALES */
  const l1_percent_companySales = totalOnly ? skip() : calcPercentSalesCol(companyTotalSales[0], l1_salesPeriodToDate, 'percentCompanySales')
  const l2_percent_companySales = totalOnly ? skip() : calcPercentSalesCol(companyTotalSales[0], l2_salesPeriodToDate, 'percentCompanySales')
  const l3_percent_companySales = totalOnly ? skip() : config.l3_field ? calcPercentSalesCol(companyTotalSales[0], l3_salesPeriodToDate, 'percentCompanySales') : skip() //prettier-ignore
  const l4_percent_companySales = totalOnly ? skip() : config.l4_field ? calcPercentSalesCol(companyTotalSales[0], l4_salesPeriodToDate, 'percentCompanySales') : skip() //prettier-ignore
  const l0_percent_companySales = calcPercentSalesCol(companyTotalSales[0], l0_salesPeriodToDate, 'percentCompanySales')

  /* % PROGRAM SALES */
  let l1_percent_programSales = skip()
  let l2_percent_programSales = skip()
  let l3_percent_programSales = skip()
  let l4_percent_programSales = skip()
  let l0_percent_programSales = skip()
  if (config.program !== null) {
    l1_percent_programSales = totalOnly ? skip() : calcPercentSalesCol(l0_salesPeriodToDate[0], l1_salesPeriodToDate, 'percentProgramSales')
    l2_percent_programSales = totalOnly ? skip() : calcPercentSalesCol(l0_salesPeriodToDate[0], l2_salesPeriodToDate, 'percentProgramSales')
    l3_percent_programSales = totalOnly ? skip() : config.l3_field ? calcPercentSalesCol(l0_salesPeriodToDate[0], l3_salesPeriodToDate, 'percentProgramSales') : skip() //prettier-ignore
    l4_percent_programSales = totalOnly ? skip() : config.l4_field ? calcPercentSalesCol(l0_salesPeriodToDate[0], l4_salesPeriodToDate, 'percentProgramSales') : skip() //prettier-ignore
    l0_percent_programSales = calcPercentSalesCol(l0_salesPeriodToDate[0], l0_salesPeriodToDate, 'percentProgramSales')
  }

  /* % SPECIES GROUP SALES */
  // look up species group based on program
  // GOING FOWARD MAKE THE SPECIES GROUP ITS OWN VARIABLE IN THE CONFIG SO THAT I CAN INCLUDE IT OR NOT BUT FOR NOW ONLY INCLUDE IF THERE IS A PROGRAM
  let l1_percent_speciesGroupSales = skip()
  let l2_percent_speciesGroupSales = skip()
  let l3_percent_speciesGroupSales = skip()
  let l4_percent_speciesGroupSales = skip()
  let l0_percent_speciesGroupSales = skip()
  if (config.program !== null) {
    const speciesGroupTotalSales = await getSpeciesGroupTotalSales(start, end, config)
    l1_percent_speciesGroupSales = totalOnly ? skip() : calcPercentSalesCol(speciesGroupTotalSales[0], l1_salesPeriodToDate, 'percentSpeciesGroupSales') //prettier-ignore
    l2_percent_speciesGroupSales = totalOnly ? skip() : calcPercentSalesCol(speciesGroupTotalSales[0], l2_salesPeriodToDate, 'percentSpeciesGroupSales') //prettier-ignore
    l3_percent_speciesGroupSales = totalOnly ? skip() : config.l3_field ? calcPercentSalesCol(speciesGroupTotalSales[0], l3_salesPeriodToDate, 'percentSpeciesGroupSales') : skip() //prettier-ignore
    l4_percent_speciesGroupSales = totalOnly ? skip() : config.l4_field ? calcPercentSalesCol(speciesGroupTotalSales[0], l4_salesPeriodToDate, 'percentSpeciesGroupSales') : skip() //prettier-ignore
    l0_percent_speciesGroupSales = calcPercentSalesCol(speciesGroupTotalSales[0], l0_salesPeriodToDate, 'percentSpeciesGroupSales')
  }

  /* % REPORT TOTAL */
  const l1_percent_reportTotal = totalOnly ? skip() : calcPercentSalesCol(l0_salesPeriodToDate[0], l1_salesPeriodToDate, 'percentReportTotal')
  const l2_percent_reportTotal = totalOnly ? skip() : calcPercentSalesCol(l0_salesPeriodToDate[0], l2_salesPeriodToDate, 'percentReportTotal')
  const l3_percent_reportTotal = totalOnly ? skip() : config.l3_field ? calcPercentSalesCol(l0_salesPeriodToDate[0], l3_salesPeriodToDate, 'percentReportTotal') : skip() //prettier-ignore
  const l4_percent_reportTotal = totalOnly ? skip() : config.l4_field ? calcPercentSalesCol(l0_salesPeriodToDate[0], l4_salesPeriodToDate, 'percentReportTotal') : skip() //prettier-ignore
  const l0_percent_reportTotal = calcPercentSalesCol(l0_salesPeriodToDate[0], l0_salesPeriodToDate, 'percentReportTotal')

  /* AVE WEEKLY SALES */
  const weeks = endWeek - startWeek + 1
  const l1_aveWeeklySales = totalOnly ? skip() : calcAveWeeklySales(l1_salesPeriodToDate, 'aveWeeklySales', weeks)
  const l2_aveWeeklySales = totalOnly ? skip() : calcAveWeeklySales(l2_salesPeriodToDate, 'aveWeeklySales', weeks)
  const l3_aveWeeklySales = totalOnly ? skip() : config.l3_field ? calcAveWeeklySales(l3_salesPeriodToDate, 'aveWeeklySales', weeks) : skip()
  const l4_aveWeeklySales = totalOnly ? skip() : config.l4_field ? calcAveWeeklySales(l4_salesPeriodToDate, 'aveWeeklySales', weeks) : skip()
  const l0_aveWeeklySales = calcAveWeeklySales(l0_salesPeriodToDate, 'aveWeeklySales', weeks)

  const l1_twoWkAveSales = totalOnly ? skip() : calcAveWeeklySales(l1_trailingTwoWeek, 'twoWkAveSales', 2)
  const l2_twoWkAveSales = totalOnly ? skip() : calcAveWeeklySales(l2_trailingTwoWeek, 'twoWkAveSales', 2)
  const l3_twoWkAveSales = totalOnly ? skip() : config.l3_field ? calcAveWeeklySales(l3_trailingTwoWeek, 'twoWkAveSales', 2) : skip()
  const l4_twoWkAveSales = totalOnly ? skip() : config.l4_field ? calcAveWeeklySales(l4_trailingTwoWeek, 'twoWkAveSales', 2) : skip()
  const l0_twoWkAveSales = calcAveWeeklySales(l0_trailingTwoWeek, 'twoWkAveSales', 2)

  const l1_fourWkAveSales = totalOnly ? skip() : calcAveWeeklySales(l1_trailingFourWeek, 'fourWkAveSales', 4)
  const l2_fourWkAveSales = totalOnly ? skip() : calcAveWeeklySales(l2_trailingFourWeek, 'fourWkAveSales', 4)
  const l3_fourWkAveSales = totalOnly ? skip() : config.l3_field ? calcAveWeeklySales(l3_trailingFourWeek, 'fourWkAveSales', 4) : skip()
  const l4_fourWkAveSales = totalOnly ? skip() : config.l4_field ? calcAveWeeklySales(l4_trailingFourWeek, 'fourWkAveSales', 4) : skip()
  const l0_fourWkAveSales = calcAveWeeklySales(l0_trailingFourWeek, 'fourWkAveSales', 4)

  const l1_eightWkAveSales = totalOnly ? skip() : calcAveWeeklySales(l1_trailingEightWeek, 'eightWkAveSales', 8)
  const l2_eightWkAveSales = totalOnly ? skip() : calcAveWeeklySales(l2_trailingEightWeek, 'eightWkAveSales', 8)
  const l3_eightWkAveSales = totalOnly ? skip() : config.l3_field ? calcAveWeeklySales(l3_trailingEightWeek, 'eightWkAveSales', 8) : skip()
  const l4_eightWkAveSales = totalOnly ? skip() : config.l4_field ? calcAveWeeklySales(l4_trailingEightWeek, 'eightWkAveSales', 8) : skip()
  const l0_eightWkAveSales = calcAveWeeklySales(l0_trailingEightWeek, 'eightWkAveSales', 8)

  const l1_twelveWkAveSales = totalOnly ? skip() : calcAveWeeklySales(l1_trailingTwelveWeek, 'twelveWkAveSales', 12)
  const l2_twelveWkAveSales = totalOnly ? skip() : calcAveWeeklySales(l2_trailingTwelveWeek, 'twelveWkAveSales', 12)
  const l3_twelveWkAveSales = totalOnly ? skip() : config.l3_field ? calcAveWeeklySales(l3_trailingTwelveWeek, 'twelveWkAveSales', 12) : skip()
  const l4_twelveWkAveSales = totalOnly ? skip() : config.l4_field ? calcAveWeeklySales(l4_trailingTwelveWeek, 'twelveWkAveSales', 12) : skip()
  const l0_twelveWkAveSales = calcAveWeeklySales(l0_trailingTwelveWeek, 'twelveWkAveSales', 12)

  /* WEEKS INV ON HAND */
  const l1_weeksInvOnHand = totalOnly ? skip() : calcWeeksInvOnHand(l1_fgInvenR, l1_aveWeeklySales, 'weeksInvenOnHand')
  const l2_weeksInvOnHand = totalOnly ? skip() : calcWeeksInvOnHand(l2_fgInvenR, l2_aveWeeklySales, 'weeksInvenOnHand')
  const l3_weeksInvOnHand = totalOnly
    ? skip()
    : config.l3_field
    ? calcWeeksInvOnHand(l3_fgInvenR, l3_aveWeeklySales, 'weeksInvenOnHand')
    : skip()
  const l4_weeksInvOnHand = totalOnly
    ? skip()
    : config.l4_field
    ? calcWeeksInvOnHand(l4_fgInvenR, l4_aveWeeklySales, 'weeksInvenOnHand')
    : skip()
  const l0_weeksInvOnHand = calcWeeksInvOnHand(l0_fgInvenR, l0_aveWeeklySales, 'weeksInvenOnHand')

  /* INVENTORY AVAILABLE */
  const l1_invAvailable = totalOnly ? skip() : calcInventoryAvailable(l1_fgInvenR, l1_fgPo, l1_so, 'invenAvailable')
  const l2_invAvailable = totalOnly ? skip() : calcInventoryAvailable(l2_fgInvenR, l2_fgPo, l2_so, 'invenAvailable')
  const l3_invAvailable = totalOnly ? skip() : config.l3_field ? calcInventoryAvailable(l3_fgInvenR, l3_fgPo, l3_so, 'invenAvailable') : skip()
  const l4_invAvailable = totalOnly ? skip() : config.l4_field ? calcInventoryAvailable(l4_fgInvenR, l4_fgPo, l4_so, 'invenAvailable') : skip()
  const l0_invAvailable = calcInventoryAvailable(l0_fgInvenR, l0_fgPo, l0_so, 'invenAvailable')

  ///////////////////////////////// ROWS
  const rowsFourthLevelDetail = totalOnly ? skip() : config.l4_field ? await getRowsFourthLevelDetail(config, start, end, showFyTrend) : skip()
  const rowsThirdLevelDetail = totalOnly ? skip() : config.l3_field ? await getRowsThirdLevelDetail(config, start, end, showFyTrend) : skip()
  const rowsSecondLevelDetail = totalOnly ? skip() : await getRowsSecondLevelDetail(config, start, end, showFyTrend)
  const rowsFirstLevelDetail = totalOnly ? skip() : await getRowsFirstLevelDetail(config, start, end, showFyTrend)

  const totalsRow = [
    {
      totalRow: true,
      l1_label: `${config.itemType} SALES`,
      l2_label: 'TOTAL',
      l3_label: 'TOTAL',
      l4_label: 'TOTAL',
      datalevel: 0,
      itemtype: config.itemType,
    },
  ]

  // COMPILE FINAL ROW TEMPLATE
  const rowTemplate = [...rowsFourthLevelDetail, ...rowsThirdLevelDetail, ...rowsSecondLevelDetail, ...rowsFirstLevelDetail]
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l4_label?.includes('TOTAL')) return 1
      if (b.l4_label?.includes('TOTAL')) return -1

      if (a.l4_label < b.l4_label) return -1
      if (a.l4_label > b.l4_label) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l3_label?.includes('TOTAL')) return 1
      if (b.l3_label?.includes('TOTAL')) return -1

      if (a.l3_label < b.l3_label) return -1
      if (a.l3_label > b.l3_label) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l2_label?.includes('TOTAL')) return 1
      if (b.l2_label?.includes('TOTAL')) return -1

      if (a.l2_label < b.l2_label) return -1
      if (a.l2_label > b.l2_label) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l1_label?.includes('TOTAL')) return 1
      if (b.l1_label?.includes('TOTAL')) return -1

      if (a.l1_label < b.l1_label) return -1
      if (a.l1_label > b.l1_label) return 1
      return 0
    })

  rowTemplate.push(...totalsRow)

  // map data into row template
  // Determine if 2 or 3 level report
  let mapSalesToRowTemplates = null
  let mapInvenToRowTemplates = null
  let rowTemplate_unflat = null
  let level = null
  if (!config.l3_field) {
    // 2 LEVEL REPORT
    mapSalesToRowTemplates = mapSalesToRowTemplates_twoLevel
    mapInvenToRowTemplates = mapInvenToRowTemplates_twoLevel
    rowTemplate_unflat = unflattenByCompositKey(rowTemplate, { 1: 'l1_label', 2: 'l2_label' }) //prettier-ignore
    level = 2
  } else if (!config.l4_field) {
    // 3 LEVEL REPORT
    mapSalesToRowTemplates = mapSalesToRowTemplates_threeLevel
    mapInvenToRowTemplates = mapInvenToRowTemplates_threeLevel
    rowTemplate_unflat = unflattenByCompositKey(rowTemplate, { 1: 'l1_label', 2: 'l2_label', 3: 'l3_label' }) //prettier-ignore
    level = 3
  } else {
    // 4 LEVEL REPORT
    mapSalesToRowTemplates = mapSalesToRowTemplates_fourLevel
    mapInvenToRowTemplates = mapInvenToRowTemplates_fourLevel
    rowTemplate_unflat = unflattenByCompositKey(rowTemplate, { 1: 'l1_label', 2: 'l2_label', 3: 'l3_label', 4: 'l4_label' }) //prettier-ignore
    level = 4
  }

  // switch to include fy trend data
  const fyTrendSales = showFyTrend
    ? [
        ...l1_salesByFy,
        ...l2_salesByFy,
        ...l3_salesByFy,
        ...l4_salesByFy,
        ...l0_salesByFy,
        ...l1_salesByFyYtd,
        ...l2_salesByFyYtd,
        ...l3_salesByFyYtd,
        ...l4_salesByFyYtd,
        ...l0_salesByFyYtd,
      ]
    : skip()

  const mappedSales = mapSalesToRowTemplates(
    [
      ...l1_salesByWk,
      ...l2_salesByWk,
      ...l3_salesByWk,
      ...l4_salesByWk,
      ...l0_salesByWk,
      ...l1_salesPeriodToDate,
      ...l2_salesPeriodToDate,
      ...l3_salesPeriodToDate,
      ...l4_salesPeriodToDate,
      ...l0_salesPeriodToDate,
      ...l1_so,
      ...l2_so,
      ...l3_so,
      ...l4_so,
      ...l0_so,
      // ...l1_soTagged,
      // ...l2_soTagged,
      // ...l3_soTagged,
      // ...l4_soTagged,
      // ...l0_soTagged,
      ...l1_soUntagged,
      ...l2_soUntagged,
      ...l3_soUntagged,
      ...l4_soUntagged,
      ...l0_soUntagged,
      ...l1_so_byWk,
      ...l2_so_byWk,
      ...l3_so_byWk,
      ...l4_so_byWk,
      ...l0_so_byWk,
      // ...l1_soTagged_byWk,
      // ...l2_soTagged_byWk,
      // ...l3_soTagged_byWk,
      // ...l4_soTagged_byWk,
      // ...l0_soTagged_byWk,
      ...l1_soUntagged_byWk,
      ...l2_soUntagged_byWk,
      ...l3_soUntagged_byWk,
      ...l4_soUntagged_byWk,
      ...l0_soUntagged_byWk,
      ...fyTrendSales,
      ...l1_percent_companySales,
      ...l2_percent_companySales,
      ...l3_percent_companySales,
      ...l4_percent_companySales,
      ...l0_percent_companySales,
      ...l1_percent_programSales,
      ...l2_percent_programSales,
      ...l3_percent_programSales,
      ...l4_percent_programSales,
      ...l0_percent_programSales,
      ...l1_percent_speciesGroupSales,
      ...l2_percent_speciesGroupSales,
      ...l3_percent_speciesGroupSales,
      ...l4_percent_speciesGroupSales,
      ...l0_percent_speciesGroupSales,
      ...l1_percent_reportTotal,
      ...l2_percent_reportTotal,
      ...l3_percent_reportTotal,
      ...l4_percent_reportTotal,
      ...l0_percent_reportTotal,
      ...l1_aveWeeklySales,
      ...l2_aveWeeklySales,
      ...l3_aveWeeklySales,
      ...l4_aveWeeklySales,
      ...l0_aveWeeklySales,
      ...l1_twoWkAveSales,
      ...l2_twoWkAveSales,
      ...l3_twoWkAveSales,
      ...l4_twoWkAveSales,
      ...l0_twoWkAveSales,
      ...l1_fourWkAveSales,
      ...l2_fourWkAveSales,
      ...l3_fourWkAveSales,
      ...l4_fourWkAveSales,
      ...l0_fourWkAveSales,
      ...l1_eightWkAveSales,
      ...l2_eightWkAveSales,
      ...l3_eightWkAveSales,
      ...l4_eightWkAveSales,
      ...l0_eightWkAveSales,
      ...l1_twelveWkAveSales,
      ...l2_twelveWkAveSales,
      ...l3_twelveWkAveSales,
      ...l4_twelveWkAveSales,
      ...l0_twelveWkAveSales,
    ],
    rowTemplate_unflat
  )

  const mappedInven = mapInvenToRowTemplates(
    [
      ...l1_fgInvenR,
      ...l2_fgInvenR,
      ...l3_fgInvenR,
      ...l4_fgInvenR,
      ...l0_fgInvenR,
      ...l1_fgInTransit,
      ...l2_fgInTransit,
      ...l3_fgInTransit,
      ...l4_fgInTransit,
      ...l0_fgInTransit,
      ...l1_fgAtLoc,
      ...l2_fgAtLoc,
      ...l3_fgAtLoc,
      ...l4_fgAtLoc,
      ...l0_fgAtLoc,
      ...l1_fgAtLoc_untagged,
      ...l2_fgAtLoc_untagged,
      ...l3_fgAtLoc_untagged,
      ...l4_fgAtLoc_untagged,
      ...l0_fgAtLoc_untagged,
      // ...l1_fgAtLoc_tagged,
      // ...l2_fgAtLoc_tagged,
      // ...l3_fgAtLoc_tagged,
      // ...l4_fgAtLoc_tagged,
      // ...l0_fgAtLoc_tagged,
      ...l1_fgPo,
      ...l2_fgPo,
      ...l3_fgPo,
      ...l4_fgPo,
      ...l0_fgPo,
      ...l1_weeksInvOnHand,
      ...l2_weeksInvOnHand,
      ...l3_weeksInvOnHand,
      ...l4_weeksInvOnHand,
      ...l0_weeksInvOnHand,
      ...l1_invAvailable,
      ...l2_invAvailable,
      ...l3_invAvailable,
      ...l4_invAvailable,
      ...l0_invAvailable,
    ],
    rowTemplate_unflat
  )

  const mappedData = combineMappedRows(mappedSales, mappedInven)

  const flattenedMappedData = Object.values(mappedData)
  const data = cleanLabelsForDisplay(flattenedMappedData, config)
  const trendColsSales = await getDateEndPerWeekByRange(start, end, config)
  //const collapsedData = collapseRedundantTotalRows(data, level)

  // get data column names by fiscal year
  let trendColsSaByFy = null
  let trendColsSaByFyYtd = null
  if (showFyTrend) trendColsSaByFy = await getFiscalYearCols()
  if (showFyTrend) trendColsSaByFyYtd = await getFiscalYearYtdCols()

  // get so by week cols
  const start_so = await getEarliestShipWk(config)
  const end_so = await getLatestShipWk(config)
  const trendColsSo = await getDateEndPerWeekByRange_so(start_so, end_so, config)
  const trendColsSo_tg = await getDateEndPerWeekByRange_so_tg(start_so, end_so, config)
  const trendColsSo_untg = await getDateEndPerWeekByRange_so_untg(start_so, end_so, config)

  // return
  return {
    data,
    cols: {
      trendColsSales,
      trendColsSaByFy,
      trendColsSaByFyYtd,
      labelCols,
      trendColsSo,
      trendColsSo_tg,
      trendColsSo_untg,
      columnConfigs,
    },
  }
}

module.exports = buildReport
