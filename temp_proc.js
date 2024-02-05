// pull general table/ WOCL

// write gen table to pg

const { createConnection } = require('../../../../database/seasoftODBC')

const getWocl = async () => {
  try {
    const odbcConn = await createConnection()

    console.log(`query ODBC for General Table OTHP ...`)

    const queryString = `
        SELECT 
            "General Table File".*
            
            FROM 'General Table File' 
            
           ` //prettier-ignore

    const data = await odbcConn.query(queryString)

    await odbcConn.close()

    return data
  } catch (error) {
    console.error(error)
  }
}

const wocl = getWocl()

console.log('wocl', wocl)
