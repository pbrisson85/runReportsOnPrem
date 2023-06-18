const { createConnection } = require('../../../../database/seasoftODBC')

const getGlPeriodActivity = async fy => {
  try {
    const odbcConn = await createConnection()

    console.log(`query ODBC for General Table OTHP ...`)

    const queryString = "SELECT {fn RTRIM(\"GL Period Activity\".ACCOUNT_NUMBER)} AS ACCOUNT_NUMBER, {fn RTRIM(\"GL Period Activity\".DEPARTMENT_CODE)} AS DEPARTMENT_CODE, \"GL Period Activity\".NET_AMOUNTS_1 AS 1, \"GL Period Activity\".NET_AMOUNTS_2 AS 2, \"GL Period Activity\".NET_AMOUNTS_3 AS 3, \"GL Period Activity\".NET_AMOUNTS_4 AS 4, \"GL Period Activity\".NET_AMOUNTS_5 AS 5, \"GL Period Activity\".NET_AMOUNTS_6 AS 6, \"GL Period Activity\".NET_AMOUNTS_7 AS 7, \"GL Period Activity\".NET_AMOUNTS_8 AS 8, \"GL Period Activity\".NET_AMOUNTS_9 AS 9, \"GL Period Activity\".NET_AMOUNTS_10 AS 10, \"GL Period Activity\".NET_AMOUNTS_11 AS 11, \"GL Period Activity\".NET_AMOUNTS_12 AS 12 FROM 'GL Period Activity' WHERE \"GL Period Activity\".COMPANY_NUMBER = ? AND \"GL Period Activity\".FISCAL_YEAR = ?" //prettier-ignore

    const data = await odbcConn.query(queryString, ['0001', fy])

    await odbcConn.close()

    return data
  } catch (error) {
    console.error(error)
  }
}

module.exports = getGlPeriodActivity
