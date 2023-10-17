const {
  l1_getFgInven,
  l2_getFgInven,
  l3_getFgInven,
  l4_getFgInven,
  l0_getFgInven,
  l1_getFgInTransit,
  l2_getFgInTransit,
  l3_getFgInTransit,
  l4_getFgInTransit,
  l0_getFgInTransit,
  l1_getFgAtLoc,
  l2_getFgAtLoc,
  l3_getFgAtLoc,
  l4_getFgAtLoc,
  l0_getFgAtLoc,
  l1_getFgAtLoc_untagged,
  l2_getFgAtLoc_untagged,
  l3_getFgAtLoc_untagged,
  l4_getFgAtLoc_untagged,
  l0_getFgAtLoc_untagged,
  l1_getFgAtLoc_tagged,
  l2_getFgAtLoc_tagged,
  l3_getFgAtLoc_tagged,
  l4_getFgAtLoc_tagged,
  l0_getFgAtLoc_tagged,
} = require('../../../database/queries/postgres/baseReport/getFgInven')
const { l1_getFgPo, l2_getFgPo, l3_getFgPo, l4_getFgPo, l0_getFgPo } = require('../../../database/queries/postgres/baseReport/getFgOpenPo')
const {
  getRowsFourthLevelDetail,
  getRowsThirdLevelDetail,
  getRowsSecondLevelDetail,
  getRowsFirstLevelDetail,
} = require('../../../database/queries/postgres/baseReport/getRows')
const mapInvenToRowTemplates_fourLevel = require('../../../models/mapInvenToRowTemplatesFourLevel')
const mapInvenToRowTemplates_threeLevel = require('../../../models/mapInvenToRowTemplatesThreeLevel')
const mapInvenToRowTemplates_twoLevel = require('../../../models/mapInvenToRowTemplatesTwoLevel')
const combineMappedRows = require('../../../models/combineMappedRows')
const cleanLabelsForDisplay = require('../../../models/cleanLabelsForDisplay')
const unflattenByCompositKey = require('../../../models/unflattenByCompositKey')
const columnConfigs = require('../data/baseCols/columns')

