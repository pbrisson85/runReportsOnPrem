const {
  getDateEndPerWeekByRange,
  getDateEndPerWeekByRange_pj,
  getDateEndPerWeekByRange_so,
  getDateEndPerWeekByRange_so_tg,
  getDateEndPerWeekByRange_so_untg,
} = require('../../../database/queries/postgres/getDateEndPerWeek')
const {
  getCalMonthByRange,
} = require('../../../database/queries/postgres/getCalMonthByRange')
const { getFiscalYearCols, getFiscalYearYtdCols } = require('../../../database/queries/postgres/getFiscalYearCols')
const { getLatestShipWk, getEarliestShipWk } = require('../../../database/queries/postgres/getSoDates')
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
l4_getSalesProjectionPeriodToDate
} = require('../../../database/queries/postgres/baseReport/getSalesProjection')
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
} = require('../../../database/queries/postgres/baseReport/getSalesTrendDateDriven')
const {
  l1_getSalesByCalMo,
  l2_getSalesByCalMo,
  l3_getSalesByCalMo,
  l4_getSalesByCalMo,
  l0_getSalesByCalMo,
  l1_getSalesCalMoToDate,
  l2_getSalesCalMoToDate,
  l3_getSalesCalMoToDate,
  l4_getSalesCalMoToDate,
  l0_getSalesCalMoToDate,
} = require('../../../database/queries/postgres/baseReport/getSalesTrendByCalMonth')
const {
  l1_getSalesWkDriven,
  l2_getSalesWkDriven,
  l3_getSalesWkDriven,
  l4_getSalesWkDriven,
  l0_getSalesWkDriven,
} = require('../../../database/queries/postgres/baseReport/getSalesTrendWkDriven')
const { getCompanyTotalSales } = require('../../../database/queries/postgres/kpi/getCompanyTotalSales')
const { getProgramTotalSales } = require('../../../database/queries/postgres/kpi/getProgramTotalSales')
const {
  l1_getSalesByFyYtd,
  l2_getSalesByFyYtd,
  l3_getSalesByFyYtd,
  l4_getSalesByFyYtd,
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
} = require('../../../database/queries/postgres/baseReport/getFgInven')
const { l1_getFgPo, l2_getFgPo, l3_getFgPo, l4_getFgPo, l0_getFgPo } = require('../../../database/queries/postgres/baseReport/getFgOpenPo')
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
} = require('../../../database/queries/postgres/baseReport/getSo')
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
} = require('../../../database/queries/postgres/baseReport/getSoByWeek')
const {
  getRowsFourthLevelDetail,
  getRowsThirdLevelDetail,
  getRowsSecondLevelDetail,
  getRowsFirstLevelDetail,
} = require('../../../database/queries/postgres/baseReport/getRows')
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
const calcWeeksInvOnHand = require('../../../models/calcWeeksInvOnHand')
const calcInventoryAvailable = require('../../../models/calcInventoryAvailable')
const collapseRedundantTotalRows = require('../../../models/collapseRedundantTotalRows')
const columnConfigs = require('../data/baseCols/columns')
const sortRowTemplate = require('../../../models/sortRowTemplate')

