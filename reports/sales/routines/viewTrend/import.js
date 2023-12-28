module.exports = {
  // Cols
  columnConfigs: require('../../data/baseCols/columns'),
  trendColsTemplate: require('../../data/baseCols/trendColsTemplate'),

  // Trend Cols
  getTrendColsSo: require('../../postgres/trendColHeadings/getTrendColsSo').getTrendColsSo,
  getTrendColsSales: require('../../postgres/trendColHeadings/getTrendColsSales').getTrendColsSales,

  // Sales Trend Primary
  l1_getSalesTrend: require('../../postgres/viewTrend/getSalesTrendProjection').l1_getSalesTrend,
  l0_getSalesTrend: require('../../postgres/viewTrend/getSalesTrendProjection').l0_getSalesTrend,

  // Sales Total Primary
  l1_getSales: require('../../postgres/viewTrend/getSalesProjection').l1_getSales,
  l0_getSales: require('../../postgres/viewTrend/getSalesProjection').l0_getSales,

  // Inv Data
  l1_getInven: require('../../postgres/viewTrend/getInven').l1_getInven,
  l0_getInven: require('../../postgres/viewTrend/getInven').l0_getInven,

  // KPI
  l0_getAveSales: require('../../postgres/kpi/getAveSales_trend').l0_getAveSales,
  l1_getAveSales: require('../../postgres/kpi/getAveSales_trend').l1_getAveSales,

  l0_getPercentSales: require('../../postgres/kpi/getPercentSales_trend').l0_getPercentSales,
  l1_getPercentSales: require('../../postgres/kpi/getPercentSales_trend').l1_getPercentSales,

  getCompanyTotalSales: require('../../postgres/kpi/getCompanyTotalSales'),
  getSpeciesGroupTotalSales: require('../../postgres/kpi/getSpeciesGroupTotalSales'),
  getProgramTotalSales: require('../../postgres/kpi/getProgramTotalSales'),
  getReportTotalSales: require('../../postgres/kpi/getReportTotalSales'),

  // PO Data

  l0_getOpenPo: require('../../postgres/viewTrend/getOpenPo').l0_getOpenPo,
  l1_getOpenPo: require('../../postgres/viewTrend/getOpenPo').l1_getOpenPo,

  // Sales Order Total Data

  l0_getSo: require('../../postgres/viewTrend/getSo').l0_getSo,
  l1_getSo: require('../../postgres/viewTrend/getSo').l1_getSo,

  // Sales Order Trend Data

  l0_getSoTrend: require('../../postgres/viewTrend/getSoTrend').l0_getSoTrend,
  l1_getSoTrend: require('../../postgres/viewTrend/getSoTrend').l1_getSoTrend,

  // Get Row Labels

  l0_getRowLabels: require('../../postgres/viewTrend/getRowLabels').l0_getRowLabels,
  l1_getRowLabels: require('../../postgres/viewTrend/getRowLabels').l1_getRowLabels,

  // Model Functions

  sortRowTemplate: require('../../../utils/sortRowTemplate'),
  mapDataToRowTemplates: require('../../../utils/mapDataToRowTemplates'),
  cleanLabelsForDisplay: require('../../../utils/cleanLabelsForDisplay'),
  unflattenByCompositKey: require('../../../utils/unflattenByCompositKey'),
  calcYoyYtdSalesCol: require('../../models/calcYoyYtdSalesCol'),
  calcMomentum: require('../../models/calcMomentumSalesCol'),
  calcAveWeeklySales: require('../../models/calcAveWeeklySales'),
  calcWeeksInvOnHand: require('../../models/calcWeeksInvOnHand'),
  calcInventoryAvailable: require('../../models/calcInventoryAvailable'),

  addDataToSoTotalCol: require('../helpers/colDataHelper').addDataToSoTotalCol,
  addDataToSalesTotalCol: require('../helpers/colDataHelper').addDataToSalesTotalCol,
}
