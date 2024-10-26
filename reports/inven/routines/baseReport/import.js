module.exports = {
  // Cols
  getColumns: require('../helpers/getColumns'),

  // Inv Data
  l1_getInv: require('../../postgres/baseReport/getInven').l1_getInv,
  l2_getInv: require('../../postgres/baseReport/getInven').l2_getInv,
  l3_getInv: require('../../postgres/baseReport/getInven').l3_getInv,
  l4_getInv: require('../../postgres/baseReport/getInven').l4_getInv,
  l5_getInv: require('../../postgres/baseReport/getInven').l5_getInv,
  l0_getInv: require('../../postgres/baseReport/getInven').l0_getInv,

  l5_getInvAged: require('../../postgres/baseReport/getInvenAged').l5_getInvAged,
  l4_getInvAged: require('../../postgres/baseReport/getInvenAged').l4_getInvAged,
  l3_getInvAged: require('../../postgres/baseReport/getInvenAged').l3_getInvAged,
  l2_getInvAged: require('../../postgres/baseReport/getInvenAged').l2_getInvAged,
  l1_getInvAged: require('../../postgres/baseReport/getInvenAged').l1_getInvAged,
  l0_getInvAged: require('../../postgres/baseReport/getInvenAged').l0_getInvAged,

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