const buildReport = async (start, end, startWeek, endWeek, config, labelCols, year) => {
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

  /* FG IN TRANSIT*/
  const l0_fgInTransit = () => {return l0_getFgInTransit(config)}
  const l1_fgInTransit = () => {return l1_getFgInTransit(config)}
  const l2_fgInTransit = () => {return l2_getFgInTransit(config)}
  const l3_fgInTransit =  config.l3_field ? () => {return l3_getFgInTransit(config)} : skip()
  const l4_fgInTransit =  config.l4_field ? () => {return l4_getFgInTransit(config)} : skip()

  /* FG ON HAND (LESS IN TRANSIT) */
  const l0_fgAtLoc = () => {return l0_getFgAtLoc(config)}
  const l1_fgAtLoc = () => {return l1_getFgAtLoc(config)}
  const l2_fgAtLoc = () => {return l2_getFgAtLoc(config)}
  const l3_fgAtLoc =  config.l3_field ? () => {return l3_getFgAtLoc(config)} : skip()
  const l4_fgAtLoc =  config.l4_field ? () => {return l4_getFgAtLoc(config)} : skip()

  /* FG ON HAND UNTAGGED */
  const l0_fgAtLoc_untagged = () => {return l0_getFgAtLoc_untagged(config)}
  const l1_fgAtLoc_untagged = () => {return l1_getFgAtLoc_untagged(config)}
  const l2_fgAtLoc_untagged = () => {return l2_getFgAtLoc_untagged(config)}
  const l3_fgAtLoc_untagged =  config.l3_field ? () => {return l3_getFgAtLoc_untagged(config)} : skip()
  const l4_fgAtLoc_untagged =  config.l4_field ? () => {return l4_getFgAtLoc_untagged(config)} : skip()

  /* FG ON HAND TAGGED */
  // const l0_fgAtLoc_tagged = () => {return l0_getFgAtLoc_tagged(config)}
  // const l1_fgAtLoc_tagged = () => {return l1_getFgAtLoc_tagged(config)}
  // const l2_fgAtLoc_tagged = () => {return l2_getFgAtLoc_tagged(config)}
  // const l3_fgAtLoc_tagged =  config.l3_field ? () => {return l3_getFgAtLoc_tagged(config)}:skip()
  // const l4_fgAtLoc_tagged =  config.l4_field ? () => {return l4_getFgAtLoc_tagged(config)}:skip()

  /* FG ON ORDER */
  const l0_fgPo = () => {return l0_getFgPo(config)}
  const l1_fgPo = () => {return l1_getFgPo(config)}
  const l2_fgPo = () => {return l2_getFgPo(config)}
  const l3_fgPo =  config.l3_field ? () => {return l3_getFgPo(config)} : skip()
  const l4_fgPo =  config.l4_field ? () => {return l4_getFgPo(config)} : skip()
  
  // ///////////////////////////////// SALES ORDERS
  /* ALL SO */
  const l0_so = () => {return l0_getSo(config)}
  const l1_so = () => {return l1_getSo(config)}
  const l2_so = () => {return l2_getSo(config)}
  const l3_so =  config.l3_field ? () => {return l3_getSo(config)} : skip()
  const l4_so =  config.l4_field ? () => {return l4_getSo(config)} : skip()
  
  const l0_so_byWk = () => {return l0_getSo_byWk(config)}
  const l1_so_byWk = () => {return l1_getSo_byWk(config)}
  const l2_so_byWk = () => {return l2_getSo_byWk(config)}
  const l3_so_byWk =  config.l3_field ? () => {return l3_getSo_byWk(config)} : skip()
  const l4_so_byWk =  config.l4_field ? () => {return l4_getSo_byWk(config)} : skip()
  
  /* TAGGED SO */
  // const l0_soTagged = () => {return l0_getSoTagged(config)}
  // const l1_soTagged = () => {return l1_getSoTagged(config)}
  // const l2_soTagged = () => {return l2_getSoTagged(config)}
  // const l3_soTagged =  config.l3_field ? () => {return l3_getSoTagged(config)}:skip()
  // const l4_soTagged =  config.l4_field ? () => {return l4_getSoTagged(config)}:skip()

  // const l0_soTagged_byWk = () => {return l0_getSoTagged_byWk(config)}
  // const l1_soTagged_byWk = () => {return l1_getSoTagged_byWk(config)}
  // const l2_soTagged_byWk = () => {return l2_getSoTagged_byWk(config)}
  // const l3_soTagged_byWk =  config.l3_field ? () => {return l3_getSoTagged_byWk(config)}:skip()
  // const l4_soTagged_byWk =  config.l4_field ? () => {return l4_getSoTagged_byWk(config)}:skip()

  /* UNTAGGED SO */
  const l0_soUntagged = () => {return l0_getSoUntagged(config)}
  const l1_soUntagged = () => {return l1_getSoUntagged(config)}
  const l2_soUntagged = () => {return l2_getSoUntagged(config)}
  const l3_soUntagged =  config.l3_field ? () => {return l3_getSoUntagged(config)} : skip()
  const l4_soUntagged =  config.l4_field ? () => {return l4_getSoUntagged(config)} : skip()

  const l0_soUntagged_byWk = () => {return l0_getSoUntagged_byWk(config)}
  const l1_soUntagged_byWk = () => {return l1_getSoUntagged_byWk(config)}
  const l2_soUntagged_byWk = () => {return l2_getSoUntagged_byWk(config)}
  const l3_soUntagged_byWk =  config.l3_field ? () => {return l3_getSoUntagged_byWk(config)} : skip()
  const l4_soUntagged_byWk =  config.l4_field ? () => {return l4_getSoUntagged_byWk(config)} : skip()

  // ///////////////////////////////// SALES DATA

  /*SALES PROJECTIONS*/
  const l0_salesProjectionByWk = !config.views.useProjection ? skip() : () => {return l0_getSalesProjectionByWk(config, start, end)}
  const l1_salesProjectionByWk = !config.views.useProjection ? skip() : () => {return l1_getSalesProjectionByWk(config, start, end)}
  const l2_salesProjectionByWk = !config.views.useProjection ? skip() : () => {return l2_getSalesProjectionByWk(config, start, end)}
  const l3_salesProjectionByWk = !config.views.useProjection ? skip() : config.l3_field ? () => {return l3_getSalesProjectionByWk(config, start, end)} : skip()
  const l4_salesProjectionByWk = !config.views.useProjection ? skip() : config.l4_field ? () => {return l4_getSalesProjectionByWk(config, start, end)} : skip()

  const l0_salesProjectionPeriodToDate = !config.views.useProjection ? skip() : () => {return l0_getSalesProjectionPeriodToDate(config, start, end)}
  const l1_salesProjectionPeriodToDate = !config.views.useProjection ? skip() : () => {return l1_getSalesProjectionPeriodToDate(config, start, end)}
  const l2_salesProjectionPeriodToDate = !config.views.useProjection ? skip() : () => {return l2_getSalesProjectionPeriodToDate(config, start, end)}
  const l3_salesProjectionPeriodToDate = !config.views.useProjection ? skip() : config.l3_field ? () => {return l3_getSalesProjectionPeriodToDate(config, start, end)} : skip()
  const l4_salesProjectionPeriodToDate = !config.views.useProjection ? skip() : config.l4_field ? () => {return l4_getSalesProjectionPeriodToDate(config, start, end)} : skip()

  /*SALES*/

  const l0_salesByCalMo = !config.trends.calMonths ? skip() : () => {return l0_getSalesByCalMo(config, start, end)}
  const l1_salesByCalMo = !config.trends.calMonths ? skip() : () => {return l1_getSalesByCalMo(config, start, end)}
  const l2_salesByCalMo = !config.trends.calMonths ? skip() : () => {return l2_getSalesByCalMo(config, start, end)}
  const l3_salesByCalMo = !config.trends.calMonths ? skip() : config.l3_field ? () => {return l3_getSalesByCalMo(config, start, end)} : skip()
  const l4_salesByCalMo = !config.trends.calMonths ? skip() : config.l4_field ? () => {return l4_getSalesByCalMo(config, start, end)} : skip()

  const l0_salesCalMoToDate = !config.trends.calMonths ? skip() : () => {return l0_getSalesCalMoToDate(config, start, end)}
  const l1_salesCalMoToDate = !config.trends.calMonths ? skip() : () => {return l1_getSalesCalMoToDate(config, start, end)}
  const l2_salesCalMoToDate = !config.trends.calMonths ? skip() : () => {return l2_getSalesCalMoToDate(config, start, end)}
  const l3_salesCalMoToDate = !config.trends.calMonths ? skip() : config.l3_field ? () => {return l3_getSalesCalMoToDate(config, start, end)} : skip()
  const l4_salesCalMoToDate = !config.trends.calMonths ? skip() : config.l4_field ? () => {return l4_getSalesCalMoToDate(config, start, end)} : skip()

  ////

  const l0_salesByFy = !config.trends.fyFullYear ? skip() : () => {return l0_getSalesByFyYtd(config, startWeek, endWeek, false)}
  const l1_salesByFy = !config.trends.fyFullYear ? skip() : () => {return l1_getSalesByFyYtd(config, startWeek, endWeek, false)}
  const l2_salesByFy = !config.trends.fyFullYear ? skip() : () => {return l2_getSalesByFyYtd(config, startWeek, endWeek, false)}
  const l3_salesByFy = !config.trends.fyFullYear ? skip() : config.l3_field ? () => {return l3_getSalesByFyYtd(config, startWeek, endWeek, false)} : skip()
  const l4_salesByFy = !config.trends.fyFullYear ? skip() : config.l4_field ? () => {return l4_getSalesByFyYtd(config, startWeek, endWeek, false)} : skip()

  const l0_salesByFyYtd = !config.trends.fyYtd ? skip() : () => {return l0_getSalesByFyYtd(config, startWeek, endWeek, true)}
  const l1_salesByFyYtd = !config.trends.fyYtd ? skip() : () => {return l1_getSalesByFyYtd(config, startWeek, endWeek, true)}
  const l2_salesByFyYtd = !config.trends.fyYtd ? skip() : () => {return l2_getSalesByFyYtd(config, startWeek, endWeek, true)}
  const l3_salesByFyYtd = !config.trends.fyYtd ? skip() : config.l3_field ? () => {return l3_getSalesByFyYtd(config, startWeek, endWeek, true)} : skip()
  const l4_salesByFyYtd = !config.trends.fyYtd ? skip() : config.l4_field ? () => {return l4_getSalesByFyYtd(config, startWeek, endWeek, true)} : skip()

  const l0_salesByWk = !config.trends.fiscalWeeks ? skip() : () => {return l0_getSalesByWk(config, start, end)}
  const l1_salesByWk = !config.trends.fiscalWeeks ? skip() : () => {return l1_getSalesByWk(config, start, end)}
  const l2_salesByWk = !config.trends.fiscalWeeks ? skip() : () => {return l2_getSalesByWk(config, start, end)}
  const l3_salesByWk = !config.trends.fiscalWeeks ? skip() : config.l3_field ? () => {return l3_getSalesByWk(config, start, end)} : skip()
  const l4_salesByWk = !config.trends.fiscalWeeks ? skip() : config.l4_field ? () => {return l4_getSalesByWk(config, start, end)} : skip()

  // TEMPORARILY SKIPPING IF SET TO CAL MONTHS
  const l0_salesPeriodToDate = config.trends.calMonths ? skip() : () => {return l0_getSalesPeriodToDate(config, start, end)}
  const l1_salesPeriodToDate = config.trends.calMonths ? skip() : () => {return l1_getSalesPeriodToDate(config, start, end)}
  const l2_salesPeriodToDate = config.trends.calMonths ? skip() : () => {return l2_getSalesPeriodToDate(config, start, end)}
  const l3_salesPeriodToDate =  config.trends.calMonths ? skip() : config.l3_field ? () => {return l3_getSalesPeriodToDate(config, start, end)} : skip()
  const l4_salesPeriodToDate =  config.trends.calMonths ? skip() : config.l4_field ? () => {return l4_getSalesPeriodToDate(config, start, end)} : skip()

  /*  */

  const [
    l0_salesByCalMoR,
    l1_salesByCalMoR,
    l2_salesByCalMoR,
    l3_salesByCalMoR,
    l4_salesByCalMoR,
    l0_salesCalMoToDateR,
    l1_salesCalMoToDateR,
    l2_salesCalMoToDateR,
    l3_salesCalMoToDateR,
    l4_salesCalMoToDateR,

    l1_fgInvenR,
    l2_fgInvenR,
    l3_fgInvenR,
    l4_fgInvenR,
    l0_fgInvenR,
    l1_fgInTransitR,
    l2_fgInTransitR,
    l3_fgInTransitR,
    l4_fgInTransitR,
    l0_fgInTransitR,
    l1_fgAtLocR,
    l2_fgAtLocR,
    l3_fgAtLocR,
    l4_fgAtLocR,
    l0_fgAtLocR,
    l1_fgAtLoc_untaggedR,
    l2_fgAtLoc_untaggedR,
    l3_fgAtLoc_untaggedR,
    l4_fgAtLoc_untaggedR,
    l0_fgAtLoc_untaggedR,
    // l1_fgAtLoc_taggedR,
    // l2_fgAtLoc_taggedR,
    // l3_fgAtLoc_taggedR,
    // l4_fgAtLoc_taggedR,
    // l0_fgAtLoc_taggedR,
    l1_fgPoR,
    l2_fgPoR,
    l3_fgPoR,
    l4_fgPoR,
    l0_fgPoR,
    l1_soR,
    l2_soR,
    l3_soR,
    l4_soR,
    l0_soR,
    l1_so_byWkR,
    l2_so_byWkR,
    l3_so_byWkR,
    l4_so_byWkR,
    l0_so_byWkR,
    // l1_soTaggedR,
    // l2_soTaggedR,
    // l3_soTaggedR,
    // l4_soTaggedR,
    // l0_soTaggedR,
    // l1_soTagged_byWkR,
    // l2_soTagged_byWkR,
    // l3_soTagged_byWkR,
    // l4_soTagged_byWkR,
    // l0_soTagged_byWkR,
    l1_soUntaggedR,
    l2_soUntaggedR,
    l3_soUntaggedR,
    l4_soUntaggedR,
    l0_soUntaggedR,
    l1_soUntagged_byWkR,
    l2_soUntagged_byWkR,
    l3_soUntagged_byWkR,
    l4_soUntagged_byWkR,
    l0_soUntagged_byWkR,
    l1_salesProjectionBywkR,
    l2_salesProjectionBywkR,
    l3_salesProjectionBywkR,
    l4_salesProjectionBywkR,
    l0_salesProjectionBywkR,
    l1_salesProjectionPeriodToDateR,
    l2_salesProjectionPeriodToDateR,
    l3_salesProjectionPeriodToDateR,
    l4_salesProjectionPeriodToDateR,
    l0_salesProjectionPeriodToDateR,
    l1_salesByFyR,
    l2_salesByFyR,
    l3_salesByFyR,
    l4_salesByFyR,
    l0_salesByFyR,
    l1_salesByFyYtdR,
    l2_salesByFyYtdR,
    l3_salesByFyYtdR,
    l4_salesByFyYtdR,
    l0_salesByFyYtdR,
    l1_salesByWkR,
    l2_salesByWkR,
    l3_salesByWkR,
    l4_salesByWkR,
    l0_salesByWkR,
    l1_salesPeriodToDateR,
    l2_salesPeriodToDateR,
    l3_salesPeriodToDateR,
    l4_salesPeriodToDateR,
    l0_salesPeriodToDateR,
  ] = await Promise.all([
    l0_salesByCalMo(),
  l1_salesByCalMo(),
  l2_salesByCalMo(),
  l3_salesByCalMo(),
  l4_salesByCalMo(),
  l0_salesCalMoToDate(),
  l1_salesCalMoToDate(),
  l2_salesCalMoToDate(),
  l3_salesCalMoToDate(),
  l4_salesCalMoToDate(),

    l1_fgInven(),
    l2_fgInven(),
    l3_fgInven(),
    l4_fgInven(),
    l0_fgInven(),
    l1_fgInTransit(),
    l2_fgInTransit(),
    l3_fgInTransit(),
    l4_fgInTransit(),
    l0_fgInTransit(),
    l1_fgAtLoc(),
    l2_fgAtLoc(),
    l3_fgAtLoc(),
    l4_fgAtLoc(),
    l0_fgAtLoc(),
    l1_fgAtLoc_untagged(),
    l2_fgAtLoc_untagged(),
    l3_fgAtLoc_untagged(),
    l4_fgAtLoc_untagged(),
    l0_fgAtLoc_untagged(),
    // l1_fgAtLoc_tagged(),
    // l2_fgAtLoc_tagged(),
    // l3_fgAtLoc_tagged(),
    // l4_fgAtLoc_tagged(),
    // l0_fgAtLoc_tagged(),
    l1_fgPo(),
    l2_fgPo(),
    l3_fgPo(),
    l4_fgPo(),
    l0_fgPo(),
    l1_so(),
    l2_so(),
    l3_so(),
    l4_so(),
    l0_so(),
    l1_so_byWk(),
    l2_so_byWk(),
    l3_so_byWk(),
    l4_so_byWk(),
    l0_so_byWk(),
    // l1_soTagged(),
    // l2_soTagged(),
    // l3_soTagged(),
    // l4_soTagged(),
    // l0_soTagged(),
    // l1_soTagged_byWk(),
    // l2_soTagged_byWk(),
    // l3_soTagged_byWk(),
    // l4_soTagged_byWk(),
    // l0_soTagged_byWk(),
    l1_soUntagged(),
    l2_soUntagged(),
    l3_soUntagged(),
    l4_soUntagged(),
    l0_soUntagged(),
    l1_soUntagged_byWk(),
    l2_soUntagged_byWk(),
    l3_soUntagged_byWk(),
    l4_soUntagged_byWk(),
    l0_soUntagged_byWk(),
    l1_salesProjectionByWk(),
    l2_salesProjectionByWk(),
    l3_salesProjectionByWk(),
    l4_salesProjectionByWk(),
    l0_salesProjectionByWk(),
    l1_salesProjectionPeriodToDate(),
    l2_salesProjectionPeriodToDate(),
    l3_salesProjectionPeriodToDate(),
    l4_salesProjectionPeriodToDate(),
    l0_salesProjectionPeriodToDate(),
    l1_salesByFy(),
    l2_salesByFy(),
    l3_salesByFy(),
    l4_salesByFy(),
    l0_salesByFy(),
    l1_salesByFyYtd(),
    l2_salesByFyYtd(),
    l3_salesByFyYtd(),
    l4_salesByFyYtd(),
    l0_salesByFyYtd(),
    l1_salesByWk(),
    l2_salesByWk(),
    l3_salesByWk(),
    l4_salesByWk(),
    l0_salesByWk(),
    l1_salesPeriodToDate(),
    l2_salesPeriodToDate(),
    l3_salesPeriodToDate(),
    l4_salesPeriodToDate(),
    l0_salesPeriodToDate(),
  ])

  ///////////////////////////////// KPI DATA

  const companyTotalSales = () => {return getCompanyTotalSales(start, end, config)}
  const programTotalSales = () => {return getProgramTotalSales(start, end, config)}
  const speciesGroupTotalSales = () => {return getSpeciesGroupTotalSales(start, end, config)}

  const l0_trailingTwoWeek = endWeek < 2 ? skip() : () => {return l0_getSalesWkDriven(config, endWeek - 1, endWeek, year)}
  const l1_trailingTwoWeek = endWeek < 2 ? skip() : () => {return l1_getSalesWkDriven(config, endWeek - 1, endWeek, year)}
  const l2_trailingTwoWeek = endWeek < 2 ? skip() : () => {return l2_getSalesWkDriven(config, endWeek - 1, endWeek, year)}
  const l3_trailingTwoWeek = endWeek < 2 ? skip() : config.l3_field ? () => {return l3_getSalesWkDriven(config, endWeek - 1, endWeek, year)} : skip() 
  const l4_trailingTwoWeek = endWeek < 2 ? skip() : config.l4_field ? () => {return l4_getSalesWkDriven(config, endWeek - 1, endWeek, year)} : skip() 
  
  const l0_trailingFourWeek = endWeek < 4 ? skip() : () => {return l0_getSalesWkDriven(config, endWeek - 3, endWeek, year)}
  const l1_trailingFourWeek = endWeek < 4 ? skip() : () => {return l1_getSalesWkDriven(config, endWeek - 3, endWeek, year)}
  const l2_trailingFourWeek = endWeek < 4 ? skip() : () => {return l2_getSalesWkDriven(config, endWeek - 3, endWeek, year)}
  const l3_trailingFourWeek = endWeek < 4 ? skip() : config.l3_field ? () => {return l3_getSalesWkDriven(config, endWeek - 3, endWeek, year)} : skip() 
  const l4_trailingFourWeek = endWeek < 4 ? skip() : config.l4_field ? () => {return l4_getSalesWkDriven(config, endWeek - 3, endWeek, year)} : skip() 

  const l0_trailingEightWeek = endWeek < 8 ? skip() : () => {return l0_getSalesWkDriven(config, endWeek - 7, endWeek, year)}
  const l1_trailingEightWeek = endWeek < 8 ? skip() : () => {return l1_getSalesWkDriven(config, endWeek - 7, endWeek, year)}
  const l2_trailingEightWeek = endWeek < 8 ? skip() : () => {return l2_getSalesWkDriven(config, endWeek - 7, endWeek, year)}
  const l3_trailingEightWeek = endWeek < 8 ? skip() : config.l3_field ? () => {return l3_getSalesWkDriven(config, endWeek - 7, endWeek, year)} : skip() 
  const l4_trailingEightWeek = endWeek < 8 ? skip() : config.l4_field ? () => {return l4_getSalesWkDriven(config, endWeek - 7, endWeek, year)} : skip() 

  const l0_trailingTwelveWeek = endWeek < 12 ? skip() : () => {return l0_getSalesWkDriven(config, endWeek - 11, endWeek, year)}
  const l1_trailingTwelveWeek = endWeek < 12 ? skip() : () => {return l1_getSalesWkDriven(config, endWeek - 11, endWeek, year)}
  const l2_trailingTwelveWeek = endWeek < 12 ? skip() : () => {return l2_getSalesWkDriven(config, endWeek - 11, endWeek, year)}
  const l3_trailingTwelveWeek = endWeek < 12 ? skip() : config.l3_field ? () => {return l3_getSalesWkDriven(config, endWeek - 11, endWeek, year)} : skip() 
  const l4_trailingTwelveWeek = endWeek < 12  ? skip() : config.l4_field ? () => {return l4_getSalesWkDriven(config, endWeek - 11, endWeek, year)} : skip() 
  
  const [ 
    companyTotalSalesR,
    programTotalSalesR,  
    speciesGroupTotalSalesR,
    l1_trailingTwoWeekR,
    l2_trailingTwoWeekR,
    l3_trailingTwoWeekR,
    l4_trailingTwoWeekR,
    l0_trailingTwoWeekR,
    l1_trailingFourWeekR,
    l2_trailingFourWeekR,
    l3_trailingFourWeekR,
    l4_trailingFourWeekR,
    l0_trailingFourWeekR,
    l1_trailingEightWeekR,
    l2_trailingEightWeekR,
    l3_trailingEightWeekR,
    l4_trailingEightWeekR,
    l0_trailingEightWeekR,
    l1_trailingTwelveWeekR,
    l2_trailingTwelveWeekR,
    l3_trailingTwelveWeekR,
    l4_trailingTwelveWeekR,
    l0_trailingTwelveWeekR, 
  ] = await Promise.all([ 
    companyTotalSales(), 
    programTotalSales(), 
    speciesGroupTotalSales(),
    l1_trailingTwoWeek(),
    l2_trailingTwoWeek(),
    l3_trailingTwoWeek(),
    l4_trailingTwoWeek(),
    l0_trailingTwoWeek(),
    l1_trailingFourWeek(),
    l2_trailingFourWeek(),
    l3_trailingFourWeek(),
    l4_trailingFourWeek(),
    l0_trailingFourWeek(),
    l1_trailingEightWeek(),
    l2_trailingEightWeek(),
    l3_trailingEightWeek(),
    l4_trailingEightWeek(),
    l0_trailingEightWeek(),
    l1_trailingTwelveWeek(),
    l2_trailingTwelveWeek(),
    l3_trailingTwelveWeek(),
    l4_trailingTwelveWeek(),
    l0_trailingTwelveWeek(),
  ])

  // Define numerators and denominators to use
  let l0_reportSales = config.views.useProjection ? l0_salesProjectionPeriodToDateR : config.trends.calMonths ? l0_salesCalMoToDateR : l0_salesPeriodToDateR
  let l1_reportSales = config.views.useProjection ? l1_salesProjectionPeriodToDateR : config.trends.calMonths ? l1_salesCalMoToDateR : l1_salesPeriodToDateR
  let l2_reportSales = config.views.useProjection ? l2_salesProjectionPeriodToDateR : config.trends.calMonths ? l2_salesCalMoToDateR : l2_salesPeriodToDateR
  let l3_reportSales = config.views.useProjection ? l3_salesProjectionPeriodToDateR : config.trends.calMonths ? l3_salesCalMoToDateR : l3_salesPeriodToDateR
  let l4_reportSales = config.views.useProjection ? l4_salesProjectionPeriodToDateR : config.trends.calMonths ? l4_salesCalMoToDateR : l4_salesPeriodToDateR

  /* % COMPANY SALES */
  const l0_percent_companySales = calcPercentSalesCol(companyTotalSalesR[0], l0_reportSales, 'percentCompanySales')
  const l1_percent_companySales = calcPercentSalesCol(companyTotalSalesR[0], l1_reportSales, 'percentCompanySales')
  const l2_percent_companySales = calcPercentSalesCol(companyTotalSalesR[0], l2_reportSales, 'percentCompanySales')
  const l3_percent_companySales = config.l3_field ? calcPercentSalesCol(companyTotalSalesR[0], l3_reportSales, 'percentCompanySales') : [] 
  const l4_percent_companySales = config.l4_field ? calcPercentSalesCol(companyTotalSalesR[0], l4_reportSales, 'percentCompanySales') : [] 

  /* % PROGRAM SALES */
  const l0_percent_programSales = !config.program ? [] : calcPercentSalesCol(programTotalSalesR[0], l0_reportSales, 'percentProgramSales')
  const l1_percent_programSales = !config.program ? [] : calcPercentSalesCol(programTotalSalesR[0], l1_reportSales, 'percentProgramSales')
  const l2_percent_programSales = !config.program ? [] : calcPercentSalesCol(programTotalSalesR[0], l2_reportSales, 'percentProgramSales')
  const l3_percent_programSales = !config.program || !config.l3_field ? [] : calcPercentSalesCol(programTotalSalesR[0], l3_reportSales, 'percentProgramSales')
  const l4_percent_programSales = !config.program || !config.l4_field ? [] : calcPercentSalesCol(programTotalSalesR[0], l4_reportSales, 'percentProgramSales') 

  /* % SPECIES GROUP SALES */
  // look up species group based on program
  const l0_percent_speciesGroupSales = !config.program ? [] : calcPercentSalesCol(speciesGroupTotalSalesR[0], l0_reportSales, 'percentSpeciesGroupSales')
  const l1_percent_speciesGroupSales = !config.program ? [] : calcPercentSalesCol(speciesGroupTotalSalesR[0], l1_reportSales, 'percentSpeciesGroupSales') 
  const l2_percent_speciesGroupSales = !config.program ? [] : calcPercentSalesCol(speciesGroupTotalSalesR[0], l2_reportSales, 'percentSpeciesGroupSales') 
  const l3_percent_speciesGroupSales = !config.program || !config.l3_field ? [] : calcPercentSalesCol(speciesGroupTotalSalesR[0], l3_reportSales, 'percentSpeciesGroupSales')
  const l4_percent_speciesGroupSales = !config.program || !config.l4_field ? [] : calcPercentSalesCol(speciesGroupTotalSalesR[0], l4_reportSales, 'percentSpeciesGroupSales')
 
  /* % REPORT TOTAL */
  const l0_percent_reportTotal = calcPercentSalesCol(l0_reportSales[0], l0_reportSales, 'percentReportTotal')
  const l1_percent_reportTotal = calcPercentSalesCol(l0_reportSales[0], l1_reportSales, 'percentReportTotal')
  const l2_percent_reportTotal = calcPercentSalesCol(l0_reportSales[0], l2_reportSales, 'percentReportTotal')
  const l3_percent_reportTotal = config.l3_field ? calcPercentSalesCol(l0_reportSales[0], l3_reportSales, 'percentReportTotal') : [] 
  const l4_percent_reportTotal = config.l4_field ? calcPercentSalesCol(l0_reportSales[0], l4_reportSales, 'percentReportTotal') : [] 
  
  /* AVE WEEKLY SALES */
  const weeks = endWeek - startWeek + 1
  const l0_aveWeeklySales = calcAveWeeklySales(l0_reportSales, 'aveWeeklySales', weeks)
  const l1_aveWeeklySales = calcAveWeeklySales(l1_reportSales, 'aveWeeklySales', weeks)
  const l2_aveWeeklySales = calcAveWeeklySales(l2_reportSales, 'aveWeeklySales', weeks)
  const l3_aveWeeklySales = config.l3_field ? calcAveWeeklySales(l3_reportSales, 'aveWeeklySales', weeks) : []
  const l4_aveWeeklySales = config.l4_field ? calcAveWeeklySales(l4_reportSales, 'aveWeeklySales', weeks) : []

  const l0_twoWkAveSales = calcAveWeeklySales(l0_trailingTwoWeekR, 'twoWkAveSales', 2)
  const l1_twoWkAveSales = calcAveWeeklySales(l1_trailingTwoWeekR, 'twoWkAveSales', 2)
  const l2_twoWkAveSales = calcAveWeeklySales(l2_trailingTwoWeekR, 'twoWkAveSales', 2)
  const l3_twoWkAveSales = config.l3_field ? calcAveWeeklySales(l3_trailingTwoWeekR, 'twoWkAveSales', 2) : []
  const l4_twoWkAveSales = config.l4_field ? calcAveWeeklySales(l4_trailingTwoWeekR, 'twoWkAveSales', 2) : []

  const l0_fourWkAveSales = calcAveWeeklySales(l0_trailingFourWeekR, 'fourWkAveSales', 4)
  const l1_fourWkAveSales = calcAveWeeklySales(l1_trailingFourWeekR, 'fourWkAveSales', 4)
  const l2_fourWkAveSales = calcAveWeeklySales(l2_trailingFourWeekR, 'fourWkAveSales', 4)
  const l3_fourWkAveSales = config.l3_field ? calcAveWeeklySales(l3_trailingFourWeekR, 'fourWkAveSales', 4) : []
  const l4_fourWkAveSales = config.l4_field ? calcAveWeeklySales(l4_trailingFourWeekR, 'fourWkAveSales', 4) : []
  
  const l0_eightWkAveSales = calcAveWeeklySales(l0_trailingEightWeekR, 'eightWkAveSales', 8)
  const l1_eightWkAveSales = calcAveWeeklySales(l1_trailingEightWeekR, 'eightWkAveSales', 8)
  const l2_eightWkAveSales = calcAveWeeklySales(l2_trailingEightWeekR, 'eightWkAveSales', 8)
  const l3_eightWkAveSales = config.l3_field ? calcAveWeeklySales(l3_trailingEightWeekR, 'eightWkAveSales', 8) : []
  const l4_eightWkAveSales = config.l4_field ? calcAveWeeklySales(l4_trailingEightWeekR, 'eightWkAveSales', 8) : []
  
  const l0_twelveWkAveSales = calcAveWeeklySales(l0_trailingTwelveWeekR, 'twelveWkAveSales', 12)
  const l1_twelveWkAveSales = calcAveWeeklySales(l1_trailingTwelveWeekR, 'twelveWkAveSales', 12)
  const l2_twelveWkAveSales = calcAveWeeklySales(l2_trailingTwelveWeekR, 'twelveWkAveSales', 12)
  const l3_twelveWkAveSales = config.l3_field ? calcAveWeeklySales(l3_trailingTwelveWeekR, 'twelveWkAveSales', 12) : []
  const l4_twelveWkAveSales = config.l4_field ? calcAveWeeklySales(l4_trailingTwelveWeekR, 'twelveWkAveSales', 12) : []
  
  /* WEEKS INV ON HAND */
  const l0_weeksInvOnHand = calcWeeksInvOnHand(l0_fgInvenR, l0_aveWeeklySales, 'weeksInvenOnHand')
  const l1_weeksInvOnHand = calcWeeksInvOnHand(l1_fgInvenR, l1_aveWeeklySales, 'weeksInvenOnHand')
  const l2_weeksInvOnHand = calcWeeksInvOnHand(l2_fgInvenR, l2_aveWeeklySales, 'weeksInvenOnHand')
  const l3_weeksInvOnHand = config.l3_field ? calcWeeksInvOnHand(l3_fgInvenR, l3_aveWeeklySales, 'weeksInvenOnHand') : [] 
  const l4_weeksInvOnHand = config.l4_field ? calcWeeksInvOnHand(l4_fgInvenR, l4_aveWeeklySales, 'weeksInvenOnHand') : [] 
  
  /* INVENTORY AVAILABLE */
  const l0_invAvailable = calcInventoryAvailable(l0_fgInvenR, l0_fgPoR, l0_soR, 'invenAvailable')
  const l1_invAvailable = calcInventoryAvailable(l1_fgInvenR, l1_fgPoR, l1_soR, 'invenAvailable')
  const l2_invAvailable = calcInventoryAvailable(l2_fgInvenR, l2_fgPoR, l2_soR, 'invenAvailable')
  const l3_invAvailable = config.l3_field ? calcInventoryAvailable(l3_fgInvenR, l3_fgPoR, l3_soR, 'invenAvailable') : []
  const l4_invAvailable = config.l4_field ? calcInventoryAvailable(l4_fgInvenR, l4_fgPoR, l4_soR, 'invenAvailable') : []

  ///////////////////////////////// ROWS
  const rowsFourthLevelDetail =  config.l4_field ? () => {return getRowsFourthLevelDetail(config, start, end)} : skip() 
  const rowsThirdLevelDetail =  config.l3_field ? () => {return getRowsThirdLevelDetail(config, start, end)} : skip() 
  const rowsSecondLevelDetail = () => {return getRowsSecondLevelDetail(config, start, end)} 
  const rowsFirstLevelDetail = () => {return getRowsFirstLevelDetail(config, start, end)} 

  const [rowsFourthLevelDetailR, rowsThirdLevelDetailR, rowsSecondLevelDetailR, rowsFirstLevelDetailR] = await Promise.all([
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
      datalevel: 0,
      itemtype: config.itemType,
    },
  ]

  // COMPILE FINAL ROW TEMPLATE

  const rowTemplate = sortRowTemplate([...rowsFourthLevelDetailR, ...rowsThirdLevelDetailR, ...rowsSecondLevelDetailR, ...rowsFirstLevelDetailR])
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
  } else {
    // 4 LEVEL REPORT
    mapSalesToRowTemplates = mapSalesToRowTemplates_fourLevel
    mapInvenToRowTemplates = mapInvenToRowTemplates_fourLevel
    rowTemplate_unflat = unflattenByCompositKey(rowTemplate, { 1: 'l1_label', 2: 'l2_label', 3: 'l3_label', 4: 'l4_label' }) 
    level = 4
  }


  const mappedSales = mapSalesToRowTemplates(
    [
      ...l0_salesByCalMoR,
    ...l1_salesByCalMoR,
    ...l2_salesByCalMoR,
    ...l3_salesByCalMoR,
    ...l4_salesByCalMoR,
    ...l0_salesCalMoToDateR,
    ...l1_salesCalMoToDateR,
    ...l2_salesCalMoToDateR,
    ...l3_salesCalMoToDateR,
    ...l4_salesCalMoToDateR,
      ...l1_salesProjectionBywkR,
      ...l2_salesProjectionBywkR,
      ...l3_salesProjectionBywkR,
      ...l4_salesProjectionBywkR,
      ...l0_salesProjectionBywkR,
      ...l1_salesProjectionPeriodToDateR,
      ...l2_salesProjectionPeriodToDateR,
      ...l3_salesProjectionPeriodToDateR,
      ...l4_salesProjectionPeriodToDateR,
      ...l0_salesProjectionPeriodToDateR,
      ...l1_salesByWkR,
      ...l2_salesByWkR,
      ...l3_salesByWkR,
      ...l4_salesByWkR,
      ...l0_salesByWkR,
      ...l1_salesPeriodToDateR,
      ...l2_salesPeriodToDateR,
      ...l3_salesPeriodToDateR,
      ...l4_salesPeriodToDateR,
      ...l0_salesPeriodToDateR,
      ...l1_soR,
      ...l2_soR,
      ...l3_soR,
      ...l4_soR,
      ...l0_soR,
      // ...l1_soTaggedR,
      // ...l2_soTaggedR,
      // ...l3_soTaggedR,
      // ...l4_soTaggedR,
      // ...l0_soTaggedR,
      ...l1_soUntaggedR,
      ...l2_soUntaggedR,
      ...l3_soUntaggedR,
      ...l4_soUntaggedR,
      ...l0_soUntaggedR,
      ...l1_so_byWkR,
      ...l2_so_byWkR,
      ...l3_so_byWkR,
      ...l4_so_byWkR,
      ...l0_so_byWkR,
      // ...l1_soTagged_byWkR,
      // ...l2_soTagged_byWkR,
      // ...l3_soTagged_byWkR,
      // ...l4_soTagged_byWkR,
      // ...l0_soTagged_byWkR,
      ...l1_soUntagged_byWkR,
      ...l2_soUntagged_byWkR,
      ...l3_soUntagged_byWkR,
      ...l4_soUntagged_byWkR,
      ...l0_soUntagged_byWkR,
      ...l1_salesByFyR,
      ...l2_salesByFyR,
      ...l3_salesByFyR,
      ...l4_salesByFyR,
      ...l0_salesByFyR,
      ...l1_salesByFyYtdR,
      ...l2_salesByFyYtdR,
      ...l3_salesByFyYtdR,
      ...l4_salesByFyYtdR,
      ...l0_salesByFyYtdR,
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
      ...l1_fgInTransitR,
      ...l2_fgInTransitR,
      ...l3_fgInTransitR,
      ...l4_fgInTransitR,
      ...l0_fgInTransitR,
      ...l1_fgAtLocR,
      ...l2_fgAtLocR,
      ...l3_fgAtLocR,
      ...l4_fgAtLocR,
      ...l0_fgAtLocR,
      ...l1_fgAtLoc_untaggedR,
      ...l2_fgAtLoc_untaggedR,
      ...l3_fgAtLoc_untaggedR,
      ...l4_fgAtLoc_untaggedR,
      ...l0_fgAtLoc_untaggedR,
      // ...l1_fgAtLoc_taggedR,
      // ...l2_fgAtLoc_taggedR,
      // ...l3_fgAtLoc_taggedR,
      // ...l4_fgAtLoc_taggedR,
      // ...l0_fgAtLoc_taggedR,
      ...l1_fgPoR,
      ...l2_fgPoR,
      ...l3_fgPoR,
      ...l4_fgPoR,
      ...l0_fgPoR,
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

  /* Build Columns */
  const trendColsSalesF = !config.trends.fiscalWeeks ? skip() : () => {return  getDateEndPerWeekByRange(start, end, config)}
  const trendColsSalesProjF = !config.views.useProjection ? skip() : () => {return  getDateEndPerWeekByRange_pj(start, end, config)}
  const trendColsSaByFyF = !config.trends.fyFullYear ? skip() : () => {return getFiscalYearCols()} 
  const trendColsSaByFyYtdF = !config.trends.fyYtd ? skip() : () => {return  getFiscalYearYtdCols()}
  const trendColsCalMoByRangeF = !config.trends.calMonths ? skip() : () => {return  getCalMonthByRange(start, end, config)}

  // get so by week cols
  const start_so = await getEarliestShipWk(config)
  const end_so = await getLatestShipWk(config) // NEED A MAX RANGE HERE !!!!!!!!!! SLS PERSON ACCIDENTALLY ENTERED 2031 INTO A SO AN FRONT END CRASHED
  const trendColsSoF = () => {return  getDateEndPerWeekByRange_so(start_so, end_so, config)}
  const trendColsSo_tgF = () => {return  getDateEndPerWeekByRange_so_tg(start_so, end_so, config)}
  const trendColsSo_untgF = () => {return  getDateEndPerWeekByRange_so_untg(start_so, end_so, config)}


  // Call all column functions
  const [
    trendColsSalesProj, 
    trendColsSales, 
    trendColsSaByFy, 
    trendColsSaByFyYtd, 
    trendColsSo, 
    trendColsSo_tg, 
    trendColsSo_untg,
    trendColsCalMo
  ] = await Promise.all([
    trendColsSalesProjF(), 
    trendColsSalesF(), 
    trendColsSaByFyF(),
    trendColsSaByFyYtdF(), 
    trendColsSoF(), 
    trendColsSo_tgF(), 
    trendColsSo_untgF(),
    trendColsCalMoByRangeF(),
  ])
  
  // Send only sales or projection cols:

  //config.views.useProjection ? delete columnConfigs.totalsCol : delete columnConfigs.salesProjectionCol

  return {
    data,
    cols: {
      trendColsCalMo,
      trendColsSalesProj, // Only include if projection is checked
      trendColsSales,
      trendColsSaByFy,
      trendColsSaByFyYtd,
      labelCols,
      trendColsSo,
      trendColsSo_tg,
      trendColsSo_untg,
      columnConfigs,
      defaultTrend: {
        dataName: config.views.useProjection ? columnConfigs.salesProjectionCol[0].dataName : columnConfigs.totalsCol[0].dataName,
        colType: config.views.useProjection ? columnConfigs.salesProjectionCol[0].colType : columnConfigs.totalsCol[0].colType
      }
    },
  }
}

module.exports = buildReport
