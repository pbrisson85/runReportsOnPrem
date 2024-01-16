module.exports = {
  // Cols
  getColumns: require('../helpers/getColumns'),

  // Production Data
  l1_getProduction: require('../../postgres/baseReport/getProduction').l1_getProduction,
  l2_getProduction: require('../../postgres/baseReport/getProduction').l2_getProduction,
  l3_getProduction: require('../../postgres/baseReport/getProduction').l3_getProduction,
  l4_getProduction: require('../../postgres/baseReport/getProduction').l4_getProduction,
  l5_getProduction: require('../../postgres/baseReport/getProduction').l5_getProduction,
  l0_getProduction: require('../../postgres/baseReport/getProduction').l0_getProduction,

  l1_getProductionTrend: require('../../postgres/baseReport/getProductionTrend').l1_getProductionTrend,
  l2_getProductionTrend: require('../../postgres/baseReport/getProductionTrend').l2_getProductionTrend,
  l3_getProductionTrend: require('../../postgres/baseReport/getProductionTrend').l3_getProductionTrend,
  l4_getProductionTrend: require('../../postgres/baseReport/getProductionTrend').l4_getProductionTrend,
  l5_getProductionTrend: require('../../postgres/baseReport/getProductionTrend').l5_getProductionTrend,
  l0_getProductionTrend: require('../../postgres/baseReport/getProductionTrend').l0_getProductionTrend,

  // Inv Data
  l1_getInv: require('../../postgres/baseReport/getInven').l1_getInv,
  l2_getInv: require('../../postgres/baseReport/getInven').l2_getInv,
  l3_getInv: require('../../postgres/baseReport/getInven').l3_getInv,
  l4_getInv: require('../../postgres/baseReport/getInven').l4_getInv,
  l5_getInv: require('../../postgres/baseReport/getInven').l5_getInv,
  l0_getInv: require('../../postgres/baseReport/getInven').l0_getInv,

  // PO Data
  l1_getOpenPo: require('../../postgres/baseReport/getOpenPo').l1_getOpenPo,
  l2_getOpenPo: require('../../postgres/baseReport/getOpenPo').l2_getOpenPo,
  l3_getOpenPo: require('../../postgres/baseReport/getOpenPo').l3_getOpenPo,
  l4_getOpenPo: require('../../postgres/baseReport/getOpenPo').l4_getOpenPo,
  l5_getOpenPo: require('../../postgres/baseReport/getOpenPo').l5_getOpenPo,
  l0_getOpenPo: require('../../postgres/baseReport/getOpenPo').l0_getOpenPo,

  l1_getReceivedPo: require('../../postgres/baseReport/getReceivedPo').l1_getReceivedPo,
  l2_getReceivedPo: require('../../postgres/baseReport/getReceivedPo').l2_getReceivedPo,
  l3_getReceivedPo: require('../../postgres/baseReport/getReceivedPo').l3_getReceivedPo,
  l4_getReceivedPo: require('../../postgres/baseReport/getReceivedPo').l4_getReceivedPo,
  l5_getReceivedPo: require('../../postgres/baseReport/getReceivedPo').l5_getReceivedPo,
  l0_getReceivedPo: require('../../postgres/baseReport/getReceivedPo').l0_getReceivedPo,

  // Sales Order Total Data
  l1_getSo: require('../../postgres/baseReport/getSo').l1_getSo,
  l2_getSo: require('../../postgres/baseReport/getSo').l2_getSo,
  l3_getSo: require('../../postgres/baseReport/getSo').l3_getSo,
  l4_getSo: require('../../postgres/baseReport/getSo').l4_getSo,
  l5_getSo: require('../../postgres/baseReport/getSo').l5_getSo,
  l0_getSo: require('../../postgres/baseReport/getSo').l0_getSo,

  // Sales Total Primary
  l1_getSalesTotalPrimary: require('../../postgres/baseReport/getSales').l1_getSalesTotalPrimary,
  l2_getSalesTotalPrimary: require('../../postgres/baseReport/getSales').l2_getSalesTotalPrimary,
  l3_getSalesTotalPrimary: require('../../postgres/baseReport/getSales').l3_getSalesTotalPrimary,
  l4_getSalesTotalPrimary: require('../../postgres/baseReport/getSales').l4_getSalesTotalPrimary,
  l5_getSalesTotalPrimary: require('../../postgres/baseReport/getSales').l5_getSalesTotalPrimary,
  l0_getSalesTotalPrimary: require('../../postgres/baseReport/getSales').l0_getSalesTotalPrimary,

  // KPI
  l0_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_base').l0_getWeeksOnHand,
  l1_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_base').l1_getWeeksOnHand,
  l2_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_base').l2_getWeeksOnHand,
  l3_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_base').l3_getWeeksOnHand,
  l4_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_base').l4_getWeeksOnHand,
  l5_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_base').l5_getWeeksOnHand,

  // Get Rows
  l5_getRowLabels: require('../../postgres/baseReport/getRowsLabels').l5_getRowLabels,
  l4_getRowLabels: require('../../postgres/baseReport/getRowsLabels').l4_getRowLabels,
  l3_getRowLabels: require('../../postgres/baseReport/getRowsLabels').l3_getRowLabels,
  l2_getRowLabels: require('../../postgres/baseReport/getRowsLabels').l2_getRowLabels,
  l1_getRowLabels: require('../../postgres/baseReport/getRowsLabels').l1_getRowLabels,
  l0_getRowLabels: require('../../postgres/baseReport/getRowsLabels').l0_getRowLabels,

  // Model Functions
  cleanLabelsForDisplay: require('../../../utils/cleanLabelsForDisplay'),
  unflattenByCompositKey: require('../../../utils/unflattenByCompositKey'),
  sortRowTemplate: require('../../../utils/sortRowTemplate'),
  mapDataToRowTemplates: require('../../../utils/mapDataToRowTemplates'),
}
