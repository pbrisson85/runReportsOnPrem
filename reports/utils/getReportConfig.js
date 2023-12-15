const appSettings = require('../filters/appSettings')
const unflattenByCompositKey = require('../models/unflattenByCompositKey')
const getDefaults = require('./getReportDefaults')
const { getStartOfWeek } = require('./configHelpers/getDateStartByWeek')
const { getWeekForDate } = require('./configHelpers/getWeekForDate')
const { getEarliestSoShipDate, getLatestSoShipDate } = require('./configHelpers/getSoDates')
const getBaseFormatDefault = require('./configHelpers/getBaseFormatDefault')
const getlabelCols = require('./configHelpers/getLabelCols')
const getUseProjection = require('./configHelpers/getUseProjection')

const getReportConfig = async reqBody => {
  // auth filters:
  let joeB = false

  const hasAuthFilters = reqBody.creds?.filters?.length > 0
  if (hasAuthFilters) {
    joeB = reqBody.creds.filters.find(f => f.dataName === 'jbBuyer').mandatory
  } else {
    // check for front end option
    if (reqBody.dataFilters === 'jbBuyer') joeB = true
  }

  // get subtotalRowFormats defaults
  const appSettingsData = appSettings()
  const appSettings_unflat = unflattenByCompositKey(appSettingsData, { 1: 'dataName' })

  // The itemType comes from hardcoding a field into the rows and then passing back. Since it is an array truned into a string then it gets double quotes around it. This parses the strange format that postgres returns. Note that the total row gets entered into the row as an actual array which is why this is tested for a string.
  if (typeof reqBody.itemType !== 'undefined' && typeof reqBody.itemType === 'string') {
    reqBody.itemType = [...reqBody.itemType.replace(/""/g, '').replace(/"\[/g, '').replace(/\]"/g, '').split(',')]
  }

  const { defaultStart, defaultEnd, defaultYear } = await getDefaults()
  const startOfWeek = await getStartOfWeek(defaultStart)
  const periodStart = startOfWeek[0].formatted_date_start

  const defaultStartWeek = await getWeekForDate(periodStart, reqBody.user) // Need to pass from front end
  const defaultEndWeek = await getWeekForDate(defaultEnd, reqBody.user) // Need to pass from front end

  // determine earliest start date for rows.
  const trendStart = new Date(reqBody.trendStart?.date_start ?? periodStart)
  const totalsStart = new Date(reqBody.totalsStart?.date_start ?? periodStart)

  let rowStart
  if (new Date(trendStart).getTime() <= new Date(totalsStart).getTime()) {
    rowStart = trendStart
  } else {
    rowStart = totalsStart
  }

  // determine latest end date for rows.
  const trendEnd = new Date(reqBody.trendEnd?.date_end ?? defaultEnd)
  const totalsEnd = new Date(reqBody.totalsEnd?.date_end ?? defaultEnd)

  let rowEnd
  if (new Date(trendEnd).getTime() >= new Date(totalsEnd).getTime()) {
    rowEnd = trendEnd
  } else {
    rowEnd = totalsEnd
  }

  // get so dates
  const start_so = await getEarliestSoShipDate(reqBody.user)
  const end_so = await getLatestSoShipDate(reqBody.user) // NEED A MAX RANGE HERE !!!!!!!!!! SLS PERSON ACCIDENTALLY ENTERED 2031 INTO A SO AN FRONT END CRASHED

  // define config object
  let config = {
    labelCols: getlabelCols(reqBody),
    baseFormat: {
      l1_field: reqBody.reportFormat?.l1_field ?? getBaseFormatDefault().l1_field ?? null,
      l2_field: reqBody.reportFormat?.l2_field ?? getBaseFormatDefault().l2_field ?? null,
      l3_field: reqBody.reportFormat?.l3_field ?? getBaseFormatDefault().l3_field ?? null,
      l4_field: reqBody.reportFormat?.l4_field ?? getBaseFormatDefault().l4_field ?? null,
      l5_field: reqBody.reportFormat?.l5_field ?? getBaseFormatDefault().l5_field ?? null,
      l1_name: reqBody.reportFormat?.l1_name ?? getBaseFormatDefault().l1_name ?? null,
      l2_name: reqBody.reportFormat?.l2_name ?? getBaseFormatDefault().l2_name ?? null,
      l3_name: reqBody.reportFormat?.l3_name ?? getBaseFormatDefault().l3_name ?? null,
      l4_name: reqBody.reportFormat?.l4_name ?? getBaseFormatDefault().l4_name ?? null,
      l5_name: reqBody.reportFormat?.l5_name ?? getBaseFormatDefault().l5_name ?? null,
      groupingLevel: reqBody.reportFormat?.groupingLevel ?? getBaseFormatDefault().groupingLevel ?? null,
    },
    baseFilters: {
      queryLevel: reqBody.queryLevel ?? null,
      itemType: reqBody.itemType ?? ['FG', 'SECONDS'], //<--- should put these defaults in the filter option and call here
      program: typeof reqBody.program === 'undefined' ? null : reqBody.program === 'all' ? null : reqBody.program,
      l1_filter: reqBody.l1_filter ?? null,
      l2_filter: reqBody.l2_filter ?? null,
      l3_filter: reqBody.l3_filter ?? null,
      l4_filter: reqBody.l4_filter ?? null,
      l5_filter: reqBody.l5_filter ?? null,
    },
    trendFilters: {
      // Note that these filters must be updated on the front end and in the right click menu array in baseCols
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
    rows: {
      // Rows need to use the widest date range since the totals cols and the trend could differ in range
      startDate: rowStart,
      endDate: rowEnd,
    },
    salesOrders: {
      startDate: start_so,
      endDate: end_so,
    },
    trends: {
      fiscalWeeks: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'fiscalWeeks' ?? false,
      fiscalPeriods: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'fiscalPeriods' ?? false,
      fiscalQuarters: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'fiscalQuarters' ?? false,
      fyYtd: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'fyYtd' ?? false,
      calMonths: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'calMonths' ?? false,
      calQuarters: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'calQuarters' ?? false,
      calYtd: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'calYtd' ?? false,
      startDate: new Date(reqBody.trendStart?.date_start ?? periodStart),
      endDate: new Date(reqBody.trendEnd?.date_end ?? defaultEnd),
      endWeek: typeof reqBody.trendEnd?.week === 'undefined' ? 0 : reqBody.trendEnd.week === '52' ? 53 : parseInt(reqBody.trendEnd.week),
      trendYears: typeof reqBody.trendYears === 'undefined' ? [] : reqBody.trendYears.map(yr => parseInt(yr)),
      useProjection: {
        sl: getUseProjection(reqBody.trendUseProjection).sl,
        so: getUseProjection(reqBody.trendUseProjection).so,
        pr: getUseProjection(reqBody.trendUseProjection).pr,
      },
      queryGrouping: typeof reqBody.trendQueryGrouping === 'undefined' ? false : reqBody.trendQueryGrouping[0],
    },
    totals: {
      // For now just going to assume that we are only getting the current year. Will need to determine the actual start and end based on the years in the array and the weeks, period, month, etc.
      startDatePrimary: new Date(reqBody.totalsStart?.date_start ?? periodStart),
      endDatePrimary: new Date(reqBody.totalsEnd?.date_end ?? defaultEnd),
      startWeekPrimary: defaultStartWeek,
      endWeekPrimary: defaultEndWeek,
      yearPrimary: typeof reqBody.totalsYears === 'undefined' ? defaultYear : reqBody.totalsYears[0],
      startDateComparison: new Date(reqBody.totalsStart?.date_start ?? periodStart),
      endDateComparison: new Date(reqBody.totalsEnd?.date_end ?? defaultEnd),
      yearComparison: typeof reqBody.totalsYears === 'undefined' ? defaultYear : reqBody.totalsYears[0],
      useProjection: {
        sl: getUseProjection(reqBody.totalsUseProjection).sl,
        so: getUseProjection(reqBody.totalsUseProjection).so,
        pr: getUseProjection(reqBody.totalsUseProjection).pr,
      },
    },
    userPermissions: {
      joeB,
    },
    user: reqBody.user ?? null,
    subtotalRowFormats: {
      shiftTotals: reqBody.appSettings?.shiftTotals ?? appSettings_unflat['shiftTotals'].default,
      shiftTotalsCss: reqBody.appSettings?.shiftTotalsCss ?? appSettings_unflat['shiftTotalsCss'].default,
      dataLabelInSubtotals: reqBody.appSettings?.dataLabelInSubtotals ?? appSettings_unflat['dataLabelInSubtotals'].default,
      subtotalLabelInSubtotals: reqBody.appSettings?.subtotalLabelInSubtotals ?? appSettings_unflat['subtotalLabelInSubtotals'].default,
    },
  }

  console.log('config', config)

  return config
}

module.exports = getReportConfig
