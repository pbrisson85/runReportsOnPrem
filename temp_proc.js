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

const runProc = async () => {
  const wocl = await getWocl()

  console.log('wocl', wocl)
}

runProc()
