const Decimal = require('decimal.js')
const _ = require('lodash')

const mapSalesToRowTemplates = (salesLines, rowTemplate) => {
  const rowTemplateCache = _.cloneDeep(rowTemplate)

  let revenuePerLb = 0
  let cogsPerLb = 0
  let othpPerLb = 0
  let netSalesPerLb = 0
  let grossMarginPerLb = 0

  salesLines.forEach(soLine => {
    const revenue = parseFloat(soLine.sales.toFixed(2))
    const weight = parseFloat(soLine.lbs.toFixed(2))
    const cogs = parseFloat(soLine.cogs.toFixed(2))
    const othp = parseFloat(soLine.othp.toFixed(2))
    const netSales = parseFloat(new Decimal(soLine.sales).minus(soLine.othp).toFixed(2))
    const grossMargin = parseFloat(new Decimal(soLine.sales).minus(soLine.cogs).minus(soLine.othp).toFixed(2))

    if (soLine.lbs !== null && soLine.lbs !== 0) {
      revenuePerLb = parseFloat(new Decimal(soLine.sales).dividedBy(soLine.lbs).toFixed(2))
      cogsPerLb = parseFloat(new Decimal(soLine.cogs).dividedBy(soLine.lbs).toFixed(2))
      othpPerLb = parseFloat(new Decimal(soLine.othp).dividedBy(soLine.lbs).toFixed(2))
      netSalesPerLb = parseFloat(new Decimal(soLine.sales).minus(soLine.othp).dividedBy(soLine.lbs).toFixed(2))
      grossMarginPerLb = parseFloat(new Decimal(soLine.sales).minus(soLine.cogs).minus(soLine.othp).dividedBy(soLine.lbs).toFixed(2))
    }

    rowTemplateCache[`${soLine.l1_grouping}-${soLine.l2_grouping}`] = {
      ...rowTemplateCache[`${soLine.l1_grouping}-${soLine.l2_grouping}`],
      [soLine.column]: {
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

/*
  mappedSales
  "PROCESSED": {
            "row": "PROCESSED",
            "2022-W01": {
                "lbs": -3660,
                "sales": -17245,
                "net_sales": -17144.73, <-- Calculated
                "cogs": -13828.28,
                "othp": 100.26999999999998
            },
            "2022-W06": {
                "lbs": -3660,
                "sales": -17245,
                "net_sales": -17144.73, <-- Calculated
                "cogs": -13828.28,
                "othp": 100.26999999999998
            },
  */

module.exports = mapSalesToRowTemplates
