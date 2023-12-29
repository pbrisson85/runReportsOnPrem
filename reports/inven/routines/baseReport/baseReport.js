const m = require('./import')

const buildReport = async config => {
  // Additional data could be inven available, weeks inv on hand, etc. *************
  // Also could have turnovers
  // Also could have time trends, etc. ******************************************

  // The routine and all of the queries can be the same for all reports. Going to buikd out this rpeort and then change the config manually to test.

  const skip = () => {
    return () => {
      return []
    }
  }

  ///////////////////////////////// INVENTORY DATA

  const l0_Inv = () => {
    return m.l0_getInv(config)
  }
  const l1_Inv = () => {
    return m.l1_getInv(config)
  }
  const l2_Inv = () => {
    return m.l2_getInv(config)
  }
  const l3_Inv = config.baseFormat.l3_field
    ? () => {
        return m.l3_getInv(config)
      }
    : skip()
  const l4_Inv = config.baseFormat.l4_field
    ? () => {
        return m.l4_getInv(config)
      }
    : skip()
  const l5_Inv = config.baseFormat.l5_field
    ? () => {
        return m.l5_getInv(config)
      }
    : skip()

  const l0_invAged = () => {
    return m.l0_getInvAged(config)
  }
  const l1_invAged = () => {
    return m.l1_getInvAged(config)
  }
  const l2_invAged = () => {
    return m.l2_getInvAged(config)
  }
  const l3_invAged = () => {
    return m.l3_getInvAged(config)
  }
  const l4_invAged = () => {
    return m.l4_getInvAged(config)
  }
  const l5_invAged = () => {
    return m.l5_getInvAged(config)
  }

  ///////////////////////////////// PURCHASE DATA

  const l0_OpenPo = () => {
    return m.l0_getOpenPo(config)
  }
  const l1_OpenPo = () => {
    return m.l1_getOpenPo(config)
  }
  const l2_OpenPo = () => {
    return m.l2_getOpenPo(config)
  }
  const l3_OpenPo = config.baseFormat.l3_field
    ? () => {
        return m.l3_getOpenPo(config)
      }
    : skip()
  const l4_OpenPo = config.baseFormat.l4_field
    ? () => {
        return m.l4_getOpenPo(config)
      }
    : skip()
  const l5_OpenPo = config.baseFormat.l5_field
    ? () => {
        return m.l5_getOpenPo(config)
      }
    : skip()

  ///////////////////////////////// SALES ORDERS

  const l0_so = () => {
    return m.l0_getSo(config)
  }
  const l1_so = () => {
    return m.l1_getSo(config)
  }
  const l2_so = () => {
    return m.l2_getSo(config)
  }
  const l3_so = config.baseFormat.l3_field
    ? () => {
        return m.l3_getSo(config)
      }
    : skip()
  const l4_so = config.baseFormat.l4_field
    ? () => {
        return m.l4_getSo(config)
      }
    : skip()
  const l5_so = config.baseFormat.l5_field
    ? () => {
        return m.l5_getSo(config)
      }
    : skip()

  const [
    l1_InvR,
    l2_InvR,
    l3_InvR,
    l4_InvR,
    l5_InvR,
    l0_InvR,
    l0_invAgedR,
    l1_invAgedR,
    l2_invAgedR,
    l3_invAgedR,
    l4_invAgedR,
    l5_invAgedR,

    l1_OpenPoR,
    l2_OpenPoR,
    l3_OpenPoR,
    l4_OpenPoR,
    l5_OpenPoR,
    l0_OpenPoR,

    l1_soR,
    l2_soR,
    l3_soR,
    l4_soR,
    l5_soR,
    l0_soR,
  ] = await Promise.all([
    l1_Inv(),
    l2_Inv(),
    l3_Inv(),
    l4_Inv(),
    l5_Inv(),
    l0_Inv(),

    l0_invAged(),
    l1_invAged(),
    l2_invAged(),
    l3_invAged(),
    l4_invAged(),
    l5_invAged(),

    l1_OpenPo(),
    l2_OpenPo(),
    l3_OpenPo(),
    l4_OpenPo(),
    l5_OpenPo(),
    l0_OpenPo(),

    l0_so(),
    l1_so(),
    l2_so(),
    l3_so(),
    l4_so(),
    l5_so(),
  ])

  ///////////////////////////////// ROWS
  const rowsFifthLevelDetail = config.baseFormat.l5_field
    ? () => {
        return m.getRowsFifthLevelDetail(config)
      }
    : skip()
  const rowsFourthLevelDetail = config.baseFormat.l4_field
    ? () => {
        return m.getRowsFourthLevelDetail(config)
      }
    : skip()
  const rowsThirdLevelDetail = config.baseFormat.l3_field
    ? () => {
        return m.getRowsThirdLevelDetail(config)
      }
    : skip()
  const rowsSecondLevelDetail = () => {
    return m.getRowsSecondLevelDetail(config)
  }
  const rowsFirstLevelDetail = () => {
    return m.getRowsFirstLevelDetail(config)
  }

  const [rowsFifthLevelDetailR, rowsFourthLevelDetailR, rowsThirdLevelDetailR, rowsSecondLevelDetailR, rowsFirstLevelDetailR] =
    await Promise.all([rowsFifthLevelDetail(), rowsFourthLevelDetail(), rowsThirdLevelDetail(), rowsSecondLevelDetail(), rowsFirstLevelDetail()])

  const totalsRow = [
    {
      totalRow: true,
      l1_label: `TOTAL`, //<-- Must map to l0_query row labels
      datalevel: 0,
      itemtype: config.baseFilters.itemType,
    },
  ]

  // COMPILE FINAL ROW TEMPLATE

  const rowTemplate = m.sortRowTemplate([
    ...rowsFifthLevelDetailR,
    ...rowsFourthLevelDetailR,
    ...rowsThirdLevelDetailR,
    ...rowsSecondLevelDetailR,
    ...rowsFirstLevelDetailR,
  ])
  rowTemplate.push(...totalsRow)

  let keyMap = {}
  for (let i = 0; i < config.baseFormat.groupingLevel; i++) {
    // build composite key for unflatten:
    keyMap[i + 1] = `l${i + 1}_label`
  }
  // { 1: 'l1_label', 2: 'l2_label' }, { 1: 'l1_label', 2: 'l2_label', 3: 'l3_label' }
  const rowTemplate_unflat = m.unflattenByCompositKey(rowTemplate, keyMap)

  const mappedInven = m.mapDataToRowTemplates(
    [
      ...l1_InvR,
      ...l2_InvR,
      ...l3_InvR,
      ...l4_InvR,
      ...l5_InvR,
      ...l0_InvR,
      ...l0_invAgedR,
      ...l1_invAgedR,
      ...l2_invAgedR,
      ...l3_invAgedR,
      ...l4_invAgedR,
      ...l5_invAgedR,
      ...l1_OpenPoR,
      ...l2_OpenPoR,
      ...l3_OpenPoR,
      ...l4_OpenPoR,
      ...l5_OpenPoR,
      ...l0_OpenPoR,
    ],
    rowTemplate_unflat,
    config,
    (viewTrend = false)
  )

  /* Map data to row template */
  const mappedSales = m.mapDataToRowTemplates([...l1_soR, ...l2_soR, ...l3_soR, ...l4_soR, ...l5_soR, ...l0_soR], rowTemplate_unflat, config)

  const mappedData = m.combineMappedRows(mappedSales, mappedInven)
  const flattenedMappedData = Object.values(mappedData)
  const data = m.cleanLabelsForDisplay(flattenedMappedData, config)

  /* Trend Columns */
  const columnConfigs = m.buildAgingCols(config, m.columnConfigs)

  return {
    data,
    cols: {
      labelCols: config.labelCols,
      columnConfigs,
    },
  }
}

module.exports = buildReport
