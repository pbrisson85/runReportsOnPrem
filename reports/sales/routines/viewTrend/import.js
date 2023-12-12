module.exports = {
  getTrendColsSo: require('../../postgres/trendColHeadings/getTrendColsSo').getTrendColsSo,
  getTrendColsSales: require('../../postgres/trendColHeadings/getTrendColsSales').getTrendColsSales,
  l1_getSalesTrend: require('../../postgres/viewTrend/getSalesTrendProjection').l1_getSalesTrend,
  l0_getSalesTrend: require('../../postgres/viewTrend/getSalesTrendProjection').l0_getSalesTrend,
  l1_getSales: require('../../postgres/viewTrend/getSalesProjection').l1_getSales,
  l0_getSales: require('../../postgres/viewTrend/getSalesProjection').l0_getSales,
  l1_getSalesWkDriven: require('../../postgres/viewTrend/getSalesTrendWkDriven').l1_getSalesWkDriven,
  l0_getSalesWkDriven: require('../../postgres/viewTrend/getSalesTrendWkDriven').l0_getSalesWkDriven,
  getCompanyTotalSales: require('../../postgres/kpi/getCompanyTotalSales').getCompanyTotalSales,
  getProgramTotalSales: require('../../postgres/kpi/getProgramTotalSales').getProgramTotalSales,
  l1_getInven: require('../../postgres/viewTrend/getInven').l1_getInven,
  l0_getInven: require('../../postgres/viewTrend/getInven').l0_getInven,
  l0_getOpenPo: require('../../postgres/viewTrend/getOpenPo').l0_getOpenPo,
  l1_getOpenPo: require('../../postgres/viewTrend/getOpenPo').l1_getOpenPo,
  l0_getSo: require('../../postgres/viewTrend/getSo').l0_getSo,
  l1_getSo: require('../../postgres/viewTrend/getSo').l1_getSo,
  l0_getSoTrend: require('../../postgres/viewTrend/getSoTrend').l0_getSoTrend,
  l1_getSoTrend: require('../../postgres/viewTrend/getSoTrend').l1_getSoTrend,
  getRowsFirstLevelDetail: require('../../postgres/viewTrend/getRows').getRowsFirstLevelDetail,
  mapSalesToRowTemplates: require('../../../../models/mapSalesToRowTemplatesOneLevel'),
  mapInvenToRowTemplates: require('../../../../models/mapInvenToRowTemplatesOneLevel'),
  combineMappedRows: require('../../../../models/combineMappedRows'),
  cleanLabelsForDisplay: require('../../../../models/cleanLabelsForDisplay'),
  unflattenByCompositKey: require('../../../../models/unflattenByCompositKey'),
  calcPercentSalesCol: require('../../../../models/calcPercentSalesCol'),
  calcYoyYtdSalesCol: require('../../../../models/calcYoyYtdSalesCol'),
  calcMomentum: require('../../../../models/calcMomentumSalesCol'),
  calcAveWeeklySales: require('../../../../models/calcAveWeeklySales'),
  calcWeeksInvOnHand: require('../../../../models/calcWeeksInvOnHand'),
  calcInventoryAvailable: require('../../../../models/calcInventoryAvailable'),
  columnConfigs: require('../../data/baseCols/columns'),
  addDataToSoTotalCol: require('../helpers/colDataHelper').addDataToSoTotalCol,
  addDataToSalesTotalCol: require('../helpers/colDataHelper').addDataToSalesTotalCol,
  addDataToSalesTrendCol: require('../helpers/colDataHelper').addDataToSalesTrendCol,
}
