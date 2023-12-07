module.exports = {
  // Cols
  columnConfigs: require('../../data/baseCols/columns'),

  // Trend Cols
  getTrendColsSales: require('../../../../database/queries/postgres/trendColHeadings/getTrendColsSales').getTrendColsSales,
  getTrendColsFiscalYear: require('../../../../database/queries/postgres/trendColHeadings/getTrendColsFiscalYear').getTrendColsFiscalYear,
  getTrendColsSo: require('../../../../database/queries/postgres/trendColHeadings/getTrendColsSo').getTrendColsSo,

  // Sales Trend Primary
  l1_getSalesTrend: require('../../../../database/queries/postgres/baseReport/getSalesTrendProjection').l1_getSalesTrend,
  l2_getSalesTrend: require('../../../../database/queries/postgres/baseReport/getSalesTrendProjection').l2_getSalesTrend,
  l3_getSalesTrend: require('../../../../database/queries/postgres/baseReport/getSalesTrendProjection').l3_getSalesTrend,
  l4_getSalesTrend: require('../../../../database/queries/postgres/baseReport/getSalesTrendProjection').l4_getSalesTrend,
  l5_getSalesTrend: require('../../../../database/queries/postgres/baseReport/getSalesTrendProjection').l5_getSalesTrend,
  l0_getSalesTrend: require('../../../../database/queries/postgres/baseReport/getSalesTrendProjection').l0_getSalesTrend,

  // Sales Total Primary
  l1_getSalesTotalPrimary: require('../../../../database/queries/postgres/baseReport/getSalesProjection').l1_getSalesTotalPrimary,
  l2_getSalesTotalPrimary: require('../../../../database/queries/postgres/baseReport/getSalesProjection').l2_getSalesTotalPrimary,
  l3_getSalesTotalPrimary: require('../../../../database/queries/postgres/baseReport/getSalesProjection').l3_getSalesTotalPrimary,
  l4_getSalesTotalPrimary: require('../../../../database/queries/postgres/baseReport/getSalesProjection').l4_getSalesTotalPrimary,
  l5_getSalesTotalPrimary: require('../../../../database/queries/postgres/baseReport/getSalesProjection').l5_getSalesTotalPrimary,
  l0_getSalesTotalPrimary: require('../../../../database/queries/postgres/baseReport/getSalesProjection').l0_getSalesTotalPrimary,

  // Inv Data
  l1_getInv: require('../../../../database/queries/postgres/baseReport/getInven').l1_getInv,
  l2_getInv: require('../../../../database/queries/postgres/baseReport/getInven').l2_getInv,
  l3_getInv: require('../../../../database/queries/postgres/baseReport/getInven').l3_getInv,
  l4_getInv: require('../../../../database/queries/postgres/baseReport/getInven').l4_getInv,
  l5_getInv: require('../../../../database/queries/postgres/baseReport/getInven').l5_getInv,
  l0_getInv: require('../../../../database/queries/postgres/baseReport/getInven').l0_getInv,

  // KPI
  l1_getSalesWkDriven: require('../../../../database/queries/postgres/baseReport/getSalesTrendWkDriven').l1_getSalesWkDriven,
  l2_getSalesWkDriven: require('../../../../database/queries/postgres/baseReport/getSalesTrendWkDriven').l2_getSalesWkDriven,
  l3_getSalesWkDriven: require('../../../../database/queries/postgres/baseReport/getSalesTrendWkDriven').l3_getSalesWkDriven,
  l4_getSalesWkDriven: require('../../../../database/queries/postgres/baseReport/getSalesTrendWkDriven').l4_getSalesWkDriven,
  l5_getSalesWkDriven: require('../../../../database/queries/postgres/baseReport/getSalesTrendWkDriven').l5_getSalesWkDriven,
  l0_getSalesWkDriven: require('../../../../database/queries/postgres/baseReport/getSalesTrendWkDriven').l0_getSalesWkDriven,

  // KPI
  getCompanyTotalSales: require('../../../../database/queries/postgres/kpi/getCompanyTotalSales').getCompanyTotalSales,
  getProgramTotalSales: require('../../../../database/queries/postgres/kpi/getProgramTotalSales').getProgramTotalSales,
  getSpeciesGroupTotalSales: require('../../../../database/queries/postgres/kpi/getSpeciesGroupTotalSalesFromProgram'),

  // PO Data
  l1_getFgPo: require('../../../../database/queries/postgres/baseReport/getFgOpenPo').l1_getFgPo,
  l2_getFgPo: require('../../../../database/queries/postgres/baseReport/getFgOpenPo').l2_getFgPo,
  l3_getFgPo: require('../../../../database/queries/postgres/baseReport/getFgOpenPo').l3_getFgPo,
  l4_getFgPo: require('../../../../database/queries/postgres/baseReport/getFgOpenPo').l4_getFgPo,
  l5_getFgPo: require('../../../../database/queries/postgres/baseReport/getFgOpenPo').l5_getFgPo,
  l0_getFgPo: require('../../../../database/queries/postgres/baseReport/getFgOpenPo').l0_getFgPo,

  // Sales Order Total Data
  l1_getSo: require('../../../../database/queries/postgres/baseReport/getSo').l1_getSo,
  l2_getSo: require('../../../../database/queries/postgres/baseReport/getSo').l2_getSo,
  l3_getSo: require('../../../../database/queries/postgres/baseReport/getSo').l3_getSo,
  l4_getSo: require('../../../../database/queries/postgres/baseReport/getSo').l4_getSo,
  l5_getSo: require('../../../../database/queries/postgres/baseReport/getSo').l5_getSo,
  l0_getSo: require('../../../../database/queries/postgres/baseReport/getSo').l0_getSo,

  // Sales Order Trend Data
  l1_getSoTrend: require('../../../../database/queries/postgres/baseReport/getSoTrend').l1_getSoTrend,
  l2_getSoTrend: require('../../../../database/queries/postgres/baseReport/getSoTrend').l2_getSoTrend,
  l3_getSoTrend: require('../../../../database/queries/postgres/baseReport/getSoTrend').l3_getSoTrend,
  l4_getSoTrend: require('../../../../database/queries/postgres/baseReport/getSoTrend').l4_getSoTrend,
  l5_getSoTrend: require('../../../../database/queries/postgres/baseReport/getSoTrend').l5_getSoTrend,
  l0_getSoTrend: require('../../../../database/queries/postgres/baseReport/getSoTrend').l0_getSoTrend,

  // Get Rows
  getRowsFifthLevelDetail: require('../../../../database/queries/postgres/baseReport/getRows').getRowsFifthLevelDetail,
  getRowsFourthLevelDetail: require('../../../../database/queries/postgres/baseReport/getRows').getRowsFourthLevelDetail,
  getRowsThirdLevelDetail: require('../../../../database/queries/postgres/baseReport/getRows').getRowsThirdLevelDetail,
  getRowsSecondLevelDetail: require('../../../../database/queries/postgres/baseReport/getRows').getRowsSecondLevelDetail,
  getRowsFirstLevelDetail: require('../../../../database/queries/postgres/baseReport/getRows').getRowsFirstLevelDetail,

  // Model Functions
  mapSalesToRowTemplates_fiveLevel: require('../../../../models/mapSalesToRowTemplatesFiveLevel'),
  mapInvenToRowTemplates_fiveLevel: require('../../../../models/mapInvenToRowTemplatesFiveLevel'),
  mapSalesToRowTemplates_fourLevel: require('../../../../models/mapSalesToRowTemplatesFourLevel'),
  mapInvenToRowTemplates_fourLevel: require('../../../../models/mapInvenToRowTemplatesFourLevel'),
  mapSalesToRowTemplates_threeLevel: require('../../../../models/mapSalesToRowTemplatesThreeLevel'),
  mapInvenToRowTemplates_threeLevel: require('../../../../models/mapInvenToRowTemplatesThreeLevel'),
  mapSalesToRowTemplates_twoLevel: require('../../../../models/mapSalesToRowTemplatesTwoLevel'),
  mapInvenToRowTemplates_twoLevel: require('../../../../models/mapInvenToRowTemplatesTwoLevel'),
  combineMappedRows: require('../../../../models/combineMappedRows'),
  cleanLabelsForDisplay: require('../../../../models/cleanLabelsForDisplay'),
  unflattenByCompositKey: require('../../../../models/unflattenByCompositKey'),
  calcPercentSalesCol: require('../../../../models/calcPercentSalesCol'),
  calcAveWeeklySales: require('../../../../models/calcAveWeeklySales'),
  calcYoyYtdSalesCol: require('../../../../models/calcYoyYtdSalesCol'),
  calcMomentum: require('../../../../models/calcMomentumSalesCol'),
  calcWeeksInvOnHand: require('../../../../models/calcWeeksInvOnHand'),
  calcInventoryAvailable: require('../../../../models/calcInventoryAvailable'),
  collapseRedundantTotalRows: require('../../../../models/collapseRedundantTotalRows'),
  sortRowTemplate: require('../../../../models/sortRowTemplate'),
  addDataToSoTotalCol: require('../helpers/colDataHelper').addDataToSoTotalCol,
  addDataToSalesTotalCol: require('../helpers/colDataHelper').addDataToSalesTotalCol,
  addDataToSalesTrendCol: require('../helpers/colDataHelper').addDataToSalesTrendCol,
}
