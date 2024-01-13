module.exports = {
  // Cols
  getColumns: require('../../data/baseCols/getColumns'),
  trendColsTemplate: require('../../data/baseCols/trendColsTemplate'),

  // Trend Cols
  getTrendColsSales: require('../../postgres/timeSeriesColHeadings/getTimeSeriesColsSales').getTrendColsSales,
  getTrendColsSo: require('../../postgres/timeSeriesColHeadings/getTimeSeriesColsSo').getTrendColsSo,

  // Sales Trend Primary
  l1_getSalesTrend: require('../../postgres/baseReport/getSalesTrendProjection').l1_getSalesTrend,
  l2_getSalesTrend: require('../../postgres/baseReport/getSalesTrendProjection').l2_getSalesTrend,
  l3_getSalesTrend: require('../../postgres/baseReport/getSalesTrendProjection').l3_getSalesTrend,
  l4_getSalesTrend: require('../../postgres/baseReport/getSalesTrendProjection').l4_getSalesTrend,
  l5_getSalesTrend: require('../../postgres/baseReport/getSalesTrendProjection').l5_getSalesTrend,
  l0_getSalesTrend: require('../../postgres/baseReport/getSalesTrendProjection').l0_getSalesTrend,

  // Sales Total Primary
  l1_getSalesTotalPrimary: require('../../postgres/baseReport/getSalesProjection').l1_getSalesTotalPrimary,
  l2_getSalesTotalPrimary: require('../../postgres/baseReport/getSalesProjection').l2_getSalesTotalPrimary,
  l3_getSalesTotalPrimary: require('../../postgres/baseReport/getSalesProjection').l3_getSalesTotalPrimary,
  l4_getSalesTotalPrimary: require('../../postgres/baseReport/getSalesProjection').l4_getSalesTotalPrimary,
  l5_getSalesTotalPrimary: require('../../postgres/baseReport/getSalesProjection').l5_getSalesTotalPrimary,
  l0_getSalesTotalPrimary: require('../../postgres/baseReport/getSalesProjection').l0_getSalesTotalPrimary,

  // Inv Data
  l1_getInv: require('../../postgres/baseReport/getInven').l1_getInv,
  l2_getInv: require('../../postgres/baseReport/getInven').l2_getInv,
  l3_getInv: require('../../postgres/baseReport/getInven').l3_getInv,
  l4_getInv: require('../../postgres/baseReport/getInven').l4_getInv,
  l5_getInv: require('../../postgres/baseReport/getInven').l5_getInv,
  l0_getInv: require('../../postgres/baseReport/getInven').l0_getInv,

  // KPI
  l0_getAveSales: require('../../postgres/kpi/getAveSales_base').l0_getAveSales,
  l1_getAveSales: require('../../postgres/kpi/getAveSales_base').l1_getAveSales,
  l2_getAveSales: require('../../postgres/kpi/getAveSales_base').l2_getAveSales,
  l3_getAveSales: require('../../postgres/kpi/getAveSales_base').l3_getAveSales,
  l4_getAveSales: require('../../postgres/kpi/getAveSales_base').l4_getAveSales,
  l5_getAveSales: require('../../postgres/kpi/getAveSales_base').l5_getAveSales,

  l0_getPercentSales: require('../../postgres/kpi/getPercentSales_base').l0_getPercentSales,
  l1_getPercentSales: require('../../postgres/kpi/getPercentSales_base').l1_getPercentSales,
  l2_getPercentSales: require('../../postgres/kpi/getPercentSales_base').l2_getPercentSales,
  l3_getPercentSales: require('../../postgres/kpi/getPercentSales_base').l3_getPercentSales,
  l4_getPercentSales: require('../../postgres/kpi/getPercentSales_base').l4_getPercentSales,
  l5_getPercentSales: require('../../postgres/kpi/getPercentSales_base').l5_getPercentSales,

  getCompanyTotalSales: require('../../postgres/kpi/getCompanyTotalSales'),
  getSpeciesGroupTotalSales: require('../../postgres/kpi/getSpeciesGroupTotalSales'),
  getProgramTotalSales: require('../../postgres/kpi/getProgramTotalSales'),
  getReportTotalSales: require('../../postgres/kpi/getReportTotalSales'),

  l0_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_base').l0_getWeeksOnHand,
  l1_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_base').l1_getWeeksOnHand,
  l2_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_base').l2_getWeeksOnHand,
  l3_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_base').l3_getWeeksOnHand,
  l4_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_base').l4_getWeeksOnHand,
  l5_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_base').l5_getWeeksOnHand,

  // PO Data
  l1_getOpenPo: require('../../postgres/baseReport/getOpenPo').l1_getOpenPo,
  l2_getOpenPo: require('../../postgres/baseReport/getOpenPo').l2_getOpenPo,
  l3_getOpenPo: require('../../postgres/baseReport/getOpenPo').l3_getOpenPo,
  l4_getOpenPo: require('../../postgres/baseReport/getOpenPo').l4_getOpenPo,
  l5_getOpenPo: require('../../postgres/baseReport/getOpenPo').l5_getOpenPo,
  l0_getOpenPo: require('../../postgres/baseReport/getOpenPo').l0_getOpenPo,

  // Sales Order Total Data
  l1_getSo: require('../../postgres/baseReport/getSo').l1_getSo,
  l2_getSo: require('../../postgres/baseReport/getSo').l2_getSo,
  l3_getSo: require('../../postgres/baseReport/getSo').l3_getSo,
  l4_getSo: require('../../postgres/baseReport/getSo').l4_getSo,
  l5_getSo: require('../../postgres/baseReport/getSo').l5_getSo,
  l0_getSo: require('../../postgres/baseReport/getSo').l0_getSo,

  // Sales Order Trend Data
  l1_getSoTrend: require('../../postgres/baseReport/getSoTrend').l1_getSoTrend,
  l2_getSoTrend: require('../../postgres/baseReport/getSoTrend').l2_getSoTrend,
  l3_getSoTrend: require('../../postgres/baseReport/getSoTrend').l3_getSoTrend,
  l4_getSoTrend: require('../../postgres/baseReport/getSoTrend').l4_getSoTrend,
  l5_getSoTrend: require('../../postgres/baseReport/getSoTrend').l5_getSoTrend,
  l0_getSoTrend: require('../../postgres/baseReport/getSoTrend').l0_getSoTrend,

  // Get Row Labels
  l0_getRowLabels: require('../../postgres/baseReport/getRowLabels').l0_getRowLabels,
  l1_getRowLabels: require('../../postgres/baseReport/getRowLabels').l1_getRowLabels,
  l2_getRowLabels: require('../../postgres/baseReport/getRowLabels').l2_getRowLabels,
  l3_getRowLabels: require('../../postgres/baseReport/getRowLabels').l3_getRowLabels,
  l4_getRowLabels: require('../../postgres/baseReport/getRowLabels').l4_getRowLabels,
  l5_getRowLabels: require('../../postgres/baseReport/getRowLabels').l5_getRowLabels,

  // Model Functions
  mapDataToRowTemplates: require('../../../utils/mapDataToRowTemplates'),

  cleanLabelsForDisplay: require('../../../utils/cleanLabelsForDisplay'),
  unflattenByCompositKey: require('../../../utils/unflattenByCompositKey'),
  calcPercentSalesCol: require('../../models/calcPercentSalesCol'),
  calcAveWeeklySales: require('../../models/calcAveWeeklySales'),
  calcYoyYtdSalesCol: require('../../models/calcYoyYtdSalesCol'),
  calcMomentum: require('../../models/calcMomentumSalesCol'),
  calcWeeksInvOnHand: require('../../models/calcWeeksInvOnHand'),
  calcInventoryAvailable: require('../../models/calcInventoryAvailable'),
  sortRowTemplate: require('../../../utils/sortRowTemplate'),
  addDataToSoTotalCol: require('../helpers/colDataHelper').addDataToSoTotalCol,
  addDataToSalesTotalCol: require('../helpers/colDataHelper').addDataToSalesTotalCol,
}
