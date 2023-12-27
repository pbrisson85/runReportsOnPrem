const _ = require('lodash')

const mapDataToRowTemplates = (data, rowTemplate, config, viewTrend) => {
  // build mapping key

  const rowTemplateCache = _.cloneDeep(rowTemplate)

  data.forEach(line => {
    // BUILD KEP MAP
    let keyMap = null

    if (viewTrend) {
      // trend should only map by l1_label
      keyMap = line.l1_label
    } else {
      // Build key to map

      for (let i = 0; i < config.baseFormat.groupingLevel; i++) {
        let filter = line[`l${i + 1}_label`]

        // build composite key for unflatten:
        keyMap = keyMap !== null ? `${keyMap}-${filter}` : `${filter}`
      }
    }

    rowTemplateCache[keyMap] = {
      ...rowTemplateCache[keyMap],
      [line.column]: {
        lbs: line.lbs, // was called weight
        grossSales: line.grossSales, // was called revenue
        cogs: line.cogs,
        othp: line.othp,
        netSales: line.netSales,
        grossMargin: line.grossMargin,
        grossMarginPercent: line.grossMarginPercent,
        grossSalesPerLb: line.grossSalesPerLb,
        cogsPerLb: line.cogsPerLb,
        othpPerLb: line.othpPerLb,
        netSalesPerLb: line.netSalesPerLb,
        grossMarginPerLb: line.grossMarginPerLb,
      },
    }
  })

  return rowTemplateCache
}

module.exports = mapDataToRowTemplates
