// pull general table/ WOCL

// write gen table to pg

const { createConnection } = require('./database/seasoftODBC')

const getWocl = async () => {
  try {
    const odbcConn = await createConnection()

    console.log(`query ODBC for General Table OTHP ...`)

    const queryString = `
        SELECT 
            {fn RTRIM("General Table File".TABLE_CODE)} AS wocl, 
            {fn RTRIM("General Table File".TABLE_DESC)} AS description
            
            FROM 'General Table File' 

            WHERE "General Table File".TABLE_ID = 'WOCL'
            
           ` //prettier-ignore

    const data = await odbcConn.query(queryString)

    await odbcConn.close()

    return data
  } catch (error) {
    console.error(error)
  }
}

const sql = require('./server')
const updatePgWocl = async wocl => {
  try {
    for (code of wocl) {
      const woclCode = code.wocl
      const woclDesc = code.description

      console.log('woclCode', woclCode)
      console.log('woclDesc', woclDesc)

      console.log(`query postgres for updatePgWocl ...`)

      const data = await sql`
                      INSERT INTO "temporary".wocl (code, desc)
                      VALUES (${woclCode}, ${woclDesc})`
    }

    return
  } catch (error) {
    console.error(error)

    console.log('query', error.query)

    console.log('message', error.message)
  }
}

const runProc = async () => {
  const wocl = await getWocl()
  await updatePgWocl(wocl)

  console.log('complete runProc ...')
}

runProc()
