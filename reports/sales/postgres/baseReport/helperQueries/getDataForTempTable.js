const sql = require('../../../../../server')

const getDataForTempTable = async (config, uniqueOthpGlsArray, startDate, endDate) => {
  try {
    startDate = startDate ?? config.dates.totals.primary.startDate // detail passes in start date, base does not
    endDate = endDate ?? config.dates.totals.primary.endDate // detail passes in start date, base does not

    console.log(`${config.user} - getDataForTempTable ...`)

    const response = await sql
      `
      SELECT
          scl.invoice_num,
          scl.invoice_line,
          SUM(scl.othp_amount) AS othp_amount
          ${sql`${uniqueOthpGlsArray.map(gl => sql`, SUM(CASE WHEN scl.othp_gl = ${gl.othp_gl} THEN scl.othp_amount ELSE 0 END) AS ${sql(gl.display_name)}`)}`}
      FROM "salesReporting".sales_contra_lines AS scl
          LEFT OUTER JOIN "salesReporting".sales_line_items AS sl
          ON scl.invoice_num = sl.invoice_number AND scl.invoice_line = sl.line_number
      WHERE 
          sl.formatted_invoice_date >= ${startDate} 
          AND sl.formatted_invoice_date <= ${endDate}
      GROUP BY scl.invoice_num, scl.invoice_line
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    console.log(error.query)
    return error
  }
}

module.exports = getDataForTempTable
