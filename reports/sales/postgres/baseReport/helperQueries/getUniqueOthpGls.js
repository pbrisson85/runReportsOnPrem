const sql = require('../../../../server')

const getUniqueOthpGls = async config => {
  try {
    console.log(`${config.user} - getUniqueOthpGls ...`)

    const response = await sql
      `SELECT ct.othp_gl
        FROM "salesReporting".sales_contra_lines AS ct
            LEFT OUTER JOIN "salesReporting".sales_line_items AS sl
            ON ct.invoice_num = sl.invoice_number AND ct.invoice_line = sl.line_number
        WHERE 
            sl.formatted_invoice_date >= ${config.dates.totals.primary.startDate} 
            AND sl.formatted_invoice_date <= ${config.dates.totals.primary.endDate} 
        GROUP BY ct.othp_gl 
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    console.log(error.query)
    return error
  }
}

module.exports = getUniqueOthpGls
