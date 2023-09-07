const mapPostgresSalesLinesTable = joinedSalesData => {
  const mappedData = joinedSalesData.map((invoiceLine, idx) => {
    let calc_gl_cogs = 0

    if (typeof invoiceLine.invenSupplemental === 'undefined') {
      // console.log('invoiceLine', invoiceLine) // DEBUG ***************
    } else {
      calc_gl_cogs =
        invoiceLine.invenSupplemental.inven_category === 'NON-SEAFOOD' || invoiceLine.invenSupplemental.inven_category === 'SUPPLIES'
          ? 0
          : invoiceLine.INVOICE_EXT_COST
    }

    const credit_invoice = invoiceLine.ODBC_INVOICE_NUMBER.charAt(invoiceLine.ODBC_INVOICE_NUMBER.length - 1) === 'C' ? true : false

    // Note in some cases the reason code on a credit is not a valid reason code (see 618730C). In this case use the product cost to determine if there is weight effect to the GM report.
    if (typeof invoiceLine.invReasCodes === 'undefined') {
      invoiceLine.invReasCodes = {
        TABLE_DESC: null,
        TABLE_FLD01_ADJ_INV: invoiceLine.INVOICE_EXT_COST === 0 ? 'N' : 'Y',
      }
    }

    // Note that in some cases (2019 and prior) the invoice posting date per the header is null (See 544679D). In this case use the ship date
    if (invoiceLine.header.GL_POSTING_DATE === null) {
      invoiceLine.header.GL_POSTING_DATE = invoiceLine.header.SHIP_DATE
    }

    const calc_gm_reprt_weight = !credit_invoice
      ? invoiceLine.BILLING_WEIGHT
      : invoiceLine.invReasCodes.TABLE_FLD01_ADJ_INV === 'Y'
      ? invoiceLine.BILLING_WEIGHT
      : 0

    // State and country should first be obtained from the the ship to. If there is no ship to then use the validated ship to field from the order and then use customer master file as a fall back.
    let state = null
    let country = null
    let address_source = null
    if (invoiceLine.shipToFile !== null) {
      // Use ship to file
      address_source = 'ship_to_file'
      country = invoiceLine.shipToFile.COUNTRY_CODE
      if (country === 'USA') {
        state = invoiceLine.shipToFile.STATE
      } else {
        if (invoiceLine.header.DOCUMENT_NUMBER === '324308') {
          console.log('hit order 324308 and state should read OUSIDE USA')
        }

        state = 'OUTSIDE USA'
      }
    } else if (invoiceLine.orderInfo !== null) {
      // Use order info
      address_source = 'order_info'
      country = 'USA' // orderInfo has been filtered to only include valid US states
      state = invoiceLine.orderInfo.SHIPTO_STATE
    } else {
      // Use customer master file
      address_source = 'customer_master'
      country = invoiceLine.customerMaster.COUNTRY_CODE
      if (country === 'USA') {
        state = invoiceLine.customerMaster.STATE
        if (state === '') {
          state = 'NONE'
        }
      } else {
        state = 'OUTSIDE USA'
      }
    }

    return {
      item_number: invoiceLine.ITEM_NUMBER,
      item_description: invoiceLine.ITEM_DESCRIPTION,
      qty_shipped: invoiceLine.QTY_SHIPPED,
      pricing_unit: invoiceLine.PRICING_UNIT,
      stock_qty_shipped: invoiceLine.STOCK_QTY_SHIPPED,
      stock_unit_of_measure: invoiceLine.STOCK_UNIT_OF_MEASURE,
      list_price: invoiceLine.LIST_PRICE,
      gross_sales_ext: invoiceLine.NET_PRICE_EXTENSION, // Changed from net_price_extension to gross_sales_ext
      net_sales_price: invoiceLine.PRODUCT_ONLY_PRICE, // Changed from product_only_price to net_sales_price
      net_sales_ext: invoiceLine.PRODUCT_ONLY_EXTENSION, // Changed from product_only_extension to net_sales_ext
      sales_ledger_cost_ext: invoiceLine.INVOICE_EXT_COST, // Changed from invoice_ext_cost to sales_ledger_cost_ext
      invoice_number: invoiceLine.ODBC_INVOICE_NUMBER, // pkey // Changed from odbc_invoice_number to invoice_number
      line_number: invoiceLine.ODBC_LINE_NUMBER, // pkey // Changed from odbc_line_number to line_number
      // odbc_invoice_date: invoiceLine.ODBC_INVOICE_DATE, // Deleted column
      billing_weight: invoiceLine.BILLING_WEIGHT,
      gl_dist: invoiceLine.GL_DIST,
      inside_salesperson_code: invoiceLine.INSIDE_SALESPERSON_CODE,
      outside_salesperson_code: invoiceLine.OUTSIDE_SALESPERSON_CODE,
      outside_salesperson_name: invoiceLine.salesPerson.NAME,
      week_serial: invoiceLine.period.week_serial,
      period_serial: invoiceLine.period.period_serial,
      week: invoiceLine.period.week,
      period: invoiceLine.period.period,
      fiscal_year: invoiceLine.period.fiscal_year,
      formatted_invoice_date: invoiceLine.period.formattedDate,
      original_order_invoice: invoiceLine.header.ORIGINAL_ORDER_INVOICE, // allow null
      order_number: invoiceLine.header.DOCUMENT_NUMBER,
      ship_date: new Date(invoiceLine.header.SHIP_DATE), // changed format from string to date
      gl_posting_date: new Date(invoiceLine.header.GL_POSTING_DATE), // changed format from string to date
      customer_code: invoiceLine.header.CUSTOMER_CODE,
      customer_name: invoiceLine.header.CUSTOMER_NAME,
      shipto_code: invoiceLine.header.SHIPTO_CODE,
      truck_route: invoiceLine.header.TRUCK_ROUTE,
      customer_order_number: invoiceLine.header.CUSTOMER_ORDER_NUMBER, // allow null
      ship_method: invoiceLine.header.SHIP_METHOD,
      reason_code: invoiceLine.header.REASON_CODE, // allow null
      customer_terms_code: invoiceLine.header.CUSTOMER_TERMS_CODE,
      ship_via_code: invoiceLine.header.SHIP_VIA_CODE,
      reas_description: invoiceLine.invReasCodes.TABLE_DESC, // allow null
      reas_adj_inv: invoiceLine.invReasCodes.TABLE_FLD01_ADJ_INV === 'Y', // allow null
      // calc_gl_gross_sales: invoiceLine.NET_PRICE_EXTENSION, // deleted, use gross_sales_ext
      cogs_ext_gl: calc_gl_cogs, // Changed from calc_gl_cogs to cogs_ext_gl
      othp_ext: invoiceLine.NET_PRICE_EXTENSION - invoiceLine.PRODUCT_ONLY_EXTENSION, // Changed from calc_gl_othp to othp_ext
      calc_gm_rept_weight: calc_gm_reprt_weight,
      gross_sales_lb: invoiceLine.BILLING_WEIGHT === 0 ? 0 : invoiceLine.NET_PRICE_EXTENSION / invoiceLine.BILLING_WEIGHT,
      net_sales_lb: invoiceLine.BILLING_WEIGHT === 0 ? 0 : invoiceLine.PRODUCT_ONLY_EXTENSION / invoiceLine.BILLING_WEIGHT,
      gross_margin_ext: invoiceLine.PRODUCT_ONLY_EXTENSION - calc_gl_cogs,
      gross_margin_lb: invoiceLine.BILLING_WEIGHT === 0 ? 0 : (invoiceLine.PRODUCT_ONLY_EXTENSION - calc_gl_cogs) / invoiceLine.BILLING_WEIGHT,
      cost_lb: invoiceLine.BILLING_WEIGHT === 0 ? 0 : calc_gl_cogs / invoiceLine.BILLING_WEIGHT,
      othp_lb:
        invoiceLine.BILLING_WEIGHT === 0
          ? 0
          : (invoiceLine.NET_PRICE_EXTENSION - invoiceLine.PRODUCT_ONLY_EXTENSION) / invoiceLine.BILLING_WEIGHT,
      location: invoiceLine.LOCATION,
      state,
      country,
      address_source,
    }
  })

  return mappedData
}

module.exports = mapPostgresSalesLinesTable
