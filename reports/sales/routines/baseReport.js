const {
  getDateEndPerFiscalPeriodByRange,
  getDateEndPerWeekByRange_pj,
  getDateEndPerWeekByRange_so,
  getDateEndPerWeekByRange_so_tg,
  getDateEndPerWeekByRange_so_untg,
} = require('../../../database/queries/postgres/getDateEndPerWeek')
const { getTrendColsSales } = require('../../../database/queries/postgres/trendColHeadings/getTrendColsSales')
const { getTrendColsFiscalYear } = require('../../../database/queries/postgres/trendColHeadings/getTrendColsFiscalYear')
const { getTrendColsSo } = require('../../../database/queries/postgres/trendColHeadings/getTrendColsSo')
const {
l0_getSalesProjectionByWk,
l0_getSalesProjectionPeriodToDate,
l2_getSalesProjectionByWk,
l2_getSalesProjectionPeriodToDate,
l1_getSalesProjectionByWk,
l1_getSalesProjectionPeriodToDate,
l3_getSalesProjectionByWk,
l3_getSalesProjectionPeriodToDate,
l4_getSalesProjectionByWk,
l4_getSalesProjectionPeriodToDate,
l5_getSalesProjectionByWk,
l5_getSalesProjectionPeriodToDate
} = require('../../../database/queries/postgres/baseReport/getSalesProjection')
const {
  l1_getSalesTrend,
  l2_getSalesTrend,
  l3_getSalesTrend,
  l4_getSalesTrend,
  l5_getSalesTrend,
  l0_getSalesTrend,
} = require('../../../database/queries/postgres/baseReport/getSalesTrend')
const {
  l1_getSalesTotalPrimary,
  l2_getSalesTotalPrimary,
  l3_getSalesTotalPrimary,
  l4_getSalesTotalPrimary,
  l5_getSalesTotalPrimary,
  l0_getSalesTotalPrimary
} = require('../../../database/queries/postgres/baseReport/getSales')
const {
  l1_getSalesWkDriven,
  l2_getSalesWkDriven,
  l3_getSalesWkDriven,
  l4_getSalesWkDriven,
  l5_getSalesWkDriven,
  l0_getSalesWkDriven,
} = require('../../../database/queries/postgres/baseReport/getSalesTrendWkDriven')
const { getCompanyTotalSales } = require('../../../database/queries/postgres/kpi/getCompanyTotalSales')
const { getProgramTotalSales } = require('../../../database/queries/postgres/kpi/getProgramTotalSales')
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
  l5_getFgInven,
  l5_getFgInTransit,
  l5_getFgAtLoc,
  l5_getFgAtLoc_untagged,
  l5_getFgAtLoc_tagged,
} = require('../../../database/queries/postgres/baseReport/getFgInven')
const { l1_getFgPo, l2_getFgPo, l3_getFgPo, l4_getFgPo, l5_getFgPo, l0_getFgPo } = require('../../../database/queries/postgres/baseReport/getFgOpenPo')
const {
  l1_getSo,
  l2_getSo,
  l3_getSo,
  l4_getSo,
  l5_getSo,
  l0_getSo,
  l1_getSoTagged,
  l2_getSoTagged,
  l3_getSoTagged,
  l4_getSoTagged,
  l5_getSoTagged,
  l0_getSoTagged,
  l1_getSoUntagged,
  l2_getSoUntagged,
  l3_getSoUntagged,
  l4_getSoUntagged,
  l5_getSoUntagged,
  l0_getSoUntagged,
} = require('../../../database/queries/postgres/baseReport/getSo')
const {
  l1_getSoTrend,
  l2_getSoTrend,
  l3_getSoTrend,
  l4_getSoTrend,
  l5_getSoTrend,
  l0_getSoTrend,
  l1_getSoTaggedTrend,
  l2_getSoTaggedTrend,
  l3_getSoTaggedTrend,
  l4_getSoTaggedTrend,
  l5_getSoTaggedTrend,
  l0_getSoTaggedTrend,
  l1_getSoUntaggedTrend,
  l2_getSoUntaggedTrend,
  l3_getSoUntaggedTrend,
  l4_getSoUntaggedTrend,
  l5_getSoUntaggedTrend,
  l0_getSoUntaggedTrend,
} = require('../../../database/queries/postgres/baseReport/getSoTrend')
const {
  getRowsFifthLevelDetail,
  getRowsFourthLevelDetail,
  getRowsThirdLevelDetail,
  getRowsSecondLevelDetail,
  getRowsFirstLevelDetail,
} = require('../../../database/queries/postgres/baseReport/getRows')
const mapSalesToRowTemplates_fiveLevel = require('../../../models/mapSalesToRowTemplatesFiveLevel')
const mapInvenToRowTemplates_fiveLevel = require('../../../models/mapInvenToRowTemplatesFiveLevel')
const mapSalesToRowTemplates_fourLevel = require('../../../models/mapSalesToRowTemplatesFourLevel')
const mapInvenToRowTemplates_fourLevel = require('../../../models/mapInvenToRowTemplatesFourLevel')
const mapSalesToRowTemplates_threeLevel = require('../../../models/mapSalesToRowTemplatesThreeLevel')
const mapInvenToRowTemplates_threeLevel = require('../../../models/mapInvenToRowTemplatesThreeLevel')
const mapSalesToRowTemplates_twoLevel = require('../../../models/mapSalesToRowTemplatesTwoLevel')
const mapInvenToRowTemplates_twoLevel = require('../../../models/mapInvenToRowTemplatesTwoLevel')
const combineMappedRows = require('../../../models/combineMappedRows')
const cleanLabelsForDisplay = require('../../../models/cleanLabelsForDisplay')
const unflattenByCompositKey = require('../../../models/unflattenByCompositKey')
const calcPercentSalesCol = require('../../../models/calcPercentSalesCol')
const getSpeciesGroupTotalSales = require('../../../database/queries/postgres/kpi/getSpeciesGroupTotalSalesFromProgram')
const calcAveWeeklySales = require('../../../models/calcAveWeeklySales')
const calcYoyYtdSalesCol = require('../../../models/calcYoyYtdSalesCol')
const calcMomentum = require('../../../models/calcMomentumSalesCol')
const calcWeeksInvOnHand = require('../../../models/calcWeeksInvOnHand')
const calcInventoryAvailable = require('../../../models/calcInventoryAvailable')
const collapseRedundantTotalRows = require('../../../models/collapseRedundantTotalRows')
const columnConfigs = require('../data/baseCols/columns')
const sortRowTemplate = require('../../../models/sortRowTemplate')
const {addDataToSalesTotalCol, addDataToSoTotalCol} = require('../../../models/colDataHelper')

