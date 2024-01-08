const appSettings = require('../filters/data/appSettings')
const unflattenByCompositKey = require('./unflattenByCompositKey')
const { getEarliestSoShipDate, getLatestSoShipDate } = require('./configHelpers/getSoDates')
const getBaseFormatDefault = require('./configHelpers/getBaseFormatDefault')
const getlabelCols = require('./configHelpers/getLabelCols')
const getUseProjection = require('./configHelpers/getUseProjection')
const { getInvenReportsGrouping, getInvenReportsAging } = require('./configHelpers/getInvenColOptions')
const getTrailingWeeks = require('./configHelpers/getTrailingWeeks')
const getQueryGrouping = require('./configHelpers/getQueryGrouping')
const getTrendDates = require('./configHelpers/getTrendDates')
const getDatesTotalsComparison = require('./configHelpers/getDatesTotalsComparison')
const getDatesTotalsPrimary = require('./configHelpers/getDatesTotalsPrimary')
const getRowDates = require('./configHelpers/getRowDates')
const getUserPermissions = require('./configHelpers/getUserPermissions')
const getTrailingWeeksForWeeksInven = require('./configHelpers/getTrailingWeeksForWeeksInven')
const getItemTypeDefaults = require('./configHelpers/getItemTypeDefaults')

const getReportConfig = async reqBody => {
  // get subtotalRowFormats defaults
  const appSettingsData = appSettings()
  const appSettings_unflat = unflattenByCompositKey(appSettingsData, { 1: 'dataName' })

  // The itemType comes from hardcoding a field into the rows and then passing back. Since it is an array truned into a string then it gets double quotes around it. This parses the strange format that postgres returns. Note that the total row gets entered into the row as an actual array which is why this is tested for a string.
  if (typeof reqBody.itemType !== 'undefined' && typeof reqBody.itemType === 'string') {
    reqBody.itemType = [...reqBody.itemType.replace(/""/g, '').replace(/"\[/g, '').replace(/\]"/g, '').split(',')]
  }

  let config = {
    module: reqBody.module, // note only sending this on initial request right now but want to use this to optionally create the config going forward
    baseConfig: reqBody, // pass back for slice and detail reports
    labelCols: getlabelCols(reqBody),
    baseFormat: {
      l1_field: reqBody.reportFormat?.l1_field ?? getBaseFormatDefault(reqBody.module).l1_field ?? null,
      l2_field: reqBody.reportFormat?.l2_field ?? getBaseFormatDefault(reqBody.module).l2_field ?? null,
      l3_field: reqBody.reportFormat?.l3_field ?? getBaseFormatDefault(reqBody.module).l3_field ?? null,
      l4_field: reqBody.reportFormat?.l4_field ?? getBaseFormatDefault(reqBody.module).l4_field ?? null,
      l5_field: reqBody.reportFormat?.l5_field ?? getBaseFormatDefault(reqBody.module).l5_field ?? null,
      l1_name: reqBody.reportFormat?.l1_name ?? getBaseFormatDefault(reqBody.module).l1_name ?? null,
      l2_name: reqBody.reportFormat?.l2_name ?? getBaseFormatDefault(reqBody.module).l2_name ?? null,
      l3_name: reqBody.reportFormat?.l3_name ?? getBaseFormatDefault(reqBody.module).l3_name ?? null,
      l4_name: reqBody.reportFormat?.l4_name ?? getBaseFormatDefault(reqBody.module).l4_name ?? null,
      l5_name: reqBody.reportFormat?.l5_name ?? getBaseFormatDefault(reqBody.module).l5_name ?? null,
      groupingLevel: reqBody.reportFormat?.groupingLevel ?? getBaseFormatDefault(reqBody.module).groupingLevel ?? null,
      dataName: reqBody.reportFormat?.dataName ?? getBaseFormatDefault(reqBody.module).dataName ?? null,
    },
    baseFilters: {
      queryLevel: reqBody.queryLevel ?? null,
      itemType: reqBody.itemType ?? getItemTypeDefaults(reqBody.module),
      program: typeof reqBody.program === 'undefined' ? null : reqBody.program === 'all' ? null : reqBody.program,
      l1_filter: reqBody.l1_filter ?? null,
      l2_filter: reqBody.l2_filter ?? null,
      l3_filter: reqBody.l3_filter ?? null,
      l4_filter: reqBody.l4_filter ?? null,
      l5_filter: reqBody.l5_filter ?? null,
    },
    trendFilters: {
      customer: reqBody.customer ?? null,
      item: reqBody.item ?? null,
      salesPerson: reqBody.salesPerson ?? null,
      country: reqBody.country ?? null,
      state: reqBody.state ?? null,
      export: reqBody.export ?? null,
      northAmerica: reqBody.northAmerica ?? null,
      freshFrozen: reqBody.freshFrozen ?? null,
      custType: reqBody.custType ?? null,
      speciesGroup: reqBody.speciesGroup ?? null,
      species: reqBody.species ?? null,
      program: reqBody.programDrilldown ?? null,
    },
    rows: await getRowDates(reqBody),
    salesOrders: {
      startDate: await getEarliestSoShipDate(reqBody.user),
      endDate: await getLatestSoShipDate(reqBody.user),
    },
    trends: {
      fiscalWeeks: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'fiscalWeeks' ?? false,
      fiscalPeriods: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'fiscalPeriods' ?? false,
      fiscalQuarters: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'fiscalQuarters' ?? false,
      fyYtd: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'fyYtd' ?? false,
      calMonths: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'calMonths' ?? false,
      calQuarters: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'calQuarters' ?? false,
      calYtd: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'calYtd' ?? false,
      ...(await getTrendDates(reqBody)),
      trendYears: typeof reqBody.trendYears === 'undefined' ? [] : reqBody.trendYears.map(yr => parseInt(yr)),
      useProjection: {
        sl: getUseProjection(reqBody.trendUseProjection).sl,
        so: getUseProjection(reqBody.trendUseProjection).so,
        pr: getUseProjection(reqBody.trendUseProjection).pr,
      },
      queryGrouping: getQueryGrouping(reqBody.trendQueryGrouping),
    },
    totals: {
      primary: await getDatesTotalsPrimary(reqBody),
      comparison: await getDatesTotalsComparison(reqBody),
      useProjection: {
        sl: getUseProjection(reqBody.totalsUseProjection).sl,
        so: getUseProjection(reqBody.totalsUseProjection).so,
        pr: getUseProjection(reqBody.totalsUseProjection).pr,
      },
    },
    trailingWeeks: await getTrailingWeeks(reqBody), // all trailing weeks kpi's
    trailingWeeksForWeeksInven: await getTrailingWeeksForWeeksInven(reqBody), // only weeks on hand which is hardcoded 12 weeks
    invenReportCols: {
      aging: getInvenReportsAging(reqBody),
      grouping: getInvenReportsGrouping(reqBody),
    },
    userPermissions: getUserPermissions(reqBody),
    user: reqBody.user ?? null,
    subtotalRowFormats: {
      shiftTotals: reqBody.appSettings?.shiftTotals ?? appSettings_unflat['shiftTotals'].default,
      shiftTotalsCss: reqBody.appSettings?.shiftTotalsCss ?? appSettings_unflat['shiftTotalsCss'].default,
      dataLabelInSubtotals: reqBody.appSettings?.dataLabelInSubtotals ?? appSettings_unflat['dataLabelInSubtotals'].default,
      subtotalLabelInSubtotals: reqBody.appSettings?.subtotalLabelInSubtotals ?? appSettings_unflat['subtotalLabelInSubtotals'].default,
    },
  }

  return config
}

module.exports = getReportConfig
