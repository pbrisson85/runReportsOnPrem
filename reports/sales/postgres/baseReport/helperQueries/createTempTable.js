const sql = require('../../../../server')

const createTempTable = async (config, uniqueOthpGlsArray) => {
  try {
    console.log(`${config.user} - createTempTable ...`)

    const tag = Date.now()
    const tmpTableName = '"salesReporting".sales_contra_lines_temp_' + tag

    let createString = ''

    for (gl of uniqueOthpGlsArray) {
      if (createString === '') {
        createString = `${gl} numeric NOT NULL,`
      } else {
        createString = `${createString}, ${gl} numeric NOT NULL,`
      }
    }

    const response = await sql
    `
        CREATE TABLE IF NOT EXISTS ${sql(tmpTableName)} AS tmp
        (
            invoice_num character varying(255) COLLATE pg_catalog."default" NOT NULL,
            invoice_line character varying(255) COLLATE pg_catalog."default" NOT NULL,
            othp_amount numeric NOT NULL,
            ${sql`${createString}`}
            CONSTRAINT ${sql(tmpTableName)}_pkey PRIMARY KEY (invoice_num, invoice_line)
        )
        
        TABLESPACE pg_default;
        
        ALTER TABLE IF EXISTS ${sql(tmpTableName)}
            OWNER to postgres;
        
        COMMENT ON TABLE ${sql(tmpTableName)}
            IS 'temporary table to build sales queries with othp by category';
    ` //prettier-ignore

    return tmpTableName
  } catch (error) {
    console.error(error)
    console.log(error.query)
    return error
  }
}

module.exports = createTempTable
