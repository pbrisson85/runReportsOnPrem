// pull general table/ WOCL

// write gen table to pg

const { createConnection } = require('./database/seasoftODBC')

const getWocl = async () => {
  try {
    const odbcConn = await createConnection()

    console.log(`query ODBC for General Table OTHP ...`)

    const queryString = `
        SELECT 
            "General Table File".TABLE_ID, "General Table File".TABLE_CODE, "General Table File".TABLE_DESC
            
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
