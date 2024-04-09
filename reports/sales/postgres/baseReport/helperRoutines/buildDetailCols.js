const unflattenByCompositKey = require('../../../../utils/unflattenByCompositKey')
const getOthpDefinitions = require('../helperQueries/getOthpDefinitions')
const getUniqueOthpGlsFromMaster = require('../helperQueries/getUniqueOthpGlsFromMaster')

const buildOthpDetailCols = async () => {
  // if there is a date range that does not have any othp gl's, return the master othp gl's
  const uniqueOthpGls = await getUniqueOthpGlsFromMaster()
  const othpDefinitions = await getOthpDefinitions()
  const othpDef_unflat = unflattenByCompositKey(othpDefinitions, { 1: 'othp_gl' })
  const menu = uniqueOthpGls.map(gl => {
    let display_name = othpDef_unflat?.[gl.othp_gl]?.display_name

    return {
      unfilteredColIdx: 99,
      displayName: display_name ? `othp_${display_name.toUpperCase()} $` : `othp_${gl.othp_gl} $`,
      dataName: display_name ? `othp_${display_name}` : `othp_${gl.othp_gl}`,
      justifyData: 'end',
      justifyHeading: 'center',
      width: '160px',
      total: true,
      number: true,
      boolean: false,
      date: false,
      decimals: 0,
      leftSticky: false,
      left: '0px',
      borderRight: false,
      hidden: false,
      view: null,
      data: false,
      isDataDetailFmt: true,
      searchable: false,
      searchValue: null,
      fraction: false,
      fractionNumerator: null,
      fractionDenominator: null,
      groupBy: [
        'fg_fresh_frozen',
        'fg_treatment',
        'size_name',
        'brand',
        'species',
        'week_serial',
        'item_number',
        'location',
        'formatted_invoice_date',
        'invoice_number',
        'customer_code',
        'ungrouped',
      ],
      groupByIncrement: true,
      groupedLeftSticky: [],
      colType: 'salesInvoice',
      defaultSort: false,
    }
  })

  return menu
}

module.exports = buildOthpDetailCols
