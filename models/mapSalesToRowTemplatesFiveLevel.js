const Decimal = require('decimal.js')
const _ = require('lodash')

const mapSalesToRowTemplates = (salesLines, rowTemplate) => {
  console.log('rowTemplate: ', rowTemplate)

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
    let {
      sales_numerator,
      sales_denominator,
      lbs_numerator,
      lbs_denominator,
      cogs_numerator,
      cogs_denominator,
      othp_numerator,
      othp_denominator,
      sales,
      lbs,
      cogs,
      othp,
      l1_label,
      l2_label,
      l3_label,
      l4_label,
      l5_label,
      column,
      percentFormat,
    } = soLine

    // For percent cols
    if (percentFormat) {
      revenue = parseFloat(new Decimal(sales_numerator).dividedBy(sales_denominator).toFixed(2))
      weight = parseFloat(new Decimal(lbs_numerator).dividedBy(lbs_denominator).toFixed(2))
      cogs = parseFloat(new Decimal(cogs_numerator).dividedBy(cogs_denominator).toFixed(2))
      othp = parseFloat(new Decimal(othp_numerator).dividedBy(othp_denominator).toFixed(2))
      const netSales_numerator = parseFloat(new Decimal(sales_numerator).minus(othp_numerator).toFixed(2))
      const netSales_denominator = parseFloat(new Decimal(sales_denominator).minus(othp_denominator).toFixed(2))
      netSales = parseFloat(new Decimal(netSales_numerator).dividedBy(netSales_denominator).toFixed(2))
      const grossMargin_numerator = parseFloat(new Decimal(sales_numerator).minus(cogs_numerator).minus(othp_numerator).toFixed(2))
      const grossMargin_denominator = parseFloat(new Decimal(sales_denominator).minus(cogs_denominator).minus(othp_denominator).toFixed(2))
      grossMargin = parseFloat(new Decimal(grossMargin_numerator).dividedBy(grossMargin_denominator).toFixed(2))

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

    rowTemplateCache[`${l1_label}-${l2_label}-${l3_label}-${l4_label}-${l5_label}`] = {
      ...rowTemplateCache[`${l1_label}-${l2_label}-${l3_label}-${l4_label}-${l5_label}`],
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
