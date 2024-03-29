const sql = require('../../../../../server')

const createTempTable = async (config, uniqueOthpGlsArray) => {
  try {
    console.log(`${config.user} - createTempTable ...`)

    const tag = Date.now()
    const tmpTableName = '"salesReporting".sales_contra_lines_temp_' + tag
    const constraint = `${tmpTableName}_pkey`

    let createString = `CREATE TABLE IF NOT EXISTS ${tmpTableName} `
    let colString = `(
      invoice_num character varying(255) NOT NULL,
      invoice_line character varying(255) NOT NULL,
      othp_amount numeric NOT NULL,`

    for (gl of uniqueOthpGlsArray) {
      colString = `${colString} ${gl.display_name} numeric NOT NULL,`
    }

    let constraintString = `CONSTRAINT ${constraint} PRIMARY KEY (invoice_num, invoice_line))`

    let queryString = `${createString} ${colString} ${constraintString}`

    // const response = await sql
    // `
    //   CREATE TABLE IF NOT EXISTS ${sql(tmpTableName)}
    //   (
    //       invoice_num character varying(255) NOT NULL,
    //       invoice_line character varying(255) NOT NULL,
    //       othp_amount numeric NOT NULL,
    //       ${sql()}
    //       CONSTRAINT ${sql(constraint)} PRIMARY KEY (invoice_num, invoice_line)
    //   )
    // ` //prettier-ignore

    const response = await sql`${sql(queryString)}`

    return tmpTableName
  } catch (error) {
    console.error(error)
    console.log(error.query)
    return error
  }
}

module.exports = createTempTable
