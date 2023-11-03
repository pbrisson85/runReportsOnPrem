const sql = require('../../../server')

const getCalMonthByRange = async (start, end, config) => {
  const periodsByWeek =
    await sql`SELECT DISTINCT(EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date)) AS dataName, DISTINCT(EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date)) AS displayName 
    
    FROM "salesReporting".sales_line_items 
    
    WHERE sales_line_items.formatted_invoice_date >= '01-01-2023' AND sales_line_items.formatted_invoice_date <= '11-30-2023' 
    
    ORDER BY EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date) ASC`

  return periodsByWeek
}

module.exports.getCalMonthByRange = getCalMonthByRange
