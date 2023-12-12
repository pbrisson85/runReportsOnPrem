module.exports = {
  // Cols
  columnConfigs: require('../../data/baseCols/columns'),

  // Trend Cols
  getTrendColsSales: require('../../postgres/trendColHeadings/getTrendColsSales').getTrendColsSales,
  getTrendColsFiscalYear: require('../../postgres/trendColHeadings/getTrendColsFiscalYear').getTrendColsFiscalYear,
  getTrendColsSo: require('../../postgres/trendColHeadings/getTrendColsSo').getTrendColsSo,

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
  l1_getSalesWkDriven: require('../../postgres/baseReport/getSalesTrendWkDriven').l1_getSalesWkDriven,
  l2_getSalesWkDriven: require('../../postgres/baseReport/getSalesTrendWkDriven').l2_getSalesWkDriven,
  l3_getSalesWkDriven: require('../../postgres/baseReport/getSalesTrendWkDriven').l3_getSalesWkDriven,
  l4_getSalesWkDriven: require('../../postgres/baseReport/getSalesTrendWkDriven').l4_getSalesWkDriven,
  l5_getSalesWkDriven: require('../../postgres/baseReport/getSalesTrendWkDriven').l5_getSalesWkDriven,
  l0_getSalesWkDriven: require('../../postgres/baseReport/getSalesTrendWkDriven').l0_getSalesWkDriven,

  // KPI
  getCompanyTotalSales: require('../../postgres/kpi/getCompanyTotalSales').getCompanyTotalSales,
  getProgramTotalSales: require('../../postgres/kpi/getProgramTotalSales').getProgramTotalSales,
  getSpeciesGroupTotalSales: require('../../postgres/kpi/getSpeciesGroupTotalSalesFromProgram'),

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

  // Get Rows
  getRowsFifthLevelDetail: require('../../postgres/baseReport/getRows').getRowsFifthLevelDetail,
  getRowsFourthLevelDetail: require('../../postgres/baseReport/getRows').getRowsFourthLevelDetail,
  getRowsThirdLevelDetail: require('../../postgres/baseReport/getRows').getRowsThirdLevelDetail,
  getRowsSecondLevelDetail: require('../../postgres/baseReport/getRows').getRowsSecondLevelDetail,
  getRowsFirstLevelDetail: require('../../postgres/baseReport/getRows').getRowsFirstLevelDetail,

  // Model Functions
  mapSalesToRowTemplates_fiveLevel: require('../../models/mapSalesToRowTemplatesFiveLevel'),
  mapInvenToRowTemplates_fiveLevel: require('../../models/mapInvenToRowTemplatesFiveLevel'),
  mapSalesToRowTemplates_fourLevel: require('../../models/mapSalesToRowTemplatesFourLevel'),
  mapInvenToRowTemplates_fourLevel: require('../../models/mapInvenToRowTemplatesFourLevel'),
  mapSalesToRowTemplates_threeLevel: require('../../models/mapSalesToRowTemplatesThreeLevel'),
  mapInvenToRowTemplates_threeLevel: require('../../models/mapInvenToRowTemplatesThreeLevel'),
  mapSalesToRowTemplates_twoLevel: require('../../models/mapSalesToRowTemplatesTwoLevel'),
  mapInvenToRowTemplates_twoLevel: require('../../models/mapInvenToRowTemplatesTwoLevel'),
  combineMappedRows: require('../../models/combineMappedRows'),
  cleanLabelsForDisplay: require('../../models/cleanLabelsForDisplay'),
  unflattenByCompositKey: require('../../models/unflattenByCompositKey'),
  calcPercentSalesCol: require('../../models/calcPercentSalesCol'),
  calcAveWeeklySales: require('../../models/calcAveWeeklySales'),
  calcYoyYtdSalesCol: require('../../models/calcYoyYtdSalesCol'),
  calcMomentum: require('../../models/calcMomentumSalesCol'),
  calcWeeksInvOnHand: require('../../models/calcWeeksInvOnHand'),
  calcInventoryAvailable: require('../../models/calcInventoryAvailable'),
  collapseRedundantTotalRows: require('../../models/collapseRedundantTotalRows'),
  sortRowTemplate: require('../../models/sortRowTemplate'),
  addDataToSoTotalCol: require('../helpers/colDataHelper').addDataToSoTotalCol,
  addDataToSalesTotalCol: require('../helpers/colDataHelper').addDataToSalesTotalCol,
  addDataToSalesTrendCol: require('../helpers/colDataHelper').addDataToSalesTrendCol,
}
