const Decimal = require('decimal.js')
const _ = require('lodash')

const mapSalesToRowTemplates = (salesLines, rowTemplate, config, viewTrend) => {
  // build mapping key

  const rowTemplateCache = _.cloneDeep(rowTemplate)

  let revenuePerLb = 0
  let cogsPerLb = 0
  let othpPerLb = 0
  let netSalesPerLb = 0
  let grossMarginPerLb = 0
  let revenue
  let weight
  let netSales
  let grossMargin

  salesLines.forEach(soLine => {
    let keyMap = null

    if (viewTrend) {
      // trend should only map by l1_label
      keyMap = soLine.l1_label
    } else {
      // Build key to map

      for (let i = 0; i < config.baseFormat.groupingLevel; i++) {
        let filter = soLine[`l${i + 1}_label`]

        // build composite key for unflatten:
        keyMap = keyMap !== null ? `${keyMap}-${filter}` : `${filter}`
      }
    }

    let { sales, lbs, cogs, othp, column, percentFormat, net_sales, gross_margin } = soLine

    // For percent cols
    if (percentFormat) {
      weight = lbs
      revenue = sales
      netSales = net_sales
      grossMargin = gross_margin

      // Still want it to show the % even if viewing per lb metric in the data
      revenuePerLb = revenue
      cogsPerLb = cogs
      othpPerLb = othp
      netSalesPerLb = netSales
      grossMarginPerLb = grossMargin
    } else {
      // For data cols
      revenue = parseFloat(sales.toFixed(2))
      weight = parseFloat(lbs.toFixed(2))
      cogs = parseFloat(cogs.toFixed(2))
      othp = parseFloat(othp.toFixed(2))
      netSales = parseFloat(new Decimal(sales).minus(othp).toFixed(2))
      grossMargin = parseFloat(new Decimal(sales).minus(cogs).minus(othp).toFixed(2))

      if (lbs !== null && lbs !== 0) {
        revenuePerLb = parseFloat(new Decimal(sales).dividedBy(lbs).toFixed(2))
        cogsPerLb = parseFloat(new Decimal(cogs).dividedBy(lbs).toFixed(2))
        othpPerLb = parseFloat(new Decimal(othp).dividedBy(lbs).toFixed(2))
        netSalesPerLb = parseFloat(new Decimal(sales).minus(othp).dividedBy(lbs).toFixed(2))
        grossMarginPerLb = parseFloat(new Decimal(sales).minus(cogs).minus(othp).dividedBy(lbs).toFixed(2))
      }
    }

    rowTemplateCache[keyMap] = {
      ...rowTemplateCache[keyMap],
      [column]: {
        weight,
        revenue,
        cogs,
        othp,
        netSales,
        grossMargin,
        revenuePerLb,
        cogsPerLb,
        othpPerLb,
        netSalesPerLb,
        grossMarginPerLb,
      },
    }
  })

  return rowTemplateCache
}

module.exports = mapSalesToRowTemplates
