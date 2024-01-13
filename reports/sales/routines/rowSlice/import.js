module.exports = {
  // Cols
  getColumns: require('../../data/baseCols/getColumns'),
  trendColsTemplate: require('../../data/baseCols/trendColsTemplate'),

  // Trend Cols
  getTrendColsSo: require('../../postgres/timeSeriesColHeadings/getTimeSeriesColsSo').getTrendColsSo,
  getTrendColsSales: require('../../postgres/timeSeriesColHeadings/getTimeSeriesColsSales').getTrendColsSales,

  // Sales Trend Primary
  l1_getSalesTrend: require('../../postgres/rowSlice/getSalesTrendProjection').l1_getSalesTrend,
  l0_getSalesTrend: require('../../postgres/rowSlice/getSalesTrendProjection').l0_getSalesTrend,

  // Sales Total Primary
  l1_getSales: require('../../postgres/rowSlice/getSalesProjection').l1_getSales,
  l0_getSales: require('../../postgres/rowSlice/getSalesProjection').l0_getSales,

  // Inv Data
  l1_getInven: require('../../postgres/rowSlice/getInven').l1_getInven,
  l0_getInven: require('../../postgres/rowSlice/getInven').l0_getInven,

  // KPI
  l0_getAveSales: require('../../postgres/kpi/getAveSales_trend').l0_getAveSales,
  l1_getAveSales: require('../../postgres/kpi/getAveSales_trend').l1_getAveSales,

  l0_getPercentSales: require('../../postgres/kpi/getPercentSales_trend').l0_getPercentSales,
  l1_getPercentSales: require('../../postgres/kpi/getPercentSales_trend').l1_getPercentSales,

  getCompanyTotalSales: require('../../postgres/kpi/getCompanyTotalSales'),
  getSpeciesGroupTotalSales: require('../../postgres/kpi/getSpeciesGroupTotalSales'),
  getProgramTotalSales: require('../../postgres/kpi/getProgramTotalSales'),
  getReportTotalSales: require('../../postgres/kpi/getReportTotalSales'),

  l0_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_slice').l0_getWeeksOnHand,
  l1_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_slice').l1_getWeeksOnHand,

  // PO Data

  l0_getOpenPo: require('../../postgres/rowSlice/getOpenPo').l0_getOpenPo,
  l1_getOpenPo: require('../../postgres/rowSlice/getOpenPo').l1_getOpenPo,

  // Sales Order Total Data

  l0_getSo: require('../../postgres/rowSlice/getSo').l0_getSo,
  l1_getSo: require('../../postgres/rowSlice/getSo').l1_getSo,

  // Sales Order Trend Data

  l0_getSoTrend: require('../../postgres/rowSlice/getSoTrend').l0_getSoTrend,
  l1_getSoTrend: require('../../postgres/rowSlice/getSoTrend').l1_getSoTrend,

  // Get Row Labels

  l0_getRowLabels: require('../../postgres/rowSlice/getRowLabels').l0_getRowLabels,
  l1_getRowLabels: require('../../postgres/rowSlice/getRowLabels').l1_getRowLabels,

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