const buildReport = async (config) => {
  // The routine and all of the queries can be the same for all reports. Going to buikd out this rpeort and then change the config manually to test.

  const skip = () => {
    return () => {
      return []
    }
  }

  ///////////////////////////////// INVENTORY DATA
  /* TOTAL FG (FG) */
  const l0_fgInven = () => {return l0_getFgInven(config)} 
  const l1_fgInven = () => {return l1_getFgInven(config)} 
  const l2_fgInven = () => {return l2_getFgInven(config)} 
  const l3_fgInven = config.baseFormat.l3_field ? () => {return l3_getFgInven(config)}: skip() 
  const l4_fgInven = config.baseFormat.l4_field ? () => {return l4_getFgInven(config)}: skip() 
  const l5_fgInven = config.baseFormat.l5_field ? () => {return l5_getFgInven(config)}: skip() 

  /* FG IN TRANSIT*/
  const l0_fgInTransit = () => {return l0_getFgInTransit(config)}
  const l1_fgInTransit = () => {return l1_getFgInTransit(config)}
  const l2_fgInTransit = () => {return l2_getFgInTransit(config)}
  const l3_fgInTransit =  config.baseFormat.l3_field ? () => {return l3_getFgInTransit(config)} : skip()
  const l4_fgInTransit =  config.baseFormat.l4_field ? () => {return l4_getFgInTransit(config)} : skip()
  const l5_fgInTransit =  config.baseFormat.l5_field ? () => {return l5_getFgInTransit(config)} : skip()

  /* FG ON HAND (LESS IN TRANSIT) */
  const l0_fgAtLoc = () => {return l0_getFgAtLoc(config)}
  const l1_fgAtLoc = () => {return l1_getFgAtLoc(config)}
  const l2_fgAtLoc = () => {return l2_getFgAtLoc(config)}
  const l3_fgAtLoc =  config.baseFormat.l3_field ? () => {return l3_getFgAtLoc(config)} : skip()
  const l4_fgAtLoc =  config.baseFormat.l4_field ? () => {return l4_getFgAtLoc(config)} : skip()
  const l5_fgAtLoc =  config.baseFormat.l5_field ? () => {return l5_getFgAtLoc(config)} : skip()

  /* FG ON HAND UNTAGGED */
  const l0_fgAtLoc_untagged = () => {return l0_getFgAtLoc_untagged(config)}
  const l1_fgAtLoc_untagged = () => {return l1_getFgAtLoc_untagged(config)}
  const l2_fgAtLoc_untagged = () => {return l2_getFgAtLoc_untagged(config)}
  const l3_fgAtLoc_untagged =  config.baseFormat.l3_field ? () => {return l3_getFgAtLoc_untagged(config)} : skip()
  const l4_fgAtLoc_untagged =  config.baseFormat.l4_field ? () => {return l4_getFgAtLoc_untagged(config)} : skip()
  const l5_fgAtLoc_untagged =  config.baseFormat.l5_field ? () => {return l5_getFgAtLoc_untagged(config)} : skip()

  /* FG ON HAND TAGGED */
  // const l0_fgAtLoc_tagged = () => {return l0_getFgAtLoc_tagged(config)}
  // const l1_fgAtLoc_tagged = () => {return l1_getFgAtLoc_tagged(config)}
  // const l2_fgAtLoc_tagged = () => {return l2_getFgAtLoc_tagged(config)}
  // const l3_fgAtLoc_tagged =  config.baseFormat.l3_field ? () => {return l3_getFgAtLoc_tagged(config)}:skip()
  // const l4_fgAtLoc_tagged =  config.baseFormat.l4_field ? () => {return l4_getFgAtLoc_tagged(config)}:skip()
  // const l5_fgAtLoc_tagged =  config.baseFormat.l5_field ? () => {return l5_getFgAtLoc_tagged(config)}:skip()

  /* FG ON ORDER */
  const l0_fgPo = () => {return l0_getFgPo(config)}
  const l1_fgPo = () => {return l1_getFgPo(config)}
  const l2_fgPo = () => {return l2_getFgPo(config)}
  const l3_fgPo =  config.baseFormat.l3_field ? () => {return l3_getFgPo(config)} : skip()
  const l4_fgPo =  config.baseFormat.l4_field ? () => {return l4_getFgPo(config)} : skip()
  const l5_fgPo =  config.baseFormat.l5_field ? () => {return l5_getFgPo(config)} : skip()
  
  // ///////////////////////////////// SALES ORDERS
  /* ALL SO */

  const l0_so = () => {return l0_getSo(config)}
  const l1_so = () => {return l1_getSo(config)}
  const l2_so = () => {return l2_getSo(config)}
  const l3_so =  config.baseFormat.l3_field ? () => {return l3_getSo(config)} : skip()
  const l4_so =  config.baseFormat.l4_field ? () => {return l4_getSo(config)} : skip()
  const l5_so =  config.baseFormat.l5_field ? () => {return l5_getSo(config)} : skip()
  
  const l0_soTrend = !config.trends.queryGrouping ? skip() : () => {return l0_getSoTrend(config)}
  const l1_soTrend = !config.trends.queryGrouping ? skip() : () => {return l1_getSoTrend(config)}
  const l2_soTrend = !config.trends.queryGrouping ? skip() : () => {return l2_getSoTrend(config)}
  const l3_soTrend = !config.trends.queryGrouping ? skip() : config.baseFormat.l3_field ? () => {return l3_getSoTrend(config)} : skip()
  const l4_soTrend = !config.trends.queryGrouping ? skip() : config.baseFormat.l4_field ? () => {return l4_getSoTrend(config)} : skip()
  const l5_soTrend = !config.trends.queryGrouping ? skip() : config.baseFormat.l5_field ? () => {return l5_getSoTrend(config)} : skip()

  /* TAGGED SO */
  // const l0_soTagged = () => {return l0_getSoTagged(config)}
  // const l1_soTagged = () => {return l1_getSoTagged(config)}
  // const l2_soTagged = () => {return l2_getSoTagged(config)}
  // const l3_soTagged =  config.baseFormat.l3_field ? () => {return l3_getSoTagged(config)}:skip()
  // const l4_soTagged =  config.baseFormat.l4_field ? () => {return l4_getSoTagged(config)}:skip()
  // const l5_soTagged =  config.baseFormat.l5_field ? () => {return l5_getSoTagged(config)}:skip()

  // const l0_soTaggedTrend = () => {return l0_getsoTaggedTrend(config)}
  // const l1_soTaggedTrend = () => {return l1_getsoTaggedTrend(config)}
  // const l2_soTaggedTrend = () => {return l2_getsoTaggedTrend(config)}
  // const l3_soTaggedTrend =  config.baseFormat.l3_field ? () => {return l3_getsoTaggedTrend(config)}:skip()
  // const l4_soTaggedTrend =  config.baseFormat.l4_field ? () => {return l4_getsoTaggedTrend(config)}:skip()
  // const l5_soTaggedTrend =  config.baseFormat.l5_field ? () => {return l5_getsoTaggedTrend(config)}:skip()

  /* UNTAGGED SO */
  // const l0_soUntagged = () => {return l0_getSoUntagged(config)}
  // const l1_soUntagged = () => {return l1_getSoUntagged(config)}
  // const l2_soUntagged = () => {return l2_getSoUntagged(config)}
  // const l3_soUntagged =  config.baseFormat.l3_field ? () => {return l3_getSoUntagged(config)} : skip()
  // const l4_soUntagged =  config.baseFormat.l4_field ? () => {return l4_getSoUntagged(config)} : skip()
  // const l5_soUntagged =  config.baseFormat.l5_field ? () => {return l5_getSoUntagged(config)} : skip()

  // const l0_soUntaggedTrend = () => {return l0_getsoUntaggedTrend(config)}
  // const l1_soUntaggedTrend = () => {return l1_getsoUntaggedTrend(config)}
  // const l2_soUntaggedTrend = () => {return l2_getsoUntaggedTrend(config)}
  // const l3_soUntaggedTrend =  config.baseFormat.l3_field ? () => {return l3_getsoUntaggedTrend(config)} : skip()
  // const l4_soUntaggedTrend =  config.baseFormat.l4_field ? () => {return l4_getsoUntaggedTrend(config)} : skip()
  // const l5_soUntaggedTrend =  config.baseFormat.l5_field ? () => {return l5_getsoUntaggedTrend(config)} : skip()

  // ///////////////////////////////// SALES DATA

  /*SALES PROJECTIONS*/

  const l0_salesProjectionByWk = !config.trends.useProjection ? skip() : () => {return l0_getSalesProjectionByWk(config, config.totals.startDatePrimary, config.totals.endDatePrimary)}
  const l1_salesProjectionByWk = !config.trends.useProjection ? skip() : () => {return l1_getSalesProjectionByWk(config, config.totals.startDatePrimary, config.totals.endDatePrimary)}
  const l2_salesProjectionByWk = !config.trends.useProjection ? skip() : () => {return l2_getSalesProjectionByWk(config, config.totals.startDatePrimary, config.totals.endDatePrimary)}
  const l3_salesProjectionByWk = !config.trends.useProjection ? skip() : config.baseFormat.l3_field ? () => {return l3_getSalesProjectionByWk(config, config.totals.startDatePrimary, config.totals.endDatePrimary)} : skip()
  const l4_salesProjectionByWk = !config.trends.useProjection ? skip() : config.baseFormat.l4_field ? () => {return l4_getSalesProjectionByWk(config, config.totals.startDatePrimary, config.totals.endDatePrimary)} : skip()
  const l5_salesProjectionByWk = !config.trends.useProjection ? skip() : config.baseFormat.l5_field ? () => {return l5_getSalesProjectionByWk(config, config.totals.startDatePrimary, config.totals.endDatePrimary)} : skip()

  const l0_salesProjectionPeriodToDate = !config.totals.useProjection ? skip() : () => {return l0_getSalesProjectionPeriodToDate(config, config.totals.startDatePrimary, config.totals.endDatePrimary)}
  const l1_salesProjectionPeriodToDate = !config.totals.useProjection ? skip() : () => {return l1_getSalesProjectionPeriodToDate(config, config.totals.startDatePrimary, config.totals.endDatePrimary)}
  const l2_salesProjectionPeriodToDate = !config.totals.useProjection ? skip() : () => {return l2_getSalesProjectionPeriodToDate(config, config.totals.startDatePrimary, config.totals.endDatePrimary)}
  const l3_salesProjectionPeriodToDate = !config.totals.useProjection ? skip() : config.baseFormat.l3_field ? () => {return l3_getSalesProjectionPeriodToDate(config, config.totals.startDatePrimary, config.totals.endDatePrimary)} : skip()
  const l4_salesProjectionPeriodToDate = !config.totals.useProjection ? skip() : config.baseFormat.l4_field ? () => {return l4_getSalesProjectionPeriodToDate(config, config.totals.startDatePrimary, config.totals.endDatePrimary)} : skip()
  const l5_salesProjectionPeriodToDate = !config.totals.useProjection ? skip() : config.baseFormat.l5_field ? () => {return l5_getSalesProjectionPeriodToDate(config, config.totals.startDatePrimary, config.totals.endDatePrimary)} : skip()

  /*SALES*/

  const l0_salesTotalPrimary =  () => {return l0_getSalesTotalPrimary(config)}
  const l1_salesTotalPrimary =  () => {return l1_getSalesTotalPrimary(config)}
  const l2_salesTotalPrimary =  () => {return l2_getSalesTotalPrimary(config)}
  const l3_salesTotalPrimary =  config.baseFormat.l3_field ? () => {return l3_getSalesTotalPrimary(config)} : skip()
  const l4_salesTotalPrimary =  config.baseFormat.l4_field ? () => {return l4_getSalesTotalPrimary(config)} : skip()
  const l5_salesTotalPrimary =  config.baseFormat.l5_field ? () => {return l5_getSalesTotalPrimary(config)} : skip()
  
  // TRENDS
  const l0_salesTrend = !config.trends.queryGrouping ? skip() : () => {return l0_getSalesTrend(config)}
  const l1_salesTrend = !config.trends.queryGrouping ? skip() : () => {return l1_getSalesTrend(config)}
  const l2_salesTrend = !config.trends.queryGrouping ? skip() : () => {return l2_getSalesTrend(config)}
  const l3_salesTrend = !config.trends.queryGrouping ? skip() : config.baseFormat.l3_field ? () => {return l3_getSalesTrend(config)} : skip()
  const l4_salesTrend = !config.trends.queryGrouping ? skip() : config.baseFormat.l4_field ? () => {return l4_getSalesTrend(config)} : skip()
  const l5_salesTrend = !config.trends.queryGrouping ? skip() : config.baseFormat.l5_field ? () => {return l5_getSalesTrend(config)} : skip()

  const [
    l1_fgInvenR,
    l2_fgInvenR,
    l3_fgInvenR,
    l4_fgInvenR,
    l5_fgInvenR,
    l0_fgInvenR,
    l1_fgInTransitR,
    l2_fgInTransitR,
    l3_fgInTransitR,
    l4_fgInTransitR,
    l5_fgInTransitR,
    l0_fgInTransitR,
    l1_fgAtLocR,
    l2_fgAtLocR,
    l3_fgAtLocR,
    l4_fgAtLocR,
    l5_fgAtLocR,
    l0_fgAtLocR,
    l1_fgAtLoc_untaggedR,
    l2_fgAtLoc_untaggedR,
    l3_fgAtLoc_untaggedR,
    l4_fgAtLoc_untaggedR,
    l5_fgAtLoc_untaggedR,
    l0_fgAtLoc_untaggedR,
    // l1_fgAtLoc_taggedR,
    // l2_fgAtLoc_taggedR,
    // l3_fgAtLoc_taggedR,
    // l4_fgAtLoc_taggedR,
    // l5_fgAtLoc_taggedR,
    // l0_fgAtLoc_taggedR,
    l1_fgPoR,
    l2_fgPoR,
    l3_fgPoR,
    l4_fgPoR,
    l5_fgPoR,
    l0_fgPoR,
    l1_soR,
    l2_soR,
    l3_soR,
    l4_soR,
    l5_soR,
    l0_soR,
    l1_soTrendR,
    l2_soTrendR,
    l3_soTrendR,
    l4_soTrendR,
    l5_soTrendR,
    l0_soTrendR,
    // l1_soTaggedR,
    // l2_soTaggedR,
    // l3_soTaggedR,
    // l4_soTaggedR,
    // l5_soTaggedR,
    // l0_soTaggedR,
    // l1_soTaggedTrendR,
    // l2_soTaggedTrendR,
    // l3_soTaggedTrendR,
    // l4_soTaggedTrendR,
    // l5_soTaggedTrendR,
    // l0_soTaggedTrendR,
    // l1_soUntaggedR,
    // l2_soUntaggedR,
    // l3_soUntaggedR,
    // l4_soUntaggedR,
    // l5_soUntaggedR,
    // l0_soUntaggedR,
    // l1_soUntaggedTrendR,
    // l2_soUntaggedTrendR,
    // l3_soUntaggedTrendR,
    // l4_soUntaggedTrendR,
    // l5_soUntaggedTrendR,
    // l0_soUntaggedTrendR,
    l1_salesProjectionBywkR,
    l2_salesProjectionBywkR,
    l3_salesProjectionBywkR,
    l4_salesProjectionBywkR,
    l5_salesProjectionBywkR,
    l0_salesProjectionBywkR,
    l1_salesProjectionPeriodToDateR,
    l2_salesProjectionPeriodToDateR,
    l3_salesProjectionPeriodToDateR,
    l4_salesProjectionPeriodToDateR,
    l5_salesProjectionPeriodToDateR,
    l0_salesProjectionPeriodToDateR,
    l1_salesTrendR,
    l2_salesTrendR,
    l3_salesTrendR,
    l4_salesTrendR,
    l5_salesTrendR,
    l0_salesTrendR,
    l1_salesPeriodToDateR,
    l2_salesPeriodToDateR,
    l3_salesPeriodToDateR,
    l4_salesPeriodToDateR,
    l5_salesPeriodToDateR,
    l0_salesPeriodToDateR,
  ] = await Promise.all([
    l1_fgInven(),
    l2_fgInven(),
    l3_fgInven(),
    l4_fgInven(),
    l5_fgInven(),
    l0_fgInven(),
    l1_fgInTransit(),
    l2_fgInTransit(),
    l3_fgInTransit(),
    l4_fgInTransit(),
    l5_fgInTransit(),
    l0_fgInTransit(),
    l1_fgAtLoc(),
    l2_fgAtLoc(),
    l3_fgAtLoc(),
    l4_fgAtLoc(),
    l5_fgAtLoc(),
    l0_fgAtLoc(),
    l1_fgAtLoc_untagged(),
    l2_fgAtLoc_untagged(),
    l3_fgAtLoc_untagged(),
    l4_fgAtLoc_untagged(),
    l5_fgAtLoc_untagged(),
    l0_fgAtLoc_untagged(),
    // l1_fgAtLoc_tagged(),
    // l2_fgAtLoc_tagged(),
    // l3_fgAtLoc_tagged(),
    // l4_fgAtLoc_tagged(),
    // l5_fgAtLoc_tagged(),
    // l0_fgAtLoc_tagged(),
    l1_fgPo(),
    l2_fgPo(),
    l3_fgPo(),
    l4_fgPo(),
    l5_fgPo(),
    l0_fgPo(),
    l1_so(),
    l2_so(),
    l3_so(),
    l4_so(),
    l5_so(),
    l0_so(),
    l1_soTrend(),
    l2_soTrend(),
    l3_soTrend(),
    l4_soTrend(),
    l5_soTrend(),
    l0_soTrend(),
    // l1_soTagged(),
    // l2_soTagged(),
    // l3_soTagged(),
    // l4_soTagged(),
    // l5_soTagged(),
    // l0_soTagged(),
    // l1_soTaggedTrend(),
    // l2_soTaggedTrend(),
    // l3_soTaggedTrend(),
    // l4_soTaggedTrend(),
    // l5_soTaggedTrend(),
    // l0_soTaggedTrend(),
    // l1_soUntagged(),
    // l2_soUntagged(),
    // l3_soUntagged(),
    // l4_soUntagged(),
    // l5_soUntagged(),
    // l0_soUntagged(),
    // l1_soUntaggedTrend(),
    // l2_soUntaggedTrend(),
    // l3_soUntaggedTrend(),
    // l4_soUntaggedTrend(),
    // l5_soUntaggedTrend(),
    // l0_soUntaggedTrend(),
    l1_salesProjectionByWk(),
    l2_salesProjectionByWk(),
    l3_salesProjectionByWk(),
    l4_salesProjectionByWk(),
    l5_salesProjectionByWk(),
    l0_salesProjectionByWk(),
    l1_salesProjectionPeriodToDate(),
    l2_salesProjectionPeriodToDate(),
    l3_salesProjectionPeriodToDate(),
    l4_salesProjectionPeriodToDate(),
    l5_salesProjectionPeriodToDate(),
    l0_salesProjectionPeriodToDate(),
    l1_salesTrend(),
    l2_salesTrend(),
    l3_salesTrend(),
    l4_salesTrend(),
    l5_salesTrend(),
    l0_salesTrend(),
    l1_salesTotalPrimary(),
    l2_salesTotalPrimary(),
    l3_salesTotalPrimary(),
    l4_salesTotalPrimary(),
    l5_salesTotalPrimary(),
    l0_salesTotalPrimary(),
  ])

  ///////////////////////////////// KPI DATA

  const companyTotalSales = () => {return getCompanyTotalSales(config.totals.startDatePrimary, config.totals.endDatePrimary, config)}
  const programTotalSales = () => {return getProgramTotalSales(config.totals.startDatePrimary, config.totals.endDatePrimary, config)}
  const speciesGroupTotalSales = () => {return getSpeciesGroupTotalSales(config.totals.startDatePrimary, config.totals.endDatePrimary, config)}

  //*****Note that we maybe cannot use week driven sales queries with projection because it only handles weeks for a specific fiscal config.totals.yearPrimary while the projection could span fiscal years */

  const l0_trailingTwoWeek = config.totals.endWeekPrimary < 2 ? skip() : () => {return l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')}
  const l1_trailingTwoWeek = config.totals.endWeekPrimary < 2 ? skip() : () => {return l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')}
  const l2_trailingTwoWeek = config.totals.endWeekPrimary < 2 ? skip() : () => {return l2_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')}
  const l3_trailingTwoWeek = config.totals.endWeekPrimary < 2 ? skip() : config.baseFormat.l3_field ? () => {return l3_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')} : skip() 
  const l4_trailingTwoWeek = config.totals.endWeekPrimary < 2 ? skip() : config.baseFormat.l4_field ? () => {return l4_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')} : skip() 
  const l5_trailingTwoWeek = config.totals.endWeekPrimary < 2 ? skip() : config.baseFormat.l5_field ? () => {return l5_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')} : skip() 
  
  const l0_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : () => {return l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')}
  const l1_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : () => {return l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')}
  const l2_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : () => {return l2_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')}
  const l3_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : config.baseFormat.l3_field ? () => {return l3_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')} : skip() 
  const l4_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : config.baseFormat.l4_field ? () => {return l4_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')} : skip() 
  const l5_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : config.baseFormat.l5_field ? () => {return l5_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')} : skip() 

  const l0_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : () => {return l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')}
  const l1_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : () => {return l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')}
  const l2_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : () => {return l2_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')}
  const l3_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : config.baseFormat.l3_field ? () => {return l3_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')} : skip() 
  const l4_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : config.baseFormat.l4_field ? () => {return l4_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')} : skip() 
  const l5_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : config.baseFormat.l5_field ? () => {return l5_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')} : skip() 

  const l0_trailingTwelveWeek = config.totals.endWeekPrimary < 12 ? skip() : () => {return l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')}
  const l1_trailingTwelveWeek = config.totals.endWeekPrimary < 12 ? skip() : () => {return l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')}
  const l2_trailingTwelveWeek = config.totals.endWeekPrimary < 12 ? skip() : () => {return l2_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')}
  const l3_trailingTwelveWeek = config.totals.endWeekPrimary < 12 ? skip() : config.baseFormat.l3_field ? () => {return l3_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')} : skip() 
  const l4_trailingTwelveWeek = config.totals.endWeekPrimary < 12  ? skip() : config.baseFormat.l4_field ? () => {return l4_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')} : skip() 
  const l5_trailingTwelveWeek = config.totals.endWeekPrimary < 12  ? skip() : config.baseFormat.l5_field ? () => {return l5_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')} : skip() 
  
  const [ 
    companyTotalSalesR,
    programTotalSalesR,  
    speciesGroupTotalSalesR,
    l1_trailingTwoWeekR,
    l2_trailingTwoWeekR,
    l3_trailingTwoWeekR,
    l4_trailingTwoWeekR,
    l5_trailingTwoWeekR,
    l0_trailingTwoWeekR,
    l1_trailingFourWeekR,
    l2_trailingFourWeekR,
    l3_trailingFourWeekR,
    l4_trailingFourWeekR,
    l5_trailingFourWeekR,
    l0_trailingFourWeekR,
    l1_trailingEightWeekR,
    l2_trailingEightWeekR,
    l3_trailingEightWeekR,
    l4_trailingEightWeekR,
    l5_trailingEightWeekR,
    l0_trailingEightWeekR,
    l1_trailingTwelveWeekR,
    l2_trailingTwelveWeekR,
    l3_trailingTwelveWeekR,
    l4_trailingTwelveWeekR,
    l5_trailingTwelveWeekR,
    l0_trailingTwelveWeekR, 
  ] = await Promise.all([ 
    companyTotalSales(), 
    programTotalSales(), 
    speciesGroupTotalSales(),
    l1_trailingTwoWeek(),
    l2_trailingTwoWeek(),
    l3_trailingTwoWeek(),
    l4_trailingTwoWeek(),
    l5_trailingTwoWeek(),
    l0_trailingTwoWeek(),
    l1_trailingFourWeek(),
    l2_trailingFourWeek(),
    l3_trailingFourWeek(),
    l4_trailingFourWeek(),
    l5_trailingFourWeek(),
    l0_trailingFourWeek(),
    l1_trailingEightWeek(),
    l2_trailingEightWeek(),
    l3_trailingEightWeek(),
    l4_trailingEightWeek(),
    l5_trailingEightWeek(),
    l0_trailingEightWeek(),
    l1_trailingTwelveWeek(),
    l2_trailingTwelveWeek(),
    l3_trailingTwelveWeek(),
    l4_trailingTwelveWeek(),
    l5_trailingTwelveWeek(),
    l0_trailingTwelveWeek(),
  ])

  // Define numerators and denominators to use
  let l0_reportSales = config.totals.useProjection ? l0_salesProjectionPeriodToDateR : l0_salesPeriodToDateR
  let l1_reportSales = config.totals.useProjection ? l1_salesProjectionPeriodToDateR : l1_salesPeriodToDateR
  let l2_reportSales = config.totals.useProjection ? l2_salesProjectionPeriodToDateR : l2_salesPeriodToDateR
  let l3_reportSales = config.totals.useProjection ? l3_salesProjectionPeriodToDateR : l3_salesPeriodToDateR
  let l4_reportSales = config.totals.useProjection ? l4_salesProjectionPeriodToDateR : l4_salesPeriodToDateR
  let l5_reportSales = config.totals.useProjection ? l5_salesProjectionPeriodToDateR : l5_salesPeriodToDateR

  /* % YoY YTD SALES */
  const l0_yoyYtd_companySales = !config.trends.fyYtd ? [] : calcYoyYtdSalesCol(l0_salesByFyYtdR, 'yoyYtdSales')
  const l1_yoyYtd_companySales = !config.trends.fyYtd ? [] : calcYoyYtdSalesCol(l1_salesByFyYtdR, 'yoyYtdSales')
  const l2_yoyYtd_companySales = !config.trends.fyYtd ? [] : calcYoyYtdSalesCol(l2_salesByFyYtdR, 'yoyYtdSales')
  const l3_yoyYtd_companySales = !config.trends.fyYtd ? [] : config.baseFormat.l3_field ? calcYoyYtdSalesCol(l3_salesByFyYtdR, 'yoyYtdSales') : [] 
  const l4_yoyYtd_companySales = !config.trends.fyYtd ? [] : config.baseFormat.l4_field ? calcYoyYtdSalesCol(l4_salesByFyYtdR, 'yoyYtdSales') : [] 
  const l5_yoyYtd_companySales = !config.trends.fyYtd ? [] : config.baseFormat.l5_field ? calcYoyYtdSalesCol(l5_salesByFyYtdR, 'yoyYtdSales') : [] 

  /* % COMPANY SALES */
  const l0_percent_companySales = calcPercentSalesCol(companyTotalSalesR[0], l0_reportSales, 'percentCompanySales')
  const l1_percent_companySales = calcPercentSalesCol(companyTotalSalesR[0], l1_reportSales, 'percentCompanySales')
  const l2_percent_companySales = calcPercentSalesCol(companyTotalSalesR[0], l2_reportSales, 'percentCompanySales')
  const l3_percent_companySales = config.baseFormat.l3_field ? calcPercentSalesCol(companyTotalSalesR[0], l3_reportSales, 'percentCompanySales') : [] 
  const l4_percent_companySales = config.baseFormat.l4_field ? calcPercentSalesCol(companyTotalSalesR[0], l4_reportSales, 'percentCompanySales') : [] 
  const l5_percent_companySales = config.baseFormat.l5_field ? calcPercentSalesCol(companyTotalSalesR[0], l5_reportSales, 'percentCompanySales') : [] 

  /* % PROGRAM SALES */
  const l0_percent_programSales = !config.baseFilters.program ? [] : calcPercentSalesCol(programTotalSalesR[0], l0_reportSales, 'percentProgramSales')
  const l1_percent_programSales = !config.baseFilters.program ? [] : calcPercentSalesCol(programTotalSalesR[0], l1_reportSales, 'percentProgramSales')
  const l2_percent_programSales = !config.baseFilters.program ? [] : calcPercentSalesCol(programTotalSalesR[0], l2_reportSales, 'percentProgramSales')
  const l3_percent_programSales = !config.baseFilters.program || !config.baseFormat.l3_field ? [] : calcPercentSalesCol(programTotalSalesR[0], l3_reportSales, 'percentProgramSales')
  const l4_percent_programSales = !config.baseFilters.program || !config.baseFormat.l4_field ? [] : calcPercentSalesCol(programTotalSalesR[0], l4_reportSales, 'percentProgramSales') 
  const l5_percent_programSales = !config.baseFilters.program || !config.baseFormat.l5_field ? [] : calcPercentSalesCol(programTotalSalesR[0], l5_reportSales, 'percentProgramSales') 

  /* % SPECIES GROUP SALES */
  // look up species group based on program
  const l0_percent_speciesGroupSales = !config.baseFilters.program ? [] : calcPercentSalesCol(speciesGroupTotalSalesR[0], l0_reportSales, 'percentSpeciesGroupSales')
  const l1_percent_speciesGroupSales = !config.baseFilters.program ? [] : calcPercentSalesCol(speciesGroupTotalSalesR[0], l1_reportSales, 'percentSpeciesGroupSales') 
  const l2_percent_speciesGroupSales = !config.baseFilters.program ? [] : calcPercentSalesCol(speciesGroupTotalSalesR[0], l2_reportSales, 'percentSpeciesGroupSales') 
  const l3_percent_speciesGroupSales = !config.baseFilters.program || !config.baseFormat.l3_field ? [] : calcPercentSalesCol(speciesGroupTotalSalesR[0], l3_reportSales, 'percentSpeciesGroupSales')
  const l4_percent_speciesGroupSales = !config.baseFilters.program || !config.baseFormat.l4_field ? [] : calcPercentSalesCol(speciesGroupTotalSalesR[0], l4_reportSales, 'percentSpeciesGroupSales')
  const l5_percent_speciesGroupSales = !config.baseFilters.program || !config.baseFormat.l5_field ? [] : calcPercentSalesCol(speciesGroupTotalSalesR[0], l5_reportSales, 'percentSpeciesGroupSales')
 
  /* % REPORT TOTAL */
  const l0_percent_reportTotal = calcPercentSalesCol(l0_reportSales[0], l0_reportSales, 'percentReportTotal')
  const l1_percent_reportTotal = calcPercentSalesCol(l0_reportSales[0], l1_reportSales, 'percentReportTotal')
  const l2_percent_reportTotal = calcPercentSalesCol(l0_reportSales[0], l2_reportSales, 'percentReportTotal')
  const l3_percent_reportTotal = config.baseFormat.l3_field ? calcPercentSalesCol(l0_reportSales[0], l3_reportSales, 'percentReportTota') : [] 
  const l4_percent_reportTotal = config.baseFormat.l4_field ? calcPercentSalesCol(l0_reportSales[0], l4_reportSales, 'percentReportTota') : [] 
  const l5_percent_reportTotal = config.baseFormat.l5_field ? calcPercentSalesCol(l0_reportSales[0], l5_reportSales, 'percentReportTota') : [] 
  
  /* AVE WEEKLY SALES */
  const weeks = config.totals.endWeekPrimary - config.totals.startWeekPrimary + 1
  const l0_aveWeeklySales = calcAveWeeklySales(l0_reportSales, 'aveWeeklySales', weeks)
  const l1_aveWeeklySales = calcAveWeeklySales(l1_reportSales, 'aveWeeklySales', weeks)
  const l2_aveWeeklySales = calcAveWeeklySales(l2_reportSales, 'aveWeeklySales', weeks)
  const l3_aveWeeklySales = config.baseFormat.l3_field ? calcAveWeeklySales(l3_reportSales, 'aveWeeklySales', weeks) : []
  const l4_aveWeeklySales = config.baseFormat.l4_field ? calcAveWeeklySales(l4_reportSales, 'aveWeeklySales', weeks) : []
  const l5_aveWeeklySales = config.baseFormat.l5_field ? calcAveWeeklySales(l5_reportSales, 'aveWeeklySales', weeks) : []

  const l0_twoWkAveSales = calcAveWeeklySales(l0_trailingTwoWeekR, 'twoWkAveSales', 2)
  const l1_twoWkAveSales = calcAveWeeklySales(l1_trailingTwoWeekR, 'twoWkAveSales', 2)
  const l2_twoWkAveSales = calcAveWeeklySales(l2_trailingTwoWeekR, 'twoWkAveSales', 2)
  const l3_twoWkAveSales = config.baseFormat.l3_field ? calcAveWeeklySales(l3_trailingTwoWeekR, 'twoWkAveSales', 2) : []
  const l4_twoWkAveSales = config.baseFormat.l4_field ? calcAveWeeklySales(l4_trailingTwoWeekR, 'twoWkAveSales', 2) : []
  const l5_twoWkAveSales = config.baseFormat.l5_field ? calcAveWeeklySales(l5_trailingTwoWeekR, 'twoWkAveSales', 2) : []

  const l0_fourWkAveSales = calcAveWeeklySales(l0_trailingFourWeekR, 'fourWkAveSales', 4)
  const l1_fourWkAveSales = calcAveWeeklySales(l1_trailingFourWeekR, 'fourWkAveSales', 4)
  const l2_fourWkAveSales = calcAveWeeklySales(l2_trailingFourWeekR, 'fourWkAveSales', 4)
  const l3_fourWkAveSales = config.baseFormat.l3_field ? calcAveWeeklySales(l3_trailingFourWeekR, 'fourWkAveSales', 4) : []
  const l4_fourWkAveSales = config.baseFormat.l4_field ? calcAveWeeklySales(l4_trailingFourWeekR, 'fourWkAveSales', 4) : []
  const l5_fourWkAveSales = config.baseFormat.l5_field ? calcAveWeeklySales(l5_trailingFourWeekR, 'fourWkAveSales', 4) : []
  
  const l0_eightWkAveSales = calcAveWeeklySales(l0_trailingEightWeekR, 'eightWkAveSales', 8)
  const l1_eightWkAveSales = calcAveWeeklySales(l1_trailingEightWeekR, 'eightWkAveSales', 8)
  const l2_eightWkAveSales = calcAveWeeklySales(l2_trailingEightWeekR, 'eightWkAveSales', 8)
  const l3_eightWkAveSales = config.baseFormat.l3_field ? calcAveWeeklySales(l3_trailingEightWeekR, 'eightWkAveSales', 8) : []
  const l4_eightWkAveSales = config.baseFormat.l4_field ? calcAveWeeklySales(l4_trailingEightWeekR, 'eightWkAveSales', 8) : []
  const l5_eightWkAveSales = config.baseFormat.l5_field ? calcAveWeeklySales(l5_trailingEightWeekR, 'eightWkAveSales', 8) : []
  
  const l0_twelveWkAveSales = calcAveWeeklySales(l0_trailingTwelveWeekR, 'twelveWkAveSales', 12)
  const l1_twelveWkAveSales = calcAveWeeklySales(l1_trailingTwelveWeekR, 'twelveWkAveSales', 12)
  const l2_twelveWkAveSales = calcAveWeeklySales(l2_trailingTwelveWeekR, 'twelveWkAveSales', 12)
  const l3_twelveWkAveSales = config.baseFormat.l3_field ? calcAveWeeklySales(l3_trailingTwelveWeekR, 'twelveWkAveSales', 12) : []
  const l4_twelveWkAveSales = config.baseFormat.l4_field ? calcAveWeeklySales(l4_trailingTwelveWeekR, 'twelveWkAveSales', 12) : []
  const l5_twelveWkAveSales = config.baseFormat.l5_field ? calcAveWeeklySales(l5_trailingTwelveWeekR, 'twelveWkAveSales', 12) : []
  
  /* MOMENTUM */
  const l0_momentum = calcMomentum(l0_fourWkAveSales, l0_twelveWkAveSales, 'momentum')
  const l1_momentum = calcMomentum(l1_fourWkAveSales, l1_twelveWkAveSales, 'momentum')
  const l2_momentum = calcMomentum(l2_fourWkAveSales, l2_twelveWkAveSales, 'momentum')
  const l3_momentum = calcMomentum(l3_fourWkAveSales, l3_twelveWkAveSales, 'momentum')
  const l4_momentum = calcMomentum(l4_fourWkAveSales, l4_twelveWkAveSales, 'momentum')
  const l5_momentum = calcMomentum(l5_fourWkAveSales, l5_twelveWkAveSales, 'momentum')

  /* WEEKS INV ON HAND */
  const l0_weeksInvOnHand = calcWeeksInvOnHand(l0_fgInvenR, l0_aveWeeklySales, 'weeksInvenOnHand')
  const l1_weeksInvOnHand = calcWeeksInvOnHand(l1_fgInvenR, l1_aveWeeklySales, 'weeksInvenOnHand')
  const l2_weeksInvOnHand = calcWeeksInvOnHand(l2_fgInvenR, l2_aveWeeklySales, 'weeksInvenOnHand')
  const l3_weeksInvOnHand = config.baseFormat.l3_field ? calcWeeksInvOnHand(l3_fgInvenR, l3_aveWeeklySales, 'weeksInvenOnHand') : [] 
  const l4_weeksInvOnHand = config.baseFormat.l4_field ? calcWeeksInvOnHand(l4_fgInvenR, l4_aveWeeklySales, 'weeksInvenOnHand') : [] 
  const l5_weeksInvOnHand = config.baseFormat.l5_field ? calcWeeksInvOnHand(l5_fgInvenR, l5_aveWeeklySales, 'weeksInvenOnHand') : [] 
  
  /* INVENTORY AVAILABLE */
  const l0_invAvailable = calcInventoryAvailable(l0_fgInvenR, l0_fgPoR, l0_soR, 'invenAvailable')
  const l1_invAvailable = calcInventoryAvailable(l1_fgInvenR, l1_fgPoR, l1_soR, 'invenAvailable')
  const l2_invAvailable = calcInventoryAvailable(l2_fgInvenR, l2_fgPoR, l2_soR, 'invenAvailable')
  const l3_invAvailable = config.baseFormat.l3_field ? calcInventoryAvailable(l3_fgInvenR, l3_fgPoR, l3_soR, 'invenAvailable') : []
  const l4_invAvailable = config.baseFormat.l4_field ? calcInventoryAvailable(l4_fgInvenR, l4_fgPoR, l4_soR, 'invenAvailable') : []
  const l5_invAvailable = config.baseFormat.l5_field ? calcInventoryAvailable(l5_fgInvenR, l5_fgPoR, l5_soR, 'invenAvailable') : []

  ///////////////////////////////// ROWS
  const rowsFifthLevelDetail =  config.baseFormat.l5_field ? () => {return getRowsFifthLevelDetail(config)} : skip() 
  const rowsFourthLevelDetail =  config.baseFormat.l4_field ? () => {return getRowsFourthLevelDetail(config)} : skip() 
  const rowsThirdLevelDetail =  config.baseFormat.l3_field ? () => {return getRowsThirdLevelDetail(config)} : skip() 
  const rowsSecondLevelDetail = () => {return getRowsSecondLevelDetail(config)} 
  const rowsFirstLevelDetail = () => {return getRowsFirstLevelDetail(config)} 

  const [rowsFifthLevelDetailR, rowsFourthLevelDetailR, rowsThirdLevelDetailR, rowsSecondLevelDetailR, rowsFirstLevelDetailR] = await Promise.all([
    rowsFifthLevelDetail(),
    rowsFourthLevelDetail(),
    rowsThirdLevelDetail(),
    rowsSecondLevelDetail(),
    rowsFirstLevelDetail(),
  ])

  const totalsRow = [
    {
      totalRow: true,
      l1_label: `${config.baseFilters.itemType} SALES`,
      l2_label: 'TOTAL',
      l3_label: 'TOTAL',
      l4_label: 'TOTAL',
      l5_label: 'TOTAL',
      datalevel: 0,
      itemtype: config.baseFilters.itemType,
    },
  ]

  // COMPILE FINAL ROW TEMPLATE

  const rowTemplate = sortRowTemplate([...rowsFifthLevelDetailR, ...rowsFourthLevelDetailR, ...rowsThirdLevelDetailR, ...rowsSecondLevelDetailR, ...rowsFirstLevelDetailR])
  rowTemplate.push(...totalsRow)

  // map data into row template
  // Determine if 2 or 3 level report
  let mapSalesToRowTemplates = null
  let mapInvenToRowTemplates = null
  let rowTemplate_unflat = null
  let level = null
  if (!config.baseFormat.l3_field) {
    // 2 LEVEL REPORT
    mapSalesToRowTemplates = mapSalesToRowTemplates_twoLevel
    mapInvenToRowTemplates = mapInvenToRowTemplates_twoLevel
    rowTemplate_unflat = unflattenByCompositKey(rowTemplate, { 1: 'l1_label', 2: 'l2_label' }) 
    level = 2
  } else if (!config.baseFormat.l4_field) {
    // 3 LEVEL REPORT
    mapSalesToRowTemplates = mapSalesToRowTemplates_threeLevel
    mapInvenToRowTemplates = mapInvenToRowTemplates_threeLevel
    rowTemplate_unflat = unflattenByCompositKey(rowTemplate, { 1: 'l1_label', 2: 'l2_label', 3: 'l3_label' }) 
    level = 3
  } else if (!config.baseFormat.l5_field) {
    // 4 LEVEL REPORT
    mapSalesToRowTemplates = mapSalesToRowTemplates_fourLevel
    mapInvenToRowTemplates = mapInvenToRowTemplates_fourLevel
    rowTemplate_unflat = unflattenByCompositKey(rowTemplate, { 1: 'l1_label', 2: 'l2_label', 3: 'l3_label', 4: 'l4_label' }) 
    level = 4
  } else {
    // 5 LEVEL REPORT
    mapSalesToRowTemplates = mapSalesToRowTemplates_fiveLevel
    mapInvenToRowTemplates = mapInvenToRowTemplates_fiveLevel
    rowTemplate_unflat = unflattenByCompositKey(rowTemplate, { 1: 'l1_label', 2: 'l2_label', 3: 'l3_label', 4: 'l4_label', 5: 'l5_label' }) 
    level = 5
  }

  const mappedSales = mapSalesToRowTemplates(
    [
      ...l0_trailingFourWeekR,
      ...l1_trailingFourWeekR,
      ...l2_trailingFourWeekR,
      ...l3_trailingFourWeekR,
      ...l4_trailingFourWeekR,
      ...l5_trailingFourWeekR,
      ...l0_trailingTwelveWeekR,
      ...l1_trailingTwelveWeekR,
      ...l2_trailingTwelveWeekR,
      ...l3_trailingTwelveWeekR,
      ...l4_trailingTwelveWeekR,
      ...l5_trailingTwelveWeekR,
      ...l1_salesProjectionBywkR,
      ...l2_salesProjectionBywkR,
      ...l3_salesProjectionBywkR,
      ...l4_salesProjectionBywkR,
      ...l5_salesProjectionBywkR,
      ...l0_salesProjectionBywkR,
      ...l1_salesProjectionPeriodToDateR,
      ...l2_salesProjectionPeriodToDateR,
      ...l3_salesProjectionPeriodToDateR,
      ...l4_salesProjectionPeriodToDateR,
      ...l5_salesProjectionPeriodToDateR,
      ...l0_salesProjectionPeriodToDateR,
      ...l1_salesTrendR,
      ...l2_salesTrendR,
      ...l3_salesTrendR,
      ...l4_salesTrendR,
      ...l5_salesTrendR,
      ...l0_salesTrendR,
      ...l1_salesPeriodToDateR,
      ...l2_salesPeriodToDateR,
      ...l3_salesPeriodToDateR,
      ...l4_salesPeriodToDateR,
      ...l5_salesPeriodToDateR,
      ...l0_salesPeriodToDateR,
      ...l1_soR,
      ...l2_soR,
      ...l3_soR,
      ...l4_soR,
      ...l5_soR,
      ...l0_soR,
      ...l1_soTrendR,
      ...l2_soTrendR,
      ...l3_soTrendR,
      ...l4_soTrendR,
      ...l5_soTrendR,
      ...l0_soTrendR,
      // ...l1_soTaggedR,
      // ...l2_soTaggedR,
      // ...l3_soTaggedR,
      // ...l4_soTaggedR,
      // ...l5_soTaggedR,
      // ...l0_soTaggedR,
      // ...l1_soUntaggedR,
      // ...l2_soUntaggedR,
      // ...l3_soUntaggedR,
      // ...l4_soUntaggedR,
      // ...l5_soUntaggedR,
      // ...l0_soUntaggedR,
      // ...l1_soTaggedTrendR,
      // ...l2_soTaggedTrendR,
      // ...l3_soTaggedTrendR,
      // ...l4_soTaggedTrendR,
      // ...l5_soTaggedTrendR,
      // ...l0_soTaggedTrendR,
      // ...l1_soUntaggedTrendR,
      // ...l2_soUntaggedTrendR,
      // ...l3_soUntaggedTrendR,
      // ...l4_soUntaggedTrendR,
      // ...l5_soUntaggedTrendR,
      // ...l0_soUntaggedTrendR,
      ...l1_percent_companySales,
      ...l2_percent_companySales,
      ...l3_percent_companySales,
      ...l4_percent_companySales,
      ...l5_percent_companySales,
      ...l0_percent_companySales,
      ...l1_percent_programSales,
      ...l2_percent_programSales,
      ...l3_percent_programSales,
      ...l4_percent_programSales,
      ...l5_percent_programSales,
      ...l0_percent_programSales,
      ...l1_percent_speciesGroupSales,
      ...l2_percent_speciesGroupSales,
      ...l3_percent_speciesGroupSales,
      ...l4_percent_speciesGroupSales,
      ...l5_percent_speciesGroupSales,
      ...l0_percent_speciesGroupSales,
      ...l1_percent_reportTotal,
      ...l2_percent_reportTotal,
      ...l3_percent_reportTotal,
      ...l4_percent_reportTotal,
      ...l5_percent_reportTotal,
      ...l0_percent_reportTotal,
      ...l1_aveWeeklySales,
      ...l2_aveWeeklySales,
      ...l3_aveWeeklySales,
      ...l4_aveWeeklySales,
      ...l5_aveWeeklySales,
      ...l0_aveWeeklySales,
      ...l1_twoWkAveSales,
      ...l2_twoWkAveSales,
      ...l3_twoWkAveSales,
      ...l4_twoWkAveSales,
      ...l5_twoWkAveSales,
      ...l0_twoWkAveSales,
      ...l1_fourWkAveSales,
      ...l2_fourWkAveSales,
      ...l3_fourWkAveSales,
      ...l4_fourWkAveSales,
      ...l5_fourWkAveSales,
      ...l0_fourWkAveSales,
      ...l1_eightWkAveSales,
      ...l2_eightWkAveSales,
      ...l3_eightWkAveSales,
      ...l4_eightWkAveSales,
      ...l5_eightWkAveSales,
      ...l0_eightWkAveSales,
      ...l1_twelveWkAveSales,
      ...l2_twelveWkAveSales,
      ...l3_twelveWkAveSales,
      ...l4_twelveWkAveSales,
      ...l5_twelveWkAveSales,
      ...l0_twelveWkAveSales,
      ...l0_yoyYtd_companySales,
      ...l1_yoyYtd_companySales,
      ...l2_yoyYtd_companySales,
      ...l3_yoyYtd_companySales,
      ...l4_yoyYtd_companySales,
      ...l5_yoyYtd_companySales,
      ...l0_momentum,
      ...l1_momentum,
      ...l2_momentum,
      ...l3_momentum,
      ...l4_momentum,
      ...l5_momentum,
      
    ],
    rowTemplate_unflat
  )

  const mappedInven = mapInvenToRowTemplates(
    [
      ...l1_fgInvenR,
      ...l2_fgInvenR,
      ...l3_fgInvenR,
      ...l4_fgInvenR,
      ...l5_fgInvenR,
      ...l0_fgInvenR,
      ...l1_fgInTransitR,
      ...l2_fgInTransitR,
      ...l3_fgInTransitR,
      ...l4_fgInTransitR,
      ...l5_fgInTransitR,
      ...l0_fgInTransitR,
      ...l1_fgAtLocR,
      ...l2_fgAtLocR,
      ...l3_fgAtLocR,
      ...l4_fgAtLocR,
      ...l5_fgAtLocR,
      ...l0_fgAtLocR,
      ...l1_fgAtLoc_untaggedR,
      ...l2_fgAtLoc_untaggedR,
      ...l3_fgAtLoc_untaggedR,
      ...l4_fgAtLoc_untaggedR,
      ...l5_fgAtLoc_untaggedR,
      ...l0_fgAtLoc_untaggedR,
      // ...l1_fgAtLoc_taggedR,
      // ...l2_fgAtLoc_taggedR,
      // ...l3_fgAtLoc_taggedR,
      // ...l4_fgAtLoc_taggedR,
      // ...l5_fgAtLoc_taggedR,
      // ...l0_fgAtLoc_taggedR,
      ...l1_fgPoR,
      ...l2_fgPoR,
      ...l3_fgPoR,
      ...l4_fgPoR,
      ...l5_fgPoR,
      ...l0_fgPoR,
      ...l1_weeksInvOnHand,
      ...l2_weeksInvOnHand,
      ...l3_weeksInvOnHand,
      ...l4_weeksInvOnHand,
      ...l5_weeksInvOnHand,
      ...l0_weeksInvOnHand,
      ...l1_invAvailable,
      ...l2_invAvailable,
      ...l3_invAvailable,
      ...l4_invAvailable,
      ...l5_invAvailable,
      ...l0_invAvailable,
    ],
    rowTemplate_unflat
  )

  const mappedData = combineMappedRows(mappedSales, mappedInven)
  const flattenedMappedData = Object.values(mappedData)
  const data = cleanLabelsForDisplay(flattenedMappedData, config)

  /* Trend Columns */
  
  const trendColsSalesF = !config.trends.queryGrouping ? skip() : () => {return  getTrendColsSales(config)}
  const trendColsSaByFyYtdF = !config.trends.fyYtd && !config.trends.fyFullYear ? skip() : () => {return  getTrendColsFiscalYear(config)}
  const trendColsSalesProjF = !config.trends.useProjection ? skip() : () => {return  getDateEndPerWeekByRange_pj(config.totals.startDatePrimary, config.totals.endDatePrimary, config)}

  // get so by week cols
  const trendColsSoF = config.trends.queryGrouping ? () => {return  getTrendColsSo(config)} : skip() 
  const trendColsSo_tgF = () => {return  getDateEndPerWeekByRange_so_tg(config)}
  const trendColsSo_untgF = () => {return  getDateEndPerWeekByRange_so_untg(config)}


  // Call all column functions
  const [
    trendColsSalesProj, 
    trendColsSales, 
    trendColsSaByFyYtd, 
    trendColsSo, 
    // trendColsSo_tg, 
    // trendColsSo_untg,
  ] = await Promise.all([
    trendColsSalesProjF(), 
    trendColsSalesF(), 
    trendColsSaByFyYtdF(), 
    trendColsSoF(), 
    // trendColsSo_tgF(), 
    // trendColsSo_untgF(),
  ])
  
  let columnConfigsTagged = addDataToSalesTotalCol(config, columnConfigs) // adds statDate, endDate, and displayName to the sales totals col
  columnConfigsTagged = addDataToSoTotalCol(config, columnConfigs) // adds statDate, endDate, and displayName to the sales orders col

  
  // **** Note that this is where I should also add the identifying detail to the trend cols that is currently being handled in the trendColsAtom. *****

  return {
    data,
    cols: {
      trendColsSalesProj, 
      trendColsSales,
      trendColsSaByFyYtd,
      labelCols: config.labelCols,
      trendColsSo,
      // trendColsSo_tg,
      // trendColsSo_untg,
      columnConfigs: columnConfigsTagged,
      defaultTrend: {
        dataName: config.trends.useProjection ? columnConfigs.salesProjectionCol[0].dataName : columnConfigs.primarySalesTotalCol[0].dataName,
        colType: config.trends.useProjection ? columnConfigs.salesProjectionCol[0].colType : columnConfigs.primarySalesTotalCol[0].colType
      }
    },
  }
}

module.exports = buildReport