const buildReport = async (config, labelCols) => {
  ///////////////////////////////// INVENTORY DATA

  /* TOTAL FG (FG) */
  const l1_fgInven = totalOnly ? [] : await l1_getFgInven(config)
  const l2_fgInven = totalOnly ? [] : await l2_getFgInven(config)
  const l3_fgInven = totalOnly ? [] : config.l3_field ? await l3_getFgInven(config) : []
  const l4_fgInven = totalOnly ? [] : config.l4_field ? await l4_getFgInven(config) : []
  const l0_fgInven = await l0_getFgInven(config)
  /* FG IN TRANSIT*/
  const l1_fgInTransit = totalOnly ? [] : await l1_getFgInTransit(config)
  const l2_fgInTransit = totalOnly ? [] : await l2_getFgInTransit(config)
  const l3_fgInTransit = totalOnly ? [] : config.l3_field ? await l3_getFgInTransit(config) : []
  const l4_fgInTransit = totalOnly ? [] : config.l4_field ? await l4_getFgInTransit(config) : []
  const l0_fgInTransit = await l0_getFgInTransit(config)
  /* FG ON HAND (LESS IN TRANSIT) */
  const l1_fgAtLoc = totalOnly ? [] : await l1_getFgAtLoc(config)
  const l2_fgAtLoc = totalOnly ? [] : await l2_getFgAtLoc(config)
  const l3_fgAtLoc = totalOnly ? [] : config.l3_field ? await l3_getFgAtLoc(config) : []
  const l4_fgAtLoc = totalOnly ? [] : config.l4_field ? await l4_getFgAtLoc(config) : []
  const l0_fgAtLoc = await l0_getFgAtLoc(config)
  /* FG ON HAND UNTAGGED */
  const l1_fgAtLoc_untagged = totalOnly ? [] : await l1_getFgAtLoc_untagged(config)
  const l2_fgAtLoc_untagged = totalOnly ? [] : await l2_getFgAtLoc_untagged(config)
  const l3_fgAtLoc_untagged = totalOnly ? [] : config.l3_field ? await l3_getFgAtLoc_untagged(config) : []
  const l4_fgAtLoc_untagged = totalOnly ? [] : config.l4_field ? await l4_getFgAtLoc_untagged(config) : []
  const l0_fgAtLoc_untagged = await l0_getFgAtLoc_untagged(config)
  /* FG ON HAND TAGGED */
  const l1_fgAtLoc_tagged = totalOnly ? [] : await l1_getFgAtLoc_tagged(config)
  const l2_fgAtLoc_tagged = totalOnly ? [] : await l2_getFgAtLoc_tagged(config)
  const l3_fgAtLoc_tagged = totalOnly ? [] : config.l3_field ? await l3_getFgAtLoc_tagged(config) : []
  const l4_fgAtLoc_tagged = totalOnly ? [] : config.l4_field ? await l4_getFgAtLoc_tagged(config) : []
  const l0_fgAtLoc_tagged = await l0_getFgAtLoc_tagged(config)

  /* FG ON ORDER */
  const l1_fgPo = totalOnly ? [] : await l1_getFgPo(config)
  const l2_fgPo = totalOnly ? [] : await l2_getFgPo(config)
  const l3_fgPo = totalOnly ? [] : config.l3_field ? await l3_getFgPo(config) : []
  const l4_fgPo = totalOnly ? [] : config.l4_field ? await l4_getFgPo(config) : []
  const l0_fgPo = await l0_getFgPo(config)

  ///////////////////////////////// ROWS
  const rowsFourthLevelDetail = totalOnly ? [] : config.l4_field ? await getRowsFourthLevelDetail(config, start, end, showFyTrend) : []
  const rowsThirdLevelDetail = totalOnly ? [] : config.l3_field ? await getRowsThirdLevelDetail(config, start, end, showFyTrend) : []
  const rowsSecondLevelDetail = totalOnly ? [] : await getRowsSecondLevelDetail(config, start, end, showFyTrend)
  const rowsFirstLevelDetail = totalOnly ? [] : await getRowsFirstLevelDetail(config, start, end, showFyTrend)

  const totalsRow = [
    {
      totalRow: true,
      l1_label: `${config.itemType} SALES`,
      l2_label: 'TOTAL',
      l3_label: 'TOTAL',
      l4_label: 'TOTAL',
      datalevel: 0,
      itemtype: config.itemType,
    },
  ]

  // COMPILE FINAL ROW TEMPLATE
  const rowTemplate = [...rowsFourthLevelDetail, ...rowsThirdLevelDetail, ...rowsSecondLevelDetail, ...rowsFirstLevelDetail]
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l4_label?.includes('TOTAL')) return 1
      if (b.l4_label?.includes('TOTAL')) return -1

      if (a.l4_label < b.l4_label) return -1
      if (a.l4_label > b.l4_label) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l3_label?.includes('TOTAL')) return 1
      if (b.l3_label?.includes('TOTAL')) return -1

      if (a.l3_label < b.l3_label) return -1
      if (a.l3_label > b.l3_label) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l2_label?.includes('TOTAL')) return 1
      if (b.l2_label?.includes('TOTAL')) return -1

      if (a.l2_label < b.l2_label) return -1
      if (a.l2_label > b.l2_label) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l1_label?.includes('TOTAL')) return 1
      if (b.l1_label?.includes('TOTAL')) return -1

      if (a.l1_label < b.l1_label) return -1
      if (a.l1_label > b.l1_label) return 1
      return 0
    })

  rowTemplate.push(...totalsRow)

  // map data into row template
  // Determine if 2 or 3 level report

  let mapInvenToRowTemplates = null
  let rowTemplate_unflat = null
  let level = null
  if (!config.l3_field) {
    // 2 LEVEL REPORT
    mapInvenToRowTemplates = mapInvenToRowTemplates_twoLevel
    rowTemplate_unflat = unflattenByCompositKey(rowTemplate, {
      1: 'l1_label',
      2: 'l2_label',
    })

    level = 2
  } else if (!config.l4_field) {
    // 3 LEVEL REPORT
    mapInvenToRowTemplates = mapInvenToRowTemplates_threeLevel
    rowTemplate_unflat = unflattenByCompositKey(rowTemplate, {
      1: 'l1_label',
      2: 'l2_label',
      3: 'l3_label',
    })

    level = 3
  } else {
    // 4 LEVEL REPORT
    mapInvenToRowTemplates = mapInvenToRowTemplates_fourLevel
    rowTemplate_unflat = unflattenByCompositKey(rowTemplate, {
      1: 'l1_label',
      2: 'l2_label',
      3: 'l3_label',
      4: 'l4_label',
    })

    level = 4
  }

  const mappedInven = mapInvenToRowTemplates(
    [
      ...l1_fgInven,
      ...l2_fgInven,
      ...l3_fgInven,
      ...l4_fgInven,
      ...l0_fgInven,
      ...l1_fgInTransit,
      ...l2_fgInTransit,
      ...l3_fgInTransit,
      ...l4_fgInTransit,
      ...l0_fgInTransit,
      ...l1_fgAtLoc,
      ...l2_fgAtLoc,
      ...l3_fgAtLoc,
      ...l4_fgAtLoc,
      ...l0_fgAtLoc,
      ...l1_fgAtLoc_untagged,
      ...l2_fgAtLoc_untagged,
      ...l3_fgAtLoc_untagged,
      ...l4_fgAtLoc_untagged,
      ...l0_fgAtLoc_untagged,
      ...l1_fgAtLoc_tagged,
      ...l2_fgAtLoc_tagged,
      ...l3_fgAtLoc_tagged,
      ...l4_fgAtLoc_tagged,
      ...l0_fgAtLoc_tagged,
      ...l1_fgPo,
      ...l2_fgPo,
      ...l3_fgPo,
      ...l4_fgPo,
      ...l0_fgPo,
      ...l1_weeksInvOnHand,
      ...l2_weeksInvOnHand,
      ...l3_weeksInvOnHand,
      ...l4_weeksInvOnHand,
      ...l0_weeksInvOnHand,
      ...l1_invAvailable,
      ...l2_invAvailable,
      ...l3_invAvailable,
      ...l4_invAvailable,
      ...l0_invAvailable,
    ],
    rowTemplate_unflat
  )

  const mappedData = combineMappedRows([], mappedInven)

  const flattenedMappedData = Object.values(mappedData)
  const data = cleanLabelsForDisplay(flattenedMappedData, config)
  //const collapsedData = collapseRedundantTotalRows(data, level)

  // return
  return {
    data,
    cols: {
      labelCols,
      columnConfigs,
    },
  }
}

module.exports = buildReport
