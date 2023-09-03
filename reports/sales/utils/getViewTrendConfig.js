// Going to put all select fields and group by fields in here to combine all the trend report queries into one set
const sql = require('../../../server')

const getViewTrendConfig = rightMenuSelection => {
  switch (rightMenuSelection) {
    case 'Trend By Item':
      return {
        l1_label: 'ms.item_num',
        l2_label: 'ms.description',
        l3_label: 'ms.fg_fresh_frozen',
        l4_label: 'ms.fg_treatment',
        l5_label: 'ms.brand',
        l6_label: 'ms.size_name',
      }

    case 'Trend By Customer':
      return {
        l1_label: 'ms.item_num',
        l2_label: 'ms.description',
        l3_label: 'ms.fg_fresh_frozen',
        l4_label: 'ms.fg_treatment',
        l5_label: 'ms.brand',
        l6_label: 'ms.size_name',
      }

    case 'Trend By Salesperson':
      return {
        l1_label: 'ms.item_num',
        l2_label: 'ms.description',
        l3_label: 'ms.fg_fresh_frozen',
        l4_label: 'ms.fg_treatment',
        l5_label: 'ms.brand',
        l6_label: 'ms.size_name',
      }

    default:
      return {
        l1_label: 'ms.item_num',
        l2_label: 'ms.description',
        l3_label: 'ms.fg_fresh_frozen',
        l4_label: 'ms.fg_treatment',
        l5_label: 'ms.brand',
        l6_label: 'ms.size_name',
      }
  }
}

module.exports = getViewTrendConfig
