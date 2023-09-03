// Going to put all select fields and group by fields in here to combine all the trend report queries into one set
const sql = require('../../../server')

const getViewTrendConfig = rightMenuSelection => {
  let trendQuery = null

  switch (rightMenuSelection) {
    case 'Trend By Item':
      const select = {
        l1_label: 'ms.item_num',
        l2_label: 'ms.description',
        l3_label: 'ms.fg_fresh_frozen',
        l4_label: 'ms.fg_treatment',
        l5_label: 'ms.brand',
        l6_label: 'ms.size_name',
      }

      break

    case 'Trend By Customer':
      trendQuery = {
        fields: 'species_group',
      }
      d
      break

    case 'Trend By Salesperson':
      trendQuery = {
        fields: 'species_group',
      }

      break

    default:
      trendQuery = {
        fields: 'species_group',
      }
  }

  return trendQuery
}

module.exports = getViewTrendConfig
