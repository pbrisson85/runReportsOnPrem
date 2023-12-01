const {
  getDateEndPerFiscalPeriodByRange,
  getDateEndPerWeekByRange_pj,
  getDateEndPerWeekByRange_so,
  getDateEndPerWeekByRange_so_tg,
  getDateEndPerWeekByRange_so_untg,
} = require('../../../database/queries/postgres/getDateEndPerWeek')
const { getTrendColsCalMonths } = require('../../../database/queries/postgres/trendColHeadings/getTrendColsCalMonths')
const { getTrendColsWeeks } = require('../../../database/queries/postgres/trendColHeadings/getTrendColsWeeks')
const { getTrendColsFiscalPeriods } = require('../../../database/queries/postgres/trendColHeadings/getTrendColsFiscalPeriods')
const { getTrendColsFiscalQuarters } = require('../../../database/queries/postgres/trendColHeadings/getTrendColsFiscalQuarters')
const { getTrendColsFiscalYear } = require('../../../database/queries/postgres/trendColHeadings/getTrendColsFiscalYear')
const { getTrendColsSoByCalMonths } = require('../../../database/queries/postgres/trendColHeadings/getTrendColsFiscalYear')
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
  l1_getSalesByWk,
  l2_getSalesByWk,
  l3_getSalesByWk,
  l4_getSalesByWk,
  l5_getSalesByWk,
  l0_getSalesByWk,
  l1_getSalesTotalPrimary,
  l2_getSalesTotalPrimary,
  l3_getSalesTotalPrimary,
  l4_getSalesTotalPrimary,
  l5_getSalesTotalPrimary,
  l0_getSalesTotalPrimary,
  l0_getSalesByFiscalPeriod,
  l1_getSalesByFiscalPeriod,
  l2_getSalesByFiscalPeriod,
  l3_getSalesByFiscalPeriod,
  l4_getSalesByFiscalPeriod,
  l5_getSalesByFiscalPeriod
} = require('../../../database/queries/postgres/baseReport/getSalesTrendDateDriven')
const {
  l1_getSalesByCalMo,
  l2_getSalesByCalMo,
  l3_getSalesByCalMo,
  l4_getSalesByCalMo,
  l5_getSalesByCalMo,
  l0_getSalesByCalMo,
} = require('../../../database/queries/postgres/baseReport/getSalesTrendByCalMonth')
const {
  l1_getSalesByFiscalQuarter,
  l2_getSalesByFiscalQuarter,
  l3_getSalesByFiscalQuarter,
  l4_getSalesByFiscalQuarter,
  l5_getSalesByFiscalQuarter,
  l0_getSalesByFiscalQuarter,
} = require('../../../database/queries/postgres/baseReport/getSalesTrendByFiscalQuarters')
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
  l1_getSalesByFyYtd,
  l2_getSalesByFyYtd,
  l3_getSalesByFyYtd,
  l4_getSalesByFyYtd,
  l5_getSalesByFyYtd,
  l0_getSalesByFyYtd,
} = require('../../../database/queries/postgres/baseReport/getSalesTrendByFyYtd')
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
  l1_getSo_byWk,
  l2_getSo_byWk,
  l3_getSo_byWk,
  l4_getSo_byWk,
  l5_getSo_byWk,
  l0_getSo_byWk,
  l1_getSoTagged_byWk,
  l2_getSoTagged_byWk,
  l3_getSoTagged_byWk,
  l4_getSoTagged_byWk,
  l5_getSoTagged_byWk,
  l0_getSoTagged_byWk,
  l1_getSoUntagged_byWk,
  l2_getSoUntagged_byWk,
  l3_getSoUntagged_byWk,
  l4_getSoUntagged_byWk,
  l5_getSoUntagged_byWk,
  l0_getSoUntagged_byWk,
} = require('../../../database/queries/postgres/baseReport/getSoByWeek')
const {
  l1_getSo_byCalMo,
  l2_getSo_byCalMo,
  l3_getSo_byCalMo,
  l4_getSo_byCalMo,
  l5_getSo_byCalMo,
  l0_getSo_byCalMo,
} = require('../../../database/queries/postgres/baseReport/getSoByCalMonth')
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
const addDataToSalesTotalCol = require('../../../models/addDataToSalesTotalCol')

