// Going to put all select fields and group by fields in here to combine all the trend report queries into one set

const getViewTrendConfig = rightMenuSelection => {
  let trendQuery = null

  switch (rightMenuSelection) {
    case 'Trend By Item':
      trendQuery = {
        fields: ['ms.item_num', 'ms.description', 'ms.fg_fresh_frozen', 'ms.fg_treatment', 'ms.brand', 'ms.size_name'],
      }

      break

    case 'Trend By Customer':
      trendQuery = {
        fields: 'ms.species_group',
      }
      d
      break

    case 'Trend By Salesperson':
      trendQuery = {
        fields: 'ms.species_group',
      }

      break

    default:
      trendQuery = {
        fields: 'ms.species_group',
      }
  }

  return trendQuery
}

module.exports = getViewTrendConfig
