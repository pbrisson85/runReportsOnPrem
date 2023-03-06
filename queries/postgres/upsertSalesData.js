const upsertSalesData = async salesData => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log('upsert data to postgres by SO line ...')

    let promises = []
    for (soLine of salesData) {
      promises.push(
        pgClient.query(
          'INSERT INTO "salesReporting".sales_line_items (item_number, item_description, qty_shipped, pricing_unit, stock_qty_shipped, stock_unit_of_measure, list_price, net_price_extension, product_only_price, product_only_extension, invoice_ext_cost, odbc_invoice_number, odbc_line_number, odbc_invoice_date, billing_weight, gl_dist, inside_salesperson_code, outside_salesperson_code, species, inven_category, seafood_category, item_type, size_name, program, species_group, fg_treatment, week_serial, period_serial, week, period, fiscal_year, formatted_invoice_date, original_order_invoice, order_number, ship_date, gl_posting_date, customer_code, customer_name, shipto_code, truck_route, customer_order_number, ship_method, reason_code, customer_terms_code, ship_via_code, reas_description, reas_adj_inv, calc_gl_gross_sales, calc_gl_cogs, calc_gl_othp, calc_gm_rept_weight)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51) ON CONFLICT (odbc_invoice_number, odbc_line_number) DO UPDATE SET item_number = $1, item_description = $2, qty_shipped = $3, pricing_unit = $4, stock_qty_shipped = $5, stock_unit_of_measure =  $6, list_price = $7, net_price_extension = $8, product_only_price = $9, product_only_extension = $10, invoice_ext_cost = $11, odbc_invoice_number = $12, odbc_line_number = $13, odbc_invoice_date = $14, billing_weight = $15, gl_dist = $16, inside_salesperson_code = $17, outside_salesperson_code = $18, species = $19, inven_category = $20, seafood_category = $21, item_type = $22, size_name = $23, program = $24, species_group = $25, fg_treatment = $26, week_serial = $27, period_serial = $28, week = $29, period = $30, fiscal_year = $31, formatted_invoice_date = $32, original_order_invoice = $33, order_number = $34, ship_date = $35, gl_posting_date = $36, customer_code = $37, customer_name = $38, shipto_code = $39, truck_route = $40, customer_order_number = $41, ship_method = $42, reason_code = $43, customer_terms_code = $44, ship_via_code = $45, reas_description = $46, reas_adj_inv = $47, calc_gl_gross_sales = $48, calc_gl_cogs = $49, calc_gl_othp = $50, calc_gm_rept_weight = $51',
          [
            soLine.item_number,
            soLine.item_description,
            soLine.qty_shipped,
            soLine.pricing_unit,
            soLine.stock_qty_shipped,
            soLine.stock_unit_of_measure,
            soLine.list_price,
            soLine.net_price_extension,
            soLine.product_only_price,
            soLine.product_only_extension,
            soLine.invoice_ext_cost,
            soLine.odbc_invoice_number,
            soLine.odbc_line_number,
            soLine.odbc_invoice_date,
            soLine.billing_weight,
            soLine.gl_dist,
            soLine.inside_salesperson_code,
            soLine.outside_salesperson_code,
            soLine.species,
            soLine.inven_category,
            soLine.seafood_category,
            soLine.item_type,
            soLine.size_name,
            soLine.program,
            soLine.species_group,
            soLine.fg_treatment,
            soLine.week_serial,
            soLine.period_serial,
            soLine.week,
            soLine.period,
            soLine.fiscal_year,
            soLine.formatted_invoice_date,
            soLine.original_order_invoice,
            soLine.order_number,
            soLine.ship_date,
            soLine.gl_posting_date,
            soLine.customer_code,
            soLine.customer_name,
            soLine.shipto_code,
            soLine.truck_route,
            soLine.customer_order_number,
            soLine.ship_method,
            soLine.reason_code,
            soLine.customer_terms_code,
            soLine.ship_via_code,
            soLine.reas_description,
            soLine.reas_adj_inv,
            soLine.calc_gl_gross_sales,
            soLine.calc_gl_cogs,
            soLine.calc_gl_othp,
            soLine.calc_gm_rept_weight,
          ]
        )
      )
    }

    const responses = await Promise.all(promises)

    let rowsUpdatedCount = 0

    responses.forEach(res => {
      rowsUpdatedCount += res.rowCount
    })

    console.log(`upserted ${rowsUpdatedCount} rows to postgres`)

    await pgClient.end()

    return true
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = upsertSalesData
