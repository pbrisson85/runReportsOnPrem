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
          `INSERT INTO "salesReporting".sales_line_items 
            (item_number, item_description, qty_shipped, pricing_unit, stock_qty_shipped, stock_unit_of_measure, list_price, gross_sales_ext, net_sales_price, net_sales_ext, sales_ledger_cost_ext, invoice_number, line_number, billing_weight, gl_dist, inside_salesperson_code, outside_salesperson_code, week_serial, period_serial, week, period, fiscal_year, formatted_invoice_date, original_order_invoice, order_number, ship_date, gl_posting_date, customer_code, customer_name, shipto_code, truck_route, customer_order_number, ship_method, reason_code, customer_terms_code, ship_via_code, reas_description, reas_adj_inv, cogs_ext_gl, othp_ext, calc_gm_rept_weight,  gross_sales_lb, net_sales_lb, gross_margin_ext, gross_margin_lb, cost_lb, othp_lb, location)
            
          VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48) 
            
            ON CONFLICT (invoice_number, line_number) 
            
            DO UPDATE SET 
              item_number = $1, 
              item_description = $2, 
              qty_shipped = $3, 
              pricing_unit = $4, 
              stock_qty_shipped = $5, 
              stock_unit_of_measure =  $6, 
              list_price = $7, 
              gross_sales_ext = $8, 
              net_sales_price = $9, 
              net_sales_ext = $10, 
              sales_ledger_cost_ext = $11, 
              invoice_number = $12, 
              line_number = $13, 
              billing_weight = $14, 
              gl_dist = $15, 
              inside_salesperson_code = $16, 
              outside_salesperson_code = $17, 
              week_serial = $18, 
              period_serial = $19, 
              week = $20, 
              period = $21, 
              fiscal_year = $22, 
              formatted_invoice_date = $23, 
              original_order_invoice = $24, 
              order_number = $25, 
              ship_date = $26, 
              gl_posting_date = $27, 
              customer_code = $28, 
              customer_name = $29, 
              shipto_code = $30, 
              truck_route = $31, 
              customer_order_number = $32, 
              ship_method = $33, 
              reason_code = $34, 
              customer_terms_code = $35, 
              ship_via_code = $36, 
              reas_description = $37, 
              reas_adj_inv = $38, 
              cogs_ext_gl = $39, 
              othp_ext = $40, 
              calc_gm_rept_weight = $41,
              gross_sales_lb = $42, 
              net_sales_lb = $43, 
              gross_margin_ext = $44,, 
              gross_margin_lb = $45, 
              cost_lb = $46, 
              othp_lb = $47, 
              location = $48`,
          [
            soLine.item_number,
            soLine.item_description,
            soLine.qty_shipped,
            soLine.pricing_unit,
            soLine.stock_qty_shipped,
            soLine.stock_unit_of_measure,
            soLine.list_price,
            soLine.gross_sales_ext,
            soLine.net_sales_price,
            soLine.net_sales_ext,
            soLine.sales_ledger_cost_ext,
            soLine.invoice_number,
            soLine.line_number,
            soLine.billing_weight,
            soLine.gl_dist,
            soLine.inside_salesperson_code,
            soLine.outside_salesperson_code,
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
            soLine.cogs_ext_gl,
            soLine.othp_ext,
            soLine.calc_gm_rept_weight,
            soLine.gross_sales_lb,
            soLine.net_sales_lb,
            soLine.gross_margin_ext,
            soLine.gross_margin_lb,
            soLine.cost_lb,
            soLine.othp_lb,
            soLine.location,
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
