// Going to put all select fields and group by fields in here to combine all the trend report queries into one set
const sql = require('../../../server')

const getViewTrendConfig = rightMenuSelection => {
  let trendQuery = null

  switch (rightMenuSelection) {
    case 'Trend By Item':
      trendQuery = {
        fields: ['item_num', 'description', 'fg_fresh_frozen', 'fg_treatment', 'brand', 'size_name'],
        select: [
          'item_num l1_label',
          'description l2_label',
          'fg_fresh_frozen l3_label',
          'fg_treatment l4_label',
          'brand l5_label',
          'size_name l6_label',
        ],
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
