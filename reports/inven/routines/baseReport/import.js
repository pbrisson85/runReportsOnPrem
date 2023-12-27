module.exports = {
  // Cols
  columnConfigs: require('../../data/baseCols/columns'),

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

  // Get Rows
  getRowsFifthLevelDetail: require('../../postgres/baseReport/getRows').getRowsFifthLevelDetail,
  getRowsFourthLevelDetail: require('../../postgres/baseReport/getRows').getRowsFourthLevelDetail,
  getRowsThirdLevelDetail: require('../../postgres/baseReport/getRows').getRowsThirdLevelDetail,
  getRowsSecondLevelDetail: require('../../postgres/baseReport/getRows').getRowsSecondLevelDetail,
  getRowsFirstLevelDetail: require('../../postgres/baseReport/getRows').getRowsFirstLevelDetail,

  // Model Functions
  mapInvenToRowTemplates: require('../../../utils/mapInvenToRowTemplates'),
  combineMappedRows: require('../../../utils/combineMappedRows'),
  cleanLabelsForDisplay: require('../../../utils/cleanLabelsForDisplay'),
  unflattenByCompositKey: require('../../../utils/unflattenByCompositKey'),
  sortRowTemplate: require('../../../utils/sortRowTemplate'),
  mapSalesToRowTemplates: require('../../../utils/mapDataToRowTemplates'),

  // Col Helpers
  buildAgingCols: require('../helpers/agingColHelper').buildAgingCols,
}
