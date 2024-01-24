module.exports = {
  // Cols
  getColumns: require('../helpers/getColumns'),

  // Production Data
  l1_getProduction: require('../../postgres/baseReport/getProductionFg').l1_getProduction,
  l0_getProduction: require('../../postgres/baseReport/getProductionFg').l0_getProduction,

  l1_getProductionTrend: require('../../postgres/baseReport/getProductionTrendFg').l1_getProductionTrend,
  l0_getProductionTrend: require('../../postgres/baseReport/getProductionTrendFg').l0_getProductionTrend,

  // Inv Data
  l1_getInv: require('../../postgres/rowSlice/getInven').l1_getInv,
  l0_getInv: require('../../postgres/rowSlice/getInven').l0_getInv,

  // PO Data
  l1_getOpenPo: require('../../postgres/rowSlice/getOpenPo').l1_getOpenPo,
  l0_getOpenPo: require('../../postgres/rowSlice/getOpenPo').l0_getOpenPo,

  l1_getReceivedPo: require('../../postgres/baseReport/getReceivedPo').l1_getReceivedPo,
  l0_getReceivedPo: require('../../postgres/baseReport/getReceivedPo').l0_getReceivedPo,

  // Sales Order Total Data
  l1_getSo: require('../../postgres/rowSlice/getSo').l1_getSo,
  l0_getSo: require('../../postgres/rowSlice/getSo').l0_getSo,

  l1_getSalesTotalPrimary: require('../../postgres/baseReport/getSales').l1_getSalesTotalPrimary,
  l0_getSalesTotalPrimary: require('../../postgres/baseReport/getSales').l0_getSalesTotalPrimary,

  // KPI
  l0_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_slice').l0_getWeeksOnHand,
  l1_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_slice').l1_getWeeksOnHand,

  // Get Rows
  l1_getRowLabels: require('../../postgres/rowSlice/getRowLabels').l1_getRowLabels,
  l0_getRowLabels: require('../../postgres/rowSlice/getRowLabels').l0_getRowLabels,

  // Model Functions
  cleanLabelsForDisplay: require('../../../utils/cleanLabelsForDisplay'),
  unflattenByCompositKey: require('../../../utils/unflattenByCompositKey'),
  sortRowTemplate: require('../../../utils/sortRowTemplate'),
  mapDataToRowTemplates: require('../../../utils/mapDataToRowTemplates'),
}
