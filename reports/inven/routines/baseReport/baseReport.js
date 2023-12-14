const m = require('./import')

const buildReport = async (config) => {

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

  const l0_Inv = () => {return m.l0_getInv(config)} 
  const l1_Inv = () => {return m.l1_getInv(config)} 
  const l2_Inv = () => {return m.l2_getInv(config)} 
  const l3_Inv = config.baseFormat.l3_field ? () => {return m.l3_getInv(config)}: skip() 
  const l4_Inv = config.baseFormat.l4_field ? () => {return m.l4_getInv(config)}: skip() 
  const l5_Inv = config.baseFormat.l5_field ? () => {return m.l5_getInv(config)}: skip() 

  ///////////////////////////////// PURCHASE DATA

  const l0_OpenPo = () => {return m.l0_getOpenPo(config)}
  const l1_OpenPo = () => {return m.l1_getOpenPo(config)}
  const l2_OpenPo = () => {return m.l2_getOpenPo(config)}
  const l3_OpenPo =  config.baseFormat.l3_field ? () => {return m.l3_getOpenPo(config)} : skip()
  const l4_OpenPo =  config.baseFormat.l4_field ? () => {return m.l4_getOpenPo(config)} : skip()
  const l5_OpenPo =  config.baseFormat.l5_field ? () => {return m.l5_getOpenPo(config)} : skip()

  const [
    l1_InvR,
    l2_InvR,
    l3_InvR,
    l4_InvR,
    l5_InvR,
    l0_InvR,
    l1_OpenPoR,
    l2_OpenPoR,
    l3_OpenPoR,
    l4_OpenPoR,
    l5_OpenPoR,
    l0_OpenPoR,
  ] = await Promise.all([
    l1_Inv(),
    l2_Inv(),
    l3_Inv(),
    l4_Inv(),
    l5_Inv(),
    l0_Inv(),
    l1_OpenPo(),
    l2_OpenPo(),
    l3_OpenPo(),
    l4_OpenPo(),
    l5_OpenPo(),
    l0_OpenPo(),
  ])

  ///////////////////////////////// ROWS
  const rowsFifthLevelDetail =  config.baseFormat.l5_field ? () => {return m.getRowsFifthLevelDetail(config)} : skip() 
  const rowsFourthLevelDetail =  config.baseFormat.l4_field ? () => {return m.getRowsFourthLevelDetail(config)} : skip() 
  const rowsThirdLevelDetail =  config.baseFormat.l3_field ? () => {return m.getRowsThirdLevelDetail(config)} : skip() 
  const rowsSecondLevelDetail = () => {return m.getRowsSecondLevelDetail(config)} 
  const rowsFirstLevelDetail = () => {return m.getRowsFirstLevelDetail(config)} 

  const [rowsFifthLevelDetailR, rowsFourthLevelDetailR, rowsThirdLevelDetailR, rowsSecondLevelDetailR, rowsFirstLevelDetailR] = await Promise.all([
    rowsFifthLevelDetail(),
    rowsFourthLevelDetail(),
    rowsThirdLevelDetail(),
    rowsSecondLevelDetail(),
    rowsFirstLevelDetail(),
  ])


  console.log('rowsFifthLevelDetailR', rowsFifthLevelDetailR)
  console.log('rowsFourthLevelDetailR', rowsFourthLevelDetailR)
  console.log('rowsThirdLevelDetailR', rowsThirdLevelDetailR)
  console.log('rowsSecondLevelDetailR', rowsSecondLevelDetailR)
  console.log('rowsFirstLevelDetailR', rowsFirstLevelDetailR)

  const totalsRow = [
    {
      totalRow: true,
      l1_label: `${config.baseFilters.itemType} INVEN`,
      l2_label: 'TOTAL',
      l3_label: 'TOTAL',
      l4_label: 'TOTAL',
      l5_label: 'TOTAL',
      datalevel: 0,
      itemtype: config.baseFilters.itemType,
    },
  ]

  // COMPILE FINAL ROW TEMPLATE

  const rowTemplate = m.sortRowTemplate([...rowsFifthLevelDetailR, ...rowsFourthLevelDetailR, ...rowsThirdLevelDetailR, ...rowsSecondLevelDetailR, ...rowsFirstLevelDetailR])
  rowTemplate.push(...totalsRow)

  // map data into row template
  // Determine if 2 or 3 level report

  let mapInvenToRowTemplates = null
  let rowTemplate_unflat = null

  if (!config.baseFormat.l3_field) {
    // 2 LEVEL REPORT
    mapInvenToRowTemplates = m.mapInvenToRowTemplates_twoLevel
    rowTemplate_unflat = m.unflattenByCompositKey(rowTemplate, { 1: 'l1_label', 2: 'l2_label' }) 
  } else if (!config.baseFormat.l4_field) {
    // 3 LEVEL REPORT
    mapInvenToRowTemplates = m.mapInvenToRowTemplates_threeLevel
    rowTemplate_unflat = m.unflattenByCompositKey(rowTemplate, { 1: 'l1_label', 2: 'l2_label', 3: 'l3_label' }) 
  } else if (!config.baseFormat.l5_field) {
    // 4 LEVEL REPORT
    mapInvenToRowTemplates = m.mapInvenToRowTemplates_fourLevel
    rowTemplate_unflat = m.unflattenByCompositKey(rowTemplate, { 1: 'l1_label', 2: 'l2_label', 3: 'l3_label', 4: 'l4_label' }) 
  } else {
    // 5 LEVEL REPORT
    mapInvenToRowTemplates = m.mapInvenToRowTemplates_fiveLevel
    rowTemplate_unflat = m.unflattenByCompositKey(rowTemplate, { 1: 'l1_label', 2: 'l2_label', 3: 'l3_label', 4: 'l4_label', 5: 'l5_label' }) 
  }

  const mappedInven = mapInvenToRowTemplates(
    [
      ...l1_InvR,
      ...l2_InvR,
      ...l3_InvR,
      ...l4_InvR,
      ...l5_InvR,
      ...l0_InvR,
      ...l1_OpenPoR,
      ...l2_OpenPoR,
      ...l3_OpenPoR,
      ...l4_OpenPoR,
      ...l5_OpenPoR,
      ...l0_OpenPoR,
    ],
    rowTemplate_unflat
  )

  // const mappedData = m.combineMappedRows([], mappedInven)
  const flattenedMappedData = Object.values(mappedInven)
  const data = m.cleanLabelsForDisplay(flattenedMappedData, config)

  /* Trend Columns */
 
  
  return {
    data,
    cols: {
      labelCols: config.labelCols,
      columnConfigs: m.columnConfigs
    },
  }
}

module.exports = buildReport
