const {
  lvl_0_total_getSalesByWk_detail,
  lvl_0_total_getSalesPeriodToDate_detail,
  lvl_2_subtotal_getSalesByWk_detail,
  lvl_2_subtotal_getSalesPeriodToDate_detail,
  lvl_1_subtotal_getSalesByWk_detail,
  lvl_1_subtotal_getSalesPeriodToDate_detail,
  lvl_3_subtotal_getSalesByWk_detail,
  lvl_3_subtotal_getSalesPeriodToDate_detail,
} = require('../queries/postgres/detail/getSales')

const getDetail = async (program, filters, columnDataName, startWeek, periodEnd) => {
  let detail = null

  if (filters[1] === 'SUBTOTAL' && filters[2] === 'SUBTOTAL') {
    // get level 1 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'SALES TOTAL':
        detail = await lvl_1_subtotal_getSalesPeriodToDate_detail(startWeek, periodEnd, program, filters)
        break
      default:
        // this is a trned column
        detail = await lvl_1_subtotal_getSalesByWk_detail(program, filters, columnDataName)
        break
    }
  }

  if (filters[1] !== 'SUBTOTAL' && filters[2] === 'SUBTOTAL') {
    // get level 2 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'SALES TOTAL':
        detail = await lvl_2_subtotal_getSalesPeriodToDate_detail(startWeek, periodEnd, program, filters)
        break
      default:
        // this is a trned column
        detail = await lvl_2_subtotal_getSalesByWk_detail(program, filters, columnDataName)
        break
    }
  }

  if (filters[1] !== 'SUBTOTAL' && filters[2] !== 'SUBTOTAL' && filters[1] !== 'TOTAL' && filters[2] !== 'TOTAL') {
    // get level 3 subtotal where freeze = filters[0] and soak = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'SALES TOTAL':
        detail = await lvl_3_subtotal_getSalesPeriodToDate_detail(startWeek, periodEnd, program, filters)
        break
      default:
        // this is a trned column
        detail = await lvl_3_subtotal_getSalesByWk_detail(program, filters, columnDataName)
        break
    }
  }

  if (filters[1] === 'TOTAL' && filters[2] === 'TOTAL') {
    // get level 0 total where freeze = filters[0] and soak = filters[1] and size = filters[2]

    switch (columnDataName) {
      case 'SALES TOTAL':
        detail = await lvl_0_total_getSalesPeriodToDate_detail(startWeek, periodEnd, program, filters)
        break
      default:
        // this is a trned column
        detail = await lvl_0_total_getSalesByWk_detail(program, filters, columnDataName)
        break
    }
  }

  return detail
}

module.exports = getDetail
