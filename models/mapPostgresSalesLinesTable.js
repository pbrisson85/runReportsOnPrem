const mapPostgresSalesLinesTable = joinedSalesData => {
  const mappedData = joinedSalesData.map(invoiceLine => {
    const calc_gl_cogs =
      invoiceLine.invenSupplemental.inven_category === 'NON-SEAFOOD' || invoiceLine.invenSupplemental.inven_category === 'SUPPLIES'
        ? 0
        : invoiceLine.INVOICE_EXT_COST

    const credit_invoice = invoiceLine.ODBC_INVOICE_NUMBER.charAt(invoiceLine.ODBC_INVOICE_NUMBER.length - 1) === 'C' ? true : false

    // Note in some cases the reason code on a credit is not a valid reason code (see 618730C). In this case use the product cost to determine if there is weight effect to the GM report.
    if (typeof invoiceLine.invReasCodes === 'undefined') {
      invoiceLine.invReasCodes = {
        TABLE_DESC: null,
        TABLE_FLD01_ADJ_INV: invoiceLine.INVOICE_EXT_COST === 0 ? 'N' : 'Y',
      }
    }

    const calc_gm_reprt_weight = !credit_invoice
      ? invoiceLine.BILLING_WEIGHT
      : invoiceLine.invReasCodes.TABLE_FLD01_ADJ_INV === 'Y'
      ? invoiceLine.BILLING_WEIGHT
      : 0

    return {
      item_number: invoiceLine.ITEM_NUMBER,
      item_description: invoiceLine.ITEM_DESCRIPTION,
      qty_shipped: invoiceLine.QTY_SHIPPED,
      pricing_unit: invoiceLine.PRICING_UNIT,
      stock_qty_shipped: invoiceLine.STOCK_QTY_SHIPPED,
      stock_unit_of_measure: invoiceLine.STOCK_UNIT_OF_MEASURE,
      list_price: invoiceLine.LIST_PRICE,
      net_price_extension: invoiceLine.NET_PRICE_EXTENSION,
      product_only_price: invoiceLine.PRODUCT_ONLY_PRICE,
      product_only_extension: invoiceLine.PRODUCT_ONLY_EXTENSION,
      invoice_ext_cost: invoiceLine.INVOICE_EXT_COST,
      odbc_invoice_number: invoiceLine.ODBC_INVOICE_NUMBER, // pkey
      odbc_line_number: invoiceLine.ODBC_LINE_NUMBER, // pkey
      odbc_invoice_date: invoiceLine.ODBC_INVOICE_DATE,
      billing_weight: invoiceLine.BILLING_WEIGHT,
      gl_dist: invoiceLine.GL_DIST,
      inside_salesperson_code: invoiceLine.INSIDE_SALESPERSON_CODE,
      outside_salesperson_code: invoiceLine.OUTSIDE_SALESPERSON_CODE,
      week_serial: invoiceLine.period.week_serial,
      period_serial: invoiceLine.period.period_serial,
      week: invoiceLine.period.week,
      period: invoiceLine.period.period,
      fiscal_year: invoiceLine.period.fiscal_year,
      formatted_invoice_date: invoiceLine.period.formattedDate,
      original_order_invoice: invoiceLine.header.ORIGINAL_ORDER_INVOICE, // allow null
      order_number: invoiceLine.header.DOCUMENT_NUMBER,
      ship_date: invoiceLine.header.SHIP_DATE,
      gl_posting_date: invoiceLine.header.GL_POSTING_DATE,
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
      calc_gl_gross_sales: invoiceLine.NET_PRICE_EXTENSION,
      calc_gl_cogs: calc_gl_cogs,
      calc_gl_othp: invoiceLine.NET_PRICE_EXTENSION - invoiceLine.PRODUCT_ONLY_EXTENSION,
      calc_gm_rept_weight: calc_gm_reprt_weight,
    }
  })

  return mappedData
}

module.exports = mapPostgresSalesLinesTable
