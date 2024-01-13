module.exports = {
  // Cols
  columnConfigs: require('../../data/baseCols/getColumns'),

  // Inv Data
  l1_getInv: require('../../postgres/rowSlice/getInven').l1_getInv,
  l0_getInv: require('../../postgres/rowSlice/getInven').l0_getInv,

  // PO Data
  l1_getOpenPo: require('../../postgres/rowSlice/getOpenPo').l1_getOpenPo,
  l0_getOpenPo: require('../../postgres/rowSlice/getOpenPo').l0_getOpenPo,

  // Sales Order Total Data
  l1_getSo: require('../../postgres/rowSlice/getSo').l1_getSo,
  l0_getSo: require('../../postgres/rowSlice/getSo').l0_getSo,

  // Get Rows
  l1_getRowLabels: require('../../postgres/rowSlice/getRowLabels').l1_getRowLabels,
  l0_getRowLabels: require('../../postgres/rowSlice/getRowLabels').l0_getRowLabels,

  // KPI
  l0_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_slice').l0_getWeeksOnHand,
  l1_getWeeksOnHand: require('../../postgres/kpi/getWeeksOnHand_slice').l1_getWeeksOnHand,

  // Model Functions
  cleanLabelsForDisplay: require('../../../utils/cleanLabelsForDisplay'),
  unflattenByCompositKey: require('../../../utils/unflattenByCompositKey'),
  sortRowTemplate: require('../../../utils/sortRowTemplate'),
  mapDataToRowTemplates: require('../../../utils/mapDataToRowTemplates'),
}
