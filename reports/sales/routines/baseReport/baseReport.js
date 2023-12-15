const m = require('./import')

const buildReport = async (config) => {
  // The routine and all of the queries can be the same for all reports. Going to buikd out this rpeort and then change the config manually to test.

  const skip = () => {
    return () => {
      return []
    }
  }

  ///////////////////////////////// INVENTORY DATA

  const l0_Inv = () => {return m.l0_getInv(config)} 
  const l1_Inv = () => {return m.l1_getInv(config)} 
  const l2_Inv = () => {return m.l2_getInv(config)} 
  const l3_Inv = config.baseFormat.l3_field ? () => {return m.l3_getInv(config)}: skip() 
  const l4_Inv = config.baseFormat.l4_field ? () => {return m.l4_getInv(config)}: skip() 
  const l5_Inv = config.baseFormat.l5_field ? () => {return m.l5_getInv(config)}: skip() 

  ///////////////////////////////// PURCHASE DATA

  const l0_OpenPo = () => {return m.l0_getOpenPo(config)}
  const l1_OpenPo = () => {return m.l1_getOpenPo(config)}
  const l2_OpenPo = () => {return m.l2_getOpenPo(config)}
  const l3_OpenPo =  config.baseFormat.l3_field ? () => {return m.l3_getOpenPo(config)} : skip()
  const l4_OpenPo =  config.baseFormat.l4_field ? () => {return m.l4_getOpenPo(config)} : skip()
  const l5_OpenPo =  config.baseFormat.l5_field ? () => {return m.l5_getOpenPo(config)} : skip()
  
  ///////////////////////////////// SALES ORDERS

  const l0_so = () => {return m.l0_getSo(config)}
  const l1_so = () => {return m.l1_getSo(config)}
  const l2_so = () => {return m.l2_getSo(config)}
  const l3_so =  config.baseFormat.l3_field ? () => {return m.l3_getSo(config)} : skip()
  const l4_so =  config.baseFormat.l4_field ? () => {return m.l4_getSo(config)} : skip()
  const l5_so =  config.baseFormat.l5_field ? () => {return m.l5_getSo(config)} : skip()
  
  const l0_soTrend = !config.trends.queryGrouping ? skip() : () => {return m.l0_getSoTrend(config)}
  const l1_soTrend = !config.trends.queryGrouping ? skip() : () => {return m.l1_getSoTrend(config)}
  const l2_soTrend = !config.trends.queryGrouping ? skip() : () => {return m.l2_getSoTrend(config)}
  const l3_soTrend = !config.trends.queryGrouping ? skip() : config.baseFormat.l3_field ? () => {return m.l3_getSoTrend(config)} : skip()
  const l4_soTrend = !config.trends.queryGrouping ? skip() : config.baseFormat.l4_field ? () => {return m.l4_getSoTrend(config)} : skip()
  const l5_soTrend = !config.trends.queryGrouping ? skip() : config.baseFormat.l5_field ? () => {return m.l5_getSoTrend(config)} : skip()

  // ///////////////////////////////// SALES DATA

  /*SALES*/

  const l0_salesTotalPrimary =  () => {return m.l0_getSalesTotalPrimary(config)}
  const l1_salesTotalPrimary =  () => {return m.l1_getSalesTotalPrimary(config)}
  const l2_salesTotalPrimary =  () => {return m.l2_getSalesTotalPrimary(config)}
  const l3_salesTotalPrimary =  config.baseFormat.l3_field ? () => {return m.l3_getSalesTotalPrimary(config)} : skip()
  const l4_salesTotalPrimary =  config.baseFormat.l4_field ? () => {return m.l4_getSalesTotalPrimary(config)} : skip()
  const l5_salesTotalPrimary =  config.baseFormat.l5_field ? () => {return m.l5_getSalesTotalPrimary(config)} : skip()
  
  // TRENDS
  const l0_salesTrend = !config.trends.queryGrouping ? skip() : () => {return m.l0_getSalesTrend(config)}
  const l1_salesTrend = !config.trends.queryGrouping ? skip() : () => {return m.l1_getSalesTrend(config)}
  const l2_salesTrend = !config.trends.queryGrouping ? skip() : () => {return m.l2_getSalesTrend(config)}
  const l3_salesTrend = !config.trends.queryGrouping ? skip() : config.baseFormat.l3_field ? () => {return m.l3_getSalesTrend(config)} : skip()
  const l4_salesTrend = !config.trends.queryGrouping ? skip() : config.baseFormat.l4_field ? () => {return m.l4_getSalesTrend(config)} : skip()
  const l5_salesTrend = !config.trends.queryGrouping ? skip() : config.baseFormat.l5_field ? () => {return m.l5_getSalesTrend(config)} : skip()

  const [
    l1_InvR,
    l2_InvR,
    l3_InvR,
    l4_InvR,
    l5_InvR,
    l0_InvR,
    l1_OpenPoR,
    l2_OpenPoR,
    l3_OpenPoR,
    l4_OpenPoR,
    l5_OpenPoR,
    l0_OpenPoR,
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
    l1_Inv(),
    l2_Inv(),
    l3_Inv(),
    l4_Inv(),
    l5_Inv(),
    l0_Inv(),
    l1_OpenPo(),
    l2_OpenPo(),
    l3_OpenPo(),
    l4_OpenPo(),
    l5_OpenPo(),
    l0_OpenPo(),
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

  const companyTotalSales = () => {return m.getCompanyTotalSales(config)}
  const programTotalSales = () => {return m.getProgramTotalSales(config)}
  const speciesGroupTotalSales = () => {return m.getSpeciesGroupTotalSales(config.totals.startDatePrimary, config.totals.endDatePrimary, config)}

  const l0_trailingTwoWeek = config.totals.endWeekPrimary < 2 ? skip() : () => {return m.l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')}
  const l1_trailingTwoWeek = config.totals.endWeekPrimary < 2 ? skip() : () => {return m.l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')}
  const l2_trailingTwoWeek = config.totals.endWeekPrimary < 2 ? skip() : () => {return m.l2_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')}
  const l3_trailingTwoWeek = config.totals.endWeekPrimary < 2 ? skip() : config.baseFormat.l3_field ? () => {return m.l3_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')} : skip() 
  const l4_trailingTwoWeek = config.totals.endWeekPrimary < 2 ? skip() : config.baseFormat.l4_field ? () => {return m.l4_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')} : skip() 
  const l5_trailingTwoWeek = config.totals.endWeekPrimary < 2 ? skip() : config.baseFormat.l5_field ? () => {return m.l5_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')} : skip() 
  
  const l0_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : () => {return m.l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')}
  const l1_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : () => {return m.l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')}
  const l2_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : () => {return m.l2_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')}
  const l3_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : config.baseFormat.l3_field ? () => {return m.l3_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')} : skip() 
  const l4_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : config.baseFormat.l4_field ? () => {return m.l4_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')} : skip() 
  const l5_trailingFourWeek = config.totals.endWeekPrimary < 4 ? skip() : config.baseFormat.l5_field ? () => {return m.l5_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')} : skip() 

  const l0_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : () => {return m.l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')}
  const l1_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : () => {return m.l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')}
  const l2_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : () => {return m.l2_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')}
  const l3_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : config.baseFormat.l3_field ? () => {return m.l3_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')} : skip() 
  const l4_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : config.baseFormat.l4_field ? () => {return m.l4_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')} : skip() 
  const l5_trailingEightWeek = config.totals.endWeekPrimary < 8 ? skip() : config.baseFormat.l5_field ? () => {return m.l5_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')} : skip() 

  const l0_trailingTwelveWeek = config.totals.endWeekPrimary < 12 ? skip() : () => {return m.l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')}
  const l1_trailingTwelveWeek = config.totals.endWeekPrimary < 12 ? skip() : () => {return m.l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')}
  const l2_trailingTwelveWeek = config.totals.endWeekPrimary < 12 ? skip() : () => {return m.l2_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')}
  const l3_trailingTwelveWeek = config.totals.endWeekPrimary < 12 ? skip() : config.baseFormat.l3_field ? () => {return m.l3_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')} : skip() 
  const l4_trailingTwelveWeek = config.totals.endWeekPrimary < 12  ? skip() : config.baseFormat.l4_field ? () => {return m.l4_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')} : skip() 
  const l5_trailingTwelveWeek = config.totals.endWeekPrimary < 12  ? skip() : config.baseFormat.l5_field ? () => {return m.l5_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')} : skip() 
  
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
  let l0_reportSales = l0_salesPeriodToDateR
  let l1_reportSales = l1_salesPeriodToDateR
  let l2_reportSales = l2_salesPeriodToDateR
  let l3_reportSales = l3_salesPeriodToDateR
  let l4_reportSales = l4_salesPeriodToDateR
  let l5_reportSales = l5_salesPeriodToDateR

  /* % YoY YTD SALES */
  const l0_yoyYtd_companySales = !config.trends.fyYtd ? [] : m.calcYoyYtdSalesCol(l0_salesByFyYtdR, 'yoyYtdSales')
  const l1_yoyYtd_companySales = !config.trends.fyYtd ? [] : m.calcYoyYtdSalesCol(l1_salesByFyYtdR, 'yoyYtdSales')
  const l2_yoyYtd_companySales = !config.trends.fyYtd ? [] : m.calcYoyYtdSalesCol(l2_salesByFyYtdR, 'yoyYtdSales')
  const l3_yoyYtd_companySales = !config.trends.fyYtd ? [] : config.baseFormat.l3_field ? m.calcYoyYtdSalesCol(l3_salesByFyYtdR, 'yoyYtdSales') : [] 
  const l4_yoyYtd_companySales = !config.trends.fyYtd ? [] : config.baseFormat.l4_field ? m.calcYoyYtdSalesCol(l4_salesByFyYtdR, 'yoyYtdSales') : [] 
  const l5_yoyYtd_companySales = !config.trends.fyYtd ? [] : config.baseFormat.l5_field ? m.calcYoyYtdSalesCol(l5_salesByFyYtdR, 'yoyYtdSales') : [] 

  /* % COMPANY SALES */
  const l0_percent_companySales = m.calcPercentSalesCol(companyTotalSalesR, l0_reportSales, 'percentCompanySales')
  const l1_percent_companySales = m.calcPercentSalesCol(companyTotalSalesR, l1_reportSales, 'percentCompanySales')
  const l2_percent_companySales = m.calcPercentSalesCol(companyTotalSalesR, l2_reportSales, 'percentCompanySales')
  const l3_percent_companySales = config.baseFormat.l3_field ? m.calcPercentSalesCol(companyTotalSalesR, l3_reportSales, 'percentCompanySales') : [] 
  const l4_percent_companySales = config.baseFormat.l4_field ? m.calcPercentSalesCol(companyTotalSalesR, l4_reportSales, 'percentCompanySales') : [] 
  const l5_percent_companySales = config.baseFormat.l5_field ? m.calcPercentSalesCol(companyTotalSalesR, l5_reportSales, 'percentCompanySales') : [] 

  /* % PROGRAM SALES */
  const l0_percent_programSales = !config.baseFilters.program ? [] : m.calcPercentSalesCol(programTotalSalesR, l0_reportSales, 'percentProgramSales')
  const l1_percent_programSales = !config.baseFilters.program ? [] : m.calcPercentSalesCol(programTotalSalesR, l1_reportSales, 'percentProgramSales')
  const l2_percent_programSales = !config.baseFilters.program ? [] : m.calcPercentSalesCol(programTotalSalesR, l2_reportSales, 'percentProgramSales')
  const l3_percent_programSales = !config.baseFilters.program || !config.baseFormat.l3_field ? [] : m.calcPercentSalesCol(programTotalSalesR, l3_reportSales, 'percentProgramSales')
  const l4_percent_programSales = !config.baseFilters.program || !config.baseFormat.l4_field ? [] : m.calcPercentSalesCol(programTotalSalesR, l4_reportSales, 'percentProgramSales') 
  const l5_percent_programSales = !config.baseFilters.program || !config.baseFormat.l5_field ? [] : m.calcPercentSalesCol(programTotalSalesR, l5_reportSales, 'percentProgramSales') 

  /* % SPECIES GROUP SALES */
  // look up species group based on program
  const l0_percent_speciesGroupSales = !config.baseFilters.program ? [] : m.calcPercentSalesCol(speciesGroupTotalSalesR[0], l0_reportSales, 'percentSpeciesGroupSales')
  const l1_percent_speciesGroupSales = !config.baseFilters.program ? [] : m.calcPercentSalesCol(speciesGroupTotalSalesR[0], l1_reportSales, 'percentSpeciesGroupSales') 
  const l2_percent_speciesGroupSales = !config.baseFilters.program ? [] : m.calcPercentSalesCol(speciesGroupTotalSalesR[0], l2_reportSales, 'percentSpeciesGroupSales') 
  const l3_percent_speciesGroupSales = !config.baseFilters.program || !config.baseFormat.l3_field ? [] : m.calcPercentSalesCol(speciesGroupTotalSalesR[0], l3_reportSales, 'percentSpeciesGroupSales')
  const l4_percent_speciesGroupSales = !config.baseFilters.program || !config.baseFormat.l4_field ? [] : m.calcPercentSalesCol(speciesGroupTotalSalesR[0], l4_reportSales, 'percentSpeciesGroupSales')
  const l5_percent_speciesGroupSales = !config.baseFilters.program || !config.baseFormat.l5_field ? [] : m.calcPercentSalesCol(speciesGroupTotalSalesR[0], l5_reportSales, 'percentSpeciesGroupSales')
 
  /* % REPORT TOTAL */
  const l0_percent_reportTotal = m.calcPercentSalesCol(l0_reportSales[0], l0_reportSales, 'percentReportTotal')
  const l1_percent_reportTotal = m.calcPercentSalesCol(l0_reportSales[0], l1_reportSales, 'percentReportTotal')
  const l2_percent_reportTotal = m.calcPercentSalesCol(l0_reportSales[0], l2_reportSales, 'percentReportTotal')
  const l3_percent_reportTotal = config.baseFormat.l3_field ? m.calcPercentSalesCol(l0_reportSales[0], l3_reportSales, 'percentReportTota') : [] 
  const l4_percent_reportTotal = config.baseFormat.l4_field ? m.calcPercentSalesCol(l0_reportSales[0], l4_reportSales, 'percentReportTota') : [] 
  const l5_percent_reportTotal = config.baseFormat.l5_field ? m.calcPercentSalesCol(l0_reportSales[0], l5_reportSales, 'percentReportTota') : [] 
  
  /* AVE WEEKLY SALES */
  const weeks = config.totals.endWeekPrimary - config.totals.startWeekPrimary + 1
  const l0_aveWeeklySales = m.calcAveWeeklySales(l0_reportSales, 'aveWeeklySales', weeks)
  const l1_aveWeeklySales = m.calcAveWeeklySales(l1_reportSales, 'aveWeeklySales', weeks)
  const l2_aveWeeklySales = m.calcAveWeeklySales(l2_reportSales, 'aveWeeklySales', weeks)
  const l3_aveWeeklySales = config.baseFormat.l3_field ? m.calcAveWeeklySales(l3_reportSales, 'aveWeeklySales', weeks) : []
  const l4_aveWeeklySales = config.baseFormat.l4_field ? m.calcAveWeeklySales(l4_reportSales, 'aveWeeklySales', weeks) : []
  const l5_aveWeeklySales = config.baseFormat.l5_field ? m.calcAveWeeklySales(l5_reportSales, 'aveWeeklySales', weeks) : []

  const l0_twoWkAveSales = m.calcAveWeeklySales(l0_trailingTwoWeekR, 'twoWkAveSales', 2)
  const l1_twoWkAveSales = m.calcAveWeeklySales(l1_trailingTwoWeekR, 'twoWkAveSales', 2)
  const l2_twoWkAveSales = m.calcAveWeeklySales(l2_trailingTwoWeekR, 'twoWkAveSales', 2)
  const l3_twoWkAveSales = config.baseFormat.l3_field ? m.calcAveWeeklySales(l3_trailingTwoWeekR, 'twoWkAveSales', 2) : []
  const l4_twoWkAveSales = config.baseFormat.l4_field ? m.calcAveWeeklySales(l4_trailingTwoWeekR, 'twoWkAveSales', 2) : []
  const l5_twoWkAveSales = config.baseFormat.l5_field ? m.calcAveWeeklySales(l5_trailingTwoWeekR, 'twoWkAveSales', 2) : []

  const l0_fourWkAveSales = m.calcAveWeeklySales(l0_trailingFourWeekR, 'fourWkAveSales', 4)
  const l1_fourWkAveSales = m.calcAveWeeklySales(l1_trailingFourWeekR, 'fourWkAveSales', 4)
  const l2_fourWkAveSales = m.calcAveWeeklySales(l2_trailingFourWeekR, 'fourWkAveSales', 4)
  const l3_fourWkAveSales = config.baseFormat.l3_field ? m.calcAveWeeklySales(l3_trailingFourWeekR, 'fourWkAveSales', 4) : []
  const l4_fourWkAveSales = config.baseFormat.l4_field ? m.calcAveWeeklySales(l4_trailingFourWeekR, 'fourWkAveSales', 4) : []
  const l5_fourWkAveSales = config.baseFormat.l5_field ? m.calcAveWeeklySales(l5_trailingFourWeekR, 'fourWkAveSales', 4) : []
  
  const l0_eightWkAveSales = m.calcAveWeeklySales(l0_trailingEightWeekR, 'eightWkAveSales', 8)
  const l1_eightWkAveSales = m.calcAveWeeklySales(l1_trailingEightWeekR, 'eightWkAveSales', 8)
  const l2_eightWkAveSales = m.calcAveWeeklySales(l2_trailingEightWeekR, 'eightWkAveSales', 8)
  const l3_eightWkAveSales = config.baseFormat.l3_field ? m.calcAveWeeklySales(l3_trailingEightWeekR, 'eightWkAveSales', 8) : []
  const l4_eightWkAveSales = config.baseFormat.l4_field ? m.calcAveWeeklySales(l4_trailingEightWeekR, 'eightWkAveSales', 8) : []
  const l5_eightWkAveSales = config.baseFormat.l5_field ? m.calcAveWeeklySales(l5_trailingEightWeekR, 'eightWkAveSales', 8) : []
  
  const l0_twelveWkAveSales = m.calcAveWeeklySales(l0_trailingTwelveWeekR, 'twelveWkAveSales', 12)
  const l1_twelveWkAveSales = m.calcAveWeeklySales(l1_trailingTwelveWeekR, 'twelveWkAveSales', 12)
  const l2_twelveWkAveSales = m.calcAveWeeklySales(l2_trailingTwelveWeekR, 'twelveWkAveSales', 12)
  const l3_twelveWkAveSales = config.baseFormat.l3_field ? m.calcAveWeeklySales(l3_trailingTwelveWeekR, 'twelveWkAveSales', 12) : []
  const l4_twelveWkAveSales = config.baseFormat.l4_field ? m.calcAveWeeklySales(l4_trailingTwelveWeekR, 'twelveWkAveSales', 12) : []
  const l5_twelveWkAveSales = config.baseFormat.l5_field ? m.calcAveWeeklySales(l5_trailingTwelveWeekR, 'twelveWkAveSales', 12) : []
  
  /* MOMENTUM */
  const l0_momentum = m.calcMomentum(l0_fourWkAveSales, l0_twelveWkAveSales, 'momentum')
  const l1_momentum = m.calcMomentum(l1_fourWkAveSales, l1_twelveWkAveSales, 'momentum')
  const l2_momentum = m.calcMomentum(l2_fourWkAveSales, l2_twelveWkAveSales, 'momentum')
  const l3_momentum = m.calcMomentum(l3_fourWkAveSales, l3_twelveWkAveSales, 'momentum')
  const l4_momentum = m.calcMomentum(l4_fourWkAveSales, l4_twelveWkAveSales, 'momentum')
  const l5_momentum = m.calcMomentum(l5_fourWkAveSales, l5_twelveWkAveSales, 'momentum')

  /* WEEKS INV ON HAND */
  const l0_weeksInvOnHand = m.calcWeeksInvOnHand(l0_InvR, l0_aveWeeklySales, 'weeksInvenOnHand')
  const l1_weeksInvOnHand = m.calcWeeksInvOnHand(l1_InvR, l1_aveWeeklySales, 'weeksInvenOnHand')
  const l2_weeksInvOnHand = m.calcWeeksInvOnHand(l2_InvR, l2_aveWeeklySales, 'weeksInvenOnHand')
  const l3_weeksInvOnHand = config.baseFormat.l3_field ? m.calcWeeksInvOnHand(l3_InvR, l3_aveWeeklySales, 'weeksInvenOnHand') : [] 
  const l4_weeksInvOnHand = config.baseFormat.l4_field ? m.calcWeeksInvOnHand(l4_InvR, l4_aveWeeklySales, 'weeksInvenOnHand') : [] 
  const l5_weeksInvOnHand = config.baseFormat.l5_field ? m.calcWeeksInvOnHand(l5_InvR, l5_aveWeeklySales, 'weeksInvenOnHand') : [] 
  
  /* INVENTORY AVAILABLE */
  const l0_invAvailable = m.calcInventoryAvailable(l0_InvR, l0_OpenPoR, l0_soR, 'invenAvailable')
  const l1_invAvailable = m.calcInventoryAvailable(l1_InvR, l1_OpenPoR, l1_soR, 'invenAvailable')
  const l2_invAvailable = m.calcInventoryAvailable(l2_InvR, l2_OpenPoR, l2_soR, 'invenAvailable')
  const l3_invAvailable = config.baseFormat.l3_field ? m.calcInventoryAvailable(l3_InvR, l3_OpenPoR, l3_soR, 'invenAvailable') : []
  const l4_invAvailable = config.baseFormat.l4_field ? m.calcInventoryAvailable(l4_InvR, l4_OpenPoR, l4_soR, 'invenAvailable') : []
  const l5_invAvailable = config.baseFormat.l5_field ? m.calcInventoryAvailable(l5_InvR, l5_OpenPoR, l5_soR, 'invenAvailable') : []

  ///////////////////////////////// ROWS
  const rowsFifthLevelDetail =  config.baseFormat.l5_field ? () => {return m.getRowsFifthLevelDetail(config)} : skip() 
  const rowsFourthLevelDetail =  config.baseFormat.l4_field ? () => {return m.getRowsFourthLevelDetail(config)} : skip() 
  const rowsThirdLevelDetail =  config.baseFormat.l3_field ? () => {return m.getRowsThirdLevelDetail(config)} : skip() 
  const rowsSecondLevelDetail = () => {return m.getRowsSecondLevelDetail(config)} 
  const rowsFirstLevelDetail = () => {return m.getRowsFirstLevelDetail(config)} 

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

  const rowTemplate = m.sortRowTemplate([...rowsFifthLevelDetailR, ...rowsFourthLevelDetailR, ...rowsThirdLevelDetailR, ...rowsSecondLevelDetailR, ...rowsFirstLevelDetailR])
  rowTemplate.push(...totalsRow)

  let keyMap = {}
  for (let i = 0; i < config.baseFilters.groupingLevel; i++) {
   // build composite key for unflatten:
   keyMap[i + 1] = `l${i + 1}_label`
  }
  // { 1: 'l1_label', 2: 'l2_label' }, { 1: 'l1_label', 2: 'l2_label', 3: 'l3_label' }
  console.log('keyMap', keyMap)
  const rowTemplate_unflat = m.unflattenByCompositKey(rowTemplate, keyMap) 


  /* Map data to row template */

    // map data into row template
    let mapSalesToRowTemplates = null
    let mapInvenToRowTemplates = null

  if (!config.baseFormat.l3_field) {
    // 2 LEVEL REPORT
    mapInvenToRowTemplates = m.mapInvenToRowTemplates_twoLevel
    mapSalesToRowTemplates = m.mapSalesToRowTemplates_twoLevel
  } else if (!config.baseFormat.l4_field) {
    // 3 LEVEL REPORT
    mapInvenToRowTemplates = m.mapInvenToRowTemplates_threeLevel
    mapSalesToRowTemplates = m.mapSalesToRowTemplates_threeLevel
  } else if (!config.baseFormat.l5_field) {
    // 4 LEVEL REPORT
    mapInvenToRowTemplates = m.mapInvenToRowTemplates_fourLevel
    mapSalesToRowTemplates = m.mapSalesToRowTemplates_fourLevel
  } else {
    // 5 LEVEL REPORT
    mapInvenToRowTemplates = m.mapInvenToRowTemplates_fiveLevel
    mapSalesToRowTemplates = m.mapSalesToRowTemplates_fiveLevel
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
      
    ], rowTemplate_unflat, config
  )

  const mappedInven = mapInvenToRowTemplates(
    [
      ...l1_InvR,
      ...l2_InvR,
      ...l3_InvR,
      ...l4_InvR,
      ...l5_InvR,
      ...l0_InvR,
      ...l1_OpenPoR,
      ...l2_OpenPoR,
      ...l3_OpenPoR,
      ...l4_OpenPoR,
      ...l5_OpenPoR,
      ...l0_OpenPoR,
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
    ], rowTemplate_unflat, config
  )

  const mappedData = m.combineMappedRows(mappedSales, mappedInven)
  const flattenedMappedData = Object.values(mappedData)
  const data = m.cleanLabelsForDisplay(flattenedMappedData, config)

  /* Trend Columns */
  
  const trendColsSalesF = !config.trends.queryGrouping ? skip() : () => {return  m.getTrendColsSales(config)}
  const trendColsSaByFyYtdF = !config.trends.fyYtd && !config.trends.fyFullYear ? skip() : () => {return  m.getTrendColsFiscalYear(config)}
 
  // get so by week cols
  const trendColsSoF = config.trends.queryGrouping ? () => {return  m.getTrendColsSo(config)} : skip() 
 
  // Call all column functions
  const [
    trendColsSales, 
    trendColsSo, 
  ] = await Promise.all([
    trendColsSalesF(), 
    trendColsSoF(), 
  ])
  
  let columnConfigsTagged = m.addDataToSalesTotalCol(config, m.columnConfigs) // adds startDate, endDate, and displayName to the sales totals col
  columnConfigsTagged = m.addDataToSoTotalCol(config, m.columnConfigs) // adds statDate, endDate, and displayName to the sales orders col
  columnConfigsTagged = m.addDataToSalesTrendCol(config,  m.columnConfigs) // adds useProjection data
  
  return {
    data,
    cols: {
      trendColsSales,
      labelCols: config.labelCols,
      trendColsSo,
      columnConfigs: columnConfigsTagged,
      defaultTrend: {
        dataName: m.columnConfigs.primarySalesTotalCol[0].dataName,
        colType: m.columnConfigs.primarySalesTotalCol[0].colType
      }
    },
  }
}

module.exports = buildReport
