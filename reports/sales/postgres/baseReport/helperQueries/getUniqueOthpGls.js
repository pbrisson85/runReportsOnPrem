const sql = require('../../../../../server')

const getUniqueOthpGls = async (config, startDate, endDate) => {
  try {
    console.log(`${config.user ?? null} - getUniqueOthpGls ...`)

    startDate = startDate ?? config.dates.totals.primary.startDate // detail passes in start date, base does not
    endDate = endDate ?? config.dates.totals.primary.endDate // detail passes in start date, base does not

    const response = await sql
      `SELECT ct.othp_gl
        FROM "salesReporting".sales_contra_lines AS ct
        WHERE 
            ct.formatted_invoice_date >= ${startDate} 
            AND ct.formatted_invoice_date <= ${endDate} 
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
