const sql = require('../../../../../server')

const createTempTable = async (config, uniqueOthpGlsArray) => {
  try {
    console.log(`${config.user} - createTempTable ...`)

    const tag = Date.now()
    const tmpTableName = 'salesReporting.sales_contra_lines_temp_' + tag
    const constraint = `sales_contra_lines_temp_${tag}_pkey`

    await sql`CREATE TABLE IF NOT EXISTS ${sql(tmpTableName)}
    (
      invoice_num character varying(255) NOT NULL,
      invoice_line character varying(255) NOT NULL,
      othp_amount numeric NOT NULL,
      ${sql`${uniqueOthpGlsArray.map(gl => sql`${sql(gl.display_name)} numeric NOT NULL,`)}`}
      CONSTRAINT ${sql(constraint)} PRIMARY KEY (invoice_num, invoice_line)
    )` //prettier-ignore

    return tmpTableName
  } catch (error) {
    console.error(error)
    console.log(error.query)
    return error
  }
}

module.exports = createTempTable
