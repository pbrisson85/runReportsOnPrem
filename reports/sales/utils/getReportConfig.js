const appSettings = require('../data/filters/appSettings')
const unflattenByCompositKey = require('../../../models/unflattenByCompositKey')
const trendTypeOptions = require('../data/filters/trendType')
const getDefaults = require('./getReportDefaults')
const { getStartOfWeek } = require('../../../database/queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../../../database/queries/postgres/getWeekForDate')

const getReportConfig = async reqBody => {
  // auth filters:
  let jbBuyerFilter = false

  const hasAuthFilters = reqBody.creds?.filters?.length > 0
  if (hasAuthFilters) {
    jbBuyerFilter = reqBody.creds.filters.find(f => f.dataName === 'jbBuyer').mandatory
  } else {
    // check for front end option
    if (reqBody.dataFilters === 'jbBuyer') jbBuyerFilter = true
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
  if (new Date(trendEnd).getTime() <= new Date(totalsEnd).getTime()) {
    rowEnd = trendEnd
  } else {
    rowEnd = totalsEnd
  }

  // define config object
  let config = {
    program: typeof reqBody.program === 'undefined' ? null : reqBody.program === 'all' ? null : reqBody.program,
    l1_filter: reqBody.l1_filter ?? null,
    l2_filter: reqBody.l2_filter ?? null,
    l3_filter: reqBody.l3_filter ?? null,
    l4_filter: reqBody.l4_filter ?? null,
    l5_filter: reqBody.l5_filter ?? null,
    customer: reqBody.customer ?? null,
    item: reqBody.item ?? null,
    salesPerson: reqBody.salesPerson ?? null,
    country: reqBody.country ?? null,
    state: reqBody.state ?? null,
    export: reqBody.export ?? null,
    northAmerica: reqBody.northAmerica ?? null,
    queryLevel: reqBody.queryLevel ?? null,
    itemType: reqBody.itemType ?? ['FG', 'SECONDS'],
    freshFrozen: reqBody.freshFrozen ?? null,
    custType: reqBody.custType ?? null,
    speciesGroup: reqBody.speciesGroup ?? null,
    species: reqBody.species ?? null,
    programDrilldown: reqBody.programDrilldown ?? null,
    rows: {
      // Rows need to use the widest date range since the totals cols and the trend could differ in range
      startDate: rowStart,
      endDate: rowEnd,
    },
    trends: {
      fiscalWeeks: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'fiscalWeeks' ?? false,
      fiscalPeriods: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'fiscalPeriods' ?? false,
      fiscalQuarters: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'fiscalQuarters' ?? false,
      fyYtd: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'fyYtd' ?? false,
      fyFullYear: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'fyFullYear' ?? false,
      calMonths: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'calMonths' ?? false,
      calYtd: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'calYtd' ?? false,
      calFullYear: typeof reqBody.trendOption === 'undefined' ? false : reqBody.trendOption[0].dataName === 'calFullYear' ?? false,
      startDate: new Date(reqBody.trendStart?.date_start ?? periodStart),
      endDate: new Date(reqBody.trendEnd?.date_end ?? defaultEnd),
      useProjection: typeof reqBody.trendUseProjection === 'undefined' ? false : reqBody.trendUseProjection[0] ?? false,
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
      useProjection: typeof reqBody.totalsUseProjection === 'undefined' ? false : reqBody.totalsUseProjection[0] ?? false,
    },
    jbBuyerFilter,
    user: reqBody.user ?? null,
    subtotalRowFormats: {
      shiftTotals: reqBody.appSettings?.shiftTotals ?? appSettings_unflat['shiftTotals'].default,
      shiftTotalsCss: reqBody.appSettings?.shiftTotalsCss ?? appSettings_unflat['shiftTotalsCss'].default,
      dataLabelInSubtotals: reqBody.appSettings?.dataLabelInSubtotals ?? appSettings_unflat['dataLabelInSubtotals'].default,
      subtotalLabelInSubtotals: reqBody.appSettings?.subtotalLabelInSubtotals ?? appSettings_unflat['subtotalLabelInSubtotals'].default,
    },
  }

  switch (reqBody.reportFormat) {
    case 'typeSpecgroupFreeze':
      config = {
        l1_field: 'ms.item_type',
        l2_field: 'ms.species_group',
        l3_field: 'ms.program',
        l1_name: 'item type', // Used for filter labels on front end (when setting filters on right click to pass back)
        l2_name: 'species group', // Used for filter labels on front end
        l3_name: 'program',
        ...config,
      }

      break

    case 'speciesgroupProg':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
        l1_name: 'species group', // Used for filter labels on front end
        l2_name: 'program',
        ...config,
      }

      break

    case 'speciesgroupProgFrz':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
        l3_field: 'ms.fg_fresh_frozen',
        l1_name: 'species group', // Used for filter labels on front end
        l2_name: 'program',
        l3_name: 'fresh/frozen',
        ...config,
      }

      break

    case 'speciesgroupProgSpec':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
        l3_field: 'ms.species',
        l1_name: 'species group', // Used for filter labels on front end
        l2_name: 'program',
        l3_name: 'species',
        ...config,
      }

      break

    case 'speciesgroupBrandSkin':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.brand',
        l3_field: 'ms.fish_skin',
        l1_name: 'species group', // Used for filter labels on front end
        l2_name: 'brand',
        l3_name: 'skin',
        ...config,
      }
      break

    case 'speciesgroupSkinBrand':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.fish_skin',
        l3_field: 'ms.brand',
        l1_name: 'species group', // Used for filter labels on front end
        l2_name: 'skin',
        l3_name: 'brand',
        ...config,
      }
      break

    case 'speciesgroupFreeze':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.fg_fresh_frozen',
        l1_name: 'species group', // Used for filter labels on front end
        l2_name: 'fresh/frozen',
        ...config,
      }
      break

    case 'frzBrndSize':
      config = {
        l1_field: 'ms.fg_fresh_frozen',
        l2_field: 'ms.brand',
        l3_field: 'ms.size_name',
        l1_name: 'fresh/frozen', // Used for filter labels on front end
        l2_name: 'brand',
        l3_name: 'size',
        ...config,
      }
      break

    case 'frzBrndSoakSize':
      config = {
        l1_field: 'ms.fg_fresh_frozen',
        l2_field: 'ms.brand',
        l3_field: 'ms.fg_treatment',
        l4_field: 'ms.size_name',
        l1_name: 'fresh/frozen', // Used for filter labels on front end
        l2_name: 'brand',
        l3_name: 'soak',
        l4_name: 'size',
        ...config,
      }
      break

    case 'frzBrndSoakSizeItem':
      config = {
        l1_field: 'ms.fg_fresh_frozen',
        l2_field: 'ms.brand',
        l3_field: 'ms.fg_treatment',
        l4_field: 'ms.size_name',
        l5_field: 'ms.item_num',
        l1_name: 'fresh/frozen', // Used for filter labels on front end
        l2_name: 'brand',
        l3_name: 'soak',
        l4_name: 'size',
        l5_name: 'item',
        ...config,
      }
      break

    case 'frzSoakSize':
      config = {
        l1_field: 'ms.fg_fresh_frozen',
        l2_field: 'ms.fg_treatment',
        l3_field: 'ms.size_name',
        l1_name: 'fresh/frozen', // Used for filter labels on front end
        l2_name: 'soak',
        l3_name: 'size',
        ...config,
      }
      break

    case 'specBrndSize':
      config = {
        l1_field: 'ms.species',
        l2_field: 'ms.brand',
        l3_field: 'ms.size_name',
        l1_name: 'species', // Used for filter labels on front end
        l2_name: 'brand',
        l3_name: 'size',
        ...config,
      }
      break

    case 'specBrndSoakSize':
      config = {
        l1_field: 'ms.species',
        l2_field: 'ms.brand',
        l3_field: 'ms.fg_treatment',
        l4_field: 'ms.size_name',
        l1_name: 'species', // Used for filter labels on front end
        l2_name: 'brand',
        l3_name: 'soak',
        l4_name: 'size',
        ...config,
      }
      break

    case 'specSoakSize':
      config = {
        l1_field: 'ms.species',
        l2_field: 'ms.fg_treatment',
        l3_field: 'ms.size_name',
        l1_name: 'species', // Used for filter labels on front end
        l2_name: 'soak',
        l3_name: 'size',
        ...config,
      }
      break

    default:
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.fg_fresh_frozen',
        l1_name: 'species group', // Used for filter labels on front end
        l2_name: 'fresh/frozen',
        ...config,
      }
  }

  return config
}

module.exports = getReportConfig