const buildReport = async (config, labelCols) => {
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
  const l3_fgInven = config.l3_field ? () => {return l3_getFgInven(config)}: skip() 
  const l4_fgInven = config.l4_field ? () => {return l4_getFgInven(config)}: skip() 
  const l5_fgInven = config.l5_field ? () => {return l5_getFgInven(config)}: skip() 

  /* FG IN TRANSIT*/
  const l0_fgInTransit = () => {return l0_getFgInTransit(config)}
  const l1_fgInTransit = () => {return l1_getFgInTransit(config)}
  const l2_fgInTransit = () => {return l2_getFgInTransit(config)}
  const l3_fgInTransit =  config.l3_field ? () => {return l3_getFgInTransit(config)} : skip()
  const l4_fgInTransit =  config.l4_field ? () => {return l4_getFgInTransit(config)} : skip()
  const l5_fgInTransit =  config.l5_field ? () => {return l5_getFgInTransit(config)} : skip()

  /* FG ON HAND (LESS IN TRANSIT) */
  const l0_fgAtLoc = () => {return l0_getFgAtLoc(config)}
  const l1_fgAtLoc = () => {return l1_getFgAtLoc(config)}
  const l2_fgAtLoc = () => {return l2_getFgAtLoc(config)}
  const l3_fgAtLoc =  config.l3_field ? () => {return l3_getFgAtLoc(config)} : skip()
  const l4_fgAtLoc =  config.l4_field ? () => {return l4_getFgAtLoc(config)} : skip()
  const l5_fgAtLoc =  config.l5_field ? () => {return l5_getFgAtLoc(config)} : skip()

  /* FG ON HAND UNTAGGED */
  const l0_fgAtLoc_untagged = () => {return l0_getFgAtLoc_untagged(config)}
  const l1_fgAtLoc_untagged = () => {return l1_getFgAtLoc_untagged(config)}
  const l2_fgAtLoc_untagged = () => {return l2_getFgAtLoc_untagged(config)}
  const l3_fgAtLoc_untagged =  config.l3_field ? () => {return l3_getFgAtLoc_untagged(config)} : skip()
  const l4_fgAtLoc_untagged =  config.l4_field ? () => {return l4_getFgAtLoc_untagged(config)} : skip()
  const l5_fgAtLoc_untagged =  config.l5_field ? () => {return l5_getFgAtLoc_untagged(config)} : skip()

  /* FG ON HAND TAGGED */
  // const l0_fgAtLoc_tagged = () => {return l0_getFgAtLoc_tagged(config)}
  // const l1_fgAtLoc_tagged = () => {return l1_getFgAtLoc_tagged(config)}
  // const l2_fgAtLoc_tagged = () => {return l2_getFgAtLoc_tagged(config)}
  // const l3_fgAtLoc_tagged =  config.l3_field ? () => {return l3_getFgAtLoc_tagged(config)}:skip()
  // const l4_fgAtLoc_tagged =  config.l4_field ? () => {return l4_getFgAtLoc_tagged(config)}:skip()
  // const l5_fgAtLoc_tagged =  config.l5_field ? () => {return l5_getFgAtLoc_tagged(config)}:skip()

  /* FG ON ORDER */
  const l0_fgPo = () => {return l0_getFgPo(config)}
  const l1_fgPo = () => {return l1_getFgPo(config)}
  const l2_fgPo = () => {return l2_getFgPo(config)}
  const l3_fgPo =  config.l3_field ? () => {return l3_getFgPo(config)} : skip()
  const l4_fgPo =  config.l4_field ? () => {return l4_getFgPo(config)} : skip()
  const l5_fgPo =  config.l5_field ? () => {return l5_getFgPo(config)} : skip()
  
  // ///////////////////////////////// SALES ORDERS
  /* ALL SO */
  const l0_so = () => {return l0_getSo(config)}
  const l1_so = () => {return l1_getSo(config)}
  const l2_so = () => {return l2_getSo(config)}
  const l3_so =  config.l3_field ? () => {return l3_getSo(config)} : skip()
  const l4_so =  config.l4_field ? () => {return l4_getSo(config)} : skip()
  const l5_so =  config.l5_field ? () => {return l5_getSo(config)} : skip()
  
  const l0_so_byWk = !config.trends.fiscalWeeks ? skip() : () => {return l0_getSo_byWk(config)}
  const l1_so_byWk = !config.trends.fiscalWeeks ? skip() : () => {return l1_getSo_byWk(config)}
  const l2_so_byWk = !config.trends.fiscalWeeks ? skip() : () => {return l2_getSo_byWk(config)}
  const l3_so_byWk = !config.trends.fiscalWeeks ? skip() : config.l3_field ? () => {return l3_getSo_byWk(config)} : skip()
  const l4_so_byWk = !config.trends.fiscalWeeks ? skip() : config.l4_field ? () => {return l4_getSo_byWk(config)} : skip()
  const l5_so_byWk = !config.trends.fiscalWeeks ? skip() : config.l5_field ? () => {return l5_getSo_byWk(config)} : skip()
  
  const l0_so_byCalMo = !config.trends.calMonths ? skip() : () => {return l0_getSo_byCalMo(config)}
  const l1_so_byCalMo = !config.trends.calMonths ? skip() : () => {return l1_getSo_byCalMo(config)}
  const l2_so_byCalMo = !config.trends.calMonths ? skip() : () => {return l2_getSo_byCalMo(config)}
  const l3_so_byCalMo = !config.trends.calMonths ? skip() : config.l3_field ? () => {return l3_getSo_byCalMo(config)} : skip()
  const l4_so_byCalMo = !config.trends.calMonths ? skip() : config.l4_field ? () => {return l4_getSo_byCalMo(config)} : skip()
  const l5_so_byCalMo = !config.trends.calMonths ? skip() : config.l5_field ? () => {return l5_getSo_byCalMo(config)} : skip()

  /* TAGGED SO */
  // const l0_soTagged = () => {return l0_getSoTagged(config)}
  // const l1_soTagged = () => {return l1_getSoTagged(config)}
  // const l2_soTagged = () => {return l2_getSoTagged(config)}
  // const l3_soTagged =  config.l3_field ? () => {return l3_getSoTagged(config)}:skip()
  // const l4_soTagged =  config.l4_field ? () => {return l4_getSoTagged(config)}:skip()
  // const l5_soTagged =  config.l5_field ? () => {return l5_getSoTagged(config)}:skip()

  // const l0_soTagged_byWk = () => {return l0_getSoTagged_byWk(config)}
  // const l1_soTagged_byWk = () => {return l1_getSoTagged_byWk(config)}
  // const l2_soTagged_byWk = () => {return l2_getSoTagged_byWk(config)}
  // const l3_soTagged_byWk =  config.l3_field ? () => {return l3_getSoTagged_byWk(config)}:skip()
  // const l4_soTagged_byWk =  config.l4_field ? () => {return l4_getSoTagged_byWk(config)}:skip()
  // const l5_soTagged_byWk =  config.l5_field ? () => {return l5_getSoTagged_byWk(config)}:skip()

  /* UNTAGGED SO */
  // const l0_soUntagged = () => {return l0_getSoUntagged(config)}
  // const l1_soUntagged = () => {return l1_getSoUntagged(config)}
  // const l2_soUntagged = () => {return l2_getSoUntagged(config)}
  // const l3_soUntagged =  config.l3_field ? () => {return l3_getSoUntagged(config)} : skip()
  // const l4_soUntagged =  config.l4_field ? () => {return l4_getSoUntagged(config)} : skip()
  // const l5_soUntagged =  config.l5_field ? () => {return l5_getSoUntagged(config)} : skip()

  // const l0_soUntagged_byWk = () => {return l0_getSoUntagged_byWk(config)}
  // const l1_soUntagged_byWk = () => {return l1_getSoUntagged_byWk(config)}
  // const l2_soUntagged_byWk = () => {return l2_getSoUntagged_byWk(config)}
  // const l3_soUntagged_byWk =  config.l3_field ? () => {return l3_getSoUntagged_byWk(config)} : skip()
  // const l4_soUntagged_byWk =  config.l4_field ? () => {return l4_getSoUntagged_byWk(config)} : skip()
  // const l5_soUntagged_byWk =  config.l5_field ? () => {return l5_getSoUntagged_byWk(config)} : skip()

  // ///////////////////////////////// SALES DATA

  /*SALES PROJECTIONS*/
  const l0_salesProjectionByWk = !config.trends.useProjection ? skip() : () => {return l0_getSalesProjectionByWk(config, config.totals.startDatePrimary, config.totals.endDatePrimary)}
  const l1_salesProjectionByWk = !config.trends.useProjection ? skip() : () => {return l1_getSalesProjectionByWk(config, config.totals.startDatePrimary, config.totals.endDatePrimary)}
  const l2_salesProjectionByWk = !config.trends.useProjection ? skip() : () => {return l2_getSalesProjectionByWk(config, config.totals.startDatePrimary, config.totals.endDatePrimary)}
  const l3_salesProjectionByWk = !config.trends.useProjection ? skip() : config.l3_field ? () => {return l3_getSalesProjectionByWk(config, config.totals.startDatePrimary, config.totals.endDatePrimary)} : skip()
  const l4_salesProjectionByWk = !config.trends.useProjection ? skip() : config.l4_field ? () => {return l4_getSalesProjectionByWk(config, config.totals.startDatePrimary, config.totals.endDatePrimary)} : skip()
  const l5_salesProjectionByWk = !config.trends.useProjection ? skip() : config.l5_field ? () => {return l5_getSalesProjectionByWk(config, config.totals.startDatePrimary, config.totals.endDatePrimary)} : skip()

  const l0_salesProjectionPeriodToDate = !config.totals.useProjection ? skip() : () => {return l0_getSalesProjectionPeriodToDate(config, config.totals.startDatePrimary, config.totals.endDatePrimary)}
  const l1_salesProjectionPeriodToDate = !config.totals.useProjection ? skip() : () => {return l1_getSalesProjectionPeriodToDate(config, config.totals.startDatePrimary, config.totals.endDatePrimary)}
  const l2_salesProjectionPeriodToDate = !config.totals.useProjection ? skip() : () => {return l2_getSalesProjectionPeriodToDate(config, config.totals.startDatePrimary, config.totals.endDatePrimary)}
  const l3_salesProjectionPeriodToDate = !config.totals.useProjection ? skip() : config.l3_field ? () => {return l3_getSalesProjectionPeriodToDate(config, config.totals.startDatePrimary, config.totals.endDatePrimary)} : skip()
  const l4_salesProjectionPeriodToDate = !config.totals.useProjection ? skip() : config.l4_field ? () => {return l4_getSalesProjectionPeriodToDate(config, config.totals.startDatePrimary, config.totals.endDatePrimary)} : skip()
  const l5_salesProjectionPeriodToDate = !config.totals.useProjection ? skip() : config.l5_field ? () => {return l5_getSalesProjectionPeriodToDate(config, config.totals.startDatePrimary, config.totals.endDatePrimary)} : skip()

  /*SALES*/

  const l0_salesTotalPrimary =  () => {return l0_getSalesTotalPrimary(config)}
  const l1_salesTotalPrimary =  () => {return l1_getSalesTotalPrimary(config)}
  const l2_salesTotalPrimary =  () => {return l2_getSalesTotalPrimary(config)}
  const l3_salesTotalPrimary =  config.l3_field ? () => {return l3_getSalesTotalPrimary(config)} : skip()
  const l4_salesTotalPrimary =  config.l4_field ? () => {return l4_getSalesTotalPrimary(config)} : skip()
  const l5_salesTotalPrimary =  config.l5_field ? () => {return l5_getSalesTotalPrimary(config)} : skip()
  
  // TRENDS
  const l0_salesByCalMo = !config.trends.calMonths ? skip() : () => {return l0_getSalesByCalMo(config)}
  const l1_salesByCalMo = !config.trends.calMonths ? skip() : () => {return l1_getSalesByCalMo(config)}
  const l2_salesByCalMo = !config.trends.calMonths ? skip() : () => {return l2_getSalesByCalMo(config)}
  const l3_salesByCalMo = !config.trends.calMonths ? skip() : config.l3_field ? () => {return l3_getSalesByCalMo(config)} : skip()
  const l4_salesByCalMo = !config.trends.calMonths ? skip() : config.l4_field ? () => {return l4_getSalesByCalMo(config)} : skip()
  const l5_salesByCalMo = !config.trends.calMonths ? skip() : config.l5_field ? () => {return l5_getSalesByCalMo(config)} : skip()

  const l0_salesByFiscalQuarter = !config.trends.fiscalQuarters ? skip() : () => {return l0_getSalesByFiscalQuarter(config)}
  const l1_salesByFiscalQuarter = !config.trends.fiscalQuarters ? skip() : () => {return l1_getSalesByFiscalQuarter(config)}
  const l2_salesByFiscalQuarter = !config.trends.fiscalQuarters ? skip() : () => {return l2_getSalesByFiscalQuarter(config)}
  const l3_salesByFiscalQuarter = !config.trends.fiscalQuarters ? skip() : config.l3_field ? () => {return l3_getSalesByFiscalQuarter(config)} : skip()
  const l4_salesByFiscalQuarter = !config.trends.fiscalQuarters ? skip() : config.l4_field ? () => {return l4_getSalesByFiscalQuarter(config)} : skip()
  const l5_salesByFiscalQuarter = !config.trends.fiscalQuarters ? skip() : config.l5_field ? () => {return l5_getSalesByFiscalQuarter(config)} : skip()

  const l0_salesByFy = !config.trends.fyFullYear ? skip() : () => {return l0_getSalesByFyYtd(config)}
  const l1_salesByFy = !config.trends.fyFullYear ? skip() : () => {return l1_getSalesByFyYtd(config)}
  const l2_salesByFy = !config.trends.fyFullYear ? skip() : () => {return l2_getSalesByFyYtd(config)}
  const l3_salesByFy = !config.trends.fyFullYear ? skip() : config.l3_field ? () => {return l3_getSalesByFyYtd(config)} : skip()
  const l4_salesByFy = !config.trends.fyFullYear ? skip() : config.l4_field ? () => {return l4_getSalesByFyYtd(config)} : skip()
  const l5_salesByFy = !config.trends.fyFullYear ? skip() : config.l5_field ? () => {return l5_getSalesByFyYtd(config)} : skip()

  const l0_salesByFyYtd = !config.trends.fyYtd ? skip() : () => {return l0_getSalesByFyYtd(config)}
  const l1_salesByFyYtd = !config.trends.fyYtd ? skip() : () => {return l1_getSalesByFyYtd(config)}
  const l2_salesByFyYtd = !config.trends.fyYtd ? skip() : () => {return l2_getSalesByFyYtd(config)}
  const l3_salesByFyYtd = !config.trends.fyYtd ? skip() : config.l3_field ? () => {return l3_getSalesByFyYtd(config)} : skip()
  const l4_salesByFyYtd = !config.trends.fyYtd ? skip() : config.l4_field ? () => {return l4_getSalesByFyYtd(config)} : skip()
  const l5_salesByFyYtd = !config.trends.fyYtd ? skip() : config.l5_field ? () => {return l5_getSalesByFyYtd(config)} : skip()

  const l0_salesByWk = !config.trends.fiscalWeeks ? skip() : () => {return l0_getSalesByWk(config)}
  const l1_salesByWk = !config.trends.fiscalWeeks ? skip() : () => {return l1_getSalesByWk(config)}
  const l2_salesByWk = !config.trends.fiscalWeeks ? skip() : () => {return l2_getSalesByWk(config)}
  const l3_salesByWk = !config.trends.fiscalWeeks ? skip() : config.l3_field ? () => {return l3_getSalesByWk(config)} : skip()
  const l4_salesByWk = !config.trends.fiscalWeeks ? skip() : config.l4_field ? () => {return l4_getSalesByWk(config)} : skip()
  const l5_salesByWk = !config.trends.fiscalWeeks ? skip() : config.l5_field ? () => {return l5_getSalesByWk(config)} : skip()

  const l0_salesByFiscalPeriod = !config.trends.fiscalPeriods ? skip() : () => {return l0_getSalesByFiscalPeriod(config)}
  const l1_salesByFiscalPeriod = !config.trends.fiscalPeriods ? skip() : () => {return l1_getSalesByFiscalPeriod(config)}
  const l2_salesByFiscalPeriod = !config.trends.fiscalPeriods ? skip() : () => {return l2_getSalesByFiscalPeriod(config)}
  const l3_salesByFiscalPeriod = !config.trends.fiscalPeriods ? skip() : config.l3_field ? () => {return l3_getSalesByFiscalPeriod(config)} : skip()
  const l4_salesByFiscalPeriod = !config.trends.fiscalPeriods ? skip() : config.l4_field ? () => {return l4_getSalesByFiscalPeriod(config)} : skip()
  const l5_salesByFiscalPeriod = !config.trends.fiscalPeriods ? skip() : config.l5_field ? () => {return l5_getSalesByFiscalPeriod(config)} : skip()

  /*  */

  const [
    l0_salesByFiscalQuarterR,
    l1_salesByFiscalQuarterR,
    l2_salesByFiscalQuarterR,
    l3_salesByFiscalQuarterR,
    l4_salesByFiscalQuarterR,
    l5_salesByFiscalQuarterR,
    l0_salesByFiscalPeriodR,
    l1_salesByFiscalPeriodR,
    l2_salesByFiscalPeriodR,
    l3_salesByFiscalPeriodR,
    l4_salesByFiscalPeriodR,
    l5_salesByFiscalPeriodR,
    l0_salesByCalMoR,
    l1_salesByCalMoR,
    l2_salesByCalMoR,
    l3_salesByCalMoR,
    l4_salesByCalMoR,
    l5_salesByCalMoR,
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
    l1_so_byCalMoR,
    l2_so_byCalMoR,
    l3_so_byCalMoR,
    l4_so_byCalMoR,
    l5_so_byCalMoR,
    l0_so_byCalMoR,

    l1_so_byWkR,
    l2_so_byWkR,
    l3_so_byWkR,
    l4_so_byWkR,
    l5_so_byWkR,
    l0_so_byWkR,
    // l1_soTaggedR,
    // l2_soTaggedR,
    // l3_soTaggedR,
    // l4_soTaggedR,
    // l5_soTaggedR,
    // l0_soTaggedR,
    // l1_soTagged_byWkR,
    // l2_soTagged_byWkR,
    // l3_soTagged_byWkR,
    // l4_soTagged_byWkR,
    // l5_soTagged_byWkR,
    // l0_soTagged_byWkR,
    // l1_soUntaggedR,
    // l2_soUntaggedR,
    // l3_soUntaggedR,
    // l4_soUntaggedR,
    // l5_soUntaggedR,
    // l0_soUntaggedR,
    // l1_soUntagged_byWkR,
    // l2_soUntagged_byWkR,
    // l3_soUntagged_byWkR,
    // l4_soUntagged_byWkR,
    // l5_soUntagged_byWkR,
    // l0_soUntagged_byWkR,
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
    l1_salesByFyR,
    l2_salesByFyR,
    l3_salesByFyR,
    l4_salesByFyR,
    l5_salesByFyR,
    l0_salesByFyR,
    l1_salesByFyYtdR,
    l2_salesByFyYtdR,
    l3_salesByFyYtdR,
    l4_salesByFyYtdR,
    l5_salesByFyYtdR,
    l0_salesByFyYtdR,
    l1_salesByWkR,
    l2_salesByWkR,
    l3_salesByWkR,
    l4_salesByWkR,
    l5_salesByWkR,
    l0_salesByWkR,
    l1_salesPeriodToDateR,
    l2_salesPeriodToDateR,
    l3_salesPeriodToDateR,
    l4_salesPeriodToDateR,
    l5_salesPeriodToDateR,
    l0_salesPeriodToDateR,
  ] = await Promise.all([
    l0_salesByFiscalQuarter(),  
    l1_salesByFiscalQuarter(),
    l2_salesByFiscalQuarter(),
    l3_salesByFiscalQuarter(),
    l4_salesByFiscalQuarter(),
    l5_salesByFiscalQuarter(),
    l0_salesByFiscalPeriod(),
    l1_salesByFiscalPeriod(),
    l2_salesByFiscalPeriod(),
    l3_salesByFiscalPeriod(),
    l4_salesByFiscalPeriod(),
    l5_salesByFiscalPeriod(),
    l0_salesByCalMo(),
    l1_salesByCalMo(),
    l2_salesByCalMo(),
    l3_salesByCalMo(),
    l4_salesByCalMo(),
    l5_salesByCalMo(),
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

    l1_so_byCalMo(),
    l2_so_byCalMo(),
    l3_so_byCalMo(),
    l4_so_byCalMo(),
    l5_so_byCalMo(),
    l0_so_byCalMo(),

    l1_so_byWk(),
    l2_so_byWk(),
    l3_so_byWk(),
    l4_so_byWk(),
    l5_so_byWk(),
    l0_so_byWk(),
    // l1_soTagged(),
    // l2_soTagged(),
    // l3_soTagged(),
    // l4_soTagged(),
    // l5_soTagged(),
    // l0_soTagged(),
    // l1_soTagged_byWk(),
    // l2_soTagged_byWk(),
    // l3_soTagged_byWk(),
    // l4_soTagged_byWk(),
    // l5_soTagged_byWk(),
    // l0_soTagged_byWk(),
    // l1_soUntagged(),
    // l2_soUntagged(),
    // l3_soUntagged(),
    // l4_soUntagged(),
    // l5_soUntagged(),
    // l0_soUntagged(),
    // l1_soUntagged_byWk(),
    // l2_soUntagged_byWk(),
    // l3_soUntagged_byWk(),
    // l4_soUntagged_byWk(),
    // l5_soUntagged_byWk(),
    // l0_soUntagged_byWk(),
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
    l1_salesByFy(),
    l2_salesByFy(),
    l3_salesByFy(),
    l4_salesByFy(),
    l5_salesByFy(),
    l0_salesByFy(),
    l1_salesByFyYtd(),
    l2_salesByFyYtd(),
    l3_salesByFyYtd(),
    l4_salesByFyYtd(),
    l5_salesByFyYtd(),
    l0_salesByFyYtd(),
    l1_salesByWk(),
    l2_salesByWk(),
    l3_salesByWk(),
    l4_salesByWk(),
    l5_salesByWk(),
    l0_salesByWk(),
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
  const l3_trailingTwoWeek = config.totals.endWeekPrimary < 2 ? skip() : config.l3_field ? () => {return l3_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')} : skip() 
  const l4_trailingTwoWeek = config.totals.endWeekPrimary < 2 ? skip() : config.l4_field ? () => {return l4_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')} : skip() 
  const l5_trailingTwoWeek = config.totals.endWeekPrimary < 2 ? skip() : config.l5_field ? () => {return l5_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')} : skip() 
  
  const l0_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : () => {return l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')}
  const l1_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : () => {return l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')}
  const l2_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : () => {return l2_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')}
  const l3_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : config.l3_field ? () => {return l3_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')} : skip() 
  const l4_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : config.l4_field ? () => {return l4_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')} : skip() 
  const l5_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : config.l5_field ? () => {return l5_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')} : skip() 

  const l0_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : () => {return l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')}
  const l1_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : () => {return l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')}
  const l2_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : () => {return l2_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')}
  const l3_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : config.l3_field ? () => {return l3_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')} : skip() 
  const l4_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : config.l4_field ? () => {return l4_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')} : skip() 
  const l5_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : config.l5_field ? () => {return l5_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')} : skip() 

  const l0_trailingTwelveWeek = config.totals.endWeekPrimary < 12 ? skip() : () => {return l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')}
  const l1_trailingTwelveWeek = config.totals.endWeekPrimary < 12 ? skip() : () => {return l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')}
  const l2_trailingTwelveWeek = config.totals.endWeekPrimary < 12 ? skip() : () => {return l2_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')}
  const l3_trailingTwelveWeek = config.totals.endWeekPrimary < 12 ? skip() : config.l3_field ? () => {return l3_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')} : skip() 
  const l4_trailingTwelveWeek = config.totals.endWeekPrimary < 12  ? skip() : config.l4_field ? () => {return l4_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')} : skip() 
  const l5_trailingTwelveWeek = config.totals.endWeekPrimary < 12  ? skip() : config.l5_field ? () => {return l5_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')} : skip() 
  
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
  const l3_yoyYtd_companySales = !config.trends.fyYtd ? [] : config.l3_field ? calcYoyYtdSalesCol(l3_salesByFyYtdR, 'yoyYtdSales') : [] 
  const l4_yoyYtd_companySales = !config.trends.fyYtd ? [] : config.l4_field ? calcYoyYtdSalesCol(l4_salesByFyYtdR, 'yoyYtdSales') : [] 
  const l5_yoyYtd_companySales = !config.trends.fyYtd ? [] : config.l5_field ? calcYoyYtdSalesCol(l5_salesByFyYtdR, 'yoyYtdSales') : [] 

  /* % COMPANY SALES */
  const l0_percent_companySales = calcPercentSalesCol(companyTotalSalesR[0], l0_reportSales, 'percentCompanySales')
  const l1_percent_companySales = calcPercentSalesCol(companyTotalSalesR[0], l1_reportSales, 'percentCompanySales')
  const l2_percent_companySales = calcPercentSalesCol(companyTotalSalesR[0], l2_reportSales, 'percentCompanySales')
  const l3_percent_companySales = config.l3_field ? calcPercentSalesCol(companyTotalSalesR[0], l3_reportSales, 'percentCompanySales') : [] 
  const l4_percent_companySales = config.l4_field ? calcPercentSalesCol(companyTotalSalesR[0], l4_reportSales, 'percentCompanySales') : [] 
  const l5_percent_companySales = config.l5_field ? calcPercentSalesCol(companyTotalSalesR[0], l5_reportSales, 'percentCompanySales') : [] 

  /* % PROGRAM SALES */
  const l0_percent_programSales = !config.program ? [] : calcPercentSalesCol(programTotalSalesR[0], l0_reportSales, 'percentProgramSales')
  const l1_percent_programSales = !config.program ? [] : calcPercentSalesCol(programTotalSalesR[0], l1_reportSales, 'percentProgramSales')
  const l2_percent_programSales = !config.program ? [] : calcPercentSalesCol(programTotalSalesR[0], l2_reportSales, 'percentProgramSales')
  const l3_percent_programSales = !config.program || !config.l3_field ? [] : calcPercentSalesCol(programTotalSalesR[0], l3_reportSales, 'percentProgramSales')
  const l4_percent_programSales = !config.program || !config.l4_field ? [] : calcPercentSalesCol(programTotalSalesR[0], l4_reportSales, 'percentProgramSales') 
  const l5_percent_programSales = !config.program || !config.l5_field ? [] : calcPercentSalesCol(programTotalSalesR[0], l5_reportSales, 'percentProgramSales') 

  /* % SPECIES GROUP SALES */
  // look up species group based on program
  const l0_percent_speciesGroupSales = !config.program ? [] : calcPercentSalesCol(speciesGroupTotalSalesR[0], l0_reportSales, 'percentSpeciesGroupSales')
  const l1_percent_speciesGroupSales = !config.program ? [] : calcPercentSalesCol(speciesGroupTotalSalesR[0], l1_reportSales, 'percentSpeciesGroupSales') 
  const l2_percent_speciesGroupSales = !config.program ? [] : calcPercentSalesCol(speciesGroupTotalSalesR[0], l2_reportSales, 'percentSpeciesGroupSales') 
  const l3_percent_speciesGroupSales = !config.program || !config.l3_field ? [] : calcPercentSalesCol(speciesGroupTotalSalesR[0], l3_reportSales, 'percentSpeciesGroupSales')
  const l4_percent_speciesGroupSales = !config.program || !config.l4_field ? [] : calcPercentSalesCol(speciesGroupTotalSalesR[0], l4_reportSales, 'percentSpeciesGroupSales')
  const l5_percent_speciesGroupSales = !config.program || !config.l5_field ? [] : calcPercentSalesCol(speciesGroupTotalSalesR[0], l5_reportSales, 'percentSpeciesGroupSales')
 
  /* % REPORT TOTAL */
  const l0_percent_reportTotal = calcPercentSalesCol(l0_reportSales[0], l0_reportSales, 'percentReportTotal')
  const l1_percent_reportTotal = calcPercentSalesCol(l0_reportSales[0], l1_reportSales, 'percentReportTotal')
  const l2_percent_reportTotal = calcPercentSalesCol(l0_reportSales[0], l2_reportSales, 'percentReportTotal')
  const l3_percent_reportTotal = config.l3_field ? calcPercentSalesCol(l0_reportSales[0], l3_reportSales, 'percentReportTota') : [] 
  const l4_percent_reportTotal = config.l4_field ? calcPercentSalesCol(l0_reportSales[0], l4_reportSales, 'percentReportTota') : [] 
  const l5_percent_reportTotal = config.l5_field ? calcPercentSalesCol(l0_reportSales[0], l5_reportSales, 'percentReportTota') : [] 
  
  /* AVE WEEKLY SALES */
  const weeks = config.totals.endWeekPrimary - config.totals.startWeekPrimary + 1
  const l0_aveWeeklySales = calcAveWeeklySales(l0_reportSales, 'aveWeeklySales', weeks)
  const l1_aveWeeklySales = calcAveWeeklySales(l1_reportSales, 'aveWeeklySales', weeks)
  const l2_aveWeeklySales = calcAveWeeklySales(l2_reportSales, 'aveWeeklySales', weeks)
  const l3_aveWeeklySales = config.l3_field ? calcAveWeeklySales(l3_reportSales, 'aveWeeklySales', weeks) : []
  const l4_aveWeeklySales = config.l4_field ? calcAveWeeklySales(l4_reportSales, 'aveWeeklySales', weeks) : []
  const l5_aveWeeklySales = config.l5_field ? calcAveWeeklySales(l5_reportSales, 'aveWeeklySales', weeks) : []

  const l0_twoWkAveSales = calcAveWeeklySales(l0_trailingTwoWeekR, 'twoWkAveSales', 2)
  const l1_twoWkAveSales = calcAveWeeklySales(l1_trailingTwoWeekR, 'twoWkAveSales', 2)
  const l2_twoWkAveSales = calcAveWeeklySales(l2_trailingTwoWeekR, 'twoWkAveSales', 2)
  const l3_twoWkAveSales = config.l3_field ? calcAveWeeklySales(l3_trailingTwoWeekR, 'twoWkAveSales', 2) : []
  const l4_twoWkAveSales = config.l4_field ? calcAveWeeklySales(l4_trailingTwoWeekR, 'twoWkAveSales', 2) : []
  const l5_twoWkAveSales = config.l5_field ? calcAveWeeklySales(l5_trailingTwoWeekR, 'twoWkAveSales', 2) : []

  const l0_fourWkAveSales = calcAveWeeklySales(l0_trailingFourWeekR, 'fourWkAveSales', 4)
  const l1_fourWkAveSales = calcAveWeeklySales(l1_trailingFourWeekR, 'fourWkAveSales', 4)
  const l2_fourWkAveSales = calcAveWeeklySales(l2_trailingFourWeekR, 'fourWkAveSales', 4)
  const l3_fourWkAveSales = config.l3_field ? calcAveWeeklySales(l3_trailingFourWeekR, 'fourWkAveSales', 4) : []
  const l4_fourWkAveSales = config.l4_field ? calcAveWeeklySales(l4_trailingFourWeekR, 'fourWkAveSales', 4) : []
  const l5_fourWkAveSales = config.l5_field ? calcAveWeeklySales(l5_trailingFourWeekR, 'fourWkAveSales', 4) : []
  
  const l0_eightWkAveSales = calcAveWeeklySales(l0_trailingEightWeekR, 'eightWkAveSales', 8)
  const l1_eightWkAveSales = calcAveWeeklySales(l1_trailingEightWeekR, 'eightWkAveSales', 8)
  const l2_eightWkAveSales = calcAveWeeklySales(l2_trailingEightWeekR, 'eightWkAveSales', 8)
  const l3_eightWkAveSales = config.l3_field ? calcAveWeeklySales(l3_trailingEightWeekR, 'eightWkAveSales', 8) : []
  const l4_eightWkAveSales = config.l4_field ? calcAveWeeklySales(l4_trailingEightWeekR, 'eightWkAveSales', 8) : []
  const l5_eightWkAveSales = config.l5_field ? calcAveWeeklySales(l5_trailingEightWeekR, 'eightWkAveSales', 8) : []
  
  const l0_twelveWkAveSales = calcAveWeeklySales(l0_trailingTwelveWeekR, 'twelveWkAveSales', 12)
  const l1_twelveWkAveSales = calcAveWeeklySales(l1_trailingTwelveWeekR, 'twelveWkAveSales', 12)
  const l2_twelveWkAveSales = calcAveWeeklySales(l2_trailingTwelveWeekR, 'twelveWkAveSales', 12)
  const l3_twelveWkAveSales = config.l3_field ? calcAveWeeklySales(l3_trailingTwelveWeekR, 'twelveWkAveSales', 12) : []
  const l4_twelveWkAveSales = config.l4_field ? calcAveWeeklySales(l4_trailingTwelveWeekR, 'twelveWkAveSales', 12) : []
  const l5_twelveWkAveSales = config.l5_field ? calcAveWeeklySales(l5_trailingTwelveWeekR, 'twelveWkAveSales', 12) : []
  
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
  const l3_weeksInvOnHand = config.l3_field ? calcWeeksInvOnHand(l3_fgInvenR, l3_aveWeeklySales, 'weeksInvenOnHand') : [] 
  const l4_weeksInvOnHand = config.l4_field ? calcWeeksInvOnHand(l4_fgInvenR, l4_aveWeeklySales, 'weeksInvenOnHand') : [] 
  const l5_weeksInvOnHand = config.l5_field ? calcWeeksInvOnHand(l5_fgInvenR, l5_aveWeeklySales, 'weeksInvenOnHand') : [] 
  
  /* INVENTORY AVAILABLE */
  const l0_invAvailable = calcInventoryAvailable(l0_fgInvenR, l0_fgPoR, l0_soR, 'invenAvailable')
  const l1_invAvailable = calcInventoryAvailable(l1_fgInvenR, l1_fgPoR, l1_soR, 'invenAvailable')
  const l2_invAvailable = calcInventoryAvailable(l2_fgInvenR, l2_fgPoR, l2_soR, 'invenAvailable')
  const l3_invAvailable = config.l3_field ? calcInventoryAvailable(l3_fgInvenR, l3_fgPoR, l3_soR, 'invenAvailable') : []
  const l4_invAvailable = config.l4_field ? calcInventoryAvailable(l4_fgInvenR, l4_fgPoR, l4_soR, 'invenAvailable') : []
  const l5_invAvailable = config.l5_field ? calcInventoryAvailable(l5_fgInvenR, l5_fgPoR, l5_soR, 'invenAvailable') : []

  ///////////////////////////////// ROWS
  const rowsFifthLevelDetail =  config.l5_field ? () => {return getRowsFifthLevelDetail(config)} : skip() 
  const rowsFourthLevelDetail =  config.l4_field ? () => {return getRowsFourthLevelDetail(config)} : skip() 
  const rowsThirdLevelDetail =  config.l3_field ? () => {return getRowsThirdLevelDetail(config)} : skip() 
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
      l1_label: `${config.itemType} SALES`,
      l2_label: 'TOTAL',
      l3_label: 'TOTAL',
      l4_label: 'TOTAL',
      l5_label: 'TOTAL',
      datalevel: 0,
      itemtype: config.itemType,
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
  if (!config.l3_field) {
    // 2 LEVEL REPORT
    mapSalesToRowTemplates = mapSalesToRowTemplates_twoLevel
    mapInvenToRowTemplates = mapInvenToRowTemplates_twoLevel
    rowTemplate_unflat = unflattenByCompositKey(rowTemplate, { 1: 'l1_label', 2: 'l2_label' }) 
    level = 2
  } else if (!config.l4_field) {
    // 3 LEVEL REPORT
    mapSalesToRowTemplates = mapSalesToRowTemplates_threeLevel
    mapInvenToRowTemplates = mapInvenToRowTemplates_threeLevel
    rowTemplate_unflat = unflattenByCompositKey(rowTemplate, { 1: 'l1_label', 2: 'l2_label', 3: 'l3_label' }) 
    level = 3
  } else if (!config.l5_field) {
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
      ...l0_salesByFiscalQuarterR,
      ...l1_salesByFiscalQuarterR,
      ...l2_salesByFiscalQuarterR,
      ...l3_salesByFiscalQuarterR,
      ...l4_salesByFiscalQuarterR,
      ...l5_salesByFiscalQuarterR,
      ...l0_salesByFiscalPeriodR,
      ...l1_salesByFiscalPeriodR,
      ...l2_salesByFiscalPeriodR,
      ...l3_salesByFiscalPeriodR,
      ...l4_salesByFiscalPeriodR,
      ...l5_salesByFiscalPeriodR,
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
      ...l0_salesByCalMoR,
      ...l1_salesByCalMoR,
      ...l2_salesByCalMoR,
      ...l3_salesByCalMoR,
      ...l4_salesByCalMoR,
      ...l5_salesByCalMoR,
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
      ...l1_salesByWkR,
      ...l2_salesByWkR,
      ...l3_salesByWkR,
      ...l4_salesByWkR,
      ...l5_salesByWkR,
      ...l0_salesByWkR,
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

      ...l1_so_byCalMoR,
      ...l2_so_byCalMoR,
      ...l3_so_byCalMoR,
      ...l4_so_byCalMoR,
      ...l5_so_byCalMoR,
      ...l0_so_byCalMoR,

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
      ...l1_so_byWkR,
      ...l2_so_byWkR,
      ...l3_so_byWkR,
      ...l4_so_byWkR,
      ...l5_so_byWkR,
      ...l0_so_byWkR,
      // ...l1_soTagged_byWkR,
      // ...l2_soTagged_byWkR,
      // ...l3_soTagged_byWkR,
      // ...l4_soTagged_byWkR,
      // ...l5_soTagged_byWkR,
      // ...l0_soTagged_byWkR,
      // ...l1_soUntagged_byWkR,
      // ...l2_soUntagged_byWkR,
      // ...l3_soUntagged_byWkR,
      // ...l4_soUntagged_byWkR,
      // ...l5_soUntagged_byWkR,
      // ...l0_soUntagged_byWkR,
      ...l1_salesByFyR,
      ...l2_salesByFyR,
      ...l3_salesByFyR,
      ...l4_salesByFyR,
      ...l5_salesByFyR,
      ...l0_salesByFyR,
      ...l1_salesByFyYtdR,
      ...l2_salesByFyYtdR,
      ...l3_salesByFyYtdR,
      ...l4_salesByFyYtdR,
      ...l5_salesByFyYtdR,
      ...l0_salesByFyYtdR,
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

  /* Build Columns */
  
  const trendColsSales_byFiscalQuarterF = !config.trends.fiscalQuarters ? skip() : () => {return  getTrendColsFiscalQuarters(config)}
  const trendColsSales_byPeriodF = !config.trends.fiscalPeriods ? skip() : () => {return  getTrendColsFiscalPeriods(config)}
  const trendColsSalesF = !config.trends.fiscalWeeks ? skip() : () => {return  getTrendColsWeeks(config)}
  const trendColsSalesProjF = !config.trends.useProjection ? skip() : () => {return  getDateEndPerWeekByRange_pj(config.totals.startDatePrimary, config.totals.endDatePrimary, config)}
  const trendColsSaByFyYtdF = !config.trends.fyYtd && !config.trends.fyFullYear ? skip() : () => {return  getTrendColsFiscalYear(config)}
  const trendColsCalMoByRangeF = !config.trends.calMonths ? skip() : () => {return  getTrendColsCalMonths(config)}

  // get so by week cols
  const trendColsSoF = !config.trends.calMonths ? () => {return  getDateEndPerWeekByRange_so(config)} : () => {return  getTrendColsSoByCalMonths(config)}
  const trendColsSo_tgF = () => {return  getDateEndPerWeekByRange_so_tg(config)}
  const trendColsSo_untgF = () => {return  getDateEndPerWeekByRange_so_untg(config)}


  // Call all column functions
  const [
    trendColsSales_byFiscalQuarter,
    trendColsSales_byPeriod,
    trendColsSalesProj, 
    trendColsSales, 
    trendColsSaByFyYtd, 
    trendColsSo, 
    // trendColsSo_tg, 
    // trendColsSo_untg,
    trendColsCalMo
  ] = await Promise.all([
    trendColsSales_byFiscalQuarterF(),
    trendColsSales_byPeriodF(),
    trendColsSalesProjF(), 
    trendColsSalesF(), 
    trendColsSaByFyYtdF(), 
    trendColsSoF(), 
    // trendColsSo_tgF(), 
    // trendColsSo_untgF(),
    trendColsCalMoByRangeF(),
  ])
  
  const columnConfigsTagged = addDataToSalesTotalCol(config, columnConfigs) 

  return {
    data,
    cols: {
      trendColsSales_byFiscalQuarter,
      trendColsSales_byPeriod,
      trendColsCalMo,
      trendColsSalesProj, // Only include if projection is checked
      trendColsSales,
      trendColsSaByFyYtd,
      labelCols,
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
