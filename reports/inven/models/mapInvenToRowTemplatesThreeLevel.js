const Decimal = require('decimal.js')
const _ = require('lodash')

const mapInvenToRowTemplates = (invenLines, rowTemplate) => {
  const rowTemplateCache = _.cloneDeep(rowTemplate)

  let revenuePerLb = 0
  let cogsPerLb = 0
  let othpPerLb = 0
  let netSalesPerLb = 0
  let grossMarginPerLb = 0

  // Note only cost and lbs for inven data.

  invenLines.forEach((invenLine, idx) => {
    const revenue = parseFloat(invenLine.cogs.toFixed(2))
    const weight = parseFloat(invenLine.lbs.toFixed(2))
    const cogs = parseFloat(invenLine.cogs.toFixed(2))
    const othp = parseFloat(invenLine.cogs.toFixed(2))
    const netSales = parseFloat(invenLine.cogs.toFixed(2))
    const grossMargin = parseFloat(invenLine.cogs.toFixed(2))

    if (invenLine.suppressCalcPerLb) {
      // Dont calc per lb for kpi ratio
      revenuePerLb = revenue
      cogsPerLb = cogs
      othpPerLb = othp
      netSalesPerLb = netSales
      grossMarginPerLb = grossMargin
    } else {
      if (invenLine.lbs !== null && invenLine.lbs !== 0) {
        revenuePerLb = parseFloat(new Decimal(invenLine.cogs).dividedBy(invenLine.lbs).toFixed(2)) // Revenue, COGS, OTHP, Net Sales, Gross Margin are all the same for inven data.
        cogsPerLb = parseFloat(new Decimal(invenLine.cogs).dividedBy(invenLine.lbs).toFixed(2))
        othpPerLb = parseFloat(new Decimal(invenLine.cogs).dividedBy(invenLine.lbs).toFixed(2))
        netSalesPerLb = parseFloat(new Decimal(invenLine.cogs).dividedBy(invenLine.lbs).toFixed(2))
        grossMarginPerLb = parseFloat(new Decimal(invenLine.cogs).dividedBy(invenLine.lbs).toFixed(2))
      }
    }

    // Note that using index 0 on the rowTemplate because the unflattenRowTemplate function now uses an array of objects
    rowTemplateCache[`${invenLine.l1_label}-${invenLine.l2_label}-${invenLine.l3_label}`] = {
      ...rowTemplateCache[`${invenLine.l1_label}-${invenLine.l2_label}-${invenLine.l3_label}`],
      [invenLine.column]: {
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

module.exports = mapInvenToRowTemplates
