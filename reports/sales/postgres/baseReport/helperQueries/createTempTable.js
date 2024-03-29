const sql = require('../../../../../server')

const createTempTable = async (config, uniqueOthpGlsArray) => {
  try {
    console.log(`${config.user} - createTempTable ...`)

    const tag = Date.now()
    const tmpTableName = '"salesReporting".sales_contra_lines_temp_' + tag
    const constraint = `${tmpTableName}_pkey`

    // console.log('tmpTableName', tmpTableName)
    // console.log('constraint', constraint)

    // let createString = ''

    // for (gl of uniqueOthpGlsArray) {
    //   createString = `${createString} ${gl.display_name} numeric NOT NULL,`
    // }

    const columns = [
      { name: 'invoice_num', type: 'character varying(255)', primary: true },
      { name: 'invoice_line', type: 'character varying(255)', primary: true },
      { name: 'othp_amount', type: 'numeric' },
    ]

    // for (gl of uniqueOthpGlsArray) {
    //   columns.push({ name: gl.display_name, type: 'numeric' })
    // }

    //console.log('createString', createString)

    // const response = await sql
    // `
    //   CREATE TABLE IF NOT EXISTS ${sql(tmpTableName)}
    //   (
    //       invoice_num character varying(255) COLLATE pg_catalog."default" NOT NULL,
    //       invoice_line character varying(255) COLLATE pg_catalog."default" NOT NULL,
    //       othp_amount numeric NOT NULL,
    //       ${sql`createFragment(sql, uniqueOthpGlsArray)`}
    //       CONSTRAINT ${sql(constraint)} PRIMARY KEY (invoice_num, invoice_line)
    //   )
    // ` //prettier-ignore

    const response = await sql
    `
      CREATE TABLE IF NOT EXISTS ${sql(tmpTableName)} (${sql(columns)})
    ` //prettier-ignore

    return tmpTableName
  } catch (error) {
    console.error(error)
    console.log(error.query)
    return error
  }
}

module.exports = createTempTable

const createFragment = (sql, uniqueOthpGlsArray) => {
  let fragment = ''

  for (gl of uniqueOthpGlsArray) {
    fragment = fragment + ' ' + sql`${sql(gl.display_name)} numeric NOT NULL,`
  }

  return fragment
}
