const sql = require('../../../../../server')

const getDataForTempTable = async (config, uniqueOthpGlsArray) => {
  try {
    console.log(`${config.user} - getDataForTempTable ...`)

    let selectString = ''

    for (gl of uniqueOthpGlsArray) {
      if (selectString === '') {
        selectString = `SUM(CASE WHEN scl.othp_gl = '${gl.othp_gl}' THEN scl.othp_amount ELSE 0 END) AS ${gl.display_name}`
      } else {
        selectString = `${selectString}, SUM(CASE WHEN scl.othp_gl = '${gl.othp_gl}' THEN scl.othp_amount ELSE 0 END) AS ${gl.display_name}`
      }
    }

    const response = await sql
      `
      SELECT
          scl.invoice_num,
          scl.invoice_line,
          scl.othp_amount,
          ${sql`${selectString}`}
      FROM "salesReporting".sales_contra_lines AS scl
          LEFT OUTER JOIN "salesReporting".sales_line_items AS sl
          ON scl.invoice_num = sl.invoice_number AND scl.invoice_line = sl.line_number
      WHERE 
          sl.formatted_invoice_date >= ${config.dates.totals.primary.startDate} 
          AND sl.formatted_invoice_date <= ${config.dates.totals.primary.endDate}
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    console.log(error.query)
    return error
  }
}

module.exports = getDataForTempTable